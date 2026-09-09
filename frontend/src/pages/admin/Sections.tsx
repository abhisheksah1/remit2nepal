import { ResourceCrud, StatusCell } from "@/components/admin/ResourceCrud";
import { adminApi } from "@/api/admin.api";
import { sectionFormSchema } from "@/schemas/cms.schema";
import type { CmsSection } from "@/types/content";

const isMap = (values: Record<string, string | number | boolean>) =>
  values.type === "NEPAL_MAP" || values.type === "GALLERY";
const isRemittance = (values: Record<string, string | number | boolean>) => values.type === "REMITTANCE";

const types = [
  { value: "HERO", label: "Hero" },
  { value: "STATS", label: "Stats" },
  { value: "SERVICES", label: "Services" },
  { value: "RATES", label: "Exchange rates" },
  { value: "WHY_CHOOSE", label: "Why Remit2Nepal" },
  { value: "NEPAL_MAP", label: "Nepal people map" },
  { value: "REMITTANCE", label: "Remittance letter cubes" },
  { value: "GALLERY", label: "Gallery" },
  { value: "PARTNERS", label: "Partners" },
  { value: "NEWS", label: "News" },
  { value: "BRANCH_FINDER", label: "Agent finder" },
  { value: "CONTACT_CTA", label: "Contact banner" },
  { value: "CUSTOM", label: "Custom HTML" }
];

function collageFrom(item?: CmsSection): [string, string, string, string] {
  const items = Array.isArray(item?.items) ? item.items : [];
  const pick = (index: number) => {
    const row = items[index];
    if (row && typeof row === "object" && "imageUrl" in row) {
      return String((row as { imageUrl?: string }).imageUrl ?? "");
    }
    return "";
  };
  return [pick(0), pick(1), pick(2), pick(3)];
}

function cubeWordFrom(item?: CmsSection) {
  const items = Array.isArray(item?.items) ? item.items : [];
  const row = items[0];
  if (row && typeof row === "object" && "word" in row) {
    return String((row as { word?: string }).word ?? "");
  }
  return "";
}

export default function Sections() {
  return (
    <ResourceCrud<CmsSection>
      title="Sections"
      description="Every homepage block is editable here: copy, photos, buttons, order, and visibility."
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
        { name: "icon", label: "Kicker", hint: "Small red label above the heading (Nepal map, Why, custom blocks)." },
        { name: "heading", label: "Heading" },
        { name: "subheading", label: "Subheading" },
        { name: "description", label: "Description", type: "textarea" },
        {
          name: "backgroundUrl",
          label: "Background image",
          type: "image",
          folder: "sections",
          hint: "Hero backdrop, Nepal map cityscape, or section wash."
        },
        {
          name: "imageUrl",
          label: "Main image",
          type: "image",
          folder: "sections",
          hint: "For Nepal people map: one photo fills the whole Nepal shape. Leave empty to use collage tiles."
        },
        {
          name: "collage1",
          label: "Collage photo 1",
          type: "image",
          folder: "gallery",
          hint: "Clipped into the Nepal map. Upload Nepali community photos.",
          showWhen: isMap
        },
        {
          name: "collage2",
          label: "Collage photo 2",
          type: "image",
          folder: "gallery",
          showWhen: isMap
        },
        {
          name: "collage3",
          label: "Collage photo 3",
          type: "image",
          folder: "gallery",
          showWhen: isMap
        },
        {
          name: "collage4",
          label: "Collage photo 4",
          type: "image",
          folder: "gallery",
          showWhen: isMap
        },
        {
          name: "cubeWord",
          label: "Letter cubes word",
          hint: "Spelled on the dice, e.g. REMITTANCE or REMIT2NEPAL. Hover each letter on the site.",
          showWhen: isRemittance
        },
        { name: "buttonLabel", label: "Button label" },
        { name: "buttonUrl", label: "Button URL" },
        { name: "secondaryButtonLabel", label: "Secondary button label" },
        { name: "secondaryButtonUrl", label: "Secondary button URL" },
        {
          name: "alignment",
          label: "Alignment",
          type: "select",
          options: [
            { value: "left", label: "Left" },
            { value: "center", label: "Center" },
            { value: "right", label: "Right" }
          ]
        },
        {
          name: "itemsJson",
          label: "Items JSON",
          type: "textarea",
          hint: "Stats, Why cards, or extra collage tiles: [{ \"imageUrl\": \"/uploads/...\", \"alt\": \"Family\", \"title\": \"Home\" }]"
        },
        { name: "overlay", label: "Overlay", type: "checkbox" },
        { name: "enabled", label: "Enabled", type: "checkbox" },
        { name: "displayOrder", label: "Display order", type: "number" }
      ]}
      toForm={(item) => {
        const [collage1, collage2, collage3, collage4] = collageFrom(item);
        return {
          key: item?.key ?? "",
          type: item?.type ?? "CUSTOM",
          icon: item?.icon ?? "",
          heading: item?.heading ?? "",
          subheading: item?.subheading ?? "",
          description: item?.description ?? "",
          backgroundUrl: item?.backgroundUrl ?? "",
          imageUrl: item?.imageUrl ?? "",
          collage1,
          collage2,
          collage3,
          collage4,
          cubeWord: cubeWordFrom(item),
          buttonLabel: item?.buttonLabel ?? "",
          buttonUrl: item?.buttonUrl ?? "",
          secondaryButtonLabel: item?.secondaryButtonLabel ?? "",
          secondaryButtonUrl: item?.secondaryButtonUrl ?? "",
          alignment: item?.alignment ?? "left",
          itemsJson: item?.items ? JSON.stringify(item.items, null, 2) : "[]",
          overlay: item?.overlay ?? true,
          enabled: item?.enabled ?? true,
          displayOrder: item?.displayOrder ?? 0
        };
      }}
      toPayload={(values) => {
        let items: unknown = [];
        try {
          items = JSON.parse(String(values.itemsJson || "[]"));
        } catch {
          items = [];
        }
        const collage = [values.collage1, values.collage2, values.collage3, values.collage4]
          .map((value) => String(value ?? "").trim())
          .filter(Boolean);
        if (collage.length && (values.type === "NEPAL_MAP" || values.type === "GALLERY")) {
          const existing = Array.isArray(items) ? items : [];
          items = collage.map((imageUrl, index) => {
            const row = existing[index];
            const extra = row && typeof row === "object" ? (row as Record<string, unknown>) : {};
            return { ...extra, imageUrl };
          });
        }
        const cubeWord = String(values.cubeWord ?? "").trim();
        if (cubeWord && values.type === "REMITTANCE") {
          const existing = Array.isArray(items) ? items : [];
          const first = existing[0] && typeof existing[0] === "object" ? (existing[0] as Record<string, unknown>) : {};
          items = [{ ...first, word: cubeWord }, ...existing.slice(1)];
        }
        return {
          key: values.key,
          type: values.type,
          icon: values.icon,
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
