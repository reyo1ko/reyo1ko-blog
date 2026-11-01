import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
};

export default function PillLink({ href, children, className = "" }: Props) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex items-center",
        "rounded-md px-2 py-0.5",
        "text-xs text-ink",
        "border border-line bg-surface",
        "hover:bg-soft hover:border-line",
        "transition-colors whitespace-nowrap",
        className,
      ].join(" ")}
    >
      {children}
    </Link>
  );
}
