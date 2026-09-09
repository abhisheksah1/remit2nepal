import { Link, useLocation } from "react-router-dom";
import { ExternalLink, LogOut, Menu } from "lucide-react";
import { adminNav } from "@/config/nav";
import { initials } from "@/utils/format";
import type { AuthUser } from "@/types/auth";

function pageLabel(pathname: string) {
  const items = adminNav.flatMap((group) => group.items).sort((a, b) => b.path.length - a.path.length);
  const match = items.find((item) => pathname === item.path || (item.path !== "/admin" && pathname.startsWith(`${item.path}/`)));
  return match?.label || "Admin";
}

export function Topbar({
  user,
  onMenu,
  onLogout,
  menuOpen
}: {
  user: AuthUser | null;
  onMenu: () => void;
  onLogout: () => void;
  menuOpen?: boolean;
}) {
  const location = useLocation();

  return (
    <header className="admin-topbar">
      <button type="button" className="admin-topbar-menu" onClick={onMenu} aria-label="Open sidebar" aria-expanded={menuOpen}>
        <Menu className="h-5 w-5" />
      </button>
      <h1 className="admin-topbar-title">{pageLabel(location.pathname)}</h1>
      <div className="admin-topbar-actions">
        <Link to="/" className="admin-topbar-web" target="_blank" rel="noreferrer">
          View website
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
        <div className="admin-topbar-user">
          <span>{initials(user?.fullName || "Admin")}</span>
          <div className="min-w-0">
            <p>{user?.fullName}</p>
            <small>{user?.userId}</small>
          </div>
        </div>
        <button type="button" className="admin-logout" onClick={onLogout} aria-label="Log out">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
