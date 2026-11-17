import { useCallback, useEffect, useState } from 'react';
// Loads async data and exposes { data, loading, error, reload, setData } so every screen can render all four states.
export function useResource(fn, deps = []) {
  const [s, set] = useState({ loading: true });
  const run = useCallback(() => { set((x) => ({ ...x, loading: true, error: null })); fn().then((data) => set({ data, loading: false })).catch((error) => set({ loading: false, error })); }, deps); // eslint-disable-line
  useEffect(run, [run]);
  return { ...s, reload: run, setData: (d) => set((x) => ({ ...x, data: typeof d === 'function' ? d(x.data) : d })) };
}
export function useMedia(q) {
  const [m, setM] = useState(() => matchMedia(q).matches);
  useEffect(() => { const mq = matchMedia(q), f = () => setM(mq.matches); mq.addEventListener('change', f); return () => mq.removeEventListener('change', f); }, [q]);
  return m;
}
