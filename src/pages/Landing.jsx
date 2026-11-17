import { motion } from 'framer-motion';
import { ArrowRight, Gavel, ShieldCheck, Route, Fuel, Star, Layers } from 'lucide-react';
import { BRAND } from '../config';
import { Logo } from '../components/Shell';
const STEPS = [['Post a load', 'Shippers add lane, weight, vehicle and deadline.'], ['Verified carriers bid down', 'Transporters see live lowest bids and counter before close.'], ['Lowest bid wins', 'Ties are settled on rating, on-time record, cancellations and performance.']];
const FEATS = [[ShieldCheck, 'Verified transporters', 'Every carrier’s documents are checked before they can bid.'], [Layers, 'Tiered access', 'Bronze to Platinum, based on verified completed deliveries.'], [Route, 'Live tracking', 'Follow each shipment from pickup to proof of delivery.'], [Fuel, 'FASTag utility', 'Balance, recharge and low-balance alerts in one place.'], [Gavel, 'Transparent auctions', 'One clear rule set, visible to both sides.'], [Star, 'Ratings that matter', 'Reviews feed directly into tie-breaks and tier progress.']];
export default function Landing({ onEnter }) {
  return <div>
    <nav className="lnav"><span style={{ display: 'flex', gap: 10, alignItems: 'center', fontWeight: 700 }}><Logo />{BRAND}</span><a href="#how">How it works</a><a href="#platform">Platform</a><div style={{ flex: 1 }} /><button className="btn" onClick={onEnter}>Open platform</button></nav>
    <header className="hero">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1>Freight priced by competition, not negotiation.</h1>
        <p style={{ margin: '18px 0 28px' }}>A reverse-auction marketplace connecting Indian shippers with verified transporters. Post a load, receive bids, book the lowest qualified price.</p>
        <button className="btn accent" onClick={onEnter}>Get started <ArrowRight size={16} /></button>
      </motion.div>
      <svg viewBox="0 0 400 260" role="img" aria-label="Route illustration"><rect width="400" height="260" rx="6" fill="#142a4d" />
        <motion.path d="M50 210 C120 190 130 110 210 110 S320 70 350 40" fill="none" stroke="#e8651a" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2 }} />
        <circle cx="50" cy="210" r="7" fill="#fff" /><circle cx="350" cy="40" r="7" fill="#1d5fd1" /><motion.circle r="6" fill="#e8651a" animate={{ cx: [50, 210, 350], cy: [210, 110, 40] }} transition={{ duration: 5, repeat: Infinity, ease: 'linear' }} /></svg>
    </header>
    <section className="sec" id="how"><h2>How it works</h2><div className="grid two" style={{ gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))' }}>{STEPS.map(([t, d], i) => <motion.div key={t} className="card" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}><b className="num" style={{ color: 'var(--orange)' }}>0{i + 1}</b><h3 style={{ fontSize: 16, margin: '6px 0' }}>{t}</h3><span className="mut">{d}</span></motion.div>)}</div></section>
    <section className="sec" id="platform" style={{ paddingTop: 0 }}><h2>Built for both sides of the load</h2><div className="feat">{FEATS.map(([I, t, d]) => <div key={t}><I size={22} /><h3 style={{ fontSize: 15 }}>{t}</h3><span className="mut">{d}</span></div>)}</div></section>
  </div>;
}
