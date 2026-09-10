import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export function PageHero({
  kicker,
  title,
  description
}: {
  kicker: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="ba-hero reveal-skip" aria-labelledby="page-hero-title">
      <div className="ba-hero-copy is-page">
        <p>{kicker}</p>
        <h1 id="page-hero-title">{title}</h1>
        {description ? <span>{description}</span> : null}
      </div>
    </section>
  );
}

export function PageStage({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className="ba-stage">
      <div className={cn("page-dock", className)}>{children}</div>
    </div>
  );
}

export function InteriorPage({
  kicker,
  title,
  description,
  children,
  dockClassName
}: {
  kicker: string;
  title: string;
  description?: string;
  children: ReactNode;
  dockClassName?: string;
}) {
  return (
    <div className="ba-desk reveal-skip">
      <PageHero kicker={kicker} title={title} description={description} />
      <PageStage className={dockClassName}>{children}</PageStage>
    </div>
  );
}
