import { ResourceCrud, StatusCell } from "@/components/admin/ResourceCrud";
import { adminApi } from "@/api/admin.api";
import { bannerFormSchema } from "@/schemas/cms.schema";
import type { BannerItem } from "@/types/content";

const KIND_LABEL = {
  FESTIVAL: "Festival",
  OFFER: "Offer",
  ANNOUNCEMENT: "Announcement",
  COOKIE: "Cookie notice"
} as const;

const POSITION_LABEL = {
  TOP: "Top",
  BOTTOM: "Bottom",
  LEFT: "Left",
  RIGHT: "Right",
  CENTER: "Center",
  POPUP: "Popup"
} as const;

export default function Banners() {
  return (
    <ResourceCrud<BannerItem>
      title="Banners"
      description="Upload the finished banner image as it is. Ratio is read from the photo. The site shows the full artwork — nothing is cropped."
      crumbs={[{ label: "Admin", to: "/admin" }, { label: "Banners" }]}
      queryKey="admin-banners"
      list={adminApi.banners.list}
      create={adminApi.banners.create}
      update={adminApi.banners.update}
      remove={adminApi.banners.remove}
      schema={bannerFormSchema}
      columns={[
        { key: "title", header: "Title", render: (row) => row.title },
        { key: "kind", header: "Type", render: (row) => KIND_LABEL[row.kind] || row.kind },
        { key: "position", header: "Place", render: (row) => POSITION_LABEL[row.position] || row.position },
        { key: "imageRatio", header: "Ratio", render: (row) => (row.imageRatio === "1:1" ? "Square" : row.imageRatio || "16:9") },
        { key: "status", header: "Status", render: (row) => <StatusCell value={row.status} /> }
      ]}
      fields={[
        {
          name: "guide",
          label: "How banners show",
          type: "note",
          hint: "Upload the finished artwork as it is. The panel reads the photo size and sets 9:16, Square, or 16:9. Nothing is cropped."
        },
        { name: "title", label: "Admin name", group: "Copy", hint: "Only for this list. Not shown on the website." },
        { name: "subtitle", label: "Subtitle", group: "Copy", showWhen: (values) => values.kind === "COOKIE" },
        { name: "body", label: "Message", type: "textarea", group: "Copy", showWhen: (values) => values.kind === "COOKIE" },
        {
          name: "kind",
          label: "Type",
          type: "select",
          group: "Placement",
          options: [
            { value: "FESTIVAL", label: "Festival" },
            { value: "OFFER", label: "Offer" },
            { value: "ANNOUNCEMENT", label: "Announcement" },
            { value: "COOKIE", label: "Cookie notice" }
          ]
        },
        {
          name: "position",
          label: "Position on the site",
          type: "select",
          group: "Placement",
          hint: "Cookie notices always use the bottom bar.",
          showWhen: (values) => values.kind !== "COOKIE",
          options: [
            { value: "POPUP", label: "Popup (center of screen)" },
            { value: "TOP", label: "Top strip" },
            { value: "BOTTOM", label: "Bottom strip" },
            { value: "LEFT", label: "Left side" },
            { value: "RIGHT", label: "Right side" },
            { value: "CENTER", label: "Center float" }
          ]
        },
        {
          name: "pageScope",
          label: "Show on",
          type: "select",
          group: "Placement",
          options: [
            { value: "ALL", label: "Every public page" },
            { value: "HOME", label: "Homepage only" },
            { value: "CUSTOM", label: "One path" }
          ]
        },
        {
          name: "pagePath",
          label: "Page path",
          group: "Placement",
          hint: "Example: /about or /news",
          showWhen: (values) => values.pageScope === "CUSTOM"
        },
        {
          name: "imageUrl",
          label: "Banner photo",
          type: "image",
          folder: "banners",
          group: "Photo",
          hint: "Upload the finished artwork. Ratio is detected from the photo. The website shows the full image.",
          previewFit: "contain",
          ratioField: "imageRatio",
          showWhen: (values) => values.kind !== "COOKIE"
        },
        {
          name: "imageRatio",
          label: "Image ratio",
          type: "select",
          group: "Photo",
          hint: "Filled automatically from the uploaded photo. Change only if you want a different frame.",
          showWhen: (values) => values.kind !== "COOKIE",
          options: [
            { value: "9:16", label: "9:16 — Portrait" },
            { value: "1:1", label: "Square" },
            { value: "16:9", label: "16:9 — Landscape" }
          ]
        },
        { name: "altText", label: "Photo alt text", group: "Photo", showWhen: (values) => values.kind !== "COOKIE" },
        { name: "buttonLabel", label: "Button label", group: "Actions", showWhen: (values) => values.kind === "COOKIE" },
        { name: "secondaryButtonLabel", label: "Second button", group: "Actions", showWhen: (values) => values.kind === "COOKIE" },
        { name: "linkUrl", label: "Optional image link", group: "Actions", hint: "If set, tapping the image opens this path. Leave empty for image only." },
        {
          name: "frequency",
          label: "How often",
          type: "select",
          group: "Schedule",
          options: [
            { value: "ONCE", label: "Once per visitor" },
            { value: "SESSION", label: "Once per visit" },
            { value: "EVERY_VISIT", label: "Every page load" }
          ]
        },
        { name: "dismissible", label: "Visitor can close it", type: "checkbox", group: "Schedule" },
        { name: "startsAt", label: "Start date", type: "date", group: "Schedule" },
        { name: "endsAt", label: "End date", type: "date", group: "Schedule" },
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
        { name: "displayOrder", label: "Display order", type: "number", group: "Schedule" }
      ]}
      toForm={(item) => ({
        title: item?.title ?? "",
        subtitle: item?.subtitle ?? "",
        body: item?.body ?? "",
        imageUrl: item?.imageUrl ?? "",
        imageRatio: item?.imageRatio ?? "16:9",
        altText: item?.altText ?? "",
        kind: item?.kind ?? "OFFER",
        position: item?.position ?? "POPUP",
        pageScope: item?.pageScope ?? "ALL",
        pagePath: item?.pagePath ?? "",
        linkUrl: item?.linkUrl ?? "",
        buttonLabel: item?.buttonLabel ?? "",
        secondaryButtonLabel: item?.secondaryButtonLabel ?? "",
        frequency: item?.frequency ?? "ONCE",
        dismissible: item?.dismissible ?? true,
        startsAt: item?.startsAt ? String(item.startsAt).slice(0, 10) : "",
        endsAt: item?.endsAt ? String(item.endsAt).slice(0, 10) : "",
        status: item?.status ?? "ACTIVE",
        displayOrder: item?.displayOrder ?? 0
      })}
      toPayload={(values) => ({
        ...values,
        position: values.kind === "COOKIE" ? "BOTTOM" : values.position,
        imageUrl: String(values.imageUrl || "").trim(),
        linkUrl: String(values.linkUrl || "").trim(),
        startsAt: values.startsAt || undefined,
        endsAt: values.endsAt || undefined,
        displayOrder: Number(values.displayOrder) || 0,
        dismissible: Boolean(values.dismissible)
      })}
    />
  );
}
