// ─── India Monitor — Main Entry ───
import 'leaflet/dist/leaflet.css';
import './styles/main.css';

import { createHeader, startClock } from './components/Header';
import { createSidebar, type View } from './components/Sidebar';
import { createMapCard, createEmbeddedMapCard, initMap, refreshFlightLayer, refreshTrainLayer, destroyMap } from './components/IndiaMap';
import { createBreakingBar, createNewsPanel, initNewsFilters, renderNewsList } from './components/NewsPanel';
import { createFinancePanel, initFinanceTabs } from './components/FinancePanel';
import { createWeatherPanel, createDisasterPanel } from './components/WeatherPanel';
import { createTransportPanel, initTransportTabs, initTrainFilters, invalidateTrainCache } from './components/TransportPanel';
import { createFlightRadarPanel, initFlightRadarTabs, initFlightFilters } from './components/FlightRadarPanel';
import { createStockHeatmapPanel, initStockHeatmapTabs } from './components/StockHeatmapPanel';

import { createStateDetailOverlay, showStateDetail, initStateDetailClose } from './components/StateDetail';
import { createStatsBar } from './components/StatsBar';
import { createTrainRoutePanel } from './components/TrainRouteDetail';
import { icons } from './utils/icons';
import { fetchLiveMarketData, getMarketData } from './services/financeService';
import { fetchAllLiveWeather, fetchLiveDisasters } from './services/weatherService';
import { fetchLiveNews, getLatestNews, getBreakingNews } from './services/newsService';
import { fetchLiveFlights, getFlightData, guessAirline } from './services/flightRadarService';

import { getTrainStatuses, getTotalTrainCount, getFlightStatuses } from './services/transportService';

let currentView: View = 'dashboard';

function render(): void {
  const app = document.getElementById('app');
  if (!app) return;

  invalidateTrainCache();
  destroyMap(); // Clean up any existing map instance

  app.innerHTML = `
    ${createHeader()}
    ${createBreakingBar()}
    <div class="main-layout">
      ${createSidebar(currentView)}
      <div class="content-area">
        <div class="dashboard-grid" id="dashboardGrid">
          ${renderView(currentView)}
        </div>
      </div>
    </div>
    ${createStateDetailOverlay()}
    <div class="detail-overlay" id="detailOverlay">
      <div class="detail-overlay-backdrop" id="detailOverlayBackdrop"></div>
      <div class="detail-overlay-panel" id="detailOverlayPanel"></div>
    </div>
  `;

  // Initialize components
  requestAnimationFrame(() => {
    startClock();
    initMapComponent();
    initNewsFilters();
    initFinanceTabs();
    initTransportTabs();
    initTrainFilters();
    initFlightRadarTabs();
    initFlightFilters();
    initStockHeatmapTabs();
    initStateDetailClose();
    initSidebarNav();
    initMobileMenu();
    initPageBack();
    initTrainClickRoutes();
    initFlightClickRoutes();
    initStatCardNav();
    initDetailOverlayClose();
  });
}

function renderView(view: View): string {
  switch (view) {
    case 'dashboard':
      return `
        ${createStatsBar()}
        ${createMapCard()}
        ${createFinancePanel()}
        ${createFlightRadarPanel()}
        ${createTransportPanel()}
        ${createNewsPanel()}
        ${createWeatherPanel()}
        ${createDisasterPanel()}
        ${createStockHeatmapPanel()}
      `;
    case 'news':
      return `${createPageHeader(icons.news(18), 'News Intelligence')}${createNewsPanel()}`;
    case 'finance':
      return `${createPageHeader(icons.finance(18), 'Markets & Stocks')}${createFinancePanel()}${createStockHeatmapPanel()}`;
    case 'weather':
      return `${createPageHeader(icons.weather(18), 'Weather & Disasters')}${createWeatherPanel()}${createDisasterPanel()}`;
    case 'transport':
      return `
        ${createPageHeader(icons.train(18), 'Rail & Metro')}
        ${createEmbeddedMapCard('trains')}
        ${createTransportPanel(true)}
      `;
    case 'flights':
      return `
        ${createPageHeader(icons.plane(18), 'Live Flight Radar')}
        ${createEmbeddedMapCard('flights')}
        ${createFlightRadarPanel(true)}
      `;

    case 'states':
      return `${createPageHeader(icons.globe(18), 'State Explorer')}${createMapCard()}`;
    default:
      return '';
  }
}

function createPageHeader(iconSvg: string, title: string): string {
  return `
    <div class="page-header" style="grid-column: 1 / -1;">
      <button class="page-back-btn" data-nav="dashboard">${icons.back(14)} Dashboard</button>
      <h2 class="page-title">${iconSvg} ${title}</h2>
    </div>
  `;
}

function initMapComponent(): void {
  const mapEl = document.getElementById('indiaMap');
  if (mapEl) {
    const mode = currentView === 'transport' ? 'trains' : currentView === 'flights' ? 'flights' : undefined;
    initMap((stateCode: string) => {
      showStateDetail(stateCode);
    }, mode);
  }
}

function initSidebarNav(): void {
  document.querySelectorAll('.nav-item[data-view]').forEach(item => {
    item.addEventListener('click', () => {
      const view = item.getAttribute('data-view') as View;
      if (view && view !== currentView) {
        currentView = view;
        render();
      }

      // Close sidebar on mobile
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('sidebarOverlay');
      if (sidebar) sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('open');
    });
  });
}

function initMobileMenu(): void {
  const btn = document.getElementById('mobileMenuBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  if (btn && sidebar && overlay) {
    btn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('open');
    });

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    });
  }
}

// ─── Quick card / View on Map / Navigation handlers ───

function navigateTo(view: View): void {
  if (view !== currentView) {
    currentView = view;
    render();
  }
}

function initPageBack(): void {
  document.querySelectorAll('.page-back-btn[data-nav]').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.getAttribute('data-nav') as View;
      if (view) navigateTo(view);
    });
  });
}

function initStatCardNav(): void {
  const statViewMap: Record<string, View> = {
    'SENSEX': 'finance',
    'NIFTY 50': 'finance',
    'UPI Volume (Monthly)': 'finance',
    'Disaster Alerts': 'weather',
    'Railways On-Time': 'transport',
    'Metro Status': 'transport',
    'Total GDP': 'states',
    'Population': 'states',
  };

  document.querySelectorAll('.stat-card').forEach(card => {
    const label = card.querySelector('.stat-label')?.textContent?.trim() || '';
    const view = statViewMap[label];
    if (view) {
      card.addEventListener('click', () => navigateTo(view));
    }
  });
}

function initTrainClickRoutes(): void {
  document.querySelectorAll('.train-item').forEach(item => {
    (item as HTMLElement).style.cursor = 'pointer';
    item.addEventListener('click', () => {
      const trainNo = item.querySelector('.train-no')?.textContent?.trim() || '';
      if (trainNo) openDetailOverlay(createTrainRoutePanel(trainNo));
    });
  });
}

function initFlightClickRoutes(): void {
  // Transport panel flight items
  document.querySelectorAll('.flight-item').forEach(item => {
    (item as HTMLElement).style.cursor = 'pointer';
    item.addEventListener('click', () => {
      const flightNo = item.querySelector('.flight-no')?.textContent?.trim() || '';
      if (flightNo) openDetailOverlay(createFlightDetailPanel(flightNo));
    });
  });
  // Flight radar panel rows
  document.querySelectorAll('.flight-row[data-callsign]').forEach(item => {
    (item as HTMLElement).style.cursor = 'pointer';
    item.addEventListener('click', () => {
      const callsign = (item as HTMLElement).dataset.callsign || '';
      if (callsign) openDetailOverlay(createFlightDetailPanel(callsign));
    });
  });
}

function createFlightDetailPanel(flightNo: string): string {
  const flights = getFlightData();
  const f = flights.flights.find(fl => fl.callsign.includes(flightNo.replace(/\s/g, '')) || flightNo.includes(fl.callsign.trim()));
  
  // Also check the transport service flights
  const tFlights = getFlightStatuses();
  const tf = tFlights.find(fl => fl.flightNo === flightNo);
  
  if (!f && !tf) return `<div style="padding:40px;text-align:center;color:var(--text-tertiary);">Flight ${flightNo} not found</div>`;
  
  if (tf) {
    const statusColor = tf.status === 'on-time' ? '#22c55e' : tf.status === 'delayed' ? '#ef4444' : tf.status === 'boarding' ? '#3b82f6' : tf.status === 'landed' ? '#06b6d4' : '#6b7280';
    return `
      <div class="route-detail-panel" style="border:none;">
        <div class="route-header" style="border-left: 4px solid ${statusColor};">
          <div class="route-header-top">
            <div>
              <span class="route-train-no">${sanitize(tf.flightNo)}</span>
              <span class="route-train-name">${sanitize(tf.airline)}</span>
            </div>
            <span class="route-type-badge" style="background:${statusColor};">✈ ${sanitize(tf.status.toUpperCase())}</span>
          </div>
          <div class="route-header-meta">
            <span>${icons.plane(12)} ${sanitize(tf.from)} → ${sanitize(tf.to)}</span>
            <span>${icons.clock(12)} Dep: ${sanitize(tf.departureTime)}</span>
            ${tf.gate ? `<span>Gate ${sanitize(tf.gate)}</span>` : ''}
            ${tf.delay > 0 ? `<span style="color:#ef4444;">Delayed +${tf.delay} min</span>` : ''}
          </div>
        </div>
        <div class="flight-detail-body">
          <div class="flight-detail-endpoints">
            <div class="flight-endpoint">
              <div class="flight-ep-code">${sanitize(tf.from)}</div>
              <div class="flight-ep-label">Departure</div>
              <div class="flight-ep-time">${sanitize(tf.departureTime)}</div>
              ${tf.gate ? `<div class="flight-ep-gate">Gate ${sanitize(tf.gate)}</div>` : ''}
            </div>
            <div class="flight-progress-visual">
              <div class="flight-progress-line">
                <div class="flight-progress-dot origin"></div>
                <div class="flight-progress-track">
                  <div class="flight-progress-fill" style="width:${tf.status === 'landed' ? '100' : tf.status === 'boarding' ? '5' : '50'}%;background:${statusColor};"></div>
                  <div class="flight-progress-plane" style="left:${tf.status === 'landed' ? '100' : tf.status === 'boarding' ? '5' : '50'}%;">✈</div>
                </div>
                <div class="flight-progress-dot dest"></div>
              </div>
              <div class="flight-progress-status" style="color:${statusColor};">${sanitize(tf.status.toUpperCase())}</div>
            </div>
            <div class="flight-endpoint">
              <div class="flight-ep-code">${sanitize(tf.to)}</div>
              <div class="flight-ep-label">Arrival</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  
  // Live radar flight
  const airline = guessAirline(f!.callsign);
  const altFt = Math.round(f!.altitude * 3.281);
  const speedKmh = Math.round(f!.velocity * 3.6);
  const statusColor = f!.onGround ? '#6b7280' : '#22c55e';
  return `
    <div class="route-detail-panel" style="border:none;">
      <div class="route-header" style="border-left: 4px solid ${airline.color};">
        <div class="route-header-top">
          <div>
            <span class="route-train-no">${sanitize(f!.callsign)}</span>
            <span class="route-train-name">${sanitize(airline.name)}</span>
          </div>
          <span class="route-type-badge" style="background:${airline.color};">✈ ${f!.onGround ? 'ON GROUND' : 'IN FLIGHT'}</span>
        </div>
        <div class="route-header-meta">
          <span>${icons.plane(12)} ICAO: ${sanitize(f!.icao24)}</span>
          <span>Origin: ${sanitize(f!.originCountry)}</span>
          <span class="route-live-tag"><span class="live-dot"></span>LIVE TRACKING</span>
        </div>
      </div>
      <div class="flight-detail-body">
        <div class="flight-detail-grid">
          <div class="fd-item"><div class="fd-label">Altitude</div><div class="fd-value">${altFt.toLocaleString()} ft</div></div>
          <div class="fd-item"><div class="fd-label">Ground Speed</div><div class="fd-value">${speedKmh} km/h</div></div>
          <div class="fd-item"><div class="fd-label">Heading</div><div class="fd-value">${Math.round(f!.heading)}°</div></div>
          <div class="fd-item"><div class="fd-label">Vertical Rate</div><div class="fd-value">${f!.verticalRate > 0 ? '↑' : f!.verticalRate < 0 ? '↓' : '—'} ${Math.abs(Math.round(f!.verticalRate * 196.85))} ft/min</div></div>
          <div class="fd-item"><div class="fd-label">Status</div><div class="fd-value" style="color:${statusColor};">${f!.onGround ? '● On Ground' : '● Airborne'}</div></div>
          <div class="fd-item"><div class="fd-label">Position</div><div class="fd-value" style="font-family:var(--font-mono);">${f!.lat.toFixed(3)}°N, ${f!.lng.toFixed(3)}°E</div></div>
        </div>
      </div>
    </div>
  `;
}

function openDetailOverlay(html: string): void {
  const overlay = document.getElementById('detailOverlay');
  const panel = document.getElementById('detailOverlayPanel');
  if (!overlay || !panel) return;
  panel.innerHTML = `<button class="detail-overlay-close" id="detailOverlayClose">✕</button>${html}`;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('detailOverlayClose')?.addEventListener('click', closeDetailOverlay);
}

function closeDetailOverlay(): void {
  const overlay = document.getElementById('detailOverlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

function initDetailOverlayClose(): void {
  document.getElementById('detailOverlayBackdrop')?.addEventListener('click', closeDetailOverlay);
}

function sanitize(str: string): string {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

// ─── Live data fetching and panel refresh ───

async function fetchAllLiveData(): Promise<void> {
  // Fetch all live data in parallel
  const results = await Promise.allSettled([
    fetchLiveMarketData(),
    fetchAllLiveWeather(),
    fetchLiveDisasters(),
    fetchLiveNews(),
    fetchLiveFlights(),
  ]);

  console.log('[India Monitor] Live data fetch results:', results.map((r, i) => {
    const labels = ['Market', 'Weather', 'Disasters', 'News', 'Flights'];
    return `${labels[i]}: ${r.status}`;
  }).join(', '));

  // Refresh panels with live data
  refreshPanels();
}

function refreshPanels(): void {
  // Refresh header ticker with live market data
  const tickerTrack = document.querySelector('.ticker-track');
  if (tickerTrack) {
    const market = getMarketData();
    const tickerItems = market.indices.slice(0, 6).map(idx => {
      const direction = idx.change >= 0 ? 'up' : 'down';
      const arrow = idx.change >= 0 ? '▲' : '▼';
      return `
        <div class="ticker-item">
          <span class="ticker-label">${idx.name}</span>
          <span class="ticker-value">${idx.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
          <span class="ticker-change ${direction}">${arrow} ${Math.abs(idx.changePercent).toFixed(2)}%</span>
        </div>
      `;
    }).join('');
    tickerTrack.innerHTML = tickerItems + tickerItems;
  }

  // Refresh stats bar
  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) statsBar.outerHTML = createStatsBar();

  // Refresh finance panel body
  const finIndices = document.getElementById('finIndices');
  if (finIndices) {
    // Re-render the whole finance panel card body
    const finCard = finIndices.closest('.card-body');
    if (finCard) {
      const market = getMarketData();
      // Just update the finance panel content by re-calling createFinancePanel
      const wrapper = finCard.closest('.card');
      if (wrapper) {
        wrapper.outerHTML = createFinancePanel();
        initFinanceTabs();
      }
    }
  }

  // Refresh weather panel
  const weatherGrid = document.querySelector('.weather-grid');
  if (weatherGrid) {
    const weatherCard = weatherGrid.closest('.card');
    if (weatherCard) {
      weatherCard.outerHTML = createWeatherPanel();
    }
  }

  // Refresh disaster panel
  const alertList = document.querySelector('.alert-list');
  if (alertList) {
    const disasterCard = alertList.closest('.card');
    if (disasterCard) {
      disasterCard.outerHTML = createDisasterPanel();
    }
  }

  // Refresh news panel
  const newsList = document.getElementById('newsList');
  if (newsList) {
    const news = getLatestNews(undefined, 12);
    newsList.innerHTML = renderNewsList(news);
  }

  // Refresh breaking bar
  const breakingScroll = document.querySelector('.breaking-scroll');
  if (breakingScroll) {
    const breaking = getBreakingNews();
    const scrollText = breaking.map(n =>
      `<span>⚡ ${n.title} — <em style="color:var(--text-tertiary)">${n.source}</em></span>`
    ).join('');
    breakingScroll.innerHTML = scrollText + scrollText;
  }

  // Refresh flight radar panel
  const flightCard = document.querySelector('.flight-radar-card');
  if (flightCard) {
    flightCard.outerHTML = createFlightRadarPanel();
    initFlightRadarTabs();
  }

  // Refresh flight markers on map
  refreshFlightLayer();

  // Refresh train markers on map
  refreshTrainLayer();

  // Refresh stock heatmap
  const stockHeatmap = document.getElementById('stockHeatmap');
  if (stockHeatmap) {
    const wrapper = stockHeatmap.closest('.card');
    if (wrapper) {
      wrapper.outerHTML = createStockHeatmapPanel();
      initStockHeatmapTabs();
    }
  }


}

// ─── Auto-refresh every 60s ───
setInterval(async () => {
  await fetchAllLiveData();
}, 60_000);

// ─── Fast map marker refresh every 5s for smooth train/flight movement ───
setInterval(() => {
  if (document.getElementById('indiaMap')) {
    refreshTrainLayer();
    refreshFlightLayer();
  }
}, 5_000);

// ─── Boot ───
document.addEventListener('DOMContentLoaded', () => {
  render();

  // Fetch live data after initial render (non-blocking)
  fetchAllLiveData().catch(err => {
    console.error('[India Monitor] Initial live data fetch failed:', err);
  });
});

// Handle window resize for map
window.addEventListener('resize', () => {
  // Leaflet handles resize internally
});
