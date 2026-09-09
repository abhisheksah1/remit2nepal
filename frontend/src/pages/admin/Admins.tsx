import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/api/admin.api";
import { getErrorMessage } from "@/api/client";
import { adminCreateSchema, adminUpdateSchema, type AdminCreateValues } from "@/schemas/admin.schema";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { FormDrawer } from "@/components/admin/FormDrawer";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge, statusTone } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { entityId } from "@/utils/cn";
import type { AdminAccount } from "@/types/auth";

export default function Admins() {
  const { push } = useToast();
  const client = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminAccount | null>(null);
  const [pending, setPending] = useState<AdminAccount | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const query = useQuery({
    queryKey: ["admin-admins", page, search],
    queryFn: () => adminApi.admins.list({ page, search })
  });
  const permissions = useQuery({ queryKey: ["admin-permissions"], queryFn: adminApi.admins.permissions });
  const editingRef = useRef(editing);
  editingRef.current = editing;
  const form = useForm<AdminCreateValues>({
    resolver: (values, context, options) =>
      zodResolver(editingRef.current ? adminUpdateSchema : adminCreateSchema)(values, context, options)
  });
  const role = form.watch("role");

  const save = useMutation({
    mutationFn: (values: AdminCreateValues) => {
      const body = { ...values, permissions: selected };
      if (editing) {
        const id = entityId(editing);
        const { password, ...rest } = body;
        return adminApi.admins.update(id, password ? body : rest);
      }
      return adminApi.admins.create(body);
    },
    onSuccess: async () => {
      push({ title: editing ? "Administrator updated" : "Administrator created", tone: "success" });
      setOpen(false);
      await client.invalidateQueries({ queryKey: ["admin-admins"] });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  const deactivate = useMutation({
    mutationFn: (id: string) => adminApi.admins.remove(id),
    onSuccess: async () => {
      setPending(null);
      push({ title: "Administrator deactivated", tone: "success" });
      await client.invalidateQueries({ queryKey: ["admin-admins"] });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  const options = useMemo(() => permissions.data ?? [], [permissions.data]);

  return (
    <div>
      <PageHeader
        title="Administrators"
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Administrators" }]}
        actionLabel="New administrator"
        onAction={() => {
          setEditing(null);
          setSelected([]);
          form.reset({ fullName: "", userId: "", password: "", role: "ADMIN", status: "ACTIVE" });
          setOpen(true);
        }}
      />
      <DataTable
        columns={[
          { key: "name", header: "Name", render: (row) => row.fullName },
          { key: "user", header: "User ID", render: (row) => row.userId },
          { key: "role", header: "Role", render: (row) => row.role },
          { key: "status", header: "Status", render: (row) => <Badge tone={statusTone(row.status)}>{row.status}</Badge> },
          {
            key: "act",
            header: "",
            render: (row) => (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditing(row);
                    setSelected(row.permissions as string[]);
                    form.reset({
                      fullName: row.fullName,
                      userId: row.userId,
                      password: "",
                      email: row.email ?? "",
                      phone: row.phone ?? "",
                      role: row.role,
                      status: row.status === "LOCKED" ? "INACTIVE" : row.status
                    });
                    setOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setPending(row)}>
                  Deactivate
                </Button>
              </div>
            )
          }
        ]}
        rows={query.data?.items ?? []}
        loading={query.isLoading}
        search={search}
        onSearch={setSearch}
        page={page}
        total={query.data?.total}
        onPageChange={setPage}
        rowKey={(row) => entityId(row) || row.userId}
      />
      <FormDrawer open={open} title={editing ? "Edit administrator" : "New administrator"} onClose={() => setOpen(false)}>
        <form className="space-y-4" onSubmit={form.handleSubmit((values) => save.mutate(values))}>
          <Input label="Full name" {...form.register("fullName")} error={form.formState.errors.fullName?.message} />
          <Input label="User ID" {...form.register("userId")} error={form.formState.errors.userId?.message} />
          <Input label="Password" type="password" {...form.register("password")} error={form.formState.errors.password?.message} hint={editing ? "Leave blank to keep current password" : undefined} />
          <Input label="Email" {...form.register("email")} />
          <Input label="Phone" {...form.register("phone")} />
          <Select
            label="Role"
            {...form.register("role")}
            options={[
              { value: "ADMIN", label: "Admin" },
              { value: "SUPER_ADMIN", label: "Super admin" }
            ]}
          />
          {role !== "SUPER_ADMIN" ? (
            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-navy">Permissions</legend>
              {options.map((item) => (
                <label key={item.key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selected.includes(item.key)}
                    onChange={(event) => {
                      setSelected((current) =>
                        event.target.checked ? [...current, item.key] : current.filter((value) => value !== item.key)
                      );
                    }}
                  />
                  {item.label}
                </label>
              ))}
            </fieldset>
          ) : null}
          <Button type="submit" disabled={save.isPending}>Save</Button>
        </form>
      </FormDrawer>
      <ConfirmDialog
        open={Boolean(pending)}
        title="Deactivate this administrator?"
        description="They will no longer be able to sign in."
        danger
        confirmLabel="Deactivate"
        busy={deactivate.isPending}
        onClose={() => setPending(null)}
        onConfirm={() => pending && deactivate.mutate(entityId(pending) || pending.userId)}
      />
    </div>
  );
}
