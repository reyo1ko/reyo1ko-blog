const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const sharp = require("sharp");
const JSZip = require("jszip");

const root = path.resolve(__dirname, "..");
const resolve = (...parts) => path.join(root, ...parts);
const outputDirectory = resolve("public/materials/pixel-hardware");
const moduleData = { exports: {} };
const source = fs.readFileSync(resolve("app/materials/materials.ts"), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;
new Function("exports", "module", compiled)(moduleData.exports, moduleData);
const { MATERIALS, PALETTE, TEMPLATE_PROMPT, INFRASTRUCTURE_IDS } = moduleData.exports;
const sourceManifest = JSON.parse(
  fs.readFileSync(resolve("assets/materials/sources.json"), "utf8"),
);
const palette = PALETTE.map(({ hex }) =>
  [1, 3, 5].map((index) => parseInt(hex.slice(index, index + 2), 16)),
);
const exportNote =
  "【書き出し工程】\n元画像から縦横比を保って直接縮小し、四辺に余白を確保。固定5色の透過PNGとして512px・1024pxを書き出します。64pxへの中間縮小や画像全体の引き伸ばしは行いません。\n同じプロンプトでも生成結果は毎回異なります。";

function bounds(data, width, height) {
  let left = width,
    top = height,
    right = -1,
    bottom = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] < 32) continue;
      left = Math.min(left, x);
      top = Math.min(top, y);
      right = Math.max(right, x);
      bottom = Math.max(bottom, y);
    }
  }
  if (right < left) throw new Error("The source image is empty");
  return { left, top, width: right - left + 1, height: bottom - top + 1 };
}

function nearestColor(data, offset) {
  // Keep the accent on genuinely green details, rather than tinting gray panels green.
  const green =
    data[offset + 1] - data[offset] >= 20 && data[offset + 1] - data[offset + 2] >= 30;
  const candidates = green ? [palette[4]] : palette.slice(0, 4);
  return candidates.reduce(
    (best, color) => {
      const distance = color.reduce(
        (sum, component, channel) => sum + (component - data[offset + channel]) ** 2,
        0,
      );
      return distance < best.distance ? { color, distance } : best;
    },
    { color: palette[0], distance: Infinity },
  ).color;
}

async function exportPng(input, crop, size, filename) {
  const margin = size / 16;
  const image = await sharp(input)
    .extract(crop)
    .resize({
      width: size - margin * 2,
      height: size - margin * 2,
      fit: "inside",
      kernel: "nearest",
    })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const result = Buffer.alloc(size * size * 4);
  const left = Math.floor((size - image.info.width) / 2);
  const top = Math.floor((size - image.info.height) / 2);
  for (let y = 0; y < image.info.height; y++) {
    for (let x = 0; x < image.info.width; x++) {
      const offset = (y * image.info.width + x) * 4;
      if (image.data[offset + 3] < 32) continue;
      const target = ((y + top) * size + x + left) * 4;
      const color = nearestColor(image.data, offset);
      result[target] = color[0];
      result[target + 1] = color[1];
      result[target + 2] = color[2];
      result[target + 3] = 255;
    }
  }
  // Close only isolated one-pixel alpha cracks; preserve intentional openings and ports.
  const repaired = Buffer.from(result);
  for (let y = 1; y < size - 1; y++) {
    for (let x = 1; x < size - 1; x++) {
      const target = (y * size + x) * 4;
      if (result[target + 3]) continue;
      const horizontal = result[target - 1] && result[target + 7];
      const vertical = result[target - size * 4 + 3] && result[target + size * 4 + 3];
      if (horizontal || vertical) {
        const neighbor = horizontal ? target - 4 : target - size * 4;
        result.copy(repaired, target, neighbor, neighbor + 4);
      }
    }
  }
  await sharp(repaired, { raw: { width: size, height: size, channels: 4 } })
    .png({ palette: true, compressionLevel: 9 })
    .toFile(filename);
}

async function main() {
  fs.mkdirSync(outputDirectory, { recursive: true });
  for (const material of MATERIALS) {
    const entry = sourceManifest.find((item) => item.id === material.id);
    if (!entry) throw new Error("Missing source image: " + material.id);
    const input = resolve(entry.source);
    const original = await sharp(input)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const crop = bounds(original.data, original.info.width, original.info.height);
    await exportPng(input, crop, 512, path.join(outputDirectory, material.id + ".png"));
    await exportPng(
      input,
      crop,
      1024,
      path.join(outputDirectory, material.id + "-1024.png"),
    );
    const references = material.references?.length
      ? "\n\n【形状の参考資料】\n" +
        material.references.map((ref) => ref.title + "\n" + ref.url).join("\n")
      : "";
    fs.writeFileSync(
      path.join(outputDirectory, material.id + "-prompt.txt"),
      material.prompt + "\n\n" + exportNote + references + "\n",
    );
    console.log("Exported " + material.id + " (512px / 1024px)");
  }
  fs.writeFileSync(
    path.join(outputDirectory, "template-prompt.txt"),
    TEMPLATE_PROMPT + "\n",
  );
  const zip = new JSZip();
  for (const id of INFRASTRUCTURE_IDS) {
    zip.file(
      "512/" + id + ".png",
      fs.readFileSync(path.join(outputDirectory, id + ".png")),
    );
    zip.file(
      "1024/" + id + ".png",
      fs.readFileSync(path.join(outputDirectory, id + "-1024.png")),
    );
    zip.file(
      "prompts/" + id + ".txt",
      fs.readFileSync(path.join(outputDirectory, id + "-prompt.txt")),
    );
  }
  zip.file(
    "README.txt",
    "ベンダーに依存しない、単体のインフラ素材セット\n512px・1024pxの透過PNGと再現用プロンプトを収録。\n複数台構成、クラスター、接続線は利用者が作図してください。\n\n" +
      exportNote +
      "\n",
  );
  fs.writeFileSync(
    path.join(outputDirectory, "infrastructure-pack.zip"),
    await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }),
  );
  console.log(
    "Exported infrastructure ZIP (" + INFRASTRUCTURE_IDS.length + " materials)",
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
