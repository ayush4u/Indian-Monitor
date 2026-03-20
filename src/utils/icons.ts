// ─── Icon Utility — Lucide SVG Icons ───
// Provides inline SVG icons for the entire app, replacing emoji usage

import {
  LayoutDashboard, Newspaper, TrendingUp, CloudSun, Train, Plane,
  Brain, Map, ChevronLeft, Filter, Search, Maximize2, X, Eye,
  MapPin, Clock, Gauge, ArrowUpRight, ArrowDownRight, AlertTriangle,
  Wifi, WifiOff, Activity, BarChart3, Globe, Zap, Users, IndianRupee,
  Radio, Navigation, Layers, ChevronRight, SlidersHorizontal,
  CircleDot, Route, Building2, Satellite, Shield, Database,
  ChevronDown, MoreHorizontal, CheckCircle2,
} from 'lucide';

type IconData = [string, Record<string, string>][];

function renderSvg(iconData: IconData, size = 18, cls = ''): string {
  const inner = iconData
    .map(([tag, attrs]) => {
      const a = Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ');
      return `<${tag} ${a}/>`;
    })
    .join('');
  return `<svg class="icon${cls ? ' ' + cls : ''}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
}

// Pre-built icon functions
export const icons = {
  dashboard:     (s = 18, c = '') => renderSvg(LayoutDashboard as unknown as IconData, s, c),
  news:          (s = 18, c = '') => renderSvg(Newspaper as unknown as IconData, s, c),
  finance:       (s = 18, c = '') => renderSvg(TrendingUp as unknown as IconData, s, c),
  weather:       (s = 18, c = '') => renderSvg(CloudSun as unknown as IconData, s, c),
  train:         (s = 18, c = '') => renderSvg(Train as unknown as IconData, s, c),
  plane:         (s = 18, c = '') => renderSvg(Plane as unknown as IconData, s, c),
  ai:            (s = 18, c = '') => renderSvg(Brain as unknown as IconData, s, c),
  map:           (s = 18, c = '') => renderSvg(Map as unknown as IconData, s, c),
  back:          (s = 18, c = '') => renderSvg(ChevronLeft as unknown as IconData, s, c),
  right:         (s = 18, c = '') => renderSvg(ChevronRight as unknown as IconData, s, c),
  filter:        (s = 18, c = '') => renderSvg(Filter as unknown as IconData, s, c),
  sliders:       (s = 18, c = '') => renderSvg(SlidersHorizontal as unknown as IconData, s, c),
  search:        (s = 18, c = '') => renderSvg(Search as unknown as IconData, s, c),
  fullscreen:    (s = 18, c = '') => renderSvg(Maximize2 as unknown as IconData, s, c),
  close:         (s = 18, c = '') => renderSvg(X as unknown as IconData, s, c),
  eye:           (s = 18, c = '') => renderSvg(Eye as unknown as IconData, s, c),
  pin:           (s = 18, c = '') => renderSvg(MapPin as unknown as IconData, s, c),
  clock:         (s = 18, c = '') => renderSvg(Clock as unknown as IconData, s, c),
  gauge:         (s = 18, c = '') => renderSvg(Gauge as unknown as IconData, s, c),
  arrowUp:       (s = 18, c = '') => renderSvg(ArrowUpRight as unknown as IconData, s, c),
  arrowDown:     (s = 18, c = '') => renderSvg(ArrowDownRight as unknown as IconData, s, c),
  alert:         (s = 18, c = '') => renderSvg(AlertTriangle as unknown as IconData, s, c),
  wifi:          (s = 18, c = '') => renderSvg(Wifi as unknown as IconData, s, c),
  wifiOff:       (s = 18, c = '') => renderSvg(WifiOff as unknown as IconData, s, c),
  activity:      (s = 18, c = '') => renderSvg(Activity as unknown as IconData, s, c),
  chart:         (s = 18, c = '') => renderSvg(BarChart3 as unknown as IconData, s, c),
  globe:         (s = 18, c = '') => renderSvg(Globe as unknown as IconData, s, c),
  zap:           (s = 18, c = '') => renderSvg(Zap as unknown as IconData, s, c),
  users:         (s = 18, c = '') => renderSvg(Users as unknown as IconData, s, c),
  rupee:         (s = 18, c = '') => renderSvg(IndianRupee as unknown as IconData, s, c),
  radio:         (s = 18, c = '') => renderSvg(Radio as unknown as IconData, s, c),
  navigation:    (s = 18, c = '') => renderSvg(Navigation as unknown as IconData, s, c),
  layers:        (s = 18, c = '') => renderSvg(Layers as unknown as IconData, s, c),
  dot:           (s = 18, c = '') => renderSvg(CircleDot as unknown as IconData, s, c),
  route:         (s = 18, c = '') => renderSvg(Route as unknown as IconData, s, c),
  building:      (s = 18, c = '') => renderSvg(Building2 as unknown as IconData, s, c),
  satellite:     (s = 18, c = '') => renderSvg(Satellite as unknown as IconData, s, c),
  shield:        (s = 18, c = '') => renderSvg(Shield as unknown as IconData, s, c),
  database:      (s = 18, c = '') => renderSvg(Database as unknown as IconData, s, c),
  chevronDown:   (s = 18, c = '') => renderSvg(ChevronDown as unknown as IconData, s, c),
  more:          (s = 18, c = '') => renderSvg(MoreHorizontal as unknown as IconData, s, c),
  check:         (s = 18, c = '') => renderSvg(CheckCircle2 as unknown as IconData, s, c),
};
