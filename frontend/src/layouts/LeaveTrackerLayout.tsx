import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { formatBsFull } from "@/utils/nepali-date";
import { LeaveSidebar } from "@/components/leave/LeaveSidebar";
import { useLeaveAuth } from "@/hooks/useLeaveAuth";
import { Button } from "@/components/ui/Button";
import { SkeletonLines } from "@/components/ui/Skeleton";

export function LeaveTrackerLayout() {
  const { user, isLoading, isAuthenticated, logout } = useLeaveAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (isLoading && !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#eef1f8]">
        <SkeletonLines rows={3} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/leave/tracker" replace state={{ from: location.pathname }} />;
  }

  return (
    <div className="admin-shell">
      <LeaveSidebar user={user} open={open} onClose={() => setOpen(false)} onLogout={() => void logout()} />
      <div className="admin-main">
        <header className="flex items-center justify-between gap-3 border-b border-navy/10 bg-white px-4 py-3 lg:px-6">
          <Button type="button" variant="ghost" className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </Button>
          <p className="text-sm font-semibold text-navy">Leave tracker desk</p>
          <span className="hidden text-sm text-ink-muted sm:block">{formatBsFull(new Date())}</span>
          <span className="rounded-full bg-gold/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-gold">
            Staff only
          </span>
        </header>
        <div className="admin-content">
          <Suspense fallback={<SkeletonLines rows={6} />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
