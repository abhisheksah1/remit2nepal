import { Link } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { initials } from "@/utils/format";
import type { AuthUser } from "@/types/auth";

export function Topbar({
  user,
  onMenu,
  onLogout
}: {
  user: AuthUser | null;
  onMenu: () => void;
  onLogout: () => void;
}) {
  return (
    <header className="flex items-center justify-between border-b border-navy/10 bg-white px-4 py-3">
      <button type="button" className="rounded-md p-2 lg:hidden" onClick={onMenu} aria-label="Open sidebar">
        <Menu className="h-5 w-5" />
      </button>
      <p className="hidden text-sm text-ink-muted lg:block">Secure admin session · cookie authenticated</p>
      <div className="flex items-center gap-3">
        <Link to="/" className="text-sm text-navy hover:underline" target="_blank" rel="noreferrer">
          View website
        </Link>
        <div className="flex items-center gap-2 rounded-full border border-navy/10 px-2 py-1">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs text-gold">
            {initials(user?.fullName || "Admin")}
          </span>
          <div className="pr-2 text-left">
            <p className="text-sm font-medium text-navy">{user?.fullName}</p>
            <p className="text-xs text-ink-muted">{user?.userId}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onLogout} aria-label="Log out">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
