import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { adminApi } from "@/api/admin.api";
import { PageHeader } from "@/components/admin/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge, statusTone } from "@/components/ui/Badge";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDateTime, formatNpr } from "@/utils/format";
import { entityId } from "@/utils/cn";

export default function Dashboard() {
  const query = useQuery({ queryKey: ["admin", "dashboard"], queryFn: adminApi.dashboard });
  if (query.isLoading) return <SkeletonLines rows={8} />;
  if (!query.data) return <EmptyState title="Dashboard unavailable" />;
  const { cards, latestRates, sync, recentActivity } = query.data;

  const stats = [
    { label: "Branches", value: cards.totalBranches, to: "/admin/branches" },
    { label: "Services", value: cards.activeServices, to: "/admin/services" },
    { label: "Published news", value: cards.publishedNews, to: "/admin/news" },
    { label: "Currencies", value: cards.currencies, to: "/admin/rates" },
    { label: "Administrators", value: cards.admins, to: "/admin/admins" },
    { label: "Unread messages", value: cards.unreadMessages, to: "/admin/contact" }
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Snapshot of the desk: branches, rates, messages, and recent activity."
        crumbs={[{ label: "Admin", to: "/admin" }, { label: "Dashboard" }]}
      />
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Badge tone={statusTone(cards.websiteStatus)}>{cards.websiteStatus}</Badge>
        <p className="text-sm text-ink-muted">Last rate update {formatDateTime(cards.lastRateUpdate)}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((item) => (
          <Link key={item.label} to={item.to} className="admin-stat">
            <span>{item.label}</span>
            <strong>{item.value}</strong>
          </Link>
        ))}
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-xl text-navy">Latest rates</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {latestRates.map((rate) => (
              <li key={entityId(rate)} className="flex justify-between border-b border-navy/5 py-2">
                <span>{rate.currencyCode}</span>
                <span>
                  {formatNpr(rate.nrbBuyRate)} / {formatNpr(rate.nrbSellRate)}
                </span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="font-display text-xl text-navy">NRB sync</h2>
          {sync ? (
            <div className="mt-4 text-sm">
              <Badge tone={statusTone(sync.status)}>{sync.status}</Badge>
              <p className="mt-2">{sync.message || "Last synchronization recorded."}</p>
              <p className="mt-1 text-ink-muted">{formatDateTime(sync.createdAt)}</p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-ink-muted">No sync has run yet.</p>
          )}
          <h3 className="mt-6 text-sm font-medium text-navy">Recent activity</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {recentActivity.map((item) => (
              <li key={entityId(item)} className="flex justify-between gap-3">
                <span>
                  {item.userName} · {item.action}
                </span>
                <span className="text-ink-muted">{formatDateTime(item.createdAt)}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
