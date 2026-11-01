import Link from "next/link";
import PixelIcon, { IconName } from "./PixelIcon";
export default function PageHeading({
  eyebrow,
  title,
  description,
  icon = "article",
  back,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  icon?: IconName;
  back?: { href: string; label: string };
}) {
  return (
    <header className="page-heading">
      {back && (
        <Link className="back-link" href={back.href}>
          ← {back.label}
        </Link>
      )}
      <div className="eyebrow">
        <PixelIcon name={icon} />
        {eyebrow}
      </div>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </header>
  );
}
