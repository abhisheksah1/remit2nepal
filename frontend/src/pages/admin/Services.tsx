import { ResourceCrud, StatusCell } from "@/components/admin/ResourceCrud";
import { adminApi } from "@/api/admin.api";
import { serviceFormSchema } from "@/schemas/cms.schema";
import type { ServiceItem } from "@/types/content";
import { joinCsv, splitCsv } from "@/utils/cn";
import { SERVICE_ACCENT_OPTIONS, SERVICE_ICON_OPTIONS } from "@/utils/service-visuals";

export default function Services() {
  return (
    <ResourceCrud<ServiceItem>
      title="Services"
      description="Each service becomes a card on the homepage and Services page. Title, text, icon, colour, and photo are all set here."
      crumbs={[{ label: "Admin", to: "/admin" }, { label: "Services" }]}
      queryKey="admin-services"
      list={adminApi.services.list}
      create={adminApi.services.create}
      update={adminApi.services.update}
      remove={adminApi.services.remove}
      schema={serviceFormSchema}
      columns={[
        { key: "title", header: "Title", render: (row) => row.title },
        { key: "icon", header: "Icon", render: (row) => row.icon || "—" },
        { key: "status", header: "Status", render: (row) => <StatusCell value={row.status} /> }
      ]}
      fields={[
        { name: "title", label: "Title", group: "Copy" },
        { name: "slug", label: "Slug", group: "Copy", hint: "Used in the service page URL." },
        { name: "shortDescription", label: "Card text", type: "textarea", group: "Copy", hint: "Shown on the scrolling service cards." },
        { name: "fullDescription", label: "Full description (HTML)", type: "textarea", group: "Copy" },
        {
          name: "icon",
          label: "Icon",
          type: "select",
          group: "Card",
          options: [...SERVICE_ICON_OPTIONS]
        },
        {
          name: "accentColor",
          label: "Card colour",
          type: "select",
          group: "Card",
          hint: "Top bar and icon colour on the public cards.",
          options: [...SERVICE_ACCENT_OPTIONS]
        },
        {
          name: "imageUrl",
          label: "Custom icon image",
          type: "image",
          folder: "services",
          group: "Card",
          previewFit: "contain",
          hint: "Optional. If uploaded, this photo replaces the icon inside the circle."
        },
        { name: "features", label: "Features (comma separated)", group: "Details" },
        { name: "countryAvailability", label: "Countries (comma separated)", group: "Details" },
        {
          name: "status",
          label: "Status",
          type: "select",
          group: "Schedule",
          options: [
            { value: "ACTIVE", label: "Active" },
            { value: "INACTIVE", label: "Inactive" }
          ]
        },
        { name: "displayOrder", label: "Display order", type: "number", group: "Schedule" },
        { name: "seoTitle", label: "SEO title", group: "Schedule" },
        { name: "seoDescription", label: "SEO description", group: "Schedule" }
      ]}
      toForm={(item) => ({
        title: item?.title ?? "",
        slug: item?.slug ?? "",
        shortDescription: item?.shortDescription ?? "",
        fullDescription: item?.fullDescription ?? "",
        icon: item?.icon ?? "globe",
        accentColor: item?.accentColor || "#2E3192",
        imageUrl: item?.imageUrl ?? "",
        features: joinCsv(item?.features),
        countryAvailability: joinCsv(item?.countryAvailability),
        status: item?.status ?? "ACTIVE",
        displayOrder: item?.displayOrder ?? 0,
        seoTitle: item?.seoTitle ?? "",
        seoDescription: item?.seoDescription ?? ""
      })}
      toPayload={(values) => ({
        ...values,
        features: splitCsv(String(values.features ?? "")),
        countryAvailability: splitCsv(String(values.countryAvailability ?? ""))
      })}
    />
  );
}
