export type ImageRatio = "9:16" | "1:1" | "16:9";

const TARGETS: Array<{ value: ImageRatio; ratio: number }> = [
  { value: "9:16", ratio: 9 / 16 },
  { value: "1:1", ratio: 1 },
  { value: "16:9", ratio: 16 / 9 }
];

export function ratioFromSize(width: number, height: number): ImageRatio {
  if (!width || !height) return "16:9";
  const actual = width / height;
  let best: ImageRatio = "16:9";
  let bestDist = Number.POSITIVE_INFINITY;
  for (const item of TARGETS) {
    const dist = Math.abs(Math.log(actual / item.ratio));
    if (dist < bestDist) {
      bestDist = dist;
      best = item.value;
    }
  }
  return best;
}

export function readImageSize(source: File | string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const objectUrl = typeof source === "string" ? "" : URL.createObjectURL(source);
    image.onload = () => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
    image.onerror = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not read image"));
    };
    image.src = typeof source === "string" ? source : objectUrl;
  });
}

export async function detectImageRatio(source: File | string): Promise<ImageRatio> {
  const size = await readImageSize(source);
  return ratioFromSize(size.width, size.height);
}

export function ratioLabel(ratio?: string) {
  if (ratio === "9:16") return "9:16 — Portrait";
  if (ratio === "1:1") return "Square";
  if (ratio === "16:9") return "16:9 — Landscape";
  return "";
}
