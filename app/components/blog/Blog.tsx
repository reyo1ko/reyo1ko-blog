import Link from "next/link";

type BlogProps = {
  id: string;
  title: string;
  category?: { name?: string } | null;
  tags?: { id: string; name: string }[] | null;
};

function Pill({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="
        inline-flex items-center gap-1
        rounded-md px-2 py-0.5
        text-xs text-ink
        border border-line bg-surface
        hover:bg-soft hover:border-line
        transition-colors
        whitespace-nowrap
      "
    >
      {children}
    </Link>
  );
}

const Blog = ({ id, title, category, tags }: BlogProps) => {
  const categoryName = category?.name ?? "";
  const hasTags = !!tags && tags.length > 0;

  return (
    <tr className="border-b border-line hover:bg-surface transition-colors">
      {/* ===================== */}
      {/* Mobile: 2列（タイトル / カテゴリ&タグ） */}
      {/* ===================== */}
      <td className="px-4 py-3 align-top md:hidden">
        <Link
          href={`/blogs/${id}`}
          className="block font-medium text-ink hover:underline leading-snug line-clamp-2"
        >
          {title}
        </Link>
      </td>

      <td className="px-4 py-3 align-top md:hidden text-left">
        {/* 上：📁カテゴリ（左寄せ） */}
        <div className="flex justify-start">
          {categoryName ? (
            <Pill href={`/categories/${encodeURIComponent(categoryName)}`}>
              <span aria-hidden>📁</span>
              <span>{categoryName}</span>
            </Pill>
          ) : (
            <span className="text-xs text-muted">-</span>
          )}
        </div>

        {/* 下：#タグ（左寄せ・折り返し） */}
        <div className="mt-1 flex flex-wrap justify-start gap-1">
          {hasTags ? (
            tags!.map((tag) => (
              <Pill key={tag.id} href={`/tags/${encodeURIComponent(tag.name)}`}>
                <span className="text-muted">#</span>
                <span>{tag.name}</span>
              </Pill>
            ))
          ) : (
            <span className="text-xs text-muted">-</span>
          )}
        </div>
      </td>

      {/* ===================== */}
      {/* md以上: 3列（タイトル / ジャンル / 技術タグ） */}
      {/* ===================== */}
      <td className="hidden md:table-cell px-4 py-3 text-left align-top">
        <Link
          href={`/blogs/${id}`}
          className="block font-medium text-ink hover:underline leading-snug line-clamp-2"
        >
          {title}
        </Link>
      </td>

      <td className="hidden md:table-cell px-4 py-3 text-right align-top">
        {categoryName ? (
          <Pill href={`/categories/${encodeURIComponent(categoryName)}`}>
            <span aria-hidden>📁</span>
            <span>{categoryName}</span>
          </Pill>
        ) : (
          <span className="text-muted">-</span>
        )}
      </td>

      <td className="hidden md:table-cell px-4 py-3 text-right align-top">
        {hasTags ? (
          <div className="flex flex-wrap justify-end gap-1">
            {tags!.map((tag) => (
              <Pill key={tag.id} href={`/tags/${encodeURIComponent(tag.name)}`}>
                <span className="text-muted">#</span>
                <span>{tag.name}</span>
              </Pill>
            ))}
          </div>
        ) : (
          <span className="text-muted">-</span>
        )}
      </td>
    </tr>
  );
};

export default Blog;
