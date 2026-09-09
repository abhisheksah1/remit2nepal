import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { MapPin, Phone, Clock } from "lucide-react";
import { publicApi } from "@/api/public.api";
import { SeoHead } from "@/components/public/SeoHead";
import { SkeletonLines } from "@/components/ui/Skeleton";
import NotFound from "./NotFound";

export default function BranchDetail() {
  const { id = "" } = useParams();
  const query = useQuery({
    queryKey: ["public", "branch", id],
    queryFn: () => publicApi.branch(id),
    enabled: Boolean(id),
    retry: false
  });

  if (query.isLoading) return <div className="mx-auto max-w-site px-4 lg:px-8 py-16"><SkeletonLines /></div>;
  if (!query.data) return <NotFound />;
  const branch = query.data;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <SeoHead title={branch.name} description={`${branch.address}, ${branch.city}`} />
      <Link to="/branches" className="text-sm text-gold">
        ← Our Agent
      </Link>
      <p className="mt-4 text-xs uppercase tracking-wider text-gold">{branch.district}</p>
      <h1 className="mt-2 font-display text-4xl text-navy">{branch.name}</h1>
      <p className="mt-4 flex gap-2 text-ink-muted">
        <MapPin className="h-5 w-5 text-gold" /> {branch.address}, {branch.district}
        {branch.province ? `, ${branch.province}` : ""}
      </p>
      {branch.phone ? (
        <p className="mt-2 flex gap-2">
          <Phone className="h-5 w-5 text-gold" />
          <a href={`tel:${branch.phone}`}>{branch.phone}</a>
        </p>
      ) : null}
      <p className="mt-2 flex gap-2 text-ink-muted">
        <Clock className="h-5 w-5 text-gold" />
        {branch.openingTime}–{branch.closingTime} · Weekly holiday {branch.weeklyHoliday}
      </p>
      {branch.managerName ? <p className="mt-4 text-sm">Manager: {branch.managerName}</p> : null}
      {branch.servicesAvailable?.length ? (
        <ul className="mt-6 flex flex-wrap gap-2">
          {branch.servicesAvailable.map((item) => (
            <li key={item} className="rounded-full bg-gold-100 px-3 py-1 text-sm text-gold-700">
              {item}
            </li>
          ))}
        </ul>
      ) : null}
      {branch.googleMapUrl ? (
        <a className="mt-8 inline-block text-navy underline decoration-gold" href={branch.googleMapUrl} target="_blank" rel="noreferrer">
          Open in Google Maps
        </a>
      ) : null}
    </div>
  );
}
