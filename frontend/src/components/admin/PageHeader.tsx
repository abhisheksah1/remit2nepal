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
    <div className="admin-page-head">
      <div>
        <nav className="admin-crumbs" aria-label="Breadcrumb">
          {crumbs.map((crumb, index) => (
            <span key={crumb.label} className="flex items-center gap-1">
              {index > 0 ? <span>/</span> : null}
              {crumb.to ? (
                <Link to={crumb.to}>
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-navy">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      <div className="admin-page-actions">
        {extra}
        {actionLabel && onAction ? <Button onClick={onAction}>{actionLabel}</Button> : null}
      </div>
    </div>
  );
}
