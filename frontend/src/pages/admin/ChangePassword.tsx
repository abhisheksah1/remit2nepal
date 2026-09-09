import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router-dom";
import { authApi } from "@/api/auth.api";
import { getErrorMessage } from "@/api/client";
import { changePasswordSchema, type ChangePasswordValues } from "@/schemas/auth.schema";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ChangePassword() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const client = useQueryClient();
  const { push } = useToast();
  const form = useForm<ChangePasswordValues>({ resolver: zodResolver(changePasswordSchema) });
  const mutation = useMutation({
    mutationFn: (values: ChangePasswordValues) => authApi.changePassword(values.currentPassword, values.newPassword),
    onSuccess: async () => {
      push({ title: "Password updated", tone: "success" });
      await client.invalidateQueries({ queryKey: ["auth", "me"] });
      navigate("/admin", { replace: true });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  if (isLoading) return <div className="grid min-h-screen place-items-center"><Skeleton className="h-10 w-40" /></div>;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return (
    <div className="grid min-h-screen place-items-center bg-navy px-4">
      <form
        className="w-full max-w-md space-y-4 rounded-3xl bg-white p-8"
        onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
      >
        <p className="text-xs uppercase tracking-[0.2em] text-gold">Security</p>
        <h1 className="font-display text-3xl text-navy">Set a new password</h1>
        <p className="text-sm text-ink-muted">
          Hello {user?.fullName}. Use at least 12 characters with upper, lower, number and symbol.
        </p>
        <Input label="Current password" type="password" {...form.register("currentPassword")} error={form.formState.errors.currentPassword?.message} />
        <Input label="New password" type="password" {...form.register("newPassword")} error={form.formState.errors.newPassword?.message} />
        <Input label="Confirm new password" type="password" {...form.register("confirmPassword")} error={form.formState.errors.confirmPassword?.message} />
        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? "Updating…" : "Update password"}
        </Button>
      </form>
    </div>
  );
}
