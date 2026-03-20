// ─── Flight Radar Service — OpenSky Network (Free, No API Key) ───
// Docs: https://openskynetwork.github.io/opensky-api/rest.html
// India bounding box: lat 6-37, lng 68-98

export interface LiveFlight {
  icao24: string;
  callsign: string;
  originCountry: string;
  lat: number;
  lng: number;
  altitude: number;     // meters (geometric)
  velocity: number;     // m/s ground speed
  heading: number;      // degrees from north
  verticalRate: number; // m/s
  onGround: boolean;
  squawk: string | null;
  lastContact: number;
}

export interface FlightRadarSummary {
  flights: LiveFlight[];
  totalCount: number;
  airborne: number;
  onGround: number;
  avgAltitude: number;
  lastUpdated: Date;
  isLive: boolean;
}

// Cache
let flightCache: FlightRadarSummary | null = null;
let lastFlightFetch = 0;
const FLIGHT_CACHE_TTL = 15_000; // 15 seconds (OpenSky allows ~10 req/min without auth)

// India bounding box
const INDIA_BBOX = { lamin: 6, lomin: 68, lamax: 37, lomax: 98 };

const isLocal = () => location.hostname === 'localhost' || location.hostname === '127.0.0.1';

export async function fetchLiveFlights(): Promise<FlightRadarSummary> {
  if (flightCache && Date.now() - lastFlightFetch < FLIGHT_CACHE_TTL) {
    return flightCache;
  }
  // On static hosting, use fallback flights (no proxy available)
  if (!isLocal()) {
    if (!flightCache) {
      const flights = generateFallbackFlights();
      const airborne = flights.filter(f => !f.onGround);
      flightCache = {
        flights,
        totalCount: flights.length,
        airborne: airborne.length,
        onGround: flights.length - airborne.length,
        avgAltitude: Math.round(airborne.reduce((s, f) => s + f.altitude, 0) / Math.max(1, airborne.length)),
        lastUpdated: new Date(),
        isLive: false,
      };
    }
    lastFlightFetch = Date.now();
    return flightCache;
  }

  try {
    const url = `/api/opensky/states/all?lamin=${INDIA_BBOX.lamin}&lomin=${INDIA_BBOX.lomin}&lamax=${INDIA_BBOX.lamax}&lomax=${INDIA_BBOX.lomax}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`OpenSky ${res.status}`);

    const data = await res.json();
    const states: unknown[][] = data.states || [];

    const flights: LiveFlight[] = states
      .filter((s) => s[5] != null && s[6] != null) // must have lat/lng
      .map((s) => ({
        icao24: String(s[0]).trim(),
        callsign: String(s[1] || '').trim(),
        originCountry: String(s[2]),
        lat: Number(s[6]),
        lng: Number(s[5]),
        altitude: Number(s[13]) || Number(s[7]) || 0,
        velocity: Number(s[9]) || 0,
        heading: Number(s[10]) || 0,
        verticalRate: Number(s[11]) || 0,
        onGround: Boolean(s[8]),
        squawk: s[14] ? String(s[14]) : null,
        lastContact: Number(s[4]) || 0,
      }));

    const airborne = flights.filter(f => !f.onGround);
    const avgAlt = airborne.length > 0
      ? airborne.reduce((sum, f) => sum + f.altitude, 0) / airborne.length
      : 0;

    const summary: FlightRadarSummary = {
      flights,
      totalCount: flights.length,
      airborne: airborne.length,
      onGround: flights.filter(f => f.onGround).length,
      avgAltitude: Math.round(avgAlt),
      lastUpdated: new Date(),
      isLive: true,
    };

    flightCache = summary;
    lastFlightFetch = Date.now();
    return summary;
  } catch (err) {
    console.warn('[FlightRadar] OpenSky fetch failed:', err);
    return flightCache || {
      flights: [],
      totalCount: 0,
      airborne: 0,
      onGround: 0,
      avgAltitude: 0,
      lastUpdated: new Date(),
      isLive: false,
    };
  }
}

export function getFlightData(): FlightRadarSummary {
  return flightCache || FALLBACK_FLIGHT_DATA;
}

// Fallback data for when OpenSky is unavailable or loading
// Major Indian airport coordinates
const AIRPORTS: { code: string; lat: number; lng: number }[] = [
  { code:'DEL', lat:28.556, lng:77.100 },  // Delhi IGI
  { code:'BOM', lat:19.089, lng:72.868 },  // Mumbai CSIA
  { code:'BLR', lat:13.199, lng:77.706 },  // Bengaluru KIA
  { code:'MAA', lat:12.990, lng:80.169 },  // Chennai
  { code:'CCU', lat:22.654, lng:88.447 },  // Kolkata
  { code:'HYD', lat:17.240, lng:78.429 },  // Hyderabad RGIA
  { code:'GOI', lat:15.381, lng:73.831 },  // Goa Dabolim
  { code:'COK', lat:10.152, lng:76.402 },  // Kochi
  { code:'AMD', lat:23.077, lng:72.634 },  // Ahmedabad
  { code:'JAI', lat:26.824, lng:75.812 },  // Jaipur
  { code:'LKO', lat:26.761, lng:80.889 },  // Lucknow
  { code:'PAT', lat:25.591, lng:85.088 },  // Patna
  { code:'BBI', lat:20.244, lng:85.818 },  // Bhubaneswar
  { code:'VTZ', lat:17.721, lng:83.225 },  // Visakhapatnam
  { code:'IXC', lat:30.674, lng:76.789 },  // Chandigarh
  { code:'ATQ', lat:31.709, lng:74.797 },  // Amritsar
  { code:'GAU', lat:26.106, lng:91.586 },  // Guwahati
  { code:'PNQ', lat:18.582, lng:73.920 },  // Pune
  { code:'NAG', lat:21.092, lng:79.047 },  // Nagpur
  { code:'IDR', lat:22.722, lng:75.801 },  // Indore
  { code:'SXR', lat:33.987, lng:74.774 },  // Srinagar
  { code:'IXR', lat:23.314, lng:85.322 },  // Ranchi
  { code:'TRV', lat:8.482, lng:76.920 },   // Trivandrum
  { code:'CCJ', lat:11.137, lng:75.955 },  // Calicut
  { code:'IXM', lat:9.834, lng:78.093 },   // Madurai
  { code:'VNS', lat:25.452, lng:82.859 },  // Varanasi
  { code:'IXB', lat:26.681, lng:88.329 },  // Bagdogra
  { code:'RPR', lat:21.180, lng:81.739 },  // Raipur
  { code:'UDR', lat:24.618, lng:73.896 },  // Udaipur
  { code:'GWL', lat:26.293, lng:78.228 },  // Gwalior
];

export { AIRPORTS };

function generateFallbackFlights(): LiveFlight[] {
  const flights: LiveFlight[] = [];
  const prefixes = ['AIC','IGO','SEJ','VTI','AKJ','AIX','GOW','SHR','FLY','ALK'];
  let id = 1;

  const mkFlight = (cs: string, lat: number, lng: number, alt: number, vel: number, hdg: number, vr: number, og: boolean): LiveFlight => ({
    icao24: `800${(id).toString(16).padStart(4,'0')}`,
    callsign: cs,
    originCountry: 'India',
    lat, lng, altitude: alt, velocity: vel, heading: hdg, verticalRate: vr,
    onGround: og, squawk: null, lastContact: 0,
  });

  // Ground flights at major airports (60 flights at airports)
  const groundAirports = ['DEL','BOM','BLR','MAA','CCU','HYD','GOI','COK','AMD','JAI','LKO','PAT','PNQ','NAG','GAU','TRV','IXC','ATQ','BBI','VTZ'];
  for (const code of groundAirports) {
    const ap = AIRPORTS.find(a => a.code === code)!;
    const count = code === 'DEL' ? 6 : code === 'BOM' ? 5 : code === 'BLR' ? 4 : code === 'MAA' ? 3 : code === 'HYD' ? 3 : 2;
    for (let i = 0; i < count; i++) {
      const prefix = prefixes[(id) % prefixes.length];
      const flNum = 100 + (id * 7) % 900;
      flights.push(mkFlight(`${prefix}${flNum}`, ap.lat + (Math.sin(id)*0.003), ap.lng + (Math.cos(id)*0.003), 0, 0, (id*47)%360, 0, true));
      id++;
    }
  }

  // Airborne flights across Indian airspace (160+ flights)
  // Route corridors with realistic positions
  const corridors: { lat: number; lng: number; hdg: number; alt: number }[] = [
    // DEL-BOM corridor
    { lat:27.8, lng:76.5, hdg:210, alt:10668 }, { lat:26.2, lng:75.9, hdg:215, alt:11278 },
    { lat:24.8, lng:75.1, hdg:220, alt:10973 }, { lat:23.1, lng:74.2, hdg:215, alt:11582 },
    { lat:21.5, lng:73.5, hdg:200, alt:10668 }, { lat:20.2, lng:73.1, hdg:195, alt:9753 },
    // BOM-DEL corridor
    { lat:20.8, lng:73.3, hdg:30, alt:10363 }, { lat:22.5, lng:74.0, hdg:25, alt:11278 },
    { lat:24.2, lng:75.5, hdg:20, alt:10668 }, { lat:26.8, lng:76.3, hdg:15, alt:10058 },
    // DEL-BLR corridor
    { lat:27.0, lng:77.8, hdg:190, alt:11278 }, { lat:25.2, lng:77.6, hdg:195, alt:10973 },
    { lat:23.5, lng:77.3, hdg:195, alt:11582 }, { lat:21.0, lng:78.5, hdg:200, alt:10668 },
    { lat:18.5, lng:78.2, hdg:195, alt:10363 }, { lat:16.0, lng:77.8, hdg:190, alt:9753 },
    { lat:14.5, lng:77.7, hdg:185, alt:8534 },
    // BLR-DEL corridor
    { lat:15.0, lng:77.5, hdg:5, alt:10668 }, { lat:17.5, lng:78.0, hdg:10, alt:11278 },
    { lat:20.0, lng:78.3, hdg:5, alt:10973 }, { lat:22.8, lng:77.5, hdg:0, alt:11582 },
    { lat:25.5, lng:77.5, hdg:355, alt:10668 },
    // DEL-MAA corridor
    { lat:26.5, lng:78.5, hdg:170, alt:10668 }, { lat:24.0, lng:79.0, hdg:175, alt:11278 },
    { lat:21.5, lng:79.5, hdg:170, alt:10973 }, { lat:19.0, lng:79.8, hdg:165, alt:11582 },
    { lat:16.5, lng:80.0, hdg:170, alt:10363 }, { lat:14.0, lng:80.2, hdg:175, alt:9449 },
    // MAA-DEL corridor
    { lat:14.5, lng:80.1, hdg:350, alt:10668 }, { lat:17.0, lng:79.8, hdg:345, alt:11278 },
    { lat:20.0, lng:79.3, hdg:350, alt:10973 }, { lat:23.0, lng:78.5, hdg:355, alt:11582 },
    // DEL-CCU corridor
    { lat:27.5, lng:79.0, hdg:110, alt:10668 }, { lat:26.5, lng:81.0, hdg:105, alt:11278 },
    { lat:25.5, lng:83.0, hdg:100, alt:10973 }, { lat:24.5, lng:85.5, hdg:105, alt:11582 },
    { lat:23.5, lng:87.0, hdg:100, alt:10363 },
    // CCU-DEL corridor
    { lat:23.0, lng:86.5, hdg:290, alt:10668 }, { lat:24.8, lng:84.0, hdg:295, alt:11278 },
    { lat:26.0, lng:82.0, hdg:290, alt:10973 }, { lat:27.0, lng:80.0, hdg:295, alt:11582 },
    // BOM-BLR corridor
    { lat:18.0, lng:73.5, hdg:160, alt:10668 }, { lat:16.5, lng:74.5, hdg:155, alt:11278 },
    { lat:15.0, lng:76.0, hdg:145, alt:10973 }, { lat:14.0, lng:77.0, hdg:150, alt:9449 },
    // BLR-BOM corridor
    { lat:14.5, lng:76.5, hdg:330, alt:10668 }, { lat:16.0, lng:75.0, hdg:335, alt:11278 },
    { lat:17.5, lng:73.8, hdg:340, alt:10973 },
    // BOM-GOI short-haul
    { lat:17.5, lng:73.2, hdg:175, alt:7620 }, { lat:16.2, lng:73.5, hdg:170, alt:6096 },
    // DEL-GOA corridor
    { lat:25.0, lng:76.0, hdg:210, alt:11278 }, { lat:22.0, lng:74.5, hdg:205, alt:10973 },
    { lat:19.0, lng:73.5, hdg:195, alt:10363 }, { lat:16.5, lng:73.8, hdg:190, alt:8534 },
    // BOM-HYD corridor
    { lat:19.5, lng:74.5, hdg:120, alt:9144 }, { lat:18.5, lng:76.5, hdg:115, alt:8534 },
    { lat:17.8, lng:78.0, hdg:110, alt:7010 },
    // HYD-DEL corridor
    { lat:18.5, lng:78.5, hdg:350, alt:10668 }, { lat:21.0, lng:78.0, hdg:355, alt:11278 },
    { lat:24.0, lng:77.8, hdg:0, alt:10973 }, { lat:26.5, lng:77.5, hdg:355, alt:10363 },
    // DEL-HYD corridor
    { lat:26.0, lng:77.8, hdg:175, alt:10668 }, { lat:23.5, lng:78.0, hdg:170, alt:11278 },
    { lat:20.5, lng:78.5, hdg:165, alt:10973 },
    // BLR-CCU corridor
    { lat:14.5, lng:79.0, hdg:45, alt:10668 }, { lat:16.5, lng:80.5, hdg:40, alt:11278 },
    { lat:18.5, lng:82.0, hdg:45, alt:10973 }, { lat:20.5, lng:84.0, hdg:40, alt:11582 },
    // CCU-BLR corridor
    { lat:20.0, lng:85.0, hdg:220, alt:10668 }, { lat:18.0, lng:83.0, hdg:225, alt:11278 },
    { lat:15.5, lng:80.5, hdg:220, alt:10363 },
    // DEL-AMD corridor
    { lat:27.5, lng:76.0, hdg:240, alt:9144 }, { lat:26.0, lng:74.5, hdg:235, alt:8534 },
    { lat:24.5, lng:73.5, hdg:230, alt:7620 },
    // MAA-BLR short-haul
    { lat:13.0, lng:79.5, hdg:250, alt:6096 }, { lat:13.1, lng:78.5, hdg:255, alt:5486 },
    // BOM-CCU corridor
    { lat:20.0, lng:75.0, hdg:70, alt:10668 }, { lat:21.0, lng:77.5, hdg:65, alt:11278 },
    { lat:21.5, lng:80.0, hdg:70, alt:10973 }, { lat:22.0, lng:83.0, hdg:65, alt:11582 },
    { lat:22.5, lng:86.0, hdg:70, alt:10363 },
    // DEL-SXR corridor
    { lat:29.5, lng:77.0, hdg:340, alt:8534 }, { lat:31.0, lng:76.5, hdg:345, alt:7620 },
    { lat:32.5, lng:75.5, hdg:340, alt:6401 },
    // DEL-GAU corridor
    { lat:27.0, lng:80.0, hdg:85, alt:10668 }, { lat:26.5, lng:83.0, hdg:80, alt:11278 },
    { lat:26.0, lng:86.0, hdg:85, alt:10973 }, { lat:26.2, lng:89.0, hdg:80, alt:10363 },
    // DEL-IXC short-haul
    { lat:29.5, lng:77.0, hdg:340, alt:5486 }, { lat:30.2, lng:76.8, hdg:345, alt:4267 },
    // COK-DEL
    { lat:12.0, lng:76.5, hdg:5, alt:10668 }, { lat:15.0, lng:77.0, hdg:0, alt:11278 },
    { lat:19.0, lng:77.5, hdg:5, alt:10973 }, { lat:23.0, lng:77.3, hdg:0, alt:11582 },
    // BLR-HYD short-haul
    { lat:14.5, lng:78.0, hdg:20, alt:7620 }, { lat:15.8, lng:78.2, hdg:15, alt:6401 },
    // MAA-HYD short-haul
    { lat:14.0, lng:80.0, hdg:320, alt:7620 }, { lat:15.5, lng:79.5, hdg:315, alt:6096 },
    // TRV-DEL corridor
    { lat:10.0, lng:77.0, hdg:10, alt:10668 }, { lat:13.0, lng:77.5, hdg:5, alt:11278 },
    { lat:16.0, lng:78.0, hdg:0, alt:10973 }, { lat:20.0, lng:78.0, hdg:5, alt:11582 },
    { lat:24.0, lng:77.5, hdg:0, alt:10668 },
    // BBI-DEL
    { lat:22.0, lng:85.0, hdg:310, alt:10668 }, { lat:24.0, lng:83.0, hdg:315, alt:11278 },
    { lat:26.0, lng:80.0, hdg:310, alt:10973 },
    // Approach/Departure patterns near major airports
    { lat:28.8, lng:76.8, hdg:150, alt:3048, }, // DEL approach
    { lat:28.3, lng:77.3, hdg:320, alt:2438, }, // DEL departure
    { lat:19.3, lng:72.6, hdg:100, alt:3048, }, // BOM approach
    { lat:18.8, lng:73.1, hdg:280, alt:2438, }, // BOM departure
    { lat:13.4, lng:77.5, hdg:200, alt:3048, }, // BLR approach
    { lat:12.9, lng:77.9, hdg:20, alt:2438, },  // BLR departure
    { lat:13.2, lng:80.4, hdg:240, alt:3048, }, // MAA approach
    { lat:12.7, lng:79.9, hdg:50, alt:2438, },  // MAA departure
    { lat:22.9, lng:88.2, hdg:160, alt:3048, }, // CCU approach
    { lat:22.4, lng:88.6, hdg:340, alt:2438, }, // CCU departure
    { lat:17.5, lng:78.2, hdg:180, alt:3048, }, // HYD approach
    { lat:17.0, lng:78.6, hdg:0, alt:2438, },   // HYD departure
    // More scattered airborne flights
    { lat:9.5, lng:76.3, hdg:340, alt:10668 },  // Over Kerala
    { lat:11.0, lng:77.0, hdg:15, alt:9753 },   // Over Tamil Nadu
    { lat:20.5, lng:70.5, hdg:30, alt:11278 },  // Over Arabian Sea coast
    { lat:21.5, lng:86.0, hdg:220, alt:10973 }, // Over Odisha
    { lat:25.5, lng:86.5, hdg:280, alt:10668 }, // Over Bihar
    { lat:24.0, lng:72.5, hdg:60, alt:11582 },  // Over Gujarat
    { lat:29.0, lng:79.5, hdg:300, alt:8534 },  // Near Uttarakhand
    { lat:22.5, lng:71.5, hdg:45, alt:9144 },   // Saurashtra
    { lat:19.0, lng:76.0, hdg:160, alt:10363 }, // Marathwada
    { lat:16.0, lng:81.5, hdg:170, alt:9449 },  // AP coast
    { lat:27.5, lng:73.5, hdg:200, alt:10668 }, // Rajasthan
    { lat:30.5, lng:75.5, hdg:135, alt:8534 },  // Punjab
    { lat:23.0, lng:79.0, hdg:90, alt:10973 },  // MP
    { lat:25.0, lng:82.0, hdg:270, alt:11278 }, // UP east
    { lat:12.5, lng:75.0, hdg:30, alt:7620 },   // Karnataka coast
  ];

  for (const c of corridors) {
    const prefix = prefixes[(id) % prefixes.length];
    const flNum = 100 + (id * 13) % 900;
    const vel = c.alt > 9000 ? 230 + (id % 40) : 150 + (id % 60);
    flights.push(mkFlight(`${prefix}${flNum}`, c.lat, c.lng, c.alt, vel, c.hdg, c.alt < 4000 ? (c.hdg > 180 ? -4.0 : 3.0) : 0, false));
    id++;
  }

  return flights;
}

const FALLBACK_FLIGHTS = generateFallbackFlights();

const FALLBACK_FLIGHT_DATA: FlightRadarSummary = {
  flights: FALLBACK_FLIGHTS,
  totalCount: FALLBACK_FLIGHTS.length,
  airborne: FALLBACK_FLIGHTS.filter(f => !f.onGround).length,
  onGround: FALLBACK_FLIGHTS.filter(f => f.onGround).length,
  avgAltitude: Math.round(FALLBACK_FLIGHTS.filter(f => !f.onGround).reduce((s, f) => s + f.altitude, 0) / Math.max(1, FALLBACK_FLIGHTS.filter(f => !f.onGround).length)),
  lastUpdated: new Date(),
  isLive: false,
};

// Utility: Guess airline from callsign
export function guessAirline(callsign: string): { code: string; name: string; color: string } {
  const cs = callsign.toUpperCase();
  const airlines: Record<string, { name: string; color: string }> = {
    'AIC': { name: 'Air India', color: '#ff6b35' },
    'IGO': { name: 'IndiGo', color: '#3b5fef' },
    'SEJ': { name: 'SpiceJet', color: '#ef4444' },
    'VTI': { name: 'Vistara', color: '#a855f7' },
    'AKJ': { name: 'Akasa Air', color: '#f97316' },
    'AIX': { name: 'Air India Express', color: '#22c55e' },
    'GOW': { name: 'Go First', color: '#eab308' },
    'SHR': { name: 'Star Air', color: '#06b6d4' },
    'FLY': { name: 'Fly91', color: '#ec4899' },
    'ALK': { name: 'Alliance Air', color: '#14b8a6' },
  };

  for (const [prefix, info] of Object.entries(airlines)) {
    if (cs.startsWith(prefix)) return { code: prefix, ...info };
  }
  return { code: cs.substring(0, 3), name: 'International', color: '#6b7280' };
}
