// app/useful_tools/diffTool/_components/TextAreaWithStats.tsx
"use client";

import type { TextStats } from "./diffUtils";

type Props = {
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  statsLabel: string;
  stats: TextStats;
};

function StatRow({ k, v }: { k: string; v: number }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 px-3 py-2 rounded-md border border-line bg-surface hover:bg-soft transition-colors">
      <div className="text-xs text-muted">{k}</div>
      <div className="text-sm text-ink tabular-nums">{v}</div>
    </div>
  );
}

export default function TextAreaWithStats({
  label,
  placeholder,
  value,
  onChange,
  statsLabel,
  stats,
}: Props) {
  return (
    <div className="rounded-md border border-line bg-surface overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-line">
        <div className="text-sm font-semibold text-ink">{label}</div>
        <div className="text-xs text-muted">{statsLabel}</div>
      </div>

      <div className="p-4">
        <textarea
          aria-label={label}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={[
            "w-full min-h-[220px] rounded-md",
            "border border-line bg-surface",
            "px-3 py-2 text-sm font-mono text-ink",
            "placeholder:text-muted",
            "focus:outline-none focus:ring-2 focus:ring-line focus:border-line",
          ].join(" ")}
        />
      </div>

      <div className="p-4 pt-0 space-y-2">
        <div className="text-xs text-muted px-1">統計</div>
        <StatRow k="文字数（空白・改行除く）" v={stats.charCount} />
        <StatRow k="空白数" v={stats.spaceCount} />
        <StatRow k="改行数" v={stats.newlineCount} />
        <StatRow k="文字数（空白込み・改行除く）" v={stats.charCountWithSpaces} />
      </div>
    </div>
  );
}
