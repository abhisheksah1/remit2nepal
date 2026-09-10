import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import type { BannerItem } from "@/types/content";
import { cn, entityId, mediaUrl } from "@/utils/cn";

const COOKIE_KEY = "r2n-cookie-choice";
const DISMISS_KEY = "r2n-banner-dismiss";

function readStore(session: boolean) {
  try {
    const raw = (session ? sessionStorage : localStorage).getItem(DISMISS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, number>) : {};
  } catch {
    return {};
  }
}

function writeStore(session: boolean, id: string) {
  const next = { ...readStore(session), [id]: Date.now() };
  try {
    (session ? sessionStorage : localStorage).setItem(DISMISS_KEY, JSON.stringify(next));
  } catch {
    return;
  }
}

function cookieChoice() {
  try {
    return localStorage.getItem(COOKIE_KEY);
  } catch {
    return null;
  }
}

function setCookieChoice(value: "all" | "essential") {
  try {
    localStorage.setItem(COOKIE_KEY, value);
  } catch {
    return;
  }
}

function matchesPage(item: BannerItem, pathname: string) {
  if (item.pageScope === "HOME") return pathname === "/";
  if (item.pageScope === "CUSTOM") {
    const path = item.pagePath?.trim() || "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  }
  return true;
}

function isDismissed(item: BannerItem) {
  if (item.frequency === "EVERY_VISIT") return false;
  const id = entityId(item);
  if (item.frequency === "SESSION") return Boolean(readStore(true)[id]);
  return Boolean(readStore(false)[id]);
}

function hrefOf(url?: string) {
  return (url || "").trim() || "";
}

function ratioClass(item: BannerItem) {
  const ratio = item.imageRatio || "16:9";
  if (ratio === "9:16") return "is-ratio-9-16";
  if (ratio === "1:1") return "is-ratio-1-1";
  return "is-ratio-16-9";
}

function secondaryHref(label: string) {
  if (/agent/i.test(label)) return "/branches";
  if (/rate/i.test(label)) return "/exchange-rate";
  if (/contact|enquir/i.test(label)) return "/contact";
  return "";
}

function BannerLink({
  to,
  className,
  children
}: {
  to: string;
  className?: string;
  children: ReactNode;
}) {
  if (!to) return <span className={className}>{children}</span>;
  if (to.startsWith("http://") || to.startsWith("https://")) {
    return (
      <a href={to} className={className} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

function BannerCard({
  item,
  variant,
  onDismiss
}: {
  item: BannerItem;
  variant: "top" | "bottom" | "side" | "center" | "popup" | "cookie";
  onDismiss: (choice?: "all" | "essential") => void;
}) {
  const photo = mediaUrl(item.imageUrl);
  const primary = item.buttonLabel?.trim();
  const secondary = item.secondaryButtonLabel?.trim();
  const href = hrefOf(item.linkUrl);

  const extra = variant === "cookie" ? "" : secondaryHref(secondary || "");
  const art = variant !== "cookie";
  const picture = photo ? (
    <figure className="camp-photo">
      <img src={photo} alt={item.altText || item.title || "Banner"} />
    </figure>
  ) : null;

  return (
    <article className={cn("camp-card", `is-${variant}`, `is-${item.kind.toLowerCase()}`, art && "is-art", art && ratioClass(item))}>
      {art ? (
        href ? <BannerLink to={href} className="camp-art-link">{picture}</BannerLink> : picture
      ) : (
        <>
          {picture}
          <div className="camp-copy">
            <div className="camp-text">
              {item.title ? <h2>{item.title}</h2> : null}
              {item.subtitle ? <p className="camp-sub">{item.subtitle}</p> : null}
              {item.body ? <p className="camp-body">{item.body}</p> : null}
            </div>
            {primary || secondary ? (
              <div className="camp-actions">
                {primary ? (
                  <button type="button" className="camp-btn is-primary" onClick={() => onDismiss("all")}>
                    {primary}
                  </button>
                ) : null}
                {secondary ? (
                  extra ? (
                    <BannerLink to={extra} className="camp-btn is-ghost">
                      {secondary}
                    </BannerLink>
                  ) : (
                    <button type="button" className="camp-btn is-ghost" onClick={() => onDismiss("essential")}>
                      {secondary}
                    </button>
                  )
                ) : null}
                {href ? (
                  <BannerLink to={href} className="camp-policy">
                    Privacy
                  </BannerLink>
                ) : null}
              </div>
            ) : null}
          </div>
        </>
      )}
      {item.dismissible && variant !== "popup" ? (
        <button type="button" className="camp-close" aria-label="Close" onClick={() => onDismiss(variant === "cookie" ? "essential" : undefined)}>
          <X />
        </button>
      ) : null}
    </article>
  );
}

export function SiteBanners({ banners = [] }: { banners: BannerItem[] }) {
  const { pathname } = useLocation();
  const [cookie, setCookie] = useState<string | null>(() => cookieChoice());
  const [tick, setTick] = useState(0);
  const [introReady, setIntroReady] = useState(false);
  const [introClosed, setIntroClosed] = useState(false);

  const visible = useMemo(
    () => banners.filter((item) => matchesPage(item, pathname) && !isDismissed(item)),
    [banners, pathname, tick]
  );

  const cookieBanner = visible.find((item) => item.kind === "COOKIE");
  const showCookie = !cookie;
  const campaigns = visible.filter((item) => item.kind !== "COOKIE");

  const pick = (position: BannerItem["position"]) => campaigns.find((item) => item.position === position);
  const featured = pick("POPUP") || pick("TOP") || pick("CENTER") || pick("BOTTOM");
  const waitingIntro = Boolean(featured && !introReady);
  const showIntro = Boolean(featured && introReady && !introClosed);
  const popup = showIntro ? featured : undefined;
  const hold = waitingIntro || showIntro;
  const top = hold ? undefined : pick("TOP");
  const bottom = hold ? undefined : pick("BOTTOM");
  const left = hold ? undefined : pick("LEFT");
  const right = hold ? undefined : pick("RIGHT");
  const center = hold ? undefined : pick("CENTER");

  function dismiss(item: BannerItem, choice?: "all" | "essential", closeIntro?: boolean) {
    if (item.kind === "COOKIE") {
      const next = choice ?? "all";
      setCookieChoice(next);
      setCookie(next);
      return;
    }
    if (closeIntro) {
      setIntroClosed(true);
      return;
    }
    if (item.frequency === "SESSION") writeStore(true, entityId(item));
    else if (item.frequency !== "EVERY_VISIT") writeStore(false, entityId(item));
    setTick((value) => value + 1);
  }

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => setIntroReady(true), reduce ? 0 : 5000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!popup) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape" && popup.dismissible) dismiss(popup, undefined, true);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [popup]);

  const fallbackCookie: BannerItem = {
    title: "Cookies on this site",
    body: "We store a small preference on this device so we do not keep showing the same notice.",
    subtitle: "",
    imageUrl: "",
    altText: "",
    kind: "COOKIE",
    position: "BOTTOM",
    pageScope: "ALL",
    pagePath: "",
    linkUrl: "/privacy",
    buttonLabel: "Accept",
    secondaryButtonLabel: "Essential only",
    frequency: "ONCE",
    dismissible: true,
    status: "ACTIVE",
    displayOrder: 0
  };

  const cookieItem = cookieBanner ?? fallbackCookie;

  return (
    <>
      {top ? (
        <>
          <div className="camp-top-space" aria-hidden />
          <div className="camp-slot is-top">
            <BannerCard item={top} variant="top" onDismiss={() => dismiss(top)} />
          </div>
        </>
      ) : null}

      {left ? (
        <div className="camp-slot is-left">
          <BannerCard item={left} variant="side" onDismiss={() => dismiss(left)} />
        </div>
      ) : null}

      {right ? (
        <div className="camp-slot is-right">
          <BannerCard item={right} variant="side" onDismiss={() => dismiss(right)} />
        </div>
      ) : null}

      {center ? (
        <div className="camp-slot is-center">
          <BannerCard item={center} variant="center" onDismiss={() => dismiss(center)} />
        </div>
      ) : null}

      {bottom ? (
        <div className="camp-slot is-bottom">
          <BannerCard item={bottom} variant="bottom" onDismiss={() => dismiss(bottom)} />
        </div>
      ) : null}

      {popup ? (
        <div className="camp-popup is-in" role="dialog" aria-modal="true" aria-label={popup.title || "Banner"}>
          <button type="button" className="camp-popup-back" aria-label="Close popup" onClick={() => popup.dismissible && dismiss(popup, undefined, true)} />
          <div className={cn("camp-popup-stage", ratioClass(popup))}>
            {popup.dismissible ? (
              <button
                type="button"
                className="camp-popup-x"
                aria-label="Close"
                onClick={() => dismiss(popup, undefined, true)}
              >
                <X />
              </button>
            ) : null}
            <BannerCard item={popup} variant="popup" onDismiss={() => dismiss(popup, undefined, true)} />
          </div>
        </div>
      ) : null}

      {showCookie ? (
        <div className="camp-slot is-cookie">
          <BannerCard
            item={cookieItem}
            variant="cookie"
            onDismiss={(choice) => dismiss(cookieItem, choice ?? "all")}
          />
        </div>
      ) : null}
    </>
  );
}
