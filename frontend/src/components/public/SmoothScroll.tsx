import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { smoothScrollTo, smoothScrollToHash } from "@/utils/smooth-scroll";

export function SmoothScroll() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const run = () => {
      if (hash) {
        smoothScrollToHash(hash);
        return;
      }
      smoothScrollTo(0);
    };

    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(run);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [pathname, hash]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const link = (event.target as HTMLElement | null)?.closest("a[href]");
      if (!link || link.hasAttribute("download") || link.getAttribute("target") === "_blank") return;

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname !== window.location.pathname || url.search !== window.location.search) return;

      if (url.hash) {
        event.preventDefault();
        if (url.hash !== window.location.hash) {
          window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
        }
        smoothScrollToHash(url.hash);
        return;
      }

      event.preventDefault();
      smoothScrollTo(0);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
