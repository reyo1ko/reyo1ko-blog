import Link from "next/link";
import ArticleList from "../../components/blog/ArticleList";
import PageHeading from "../../components/PageHeading";
import { getList, getTagList } from "../../libs/microcms";

const fetchTagIdByName = async (tagName: string) => {
  const { contents } = await getTagList({
    limit: 1,
    filters: `name[equals]${tagName}`,
  });
  return contents[0]?.id ?? null;
};

const fetchBlogsByTag = async (tagName: string) => {
  const tagId = await fetchTagIdByName(tagName);
  if (!tagId) return [];

  const { contents } = await getList({
    limit: 80,
    filters: `tags[contains]${tagId}`,
  });
  return contents;
};

const TagPage = async ({ params }: { params: { tagId: string } }) => {
  const name = decodeURIComponent(params.tagId);
  const blogs = await fetchBlogsByTag(name);
  return (
    <div>
      <PageHeading
        eyebrow="TAG"
        title={"# " + name}
        description="このタグが付いた技術ノート"
        back={{ href: "/blogs", label: "記事一覧" }}
      />
      <div className="list-heading">
        <span>タグ</span>
        <span>{blogs.length} 件の記事</span>
      </div>
      <ArticleList articles={blogs} />
    </div>
  );
};
export default TagPage;
