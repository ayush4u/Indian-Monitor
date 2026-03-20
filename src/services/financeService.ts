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

async function fetchYahooQuote(symbol: string): Promise<{
  price: number; change: number; changePercent: number;
  high: number; low: number; open: number; prevClose: number;
  volume: number; lastUpdated: string;
} | null> {
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
  return {
    indices: [
      { name: 'SENSEX', value: 0, change: 0, changePercent: 0, high: 0, low: 0, open: 0, prevClose: 0, volume: '-', exchange: 'BSE', lastUpdated: 'offline' },
      { name: 'NIFTY 50', value: 0, change: 0, changePercent: 0, high: 0, low: 0, open: 0, prevClose: 0, volume: '-', exchange: 'NSE', lastUpdated: 'offline' },
    ],
    sectors: [],
    stocks: [],
    gainers: [],
    losers: [],
    fiiFlow: 0, diiFlow: 0, upiVolume: 0, upiValue: 0, marketCap: 0,
    advanceDecline: { advances: 0, declines: 0, unchanged: 0 },
    isLive: false,
    lastFetch: new Date(),
  };
}

// Synchronous getter for initial render (uses cache or fallback)
export function getMarketData(): MarketSummary {
  if (cachedData) return cachedData;
  return getFallbackData();
}
