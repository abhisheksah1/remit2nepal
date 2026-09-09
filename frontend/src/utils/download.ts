import { api } from "@/api/client";

export async function downloadAuthorized(path: string, fallbackName: string) {
  const response = await api.get(path, { responseType: "blob" });
  const header = String(response.headers["content-disposition"] ?? "");
  const match = header.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  const name = match?.[1] ? decodeURIComponent(match[1]) : fallbackName;
  const url = URL.createObjectURL(response.data as Blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}