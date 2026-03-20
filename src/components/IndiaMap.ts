// ─── India Map Component — Live Radar ───

import L from 'leaflet';
import { STATES, ZONE_COLORS } from '../data/states';
import { INDIA_BOUNDS, METRO_CITIES, MAJOR_AIRPORTS } from '../utils/constants';
import { getFlightData, guessAirline, AIRPORTS } from '../services/flightRadarService';
import { getActiveTrainsOnMap, type TrainOnMap } from '../services/transportService';
import { icons } from '../utils/icons';

let map: L.Map | null = null;
let selectedEntity: { type: 'flight' | 'train'; id: string } | null = null;

// Train type → color
const TRAIN_COLORS: Record<string, string> = {
  Rajdhani: '#ef4444', Shatabdi: '#3b82f6', 'Vande Bharat': '#06b6d4',
  Duronto: '#a855f7', Superfast: '#22c55e', Express: '#f59e0b', Local: '#6b7280',
};

function aircraftSVG(heading: number, color: string, size: number): string {
  const glowColor = color === '#6b7280' ? 'rgba(107,114,128,0.3)' : 
                     color === '#00ff88' ? 'rgba(0,255,136,0.5)' : 'rgba(255,215,0,0.4)';
  return `<div style="transform:rotate(${heading}deg);width:${size}px;height:${size}px;filter:drop-shadow(0 0 6px ${glowColor}) drop-shadow(0 1px 3px rgba(0,0,0,0.9));">
    <svg viewBox="-14 -14 28 28" width="${size}" height="${size}">
      <defs>
        <radialGradient id="ag${heading}" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stop-color="${color}" stop-opacity="1"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0.6"/>
        </radialGradient>
      </defs>
      <circle cx="0" cy="0" r="12" fill="${glowColor}" opacity="0.15"/>
      <path d="M0,-11 L1.8,-6 L2,-4 L11,0.5 L11,2 L2,0 L1.5,5 L4,8.5 L4,9.5 L0,7.5 L-4,9.5 L-4,8.5 L-1.5,5 L-2,0 L-11,2 L-11,0.5 L-2,-4 L-1.8,-6Z"
        fill="url(#ag${heading})" stroke="rgba(255,255,255,0.3)" stroke-width="0.4"/>
      <ellipse cx="0" cy="-6" rx="0.8" ry="2" fill="rgba(255,255,255,0.4)"/>
    </svg>
  </div>`;
}

function trainSVG(heading: number, color: string, size: number): string {
  return `<div style="transform:rotate(${heading}deg);width:${size}px;height:${size}px;filter:drop-shadow(0 0 5px ${color}66) drop-shadow(0 1px 4px rgba(0,0,0,0.9));">
    <svg viewBox="0 0 24 24" width="${size}" height="${size}">
      <defs>
        <linearGradient id="tg${heading}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${color}" stop-opacity="1"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0.7"/>
        </linearGradient>
      </defs>
      <rect x="7" y="2" width="10" height="16" rx="4" fill="url(#tg${heading})" stroke="rgba(255,255,255,0.2)" stroke-width="0.5"/>
      <rect x="9" y="4" width="6" height="5" rx="1.5" fill="rgba(255,255,255,0.25)"/>
      <line x1="9" y1="11" x2="15" y2="11" stroke="rgba(255,255,255,0.15)" stroke-width="0.5"/>
      <circle cx="9.5" cy="15" r="1.3" fill="rgba(255,255,255,0.8)"/>
      <circle cx="14.5" cy="15" r="1.3" fill="rgba(255,255,255,0.8)"/>
      <rect x="8" y="19" width="8" height="2.5" rx="1.2" fill="${color}" opacity="0.6"/>
      <rect x="10.5" y="20" width="3" height="1" rx="0.5" fill="rgba(255,255,255,0.3)"/>
    </svg>
  </div>`;
}

export function createMapCard(): string {
  return `
    <div class="card map-card" id="mapCard">
      <div class="card-header">
        <div class="card-title">
          ${icons.satellite(14)}
          India Live Radar
          <span class="live-badge-sm"><span class="live-dot"></span>LIVE</span>
        </div>
        <div class="card-actions">
          <button class="card-action-btn active" data-layer="states">States</button>
          <button class="card-action-btn" data-layer="metro">Metro</button>
          <button class="card-action-btn" data-layer="airports">Airports</button>
          <button class="card-action-btn active" data-layer="flights">${icons.plane(10)} Flights</button>
          <button class="card-action-btn active" data-layer="trains">${icons.train(10)} Trains</button>
          <button class="map-fullscreen-btn" id="mapFullscreenBtn" title="Toggle Fullscreen">⛶</button>
        </div>
      </div>
      <div class="map-wrapper">
        <div class="map-container" id="indiaMap"></div>
        <div class="map-info-overlay" id="mapInfoOverlay"></div>
      </div>
    </div>
  `;
}

export function createEmbeddedMapCard(mode: 'trains' | 'flights' | 'all'): string {
  const layerBtns = mode === 'trains'
    ? `<button class="card-action-btn active" data-layer="trains">Trains</button>
       <button class="card-action-btn" data-layer="states">States</button>`
    : mode === 'flights'
    ? `<button class="card-action-btn active" data-layer="flights">Flights</button>
       <button class="card-action-btn" data-layer="airports">Airports</button>`
    : `<button class="card-action-btn active" data-layer="flights">Flights</button>
       <button class="card-action-btn active" data-layer="trains">Trains</button>
       <button class="card-action-btn" data-layer="states">States</button>`;

  return `
    <div class="card map-card embedded-map" id="mapCard" style="grid-column: 1 / -1;">
      <div class="card-header" style="padding:8px 12px;">
        <div class="card-title" style="font-size:12px; gap:6px;">
          ${icons.satellite(12)} Live Radar
          <span class="live-badge-sm"><span class="live-dot"></span>LIVE</span>
        </div>
        <div class="card-actions">
          ${layerBtns}
          <button class="map-fullscreen-btn" id="mapFullscreenBtn" title="Toggle Fullscreen">⛶</button>
        </div>
      </div>
      <div class="map-wrapper" style="height: 380px;">
        <div class="map-container" id="indiaMap"></div>
        <div class="map-info-overlay" id="mapInfoOverlay"></div>
      </div>
    </div>
  `;
}

export function initMap(onStateClick: (stateCode: string) => void, mode?: 'trains' | 'flights' | 'all'): void {
  const container = document.getElementById('indiaMap');
  if (!container || map) return;

  map = L.map('indiaMap', {
    center: INDIA_BOUNDS.center,
    zoom: INDIA_BOUNDS.zoom,
    minZoom: INDIA_BOUNDS.minZoom,
    maxZoom: INDIA_BOUNDS.maxZoom,
    maxBounds: L.latLngBounds(INDIA_BOUNDS.bounds[0], INDIA_BOUNDS.bounds[1]),
    maxBoundsViscosity: 1.0,
    zoomControl: true,
    attributionControl: false,
  });

  // Dark tile layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  // Add layers
  addStateMarkers(onStateClick);
  addMetroMarkers();
  addAirportMarkers();
  refreshFlightLayer();
  refreshTrainLayer();

  // Enable layers based on mode
  const showFlights = !mode || mode === 'flights' || mode === 'all';
  const showTrains = !mode || mode === 'trains' || mode === 'all';
  const showAirports = !mode || mode === 'flights' || mode === 'all';

  if (showFlights) flightLayer.addTo(map);
  if (showTrains) trainLayer.addTo(map);
  if (showAirports) airportLayer.addTo(map);
  overlayLayer.addTo(map);

  // Setup interactions
  setupLayerToggles();
  setupFullscreen();

  // Click on map to deselect
  map.on('click', () => clearSelection());
}

const stateLayer = L.layerGroup();
const metroLayer = L.layerGroup();
const airportLayer = L.layerGroup();
const flightLayer = L.layerGroup();
const trainLayer = L.layerGroup();
const overlayLayer = L.layerGroup(); // For route polylines & selection highlights

function addStateMarkers(onStateClick: (stateCode: string) => void): void {
  if (!map) return;

  STATES.forEach(state => {
    const color = ZONE_COLORS[state.zone] || '#ff6b35';
    const radius = Math.max(6, Math.min(18, Math.sqrt(state.population) * 1.5));

    const marker = L.circleMarker([state.lat, state.lng], {
      radius,
      fillColor: color,
      fillOpacity: 0.35,
      color,
      weight: 1.5,
      opacity: 0.7,
    });

    const popupContent = `
      <div class="state-popup">
        <h3>${state.name}</h3>
        <div class="state-popup-grid">
          <span class="state-popup-label">Capital</span>
          <span class="state-popup-value">${state.capital}</span>
          <span class="state-popup-label">Population</span>
          <span class="state-popup-value">${state.population}M</span>
          <span class="state-popup-label">Area</span>
          <span class="state-popup-value">${state.area.toLocaleString()} km²</span>
          <span class="state-popup-label">GDP</span>
          <span class="state-popup-value">$${state.gdp}B</span>
          <span class="state-popup-label">Literacy</span>
          <span class="state-popup-value">${state.literacy}%</span>
          <span class="state-popup-label">Zone</span>
          <span class="state-popup-value">${state.zone}</span>
        </div>
      </div>
    `;

    marker.bindPopup(popupContent, { maxWidth: 250 });
    marker.on('click', () => onStateClick(state.code));

    // Add state code label
    const label = L.divIcon({
      className: '',
      html: `<div style="
        font-size: 9px;
        font-weight: 700;
        color: ${color};
        text-shadow: 0 0 4px rgba(0,0,0,0.8);
        pointer-events: none;
        font-family: 'JetBrains Mono', monospace;
        text-align: center;
        white-space: nowrap;
      ">${state.code}</div>`,
      iconSize: [30, 14],
      iconAnchor: [15, -radius / 2 - 2],
    });

    const labelMarker = L.marker([state.lat, state.lng], { icon: label, interactive: false });

    stateLayer.addLayer(marker);
    stateLayer.addLayer(labelMarker);
  });

  stateLayer.addTo(map);
}

function addMetroMarkers(): void {
  if (!map) return;

  METRO_CITIES.forEach(metro => {
    const marker = L.circleMarker([metro.lat, metro.lng], {
      radius: 5,
      fillColor: metro.color,
      fillOpacity: 0.9,
      color: '#fff',
      weight: 1,
      opacity: 0.5,
    });

    marker.bindPopup(`
      <div class="state-popup">
        <h3>🚇 ${metro.name}</h3>
        <div class="state-popup-grid">
          <span class="state-popup-label">Lines</span>
          <span class="state-popup-value">${metro.lines}</span>
          <span class="state-popup-label">Stations</span>
          <span class="state-popup-value">${metro.stations}</span>
          <span class="state-popup-label">Daily Riders</span>
          <span class="state-popup-value">${metro.dailyRidership}</span>
        </div>
      </div>
    `, { maxWidth: 220 });

    metroLayer.addLayer(marker);
  });
}

function addAirportMarkers(): void {
  if (!map) return;

  // Count ground flights near each airport
  const data = getFlightData();
  const groundCounts: Record<string, number> = {};
  for (const ap of MAJOR_AIRPORTS) {
    groundCounts[ap.code] = data.flights.filter(f => f.onGround && Math.abs(f.lat - ap.lat) < 0.05 && Math.abs(f.lng - ap.lng) < 0.05).length;
  }

  MAJOR_AIRPORTS.forEach(airport => {
    const gc = groundCounts[airport.code] || 0;
    const icon = L.divIcon({
      className: '',
      html: `<div style="
        position: relative;
        width: 24px; height: 24px;
        display: flex; align-items: center; justify-content: center;
      ">
        <div style="
          width: 8px; height: 8px;
          background: #38bdf8;
          border: 1.5px solid rgba(255,255,255,0.6);
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(56,189,248,0.6);
        "></div>
        <div style="
          position: absolute; top: -8px; left: 14px;
          font-size: 8px; font-weight: 700;
          color: #38bdf8; white-space: nowrap;
          text-shadow: 0 0 3px rgba(0,0,0,0.9);
          font-family: 'JetBrains Mono', monospace;
        ">${airport.code}</div>
        ${gc > 0 ? `<div style="
          position: absolute; bottom: -6px; right: -6px;
          font-size: 7px; font-weight: 700;
          color: #0a0a0a; background: #fbbf24;
          border-radius: 6px; padding: 0 3px;
          min-width: 12px; text-align: center;
        ">${gc}</div>` : ''}
      </div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const marker = L.marker([airport.lat, airport.lng], { icon });

    marker.bindPopup(`
      <div class="state-popup">
        <h3>✈️ ${airport.code}</h3>
        <div class="state-popup-grid">
          <span class="state-popup-label">Airport</span>
          <span class="state-popup-value" style="grid-column: 1/-1; text-align: left; margin-bottom: 2px;">${airport.name}</span>
          <span class="state-popup-label">City</span>
          <span class="state-popup-value">${airport.city}</span>
          <span class="state-popup-label">On Ground</span>
          <span class="state-popup-value">${gc} aircraft</span>
        </div>
      </div>
    `, { maxWidth: 250 });

    airportLayer.addLayer(marker);
  });
}

function setupLayerToggles(): void {
  document.querySelectorAll('.map-card .card-action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!map) return;
      const layer = btn.getAttribute('data-layer');
      if (!layer) return;

      const isActive = btn.classList.contains('active');
      const layerMap: Record<string, L.LayerGroup> = {
        states: stateLayer, metro: metroLayer, airports: airportLayer,
        flights: flightLayer, trains: trainLayer,
      };
      const target = layerMap[layer];
      if (!target) return;

      if (isActive) {
        map.removeLayer(target);
      } else {
        if (layer === 'flights') refreshFlightLayer();
        if (layer === 'trains') refreshTrainLayer();
        target.addTo(map);
      }
      btn.classList.toggle('active');
    });
  });
}

// ─── Fullscreen Toggle ───

function setupFullscreen(): void {
  const btn = document.getElementById('mapFullscreenBtn');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const card = document.getElementById('mapCard');
    if (!card) return;
    const isFullscreen = card.classList.toggle('map-fullscreen');
    document.body.classList.toggle('map-fs-active', isFullscreen);
    btn.textContent = isFullscreen ? '✕' : '⛶';
    setTimeout(() => map?.invalidateSize(), 100);
  });
}

// ─── Selection / Info Overlay ───

function clearSelection(): void {
  selectedEntity = null;
  overlayLayer.clearLayers();
  const overlay = document.getElementById('mapInfoOverlay');
  if (overlay) overlay.style.display = 'none';
}

function showInfoOverlay(html: string): void {
  const overlay = document.getElementById('mapInfoOverlay');
  if (!overlay) return;
  overlay.innerHTML = `<button class="map-info-close" id="mapInfoClose">✕</button>${html}`;
  overlay.style.display = 'block';
  document.getElementById('mapInfoClose')?.addEventListener('click', (e) => {
    e.stopPropagation();
    clearSelection();
  });
}

// ─── Flight Layer (Flightradar24-style SVG aircraft) ───

export function refreshFlightLayer(): void {
  if (!map) return;
  flightLayer.clearLayers();

  const data = getFlightData();
  data.flights.forEach(f => {
    if (!f.callsign) return;

    const isSelected = selectedEntity?.type === 'flight' && selectedEntity.id === f.icao24;
    const color = f.onGround ? '#6b7280' : (isSelected ? '#00ff88' : '#FFD700');
    const size = isSelected ? 26 : 20;

    const icon = L.divIcon({
      className: 'aircraft-marker',
      html: aircraftSVG(f.heading || 0, color, size),
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });

    const marker = L.marker([f.lat, f.lng], { icon, interactive: true });
    const airline = guessAirline(f.callsign);
    const altFt = Math.round(f.altitude * 3.281);
    const speedKmh = Math.round(f.velocity * 3.6);

    marker.on('click', (e: L.LeafletMouseEvent) => {
      L.DomEvent.stopPropagation(e);
      selectedEntity = { type: 'flight', id: f.icao24 };
      overlayLayer.clearLayers();

      // Heading line from aircraft
      const headingRad = ((f.heading || 0) * Math.PI) / 180;
      const lineDist = 1.5; // degrees
      const endLat = f.lat + Math.cos(headingRad) * lineDist;
      const endLng = f.lng + Math.sin(headingRad) * lineDist;
      const headingLine = L.polyline([[f.lat, f.lng], [endLat, endLng]], {
        color: '#FFD700', weight: 1.5, opacity: 0.6, dashArray: '6,4',
      });
      overlayLayer.addLayer(headingLine);

      // Show info panel
      showInfoOverlay(`
        <div class="info-header" style="border-color:${airline.color}">
          <div class="info-callsign">${sanitize(f.callsign)}</div>
          <div class="info-badge flight-badge">✈ FLIGHT</div>
        </div>
        <div class="info-grid">
          <span class="info-label">Airline</span><span class="info-value" style="color:${airline.color}">${sanitize(airline.name)}</span>
          <span class="info-label">Altitude</span><span class="info-value">${altFt.toLocaleString()} ft</span>
          <span class="info-label">Speed</span><span class="info-value">${speedKmh} km/h</span>
          <span class="info-label">Heading</span><span class="info-value">${Math.round(f.heading)}°</span>
          <span class="info-label">Vert. Rate</span><span class="info-value">${f.verticalRate > 0 ? '↑' : f.verticalRate < 0 ? '↓' : '—'} ${Math.abs(Math.round(f.verticalRate * 196.85))} ft/min</span>
          <span class="info-label">Status</span><span class="info-value">${f.onGround ? '🔴 On Ground' : '🟢 In Flight'}</span>
          <span class="info-label">ICAO</span><span class="info-value" style="font-family:var(--font-mono)">${sanitize(f.icao24)}</span>
          <span class="info-label">Origin</span><span class="info-value">${sanitize(f.originCountry)}</span>
        </div>
      `);
      refreshFlightLayer(); // Re-render to highlight selected
    });

    flightLayer.addLayer(marker);
  });
}

// ─── Train Layer ───

export function refreshTrainLayer(): void {
  if (!map) return;
  trainLayer.clearLayers();

  const trains = getActiveTrainsOnMap();
  trains.forEach(t => {
    const isSelected = selectedEntity?.type === 'train' && selectedEntity.id === t.trainNo;
    const baseColor = TRAIN_COLORS[t.type] || '#f59e0b';
    const color = isSelected ? '#00ff88' : baseColor;
    const size = isSelected ? 24 : 18;

    const icon = L.divIcon({
      className: 'train-marker',
      html: trainSVG(t.heading, color, size),
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });

    const marker = L.marker([t.lat, t.lng], { icon, interactive: true });

    marker.on('click', (e: L.LeafletMouseEvent) => {
      L.DomEvent.stopPropagation(e);
      selectedEntity = { type: 'train', id: t.trainNo };
      overlayLayer.clearLayers();

      // Draw route polyline
      const routeLine = L.polyline(t.route, {
        color: baseColor, weight: 2.5, opacity: 0.7, dashArray: '8,4',
      });
      overlayLayer.addLayer(routeLine);

      // Origin & destination markers
      const originIcon = L.circleMarker(t.route[0] as [number, number], {
        radius: 4, fillColor: '#22c55e', fillOpacity: 1, color: '#fff', weight: 1,
      });
      const destIcon = L.circleMarker(t.route[t.route.length - 1] as [number, number], {
        radius: 4, fillColor: '#ef4444', fillOpacity: 1, color: '#fff', weight: 1,
      });
      overlayLayer.addLayer(originIcon);
      overlayLayer.addLayer(destIcon);

      showInfoOverlay(`
        <div class="info-header" style="border-color:${baseColor}">
          <div class="info-callsign">${sanitize(t.trainNo)} ${sanitize(t.trainName)}</div>
          <div class="info-badge train-badge" style="background:${baseColor}">${sanitize(t.type)}</div>
        </div>
        <div class="info-grid">
          <span class="info-label">From</span><span class="info-value" style="color:#22c55e">● ${sanitize(t.from)}</span>
          <span class="info-label">To</span><span class="info-value" style="color:#ef4444">● ${sanitize(t.to)}</span>
          <span class="info-label">Progress</span><span class="info-value">${Math.round(t.progress * 100)}%</span>
          <span class="info-label">Heading</span><span class="info-value">${Math.round(t.heading)}°</span>
          <span class="info-label">Position</span><span class="info-value" style="font-family:var(--font-mono)">${t.lat.toFixed(2)}°N, ${t.lng.toFixed(2)}°E</span>
        </div>
        <div class="info-progress-bar">
          <div class="info-progress-fill" style="width:${t.progress * 100}%;background:${baseColor}"></div>
        </div>
      `);
      refreshTrainLayer(); // Re-render to highlight selected
    });

    trainLayer.addLayer(marker);
  });
}

function sanitize(str: string): string {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

export function destroyMap(): void {
  if (map) {
    map.remove();
    map = null;
    selectedEntity = null;
  }
}
