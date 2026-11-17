// FASTag balance, low-balance alert, recharge flow (select -> confirm -> processing -> result) and history.
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Plus } from 'lucide-react';
import { api } from '../api/client';
import { useResource } from '../hooks/useResource';
import { State, Badge, Modal, Count, useToast } from '../components/ui';
import { inr } from '../lib/logic';
export default function Fastag() {
  const res = useResource(api.fastag, []); const toast = useToast();
  const [open, setOpen] = useState(false), [amt, setAmt] = useState(1000), [busy, setBusy] = useState(false);
  const f = res.data, low = f && f.balance < f.threshold;
  const pay = async () => { setBusy(true); try { await api.recharge(amt); res.reload(); setOpen(false); toast(`Recharge of ${inr(amt)} successful`); } catch (e) { toast(e.message, 'err'); } setBusy(false); };
  return <><h1>FASTag</h1><p className="sub">Balance, recharge and toll history.</p>
    <State {...res} onRetry={res.reload} empty={!f}>{f && <>
      {low && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ borderColor: 'var(--orange)', marginBottom: 12, display: 'flex', gap: 10 }}><AlertTriangle size={18} color="var(--orange)" />Balance is below {inr(f.threshold)}. Recharge to avoid toll-plaza penalties.</motion.div>}
      <div className="card balance"><div style={{ opacity: 0.7 }}>Tag {f.tag}</div><div className="v"><Count to={f.balance} fmt={(v) => inr(Math.round(v))} /></div><button className="btn accent" style={{ marginTop: 12 }} onClick={() => setOpen(true)}><Plus size={16} />Recharge</button></div>
      <div className="card tw" style={{ marginTop: 12 }}><h3>Recent transactions</h3>{f.tx.length ? <table><thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Status</th></tr></thead><tbody>{f.tx.map((t) => <tr key={t.id}><td>{t.date}</td><td>{t.desc}</td><td className="num" style={{ color: t.amount > 0 ? 'var(--ok)' : undefined }}>{t.amount > 0 ? '+' : '−'}{inr(Math.abs(t.amount))}</td><td><Badge tone={t.status === 'Success' ? 'ok' : 'err'}>{t.status}</Badge></td></tr>)}</tbody></table> : <div className="state">No transactions yet.</div>}</div></>}</State>
    <Modal open={open} onClose={() => !busy && setOpen(false)} title="Recharge FASTag">
      <div className="field">{[500, 1000, 2000, 5000].map((a) => <button key={a} className={`btn ${amt === a ? '' : 'ghost'}`} onClick={() => setAmt(a)}>{inr(a)}</button>)}</div>
      <p className="mut">Confirm payment of <b>{inr(amt)}</b> to tag {f?.tag}.</p>
      <button className="btn accent" disabled={busy} onClick={pay}>{busy ? 'Processing payment…' : 'Confirm & pay'}</button></Modal></>;
}
