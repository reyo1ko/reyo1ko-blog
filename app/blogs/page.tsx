import CategoryTagFilterClient from "../components/blog/CategoryTagFilterClient";
import ArticleList from "../components/blog/ArticleList";
import PageHeading from "../components/PageHeading";
import { getList } from "../libs/microcms";

type Mode = "or" | "and";

const parseListParam = (v?: string | string[]) => {
  if (!v) return [];
  const s = Array.isArray(v) ? v.join(",") : v;
  return decodeURIComponent(s)
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
};

const parseSingleParam = (v?: string | string[]) => {
  if (!v) return "";
  const s = Array.isArray(v) ? v[0] : v;
  return decodeURIComponent(s).trim();
};

const parseModeParam = (v?: string | string[]): Mode => {
  const s = Array.isArray(v) ? v[0] : v;
  return s === "and" ? "and" : "or";
};

const filterBlogs = (
  blogs: any[],
  selectedCategory: string,
  selectedTags: string[],
  mode: Mode,
) => {
  return blogs.filter((blog) => {
    const catName = blog.category?.name ?? "";
    const tagNames = (blog.tags ?? []).map((t: any) => t?.name).filter(Boolean);

    if (selectedCategory && catName !== selectedCategory) return false;

    if (selectedTags.length === 0) return true;

    if (mode === "and") {
      return selectedTags.every((t) => tagNames.includes(t));
    }
    return selectedTags.some((t) => tagNames.includes(t));
  });
};

const extractCategories = (blogs: any[]) => {
  const map = new Map<string, any>();
  blogs.forEach((b) => {
    const c = b.category;
    if (c?.name && !map.has(c.name)) map.set(c.name, c);
  });
  return Array.from(map.values()).sort((a, b) =>
    String(a.name).localeCompare(String(b.name), "ja"),
  );
};

const extractTags = (blogs: any[]) => {
  const map = new Map<string, any>();
  blogs.forEach((b) => {
    b.tags?.forEach((t: any) => {
      const key = t?.id ?? t?.name;
      if (!key) return;
      if (!map.has(key)) map.set(key, t);
    });
  });
  return Array.from(map.values()).sort((a, b) =>
    String(a.name).localeCompare(String(b.name), "ja"),
  );
};

const makeCategoryCounts = (
  allBlogs: any[],
  categories: any[],
  selectedTags: string[],
  mode: Mode,
) => {
  const base = filterBlogs(allBlogs, "", selectedTags, mode);

  return categories.reduce((acc: Record<string, number>, c: any) => {
    acc[c.name] = base.filter((b: any) => b.category?.name === c.name).length;
    return acc;
  }, {});
};

const makeTagCounts = (
  allBlogs: any[],
  tags: any[],
  selectedCategory: string,
  selectedTags: string[],
  mode: Mode,
) => {
  return tags.reduce((acc: Record<string, number>, tag: any) => {
    const name = tag.name;

    const others = selectedTags.filter((t) => t !== name);
    const base = filterBlogs(allBlogs, selectedCategory, others, mode);

    acc[name] = base.filter((b: any) =>
      b.tags?.some((t: any) => t?.name === name),
    ).length;

    return acc;
  }, {});
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: {
    category?: string | string[];
    tags?: string | string[];
    mode?: string | string[];
  };
}) {
  const { contents } = await getList({ limit: 80 });
  const allBlogs = (contents ?? []) as any[];

  const selectedCategory = parseSingleParam(searchParams?.category);
  const selectedTags = parseListParam(searchParams?.tags);
  const mode = parseModeParam(searchParams?.mode);

  const categories = extractCategories(allBlogs);
  const tags = extractTags(allBlogs);

  const blogs = filterBlogs(allBlogs, selectedCategory, selectedTags, mode);

  const categoryCounts = makeCategoryCounts(allBlogs, categories, selectedTags, mode);
  const tagCounts = makeTagCounts(allBlogs, tags, selectedCategory, selectedTags, mode);

  return (
    <div>
      <PageHeading
        eyebrow="KNOWLEDGE LIBRARY"
        title="記事を読む"
        description="日々の仕事で学んだことを、あとから引き出せる場所に。"
      />
      <section className="filter-panel" aria-label="記事の絞り込み">
        <CategoryTagFilterClient
          basePath="/blogs"
          categories={categories}
          tags={tags}
          selectedCategory={selectedCategory}
          selectedTags={selectedTags}
          mode={mode}
          categoryCounts={categoryCounts}
          tagCounts={tagCounts}
          totalCount={allBlogs.length}
          filteredCount={blogs.length}
        />
      </section>
      <div className="list-heading">
        <span>NOTES</span>
        <span>{blogs.length} 件の記事</span>
      </div>
      <ArticleList articles={blogs} />
    </div>
  );
}
