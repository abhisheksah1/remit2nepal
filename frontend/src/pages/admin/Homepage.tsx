import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { adminApi } from "@/api/admin.api";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Badge, statusTone } from "@/components/ui/Badge";
import { entityId } from "@/utils/cn";

const TYPE_LABELS: Record<string, string> = {
  HERO: "Hero",
  STATS: "Hero stats",
  SERVICES: "Services",
  RATES: "Exchange rates",
  WHY_CHOOSE: "Why Remit2Nepal",
  REMITTANCE: "Remittance cubes",
  PARTNERS: "Partners",
  TESTIMONIALS: "Testimonials",
  NEWS: "News",
  BRANCH_FINDER: "Agent finder",
  NEPAL_MAP: "Nepal map",
  GALLERY: "Gallery",
  CONTACT_CTA: "Contact banner",
  CUSTOM: "Custom HTML"
};

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
        description="Turn sections on or off and change their order in Sections. Open Hero to change the first screen: title, intro, buttons, chips, globe cards, and background."
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Homepage" }]}
      />
      <DataTable
        columns={[
          { key: "order", header: "Order", render: (row) => row.displayOrder },
          { key: "type", header: "Type", render: (row) => TYPE_LABELS[row.type] || row.type },
          { key: "heading", header: "Heading", render: (row) => row.heading || row.key },
          { key: "enabled", header: "Status", render: (row) => <Badge tone={statusTone(row.enabled ? "ACTIVE" : "INACTIVE")}>{row.enabled ? "Visible" : "Hidden"}</Badge> },
          {
            key: "edit",
            header: "",
            render: (row) => (
              <Link to={`/admin/sections?key=${encodeURIComponent(row.key)}`} className="text-sm text-navy underline">
                Edit {row.type === "HERO" ? "hero copy" : row.type === "STATS" ? "stats" : "copy"}
              </Link>
            )
          }
        ]}
        rows={rows}
        loading={query.isLoading}
        rowKey={(row) => entityId(row)}
        emptyTitle="No homepage sections"
      />
    </div>
  );
}
