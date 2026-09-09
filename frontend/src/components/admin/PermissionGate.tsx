import type { ReactNode } from "react";
import { hasPermission } from "@/hooks/usePermission";
import type { AuthUser } from "@/types/auth";
import type { PermissionKey } from "@/types/api";
import { EmptyState } from "@/components/ui/EmptyState";

export function PermissionGate({
  user,
  permission,
  children
}: {
  user: AuthUser | null;
  permission?: PermissionKey;
  children: ReactNode;
}) {
  if (!hasPermission(user, permission)) {
    return <EmptyState title="You do not have access" description="Ask a super administrator to grant this permission." />;
  }
  return <>{children}</>;
}
