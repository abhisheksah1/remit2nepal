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

export function normalizeDistrictKey(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function resolveProvince(district: string, province?: string): string {
  if (province?.trim()) return province.trim();
  const mapped = DISTRICT_PROVINCE[normalizeDistrictKey(district)];
  return mapped ?? "Bagmati";
}

export function titleCasePlace(value: string): string {
  return value
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}
