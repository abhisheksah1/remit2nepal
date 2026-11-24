import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { leaveApi } from "@/api/leave.api";
import { getErrorMessage } from "@/api/client";
import { useToast } from "@/components/ui/Toast";
import type { LeaveUser } from "@/types/leave";

export function useLeaveAuth() {
  const navigate = useNavigate();
  const { push } = useToast();
  const client = useQueryClient();
  const query = useQuery({
    queryKey: ["leave-auth", "me"],
    queryFn: leaveApi.me,
    retry: false,
    staleTime: 5 * 60_000
  });
  const user: LeaveUser | null = query.data?.user ?? null;

  const logout = useCallback(async () => {
    try {
      await leaveApi.logout();
    } catch (error) {
      push({ title: getErrorMessage(error, "Could not log out"), tone: "error" });
    } finally {
      client.setQueryData(["leave-auth", "me"], null);
      navigate("/leave/tracker", { replace: true });
    }
  }, [client, navigate, push]);

  return {
    user,
    isLoading: query.isLoading,
    isAuthenticated: Boolean(user),
    refetch: query.refetch,
    logout
  };
}
