// ─── State Detail Panel ───

import { STATES, ZONE_COLORS, type StateData } from '../data/states';
import { getNewsByState } from '../services/newsService';
import { renderNewsList } from './NewsPanel';

export function createStateDetailOverlay(): string {
  return `
    <div class="state-detail-overlay" id="stateDetailOverlay">
      <div class="state-detail-panel" id="stateDetailPanel">
        <div class="state-detail-header">
          <div class="state-detail-title" id="stateDetailTitle">State</div>
          <button class="state-detail-close" id="stateDetailClose">✕</button>
        </div>
        <div class="state-detail-body" id="stateDetailBody"></div>
      </div>
    </div>
  `;
}

export function showStateDetail(stateCode: string): void {
  const state = STATES.find(s => s.code === stateCode);
  if (!state) return;

  const overlay = document.getElementById('stateDetailOverlay');
  const titleEl = document.getElementById('stateDetailTitle');
  const bodyEl = document.getElementById('stateDetailBody');

  if (!overlay || !titleEl || !bodyEl) return;

  titleEl.innerHTML = `
    <span style="color: ${ZONE_COLORS[state.zone] || 'var(--accent-orange)'}">${state.code}</span>
    ${state.name}
    <span style="font-size: 12px; color: var(--text-tertiary); font-weight: 400; margin-left: 8px;">${state.type === 'ut' ? 'Union Territory' : 'State'}</span>
  `;

  const news = getNewsByState(stateCode);

  bodyEl.innerHTML = renderStateBody(state, news.length > 0);

  // Render news if available
  const newsContainer = document.getElementById('stateNews');
  if (newsContainer && news.length > 0) {
    newsContainer.innerHTML = renderNewsList(news);
  }

  overlay.classList.add('open');
}

function renderStateBody(state: StateData, hasNews: boolean): string {
  return `
    <div class="state-info-grid">
      <div class="state-info-item">
        <div class="state-info-label">Population</div>
        <div class="state-info-value">${state.population}M</div>
      </div>
      <div class="state-info-item">
        <div class="state-info-label">Area</div>
        <div class="state-info-value">${state.area.toLocaleString()}<span style="font-size:10px; color:var(--text-tertiary);"> km²</span></div>
      </div>
      <div class="state-info-item">
        <div class="state-info-label">GDP</div>
        <div class="state-info-value" style="color: var(--accent-teal);">$${state.gdp}B</div>
      </div>
      <div class="state-info-item">
        <div class="state-info-label">Literacy</div>
        <div class="state-info-value" style="color: var(--accent-blue);">${state.literacy}%</div>
      </div>
      <div class="state-info-item">
        <div class="state-info-label">Capital</div>
        <div class="state-info-value" style="font-size:14px;">${state.capital}</div>
      </div>
      <div class="state-info-item">
        <div class="state-info-label">Zone</div>
        <div class="state-info-value" style="font-size:14px; color: ${ZONE_COLORS[state.zone] || 'var(--text-primary)'};">${state.zone}</div>
      </div>
      <div class="state-info-item">
        <div class="state-info-label">Languages</div>
        <div class="state-info-value" style="font-size:12px;">${state.languages.join(', ')}</div>
      </div>
      <div class="state-info-item">
        <div class="state-info-label">Density</div>
        <div class="state-info-value">${Math.round((state.population * 1_000_000) / state.area)}<span style="font-size:10px; color:var(--text-tertiary);"> /km²</span></div>
      </div>
    </div>

    ${hasNews ? `
      <div class="state-section-title">📰 Latest News from ${state.name}</div>
      <div class="news-list" id="stateNews"></div>
    ` : `
      <div class="state-section-title">📰 News</div>
      <div style="padding: 12px; text-align: center; color: var(--text-tertiary); font-size: 12px;">
        No recent news from ${state.name}
      </div>
    `}

    <div class="state-section-title">📊 Quick Comparison</div>
    <div style="font-size: 11px; color: var(--text-secondary); line-height: 1.8;">
      <div style="display:flex; justify-content:space-between; padding: 4px 0; border-bottom: 1px solid var(--border-subtle);">
        <span>GDP per capita</span>
        <span style="font-family:var(--font-mono); font-weight:600;">$${state.population > 0 ? Math.round((state.gdp * 1000) / state.population).toLocaleString() : '—'}</span>
      </div>
      <div style="display:flex; justify-content:space-between; padding: 4px 0; border-bottom: 1px solid var(--border-subtle);">
        <span>Share of India's GDP</span>
        <span style="font-family:var(--font-mono); font-weight:600;">${((state.gdp / 3500) * 100).toFixed(1)}%</span>
      </div>
      <div style="display:flex; justify-content:space-between; padding: 4px 0;">
        <span>Share of India's Population</span>
        <span style="font-family:var(--font-mono); font-weight:600;">${((state.population / 1400) * 100).toFixed(1)}%</span>
      </div>
    </div>
  `;
}

export function initStateDetailClose(): void {
  const closeBtn = document.getElementById('stateDetailClose');
  const overlay = document.getElementById('stateDetailOverlay');

  if (closeBtn && overlay) {
    closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  }
}
