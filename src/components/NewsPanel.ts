// ─── News Panel Component ───

import { getLatestNews, getBreakingNews, type NewsItem } from '../services/newsService';
import { icons } from '../utils/icons';
import { timeAgo } from '../utils/formatters';

export function createBreakingBar(): string {
  const breaking = getBreakingNews();
  const scrollText = breaking.map(n =>
    `<span>⚡ ${n.title} — <em style="color:var(--text-tertiary)">${n.source}</em></span>`
  ).join('');

  return `
    <div class="breaking-bar">
      <div class="breaking-label">
        <span class="live-dot"></span>
        Breaking
      </div>
      <div class="breaking-text">
        <div class="breaking-scroll">${scrollText}${scrollText}</div>
      </div>
    </div>
  `;
}

export function createNewsPanel(): string {
  const news = getLatestNews(undefined, 12);

  return `
    <div class="card">
      <div class="card-header">
        <div class="card-title">
          ${icons.news(14)}
          Intelligence Feed
        </div>
        <div class="card-actions">
          <button class="card-action-btn active" data-news-filter="all">All</button>
          <button class="card-action-btn" data-news-filter="critical">Critical</button>
          <button class="card-action-btn" data-news-filter="high">High</button>
        </div>
      </div>
      <div class="card-body" style="max-height: 400px;">
        <div class="news-list" id="newsList">
          ${renderNewsList(news)}
        </div>
      </div>
    </div>
  `;
}

export function renderNewsList(news: NewsItem[]): string {
  return news.map(item => `
    <div class="news-item" data-severity="${item.severity}">
      <div class="news-severity ${item.severity}"></div>
      <div class="news-content">
        <div class="news-title">${sanitize(item.title)}</div>
        <div class="news-meta">
          <span class="news-source">${sanitize(item.source)}</span>
          <span class="news-category-tag">${sanitize(item.category)}</span>
          ${item.state ? `<span style="color:var(--accent-cyan)">📍 ${sanitize(item.state)}</span>` : ''}
          <span>${timeAgo(item.timestamp)}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function sanitize(str: string): string {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function initNewsFilters(): void {
  document.querySelectorAll('[data-news-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-news-filter');
      document.querySelectorAll('[data-news-filter]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const listEl = document.getElementById('newsList');
      if (!listEl) return;

      let news: NewsItem[];
      if (filter === 'critical') {
        news = getLatestNews().filter(n => n.severity === 'critical');
      } else if (filter === 'high') {
        news = getLatestNews().filter(n => n.severity === 'high' || n.severity === 'critical');
      } else {
        news = getLatestNews(undefined, 12);
      }

      listEl.innerHTML = renderNewsList(news);
    });
  });
}
