import { NavLink, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { adminNav } from "@/config/nav";
import { prefetchAdminPage } from "@/routes/admin-routes";
import { hasPermission } from "@/hooks/usePermission";
import type { AuthUser } from "@/types/auth";
import { cn } from "@/utils/cn";
import { initials } from "@/utils/format";

function roleLabel(role?: string) {
  if (role === "SUPER_ADMIN") return "Super admin";
  if (role === "ADMIN") return "Administrator";
  return role || "Admin";
}

function groupHasPath(paths: string[], pathname: string) {
  return paths.some((path) => pathname === path || (path !== "/admin" && pathname.startsWith(`${path}/`)));
}

export function Sidebar({
  user,
  open,
  onClose
}: {
  user: AuthUser | null;
  open: boolean;
  onClose: () => void;
}) {
  const location = useLocation();
  const groups = useMemo(
    () =>
      adminNav
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => hasPermission(user, item.permission))
        }))
        .filter((group) => group.items.length > 0),
    [user]
  );

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  return (
    <>
      {open ? (
        <button type="button" className="admin-sidebar-backdrop lg:hidden" aria-label="Close sidebar" onClick={onClose} />
      ) : null}
      <aside className={cn("admin-sidebar", open && "is-open")}>
        <div className="admin-sidebar-brand">
          <div className="flex min-w-0 items-center gap-3">
            <span className="admin-mark" aria-hidden>
              R2
            </span>
            <div className="min-w-0">
              <p className="font-display text-lg leading-none text-cream">Remit2Nepal</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-gold/90">Operations desk</p>
            </div>
          </div>
          <button type="button" className="rounded-md p-1 text-cream/70 hover:bg-white/10 lg:hidden" onClick={onClose} aria-label="Close navigation">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="admin-sidebar-nav" aria-label="Admin">
          {groups.map((group) => {
            const paths = group.items.map((item) => item.path);
            const active = groupHasPath(paths, location.pathname);
            const expanded = openGroups[group.label] ?? active ?? group.label === "Overview";
            return (
              <div key={group.label} className={cn("admin-nav-group", active && "is-current")}>
                <button
                  type="button"
                  className="admin-nav-label"
                  aria-expanded={expanded}
                  onClick={() => setOpenGroups((current) => ({ ...current, [group.label]: !expanded }))}
                >
                  <span>{group.label}</span>
                  <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expanded ? "rotate-0" : "-rotate-90")} />
                </button>
                {expanded ? (
                  <ul>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <li key={item.path}>
                          <NavLink
                            to={item.path}
                            end={item.path === "/admin"}
                            onClick={onClose}
                            onMouseEnter={() => prefetchAdminPage(item.path)}
                            onFocus={() => prefetchAdminPage(item.path)}
                            className={({ isActive }) => cn("admin-nav-link", isActive && "is-active")}
                          >
                            <span className="admin-nav-icon" aria-hidden>
                              <Icon className="h-4 w-4" />
                            </span>
                            <span>{item.label}</span>
                          </NavLink>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="admin-sidebar-user">
          <span className="admin-user-avatar">{initials(user?.fullName || "Admin")}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-cream">{user?.fullName}</p>
            <p className="truncate text-[11px] text-cream/55">{roleLabel(user?.role)}</p>
          </div>
          <span className="admin-live-dot" title="Signed in" />
        </div>
      </aside>
    </>
  );
}
