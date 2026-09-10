import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { getErrorMessage } from "@/api/client";
import { currencyFormSchema, type CurrencyFormValues } from "@/schemas/rates.schema";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { FormDrawer } from "@/components/admin/FormDrawer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { StatusCell } from "@/components/admin/ResourceCrud";
import { useToast } from "@/components/ui/Toast";
import { entityId } from "@/utils/cn";
import { useState } from "react";
import { CurrencyFlag } from "@/components/public/CurrencyFlag";

export default function RateSettings() {
  const { push } = useToast();
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const currencies = useQuery({ queryKey: ["admin-currencies"], queryFn: adminApi.rates.currencies });
  const settings = useQuery({ queryKey: ["admin-settings"], queryFn: adminApi.settings.get });
  const form = useForm<CurrencyFormValues>({ resolver: zodResolver(currencyFormSchema) });

  const saveCurrency = useMutation({
    mutationFn: (values: CurrencyFormValues) => adminApi.rates.saveCurrency(values),
    onSuccess: async () => {
      push({ title: "Currency saved", tone: "success" });
      setOpen(false);
      await client.invalidateQueries({ queryKey: ["admin-currencies"] });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  const saveDisplay = useMutation({
    mutationFn: (publicRateDisplay: "NRB" | "COMPANY" | "BOTH") => adminApi.settings.update({ publicRateDisplay }),
    onSuccess: async () => {
      push({ title: "Public display updated", tone: "success" });
      await client.invalidateQueries({ queryKey: ["admin-settings"] });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  return (
    <div>
      <PageHeader
        title="Rate settings"
        description="Currencies and public display mode"
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Rate Settings" }]}
        actionLabel="Add currency"
        onAction={() => {
          form.reset({ code: "", name: "", unit: 1, status: "ACTIVE", displayOrder: 0 });
          setOpen(true);
        }}
      />
      <div className="admin-toolbar mb-8 max-w-sm">
        <Select
          label="Public rate display"
          value={settings.data?.publicRateDisplay ?? "BOTH"}
          onChange={(event) => saveDisplay.mutate(event.target.value as "NRB" | "COMPANY" | "BOTH")}
          options={[
            { value: "BOTH", label: "NRB and company" },
            { value: "NRB", label: "NRB only" },
            { value: "COMPANY", label: "Company only" }
          ]}
        />
      </div>
      <DataTable
        columns={[
          {
            key: "code",
            header: "Currency",
            render: (row) => (
              <span className="inline-flex items-center gap-2">
                <CurrencyFlag code={row.code} country={row.country || row.name} />
                {row.code}
              </span>
            )
          },
          { key: "name", header: "Name", render: (row) => row.name },
          { key: "unit", header: "Unit", render: (row) => row.unit },
          { key: "status", header: "Status", render: (row) => <StatusCell value={row.status} /> }
        ]}
        rows={currencies.data ?? []}
        loading={currencies.isLoading}
        rowKey={(row) => entityId(row) || row.code}
      />
      <FormDrawer open={open} title="Currency" onClose={() => setOpen(false)}>
        <form className="space-y-4" onSubmit={form.handleSubmit((values) => saveCurrency.mutate(values))}>
          <Input label="Code" {...form.register("code")} error={form.formState.errors.code?.message} />
          <Input label="Name" {...form.register("name")} error={form.formState.errors.name?.message} />
          <Input label="Symbol" {...form.register("symbol")} />
          <Input label="Country" {...form.register("country")} />
          <Input label="Flag" {...form.register("flag")} />
          <Input label="Unit" type="number" {...form.register("unit")} />
          <Input label="Display order" type="number" {...form.register("displayOrder")} />
          <div className="admin-drawer-actions">
            <Button type="submit" disabled={saveCurrency.isPending}>Save</Button>
          </div>
        </form>
      </FormDrawer>
    </div>
  );
}
