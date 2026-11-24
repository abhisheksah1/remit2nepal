import { NavLink } from "react-router-dom";
import { ClipboardList, History, LayoutDashboard, LogOut, Tags, Users, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/public.api";
import { BRAND, brandLogoSrc } from "@/constants/brand";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { initials } from "@/utils/format";
import type { LeaveUser } from "@/types/leave";

const LINKS = [
  { label: "Dashboard", path: "/leave/tracker/dashboard", icon: LayoutDashboard },
  { label: "Summary", path: "/leave/tracker/summary", icon: ClipboardList },
  { label: "Leave history", path: "/leave/tracker/leaves", icon: History },
  { label: "Leave types", path: "/leave/tracker/types", icon: Tags },
  { label: "Employees", path: "/leave/tracker/employees", icon: Users }
] as const;

export function LeaveSidebar({
  user,
  open,
  onClose,
  onLogout
}: {
  user: LeaveUser | null;
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}) {
  const site = useQuery({ queryKey: ["public", "site"], queryFn: publicApi.site, staleTime: 60_000 });
  const logoSrc = brandLogoSrc(site.data?.settings?.logoUrl);
  const company = site.data?.settings?.companyName || BRAND.name;

  return (
    <>
      {open ? (
        <button type="button" className="admin-sidebar-backdrop lg:hidden" aria-label="Close sidebar" onClick={onClose} />
      ) : null}
      <aside className={cn("admin-sidebar", open && "is-open")} aria-label="Leave tracker navigation">
        <div className="admin-sidebar-brand">
          <div className="flex min-w-0 items-center gap-3">
            <img src={logoSrc} alt="" className="admin-sidebar-logo" />
            <div className="admin-sidebar-brand-copy">
              <p className="truncate">{company}</p>
              <span>Leave tracker</span>
            </div>
          </div>
          <button type="button" className="admin-sidebar-close lg:hidden" onClick={onClose} aria-label="Close navigation">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="admin-sidebar-nav" aria-label="Leave tracker">
          <ul>
            {LINKS.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={onClose}
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
        </nav>
        <div className="admin-sidebar-user">
          <span className="admin-user-avatar">{initials(user?.fullName || "LT")}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-cream">{user?.fullName}</p>
            <p className="truncate text-[11px] text-cream/55">{user?.userId}</p>
          </div>
          <Button type="button" variant="ghost" size="sm" className="text-cream/80 hover:text-white" onClick={onLogout} aria-label="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </aside>
    </>
  );
}
