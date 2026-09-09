import { extractText } from "unpdf";
import { AppError } from "../utils/app-error.js";

const CHUNK_SIZE = 900;
const CHUNK_OVERLAP = 120;

export async function extractPdfPages(buffer: Buffer) {
  try {
    const result = await extractText(new Uint8Array(buffer), { mergePages: false });
    const pages = (Array.isArray(result.text) ? result.text : [String(result.text ?? "")])
      .map((page) => page.replace(/\u0000/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim());
    return { pages, pageCount: result.totalPages || pages.length };
  } catch {
    throw new AppError("Could not read that PDF. Upload a text PDF, not a scanned image.", 400);
  }
}

export function chunkPages(pages: string[]) {
  const chunks: Array<{ page: number; text: string }> = [];
  pages.forEach((page, index) => {
    const pageNumber = index + 1;
    if (!page) return;
    if (page.length <= CHUNK_SIZE) {
      chunks.push({ page: pageNumber, text: page });
      return;
    }
    let start = 0;
    while (start < page.length) {
      const end = Math.min(page.length, start + CHUNK_SIZE);
      const slice = page.slice(start, end).trim();
      if (slice) chunks.push({ page: pageNumber, text: slice });
      if (end >= page.length) break;
      start = end - CHUNK_OVERLAP;
    }
  });
  return chunks;
}
