// Vehicle document monitoring with Valid / Expiring soon / Expired status computed from today's date.
import { BellRing } from 'lucide-react';
import { api } from '../api/client';
import { useResource } from '../hooks/useResource';
import { State, Badge, useToast } from '../components/ui';
import { docStatus } from '../lib/logic';
export default function Compliance() {
  const res = useResource(api.vehicles, []); const toast = useToast();
  const urgent = (res.data || []).flatMap((v) => Object.entries(v.docs).map(([k, d]) => ({ v: v.reg, k, ...docStatus(d) }))).filter((x) => x.tone !== 'ok');
  return <><h1>Compliance</h1><p className="sub">Registration, insurance, pollution and permit validity for every vehicle.</p>
    {urgent.length > 0 && <div className="card" style={{ borderColor: 'var(--orange)', marginBottom: 12, display: 'flex', gap: 10, alignItems: 'center' }}><BellRing size={18} color="var(--orange)" /><span>{urgent.length} document{urgent.length > 1 ? 's need' : ' needs'} attention: {urgent.map((u) => `${u.v} ${u.k}`).join(', ')}</span></div>}
    <State {...res} onRetry={res.reload} empty={!res.data?.length} emptyText="No vehicles registered yet."><div className="card tw"><table><thead><tr><th>Vehicle</th>{['RC', 'Insurance', 'PUC', 'Permit'].map((h) => <th key={h}>{h}</th>)}<th /></tr></thead><tbody>
      {(res.data || []).map((v) => <tr key={v.id}><td><b>{v.reg}</b><div className="mut">{v.type}</div></td>{['RC', 'Insurance', 'PUC', 'Permit'].map((k) => { const s = docStatus(v.docs[k]); return <td key={k}><Badge tone={s.tone}>{s.label}</Badge><div className="mut num" style={{ fontSize: 11 }}>{v.docs[k]} · {s.days}d</div></td>; })}<td><button className="btn ghost sm" onClick={() => toast('Renewal reminder scheduled')}>Remind me</button></td></tr>)}</tbody></table></div></State></>;
}
