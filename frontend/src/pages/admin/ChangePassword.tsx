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
import { BRAND } from "@/constants/brand";

export default function ChangePassword() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const client = useQueryClient();
  const { push } = useToast();
  const form = useForm<ChangePasswordValues>({ resolver: zodResolver(changePasswordSchema) });
  const mutation = useMutation({
    mutationFn: (values: ChangePasswordValues) => authApi.changePassword(values.currentPassword, values.newPassword),
    onSuccess: (data) => {
      client.setQueryData(["auth", "me"], data);
      push({ title: "Password updated", tone: "success" });
      navigate("/admin", { replace: true });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  if (isLoading) return <div className="grid min-h-screen place-items-center bg-[#eef1f8]"><Skeleton className="h-10 w-40" /></div>;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return (
    <div className="admin-login">
      <aside className="admin-login-brand">
        <div className="flex items-center gap-3">
          <img src={BRAND.logo} alt="" />
          <p className="text-lg font-extrabold tracking-tight text-white">{BRAND.name}</p>
        </div>
        <div>
          <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-white/55">Security</p>
          <h1>Set a password for this desk</h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">
            Hello {user?.fullName}. Use at least 12 characters with upper, lower, number and symbol.
          </p>
        </div>
        <p className="text-sm text-white/45">Authorized personnel only.</p>
      </aside>
      <div className="admin-login-form">
        <div className="admin-login-mobile">
          <img src={BRAND.logo} alt="" />
          <div>
            <p className="text-base font-extrabold text-navy">{BRAND.name}</p>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-navy/50">Security</p>
          </div>
        </div>
        <form
          className="admin-login-card space-y-4"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">Security</p>
          <h1 className="font-display text-3xl text-navy">Set a new password</h1>
          <p className="text-sm text-ink-muted">
            Hello {user?.fullName}. Use at least 12 characters with upper, lower, number and symbol.
          </p>
          <Input label="Current password" type="password" {...form.register("currentPassword")} error={form.formState.errors.currentPassword?.message} />
          <Input label="New password" type="password" {...form.register("newPassword")} error={form.formState.errors.newPassword?.message} />
          <Input label="Confirm new password" type="password" {...form.register("confirmPassword")} error={form.formState.errors.confirmPassword?.message} />
          <Button type="submit" className="w-full min-h-11 rounded-xl" disabled={mutation.isPending}>
            {mutation.isPending ? "Updating…" : "Update password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
