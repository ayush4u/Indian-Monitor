// ─── Stats Bar Component ───

import { getMarketData } from '../services/financeService';
import { STATES } from '../data/states';
import { getDisasterAlerts } from '../services/weatherService';
import { getTrainStatuses, getMetroStatuses } from '../services/transportService';

export function createStatsBar(): string {
  const market = getMarketData();
  const sensex = market.indices[0];
  const nifty = market.indices[1];
  const alerts = getDisasterAlerts();
  const trains = getTrainStatuses();
  const metros = getMetroStatuses();

  const totalPop = STATES.reduce((a, s) => a + s.population, 0);
  const totalGDP = STATES.reduce((a, s) => a + s.gdp, 0);
  const onTimeTrains = trains.filter(t => t.status === 'on-time').length;
  const normalMetros = metros.filter(m => m.status === 'normal').length;

  const stats = [
    {
      label: 'SENSEX',
      value: sensex.value.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
      change: `${sensex.change >= 0 ? '▲' : '▼'} ${Math.abs(sensex.changePercent).toFixed(2)}%`,
      changeDir: sensex.change >= 0 ? 'up' : 'down',
      color: 'var(--accent-orange)',
    },
    {
      label: 'NIFTY 50',
      value: nifty.value.toLocaleString('en-IN', { maximumFractionDigits: 0 }),
      change: `${nifty.change >= 0 ? '▲' : '▼'} ${Math.abs(nifty.changePercent).toFixed(2)}%`,
      changeDir: nifty.change >= 0 ? 'up' : 'down',
      color: 'var(--accent-teal)',
    },
    {
      label: 'UPI Volume (Monthly)',
      value: `${market.upiVolume}B`,
      change: 'transactions',
      changeDir: '',
      color: 'var(--accent-purple)',
    },
    {
      label: 'Disaster Alerts',
      value: alerts.length.toString(),
      change: `${alerts.filter(a => a.severity === 'alert').length} critical`,
      changeDir: 'down',
      color: 'var(--status-danger)',
    },
    {
      label: 'Railways On-Time',
      value: `${Math.round((onTimeTrains / trains.length) * 100)}%`,
      change: `${onTimeTrains}/${trains.length} trains`,
      changeDir: onTimeTrains / trains.length > 0.6 ? 'up' : 'down',
      color: 'var(--accent-cyan)',
    },
    {
      label: 'Metro Status',
      value: `${normalMetros}/${metros.length}`,
      change: 'lines normal',
      changeDir: normalMetros / metros.length > 0.8 ? 'up' : 'down',
      color: 'var(--accent-blue)',
    },
    {
      label: 'Total GDP',
      value: `$${(totalGDP / 1000).toFixed(1)}T`,
      change: `${STATES.filter(s => s.type === 'state').length} states`,
      changeDir: '',
      color: 'var(--accent-green)',
    },
    {
      label: 'Population',
      value: `${(totalPop / 1000).toFixed(2)}B`,
      change: '28 states + 8 UTs',
      changeDir: '',
      color: 'var(--accent-yellow)',
    },
  ];

  return `
    <div class="stats-bar">
      ${stats.map(s => `
        <div class="stat-card">
          <div class="stat-label">${s.label}</div>
          <div class="stat-value" style="color: ${s.color};">${s.value}</div>
          <div class="stat-change ${s.changeDir}">${s.change}</div>
        </div>
      `).join('')}
    </div>
  `;
}
