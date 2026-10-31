"use client";
import CategoryTagFilterClient from "./CategoryTagFilterClient";
export default function TagFilterSelectorMulti({
  basePath,
  selectedTags,
  mode,
  tags,
  counts,
  totalCount,
}: {
  basePath: string;
  selectedTags: string[];
  mode: "or" | "and";
  tags: { id?: string; name: string }[];
  counts: Record<string, number>;
  totalCount: number;
}) {
  return (
    <CategoryTagFilterClient
      basePath={basePath}
      categories={[]}
      tags={tags}
      selectedCategory=""
      selectedTags={selectedTags}
      mode={mode}
      categoryCounts={{}}
      tagCounts={counts}
      totalCount={totalCount}
      filteredCount={totalCount}
    />
  );
}
