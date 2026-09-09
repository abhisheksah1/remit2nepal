import { ResourceCrud, StatusCell } from "@/components/admin/ResourceCrud";
import { adminApi } from "@/api/admin.api";
import { newsFormSchema } from "@/schemas/cms.schema";
import type { NewsItem } from "@/types/content";

export default function News() {
  return (
    <ResourceCrud<NewsItem>
      title="News"
      description="Newspaper stories: English and Nepali title, punch line, photo, and body. Published items appear on Home and News."
      crumbs={[{ label: "Admin", to: "/admin" }, { label: "News" }]}
      queryKey="admin-news"
      list={adminApi.news.list}
      create={adminApi.news.create}
      update={adminApi.news.update}
      remove={adminApi.news.remove}
      schema={newsFormSchema}
      columns={[
        { key: "title", header: "Title", render: (row) => row.title },
        { key: "titleNe", header: "नेपाली", render: (row) => row.titleNe || "—" },
        { key: "category", header: "Category", render: (row) => row.category },
        { key: "status", header: "Status", render: (row) => <StatusCell value={row.status} /> }
      ]}
      fields={[
        { name: "title", label: "Title (English)" },
        { name: "titleNe", label: "शीर्षक (नेपाली)" },
        { name: "slug", label: "Slug" },
        { name: "punchLine", label: "Punch line (English)", hint: "Short deck under the headline, newspaper style." },
        { name: "punchLineNe", label: "पञ्च लाइन (नेपाली)" },
        { name: "summary", label: "Summary (English)", type: "textarea" },
        { name: "summaryNe", label: "सारांश (नेपाली)", type: "textarea" },
        { name: "content", label: "Story (English HTML)", type: "textarea" },
        { name: "contentNe", label: "समाचार (नेपाली HTML)", type: "textarea" },
        {
          name: "featuredImage",
          label: "Photo",
          type: "image",
          folder: "news",
          hint: "Newspaper cover photo. Shown on Home, listing, and the story page."
        },
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
        titleNe: item?.titleNe ?? "",
        slug: item?.slug ?? "",
        punchLine: item?.punchLine ?? "",
        punchLineNe: item?.punchLineNe ?? "",
        summary: item?.summary ?? "",
        summaryNe: item?.summaryNe ?? "",
        content: item?.content ?? "",
        contentNe: item?.contentNe ?? "",
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
