import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollReveal() {
  const location = useLocation();

  useEffect(() => {
    const root = document.querySelector("main");
    if (!root) return undefined;

    const nodes = root.querySelectorAll(
      "section, .section-intro, .glass-panel, .lift-card, .hero-network, .transfer-desk, .why-card, .why-head, .nepal-story-copy, .remittance-copy, .remittance-cube, .remittance-lede, .remittance-cta, .about-stat, .about-value, .about-story-card, .about-shot, .about-person, .about-comp-card, .about-hero-copy.is-card, .about-leader-head, .about-leader-panel, .chat-assist, .apro-card, .apro-value, .apro-split-grid"
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    nodes.forEach((node) => {
      if (node.classList.contains("hero-stage") || node.classList.contains("reveal-skip") || node.classList.contains("page-hero") || node.classList.contains("cdesk") || node.classList.contains("agent-desk") || node.classList.contains("agent-hero") || node.classList.contains("board-desk") || node.classList.contains("ba-desk") || node.classList.contains("ba-hero") || node.classList.contains("apply-desk") || node.classList.contains("apply-hero")) {
        node.classList.add("is-revealed");
        return;
      }
      const top = node.getBoundingClientRect().top;
      if (top < window.innerHeight * 0.92) {
        node.classList.add("is-revealed");
        return;
      }
      node.classList.add("will-reveal");
      observer.observe(node);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  return null;
}
