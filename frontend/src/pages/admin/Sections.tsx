import { ResourceCrud, StatusCell } from "@/components/admin/ResourceCrud";
import { adminApi } from "@/api/admin.api";
import { sectionFormSchema } from "@/schemas/cms.schema";
import type { CmsSection } from "@/types/content";

const types = ["HERO","STATS","SERVICES","RATES","WHY_CHOOSE","PARTNERS","NEWS","BRANCH_FINDER","CONTACT_CTA","CUSTOM"].map((value) => ({ value, label: value }));

export default function Sections() {
  return (
    <ResourceCrud<CmsSection>
      title="Sections"
      description="Homepage and reusable website sections"
      crumbs={[{ label: "Admin", to: "/admin" }, { label: "Sections" }]}
      queryKey="admin-sections"
      list={adminApi.sections.list}
      create={adminApi.sections.create}
      update={adminApi.sections.update}
      remove={adminApi.sections.remove}
      schema={sectionFormSchema}
      columns={[
        { key: "heading", header: "Heading", render: (row) => row.heading || row.key },
        { key: "type", header: "Type", render: (row) => row.type },
        { key: "order", header: "Order", render: (row) => row.displayOrder },
        { key: "enabled", header: "Enabled", render: (row) => <StatusCell value={row.enabled ? "ACTIVE" : "INACTIVE"} /> }
      ]}
      fields={[
        { name: "key", label: "Key" },
        { name: "type", label: "Type", type: "select", options: types },
        { name: "heading", label: "Heading" },
        { name: "subheading", label: "Subheading" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "backgroundUrl", label: "Background URL" },
        { name: "imageUrl", label: "Image URL" },
        { name: "buttonLabel", label: "Button label" },
        { name: "buttonUrl", label: "Button URL" },
        { name: "secondaryButtonLabel", label: "Secondary button label" },
        { name: "secondaryButtonUrl", label: "Secondary button URL" },
        { name: "alignment", label: "Alignment", type: "select", options: [
          { value: "left", label: "Left" },
          { value: "center", label: "Center" },
          { value: "right", label: "Right" }
        ]},
        { name: "itemsJson", label: "Items JSON", type: "textarea", hint: "Array of objects" },
        { name: "overlay", label: "Dark overlay", type: "checkbox" },
        { name: "enabled", label: "Enabled", type: "checkbox" },
        { name: "displayOrder", label: "Display order", type: "number" }
      ]}
      toForm={(item) => ({
        key: item?.key ?? "",
        type: item?.type ?? "CUSTOM",
        heading: item?.heading ?? "",
        subheading: item?.subheading ?? "",
        description: item?.description ?? "",
        backgroundUrl: item?.backgroundUrl ?? "",
        imageUrl: item?.imageUrl ?? "",
        buttonLabel: item?.buttonLabel ?? "",
        buttonUrl: item?.buttonUrl ?? "",
        secondaryButtonLabel: item?.secondaryButtonLabel ?? "",
        secondaryButtonUrl: item?.secondaryButtonUrl ?? "",
        alignment: item?.alignment ?? "left",
        itemsJson: item?.items ? JSON.stringify(item.items, null, 2) : "[]",
        overlay: item?.overlay ?? true,
        enabled: item?.enabled ?? true,
        displayOrder: item?.displayOrder ?? 0
      })}
      toPayload={(values) => {
        let items: unknown = [];
        try {
          items = JSON.parse(String(values.itemsJson || "[]"));
        } catch {
          items = [];
        }
        return {
          key: values.key,
          type: values.type,
          heading: values.heading,
          subheading: values.subheading,
          description: values.description,
          backgroundUrl: values.backgroundUrl,
          imageUrl: values.imageUrl,
          buttonLabel: values.buttonLabel,
          buttonUrl: values.buttonUrl,
          secondaryButtonLabel: values.secondaryButtonLabel,
          secondaryButtonUrl: values.secondaryButtonUrl,
          alignment: values.alignment,
          overlay: values.overlay,
          enabled: values.enabled,
          displayOrder: values.displayOrder,
          items
        };
      }}
    />
  );
}
