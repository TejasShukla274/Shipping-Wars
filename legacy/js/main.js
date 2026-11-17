/**
 * ENTRY POINT: view router (mode+view -> page HTML), render(), and app start. Loaded last.
 */
// Plain <script> file: shares globals with the other js/ files (see index.html for load order).

// ---- Pick the page for current mode + view ----
function view() {
  const m = S.mode,
    v = S.view;
  if (m == "tr") {
    if (v == "dash") return tDash();
    if (v == "market") return market();
    if (v == "compl") return compl();
    if (v == "fast") return fast();
    return perf();
  }
  if (m == "co") {
    if (v == "dash") return cDash();
    if (v == "post") return post();
    if (v == "ships") return ships();
    if (v == "track") return track();
    return hist();
  }
  return admin(v);
}

// ---- Redraw sidebar, top bar and page content ----
function render() {
  chrome();
  $("#pg").innerHTML =
    view() +
    (S.view == "dash" && S.mode != "ad"
      ? `<p class="integ">Prototype uses simulated data. Backend plan: Express REST + WebSocket <code>bid:update</code> events, MongoDB, JWT auth, payment gateway, FASTag issuer API, GPS/telematics, DigiLocker/VAHAN.</p>`
      : "");
}

// ---- Start the app ----
render();
