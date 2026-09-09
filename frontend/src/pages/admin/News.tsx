import { ResourceCrud, StatusCell } from "@/components/admin/ResourceCrud";
import { adminApi } from "@/api/admin.api";
import { newsFormSchema } from "@/schemas/cms.schema";
import type { NewsItem } from "@/types/content";

export default function News() {
  return (
    <ResourceCrud<NewsItem>
      title="News"
      crumbs={[{ label: "Admin", to: "/admin" }, { label: "News" }]}
      queryKey="admin-news"
      list={adminApi.news.list}
      create={adminApi.news.create}
      update={adminApi.news.update}
      remove={adminApi.news.remove}
      schema={newsFormSchema}
      columns={[
        { key: "title", header: "Title", render: (row) => row.title },
        { key: "category", header: "Category", render: (row) => row.category },
        { key: "status", header: "Status", render: (row) => <StatusCell value={row.status} /> }
      ]}
      fields={[
        { name: "title", label: "Title" },
        { name: "slug", label: "Slug" },
        { name: "summary", label: "Summary", type: "textarea" },
        { name: "content", label: "Content (HTML)", type: "textarea" },
        { name: "featuredImage", label: "Featured image URL" },
        { name: "category", label: "Category", type: "select", options: [
          { value: "NEWS", label: "News" },
          { value: "NOTICE", label: "Notice" },
          { value: "ALERT", label: "Alert" }
        ]},
        { name: "publishedAt", label: "Published at", type: "date" },
        { name: "author", label: "Author" },
        { name: "status", label: "Status", type: "select", options: [
          { value: "DRAFT", label: "Draft" },
          { value: "PUBLISHED", label: "Published" },
          { value: "ARCHIVED", label: "Archived" }
        ]},
        { name: "seoTitle", label: "SEO title" },
        { name: "seoDescription", label: "SEO description" }
      ]}
      toForm={(item) => ({
        title: item?.title ?? "",
        slug: item?.slug ?? "",
        summary: item?.summary ?? "",
        content: item?.content ?? "",
        featuredImage: item?.featuredImage ?? "",
        category: item?.category ?? "NEWS",
        publishedAt: item?.publishedAt ? String(item.publishedAt).slice(0, 10) : "",
        author: item?.author ?? "",
        status: item?.status ?? "DRAFT",
        seoTitle: item?.seoTitle ?? "",
        seoDescription: item?.seoDescription ?? ""
      })}
      toPayload={(values) => values}
    />
  );
}
