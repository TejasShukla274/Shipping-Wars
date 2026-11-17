// App shell: animated collapsible sidebar, top bar with role-mode toggle, notifications, profile menu.
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Bell, LayoutDashboard, Store, ShieldCheck, Fuel, Package, ChevronDown, LogOut, Info } from 'lucide-react';
import { BRAND } from '../config';
import { DEMO, api } from '../api/client';
import { useResource, useMedia } from '../hooks/useResource';
import { TIERS, tierOf } from '../lib/logic';

export const Logo = ({ size = 28 }) => <svg width={size} height={size} viewBox="0 0 28 28" aria-hidden><rect width="28" height="28" rx="6" fill="#e8651a" /><path d="M8 19l6-10 6 10" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>;

export const NAV = {
  transporter: [['dashboard', 'Dashboard', LayoutDashboard], ['marketplace', 'Load board', Store], ['compliance', 'Compliance', ShieldCheck], ['fastag', 'FASTag', Fuel]],
  shipper: [['dashboard', 'Dashboard', LayoutDashboard], ['shipments', 'Shipments & bids', Package]],
};

function Dropdown({ label, icon, children, align }) {
  const [open, setOpen] = useState(false);
  return <div style={{ position: 'relative' }} onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setOpen(false)}>
    <button className="icon-btn" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={label}>{icon}</button>
    <AnimatePresence>{open && <motion.div className="menu" style={align} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.14 }} onClick={() => setOpen(false)}>{children}</motion.div>}</AnimatePresence></div>;
}

export default function Shell({ user, mode, setMode, view, setView, onExit, children }) {
  const mobile = useMedia('(max-width:820px)');
  const [open, setOpen] = useState(true);
  const show = mobile ? open : true;
  const nav = NAV[mode];
  const notes = useResource(() => api.notifications(mode), [mode]);
  const unread = (notes.data || []).filter((n) => n.unread).length;
  const dual = user.roles.includes('shipper') && user.roles.includes('transporter');
  return <div className="shell">
    <motion.aside className="side" initial={false} animate={mobile ? { x: open ? 0 : -260, width: 232 } : { width: open ? 232 : 68 }} transition={{ type: 'spring', stiffness: 360, damping: 36 }}>
      <div className="brand"><Logo />{(open || mobile) && <span>{BRAND}</span>}</div>
      <nav className="nav" aria-label="Main">{nav.map(([id, label, Icon]) => (
        <button key={id} className={view === id ? 'on' : ''} onClick={() => { setView(id); mobile && setOpen(false); }} aria-current={view === id ? 'page' : undefined}>
          {view === id && <motion.i layoutId="pill" className="pill" />}<Icon size={18} />{(open || mobile) && <span>{label}</span>}</button>))}</nav>
    </motion.aside>
    {mobile && open && <div className="scrim" style={{ zIndex: 35 }} onClick={() => setOpen(false)} />}
    <div className="main">
      {DEMO && <div className="banner"><Info size={14} />Demo data – the backend is not fully connected. Set VITE_USE_DEMO=false to use live APIs.</div>}
      <header className="top">
        <button className="icon-btn" onClick={() => setOpen(!open)} aria-label="Toggle sidebar"><Menu size={18} /></button>
        <div style={{ flex: 1 }} />
        {dual && <div className="seg" role="group" aria-label="Role mode">{[['shipper', 'Shipper'], ['transporter', 'Transporter']].map(([m, l]) => (
          <button key={m} className={mode === m ? 'on' : ''} onClick={() => { setMode(m); setView('dashboard'); }}>{mode === m && <motion.i layoutId="seg" className="pill" />}<span style={{ position: 'relative' }}>{l}</span></button>))}</div>}
        <Dropdown label="Notifications" icon={<><Bell size={18} />{unread > 0 && <span className="dot">{unread}</span>}</>}>
          <div style={{ fontWeight: 600 }}>Notifications</div>
          {notes.loading ? <div className="mut">Loading…</div> : (notes.data || []).length ? notes.data.map((n) => <div key={n.id} className="mut" style={{ fontSize: 13 }}>{n.unread && '● '}{n.text}</div>) : <div className="mut">You’re all caught up.</div>}
        </Dropdown>
        <Dropdown label="Profile" icon={<><span style={{ fontWeight: 600, marginRight: 6 }}>{user.name.split(' ').map((w) => w[0]).join('')}</span><ChevronDown size={14} /></>}>
          <div><b>{user.name}</b><div className="mut">{user.company} · {TIERS[tierOf(user.completedDeliveries)]} tier</div></div>
          <button onClick={onExit}><LogOut size={14} style={{ verticalAlign: -2, marginRight: 8 }} />Back to home</button>
        </Dropdown>
      </header>
      <AnimatePresence mode="wait"><motion.main key={mode + view} className="page" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>{children}</motion.main></AnimatePresence>
    </div></div>;
}
