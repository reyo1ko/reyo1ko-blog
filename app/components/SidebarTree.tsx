"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import PixelIcon, { IconName } from "./PixelIcon";
import ThemeSelect from "./ThemeSelect";
type Props = {
  title: string;
  homeHref: string;
  blogHref: string;
  authorName: string;
  categoryTree: {
    category: { id: string; name: string };
    tags: { id: string; name: string }[];
  }[];
  toolGroups: { title: string; items: { label: string; href: string }[] }[];
};
export default function SidebarTree({
  title,
  homeHref,
  blogHref,
  authorName,
  categoryTree,
  toolGroups,
}: Props) {
  const path = usePathname();
  const nav = (href: string, label: string, icon: IconName, active: boolean) => (
    <Link
      key={href}
      href={href}
      className={"nav-link " + (active ? "is-active" : "")}
      aria-current={active ? "page" : undefined}
    >
      <PixelIcon name={icon} />
      <span>{label}</span>
    </Link>
  );
  return (
    <div className="sidebar-inner">
      <Link href={homeHref} className="site-brand">
        <span className="brand-mark">
          re<span>.</span>
        </span>
        <span className="brand-title">
          {title}
          <small>REYO1KO / FIELD NOTES</small>
        </span>
      </Link>
      <nav aria-label="メイン">
        <div className="nav-section-label">ワークスペース</div>
        {nav(homeHref, "ホーム", "home", path === "/")}
        {nav(blogHref, "記事を読む", "article", path === "/blogs")}
        {nav("/useful_tools", "便利ツール", "tools", path === "/useful_tools")}
        <div className="nav-section-label">カテゴリから探す</div>
        {categoryTree.map(({ category }) =>
          nav(
            "/categories/" + encodeURIComponent(category.name),
            category.name,
            "folder",
            decodeURIComponent(path) === "/categories/" + category.name,
          ),
        )}
        <div className="nav-section-label">ツールから探す</div>
        {toolGroups.map((group) => (
          <details
            className="nav-group"
            key={group.title}
            open={group.items.some((item) => item.href === path) || undefined}
          >
            <summary>
              <PixelIcon name="tools" />
              <span>{group.title}</span>
              <span className="chevron">›</span>
            </summary>
            <div>
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={"nav-sub-link " + (path === item.href ? "is-active" : "")}
                  aria-current={path === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </details>
        ))}
      </nav>
      <footer className="sidebar-footer">
        <ThemeSelect />
        <span className="author-line">
          <span className="status-dot" />
          学びを、日々の力に。<small>@{authorName}</small>
        </span>
      </footer>
    </div>
  );
}
