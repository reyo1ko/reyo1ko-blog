import CommandItemRow, { CommandItem } from "./CommandItemRow";

export type CommandGroup = {
  title: string;
  description: string;
  items: CommandItem[];
};

export default function CommandGroupCard({ group }: { group: CommandGroup }) {
  return (
    <div className="rounded-md border border-line bg-surface p-4 text-sm">
      <h3 className="text-sm font-semibold text-ink">{group.title}</h3>
      <p className="mt-1 mb-3 text-xs text-muted">{group.description}</p>

      <div className="space-y-2">
        {group.items.map((item, i) => (
          <CommandItemRow key={i} item={item} />
        ))}
      </div>
    </div>
  );
}
