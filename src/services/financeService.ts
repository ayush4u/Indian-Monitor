// ─── Finance Service — LIVE DATA from Yahoo Finance ───

export interface StockIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
  volume: string;
  exchange: string;
  lastUpdated: string;
}

export interface StockTicker {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  sector: string;
  marketCap: string;
}

export interface SectorData {
  name: string;
  change: number;
  topGainer: string;
  topLoser: string;
  momentum: 'bullish' | 'bearish' | 'neutral';
  weekChange?: number;
}

export interface MarketSummary {
  indices: StockIndex[];
  sectors: SectorData[];
  stocks: StockTicker[];
  gainers: StockTicker[];
  losers: StockTicker[];
  fiiFlow: number;
  diiFlow: number;
  upiVolume: number;
  upiValue: number;
  marketCap: number;
  advanceDecline: { advances: number; declines: number; unchanged: number };
  isLive: boolean;
  lastFetch: Date;
}

// Yahoo Finance symbols for Indian market
const YAHOO_SYMBOLS: { symbol: string; name: string; exchange: string }[] = [
  { symbol: '^BSESN', name: 'SENSEX', exchange: 'BSE' },
  { symbol: '^NSEI', name: 'NIFTY 50', exchange: 'NSE' },
  { symbol: '^NSEBANK', name: 'BANK NIFTY', exchange: 'NSE' },
  { symbol: '^CNXIT', name: 'NIFTY IT', exchange: 'NSE' },
  { symbol: '^CNXPHARMA', name: 'NIFTY PHARMA', exchange: 'NSE' },
  { symbol: '^CNXAUTO', name: 'NIFTY AUTO', exchange: 'NSE' },
  { symbol: '^INDIAVIX', name: 'INDIA VIX', exchange: 'NSE' },
];

// Cache for market data
let cachedData: MarketSummary | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 15_000; // 15 seconds

const isLocal = () => location.hostname === 'localhost' || location.hostname === '127.0.0.1';

async function fetchYahooQuote(symbol: string): Promise<{
  price: number; change: number; changePercent: number;
  high: number; low: number; open: number; prevClose: number;
  volume: number; lastUpdated: string;
} | null> {
  if (!isLocal()) return null;
  try {
    const url = `/api/yahoo/v8/finance/chart/${encodeURIComponent(symbol)}?range=1d&interval=1m&includePrePost=false`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    const result = data?.chart?.result?.[0];
    if (!result) return null;

    const meta = result.meta;
    const price = meta.regularMarketPrice ?? 0;
    const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? 0;
    const change = price - prevClose;
    const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;

    const indicators = result.indicators?.quote?.[0];
    let high = meta.regularMarketDayHigh ?? price;
    let low = meta.regularMarketDayLow ?? price;
    const open = meta.regularMarketOpen ?? prevClose;
    let volume = meta.regularMarketVolume ?? 0;

    if (indicators) {
      const highs = (indicators.high || []).filter((v: number | null) => v != null);
      const lows = (indicators.low || []).filter((v: number | null) => v != null);
      if (highs.length) high = Math.max(...highs);
      if (lows.length) low = Math.min(...lows);
      const volumes = (indicators.volume || []).filter((v: number | null) => v != null);
      if (volumes.length) volume = volumes.reduce((a: number, b: number) => a + b, 0);
    }

    const marketTime = meta.regularMarketTime ? new Date(meta.regularMarketTime * 1000) : new Date();
    const lastUpdated = marketTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    return { price, change, changePercent, high, low, open, prevClose, volume, lastUpdated };
  } catch {
    return null;
  }
}

function formatVolume(vol: number): string {
  if (vol >= 1e7) return (vol / 1e7).toFixed(1) + 'Cr';
  if (vol >= 1e5) return (vol / 1e5).toFixed(1) + 'L';
  if (vol >= 1e3) return (vol / 1e3).toFixed(1) + 'K';
  return vol.toString();
}

const SECTOR_META = [
  { symbol: '^CNXIT', name: 'IT', gainer: 'TCS', loser: 'Wipro' },
  { symbol: '^NSEBANK', name: 'Banking', gainer: 'HDFC Bank', loser: 'PNB' },
  { symbol: '^CNXPHARMA', name: 'Pharma', gainer: 'Sun Pharma', loser: 'Cipla' },
  { symbol: '^CNXAUTO', name: 'Auto', gainer: 'Tata Motors', loser: 'Hero Moto' },
  { symbol: '^CNXENERGY', name: 'Energy', gainer: 'Adani Green', loser: 'ONGC' },
  { symbol: '^CNXFMCG', name: 'FMCG', gainer: 'HUL', loser: 'Dabur' },
  { symbol: '^CNXMETAL', name: 'Metal', gainer: 'Tata Steel', loser: 'JSW Steel' },
  { symbol: '^CNXREALTY', name: 'Realty', gainer: 'DLF', loser: 'Godrej Prop' },
];

// Top NIFTY 50 individual stocks (Yahoo Finance .NS suffix for NSE)
const NIFTY_STOCKS: { symbol: string; name: string; sector: string }[] = [
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries', sector: 'Energy' },
  { symbol: 'TCS.NS', name: 'TCS', sector: 'IT' },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', sector: 'Banking' },
  { symbol: 'INFY.NS', name: 'Infosys', sector: 'IT' },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank', sector: 'Banking' },
  { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever', sector: 'FMCG' },
  { symbol: 'SBIN.NS', name: 'SBI', sector: 'Banking' },
  { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel', sector: 'Telecom' },
  { symbol: 'ITC.NS', name: 'ITC', sector: 'FMCG' },
  { symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank', sector: 'Banking' },
  { symbol: 'LT.NS', name: 'Larsen & Toubro', sector: 'Infra' },
  { symbol: 'AXISBANK.NS', name: 'Axis Bank', sector: 'Banking' },
  { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance', sector: 'Finance' },
  { symbol: 'MARUTI.NS', name: 'Maruti Suzuki', sector: 'Auto' },
  { symbol: 'TITAN.NS', name: 'Titan Company', sector: 'Consumer' },
  { symbol: 'SUNPHARMA.NS', name: 'Sun Pharma', sector: 'Pharma' },
  { symbol: 'TATAMOTORS.NS', name: 'Tata Motors', sector: 'Auto' },
  { symbol: 'ASIANPAINT.NS', name: 'Asian Paints', sector: 'Consumer' },
  { symbol: 'WIPRO.NS', name: 'Wipro', sector: 'IT' },
  { symbol: 'HCLTECH.NS', name: 'HCL Technologies', sector: 'IT' },
  { symbol: 'ADANIENT.NS', name: 'Adani Enterprises', sector: 'Conglomerate' },
  { symbol: 'NTPC.NS', name: 'NTPC', sector: 'Power' },
  { symbol: 'POWERGRID.NS', name: 'Power Grid Corp', sector: 'Power' },
  { symbol: 'TATASTEEL.NS', name: 'Tata Steel', sector: 'Metal' },
  { symbol: 'ONGC.NS', name: 'ONGC', sector: 'Energy' },
  { symbol: 'COALINDIA.NS', name: 'Coal India', sector: 'Mining' },
  { symbol: 'JSWSTEEL.NS', name: 'JSW Steel', sector: 'Metal' },
  { symbol: 'ULTRACEMCO.NS', name: 'UltraTech Cement', sector: 'Cement' },
  { symbol: 'M&M.NS', name: 'Mahindra & Mahindra', sector: 'Auto' },
  { symbol: 'TECHM.NS', name: 'Tech Mahindra', sector: 'IT' },
];

export async function fetchLiveMarketData(): Promise<MarketSummary> {
  // Return cache if fresh
  if (cachedData && Date.now() - lastFetchTime < CACHE_TTL) {
    return cachedData;
  }

  // Fetch main indices
  const results = await Promise.allSettled(
    YAHOO_SYMBOLS.map(s => fetchYahooQuote(s.symbol))
  );

  const indices: StockIndex[] = [];
  let isLive = false;

  results.forEach((result, i) => {
    const sym = YAHOO_SYMBOLS[i];
    if (result.status === 'fulfilled' && result.value) {
      const q = result.value;
      isLive = true;
      indices.push({
        name: sym.name,
        value: q.price,
        change: q.change,
        changePercent: q.changePercent,
        high: q.high,
        low: q.low,
        open: q.open,
        prevClose: q.prevClose,
        volume: formatVolume(q.volume),
        exchange: sym.exchange,
        lastUpdated: q.lastUpdated,
      });
    }
  });

  // If no live data at all, return fallback
  if (indices.length === 0) {
    return getFallbackData();
  }

  // Fetch sector data in parallel
  const sectorResults = await Promise.allSettled(
    SECTOR_META.map(s => fetchYahooQuote(s.symbol))
  );

  const sectors: SectorData[] = SECTOR_META.map((s, i) => {
    const result = sectorResults[i];
    const change = result.status === 'fulfilled' && result.value
      ? result.value.changePercent
      : 0;
    const momentum: SectorData['momentum'] = change > 0.5 ? 'bullish' : change < -0.5 ? 'bearish' : 'neutral';
    return { name: s.name, change: +change.toFixed(2), topGainer: s.gainer, topLoser: s.loser, momentum };
  });

  // Fetch individual NIFTY 50 stocks (batch in groups of 10)
  const stocks: StockTicker[] = [];
  for (let i = 0; i < NIFTY_STOCKS.length; i += 10) {
    const batch = NIFTY_STOCKS.slice(i, i + 10);
    const batchResults = await Promise.allSettled(
      batch.map(s => fetchYahooQuote(s.symbol))
    );
    batchResults.forEach((result, j) => {
      const meta = batch[j];
      if (result.status === 'fulfilled' && result.value) {
        const q = result.value;
        stocks.push({
          symbol: meta.symbol.replace('.NS', ''),
          name: meta.name,
          price: q.price,
          change: q.change,
          changePercent: q.changePercent,
          volume: formatVolume(q.volume),
          sector: meta.sector,
          marketCap: '',
        });
      }
    });
  }

  // Compute gainers and losers
  const sorted = [...stocks].sort((a, b) => b.changePercent - a.changePercent);
  const gainers = sorted.filter(s => s.changePercent > 0).slice(0, 10);
  const losers = sorted.filter(s => s.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent).slice(0, 10);

  // Compute advance/decline
  const advances = stocks.filter(s => s.change > 0).length;
  const declines = stocks.filter(s => s.change < 0).length;
  const unchanged = stocks.filter(s => s.change === 0).length;

  const summary: MarketSummary = {
    indices,
    sectors,
    stocks,
    gainers,
    losers,
    fiiFlow: 0,
    diiFlow: 0,
    upiVolume: 18.4,
    upiValue: 20.2,
    marketCap: 4.2,
    advanceDecline: { advances, declines, unchanged },
    isLive,
    lastFetch: new Date(),
  };

  cachedData = summary;
  lastFetchTime = Date.now();
  return summary;
}

function getFallbackData(): MarketSummary {
  const seed = new Date().getDate();
  const r = (base: number, range: number) => +(base + Math.sin(seed * 9301 + base) * range).toFixed(2);
  const rp = (base: number, range: number) => +(Math.sin(seed * 4327 + base) * range).toFixed(2);
  const idx = (name: string, base: number, ex: string) => {
    const change = rp(base, base * 0.012);
    const pct = +((change / base) * 100).toFixed(2);
    return { name, value: r(base, base * 0.005), change, changePercent: pct, high: r(base, base * 0.008), low: r(base, -base * 0.006), open: r(base, base * 0.002), prevClose: r(base, -base * 0.003), volume: ex === 'BSE' ? '2.1B' : '1.8B', exchange: ex, lastUpdated: 'demo' };
  };
  const fbIdx = [
    idx('SENSEX', 78250, 'BSE'), idx('NIFTY 50', 23680, 'NSE'), idx('BANK NIFTY', 50120, 'NSE'),
    idx('NIFTY PHARMA', 17480, 'NSE'), idx('NIFTY IT', 34920, 'NSE'), idx('INDIA VIX', 13.5, 'NSE'),
    idx('NIFTY AUTO', 23510, 'NSE'),
  ];
  const fbSectors: SectorData[] = [
    { name: 'IT', change: rp(1, 1.5), topGainer: 'TCS', topLoser: 'WIPRO', momentum: 'bullish' },
    { name: 'Banking', change: rp(2, 1.2), topGainer: 'HDFC', topLoser: 'PNB', momentum: 'bullish' },
    { name: 'Pharma', change: rp(3, 0.8), topGainer: 'SUN PHARMA', topLoser: 'CIPLA', momentum: 'neutral' },
    { name: 'Auto', change: rp(4, 1.0), topGainer: 'TATA MOTORS', topLoser: 'M&M', momentum: 'bullish' },
    { name: 'Energy', change: rp(5, 1.3), topGainer: 'RELIANCE', topLoser: 'ONGC', momentum: 'neutral' },
    { name: 'FMCG', change: rp(6, 0.6), topGainer: 'HUL', topLoser: 'ITC', momentum: 'bearish' },
    { name: 'Metal', change: rp(7, 1.8), topGainer: 'TATA STEEL', topLoser: 'HINDALCO', momentum: 'bullish' },
    { name: 'Realty', change: rp(8, 2.1), topGainer: 'DLF', topLoser: 'GODREJPROP', momentum: 'neutral' },
  ];
  const stk = (sym: string, name: string, price: number, sect: string) => {
    const ch = rp(price, price * 0.02);
    return { symbol: sym, name, price: r(price, price * 0.005), change: ch, changePercent: +((ch / price) * 100).toFixed(2), volume: Math.floor(Math.random() * 10 + 1) + 'M', sector: sect, marketCap: '' };
  };
  const fbStocks: StockTicker[] = [
    stk('RELIANCE', 'Reliance Industries', 2465, 'Energy'), stk('TCS', 'Tata Consultancy', 3890, 'IT'),
    stk('HDFCBANK', 'HDFC Bank', 1685, 'Banking'), stk('INFY', 'Infosys', 1540, 'IT'),
    stk('HINDUNILVR', 'Hindustan Unilever', 2380, 'FMCG'), stk('ICICIBANK', 'ICICI Bank', 1190, 'Banking'),
    stk('BHARTIARTL', 'Bharti Airtel', 1420, 'Telecom'), stk('SBIN', 'State Bank of India', 780, 'Banking'),
    stk('BAJFINANCE', 'Bajaj Finance', 6870, 'Finance'), stk('ITC', 'ITC Ltd', 440, 'FMCG'),
    stk('KOTAKBANK', 'Kotak Mahindra', 1850, 'Banking'), stk('LT', 'Larsen & Toubro', 3420, 'Infra'),
    stk('AXISBANK', 'Axis Bank', 1110, 'Banking'), stk('TITAN', 'Titan Company', 3280, 'Consumer'),
    stk('ASIANPAINT', 'Asian Paints', 2740, 'Consumer'), stk('MARUTI', 'Maruti Suzuki', 12350, 'Auto'),
    stk('SUNPHARMA', 'Sun Pharmaceutical', 1180, 'Pharma'), stk('TATAMOTORS', 'Tata Motors', 985, 'Auto'),
    stk('ULTRACEMCO', 'UltraTech Cement', 9850, 'Cement'), stk('WIPRO', 'Wipro', 445, 'IT'),
    stk('HCLTECH', 'HCL Technologies', 1320, 'IT'), stk('NTPC', 'NTPC Ltd', 340, 'Energy'),
    stk('POWERGRID', 'Power Grid Corp', 295, 'Energy'), stk('TATASTEEL', 'Tata Steel', 148, 'Metal'),
    stk('ONGC', 'ONGC', 265, 'Energy'), stk('JSWSTEEL', 'JSW Steel', 875, 'Metal'),
    stk('M&M', 'Mahindra & Mahindra', 2560, 'Auto'), stk('ADANIENT', 'Adani Enterprises', 2340, 'Conglomerate'),
    stk('CIPLA', 'Cipla', 1410, 'Pharma'), stk('TECHM', 'Tech Mahindra', 1280, 'IT'),
  ];
  const sorted = [...fbStocks].sort((a, b) => b.changePercent - a.changePercent);
  return {
    indices: fbIdx, sectors: fbSectors, stocks: fbStocks,
    gainers: sorted.filter(s => s.changePercent > 0).slice(0, 10),
    losers: sorted.filter(s => s.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent).slice(0, 10),
    fiiFlow: rp(1200, 800), diiFlow: rp(900, 600),
    upiVolume: 18.4, upiValue: 20.2, marketCap: 4.2,
    advanceDecline: { advances: 28 + seed % 5, declines: 22 - seed % 5, unchanged: 0 },
    isLive: false, lastFetch: new Date(),
  };
}

// Synchronous getter for initial render (uses cache or fallback)
export function getMarketData(): MarketSummary {
  if (cachedData) return cachedData;
  return getFallbackData();
}
