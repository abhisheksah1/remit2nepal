import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { authApi } from "@/api/auth.api";
import { getErrorMessage } from "@/api/client";
import { loginSchema, type LoginValues } from "@/schemas/auth.schema";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { BRAND } from "@/constants/brand";

export default function Login() {
  const navigate = useNavigate();
  const client = useQueryClient();
  const { push } = useToast();
  const form = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });
  const mutation = useMutation({
    mutationFn: (values: LoginValues) => authApi.login(values.userId, values.password),
    onSuccess: async (data) => {
      client.setQueryData(["auth", "me"], data);
      if (data.user.mustChangePassword) {
        navigate("/admin/change-password", { replace: true });
        return;
      }
      navigate("/admin", { replace: true });
    },
    onError: (error) => push({ title: getErrorMessage(error, "Unable to sign in"), tone: "error" })
  });

  return (
    <div className="admin-login">
      <aside className="admin-login-brand">
        <div className="flex items-center gap-3">
          <img src={BRAND.logo} alt="" />
          <p className="text-lg font-extrabold tracking-tight text-white">{BRAND.name}</p>
        </div>
        <div>
          <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-white/55">Operations portal</p>
          <h1>Rates, branches and records in one desk</h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">
            Sign in with your staff user ID. Sessions use httpOnly cookies. Privileged actions are audited.
          </p>
        </div>
        <p className="text-sm text-white/45">Authorized personnel only. Unauthorized access is prohibited.</p>
      </aside>
      <div className="admin-login-form">
        <div className="admin-login-mobile">
          <img src={BRAND.logo} alt="" />
          <div>
            <p className="text-base font-extrabold text-navy">{BRAND.name}</p>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-navy/50">Admin desk</p>
          </div>
        </div>
        <form
          className="admin-login-card space-y-5"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <div className="flex items-center gap-2 text-gold">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-[0.16em]">Secure sign-in</span>
          </div>
          <h2 className="font-display text-3xl text-navy">Staff login</h2>
          <Input label="User ID" autoComplete="username" {...form.register("userId")} error={form.formState.errors.userId?.message} />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            {...form.register("password")}
            error={form.formState.errors.password?.message}
          />
          <Button type="submit" className="w-full min-h-11 rounded-xl" disabled={mutation.isPending}>
            {mutation.isPending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
