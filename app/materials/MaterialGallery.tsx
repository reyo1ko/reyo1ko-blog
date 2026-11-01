"use client";
import { useEffect, useRef, useState } from "react";
import PixelIcon from "../components/PixelIcon";
import { MATERIALS, PALETTE, TEMPLATE_PROMPT, INFRASTRUCTURE_IDS } from "./materials";
function PromptCopy({
  text,
  label = "プロンプトをコピー",
}: {
  text: string;
  label?: string;
}) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <div className="material-copy">
      <button
        className="button-secondary"
        type="button"
        onClick={async () => {
          clearTimeout(timer.current);
          try {
            await navigator.clipboard.writeText(text);
            setStatus("copied");
            timer.current = setTimeout(() => setStatus("idle"), 2000);
          } catch {
            setStatus("error");
          }
        }}
      >
        {status === "copied" ? "コピーしました" : label}
      </button>
      <span role="status">
        {status === "error"
          ? "コピーできませんでした。テキストを選択してコピーするか、TXTを保存してください。"
          : status === "copied"
            ? "クリップボードにコピーしました。"
            : ""}
      </span>
    </div>
  );
}
export default function MaterialGallery() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [background, setBackground] = useState<"checker" | "light" | "dark">("checker");
  const visible = MATERIALS.filter(
    (m) =>
      (!category || m.category === category) &&
      (m.name + " " + m.description + " " + m.category)
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase()),
  );
  return (
    <div className="materials-library">
      <section className="material-specification" aria-label="素材の共通仕様">
        <div>
          <span className="eyebrow">ONE SMALL, SHARED PALETTE</span>
          <h2>サイズも、色も、ひと揃い。</h2>
          <p>512 / 1024px · 透過PNG · 共通5色</p>
        </div>
        <ul className="material-palette" aria-label="共通カラーパレット">
          {PALETTE.map((color) => (
            <li key={color.hex}>
              <span className="material-swatch" style={{ backgroundColor: color.hex }} />
              <span>
                {color.name}
                <code>{color.hex}</code>
              </span>
            </li>
          ))}
        </ul>
      </section>
      <div className="material-pack">
        <div>
          <span className="eyebrow">INFRASTRUCTURE PACK</span>
          <h2>構成図に使える、単体のインフラ素材{INFRASTRUCTURE_IDS.length}点。</h2>
          <p>
            仮想マシン・物理OS・ネットワーク・ストレージ。512pxと1024pxのPNG、プロンプトTXTをセットに。
          </p>
        </div>
        <a
          className="button-secondary"
          href="/materials/pixel-hardware/infrastructure-pack.zip"
          download="infrastructure-pixel-materials.zip"
        >
          {INFRASTRUCTURE_IDS.length}点セットを保存（ZIP）
          <span aria-hidden="true">↓</span>
        </a>
      </div>
      <details className="material-template">
        <summary>
          <span>
            <PixelIcon name="article" />
            共通テンプレートのプロンプト
          </span>
          <span className="material-disclosure-hint">
            開いて確認 <span aria-hidden="true">＋</span>
          </span>
        </summary>
        <div className="material-template-body">
          <p>対象名と特徴を差し替えて、同じテイストの素材をつくれます。</p>
          <pre tabIndex={0}>{TEMPLATE_PROMPT}</pre>
          <div className="material-prompt-actions">
            <PromptCopy text={TEMPLATE_PROMPT} />
            <a
              className="material-text-link"
              href="/materials/pixel-hardware/template-prompt.txt"
              download
            >
              TXTを保存
            </a>
          </div>
        </div>
      </details>
      <div className="material-toolbar">
        <label className="search-field">
          <PixelIcon name="search" />
          <input
            type="search"
            aria-label="画像素材を検索"
            placeholder="素材名・用途から探す"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <fieldset className="material-preview-options">
          <legend>プレビュー背景</legend>
          {(
            [
              ["checker", "透過確認"],
              ["light", "白"],
              ["dark", "黒"],
            ] as const
          ).map(([value, label]) => (
            <button
              type="button"
              key={value}
              aria-pressed={background === value}
              onClick={() => setBackground(value)}
            >
              {label}
            </button>
          ))}
        </fieldset>
      </div>
      <div className="catalog-filters" aria-label="素材のカテゴリ">
        {["", ...Array.from(new Set(MATERIALS.map((m) => m.category)))].map((value) => (
          <button
            type="button"
            key={value}
            aria-pressed={category === value}
            className={category === value ? "is-active" : ""}
            onClick={() => setCategory(value)}
          >
            {value || "すべて"}
          </button>
        ))}
      </div>
      <p className="material-result-count" role="status">
        {visible.length} 点の素材
      </p>
      <div className="material-list">
        {visible.map((material, index) => (
          <article className="material-card" key={material.id}>
            <div className={"material-preview material-preview--" + background}>
              <span className="material-preview-number" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={material.src}
                alt={material.alt}
                width={material.width}
                height={material.height}
                loading="lazy"
              />
              <span className="material-preview-caption">
                SINGLE ASSET / TRANSPARENT PNG
              </span>
            </div>
            <div className="material-info">
              <span className="eyebrow">{material.category}</span>
              <h2>{material.name}</h2>
              <p className="material-description">{material.description}</p>
              <dl className="material-file-specs">
                <div>
                  <dt>サイズ</dt>
                  <dd>
                    {material.width} × {material.height}px
                  </dd>
                </div>
                <div>
                  <dt>形式</dt>
                  <dd>PNG / 背景透過</dd>
                </div>
              </dl>
              <div className="material-download-options">
                <a
                  className="button-primary material-download"
                  href={material.src}
                  download={material.id + "-512.png"}
                >
                  <PixelIcon name="image" />
                  PNGをダウンロード<span aria-hidden="true">↓</span>
                </a>
                <a
                  className="material-text-link"
                  href={material.highResSrc}
                  download={material.id + "-1024.png"}
                >
                  1024px PNGを保存
                </a>
              </div>
              <details className="material-prompt">
                <summary>
                  再現用プロンプト<span aria-hidden="true">＋</span>
                </summary>
                <div className="material-prompt-body">
                  <p>
                    この素材を同じテイストで作成するためのプロンプトです。同じプロンプトでも、生成結果は毎回異なります。
                  </p>
                  <pre tabIndex={0}>{material.prompt}</pre>
                  <div className="material-prompt-actions">
                    <PromptCopy text={material.prompt} />
                    <a
                      className="material-text-link"
                      href={"/materials/pixel-hardware/" + material.id + "-prompt.txt"}
                      download
                    >
                      TXTを保存
                    </a>
                  </div>
                  {material.references?.length ? (
                    <ul className="material-reference-links" aria-label="形状の参考資料">
                      {material.references.map((reference) => (
                        <li key={reference.url}>
                          <a href={reference.url} target="_blank" rel="noreferrer">
                            {reference.title} ↗
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <p className="material-export-note">
                    元画像の縦横比と輪郭を保ち、64pxへの中間縮小をせずに書き出しています。細部を大きく使うときは1024px版をご利用ください。
                  </p>
                </div>
              </details>
            </div>
          </article>
        ))}
      </div>
      {visible.length === 0 && (
        <div className="empty-state">
          <PixelIcon name="search" />
          <h2>素材が見つかりません</h2>
          <p>キーワードやカテゴリを変えて探してみてください。</p>
          <button
            type="button"
            className="button-secondary"
            onClick={() => {
              setQuery("");
              setCategory("");
            }}
          >
            条件をリセット
          </button>
        </div>
      )}
      <aside className="material-footer-note">
        <PixelIcon name="image" />
        <p>
          素材の色はライト／ダークモードを切り替えても変わりません。背景を切り替えると、使用する場所での見え方を確認できます。
        </p>
      </aside>
    </div>
  );
}
