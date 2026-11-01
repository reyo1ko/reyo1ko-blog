import { notFound } from "next/navigation";
import { getDetail, getList } from "../../libs/microcms";
import markdownHtml from "zenn-markdown-html";
import { load } from "cheerio";
import hljs from "highlight.js";
import Link from "next/link";
import PixelIcon from "../../components/PixelIcon";

export async function generateStaticParams() {
  const { contents } = await getList({ limit: 80 });
  return contents.map((blog: { id: string }) => ({ blogId: blog.id }));
}

function PillLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="
        inline-flex items-center
        rounded-md px-2 py-0.5
        text-xs text-ink
        border border-line bg-surface
        hover:bg-soft hover:border-line
        transition-colors
      "
    >
      {children}
    </Link>
  );
}

export default async function StaticDetailPage({
  params: { blogId },
}: {
  params: { blogId: string };
}) {
  const blog = await getDetail(blogId);
  if (!blog) notFound();

  const published = blog.publishedAt ?? blog.createdAt ?? blog.updatedAt ?? null;
  const time = published
    ? new Date(published).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })
    : null;

  let html = markdownHtml(blog.content);

  const $ = load(html);
  $("pre code").each((_, elm) => {
    const result = hljs.highlightAuto($(elm).text());
    $(elm).html(result.value);
    $(elm).addClass("hljs");
  });
  html = $.html();

  return (
    <article className="article-detail">
      <header className="pt-2">
        <Link className="back-link" href="/blogs">
          ← 記事一覧
        </Link>
        <div className="eyebrow">FIELD NOTES</div>
        <h1 className="text-center text-2xl sm:text-3xl font-semibold text-ink tracking-tight">
          {blog.title}
        </h1>

        <div className="article-detail-meta mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted">
          <div className="inline-flex items-center gap-1">
            <span className="text-muted">公開日</span>
            <span>{time ?? "-"}</span>
          </div>

          <div className="h-3 w-px bg-soft hidden sm:block" />

          <div className="inline-flex items-center gap-2">
            <PixelIcon name="folder" />
            {blog.category?.name ? (
              <PillLink href={`/categories/${encodeURIComponent(blog.category.name)}`}>
                {blog.category.name}
              </PillLink>
            ) : (
              <span className="text-muted">未分類</span>
            )}
          </div>

          <div className="h-3 w-px bg-soft hidden sm:block" />

          <div className="inline-flex items-center gap-2">
            <span className="text-muted">#</span>
            {blog.tags && blog.tags.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-1">
                {blog.tags.map((tag: { id: string; name: string }) => (
                  <PillLink key={tag.id} href={`/tags/${encodeURIComponent(tag.name)}`}>
                    {tag.name}
                  </PillLink>
                ))}
              </div>
            ) : (
              <span className="text-muted">-</span>
            )}
          </div>
        </div>

        <div className="mt-6 border-t border-line" />
      </header>

      <div className="markdown mt-6" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
