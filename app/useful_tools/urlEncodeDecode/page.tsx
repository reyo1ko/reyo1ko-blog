"use client";

import ToolHeader from "@/app/components/useful_tool/ToolHeader";
import { useMemo, useState } from "react";

type KV = { key: string; value: string };

const safeDecode = (s: string) => {
  try {
    // + を空白扱いしたいケースがあるので補正
    return decodeURIComponent(s.replace(/\+/g, "%20"));
  } catch {
    return s;
  }
};

const parseUrlLike = (input: string) => {
  // 絶対URL/相対URLどちらでも扱えるようにする
  try {
    return new URL(input);
  } catch {
    return new URL(input, "https://dummy.local");
  }
};

export default function Page() {
  const [raw, setRaw] = useState("");
  const [encodedBaseUrl, setEncodedBaseUrl] = useState("");
  const [decodedBaseUrl, setDecodedBaseUrl] = useState("");
  const [pairs, setPairs] = useState<KV[]>([]);
  const [hash, setHash] = useState("");
  const [isDecodedMode, setIsDecodedMode] = useState(false);

  const detect = () => {
    const text = raw.trim();
    if (!text) {
      setEncodedBaseUrl("");
      setDecodedBaseUrl("");
      setPairs([]);
      setHash("");
      return;
    }

    const u = parseUrlLike(text);

    // hash
    setHash(u.hash || "");

    // エンコードされたbaseURL
    const encodedBase = (u.origin === "https://dummy.local" ? "" : u.origin) + u.pathname;
    setEncodedBaseUrl(encodedBase);

    // デコードされたbaseURL
    const decodedBase = `${u.protocol}//${u.hostname}${decodeURI(u.pathname)}`;
    setDecodedBaseUrl(decodedBase);

    // query -> 配列に展開（URLSearchParamsはデコード済みを返す）
    const next: KV[] = [];
    u.searchParams.forEach((v, k) => next.push({ key: k, value: v }));
    setPairs(next);
  };

  const encodedUrl = useMemo(() => {
    const sp = new URLSearchParams();
    for (const p of pairs) {
      const k = p.key.trim();
      if (!k) continue;
      sp.set(k, p.value); // URLSearchParamsがエンコード
    }
    const qs = sp.toString();
    return `${encodedBaseUrl}${qs ? `?${qs}` : ""}${hash || ""}`;
  }, [encodedBaseUrl, pairs, hash]);

  const decodedPreview = useMemo(() => {
    // 見た目用のデコード寄り表示（実URLは encodedUrl）
    const sp = new URLSearchParams();
    for (const p of pairs) {
      const k = p.key.trim();
      if (!k) continue;
      sp.set(safeDecode(k), safeDecode(p.value));
    }
    const qs = sp.toString();
    return `${decodedBaseUrl}${qs ? `?${safeDecode(qs)}` : ""}${hash || ""}`;
  }, [decodedBaseUrl, pairs, hash]);

  const updatePair = (idx: number, patch: Partial<KV>) => {
    setPairs((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  };

  const addPair = () => setPairs((prev) => [...prev, { key: "", value: "" }]);
  const removePair = (idx: number) =>
    setPairs((prev) => prev.filter((_, i) => i !== idx));

  const clearAll = () => {
    setRaw("");
    setEncodedBaseUrl("");
    setDecodedBaseUrl("");
    setPairs([]);
    setHash("");
  };

  return (
    <div className="min-h-0 bg-surface">
      <div className="tool-page-inner">
        <ToolHeader
          title="URLエンコード・デコードツール"
          description="URLのクエリ（パラメータ）を検出して、編集・追加・削除し、エンコード済みURLを生成します。"
          stepsVariant="ordered"
          className="mb-12"
          steps={
            <>
              <li>URL全体を入力欄に貼り付け、「クエリ検出」ボタンを押します。</li>
              <li>クエリ一覧が表示されるので、編集・追加・削除が可能です。</li>
              <li>
                「生成URL」欄にエンコード済みのURLが表示されます。必要に応じてコピーして利用してください。
              </li>
            </>
          }
        />

        {/* 入力セクション */}
        <section className="mb-12 bg-surface rounded-md p-6 border border-line">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="text-2xl font-semibold text-ink">入力</h2>
            <button
              onClick={clearAll}
              className="px-3 py-1.5 rounded-md border border-line bg-surface text-ink hover:bg-soft focus:outline-none focus:ring-2 focus:ring-accent"
            >
              クリア
            </button>
          </div>

          <label className="block text-sm font-semibold text-ink mb-1">
            URLを貼り付け
          </label>
          <textarea
            aria-label="変換するURL"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={3}
            className="w-full bg-surface border border-line rounded-md px-3 py-2 font-mono text-sm text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
            placeholder="https://example.com/path?name=%E9%88%B4%E6%9C%A8&msg=hello%20world"
          />

          <div className="mt-3 flex gap-2">
            <button
              onClick={detect}
              className="px-3 py-1.5 rounded-md bg-strong text-on-strong hover:bg-strong focus:outline-none focus:ring-2 focus:ring-accent"
            >
              クエリ検出
            </button>
          </div>

          <div className="mt-6 border-t border-line pt-4 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-ink mb-1">
                エンコードされたbaseURL
              </label>
              <input
                aria-label="エンコードされたベースURL"
                value={encodedBaseUrl}
                onChange={(e) => {
                  setEncodedBaseUrl(e.target.value);
                  try {
                    const u = new URL(e.target.value);
                    const decoded = `${u.protocol}//${u.hostname}${decodeURI(u.pathname)}`;
                    setDecodedBaseUrl(decoded);
                  } catch {
                    setDecodedBaseUrl(e.target.value);
                  }
                }}
                className="w-full bg-surface border border-line rounded-md px-3 py-2 font-mono text-sm text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="http://xn--bdk1d3b.net/%E3%81%AC%E3%82%8B%E3%81%BD.html"
              />
              <p className="text-xs text-muted mt-1">
                エンコードされたURLを入力してください。自動でデコードされたバージョンが下に表示されます。
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-1">
                デコードされたbaseURL
              </label>
              <input
                aria-label="デコードされたベースURL"
                value={decodedBaseUrl}
                onChange={(e) => {
                  setDecodedBaseUrl(e.target.value);
                  try {
                    const u = new URL(e.target.value);
                    setEncodedBaseUrl(
                      u.href.replace("?" + u.search, "").replace(u.hash, ""),
                    );
                  } catch {
                    setEncodedBaseUrl(e.target.value);
                  }
                }}
                className="w-full bg-surface border border-line rounded-md px-3 py-2 font-mono text-sm text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="http://ツール.net/ぬるぽ.html"
              />
              <p className="text-xs text-muted mt-1">
                デコードされたURLを入力してください。自動でエンコードされたバージョンが上に表示されます。
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-1">
                hash（任意）
              </label>
              <input
                aria-label="URLのハッシュ"
                value={hash}
                onChange={(e) => setHash(e.target.value)}
                className="w-full bg-surface border border-line rounded-md px-3 py-2 font-mono text-sm text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="#section"
              />
            </div>

            <div className="border-t border-line pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-ink">
                  クエリ一覧（編集可）
                </span>
                <button
                  onClick={addPair}
                  className="px-3 py-1.5 rounded-md border border-line bg-surface text-ink hover:bg-soft focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  + 追加
                </button>
              </div>

              <div className="space-y-2">
                {pairs.length === 0 && (
                  <p className="text-sm text-muted">クエリがありません。</p>
                )}

                {pairs.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex gap-2 bg-surface rounded-md p-2 hover:bg-soft"
                  >
                    <input
                      aria-label="クエリパラメーターのキー"
                      value={p.key}
                      onChange={(e) => updatePair(idx, { key: e.target.value })}
                      className="w-1/3 bg-surface border border-line rounded-md px-2 py-1 font-mono text-sm text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="key"
                    />
                    <input
                      aria-label="クエリパラメーターの値"
                      value={p.value}
                      onChange={(e) => updatePair(idx, { value: e.target.value })}
                      className="flex-1 bg-surface border border-line rounded-md px-2 py-1 font-mono text-sm text-ink placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent"
                      placeholder="value (decoded)"
                    />
                    <button
                      onClick={() => removePair(idx)}
                      className="px-2 py-1 rounded-md border border-line bg-surface text-ink hover:bg-soft focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      削除
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-line pt-4">
              <label className="block text-sm font-semibold text-ink mb-1">
                生成URL（エンコード済み）
              </label>
              <textarea
                aria-label="生成URL（エンコード済み）"
                value={encodedUrl}
                readOnly
                rows={3}
                className="w-full bg-surface border border-line rounded-md px-3 py-2 font-mono text-sm text-ink"
              />

              <label className="block text-sm font-semibold text-ink mb-1 mt-4">
                表示用プレビュー（デコード寄り）
              </label>
              <textarea
                aria-label="デコードしたURLのプレビュー"
                value={decodedPreview}
                readOnly
                rows={3}
                className="w-full bg-surface border border-line rounded-md px-3 py-2 font-mono text-sm text-ink"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
