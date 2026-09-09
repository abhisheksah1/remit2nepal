import { Link } from "react-router-dom";
import { SeoHead } from "@/components/public/SeoHead";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <SeoHead title="Page not found" />
      <p className="text-xs uppercase tracking-[0.25em] text-gold">404</p>
      <h1 className="mt-3 font-display text-4xl text-navy">This page is not on our map</h1>
      <p className="mt-4 text-ink-muted">The address may have moved, or the notice may no longer be published.</p>
      <Link to="/" className="mt-8 inline-block">
        <Button>Return home</Button>
      </Link>
    </div>
  );
}
