# Smart Reverse Auction Logistics Platform

## Run the frontend (no build step)
Open `index.html`, or serve the folder: `npx serve .`

## Folder map
```
index.html            App shell + script load order
css/styles.css        All styles (banner-commented sections)
js/
  i18n.js             7 languages + t()
  state.js            Global state + all mock data  <-- swap for API data
  utils.js            Helpers, badges, SVG charts
  layout.js           Sidebar, top bar, mode toggle, notifications
  transporter.js      Dashboard, marketplace + bidding, compliance, FASTag
  owner.js            Post shipment, bid comparison, tracking, ratings
  admin.js            Verification, disputes, fraud, commission
  realtime.js         Simulated live bids/countdowns  <-- swap for WebSocket
  main.js             Router + render() + start
backend/              Express + MongoDB + WebSocket skeleton (not wired to the UI yet)
```
## Where to change things
- Add a translation: `js/i18n.js` -> `T`
- Add a sidebar item: `NAV` in `js/layout.js`, then a case in `view()` in `js/main.js`
- Change tier thresholds: `tier()` in `js/utils.js` and `backend/services/tier.js`
- Real APIs (FASTag, payments, GPS, document verification): `backend/services/integrations.js`
