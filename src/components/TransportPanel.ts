// ─── Transport Panel Component — Full Page with Filters & Map ───

import { getTrainStatuses, getMetroStatuses, getFlightStatuses, getActiveTrainsOnMap, getTotalTrainCount, type TrainStatus } from '../services/transportService';
import { icons } from '../utils/icons';

// Cache train statuses to keep them stable across re-renders within the same page
let cachedTrainStatuses: TrainStatus[] | null = null;

function getStableTrainStatuses(): TrainStatus[] {
  if (!cachedTrainStatuses) cachedTrainStatuses = getTrainStatuses();
  return cachedTrainStatuses;
}

export function invalidateTrainCache(): void {
  cachedTrainStatuses = null;
}

export function createTransportPanel(isFullPage = false): string {
  const trains = getStableTrainStatuses();
  const metros = getMetroStatuses();
  const flights = getFlightStatuses();
  const onTime = trains.filter(t => t.status === 'on-time').length;
  const delayed = trains.filter(t => t.status === 'delayed').length;
  const running = trains.filter(t => t.status === 'running').length;
  const cancelled = trains.filter(t => t.status === 'cancelled').length;
  const types = [...new Set(trains.map(t => t.type))];

  const statsRow = `
    <div class="transport-stats-row">
      <div class="t-stat"><div class="t-stat-val" style="color:var(--accent-cyan);">${getTotalTrainCount()}</div><div class="t-stat-lbl">On Map</div></div>
      <div class="t-stat stat-clickable" data-filter-status="on-time"><div class="t-stat-val" style="color:var(--status-success);">${onTime}</div><div class="t-stat-lbl">On Time</div></div>
      <div class="t-stat stat-clickable" data-filter-status="running"><div class="t-stat-val" style="color:var(--status-warning);">${running}</div><div class="t-stat-lbl">Running</div></div>
      <div class="t-stat stat-clickable" data-filter-status="delayed"><div class="t-stat-val" style="color:var(--accent-orange);">${delayed}</div><div class="t-stat-lbl">Delayed</div></div>
      <div class="t-stat stat-clickable" data-filter-status="cancelled"><div class="t-stat-val" style="color:var(--status-danger);">${cancelled}</div><div class="t-stat-lbl">Cancelled</div></div>
      <div class="t-stat"><div class="t-stat-val" style="color:var(--accent-purple);">${metros.filter(m => m.status === 'normal').length}/${metros.length}</div><div class="t-stat-lbl">Metro OK</div></div>
    </div>
  `;

  const filterBar = isFullPage ? `
    <div class="filter-bar" id="trainFilterBar">
      <div class="filter-search">
        ${icons.search(14)}
        <input type="text" class="filter-input" id="trainSearchInput" placeholder="Search train name, number, route...">
      </div>
      <div class="filter-chips" id="trainTypeFilters">
        <button class="filter-chip active" data-type="all">All</button>
        ${types.map(t => `<button class="filter-chip" data-type="${t}">${t}</button>`).join('')}
      </div>
      <div class="filter-chips" id="trainStatusFilters">
        <button class="filter-chip active" data-status="all">All Status</button>
        <button class="filter-chip" data-status="on-time">${icons.check(10)} On Time (${onTime})</button>
        <button class="filter-chip" data-status="running">${icons.train(10)} Running (${running})</button>
        <button class="filter-chip" data-status="delayed">${icons.clock(10)} Delayed (${delayed})</button>
        <button class="filter-chip" data-status="cancelled">${icons.alert(10)} Cancelled (${cancelled})</button>
      </div>
    </div>
  ` : '';

  return `
    <div class="card transport-card" style="grid-column: 1 / -1;">
      <div class="card-header">
        <div class="card-title">
          ${icons.train(16)}
          Public Transport
        </div>
        <div class="card-actions">
          <button class="card-tab active" data-transport-tab="trains">${icons.train(12)} Railways (${trains.length})</button>
          <button class="card-tab" data-transport-tab="metro">${icons.building(12)} Metro (${metros.length})</button>
          <button class="card-tab" data-transport-tab="flights">${icons.plane(12)} Flights (${flights.length})</button>
        </div>
      </div>
      ${isFullPage ? statsRow : ''}
      ${filterBar}
      <div class="card-body" style="max-height:${isFullPage ? 'none' : '350px'}; overflow-y:auto;">
        <div id="transportTrains">${renderTrains(trains, isFullPage)}</div>
        <div id="transportMetro" style="display:none;">${renderMetros(metros)}</div>
        <div id="transportFlights" style="display:none;">${renderFlights(flights)}</div>
      </div>
    </div>
  `;
}

function renderTrains(trains: TrainStatus[], detailed = false): string {
  return `
    <div class="train-list" id="trainListContainer">
      ${trains.map(t => {
        const statusClass = `status-${t.status.replace(' ', '-')}`;
        const typeColor = ({ Rajdhani: '#ef4444', Shatabdi: '#3b82f6', 'Vande Bharat': '#06b6d4', Duronto: '#a855f7', Superfast: '#22c55e', Express: '#f59e0b', Local: '#6b7280' } as Record<string, string>)[t.type] || '#f59e0b';
        const statusIcon = t.status === 'on-time' ? icons.check(10) : t.status === 'delayed' ? icons.clock(10) : t.status === 'cancelled' ? icons.alert(10) : icons.train(10);
        return `
          <div class="train-item" data-train-no="${t.trainNo}" data-train-type="${t.type}" data-train-status="${t.status}" data-train-name="${t.trainName}" data-train-route="${t.from} ${t.to}">
            <div class="train-item-left">
              <div class="train-no">${t.trainNo}</div>
              <div class="train-type-tag" style="background:${typeColor}20;color:${typeColor};border:1px solid ${typeColor}30;">${t.type}</div>
            </div>
            <div class="train-item-center">
              <div class="train-name">${t.trainName}</div>
              <div class="train-route-info">
                <span class="train-from">${t.from}</span>
                <span class="train-arrow">→</span>
                <span class="train-to">${t.to}</span>
              </div>
              ${detailed ? `<div class="train-detail-row">
                <span class="train-detail-tag">${icons.clock(9)} Dep: ${t.departureTime}</span>
                <span class="train-detail-tag">${icons.clock(9)} Arr: ${t.arrivalTime}</span>
                <span class="train-detail-tag">${icons.pin(9)} ${t.currentStation}${t.platform ? ' P' + t.platform : ''}</span>
                <span class="train-detail-tag">${icons.navigation(9)} ${t.zone}</span>
              </div>` : ''}
            </div>
            <div class="train-item-right">
              <span class="status-badge ${statusClass}">${statusIcon} ${t.status}</span>
              ${t.delay > 0 ? `<div class="delay-minutes">+${t.delay} min late</div>` : ''}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderMetros(metros: ReturnType<typeof getMetroStatuses>): string {
  return `
    <div class="metro-list">
      ${metros.map(m => {
        const statusClass = `status-${m.status}`;
        return `
          <div class="metro-item">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="metro-color-dot" style="background: ${m.lineColor};"></span>
            </div>
            <div>
              <div class="metro-line-name">${m.line}</div>
              <div class="metro-city">${m.city} • Freq: ${m.frequency} • ${(m.ridership / 1000).toFixed(0)}K riders/day</div>
            </div>
            <div style="text-align:right;">
              <span class="status-badge ${statusClass}">${m.status}</span>
              ${m.status !== 'normal' ? `<div style="font-size:9px; color:var(--text-tertiary); margin-top:2px;">${m.message}</div>` : ''}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderFlights(flights: ReturnType<typeof getFlightStatuses>): string {
  return `
    <div class="flight-list">
      ${flights.map(f => {
        const statusClass = `status-${f.status.replace(' ', '-')}`;
        return `
          <div class="flight-item">
            <div>
              <div class="flight-no">${f.flightNo}</div>
            </div>
            <div>
              <div class="flight-route">${f.from} → ${f.to}</div>
              <div class="flight-airline">${f.airline} • Dep: ${f.departureTime} ${f.gate ? '• Gate ' + f.gate : ''}</div>
            </div>
            <div style="text-align:right;">
              <span class="status-badge ${statusClass}">${f.status}</span>
              ${f.delay > 0 ? `<div class="delay-minutes">+${f.delay} min</div>` : ''}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

export function initTransportTabs(): void {
  document.querySelectorAll('[data-transport-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-transport-tab');

      document.querySelectorAll('[data-transport-tab]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const trains = document.getElementById('transportTrains');
      const metro = document.getElementById('transportMetro');
      const flights = document.getElementById('transportFlights');

      if (trains) trains.style.display = tab === 'trains' ? '' : 'none';
      if (metro) metro.style.display = tab === 'metro' ? '' : 'none';
      if (flights) flights.style.display = tab === 'flights' ? '' : 'none';
    });
  });
}

export function initTrainFilters(): void {
  const searchInput = document.getElementById('trainSearchInput') as HTMLInputElement;
  const typeFilters = document.querySelectorAll('#trainTypeFilters .filter-chip[data-type]');
  const statusFilters = document.querySelectorAll('#trainStatusFilters .filter-chip[data-status]');
  const container = document.getElementById('trainListContainer');

  if (!container) return;

  let activeType = 'all';
  let activeStatus = 'all';

  function applyFilters() {
    const query = (searchInput?.value || '').toLowerCase();
    let visibleCount = 0;
    container!.querySelectorAll('.train-item').forEach(item => {
      const el = item as HTMLElement;
      const trainType = el.dataset.trainType || '';
      const trainStatus = el.dataset.trainStatus || '';
      const trainName = (el.dataset.trainName || '').toLowerCase();
      const trainNo = (el.dataset.trainNo || '').toLowerCase();
      const trainRoute = (el.dataset.trainRoute || '').toLowerCase();

      const matchType = activeType === 'all' || trainType === activeType;
      const matchStatus = activeStatus === 'all' || trainStatus === activeStatus;
      const matchSearch = !query || trainName.includes(query) || trainNo.includes(query) || trainRoute.includes(query);

      const show = matchType && matchStatus && matchSearch;
      el.style.display = show ? '' : 'none';
      if (show) visibleCount++;
    });

    // Show/hide empty state
    let emptyEl = container!.querySelector('.filter-empty') as HTMLElement;
    if (visibleCount === 0) {
      if (!emptyEl) {
        emptyEl = document.createElement('div');
        emptyEl.className = 'filter-empty';
        emptyEl.style.cssText = 'text-align:center;padding:30px 20px;color:var(--text-tertiary);font-size:13px;';
        emptyEl.textContent = 'No trains match your filters';
        container!.appendChild(emptyEl);
      }
      emptyEl.style.display = '';
    } else if (emptyEl) {
      emptyEl.style.display = 'none';
    }
  }

  function setStatusFilter(status: string) {
    activeStatus = status;
    statusFilters.forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-status') === status);
    });
    applyFilters();
  }

  searchInput?.addEventListener('input', applyFilters);

  typeFilters.forEach(chip => {
    chip.addEventListener('click', () => {
      typeFilters.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeType = chip.getAttribute('data-type') || 'all';
      applyFilters();
    });
  });

  statusFilters.forEach(chip => {
    chip.addEventListener('click', () => {
      setStatusFilter(chip.getAttribute('data-status') || 'all');
    });
  });

  // Clickable stat cards filter
  document.querySelectorAll('.stat-clickable[data-filter-status]').forEach(stat => {
    stat.addEventListener('click', () => {
      const status = (stat as HTMLElement).dataset.filterStatus || 'all';
      setStatusFilter(status);
      container!.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}
