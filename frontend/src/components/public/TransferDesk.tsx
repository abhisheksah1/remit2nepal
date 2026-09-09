import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/public.api";
import { formatDateTime, formatNpr } from "@/utils/format";
import type { PublicRatesPayload } from "@/types/rates";

const FEATURED = ["USD", "AED", "EUR", "GBP", "QAR", "SAR"];

export function TransferDesk({
  rates,
  showCta = true
}: {
  rates?: PublicRatesPayload;
  showCta?: boolean;
}) {
  const query = useQuery({
    queryKey: ["public", "rates", "desk"],
    queryFn: publicApi.rates,
    enabled: !rates,
    staleTime: 5 * 60 * 1000
  });
  const payload = rates ?? query.data;
  const list = payload?.rates ?? [];
  const featured = list.filter((rate) => FEATURED.includes(rate.currencyCode));
  const pills = featured.length ? featured : list.slice(0, 6);
  const [code, setCode] = useState("USD");
  const [amount, setAmount] = useState("1000");
  const selected = useMemo(
    () => list.find((rate) => rate.currencyCode === code) ?? list[0],
    [list, code]
  );
  const nprRate = selected?.companySellRate ?? selected?.nrbSellRate ?? selected?.companyBuyRate ?? selected?.nrbBuyRate;
  const sendValue = Number(amount.replace(/,/g, "")) || 0;
  const received = nprRate != null ? sendValue * nprRate : null;
  const activeCode = selected?.currencyCode ?? code;

  return (
    <div className="transfer-desk">
      <div className="transfer-desk-head">
        <div>
          <p>Send to Nepal</p>
          <small>Live customer rate · {activeCode} → NPR</small>
        </div>
        <span className={payload?.isStale ? "is-stale" : undefined}>
          {payload?.isStale ? "Confirm at counter" : "Live"}
        </span>
      </div>

      <div className="transfer-desk-body">
        <fieldset className="transfer-field">
          <legend>You send from abroad</legend>
          <div className="transfer-pills" role="radiogroup" aria-label="Popular send currencies">
            {pills.map((item) => (
              <button
                key={item.currencyCode}
                type="button"
                role="radio"
                aria-checked={item.currencyCode === activeCode}
                className={item.currencyCode === activeCode ? "is-active" : undefined}
                onClick={() => setCode(item.currencyCode)}
              >
                {item.currencyCode}
              </button>
            ))}
          </div>
          {list.length > pills.length ? (
            <label className="mb-3 block text-xs text-ink-muted">
              All NRB currencies
              <select
                className="mt-1 w-full rounded-md border border-navy/15 bg-white px-3 py-2 text-sm text-navy"
                value={activeCode}
                onChange={(event) => setCode(event.target.value)}
              >
                {list.map((item) => (
                  <option key={item.currencyCode} value={item.currencyCode}>
                    {item.currencyCode} · {item.currency}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <label className="transfer-amount">
            <span className="sr-only">Amount to send in {activeCode}</span>
            <em>{activeCode}</em>
            <input
              inputMode="decimal"
              value={amount}
              onChange={(event) => setAmount(event.target.value.replace(/[^\d.]/g, ""))}
            />
          </label>
        </fieldset>

        <div className="transfer-mid">
          <span className="transfer-mid-icon" aria-hidden>
            <ArrowDown className="h-4 w-4" />
          </span>
          <div className="transfer-mid-line" aria-hidden />
          <p>
            {nprRate != null ? (
              <>
                1 {activeCode} = <strong>NPR {formatNpr(nprRate)}</strong>
              </>
            ) : (
              "Rate loading…"
            )}
          </p>
        </div>

        <div className="transfer-field">
          <span>Family receives in Nepal</span>
          <div className="transfer-receive">
            <em>NPR</em>
            <strong>{received != null ? formatNpr(received, 0) : "—"}</strong>
          </div>
        </div>

        {showCta ? (
          <Link to="/exchange-rate" className="transfer-cta btn-shimmer">
            View full rate table
          </Link>
        ) : null}
        <p className="transfer-note">
          {payload?.lastUpdated ? `Updated ${formatDateTime(payload.lastUpdated)}` : "Rates confirmed at the branch counter."}
        </p>
      </div>
    </div>
  );
}
