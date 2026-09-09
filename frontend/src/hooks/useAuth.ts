import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/api/auth.api";
import { getErrorMessage } from "@/api/client";
import type { AuthUser } from "@/types/auth";
import { useToast } from "@/components/ui/Toast";

export function useAuth() {
  const navigate = useNavigate();
  const { push } = useToast();
  const client = useQueryClient();

  const query = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.me,
    retry: false,
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
    refetchOnMount: false
  });

  const user: AuthUser | null = query.data?.user ?? null;

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      push({ title: getErrorMessage(error, "Could not log out"), tone: "error" });
    } finally {
      client.setQueryData(["auth", "me"], null);
      navigate("/admin/login", { replace: true });
    }
  }, [client, navigate, push]);

  return {
    user,
    isLoading: query.isLoading,
    isAuthenticated: Boolean(user),
    mustChangePassword: Boolean(user?.mustChangePassword),
    refetch: query.refetch,
    logout
  };
}
