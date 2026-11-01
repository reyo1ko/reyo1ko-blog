"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
type Item = { id?: string; name: string };
type Props = {
  basePath: string;
  categories: Item[];
  tags: Item[];
  selectedCategory: string;
  selectedTags: string[];
  mode: "or" | "and";
  categoryCounts: Record<string, number>;
  tagCounts: Record<string, number>;
  totalCount: number;
  filteredCount: number;
};
export default function CategoryTagFilterClient({
  basePath,
  categories,
  tags,
  selectedCategory,
  selectedTags,
  mode,
  categoryCounts,
  tagCounts,
  filteredCount,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [category, setCategory] = useState(selectedCategory);
  const [chosen, setChosen] = useState(selectedTags);
  const [match, setMatch] = useState(mode);
  useEffect(() => {
    setCategory(selectedCategory);
    setChosen(selectedTags);
    setMatch(mode);
  }, [selectedCategory, selectedTags, mode]);
  return (
    <form
      className="article-filters"
      onSubmit={(e) => {
        e.preventDefault();
        const q = new URLSearchParams();
        if (category) q.set("category", category);
        if (chosen.length) {
          q.set("tags", chosen.join(","));
          q.set("mode", match);
        }
        startTransition(() => router.push(basePath + (q.size ? "?" + q.toString() : "")));
      }}
    >
      <div className="filter-controls">
        {categories.length > 0 && (
          <label className="filter-select">
            <span>カテゴリ</span>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">すべてのカテゴリ</option>
              {categories.map((c) => (
                <option key={c.id ?? c.name} value={c.name}>
                  {c.name} ({categoryCounts[c.name] ?? 0})
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="filter-select">
          <span>タグの一致条件</span>
          <select
            value={match}
            onChange={(e) => setMatch(e.target.value as "or" | "and")}
          >
            <option value="or">いずれかを含む</option>
            <option value="and">すべてを含む</option>
          </select>
        </label>
        <button type="submit" className="button-primary" disabled={isPending}>
          {isPending ? "絞り込み中…" : "絞り込む"}
        </button>
        <Link
          className="filter-reset"
          href={basePath}
          onClick={() => {
            setCategory("");
            setChosen([]);
            setMatch("or");
          }}
        >
          リセット
        </Link>
        {categories.length > 0 && (
          <span className="filter-count">{filteredCount} 件</span>
        )}
      </div>
      {tags.length > 0 && (
        <details className="tag-options" open={chosen.length > 0 || undefined}>
          <summary>
            技術タグを選ぶ{" "}
            <span>{chosen.length ? chosen.length + "件選択中" : "複数選択できます"}</span>
          </summary>
          <div className="tag-checkboxes">
            {tags.map((tag) => (
              <label key={tag.id ?? tag.name}>
                <input
                  type="checkbox"
                  checked={chosen.includes(tag.name)}
                  onChange={() =>
                    setChosen((prev) =>
                      prev.includes(tag.name)
                        ? prev.filter((n) => n !== tag.name)
                        : [...prev, tag.name],
                    )
                  }
                />
                <span>{tag.name}</span>
                <small>{tagCounts[tag.name] ?? 0}</small>
              </label>
            ))}
          </div>
        </details>
      )}
    </form>
  );
}
