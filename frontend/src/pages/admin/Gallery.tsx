import { ResourceCrud, StatusCell } from "@/components/admin/ResourceCrud";
import { adminApi } from "@/api/admin.api";
import { galleryFormSchema } from "@/schemas/cms.schema";
import type { GalleryItem } from "@/types/content";

export default function Gallery() {
  return (
    <ResourceCrud<GalleryItem>
      title="Gallery"
      description="Upload photos of Nepali people, branches, and events. They fill the Nepal map on Home and Gallery."
      crumbs={[{ label: "Admin", to: "/admin" }, { label: "Gallery" }]}
      queryKey="admin-gallery"
      list={adminApi.gallery.list}
      create={adminApi.gallery.create}
      update={adminApi.gallery.update}
      remove={adminApi.gallery.remove}
      schema={galleryFormSchema}
      columns={[
        { key: "title", header: "Title", render: (row) => row.title },
        { key: "category", header: "Category", render: (row) => row.category },
        { key: "status", header: "Status", render: (row) => <StatusCell value={row.status} /> }
      ]}
      fields={[
        { name: "title", label: "Title" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "category", label: "Category", hint: "Use People, Branch, or Event so the Nepal map can group photos." },
        { name: "imageUrl", label: "Photo", type: "image", folder: "gallery", hint: "Upload a real photo. It also appears inside the Nepal map collage." },
        { name: "embedUrl", label: "Embed URL" },
        { name: "altText", label: "Alt text" },
        { name: "status", label: "Status", type: "select", options: [
          { value: "ACTIVE", label: "Active" },
          { value: "INACTIVE", label: "Inactive" }
        ]},
        { name: "displayOrder", label: "Display order", type: "number" }
      ]}
      toForm={(item) => ({
        title: item?.title ?? "",
        description: item?.description ?? "",
        category: item?.category ?? "General",
        imageUrl: item?.imageUrl ?? "",
        embedUrl: item?.embedUrl ?? "",
        altText: item?.altText ?? "",
        status: item?.status ?? "ACTIVE",
        displayOrder: item?.displayOrder ?? 0
      })}
      toPayload={(values) => values}
    />
  );
}
