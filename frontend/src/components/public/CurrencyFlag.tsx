import { useState } from "react";
import { cn } from "@/utils/cn";
import { currencyFlagSrc, currencyIso } from "@/utils/currency-flag";

export function CurrencyFlag({
  code,
  country,
  className
}: {
  code: string;
  country?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const src = currencyFlagSrc(code, 40);
  const src2x = currencyFlagSrc(code, 80);
  const label = country || code;

  if (!src || failed) {
    return (
      <span className={cn("fx-flag is-fallback", className)} aria-hidden>
        {currencyIso(code).slice(0, 2).toUpperCase() || code.slice(0, 2)}
      </span>
    );
  }

  return (
    <img
      className={cn("fx-flag", className)}
      src={src}
      srcSet={`${src} 1x, ${src2x} 2x`}
      alt=""
      title={label}
      width={32}
      height={24}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
