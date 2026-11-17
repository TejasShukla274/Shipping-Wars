import { motion } from 'framer-motion';
// Animated line/area chart: the stroke draws in via pathLength. Renders only the data it is given.
export function LineChart({ labels, data }) {
  const W = 320, H = 120, max = Math.max(...data), min = Math.min(...data) * 0.9;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * W, 100 - ((v - min) / (max - min || 1)) * 85]);
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p.join(' ')).join(' ');
  return <svg viewBox={`-8 0 ${W + 16} ${H + 10}`} width="100%" role="img" aria-label="Trend chart">
    <path d={`${d} L${W} 100 L0 100Z`} fill="var(--blue50)" />
    <motion.path d={d} fill="none" stroke="var(--blue)" strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, ease: 'easeOut' }} />
    {pts.map((p, i) => <g key={i}><circle cx={p[0]} cy={p[1]} r="3" fill="var(--blue)"><title>{labels[i]}: {data[i]}</title></circle><text x={p[0]} y="116" fontSize="9" textAnchor="middle" fill="var(--mut)">{labels[i]}</text></g>)}
  </svg>;
}
