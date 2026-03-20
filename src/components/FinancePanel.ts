// ─── Finance Panel Component ───

import { getMarketData, type MarketSummary } from '../services/financeService';
import { icons } from '../utils/icons';
import { formatPercent } from '../utils/formatters';

export function createFinancePanel(): string {
  const market = getMarketData();

  return `
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          ${icons.finance(14)}
          Markets
        </div>
        <div class="card-actions">
          <button class="card-action-btn active" data-fin-tab="indices">Indices</button>
          <button class="card-action-btn" data-fin-tab="sectors">Sectors</button>
          <button class="card-action-btn" data-fin-tab="flows">Flows</button>
        </div>
      </div>
      <div class="card-body" style="max-height: 400px;">
        <div id="finIndices">${renderIndices(market)}</div>
        <div id="finSectors" style="display:none;">${renderSectors(market)}</div>
        <div id="finFlows" style="display:none;">${renderFlows(market)}</div>
      </div>
    </div>
  `;
}

function renderIndices(market: MarketSummary): string {
  return `
    <div class="index-grid">
      ${market.indices.map(idx => {
        const direction = idx.change >= 0 ? 'up' : 'down';
        return `
          <div class="index-item">
            <div>
              <div class="index-name">${idx.name}</div>
              <div class="index-exchange">${idx.exchange}</div>
            </div>
            <div>
              <div class="index-value ${direction}">${idx.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
              <div class="index-change ${direction}">${idx.change >= 0 ? '▲' : '▼'} ${Math.abs(idx.change).toFixed(2)} (${formatPercent(idx.changePercent)})</div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderSectors(market: MarketSummary): string {
  return `
    <div class="sector-grid">
      ${market.sectors.map(s => {
        const direction = s.change >= 0 ? 'up' : 'down';
        return `
          <div class="sector-chip">
            <div>
              <div class="sector-name">${s.name}</div>
              <div style="font-size:9px; color:var(--text-tertiary); margin-top:2px;">
                ▲ ${s.topGainer} &nbsp; ▼ ${s.topLoser}
              </div>
            </div>
            <div class="sector-change ${direction}">${formatPercent(s.change)}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderFlows(market: MarketSummary): string {
  const fiiDir = market.fiiFlow >= 0 ? 'up' : 'down';
  const diiDir = market.diiFlow >= 0 ? 'up' : 'down';

  return `
    <div>
      <div class="flow-row">
        <span class="flow-label">FII/FPI Net Flow</span>
        <span class="flow-value ${fiiDir}">₹${Math.abs(market.fiiFlow).toLocaleString()} Cr</span>
      </div>
      <div class="flow-row">
        <span class="flow-label">DII Net Flow</span>
        <span class="flow-value ${diiDir}">₹${Math.abs(market.diiFlow).toLocaleString()} Cr</span>
      </div>
      <div class="flow-row">
        <span class="flow-label">UPI Transactions</span>
        <span class="flow-value" style="color: var(--accent-teal);">${market.upiVolume}B txns</span>
      </div>
      <div class="flow-row">
        <span class="flow-label">UPI Value</span>
        <span class="flow-value" style="color: var(--accent-teal);">₹${market.upiValue}L Cr</span>
      </div>
      <div class="flow-row">
        <span class="flow-label">Total Market Cap</span>
        <span class="flow-value" style="color: var(--accent-purple);">$${market.marketCap}T</span>
      </div>
      <div class="flow-row">
        <span class="flow-label">Advance/Decline</span>
        <span class="flow-value">
          <span class="up">${market.advanceDecline.advances}</span> / 
          <span class="down">${market.advanceDecline.declines}</span> / 
          <span style="color:var(--text-tertiary)">${market.advanceDecline.unchanged}</span>
        </span>
      </div>
    </div>
  `;
}

export function initFinanceTabs(): void {
  document.querySelectorAll('[data-fin-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-fin-tab');
      document.querySelectorAll('[data-fin-tab]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const indices = document.getElementById('finIndices');
      const sectors = document.getElementById('finSectors');
      const flows = document.getElementById('finFlows');

      if (indices) indices.style.display = tab === 'indices' ? '' : 'none';
      if (sectors) sectors.style.display = tab === 'sectors' ? '' : 'none';
      if (flows) flows.style.display = tab === 'flows' ? '' : 'none';
    });
  });
}
