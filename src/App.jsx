import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from './api/client';
import { useResource } from './hooks/useResource';
import { ToastProvider, State } from './components/ui';
import Shell from './components/Shell';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Marketplace from './pages/Marketplace';
import Compliance from './pages/Compliance';
import Fastag from './pages/Fastag';
import Shipments from './pages/Shipments';
// Role-based screens: a single account can hold both roles; mode decides what is shown (no re-login).
const PAGES = { transporter: { dashboard: Dashboard, marketplace: Marketplace, compliance: Compliance, fastag: Fastag }, shipper: { dashboard: Dashboard, shipments: Shipments } };
function Platform({ onExit }) {
  const session = useResource(api.session, []);
  const [mode, setMode] = useState('transporter'), [view, setView] = useState('dashboard');
  if (session.loading || session.error) return <div className="page"><State {...session} onRetry={session.reload} /></div>;
  const user = session.data, roles = user.roles;
  const m = roles.includes(mode) ? mode : roles[0];
  const Page = PAGES[m][view] || Dashboard;
  return <Shell user={user} mode={m} setMode={setMode} view={view} setView={setView} onExit={onExit}><Page mode={m} user={user} /></Shell>;
}
export default function App() {
  const [entered, setEntered] = useState(false);
  return <ToastProvider><AnimatePresence mode="wait"><motion.div key={entered} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{entered ? <Platform onExit={() => setEntered(false)} /> : <Landing onEnter={() => setEntered(true)} />}</motion.div></AnimatePresence></ToastProvider>;
}
