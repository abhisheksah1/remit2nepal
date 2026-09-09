import { ResourceCrud, StatusCell } from "@/components/admin/ResourceCrud";
import { adminApi } from "@/api/admin.api";
import { teamFormSchema } from "@/schemas/cms.schema";
import type { TeamMember } from "@/types/content";
import { mediaUrl } from "@/utils/cn";
import { resolveTeamGroup, resolveTeamTier } from "@/utils/team";

export default function Team() {
  return (
    <ResourceCrud<TeamMember>
      title="Board & Team"
      description="On Our Team, people marked Manager / top employee appear under Top Leaders. CEO is not shown on this page. Other employees sit below. Upload a square portrait for even cards."
      crumbs={[{ label: "Admin", to: "/admin" }, { label: "Board & Team" }]}
      queryKey="admin-team"
      list={adminApi.team.list}
      create={adminApi.team.create}
      update={adminApi.team.update}
      remove={adminApi.team.remove}
      schema={teamFormSchema}
      columns={[
        {
          key: "photo",
          header: "Photo",
          render: (row) =>
            row.photoUrl ? (
              <img src={mediaUrl(row.photoUrl)} alt="" className="h-12 w-12 rounded-lg object-cover" />
            ) : (
              <span className="text-xs text-ink-muted">No photo</span>
            )
        },
        { key: "name", header: "Name", render: (row) => row.name },
        { key: "title", header: "Designation", render: (row) => row.title },
        {
          key: "group",
          header: "Page",
          render: (row) => (resolveTeamGroup(row) === "BOARD" ? "Board of Directors" : "Our Team")
        },
        {
          key: "tier",
          header: "Team level",
          render: (row) =>
            resolveTeamGroup(row) === "BOARD" ? "—" : resolveTeamTier(row) === "LEAD" ? "Manager / top" : "Employee"
        },
        { key: "status", header: "Status", render: (row) => <StatusCell value={row.status} /> }
      ]}
      fields={[
        { name: "name", label: "Name" },
        { name: "title", label: "Designation" },
        {
          name: "group",
          label: "Show on page",
          type: "select",
          options: [
            { value: "BOARD", label: "Board of Directors" },
            { value: "TEAM", label: "Our Team" }
          ]
        },
        {
          name: "tier",
          label: "Team level",
          type: "select",
          hint: "Top employees appear under Top Leaders on Our Team. CEO is not shown there. Other employees appear below.",
          options: [
            { value: "LEAD", label: "Manager / top employee" },
            { value: "STAFF", label: "Other employee" }
          ]
        },
        {
          name: "photoUrl",
          label: "Card photo",
          type: "image",
          folder: "team",
          hint: "Upload a portrait. It fills the top of the public card."
        },
        { name: "bio", label: "About", type: "textarea" },
        {
          name: "status",
          label: "Status",
          type: "select",
          options: [
            { value: "ACTIVE", label: "Active" },
            { value: "INACTIVE", label: "Inactive" }
          ]
        },
        { name: "displayOrder", label: "Display order", type: "number" }
      ]}
      toForm={(item) => ({
        name: item?.name ?? "",
        title: item?.title ?? "",
        group: item?.group ?? (item ? resolveTeamGroup(item) : "BOARD"),
        tier: item?.tier ?? (item ? resolveTeamTier(item) : "STAFF"),
        photoUrl: item?.photoUrl ?? "",
        bio: item?.bio ?? "",
        status: item?.status ?? "ACTIVE",
        displayOrder: item?.displayOrder ?? 0
      })}
      toPayload={(values) => values}
    />
  );
}
