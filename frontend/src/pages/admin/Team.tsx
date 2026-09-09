import { ResourceCrud, StatusCell } from "@/components/admin/ResourceCrud";
import { adminApi } from "@/api/admin.api";
import { teamFormSchema } from "@/schemas/cms.schema";
import type { TeamMember } from "@/types/content";

export default function Team() {
  return (
    <ResourceCrud<TeamMember>
      title="Management"
      crumbs={[{ label: "Admin", to: "/admin" }, { label: "Management" }]}
      queryKey="admin-team"
      list={adminApi.team.list}
      create={adminApi.team.create}
      update={adminApi.team.update}
      remove={adminApi.team.remove}
      schema={teamFormSchema}
      columns={[
        { key: "name", header: "Name", render: (row) => row.name },
        { key: "title", header: "Title", render: (row) => row.title },
        { key: "status", header: "Status", render: (row) => <StatusCell value={row.status} /> }
      ]}
      fields={[
        { name: "name", label: "Name" },
        { name: "title", label: "Title" },
        { name: "photoUrl", label: "Photo URL" },
        { name: "bio", label: "Bio", type: "textarea" },
        { name: "status", label: "Status", type: "select", options: [
          { value: "ACTIVE", label: "Active" },
          { value: "INACTIVE", label: "Inactive" }
        ]},
        { name: "displayOrder", label: "Display order", type: "number" }
      ]}
      toForm={(item) => ({
        name: item?.name ?? "",
        title: item?.title ?? "",
        photoUrl: item?.photoUrl ?? "",
        bio: item?.bio ?? "",
        status: item?.status ?? "ACTIVE",
        displayOrder: item?.displayOrder ?? 0
      })}
      toPayload={(values) => values}
    />
  );
}
