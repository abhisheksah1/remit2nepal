import { ResourceCrud, StatusCell } from "@/components/admin/ResourceCrud";
import { adminApi } from "@/api/admin.api";
import { navigationFormSchema, socialFormSchema } from "@/schemas/cms.schema";
import type { NavItem, SocialLink } from "@/types/content";

export default function HeaderFooter() {
  return (
    <div className="space-y-16">
      <ResourceCrud<NavItem>
        title="Navigation"
        description="Header and footer links. Disabled items are hidden on the public site."
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Header & Footer" }]}
        queryKey="admin-nav"
        list={adminApi.navigation.list}
        create={adminApi.navigation.create}
        update={adminApi.navigation.update}
        remove={adminApi.navigation.remove}
        schema={navigationFormSchema}
        columns={[
          { key: "label", header: "Label", render: (row) => row.label },
          { key: "path", header: "Path", render: (row) => row.path },
          { key: "location", header: "Location", render: (row) => row.location },
          { key: "enabled", header: "Enabled", render: (row) => <StatusCell value={row.enabled ? "ACTIVE" : "INACTIVE"} /> }
        ]}
        fields={[
          { name: "label", label: "Label" },
          { name: "path", label: "Path" },
          { name: "location", label: "Location", type: "select", options: [
            { value: "HEADER", label: "Header" },
            { value: "FOOTER", label: "Footer" }
          ]},
          { name: "enabled", label: "Enabled", type: "checkbox" },
          { name: "displayOrder", label: "Display order", type: "number" }
        ]}
        toForm={(item) => ({
          label: item?.label ?? "",
          path: item?.path ?? "/",
          location: item?.location ?? "HEADER",
          enabled: item?.enabled ?? true,
          displayOrder: item?.displayOrder ?? 0
        })}
        toPayload={(values) => values}
      />
      <ResourceCrud<SocialLink>
        title="Social links"
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Social" }]}
        queryKey="admin-social"
        list={adminApi.social.list}
        create={adminApi.social.create}
        update={adminApi.social.update}
        remove={adminApi.social.remove}
        schema={socialFormSchema}
        columns={[
          { key: "platform", header: "Platform", render: (row) => row.platform },
          { key: "label", header: "Label", render: (row) => row.label },
          { key: "url", header: "URL", render: (row) => row.url }
        ]}
        fields={[
          { name: "platform", label: "Platform", type: "select", options: [
            "facebook","instagram","linkedin","youtube","tiktok","x","whatsapp","other"
          ].map((value) => ({ value, label: value })) },
          { name: "label", label: "Label" },
          { name: "url", label: "URL", type: "url" },
          { name: "enabled", label: "Enabled", type: "checkbox" },
          { name: "displayOrder", label: "Display order", type: "number" }
        ]}
        toForm={(item) => ({
          platform: item?.platform ?? "facebook",
          label: item?.label ?? "",
          url: item?.url ?? "",
          enabled: item?.enabled ?? true,
          displayOrder: item?.displayOrder ?? 0
        })}
        toPayload={(values) => values}
      />
    </div>
  );
}
