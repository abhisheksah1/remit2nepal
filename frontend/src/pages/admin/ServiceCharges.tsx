import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { adminApi } from "@/api/admin.api";
import { getErrorMessage } from "@/api/client";
import { ResourceCrud, StatusCell } from "@/components/admin/ResourceCrud";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { serviceChargeRowFormSchema } from "@/schemas/cms.schema";
import type { ServiceChargePage, ServiceChargeRow } from "@/types/content";

const emptyPage: ServiceChargePage = {
  pageKicker: "Fees",
  pageTitle: "Service Charge",
  pageDescription: "Sending-agent charges for cash pickup and bank transfer.",
  footnote: "Charges are published by sending agents and may change. Confirm the applicable fee before you send."
};

export default function ServiceCharges() {
  const { push } = useToast();
  const client = useQueryClient();
  const pageQuery = useQuery({ queryKey: ["admin-service-charge-page"], queryFn: adminApi.serviceCharges.page });
  const [pageForm, setPageForm] = useState<ServiceChargePage>(emptyPage);

  useEffect(() => {
    if (!pageQuery.data) return;
    setPageForm({
      pageKicker: pageQuery.data.pageKicker || emptyPage.pageKicker,
      pageTitle: pageQuery.data.pageTitle || emptyPage.pageTitle,
      pageDescription: pageQuery.data.pageDescription || emptyPage.pageDescription,
      footnote: pageQuery.data.footnote || emptyPage.footnote
    });
  }, [pageQuery.data]);

  const savePage = useMutation({
    mutationFn: () => adminApi.serviceCharges.updatePage(pageForm),
    onSuccess: async () => {
      push({ title: "Page copy saved", tone: "success" });
      await client.invalidateQueries({ queryKey: ["admin-service-charge-page"] });
      await client.invalidateQueries({ queryKey: ["public", "service-charges"] });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-navy/10 bg-white p-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl text-navy">Page copy</h2>
            <p className="mt-1 text-sm text-ink-muted">All fields are text. This heading appears on the public Service Charge page.</p>
          </div>
          <Link to="/service-charge" className="text-sm text-gold hover:underline" target="_blank" rel="noreferrer">
            Open public page
          </Link>
        </div>
        {pageQuery.isLoading ? (
          <SkeletonLines />
        ) : (
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              savePage.mutate();
            }}
          >
            <Input
              label="Kicker"
              value={pageForm.pageKicker}
              onChange={(event) => setPageForm((current) => ({ ...current, pageKicker: event.target.value }))}
            />
            <Input
              label="Page title"
              value={pageForm.pageTitle}
              onChange={(event) => setPageForm((current) => ({ ...current, pageTitle: event.target.value }))}
            />
            <div className="md:col-span-2">
              <Textarea
                label="Introduction"
                value={pageForm.pageDescription}
                onChange={(event) => setPageForm((current) => ({ ...current, pageDescription: event.target.value }))}
              />
            </div>
            <div className="md:col-span-2">
              <Textarea
                label="Footnote"
                value={pageForm.footnote}
                onChange={(event) => setPageForm((current) => ({ ...current, footnote: event.target.value }))}
              />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={savePage.isPending}>
                {savePage.isPending ? "Saving…" : "Save page copy"}
              </Button>
            </div>
          </form>
        )}
      </section>

      <ResourceCrud<ServiceChargeRow>
        title="Service Charge"
        description="Enter every value as text. Tick merge to combine Cash Pickup and Bank Transfer into one public cell."
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Service Charge" }]}
        queryKey="admin-service-charges"
        list={adminApi.serviceCharges.list}
        create={adminApi.serviceCharges.create}
        update={adminApi.serviceCharges.update}
        remove={adminApi.serviceCharges.remove}
        schema={serviceChargeRowFormSchema}
        extraActions={
          <Button variant="secondary" onClick={() => window.open("/service-charge", "_blank")}>
            View page
          </Button>
        }
        columns={[
          { key: "serial", header: "S.N", render: (row) => row.serial || "—" },
          { key: "sendingAgent", header: "Sending Agent", render: (row) => row.sendingAgent },
          {
            key: "payout",
            header: "Charges",
            render: (row) =>
              row.mergePayout
                ? row.mergedCharge || row.cashPickup || "—"
                : `${row.cashPickup || "—"} / ${row.bankTransfer || "—"}`
          },
          { key: "mergePayout", header: "Merged", render: (row) => (row.mergePayout ? "Yes" : "No") },
          { key: "status", header: "Status", render: (row) => <StatusCell value={row.status} /> }
        ]}
        fields={[
          { name: "serial", label: "S.N" },
          { name: "sendingAgent", label: "Sending Agent" },
          {
            name: "mergePayout",
            label: "Merge Cash Pickup and Bank Transfer into one column",
            type: "checkbox"
          },
          {
            name: "mergedCharge",
            label: "Combined charge (Cash Pickup + Bank Transfer)",
            showWhen: (values) => Boolean(values.mergePayout)
          },
          {
            name: "cashPickup",
            label: "Cash Pickup",
            showWhen: (values) => !values.mergePayout
          },
          {
            name: "bankTransfer",
            label: "Bank Transfer",
            showWhen: (values) => !values.mergePayout
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: [
              { value: "ACTIVE", label: "Active" },
              { value: "INACTIVE", label: "Inactive" }
            ]
          },
          { name: "displayOrder", label: "Display order", type: "number" }
        ]}
        toForm={(item) => ({
          serial: item?.serial ?? "",
          sendingAgent: item?.sendingAgent ?? "",
          cashPickup: item?.cashPickup ?? "",
          bankTransfer: item?.bankTransfer ?? "",
          mergedCharge: item?.mergedCharge ?? "",
          mergePayout: Boolean(item?.mergePayout),
          status: item?.status ?? "ACTIVE",
          displayOrder: item?.displayOrder ?? 0
        })}
        toPayload={(values) => ({
          serial: String(values.serial ?? ""),
          sendingAgent: String(values.sendingAgent ?? ""),
          cashPickup: String(values.cashPickup ?? ""),
          bankTransfer: String(values.bankTransfer ?? ""),
          mergedCharge: String(values.mergedCharge ?? ""),
          mergePayout: Boolean(values.mergePayout),
          status: values.status,
          displayOrder: Number(values.displayOrder ?? 0)
        })}
      />
    </div>
  );
}
