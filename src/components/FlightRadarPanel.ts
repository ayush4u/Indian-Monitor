// ─── Flight Radar Panel Component ───

import { getFlightData, guessAirline, type FlightRadarSummary, type LiveFlight } from '../services/flightRadarService';
import { icons } from '../utils/icons';

export function createFlightRadarPanel(isFullPage = false): string {
  const data = getFlightData();

  const statsRow = isFullPage ? `
    <div class="transport-stats-row">
      <div class="t-stat"><div class="t-stat-val" style="color:var(--accent-cyan);">${data.totalCount}</div><div class="t-stat-lbl">Total Aircraft</div></div>
      <div class="t-stat"><div class="t-stat-val" style="color:var(--accent-green);">${data.airborne}</div><div class="t-stat-lbl">Airborne</div></div>
      <div class="t-stat"><div class="t-stat-val" style="color:var(--accent-orange);">${data.onGround}</div><div class="t-stat-lbl">On Ground</div></div>
      <div class="t-stat"><div class="t-stat-val" style="color:var(--accent-purple);">${data.avgAltitude > 0 ? Math.round(data.avgAltitude * 3.281).toLocaleString() : '—'}ft</div><div class="t-stat-lbl">Avg Alt</div></div>
      <div class="t-stat"><div class="t-stat-val" style="color:var(--accent-blue);">${data.flights.length > 0 ? Math.round(data.flights.filter(f => f.velocity > 0).reduce((a, f) => a + f.velocity * 3.6, 0) / Math.max(1, data.flights.filter(f => f.velocity > 0).length)) : '—'}</div><div class="t-stat-lbl">Avg km/h</div></div>
      <div class="t-stat"><div class="t-stat-val" style="color:var(--accent-teal);">${data.isLive ? 'LIVE' : '...'}</div><div class="t-stat-lbl">OpenSky</div></div>
    </div>
  ` : '';

  const filterBar = isFullPage ? `
    <div class="filter-bar" id="flightFilterBar">
      <div class="filter-search">
        ${icons.search(14)}
        <input type="text" class="filter-input" id="flightSearchInput" placeholder="Search callsign, airline...">
      </div>
      <div class="filter-chips">
        <button class="filter-chip active" data-flt-status="all">All</button>
        <button class="filter-chip" data-flt-status="air">${icons.plane(10)} Airborne</button>
        <button class="filter-chip" data-flt-status="ground">${icons.navigation(10)} On Ground</button>
      </div>
    </div>
  ` : '';

  return `
    <div class="card flight-radar-card" style="${isFullPage ? 'grid-column: 1 / -1;' : ''}">
      <div class="card-header">
        <div class="card-title">
          ${icons.plane(16)}
          Live Flight Radar
          ${data.isLive ? '<span class="live-badge-sm"><span class="live-dot"></span>LIVE</span>' : '<span class="offline-badge">LOADING</span>'}
        </div>
        <div class="card-actions">
          <button class="card-tab active" data-flight-tab="overview">${icons.activity(12)} Overview</button>
          <button class="card-tab" data-flight-tab="list">${icons.plane(12)} Flights</button>
          <button class="card-tab" data-flight-tab="airlines">${icons.chart(12)} Airlines</button>
        </div>
      </div>
      ${statsRow}
      ${filterBar}
      <div class="card-body" style="max-height: ${isFullPage ? '600px' : '350px'};">
        <div id="flightOverview">${renderFlightOverview(data)}</div>
        <div id="flightList" style="display:none;">${renderFlightList(data, isFullPage)}</div>
        <div id="flightAirlines" style="display:none;">${renderAirlineBreakdown(data)}</div>
      </div>
    </div>
  `;
}

function renderFlightOverview(data: FlightRadarSummary): string {
  return `
    <div class="flight-stats">
      <div class="flight-stat">
        <div class="flight-stat-value" style="color: var(--accent-cyan);">${data.totalCount}</div>
        <div class="flight-stat-label">Total Aircraft</div>
      </div>
      <div class="flight-stat">
        <div class="flight-stat-value" style="color: var(--accent-green);">${data.airborne}</div>
        <div class="flight-stat-label">In Flight</div>
      </div>
      <div class="flight-stat">
        <div class="flight-stat-value" style="color: var(--accent-orange);">${data.onGround}</div>
        <div class="flight-stat-label">On Ground</div>
      </div>
      <div class="flight-stat">
        <div class="flight-stat-value" style="color: var(--accent-purple);">${data.avgAltitude > 0 ? Math.round(data.avgAltitude * 3.281).toLocaleString() : '—'}ft</div>
        <div class="flight-stat-label">Avg Altitude</div>
      </div>
    </div>
    <div style="margin-top:12px; font-size:10px; color:var(--text-tertiary);">
      Data source: OpenSky Network • Updated: ${data.lastUpdated.toLocaleTimeString('en-IN')}
      <br>Toggle "Flights" layer on the map to see aircraft positions
    </div>
  `;
}

function renderFlightList(data: FlightRadarSummary, showMore = false): string {
  const flights = data.flights
    .filter(f => f.callsign)
    .sort((a, b) => b.altitude - a.altitude);

  const initialCount = showMore ? 30 : 15;
  const visible = flights.slice(0, initialCount);
  const hasMore = flights.length > initialCount;

  if (!flights.length) return '<div style="padding:16px;color:var(--text-tertiary);">Loading flight data...</div>';

  return `
    <div class="flight-list-table" id="flightListContainer" data-total="${flights.length}" data-loaded="${initialCount}">
      ${visible.map(f => renderFlightRow(f)).join('')}
      ${hasMore ? `
        <div class="flight-load-more" id="flightLoadMore">
          <span style="color:var(--text-tertiary); font-size:11px;">Scroll for more • ${flights.length - initialCount} remaining</span>
        </div>
      ` : ''}
    </div>
  `;
}

function renderFlightRow(f: LiveFlight): string {
  const airline = guessAirline(f.callsign);
  const altFt = Math.round(f.altitude * 3.281);
  const speedKmh = Math.round(f.velocity * 3.6);
  return `
    <div class="flight-row" data-callsign="${sanitize(f.callsign)}" data-airline="${sanitize(airline.name)}" data-status="${f.onGround ? 'ground' : 'air'}">
      <div class="flight-callsign" style="color:${airline.color};">${sanitize(f.callsign)}</div>
      <div class="flight-details">
        <span class="flight-airline">${sanitize(airline.name)}</span>
        <span class="flight-meta">${altFt.toLocaleString()}ft • ${speedKmh}km/h • ${Math.round(f.heading)}°</span>
      </div>
      <div class="flight-status-badge ${f.onGround ? 'ground' : 'air'}">${f.onGround ? 'GND' : 'AIR'}</div>
    </div>
  `;
}

function renderAirlineBreakdown(data: FlightRadarSummary): string {
  const airlineCount: Record<string, { count: number; name: string; color: string }> = {};

  data.flights.filter(f => f.callsign).forEach(f => {
    const airline = guessAirline(f.callsign);
    if (!airlineCount[airline.code]) {
      airlineCount[airline.code] = { count: 0, name: airline.name, color: airline.color };
    }
    airlineCount[airline.code].count++;
  });

  const sorted = Object.entries(airlineCount).sort((a, b) => b[1].count - a[1].count);
  const total = data.totalCount || 1;

  return `
    <div class="airline-breakdown">
      ${sorted.slice(0, 12).map(([code, info]) => {
        const pct = ((info.count / total) * 100).toFixed(1);
        return `
          <div class="airline-row">
            <div class="airline-label">
              <span class="airline-dot" style="background:${info.color};"></span>
              <span>${sanitize(info.name)}</span>
              <span style="color:var(--text-tertiary); font-size:10px; margin-left:4px;">${sanitize(code)}</span>
            </div>
            <div class="airline-bar-container">
              <div class="airline-bar" style="width:${pct}%; background:${info.color};"></div>
            </div>
            <span class="airline-count">${info.count}</span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function sanitize(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function initFlightRadarTabs(): void {
  document.querySelectorAll('[data-flight-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-flight-tab');
      document.querySelectorAll('[data-flight-tab]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const overview = document.getElementById('flightOverview');
      const list = document.getElementById('flightList');
      const airlines = document.getElementById('flightAirlines');

      if (overview) overview.style.display = tab === 'overview' ? '' : 'none';
      if (list) list.style.display = tab === 'list' ? '' : 'none';
      if (airlines) airlines.style.display = tab === 'airlines' ? '' : 'none';
    });
  });
}

export function initFlightFilters(): void {
  const searchInput = document.getElementById('flightSearchInput') as HTMLInputElement;
  const statusFilters = document.querySelectorAll('.filter-chip[data-flt-status]');
  const container = document.getElementById('flightListContainer');

  if (!container) return;

  let activeStatus = 'all';

  function applyFilters() {
    const query = (searchInput?.value || '').toLowerCase();
    container!.querySelectorAll('.flight-row').forEach(item => {
      const el = item as HTMLElement;
      const callsign = (el.dataset.callsign || '').toLowerCase();
      const airline = (el.dataset.airline || '').toLowerCase();
      const status = el.dataset.status || '';

      const matchStatus = activeStatus === 'all' || status === activeStatus;
      const matchSearch = !query || callsign.includes(query) || airline.includes(query);

      el.style.display = matchStatus && matchSearch ? '' : 'none';
    });
  }

  searchInput?.addEventListener('input', applyFilters);

  statusFilters.forEach(chip => {
    chip.addEventListener('click', () => {
      statusFilters.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeStatus = chip.getAttribute('data-flt-status') || 'all';
      applyFilters();
    });
  });

  // Lazy loading on scroll
  const cardBody = container.closest('.card-body');
  if (cardBody) {
    cardBody.addEventListener('scroll', () => {
      const { scrollTop, scrollHeight, clientHeight } = cardBody;
      if (scrollTop + clientHeight >= scrollHeight - 60) {
        loadMoreFlights();
      }
    });
  }
}

function loadMoreFlights(): void {
  const container = document.getElementById('flightListContainer');
  if (!container) return;

  const loaded = parseInt(container.dataset.loaded || '0');
  const total = parseInt(container.dataset.total || '0');
  if (loaded >= total) return;

  const data = getFlightData();
  const flights = data.flights.filter(f => f.callsign).sort((a, b) => b.altitude - a.altitude);
  const batchSize = 20;
  const nextBatch = flights.slice(loaded, loaded + batchSize);

  const loadMoreEl = document.getElementById('flightLoadMore');
  if (loadMoreEl) loadMoreEl.remove();

  nextBatch.forEach(f => {
    const airline = guessAirline(f.callsign);
    const altFt = Math.round(f.altitude * 3.281);
    const speedKmh = Math.round(f.velocity * 3.6);
    const div = document.createElement('div');
    div.className = 'flight-row';
    div.dataset.callsign = f.callsign;
    div.dataset.airline = airline.name;
    div.dataset.status = f.onGround ? 'ground' : 'air';
    div.innerHTML = `
      <div class="flight-callsign" style="color:${airline.color};">${f.callsign}</div>
      <div class="flight-details">
        <span class="flight-airline">${airline.name}</span>
        <span class="flight-meta">${altFt.toLocaleString()}ft • ${speedKmh}km/h • ${Math.round(f.heading)}°</span>
      </div>
      <div class="flight-status-badge ${f.onGround ? 'ground' : 'air'}">${f.onGround ? 'GND' : 'AIR'}</div>
    `;
    container.appendChild(div);
  });

  const newLoaded = loaded + nextBatch.length;
  container.dataset.loaded = String(newLoaded);

  if (newLoaded < total) {
    const more = document.createElement('div');
    more.className = 'flight-load-more';
    more.id = 'flightLoadMore';
    more.innerHTML = `<span style="color:var(--text-tertiary); font-size:11px;">Scroll for more • ${total - newLoaded} remaining</span>`;
    container.appendChild(more);
  }
}
