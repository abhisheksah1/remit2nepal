import { NEPAL_PROVINCES } from "./nepalMap";

export type NepalMosaicCell = {
  id: string;
  provinceId: string;
  name: string;
  capital: string;
  d: string;
  x: number;
  y: number;
  band: 0 | 1 | 2;
};

function subpaths(d: string) {
  return d
    .split(/(?=M)/)
    .map((part) => part.trim())
    .filter((part) => part.length > 8);
}

function centroid(d: string) {
  const nums = [...d.matchAll(/-?\d+(?:\.\d+)?/g)].map(Number);
  let sx = 0;
  let sy = 0;
  let n = 0;
  for (let i = 0; i + 1 < nums.length; i += 2) {
    const x = nums[i];
    const y = nums[i + 1];
    if (x === undefined || y === undefined) continue;
    sx += x;
    sy += y;
    n += 1;
  }
  return { x: n ? sx / n : 320, y: n ? sy / n : 166 };
}

export const NEPAL_MOSAIC: NepalMosaicCell[] = NEPAL_PROVINCES.flatMap((province) =>
  subpaths(province.d).map((d, index) => {
    const { x, y } = centroid(d);
    const band: 0 | 1 | 2 = x < 210 ? 0 : x < 420 ? 1 : 2;
    return {
      id: `${province.id}-${index}`,
      provinceId: province.id,
      name: province.name,
      capital: province.capital,
      d,
      x,
      y,
      band
    };
  })
);

export const NEPAL_MOSAIC_ART = "/images/nepal-map/people-mosaic.svg";

export const PROVINCE_DISTRICTS: Record<string, string[]> = {
  Koshi: ["Bhojpur", "Dhankuta", "Ilam", "Jhapa", "Khotang", "Morang", "Okhaldhunga", "Panchthar", "Sankhuwasabha", "Solukhumbu", "Sunsari", "Taplejung", "Terhathum", "Udayapur"],
  Madhesh: ["Bara", "Dhanusha", "Mahottari", "Parsa", "Rautahat", "Saptari", "Sarlahi", "Siraha"],
  Bagmati: ["Bhaktapur", "Chitwan", "Dhading", "Dolakha", "Kathmandu", "Kavrepalanchok", "Lalitpur", "Makwanpur", "Nuwakot", "Ramechhap", "Rasuwa", "Sindhuli", "Sindhupalchok"],
  Gandaki: ["Baglung", "Gorkha", "Kaski", "Lamjung", "Manang", "Mustang", "Myagdi", "Nawalpur", "Parbat", "Syangja", "Tanahun"],
  Lumbini: ["Arghakhanchi", "Banke", "Bardiya", "Dang", "Gulmi", "Kapilvastu", "Palpa", "Parasi", "Pyuthan", "Rolpa", "Rukum East", "Rupandehi"],
  Karnali: ["Dailekh", "Dolpa", "Humla", "Jajarkot", "Jumla", "Kalikot", "Mugu", "Rukum West", "Salyan", "Surkhet"],
  Sudurpashchim: ["Achham", "Baitadi", "Bajhang", "Bajura", "Dadeldhura", "Darchula", "Doti", "Kailali", "Kanchanpur"]
};

export function sameProvince(a: string, b: string) {
  const n = (value: string) => value.toLowerCase().replace(/province|pradesh/g, "").replace(/\s+/g, " ").trim();
  const left = n(a);
  const right = n(b);
  return left === right || left.includes(right) || right.includes(left);
}
