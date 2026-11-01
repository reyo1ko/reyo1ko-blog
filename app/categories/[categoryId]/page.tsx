import TagFilterSelectorMulti from "../../components/blog/TagFilterSelectorMulti";
import Link from "next/link";
import ArticleList from "../../components/blog/ArticleList";
import PageHeading from "../../components/PageHeading";
import { getCategoryList, getList } from "../../libs/microcms";

type Mode = "or" | "and";

const fetchCategoryIdByName = async (categoryName: string) => {
  const { contents } = await getCategoryList({
    limit: 1,
    filters: `name[equals]${categoryName}`,
  });
  return contents[0]?.id ?? null;
};

const fetchBlogsByCategory = async (categoryName: string) => {
  const categoryId = await fetchCategoryIdByName(categoryName);
  if (!categoryId) return [];

  const { contents } = await getList({
    limit: 80,
    filters: `category[equals]${categoryId}`,
  });
  return contents;
};

const extractTagsFromBlogs = (blogs: any[]) => {
  const map = new Map<string, any>();
  blogs.forEach((blog) => {
    blog.tags?.forEach((tag: any) => {
      const key = tag?.id ?? tag?.name;
      if (!key) return;
      if (!map.has(key)) map.set(key, tag);
    });
  });

  return Array.from(map.values()).sort((a, b) =>
    String(a.name).localeCompare(String(b.name), "ja"),
  );
};

const parseSelectedTags = (searchParams?: { tags?: string | string[] }) => {
  const raw = searchParams?.tags;
  if (!raw) return [];
  const s = Array.isArray(raw) ? raw.join(",") : raw;
  return decodeURIComponent(s)
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
};

const parseMode = (searchParams?: { mode?: string | string[] }): Mode => {
  const raw = searchParams?.mode;
  const s = Array.isArray(raw) ? raw[0] : raw;
  return s === "and" ? "and" : "or";
};

// mode に応じて OR / AND で絞り込み
const filterBlogsByTags = (blogs: any[], selectedTags: string[], mode: "or" | "and") => {
  if (selectedTags.length === 0) return blogs;

  if (mode === "and") {
    // AND：すべて含む
    return blogs.filter((blog) => {
      const names = (blog.tags ?? []).map((t: any) => t?.name);
      return selectedTags.every((tag) => names.includes(tag));
    });
  }

  // OR：どれか含む
  return blogs.filter((blog) =>
    blog.tags?.some((t: any) => selectedTags.includes(t?.name)),
  );
};

const CategoryPage = async ({
  params,
  searchParams,
}: {
  params: { categoryId: string };
  searchParams?: { tags?: string | string[]; mode?: string | string[] };
}) => {
  const name = decodeURIComponent(params.categoryId);
  const allBlogs = await fetchBlogsByCategory(name);
  const selectedTags = parseSelectedTags(searchParams);
  const mode = parseMode(searchParams);
  const blogs = filterBlogsByTags(allBlogs, selectedTags, mode);
  const tags = extractTagsFromBlogs(allBlogs);
  const counts = Object.fromEntries(
    tags.map((t) => [
      t.name,
      allBlogs.filter((b) => b.tags?.some((x) => x.name === t.name)).length,
    ]),
  );
  return (
    <div>
      <PageHeading
        eyebrow="CATEGORY"
        title={name}
        description="このカテゴリの技術ノート"
        icon="folder"
        back={{ href: "/blogs", label: "記事一覧" }}
      />
      <section className="filter-panel">
        <TagFilterSelectorMulti
          basePath={"/categories/" + encodeURIComponent(name)}
          selectedTags={selectedTags}
          mode={mode}
          tags={tags}
          counts={counts}
          totalCount={allBlogs.length}
        />
      </section>
      <div className="list-heading">
        <span>カテゴリ</span>
        <span>{blogs.length} 件の記事</span>
      </div>
      <ArticleList articles={blogs} />
    </div>
  );
};
export default CategoryPage;
