import { useQuery } from "@tanstack/react-query";
import { publicApi } from "@/api/public.api";
import { formatNpr } from "@/utils/format";

export function RateTicker() {
  const query = useQuery({
    queryKey: ["public", "rates", "ticker"],
    queryFn: publicApi.rates,
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000
  });
  const rates = query.data?.rates ?? [];
  if (!rates.length) {
    return <p className="truncate tracking-[0.18em] text-cream/70">Treasury desk · Licensed remittance corridors</p>;
  }
  const row = (
    <>
      {rates.map((rate) => (
        <span key={rate.currencyCode} className="mx-5 inline-flex items-center gap-2">
          <span className="text-gold">{rate.currencyCode}</span>
          <span className="text-cream/85">{formatNpr(rate.companyBuyRate ?? rate.nrbBuyRate)}</span>
        </span>
      ))}
    </>
  );
  return (
    <div className="ticker" aria-label="Live NRB exchange rates">
      <div className="ticker-track">
        {row}
        {row}
      </div>
    </div>
  );
}
