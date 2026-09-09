import { Link } from "react-router-dom";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

export function PageHeader({
  title,
  description,
  crumbs,
  actionLabel,
  onAction,
  extra
}: {
  title: string;
  description?: string;
  crumbs: Array<{ label: string; to?: string }>;
  actionLabel?: string;
  onAction?: () => void;
  extra?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <nav className="mb-2 flex flex-wrap gap-1 text-xs text-ink-muted" aria-label="Breadcrumb">
          {crumbs.map((crumb, index) => (
            <span key={crumb.label} className="flex items-center gap-1">
              {index > 0 ? <span>/</span> : null}
              {crumb.to ? (
                <Link to={crumb.to} className="hover:text-navy">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-navy">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="font-display text-3xl text-navy">{title}</h1>
        {description ? <p className="mt-1 text-sm text-ink-muted">{description}</p> : null}
      </div>
      <div className="flex items-center gap-2">
        {extra}
        {actionLabel && onAction ? <Button onClick={onAction}>{actionLabel}</Button> : null}
      </div>
    </div>
  );
}
