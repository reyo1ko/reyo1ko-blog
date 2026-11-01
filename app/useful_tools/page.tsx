import ToolGroupList from "../components/useful_tool/ToolGroupList";
import { TOOL_GROUPS } from "../components/useful_tool/tools";
import PageHeading from "../components/PageHeading";
export default function UsefulToolsPage() {
  return (
    <div>
      <PageHeading
        eyebrow="EVERYDAY TOOLBOX"
        title="便利ツール"
        description="変換、比較、ちょっとした計算。いつもの作業を、少し軽く。"
        icon="tools"
      />
      <ToolGroupList groups={TOOL_GROUPS} />
    </div>
  );
}
