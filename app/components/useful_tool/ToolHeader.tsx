import Link from "next/link";
import PixelIcon from "../PixelIcon";
type Props = {
  title: string;
  description?: string;
  steps?: React.ReactNode;
  stepsTitle?: string;
  stepsVariant?: "ordered" | "unordered";
  align?: "left" | "center";
  size?: "default" | "hero";
  className?: string;
};
export default function ToolHeader({
  title,
  description,
  steps,
  stepsTitle = "使い方",
  stepsVariant = "unordered",
  className = "",
}: Props) {
  const List = stepsVariant === "ordered" ? "ol" : "ul";
  return (
    <header className={"page-heading tool-heading " + className}>
      <Link className="back-link" href="/useful_tools">
        ← 便利ツール一覧
      </Link>
      <div className="eyebrow">
        <PixelIcon name="tools" /> EVERYDAY TOOL
      </div>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
      {steps && (
        <details className="usage-guide">
          <summary>{stepsTitle || "使い方"}</summary>
          <List>{steps}</List>
        </details>
      )}
    </header>
  );
}
