import { ResourceCrud, StatusCell } from "@/components/admin/ResourceCrud";
import { adminApi } from "@/api/admin.api";
import { remittanceFormSchema } from "@/schemas/cms.schema";
import type { RemittanceItem } from "@/types/content";

export default function Remittances() {
  return (
    <ResourceCrud<RemittanceItem>
      title="Control numbers"
      description="Add each remittance control number and mark it Paid or Unpaid. Tracking on the website only returns a status when the number exists here."
      crumbs={[{ label: "Admin", to: "/admin" }, { label: "Control numbers" }]}
      queryKey="admin-remittances"
      list={adminApi.remittances.list}
      create={adminApi.remittances.create}
      update={adminApi.remittances.update}
      remove={adminApi.remittances.remove}
      schema={remittanceFormSchema}
      columns={[
        { key: "controlNumber", header: "Control number", render: (row) => row.controlNumber },
        { key: "status", header: "Status", render: (row) => <StatusCell value={row.status} /> }
      ]}
      fields={[
        { name: "controlNumber", label: "Control number" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "UNPAID", label: "Unpaid" },
            { value: "PAID", label: "Paid" }
          ]
        }
      ]}
      toForm={(item) => ({
        controlNumber: item?.controlNumber ?? "",
        status: item?.status ?? "UNPAID"
      })}
      toPayload={(values) => ({
        controlNumber: String(values.controlNumber).trim(),
        status: values.status === "PAID" ? "PAID" : "UNPAID"
      })}
    />
  );
}
