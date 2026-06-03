// ─── Markets Hub Component (CoinGecko Style) ───

import {
  fetchMarketsHubAssets,
  fetchStockDetail,
  searchYahooSymbols,
  type MarketAsset,
  type StockDetail
} from '../services/financeService';
import { icons } from '../utils/icons';
import { formatPercent, formatCurrency, formatNumber } from '../utils/formatters';

// Cache for loaded assets
let currentAssets: {
  equities: MarketAsset[];
  commodities: MarketAsset[];
  currencies: MarketAsset[];
  crypto: MarketAsset[];
  
} | null = null;

let activeTab: 'equity' | 'commodity' | 'currency' | 'crypto' | 'ai_insights' = 'equity';
type SortColumn = 'symbol' | 'price' | 'change' | 'changePercent' | 'change7d' | 'change30d' | 'marketCap';
let sortCol: SortColumn = 'change';
let sortDir = -1;

function sortAssets(assets: MarketAsset[]) {
  return [...assets].sort((a, b) => {
    let valA = (a as Record<string, any>)[sortCol] || 0;
    let valB = (b as Record<string, any>)[sortCol] || 0;

    switch (sortCol) {
      case 'symbol':
        return sortDir * a.symbol.localeCompare(b.symbol);
      case 'price':
        valA = a.price ?? 0;
        valB = b.price ?? 0;
        break;
      case 'change':
        valA = a.change ?? 0;
        valB = b.change ?? 0;
        break;
      case 'changePercent':
        valA = a.changePercent ?? 0;
        valB = b.changePercent ?? 0;
        break;
      case 'change7d':
        valA = a.change7d ?? 0;
        valB = b.change7d ?? 0;
        break;
      case 'change30d':
        valA = a.change30d ?? 0;
        valB = b.change30d ?? 0;
        break;
      case 'marketCap':
        // marketCap is a formatted string; compare as string fallback
        valA = a.marketCap ?? '';
        valB = b.marketCap ?? '';
        break;
      default:
        valA = 0;
        valB = 0;
    }

    // Numeric comparison when possible
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortDir * (valA === valB ? 0 : valA > valB ? 1 : -1);
    }

    // Fallback string compare
    return sortDir * String(valA).localeCompare(String(valB));
  });
}
let activeEquitySector = 'All';

// Star icon SVG helper
const starIcon = (fill = false) => `
  <svg class="star-icon" width="13" height="13" viewBox="0 0 24 24" fill="${fill ? 'var(--accent-yellow)' : 'none'}" stroke="var(--accent-yellow)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
`;

export function createMarketsHub(): string {
  return `
    <div class="card hub-card" style="grid-column: 1 / -1; margin-bottom: 24px;">
      <!-- Hub Header Tickers -->
      <div class="hub-header-stats">
        <div class="hub-header-stat-card" data-stat-symbol="USDINR=X">
          <div class="stat-meta">
            <span class="stat-title">USD / INR Exchange</span>
            <span class="stat-badge fx">FX</span>
          </div>
          <div class="stat-price-row">
            <span class="stat-price" id="usdInrPrice">₹83.50</span>
            <span class="stat-change-pct up" id="usdInrChange">+0.05%</span>
          </div>
        </div>
        <div class="hub-header-stat-card" data-stat-symbol="CNYINR=X">
          <div class="stat-meta">
            <span class="stat-title">CNY / INR Exchange</span>
            <span class="stat-badge fx">FX</span>
          </div>
          <div class="stat-price-row">
            <span class="stat-price" id="cnyInrPrice">₹11.52</span>
            <span class="stat-change-pct down" id="cnyInrChange">-0.12%</span>
          </div>
        </div>
        <div class="hub-header-stat-card" data-stat-symbol="GC=F">
          <div class="stat-meta">
            <span class="stat-title">Gold Rate (24K/10g)</span>
            <span class="stat-badge metal">Metal</span>
          </div>
          <div class="stat-price-row">
            <span class="stat-price" id="goldRatePrice">₹73,420</span>
            <span class="stat-change-pct up" id="goldRateChange">+0.42%</span>
          </div>
        </div>
        <div class="hub-header-stat-card" data-stat-symbol="SI=F">
          <div class="stat-meta">
            <span class="stat-title">Silver Rate (1kg)</span>
            <span class="stat-badge metal">Metal</span>
          </div>
          <div class="stat-price-row">
            <span class="stat-price" id="silverRatePrice">₹88,950</span>
            <span class="stat-change-pct down" id="silverRateChange">-0.35%</span>
          </div>
        </div>
      </div>

      <!-- Control Bar: Search + Tabs -->
      <div class="hub-control-bar">
        <!-- Search bar -->
        <div class="hub-search-container">
          <span class="search-icon-inside">${icons.search(14)}</span>
          <input type="text" id="hubSearchInput" placeholder="Search from 30,000+ Stocks, Commodities, Currencies..." autocomplete="off" />
          <button id="hubSearchClear" style="display:none;">✕</button>
          <div id="hubSearchSuggestions" class="search-suggestions-dropdown" style="display:none;"></div>
        </div>

        <!-- Navigation Tabs -->
        <div class="hub-tabs">
          <button class="hub-tab active" data-hub-tab="equity">${icons.chart(12)} Equities</button>
          <button class="hub-tab" data-hub-tab="commodity">${icons.rupee(12)} Commodities</button>
          <button class="hub-tab" data-hub-tab="currency">${icons.globe(12)} Currencies</button>
          <button class="hub-tab" data-hub-tab="crypto">${icons.zap(12)} Crypto</button>
   <button class="hub-tab" data-hub-tab="ai_insights">🤖 AI Insights</button>
        </div>
      </div>

      <!-- Sector pills (only visible when Equities tab is active) -->
      <div class="hub-sector-bar" id="hubSectorBar">
        <button class="sector-pill active" data-sector="All">All Sectors</button>
        <button class="sector-pill" data-sector="Banking">Banking</button>
        <button class="sector-pill" data-sector="IT">IT & Software</button>
        <button class="sector-pill" data-sector="Energy">Energy</button>
        <button class="sector-pill" data-sector="Auto">Automobile</button>
        <button class="sector-pill" data-sector="Pharma">Pharmaceuticals</button>
        <button class="sector-pill" data-sector="Metal">Metals & Mining</button>
        <button class="sector-pill" data-sector="FMCG">FMCG</button>
        <button class="sector-pill" data-sector="Realty">Realty</button>
      </div>

      <!-- Main Asset Table container -->
      <div class="hub-table-wrapper">
        <div id="hubAssetTable">
          <div style="padding: 40px; text-align: center; color: var(--text-secondary);">
            <span class="loading-spinner"></span> Loading real-time asset data...
          </div>
        </div>
      </div>
    </div>

    <!-- Asset Detail Modal Overlay -->
    <div class="asset-modal-overlay" id="assetDetailModal" style="display:none;">
      <div class="asset-modal-backdrop" id="assetModalBackdrop"></div>
      <div class="asset-modal-panel">
        <button class="asset-modal-close" id="assetModalClose">✕</button>
        <div id="assetModalContent"></div>
      </div>
    </div>
  `;
}

// ─── Sparkline visual generator using SVG paths and area gradient ───
function generateSparkline(prices: number[], width = 90, height = 30): string {
  if (!prices || prices.length < 2) {
    return `<svg width="${width}" height="${height}"></svg>`;
  }
  const cleanPrices = prices.filter(p => p !== null && !isNaN(p));
  if (cleanPrices.length < 2) {
    return `<svg width="${width}" height="${height}"></svg>`;
  }

  const min = Math.min(...cleanPrices);
  const max = Math.max(...cleanPrices);
  const range = max - min === 0 ? 1 : max - min;

  const points = cleanPrices.map((p, i) => {
    const x = (i / (cleanPrices.length - 1)) * width;
    const y = height - ((p - min) / range) * height * 0.8 - height * 0.1; // pad 10% top/bottom
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const isUp = cleanPrices[cleanPrices.length - 1] >= cleanPrices[0];
  const color = isUp ? 'var(--status-success)' : 'var(--status-danger)';
  const gradId = `spark-grad-${Math.random().toString(36).substr(2, 5)}`;

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="overflow:visible;">
      <defs>
        <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      <path d="M 0,${height} L ${points.join(' L ')} L ${width},${height} Z" fill="url(#${gradId})" />
      <path d="M ${points.join(' L ')}" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      ${points.map((pt, i) => `<circle cx="${pt.split(',')[0]}" cy="${pt.split(',')[1]}" r="6" fill="transparent" class="spark-pt"><title>Price: ₹${prices[i].toFixed(2)}</title></circle>`).join('')}
    </svg>
  `;
}

// ─── Big modal chart renderer ───
function generateDetailedChart(chartData: { time: number; price: number }[], isUp: boolean): string {
  const width = 500;
  const height = 180;
  if (!chartData || chartData.length < 2) {
    return `<div style="height:${height}px; display:flex; align-items:center; justify-content:center; color:var(--text-tertiary)">Insufficient chart data</div>`;
  }

  const prices = chartData.map(d => d.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const range = max - min === 0 ? 1 : max - min;

  const points = prices.map((p, i) => {
    const x = (i / (prices.length - 1)) * width;
    const y = height - ((p - min) / range) * height * 0.78 - height * 0.11; // 11% padding
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const color = isUp ? '#22c55e' : '#ef4444';
  const gradId = `chart-detail-grad`;

  // Draw vertical gridlines and horizontal lines
  let gridLines = '';
  for (let i = 1; i <= 4; i++) {
    const x = (i / 5) * width;
    gridLines += `<line x1="${x}" y1="0" x2="${x}" y2="${height}" stroke="rgba(255,255,255,0.02)" stroke-dasharray="3,3" />`;
  }
  for (let i = 1; i <= 3; i++) {
    const y = (i / 4) * height;
    gridLines += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" stroke="rgba(255,255,255,0.02)" stroke-dasharray="3,3" />`;
  }

  return `
    <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" style="overflow:visible;">
      <defs>
        <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${color}" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="${color}" stop-opacity="0.0"/>
        </linearGradient>
      </defs>
      ${gridLines}
      <!-- Area Under Path -->
      <path d="M 0,${height} L ${points.join(' L ')} L ${width},${height} Z" fill="url(#${gradId})" />
      <!-- Line Path -->
      <path d="M ${points.join(' L ')}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `;
}

// ─── Table Renderers ───

function renderEquities(assets: MarketAsset[]): string {
  const filtered = activeEquitySector === 'All'
    ? assets
    : assets.filter(a => a.subCategory === activeEquitySector);

  if (!filtered.length) {
    return `<div class="hub-no-assets">No equities found in ${activeEquitySector} sector</div>`;
  }

  const sorted = sortAssets(filtered);
  const getSortIcon = (col: string) => sortCol === col ? (sortDir === 1 ? ' ↑' : ' ↓') : '';

  return `
    <table class="hub-table">
      <thead>
        <tr>
          <th data-sort="symbol" style="cursor:pointer">Asset${getSortIcon('symbol')}</th>
          <th data-sort="price" style="text-align: right; cursor:pointer">Price${getSortIcon('price')}</th>
          <th data-sort="changePercent" style="text-align: right; cursor:pointer">24h %${getSortIcon('changePercent')}</th>
          <th data-sort="change7d" class="hide-mobile" style="text-align: right; cursor:pointer">7d %${getSortIcon('change7d')}</th>
          <th data-sort="change30d" class="hide-mobile" style="text-align: right; cursor:pointer">30d %${getSortIcon('change30d')}</th>
          <th data-sort="marketCap" class="hide-mobile" style="text-align: right; cursor:pointer">Market Cap${getSortIcon('marketCap')}</th>
          <th style="text-align: center; width: 120px;">Trend (7d)</th>
        </tr>
      </thead>
      <tbody>
        ${sorted.map(a => {
          const direction = a.change >= 0 ? 'up' : 'down';
          const sign = a.change >= 0 ? '+' : '';
          const c7d = a.change7d !== undefined ? a.change7d : 0;
          const c30d = a.change30d !== undefined ? a.change30d : 0;
          return `
            <tr class="hub-row" data-symbol="${a.symbol}">
              <td>
                <div class="asset-identity">
                  <span class="asset-symbol">${a.symbol}</span>
                  <span class="asset-name-sub">${a.name}</span>
                </div>
              </td>
              <td class="hub-price-cell ${direction}">₹${a.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td class="hub-change-cell ${direction}">
                <div style="font-weight:700;">${sign}${a.changePercent.toFixed(1)}%</div>
                <div style="font-size: 10px; opacity: 0.7;">${sign}₹${a.change.toFixed(2)}</div>
              </td>
              <td class="hub-change-cell hide-mobile ${c7d >= 0 ? 'up' : 'down'}">
                <div style="font-weight:700;">${c7d >= 0 ? '+' : ''}${c7d.toFixed(1)}%</div>
              </td>
              <td class="hub-change-cell hide-mobile ${c30d >= 0 ? 'up' : 'down'}">
                <div style="font-weight:700;">${c30d >= 0 ? '+' : ''}${c30d.toFixed(1)}%</div>
              </td>
              <td class="hub-mcap-cell hide-mobile">${a.marketCap}</td>
              <td class="hub-sparkline-cell" style="text-align:center;">
                ${generateSparkline(a.sparkline || [])}
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

function renderCommodities(assets: MarketAsset[]): string {
  if (!assets.length) return `<div class="hub-no-assets">No commodities loaded</div>`;

  return `
    <table class="hub-table">
      <thead>
        <tr>
          <th>Metal / Fuel</th>
          <th style="text-align: right;">Domestic (INR)</th>
          <th style="text-align: right;">Global Price</th>
          <th style="text-align: right;">24h Change</th>
          <th style="text-align: center; width: 120px;">Trend (24h)</th>
        </tr>
      </thead>
      <tbody>
        ${assets.map(a => {
          const direction = a.changePercent >= 0 ? 'up' : 'down';
          const sign = a.changePercent >= 0 ? '+' : '';
          const globalFormatted = a.priceUSD 
            ? `$${a.priceUSD.toLocaleString('en-US', { maximumFractionDigits: 2 })}` 
            : '—';
          return `
            <tr class="hub-row" data-symbol="${a.symbol}">
              <td>
                <div class="asset-identity">
                  <span class="asset-symbol">${a.name}</span>
                  <span class="asset-name-sub">${a.unit || 'futures'}</span>
                </div>
              </td>
              <td class="hub-price-cell ${direction}">
                ${a.priceINR ? `₹${a.priceINR.toLocaleString('en-IN', { maximumFractionDigits: 0 })}` : '—'}
              </td>
              <td class="hub-price-cell" style="color: var(--text-secondary); font-family: var(--font-mono);">${globalFormatted}</td>
              <td class="hub-change-cell ${direction}">
                <div style="font-weight:700;">${formatPercent(a.changePercent)}</div>
                <div style="font-size: 10px; opacity: 0.7;">${sign}${a.changePercent.toFixed(2)}%</div>
              </td>
              <td class="hub-sparkline-cell" style="text-align:center;">
                ${generateSparkline(a.sparkline)}
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

function renderCurrencies(assets: MarketAsset[]): string {
  if (!assets.length) return `<div class="hub-no-assets">No currencies loaded</div>`;

  return `
    <table class="hub-table">
      <thead>
        <tr>
          <th>Currency Pair</th>
          <th style="text-align: right;">Exchange Rate</th>
          <th style="text-align: right;">24h Change</th>
          <th style="text-align: center; width: 120px;">Trend (24h)</th>
        </tr>
      </thead>
      <tbody>
        ${assets.map(a => {
          const direction = a.changePercent >= 0 ? 'up' : 'down';
          const sign = a.changePercent >= 0 ? '+' : '';
          return `
            <tr class="hub-row" data-symbol="${a.symbol}">
              <td>
                <div class="asset-identity">
                  <span class="asset-symbol">${a.name}</span>
                  <span class="asset-name-sub">Live Forex Rate</span>
                </div>
              </td>
              <td class="hub-price-cell ${direction}" style="font-family: var(--font-mono); font-weight:700;">
                ₹${a.price.toFixed(4)}
              </td>
              <td class="hub-change-cell ${direction}">
                <div style="font-weight:700;">${formatPercent(a.changePercent, 2)}</div>
                <div style="font-size: 10px; opacity: 0.7;">${sign}${a.change.toFixed(4)}</div>
              </td>
              <td class="hub-sparkline-cell" style="text-align:center;">
                ${generateSparkline(a.sparkline)}
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

function renderCrypto(assets: MarketAsset[]): string {
  if (!assets.length) return `<div class="hub-no-assets">No crypto loaded</div>`;

  return `
    <table class="hub-table">
      <thead>
        <tr>
          <th>Cryptocurrency</th>
          <th style="text-align: right;">Price (INR)</th>
          <th style="text-align: right;">24h Change</th>
          <th style="text-align: right;">24h Volume</th>
          <th style="text-align: center; width: 120px;">Trend (24h)</th>
        </tr>
      </thead>
      <tbody>
        ${assets.map(a => {
          const direction = a.changePercent >= 0 ? 'up' : 'down';
          const sign = a.changePercent >= 0 ? '+' : '';
          return `
            <tr class="hub-row" data-symbol="${a.symbol}">
              <td>
                <div class="asset-identity">
                  <span class="asset-symbol">${a.name}</span>
                  <span class="asset-name-sub">${a.symbol}</span>
                </div>
              </td>
              <td class="hub-price-cell ${direction}" style="font-family: var(--font-mono); font-weight:700;">
                ₹${a.price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </td>
              <td class="hub-change-cell ${direction}">
                <div style="font-weight:700;">${formatPercent(a.changePercent)}</div>
                <div style="font-size: 10px; opacity: 0.7;">${sign}${formatPercent(a.changePercent)}</div>
              </td>
              <td class="hub-vol-cell">${a.volume}</td>
              <td class="hub-sparkline-cell" style="text-align:center;">
                ${generateSparkline(a.sparkline)}
              </td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>
  `;
}

// ─── Render active tab content ───
export function renderActiveTabTable(): void {
  const container = document.getElementById('hubAssetTable');
  if (!container || !currentAssets) return;

  let html = '';
  switch (activeTab) {
    case 'equity':
      html = renderEquities(currentAssets.equities);
      break;
    case 'commodity':
      html = renderCommodities(currentAssets.commodities);
      break;
    case 'currency':
      html = renderCurrencies(currentAssets.currencies);
      break;
    case 'crypto':
      html = renderCrypto(currentAssets.crypto);
      break;
      case 'ai_insights': {
        const body = container.querySelector('.hub-body');
        if (body) {
          body.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-secondary);">Loading AI Insights from Supabase...</div>';

          import('../services/supabaseAiService').then(s => {
            if (s.isSupabaseConfigured && !s.isSupabaseConfigured()) {
              console.warn('[AI] Supabase not configured for client. VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY missing.');
              body.innerHTML = `<div style="padding:2rem; text-align:center; color:var(--text-secondary);">
                Supabase not configured for AI insights. Please set <strong>VITE_SUPABASE_URL</strong> and <strong>VITE_SUPABASE_ANON_KEY</strong> in your Vite env and rebuild/restart the app.
                </div>`;
              return;
            }

            s.fetchAIInsights().then(insights => {
              if (!insights || insights.length === 0) {
                body.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-secondary);">No AI insights available yet. The AI worker runs daily.</div>';
                return;
              }

              body.innerHTML = '<div class="ai-insights-container" style="display:flex; flex-direction:column; gap: 1rem; padding: 1rem;">' + 
                insights.map(i => `
                  <div style="background: var(--surface); border: 1px solid var(--border-color); padding: 1.5rem; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                      <h3 style="margin: 0; color: var(--primary-color);">${i.title}</h3>
                      <span style="font-size: 0.8rem; color: var(--text-secondary);">${new Date(i.created_at).toLocaleDateString()}</span>
                    </div>
                    <p style="margin: 0 0 1rem 0; font-size: 0.95rem;">${i.summary}</p>
                    ${i.recommended_assets?.length > 0 ? `<h4 style="margin: 0 0 0.5rem 0;">Top Picks:</h4>` : ''}
                    <ul style="margin: 0 0 1rem 0; padding-left: 1.2rem;">
                      ${(i.recommended_assets || []).map(a => `
                        <li style="margin-bottom: 0.5rem;">
                          <strong>${a.name} (${a.symbol})</strong>: ${a.reasoning}
                        </li>
                      `).join('')}
                    </ul>
                    <div style="font-size: 0.75rem; color: var(--text-secondary); border-top: 1px solid var(--border-color); padding-top: 0.5rem; margin-top: 1rem;">
                      <em>Disclaimer: ${i.disclaimer}</em>
                    </div>
                  </div>
                `).join('') + '</div>';
            }).catch(fetchErr => {
              console.error('[AI] Error fetching insights:', fetchErr);
              body.innerHTML = `<div style="padding:2rem; text-align:center; color:var(--status-danger);">Failed to load AI insights. See console for details.</div>`;
            });
          }).catch(importErr => {
            console.error('[AI] Failed to load supabaseAiService module:', importErr);
            body.innerHTML = `<div style="padding:2rem; text-align:center; color:var(--status-danger);">Unable to load AI service module. See console for details.</div>`;
          });
        }
        break;
      }

    }
  container.innerHTML = html;
  attachRowClickEvents();
}

// ─── Attach click handlers to rows & watchlist buttons ───
function attachRowClickEvents(): void {
  // Table row clicks to open detailed modal
  document.querySelectorAll('.hub-row').forEach(row => {
    row.addEventListener('click', () => {
      const sym = row.getAttribute('data-symbol');
      if (sym) openAssetDetailModal(sym);
    });
  });
}

// ─── Live Search Autocomplete ───
async function handleSearchInput(val: string): Promise<void> {
  const container = document.getElementById('hubSearchSuggestions');
  const clearBtn = document.getElementById('hubSearchClear');
  if (!container) return;

  if (clearBtn) clearBtn.style.display = val.length > 0 ? '' : 'none';

  if (val.trim().length < 2) {
    container.style.display = 'none';
    return;
  }

  const results = await searchYahooSymbols(val);
  if (!results.length) {
    container.innerHTML = `<div class="search-suggestion-item empty">No results found for "${val}"</div>`;
    container.style.display = '';
    return;
  }

  container.innerHTML = results.map(r => `
    <div class="search-suggestion-item" data-symbol="${r.symbol}">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span class="s-symbol">${r.symbol}</span>
        <span class="s-badge">${r.quoteType}</span>
      </div>
      <div class="s-name">${r.name}</div>
    </div>
  `).join('');
  container.style.display = '';

  // Suggestions item clicks
  container.querySelectorAll('.search-suggestion-item').forEach(item => {
    item.addEventListener('click', () => {
      const sym = item.getAttribute('data-symbol');
      if (sym) {
        openAssetDetailModal(sym);
        // Clear search
        const inp = document.getElementById('hubSearchInput') as HTMLInputElement;
        if (inp) inp.value = '';
        container.style.display = 'none';
        if (clearBtn) clearBtn.style.display = 'none';
      }
    });
  });
}

// ─── Modal detailed view rendering ───
export async function openAssetDetailModal(symbol: string, range = '1mo'): Promise<void> {
  const modal = document.getElementById('assetDetailModal');
  const content = document.getElementById('assetModalContent');
  if (!modal || !content) return;

  content.innerHTML = `
    <div style="padding:40px; text-align:center; color:var(--text-secondary)">
      <span class="loading-spinner"></span> Loading asset details...
    </div>
  `;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  const detail = await fetchStockDetail(symbol, range);
  if (!detail) {
    content.innerHTML = `<div style="padding:40px; text-align:center; color:var(--status-danger)">Error loading details for ${symbol}</div>`;
    return;
  }

  const direction = detail.change >= 0 ? 'up' : 'down';
  const sign = detail.change >= 0 ? '+' : '';
  const rangePct = detail.high - detail.low === 0 ? 0.5 : (detail.price - detail.low) / (detail.high - detail.low);

  let categoryLabel = 'NSE Stock';
  if (symbol.includes('=X')) categoryLabel = 'Forex Exchange Rate';
  else if (symbol.endsWith('=F')) categoryLabel = 'Global Commodity Future';
  else if (symbol.includes('-INR')) categoryLabel = 'Cryptocurrency';

  content.innerHTML = `
    <div class="modal-detail-header">
      <div>
        <div style="display:flex; align-items:center; gap:8px;">
          <h2 class="modal-detail-title">${detail.name}</h2>
          <span class="modal-detail-badge">${detail.symbol}</span>
          <span class="modal-category-tag">${categoryLabel}</span>
        </div>
        <div class="modal-price-row">
          <span class="modal-price">${detail.currency === 'INR' ? '₹' : '$'}${detail.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}</span>
          <span class="modal-change ${direction}">${sign}${detail.change.toLocaleString('en-IN', { maximumFractionDigits: 4 })} (${formatPercent(detail.changePercent, 2)})</span>
        </div>
      </div>
      <div>
        </div>
    </div>

    <!-- Chart range buttons -->
    <div class="chart-range-controls">
      <button class="chart-range-btn ${range === '1d' ? 'active' : ''}" data-range="1d">1D</button>
      <button class="chart-range-btn ${range === '5d' ? 'active' : ''}" data-range="5d">5D</button>
      <button class="chart-range-btn ${range === '1mo' ? 'active' : ''}" data-range="1mo">1M</button>
      <button class="chart-range-btn ${range === '6mo' ? 'active' : ''}" data-range="6mo">6M</button>
      <button class="chart-range-btn ${range === '1y' ? 'active' : ''}" data-range="1y">1Y</button>
    </div>

    <!-- Detailed SVG Chart -->
    <div class="modal-chart-container">
      ${generateDetailedChart(detail.chartData, detail.change >= 0)}
    </div>

    <!-- Key Statistics Grid -->
    <div class="modal-stats-grid">
      <div class="modal-stat-item">
        <div class="ms-label">Open</div>
        <div class="ms-value">${detail.currency === 'INR' ? '₹' : '$'}${detail.open.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
      </div>
      <div class="modal-stat-item">
        <div class="ms-label">Previous Close</div>
        <div class="ms-value">${detail.currency === 'INR' ? '₹' : '$'}${detail.prevClose.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
      </div>
      <div class="modal-stat-item" style="grid-column: span 2;">
        <div class="ms-label" style="display:flex; justify-content:space-between;">
          <span>24h Low: ${detail.currency === 'INR' ? '₹' : '$'}${detail.low.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
          <span>24h High: ${detail.currency === 'INR' ? '₹' : '$'}${detail.high.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
        </div>
        <!-- High/Low visual range slider -->
        <div class="high-low-track">
          <div class="high-low-fill" style="left:0; width: ${rangePct * 100}%;"></div>
          <div class="high-low-dot" style="left: ${rangePct * 100}%;"></div>
        </div>
      </div>
      <div class="modal-stat-item">
        <div class="ms-label">52-Week High</div>
        <div class="ms-value">${detail.currency === 'INR' ? '₹' : '$'}${detail.fiftyTwoWeekHigh.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
      </div>
      <div class="modal-stat-item">
        <div class="ms-label">52-Week Low</div>
        <div class="ms-value">${detail.currency === 'INR' ? '₹' : '$'}${detail.fiftyTwoWeekLow.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
      </div>
      <div class="modal-stat-item">
        <div class="ms-label">Volume</div>
        <div class="ms-value">${detail.volume}</div>
      </div>
      <div class="modal-stat-item">
        <div class="ms-label">Market Capital</div>
        <div class="ms-value">${detail.marketCap}</div>
      </div>
    </div>
  `;

  // Attach range buttons click
  content.querySelectorAll('.chart-range-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedRange = btn.getAttribute('data-range');
      if (selectedRange) {
        openAssetDetailModal(symbol, selectedRange);
      }
    });
  });
}

function closeAssetDetailModal(): void {
  const modal = document.getElementById('assetDetailModal');
  if (modal) modal.style.display = 'none';
  document.body.style.overflow = '';
}

// ─── Fetch fresh data and refresh Markets Hub ───
export async function updateMarketsHubUI(silent = false): Promise<void> {
  if (!silent) {
    const tableContainer = document.getElementById('hubAssetTable');
    if (tableContainer) {
      tableContainer.innerHTML = `
        <div style="padding: 40px; text-align: center; color: var(--text-secondary);">
          <span class="loading-spinner"></span> Refreshing rates...
        </div>
      `;
    }
  }

  try {
    const assets = await fetchMarketsHubAssets();
    currentAssets = assets;

    // Update global tickers
    updateGlobalHeaderTickers(assets);

    // Render active tab
    renderActiveTabTable();
  } catch (e) {
    console.error('Failed to update markets hub data:', e);
  }
}

function updateGlobalHeaderTickers(assets: {
  equities: MarketAsset[];
  commodities: MarketAsset[];
  currencies: MarketAsset[];
  crypto: MarketAsset[];
}): void {
  // USD/INR
  const usd = assets.currencies.find(c => c.symbol === 'USDINR=X');
  if (usd) {
    const el = document.getElementById('usdInrPrice');
    const ch = document.getElementById('usdInrChange');
    if (el) el.textContent = `₹${usd.price.toFixed(2)}`;
    if (ch) {
      ch.textContent = `${usd.changePercent >= 0 ? '+' : ''}${usd.changePercent.toFixed(2)}%`;
      ch.className = `stat-change-pct ${usd.changePercent >= 0 ? 'up' : 'down'}`;
    }
  }

  // CNY/INR
  const cny = assets.currencies.find(c => c.symbol === 'CNYINR=X');
  if (cny) {
    const el = document.getElementById('cnyInrPrice');
    const ch = document.getElementById('cnyInrChange');
    if (el) el.textContent = `₹${cny.price.toFixed(2)}`;
    if (ch) {
      ch.textContent = `${cny.changePercent >= 0 ? '+' : ''}${cny.changePercent.toFixed(2)}%`;
      ch.className = `stat-change-pct ${cny.changePercent >= 0 ? 'up' : 'down'}`;
    }
  }

  // Gold
  const gold = assets.commodities.find(c => c.symbol === 'GC=F');
  if (gold) {
    const el = document.getElementById('goldRatePrice');
    const ch = document.getElementById('goldRateChange');
    if (el) el.textContent = `₹${gold.price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    if (ch) {
      ch.textContent = `${gold.changePercent >= 0 ? '+' : ''}${gold.changePercent.toFixed(2)}%`;
      ch.className = `stat-change-pct ${gold.changePercent >= 0 ? 'up' : 'down'}`;
    }
  }

  // Silver
  const silver = assets.commodities.find(c => c.symbol === 'SI=F');
  if (silver) {
    const el = document.getElementById('silverRatePrice');
    const ch = document.getElementById('silverRateChange');
    if (el) el.textContent = `₹${silver.price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
    if (ch) {
      ch.textContent = `${silver.changePercent >= 0 ? '+' : ''}${silver.changePercent.toFixed(2)}%`;
      ch.className = `stat-change-pct ${silver.changePercent >= 0 ? 'up' : 'down'}`;
    }
  }
}

// ─── Initialize Event Listeners ───
export function initMarketsHubEvents(): void {
  // Tab buttons
  document.querySelectorAll('[data-hub-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-hub-tab') as typeof activeTab;
      if (!tab) return;

      document.querySelectorAll('[data-hub-tab]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      activeTab = tab;

      // Show/Hide sector bar based on tab
      const sectorBar = document.getElementById('hubSectorBar');
      if (sectorBar) {
        sectorBar.style.display = tab === 'equity' ? 'flex' : 'none';
      }

      renderActiveTabTable();
    });
  });

  // Sector pills (Equities filtering)
  document.querySelectorAll('[data-sector]').forEach(pill => {
    pill.addEventListener('click', () => {
      const sector = pill.getAttribute('data-sector');
      if (!sector) return;

      document.querySelectorAll('[data-sector]').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      activeEquitySector = sector;
      renderActiveTabTable();
    });
  });


  // Table Sorting
  const hubTableContainer = document.getElementById('hubTableContainer');
  if (hubTableContainer) {
    hubTableContainer.addEventListener('click', (e) => {
      const th = (e.target as HTMLElement).closest('th[data-sort]');
      if (!th) return;
      const col = th.getAttribute('data-sort') as SortColumn;
      if (col) {
        if (sortCol === col) {
          sortDir *= -1;
        } else {
          sortCol = col;
          sortDir = -1; // Default descending
        }
        renderActiveTabTable();
      }
    });
  }

  // Search input events
  const searchInput = document.getElementById('hubSearchInput') as HTMLInputElement;
  const searchSuggestions = document.getElementById('hubSearchSuggestions');
  const searchClear = document.getElementById('hubSearchClear');

  if (searchInput && searchSuggestions) {
    let debTimeout: any;
    searchInput.addEventListener('input', () => {
      clearTimeout(debTimeout);
      const val = searchInput.value;
      
      if (searchClear) searchClear.style.display = val.length > 0 ? '' : 'none';
      
      debTimeout = setTimeout(() => {
        handleSearchInput(val);
      }, 300);
    });

    // Close suggestions on outside click
    document.addEventListener('click', (e) => {
      if (e.target !== searchInput && !searchSuggestions.contains(e.target as Node)) {
        searchSuggestions.style.display = 'none';
      }
    });

    // Clear search
    searchClear?.addEventListener('click', () => {
      searchInput.value = '';
      searchSuggestions.style.display = 'none';
      searchClear.style.display = 'none';
      searchInput.focus();
    });
  }

  // Modal events
  const modalClose = document.getElementById('assetModalClose');
  const modalBackdrop = document.getElementById('assetModalBackdrop');

  modalClose?.addEventListener('click', closeAssetDetailModal);
  modalBackdrop?.addEventListener('click', closeAssetDetailModal);

  // Quick stat cards at top click to open modal
  document.querySelectorAll('.hub-header-stat-card').forEach(card => {
    card.addEventListener('click', () => {
      const sym = card.getAttribute('data-stat-symbol');
      if (sym) openAssetDetailModal(sym);
    });
  });

  // Initial load
  updateMarketsHubUI();
}
