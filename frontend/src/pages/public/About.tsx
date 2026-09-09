import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/public.api";
import { SeoHead } from "@/components/public/SeoHead";
import { PageHero } from "@/components/public/PageHero";
import { Card } from "@/components/ui/Card";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { entityId } from "@/utils/cn";

export default function About() {
  const site = useQuery({ queryKey: ["public", "site"], queryFn: publicApi.site });
  const about = site.data?.about;
  const team = site.data?.team ?? [];
  const documents = useQuery({ queryKey: ["public", "documents"], queryFn: publicApi.documents });

  if (site.isLoading) return <div className="mx-auto max-w-site px-4 py-16"><SkeletonLines /></div>;
  if (!about) return <EmptyState title="About content is being prepared" />;

  return (
    <>
      <SeoHead title="About Remit2Nepal" description="Licensed remittance company serving families across Nepal." />
      <PageHero
        kicker="Our institution"
        title="Built for families who wait on a transfer"
        description="Licensed remittance for people sending from abroad and families receiving across Nepal."
      />
      <div className="mx-auto max-w-site px-4 py-16">
      <div className="prose-r2n max-w-3xl" dangerouslySetInnerHTML={{ __html: about.introduction }} />

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="font-display text-2xl text-navy">Mission</h2>
          <div className="prose-r2n mt-3" dangerouslySetInnerHTML={{ __html: about.mission }} />
        </Card>
        <Card>
          <h2 className="font-display text-2xl text-navy">Vision</h2>
          <div className="prose-r2n mt-3" dangerouslySetInnerHTML={{ __html: about.vision }} />
        </Card>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="font-display text-3xl text-navy">Our story</h2>
          <div className="prose-r2n mt-4" dangerouslySetInnerHTML={{ __html: about.history }} />
        </div>
        <Card className="bg-navy text-cream">
          {about.chairmanPhotoUrl ? (
            <img src={about.chairmanPhotoUrl} alt="" className="mb-4 h-24 w-24 rounded-full object-cover" />
          ) : null}
          <p className="text-xs uppercase tracking-[0.2em] text-gold">{about.chairmanTitle}</p>
          <h3 className="mt-2 font-display text-2xl">{about.chairmanName}</h3>
          <div className="prose-r2n mt-4 text-cream/85" dangerouslySetInnerHTML={{ __html: about.chairmanMessage }} />
        </Card>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-3">
        {about.coreValues.map((value) => (
          <div key={value.title} className="border-t border-gold pt-4">
            <h3 className="font-display text-xl text-navy">{value.title}</h3>
            <p className="mt-2 text-sm text-ink-muted">{value.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-5">
        {about.statistics.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="font-display text-3xl text-navy">{stat.value}</p>
            <p className="mt-1 text-xs uppercase tracking-wider text-gold">{stat.label}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-16 font-display text-3xl text-navy">Leadership</h2>
      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {team.map((member) => (
          <Card key={entityId(member)}>
            <h3 className="font-display text-xl text-navy">{member.name}</h3>
            <p className="text-sm text-gold">{member.title}</p>
            <p className="mt-3 text-sm text-ink-muted">{member.bio}</p>
          </Card>
        ))}
      </div>

      <h2 className="mt-16 font-display text-3xl text-navy">Licenses and documents</h2>
      <ul className="mt-4 space-y-2 text-sm">
        {about.licenses.map((item) => (
          <li key={item} className="text-navy">
            {item}
          </li>
        ))}
        {(documents.data ?? []).map((doc) => (
          <li key={entityId(doc)}>
            <a className="text-navy underline decoration-gold underline-offset-4" href={doc.fileUrl} target="_blank" rel="noreferrer">
              {doc.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}
