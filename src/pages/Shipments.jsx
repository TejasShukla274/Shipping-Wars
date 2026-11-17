// Shipper: shipments with animated progress and bid comparison (sorted by shared tie-break rule).
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { api } from '../api/client';
import { useResource } from '../hooks/useResource';
import { State, Badge, useToast } from '../components/ui';
import { inr, rank } from '../lib/logic';
export default function Shipments() {
  const res = useResource(api.shipments, []); const toast = useToast();
  return <><h1>Shipments & bids</h1><p className="sub">Compare bids, award a transporter and follow delivery progress.</p>
    <State {...res} onRetry={res.reload} empty={!res.data?.length} emptyText="No shipments posted yet."><div className="grid">{(res.data || []).map((s) => { const bids = [...s.bids].sort(rank); return (
      <div className="card" key={s.id}><div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}><b>{s.id} · {s.from} → {s.to}</b><Badge tone={s.status === 'Open' ? 'warn' : 'blue'}>{s.status}</Badge></div>
        {s.progress > 0 && <div className="bar" style={{ margin: '12px 0' }}><motion.div initial={{ width: 0 }} animate={{ width: s.progress + '%' }} transition={{ duration: 0.9 }} /></div>}
        {bids.length ? <div className="tw"><table><thead><tr><th>Transporter</th><th>Rating</th><th>Tier</th><th>On-time</th><th>Bid</th><th /></tr></thead><tbody>{bids.map((b, i) => <tr key={b.name}><td>{i === 0 && <Trophy size={13} color="var(--orange)" style={{ marginRight: 6 }} />}{b.name}</td><td>{b.rating} ★</td><td><Badge>{b.tier}</Badge></td><td>{b.onTime}%</td><td className="num"><b>{inr(b.amount)}</b></td><td><button className="btn sm" onClick={() => toast(`Awarded to ${b.name}`)}>Award</button></td></tr>)}</tbody></table></div> : <div className="state">No bids yet.</div>}</div>); })}</div></State></>;
}
