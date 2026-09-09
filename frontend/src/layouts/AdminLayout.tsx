import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";
import { PermissionGate } from "@/components/admin/PermissionGate";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission } from "@/hooks/usePermission";
import { adminNav } from "@/config/nav";
import { Skeleton } from "@/components/ui/Skeleton";
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

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-navy-50">
        <Skeleton className="h-12 w-48" />
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
    <div className="admin-shell flex min-h-screen">
      <Sidebar user={user} open={open} onClose={() => setOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar user={user} onMenu={() => setOpen(true)} onLogout={() => void logout()} />
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {required && !hasPermission(user, required) ? (
            <PermissionGate user={user} permission={required}>
              {null}
            </PermissionGate>
          ) : (
            <Outlet context={user} />
          )}
        </div>
      </div>
    </div>
  );
}
