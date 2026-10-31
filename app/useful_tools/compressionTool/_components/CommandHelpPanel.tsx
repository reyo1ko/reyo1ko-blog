import CommandGroupList from "@/app/components/useful_tool/CommandGroupList";
import { COMMAND_GROUPS } from "./commands";

export default function CommandHelpPanel() {
  return (
    <section className="mb-12 rounded-lg border border-line bg-surface p-6">
      <header className="mb-4">
        <h2 className="text-base font-semibold text-ink leading-snug">
          大きなファイルや詳細情報のためのコマンド表（Windows / RHEL）
        </h2>

        <p className="mt-2 text-sm text-muted leading-relaxed">
          1GB
          を超えるファイルや、より詳細な情報が必要な場合は、以下のコマンドを端末上で実行してください。
          <code className="mx-1 rounded-md border border-line bg-surface px-1.5 py-[1px] font-mono text-[12px] text-ink">
            {"<FILENAME>"}
          </code>
          を実際のパスやファイル名に置き換えて使います。各行右側の「コピー」ボタンからコマンドをそのままコピーできます。
        </p>

        <div className="mt-4 border-t border-line" />
      </header>

      <CommandGroupList groups={COMMAND_GROUPS} />
    </section>
  );
}
