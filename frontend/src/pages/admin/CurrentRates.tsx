import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { getErrorMessage } from "@/api/client";
import { companyRateSchema, type CompanyRateValues } from "@/schemas/rates.schema";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { FormDrawer } from "@/components/admin/FormDrawer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import { formatDateTime, formatNpr, isoDateInput } from "@/utils/format";
import { entityId } from "@/utils/cn";
import type { ExchangeRate } from "@/types/rates";

export default function CurrentRates() {
  const { push } = useToast();
  const client = useQueryClient();
  const [editing, setEditing] = useState<ExchangeRate | null>(null);
  const [search, setSearch] = useState("");
  const query = useQuery({ queryKey: ["admin-rates"], queryFn: adminApi.rates.list });
  const nrb = useQuery({ queryKey: ["admin-nrb-config"], queryFn: adminApi.nrb.config });
  const sync = useMutation({
    mutationFn: adminApi.nrb.sync,
    onSuccess: async (data) => {
      push({
        title: "Live NRB rates updated",
        description: `${data.currenciesUpdated ?? 0} currencies from the official bulletin`,
        tone: "success"
      });
      await client.invalidateQueries({ queryKey: ["admin-rates"] });
      await client.invalidateQueries({ queryKey: ["admin-nrb-config"] });
      await client.invalidateQueries({ queryKey: ["admin-nrb-logs"] });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });
  const form = useForm<CompanyRateValues>({ resolver: zodResolver(companyRateSchema) });

  const save = useMutation({
    mutationFn: (values: CompanyRateValues) => adminApi.rates.company(values),
    onSuccess: async () => {
      push({ title: "Company rate updated", tone: "success" });
      setEditing(null);
      await client.invalidateQueries({ queryKey: ["admin-rates"] });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  const rows = useMemo(() => {
    const source = query.data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return source;
    return source.filter(
      (row) => row.currencyCode.toLowerCase().includes(q) || row.currency.toLowerCase().includes(q)
    );
  }, [query.data, search]);

  return (
    <div>
      <PageHeader
        title="Current rates"
        description={`Live Nepal Rastra Bank bulletin for ${query.data?.length ?? 0} currencies. Company buy/sell can be overridden per corridor.`}
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Current Rates" }]}
        extra={
          <Button onClick={() => sync.mutate()} disabled={sync.isPending}>
            {sync.isPending ? "Fetching NRB…" : "Fetch live NRB rates"}
          </Button>
        }
      />
      <p className="mb-4 text-sm text-ink-muted">
        Last NRB success {formatDateTime(nrb.data?.lastSuccessfulFetch)} · Automatic hourly fetch when enabled
      </p>
      <DataTable
        columns={[
          { key: "code", header: "Currency", render: (row) => `${row.currencyCode} · ${row.currency}` },
          { key: "unit", header: "Unit", render: (row) => row.unit },
          { key: "nrbBuy", header: "NRB Buy", render: (row) => formatNpr(row.nrbBuyRate) },
          { key: "nrbSell", header: "NRB Sell", render: (row) => formatNpr(row.nrbSellRate) },
          { key: "cBuy", header: "Company Buy", render: (row) => formatNpr(row.companyBuyRate) },
          { key: "cSell", header: "Company Sell", render: (row) => formatNpr(row.companySellRate) },
          { key: "updated", header: "Fetched", render: (row) => formatDateTime(row.fetchedAt) },
          {
            key: "act",
            header: "",
            render: (row) => (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setEditing(row);
                  form.reset({
                    currencyCode: row.currencyCode,
                    buyRate: row.companyBuyRate ?? row.nrbBuyRate ?? 0,
                    sellRate: row.companySellRate ?? row.nrbSellRate ?? 0,
                    effectiveDate: isoDateInput(),
                    reason: ""
                  });
                }}
              >
                Override
              </Button>
            )
          }
        ]}
        rows={rows}
        loading={query.isLoading}
        search={search}
        onSearch={setSearch}
        rowKey={(row) => entityId(row) || row.currencyCode}
      />
      <FormDrawer open={Boolean(editing)} title={`Override ${editing?.currencyCode ?? ""}`} onClose={() => setEditing(null)}>
        <form className="space-y-4" onSubmit={form.handleSubmit((values) => save.mutate(values))}>
          <Input label="Currency" {...form.register("currencyCode")} error={form.formState.errors.currencyCode?.message} />
          <Input label="Buy rate" type="number" step="0.0001" {...form.register("buyRate")} error={form.formState.errors.buyRate?.message} />
          <Input label="Sell rate" type="number" step="0.0001" {...form.register("sellRate")} error={form.formState.errors.sellRate?.message} />
          <Input label="Effective date" type="date" {...form.register("effectiveDate")} error={form.formState.errors.effectiveDate?.message} />
          <Input label="Reason" {...form.register("reason")} error={form.formState.errors.reason?.message} />
          <Button type="submit" disabled={save.isPending}>Save company rate</Button>
        </form>
      </FormDrawer>
    </div>
  );
}
