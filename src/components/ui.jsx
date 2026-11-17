// Reusable design-system pieces: Badge, Stat (animated count-up), State (loading/error/empty), Modal, Toasts, Skeleton.
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, animate } from 'framer-motion';
import { AlertCircle, Inbox, X, CheckCircle2 } from 'lucide-react';

export const Badge = ({ tone = 'n', children }) => <span className={`badge ${tone}`}>{children}</span>;

// Counts from 0 to `to` on mount / value change
export function Count({ to, fmt = (v) => Math.round(v) }) {
  const [v, setV] = useState(0);
  useEffect(() => { const c = animate(0, to, { duration: 0.9, ease: 'easeOut', onUpdate: setV }); return () => c.stop(); }, [to]);
  return <span className="num">{fmt(v)}</span>;
}
const FMT = { pct: (v) => Math.round(v) + '%', pct1: (v) => v.toFixed(1) + '%', star: (v) => v.toFixed(1) + ' ★' };
export const Stat = ({ k, v, fmt, i = 0 }) => (
  <motion.div className="card stat" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -2 }}>
    <div className="k">{k}</div><div className="v"><Count to={v} fmt={FMT[fmt]} /></div>
  </motion.div>
);

// One component renders every non-success state so screens stay consistent
export function State({ loading, error, empty, onRetry, emptyText = 'Nothing here yet.', children }) {
  if (loading) return <div className="grid" aria-busy="true">{[0, 1, 2].map((i) => <div key={i} className="skel" />)}</div>;
  if (error) return <div className="card state"><AlertCircle /><b>Couldn’t load this data</b><span>{error.message}</span>{onRetry && <button className="btn ghost sm" onClick={onRetry}>Try again</button>}</div>;
  if (empty) return <div className="card state"><Inbox /><span>{emptyText}</span></div>;
  return children;
}

export function Modal({ open, onClose, title, children }) {
  useEffect(() => { if (!open) return; const f = (e) => e.key === 'Escape' && onClose(); addEventListener('keydown', f); return () => removeEventListener('keydown', f); }, [open, onClose]);
  return <AnimatePresence>{open && (
    <motion.div className="scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="modal" role="dialog" aria-modal="true" aria-label={title} initial={{ y: 20, scale: 0.97, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} exit={{ y: 10, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}><h3 style={{ fontSize: 16 }}>{title}</h3><button className="icon-btn" onClick={onClose} aria-label="Close"><X size={16} /></button></div>
        {children}
      </motion.div></motion.div>)}</AnimatePresence>;
}

const Toast = createContext(() => {});
export const useToast = () => useContext(Toast);
export function ToastProvider({ children }) {
  const [list, setList] = useState([]);
  const push = useCallback((text, tone = 'ok') => { const id = Math.random(); setList((l) => [...l, { id, text, tone }]); setTimeout(() => setList((l) => l.filter((x) => x.id !== id)), 3800); }, []);
  return <Toast.Provider value={push}>{children}
    <div className="toasts" role="status" aria-live="polite"><AnimatePresence>{list.map((t) => (
      <motion.div key={t.id} layout className={`toast ${t.tone}`} initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ opacity: 0, x: 40 }}>
        <CheckCircle2 size={14} style={{ marginRight: 6, verticalAlign: -2 }} />{t.text}</motion.div>))}</AnimatePresence></div></Toast.Provider>;
}
