import { ResourceCrud, StatusCell } from "@/components/admin/ResourceCrud";
import { adminApi } from "@/api/admin.api";
import { documentFormSchema } from "@/schemas/cms.schema";
import type { DocumentItem } from "@/types/content";

export default function Documents() {
  return (
    <ResourceCrud<DocumentItem>
      title="Documents"
      crumbs={[{ label: "Admin", to: "/admin" }, { label: "Documents" }]}
      queryKey="admin-documents"
      list={adminApi.documents.list}
      create={adminApi.documents.create}
      update={adminApi.documents.update}
      remove={adminApi.documents.remove}
      schema={documentFormSchema}
      columns={[
        { key: "title", header: "Title", render: (row) => row.title },
        { key: "type", header: "Type", render: (row) => row.documentType },
        { key: "public", header: "Public", render: (row) => (row.isPublic ? "Yes" : "No") },
        { key: "status", header: "Status", render: (row) => <StatusCell value={row.status} /> }
      ]}
      fields={[
        { name: "title", label: "Title" },
        { name: "documentType", label: "Type", type: "select", options: [
          "LICENSE","CERTIFICATE","REGISTRATION","ANNUAL_REPORT","POLICY","OTHER"
        ].map((value) => ({ value, label: value })) },
        { name: "fileUrl", label: "File URL" },
        { name: "fileName", label: "File name" },
        { name: "issueDate", label: "Issue date", type: "date" },
        { name: "expiryDate", label: "Expiry date", type: "date" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "isPublic", label: "Public", type: "checkbox" },
        { name: "status", label: "Status", type: "select", options: [
          { value: "ACTIVE", label: "Active" },
          { value: "INACTIVE", label: "Inactive" }
        ]},
        { name: "displayOrder", label: "Display order", type: "number" }
      ]}
      toForm={(item) => ({
        title: item?.title ?? "",
        documentType: item?.documentType ?? "OTHER",
        fileUrl: item?.fileUrl ?? "",
        fileName: item?.fileName ?? "",
        issueDate: item?.issueDate ? String(item.issueDate).slice(0, 10) : "",
        expiryDate: item?.expiryDate ? String(item.expiryDate).slice(0, 10) : "",
        description: item?.description ?? "",
        isPublic: item?.isPublic ?? false,
        status: item?.status ?? "ACTIVE",
        displayOrder: item?.displayOrder ?? 0
      })}
      toPayload={(values) => values}
    />
  );
}
