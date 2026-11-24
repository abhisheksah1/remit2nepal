import { useEffect } from "react";
import type { SeoSettings } from "@/types/content";
import { BRAND } from "@/constants/brand";
import { mediaUrl } from "@/utils/cn";

export function SeoHead({
  seo,
  title,
  description,
  image,
  favicon
}: {
  seo?: SeoSettings | null;
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
}) {
  useEffect(() => {
    const pageTitle = title || seo?.siteTitle || BRAND.name;
    document.title = pageTitle.includes(BRAND.name) ? pageTitle : `${pageTitle} | ${BRAND.name}`;
    const desc = description || seo?.metaDescription || "";
    upsertMeta("description", desc);
    upsertMeta("og:title", pageTitle, true);
    upsertMeta("og:description", desc, true);
    upsertMeta("og:image", image || seo?.ogImage || "", true);
    const robots = seo?.robots || "index,follow";
    upsertMeta("robots", robots);
    const icon = mediaUrl(favicon || seo?.faviconUrl);
    if (icon) {
      let link = document.querySelector("link[rel='icon']");
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "icon");
        document.head.appendChild(link);
      }
      link.setAttribute("href", icon);
    }
    if (seo?.canonicalUrl) {
      let link = document.querySelector("link[rel='canonical']");
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", seo.canonicalUrl);
    }
  }, [seo, title, description, image, favicon]);

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
