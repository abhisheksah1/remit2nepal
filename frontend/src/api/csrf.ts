const CSRF_COOKIE = "r2n_csrf";

export function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const parts = document.cookie.split(";").map((part) => part.trim());
  for (const part of parts) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = decodeURIComponent(part.slice(0, idx));
    if (key === name) return decodeURIComponent(part.slice(idx + 1));
  }
  return null;
}

export function getCsrfToken(): string | null {
  return readCookie(CSRF_COOKIE);
}

export function needsCsrf(method: string): boolean {
  return !["get", "head", "options"].includes(method.toLowerCase());
}
