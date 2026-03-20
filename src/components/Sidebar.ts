// ─── Sidebar Component ───

import { icons } from '../utils/icons';

export type View = 'dashboard' | 'news' | 'finance' | 'weather' | 'transport' | 'flights' | 'states';

interface NavItem {
  id: View;
  iconFn: (s: number) => string;
  label: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', iconFn: (s) => icons.dashboard(s), label: 'Dashboard' },
  { id: 'news', iconFn: (s) => icons.news(s), label: 'News Intel', badge: '30+' },
  { id: 'finance', iconFn: (s) => icons.finance(s), label: 'Markets' },
  { id: 'weather', iconFn: (s) => icons.weather(s), label: 'Weather & AQI' },
  { id: 'transport', iconFn: (s) => icons.train(s), label: 'Rail & Metro' },
  { id: 'flights', iconFn: (s) => icons.plane(s), label: 'Flight Radar', badge: 'LIVE' },
  { id: 'states', iconFn: (s) => icons.globe(s), label: 'States' },
];

export function createSidebar(activeView: View): string {
  const navItemsHtml = NAV_ITEMS.map(item => `
    <div class="nav-item ${item.id === activeView ? 'active' : ''}" data-view="${item.id}">
      <span class="nav-icon">${item.iconFn(16)}</span>
      <span class="nav-label">${item.label}</span>
      ${item.badge ? `<span class="nav-badge">${item.badge}</span>` : ''}
    </div>
  `).join('');

  return `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-section">
        <div class="sidebar-title">Navigation</div>
        ${navItemsHtml}
      </div>
      <div class="sidebar-section">
        <div class="sidebar-title">Data Sources</div>
        <div style="padding: 4px 10px; font-size: 10px; color: var(--text-tertiary); line-height: 1.6;">
          IMD Weather • NSE/BSE • Indian Railways • 
          CPCB Air Quality • USGS Earthquakes • 
          Google News RSS • Open-Meteo
        </div>
      </div>
      <div class="sidebar-section" style="margin-top: auto; border-bottom: none;">
        <div style="padding: 4px 10px; font-size: 10px; color: var(--text-tertiary); line-height: 1.5;">
          <strong style="color: var(--accent-orange);">India Monitor</strong> v1.0<br/>
          28 States • 8 UTs • Real-time Intel
        </div>
      </div>
    </aside>
    <div class="sidebar-overlay" id="sidebarOverlay"></div>
  `;
}
