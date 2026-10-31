import Link from "next/link";
import PixelIcon from "../PixelIcon";
export type ArticleSummary = {
  id: string;
  title: string;
  category?: { name?: string } | null;
  tags?: { id?: string; name: string }[] | null;
  publishedAt?: string;
};
export default function ArticleList({ articles }: { articles: ArticleSummary[] }) {
  return articles.length ? (
    <div className="article-list">
      {articles.map((article, index) => (
        <article className="article-item" key={article.id}>
          <span className="article-number" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="article-item-body">
            <Link className="article-title" href={"/blogs/" + article.id}>
              {article.title}
              <PixelIcon name="arrow" />
            </Link>
            <div className="article-meta">
              {article.category?.name && (
                <Link
                  className="category-label"
                  href={"/categories/" + encodeURIComponent(article.category.name)}
                >
                  {article.category.name}
                </Link>
              )}
              {article.tags?.map((tag) => (
                <Link
                  key={tag.id ?? tag.name}
                  className="tag-link"
                  href={"/tags/" + encodeURIComponent(tag.name)}
                >
                  #{tag.name}
                </Link>
              ))}
              {article.publishedAt && (
                <time dateTime={article.publishedAt}>
                  {new Date(article.publishedAt).toLocaleDateString("ja-JP", {
                    timeZone: "Asia/Tokyo",
                  })}
                </time>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  ) : (
    <div className="empty-state">
      <PixelIcon name="search" />
      <h2>該当する記事がありません</h2>
      <p>カテゴリやタグの条件を変えてみてください。</p>
      <Link className="button-secondary" href="/blogs">
        すべての記事を見る
      </Link>
    </div>
  );
}
