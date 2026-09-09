import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Suspense, useEffect, useState } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";
import { PermissionGate } from "@/components/admin/PermissionGate";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission } from "@/hooks/usePermission";
import { adminNav } from "@/config/nav";
import { SkeletonLines } from "@/components/ui/Skeleton";
import type { PermissionKey } from "@/types/api";

function permissionForPath(pathname: string): PermissionKey | undefined {
  const items = adminNav.flatMap((group) => group.items).sort((a, b) => b.path.length - a.path.length);
  const match = items.find((item) => pathname === item.path || (item.path !== "/admin" && pathname.startsWith(`${item.path}/`)));
  return match?.permission;
}

export function AdminLayout() {
  const { user, isLoading, isAuthenticated, mustChangePassword, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (isLoading && !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#eef1f8]">
        <SkeletonLines rows={3} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  if (mustChangePassword && location.pathname !== "/admin/change-password") {
    return <Navigate to="/admin/change-password" replace />;
  }

  const required = permissionForPath(location.pathname);

  return (
    <div className="admin-shell">
      <Sidebar user={user} open={open} onClose={() => setOpen(false)} />
      <div className="admin-main">
        <Topbar user={user} menuOpen={open} onMenu={() => setOpen(true)} onLogout={() => void logout()} />
        <div className="admin-content">
          {required && !hasPermission(user, required) ? (
            <PermissionGate user={user} permission={required}>
              {null}
            </PermissionGate>
          ) : (
            <Suspense fallback={<SkeletonLines rows={6} />}>
              <Outlet context={user} />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}
