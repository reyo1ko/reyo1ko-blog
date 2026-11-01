"use client";

import { useState } from "react";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (err) {
      console.error("コピーに失敗しました:", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="
        rounded-md px-2 py-1
        text-[10px] font-medium
        text-ink
        border border-line
        bg-surface
        hover:bg-soft hover:border-line
        active:scale-[0.97]
        transition-colors
        select-none
      "
    >
      {copied ? "コピー済み" : "コピー"}
    </button>
  );
}
