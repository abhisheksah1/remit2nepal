import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { getErrorMessage } from "@/api/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { FormDrawer } from "@/components/admin/FormDrawer";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Badge, statusTone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { useToast } from "@/components/ui/Toast";
import type { PartnerApplicationItem, PartnerApplicationStatus } from "@/types/content";
import { downloadAuthorized } from "@/utils/download";
import { formatDateTime } from "@/utils/format";
import { entityId } from "@/utils/cn";
import { nationalTypeLabel } from "@/utils/partners";

function typeLabel(row: PartnerApplicationItem) {
  if (row.kind === "INTERNATIONAL") return "International";
  return `National · ${nationalTypeLabel(row.nationalType) || "—"}`;
}

export default function PartnerApplications() {
  const { push } = useToast();
  const client = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<PartnerApplicationItem | null>(null);
  const [pending, setPending] = useState<PartnerApplicationItem | null>(null);
  const [notes, setNotes] = useState("");

  const query = useQuery({
    queryKey: ["admin-partner-applications", page, search],
    queryFn: () => adminApi.partnerApplications.list({ page, search, limit: 20 })
  });

  const update = useMutation({
    mutationFn: ({ id, status, adminNotes }: { id: string; status?: PartnerApplicationStatus; adminNotes?: string }) =>
      adminApi.partnerApplications.update(id, { status, adminNotes }),
    onSuccess: async (row) => {
      setSelected(row);
      await client.invalidateQueries({ queryKey: ["admin-partner-applications"] });
      push({ title: "Application updated", tone: "success" });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  const remove = useMutation({
    mutationFn: (id: string) => adminApi.partnerApplications.remove(id),
    onSuccess: async () => {
      setPending(null);
      setSelected(null);
      push({ title: "Application deleted", tone: "success" });
      await client.invalidateQueries({ queryKey: ["admin-partner-applications"] });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  return (
    <div>
      <PageHeader
        title="Partner applications"
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Partners", to: "/admin/partners" }, { label: "Applications" }]}
      />
      <DataTable
        columns={[
          { key: "company", header: "Company", render: (row) => row.companyName },
          { key: "owner", header: "Owner", render: (row) => row.ownerName },
          { key: "type", header: "Type", render: (row) => typeLabel(row) },
          { key: "mobile", header: "Mobile", render: (row) => row.mobile },
          { key: "email", header: "Email", render: (row) => row.email },
          { key: "status", header: "Status", render: (row) => <Badge tone={statusTone(row.status)}>{row.status}</Badge> },
          { key: "when", header: "Received", render: (row) => formatDateTime(row.createdAt) },
          {
            key: "act",
            header: "",
            render: (row) => (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setSelected(row);
                    setNotes(row.adminNotes ?? "");
                  }}
                >
                  Review
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setPending(row)}>
                  Delete
                </Button>
              </div>
            )
          }
        ]}
        rows={query.data?.items ?? []}
        loading={query.isLoading}
        search={search}
        onSearch={setSearch}
        page={page}
        total={query.data?.total}
        onPageChange={setPage}
        rowKey={(row) => entityId(row)}
      />

      <FormDrawer
        open={Boolean(selected)}
        title={selected?.companyName || "Application"}
        wide
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <div className="space-y-5">
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <p><span className="text-ink-muted">Type</span><br />{typeLabel(selected)}</p>
              <p><span className="text-ink-muted">Status</span><br />{selected.status}</p>
              <p><span className="text-ink-muted">Owner</span><br />{selected.ownerName}</p>
              <p><span className="text-ink-muted">Email</span><br />{selected.email}</p>
              <p><span className="text-ink-muted">Mobile</span><br />{selected.mobile}</p>
              <p><span className="text-ink-muted">Country</span><br />{selected.country || "—"}</p>
              <p className="sm:col-span-2"><span className="text-ink-muted">Full address</span><br />{selected.fullAddress}</p>
              {selected.notes ? <p className="sm:col-span-2"><span className="text-ink-muted">Notes</span><br />{selected.notes}</p> : null}
            </div>

            <div>
              <h3 className="font-medium text-navy">Submitted documents</h3>
              <ul className="mt-2 space-y-2">
                {selected.documents.map((doc) => (
                  <li key={doc.key} className="flex items-center justify-between gap-3 rounded-lg border border-navy/10 px-3 py-2 text-sm">
                    <span className="min-w-0 truncate">{doc.originalName}</span>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        downloadAuthorized(
                          `/partner-applications/${entityId(selected)}/files/${doc.key}`,
                          doc.originalName
                        ).catch((error) => push({ title: getErrorMessage(error), tone: "error" }))
                      }
                    >
                      Download
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <Select
              label="Status"
              value={selected.status}
              onChange={(event) =>
                update.mutate({ id: entityId(selected), status: event.target.value as PartnerApplicationStatus })
              }
              options={[
                { value: "SUBMITTED", label: "Submitted" },
                { value: "UNDER_REVIEW", label: "Under review" },
                { value: "APPROVED", label: "Approved" },
                { value: "REJECTED", label: "Rejected" }
              ]}
            />
            <Textarea label="Admin notes" value={notes} onChange={(event) => setNotes(event.target.value)} />
            <Button
              variant="secondary"
              disabled={update.isPending}
              onClick={() => update.mutate({ id: entityId(selected), adminNotes: notes })}
            >
              Save notes
            </Button>
          </div>
        ) : null}
      </FormDrawer>

      <ConfirmDialog
        open={Boolean(pending)}
        title="Delete this application?"
        description="The form details and uploaded documents will be permanently removed."
        danger
        confirmLabel="Delete"
        busy={remove.isPending}
        onClose={() => setPending(null)}
        onConfirm={() => pending && remove.mutate(entityId(pending))}
      />
    </div>
  );
}
