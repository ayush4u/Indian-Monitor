// ─── Train Route Detail Component — Full Station-by-Station View ───

import { getTrainRouteDetail, getActiveTrainsOnMap, type RouteStop } from '../services/transportService';
import { icons } from '../utils/icons';

const TRAIN_COLORS: Record<string, string> = {
  Rajdhani: '#ef4444', Shatabdi: '#3b82f6', 'Vande Bharat': '#06b6d4',
  Duronto: '#a855f7', Superfast: '#22c55e', Express: '#f59e0b', Local: '#6b7280',
};

export function createTrainRoutePanel(trainNo: string): string {
  const detail = getTrainRouteDetail(trainNo);
  if (!detail) return '<div class="route-empty">Train not found</div>';

  const { train, stops } = detail;
  const color = TRAIN_COLORS[train.tp] || '#f59e0b';

  // Find current progress
  const activeTrain = getActiveTrainsOnMap().find(t => t.trainNo === trainNo);
  const progress = activeTrain ? Math.round(activeTrain.progress * 100) : 0;
  const isRunning = !!activeTrain;
  const totalKm = stops.length > 0 ? stops[stops.length - 1].distanceKm : 0;
  const totalStops = stops.length;

  return `
    <div class="route-detail-panel" style="grid-column: 1 / -1;">
      <div class="route-header" style="border-left: 4px solid ${color};">
        <div class="route-header-top">
          <div>
            <span class="route-train-no">${sanitize(train.no)}</span>
            <span class="route-train-name">${sanitize(train.nm)}</span>
          </div>
          <span class="route-type-badge" style="background:${color};">${sanitize(train.tp)}</span>
        </div>
        <div class="route-header-meta">
          <span>${icons.navigation(12)} ${sanitize(stops[0].station)} → ${sanitize(stops[stops.length - 1].station)}</span>
          <span>${icons.clock(12)} ${train.dur}h journey</span>
          <span>${icons.train(12)} ${totalStops} stops</span>
          <span>${totalKm} km</span>
          ${isRunning ? `<span class="route-live-tag"><span class="live-dot"></span>RUNNING • ${progress}%</span>` : '<span class="route-sched-tag">SCHEDULED</span>'}
        </div>
        ${isRunning ? `
          <div class="route-progress-bar">
            <div class="route-progress-fill" style="width:${progress}%;background:${color};"></div>
          </div>
        ` : ''}
      </div>

      <div class="route-stops">
        ${renderStopsWithGroups(stops, isRunning, progress, color)}
      </div>
    </div>
  `;
}

function renderStopsWithGroups(stops: RouteStop[], isRunning: boolean, progress: number, color: string): string {
  // Group stops: major stops (named stations) vs intermediate ("En Route")
  const groups: { type: 'major' | 'intermediate'; stops: { stop: RouteStop; index: number }[] }[] = [];
  let currentIntermediates: { stop: RouteStop; index: number }[] = [];

  stops.forEach((stop, i) => {
    const isMajor = stop.isOrigin || stop.isDestination || stop.station !== 'En Route';
    if (isMajor) {
      if (currentIntermediates.length > 0) {
        groups.push({ type: 'intermediate', stops: currentIntermediates });
        currentIntermediates = [];
      }
      groups.push({ type: 'major', stops: [{ stop, index: i }] });
    } else {
      currentIntermediates.push({ stop, index: i });
    }
  });
  if (currentIntermediates.length > 0) {
    groups.push({ type: 'intermediate', stops: currentIntermediates });
  }

  return groups.map((group, gi) => {
    if (group.type === 'major') {
      const { stop, index: i } = group.stops[0];
      return renderMajorStop(stop, i, stops.length, isRunning, progress, color);
    } else {
      // Collapsible intermediate stations
      const count = group.stops.length;
      const fromKm = group.stops[0].stop.distanceKm;
      const toKm = group.stops[group.stops.length - 1].stop.distanceKm;
      return `
        <div class="route-intermediate-group" data-group="${gi}">
          <div class="route-intermediate-header" onclick="this.parentElement.classList.toggle('expanded')">
            <div class="route-stop-timeline">
              <div class="route-stop-dot intermediate-dot" style="border-color: var(--border-subtle);"></div>
              <div class="route-stop-line"></div>
            </div>
            <div class="route-intermediate-label">
              ${icons.more(12)} <span>${count} intermediate station${count > 1 ? 's' : ''}</span>
              <span class="route-intermediate-km">${fromKm} — ${toKm} km</span>
              <span class="route-intermediate-expand">${icons.chevronDown(12)}</span>
            </div>
          </div>
          <div class="route-intermediate-list">
            ${group.stops.map(({ stop, index: i }) => renderMajorStop(stop, i, stops.length, isRunning, progress, color, true)).join('')}
          </div>
        </div>
      `;
    }
  }).join('');
}

function renderMajorStop(stop: RouteStop, i: number, totalStops: number, isRunning: boolean, progress: number, color: string, isIntermediate = false): string {
  const isPassed = isRunning && stop.distancePercent <= progress;
  const isCurrent = isRunning && !stop.isOrigin && !stop.isDestination &&
    stop.distancePercent <= progress + 8 && stop.distancePercent >= progress - 8;
  const isLate = stop.delayMinutes > 0;

  return `
    <div class="route-stop ${stop.isOrigin ? 'origin' : ''} ${stop.isDestination ? 'destination' : ''} ${isPassed ? 'passed' : ''} ${isCurrent ? 'current' : ''} ${isIntermediate ? 'intermediate-expanded' : ''}">
      <div class="route-stop-timeline">
        <div class="route-stop-dot ${stop.isOrigin || stop.isDestination ? 'terminal-dot' : ''}" style="border-color:${isPassed || stop.isOrigin ? color : 'var(--border-default)'};${isPassed || stop.isOrigin ? `background:${color};` : ''}"></div>
        ${!stop.isDestination ? `<div class="route-stop-line" style="${isPassed ? `background:${color};` : ''}"></div>` : ''}
      </div>
      <div class="route-stop-info">
        <div class="route-stop-station-row">
          <span class="route-stop-station">
            ${sanitize(stop.station)}
          </span>
          <div class="route-stop-badges">
            ${stop.isOrigin ? '<span class="route-origin-tag">ORIGIN</span>' : ''}
            ${stop.isDestination ? '<span class="route-dest-tag">DESTINATION</span>' : ''}
            ${isCurrent ? '<span class="route-current-tag">◉ NEAR</span>' : ''}
            ${isLate ? `<span class="route-late-tag">Late +${stop.delayMinutes}m</span>` : ''}
            ${stop.dayNumber > 1 ? `<span class="route-day-tag">Day ${stop.dayNumber}</span>` : ''}
          </div>
        </div>
        <div class="route-stop-details">
          <div class="route-stop-times">
            <span class="route-time-block"><span class="route-time-label">Arr</span> <span class="route-time-value">${stop.arrivalTime}</span></span>
            <span class="route-time-block"><span class="route-time-label">Dep</span> <span class="route-time-value">${stop.departureTime}</span></span>
          </div>
          <div class="route-stop-meta">
            ${stop.haltMinutes > 0 ? `<span class="route-meta-item">${icons.clock(10)} ${stop.haltMinutes}m halt</span>` : ''}
            <span class="route-meta-item">${icons.navigation(10)} ${stop.distanceKm} km</span>
            <span class="route-meta-item">PF ${stop.platform}</span>
          </div>
        </div>
      </div>
    </div>
  `;
}

function sanitize(str: string): string {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}
