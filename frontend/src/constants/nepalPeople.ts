export const DEFAULT_NEPAL_SCENES = [
  { src: "/images/nepal-map/scene-office.svg", alt: "Nepali professional on a call", title: "Working abroad" },
  { src: "/images/nepal-map/scene-family.svg", alt: "Nepali mother and child at home", title: "Family in Nepal" },
  { src: "/images/nepal-map/scene-worker.svg", alt: "Nepali industrial worker", title: "Building Nepal" },
  { src: "/images/nepal-map/scene-payout.svg", alt: "Receiving remittance in Nepal", title: "Funds received" }
] as const;

export const NEPAL_MAP_CITYSCAPE = "/images/nepal-map/cityscape.svg";

export const NEPAL_MAP_TILE_BOXES = [
  { x: -10, y: -8, w: 300, h: 230 },
  { x: 170, y: 24, w: 300, h: 240 },
  { x: 360, y: 70, w: 300, h: 250 },
  { x: 90, y: 150, w: 340, h: 200 },
  { x: 300, y: 155, w: 280, h: 190 },
  { x: 10, y: 80, w: 230, h: 200 }
] as const;
