import { ResourceCrud, StatusCell } from "@/components/admin/ResourceCrud";
import { adminApi } from "@/api/admin.api";
import { faqFormSchema } from "@/schemas/cms.schema";
import type { FaqItem } from "@/types/content";

export default function Faq() {
  return (
    <ResourceCrud<FaqItem>
      title="FAQs"
      crumbs={[{ label: "Admin", to: "/admin" }, { label: "FAQ" }]}
      queryKey="admin-faqs"
      list={adminApi.faqs.list}
      create={adminApi.faqs.create}
      update={adminApi.faqs.update}
      remove={adminApi.faqs.remove}
      schema={faqFormSchema}
      columns={[
        { key: "question", header: "Question", render: (row) => row.question },
        { key: "category", header: "Category", render: (row) => row.category },
        { key: "status", header: "Status", render: (row) => <StatusCell value={row.status} /> }
      ]}
      fields={[
        { name: "question", label: "Question" },
        { name: "answer", label: "Answer (HTML)", type: "textarea" },
        { name: "category", label: "Category" },
        { name: "status", label: "Status", type: "select", options: [
          { value: "ACTIVE", label: "Active" },
          { value: "INACTIVE", label: "Inactive" }
        ]},
        { name: "displayOrder", label: "Display order", type: "number" }
      ]}
      toForm={(item) => ({
        question: item?.question ?? "",
        answer: item?.answer ?? "",
        category: item?.category ?? "General",
        status: item?.status ?? "ACTIVE",
        displayOrder: item?.displayOrder ?? 0
      })}
      toPayload={(values) => values}
    />
  );
}
