// ─── Weather Panel Component ───

import { getWeatherData, getDisasterAlerts, type DisasterAlert } from '../services/weatherService';
import { icons } from '../utils/icons';
import { timeAgo } from '../utils/formatters';

export function createWeatherPanel(): string {
  const weather = getWeatherData();

  return `
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          ${icons.weather(14)}
          Weather & AQI
        </div>
      </div>
      <div class="card-body" style="max-height: 400px;">
        <div class="weather-grid">
          ${weather.map(w => {
            const aqiClass = getAqiClass(w.aqiCategory);
            return `
              <div class="weather-item">
                <span class="weather-icon">${w.icon}</span>
                <div class="weather-info">
                  <div class="weather-city">${w.city}</div>
                  <div class="weather-condition">${w.condition} • 💧${w.humidity}% • 💨${w.windSpeed} km/h</div>
                </div>
                <div style="text-align: right;">
                  <div class="weather-temp">${w.temp}°</div>
                  <span class="weather-aqi ${aqiClass}">${w.aqi} AQI</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

export function createDisasterPanel(): string {
  const alerts = getDisasterAlerts();

  return `
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          ${icons.alert(14)}
          Disaster Alerts
        </div>
        <span style="font-size:10px; color: var(--status-danger); font-weight:700;">${alerts.length} Active</span>
      </div>
      <div class="card-body" style="max-height: 400px;">
        <div class="alert-list">
          ${alerts.map(a => renderAlert(a)).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderAlert(alert: DisasterAlert): string {
  const typeEmoji: Record<string, string> = {
    flood: '🌊', cyclone: '🌀', earthquake: '🔴', heatwave: '🔥',
    coldwave: '❄️', landslide: '⛰️', drought: '🏜️',
  };

  return `
    <div class="alert-item ${alert.severity}">
      <div class="alert-header-row">
        <span class="alert-type-badge" style="background: rgba(255,255,255,0.06);">
          ${typeEmoji[alert.type] || '⚠️'} ${alert.type.toUpperCase()}
        </span>
        <span style="font-size:9px; color:var(--text-tertiary);">${timeAgo(alert.timestamp)}</span>
      </div>
      <div class="alert-title">${alert.title}</div>
      <div class="alert-meta">📍 ${alert.region}</div>
      <div class="alert-description">${alert.description}</div>
    </div>
  `;
}

function getAqiClass(category: string): string {
  const map: Record<string, string> = {
    'Good': 'aqi-good',
    'Satisfactory': 'aqi-satisfactory',
    'Moderate': 'aqi-moderate',
    'Poor': 'aqi-poor',
    'Very Poor': 'aqi-very-poor',
    'Severe': 'aqi-severe',
  };
  return map[category] || 'aqi-moderate';
}
