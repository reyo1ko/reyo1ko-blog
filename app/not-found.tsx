import Link from "next/link";
import PageHeading from "./components/PageHeading";
export default function NotFound() {
  return (
    <div>
      <PageHeading
        eyebrow="404 / PAGE NOT FOUND"
        title="ページが見つかりません"
        description="ページが移動したか、URLが変更された可能性があります。記事や便利ツールの一覧から探してみてください。"
        icon="search"
      />
      <div className="hero-actions">
        <Link className="button-primary" href="/blogs">
          記事を探す
        </Link>
        <Link className="button-secondary" href="/useful_tools">
          便利ツールを探す
        </Link>
      </div>
    </div>
  );
}
