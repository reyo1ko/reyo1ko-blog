import Link from "next/link";

type Props = {
  id: string;
  title: string;
  category?: { name: string } | null;
  tags?: { id?: string; name: string }[];
};

export default function BlogRow({ id, title, category, tags = [] }: Props) {
  return (
    <Link
      href={`/blogs/${id}`}
      className="
        group flex items-center gap-3 px-3 sm:px-4 py-2.5
        hover:bg-soft transition
      "
    >
      {/* 左：タイトル */}
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-ink">{title}</div>
        <div className="mt-0.5 flex items-center gap-2 text-[12px] text-muted">
          <span className="truncate">{category?.name ?? "未分類"}</span>
          {tags.length > 0 && <span className="text-muted">•</span>}
          {tags.length > 0 && (
            <span className="truncate">{tags.map((t) => t.name).join(" / ")}</span>
          )}
        </div>
      </div>

      {/* 右：矢印（控えめ） */}
      <div className="shrink-0 text-muted group-hover:text-muted transition">→</div>
    </Link>
  );
}
