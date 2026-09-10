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
const hasPrimaryButton = isType("HERO", "REMITTANCE", "PARTNERS", "RATES", "NEWS", "CONTACT_CTA", "NEPAL_MAP", "GALLERY", "SERVICES");
const hasSecondaryButton = (values: FormValues) => isHero(values) || isRemittance(values);
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
  for (const row of items) {
    if (row && typeof row === "object" && "word" in row) {
      const word = String((row as { word?: string }).word ?? "").trim();
      if (word) return word;
    }
  }
  return "";
}

function pointsJsonFrom(item?: CmsSection) {
  if (item?.type !== "REMITTANCE") return "[]";
  const items = Array.isArray(item.items) ? item.items : [];
  const points = items.filter((row) => row && typeof row === "object" && "title" in row && !("word" in row));
  return JSON.stringify(points);
}

function isHeroSceneRow(row: unknown) {
  if (!row || typeof row !== "object") return false;
  const item = row as Record<string, unknown>;
  return Boolean(item.kicker || item.note || item.strong);
}

function itemsJsonFrom(item?: CmsSection) {
  const items = Array.isArray(item?.items) ? item.items : [];
  if (item?.type === "HERO") {
    const chips = items.filter((row) => row && typeof row === "object" && "title" in row && !("value" in row) && !isHeroSceneRow(row));
    return JSON.stringify(chips);
  }
  if (item?.type === "REMITTANCE") return "[]";
  return JSON.stringify(items);
}

function sceneJsonFrom(item?: CmsSection) {
  if (item?.type !== "HERO") return "[]";
  const items = Array.isArray(item.items) ? item.items : [];
  return JSON.stringify(items.filter(isHeroSceneRow));
}

export default function Sections() {
  return (
    <ResourceCrud<CmsSection>
      title="Sections"
      description="Edit homepage copy, buttons, and cards. Open the Hero block to change the first screen. Numbers under it are in Hero stats."
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
          hint: "Small badge above the hero title, for example Global Remittance • Fast • Secure.",
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
          hint: "Main headline. On the hero, use // to split navy and red lines, e.g. Receiving from abroad. // Paying families in Nepal.",
          showWhen: hasHeading
        },
        {
          name: "subheading",
          id: "punch",
          label: "Punch line",
          group: "Copy",
          hint: "Line under the heading. Partners: Nepali line. Remittance: punch line under the cubes.",
          showWhen: hasPunch
        },
        {
          name: "description",
          label: "Intro",
          type: "textarea",
          group: "Copy",
          hint: "Paragraph under the title. Leave empty to hide it.",
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
          name: "pointsJson",
          id: "items-remittance-points",
          label: "How it works",
          type: "list",
          group: "On the page",
          addLabel: "Add point",
          emptyItem: { title: "", description: "" },
          itemFields: [
            { name: "title", label: "Title" },
            { name: "description", label: "Short explanation", type: "textarea" }
          ],
          hint: "Helpful facts under the punch line, for example Bank deposit or Cash pickup.",
          showWhen: isRemittance
        },
        {
          name: "backgroundUrl",
          id: "remittance-photo",
          label: "Background photo",
          type: "image",
          folder: "sections",
          group: "On the page",
          hint: "Optional. Leave empty to keep the paper and map scene.",
          showWhen: isRemittance
        },
        {
          name: "overlay",
          id: "remittance-overlay",
          label: "Fade the background",
          type: "checkbox",
          group: "On the page",
          showWhen: isRemittance
        },

        {
          name: "buttonLabel",
          label: "Button text",
          group: "Buttons",
          hint: "Leave empty to hide this button.",
          showWhen: hasPrimaryButton
        },
        {
          name: "buttonUrl",
          label: "Button link",
          group: "Buttons",
          hint: "Page path, hash, or URL, for example /contact, #how-it-works, or https://.",
          showWhen: hasPrimaryButton
        },
        {
          name: "secondaryButtonLabel",
          label: "Second button text",
          group: "Buttons",
          hint: "Leave empty to hide this button.",
          showWhen: hasSecondaryButton
        },
        {
          name: "secondaryButtonUrl",
          label: "Second button link",
          group: "Buttons",
          hint: "Page path, hash, or URL.",
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
          hint: "Pills under the hero buttons, for example Secure Transfers.",
          showWhen: isHero
        },
        {
          name: "sceneJson",
          id: "items-hero-scene",
          label: "Globe cards",
          type: "list",
          group: "On the page",
          addLabel: "Add card",
          emptyItem: { kicker: "", title: "", note: "" },
          itemFields: [
            { name: "kicker", label: "Small label" },
            { name: "title", label: "Main line" },
            { name: "note", label: "Note" }
          ],
          hint: "Optional floating cards on the globe. Leave empty to keep the default scene. Up to four cards.",
          showWhen: isHero
        },
        {
          name: "backgroundUrl",
          label: "Background photo",
          type: "image",
          folder: "sections",
          group: "On the page",
          hint: "Optional. Replaces the mountain silhouette behind the hero copy.",
          showWhen: isHero
        },
        {
          name: "overlay",
          label: "Fade the background photo",
          type: "checkbox",
          group: "On the page",
          showWhen: isHero
        },
        {
          name: "statsNote",
          label: "Hero stats",
          type: "note",
          group: "On the page",
          hint: "The numbers under the hero come from the Hero stats block in this list, not from this form.",
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
          emptyItem: { name: "", title: "", location: "", headline: "", headlineNe: "", quote: "", quoteNe: "", imageUrl: "" },
          itemFields: [
            { name: "name", label: "Name" },
            { name: "title", label: "Role" },
            { name: "location", label: "Location" },
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
          hint: "Cards come from Admin → Services. This block controls the heading, punch line, and optional button.",
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
        sceneJson: sceneJsonFrom(item),
        pointsJson: pointsJsonFrom(item),
        overlay: item?.overlay ?? true,
        enabled: item?.enabled ?? true,
        displayOrder: item?.displayOrder ?? 0,
        statsNote: "",
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
        if (values.type === "REMITTANCE") {
          let points: unknown = [];
          try {
            points = JSON.parse(String(values.pointsJson || "[]"));
          } catch {
            points = [];
          }
          const pointRows = Array.isArray(points)
            ? points.filter((row) => {
                if (!row || typeof row !== "object") return false;
                return Object.values(row as Record<string, unknown>).some((value) => String(value ?? "").trim());
              })
            : [];
          items = cubeWord ? [{ word: cubeWord }, ...pointRows] : pointRows;
        }
        if (values.type === "HERO") {
          let scenes: unknown = [];
          try {
            scenes = JSON.parse(String(values.sceneJson || "[]"));
          } catch {
            scenes = [];
          }
          const chips = Array.isArray(items) ? items : [];
          const sceneRows = Array.isArray(scenes)
            ? scenes.filter((row) => {
                if (!row || typeof row !== "object") return false;
                return Object.values(row as Record<string, unknown>).some((value) => String(value ?? "").trim());
              })
            : [];
          items = [...chips, ...sceneRows];
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
