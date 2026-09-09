import type { ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { Table, THead, Th, Td } from "@/components/ui/Table";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
}

export function DataTable<T>({
  columns,
  rows,
  loading,
  emptyTitle = "No records yet",
  emptyDescription,
  search,
  onSearch,
  page = 1,
  limit = 20,
  total = 0,
  onPageChange,
  rowKey
}: {
  columns: Column<T>[];
  rows: T[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  search?: string;
  onSearch?: (value: string) => void;
  page?: number;
  limit?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  rowKey: (row: T) => string;
}) {
  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-4">
      {onSearch ? (
        <div className="admin-table-tools">
          <Input
            label="Search"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Filter records"
          />
        </div>
      ) : null}
      {loading ? <SkeletonLines rows={6} /> : null}
      {!loading && rows.length === 0 ? <EmptyState title={emptyTitle} description={emptyDescription} /> : null}
      {!loading && rows.length > 0 ? (
        <Table>
          <THead>
            <tr>
              {columns.map((column) => (
                <Th key={column.key} className={column.className}>
                  {column.header}
                </Th>
              ))}
            </tr>
          </THead>
          <tbody>
            {rows.map((row) => (
              <tr key={rowKey(row)} className="hover:bg-navy-50/60">
                {columns.map((column) => (
                  <Td key={column.key} className={column.className}>
                    {column.render(row)}
                  </Td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      ) : null}
      {total > limit ? (
        <div className="admin-pager">
          <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => onPageChange?.(page - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-ink-muted">
            Page {page} of {pages}
          </span>
          <Button variant="secondary" size="sm" disabled={page >= pages} onClick={() => onPageChange?.(page + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      ) : null}
    </div>
  );
}
