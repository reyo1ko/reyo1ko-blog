"use client";
import ToolHeader from "@/app/components/useful_tool/ToolHeader";
import CopyButton from "../../components/CopyButton";
import { useMemo, useState } from "react";

/** 改行種別 */
type NewlineKind = "LF" | "CRLF" | "CR" | "MIXED" | "NONE";

function detectNewlines(text: string): {
  kind: NewlineKind;
  counts: { crlf: number; lf: number; cr: number };
} {
  // まず CRLF を数える（重複カウント防止のため）
  const crlf = (text.match(/\r\n/g) ?? []).length;

  // CRLF を除外した上で LF / CR を数える
  const withoutCrlf = text.replace(/\r\n/g, "");
  const lf = (withoutCrlf.match(/\n/g) ?? []).length;
  const cr = (withoutCrlf.match(/\r/g) ?? []).length;

  const kindsUsed = [crlf > 0, lf > 0, cr > 0].filter(Boolean).length;

  let kind: NewlineKind = "NONE";
  if (kindsUsed === 0) kind = "NONE";
  else if (kindsUsed > 1) kind = "MIXED";
  else if (crlf > 0) kind = "CRLF";
  else if (lf > 0) kind = "LF";
  else if (cr > 0) kind = "CR";

  return { kind, counts: { crlf, lf, cr } };
}

function normalizeNewlines(text: string): string {
  // いったん全部 LF に寄せる
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

function convertNewlines(
  text: string,
  to: Exclude<NewlineKind, "MIXED" | "NONE">,
): string {
  const lfText = normalizeNewlines(text);
  if (to === "LF") return lfText;
  if (to === "CRLF") return lfText.replace(/\n/g, "\r\n");
  // to === "CR"
  return lfText.replace(/\n/g, "\r");
}

function badgeColor(kind: NewlineKind) {
  switch (kind) {
    case "LF":
      return "bg-green-100 text-green-800";
    case "CRLF":
      return "bg-blue-100 text-blue-800";
    case "CR":
      return "bg-yellow-100 text-yellow-800";
    case "MIXED":
      return "bg-red-100 text-red-800";
    case "NONE":
    default:
      return "bg-soft text-ink";
  }
}

function kindLabel(kind: NewlineKind) {
  switch (kind) {
    case "LF":
      return "LF（Linux/macOS）";
    case "CRLF":
      return "CRLF（Windows）";
    case "CR":
      return "CR（旧Macなど）";
    case "MIXED":
      return "混在（MIXED）";
    case "NONE":
      return "改行なし（NONE）";
  }
}

function calcLineCount(text: string) {
  if (!text) return 0;
  // LF基準で行数を推定（末尾改行があってもOK）
  const lf = normalizeNewlines(text);
  return lf.split("\n").length;
}

export default function NewlineToolPage() {
  const [input, setInput] = useState("");
  const [target, setTarget] = useState<Exclude<NewlineKind, "MIXED" | "NONE">>("LF");
  const [output, setOutput] = useState("");

  const info = useMemo(() => detectNewlines(input), [input]);

  const outputInfo = useMemo(() => detectNewlines(output), [output]);

  const lineCount = useMemo(() => calcLineCount(input), [input]);

  const handleConvert = () => {
    setOutput(convertNewlines(input, target));
  };
  const downloadAsTxt = () => {
    if (!output) return;

    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.txt";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSwap = () => {
    setInput(output);
    setOutput("");
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (
      file.type &&
      !file.type.startsWith("text/") &&
      file.type !== "application/json" &&
      file.type !== "application/xml"
    ) {
      alert("テキストファイルを選択してください。");
      e.target.value = "";
      return;
    }

    const text = await file.text();
    setInput(text);
    setOutput("");
    e.target.value = "";
  };

  return (
    <div className="min-h-0 bg-surface">
      <div className="tool-page-inner">
        <ToolHeader
          title="改行コード変換ツール"
          description="テキストの改行コードを、LF・CRLF・CRのいずれかに変換します。"
          stepsVariant="ordered"
          className="mb-12"
          steps={
            <>
              <li>テキストを入力欄に貼り付けるか、ファイルから読み込みます。</li>
              <li>現在の改行コード種別と行数が表示されます。</li>
              <li>変換先の改行コードを選択し、「変換」ボタンを押します。</li>
              <li>
                変換結果が出力欄に表示されるので、必要に応じてコピー・ダウンロードします。
              </li>
            </>
          }
        />

        {/* 入力セクション */}
        <section className="mb-12 bg-surface rounded-md p-6 border border-line">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-ink">入力</h2>
            <span
              className={`rounded-md px-3 py-1 text-xs font-semibold ${badgeColor(
                info.kind,
              )}`}
            >
              {kindLabel(info.kind)}
            </span>
          </div>

          <div className="mb-4 flex items-center gap-4">
            <label className="block w-full min-w-0 text-sm text-muted">
              ファイルから読み込み（テキスト）
              <input
                aria-label="読み込むテキストファイル"
                type="file"
                accept=".txt,.md,.csv,.json,.log,.xml,.yml,.yaml,text/*,application/json,application/xml"
                onChange={onFileChange}
                className="mt-2 block w-full min-w-0 text-sm bg-transparent text-ink"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-surface p-4 rounded-md border border-line hover:bg-soft">
              <div className="text-sm text-muted">行数（推定）</div>
              <div className="text-lg font-mono text-ink">
                {lineCount.toLocaleString()}
              </div>
            </div>
            <div className="bg-surface p-4 rounded-md border border-line hover:bg-soft">
              <div className="text-sm text-muted">CRLF</div>
              <div className="text-lg font-mono text-ink">
                {info.counts.crlf.toLocaleString()}
              </div>
            </div>
            <div className="bg-surface p-4 rounded-md border border-line hover:bg-soft">
              <div className="text-sm text-muted">LF / CR</div>
              <div className="text-lg font-mono text-ink">
                {info.counts.lf.toLocaleString()} / {info.counts.cr.toLocaleString()}
              </div>
            </div>
          </div>

          <textarea
            aria-label="入力テキスト"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="ここにテキストを貼り付けてください"
            className="w-full h-64 p-4 bg-surface border border-line rounded-md font-mono text-sm leading-relaxed text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </section>

        {/* 変換セクション */}
        <section className="mb-12 bg-surface rounded-md p-6 border border-line">
          <h2 className="text-2xl font-semibold text-ink mb-4">変換</h2>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">変換先</label>
              <select
                aria-label="改行コードの変換先"
                value={target}
                onChange={(e) => setTarget(e.target.value as any)}
                className="w-full md:w-64 p-2 bg-surface border border-line rounded-md text-ink focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="LF">LF（Linux/macOS）</option>
                <option value="CRLF">CRLF（Windows）</option>
                <option value="CR">CR（旧Macなど）</option>
              </select>
              <p className="text-xs text-muted mt-1">
                ※ 混在している場合も、選んだ形式に統一して出力します。
              </p>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleConvert}
                className="px-4 py-2 bg-strong text-on-strong rounded-md hover:bg-strong focus:outline-none focus:ring-2 focus:ring-accent"
              >
                変換
              </button>
              <button
                type="button"
                onClick={() => {
                  setInput("");
                  setOutput("");
                }}
                className="px-4 py-2 border border-line bg-surface text-ink rounded-md hover:bg-soft focus:outline-none focus:ring-2 focus:ring-accent"
              >
                クリア
              </button>
            </div>
          </div>
        </section>

        {/* 出力セクション */}
        <section className="bg-surface rounded-md p-6 border border-line">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-semibold text-ink">出力</h2>
              <span
                className={`rounded-md px-3 py-1 text-xs font-semibold ${badgeColor(
                  outputInfo.kind,
                )}`}
              >
                {kindLabel(outputInfo.kind)}
              </span>
            </div>

            <div className="flex gap-2">
              <CopyButton text={output} />
              <button
                type="button"
                onClick={downloadAsTxt}
                disabled={!output}
                className="px-3 py-1 border border-line bg-surface text-ink rounded-md hover:bg-soft focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 text-sm"
              >
                .txt ダウンロード
              </button>
              <button
                type="button"
                onClick={handleSwap}
                className="px-3 py-1 border border-line bg-surface text-ink rounded-md hover:bg-soft focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 text-sm"
                disabled={!output}
                title="出力を入力に戻す"
              >
                出力を入力へ
              </button>
            </div>
          </div>

          <textarea
            aria-label="変換結果"
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            placeholder="変換結果がここに表示されます"
            className="w-full h-64 p-4 bg-surface border border-line rounded-md font-mono text-sm leading-relaxed text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
          />

          <p className="mt-4 text-sm text-muted">
            ※ 出力欄も編集できます（追加修正してからコピーする用途）。
          </p>
        </section>
      </div>
    </div>
  );
}
