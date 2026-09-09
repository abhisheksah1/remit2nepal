import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { CheckCircle2, Download, FileUp, Landmark, Store } from "lucide-react";
import { publicApi } from "@/api/public.api";
import { getErrorMessage } from "@/api/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { partnerEnquirySchema, type PartnerEnquiryValues } from "@/schemas/partner-enquiry.schema";
import type { ApplicationDocumentKey, ApplicationNationalType, PublicPartnership } from "@/types/content";
import { cn } from "@/utils/cn";
import { agreementSlotFor, type PartnerKind } from "@/utils/partners";

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

  const slot = agreementSlotFor(kind, nationalType as ApplicationNationalType | "");
  const agreement = settings.agreements[slot];

  const documentFields = useMemo(
    () =>
      settings.requiredDocuments.map((item) => ({
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
        payload.append(key, values[key]);
      }
      return publicApi.applyPartnership(payload);
    },
    onSuccess: () => {
      setDone(true);
      push({
        title: "Application received",
        description: "A partnership officer will review your documents during office hours.",
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
          Thank you. The partnership desk will review your company details and documents during office hours.
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
                  <Icon className="h-6 w-6" />
                  <span className="mt-3 block font-display text-xl">{option.label}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-ink-muted">{option.help}</span>
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
        <h2 className="mt-1 font-display text-2xl text-navy">Company agreement</h2>
        <div className="apply-agreement mt-4">
          <p className="text-sm font-medium text-navy">Download, sign, and stamp</p>
          <p className="mt-1 text-sm text-ink-muted">
            Print the agreement for this track, sign it, add your stamp, then upload the signed copy with the other documents.
          </p>
          {agreement.available ? (
            <a href={`/api/v1/public/partnership/agreements/${slot}`} className="apply-download">
              <Download className="h-4 w-4" />
              Download {agreement.fileName || "company agreement"}
            </a>
          ) : (
            <p className="mt-3 text-sm text-gold">The agreement file will appear here after the desk uploads it.</p>
          )}
        </div>
      </section>

      <section>
        <p className="apply-section-kicker">{kind === "NATIONAL" ? "Step 4" : "Step 3"}</p>
        <h2 className="mt-1 font-display text-2xl text-navy">Upload documents</h2>
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

      <section>
        <Textarea label="Additional notes (optional)" {...form.register("notes")} error={form.formState.errors.notes?.message} />
        <Button type="submit" size="lg" className="mt-5 w-full sm:w-auto" disabled={mutation.isPending}>
          {mutation.isPending ? "Submitting…" : "Submit agent application"}
        </Button>
      </section>
    </form>
  );
}
