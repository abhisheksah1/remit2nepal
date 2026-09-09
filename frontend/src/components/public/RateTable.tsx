import { formatDateTime, formatNpr } from "@/utils/format";
import type { PublicRatesPayload } from "@/types/rates";
import { Badge } from "@/components/ui/Badge";
import { Table, THead, Th, Td } from "@/components/ui/Table";

export function RateTable({
  payload,
  compact
}: {
  payload: PublicRatesPayload;
  compact?: boolean;
}) {
  const rows = compact ? payload.rates.slice(0, 8) : payload.rates;
  const showNrb = payload.displayMode !== "COMPANY";
  const showCompany = payload.displayMode !== "NRB";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-muted">
          Last updated {formatDateTime(payload.lastUpdated)} · Source: {payload.source}
        </p>
        {payload.isStale ? (
          <Badge tone="red">Rates may be stale. Confirm at a branch before sending.</Badge>
        ) : (
          <Badge tone="green">Recently synchronized</Badge>
        )}
      </div>
      <Table>
        <THead>
          <tr>
            <Th>Currency</Th>
            <Th>Unit</Th>
            {showNrb ? (
              <>
                <Th>NRB Buy</Th>
                <Th>NRB Sell</Th>
              </>
            ) : null}
            {showCompany ? (
              <>
                <Th>Company Buy</Th>
                <Th>Company Sell</Th>
              </>
            ) : null}
          </tr>
        </THead>
        <tbody>
          {rows.map((rate) => (
            <tr key={rate.currencyCode} className="hover:bg-cream-50">
              <Td>
                <span className="font-medium text-navy">{rate.currencyCode}</span>
                <span className="ml-2 text-ink-muted">{rate.currency}</span>
              </Td>
              <Td>{rate.unit}</Td>
              {showNrb ? (
                <>
                  <Td>{formatNpr(rate.nrbBuyRate)}</Td>
                  <Td>{formatNpr(rate.nrbSellRate)}</Td>
                </>
              ) : null}
              {showCompany ? (
                <>
                  <Td>{formatNpr(rate.companyBuyRate)}</Td>
                  <Td>{formatNpr(rate.companySellRate)}</Td>
                </>
              ) : null}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
