/**
 * LAYOUT: sidebar menus per role, top bar (mode toggle, language, notifications, profile), navigation handlers.
 */
// Plain <script> file: shares globals with the other js/ files (see index.html for load order).

// ---- Sidebar items for each role: [viewId, i18nKeyOrLabel, icon] ----
const NAV = {
  tr: [
    ["dash", "dash", "▦"],
    ["market", "market", "⇄"],
    ["compl", "compl", "✔"],
    ["fast", "fast", "⛽"],
    ["perf", "Performance", "↗"],
  ],
  co: [
    ["dash", "dash", "▦"],
    ["post", "post", "＋"],
    ["ships", "ships", "▤"],
    ["track", "track", "◎"],
    ["hist", "History", "⏱"],
  ],
  ad: [
    ["dash", "dash", "▦"],
    ["verify", "verify", "✔"],
    ["users", "users", "☰"],
    ["disp", "disp", "⚖"],
    ["fraud", "fraud", "⚠"],
    ["comm", "comm", "%"],
  ],
};

// ---- Draw sidebar + top bar (mode toggle, language menu, notifications, profile) ----
function chrome() {
  const nv = NAV[S.mode];
  $("#sb").className = (S.col ? "c " : "") + (S.m ? "m" : "");
  $("#sb").innerHTML =
    `<div class="brand"><i>S</i><span>SmartReverse</span></div><nav aria-label="Main">${nv.map(([id, k, ic]) => `<button class="${S.view == id ? "on" : ""}" onclick="go('${id}')"><span class="ic">${ic}</span><span class="lb">${T[k] ? t(k) : k}</span></button>`).join("")}</nav><div class="side-f lb">Prototype · simulated data</div>`;
  const n = S.ns[S.mode].filter((x) => x[1]).length;
  $("#hd").innerHTML =
    `<button class="ib" onclick="S.col=!S.col;S.m=!S.m;chrome()" aria-label="Toggle sidebar">☰</button><input id="q" placeholder="${t("srch")}" aria-label="Search" style="width:min(220px,40vw)">
<div class="sp"></div>${S.mode != "ad" ? `<div class="seg" role="group" aria-label="Mode"><button class="${S.mode == "co" ? "on" : ""}" onclick="sw('co')">${t("co")}</button><button class="${S.mode == "tr" ? "on" : ""}" onclick="sw('tr')">${t("tr")}</button></div>` : `<span class="badge b-a">Admin console</span>`}
<div class="rel"><button class="ib" onclick="mn('l')" aria-label="Language">🌐 ${LN[S.lang]}</button><div class="menu ${S.menu == "l" ? "o" : ""}">${LN.map((x, i) => `<button onclick="S.lang=${i};S.menu=null;render()">${x}${i < 2 ? "" : " <small>(nav &amp; key labels)</small>"}</button>`).join("")}</div></div>
<div class="rel"><button class="ib" onclick="mn('n')" aria-label="${t("notif")}">🔔${n ? `<span class="dot">${n}</span>` : ""}</button><div class="menu ${S.menu == "n" ? "o" : ""}"><div><b>${t("notif")}</b></div>${S.ns[S.mode].map((x, i) => `<button onclick="S.ns[S.mode][${i}][1]=0;render()">${x[1] ? "● " : ""}${x[0]}</button>`).join("")}</div></div>
<div class="rel"><button class="ib" onclick="mn('p')">👤 Amit Sharma ▾</button><div class="menu ${S.menu == "p" ? "o" : ""}"><div><b>Amit Sharma</b><br><small>Sharma Logistics · ${TIERS[MYT]} transporter · Dual role</small></div><button onclick="sw('co')">Switch to ${t("co")}</button><button onclick="sw('tr')">Switch to ${t("tr")}</button><button onclick="sw('ad')">Admin console (demo)</button><button onclick="th()">Toggle dark / light</button></div></div>`;
}

// ---- Open/close a top-bar dropdown ----
function mn(m) {
  S.menu = S.menu == m ? null : m;
  chrome();
}

// ---- Toggle dark/light theme ----
function th() {
  const r = document.documentElement;
  r.dataset.theme = r.dataset.theme == "dark" ? "light" : "dark";
  S.menu = null;
  render();
}

// ---- Switch role mode (owner/transporter/admin) instantly - no re-login ----
function sw(m) {
  S.mode = m;
  S.view = "dash";
  S.menu = null;
  S.m = false;
  render();
  toast(
    m == "ad"
      ? "Admin console opened"
      : "Switched to " +
          (m == "co" ? "Cargo Owner" : "Transporter") +
          " mode – no re-login needed",
  );
}

// ---- Navigate to a view inside the current mode ----
function go(v) {
  S.view = v;
  S.m = false;
  render();
}

// ---- Close any open dropdown when clicking outside ----
document.addEventListener("click", (e) => {
  if (!e.target.closest(".rel") && S.menu) {
    S.menu = null;
    chrome();
  }
});
