// DEMO ADAPTER – only used when VITE_USE_DEMO=true. The UI shows a "Demo data" banner whenever this is active.
// Shapes match the REST contract so swapping to real endpoints needs no UI change.
const wait = (v, ms = 450) => new Promise((r) => setTimeout(() => r(structuredClone(v)), ms));
const day = (n) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);
const me = { id: 'u1', name: 'Amit Sharma', company: 'Sharma Logistics', roles: ['shipper', 'transporter'], completedDeliveries: 24, rating: 4.6, onTime: 93, cancel: 2.1, score: 91 };
const listings = [
  { id: 'L1', from: 'Mumbai, MH', to: 'Delhi, DL', weight: 18, vehicle: '32 ft MXL', km: 1420, suggested: 98000, lowest: 96200, bidders: 7, endsIn: 5400, category: 'FMCG', minTier: 1 },
  { id: 'L2', from: 'Pune, MH', to: 'Nagpur, MH', weight: 12, vehicle: '20 ft Container', km: 710, suggested: 46500, lowest: 44900, bidders: 4, endsIn: 3100, category: 'Machinery', minTier: 2 },
  { id: 'L3', from: 'Ahmedabad, GJ', to: 'Jaipur, RJ', weight: 9, vehicle: '14 ft Tata 407', km: 660, suggested: 28000, lowest: 27300, bidders: 5, endsIn: 1700, category: 'Textiles', minTier: 0 },
  { id: 'L4', from: 'Kolkata, WB', to: 'Guwahati, AS', weight: 35, vehicle: 'Multi-axle', km: 1030, suggested: 128000, lowest: 124000, bidders: 2, endsIn: 9100, category: 'Electronics', minTier: 3 },
];
let fastag = { tag: 'MH12 AB 4410', balance: 1840, threshold: 500, tx: [{ id: 1, date: '16 Nov', desc: 'Toll – Kherki Daula', amount: -165, status: 'Success' }, { id: 2, date: '12 Nov', desc: 'Recharge (UPI)', amount: 3000, status: 'Success' }] };
export const demo = {
  session: () => wait(me, 250),
  stats: (mode) => wait(mode === 'transporter'
    ? [{ k: 'Completed deliveries', v: 24 }, { k: 'Avg. rating', v: 4.6, fmt: 'star' }, { k: 'On-time', v: 93, fmt: 'pct' }, { k: 'Cancellation rate', v: 2.1, fmt: 'pct1' }, { k: 'Active bids', v: 3 }, { k: 'Won contracts', v: 9 }]
    : [{ k: 'Active shipments', v: 2 }, { k: 'Incoming bids', v: 6 }, { k: 'Delivered (FY)', v: 34 }, { k: 'Avg. saving vs suggested', v: 6, fmt: 'pct' }]),
  series: (mode) => wait({ labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'], title: mode === 'transporter' ? 'Monthly earnings (₹ thousand)' : 'Freight spend (₹ thousand)', data: mode === 'transporter' ? [180, 240, 210, 320, 290, 410] : [310, 280, 420, 390, 360, 445] }),
  notifications: (mode) => wait(mode === 'transporter' ? [{ id: 1, text: 'FASTag balance is approaching your alert threshold', unread: true }, { id: 2, text: 'Pollution certificate for DL1L AC 9034 expires soon', unread: true }] : [{ id: 3, text: 'New bids on Mumbai → Delhi', unread: true }], 200),
  listings: () => wait(listings),
  shipments: () => wait([{ id: 'SH-1042', from: 'Mumbai', to: 'Delhi', status: 'In transit', progress: 62, bids: [{ name: 'Shree Ram Roadlines', rating: 4.6, tier: 'Gold', onTime: 93, cancel: 2, score: 90, amount: 98500 }, { name: 'Patel Express Cargo', rating: 4.4, tier: 'Silver', onTime: 88, cancel: 3, score: 84, amount: 96200 }, { name: 'Sai Logistics', rating: 4.7, tier: 'Platinum', onTime: 95, cancel: 1, score: 95, amount: 96200 }] }, { id: 'SH-1043', from: 'Surat', to: 'Jaipur', status: 'Open', progress: 0, bids: [] }]),
  placeBid: (id, amount) => wait({ ok: true, id, amount }, 300),
  withdrawBid: (id) => wait({ ok: true, id }, 300),
  vehicles: () => wait([{ id: 1, reg: 'MH12 AB 4410', type: '32 ft MXL', docs: { RC: day(400), Insurance: day(12), PUC: day(-3), Permit: day(220) } }, { id: 2, reg: 'UP16 CT 7782', type: '20 ft Container', docs: { RC: day(600), Insurance: day(250), PUC: day(60), Permit: day(120) } }]),
  fastag: () => wait(fastag),
  recharge: (amount) => { fastag = { ...fastag, balance: fastag.balance + amount, tx: [{ id: Date.now(), date: 'Today', desc: 'Recharge (UPI)', amount, status: 'Success' }, ...fastag.tx] }; return wait({ ok: true, balance: fastag.balance }, 1200); },
};
