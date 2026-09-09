import { useState } from "react";
import { Award, BadgeCheck, BookOpen, Eye, FileText, Scale, ShieldCheck, Target } from "lucide-react";
import type { AboutCompany, AboutGalleryImage, DocumentItem, TeamMember } from "@/types/content";
import { entityId, mediaUrl } from "@/utils/cn";
import { aboutIcon } from "@/utils/about-icons";
import { personInitials } from "@/utils/team";

export function AboutHero({
  about,
  kicker,
  title,
  description,
  variant = "banner"
}: {
  about?: AboutCompany | null;
  kicker: string;
  title: string;
  description?: string;
  variant?: "banner" | "card";
}) {
  const isCard = variant === "card";
  return (
    <section className={isCard ? "about-hero is-card reveal-skip" : "about-hero"}>
      {!isCard && about?.heroImageUrl ? <img src={mediaUrl(about.heroImageUrl)} alt="" className="about-hero-photo" /> : null}
      {!isCard ? <div className="about-hero-wash" /> : null}
      {!isCard ? <div className="hero-mesh opacity-40" /> : null}
      <div className={isCard ? "about-team-wrap about-hero-wrap" : "relative mx-auto max-w-site px-4 py-16 lg:px-8 sm:py-20"}>
        <div className={isCard ? "about-hero-copy is-card" : "about-hero-copy"}>
          <p className="about-kicker">{kicker}</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight text-navy sm:text-5xl">{title}</h1>
          {description ? (
            <p className={isCard ? "mt-4 max-w-2xl text-[0.98rem] leading-relaxed text-ink-muted" : "mt-4 max-w-2xl text-ink/80"}>
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function AboutBest({ about }: { about: AboutCompany }) {
  const gallery = (about.galleryImages ?? []).filter((item) => item.imageUrl);
  return (
    <section className="about-best">
      <div className="mx-auto max-w-site px-4 py-16 lg:px-8">
        <p className="about-kicker">{about.bestOfKicker || "Best of company"}</p>
        <h2 className="mt-2 max-w-3xl font-display text-3xl text-navy sm:text-4xl">
          {about.bestOfHeading || "Best of Remit2Nepal"}
        </h2>
        {about.bestOfSubheading ? <p className="mt-3 max-w-2xl text-ink-muted">{about.bestOfSubheading}</p> : null}

        {about.statistics?.length ? (
          <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-5">
            {about.statistics.map((stat, index) => {
              const Icon = aboutIcon(undefined, stat.label);
              return (
                <div key={stat.label} className="about-stat" style={{ animationDelay: `${index * 80}ms` }}>
                  <span className="about-icon" aria-hidden>
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-3 font-display text-3xl text-navy">{stat.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-gold">{stat.label}</p>
                </div>
              );
            })}
          </div>
        ) : null}

        {about.coreValues?.length ? (
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {about.coreValues.map((value, index) => {
              const Icon = aboutIcon(value.icon, value.title);
              return (
                <article key={value.title} className="about-value" style={{ animationDelay: `${index * 90}ms` }}>
                  <span className="about-icon is-lg" aria-hidden>
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="mt-4 font-display text-xl text-navy">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{value.description}</p>
                </article>
              );
            })}
          </div>
        ) : null}

        {gallery.length ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item, index) => (
              <GalleryCard key={`${item.imageUrl}-${index}`} item={item} delay={index * 80} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function AboutStory({ about }: { about: AboutCompany }) {
  return (
    <section className="about-story">
      <div className="mx-auto max-w-site px-4 py-16 lg:px-8">
        <p className="about-kicker">{about.storyKicker || "The company"}</p>
        <h2 className="mt-2 font-display text-3xl text-navy sm:text-4xl">{about.storyHeading || "Who we are"}</h2>
        <div className="prose-r2n mt-5 max-w-3xl" dangerouslySetInnerHTML={{ __html: about.introduction }} />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <article className="about-story-card" style={{ animationDelay: "0ms" }}>
            <span className="about-icon" aria-hidden>
              <Target className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-2xl text-navy">Mission</h3>
            <div className="prose-r2n mt-3" dangerouslySetInnerHTML={{ __html: about.mission }} />
          </article>
          <article className="about-story-card" style={{ animationDelay: "90ms" }}>
            <span className="about-icon" aria-hidden>
              <Eye className="h-5 w-5" />
            </span>
            <h3 className="mt-4 font-display text-2xl text-navy">Vision</h3>
            <div className="prose-r2n mt-3" dangerouslySetInnerHTML={{ __html: about.vision }} />
          </article>
          {about.history ? (
            <article className="about-story-card" style={{ animationDelay: "180ms" }}>
              <span className="about-icon" aria-hidden>
                <BookOpen className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-2xl text-navy">Our story</h3>
              <div className="prose-r2n mt-3" dangerouslySetInnerHTML={{ __html: about.history }} />
            </article>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export function AboutPeople({
  kicker,
  title,
  description,
  members,
  tone
}: {
  kicker: string;
  title: string;
  description: string;
  members: TeamMember[];
  tone: "board" | "team";
}) {
  return (
    <section className={tone === "board" ? "about-people is-board" : "about-people is-team"}>
      <div className={tone === "team" ? "about-team-wrap about-people-wrap" : "mx-auto max-w-site px-4 py-16 lg:px-8"}>
        <p className="text-xs uppercase tracking-[0.22em] text-gold">{kicker}</p>
        <h2 className="mt-2 font-display text-3xl text-navy sm:text-4xl">{title}</h2>
        <p className="mt-3 max-w-2xl text-ink-muted">{description}</p>
        {members.length ? (
          <div className="about-person-grid">
            {members.map((member, index) => (
              <PersonCard key={entityId(member)} member={member} delay={index * 70} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-ink-muted">Add people from Admin → Board & Team. Upload a photo, name, and about for each card.</p>
        )}
      </div>
    </section>
  );
}

export function AboutComplianceBlock({
  about,
  documents
}: {
  about: AboutCompany;
  documents: DocumentItem[];
}) {
  return (
    <section className="about-compliance">
      <div className="mx-auto max-w-site px-4 py-16 lg:px-8">
        <p className="text-xs uppercase tracking-[0.22em] text-gold">Regulatory desk</p>
        <h2 className="mt-2 font-display text-3xl text-navy sm:text-4xl">Compliance</h2>
        <p className="mt-3 max-w-2xl text-ink-muted">
          Licenses, certifications, and public documents stay here so families and partners can verify us.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <ComplianceCard icon={Scale} title="Licenses" items={about.licenses ?? []} />
          <ComplianceCard icon={ShieldCheck} title="Certifications" items={about.certifications ?? []} />
          <ComplianceCard icon={Award} title="Awards" items={about.awards ?? []} />
        </div>
        {documents.length ? (
          <ul className="mt-8 grid gap-3 md:grid-cols-2">
            {documents.map((doc) => (
              <li key={entityId(doc)}>
                <a className="about-doc" href={mediaUrl(doc.fileUrl)} target="_blank" rel="noreferrer">
                  <FileText className="h-5 w-5 shrink-0 text-gold" />
                  <span>
                    <span className="block font-medium text-navy">{doc.title}</span>
                    <span className="text-xs uppercase tracking-wider text-ink-muted">{doc.documentType}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}

function GalleryCard({ item, delay = 0 }: { item: AboutGalleryImage; delay?: number }) {
  return (
    <figure className="about-shot" style={{ animationDelay: `${delay}ms` }}>
      <img src={mediaUrl(item.imageUrl)} alt={item.title || "Company"} />
      {item.title || item.caption ? (
        <figcaption>
          {item.title ? <strong>{item.title}</strong> : null}
          {item.caption ? <span>{item.caption}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function LeaderSpotlight({
  member,
  kicker = "Leadership"
}: {
  member: TeamMember;
  kicker?: string;
}) {
  return (
    <section className="about-leader reveal-skip">
      <div className="about-leader-orbs" aria-hidden>
        <span />
        <span />
        <span />
      </div>
      <div className="about-team-wrap about-leader-wrap">
        <header className="about-leader-head">
          <p className="about-kicker">{kicker}</p>
          <h2>Our leader</h2>
          <span className="about-leader-rule" aria-hidden />
        </header>
        <article className="about-leader-panel">
          <div className="about-leader-photo">
            <PersonPhoto name={member.name} src={member.photoUrl} size="lg" />
            <span className="about-leader-sheen" aria-hidden />
          </div>
          <div className="about-leader-copy">
            <p className="about-leader-role">{member.title}</p>
            <h3 className="about-leader-name">{member.name}</h3>
            {member.bio ? <p className="about-leader-bio">{member.bio}</p> : null}
          </div>
        </article>
      </div>
    </section>
  );
}

function PersonCard({ member, delay }: { member: TeamMember; delay: number }) {
  const [open, setOpen] = useState(false);
  const long = (member.bio ?? "").length > 110;
  return (
    <article className="about-person" style={{ animationDelay: `${delay}ms` }}>
      <div className="about-person-media">
        <PersonPhoto name={member.name} src={member.photoUrl} />
      </div>
      <div className="about-person-body">
        <h3 className="about-person-name">{member.name}</h3>
        <p className="about-person-role">{member.title}</p>
        {member.bio ? (
          <>
            <p className={open ? "about-person-about is-open" : "about-person-about"}>{member.bio}</p>
            {long ? (
              <button type="button" className="about-person-more" onClick={() => setOpen((value) => !value)}>
                {open ? "Show less" : "Read more"}
              </button>
            ) : null}
          </>
        ) : (
          <p className="about-person-about is-empty"> </p>
        )}
      </div>
    </article>
  );
}

function PersonPhoto({ name, src, size = "md" }: { name: string; src?: string; size?: "md" | "lg" }) {
  if (src) {
    return <img src={mediaUrl(src)} alt={name} className="about-photo" />;
  }
  return (
    <div className={size === "lg" ? "about-mono is-lg" : "about-mono"} aria-hidden>
      {personInitials(name)}
    </div>
  );
}

function ComplianceCard({
  icon: Icon,
  title,
  items
}: {
  icon: typeof Scale;
  title: string;
  items: string[];
}) {
  return (
    <article className="about-comp-card">
      <span className="about-comp-icon">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-4 font-display text-xl text-navy">{title}</h3>
      {items.length ? (
        <ul className="mt-3 space-y-2 text-sm text-ink/80">
          {items.map((item) => (
            <li key={item} className="flex gap-2">
              <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-ink-muted">Add items in Admin → About.</p>
      )}
    </article>
  );
}
