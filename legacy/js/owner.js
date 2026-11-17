/**
 * CARGO OWNER MODE: dashboard, post shipment, my shipments + bid comparison, live tracking, history + ratings.
 */
// Plain <script> file: shares globals with the other js/ files (see index.html for load order).

// ---- Cargo owner dashboard ----
function cDash() {
  return `<h1>${t("greet")}</h1><p class="sub">${t("co")} · ${t("dash")}</p><div class="grid k">${st("Active shipments", S.sh.length)}${st(
    "Incoming bids",
    S.sh.reduce((a, s) => a + s.bids.length, 0),
    "+3 today",
  )}${st("Best bid so far", inr(Math.min(...S.sh[0].bids.map((b) => b[4]))), "−₹2,300 vs. suggested")}${st("Delivered (FY)", 34)}</div>
<div class="grid two" style="margin-top:12px"><div class="card"><h3>Freight spend (₹ thousand)</h3>${bars([310, 280, 420, 390, 360, 445], MO)}</div><div class="card"><h3>Savings vs. suggested price (%)</h3>${line([4, 5, 6, 5, 7, 8], MO)}</div></div>`;
}

// ---- Post-shipment form ----
function post() {
  return `<h1>${t("post")}</h1><p class="sub">Transporters will bid; the lowest eligible bid wins.</p><div class="card"><div class="fl"><input id="pf" placeholder="Pickup city"><input id="pt" placeholder="Delivery city"><input id="pw" type="number" placeholder="Weight (T)"><select id="pc"><option>FMCG</option><option>Machinery</option><option>Textiles</option><option>Auto parts</option><option>Electronics</option></select><select id="pv"><option>14 ft Tata 407</option><option>20 ft Container</option><option>32 ft MXL</option><option>40 ft Trailer</option></select><input id="pd" type="date" value="2026-11-24" aria-label="Deadline"></div><button class="btn g" onclick="newS()">Post shipment</button></div>`;
}

// ---- Validate + add a new shipment (auction opens) ----
function newS() {
  const f = $("#pf").value.trim(),
    to = $("#pt").value.trim();
  if (!f || !to || !+$("#pw").value)
    return toast("Fill pickup, delivery and weight");
  S.sh.unshift({
    id: "SH-" + (1044 + S.sh.length),
    f,
    t: to,
    w: $("#pw").value + " T",
    cat: $("#pc").value,
    veh: $("#pv").value,
    st: "Open",
    pr: 0,
    bids: [],
  });
  S.view = "ships";
  render();
  toast("Shipment posted – auction live");
}

// ---- Shipments with bid comparison table (sorted price -> rating -> on-time) ----
function ships() {
  return `<h1>${t("ships")}</h1><p class="sub">Bid comparison sorted by price, then rating/on-time performance for ties.</p>${S.sh
    .map((s, si) => {
      const b = [...s.bids].sort(
        (x, y) => x[4] - y[4] || y[1] - x[1] || y[3] - x[3],
      );
      return `<div class="card" style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:6px"><b>${s.id} · ${s.f} → ${s.t}</b><span>${bd(s.st == "Open" ? "a" : "g", s.st)} ${s.w} · ${s.cat}</span></div>${b.length ? `<div class="tw"><table><thead><tr><th>Transporter</th><th>Rating</th><th>Tier</th><th>On-time</th><th>Bid</th><th></th></tr></thead><tbody>${b.map((x, i) => `<tr><td>${i == 0 ? "🏆 " : ""}${x[0]}</td><td>${x[1]} ★</td><td>${bd("n", x[2])}</td><td>${x[3]}%</td><td><b>${inr(x[4])}</b></td><td>${s.st == "Open" ? `<button class="btn g s" onclick="award(${si},'${x[0].replace(/'/g, "")}')">Award</button>` : ""}</td></tr>`).join("")}</tbody></table></div>` : '<p class="sub">No bids yet.</p>'}</div>`;
    })
    .join("")}`;
}

// ---- Award the contract to a transporter ----
function award(i, n) {
  S.sh[i].st = "Awarded";
  render();
  toast("Awarded to " + n + ". Tracking starts at pickup.");
}

// ---- Live tracking map (simulated GPS; needs telematics API) ----
function track() {
  return `<h1>${t("track")}</h1><p class="sub">SH-1042 · Mumbai → Delhi · <span class="sim">Simulated GPS · integrate a telematics/GPS provider</span></p><div class="grid two"><div class="card"><svg viewBox="0 0 300 220" width="100%" role="img" aria-label="Map"><rect width="300" height="220" rx="8" fill="var(--bg)"/><path d="M60 180 C90 150 90 110 140 100 S200 60 235 30" fill="none" stroke="var(--line)" stroke-width="5" stroke-linecap="round"/><path id="rt" d="M60 180 C90 150 90 110 140 100 S200 60 235 30" fill="none" stroke="var(--g)" stroke-width="3" stroke-dasharray="4 4"/><circle cx="60" cy="180" r="6" fill="var(--navy2)"/><circle cx="235" cy="30" r="6" fill="var(--r)"/><text x="68" y="196" font-size="10" fill="var(--ink)">Mumbai</text><text x="190" y="24" font-size="10" fill="var(--ink)">Delhi</text><circle id="tk" r="8" fill="var(--g)" stroke="#fff" stroke-width="2"/></svg></div><div class="card"><h3>Shipment status</h3><div class="st"><div class="l">Progress</div><div class="v" id="pp">${S.sh[0].pr}%</div></div><p>Vehicle MH12 AB 4410 · Driver Rakesh Yadav<br>Speed 62 km/h · ETA 18 Nov, 21:30</p><button class="btn g s" onclick="toast('Rating form: 1–5 ★ available after delivery')">Rate delivery</button></div></div>`;
}

// ---- History + 1-5 star rating ----
function hist() {
  return `<h1>Shipment history</h1><div class="card tw"><table><thead><tr><th>ID</th><th>Route</th><th>Status</th><th>Rating</th></tr></thead><tbody>${S.hist.map((h, i) => `<tr><td>${h[0]}</td><td>${h[1]}</td><td>${bd("g", h[2])}</td><td>${h[3] ? "★".repeat(h[3]) + "☆".repeat(5 - h[3]) : [1, 2, 3, 4, 5].map((n) => `<button class="ib" onclick="S.hist[${i}][3]=${n};render();toast('Thanks for rating')">${n}★</button>`).join("")}</td></tr>`).join("")}</tbody></table></div>`;
}
