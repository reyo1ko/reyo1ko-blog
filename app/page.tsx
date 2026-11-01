import Link from "next/link";
import { getList } from "./libs/microcms";
import ArticleList from "./components/blog/ArticleList";
import PixelIcon, { toolIcon } from "./components/PixelIcon";
import { TOOL_GROUPS } from "./components/useful_tool/tools";
export default async function Home() {
  const { contents } = await getList({ limit: 5, orders: "-publishedAt" });
  const featured = [
    TOOL_GROUPS[2].items[0],
    TOOL_GROUPS[0].items[0],
    TOOL_GROUPS[2].items[4],
  ];
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="status-dot" /> NOTES & LITTLE TOOLS
          </div>
          <h1>
            学んだことを、
            <br />
            明日の<span>仕事の力に。</span>
          </h1>
          <p>
            ITの学びを整理する技術ノートと、
            <br className="desktop-break" />
            日々のひと手間を減らす、小さな便利ツール。
          </p>
          <div className="hero-actions">
            <Link href="/blogs" className="button-primary">
              <PixelIcon name="article" />
              記事を読む
              <PixelIcon name="arrow" />
            </Link>
            <Link href="/useful_tools" className="button-secondary">
              <PixelIcon name="tools" />
              ツールを探す
            </Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="pixel-window">
            <div className="pixel-window-bar">
              <i />
              <i />
              <i />
              <span>everyday.notes</span>
            </div>
            <div className="pixel-window-body">
              <div className="pixel-plant">
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="pixel-code">
                <b />
                <b />
                <b />
                <b />
              </div>
              <div className="pixel-caption">
                LEARN. BUILD. REPEAT.<span>ひとつずつ、自分のペースで。</span>
              </div>
            </div>
          </div>
          <span className="art-note">a little progress, every day.</span>
        </div>
      </section>
      <section className="home-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">RECENT NOTES</div>
            <h2>最近の記事</h2>
          </div>
          <Link href="/blogs" className="text-link">
            すべての記事
            <PixelIcon name="arrow" />
          </Link>
        </div>
        <ArticleList articles={contents} />
      </section>
      <section className="home-section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">SMALL HELPERS</div>
            <h2>仕事のそばに、小さなツール。</h2>
          </div>
          <Link href="/useful_tools" className="text-link">
            すべてのツール
            <PixelIcon name="arrow" />
          </Link>
        </div>
        <div className="featured-tools">
          {featured.map((tool) => (
            <Link key={tool.href} href={tool.href} className="tool-card">
              <span className="tool-icon">
                <PixelIcon name={toolIcon(tool.href)} />
              </span>
              <h3>{tool.title}</h3>
              <p>{tool.description}</p>
              <span className="tool-card-action">
                使ってみる
                <PixelIcon name="arrow" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
