const EASE = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function headerOffset() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--site-header-height");
  const parsed = Number.parseFloat(raw);
  return (Number.isFinite(parsed) ? parsed : 108) + 12;
}

let frame = 0;
let cancelUser = () => undefined as void;

function stop() {
  if (frame) {
    window.cancelAnimationFrame(frame);
    frame = 0;
  }
  cancelUser();
  cancelUser = () => undefined as void;
}

export function smoothScrollTo(targetY: number) {
  stop();
  const top = Math.max(0, targetY);
  if (prefersReducedMotion()) {
    window.scrollTo(0, top);
    return;
  }

  const startY = window.scrollY;
  const distance = top - startY;
  if (Math.abs(distance) < 2) return;

  const duration = Math.min(780, Math.max(360, Math.abs(distance) * 0.42));
  const startTime = performance.now();

  const abort = () => stop();
  window.addEventListener("wheel", abort, { passive: true });
  window.addEventListener("touchstart", abort, { passive: true });
  window.addEventListener("keydown", abort);
  cancelUser = () => {
    window.removeEventListener("wheel", abort);
    window.removeEventListener("touchstart", abort);
    window.removeEventListener("keydown", abort);
  };

  const tick = (now: number) => {
    const t = Math.min(1, (now - startTime) / duration);
    window.scrollTo(0, startY + distance * EASE(t));
    if (t < 1) {
      frame = window.requestAnimationFrame(tick);
      return;
    }
    stop();
  };

  frame = window.requestAnimationFrame(tick);
}

export function smoothScrollToId(id: string) {
  const tryScroll = (attempts: number) => {
    const node = document.getElementById(id);
    if (node) {
      const y = node.getBoundingClientRect().top + window.scrollY - headerOffset();
      smoothScrollTo(y);
      return;
    }
    if (attempts > 0) {
      window.setTimeout(() => tryScroll(attempts - 1), 70);
      return;
    }
    smoothScrollTo(0);
  };
  tryScroll(10);
}

export function smoothScrollToHash(hash: string) {
  const id = hash.replace(/^#/, "");
  if (!id) {
    smoothScrollTo(0);
    return;
  }
  smoothScrollToId(id);
}
