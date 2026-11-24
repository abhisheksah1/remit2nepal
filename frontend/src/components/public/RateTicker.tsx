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
    return <p className="truncate tracking-[0.18em] text-white/80">Treasury desk · Receiving remittance in Nepal</p>;
  }
  const row = (
    <>
      {rates.map((rate) => (
        <span key={rate.currencyCode} className="mx-5 inline-flex items-center gap-2">
          <span className="font-bold text-white">{rate.currencyCode}</span>
          <span className="text-white/90">{formatNpr(rate.companyBuyRate ?? rate.nrbBuyRate)}</span>
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
