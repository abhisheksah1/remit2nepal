/** Official Nepal districts mapped to provinces, with common aliases. */
export const DISTRICT_PROVINCE: Record<string, string> = {
  bhojpur: "Koshi",
  dhankuta: "Koshi",
  ilam: "Koshi",
  jhapa: "Koshi",
  khotang: "Koshi",
  morang: "Koshi",
  okhaldhunga: "Koshi",
  panchthar: "Koshi",
  sankhuwasabha: "Koshi",
  solukhumbu: "Koshi",
  sunsari: "Koshi",
  taplejung: "Koshi",
  terhathum: "Koshi",
  tehrathum: "Koshi",
  udayapur: "Koshi",
  bara: "Madhesh",
  dhanusha: "Madhesh",
  dhanusa: "Madhesh",
  janakpur: "Madhesh",
  mahottari: "Madhesh",
  parsa: "Madhesh",
  rautahat: "Madhesh",
  saptari: "Madhesh",
  sarlahi: "Madhesh",
  siraha: "Madhesh",
  bhaktapur: "Bagmati",
  chitwan: "Bagmati",
  dhading: "Bagmati",
  dolakha: "Bagmati",
  dolkha: "Bagmati",
  kathmandu: "Bagmati",
  kavrepalanchok: "Bagmati",
  kavre: "Bagmati",
  kabhrepalanchok: "Bagmati",
  lalitpur: "Bagmati",
  makwanpur: "Bagmati",
  nuwakot: "Bagmati",
  ramechhap: "Bagmati",
  rasuwa: "Bagmati",
  sindhuli: "Bagmati",
  sindhupalchok: "Bagmati",
  sindhupalchowk: "Bagmati",
  baglung: "Gandaki",
  gorkha: "Gandaki",
  kaski: "Gandaki",
  pokhara: "Gandaki",
  lamjung: "Gandaki",
  manang: "Gandaki",
  mustang: "Gandaki",
  myagdi: "Gandaki",
  nawalpur: "Gandaki",
  "nawalparasi east": "Gandaki",
  parbat: "Gandaki",
  syangja: "Gandaki",
  tanahun: "Gandaki",
  tanahu: "Gandaki",
  arghakhanchi: "Lumbini",
  banke: "Lumbini",
  bardiya: "Lumbini",
  dang: "Lumbini",
  gulmi: "Lumbini",
  kapilvastu: "Lumbini",
  palpa: "Lumbini",
  pyuthan: "Lumbini",
  rolpa: "Lumbini",
  "rukum east": "Lumbini",
  rupandehi: "Lumbini",
  parasi: "Lumbini",
  "nawalparasi west": "Lumbini",
  nawalparasi: "Lumbini",
  dailekh: "Karnali",
  dolpa: "Karnali",
  humla: "Karnali",
  jajarkot: "Karnali",
  jumla: "Karnali",
  kalikot: "Karnali",
  mugu: "Karnali",
  "rukum west": "Karnali",
  rukum: "Karnali",
  salyan: "Karnali",
  surkhet: "Karnali",
  achham: "Sudurpashchim",
  baitadi: "Sudurpashchim",
  bajhang: "Sudurpashchim",
  bajura: "Sudurpashchim",
  dadeldhura: "Sudurpashchim",
  darchula: "Sudurpashchim",
  doti: "Sudurpashchim",
  kailali: "Sudurpashchim",
  kanchanpur: "Sudurpashchim"
};

/** Cities and nicknames mapped to the official district name. */
export const PLACE_TO_DISTRICT: Record<string, string> = {
  ktm: "Kathmandu",
  "ktm valley": "Kathmandu",
  "kathmandu valley": "Kathmandu",
  patan: "Lalitpur",
  pokhara: "Kaski",
  biratnagar: "Morang",
  birgunj: "Parsa",
  butwal: "Rupandehi",
  bhairahawa: "Rupandehi",
  siddharthanagar: "Rupandehi",
  dharan: "Sunsari",
  itahari: "Sunsari",
  hetauda: "Makwanpur",
  bharatpur: "Chitwan",
  narayangarh: "Chitwan",
  narayanghat: "Chitwan",
  nepalgunj: "Banke",
  dhangadhi: "Kailali",
  mahendranagar: "Kanchanpur",
  bhimdatta: "Kanchanpur",
  janakpur: "Dhanusha",
  damak: "Jhapa",
  birtamod: "Jhapa",
  kakarbhitta: "Jhapa",
  kakarvitta: "Jhapa",
  tulsipur: "Dang",
  ghorahi: "Dang",
  tikapur: "Kailali",
  birendranagar: "Surkhet",
  dhulikhel: "Kavrepalanchok",
  banepa: "Kavrepalanchok",
  kalaiya: "Bara",
  rajbiraj: "Saptari",
  inaruwa: "Sunsari",
  urlabari: "Morang",
  taulihawa: "Kapilvastu",
  damauli: "Tanahun",
  waling: "Syangja",
  bidur: "Nuwakot",
  charikot: "Dolakha",
  manthali: "Ramechhap"
};

const PLACE_KEYS = [...Object.keys(PLACE_TO_DISTRICT), ...Object.keys(DISTRICT_PROVINCE)].sort(
  (a, b) => b.length - a.length
);

export function normalizeDistrictKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function officialDistrictName(value: string): string {
  const key = normalizeDistrictKey(value);
  if (PLACE_TO_DISTRICT[key]) return PLACE_TO_DISTRICT[key];
  if (key === "dhanusa") return "Dhanusha";
  if (DISTRICT_PROVINCE[key]) return titleCasePlace(key);
  return "";
}

export function findDistrictInText(...parts: string[]): string {
  const hay = parts.filter(Boolean).join(" ").toLowerCase();
  if (!hay) return "";
  for (const key of PLACE_KEYS) {
    const pattern = new RegExp(`(?:^|[^a-z])${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:[^a-z]|$)`);
    if (pattern.test(hay)) return officialDistrictName(key) || titleCasePlace(key);
  }
  return "";
}

export function resolveProvince(district: string, province?: string): string {
  if (province?.trim()) return province.trim();
  const official = officialDistrictName(district) || district;
  const mapped = DISTRICT_PROVINCE[normalizeDistrictKey(official)] ?? DISTRICT_PROVINCE[normalizeDistrictKey(district)];
  return mapped ?? "Bagmati";
}

export function titleCasePlace(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}
