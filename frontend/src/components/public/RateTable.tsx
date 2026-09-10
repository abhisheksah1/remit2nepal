import { useMemo, useState } from "react";
import { formatDateTime, formatNpr } from "@/utils/format";
import type { PublicRate, PublicRatesPayload } from "@/types/rates";
import { Badge } from "@/components/ui/Badge";
import { CurrencyFlag } from "./CurrencyFlag";

function buyRate(rate: PublicRate) {
  return rate.companyBuyRate ?? rate.nrbBuyRate;
}

function sellRate(rate: PublicRate) {
  return rate.companySellRate ?? rate.nrbSellRate ?? rate.officialRate;
}

export function RateTable({
  payload,
  compact
}: {
  payload: PublicRatesPayload;
  compact?: boolean;
}) {
  const [search, setSearch] = useState("");
  const showCompany = payload.displayMode !== "NRB";
  const showNrb = payload.displayMode !== "COMPANY";
  const rows = useMemo(() => {
    const source = compact ? payload.rates.slice(0, 10) : payload.rates;
    const q = search.trim().toLowerCase();
    if (!q) return source;
    return source.filter(
      (rate) =>
        rate.currencyCode.toLowerCase().includes(q) ||
        rate.currency.toLowerCase().includes(q) ||
        (rate.country || "").toLowerCase().includes(q)
    );
  }, [compact, payload.rates, search]);

  return (
    <div className="fx-table">
      <div className="fx-table-head">
        <p>
          Updated {formatDateTime(payload.lastUpdated)} · {payload.source} · {payload.rates.length} currencies
        </p>
        {payload.isStale ? <Badge tone="red">Confirm at a branch</Badge> : <Badge tone="green">Recently synchronized</Badge>}
      </div>
      {!compact ? (
        <label className="fx-search">
          <span>Search currency</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="USD, Qatar, Yen…"
          />
        </label>
      ) : null}
      <div className="fx-scroll">
        <table>
          <thead>
            <tr>
              <th>Currency</th>
              <th>Unit</th>
              {showNrb ? (
                <>
                  <th>NRB buy</th>
                  <th>NRB sell</th>
                </>
              ) : null}
              {showCompany ? (
                <>
                  <th>Our buy</th>
                  <th>Our sell</th>
                </>
              ) : null}
              {!showNrb && !showCompany ? (
                <>
                  <th>Buy</th>
                  <th>Sell</th>
                </>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((rate) => (
              <tr key={rate.currencyCode}>
                <td>
                  <span className="fx-ccy">
                    <CurrencyFlag code={rate.currencyCode} country={rate.country || rate.currency} />
                    <span>
                      <strong>{rate.currencyCode}</strong>
                      <em>{rate.country || rate.currency}</em>
                    </span>
                  </span>
                </td>
                <td>{rate.unit}</td>
                {showNrb ? (
                  <>
                    <td>{formatNpr(rate.nrbBuyRate)}</td>
                    <td>{formatNpr(rate.nrbSellRate)}</td>
                  </>
                ) : null}
                {showCompany ? (
                  <>
                    <td>{formatNpr(rate.companyBuyRate)}</td>
                    <td>{formatNpr(rate.companySellRate)}</td>
                  </>
                ) : null}
                {!showNrb && !showCompany ? (
                  <>
                    <td>{formatNpr(buyRate(rate))}</td>
                    <td>{formatNpr(sellRate(rate))}</td>
                  </>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
