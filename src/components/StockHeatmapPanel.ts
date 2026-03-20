// ─── Stock Market Deep Panel (Heatmap + Gainers/Losers) ───

import { getMarketData, type StockTicker, type SectorData } from '../services/financeService';
import { icons } from '../utils/icons';
import { formatPercent } from '../utils/formatters';

export function createStockHeatmapPanel(): string {
  const market = getMarketData();

  return `
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          ${icons.chart(14)}
          Market Deep Dive
          ${market.isLive ? '<span class="live-badge-sm"><span class="live-dot"></span>LIVE</span>' : ''}
        </div>
        <div class="card-actions">
          <button class="card-action-btn active" data-stock-tab="heatmap">Heatmap</button>
          <button class="card-action-btn" data-stock-tab="gainers">Top Gainers</button>
          <button class="card-action-btn" data-stock-tab="losers">Top Losers</button>
          <button class="card-action-btn" data-stock-tab="momentum">Sectors</button>
        </div>
      </div>
      <div class="card-body" style="max-height: 500px;">
        <div id="stockHeatmap">${renderHeatmap(market.stocks)}</div>
        <div id="stockGainers" style="display:none;">${renderStockTable(market.gainers, 'gainer')}</div>
        <div id="stockLosers" style="display:none;">${renderStockTable(market.losers, 'loser')}</div>
        <div id="sectorMomentum" style="display:none;">${renderSectorMomentum(market.sectors)}</div>
      </div>
    </div>
  `;
}

function renderHeatmap(stocks: StockTicker[]): string {
  if (!stocks.length) return '<div style="padding:16px;color:var(--text-tertiary);">Loading stock data...</div>';

  return `
    <div class="stock-heatmap">
      ${stocks.map(s => {
        const bg = getHeatColor(s.changePercent);
        const size = Math.max(60, 80); // uniform size for now
        return `
          <div class="heatmap-cell" style="background:${bg}; min-width:${size}px;">
            <div class="heatmap-symbol">${sanitize(s.symbol)}</div>
            <div class="heatmap-price">₹${s.price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
            <div class="heatmap-change ${s.changePercent >= 0 ? 'up' : 'down'}">${formatPercent(s.changePercent)}</div>
          </div>
        `;
      }).join('')}
    </div>
    <div class="heatmap-legend">
      <span style="color:#ef4444;">◀ Bearish</span>
      <div class="heatmap-gradient"></div>
      <span style="color:#22c55e;">Bullish ▶</span>
    </div>
  `;
}

function renderStockTable(stocks: StockTicker[], type: 'gainer' | 'loser'): string {
  if (!stocks.length) return '<div style="padding:16px;color:var(--text-tertiary);">Loading...</div>';

  return `
    <div class="stock-table">
      <div class="stock-table-header">
        <span>Stock</span>
        <span>Price</span>
        <span>Change</span>
        <span>Volume</span>
        <span>Sector</span>
      </div>
      ${stocks.map((s, i) => `
        <div class="stock-table-row ${type}">
          <div class="stock-rank-name">
            <span class="stock-rank">${i + 1}</span>
            <div>
              <div class="stock-symbol">${sanitize(s.symbol)}</div>
              <div class="stock-name-small">${sanitize(s.name)}</div>
            </div>
          </div>
          <span class="stock-price">₹${s.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
          <span class="stock-change ${s.changePercent >= 0 ? 'up' : 'down'}">${formatPercent(s.changePercent)}</span>
          <span class="stock-volume">${sanitize(s.volume)}</span>
          <span class="stock-sector-tag">${sanitize(s.sector)}</span>
        </div>
      `).join('')}
    </div>
  `;
}

function renderSectorMomentum(sectors: SectorData[]): string {
  if (!sectors.length) return '<div style="padding:16px;color:var(--text-tertiary);">Loading sector data...</div>';

  return `
    <div class="sector-momentum">
      ${sectors.map(s => {
        const momentumIcon = s.momentum === 'bullish' ? '🟢' : s.momentum === 'bearish' ? '🔴' : '🟡';
        const barWidth = Math.min(100, Math.abs(s.change) * 15);
        const barColor = s.change >= 0 ? 'var(--accent-green)' : 'var(--status-danger)';
        return `
          <div class="sector-momentum-row">
            <div class="sector-momentum-name">
              <span>${momentumIcon}</span>
              <span>${sanitize(s.name)}</span>
              <span class="sector-momentum-label">${s.momentum?.toUpperCase() || 'N/A'}</span>
            </div>
            <div class="sector-momentum-bar-container">
              <div class="sector-momentum-bar" style="width:${barWidth}%; background:${barColor};"></div>
            </div>
            <span class="sector-momentum-change ${s.change >= 0 ? 'up' : 'down'}">${formatPercent(s.change)}</span>
            <div class="sector-momentum-meta">
              <span class="up">▲ ${sanitize(s.topGainer)}</span>
              <span class="down">▼ ${sanitize(s.topLoser)}</span>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function getHeatColor(change: number): string {
  if (change >= 3) return 'rgba(34, 197, 94, 0.4)';
  if (change >= 1.5) return 'rgba(34, 197, 94, 0.25)';
  if (change >= 0.5) return 'rgba(34, 197, 94, 0.12)';
  if (change > -0.5) return 'rgba(255, 255, 255, 0.04)';
  if (change > -1.5) return 'rgba(239, 68, 68, 0.12)';
  if (change > -3) return 'rgba(239, 68, 68, 0.25)';
  return 'rgba(239, 68, 68, 0.4)';
}

function sanitize(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function initStockHeatmapTabs(): void {
  document.querySelectorAll('[data-stock-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-stock-tab');
      document.querySelectorAll('[data-stock-tab]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const heatmap = document.getElementById('stockHeatmap');
      const gainers = document.getElementById('stockGainers');
      const losers = document.getElementById('stockLosers');
      const momentum = document.getElementById('sectorMomentum');

      if (heatmap) heatmap.style.display = tab === 'heatmap' ? '' : 'none';
      if (gainers) gainers.style.display = tab === 'gainers' ? '' : 'none';
      if (losers) losers.style.display = tab === 'losers' ? '' : 'none';
      if (momentum) momentum.style.display = tab === 'momentum' ? '' : 'none';
    });
  });
}
