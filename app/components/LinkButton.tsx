import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: "tag" | "category" | "sidebar";
  icon?: ReactNode;
};

export default function LinkButton({
  href,
  children,
  className = "",
  variant = "tag",
  icon,
}: Props) {
  if (variant === "sidebar") {
    return (
      <Link
        href={href}
        className={[
          "group flex items-center gap-2",
          "rounded-md px-2 py-1.5",
          "text-sm text-ink",
          "hover:bg-soft active:bg-soft",
          "transition-colors select-none",
          className,
        ].join(" ")}
      >
        {icon ? (
          <span className="w-5 shrink-0 text-muted group-hover:text-ink">{icon}</span>
        ) : null}

        <span className="min-w-0 flex-1 truncate">{children}</span>
      </Link>
    );
  }

  const base =
    "inline-flex items-center px-2 py-1 rounded-md font-medium text-on-strong " +
    "hover:bg-strong focus:ring-2 focus:ring-offset-2 focus:ring-accent transition";

  const styles = variant === "category" ? "bg-strong mr-2 my-2" : "bg-strong m-2 text-sm";

  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}
