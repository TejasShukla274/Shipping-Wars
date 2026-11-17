// Load board: filter, place / modify / withdraw bids, tier locks, live countdowns.
import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Lock, Timer, Trophy } from 'lucide-react';
import { api, DEMO } from '../api/client';
import { useResource } from '../hooks/useResource';
import { State, Badge, useToast } from '../components/ui';
import { TIERS, tierOf, inr, fmtClock } from '../lib/logic';

function Listing({ l, user, mine, onBid, onWithdraw, i }) {
  const [amt, setAmt] = useState(mine ?? '');
  const [busy, setBusy] = useState(false);
  const [left, setLeft] = useState(l.endsIn);
  useEffect(() => { const t = setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000); return () => clearInterval(t); }, []);
  const locked = l.minTier > tierOf(user.completedDeliveries), closed = left === 0;
  const lowest = mine != null && mine < l.lowest ? mine : l.lowest;
  // equal to the current lowest -> tie-break uses the bidder's rating/on-time/cancel/score (server decides; UI shows hint)
  const leading = mine != null && mine <= l.lowest;
  const submit = async () => { setBusy(true); await onBid(l, +amt); setBusy(false); };
  return <motion.article className="card" style={locked ? { opacity: 0.65 } : undefined} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -2 }} layout>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span><Badge>{l.category}</Badge> <Badge tone={locked ? 'warn' : 'blue'}>{TIERS[l.minTier]}+</Badge></span><span className="num" style={{ fontWeight: 600, color: closed ? 'var(--err)' : 'var(--orange)' }}><Timer size={13} style={{ verticalAlign: -2 }} /> {closed ? 'Closed' : fmtClock(left)}</span></div>
    <div className="route" style={{ marginTop: 10 }}>{l.from} → {l.to}</div>
    <div className="kv"><span>Weight<b>{l.weight} T</b></span><span>Vehicle<b>{l.vehicle}</b></span><span>Distance<b>{l.km} km</b></span><span>Bidders<b>{l.bidders}</b></span><span>Suggested<b>{inr(l.suggested)}</b></span></div>
    <div className="lowest"><span>Lowest bid</span><b className="num">{inr(lowest)}</b></div>
    {locked ? <div className="mut"><Lock size={13} style={{ verticalAlign: -2 }} /> Requires {TIERS[l.minTier]} tier</div> : <>
      {mine != null && <p style={{ margin: '0 0 8px' }}>{leading ? <Badge tone="ok"><Trophy size={11} />You lead</Badge> : <Badge tone="err">Outbid</Badge>} <span className="mut">Your bid {inr(mine)}</span></p>}
      <div className="field" style={{ margin: 0 }}><input className="input" type="number" style={{ width: 130 }} placeholder="Your bid ₹" value={amt} onChange={(e) => setAmt(e.target.value)} aria-label={`Bid for ${l.from} to ${l.to}`} disabled={closed} />
        <button className="btn" disabled={busy || closed || !amt} onClick={submit}>{busy ? 'Saving…' : mine != null ? 'Modify' : 'Place bid'}</button>
        {mine != null && <button className="btn ghost" disabled={closed} onClick={() => onWithdraw(l)}>Withdraw</button>}</div></>}
  </motion.article>;
}

export default function Marketplace({ user }) {
  const res = useResource(api.listings, []);
  const [mine, setMine] = useState({});
  const [q, setQ] = useState(''), [cat, setCat] = useState('');
  const toast = useToast();
  // Live updates from the existing WebSocket server (bid:update). Skipped in demo mode.
  useEffect(() => {
    if (DEMO) return; const ws = new WebSocket(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/ws`);
    ws.onmessage = (e) => { const m = JSON.parse(e.data); if (m.type === 'bid:update') res.setData((d) => d.map((x) => (x.id === m.cargoId ? { ...x, lowest: m.lowest } : x))); };
    return () => ws.close();
  }, []); // eslint-disable-line
  const cats = useMemo(() => [...new Set((res.data || []).map((l) => l.category))], [res.data]);
  const rows = (res.data || []).filter((l) => (!cat || l.category === cat) && (l.from + l.to).toLowerCase().includes(q.toLowerCase()));
  const bid = async (l, amount) => {
    if (!amount || amount > l.suggested * 1.3) return toast('Bid must be above ₹0 and within 130% of the suggested price', 'err');
    try { await api.placeBid(l.id, amount); setMine((m) => ({ ...m, [l.id]: amount })); res.setData((d) => d.map((x) => (x.id === l.id ? { ...x, lowest: Math.min(x.lowest, amount), bidders: x.bidders + (mine[l.id] == null ? 1 : 0) } : x))); toast(amount < l.lowest ? 'You are now the lowest bidder' : 'Bid placed'); } catch (e) { toast(e.message, 'err'); }
  };
  const withdraw = async (l) => { try { await api.withdrawBid(l.id); setMine(({ [l.id]: _, ...rest }) => rest); res.setData((d) => d.map((x) => (x.id === l.id ? { ...x, bidders: x.bidders - 1 } : x))); toast('Bid withdrawn'); } catch (e) { toast(e.message, 'err'); } };
  return <>
    <h1>Load board</h1><p className="sub">Reverse auction – the lowest qualified bid wins. Higher tiers unlock larger cargo.</p>
    <div className="field"><div style={{ position: 'relative' }}><Search size={15} style={{ position: 'absolute', left: 10, top: 11, color: 'var(--mut)' }} /><input className="input" style={{ paddingLeft: 32 }} placeholder="Search city…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search loads" /></div>
      <select className="input" value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Category"><option value="">All categories</option>{cats.map((c) => <option key={c}>{c}</option>)}</select></div>
    <State {...res} onRetry={res.reload} empty={!rows.length} emptyText="No loads match your filters."><div className="lst">{rows.map((l, i) => <Listing key={l.id} l={l} i={i} user={user} mine={mine[l.id]} onBid={bid} onWithdraw={withdraw} />)}</div></State></>;
}
