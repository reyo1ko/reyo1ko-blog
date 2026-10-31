import Pixelizer from "./_components/pixelizer";
import ToolHeader from "../../components/useful_tool/ToolHeader";
export default function Page() {
  return (
    <div className="tool-page-inner">
      <ToolHeader
        title="画像のピクセル化"
        description="画像を取り込み、粗さや出力サイズを調整してピクセルアート風に変換します。"
      />
      <Pixelizer />
    </div>
  );
}
