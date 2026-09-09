import { ResourceCrud, StatusCell } from "@/components/admin/ResourceCrud";
import { adminApi } from "@/api/admin.api";
import { pageFormSchema } from "@/schemas/cms.schema";
import type { CmsPage } from "@/types/content";

export default function Pages() {
  return (
    <ResourceCrud<CmsPage>
      title="Pages"
      description="Published legal and informational pages"
      crumbs={[{ label: "Admin", to: "/admin" }, { label: "Pages" }]}
      queryKey="admin-pages"
      list={adminApi.pages.list}
      create={adminApi.pages.create}
      update={adminApi.pages.update}
      remove={adminApi.pages.remove}
      schema={pageFormSchema}
      columns={[
        { key: "title", header: "Title", render: (row) => row.title },
        { key: "slug", header: "Slug", render: (row) => row.slug },
        { key: "status", header: "Status", render: (row) => <StatusCell value={row.status} /> }
      ]}
      fields={[
        { name: "title", label: "Title" },
        { name: "slug", label: "Slug" },
        { name: "summary", label: "Summary", type: "textarea" },
        { name: "content", label: "Content (HTML)", type: "textarea" },
        { name: "status", label: "Status", type: "select", options: [
          { value: "DRAFT", label: "Draft" },
          { value: "PUBLISHED", label: "Published" },
          { value: "ARCHIVED", label: "Archived" }
        ]},
        { name: "seoTitle", label: "SEO title" },
        { name: "seoDescription", label: "SEO description", type: "textarea" },
        { name: "displayOrder", label: "Display order", type: "number" }
      ]}
      toForm={(item) => ({
        title: item?.title ?? "",
        slug: item?.slug ?? "",
        summary: item?.summary ?? "",
        content: item?.content ?? "",
        status: item?.status ?? "DRAFT",
        seoTitle: item?.seoTitle ?? "",
        seoDescription: item?.seoDescription ?? "",
        displayOrder: item?.displayOrder ?? 0
      })}
      toPayload={(values) => values}
    />
  );
}
