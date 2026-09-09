import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { getErrorMessage } from "@/api/client";
import { settingsFormSchema, type SettingsFormValues } from "@/schemas/settings.schema";
import { PageHeader } from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { SkeletonLines } from "@/components/ui/Skeleton";

export default function Settings() {
  const { push } = useToast();
  const client = useQueryClient();
  const query = useQuery({ queryKey: ["admin-settings"], queryFn: adminApi.settings.get });
  const form = useForm<SettingsFormValues>({ resolver: zodResolver(settingsFormSchema) });

  useEffect(() => {
    if (!query.data) return;
    form.reset({
      companyName: query.data.companyName,
      tagline: query.data.tagline,
      logoUrl: query.data.logoUrl,
      faviconUrl: query.data.faviconUrl,
      phone: query.data.phone,
      email: query.data.email,
      address: query.data.address,
      officeHours: query.data.officeHours,
      emergencyContact: query.data.emergencyContact,
      headerCtaLabel: query.data.headerCta?.label ?? "",
      headerCtaUrl: query.data.headerCta?.url ?? "",
      headerCtaEnabled: query.data.headerCta?.enabled ?? true,
      footerAbout: query.data.footerAbout,
      copyrightText: query.data.copyrightText,
      maintenanceMode: query.data.maintenanceMode,
      maintenanceMessage: query.data.maintenanceMessage,
      publicRateDisplay: query.data.publicRateDisplay,
      analyticsScript: query.data.analyticsScript,
      contactFormEnabled: query.data.contactFormEnabled,
      staleRateHours: query.data.staleRateHours
    });
  }, [query.data, form]);

  const save = useMutation({
    mutationFn: (values: SettingsFormValues) =>
      adminApi.settings.update({
        companyName: values.companyName,
        tagline: values.tagline,
        logoUrl: values.logoUrl,
        faviconUrl: values.faviconUrl,
        phone: values.phone,
        email: values.email,
        address: values.address,
        officeHours: values.officeHours,
        emergencyContact: values.emergencyContact,
        headerCta: {
          label: values.headerCtaLabel,
          url: values.headerCtaUrl,
          enabled: values.headerCtaEnabled
        },
        footerAbout: values.footerAbout,
        copyrightText: values.copyrightText,
        maintenanceMode: values.maintenanceMode,
        maintenanceMessage: values.maintenanceMessage,
        publicRateDisplay: values.publicRateDisplay,
        analyticsScript: values.analyticsScript,
        contactFormEnabled: values.contactFormEnabled,
        staleRateHours: values.staleRateHours
      }),
    onSuccess: async () => {
      push({ title: "Settings saved", tone: "success" });
      await client.invalidateQueries({ queryKey: ["admin-settings"] });
      await client.invalidateQueries({ queryKey: ["public", "site"] });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  if (query.isLoading) return <SkeletonLines />;

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Company identity, contact details, and public-site switches."
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Settings" }]}
      />
      <form className="admin-panel space-y-5" onSubmit={form.handleSubmit((values) => save.mutate(values))}>
        <fieldset className="admin-field-group space-y-4">
          <legend>Brand</legend>
          <Input label="Company name" {...form.register("companyName")} error={form.formState.errors.companyName?.message} />
          <Input label="Tagline" {...form.register("tagline")} />
          <Input label="Logo URL" {...form.register("logoUrl")} />
          <Input label="Favicon URL" {...form.register("faviconUrl")} />
        </fieldset>
        <fieldset className="admin-field-group space-y-4">
          <legend>Contact</legend>
          <Input label="Phone" {...form.register("phone")} />
          <Input label="Email" {...form.register("email")} />
          <Input label="Address" {...form.register("address")} />
          <Input label="Office hours" {...form.register("officeHours")} />
          <Input label="Emergency contact" {...form.register("emergencyContact")} />
        </fieldset>
        <fieldset className="admin-field-group space-y-4">
          <legend>Header & footer</legend>
          <Input label="Header CTA label" {...form.register("headerCtaLabel")} />
          <Input label="Header CTA URL" {...form.register("headerCtaUrl")} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...form.register("headerCtaEnabled")} /> Header CTA enabled
          </label>
          <Textarea label="Footer about" {...form.register("footerAbout")} />
          <Input label="Copyright" {...form.register("copyrightText")} />
        </fieldset>
        <fieldset className="admin-field-group space-y-4">
          <legend>Operations</legend>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...form.register("maintenanceMode")} /> Maintenance mode
          </label>
          <Textarea label="Maintenance message" {...form.register("maintenanceMessage")} />
          <Select
            label="Public rate display"
            {...form.register("publicRateDisplay")}
            options={[
              { value: "BOTH", label: "Both" },
              { value: "NRB", label: "NRB" },
              { value: "COMPANY", label: "Company" }
            ]}
          />
          <Input label="Stale rate hours" type="number" {...form.register("staleRateHours")} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...form.register("contactFormEnabled")} /> Contact form enabled
          </label>
          <Textarea label="Analytics script" {...form.register("analyticsScript")} />
        </fieldset>
        <div className="admin-form-save">
          <Button type="submit" disabled={save.isPending}>Save settings</Button>
        </div>
      </form>
    </div>
  );
}
