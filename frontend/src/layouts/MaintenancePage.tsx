import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

export function MaintenancePage({
  message,
  company
}: {
  message?: string;
  company?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy px-6 text-center text-cream">
      <Shield className="h-10 w-10 text-gold" aria-hidden />
      <p className="mt-6 text-xs uppercase tracking-[0.3em] text-gold">Scheduled maintenance</p>
      <h1 className="mt-4 max-w-xl font-display text-4xl">{company || "Remit2Nepal"} is briefly offline</h1>
      <p className="mt-4 max-w-lg text-cream/80">
        {message || "We are performing scheduled maintenance. Exchange desks and branches continue to operate. Please check back shortly."}
      </p>
      <p className="mt-10 text-sm text-cream/50">
        Staff?{" "}
        <Link to="/admin/login" className="text-gold underline-offset-4 hover:underline">
          Open operations portal
        </Link>
      </p>
    </div>
  );
}
