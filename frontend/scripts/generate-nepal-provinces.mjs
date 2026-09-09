import { writeFileSync } from "node:fs";
import { toSvgPaths } from "nepali-geo-pro-max";
import { NEPAL_PROVINCES_GEO } from "nepali-geo-pro-max/geo/provinces";

const NAMES = {
  P1: { name: "Koshi", capital: "Biratnagar" },
  P2: { name: "Madhesh", capital: "Janakpur" },
  P3: { name: "Bagmati", capital: "Hetauda" },
  P4: { name: "Gandaki", capital: "Pokhara" },
  P5: { name: "Lumbini", capital: "Deukhuri" },
  P6: { name: "Karnali", capital: "Birendranagar" },
  P7: { name: "Sudurpashchim", capital: "Godawari" }
};

function dist(a, b) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return Math.hypot(dx, dy);
}

function pointLineDistance(p, a, b) {
  const [x, y] = p;
  const [x1, y1] = a;
  const [x2, y2] = b;
  const dx = x2 - x1;
  const dy = y2 - y1;
  if (dx === 0 && dy === 0) return dist(p, a);
  const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)));
  return dist(p, [x1 + t * dx, y1 + t * dy]);
}

function rdp(points, epsilon) {
  if (points.length < 3) return points;
  let maxD = 0;
  let index = 0;
  const end = points.length - 1;
  for (let i = 1; i < end; i += 1) {
    const d = pointLineDistance(points[i], points[0], points[end]);
    if (d > maxD) {
      index = i;
      maxD = d;
    }
  }
  if (maxD > epsilon) {
    const left = rdp(points.slice(0, index + 1), epsilon);
    const right = rdp(points.slice(index), epsilon);
    return left.slice(0, -1).concat(right);
  }
  return [points[0], points[end]];
}

function simplifyRing(ring, epsilon) {
  if (ring.length < 5) return ring;
  const closed = dist(ring[0], ring[ring.length - 1]) < 1e-9;
  const open = closed ? ring.slice(0, -1) : ring.slice();
  let simplified = rdp(open, epsilon);
  if (simplified.length < 4) simplified = open.filter((_, i) => i % 8 === 0).concat([open[open.length - 1]]);
  if (closed) simplified = simplified.concat([simplified[0]]);
  return simplified;
}

function simplifyCoords(coords, epsilon) {
  return coords.map((poly) => poly.map((ring) => simplifyRing(ring, epsilon)));
}

function simplifyGeometry(geometry, epsilon) {
  if (geometry.type === "Polygon") {
    return { type: "Polygon", coordinates: simplifyCoords([geometry.coordinates], epsilon)[0] };
  }
  if (geometry.type === "MultiPolygon") {
    return { type: "MultiPolygon", coordinates: simplifyCoords(geometry.coordinates, epsilon) };
  }
  return geometry;
}

function roundPath(d) {
  return d.replace(/-?\d+\.\d+/g, (n) => Number(n).toFixed(1).replace(/\.0$/, ""));
}

function centroidFromPath(d) {
  const nums = [...d.matchAll(/(-?\d+\.?\d*)/g)].map((m) => Number(m[1]));
  let sx = 0;
  let sy = 0;
  let n = 0;
  for (let i = 0; i + 1 < nums.length; i += 2) {
    sx += nums[i];
    sy += nums[i + 1];
    n += 1;
  }
  return { x: Math.round((sx / n) * 10) / 10, y: Math.round((sy / n) * 10) / 10 };
}

const simplified = {
  type: "FeatureCollection",
  features: NEPAL_PROVINCES_GEO.features.map((feature) => ({
    ...feature,
    geometry: simplifyGeometry(feature.geometry, 0.045)
  }))
};

const { paths, viewBox } = toSvgPaths(simplified, { width: 640, padding: 8 });

const CITIES = [
  { name: "Kathmandu", lng: 85.324, lat: 27.7172 },
  { name: "Pokhara", lng: 83.9856, lat: 28.2096 },
  { name: "Biratnagar", lng: 87.2718, lat: 26.4525 },
  { name: "Nepalgunj", lng: 81.6167, lat: 28.05 }
];

const [minX, minY, width, height] = viewBox.split(" ").map(Number);
const lats = [];
const lngs = [];
for (const feature of simplified.features) {
  const polys = feature.geometry.type === "Polygon" ? [feature.geometry.coordinates] : feature.geometry.coordinates;
  for (const poly of polys) {
    for (const ring of poly) {
      for (const [lng, lat] of ring) {
        lngs.push(lng);
        lats.push(lat);
      }
    }
  }
}
const minLng = Math.min(...lngs);
const maxLng = Math.max(...lngs);
const minLat = Math.min(...lats);
const maxLat = Math.max(...lats);
const pad = 8;
const innerW = width - pad * 2;
const innerH = height - pad * 2;

function project(lng, lat) {
  return {
    x: Math.round((pad + ((lng - minLng) / (maxLng - minLng)) * innerW) * 10) / 10,
    y: Math.round((pad + ((maxLat - lat) / (maxLat - minLat)) * innerH) * 10) / 10
  };
}

const provinces = paths.map((path) => {
  const id = path.feature.properties.id;
  const d = roundPath(path.d);
  return {
    id,
    ...NAMES[id],
    d,
    label: centroidFromPath(d)
  };
});

const cities = CITIES.map((city) => ({ name: city.name, ...project(city.lng, city.lat) }));

const file = `export const NEPAL_MAP_VIEWBOX = "${viewBox}";

export const NEPAL_PROVINCES = ${JSON.stringify(provinces, null, 2)} as const;

export const NEPAL_CITIES = ${JSON.stringify(cities, null, 2)} as const;
`;

writeFileSync(new URL("../src/constants/nepalMap.ts", import.meta.url), file);
console.log(
  provinces.map((p) => `${p.id} ${p.name} ${p.d.length}`).join("\n"),
  "\nviewBox",
  viewBox
);
