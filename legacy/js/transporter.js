/**
 * TRANSPORTER MODE: dashboard, tier page, marketplace + bidding, compliance (vehicles), FASTag utility + recharge.
 */
// Plain <script> file: shares globals with the other js/ files (see index.html for load order).

// ---- Tie-break logic: lower bid wins; if equal, better rating/on-time/cancellation/score wins (mock: mine 91 vs rival 82) ----
function lead(l) {
  const my = S.mine[l.id];
  if (my == null) return null;
  return my < l.lo || (my == l.lo && 91 >= 82);
}

// ---- Current lowest bid = min(competitor lowest, my bid) ----
function lowOf(l) {
  const my = S.mine[l.id];
  return my != null && my < l.lo ? my : l.lo;
}

// ---- Mock performance score of the logged-in transporter ----
const mySc = 91;

// ---- Transporter dashboard: KPIs + charts ----
function tDash() {
  const act = Object.keys(S.mine).length;
  return `<h1>${t("greet")}</h1><p class="sub">${t("tr")} · ${t("dash")} · <span class="badge b-a">${TIERS[MYT]}</span> ${MYDEL} verified deliveries</p>
<div class="grid k">${st("Completed deliveries", MYDEL, "+4 this month")}${st("Avg. rating", "4.6 ★", "Top 12%")}${st("On-time delivery", "93%", "+2 pts")}${st("Cancellation rate", "2.1%", "Low")}${st("Active bids", act, "")}${st("Won contracts", 9, "")}${st("Open opportunities", S.ls.filter((l) => l.tier <= MYT).length, "in your tier")}${st("Total earnings", "₹14.8 L", "FY 26-27")}</div>
<div class="grid two" style="margin-top:12px"><div class="card"><h3>Monthly deliveries</h3>${bars([3, 4, 2, 5, 4, 6], MO)}</div><div class="card"><h3>Earnings (₹ thousand)</h3>${line([180, 240, 210, 320, 290, 410], MO)}</div><div class="card"><h3>Bid success rate (%)</h3>${line([28, 31, 35, 33, 41, 46], MO, "var(--navy2)")}</div><div class="card"><h3>Performance score</h3><div class="st"><div class="v">${mySc}/100</div></div><p class="sub">Used as tie-breaker when bids are equal: rating → on-time % → cancellation rate → score.</p>${[
    ["Rating", 92],
    ["On-time", 93],
    ["Reliability", 98],
  ]
    .map(
      (x) =>
        `<div style="margin:6px 0">${x[0]}<div style="background:var(--bg);border-radius:6px;height:8px"><div style="width:${x[1]}%;background:var(--g);height:8px;border-radius:6px"></div></div></div>`,
    )
    .join("")}</div></div>`;
}

// ---- Tier & performance page ----
function perf() {
  return `<h1>Performance &amp; Tier</h1><p class="sub">Tier is based on verified completed deliveries.</p><div class="grid k">${[
    ["Bronze", "0–9"],
    ["Silver", "10–19"],
    ["Gold", "20–49"],
    ["Platinum", "50+"],
  ]
    .map(
      (x, i) =>
        `<div class="card st" style="${i == MYT ? "border-color:var(--g)" : ""}"><div class="l">${x[1]} deliveries</div><div class="v">${x[0]}</div>${i == MYT ? bd("g", "Your tier") : i < MYT ? bd("n", "Unlocked") : bd("a", "Locked")}<p class="l">${["Local & small loads", "Mid-size FMCG, textiles", "Machinery, auto parts, 20T+", "High-value, 30T+ & hazmat"][i]}</p></div>`,
    )
    .join(
      "",
    )}</div><div class="card" style="margin-top:12px"><h3>Next tier</h3>26 more verified deliveries to reach Platinum.<div style="background:var(--bg);border-radius:6px;height:10px;margin-top:8px"><div style="width:${(MYDEL / 50) * 100}%;background:var(--g);height:10px;border-radius:6px"></div></div></div>`;
}

// ---- Marketplace: filters + listing cards ----
function market() {
  const f = S.f || {};
  const cats = [...new Set(S.ls.map((l) => l.cat))];
  const rows = S.ls.filter(
    (l) =>
      (!f.c || l.cat == f.c) &&
      (!f.q || (l.f + l.t).toLowerCase().includes(f.q.toLowerCase())) &&
      (!f.v || l.veh == f.v),
  );
  return `<h1>${t("market")}</h1><p class="sub">Reverse auction – the lowest bid wins. Listings matched to your location (Greater Noida), vehicles and ${TIERS[MYT]} tier.</p>
<div class="fl"><input placeholder="City…" value="${f.q || ""}" oninput="S.f={...S.f,q:this.value};mk(this)"><select onchange="S.f={...S.f,c:this.value};render()"><option value="">All categories</option>${cats.map((c) => `<option ${f.c == c ? "selected" : ""}>${c}</option>`).join("")}</select><select onchange="S.f={...S.f,v:this.value};render()"><option value="">All vehicles</option>${[...new Set(S.ls.map((l) => l.veh))].map((c) => `<option ${f.v == c ? "selected" : ""}>${c}</option>`).join("")}</select></div>
<div class="lst">${rows.map(card).join("") || "<p>No listings match.</p>"}</div>`;
}

// ---- Debounce helper so typing in the city filter stays smooth ----
let tmr;
function mk(el) {
  clearTimeout(tmr);
  tmr = setTimeout(() => {
    const p = el.selectionStart;
    render();
    const i = $("#pg input");
    i.focus();
    i.setSelectionRange(p, p);
  }, 250);
}

// ---- One auction listing card (details, lowest bid, place/modify/withdraw) ----
function card(l) {
  const locked = l.tier > MYT,
    my = S.mine[l.id],
    ld = lead(l);
  return `<div class="card ${locked ? "lock" : ""}" id="c${l.id}"><div style="display:flex;justify-content:space-between"><span>${bd("n", l.cat)} ${bd(locked ? "a" : "g", TIERS[l.tier] + "+")}</span><span class="cd" data-s="${l.id}">⏱ ${mmss(l.s)}</span></div>
<div class="route" style="margin-top:8px">${l.f} → ${l.t}</div><div class="kv"><span>Weight<b>${l.w} T</b></span><span>Vehicle<b>${l.veh}</b></span><span>Distance<b>${l.d} km</b></span><span>Route<b>NH48 / expressway</b></span><span>Suggested price<b>${inr(l.sg)}</b></span><span>Bidders<b>${l.n}</b></span></div>
<div class="low"><span>${t("low")}</span><b>${inr(lowOf(l))}</b></div>
${locked ? `<p class="l">🔒 Requires ${TIERS[l.tier]} tier</p>` : `${my != null ? `<p>${ld ? bd("g", "You lead" + (my == l.lo ? " (tie won on rating/score)" : "")) : bd("r", "Outbid")} Your bid: <b>${inr(my)}</b></p>` : ""}<div class="fl" style="margin:0"><input type="number" id="i${l.id}" placeholder="Your bid ₹" value="${my || ""}" style="width:130px" aria-label="Bid amount"><button class="btn g s" onclick="bid('${l.id}')">${my != null ? "Modify" : t("bid")}</button>${my != null ? `<button class="btn o s" onclick="wd('${l.id}')">${t("wd")}</button>` : ""}</div>`}</div>`;
}

// ---- Place or modify a bid (validates against 130% of suggested price) ----
function bid(id) {
  const l = S.ls.find((x) => x.id == id),
    v = +$("#i" + id).value;
  if (!v || v < 1000) return toast("Enter a valid bid amount");
  if (v > l.sg * 1.3) return toast("Bid exceeds 130% of suggested price");
  const nw = S.mine[id] == null;
  S.mine[id] = v;
  if (nw) l.n++;
  render();
  toast(
    v < l.lo
      ? "You are now the lowest bidder!"
      : v == l.lo
        ? "Tie with lowest bid – you win on rating & performance score"
        : "Bid placed. Lower it to take the lead.",
  );
}

// ---- Withdraw bid before auction closes ----
function wd(id) {
  const l = S.ls.find((x) => x.id == id);
  delete S.mine[id];
  l.n--;
  render();
  toast("Bid withdrawn");
}

// ---- Compliance table: RC, insurance, PUC, permit, driver licence with expiry status ----
function compl() {
  const f = S.cf ? "" : "";
  return `<h1>${t("compl")}</h1><p class="sub">Register vehicles and track document validity. Reminders at 30 and 7 days before expiry. <span class="sim">Simulated · VAHAN/Parivahan &amp; insurer APIs needed for live verification</span></p>
<div class="fl"><input id="nv" placeholder="Reg. no. e.g. HR55 AB 1234"><select id="nt"><option>14 ft Tata 407</option><option>20 ft Container</option><option>32 ft MXL</option><option>40 ft Trailer</option></select><button class="btn g" onclick="addV()">+ Register vehicle</button></div>
<div class="card tw"><table><thead><tr><th>Vehicle</th><th>Type</th><th>RC</th><th>Insurance</th><th>Pollution (PUC)</th><th>Permit</th><th>Driver / licence</th><th></th></tr></thead><tbody>${S.veh
    .map(
      (v, i) =>
        `<tr><td><b>${v[0]}</b></td><td>${v[1]}</td>${[2, 3, 4, 5]
          .map((k) => {
            const s = ds(v[k]);
            return `<td>${bd(s[1], s[0])}<br><small>${v[k]} (${s[2]}d)</small></td>`;
          })
          .join(
            "",
          )}<td>${v[6]}</td><td><button class="btn o s" onclick="rem(${i})">Renew</button></td></tr>`,
    )
    .join("")}</tbody></table></div>`;
}

// ---- Register a new vehicle ----
function addV() {
  const n = $("#nv").value.trim();
  if (!n) return toast("Enter registration number");
  S.veh.push([
    n.toUpperCase(),
    $("#nt").value,
    "2030-01-01",
    "2027-10-01",
    "2027-05-01",
    "2028-01-01",
    "Unassigned · add driver",
  ]);
  render();
  toast("Vehicle registered – upload documents for verification");
}

// ---- Mark a renewal done (simulated) ----
function rem(i) {
  const v = S.veh[i];
  v[3] = "2027-11-17";
  v[4] = "2027-11-17";
  toast("Renewal reminder acknowledged & expiry dates refreshed (simulated)");
  render();
}

// ---- FASTag dashboard: balance card, alerts, transactions (mock; needs FASTag issuer API) ----
function fast() {
  return `<h1>FASTag</h1><p class="sub">Linked tag: <b>MH12 AB 4410</b> · <span class="sim">Simulated · connect an NPCI-authorised FASTag issuer &amp; payment gateway</span></p>${S.fb < 500 ? `<div class="alert">⚠ Low balance – recharge to avoid toll plaza penalties.</div>` : ""}
<div class="grid two"><div class="card fbal"><div class="l">${t("bal")}</div><div class="v">${inr(S.fb)}</div><p>Alert threshold: ₹500</p><button class="btn g" onclick="openR()">${t("rech")}</button></div>
<div class="card"><h3>Alerts</h3><label><input type="checkbox" checked> Low-balance alert at ₹500</label><br><label><input type="checkbox" checked> Toll deduction SMS</label><br><label><input type="checkbox"> Auto-recharge ₹2,000</label></div></div>
<div class="card tw" style="margin-top:12px"><h3>Recent transactions</h3><table><thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Status</th></tr></thead><tbody>${S.tx.map((x) => `<tr><td>${x[0]}</td><td>${x[1]}</td><td style="color:${x[2] > 0 ? "var(--g)" : "var(--ink)"}">${x[2] > 0 ? "+" : "−"}${inr(Math.abs(x[2]))}</td><td>${bd(x[3] == "Success" ? "g" : x[3] == "Failed" ? "r" : "a", x[3])}</td></tr>`).join("")}</tbody></table></div>`;
}

// ---- Open recharge modal (amount selection + payment method) ----
function openR() {
  S.amt = 1000;
  const d = document.createElement("div");
  d.className = "mod";
  d.id = "rm";
  d.innerHTML = `<div class="card" role="dialog" aria-label="Recharge"><h3>${t("rech")} FASTag</h3><div class="amts">${[500, 1000, 2000, 5000].map((a) => `<button onclick="pa(${a},this)" class="${a == 1000 ? "on" : ""}">₹${a}</button>`).join("")}</div><select id="pm" style="width:100%"><option>UPI</option><option>Net banking</option><option>Debit card</option></select><div id="rs" style="margin:12px 0" class="l">Confirm payment of <b id="ra">₹1,000</b></div><div class="fl"><button class="btn g" id="rb" onclick="pay()">Confirm &amp; pay</button><button class="btn o" onclick="this.closest('.mod').remove()">Cancel</button></div></div>`;
  document.body.append(d);
}

// ---- Select recharge amount ----
function pa(a, b) {
  S.amt = a;
  document
    .querySelectorAll(".amts button")
    .forEach((x) => x.classList.remove("on"));
  b.classList.add("on");
  $("#ra").textContent = inr(a);
}

// ---- Confirm payment (simulated 1.4s processing; needs payment gateway) ----
function pay() {
  $("#rb").disabled = true;
  $("#rs").innerHTML = "⏳ Processing payment…";
  setTimeout(() => {
    S.fb += S.amt;
    S.tx.unshift([
      "17 Nov",
      "Recharge (" + $("#pm").value + ")",
      S.amt,
      "Success",
    ]);
    $("#rm").remove();
    render();
    toast("Recharge of " + inr(S.amt) + " successful");
  }, 1400);
}
