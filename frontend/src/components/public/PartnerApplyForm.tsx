import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { CheckCircle2, FileUp, Landmark, Store } from "lucide-react";
import { publicApi } from "@/api/public.api";
import { getErrorMessage } from "@/api/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { partnerEnquirySchema, type PartnerEnquiryValues } from "@/schemas/partner-enquiry.schema";
import type { ApplicationDocumentKey, ApplicationNationalType, PublicPartnership } from "@/types/content";
import { cn } from "@/utils/cn";
import type { PartnerKind } from "@/utils/partners";

function FileField({
  label,
  file,
  error,
  onChange
}: {
  label: string;
  file?: File;
  error?: string;
  onChange: (file: File | undefined) => void;
}) {
  return (
    <label className={cn("apply-file", file && "is-ready", error && "is-error")}>
      <span className="apply-file-icon" aria-hidden>
        {file ? <CheckCircle2 className="h-5 w-5" /> : <FileUp className="h-5 w-5" />}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-medium text-navy">{label}</span>
        <span className="mt-0.5 block truncate text-xs text-ink-muted">
          {file ? file.name : "PDF or image, up to 10 MB"}
        </span>
        {error ? <span className="mt-1 block text-xs text-red-700">{error}</span> : null}
      </span>
      <input
        type="file"
        accept=".pdf,image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(event) => onChange(event.target.files?.[0])}
      />
    </label>
  );
}

export function PartnerApplyForm({
  settings,
  defaultKind,
  defaultNationalType = ""
}: {
  settings: PublicPartnership;
  defaultKind: PartnerKind;
  defaultNationalType?: ApplicationNationalType | "";
}) {
  const { push } = useToast();
  const site = useQuery({ queryKey: ["public", "site"], queryFn: publicApi.site });
  const deskEmail = site.data?.settings?.email;
  const [formKey, setFormKey] = useState(0);
  const [done, setDone] = useState(false);
  const initialNational =
    defaultKind === "NATIONAL"
      ? defaultNationalType || (settings.cooperativeEnabled ? "COOPERATIVE" : "PRIVATE_AGENT")
      : "";

  const form = useForm<PartnerEnquiryValues>({
    resolver: zodResolver(partnerEnquirySchema),
    defaultValues: {
      kind: defaultKind,
      nationalType: initialNational,
      companyName: "",
      ownerName: "",
      email: "",
      fullAddress: "",
      mobile: "",
      country: defaultKind === "NATIONAL" ? "Nepal" : "",
      notes: ""
    }
  });

  const kind = form.watch("kind");
  const nationalType = form.watch("nationalType");
  const files = form.watch();

  useEffect(() => {
    form.setValue("kind", defaultKind);
    if (defaultKind === "INTERNATIONAL") {
      form.setValue("nationalType", "");
      return;
    }
    if (defaultNationalType) form.setValue("nationalType", defaultNationalType);
    else if (!form.getValues("nationalType")) {
      form.setValue("nationalType", settings.cooperativeEnabled ? "COOPERATIVE" : "PRIVATE_AGENT");
    }
  }, [defaultKind, defaultNationalType, form, settings.cooperativeEnabled]);

  const nationalOptions = [
    ...(settings.cooperativeEnabled
      ? [{ value: "COOPERATIVE" as const, label: settings.cooperativeLabel || "Cooperative", icon: Landmark, help: "Licensed cooperatives paying out across Nepal." }]
      : []),
    ...(settings.privateAgentEnabled
      ? [{ value: "PRIVATE_AGENT" as const, label: settings.privateAgentLabel || "Private Agent", icon: Store, help: "Private payout agents serving families on the last mile." }]
      : [])
  ];

  const documentFields = useMemo(
    () =>
      settings.requiredDocuments
        .filter((item) => item.key !== "signedAgreement" && item.required !== false)
        .map((item) => ({
          key: item.key,
          label: settings.documentLabels[item.key] || item.label
        })),
    [settings]
  );

  const mutation = useMutation({
    mutationFn: (values: PartnerEnquiryValues) => {
      const payload = new FormData();
      payload.append("kind", values.kind);
      payload.append("nationalType", values.kind === "NATIONAL" ? values.nationalType || "" : "");
      payload.append("companyName", values.companyName);
      payload.append("ownerName", values.ownerName);
      payload.append("email", values.email);
      payload.append("fullAddress", values.fullAddress);
      payload.append("mobile", values.mobile);
      payload.append("country", values.country || (values.kind === "NATIONAL" ? "Nepal" : ""));
      payload.append("notes", values.notes || "");
      for (const key of documentFields.map((item) => item.key)) {
        const file = values[key];
        if (file instanceof File) payload.append(key, file);
      }
      return publicApi.applyPartnership(payload);
    },
    onSuccess: () => {
      setDone(true);
      push({
        title: "Application received",
        description: "The desk will verify your documents, then email the company agreement.",
        tone: "success"
      });
      form.reset({
        kind: defaultKind,
        nationalType: initialNational,
        companyName: "",
        ownerName: "",
        email: "",
        fullAddress: "",
        mobile: "",
        country: defaultKind === "NATIONAL" ? "Nepal" : "",
        notes: ""
      });
      setFormKey((value) => value + 1);
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  if (done) {
    return (
      <div className="apply-panel apply-success">
        <CheckCircle2 className="h-12 w-12 text-gold" />
        <h2 className="mt-4 font-display text-3xl text-navy">Application received</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          Thank you. The partnership desk will verify your documents first. If they are in order, Remit2Nepal will email
          the company agreement. Sign it, add your stamp, complete the required papers, scan them, and email them back
          {deskEmail ? (
            <>
              {" "}
              to <a className="text-navy underline" href={`mailto:${deskEmail}`}>{deskEmail}</a>
            </>
          ) : (
            " to the address in that company email"
          )}{" "}
          to become an agent.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={() => setDone(false)}>Submit another file</Button>
          <Link to="/partners">
            <Button variant="secondary">Back to Become a Agent</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      key={formKey}
      className="apply-panel space-y-8"
      onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
    >
      {kind === "NATIONAL" ? (
        <section>
          <p className="apply-section-kicker">Step 1</p>
          <h2 className="mt-1 font-display text-2xl text-navy">Choose your national type</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {nationalOptions.map((option) => {
              const Icon = option.icon;
              const active = nationalType === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={cn("apply-type-card", active && "is-active")}
                  onClick={() => form.setValue("nationalType", option.value, { shouldValidate: true })}
                >
                  <Icon className="apply-type-icon" aria-hidden />
                  <strong>{option.label}</strong>
                  <em>{option.help}</em>
                </button>
              );
            })}
          </div>
          {form.formState.errors.nationalType?.message ? (
            <p className="mt-2 text-xs text-red-700">{form.formState.errors.nationalType.message}</p>
          ) : null}
        </section>
      ) : null}

      <section>
        <p className="apply-section-kicker">{kind === "NATIONAL" ? "Step 2" : "Step 1"}</p>
        <h2 className="mt-1 font-display text-2xl text-navy">Company details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Input label="Company name" {...form.register("companyName")} error={form.formState.errors.companyName?.message} />
          <Input label="Owner name" {...form.register("ownerName")} error={form.formState.errors.ownerName?.message} />
          <Input label="Email" type="email" {...form.register("email")} error={form.formState.errors.email?.message} />
          <Input label="Mobile number" {...form.register("mobile")} error={form.formState.errors.mobile?.message} />
          <div className="sm:col-span-2">
            <Textarea label="Full address" rows={3} {...form.register("fullAddress")} error={form.formState.errors.fullAddress?.message} />
          </div>
          {kind === "INTERNATIONAL" ? (
            <Input label="Country" {...form.register("country")} error={form.formState.errors.country?.message} />
          ) : null}
        </div>
      </section>

      <section>
        <p className="apply-section-kicker">{kind === "NATIONAL" ? "Step 3" : "Step 2"}</p>
        <h2 className="mt-1 font-display text-2xl text-navy">Documents for verification</h2>
        <p className="mt-2 text-sm text-ink-muted">
          Upload clear scans of these files. The desk verifies them before Remit2Nepal emails the company agreement.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {documentFields.map((item) => (
            <FileField
              key={item.key}
              label={item.label}
              file={files[item.key] instanceof File ? files[item.key] : undefined}
              error={form.formState.errors[item.key as ApplicationDocumentKey]?.message}
              onChange={(file) => form.setValue(item.key, file as File, { shouldValidate: true })}
            />
          ))}
        </div>
      </section>

      <section className="apply-agreement">
        <p className="apply-section-kicker">After you submit</p>
        <h2 className="mt-1 font-display text-2xl text-navy">Agreement by email</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          Do not wait for a download on this page. Once your documents are verified, Remit2Nepal sends the agreement from
          the company. Sign it, stamp it, fill any remaining papers, scan everything, and email the scans back
          {deskEmail ? (
            <>
              {" "}
              to <a className="font-semibold text-navy underline" href={`mailto:${deskEmail}`}>{deskEmail}</a>
            </>
          ) : (
            " using the address in that company email"
          )}
          .
        </p>
      </section>

      <section>
        <Textarea label="Additional notes (optional)" {...form.register("notes")} error={form.formState.errors.notes?.message} />
        <Button type="submit" size="lg" className="mt-5 w-full sm:w-auto" disabled={mutation.isPending}>
          {mutation.isPending ? "Submitting…" : "Submit agent application"}
        </Button>
      </section>
    </form>
  );
}
