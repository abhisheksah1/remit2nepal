import { ResourceCrud, StatusCell } from "@/components/admin/ResourceCrud";
import { adminApi } from "@/api/admin.api";
import { sectionFormSchema } from "@/schemas/cms.schema";
import type { CmsSection } from "@/types/content";

type FormValues = Record<string, string | number | boolean>;

const isType =
  (...types: string[]) =>
  (values: FormValues) =>
    types.includes(String(values.type));

const isHero = isType("HERO");
const isStats = isType("STATS");
const isWhy = isType("WHY_CHOOSE");
const isRemittance = isType("REMITTANCE");
const isTestimonials = isType("TESTIMONIALS");
const isPartners = isType("PARTNERS");
const isNews = isType("NEWS");
const isServices = isType("SERVICES");
const isRates = isType("RATES");
const isBranch = isType("BRANCH_FINDER");
const isContact = isType("CONTACT_CTA");
const isMap = isType("NEPAL_MAP", "GALLERY");
const isCustom = isType("CUSTOM");
const hasKicker = isType(
  "WHY_CHOOSE",
  "REMITTANCE",
  "PARTNERS",
  "NEWS",
  "TESTIMONIALS",
  "CONTACT_CTA",
  "NEPAL_MAP",
  "GALLERY",
  "SERVICES",
  "RATES",
  "BRANCH_FINDER"
);
const hasHeading = (values: FormValues) => !isStats(values) && !isTestimonials(values);
const hasPunch = isType(
  "WHY_CHOOSE",
  "REMITTANCE",
  "PARTNERS",
  "NEWS",
  "SERVICES",
  "RATES",
  "BRANCH_FINDER",
  "CONTACT_CTA",
  "NEPAL_MAP",
  "GALLERY"
);
const hasDescription = isType(
  "HERO",
  "WHY_CHOOSE",
  "REMITTANCE",
  "PARTNERS",
  "SERVICES",
  "RATES",
  "BRANCH_FINDER",
  "CONTACT_CTA",
  "NEPAL_MAP",
  "CUSTOM"
);
const hasPrimaryButton = isType("HERO", "REMITTANCE", "PARTNERS", "RATES", "NEWS", "CONTACT_CTA", "NEPAL_MAP", "GALLERY");
const hasSecondaryButton = isHero;
const whenEditing = (_values: FormValues, editing: boolean) => editing;

const types = [
  { value: "HERO", label: "Hero" },
  { value: "STATS", label: "Hero stats" },
  { value: "SERVICES", label: "Services" },
  { value: "RATES", label: "Exchange rates" },
  { value: "WHY_CHOOSE", label: "Why Remit2Nepal" },
  { value: "REMITTANCE", label: "Remittance cubes" },
  { value: "PARTNERS", label: "Partners" },
  { value: "TESTIMONIALS", label: "Testimonials" },
  { value: "NEWS", label: "News" },
  { value: "BRANCH_FINDER", label: "Agent finder" },
  { value: "NEPAL_MAP", label: "Nepal map" },
  { value: "GALLERY", label: "Gallery" },
  { value: "CONTACT_CTA", label: "Contact banner" },
  { value: "CUSTOM", label: "Custom HTML" }
];

function cubeWordFrom(item?: CmsSection) {
  const items = Array.isArray(item?.items) ? item.items : [];
  const row = items[0];
  if (row && typeof row === "object" && "word" in row) {
    return String((row as { word?: string }).word ?? "");
  }
  return "";
}

function itemsJsonFrom(item?: CmsSection) {
  const items = Array.isArray(item?.items) ? item.items : [];
  if (item?.type === "HERO") {
    const chips = items.filter((row) => row && typeof row === "object" && "title" in row && !("value" in row));
    return JSON.stringify(chips);
  }
  if (item?.type === "REMITTANCE") return "[]";
  return JSON.stringify(items);
}

export default function Sections() {
  return (
    <ResourceCrud<CmsSection>
      title="Sections"
      description="Edit homepage copy, buttons, and cards. Only fields that appear on the public site are shown."
      crumbs={[{ label: "Admin", to: "/admin" }, { label: "Sections" }]}
      queryKey="admin-sections"
      list={adminApi.sections.list}
      create={adminApi.sections.create}
      update={adminApi.sections.update}
      remove={adminApi.sections.remove}
      schema={sectionFormSchema}
      itemTitle={(row) => row.heading || types.find((item) => item.value === row.type)?.label || row.key}
      columns={[
        { key: "heading", header: "Heading", render: (row) => row.heading || row.key },
        { key: "type", header: "Type", render: (row) => types.find((item) => item.value === row.type)?.label || row.type },
        { key: "order", header: "Order", render: (row) => row.displayOrder },
        { key: "enabled", header: "Enabled", render: (row) => <StatusCell value={row.enabled ? "ACTIVE" : "INACTIVE"} /> }
      ]}
      fields={[
        { name: "type", label: "Block type", type: "select", options: types, group: "Block", disabledWhen: whenEditing },
        { name: "key", label: "Key", group: "Block", hint: "Internal id. Do not change after create.", disabledWhen: whenEditing },
        { name: "enabled", label: "Show on site", type: "checkbox", group: "Block" },
        { name: "displayOrder", label: "Order on homepage", type: "number", group: "Block" },

        {
          name: "subheading",
          label: "Kicker",
          group: "Copy",
          hint: "Small line above the hero title.",
          showWhen: isHero
        },
        {
          name: "icon",
          label: "Kicker",
          group: "Copy",
          hint: "Small red label above the heading.",
          showWhen: hasKicker
        },
        {
          name: "heading",
          label: "Title",
          group: "Copy",
          hint: "Main headline on the homepage.",
          showWhen: hasHeading
        },
        {
          name: "subheading",
          id: "punch",
          label: "Punch line",
          group: "Copy",
          hint: "Line under the heading. Partners: Nepali line. Remittance: line under the cubes.",
          showWhen: hasPunch
        },
        {
          name: "description",
          label: "Intro",
          type: "textarea",
          group: "Copy",
          hint: "Short paragraph under the title. Leave empty if the punch line is enough.",
          showWhen: hasDescription
        },
        {
          name: "cubeWord",
          label: "Cube letters",
          group: "Copy",
          hint: "Word spelled on the cubes, for example REMITTANCE.",
          showWhen: isRemittance
        },

        {
          name: "buttonLabel",
          label: "Button text",
          group: "Buttons",
          showWhen: hasPrimaryButton
        },
        {
          name: "buttonUrl",
          label: "Button link",
          group: "Buttons",
          hint: "Page path, for example /exchange-rate or /partners.",
          showWhen: hasPrimaryButton
        },
        {
          name: "secondaryButtonLabel",
          label: "Second button text",
          group: "Buttons",
          showWhen: hasSecondaryButton
        },
        {
          name: "secondaryButtonUrl",
          label: "Second button link",
          group: "Buttons",
          showWhen: hasSecondaryButton
        },

        {
          name: "itemsJson",
          id: "items-hero",
          label: "Trust chips",
          type: "list",
          group: "On the page",
          addLabel: "Add chip",
          emptyItem: { title: "" },
          itemFields: [{ name: "title", label: "Chip text" }],
          hint: "Pills under the hero buttons.",
          showWhen: isHero
        },
        {
          name: "itemsJson",
          id: "items-why",
          label: "Why cards",
          type: "list",
          group: "On the page",
          addLabel: "Add card",
          emptyItem: { title: "", description: "" },
          itemFields: [
            { name: "title", label: "Title" },
            { name: "description", label: "Description", type: "textarea" }
          ],
          showWhen: isWhy
        },
        {
          name: "itemsJson",
          id: "items-stats",
          label: "Hero stats",
          type: "list",
          group: "On the page",
          addLabel: "Add stat",
          emptyItem: { label: "", value: "" },
          itemFields: [
            { name: "value", label: "Number" },
            { name: "label", label: "Label" }
          ],
          hint: "These numbers appear under the homepage hero.",
          showWhen: isStats
        },
        {
          name: "itemsJson",
          id: "items-voices",
          label: "Stories",
          type: "list",
          group: "On the page",
          addLabel: "Add story",
          emptyItem: { name: "", headline: "", headlineNe: "", quote: "", quoteNe: "", imageUrl: "" },
          itemFields: [
            { name: "name", label: "Name" },
            { name: "headline", label: "Headline (English)" },
            { name: "headlineNe", label: "शीर्षक (नेपाली)" },
            { name: "quote", label: "Quote (English)", type: "textarea" },
            { name: "quoteNe", label: "उद्धरण (नेपाली)", type: "textarea" },
            { name: "imageUrl", label: "Photo", type: "image", folder: "testimonials" }
          ],
          hint: "First story is featured on the homepage.",
          showWhen: isTestimonials
        },
        {
          name: "partnersNote",
          label: "Partner logos",
          type: "note",
          group: "On the page",
          hint: "Logos come from Admin → Partners. This block only controls the heading and button.",
          showWhen: isPartners
        },
        {
          name: "servicesNote",
          label: "Service cards",
          type: "note",
          group: "On the page",
          hint: "Cards come from Admin → Services. This block only controls the heading.",
          showWhen: isServices
        },
        {
          name: "newsNote",
          label: "News cards",
          type: "note",
          group: "On the page",
          hint: "Stories come from Admin → News. This block only controls the heading and button.",
          showWhen: isNews
        },
        {
          name: "ratesNote",
          label: "Rate table",
          type: "note",
          group: "On the page",
          hint: "Rates come from Admin → Exchange rates. This block only controls the heading and button.",
          showWhen: isRates
        },
        {
          name: "branchNote",
          label: "Agent finder",
          type: "note",
          group: "On the page",
          hint: "Agents come from Admin → Branches. This block only controls the heading.",
          showWhen: isBranch
        },
        {
          name: "mapNote",
          label: "Nepal map",
          type: "note",
          group: "On the page",
          hint: "The map uses live agent data. This block is currently hidden on the homepage.",
          showWhen: isMap
        },
        {
          name: "contactNote",
          label: "Contact banner",
          type: "note",
          group: "On the page",
          hint: "This banner is currently hidden on the homepage.",
          showWhen: isContact
        },
        {
          name: "customNote",
          label: "Custom HTML",
          type: "note",
          group: "On the page",
          hint: "Put HTML in Intro. Use this only for a one-off block.",
          showWhen: isCustom
        }
      ]}
      toForm={(item) => ({
        key: item?.key ?? "",
        type: item?.type ?? "CUSTOM",
        icon: item?.icon ?? "",
        heading: item?.heading ?? "",
        subheading: item?.subheading ?? "",
        description: item?.description ?? "",
        backgroundUrl: item?.backgroundUrl ?? "",
        imageUrl: item?.imageUrl ?? "",
        cubeWord: cubeWordFrom(item),
        buttonLabel: item?.buttonLabel ?? "",
        buttonUrl: item?.buttonUrl ?? "",
        secondaryButtonLabel: item?.secondaryButtonLabel ?? "",
        secondaryButtonUrl: item?.secondaryButtonUrl ?? "",
        alignment: item?.alignment ?? "left",
        itemsJson: itemsJsonFrom(item),
        overlay: item?.overlay ?? true,
        enabled: item?.enabled ?? true,
        displayOrder: item?.displayOrder ?? 0,
        partnersNote: "",
        servicesNote: "",
        newsNote: "",
        ratesNote: "",
        branchNote: "",
        mapNote: "",
        contactNote: "",
        customNote: ""
      })}
      toPayload={(values) => {
        let items: unknown = [];
        try {
          items = JSON.parse(String(values.itemsJson || "[]"));
        } catch {
          items = [];
        }
        if (Array.isArray(items)) {
          items = items.filter((row) => {
            if (!row || typeof row !== "object") return false;
            return Object.values(row as Record<string, unknown>).some((value) => String(value ?? "").trim());
          });
        }
        const cubeWord = String(values.cubeWord ?? "").trim();
        if (cubeWord && values.type === "REMITTANCE") {
          items = [{ word: cubeWord }];
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
