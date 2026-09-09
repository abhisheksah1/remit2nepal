import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { adminNav } from "@/config/nav";
import { hasPermission } from "@/hooks/usePermission";
import type { AuthUser } from "@/types/auth";
import { cn } from "@/utils/cn";

export function Sidebar({
  user,
  open,
  onClose
}: {
  user: AuthUser | null;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {open ? <button type="button" className="fixed inset-0 z-40 bg-navy/40 lg:hidden" aria-label="Close sidebar" onClick={onClose} /> : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-navy text-cream transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <div>
            <p className="font-display text-xl text-gold">Remit2Nepal</p>
            <p className="text-xs uppercase tracking-[0.2em] text-cream/60">Operations</p>
          </div>
          <button type="button" className="lg:hidden" onClick={onClose} aria-label="Close navigation">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5" aria-label="Admin">
          {adminNav.map((group) => {
            const items = group.items.filter((item) => hasPermission(user, item.permission));
            if (items.length === 0) return null;
            return (
              <div key={group.label}>
                <p className="px-3 text-[11px] uppercase tracking-[0.18em] text-gold/80">{group.label}</p>
                <ul className="mt-2 space-y-1">
                  {items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.path}>
                        <NavLink
                          to={item.path}
                          end={item.path === "/admin"}
                          onClick={onClose}
                          className={({ isActive }) =>
                            cn(
                              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-cream/75 hover:bg-white/5 hover:text-cream",
                              isActive && "bg-gold/15 text-gold"
                            )
                          }
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </NavLink>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
