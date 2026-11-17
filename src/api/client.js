// Single data-access layer. Real calls hit the Express routes in backend/; demo mode swaps in api/demo.js.
import { demo } from './demo';
export const DEMO = import.meta.env.VITE_USE_DEMO !== 'false';
async function http(path, opts = {}) {
  const r = await fetch('/api' + path, { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (localStorage.getItem('token') || '') }, ...opts });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(body.error || body.todo || r.statusText);
  return body;
}
const pick = (real, fake) => (DEMO ? fake() : real());
export const api = {
  session: () => pick(() => http('/auth/me'), demo.session),
  stats: (m) => pick(() => http('/stats?mode=' + m), () => demo.stats(m)),
  series: (m) => pick(() => http('/stats/series?mode=' + m), () => demo.series(m)),
  notifications: (m) => pick(() => http('/notifications?mode=' + m), () => demo.notifications(m)),
  listings: () => pick(() => http('/cargo'), demo.listings),
  shipments: () => pick(() => http('/shipments'), demo.shipments),
  placeBid: (id, amount) => pick(() => http('/bids/' + id, { method: 'POST', body: JSON.stringify({ amount }) }), () => demo.placeBid(id, amount)), // existing route
  withdrawBid: (id) => pick(() => http('/bids/' + id, { method: 'DELETE' }), () => demo.withdrawBid(id)),                                         // existing route
  vehicles: () => pick(() => http('/vehicles'), demo.vehicles),
  fastag: () => pick(() => http('/fastag'), demo.fastag),
  recharge: (amount) => pick(() => http('/fastag/recharge', { method: 'POST', body: JSON.stringify({ amount }) }), () => demo.recharge(amount)),
};
