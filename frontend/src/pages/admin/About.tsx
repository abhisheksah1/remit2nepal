import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { adminApi } from "@/api/admin.api";
import { getErrorMessage } from "@/api/client";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { ABOUT_DEFAULTS, aboutLine, isSeedCoreValues } from "@/content/about-defaults";
import { splitCsv } from "@/utils/cn";
import type { AboutGalleryImage, StatItem, WhyItem } from "@/types/content";
import { ABOUT_ICON_OPTIONS } from "@/utils/about-icons";

interface Chip {
  title: string;
}

interface AboutForm {
  heroKicker: string;
  heroTitle: string;
  heroDescription: string;
  heroImageUrl: string;
  heroPrimaryLabel: string;
  heroPrimaryUrl: string;
  heroSecondaryLabel: string;
  heroSecondaryUrl: string;
  introduction: string;
  whoBody: string;
  mission: string;
  missionKicker: string;
  missionHeading: string;
  missionBody: string;
  missionImageUrl: string;
  vision: string;
  visionKicker: string;
  visionHeading: string;
  visionBody: string;
  visionImageUrl: string;
  history: string;
  bestOfKicker: string;
  bestOfHeading: string;
  bestOfSubheading: string;
  storyKicker: string;
  storyHeading: string;
  whyKicker: string;
  whyHeading: string;
  whySubheading: string;
  valuesKicker: string;
  valuesHeading: string;
  valuesSubheading: string;
  stepsKicker: string;
  stepsHeading: string;
  boardKicker: string;
  boardHeading: string;
  boardDescription: string;
  teamKicker: string;
  teamHeading: string;
  teamDescription: string;
  teamLeadHeading: string;
  teamStaffHeading: string;
  teamAboutKicker: string;
  teamAboutHeading: string;
  teamAboutIntro: string;
  teamAboutBody: string;
  teamMotto: string;
  teamAboutLinkLabel: string;
  teamAboutLinkUrl: string;
  commitmentKicker: string;
  commitmentHeading: string;
  commitmentBody: string;
  storyBandKicker: string;
  storyBandHeading: string;
  storyBandBody: string;
  storyBandImageUrl: string;
  ctaHeading: string;
  ctaBody: string;
  ctaPrimaryLabel: string;
  ctaPrimaryUrl: string;
  ctaSecondaryLabel: string;
  ctaSecondaryUrl: string;
  certifications: string;
  licenses: string;
  awards: string;
}

const d = ABOUT_DEFAULTS;

const ABOUT_NAV = [
  {
    group: "About page",
    items: [
      { id: "hero", label: "Hero" },
      { id: "who", label: "Who we are" },
      { id: "mission", label: "Mission" },
      { id: "vision", label: "Vision" },
      { id: "why", label: "Why choose us" },
      { id: "values", label: "Values" },
      { id: "steps", label: "How we work" },
      { id: "commitment", label: "Commitment" },
      { id: "story", label: "Story band" },
      { id: "cta", label: "Closing CTA" },
      { id: "stats", label: "Statistics" },
      { id: "gallery", label: "Gallery" },
      { id: "history", label: "History & licenses" }
    ]
  },
  {
    group: "Related pages",
    items: [
      { id: "teamAbout", label: "Team on About" },
      { id: "board", label: "Board page" },
      { id: "team", label: "Team page" },
      { id: "bestof", label: "Best of company" }
    ]
  }
] as const;

type AboutSectionId = (typeof ABOUT_NAV)[number]["items"][number]["id"];

function fromList(value: string[] | undefined, fallback: string[]): Chip[] {
  const list = (value ?? []).map((title) => title.trim()).filter(Boolean);
  return (list.length ? list : fallback).map((title) => ({ title }));
}

function fromItems(value: WhyItem[] | undefined, fallback: WhyItem[]): WhyItem[] {
  const list = (value ?? []).filter((item) => item.title?.trim());
  return (list.length ? list : fallback).map((item) => ({
    title: item.title,
    description: item.description || "",
    icon: item.icon || "shield"
  }));
}

export default function About() {
  const { push } = useToast();
  const client = useQueryClient();
  const query = useQuery({ queryKey: ["admin-about"], queryFn: adminApi.about.get });
  const [form, setForm] = useState<AboutForm | null>(null);
  const [active, setActive] = useState<AboutSectionId>("hero");
  const [values, setValues] = useState<WhyItem[]>([]);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [gallery, setGallery] = useState<AboutGalleryImage[]>([]);
  const [highlights, setHighlights] = useState<WhyItem[]>([]);
  const [missionPoints, setMissionPoints] = useState<WhyItem[]>([]);
  const [whyItems, setWhyItems] = useState<WhyItem[]>([]);
  const [steps, setSteps] = useState<WhyItem[]>([]);
  const [visionChips, setVisionChips] = useState<Chip[]>([]);
  const [commitmentItems, setCommitmentItems] = useState<Chip[]>([]);

  useEffect(() => {
    if (!query.data) return;
    const data = query.data;
    setForm({
      heroKicker: aboutLine(data.heroKicker, d.heroKicker),
      heroTitle: aboutLine(data.heroTitle, d.heroTitle),
      heroDescription: aboutLine(data.heroDescription, d.heroDescription),
      heroImageUrl: data.heroImageUrl || "",
      heroPrimaryLabel: aboutLine(data.heroPrimaryLabel, d.heroPrimaryLabel),
      heroPrimaryUrl: aboutLine(data.heroPrimaryUrl, d.heroPrimaryUrl),
      heroSecondaryLabel: aboutLine(data.heroSecondaryLabel, d.heroSecondaryLabel),
      heroSecondaryUrl: aboutLine(data.heroSecondaryUrl, d.heroSecondaryUrl),
      introduction: aboutLine(data.introduction, d.introduction),
      whoBody: aboutLine(data.whoBody, d.whoBody),
      mission: aboutLine(data.mission, d.mission),
      missionKicker: aboutLine(data.missionKicker, d.missionKicker),
      missionHeading: aboutLine(data.missionHeading, d.missionHeading),
      missionBody: aboutLine(data.missionBody, d.missionBody),
      missionImageUrl: data.missionImageUrl || "",
      vision: aboutLine(data.vision, d.vision),
      visionKicker: aboutLine(data.visionKicker, d.visionKicker),
      visionHeading: aboutLine(data.visionHeading, d.visionHeading),
      visionBody: aboutLine(data.visionBody, d.visionBody),
      visionImageUrl: data.visionImageUrl || "",
      history: data.history || "",
      bestOfKicker: data.bestOfKicker || "Best of company",
      bestOfHeading: data.bestOfHeading || "Best of Remit To Nepal Pvt. Ltd",
      bestOfSubheading: data.bestOfSubheading || "",
      storyKicker: aboutLine(data.storyKicker, d.storyKicker),
      storyHeading: aboutLine(data.storyHeading, d.storyHeading),
      whyKicker: aboutLine(data.whyKicker, d.whyKicker),
      whyHeading: aboutLine(data.whyHeading, d.whyHeading),
      whySubheading: aboutLine(data.whySubheading, d.whySubheading),
      valuesKicker: aboutLine(data.valuesKicker, d.valuesKicker),
      valuesHeading: aboutLine(data.valuesHeading, d.valuesHeading),
      valuesSubheading: aboutLine(data.valuesSubheading, d.valuesSubheading),
      stepsKicker: aboutLine(data.stepsKicker, d.stepsKicker),
      stepsHeading: aboutLine(data.stepsHeading, d.stepsHeading),
      boardKicker: data.boardKicker || "Governance",
      boardHeading: data.boardHeading || "Board of Directors",
      boardDescription: data.boardDescription || "",
      teamKicker: data.teamKicker || "Operations",
      teamHeading: data.teamHeading || "Our Team",
      teamDescription:
        data.teamDescription || "The desk that runs corridors, branches, and the compliance file every day.",
      teamLeadHeading: data.teamLeadHeading || "Top Leaders",
      teamStaffHeading: data.teamStaffHeading || "Our people",
      teamAboutKicker: aboutLine(data.teamAboutKicker, d.teamAboutKicker),
      teamAboutHeading: aboutLine(data.teamAboutHeading, d.teamAboutHeading),
      teamAboutIntro: aboutLine(data.teamAboutIntro, d.teamAboutIntro),
      teamAboutBody: aboutLine(data.teamAboutBody, d.teamAboutBody),
      teamMotto: aboutLine(data.teamMotto, d.teamMotto),
      teamAboutLinkLabel: aboutLine(data.teamAboutLinkLabel, d.teamAboutLinkLabel),
      teamAboutLinkUrl: aboutLine(data.teamAboutLinkUrl, d.teamAboutLinkUrl),
      commitmentKicker: aboutLine(data.commitmentKicker, d.commitmentKicker),
      commitmentHeading: aboutLine(data.commitmentHeading, d.commitmentHeading),
      commitmentBody: aboutLine(data.commitmentBody, d.commitmentBody),
      storyBandKicker: aboutLine(data.storyBandKicker, d.storyBandKicker),
      storyBandHeading: aboutLine(data.storyBandHeading, d.storyBandHeading),
      storyBandBody: aboutLine(data.storyBandBody, d.storyBandBody),
      storyBandImageUrl: data.storyBandImageUrl || "",
      ctaHeading: aboutLine(data.ctaHeading, d.ctaHeading),
      ctaBody: aboutLine(data.ctaBody, d.ctaBody),
      ctaPrimaryLabel: aboutLine(data.ctaPrimaryLabel, d.ctaPrimaryLabel),
      ctaPrimaryUrl: aboutLine(data.ctaPrimaryUrl, d.ctaPrimaryUrl),
      ctaSecondaryLabel: aboutLine(data.ctaSecondaryLabel, d.ctaSecondaryLabel),
      ctaSecondaryUrl: aboutLine(data.ctaSecondaryUrl, d.ctaSecondaryUrl),
      certifications: (data.certifications ?? []).join(", "),
      licenses: (data.licenses ?? []).join(", "),
      awards: (data.awards ?? []).join(", ")
    });
    setValues(fromItems(isSeedCoreValues(data.coreValues) ? undefined : data.coreValues, d.coreValues));
    setStats(data.statistics ?? []);
    setGallery(data.galleryImages ?? []);
    setHighlights(fromItems(data.whoHighlights, d.whoHighlights));
    setMissionPoints(fromItems(data.missionPoints, d.missionPoints));
    setWhyItems(fromItems(data.whyItems, d.whyItems));
    setSteps(fromItems(data.steps, d.steps));
    setVisionChips(fromList(data.visionChips, d.visionChips));
    setCommitmentItems(fromList(data.commitmentItems, d.commitmentItems));
  }, [query.data]);

  const setField = (key: keyof AboutForm, value: string) => {
    setForm((current) => (current ? { ...current, [key]: value } : current));
  };

  const save = useMutation({
    mutationFn: () => {
      if (!form) throw new Error("Form is not ready");
      return adminApi.about.update({
        ...form,
        coreValues: values.filter((item) => item.title.trim()),
        statistics: stats.filter((item) => item.label.trim() && item.value.trim()),
        galleryImages: gallery.filter((item) => item.imageUrl.trim()),
        whoHighlights: highlights.filter((item) => item.title.trim()),
        missionPoints: missionPoints.filter((item) => item.title.trim()),
        whyItems: whyItems.filter((item) => item.title.trim()),
        steps: steps.filter((item) => item.title.trim()),
        visionChips: visionChips.map((item) => item.title.trim()).filter(Boolean),
        commitmentItems: commitmentItems.map((item) => item.title.trim()).filter(Boolean),
        certifications: splitCsv(form.certifications),
        licenses: splitCsv(form.licenses),
        awards: splitCsv(form.awards)
      });
    },
    onSuccess: async () => {
      push({ title: "About page updated", tone: "success" });
      await client.invalidateQueries({ queryKey: ["admin-about"] });
      await client.invalidateQueries({ queryKey: ["public", "site"] });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  if (query.isLoading || !form) return <SkeletonLines />;

  const currentLabel = ABOUT_NAV.flatMap((group) => group.items).find((item) => item.id === active)?.label ?? "Section";

  return (
    <div>
      <PageHeader
        title="About the company"
        description="Open one section at a time. Each block on /about has its own copy, photos, and cards — the same layout as Compliance."
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "About" }]}
      />
      <p className="mb-6 text-sm text-ink-muted">
        Use // in a title to split navy and red. People photos are on{" "}
        <Link className="font-medium text-navy underline" to="/admin/team">
          Board & Team
        </Link>
        . The compliance page is on{" "}
        <Link className="font-medium text-navy underline" to="/admin/compliance">
          Compliance
        </Link>
        .
      </p>

      <div className="grid items-start gap-6 xl:grid-cols-[15.5rem_minmax(0,1fr)]">
        <nav className="rounded-2xl border border-navy/10 bg-white p-2 xl:sticky xl:top-24" aria-label="About sections">
          {ABOUT_NAV.map((group) => (
            <div key={group.group} className="mb-3 last:mb-0">
              <p className="px-3 pb-1 pt-2 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ink-muted">
                {group.group}
              </p>
              {group.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(item.id)}
                  className={`flex w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium ${
                    active === item.id ? "bg-navy text-white" : "text-navy hover:bg-navy/5"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <form
          className="max-w-4xl space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            save.mutate();
          }}
        >
          {active === "hero" ? (
            <AdminBlock title="Hero" hint="Top of /about. Title supports // for navy / red lines.">
              <Input label="Kicker" value={form.heroKicker} onChange={(event) => setField("heroKicker", event.target.value)} />
              <Input
                label="Title"
                value={form.heroTitle}
                onChange={(event) => setField("heroTitle", event.target.value)}
                hint="Example: Receiving from abroad. // Paying families in Nepal."
              />
              <Textarea label="Description" value={form.heroDescription} onChange={(event) => setField("heroDescription", event.target.value)} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Primary button" value={form.heroPrimaryLabel} onChange={(event) => setField("heroPrimaryLabel", event.target.value)} />
                <Input label="Primary URL" value={form.heroPrimaryUrl} onChange={(event) => setField("heroPrimaryUrl", event.target.value)} />
                <Input label="Secondary button" value={form.heroSecondaryLabel} onChange={(event) => setField("heroSecondaryLabel", event.target.value)} />
                <Input label="Secondary URL" value={form.heroSecondaryUrl} onChange={(event) => setField("heroSecondaryUrl", event.target.value)} />
              </div>
            </AdminBlock>
          ) : null}

          {active === "who" ? (
            <AdminBlock title="Who we are" hint="Main story block with highlight chips and a photo.">
              <Input label="Kicker" value={form.storyKicker} onChange={(event) => setField("storyKicker", event.target.value)} />
              <Input label="Heading" value={form.storyHeading} onChange={(event) => setField("storyHeading", event.target.value)} />
              <Textarea label="First paragraph" value={form.introduction} onChange={(event) => setField("introduction", event.target.value)} />
              <Textarea label="Second paragraph" value={form.whoBody} onChange={(event) => setField("whoBody", event.target.value)} />
              <ImageUploadField
                label="Who we are image"
                folder="about"
                value={form.heroImageUrl}
                onChange={(url) => setField("heroImageUrl", url)}
              />
              <RepeatList
                title="Highlight bullets"
                addLabel="Add highlight"
                items={highlights}
                onAdd={() => setHighlights((current) => [...current, { title: "", description: "", icon: "zap" }])}
                onRemove={(index) => setHighlights((current) => current.filter((_, i) => i !== index))}
                render={(item, index) => (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      label="Label"
                      value={item.title}
                      onChange={(event) =>
                        setHighlights((current) => current.map((row, i) => (i === index ? { ...row, title: event.target.value } : row)))
                      }
                    />
                    <IconField
                      value={item.icon}
                      onChange={(icon) => setHighlights((current) => current.map((row, i) => (i === index ? { ...row, icon } : row)))}
                    />
                  </div>
                )}
              />
            </AdminBlock>
          ) : null}

          {active === "mission" ? (
            <AdminBlock title="Mission">
              <Input label="Kicker" value={form.missionKicker} onChange={(event) => setField("missionKicker", event.target.value)} />
              <Input label="Heading" value={form.missionHeading} onChange={(event) => setField("missionHeading", event.target.value)} />
              <Textarea label="First paragraph" value={form.mission} onChange={(event) => setField("mission", event.target.value)} />
              <Textarea label="Second paragraph" value={form.missionBody} onChange={(event) => setField("missionBody", event.target.value)} />
              <ImageUploadField label="Mission image" folder="about" value={form.missionImageUrl} onChange={(url) => setField("missionImageUrl", url)} />
              <RepeatList
                title="Bullets"
                addLabel="Add bullet"
                items={missionPoints}
                onAdd={() => setMissionPoints((current) => [...current, { title: "", description: "", icon: "check" }])}
                onRemove={(index) => setMissionPoints((current) => current.filter((_, i) => i !== index))}
                render={(item, index) => (
                  <div className="grid gap-3">
                    <Input
                      label="Title"
                      value={item.title}
                      onChange={(event) =>
                        setMissionPoints((current) => current.map((row, i) => (i === index ? { ...row, title: event.target.value } : row)))
                      }
                    />
                    <Textarea
                      label="Line"
                      value={item.description}
                      onChange={(event) =>
                        setMissionPoints((current) =>
                          current.map((row, i) => (i === index ? { ...row, description: event.target.value } : row))
                        )
                      }
                    />
                  </div>
                )}
              />
            </AdminBlock>
          ) : null}

          {active === "vision" ? (
            <AdminBlock title="Vision">
              <Input label="Kicker" value={form.visionKicker} onChange={(event) => setField("visionKicker", event.target.value)} />
              <Input label="Heading" value={form.visionHeading} onChange={(event) => setField("visionHeading", event.target.value)} />
              <Textarea label="First paragraph" value={form.vision} onChange={(event) => setField("vision", event.target.value)} />
              <Textarea label="Second paragraph" value={form.visionBody} onChange={(event) => setField("visionBody", event.target.value)} />
              <ImageUploadField label="Vision image" folder="about" value={form.visionImageUrl} onChange={(url) => setField("visionImageUrl", url)} />
              <RepeatList
                title="Chips"
                addLabel="Add chip"
                items={visionChips}
                onAdd={() => setVisionChips((current) => [...current, { title: "" }])}
                onRemove={(index) => setVisionChips((current) => current.filter((_, i) => i !== index))}
                render={(item, index) => (
                  <Input
                    label="Chip"
                    value={item.title}
                    onChange={(event) =>
                      setVisionChips((current) => current.map((row, i) => (i === index ? { title: event.target.value } : row)))
                    }
                  />
                )}
              />
            </AdminBlock>
          ) : null}

          {active === "why" ? (
            <AdminBlock title="Why choose us">
              <Input label="Kicker" value={form.whyKicker} onChange={(event) => setField("whyKicker", event.target.value)} />
              <Input label="Heading" value={form.whyHeading} onChange={(event) => setField("whyHeading", event.target.value)} />
              <Textarea label="Subheading" value={form.whySubheading} onChange={(event) => setField("whySubheading", event.target.value)} />
              <RepeatList
                title="Cards"
                addLabel="Add card"
                items={whyItems}
                onAdd={() => setWhyItems((current) => [...current, { title: "", description: "", icon: "shield" }])}
                onRemove={(index) => setWhyItems((current) => current.filter((_, i) => i !== index))}
                render={(item, index) => (
                  <ItemEditor item={item} onChange={(next) => setWhyItems((current) => current.map((row, i) => (i === index ? next : row)))} />
                )}
              />
            </AdminBlock>
          ) : null}

          {active === "values" ? (
            <AdminBlock title="Values">
              <Input label="Kicker" value={form.valuesKicker} onChange={(event) => setField("valuesKicker", event.target.value)} />
              <Input label="Heading" value={form.valuesHeading} onChange={(event) => setField("valuesHeading", event.target.value)} />
              <Textarea label="Subheading" value={form.valuesSubheading} onChange={(event) => setField("valuesSubheading", event.target.value)} />
              <RepeatList
                title="Value bullets"
                addLabel="Add value"
                items={values}
                onAdd={() => setValues((current) => [...current, { title: "", description: "", icon: "shield" }])}
                onRemove={(index) => setValues((current) => current.filter((_, i) => i !== index))}
                render={(item, index) => (
                  <ItemEditor item={item} onChange={(next) => setValues((current) => current.map((row, i) => (i === index ? next : row)))} />
                )}
              />
            </AdminBlock>
          ) : null}

          {active === "steps" ? (
            <AdminBlock title="How we work">
              <Input label="Kicker" value={form.stepsKicker} onChange={(event) => setField("stepsKicker", event.target.value)} />
              <Input
                label="Heading"
                value={form.stepsHeading}
                onChange={(event) => setField("stepsHeading", event.target.value)}
                hint="Use // to split navy / red."
              />
              <RepeatList
                title="Steps"
                addLabel="Add step"
                items={steps}
                onAdd={() => setSteps((current) => [...current, { title: "", description: "", icon: "" }])}
                onRemove={(index) => setSteps((current) => current.filter((_, i) => i !== index))}
                render={(item, index) => (
                  <div className="grid gap-3">
                    <Input
                      label={`Step ${index + 1} title`}
                      value={item.title}
                      onChange={(event) =>
                        setSteps((current) => current.map((row, i) => (i === index ? { ...row, title: event.target.value } : row)))
                      }
                    />
                    <Textarea
                      label="Line"
                      value={item.description}
                      onChange={(event) =>
                        setSteps((current) => current.map((row, i) => (i === index ? { ...row, description: event.target.value } : row)))
                      }
                    />
                  </div>
                )}
              />
            </AdminBlock>
          ) : null}

          {active === "commitment" ? (
            <AdminBlock title="Commitment">
              <Input label="Kicker" value={form.commitmentKicker} onChange={(event) => setField("commitmentKicker", event.target.value)} />
              <Input label="Heading" value={form.commitmentHeading} onChange={(event) => setField("commitmentHeading", event.target.value)} />
              <Textarea label="Paragraph" value={form.commitmentBody} onChange={(event) => setField("commitmentBody", event.target.value)} />
              <RepeatList
                title="Bullets"
                addLabel="Add bullet"
                items={commitmentItems}
                onAdd={() => setCommitmentItems((current) => [...current, { title: "" }])}
                onRemove={(index) => setCommitmentItems((current) => current.filter((_, i) => i !== index))}
                render={(item, index) => (
                  <Input
                    label="Bullet"
                    value={item.title}
                    onChange={(event) =>
                      setCommitmentItems((current) => current.map((row, i) => (i === index ? { title: event.target.value } : row)))
                    }
                  />
                )}
              />
            </AdminBlock>
          ) : null}

          {active === "story" ? (
            <AdminBlock title="Story band">
              <Input label="Kicker" value={form.storyBandKicker} onChange={(event) => setField("storyBandKicker", event.target.value)} />
              <Input label="Heading" value={form.storyBandHeading} onChange={(event) => setField("storyBandHeading", event.target.value)} />
              <Textarea label="Paragraph" value={form.storyBandBody} onChange={(event) => setField("storyBandBody", event.target.value)} />
              <ImageUploadField label="Story image" folder="about" value={form.storyBandImageUrl} onChange={(url) => setField("storyBandImageUrl", url)} />
            </AdminBlock>
          ) : null}

          {active === "cta" ? (
            <AdminBlock title="Closing CTA">
              <Input label="Heading" value={form.ctaHeading} onChange={(event) => setField("ctaHeading", event.target.value)} />
              <Textarea label="Paragraph" value={form.ctaBody} onChange={(event) => setField("ctaBody", event.target.value)} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Primary button" value={form.ctaPrimaryLabel} onChange={(event) => setField("ctaPrimaryLabel", event.target.value)} />
                <Input label="Primary URL" value={form.ctaPrimaryUrl} onChange={(event) => setField("ctaPrimaryUrl", event.target.value)} />
                <Input label="Secondary button" value={form.ctaSecondaryLabel} onChange={(event) => setField("ctaSecondaryLabel", event.target.value)} />
                <Input label="Secondary URL" value={form.ctaSecondaryUrl} onChange={(event) => setField("ctaSecondaryUrl", event.target.value)} />
              </div>
            </AdminBlock>
          ) : null}

          {active === "stats" ? (
            <AdminBlock title="Statistics" hint="These figures also appear on the globe and the compliance page.">
              <RepeatList
                title="Figures"
                addLabel="Add statistic"
                items={stats}
                onAdd={() => setStats((current) => [...current, { label: "", value: "" }])}
                onRemove={(index) => setStats((current) => current.filter((_, i) => i !== index))}
                render={(item, index) => (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input
                      label="Value"
                      value={item.value}
                      onChange={(event) =>
                        setStats((current) => current.map((row, i) => (i === index ? { ...row, value: event.target.value } : row)))
                      }
                    />
                    <Input
                      label="Label"
                      value={item.label}
                      onChange={(event) =>
                        setStats((current) => current.map((row, i) => (i === index ? { ...row, label: event.target.value } : row)))
                      }
                    />
                  </div>
                )}
              />
            </AdminBlock>
          ) : null}

          {active === "gallery" ? (
            <AdminBlock title="Image gallery" hint="Optional extra photos. Upload, title, and caption each one.">
              <RepeatList
                title="Images"
                addLabel="Add image"
                items={gallery}
                onAdd={() =>
                  setGallery((current) => [...current, { imageUrl: "", title: "", caption: "", displayOrder: current.length }])
                }
                onRemove={(index) => setGallery((current) => current.filter((_, i) => i !== index))}
                render={(item, index) => (
                  <div className="grid gap-3">
                    <ImageUploadField
                      label={`Gallery image ${index + 1}`}
                      folder="about"
                      value={item.imageUrl}
                      onChange={(url) =>
                        setGallery((current) => current.map((row, i) => (i === index ? { ...row, imageUrl: url } : row)))
                      }
                    />
                    <Input
                      label="Title"
                      value={item.title}
                      onChange={(event) =>
                        setGallery((current) => current.map((row, i) => (i === index ? { ...row, title: event.target.value } : row)))
                      }
                    />
                    <Input
                      label="Caption"
                      value={item.caption}
                      onChange={(event) =>
                        setGallery((current) => current.map((row, i) => (i === index ? { ...row, caption: event.target.value } : row)))
                      }
                    />
                  </div>
                )}
              />
            </AdminBlock>
          ) : null}

          {active === "history" ? (
            <AdminBlock
              title="History & licenses"
              hint="Licenses, certifications, and awards also appear in the compliance regulatory block."
            >
              <Textarea label="History" value={form.history} onChange={(event) => setField("history", event.target.value)} />
              <Input
                label="Licenses (comma separated)"
                value={form.licenses}
                onChange={(event) => setField("licenses", event.target.value)}
              />
              <Input
                label="Certifications"
                value={form.certifications}
                onChange={(event) => setField("certifications", event.target.value)}
              />
              <Input label="Awards" value={form.awards} onChange={(event) => setField("awards", event.target.value)} />
              <p className="text-sm text-ink-muted">
                Full compliance page copy and photos:{" "}
                <Link className="font-medium text-navy underline" to="/admin/compliance">
                  open Compliance
                </Link>
                .
              </p>
            </AdminBlock>
          ) : null}

          {active === "teamAbout" ? (
            <AdminBlock title="Team on About" hint="The team intro band that can appear on /about.">
              <Input label="Kicker" value={form.teamAboutKicker} onChange={(event) => setField("teamAboutKicker", event.target.value)} />
              <Input label="Heading" value={form.teamAboutHeading} onChange={(event) => setField("teamAboutHeading", event.target.value)} />
              <Textarea label="Intro" value={form.teamAboutIntro} onChange={(event) => setField("teamAboutIntro", event.target.value)} />
              <Textarea label="Body" value={form.teamAboutBody} onChange={(event) => setField("teamAboutBody", event.target.value)} />
              <Input label="Motto" value={form.teamMotto} onChange={(event) => setField("teamMotto", event.target.value)} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Input
                  label="Link label"
                  value={form.teamAboutLinkLabel}
                  onChange={(event) => setField("teamAboutLinkLabel", event.target.value)}
                />
                <Input
                  label="Link URL"
                  value={form.teamAboutLinkUrl}
                  onChange={(event) => setField("teamAboutLinkUrl", event.target.value)}
                />
              </div>
            </AdminBlock>
          ) : null}

          {active === "board" ? (
            <AdminBlock title="Board of Directors page" hint="Titles on /about/board. Add each director under Board & Team.">
              <Input label="Kicker" value={form.boardKicker} onChange={(event) => setField("boardKicker", event.target.value)} />
              <Input label="Heading" value={form.boardHeading} onChange={(event) => setField("boardHeading", event.target.value)} />
              <Textarea label="Description" value={form.boardDescription} onChange={(event) => setField("boardDescription", event.target.value)} />
            </AdminBlock>
          ) : null}

          {active === "team" ? (
            <AdminBlock title="Our Team page" hint="Titles on /about/team. Add each person under Board & Team.">
              <Input label="Kicker" value={form.teamKicker} onChange={(event) => setField("teamKicker", event.target.value)} />
              <Input label="Page heading" value={form.teamHeading} onChange={(event) => setField("teamHeading", event.target.value)} />
              <Textarea label="Page description" value={form.teamDescription} onChange={(event) => setField("teamDescription", event.target.value)} />
              <Input
                label="Top Leaders heading"
                value={form.teamLeadHeading}
                onChange={(event) => setField("teamLeadHeading", event.target.value)}
              />
              <Input
                label="Other employees heading"
                value={form.teamStaffHeading}
                onChange={(event) => setField("teamStaffHeading", event.target.value)}
              />
            </AdminBlock>
          ) : null}

          {active === "bestof" ? (
            <AdminBlock title="Best of company" hint="Optional titles kept in the CMS. The current About page uses the sections above instead.">
              <Input label="Kicker" value={form.bestOfKicker} onChange={(event) => setField("bestOfKicker", event.target.value)} />
              <Input label="Heading" value={form.bestOfHeading} onChange={(event) => setField("bestOfHeading", event.target.value)} />
              <Textarea
                label="Subheading"
                value={form.bestOfSubheading}
                onChange={(event) => setField("bestOfSubheading", event.target.value)}
              />
            </AdminBlock>
          ) : null}

          <div className="admin-form-save">
            <Button type="submit" disabled={save.isPending}>
              {save.isPending ? "Saving…" : `Save ${currentLabel}`}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function IconField({ value, onChange }: { value?: string; onChange: (value: string) => void }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-navy">Icon</span>
      <select
        className="w-full rounded-md border border-navy/15 px-3 py-2.5 text-sm"
        value={value || "shield"}
        onChange={(event) => onChange(event.target.value)}
      >
        {ABOUT_ICON_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function ItemEditor({ item, onChange }: { item: WhyItem; onChange: (item: WhyItem) => void }) {
  return (
    <div className="grid gap-3">
      <Input label="Title" value={item.title} onChange={(event) => onChange({ ...item, title: event.target.value })} />
      <IconField value={item.icon} onChange={(icon) => onChange({ ...item, icon })} />
      <Textarea label="Description" value={item.description} onChange={(event) => onChange({ ...item, description: event.target.value })} />
    </div>
  );
}

function AdminBlock({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="space-y-4 rounded-2xl border border-navy/10 bg-white p-4 shadow-[0_12px_28px_-22px_rgba(21,23,70,0.45)] sm:p-5">
      <div>
        <h2 className="font-display text-xl text-navy">{title}</h2>
        {hint ? <p className="mt-1 text-sm text-ink-muted">{hint}</p> : null}
      </div>
      {children}
    </section>
  );
}

function RepeatList<T>({
  title,
  addLabel,
  items,
  onAdd,
  onRemove,
  render
}: {
  title: string;
  addLabel: string;
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  render: (item: T, index: number) => ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-medium text-navy">{title}</h3>
        <Button type="button" variant="secondary" onClick={onAdd}>
          <Plus className="h-4 w-4" />
          {addLabel}
        </Button>
      </div>
      {items.length === 0 ? <p className="text-sm text-ink-muted">None yet.</p> : null}
      {items.map((item, index) => (
        <div key={index} className="relative rounded-xl border border-navy/10 p-4 pr-12">
          <span className="absolute right-11 top-3 text-[0.68rem] font-semibold text-ink-muted">{index + 1}</span>
          <button
            type="button"
            className="absolute right-3 top-3 text-ink-muted hover:text-gold"
            onClick={() => onRemove(index)}
            aria-label="Remove"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          {render(item, index)}
        </div>
      ))}
    </div>
  );
}
