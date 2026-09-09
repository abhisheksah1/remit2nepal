import { useMemo, useState } from "react";
import { formatDateTime, formatNpr } from "@/utils/format";
import type { PublicRatesPayload } from "@/types/rates";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Table, THead, Th, Td } from "@/components/ui/Table";

export function RateTable({
  payload,
  compact
}: {
  payload: PublicRatesPayload;
  compact?: boolean;
}) {
  const [search, setSearch] = useState("");
  const rows = useMemo(() => {
    const source = compact ? payload.rates.slice(0, 12) : payload.rates;
    const q = search.trim().toLowerCase();
    if (!q) return source;
    return source.filter(
      (rate) => rate.currencyCode.toLowerCase().includes(q) || rate.currency.toLowerCase().includes(q)
    );
  }, [compact, payload.rates, search]);
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-muted">
          Last updated {formatDateTime(payload.lastUpdated)} · Source: {payload.source} · {payload.rates.length} currencies
        </p>
        {payload.isStale ? (
          <Badge tone="red">Rates may be stale. Confirm at a branch before sending.</Badge>
        ) : (
          <Badge tone="green">Recently synchronized</Badge>
        )}
      </div>
      {!compact ? (
        <div className="max-w-xs">
          <Input
            label="Search currency"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="USD, Yen, Saudi…"
          />
        </div>
      ) : null}
      <Table>
        <THead>
          <tr>
            <Th>Currency</Th>
            <Th>Unit</Th>
            <Th>NRB Buy</Th>
            <Th>NRB Sell</Th>
          </tr>
        </THead>
        <tbody>
          {rows.map((rate) => (
            <tr key={rate.currencyCode} className="hover:bg-cream-50">
              <Td>
                <span className="font-medium text-navy">{rate.currencyCode}</span>
                <span className="mt-0.5 block text-xs text-ink-muted sm:ml-2 sm:mt-0 sm:inline">{rate.currency}</span>
              </Td>
              <Td>{rate.unit}</Td>
              <Td>{formatNpr(rate.nrbBuyRate)}</Td>
              <Td>{formatNpr(rate.nrbSellRate)}</Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
