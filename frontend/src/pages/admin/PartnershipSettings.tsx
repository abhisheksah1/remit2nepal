import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { getErrorMessage } from "@/api/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { partnershipSettingsFormSchema, type PartnershipSettingsForm } from "@/schemas/partnership.schema";
import type { AgreementSlot } from "@/types/content";
import { downloadAuthorized } from "@/utils/download";

const agreementSlots: Array<{ slot: AgreementSlot; title: string; help: string }> = [
  { slot: "international", title: "International agreement", help: "International partners download, sign, and stamp this file." },
  { slot: "cooperative", title: "Cooperative agreement", help: "National Cooperative applicants download, sign, and stamp this file." },
  { slot: "privateAgent", title: "Private Agent agreement", help: "National Private Agent applicants download, sign, and stamp this file." }
];

function linesToList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function PartnershipSettings() {
  const { push } = useToast();
  const client = useQueryClient();
  const query = useQuery({ queryKey: ["admin-partnership-settings"], queryFn: adminApi.partnership.settings });
  const form = useForm<PartnershipSettingsForm>({ resolver: zodResolver(partnershipSettingsFormSchema) });

  useEffect(() => {
    if (!query.data) return;
    form.reset({
      formEnabled: query.data.formEnabled !== false,
      pageKicker: query.data.pageKicker,
      pageTitle: query.data.pageTitle,
      pageDescription: query.data.pageDescription,
      internationalEnabled: query.data.internationalEnabled !== false,
      internationalKicker: query.data.internationalKicker,
      internationalTitle: query.data.internationalTitle,
      internationalIntro: query.data.internationalIntro,
      internationalPointsText: (query.data.internationalPoints ?? []).join("\n"),
      nationalEnabled: query.data.nationalEnabled !== false,
      nationalKicker: query.data.nationalKicker,
      nationalTitle: query.data.nationalTitle,
      nationalIntro: query.data.nationalIntro,
      nationalPointsText: (query.data.nationalPoints ?? []).join("\n"),
      cooperativeEnabled: query.data.cooperativeEnabled !== false,
      cooperativeLabel: query.data.cooperativeLabel,
      privateAgentEnabled: query.data.privateAgentEnabled !== false,
      privateAgentLabel: query.data.privateAgentLabel,
      labelCompanyRegistration: query.data.documentLabels?.companyRegistration ?? "Register of company",
      labelPan: query.data.documentLabels?.pan ?? "PAN",
      labelTaxClearance: query.data.documentLabels?.taxClearance ?? "Tax clearance",
      labelCitizenshipBoth: query.data.documentLabels?.citizenshipBoth ?? "Citizenship of both sides",
      labelCheque: query.data.documentLabels?.cheque ?? "Cheque",
      labelSignedAgreement: query.data.documentLabels?.signedAgreement ?? "Signed and stamped company agreement"
    });
  }, [query.data, form]);

  const save = useMutation({
    mutationFn: (values: PartnershipSettingsForm) =>
      adminApi.partnership.updateSettings({
        formEnabled: values.formEnabled,
        pageKicker: values.pageKicker,
        pageTitle: values.pageTitle,
        pageDescription: values.pageDescription,
        internationalEnabled: values.internationalEnabled,
        internationalKicker: values.internationalKicker,
        internationalTitle: values.internationalTitle,
        internationalIntro: values.internationalIntro,
        internationalPoints: linesToList(values.internationalPointsText),
        nationalEnabled: values.nationalEnabled,
        nationalKicker: values.nationalKicker,
        nationalTitle: values.nationalTitle,
        nationalIntro: values.nationalIntro,
        nationalPoints: linesToList(values.nationalPointsText),
        cooperativeEnabled: values.cooperativeEnabled,
        cooperativeLabel: values.cooperativeLabel,
        privateAgentEnabled: values.privateAgentEnabled,
        privateAgentLabel: values.privateAgentLabel,
        documentLabels: {
          companyRegistration: values.labelCompanyRegistration,
          pan: values.labelPan,
          taxClearance: values.labelTaxClearance,
          citizenshipBoth: values.labelCitizenshipBoth,
          cheque: values.labelCheque,
          signedAgreement: values.labelSignedAgreement
        }
      }),
    onSuccess: async () => {
      push({ title: "Partnership page updated", tone: "success" });
      await client.invalidateQueries({ queryKey: ["admin-partnership-settings"] });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  const upload = useMutation({
    mutationFn: ({ slot, file }: { slot: AgreementSlot; file: File }) => adminApi.partnership.uploadAgreement(slot, file),
    onSuccess: async () => {
      push({ title: "Agreement uploaded", tone: "success" });
      await client.invalidateQueries({ queryKey: ["admin-partnership-settings"] });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  if (query.isLoading) return <SkeletonLines />;

  return (
    <div>
      <PageHeader
        title="Partnership settings"
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Partners", to: "/admin/partners" }, { label: "Settings" }]}
      />
      <p className="mb-6 max-w-3xl text-sm text-ink-muted">
        Edit the public Become a Partner page, choose whether Cooperative and Private Agent applications are open, and upload the company agreement each applicant must download, sign, and stamp.
      </p>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {agreementSlots.map((item) => {
          const current = query.data?.agreements?.[item.slot];
          return (
            <div key={item.slot} className="rounded-2xl border border-navy/10 bg-white p-4">
              <h3 className="font-display text-lg text-navy">{item.title}</h3>
              <p className="mt-1 text-xs text-ink-muted">{item.help}</p>
              <p className="mt-3 text-sm text-ink">{current?.originalName || "No file uploaded yet"}</p>
              <label className="mt-3 block text-sm">
                <span className="sr-only">Upload {item.title}</span>
                <input
                  type="file"
                  accept=".pdf,image/jpeg,image/png,image/webp"
                  className="block w-full text-sm"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) upload.mutate({ slot: item.slot, file });
                    event.target.value = "";
                  }}
                />
              </label>
              {current?.storedName ? (
                <Button
                  size="sm"
                  variant="secondary"
                  className="mt-3"
                  onClick={() => downloadAuthorized(`/public/partnership/agreements/${item.slot}`, current.originalName || "agreement.pdf").catch((error) => push({ title: getErrorMessage(error), tone: "error" }))}
                >
                  Download current file
                </Button>
              ) : null}
            </div>
          );
        })}
      </div>

      <form className="max-w-3xl space-y-5" onSubmit={form.handleSubmit((values) => save.mutate(values))}>
        <label className="flex items-center gap-2 text-sm text-navy">
          <input type="checkbox" {...form.register("formEnabled")} />
          Application form is open
        </label>
        <Input label="Page kicker" {...form.register("pageKicker")} />
        <Input label="Page title" {...form.register("pageTitle")} />
        <Textarea label="Page description" {...form.register("pageDescription")} />

        <h3 className="pt-4 font-display text-2xl text-navy">International Partner</h3>
        <label className="flex items-center gap-2 text-sm text-navy">
          <input type="checkbox" {...form.register("internationalEnabled")} />
          Show International Partner
        </label>
        <Input label="Kicker" {...form.register("internationalKicker")} />
        <Input label="Title" {...form.register("internationalTitle")} />
        <Textarea label="Introduction" {...form.register("internationalIntro")} />
        <Textarea label="Benefit points (one per line)" {...form.register("internationalPointsText")} />

        <h3 className="pt-4 font-display text-2xl text-navy">National Partner</h3>
        <label className="flex items-center gap-2 text-sm text-navy">
          <input type="checkbox" {...form.register("nationalEnabled")} />
          Show National Partner
        </label>
        <Input label="Kicker" {...form.register("nationalKicker")} />
        <Input label="Title" {...form.register("nationalTitle")} />
        <Textarea label="Introduction" {...form.register("nationalIntro")} />
        <Textarea label="Benefit points (one per line)" {...form.register("nationalPointsText")} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm text-navy">
              <input type="checkbox" {...form.register("cooperativeEnabled")} />
              Accept Cooperative applications
            </label>
            <Input label="Cooperative label" {...form.register("cooperativeLabel")} />
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm text-navy">
              <input type="checkbox" {...form.register("privateAgentEnabled")} />
              Accept Private Agent applications
            </label>
            <Input label="Private Agent label" {...form.register("privateAgentLabel")} />
          </div>
        </div>

        <h3 className="pt-4 font-display text-2xl text-navy">Required document labels</h3>
        <Input label="Register of company" {...form.register("labelCompanyRegistration")} />
        <Input label="PAN" {...form.register("labelPan")} />
        <Input label="Tax clearance" {...form.register("labelTaxClearance")} />
        <Input label="Citizenship of both sides" {...form.register("labelCitizenshipBoth")} />
        <Input label="Cheque" {...form.register("labelCheque")} />
        <Input label="Signed agreement" {...form.register("labelSignedAgreement")} />

        <Button type="submit" disabled={save.isPending}>
          {save.isPending ? "Saving…" : "Save partnership page"}
        </Button>
      </form>
    </div>
  );
}
