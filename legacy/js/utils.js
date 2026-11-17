/**
 * SHARED HELPERS: DOM shortcut, currency format, badges, stat cards, toasts, date-status, tiers, SVG charts.
 */
// Plain <script> file: shares globals with the other js/ files (see index.html for load order).

// ---- Shortcut for document.querySelector ----
const $ = (q) => document.querySelector(q);

// ---- Format a number as Indian rupees (en-IN grouping) ----
const inr = (n) => "₹" + n.toLocaleString("en-IN");

// ---- Show a temporary notification at bottom-right ----
function toast(m) {
  const d = document.createElement("div");
  d.textContent = m;
  $("#toast").append(d);
  setTimeout(() => d.remove(), 3600);
}

// ---- Document status from expiry date -> [label, colour, days left] (Valid / Expiring Soon / Expired) ----
function ds(s) {
  const d = Math.round((new Date(s) - new Date("2026-11-17")) / 864e5);
  return d < 0
    ? ["Expired", "r", d]
    : d <= 30
      ? ["Expiring Soon", "a", d]
      : ["Valid", "g", d];
}

// ---- Render a coloured status badge ----
const bd = (c, x) => `<span class="badge b-${c}">${x}</span>`;

// ---- Map verified deliveries to tier index (0-3) ----
function tier(n) {
  return n >= 50 ? 3 : n >= 20 ? 2 : n >= 10 ? 1 : 0;
}

// ---- SVG bar chart (data array, label array) ----
function bars(d, lab, c = "var(--navy2)") {
  const m = Math.max(...d),
    w = 300 / d.length;
  return `<svg viewBox="0 0 300 130" width="100%" role="img" aria-label="Bar chart">${d
    .map((v, i) => {
      const h = (v / m) * 95;
      return `<rect x="${i * w + 4}" y="${105 - h}" width="${w - 8}" height="${h}" rx="3" fill="${c}"><title>${lab[i]}: ${v}</title></rect><text x="${i * w + w / 2}" y="122" font-size="9" text-anchor="middle" fill="var(--mut)">${lab[i]}</text>`;
    })
    .join("")}</svg>`;
}

// ---- SVG line chart (data array, label array) ----
function line(d, lab, c = "var(--g)") {
  const m = Math.max(...d),
    mn = Math.min(...d) * 0.9,
    w = 300 / (d.length - 1),
    p = d.map((v, i) => [i * w, 100 - ((v - mn) / (m - mn)) * 85]);
  return `<svg viewBox="-6 0 312 130" width="100%" role="img" aria-label="Line chart"><polyline fill="none" stroke="${c}" stroke-width="2.5" points="${p.map((x) => x.join(",")).join(" ")}"/>${p.map((x, i) => `<circle cx="${x[0]}" cy="${x[1]}" r="3.5" fill="${c}"><title>${lab[i]}: ${d[i]}</title></circle><text x="${x[0]}" y="122" font-size="9" text-anchor="middle" fill="var(--mut)">${lab[i]}</text>`).join("")}</svg>`;
}

// ---- Month labels used by the charts ----
const MO = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

// ---- Render a KPI/stat card ----
const st = (l, v, d) =>
  `<div class="card st"><div class="l">${l}</div><div class="v">${v}</div><div class="d">${d || ""}</div></div>`;

// ---- Format seconds as HH:MM:SS for auction countdowns ----
function mmss(s) {
  return (
    String(Math.floor(s / 3600)).padStart(2, "0") +
    ":" +
    String(Math.floor((s % 3600) / 60)).padStart(2, "0") +
    ":" +
    String(s % 60).padStart(2, "0")
  );
}
