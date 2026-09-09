import { useEffect } from "react";
import type { SeoSettings } from "@/types/content";

export function SeoHead({
  seo,
  title,
  description,
  image
}: {
  seo?: SeoSettings | null;
  title?: string;
  description?: string;
  image?: string;
}) {
  useEffect(() => {
    const pageTitle = title || seo?.siteTitle || "Remit2Nepal";
    document.title = pageTitle.includes("Remit2Nepal") ? pageTitle : `${pageTitle} | Remit2Nepal`;
    const desc = description || seo?.metaDescription || "";
    upsertMeta("description", desc);
    upsertMeta("og:title", pageTitle, true);
    upsertMeta("og:description", desc, true);
    upsertMeta("og:image", image || seo?.ogImage || "", true);
    const robots = seo?.robots || "index,follow";
    upsertMeta("robots", robots);
    if (seo?.canonicalUrl) {
      let link = document.querySelector("link[rel='canonical']");
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", seo.canonicalUrl);
    }
  }, [seo, title, description, image]);

  return null;
}

function upsertMeta(name: string, content: string, property = false) {
  if (!content) return;
  const selector = property ? `meta[property='${name}']` : `meta[name='${name}']`;
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(property ? "property" : "name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}
