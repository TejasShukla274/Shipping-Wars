// Business rules ported 1:1 from legacy/js (and mirrored in backend/services).
export const TIERS = ['Bronze', 'Silver', 'Gold', 'Platinum'];
export const tierOf = (n) => (n >= 50 ? 3 : n >= 20 ? 2 : n >= 10 ? 1 : 0);
export const inr = (n) => '₹' + Number(n).toLocaleString('en-IN');
// Document status relative to TODAY (not a hard-coded date)
export const docStatus = (iso) => {
  const days = Math.round((new Date(iso) - new Date()) / 864e5);
  return days < 0 ? { label: 'Expired', tone: 'err', days } : days <= 30 ? { label: 'Expiring soon', tone: 'warn', days } : { label: 'Valid', tone: 'ok', days };
};
// Reverse auction: lowest amount wins; ties -> rating, on-time %, lower cancellations, score
export const rank = (a, b) => a.amount - b.amount || b.rating - a.rating || b.onTime - a.onTime || a.cancel - b.cancel || b.score - a.score;
export const fmtClock = (s) => [s / 3600, (s % 3600) / 60, s % 60].map((x) => String(Math.floor(x)).padStart(2, '0')).join(':');
