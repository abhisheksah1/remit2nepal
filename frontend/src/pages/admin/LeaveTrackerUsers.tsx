import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { adminApi } from "@/api/admin.api";
import { getErrorMessage } from "@/api/client";
import { PageHeader } from "@/components/admin/PageHeader";
import { DataTable } from "@/components/admin/DataTable";
import { FormDrawer } from "@/components/admin/FormDrawer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge, statusTone } from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { entityId } from "@/utils/cn";
import type { LeaveTrackerAccount } from "@/types/leave";

const schema = z.object({
  fullName: z.string().min(2, "Name is required"),
  userId: z.string().min(3, "User ID is required"),
  password: z.string().optional(),
  email: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional()
});

type Values = z.infer<typeof schema>;

export default function LeaveTrackerUsers() {
  const { push } = useToast();
  const client = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<LeaveTrackerAccount | null>(null);
  const query = useQuery({
    queryKey: ["admin-leave-users", page, search],
    queryFn: () => adminApi.leaveTrackerUsers.list({ page, search })
  });
  const form = useForm<Values>({ resolver: zodResolver(schema) });

  function startCreate() {
    setEditing(null);
    form.reset({ fullName: "", userId: "", password: "", email: "", status: "ACTIVE" });
    setOpen(true);
  }

  function startEdit(row: LeaveTrackerAccount) {
    setEditing(row);
    form.reset({ fullName: row.fullName, userId: row.userId, password: "", email: row.email ?? "", status: row.status === "LOCKED" ? "INACTIVE" : row.status });
    setOpen(true);
  }

  const save = useMutation({
    mutationFn: (values: Values) => {
      if (!editing && (!values.password || values.password.length < 8)) {
        throw new Error("Password must be at least 8 characters");
      }
      const body = { ...values, password: values.password || undefined };
      return editing ? adminApi.leaveTrackerUsers.update(entityId(editing), body) : adminApi.leaveTrackerUsers.create(body);
    },
    onSuccess: async () => {
      push({ title: editing ? "Access updated" : "Leave tracker access created", tone: "success" });
      setOpen(false);
      await client.invalidateQueries({ queryKey: ["admin-leave-users"] });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  const deactivate = useMutation({
    mutationFn: (id: string) => adminApi.leaveTrackerUsers.remove(id),
    onSuccess: async () => {
      push({ title: "Access deactivated", tone: "success" });
      await client.invalidateQueries({ queryKey: ["admin-leave-users"] });
    },
    onError: (error) => push({ title: getErrorMessage(error), tone: "error" })
  });

  return (
    <div>
      <PageHeader
        title="Leave tracker access"
        description="Create separate user IDs for the leave tracker at /leave/tracker. These accounts cannot open the website admin desk."
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Leave tracker access" }]}
        actionLabel="New leave user"
        onAction={startCreate}
      />
      <DataTable
        columns={[
          { key: "name", header: "Name", render: (row) => row.fullName },
          { key: "id", header: "User ID", render: (row) => row.userId },
          { key: "email", header: "Email", render: (row) => row.email || "—" },
          { key: "status", header: "Status", render: (row) => <Badge tone={statusTone(row.status)}>{row.status}</Badge> },
          {
            key: "act",
            header: "",
            render: (row) => (
              <div className="flex gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => startEdit(row)}>
                  Edit
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => deactivate.mutate(entityId(row))}>
                  Deactivate
                </Button>
              </div>
            )
          }
        ]}
        rows={query.data?.items ?? []}
        loading={query.isLoading}
        search={search}
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        page={page}
        total={query.data?.total ?? 0}
        onPageChange={setPage}
        rowKey={(row) => entityId(row)}
        emptyTitle="No leave tracker users"
        emptyDescription="Create a user ID here, then sign in at /leave/tracker."
      />
      <FormDrawer open={open} title={editing ? "Edit leave access" : "Create leave tracker access"} onClose={() => setOpen(false)}>
        <form className="space-y-4" onSubmit={form.handleSubmit((values) => save.mutate(values))}>
          <Input label="Full name" {...form.register("fullName")} error={form.formState.errors.fullName?.message} />
          <Input label="User ID" {...form.register("userId")} error={form.formState.errors.userId?.message} disabled={Boolean(editing)} />
          <Input
            label={editing ? "New password (optional)" : "Password"}
            type="password"
            hint="At least 8 characters"
            {...form.register("password")}
            error={form.formState.errors.password?.message}
          />
          <Input label="Email" {...form.register("email")} />
          <Select
            label="Status"
            options={[
              { value: "ACTIVE", label: "Active" },
              { value: "INACTIVE", label: "Inactive" }
            ]}
            {...form.register("status")}
          />
          <Button type="submit" className="w-full" disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save access"}
          </Button>
        </form>
      </FormDrawer>
    </div>
  );
}
