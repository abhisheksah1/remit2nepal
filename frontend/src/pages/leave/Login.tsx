import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { CalendarDays } from "lucide-react";
import { z } from "zod";
import { leaveApi } from "@/api/leave.api";
import { publicApi } from "@/api/public.api";
import { getErrorMessage } from "@/api/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { BRAND, brandLogoSrc } from "@/constants/brand";
import { useLeaveAuth } from "@/hooks/useLeaveAuth";

const schema = z.object({
  userId: z.string().min(3, "Enter your user ID"),
  password: z.string().min(1, "Enter your password"),
  rememberMe: z.boolean().optional()
});

type Values = z.infer<typeof schema>;

export default function LeaveLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const client = useQueryClient();
  const { push } = useToast();
  const { isAuthenticated, isLoading } = useLeaveAuth();
  const site = useQuery({ queryKey: ["public", "site"], queryFn: publicApi.site, staleTime: 60_000 });
  const logoSrc = brandLogoSrc(site.data?.settings?.logoUrl);
  const company = site.data?.settings?.companyName || BRAND.name;
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { userId: "", password: "", rememberMe: false }
  });
  const mutation = useMutation({
    mutationFn: (values: Values) => leaveApi.login(values.userId, values.password, Boolean(values.rememberMe)),
    onSuccess: (data) => {
      client.setQueryData(["leave-auth", "me"], data);
      const from = (location.state as { from?: string } | null)?.from;
      navigate(from && from.startsWith("/leave/tracker/") ? from : "/leave/tracker/dashboard", { replace: true });
    },
    onError: (error) => push({ title: getErrorMessage(error, "Unable to sign in"), tone: "error" })
  });

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/leave/tracker/dashboard" replace />;
  }

  return (
    <div className="admin-login">
      <aside className="admin-login-brand">
        <div className="flex items-center gap-3">
          <img src={logoSrc} alt="" />
          <p className="text-lg font-extrabold tracking-tight text-white">{company}</p>
        </div>
        <div>
          <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.18em] text-white/55">Leave tracker</p>
          <h1>Staff leave, types and employees in one desk</h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-white/70">
            Sign in with the leave-tracker user ID created from the admin panel. Tick Remember me to stay signed in on this device.
          </p>
        </div>
        <p className="text-sm text-white/45">Authorized personnel only.</p>
      </aside>
      <div className="admin-login-form">
        <div className="admin-login-mobile">
          <img src={logoSrc} alt="" />
          <div>
            <p className="text-base font-extrabold text-navy">{company}</p>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-navy/50">Leave tracker</p>
          </div>
        </div>
        <form className="admin-login-card space-y-5" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
          <div className="flex items-center gap-2 text-gold">
            <CalendarDays className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-[0.16em]">First sign-in</span>
          </div>
          <h2 className="font-display text-3xl text-navy">Leave tracker login</h2>
          <Input label="User ID" autoComplete="username" {...form.register("userId")} error={form.formState.errors.userId?.message} />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            {...form.register("password")}
            error={form.formState.errors.password?.message}
          />
          <label className="flex items-center gap-2 text-sm text-navy">
            <input type="checkbox" className="h-4 w-4 accent-[#E31E24]" {...form.register("rememberMe")} />
            Remember me on this device
          </label>
          <Button type="submit" className="w-full min-h-11 rounded-xl" disabled={mutation.isPending}>
            {mutation.isPending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
