import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { adminApi } from "@/api/admin.api";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Badge, statusTone } from "@/components/ui/Badge";
import { entityId } from "@/utils/cn";

export default function Homepage() {
  const query = useQuery({
    queryKey: ["admin-sections", 1, ""],
    queryFn: () => adminApi.sections.list({ page: 1, limit: 50 })
  });
  const rows = [...(query.data?.items ?? [])].sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div>
      <PageHeader
        title="Homepage"
        description="Turn sections on or off and change their order. Edit headings, photos, and buttons in Sections. Nepal people map and Gallery share the same collage photos."
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Homepage" }]}
      />
      <DataTable
        columns={[
          { key: "order", header: "Order", render: (row) => row.displayOrder },
          { key: "type", header: "Type", render: (row) => row.type },
          { key: "heading", header: "Heading", render: (row) => row.heading || row.key },
          { key: "enabled", header: "Status", render: (row) => <Badge tone={statusTone(row.enabled ? "ACTIVE" : "INACTIVE")}>{row.enabled ? "Visible" : "Hidden"}</Badge> },
          { key: "edit", header: "", render: () => <Link to="/admin/sections" className="text-sm text-navy underline">Edit sections</Link> }
        ]}
        rows={rows}
        loading={query.isLoading}
        rowKey={(row) => entityId(row)}
        emptyTitle="No homepage sections"
      />
    </div>
  );
}
