import { ResourceCrud, StatusCell } from "@/components/admin/ResourceCrud";
import { adminApi } from "@/api/admin.api";
import { partnerFormSchema } from "@/schemas/cms.schema";
import type { PartnerItem } from "@/types/content";

export default function Partners() {
  return (
    <ResourceCrud<PartnerItem>
      title="Partners"
      description="Add each desk and upload its logo. Active partners appear on the homepage Global remittance partners strip."
      crumbs={[{ label: "Admin", to: "/admin" }, { label: "Partners" }]}
      queryKey="admin-partners"
      list={adminApi.partners.list}
      create={adminApi.partners.create}
      update={adminApi.partners.update}
      remove={adminApi.partners.remove}
      schema={partnerFormSchema}
      columns={[
        { key: "name", header: "Name", render: (row) => row.name },
        { key: "kind", header: "Type", render: (row) => row.kind === "INTERNATIONAL" ? "International" : "National" },
        { key: "nationalType", header: "National type", render: (row) => row.kind === "NATIONAL" ? (row.nationalType === "COOPERATIVE" ? "Cooperative" : row.nationalType === "PRIVATE_AGENT" ? "Private Agent" : row.nationalType === "BANK" ? "Bank" : "—") : "—" },
        { key: "country", header: "Country", render: (row) => row.country },
        { key: "status", header: "Status", render: (row) => <StatusCell value={row.status} /> }
      ]}
      fields={[
        { name: "name", label: "Name" },
        {
          name: "logoUrl",
          label: "Logo",
          type: "image",
          folder: "partners",
          hint: "Square or wide logo on a clear background. Shown on the homepage partner strip."
        },
        { name: "description", label: "Description", type: "textarea" },
        { name: "website", label: "Website" },
        { name: "country", label: "Country" },
        { name: "kind", label: "Partner type", type: "select", options: [
          { value: "NATIONAL", label: "National Partner" },
          { value: "INTERNATIONAL", label: "International Partner" }
        ]},
        { name: "nationalType", label: "National type", type: "select", hint: "Used when the partner is National.", options: [
          { value: "", label: "—" },
          { value: "COOPERATIVE", label: "Cooperative" },
          { value: "PRIVATE_AGENT", label: "Private Agent" },
          { value: "BANK", label: "Bank" }
        ]},
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
        kind: item?.kind ?? (/nepal/i.test(item?.country ?? "Nepal") ? "NATIONAL" : "INTERNATIONAL"),
        nationalType: item?.nationalType ?? "",
        status: item?.status ?? "ACTIVE",
        displayOrder: item?.displayOrder ?? 0
      })}
      toPayload={(values) => ({
        ...values,
        nationalType: values.kind === "NATIONAL" ? values.nationalType : ""
      })}
    />
  );
}
