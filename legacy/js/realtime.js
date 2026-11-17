/**
 * REAL-TIME SIMULATION: auction countdowns, competitor bids, truck movement. Replace with WebSocket events in production.
 */
// Plain <script> file: shares globals with the other js/ files (see index.html for load order).

// ---- Count down every auction listing each second ----
setInterval(() => {
  S.ls.forEach((l) => {
    if (l.s > 0) l.s--;
    const e = document.querySelector(`[data-s="${l.id}"]`);
    if (e) e.textContent = "⏱ " + mmss(l.s);
  });
}, 1000);

// ---- Simulate a competitor undercutting a listing every 9 seconds (WebSocket in production) ----
setInterval(() => {
  if (S.mode != "tr" || S.view != "market") return;
  const l = S.ls.filter((x) => x.tier <= MYT)[
    Math.floor(Math.random() * 5) % S.ls.filter((x) => x.tier <= MYT).length
  ];
  const cur = lowOf(l),
    nw = cur - Math.round((l.sg * 0.004) / 100) * 100 - 100;
  l.lo = Math.min(l.lo, nw);
  if (S.mine[l.id] != null && S.mine[l.id] > l.lo)
    toast("Outbid on " + l.f.split(",")[0] + " → " + l.t.split(",")[0]);
  else
    toast("New lower bid on " + l.f.split(",")[0] + " → " + l.t.split(",")[0]);
  const a = document.activeElement;
  if (a && a.tagName == "INPUT" && a.type == "number") {
    const c = $("#c" + l.id);
    if (c && !c.contains(a)) {
      const nc = document.createElement("div");
      nc.innerHTML = card(l);
      c.replaceWith(nc.firstChild);
    }
  } else render();
}, 9000);

// ---- Truck position along the route (0..1) ----
let pgs = 0;
setInterval(() => {
  const p = document.getElementById("rt"),
    k = document.getElementById("tk");
  if (!p || !k) return;
  pgs = (pgs + 0.004) % 1;
  const pt = p.getPointAtLength(p.getTotalLength() * (0.62 + pgs * 0.05));
  k.setAttribute("cx", pt.x);
  k.setAttribute("cy", pt.y);
}, 60);
