import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  icon?: ReactNode;
  title?: string;
};

export default function SidebarLink({
  href,
  children,
  className = "",
  icon,
  title,
}: Props) {
  return (
    <Link
      href={href}
      title={title}
      className={[
        "group flex items-center gap-2",
        "rounded-md px-2 py-1.5",
        "text-sm text-ink",
        "hover:bg-soft active:bg-soft",
        "transition-colors select-none",
        className,
      ].join(" ")}
    >
      {icon && (
        <span className="w-5 shrink-0 text-muted group-hover:text-ink">{icon}</span>
      )}

      <span className="min-w-0 flex-1 truncate">{children}</span>
    </Link>
  );
}
