import { ResourceCrud, StatusCell } from "@/components/admin/ResourceCrud";
import { BranchExcelImport } from "@/components/admin/BranchExcelImport";
import { adminApi } from "@/api/admin.api";
import { branchFormSchema } from "@/schemas/cms.schema";
import { NEPAL_PROVINCES } from "@/config/nav";
import type { BranchItem } from "@/types/content";
import { joinCsv, splitCsv } from "@/utils/cn";

export default function Branches() {
  return (
    <ResourceCrud<BranchItem>
      title="Agents & branches"
      description="Upload Excel with Agent Name, District and Address, or add one agent at a time."
      crumbs={[{ label: "Admin", to: "/admin" }, { label: "Branches" }]}
      queryKey="admin-branches"
      list={adminApi.branches.list}
      create={adminApi.branches.create}
      update={adminApi.branches.update}
      remove={adminApi.branches.remove}
      schema={branchFormSchema}
      extraActions={<BranchExcelImport />}
      columns={[
        { key: "name", header: "Agent name", render: (row) => row.name },
        { key: "district", header: "District", render: (row) => row.district },
        { key: "address", header: "Address", render: (row) => row.address },
        { key: "status", header: "Status", render: (row) => <StatusCell value={row.status} /> }
      ]}
      fields={[
        { name: "name", label: "Agent name" },
        { name: "branchCode", label: "Branch code" },
        { name: "province", label: "Province", type: "select", options: NEPAL_PROVINCES.map((value) => ({ value, label: value })) },
        { name: "district", label: "District" },
        { name: "municipality", label: "Municipality" },
        { name: "city", label: "City" },
        { name: "address", label: "Address" },
        { name: "phone", label: "Phone" },
        { name: "email", label: "Email" },
        { name: "googleMapUrl", label: "Google Map URL" },
        { name: "openingTime", label: "Opening time" },
        { name: "closingTime", label: "Closing time" },
        { name: "weeklyHoliday", label: "Weekly holiday" },
        { name: "managerName", label: "Manager" },
        { name: "servicesAvailable", label: "Services (comma separated)" },
        { name: "status", label: "Status", type: "select", options: [
          { value: "ACTIVE", label: "Active" },
          { value: "INACTIVE", label: "Inactive" }
        ]},
        { name: "displayOrder", label: "Display order", type: "number" }
      ]}
      toForm={(item) => ({
        name: item?.name ?? "",
        branchCode: item?.branchCode ?? "",
        province: item?.province ?? "Bagmati",
        district: item?.district ?? "",
        municipality: item?.municipality ?? "",
        city: item?.city ?? "",
        address: item?.address ?? "",
        phone: item?.phone ?? "",
        email: item?.email ?? "",
        googleMapUrl: item?.googleMapUrl ?? "",
        openingTime: item?.openingTime ?? "10:00",
        closingTime: item?.closingTime ?? "17:00",
        weeklyHoliday: item?.weeklyHoliday ?? "Saturday",
        managerName: item?.managerName ?? "",
        servicesAvailable: joinCsv(item?.servicesAvailable),
        status: item?.status ?? "ACTIVE",
        displayOrder: item?.displayOrder ?? 0
      })}
      toPayload={(values) => ({
        ...values,
        servicesAvailable: splitCsv(String(values.servicesAvailable ?? ""))
      })}
    />
  );
}
