// Dashboard for both roles. Shows only what the API returns – empty data renders an empty state, not placeholders.
import { api } from '../api/client';
import { useResource } from '../hooks/useResource';
import { Stat, State } from '../components/ui';
import { LineChart } from '../components/charts';
export default function Dashboard({ mode, user }) {
  const stats = useResource(() => api.stats(mode), [mode]);
  const series = useResource(() => api.series(mode), [mode]);
  return <>
    <h1>{mode === 'transporter' ? 'Transporter overview' : 'Shipper overview'}</h1><p className="sub">Welcome back, {user.name.split(' ')[0]}.</p>
    <State {...stats} onRetry={stats.reload} empty={!stats.data?.length} emptyText="No activity yet.">
      <div className="grid stats">{(stats.data || []).map((s, i) => <Stat key={s.k} i={i} {...s} />)}</div></State>
    <div className="grid two" style={{ marginTop: 12 }}>
      <div className="card"><h3>{series.data?.title || 'Trend'}</h3>
        <State {...series} onRetry={series.reload} empty={!series.data?.data?.length} emptyText="No data for this period."><LineChart labels={series.data?.labels || []} data={series.data?.data || []} /></State></div>
    </div></>;
}
