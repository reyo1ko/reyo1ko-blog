import CopyButton from "../CopyButton";

export type CommandItem = {
  label: string;
  command: string;
};

export default function CommandItemRow({ item }: { item: CommandItem }) {
  return (
    <div className="flex flex-col gap-1 rounded-md border border-line bg-surface p-2 text-[11px] hover:bg-soft">
      <div className="flex items-center justify-between gap-2">
        <span className="font-semibold text-ink">{item.label}</span>
        <CopyButton text={item.command} />
      </div>
      <pre className="whitespace-pre-wrap break-all font-mono text-[11px] text-ink">
        {item.command}
      </pre>
    </div>
  );
}
