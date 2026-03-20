# 🇮🇳 India Monitor

A real-time glassmorphism intelligence dashboard for India — covering live weather, finance markets, public transport, flight tracking, news, and state-level data across the entire country.

**Live demo → [ayush4u.github.io/Indian-Monitor](https://ayush4u.github.io/Indian-Monitor/)**

---

## Screenshots

> Dashboard overview with live map, breaking news ticker, and glassmorphism panels.

---

## Features

| Module | What it shows |
|---|---|
| **Dashboard** | Summary stats bar, breaking news ticker, India map with live trains & flights |
| **News** | 30+ real Indian headlines across economy, defence, climate, science, politics |
| **Finance** | SENSEX, NIFTY 50, BANK NIFTY, NIFTY IT — 30 stocks, sector heatmap, gainers/losers |
| **Weather** | 16 major cities — temperature, AQI, humidity, wind, UV index |
| **Transport** | 298 trains on live map, real station route data (40+ corridors), detail overlays |
| **Flights** | 160+ airborne flights over Indian airspace, airline breakdown, detail overlay |
| **States** | State-level data cards for all 28 states + 8 UTs |

---

## Tech Stack

- **TypeScript** — fully typed, no framework
- **Vite 5** — build tool & dev server with API proxies
- **Leaflet.js 1.9.4** — interactive dark map
- **CSS Glassmorphism** — `backdrop-filter` blur, custom design system

---

## Data Sources

All data sources are free / no paid key required:

| Source | Data |
|---|---|
| [Open-Meteo](https://open-meteo.com/) | Live weather for 16 cities (direct CORS) |
| [WAQI](https://waqi.info/) | Air Quality Index per city (demo token) |
| [USGS Earthquake Hazards](https://earthquake.usgs.gov/) | India earthquakes M2.5+, last 7 days (direct CORS) |
| [OpenSky Network](https://opensky-network.org/) | Real-time aircraft positions over India (no key, 10 req/min) |
| [Yahoo Finance v8](https://finance.yahoo.com/) | Indian stock indices & NIFTY 50 tickers (via proxy) |
| [Google News RSS](https://news.google.com/) | 8 Indian news topic feeds (via proxy) |

> **Note:** On GitHub Pages (static hosting), Yahoo Finance, OpenSky, and Google News use rich offline fallback data since server-side proxies are unavailable. Weather and AQI remain live everywhere.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & run locally

```bash
git clone https://github.com/ayush4u/Indian-Monitor.git
cd Indian-Monitor
npm install
npm run dev
```

Open `http://localhost:5173` — all API proxies are active in dev mode so Finance, Flights, and News pull live data.

### Build for production

```bash
npm run build
```

Output goes to `dist/`. Preview with `npm run preview`.

---

## Project Structure

```
src/
├── components/         # UI panels (one file per view)
│   ├── IndiaMap.ts     # Leaflet map + train/flight markers
│   ├── NewsPanel.ts    # Breaking news bar + news grid
│   ├── FinancePanel.ts # Stock heatmap, indices, sectors
│   ├── WeatherPanel.ts # 16-city weather cards
│   ├── TransportPanel.ts # Train list + route detail overlay
│   ├── FlightRadarPanel.ts # Live flights + detail overlay
│   ├── StatsBar.ts     # Top summary bar
│   ├── Sidebar.ts      # Navigation
│   ├── Header.ts       # App header
│   └── StateDetail.ts  # State info cards
├── services/           # Data fetching & fallback logic
│   ├── financeService.ts
│   ├── flightRadarService.ts
│   ├── newsService.ts
│   ├── transportService.ts
│   └── weatherService.ts
├── data/
│   └── states.ts       # Static state metadata
├── styles/
│   └── main.css        # Full glassmorphism design system (~1500 lines)
└── utils/
    ├── constants.ts
    ├── formatters.ts
    └── icons.ts
```

---

## Deployment

This project deploys automatically to GitHub Pages via GitHub Actions on every push to `main`.

The workflow (`.github/workflows/deploy.yml`) runs `npm run build` and pushes `dist/` to the `gh-pages` branch using [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages).

To set up your own deployment:
1. Fork the repo
2. Go to **Settings → Pages**, set source to **Deploy from a branch → `gh-pages`**
3. Update `base` in `vite.config.ts` to match your repo name
4. Push to `main` — Actions handles the rest

---

## License

MIT
