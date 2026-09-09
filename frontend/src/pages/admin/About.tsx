import { useEffect, useState, type ReactNode } from "react";
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
import { splitCsv } from "@/utils/cn";
import type { AboutGalleryImage, StatItem, WhyItem } from "@/types/content";
import { ABOUT_ICON_OPTIONS } from "@/utils/about-icons";

interface AboutForm {
  heroKicker: string;
  heroTitle: string;
  heroDescription: string;
  heroImageUrl: string;
  introduction: string;
  mission: string;
  vision: string;
  history: string;
  bestOfKicker: string;
  bestOfHeading: string;
  bestOfSubheading: string;
  storyKicker: string;
  storyHeading: string;
  boardKicker: string;
  boardHeading: string;
  boardDescription: string;
  teamKicker: string;
  teamHeading: string;
  teamDescription: string;
  teamLeadHeading: string;
  teamStaffHeading: string;
  certifications: string;
  licenses: string;
  awards: string;
}

const emptyForm: AboutForm = {
  heroKicker: "Our institution",
  heroTitle: "",
  heroDescription: "",
  heroImageUrl: "",
  introduction: "",
  mission: "",
  vision: "",
  history: "",
  bestOfKicker: "Best of company",
  bestOfHeading: "Best of Remit2Nepal",
  bestOfSubheading: "",
  storyKicker: "The company",
  storyHeading: "Who we are",
  boardKicker: "Governance",
  boardHeading: "Board of Directors",
  boardDescription: "",
  teamKicker: "Operations",
  teamHeading: "Our Team",
  teamDescription: "",
  teamLeadHeading: "Managers & top employees",
  teamStaffHeading: "Our people",
  certifications: "",
  licenses: "",
  awards: ""
};

export default function About() {
  const { push } = useToast();
  const client = useQueryClient();
  const query = useQuery({ queryKey: ["admin-about"], queryFn: adminApi.about.get });
  const [form, setForm] = useState<AboutForm>(emptyForm);
  const [values, setValues] = useState<WhyItem[]>([]);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [gallery, setGallery] = useState<AboutGalleryImage[]>([]);

  useEffect(() => {
    if (!query.data) return;
    setForm({
      heroKicker: query.data.heroKicker || "Our institution",
      heroTitle: query.data.heroTitle || "",
      heroDescription: query.data.heroDescription || "",
      heroImageUrl: query.data.heroImageUrl || "",
      introduction: query.data.introduction,
      mission: query.data.mission,
      vision: query.data.vision,
      history: query.data.history,
      bestOfKicker: query.data.bestOfKicker || "Best of company",
      bestOfHeading: query.data.bestOfHeading || "Best of Remit2Nepal",
      bestOfSubheading: query.data.bestOfSubheading || "",
      storyKicker: query.data.storyKicker || "The company",
      storyHeading: query.data.storyHeading || "Who we are",
      boardKicker: query.data.boardKicker || "Governance",
      boardHeading: query.data.boardHeading || "Board of Directors",
      boardDescription: query.data.boardDescription || "",
      teamKicker: query.data.teamKicker || "Operations",
      teamHeading: query.data.teamHeading || "Our Team",
      teamDescription: query.data.teamDescription || "",
      teamLeadHeading: query.data.teamLeadHeading || "Managers & top employees",
      teamStaffHeading: query.data.teamStaffHeading || "Our people",
      certifications: (query.data.certifications ?? []).join(", "),
      licenses: (query.data.licenses ?? []).join(", "),
      awards: (query.data.awards ?? []).join(", ")
    });
    setValues(query.data.coreValues ?? []);
    setStats(query.data.statistics ?? []);
    setGallery(query.data.galleryImages ?? []);
  }, [query.data]);

  const setField = (key: keyof AboutForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const save = useMutation({
    mutationFn: () =>
      adminApi.about.update({
        ...form,
        coreValues: values.filter((item) => item.title.trim()),
        statistics: stats.filter((item) => item.label.trim() && item.value.trim()),
        galleryImages: gallery.filter((item) => item.imageUrl.trim()),
        certifications: splitCsv(form.certifications),
        licenses: splitCsv(form.licenses),
        awards: splitCsv(form.awards)
      }),
    onSuccess: async () => {
      push({ title: "About page updated", tone: "success" });
      await client.invalidateQueries({ queryKey: ["admin-about"] });
      await client.invalidateQueries({ queryKey: ["public", "site"] });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  if (query.isLoading) return <SkeletonLines />;

  return (
    <div>
      <PageHeader
        title="About the company"
        description="Everything on /about — hero, Best of company, story, icons, and gallery. Chairman is not shown on this page."
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "About" }]}
      />
      <form
        className="max-w-4xl space-y-8"
        onSubmit={(event) => {
          event.preventDefault();
          save.mutate();
        }}
      >
        <AdminBlock title="Hero">
          <Input label="Kicker" value={form.heroKicker} onChange={(event) => setField("heroKicker", event.target.value)} />
          <Input label="Title" value={form.heroTitle} onChange={(event) => setField("heroTitle", event.target.value)} />
          <Textarea label="Description" value={form.heroDescription} onChange={(event) => setField("heroDescription", event.target.value)} />
          <ImageUploadField
            label="Hero / banner image"
            folder="about"
            value={form.heroImageUrl}
            onChange={(url) => setField("heroImageUrl", url)}
            hint="Wide photo. It sits behind the About title."
          />
        </AdminBlock>

        <AdminBlock title="Company story">
          <Input label="Kicker" value={form.storyKicker} onChange={(event) => setField("storyKicker", event.target.value)} />
          <Input label="Heading" value={form.storyHeading} onChange={(event) => setField("storyHeading", event.target.value)} />
          <Textarea label="Introduction" value={form.introduction} onChange={(event) => setField("introduction", event.target.value)} />
          <Textarea label="Mission" value={form.mission} onChange={(event) => setField("mission", event.target.value)} />
          <Textarea label="Vision" value={form.vision} onChange={(event) => setField("vision", event.target.value)} />
          <Textarea label="History" value={form.history} onChange={(event) => setField("history", event.target.value)} />
        </AdminBlock>

        <AdminBlock title="Best of company">
          <Input label="Kicker" value={form.bestOfKicker} onChange={(event) => setField("bestOfKicker", event.target.value)} />
          <Input label="Heading" value={form.bestOfHeading} onChange={(event) => setField("bestOfHeading", event.target.value)} />
          <Textarea label="Subheading" value={form.bestOfSubheading} onChange={(event) => setField("bestOfSubheading", event.target.value)} />
          <RepeatList
            title="Statistics"
            addLabel="Add statistic"
            items={stats}
            onAdd={() => setStats((current) => [...current, { label: "", value: "" }])}
            onRemove={(index) => setStats((current) => current.filter((_, i) => i !== index))}
            render={(item, index) => (
              <div className="grid gap-3 sm:grid-cols-2">
                <Input label="Value" value={item.value} onChange={(event) => setStats((current) => current.map((row, i) => (i === index ? { ...row, value: event.target.value } : row)))} />
                <Input label="Label" value={item.label} onChange={(event) => setStats((current) => current.map((row, i) => (i === index ? { ...row, label: event.target.value } : row)))} />
              </div>
            )}
          />
          <RepeatList
            title="Values"
            addLabel="Add value"
            items={values}
            onAdd={() => setValues((current) => [...current, { title: "", description: "", icon: "shield" }])}
            onRemove={(index) => setValues((current) => current.filter((_, i) => i !== index))}
            render={(item, index) => (
              <div className="grid gap-3">
                <Input label="Title" value={item.title} onChange={(event) => setValues((current) => current.map((row, i) => (i === index ? { ...row, title: event.target.value } : row)))} />
                <label className="block space-y-1.5">
                  <span className="text-sm font-medium text-navy">Icon</span>
                  <select
                    className="w-full rounded-md border border-navy/15 px-3 py-2.5 text-sm"
                    value={item.icon || "shield"}
                    onChange={(event) => setValues((current) => current.map((row, i) => (i === index ? { ...row, icon: event.target.value } : row)))}
                  >
                    {ABOUT_ICON_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <Textarea label="Description" value={item.description} onChange={(event) => setValues((current) => current.map((row, i) => (i === index ? { ...row, description: event.target.value } : row)))} />
              </div>
            )}
          />
        </AdminBlock>

        <AdminBlock title="Board of Directors page">
          <p className="text-sm text-ink-muted">Page title on /about/board. Add each director under Admin → Board & Team.</p>
          <Input label="Kicker" value={form.boardKicker} onChange={(event) => setField("boardKicker", event.target.value)} />
          <Input label="Heading" value={form.boardHeading} onChange={(event) => setField("boardHeading", event.target.value)} />
          <Textarea label="Description" value={form.boardDescription} onChange={(event) => setField("boardDescription", event.target.value)} />
        </AdminBlock>

        <AdminBlock title="Our Team page">
          <Input label="Kicker" value={form.teamKicker} onChange={(event) => setField("teamKicker", event.target.value)} />
          <Input label="Heading" value={form.teamHeading} onChange={(event) => setField("teamHeading", event.target.value)} />
          <Textarea label="Description" value={form.teamDescription} onChange={(event) => setField("teamDescription", event.target.value)} />
          <Input label="Managers / top employees heading" value={form.teamLeadHeading} onChange={(event) => setField("teamLeadHeading", event.target.value)} />
          <Input label="Other employees heading" value={form.teamStaffHeading} onChange={(event) => setField("teamStaffHeading", event.target.value)} />
        </AdminBlock>

        <AdminBlock title="Image gallery">
          <p className="text-sm text-ink-muted">These photos appear in the Best of company section. Upload, title, and caption each one.</p>
          <RepeatList
            title="Images"
            addLabel="Add image"
            items={gallery}
            onAdd={() => setGallery((current) => [...current, { imageUrl: "", title: "", caption: "", displayOrder: current.length }])}
            onRemove={(index) => setGallery((current) => current.filter((_, i) => i !== index))}
            render={(item, index) => (
              <div className="grid gap-3">
                <ImageUploadField
                  label={`Gallery image ${index + 1}`}
                  folder="about"
                  value={item.imageUrl}
                  onChange={(url) => setGallery((current) => current.map((row, i) => (i === index ? { ...row, imageUrl: url } : row)))}
                />
                <Input label="Title" value={item.title} onChange={(event) => setGallery((current) => current.map((row, i) => (i === index ? { ...row, title: event.target.value } : row)))} />
                <Input label="Caption" value={item.caption} onChange={(event) => setGallery((current) => current.map((row, i) => (i === index ? { ...row, caption: event.target.value } : row)))} />
              </div>
            )}
          />
        </AdminBlock>

        <AdminBlock title="Compliance">
          <Input label="Licenses (comma separated)" value={form.licenses} onChange={(event) => setField("licenses", event.target.value)} />
          <Input label="Certifications" value={form.certifications} onChange={(event) => setField("certifications", event.target.value)} />
          <Input label="Awards" value={form.awards} onChange={(event) => setField("awards", event.target.value)} />
        </AdminBlock>

        <Button type="submit" disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save about page"}
        </Button>
      </form>
    </div>
  );
}

function AdminBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4 rounded-2xl border border-navy/10 bg-white p-5 shadow-card">
      <h2 className="font-display text-xl text-navy">{title}</h2>
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
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-navy">{title}</h3>
        <Button type="button" variant="secondary" onClick={onAdd}>
          <Plus className="h-4 w-4" />
          {addLabel}
        </Button>
      </div>
      {items.length === 0 ? <p className="text-sm text-ink-muted">None yet.</p> : null}
      {items.map((item, index) => (
        <div key={index} className="relative rounded-xl border border-navy/10 p-4">
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
