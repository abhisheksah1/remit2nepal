import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Input } from "@/components/ui/Input";
import { formatDateTime } from "@/utils/format";
import { entityId } from "@/utils/cn";

export default function AuditLogs() {
  const [page, setPage] = useState(1);
  const [module, setModule] = useState("");
  const [userId, setUserId] = useState("");
  const [action, setAction] = useState("");
  const query = useQuery({
    queryKey: ["admin-audit", page, module, userId, action],
    queryFn: () => adminApi.auditLogs({ page, module, userId, action, limit: 20 })
  });

  return (
    <div>
      <PageHeader title="Audit logs" crumbs={[{ label: "Admin", to: "/admin" }, { label: "Audit Logs" }]} />
      <div className="mb-4 grid gap-3 md:grid-cols-3">
        <Input label="Module" value={module} onChange={(event) => { setModule(event.target.value); setPage(1); }} />
        <Input label="User ID" value={userId} onChange={(event) => { setUserId(event.target.value); setPage(1); }} />
        <Input label="Action" value={action} onChange={(event) => { setAction(event.target.value); setPage(1); }} />
      </div>
      <DataTable
        columns={[
          { key: "when", header: "When", render: (row) => formatDateTime(row.createdAt) },
          { key: "user", header: "User", render: (row) => `${row.userName} (${row.userId})` },
          { key: "action", header: "Action", render: (row) => row.action },
          { key: "module", header: "Module", render: (row) => row.module },
          { key: "entity", header: "Entity", render: (row) => row.entityId },
          { key: "ip", header: "IP", render: (row) => row.ipAddress }
        ]}
        rows={query.data?.items ?? []}
        loading={query.isLoading}
        page={page}
        total={query.data?.total}
        onPageChange={setPage}
        rowKey={(row) => entityId(row)}
      />
    </div>
  );
}
