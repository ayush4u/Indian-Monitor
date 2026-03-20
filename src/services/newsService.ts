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

const isLocal = () => location.hostname === 'localhost' || location.hostname === '127.0.0.1';

export async function fetchLiveNews(): Promise<NewsItem[]> {
  if (newsCache.length > 0 && Date.now() - lastNewsFetch < NEWS_CACHE_TTL) {
    return newsCache;
  }

  // On static hosting, use offline news immediately
  if (!isLocal()) {
    newsCache = OFFLINE_NEWS();
    breakingCache = newsCache.filter(n => n.severity === 'critical' || n.severity === 'high').slice(0, 8);
    lastNewsFetch = Date.now();
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

// ─── Rich offline news for demo/static hosting ───
function OFFLINE_NEWS(): NewsItem[] {
  const ago = (h: number) => new Date(Date.now() - h * 3600_000);
  return [
    { id: 'o1', title: 'RBI keeps repo rate unchanged at 6.5% amid inflation concerns', source: 'Economic Times', category: 'economy', timestamp: ago(0.5), severity: 'critical' },
    { id: 'o2', title: 'SENSEX crosses 78,000 mark for first time; IT stocks lead rally', source: 'Moneycontrol', category: 'economy', timestamp: ago(1), severity: 'high' },
    { id: 'o3', title: 'IMD issues orange alert for heavy rainfall in Maharashtra and Gujarat', source: 'India Today', category: 'climate', timestamp: ago(1.5), severity: 'high' },
    { id: 'o4', title: 'India successfully tests next-gen Agni-Prime ballistic missile', source: 'NDTV', category: 'defence', timestamp: ago(2), severity: 'critical' },
    { id: 'o5', title: 'PM Modi inaugurates India\'s longest sea bridge connecting Mumbai', source: 'The Hindu', category: 'politics', timestamp: ago(2.5), severity: 'high' },
    { id: 'o6', title: 'ISRO announces timeline for Gaganyaan crewed mission launch', source: 'Times of India', category: 'science', timestamp: ago(3), severity: 'high' },
    { id: 'o7', title: 'UPI transactions cross 18 billion in monthly volume', source: 'Business Standard', category: 'economy', timestamp: ago(3.5), severity: 'medium' },
    { id: 'o8', title: 'Indian Railways launches 50 new Vande Bharat routes this quarter', source: 'Hindustan Times', category: 'transport', timestamp: ago(4), severity: 'medium' },
    { id: 'o9', title: 'Bengaluru Metro Phase 3 gets cabinet approval for ₹15,000 crore', source: 'Deccan Herald', category: 'transport', timestamp: ago(4.5), severity: 'medium' },
    { id: 'o10', title: 'Chandrayaan-4 sample return mission enters design phase', source: 'Indian Express', category: 'science', timestamp: ago(5), severity: 'medium' },
    { id: 'o11', title: 'Delhi AQI improves to moderate category after rainfall', source: 'NDTV', category: 'climate', timestamp: ago(5.5), severity: 'low' },
    { id: 'o12', title: 'India\'s GDP growth estimated at 7.2% for current fiscal year', source: 'Reuters', category: 'economy', timestamp: ago(6), severity: 'high' },
    { id: 'o13', title: 'Tata Semiconductor fab in Gujarat begins trial production', source: 'Economic Times', category: 'technology', timestamp: ago(6.5), severity: 'medium' },
    { id: 'o14', title: 'Supreme Court directs states to implement EV charging infrastructure', source: 'LiveMint', category: 'politics', timestamp: ago(7), severity: 'medium' },
    { id: 'o15', title: 'Nifty IT index surges 3% on strong quarterly earnings', source: 'Moneycontrol', category: 'economy', timestamp: ago(7.5), severity: 'medium' },
    { id: 'o16', title: 'Earthquake of magnitude 4.2 hits Manipur, no casualties reported', source: 'Times of India', category: 'disaster', timestamp: ago(8), severity: 'high' },
    { id: 'o17', title: 'India and Japan sign ₹75,000 crore bullet train phase 2 agreement', source: 'The Hindu', category: 'transport', timestamp: ago(9), severity: 'medium' },
    { id: 'o18', title: 'FII net inflows cross $2.5 billion in current month', source: 'Business Standard', category: 'economy', timestamp: ago(10), severity: 'medium' },
    { id: 'o19', title: 'Mumbai Metro Line 3 operational: Aqua Line connects airport to city', source: 'Hindustan Times', category: 'transport', timestamp: ago(11), severity: 'medium' },
    { id: 'o20', title: 'India\'s renewable energy capacity crosses 200 GW milestone', source: 'Reuters', category: 'science', timestamp: ago(12), severity: 'medium' },
    { id: 'o21', title: 'Parliament passes Digital India Act with data privacy provisions', source: 'Indian Express', category: 'politics', timestamp: ago(13), severity: 'high' },
    { id: 'o22', title: 'Cyclone warning issued for Odisha and Andhra Pradesh coast', source: 'India Today', category: 'disaster', timestamp: ago(14), severity: 'critical' },
    { id: 'o23', title: 'Adani Green commissions world\'s largest solar-wind hybrid plant', source: 'Economic Times', category: 'economy', timestamp: ago(15), severity: 'medium' },
    { id: 'o24', title: 'Indian startups raise $3.8 billion in Q1 2026 funding', source: 'Inc42', category: 'technology', timestamp: ago(16), severity: 'medium' },
    { id: 'o25', title: 'Air India inducts 25 new A350 aircraft, expands international routes', source: 'LiveMint', category: 'transport', timestamp: ago(17), severity: 'low' },
    { id: 'o26', title: 'India\'s forex reserves reach all-time high of $690 billion', source: 'Reuters', category: 'economy', timestamp: ago(18), severity: 'medium' },
    { id: 'o27', title: 'DRDO successfully tests indigenous anti-satellite weapon system', source: 'NDTV', category: 'defence', timestamp: ago(20), severity: 'high' },
    { id: 'o28', title: 'Smart Cities Mission 2.0 launched covering 200 cities', source: 'The Hindu', category: 'politics', timestamp: ago(22), severity: 'medium' },
    { id: 'o29', title: 'Coal India achieves record 900 MT production target', source: 'Business Standard', category: 'economy', timestamp: ago(24), severity: 'low' },
    { id: 'o30', title: 'INS Vikrant carrier group completes maiden operational deployment', source: 'Hindustan Times', category: 'defence', timestamp: ago(26), severity: 'medium' },
  ];
}
