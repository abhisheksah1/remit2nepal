import { ResourceCrud, StatusCell } from "@/components/admin/ResourceCrud";
import { adminApi } from "@/api/admin.api";
import { serviceFormSchema } from "@/schemas/cms.schema";
import type { ServiceItem } from "@/types/content";
import { joinCsv, splitCsv } from "@/utils/cn";

export default function Services() {
  return (
    <ResourceCrud<ServiceItem>
      title="Services"
      crumbs={[{ label: "Admin", to: "/admin" }, { label: "Services" }]}
      queryKey="admin-services"
      list={adminApi.services.list}
      create={adminApi.services.create}
      update={adminApi.services.update}
      remove={adminApi.services.remove}
      schema={serviceFormSchema}
      columns={[
        { key: "title", header: "Title", render: (row) => row.title },
        { key: "slug", header: "Slug", render: (row) => row.slug },
        { key: "status", header: "Status", render: (row) => <StatusCell value={row.status} /> }
      ]}
      fields={[
        { name: "title", label: "Title" },
        { name: "slug", label: "Slug" },
        { name: "shortDescription", label: "Short description", type: "textarea" },
        { name: "fullDescription", label: "Full description (HTML)", type: "textarea" },
        { name: "icon", label: "Icon key" },
        { name: "imageUrl", label: "Image URL" },
        { name: "features", label: "Features (comma separated)" },
        { name: "countryAvailability", label: "Countries (comma separated)" },
        { name: "status", label: "Status", type: "select", options: [
          { value: "ACTIVE", label: "Active" },
          { value: "INACTIVE", label: "Inactive" }
        ]},
        { name: "displayOrder", label: "Display order", type: "number" },
        { name: "seoTitle", label: "SEO title" },
        { name: "seoDescription", label: "SEO description" }
      ]}
      toForm={(item) => ({
        title: item?.title ?? "",
        slug: item?.slug ?? "",
        shortDescription: item?.shortDescription ?? "",
        fullDescription: item?.fullDescription ?? "",
        icon: item?.icon ?? "",
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
