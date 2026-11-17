# Shipping Wars – web app (React + Vite + Framer Motion + Lucide)

    npm install && npm run dev        # http://localhost:5173  (proxies /api and /ws to backend on :4000)
    cp .env.example .env              # VITE_USE_DEMO=false to call the real API

- `src/api/client.js` – the only place that talks to the backend (existing routes: POST/DELETE /api/bids/:cargoId, /api/auth/*, WebSocket bid:update)
- `src/api/demo.js` – labelled demo adapter, active only while VITE_USE_DEMO=true (orange banner shown)
- `src/components/ui.jsx` – design system (Badge, Stat, State, Modal, Toasts); `Shell.jsx` – sidebar/top bar; `charts.jsx`
- `src/pages/` – Landing, Dashboard, Marketplace, Compliance, Fastag, Shipments
- `src/lib/logic.js` – tiers, tie-break, document status (ported from legacy)
- `backend/` – unchanged Express/Mongo/WebSocket skeleton; `legacy/` – previous vanilla-JS frontend (admin, tracking, post-shipment, i18n still live here)
