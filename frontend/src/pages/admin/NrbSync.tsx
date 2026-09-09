import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { getErrorMessage } from "@/api/client";
import { nrbConfigSchema, type NrbConfigValues } from "@/schemas/rates.schema";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge, statusTone } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { formatDateTime } from "@/utils/format";
import { entityId } from "@/utils/cn";
import { SkeletonLines } from "@/components/ui/Skeleton";

export default function NrbSync() {
  const { push } = useToast();
  const client = useQueryClient();
  const config = useQuery({ queryKey: ["admin-nrb-config"], queryFn: adminApi.nrb.config });
  const logs = useQuery({ queryKey: ["admin-nrb-logs"], queryFn: adminApi.nrb.logs });
  const form = useForm<NrbConfigValues>({ resolver: zodResolver(nrbConfigSchema) });

  useEffect(() => {
    if (!config.data) return;
    form.reset({
      enabled: config.data.enabled,
      automaticFetchEnabled: config.data.automaticFetchEnabled,
      fetchFrequencyCron: config.data.fetchFrequencyCron,
      retryCount: config.data.retryCount,
      timeoutMs: config.data.timeoutMs,
      sourceUrl: config.data.sourceUrl
    });
  }, [config.data, form]);

  const save = useMutation({
    mutationFn: (values: NrbConfigValues) => adminApi.nrb.saveConfig(values),
    onSuccess: async () => {
      push({ title: "NRB settings saved", tone: "success" });
      await client.invalidateQueries({ queryKey: ["admin-nrb-config"] });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  const sync = useMutation({
    mutationFn: adminApi.nrb.sync,
    onSuccess: async (data) => {
      push({ title: "Synchronization finished", description: data.status, tone: "success" });
      await client.invalidateQueries({ queryKey: ["admin-nrb-logs"] });
      await client.invalidateQueries({ queryKey: ["admin-rates"] });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  if (config.isLoading) return <SkeletonLines />;

  return (
    <div>
      <PageHeader
        title="NRB sync"
        description="Fetches the official NRB forex bulletin for every published currency worldwide and stores it as the live desk reference."
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "NRB Sync" }]}
        extra={
          <Button onClick={() => sync.mutate()} disabled={sync.isPending}>
            {sync.isPending ? "Syncing…" : "Run sync now"}
          </Button>
        }
      />
      <form className="admin-panel mb-8 grid gap-4" onSubmit={form.handleSubmit((values) => save.mutate(values))}>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...form.register("enabled")} /> Enabled
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...form.register("automaticFetchEnabled")} /> Automatic fetch
        </label>
        <Input label="Cron" {...form.register("fetchFrequencyCron")} />
        <Input label="Retry count" type="number" {...form.register("retryCount")} />
        <Input label="Timeout (ms)" type="number" {...form.register("timeoutMs")} />
        <Input label="Source URL" {...form.register("sourceUrl")} error={form.formState.errors.sourceUrl?.message} />
        <p className="text-sm text-ink-muted">
          Last success {formatDateTime(config.data?.lastSuccessfulFetch)} · Last failure {formatDateTime(config.data?.lastFailedFetch)}
        </p>
        <Button type="submit" disabled={save.isPending}>Save configuration</Button>
      </form>
      <DataTable
        columns={[
          { key: "status", header: "Status", render: (row) => <Badge tone={statusTone(row.status)}>{row.status}</Badge> },
          { key: "date", header: "When", render: (row) => formatDateTime(row.createdAt) },
          { key: "currencies", header: "Currencies", render: (row) => row.currenciesUpdated },
          { key: "records", header: "Records", render: (row) => row.recordsCreated },
          { key: "by", header: "Triggered by", render: (row) => row.triggeredBy },
          { key: "msg", header: "Message", render: (row) => row.message || row.error }
        ]}
        rows={logs.data ?? []}
        loading={logs.isLoading}
        rowKey={(row) => entityId(row)}
      />
    </div>
  );
}
