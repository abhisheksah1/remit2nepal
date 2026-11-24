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
import {
  COMPLIANCE_ADMIN_SECTIONS,
  COMPLIANCE_DEFAULTS,
  isComplianceSectionOn,
  resolveCompliancePage
} from "@/content/compliance-defaults";
import type { CompliancePage, CompliancePhotoItem, WhyItem } from "@/types/content";
import { ABOUT_ICON_OPTIONS } from "@/utils/about-icons";

type PageForm = ReturnType<typeof resolveCompliancePage>;

export default function Compliance() {
  const { push } = useToast();
  const client = useQueryClient();
  const query = useQuery({ queryKey: ["admin-about"], queryFn: adminApi.about.get });
  const [form, setForm] = useState<PageForm | null>(null);
  const [active, setActive] = useState<(typeof COMPLIANCE_ADMIN_SECTIONS)[number]["id"]>("hero");

  useEffect(() => {
    if (!query.data) return;
    setForm(resolveCompliancePage(query.data.compliancePage));
  }, [query.data]);

  const setField = <K extends keyof PageForm>(key: K, value: PageForm[K]) => {
    setForm((current) => (current ? { ...current, [key]: value } : current));
  };

  const setPhoto = (key: keyof PageForm, next: CompliancePhotoItem) => {
    setForm((current) => (current ? { ...current, [key]: next } : current));
  };

  const save = useMutation({
    mutationFn: () => {
      if (!form) throw new Error("Form is not ready");
      const cleanItems = (items: WhyItem[]) => items.filter((item) => item.title.trim()).map((item) => ({
        title: item.title.trim(),
        description: item.description?.trim() || "",
        icon: item.icon || "shield"
      }));
      const cleanList = (items: string[]) => items.map((item) => item.trim()).filter(Boolean);
      const payload: CompliancePage = {
        ...form,
        commitmentItems: cleanItems(form.commitmentItems),
        kycSteps: cleanItems(form.kycSteps),
        amlCards: cleanItems(form.amlCards),
        fraudCards: cleanItems(form.fraudCards),
        privacyCards: cleanItems(form.privacyCards),
        screenPills: cleanList(form.screenPills),
        protectItems: cleanList(form.protectItems),
        teamFlow: cleanList(form.teamFlow)
      };
      return adminApi.about.update({ compliancePage: payload });
    },
    onSuccess: async () => {
      push({ title: "Compliance page updated", tone: "success" });
      await client.invalidateQueries({ queryKey: ["admin-about"] });
      await client.invalidateQueries({ queryKey: ["public", "site"] });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  const setSectionOn = (id: string, visible: boolean) => {
    if (!form) return;
    const current = form.disabledSections.filter((item) => item !== id);
    setField("disabledSections", visible ? current : [...current, id]);
  };

  if (query.isLoading || !form) return <SkeletonLines />;

  const siteSection = COMPLIANCE_ADMIN_SECTIONS.find((item) => item.id === active && item.id !== "seo");
  const sectionOn = siteSection ? isComplianceSectionOn(form.disabledSections, siteSection.id) : true;

  return (
    <div>
      <PageHeader
        title="Compliance page"
        description="Open one section at a time. Each block on /about/compliance is separate: copy, photo, cards, and whether it shows on the website."
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Compliance" }]}
      />
      <p className="mb-6 text-sm text-ink-muted">
        Licenses, certifications, awards, and trust numbers are edited on{" "}
        <Link className="font-medium text-navy underline" to="/admin/about">
          About
        </Link>
        . Team photos come from{" "}
        <Link className="font-medium text-navy underline" to="/admin/team">
          Board & Team
        </Link>
        . Use // in a title to split navy and red words.
      </p>
      <div className="grid items-start gap-6 xl:grid-cols-[15.5rem_minmax(0,1fr)]">
        <nav className="rounded-2xl border border-navy/10 bg-white p-2 xl:sticky xl:top-24" aria-label="Compliance sections">
          {COMPLIANCE_ADMIN_SECTIONS.map((item) => {
            const hidden = item.id !== "seo" && !isComplianceSectionOn(form.disabledSections, item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(item.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium ${
                  active === item.id ? "bg-navy text-white" : "text-navy hover:bg-navy/5"
                }`}
              >
                <span>{item.label}</span>
                {hidden ? <span className={`text-[0.68rem] ${active === item.id ? "text-white/70" : "text-ink-muted"}`}>Hidden</span> : null}
              </button>
            );
          })}
        </nav>
      <form
        className="max-w-4xl space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          save.mutate();
        }}
      >
        {siteSection ? (
          <label className="flex items-center gap-2 rounded-xl border border-navy/10 bg-white px-4 py-3 text-sm text-navy">
            <input
              type="checkbox"
              checked={sectionOn}
              onChange={(event) => setSectionOn(siteSection.id, event.target.checked)}
            />
            Show this section on the website
          </label>
        ) : null}

        {active === "seo" ? (
        <AdminBlock title="SEO">
          <Input label="Browser title" value={form.seoTitle} onChange={(event) => setField("seoTitle", event.target.value)} />
          <Textarea label="Meta description" value={form.seoDescription} onChange={(event) => setField("seoDescription", event.target.value)} />
        </AdminBlock>
        ) : null}

        {active === "hero" ? (
        <AdminBlock title="Hero">
          <Input label="Kicker" value={form.heroKicker} onChange={(event) => setField("heroKicker", event.target.value)} />
          <Input
            label="Title"
            value={form.heroTitle}
            onChange={(event) => setField("heroTitle", event.target.value)}
            hint="Use // to color the next phrase red, e.g. Compliance You Can // Trust"
          />
          <Textarea label="Body" value={form.heroBody} onChange={(event) => setField("heroBody", event.target.value)} />
          <Input label="Badge" value={form.heroBadge} onChange={(event) => setField("heroBadge", event.target.value)} />
          <PhotoFields label="Hero photo" folder="compliance" value={form.heroPhoto} onChange={(photo) => setPhoto("heroPhoto", photo)} />
        </AdminBlock>
        ) : null}

        {active === "commitment" ? (
        <AdminBlock title="Commitment">
          <Input label="Kicker" value={form.commitmentKicker} onChange={(event) => setField("commitmentKicker", event.target.value)} />
          <Input label="Heading" value={form.commitmentHeading} onChange={(event) => setField("commitmentHeading", event.target.value)} />
          <Textarea label="Body" value={form.commitmentBody} onChange={(event) => setField("commitmentBody", event.target.value)} />
          <PhotoFields label="Section photo" folder="compliance" value={form.commitmentPhoto} onChange={(photo) => setPhoto("commitmentPhoto", photo)} />
          <ItemList
            title="Commitment points"
            items={form.commitmentItems}
            onChange={(items) => setField("commitmentItems", items)}
            emptyItem={{ title: "", description: "", icon: "shield" }}
          />
        </AdminBlock>
        ) : null}

        {active === "kyc" ? (
        <AdminBlock title="KYC">
          <Input label="Kicker" value={form.kycKicker} onChange={(event) => setField("kycKicker", event.target.value)} />
          <Input label="Heading" value={form.kycHeading} onChange={(event) => setField("kycHeading", event.target.value)} />
          <Textarea label="Body" value={form.kycBody} onChange={(event) => setField("kycBody", event.target.value)} />
          <Textarea label="Note under steps" value={form.kycNote} onChange={(event) => setField("kycNote", event.target.value)} />
          <PhotoFields label="KYC photo 1" folder="compliance" value={form.kycPhoto} onChange={(photo) => setPhoto("kycPhoto", photo)} />
          <PhotoFields label="KYC photo 2" folder="compliance" value={form.kycPhoto2} onChange={(photo) => setPhoto("kycPhoto2", photo)} />
          <ItemList
            title="KYC steps"
            items={form.kycSteps}
            onChange={(items) => setField("kycSteps", items)}
            emptyItem={{ title: "", description: "", icon: "check" }}
          />
        </AdminBlock>
        ) : null}

        {active === "aml" ? (
        <AdminBlock title="AML / CFT">
          <Input label="Kicker" value={form.amlKicker} onChange={(event) => setField("amlKicker", event.target.value)} />
          <Input label="Heading" value={form.amlHeading} onChange={(event) => setField("amlHeading", event.target.value)} />
          <Textarea label="Body" value={form.amlBody} onChange={(event) => setField("amlBody", event.target.value)} />
          <PhotoFields label="Section photo" folder="compliance" value={form.amlPhoto} onChange={(photo) => setPhoto("amlPhoto", photo)} />
          <ItemList
            title="AML cards"
            items={form.amlCards}
            onChange={(items) => setField("amlCards", items)}
            emptyItem={{ title: "", description: "", icon: "activity" }}
          />
        </AdminBlock>
        ) : null}

        {active === "screening" ? (
        <AdminBlock title="Sanctions screening">
          <Input label="Kicker" value={form.screenKicker} onChange={(event) => setField("screenKicker", event.target.value)} />
          <Input label="Heading" value={form.screenHeading} onChange={(event) => setField("screenHeading", event.target.value)} />
          <Textarea label="Body" value={form.screenBody} onChange={(event) => setField("screenBody", event.target.value)} />
          <PhotoFields label="Section photo" folder="compliance" value={form.screenPhoto} onChange={(photo) => setPhoto("screenPhoto", photo)} />
          <StringList title="Pills" addLabel="Add pill" items={form.screenPills} onChange={(items) => setField("screenPills", items)} />
        </AdminBlock>
        ) : null}

        {active === "fraud" ? (
        <AdminBlock title="Fraud prevention">
          <Input label="Kicker" value={form.fraudKicker} onChange={(event) => setField("fraudKicker", event.target.value)} />
          <Input label="Heading" value={form.fraudHeading} onChange={(event) => setField("fraudHeading", event.target.value)} />
          <Textarea label="Body" value={form.fraudBody} onChange={(event) => setField("fraudBody", event.target.value)} />
          <PhotoFields label="Section photo" folder="compliance" value={form.fraudPhoto} onChange={(photo) => setPhoto("fraudPhoto", photo)} />
          <ItemList
            title="Fraud cards"
            items={form.fraudCards}
            onChange={(items) => setField("fraudCards", items)}
            emptyItem={{ title: "", description: "", icon: "fingerprint" }}
          />
        </AdminBlock>
        ) : null}

        {active === "privacy" ? (
        <AdminBlock title="Data privacy">
          <Input label="Kicker" value={form.privacyKicker} onChange={(event) => setField("privacyKicker", event.target.value)} />
          <Input label="Heading" value={form.privacyHeading} onChange={(event) => setField("privacyHeading", event.target.value)} />
          <Textarea label="Body" value={form.privacyBody} onChange={(event) => setField("privacyBody", event.target.value)} />
          <PhotoFields label="Section photo" folder="compliance" value={form.privacyPhoto} onChange={(photo) => setPhoto("privacyPhoto", photo)} />
          <ItemList
            title="Privacy cards"
            items={form.privacyCards}
            onChange={(items) => setField("privacyCards", items)}
            emptyItem={{ title: "", description: "", icon: "lock" }}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Privacy link label" value={form.privacyLinkLabel} onChange={(event) => setField("privacyLinkLabel", event.target.value)} />
            <Input label="Privacy link URL" value={form.privacyLinkUrl} onChange={(event) => setField("privacyLinkUrl", event.target.value)} />
          </div>
        </AdminBlock>
        ) : null}

        {active === "protect" ? (
        <AdminBlock title="Customer protection">
          <Input label="Kicker" value={form.protectKicker} onChange={(event) => setField("protectKicker", event.target.value)} />
          <Input label="Heading" value={form.protectHeading} onChange={(event) => setField("protectHeading", event.target.value)} />
          <Textarea label="Body" value={form.protectBody} onChange={(event) => setField("protectBody", event.target.value)} />
          <PhotoFields label="Section photo" folder="compliance" value={form.protectPhoto} onChange={(photo) => setPhoto("protectPhoto", photo)} />
          <StringList title="Protection points" addLabel="Add point" items={form.protectItems} onChange={(items) => setField("protectItems", items)} />
        </AdminBlock>
        ) : null}

        {active === "report" ? (
        <AdminBlock title="Report an issue">
          <Input label="Kicker" value={form.reportKicker} onChange={(event) => setField("reportKicker", event.target.value)} />
          <Input label="Heading" value={form.reportHeading} onChange={(event) => setField("reportHeading", event.target.value)} />
          <Textarea label="Body" value={form.reportBody} onChange={(event) => setField("reportBody", event.target.value)} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Primary button" value={form.reportPrimaryLabel} onChange={(event) => setField("reportPrimaryLabel", event.target.value)} />
            <Input label="Primary URL" value={form.reportPrimaryUrl} onChange={(event) => setField("reportPrimaryUrl", event.target.value)} />
            <Input label="Secondary button" value={form.reportSecondaryLabel} onChange={(event) => setField("reportSecondaryLabel", event.target.value)} />
            <Input label="Secondary URL" value={form.reportSecondaryUrl} onChange={(event) => setField("reportSecondaryUrl", event.target.value)} />
          </div>
        </AdminBlock>
        ) : null}

        {active === "team" ? (
        <AdminBlock title="Compliance team">
          <Input label="Kicker" value={form.teamKicker} onChange={(event) => setField("teamKicker", event.target.value)} />
          <Input label="Heading" value={form.teamHeading} onChange={(event) => setField("teamHeading", event.target.value)} />
          <Textarea label="Body" value={form.teamBody} onChange={(event) => setField("teamBody", event.target.value)} />
          <PhotoFields
            label="Fallback photo"
            folder="compliance"
            value={form.teamPhoto}
            onChange={(photo) => setPhoto("teamPhoto", photo)}
            hint="Shown when no team member has Compliance / KYC / AML in their title or bio."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Team link label" value={form.teamLinkLabel} onChange={(event) => setField("teamLinkLabel", event.target.value)} />
            <Input label="Team link URL" value={form.teamLinkUrl} onChange={(event) => setField("teamLinkUrl", event.target.value)} />
          </div>
          <StringList title="Flow steps" addLabel="Add step" items={form.teamFlow} onChange={(items) => setField("teamFlow", items)} />
        </AdminBlock>
        ) : null}

        {active === "regulatory" ? (
        <AdminBlock title="Regulatory information">
          <Input
            label="Regulator name"
            value={form.regulatorName}
            onChange={(event) => setField("regulatorName", event.target.value)}
            hint="Leave blank to detect Nepal Rastra Bank from licenses on the About page."
          />
          <Input label="Kicker" value={form.regKicker} onChange={(event) => setField("regKicker", event.target.value)} />
          <Input label="Heading" value={form.regHeading} onChange={(event) => setField("regHeading", event.target.value)} />
          <Textarea label="Body" value={form.regBody} onChange={(event) => setField("regBody", event.target.value)} />
          <Textarea label="Note" value={form.regNote} onChange={(event) => setField("regNote", event.target.value)} />
          <PhotoFields label="Section photo" folder="compliance" value={form.regPhoto} onChange={(photo) => setPhoto("regPhoto", photo)} />
        </AdminBlock>
        ) : null}

        {active === "policies" ? (
        <AdminBlock title="Policies">
          <Input label="Kicker" value={form.docsKicker} onChange={(event) => setField("docsKicker", event.target.value)} />
          <Input label="Heading" value={form.docsHeading} onChange={(event) => setField("docsHeading", event.target.value)} />
          <Textarea label="Body" value={form.docsBody} onChange={(event) => setField("docsBody", event.target.value)} />
        </AdminBlock>
        ) : null}

        {active === "stats" ? (
        <AdminBlock title="Trust figures">
          <p className="text-sm text-ink-muted">
            The numbers in this strip are the About page statistics. Turn the strip on or off here, and edit the figures on{" "}
            <Link className="font-medium text-navy underline" to="/admin/about">
              About
            </Link>
            .
          </p>
        </AdminBlock>
        ) : null}

        {active === "cta" ? (
        <AdminBlock title="Closing CTA">
          <Input
            label="Heading"
            value={form.ctaHeading}
            onChange={(event) => setField("ctaHeading", event.target.value)}
            hint="Use // to color phrases red."
          />
          <Textarea label="Body" value={form.ctaBody} onChange={(event) => setField("ctaBody", event.target.value)} />
          <div className="grid gap-3 sm:grid-cols-2">
            <Input label="Primary button" value={form.ctaPrimaryLabel} onChange={(event) => setField("ctaPrimaryLabel", event.target.value)} />
            <Input label="Primary URL" value={form.ctaPrimaryUrl} onChange={(event) => setField("ctaPrimaryUrl", event.target.value)} />
            <Input label="Secondary button" value={form.ctaSecondaryLabel} onChange={(event) => setField("ctaSecondaryLabel", event.target.value)} />
            <Input label="Secondary URL" value={form.ctaSecondaryUrl} onChange={(event) => setField("ctaSecondaryUrl", event.target.value)} />
          </div>
        </AdminBlock>
        ) : null}

        <div className="admin-form-save">
          <Button type="button" variant="secondary" onClick={() => setForm(COMPLIANCE_DEFAULTS)}>
            Restore default copy
          </Button>
          <Button type="submit" disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save this section"}
          </Button>
        </div>
      </form>
      </div>
    </div>
  );
}

function PhotoFields({
  label,
  folder,
  value,
  hint,
  onChange
}: {
  label: string;
  folder: string;
  value: CompliancePhotoItem;
  hint?: string;
  onChange: (photo: CompliancePhotoItem) => void;
}) {
  return (
    <div className="grid gap-3 rounded-xl border border-navy/10 p-4">
      <ImageUploadField
        label={label}
        folder={folder}
        value={value.url || ""}
        hint={hint}
        onChange={(url) => onChange({ ...value, url })}
      />
      <Input label="Alt text" value={value.alt || ""} onChange={(event) => onChange({ ...value, alt: event.target.value })} />
      <Input label="Overlay label" value={value.overlay || ""} onChange={(event) => onChange({ ...value, overlay: event.target.value })} />
      <Input label="Photo credit" value={value.credit || ""} onChange={(event) => onChange({ ...value, credit: event.target.value })} />
    </div>
  );
}

function ItemList({
  title,
  items,
  emptyItem,
  onChange
}: {
  title: string;
  items: WhyItem[];
  emptyItem: WhyItem;
  onChange: (items: WhyItem[]) => void;
}) {
  return (
    <RepeatList
      title={title}
      addLabel="Add item"
      items={items}
      onAdd={() => onChange([...items, { ...emptyItem }])}
      onRemove={(index) => onChange(items.filter((_, i) => i !== index))}
      render={(item, index) => (
        <div className="grid gap-3">
          <Input
            label="Title"
            value={item.title}
            onChange={(event) => onChange(items.map((row, i) => (i === index ? { ...row, title: event.target.value } : row)))}
          />
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-navy">Icon</span>
            <select
              className="w-full rounded-md border border-navy/15 px-3 py-2.5 text-sm"
              value={item.icon || "shield"}
              onChange={(event) => onChange(items.map((row, i) => (i === index ? { ...row, icon: event.target.value } : row)))}
            >
              {ABOUT_ICON_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <Textarea
            label="Description"
            value={item.description}
            onChange={(event) => onChange(items.map((row, i) => (i === index ? { ...row, description: event.target.value } : row)))}
          />
        </div>
      )}
    />
  );
}

function StringList({
  title,
  addLabel,
  items,
  onChange
}: {
  title: string;
  addLabel: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  return (
    <RepeatList
      title={title}
      addLabel={addLabel}
      items={items}
      onAdd={() => onChange([...items, ""])}
      onRemove={(index) => onChange(items.filter((_, i) => i !== index))}
      render={(item, index) => (
        <Input
          label={`${title} ${index + 1}`}
          value={item}
          onChange={(event) => onChange(items.map((row, i) => (i === index ? event.target.value : row)))}
        />
      )}
    />
  );
}

function AdminBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-4 rounded-2xl border border-navy/10 bg-white p-4 shadow-[0_12px_28px_-22px_rgba(21,23,70,0.45)] sm:p-5">
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
          <button type="button" className="absolute right-3 top-3 text-ink-muted hover:text-gold" onClick={() => onRemove(index)} aria-label="Remove">
            <Trash2 className="h-4 w-4" />
          </button>
          {render(item, index)}
        </div>
      ))}
    </div>
  );
}
