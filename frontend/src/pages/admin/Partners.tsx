import { ResourceCrud, StatusCell } from "@/components/admin/ResourceCrud";
import { adminApi } from "@/api/admin.api";
import { partnerFormSchema } from "@/schemas/cms.schema";
import type { PartnerItem } from "@/types/content";

export default function Partners() {
  return (
    <ResourceCrud<PartnerItem>
      title="Partners"
      crumbs={[{ label: "Admin", to: "/admin" }, { label: "Partners" }]}
      queryKey="admin-partners"
      list={adminApi.partners.list}
      create={adminApi.partners.create}
      update={adminApi.partners.update}
      remove={adminApi.partners.remove}
      schema={partnerFormSchema}
      columns={[
        { key: "name", header: "Name", render: (row) => row.name },
        { key: "country", header: "Country", render: (row) => row.country },
        { key: "status", header: "Status", render: (row) => <StatusCell value={row.status} /> }
      ]}
      fields={[
        { name: "name", label: "Name" },
        { name: "logoUrl", label: "Logo URL" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "website", label: "Website" },
        { name: "country", label: "Country" },
        { name: "status", label: "Status", type: "select", options: [
          { value: "ACTIVE", label: "Active" },
          { value: "INACTIVE", label: "Inactive" }
        ]},
        { name: "displayOrder", label: "Display order", type: "number" }
      ]}
      toForm={(item) => ({
        name: item?.name ?? "",
        logoUrl: item?.logoUrl ?? "",
        description: item?.description ?? "",
        website: item?.website ?? "",
        country: item?.country ?? "Nepal",
        status: item?.status ?? "ACTIVE",
        displayOrder: item?.displayOrder ?? 0
      })}
      toPayload={(values) => values}
    />
  );
}
