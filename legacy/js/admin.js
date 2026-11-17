/**
 * ADMIN MODE: overview, verification, users, disputes, fraud monitor, commission.
 */
// Plain <script> file: shares globals with the other js/ files (see index.html for load order).

// ---- Admin router: dashboard / verify / users / disputes / fraud / commission ----
function admin(v) {
  const rm = (a, i) => `S.${a}.splice(${i},1);render();toast('Done')`;
  if (v == "verify")
    return `<h1>${t("verify")} &amp; documents</h1><div class="card tw"><table><thead><tr><th>Transporter</th><th>Submitted</th><th></th></tr></thead><tbody>${S.doc.map((d, i) => `<tr><td>${d[0]}</td><td>${d[1]}</td><td><button class="btn g s" onclick="${rm("doc", i)}">Approve</button> <button class="btn d s" onclick="${rm("doc", i)}">Reject</button></td></tr>`).join("") || "<tr><td>Queue clear ✔</td></tr>"}</tbody></table></div><p class="integ">Production: OCR + Digilocker/VAHAN/Sarathi APIs for automatic verification.</p>`;
  if (v == "users")
    return `<h1>${t("users")}</h1><div class="card tw"><table><thead><tr><th>Name</th><th>Roles</th><th>Tier</th><th>Status</th></tr></thead><tbody>${[
      ["Amit Sharma", "Owner + Transporter", "Gold", "Active"],
      ["Sai Logistics", "Transporter", "Platinum", "Active"],
      ["Mehta Movers", "Transporter", "Silver", "Active"],
      ["Kumar Transport Co.", "Transporter", "Bronze", "Suspended"],
    ]
      .map(
        (u) =>
          `<tr><td>${u[0]}</td><td>${u[1]}</td><td>${u[2]}</td><td>${bd(u[3] == "Active" ? "g" : "r", u[3])}</td></tr>`,
      )
      .join("")}</tbody></table></div>`;
  if (v == "disp")
    return `<h1>${t("disp")}</h1><div class="card tw"><table><tbody>${S.disp.map((d, i) => `<tr><td>${d[0]}</td><td>${d[1]}</td><td>${d[2]}</td><td><button class="btn s" onclick="${rm("disp", i)}">Resolve</button></td></tr>`).join("") || "<tr><td>No open disputes ✔</td></tr>"}</tbody></table></div>`;
  if (v == "fraud")
    return `<h1>${t("fraud")}</h1><div class="card">${S.fr.map((f, i) => `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--line);gap:8px"><span>${bd(f[1] == "High" ? "r" : f[1] == "Medium" ? "a" : "n", f[1])} ${f[0]}</span><button class="btn o s" onclick="${rm("fr", i)}">Investigate</button></div>`).join("") || "No alerts"}</div>`;
  if (v == "comm")
    return `<h1>${t("comm")}</h1><div class="card"><p>Platform commission on awarded contracts</p><input type="range" min="1" max="12" value="${S.cm}" oninput="S.cm=+this.value;$('#cv').textContent=this.value+'%'"> <b id="cv">${S.cm}%</b><br><br><button class="btn g" onclick="toast('Commission set to '+S.cm+'%')">Save</button></div>`;
  return `<h1>${t("dash")}</h1><p class="sub">Platform overview</p><div class="grid k">${st("Verified transporters", "2,418", "+36 this week")}${st("Live auctions", 184)}${st("GMV (Nov)", "₹4.2 Cr", "+12%")}${st("Commission earned", "₹" + (((4.2 * S.cm) / 100) * 100).toFixed(1) + " L", S.cm + "% rate")}${st("Pending approvals", S.doc.length)}${st("Open disputes", S.disp.length)}</div><div class="grid two" style="margin-top:12px"><div class="card"><h3>Cargo monitoring – loads posted</h3>${bars([620, 710, 690, 820, 910, 1040], MO)}</div><div class="card"><h3>Integrations</h3><div class="integ" style="margin:0"><table><tbody><tr><td>Auth, MongoDB, REST, WebSockets</td><td>${bd("a", "Needs backend")}</td></tr><tr><td>GPS · Payments · FASTag · Doc verification</td><td>${bd("a", "External APIs")}</td></tr><tr><td>UI, bidding logic, charts, i18n</td><td>${bd("g", "Simulated here")}</td></tr></tbody></table></div></div></div>`;
}
