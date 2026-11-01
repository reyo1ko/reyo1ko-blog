import CopyButton from "@/app/components/CopyButton";

export type CommandItem = {
  label: string;
  command: string;
};

export type CommandGroup = {
  title: string;
  description?: string;
  items: CommandItem[];
};

type Props = {
  groups: CommandGroup[];

  className?: string;

  showCommandBlock?: boolean;
};

export default function CommandGroupList({
  groups,
  className = "",
  showCommandBlock = true,
}: Props) {
  return (
    <div className={`space-y-4 ${className}`}>
      {groups.map((group) => (
        <div
          key={group.title}
          className="rounded-md border border-line bg-surface p-4 text-sm"
        >
          <h3 className="text-sm font-semibold text-ink">{group.title}</h3>

          {group.description && (
            <p className="mt-1 mb-3 text-xs text-muted">{group.description}</p>
          )}

          <div className="space-y-2">
            {group.items.map((item) => (
              <div
                key={`${group.title}-${item.label}`} // label重複対策
                className="flex flex-col gap-1 rounded-md border border-line bg-surface p-2 text-[11px] hover:bg-soft"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-ink">{item.label}</span>
                  <CopyButton text={item.command} />
                </div>

                {showCommandBlock && (
                  <pre className="whitespace-pre-wrap break-all font-mono text-[11px] text-ink">
                    {item.command}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
