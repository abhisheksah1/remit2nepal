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
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden bg-navy text-cream lg:flex lg:flex-col lg:justify-between p-12">
        <p className="font-display text-2xl text-gold">Remit2Nepal</p>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Operations portal</p>
          <h1 className="mt-4 max-w-md font-display text-5xl leading-tight">Rates, branches and records under one licensed desk</h1>
          <p className="mt-6 max-w-md text-cream/75">
            Sign in with your staff user ID. Sessions use httpOnly cookies. Privileged actions are audited.
          </p>
        </div>
        <p className="text-sm text-cream/50">Authorized personnel only. Unauthorized access is prohibited.</p>
      </div>
      <div className="flex items-center justify-center bg-cream px-6 py-16">
        <form
          className="w-full max-w-md space-y-5 rounded-3xl border border-navy/10 bg-white p-8 shadow-card"
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
        >
          <div className="flex items-center gap-2 text-gold">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-xs uppercase tracking-[0.2em]">Secure sign-in</span>
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
          <Button type="submit" className="w-full" disabled={mutation.isPending}>
            {mutation.isPending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
