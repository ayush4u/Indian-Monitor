// ─── News Service — LIVE RSS from Google News ───

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  category: string;
  timestamp: Date;
  state?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  url?: string;
}

// ─── RSS Fetching via Vite proxy ───
let newsCache: NewsItem[] = [];
let breakingCache: NewsItem[] = [];
let lastNewsFetch = 0;
const NEWS_CACHE_TTL = 120_000; // 2 minutes
let newsCounter = 0;

const RSS_FEEDS: { query: string; category: string }[] = [
  { query: 'India', category: 'general' },
  { query: 'India economy finance RBI', category: 'economy' },
  { query: 'India politics parliament modi', category: 'politics' },
  { query: 'India technology startup', category: 'technology' },
  { query: 'Indian railways metro transport', category: 'transport' },
  { query: 'India weather monsoon IMD', category: 'climate' },
  { query: 'ISRO India space', category: 'space' },
  { query: 'India defense military', category: 'defense' },
];

function parseSeverity(title: string): NewsItem['severity'] {
  const lower = title.toLowerCase();
  if (lower.includes('breaking') || lower.includes('alert') || lower.includes('killed') || lower.includes('earthquake') || lower.includes('cyclone') || lower.includes('emergency')) return 'critical';
  if (lower.includes('major') || lower.includes('record') || lower.includes('billion') || lower.includes('historic') || lower.includes('crash') || lower.includes('surge')) return 'high';
  if (lower.includes('update') || lower.includes('report') || lower.includes('plan') || lower.includes('launch')) return 'medium';
  return 'low';
}

function parseRSSXml(xml: string, category: string): NewsItem[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const items = doc.querySelectorAll('item');
  const results: NewsItem[] = [];

  items.forEach((item, i) => {
    if (i >= 8) return; // Limit per feed
    const title = item.querySelector('title')?.textContent?.trim() || '';
    const link = item.querySelector('link')?.textContent?.trim() || '';
    const pubDate = item.querySelector('pubDate')?.textContent?.trim() || '';
    const source = item.querySelector('source')?.textContent?.trim() || 'Google News';

    if (!title) return;

    results.push({
      id: `live-${++newsCounter}`,
      title: cleanTitle(title),
      source,
      category,
      timestamp: pubDate ? new Date(pubDate) : new Date(),
      severity: parseSeverity(title),
      url: link,
    });
  });

  return results;
}

function cleanTitle(title: string): string {
  // Google News appends " - Source Name" at the end
  return title.replace(/\s*-\s*[^-]+$/, '').trim() || title;
}

export async function fetchLiveNews(): Promise<NewsItem[]> {
  if (newsCache.length > 0 && Date.now() - lastNewsFetch < NEWS_CACHE_TTL) {
    return newsCache;
  }

  const allNews: NewsItem[] = [];

  const fetches = RSS_FEEDS.map(async (feed) => {
    try {
      const url = `/api/news/rss/search?q=${encodeURIComponent(feed.query)}&hl=en-IN&gl=IN&ceid=IN:en`;
      const res = await fetch(url);
      if (!res.ok) return [];
      const xml = await res.text();
      return parseRSSXml(xml, feed.category);
    } catch {
      return [];
    }
  });

  const results = await Promise.allSettled(fetches);
  results.forEach(r => {
    if (r.status === 'fulfilled') allNews.push(...r.value);
  });

  // Sort by time, deduplicate by title similarity
  allNews.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  // Simple dedup
  const seen = new Set<string>();
  const deduped = allNews.filter(n => {
    const key = n.title.toLowerCase().substring(0, 40);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  newsCache = deduped;
  breakingCache = deduped.filter(n => n.severity === 'critical' || n.severity === 'high').slice(0, 8);
  lastNewsFetch = Date.now();

  return newsCache;
}

// ─── Sync getters (use cache) ───

export function getLatestNews(category?: string, limit = 15): NewsItem[] {
  let items = newsCache.length > 0 ? newsCache : FALLBACK_NEWS;
  if (category) {
    items = items.filter(n => n.category === category);
  }
  return items.slice(0, limit);
}

export function getBreakingNews(): NewsItem[] {
  if (breakingCache.length > 0) return breakingCache;
  return FALLBACK_NEWS.filter(n => n.severity === 'critical' || n.severity === 'high').slice(0, 5);
}

export function getNewsByState(stateCode: string): NewsItem[] {
  // First try exact state code match
  const exact = newsCache.filter(n => n.state === stateCode);
  if (exact.length > 0) return exact;

  // Keyword matching: search news titles for state name, capital, or major city names
  const STATE_KEYWORDS: Record<string, string[]> = {
    'AP': ['Andhra Pradesh', 'Amaravati', 'Visakhapatnam', 'Vizag', 'Tirupati', 'Vijayawada'],
    'AR': ['Arunachal Pradesh', 'Itanagar'],
    'AS': ['Assam', 'Guwahati', 'Dispur'],
    'BR': ['Bihar', 'Patna', 'Gaya', 'Muzaffarpur', 'Darbhanga'],
    'CT': ['Chhattisgarh', 'Raipur', 'Bilaspur'],
    'GA': ['Goa', 'Panaji', 'Margao'],
    'GJ': ['Gujarat', 'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'],
    'HR': ['Haryana', 'Chandigarh', 'Gurugram', 'Faridabad'],
    'HP': ['Himachal Pradesh', 'Shimla', 'Manali', 'Dharamshala'],
    'JH': ['Jharkhand', 'Ranchi', 'Jamshedpur', 'Dhanbad'],
    'KA': ['Karnataka', 'Bengaluru', 'Bangalore', 'Mysuru', 'Mangalore', 'Hubli'],
    'KL': ['Kerala', 'Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur'],
    'MP': ['Madhya Pradesh', 'Bhopal', 'Indore', 'Jabalpur', 'Gwalior'],
    'MH': ['Maharashtra', 'Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad'],
    'MN': ['Manipur', 'Imphal'],
    'ML': ['Meghalaya', 'Shillong'],
    'MZ': ['Mizoram', 'Aizawl'],
    'NL': ['Nagaland', 'Kohima', 'Dimapur'],
    'OD': ['Odisha', 'Bhubaneswar', 'Cuttack', 'Puri'],
    'PB': ['Punjab', 'Ludhiana', 'Amritsar', 'Jalandhar'],
    'RJ': ['Rajasthan', 'Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
    'SK': ['Sikkim', 'Gangtok'],
    'TN': ['Tamil Nadu', 'Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli'],
    'TG': ['Telangana', 'Hyderabad', 'Secunderabad', 'Warangal'],
    'TR': ['Tripura', 'Agartala'],
    'UP': ['Uttar Pradesh', 'Lucknow', 'Varanasi', 'Kanpur', 'Agra', 'Noida', 'Prayagraj', 'Meerut', 'Allahabad'],
    'UK': ['Uttarakhand', 'Dehradun', 'Haridwar', 'Rishikesh', 'Nainital'],
    'WB': ['West Bengal', 'Kolkata', 'Howrah', 'Siliguri', 'Darjeeling'],
    'DL': ['Delhi', 'New Delhi'],
    'JK': ['Jammu', 'Kashmir', 'Srinagar'],
    'LA': ['Ladakh', 'Leh'],
    'CH': ['Chandigarh'],
    'PY': ['Puducherry', 'Pondicherry'],
    'AN': ['Andaman', 'Nicobar', 'Port Blair'],
  };

  const keywords = STATE_KEYWORDS[stateCode] || [];
  if (keywords.length === 0) return [];

  const items = newsCache.length > 0 ? newsCache : FALLBACK_NEWS;
  return items.filter(n => {
    const titleLower = n.title.toLowerCase();
    return keywords.some(kw => titleLower.includes(kw.toLowerCase()));
  }).slice(0, 10);
}

// ─── Fallback news (shown while RSS loads) ───
const FALLBACK_NEWS: NewsItem[] = [
  { id: 'f1', title: 'Loading live news from Google News RSS...', source: 'India Monitor', category: 'general', timestamp: new Date(), severity: 'low' },
  { id: 'f2', title: 'Markets data loading from Yahoo Finance...', source: 'India Monitor', category: 'economy', timestamp: new Date(), severity: 'low' },
  { id: 'f3', title: 'Weather data loading from Open-Meteo...', source: 'India Monitor', category: 'climate', timestamp: new Date(), severity: 'low' },
  { id: 'f4', title: 'Earthquake data loading from USGS...', source: 'India Monitor', category: 'disaster', timestamp: new Date(), severity: 'low' },
];
