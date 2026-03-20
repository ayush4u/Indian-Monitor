// ─── Header Component ───

import { getMarketData } from '../services/financeService';

export function createHeader(): string {
  const market = getMarketData();
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

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

  // Duplicate for seamless scroll
  const tickerDuplicate = tickerItems;

  return `
    <header class="header">
      <div class="header-left">
        <button class="mobile-menu-btn" id="mobileMenuBtn">☰</button>
        <div class="logo">
          <div class="logo-icon">IM</div>
          <div class="logo-text"><span>India</span> Monitor</div>
        </div>
      </div>

      <div class="header-ticker">
        <div class="ticker-track">
          ${tickerItems}
          ${tickerDuplicate}
        </div>
      </div>

      <div class="header-right">
        <div class="header-time">
          <span id="headerTime">${timeStr}</span>
          <span style="color:var(--text-tertiary); margin-left:4px;">IST</span>
          <span style="color:var(--text-tertiary); margin-left:6px; font-size:10px;">${dateStr}</span>
        </div>
        <div class="live-badge">
          <span class="live-dot"></span>
          LIVE
        </div>
      </div>
    </header>
  `;
}

export function startClock(): void {
  setInterval(() => {
    const el = document.getElementById('headerTime');
    if (el) {
      el.textContent = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    }
  }, 1000);
}
