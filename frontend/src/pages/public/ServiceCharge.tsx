import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/public.api";
import { PageHero } from "@/components/public/PageHero";
import { SeoHead } from "@/components/public/SeoHead";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonLines } from "@/components/ui/Skeleton";
import { entityId } from "@/utils/cn";
import type { ServiceChargeRow } from "@/types/content";

function payoutText(row: ServiceChargeRow) {
  if (row.mergePayout) return row.mergedCharge || row.cashPickup || "—";
  return "";
}

export default function ServiceCharge() {
  const query = useQuery({
    queryKey: ["public", "service-charges"],
    queryFn: publicApi.serviceCharges
  });

  if (query.isLoading) {
    return (
      <div className="mx-auto max-w-site px-4 py-16 lg:px-8">
        <SkeletonLines />
      </div>
    );
  }

  const page = query.data?.page;
  const rows = query.data?.rows ?? [];

  return (
    <>
      <SeoHead
        title={page?.pageTitle || "Service Charge"}
        description={page?.pageDescription || "Sending-agent charges for cash pickup and bank transfer."}
      />
      <PageHero
        kicker={page?.pageKicker || "Fees"}
        title={page?.pageTitle || "Service Charge"}
        description={page?.pageDescription || "Sending-agent charges for cash pickup and bank transfer."}
      />
      <section id="service-charge" className="mx-auto max-w-site px-4 py-10 lg:px-8 sm:py-16">
        {rows.length === 0 ? (
          <EmptyState title="Service charges will be published here" />
        ) : (
          <div className="charge-board glass-panel overflow-hidden rounded-3xl">
            <div className="rate-scroll">
              <table className="charge-table">
                <thead>
                  <tr>
                    <th scope="col">S.N</th>
                    <th scope="col">Sending Agent</th>
                    <th scope="col">Cash Pickup</th>
                    <th scope="col">Bank Transfer</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => {
                    const merged = Boolean(row.mergePayout);
                    return (
                      <tr key={entityId(row) || `${row.sendingAgent}-${index}`}>
                        <td className="charge-sn">{row.serial || String(index + 1)}</td>
                        <td className="charge-agent">{row.sendingAgent}</td>
                        {merged ? (
                          <td colSpan={2} className="charge-merged">
                            {payoutText(row)}
                          </td>
                        ) : (
                          <>
                            <td>{row.cashPickup || "—"}</td>
                            <td>{row.bankTransfer || "—"}</td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {page?.footnote ? <p className="mt-6 text-sm leading-relaxed text-ink-muted">{page.footnote}</p> : null}
      </section>
    </>
  );
}
