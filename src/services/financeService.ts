// ─── Finance Service — LIVE DATA from Yahoo Finance ───


const BSE_STOCKS = [
  { symbol: "RELIANCE.BO", name: "Reliance Industries", sector: "Energy" },
  { symbol: "TCS.BO", name: "Tata Consultancy", sector: "IT" },
  { symbol: "HDFCBANK.BO", name: "HDFC Bank", sector: "Banking" },
  { symbol: "INFY.BO", name: "Infosys", sector: "IT" },
  { symbol: "ICICIBANK.BO", name: "ICICI Bank", sector: "Banking" },
  { symbol: "SBIN.BO", name: "State Bank of India", sector: "Banking" },
  { symbol: "BHARTIARTL.BO", name: "Bharti Airtel", sector: "Telecom" },
  { symbol: "ITC.BO", name: "ITC Limited", sector: "FMCG" },
  { symbol: "LT.BO", name: "Larsen & Toubro", sector: "Infra" },
  { symbol: "BAJFINANCE.BO", name: "Bajaj Finance", sector: "Finance" },
  { symbol: "ZOMATO.BO", name: "Zomato", sector: "Consumer" },
  { symbol: "TATAMOTORS.BO", name: "Tata Motors", sector: "Auto" },
  { symbol: "M&M.BO", name: "Mahindra & Mahindra", sector: "Auto" },
  { symbol: "ASIANPAINT.BO", name: "Asian Paints", sector: "Consumer" },
  { symbol: "HAL.BO", name: "Hindustan Aeronautics", sector: "Defence" },
  { symbol: "SUZLON.BO", name: "Suzlon Energy", sector: "Energy" },
  { symbol: "JIOFIN.BO", name: "Jio Financial", sector: "Finance" },
  { symbol: "IREDA.BO", name: "Indian Renewable", sector: "Finance" },
  { symbol: "IRFC.BO", name: "Indian Railway", sector: "Finance" },
  { symbol: "RVNL.BO", name: "Rail Vikas Nigam", sector: "Infra" },
];

const NSE_TOP_300 = [
  {
    "symbol": "20MICRONS.NS",
    "name": "20 Microns Limited",
    "sector": "Equity"
  },
  {
    "symbol": "21STCENMGM.NS",
    "name": "21st Century Management Services Limited",
    "sector": "Equity"
  },
  {
    "symbol": "360ONE.NS",
    "name": "360 ONE WAM LIMITED",
    "sector": "Equity"
  },
  {
    "symbol": "3BBLACKBIO.NS",
    "name": "3B Blackbio Dx Limited",
    "sector": "Equity"
  },
  {
    "symbol": "3IINFOLTD.NS",
    "name": "3i Infotech Limited",
    "sector": "Equity"
  },
  {
    "symbol": "3MINDIA.NS",
    "name": "3M India Limited",
    "sector": "Equity"
  },
  {
    "symbol": "3PLAND.NS",
    "name": "3P Land Holdings Limited",
    "sector": "Equity"
  },
  {
    "symbol": "5PAISA.NS",
    "name": "5Paisa Capital Limited",
    "sector": "Equity"
  },
  {
    "symbol": "63MOONS.NS",
    "name": "63 moons technologies limited",
    "sector": "Equity"
  },
  {
    "symbol": "A2ZINFRA.NS",
    "name": "A2Z Infra Engineering Limited",
    "sector": "Equity"
  },
  {
    "symbol": "AAATECH.NS",
    "name": "AAA Technologies Limited",
    "sector": "Equity"
  },
  {
    "symbol": "AADHARHFC.NS",
    "name": "Aadhar Housing Finance Limited",
    "sector": "Equity"
  },
  {
    "symbol": "AARNAV.NS",
    "name": "Aarnav Fashions Limited",
    "sector": "Equity"
  },
  {
    "symbol": "AARON.NS",
    "name": "Aaron Industries Limited",
    "sector": "Equity"
  },
  {
    "symbol": "AARTECH.NS",
    "name": "Aartech Solonics Limited",
    "sector": "Equity"
  },
  {
    "symbol": "AARTIDRUGS.NS",
    "name": "Aarti Drugs Limited",
    "sector": "Equity"
  },
  {
    "symbol": "AARTIIND.NS",
    "name": "Aarti Industries Limited",
    "sector": "Equity"
  },
  {
    "symbol": "AARTIPHARM.NS",
    "name": "Aarti Pharmalabs Limited",
    "sector": "Equity"
  },
  {
    "symbol": "AARTISURF.NS",
    "name": "Aarti Surfactants Limited",
    "sector": "Equity"
  },
  {
    "symbol": "AARVI.NS",
    "name": "Aarvi Encon Limited",
    "sector": "Equity"
  },
  {
    "symbol": "AAVAS.NS",
    "name": "Aavas Financiers Limited",
    "sector": "Equity"
  },
  {
    "symbol": "ABB.NS",
    "name": "ABB India Limited",
    "sector": "Equity"
  },
  {
    "symbol": "ABBOTINDIA.NS",
    "name": "Abbott India Limited",
    "sector": "Equity"
  },
  {
    "symbol": "ABCAPITAL.NS",
    "name": "Aditya Birla Capital Limited",
    "sector": "Equity"
  },
  {
    "symbol": "ABCOTS.NS",
    "name": "A B Cotspin India Limited",
    "sector": "Equity"
  }
];


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

export interface YahooQuote {
  change7d?: number;
  change30d?: number;
  change1y?: number;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
  volume: number;
  lastUpdated: string;
  prices: number[];
}

export interface SearchResult {
  symbol: string;
  name: string;
  exchange: string;
  quoteType: string;
}

export interface MarketAsset {
  change7d?: number;
  change30d?: number;
  change1y?: number;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: string;
  marketCap: string;
  sparkline: number[];
  category: 'equity' | 'commodity' | 'currency' | 'crypto';
  subCategory?: string; // sector for equity
  priceUSD?: number;   // for commodities
  priceINR?: number;   // calculated INR price
  unit?: string;       // "per 10g", "per kg", etc.
  currencySymbol: string;
}

export interface StockDetail {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  prevClose: number;
  volume: string;
  marketCap: string;
  currency: string;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  sparkline: number[];
  chartData: { time: number; price: number }[];
}

// Yahoo Finance symbols for Indian market index
const YAHOO_SYMBOLS: { symbol: string; name: string; exchange: string }[] = [
  { symbol: '^BSESN', name: 'SENSEX', exchange: 'BSE' },
  { symbol: '^NSEI', name: 'NIFTY 50', exchange: 'NSE' },
  { symbol: '^NSEBANK', name: 'BANK NIFTY', exchange: 'NSE' },
  { symbol: '^CNXIT', name: 'NIFTY IT', exchange: 'NSE' },
  { symbol: '^CNXPHARMA', name: 'NIFTY PHARMA', exchange: 'NSE' },
  { symbol: '^CNXAUTO', name: 'NIFTY AUTO', exchange: 'NSE' },
  { symbol: '^INDIAVIX', name: 'INDIA VIX', exchange: 'NSE' },
];

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

// Top NIFTY 50 individual stocks
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

// Offline lists for fallback search & lookup
const POPULAR_OFFLINE_STOCKS = [
  ...NIFTY_STOCKS,
  { symbol: 'ZOMATO.NS', name: 'Zomato Ltd', sector: 'Consumer' },
  { symbol: 'SUZLON.NS', name: 'Suzlon Energy', sector: 'Energy' },
  { symbol: 'PAYTM.NS', name: 'One97 Communications', sector: 'Finance' },
  { symbol: 'HAL.NS', name: 'Hindustan Aeronautics', sector: 'Industrial' },
  { symbol: 'IRFC.NS', name: 'Indian Railway Finance', sector: 'Finance' },
  { symbol: 'RVNL.NS', name: 'Rail Vikas Nigam Ltd', sector: 'Infra' },
  { symbol: 'JIOFIN.NS', name: 'Jio Financial', sector: 'Finance' },
  { symbol: 'IREDA.NS', name: 'Indian Renewable Energy', sector: 'Energy' },
  { symbol: 'BHEL.NS', name: 'Bharat Heavy Electricals', sector: 'Industrial' },
  { symbol: 'LIC.NS', name: 'Life Insurance Corp', sector: 'Finance' },
  { symbol: 'YESBANK.NS', name: 'Yes Bank Ltd', sector: 'Banking' },
  { symbol: 'TATAPOWER.NS', name: 'Tata Power Company', sector: 'Power' },
  { symbol: 'ADANIPOWER.NS', name: 'Adani Power Ltd', sector: 'Power' },
  { symbol: 'ADANIPORTS.NS', name: 'Adani Ports', sector: 'Infra' },
  { symbol: 'IDEA.NS', name: 'Vodafone Idea Ltd', sector: 'Telecom' },
  { symbol: 'TRENT.NS', name: 'Trent Ltd', sector: 'Consumer' },
  { symbol: 'DMART.NS', name: 'Avenue Supermarts', sector: 'Consumer' },
  { symbol: 'NYKAA.NS', name: 'FSN E-Commerce', sector: 'Consumer' },
  { symbol: 'MRF.NS', name: 'MRF Ltd', sector: 'Auto' },
  { symbol: 'VEDL.NS', name: 'Vedanta Ltd', sector: 'Metal' },
  { symbol: 'AMBUJACEM.NS', name: 'Ambuja Cements', sector: 'Cement' },
  { symbol: 'INDIGO.NS', name: 'InterGlobe Aviation', sector: 'Transport' },
  { symbol: 'ZENTEC.NS', name: 'Zen Technologies', sector: 'Defence' },
  { symbol: 'BEL.NS', name: 'Bharat Electronics', sector: 'Defence' },
  { symbol: 'PNB.NS', name: 'Punjab National Bank', sector: 'Banking' },
  { symbol: 'BOB.NS', name: 'Bank of Baroda', sector: 'Banking' },
  { symbol: 'DLF.NS', name: 'DLF Ltd', sector: 'Realty' },
  { symbol: 'GODREJPROP.NS', name: 'Godrej Properties', sector: 'Realty' },
  { symbol: 'DIVISLAB.NS', name: 'Divis Laboratories', sector: 'Pharma' },
  { symbol: 'CIPLA.NS', name: 'Cipla Ltd', sector: 'Pharma' },
  { symbol: 'BAJAJ-AUTO.NS', name: 'Bajaj Auto', sector: 'Auto' },
  { symbol: 'HEROMOTOCO.NS', name: 'Hero MotoCorp', sector: 'Auto' },
  { symbol: 'HINDALCO.NS', name: 'Hindalco Industries', sector: 'Metal' },
];

const COMMODITY_SECTOR = [
  { symbol: 'GC=F', name: 'Gold (Global)', unit: 'per 10g', type: 'gold' },
  { symbol: 'SI=F', name: 'Silver (Global)', unit: 'per kg', type: 'silver' },
  { symbol: 'HG=F', name: 'Copper Futures', unit: 'per kg', type: 'copper' },
  { symbol: 'PL=F', name: 'Platinum Futures', unit: 'per 10g', type: 'platinum' },
  { symbol: 'CL=F', name: 'Crude Oil WTI', unit: 'per bbl', type: 'oil' },
  { symbol: 'BZ=F', name: 'Brent Crude Oil', unit: 'per bbl', type: 'oil' },
  { symbol: 'NG=F', name: 'Natural Gas', unit: 'per MMBtu', type: 'gas' },
];

const CURRENCY_SECTOR = [
  { symbol: 'USDINR=X', name: 'USD / INR (India-US)' },
  { symbol: 'CNYINR=X', name: 'CNY / INR (India-China)' },
  { symbol: 'EURINR=X', name: 'EUR / INR' },
  { symbol: 'GBPINR=X', name: 'GBP / INR' },
  { symbol: 'JPYINR=X', name: 'JPY / INR' },
  { symbol: 'SGDINR=X', name: 'SGD / INR' },
  { symbol: 'AEDINR=X', name: 'AED / INR' },
];

const CRYPTO_SECTOR = [
  { symbol: 'BTC-INR', name: 'Bitcoin (BTC)' },
  { symbol: 'ETH-INR', name: 'Ethereum (ETH)' },
  { symbol: 'BNB-INR', name: 'Binance Coin (BNB)' },
  { symbol: 'SOL-INR', name: 'Solana (SOL)' },
];

// Cache for market summary
let cachedSummary: MarketSummary | null = null;
let lastSummaryFetch = 0;
const CACHE_TTL = 15_000; // 15 seconds

// Watchlist removed

// ─── Core fetch for single symbol chart data (price + sparkline) ───

export async function fetchYahooBatch(symbols: string[]): Promise<Record<string, YahooQuote>> {
  const BATCH_SIZE = 40;
  const results: Record<string, YahooQuote> = {};
  
  const PROXIES = [
    (url: string) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
    (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url: string) => `https://corsproxy.org/api?url=${encodeURIComponent(url)}`
  ];

  for (let i = 0; i < symbols.length; i += BATCH_SIZE) {
    const chunk = symbols.slice(i, i + BATCH_SIZE);
    const targetUrl = `https://query1.finance.yahoo.com/v7/finance/spark?symbols=${chunk.join(',')}&range=1mo&interval=1d`;
    
    let success = false;
    for (const proxy of PROXIES) {
      if (success) break;
      try {
        const url = proxy(targetUrl);
        const res = await fetch(url);
        if (!res.ok) continue;
        const data = await res.json();
        
        const sparkData = data?.spark?.result || [];
        sparkData.forEach((res: any) => {
          const symbol = res.symbol;
          const meta = res.response[0]?.meta;
          const closes = res.response[0]?.indicators?.quote?.[0]?.close || [];
          const validCloses = closes.filter((c: any) => c != null && !isNaN(c));
          
          if (meta) {
            const price = meta.regularMarketPrice ?? 0;
            const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? price;
            const change = price - prevClose;
            const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;
            
            let change7d = 0;
            let change30d = 0;
            if (validCloses.length > 0) {
              const last = validCloses[validCloses.length - 1];
              const first30d = validCloses[0];
              const first7d = validCloses[Math.max(0, validCloses.length - 6)];
              if (first7d > 0) change7d = ((last - first7d) / first7d) * 100;
              if (first30d > 0) change30d = ((last - first30d) / first30d) * 100;
            }

            results[symbol] = {
              price,
              change,
              changePercent,
              high: meta.regularMarketDayHigh ?? price,
              low: meta.regularMarketDayLow ?? price,
              open: meta.regularMarketOpen ?? prevClose,
              prevClose,
              volume: meta.regularMarketVolume ?? 0,
              lastUpdated: new Date().toISOString(),
              prices: validCloses.slice(-7),
              change7d,
              change30d,
            };
          }
        });
        success = true; // Mark batch as successful so we don't retry other proxies
      } catch (e) {
        // silently try next proxy
      }
    }
  }
  return results;
}

export async function fetchYahooQuote(symbol: string): Promise<YahooQuote | null> {
  try {
    const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=1mo&interval=1d&includePrePost=false`;
    const url = `https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`;
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

    let prices: number[] = [];
    if (indicators) {
      const highs = (indicators.high || []).filter((v: number | null) => v != null);
      const lows = (indicators.low || []).filter((v: number | null) => v != null);
      if (highs.length) high = Math.max(...highs);
      if (lows.length) low = Math.min(...lows);
      const volumes = (indicators.volume || []).filter((v: number | null) => v != null);
      if (volumes.length) volume = volumes.reduce((a: number, b: number) => a + b, 0);

      if (indicators.close) {
        prices = indicators.close.filter((c: number | null) => c !== null) as number[];
      }
    }

    if (prices.length === 0) {
      prices = [prevClose, price];
    }

    const marketTime = meta.regularMarketTime ? new Date(meta.regularMarketTime * 1000) : new Date();
    const lastUpdated = marketTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    // Calculate 7d and 30d
    let change7d, change30d;
    if (prices.length >= 7) {
      const old = prices[prices.length - 7];
      change7d = ((price - old) / old) * 100;
    }
    if (prices.length >= 2) {
      const old = prices[0];
      change30d = ((price - old) / old) * 100;
    }
    // Take last 7 days for the sparkline to match CoinGecko
    const sparkline = prices.slice(-7);
    return { price, change, changePercent, high, low, open, prevClose, volume, lastUpdated, prices: sparkline, change7d, change30d };
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

function formatMarketCap(cap: number): string {
  if (!cap) return '—';
  if (cap >= 1e12) return '₹' + (cap / 1e12).toFixed(2) + 'T';
  if (cap >= 1e7) return '₹' + (cap / 1e7).toFixed(0) + 'Cr';
  return '₹' + (cap / 1e5).toFixed(0) + 'L';
}

// ─── Fetch market data for original dashboard components ───
export async function fetchLiveMarketData(): Promise<MarketSummary> {
  if (cachedSummary && Date.now() - lastSummaryFetch < CACHE_TTL) {
    return cachedSummary;
  }

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

  if (indices.length === 0) {
    return getFallbackData();
  }

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

  const stocks: StockTicker[] = [];
  const batch = NIFTY_STOCKS.slice(0, 15); // slice for faster summary loads
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

  const sorted = [...stocks].sort((a, b) => b.changePercent - a.changePercent);
  const gainers = sorted.filter(s => s.changePercent > 0).slice(0, 10);
  const losers = sorted.filter(s => s.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent).slice(0, 10);

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

  cachedSummary = summary;
  lastSummaryFetch = Date.now();
  return summary;
}

export function getMarketData(): MarketSummary {
  if (cachedSummary) return cachedSummary;
  return getFallbackData();
}

// ─── Dynamic symbol search (Yahoo API) ───
export async function searchYahooSymbols(query: string): Promise<SearchResult[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const targetUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&newsCount=0`;
    const url = `https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Search failed');

    const data = await res.json();
    const quotes = data?.quotes || [];
    return quotes
      .filter((q: any) => q.quoteType === 'EQUITY' || q.quoteType === 'CURRENCY' || q.quoteType === 'FUTURE' || q.quoteType === 'INDEX' || q.quoteType === 'CRYPTOCURRENCY')
      .map((q: any) => ({
        symbol: q.symbol,
        name: q.longname || q.shortname || q.symbol,
        exchange: q.exchange || q.exchDisp || '',
        quoteType: q.quoteType || q.typeDisp || '',
      }));
  } catch (e) {
    console.error('Yahoo search failed, using fallback:', e);
    const q = query.toLowerCase();
    const all = [...POPULAR_OFFLINE_STOCKS, ...COMMODITY_SECTOR, ...CURRENCY_SECTOR, ...CRYPTO_SECTOR];
    return all
      .filter(s => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
      .map(s => ({
        symbol: s.symbol,
        name: s.name,
        exchange: s.symbol.endsWith('.NS') ? 'NSE' : s.symbol.includes('=X') ? 'FX' : 'BSE',
        quoteType: s.symbol.includes('=X') ? 'CURRENCY' : s.symbol.endsWith('=F') ? 'FUTURE' : s.symbol.includes('-INR') ? 'CRYPTOCURRENCY' : 'EQUITY',
      }));
  }
}

// ─── Fetch Detailed Asset info for charts and modals ───
export async function fetchStockDetail(symbol: string, range = '1mo'): Promise<StockDetail | null> {
  let interval = '1d';
  if (range === '1d') interval = '5m';
  else if (range === '5d') interval = '15m';
  else if (range === '1mo') interval = '1d';
  else if (range === '6mo') interval = '1d';
  else if (range === '1y') interval = '1wk';

  try {
    const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}&includePrePost=false`;
    const url = `https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Detail fetch failed');

    const data = await res.json();
    const result = data?.chart?.result?.[0];
    if (!result) return null;

    const meta = result.meta;
    const price = meta.regularMarketPrice ?? 0;
    const prevClose = meta.chartPreviousClose ?? meta.previousClose ?? 0;
    const change = price - prevClose;
    const changePercent = prevClose > 0 ? (change / prevClose) * 100 : 0;
    const high = meta.regularMarketDayHigh ?? price;
    const low = meta.regularMarketDayLow ?? price;
    const open = meta.regularMarketOpen ?? prevClose;
    const volumeVal = meta.regularMarketVolume ?? 0;

    const timestamps = result.timestamp || [];
    const indicators = result.indicators?.quote?.[0];
    const closes = indicators?.close || [];

    const sparkline: number[] = closes.filter((c: any) => c != null);
    const chartData = timestamps.map((time: number, idx: number) => ({
      time: time * 1000,
      price: closes[idx] !== null && closes[idx] !== undefined ? closes[idx] : price,
    })).filter((item: any) => item.price !== null && !isNaN(item.price));

    return {
      symbol,
      name: meta.shortName || meta.symbol || symbol,
      price,
      change,
      changePercent,
      high,
      low,
      open,
      prevClose,
      volume: formatVolume(volumeVal),
      marketCap: formatMarketCap(meta.marketCap || 0),
      currency: meta.currency || 'INR',
      fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh || high,
      fiftyTwoWeekLow: meta.fiftyTwoWeekLow || low,
      sparkline,
      chartData,
    };
  } catch (e) {
    console.error('Fetch detail failed, returning fallback:', e);
    return getFallbackStockDetail(symbol, range);
  }
}

// ─── Fetch Markets Hub Categories Data ───
export async function fetchMarketsHubAssets(): Promise<{
  equities: MarketAsset[];
  commodities: MarketAsset[];
  currencies: MarketAsset[];
  crypto: MarketAsset[];
}> {
  // 1. Fetch USDINR first for commodity conversions
  let usdInrRate = 83.5;
  try {
    const usdQuote = await fetchYahooQuote('USDINR=X');
    if (usdQuote) usdInrRate = usdQuote.price;
  } catch {
    // Keep 83.5
  }

  // 2. Fetch everything in parallel
  
  const ALL_EQUITIES = [...POPULAR_OFFLINE_STOCKS, ...BSE_STOCKS, ...NSE_TOP_300];
  const uniqueEquities = Array.from(new Map(ALL_EQUITIES.map(item => [item.symbol, item])).values());
  
  const equitiesQuotes = await fetchYahooBatch(uniqueEquities.map(s => s.symbol));

  const commoditiesP = Promise.allSettled(COMMODITY_SECTOR.map(async s => {
    const q = await fetchYahooQuote(s.symbol);
    return { item: s, quote: q };
  }));

  const currenciesP = Promise.allSettled(CURRENCY_SECTOR.map(async s => {
    const q = await fetchYahooQuote(s.symbol);
    return { item: s, quote: q };
  }));

  const cryptoP = Promise.allSettled(CRYPTO_SECTOR.map(async s => {
    const q = await fetchYahooQuote(s.symbol);
    return { item: s, quote: q };
  }));

  const [comRes, curRes, cryRes] = await Promise.all([
    commoditiesP, currenciesP, cryptoP
  ]);

  const equities: MarketAsset[] = [];
  const commodities: MarketAsset[] = [];
  const currencies: MarketAsset[] = [];
  const crypto: MarketAsset[] = [];

  // Map Equities
  uniqueEquities.forEach(s => {
    const q = equitiesQuotes[s.symbol];
    if (q) {
      equities.push({
        symbol: s.symbol,
        name: s.name,
        price: q.price,
        change: q.change,
        changePercent: q.changePercent,
        high: q.high,
        low: q.low,
        volume: formatVolume(q.volume),
        marketCap: formatMarketCap(q.price * 50000000), 
        sparkline: q.prices,
        category: 'equity',
        subCategory: s.sector,
        currencySymbol: '₹',
      });
    } else {
      equities.push(getAssetFallback(s.symbol, s.name, 'equity', s.sector, usdInrRate));
    }
  });

  // Map Commodities (already exists below)

  // Map Commodities
  comRes.forEach((r) => {
    if (r.status === 'fulfilled' && r.value.quote) {
      const q = r.value.quote;
      const s = r.value.item;
      const parsed = parseCommodity(s.symbol, s.name, q.price, q.change, q.changePercent, q.prices, s.unit, s.type, usdInrRate);
      commodities.push(parsed);
    } else if (r.status === 'fulfilled') {
      const s = r.value.item;
      const fb = getAssetFallback(s.symbol, s.name, 'commodity', s.unit, usdInrRate);
      commodities.push(fb);
    }
  });

  // Map Currencies
  curRes.forEach((r) => {
    if (r.status === 'fulfilled' && r.value.quote) {
      const q = r.value.quote;
      const s = r.value.item;
      currencies.push({
        symbol: s.symbol,
        name: s.name,
        price: q.price,
        change: q.change,
        changePercent: q.changePercent,
        high: q.high,
        low: q.low,
        volume: '—',
        marketCap: '—',
        sparkline: q.prices,
        category: 'currency',
        currencySymbol: '₹',
      });
    } else if (r.status === 'fulfilled') {
      const s = r.value.item;
      const fb = getAssetFallback(s.symbol, s.name, 'currency', '', usdInrRate);
      currencies.push(fb);
    }
  });

  // Map Crypto
  cryRes.forEach((r) => {
    if (r.status === 'fulfilled' && r.value.quote) {
      const q = r.value.quote;
      const s = r.value.item;
      crypto.push({
        symbol: s.symbol,
        name: s.name,
        price: q.price,
        change: q.change,
        changePercent: q.changePercent,
        high: q.high,
        low: q.low,
        volume: formatVolume(q.volume),
        marketCap: formatMarketCap(q.price * 1_000_000),
        sparkline: q.prices,
        category: 'crypto',
        currencySymbol: '₹',
      });
    } else if (r.status === 'fulfilled') {
      const s = r.value.item;
      const fb = getAssetFallback(s.symbol, s.name, 'crypto', '', usdInrRate);
      crypto.push(fb);
    }
  });

  return { equities, commodities, currencies, crypto };
}

function parseCommodity(
  symbol: string, name: string, priceUSD: number, changeUSD: number, pctUSD: number, 
  pricesUSD: number[], unit: string, type: string, usdInrRate: number
): MarketAsset {
  let price = priceUSD;
  let change = changeUSD;
  let pct = pctUSD;
  let priceINR = 0;
  
  if (type === 'gold') {
    // 1oz troy = 31.1034768 grams. Price is per 10g in India
    priceINR = (priceUSD / 31.1034768) * usdInrRate * 10;
    price = priceINR;
    change = (changeUSD / 31.1034768) * usdInrRate * 10;
  } else if (type === 'silver') {
    // 1oz troy = 31.1034768 grams. Price is per kg in India (1000g)
    priceINR = (priceUSD / 31.1034768) * usdInrRate * 1000;
    price = priceINR;
    change = (changeUSD / 31.1034768) * usdInrRate * 1000;
  } else if (type === 'copper') {
    // Price is per pound (lb) in US. In India it is per kg. 1 lb = 0.453592 kg
    priceINR = (priceUSD / 0.453592) * usdInrRate;
    price = priceINR;
    change = (changeUSD / 0.453592) * usdInrRate;
  } else if (type === 'platinum') {
    priceINR = (priceUSD / 31.1034768) * usdInrRate * 10;
    price = priceINR;
    change = (changeUSD / 31.1034768) * usdInrRate * 10;
  } else if (type === 'oil') {
    // Price per barrel in USD
    priceINR = priceUSD * usdInrRate;
    price = priceINR;
    change = changeUSD * usdInrRate;
  }

  // Calculate sparkline in INR if we have pricesUSD
  const sparkline = pricesUSD.map(p => {
    if (type === 'gold') return (p / 31.1034768) * usdInrRate * 10;
    if (type === 'silver') return (p / 31.1034768) * usdInrRate * 1000;
    if (type === 'copper') return (p / 0.453592) * usdInrRate;
    if (type === 'platinum') return (p / 31.1034768) * usdInrRate * 10;
    if (type === 'oil') return p * usdInrRate;
    return p;
  });

  return {
    symbol,
    name,
    price,
    change,
    changePercent: pct,
    high: sparkline.length ? Math.max(...sparkline) : price,
    low: sparkline.length ? Math.min(...sparkline) : price,
    volume: '—',
    marketCap: '—',
    sparkline,
    category: 'commodity',
    priceUSD,
    priceINR: priceINR || undefined,
    unit,
    currencySymbol: '₹',
  };
}

// ─── High fidelity Fallback generator for Markets Hub Assets ───
function getAssetFallback(symbol: string, name: string, category: MarketAsset['category'], detail: string, usdInrRate: number): MarketAsset {
  const seed = symbol.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const rand = (n: number) => Math.sin(seed * n) * 0.5 + 0.5;

  let price = 100;
  let changePercent = (rand(123) * 4) - 2; // -2% to +2%
  let currencySymbol = '₹';
  let unit = '';
  let subCategory = detail;
  
  if (category === 'equity') {
    price = 50 + rand(456) * 4000;
  } else if (category === 'currency') {
    if (symbol.startsWith('USD')) price = usdInrRate;
    else if (symbol.startsWith('CNY')) price = usdInrRate / 7.25;
    else if (symbol.startsWith('EUR')) price = usdInrRate * 1.08;
    else if (symbol.startsWith('GBP')) price = usdInrRate * 1.27;
    else if (symbol.startsWith('JPY')) price = usdInrRate / 155;
    else price = usdInrRate / 1.34;
  } else if (category === 'commodity') {
    unit = detail;
    if (symbol.startsWith('GC')) {
      const usdPrice = 2300 + rand(789) * 200;
      price = (usdPrice / 31.1035) * usdInrRate * 10; // INR per 10g
    } else if (symbol.startsWith('SI')) {
      const usdPrice = 28 + rand(111) * 5;
      price = (usdPrice / 31.1035) * usdInrRate * 1000; // INR per kg
    } else if (symbol.startsWith('HG')) {
      const usdPrice = 4.5 + rand(222) * 0.5;
      price = (usdPrice / 0.45359) * usdInrRate; // INR per kg
    } else if (symbol.startsWith('PL')) {
      const usdPrice = 950 + rand(333) * 100;
      price = (usdPrice / 31.1035) * usdInrRate * 10; // INR per 10g
    } else if (symbol.startsWith('CL') || symbol.startsWith('BZ')) {
      const usdPrice = 75 + rand(444) * 15;
      price = usdPrice * usdInrRate; // INR per bbl
    } else {
      price = 2 + rand(555) * 2; // Gas in USD
      currencySymbol = '$';
    }
  } else if (category === 'crypto') {
    if (symbol.startsWith('BTC')) price = 60000 * usdInrRate;
    else if (symbol.startsWith('ETH')) price = 3000 * usdInrRate;
    else if (symbol.startsWith('BNB')) price = 580 * usdInrRate;
    else price = 150 * usdInrRate;
  }

  const change = price * (changePercent / 100);
  const sparkline: number[] = [];
  const base = price - change;
  for (let i = 0; i < 20; i++) {
    const t = i / 19;
    const fluc = (rand(i + 20) - 0.5) * (price * 0.015);
    sparkline.push(base + t * change + fluc);
  }
  sparkline.push(price);

  return {
    symbol: symbol.replace('.NS', ''),
    name,
    price,
    change,
    changePercent,
    high: Math.max(...sparkline),
    low: Math.min(...sparkline),
    volume: category === 'currency' ? '—' : formatVolume(100000 + Math.floor(rand(999) * 10000000)),
    marketCap: category === 'currency' || category === 'commodity' ? '—' : formatMarketCap(price * 10000000),
    sparkline,
    category,
    subCategory: subCategory || undefined,
    unit: unit || undefined,
    currencySymbol,
  };
}

// ─── Fallback stock detail for detail popups ───
function getFallbackStockDetail(symbol: string, range: string): StockDetail {
  const seed = symbol.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const rand = (n: number) => Math.sin(seed * n) * 0.5 + 0.5;

  const basePrice = 100 + rand(500) * 1500;
  const changePercent = (rand(200) * 6) - 3; // -3% to +3%
  const change = basePrice * (changePercent / 100);
  const price = basePrice;
  const high = price * (1 + rand(400) * 0.01);
  const low = price * (1 - rand(401) * 0.01);
  const open = price - change * 0.8;
  const prevClose = price - change;

  // Chart timestamps & prices based on selected range
  let pointsCount = 24;
  let timeStep = 3600 * 1000; // 1 hour
  if (range === '1d') { pointsCount = 24; timeStep = 15 * 60 * 1000; }
  else if (range === '5d') { pointsCount = 30; timeStep = 4 * 3600 * 1000; }
  else if (range === '1mo') { pointsCount = 30; timeStep = 24 * 3600 * 1000; }
  else if (range === '6mo') { pointsCount = 26; timeStep = 7 * 24 * 3600 * 1000; }
  else { pointsCount = 52; timeStep = 7 * 24 * 3600 * 1000; }

  const startTime = Date.now() - pointsCount * timeStep;
  const chartData: { time: number; price: number }[] = [];
  const sparkline: number[] = [];

  for (let i = 0; i < pointsCount; i++) {
    const ratio = i / (pointsCount - 1);
    const trend = prevClose + ratio * change;
    const noise = (rand(i + 15) - 0.5) * (basePrice * 0.03);
    const p = Math.max(1, trend + noise);
    chartData.push({ time: startTime + i * timeStep, price: p });
    sparkline.push(p);
  }

  // Ensure last point matches current price
  chartData[chartData.length - 1].price = price;
  sparkline[sparkline.length - 1] = price;

  return {
    symbol: symbol.replace('.NS', '').replace('.BO', ''),
    name: POPULAR_OFFLINE_STOCKS.find(s => s.symbol === symbol)?.name || symbol,
    price,
    change,
    changePercent,
    high,
    low,
    open,
    prevClose,
    volume: formatVolume(500000 + Math.floor(rand(12) * 5000000)),
    marketCap: formatMarketCap(price * 10_000_000),
    currency: symbol.includes('=X') || symbol.endsWith('.NS') ? 'INR' : 'USD',
    fiftyTwoWeekHigh: high * 1.2,
    fiftyTwoWeekLow: low * 0.8,
    sparkline,
    chartData,
  };
}

// ─── Fallback Summary data for original dashboard ───
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

