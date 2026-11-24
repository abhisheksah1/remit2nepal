const fs = require("node:fs");
const path = require("node:path");

const src = path.join(process.env.TEMP, "countries-110m.json");
const dest = path.join(__dirname, "..", "public", "images", "globe-countries.svg");
const topology = JSON.parse(fs.readFileSync(src, "utf8"));
const { scale, translate } = topology.transform;
const W = 1000;
const H = 500;

function decodeArc(index) {
  const reverse = index < 0;
  const arc = topology.arcs[reverse ? ~index : index];
  let x = 0;
  let y = 0;
  const points = arc.map(([dx, dy]) => {
    x += dx;
    y += dy;
    return [x * scale[0] + translate[0], y * scale[1] + translate[1]];
  });
  return reverse ? points.reverse() : points;
}

function project([lon, lat]) {
  const x = ((lon + 180) / 360) * W;
  const y = ((90 - lat) / 180) * H;
  return [Math.round(x * 10) / 10, Math.round(y * 10) / 10];
}

function ringToD(indexes) {
  const pts = indexes.flatMap(decodeArc).map(project);
  if (pts.length < 3) return "";
  const simplified = [];
  for (const pt of pts) {
    const prev = simplified[simplified.length - 1];
    if (!prev || Math.abs(prev[0] - pt[0]) + Math.abs(prev[1] - pt[1]) > 0.8) simplified.push(pt);
  }
  if (simplified.length < 3) return "";
  return `M${simplified.map((p) => p.join(" ")).join("L")}Z`;
}

function geometryToD(geometry) {
  if (geometry.type === "Polygon") return geometry.arcs.map(ringToD).filter(Boolean).join("");
  if (geometry.type === "MultiPolygon") {
    return geometry.arcs
      .map((poly) => poly.map(ringToD).filter(Boolean).join(""))
      .filter(Boolean)
      .join("");
  }
  return "";
}

const paths = topology.objects.countries.geometries
  .map((geometry) => {
    const d = geometryToD(geometry);
    if (!d) return "";
    const name = String(geometry.properties?.name || "").replace(/"/g, "");
    const id = String(geometry.id || "");
    const nepal = name === "Nepal" || id === "524";
    return `<path data-id="${id}" data-name="${name}" class="${nepal ? "is-nepal" : ""}" d="${d}"/>`;
  })
  .filter(Boolean)
  .join("");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><style>path{fill:#d5e4c2;stroke:#6d825c;stroke-width:.35}path.is-nepal{fill:#e31e24;stroke:#fff;stroke-width:.9}</style>${paths}</svg>\n`;
fs.writeFileSync(dest, svg);
console.log(`Wrote ${dest} (${svg.length} bytes, ${topology.objects.countries.geometries.length} countries)`);
