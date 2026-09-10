import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { CmsSection } from "@/types/content";
import type { PublicRate, PublicRatesPayload } from "@/types/rates";
import { formatNpr } from "@/utils/format";
import { heroTitleParts } from "@/utils/hero";
import { CurrencyFlag } from "./CurrencyFlag";
import { RateTable } from "./RateTable";
import { TransferDesk } from "./TransferDesk";

const FEATURED = ["USD", "AED", "EUR", "GBP", "QAR", "SAR"];

function sellOf(rate: PublicRate) {
  return rate.companySellRate ?? rate.nrbSellRate ?? rate.officialRate;
}

function buyOf(rate: PublicRate) {
  return rate.companyBuyRate ?? rate.nrbBuyRate;
}

export function RatesBoard({
  section,
  rates,
  compact
}: {
  section?: CmsSection;
  rates: PublicRatesPayload;
  compact?: boolean;
}) {
  const kicker = section?.icon?.trim() || "Treasury desk";
  const heading = section?.heading?.trim() || "Today's exchange rates";
  const titleParts = heroTitleParts(heading);
  const punch = section?.subheading?.trim();
  const lede = section?.description?.trim();
  const ctaLabel = section?.buttonLabel?.trim();
  const ctaUrl = section?.buttonUrl?.trim() || "/exchange-rate";
  const featured = FEATURED.map((code) => rates.rates.find((item) => item.currencyCode === code)).filter(Boolean) as PublicRate[];
  const cards = featured.length ? featured : rates.rates.slice(0, 6);

  return (
    <section className="fx-board reveal-skip" aria-labelledby={section ? `${section.key}-heading` : "fx-heading"}>
      <div className="fx-wrap">
        {section ? (
          <header className="fx-head">
            {kicker ? <p className="fx-kicker">{kicker}</p> : null}
            <h2 id={`${section.key}-heading`} className="fx-title">
              {titleParts.map((part, index) => (
                <span key={`${part.tone}-${index}`} className={part.tone}>
                  {part.text}
                </span>
              ))}
            </h2>
            {punch ? <p className="fx-punch">{punch}</p> : null}
            {lede ? <p className="fx-lede">{lede}</p> : null}
          </header>
        ) : null}

        {cards.length ? (
          <div className="fx-cards">
            {cards.map((rate) => (
              <article key={rate.currencyCode} className="fx-card">
                <CurrencyFlag code={rate.currencyCode} country={rate.country || rate.currency} />
                <div>
                  <strong>{rate.currencyCode}</strong>
                  <em>{rate.country || rate.currency}</em>
                </div>
                <p>
                  1 {rate.currencyCode} = <b>NPR {formatNpr(sellOf(rate) ?? buyOf(rate))}</b>
                </p>
              </article>
            ))}
          </div>
        ) : null}

        <div className="fx-layout">
          <TransferDesk rates={rates} showCta={false} />
          <div className="fx-panel">
            <RateTable payload={rates} compact={compact} />
          </div>
        </div>

        {section && ctaLabel ? (
          <div className="fx-actions">
            <Link className="fx-cta" to={ctaUrl}>
              {ctaLabel}
              <ArrowRight />
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
