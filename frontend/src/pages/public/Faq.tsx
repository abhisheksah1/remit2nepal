import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/public.api";
import { SeoHead } from "@/components/public/SeoHead";
import { PageHero } from "@/components/public/PageHero";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { entityId } from "@/utils/cn";

export default function Faq() {
  const query = useQuery({ queryKey: ["public", "faqs"], queryFn: publicApi.faqs });
  const [open, setOpen] = useState<string | null>(null);
  const categories = useMemo(() => Array.from(new Set((query.data ?? []).map((item) => item.category || "General"))), [query.data]);

  if (query.isLoading) return <div className="mx-auto max-w-site px-4 py-16"><SkeletonLines /></div>;

  return (
    <>
      <PageHero
        kicker="Help"
        title="Frequently asked questions"
        description="Identification, rates, bank deposit and branch hours."
      />
      <div className="mx-auto max-w-3xl px-4 py-16">
      <SeoHead title="Frequently asked questions" description="Identification, rates, bank deposit and branch hours." />
      {categories.map((category) => (
        <section key={category} className="mt-10">
          <h2 className="font-display text-2xl text-navy">{category}</h2>
          <div className="mt-4 divide-y divide-navy/10 rounded-2xl glass-panel">
            {(query.data ?? [])
              .filter((item) => (item.category || "General") === category)
              .map((item) => {
                const id = entityId(item);
                const expanded = open === id;
                return (
                  <div key={id}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between px-5 py-4 text-left"
                      aria-expanded={expanded}
                      onClick={() => setOpen(expanded ? null : id)}
                    >
                      <span className="font-medium text-navy">{item.question}</span>
                      <span className="text-gold">{expanded ? "–" : "+"}</span>
                    </button>
                    {expanded ? <div className="prose-r2n px-5 pb-5" dangerouslySetInnerHTML={{ __html: item.answer }} /> : null}
                  </div>
                );
              })}
          </div>
        </section>
      ))}
    </div>
    </>
  );
}
