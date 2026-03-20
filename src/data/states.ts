// ─── India States & UTs Master Data ───
export interface StateData {
  code: string;
  name: string;
  capital: string;
  type: 'state' | 'ut';
  population: number;       // 2024 est. in millions
  area: number;             // sq km
  literacy: number;         // %
  gdp: number;              // USD billion
  languages: string[];
  lat: number;
  lng: number;
  zone: string;
}

export const STATES: StateData[] = [
  { code: 'AP', name: 'Andhra Pradesh', capital: 'Amaravati', type: 'state', population: 53.0, area: 162968, literacy: 67.4, gdp: 150, languages: ['Telugu'], lat: 15.9129, lng: 79.7400, zone: 'South' },
  { code: 'AR', name: 'Arunachal Pradesh', capital: 'Itanagar', type: 'state', population: 1.6, area: 83743, literacy: 65.4, gdp: 4, languages: ['English', 'Hindi'], lat: 28.2180, lng: 94.7278, zone: 'Northeast' },
  { code: 'AS', name: 'Assam', capital: 'Dispur', type: 'state', population: 35.6, area: 78438, literacy: 72.2, gdp: 48, languages: ['Assamese'], lat: 26.2006, lng: 92.9376, zone: 'Northeast' },
  { code: 'BR', name: 'Bihar', capital: 'Patna', type: 'state', population: 128.5, area: 94163, literacy: 61.8, gdp: 80, languages: ['Hindi'], lat: 25.0961, lng: 85.3131, zone: 'East' },
  { code: 'CT', name: 'Chhattisgarh', capital: 'Naya Raipur', type: 'state', population: 29.4, area: 135192, literacy: 70.3, gdp: 45, languages: ['Hindi', 'Chhattisgarhi'], lat: 21.2787, lng: 81.8661, zone: 'Central' },
  { code: 'GA', name: 'Goa', capital: 'Panaji', type: 'state', population: 1.6, area: 3702, literacy: 88.7, gdp: 10, languages: ['Konkani'], lat: 15.2993, lng: 74.1240, zone: 'West' },
  { code: 'GJ', name: 'Gujarat', capital: 'Gandhinagar', type: 'state', population: 70.4, area: 196024, literacy: 78.0, gdp: 230, languages: ['Gujarati'], lat: 22.2587, lng: 71.1924, zone: 'West' },
  { code: 'HR', name: 'Haryana', capital: 'Chandigarh', type: 'state', population: 29.4, area: 44212, literacy: 75.6, gdp: 110, languages: ['Hindi'], lat: 29.0588, lng: 76.0856, zone: 'North' },
  { code: 'HP', name: 'Himachal Pradesh', capital: 'Shimla', type: 'state', population: 7.5, area: 55673, literacy: 82.8, gdp: 22, languages: ['Hindi'], lat: 31.1048, lng: 77.1734, zone: 'North' },
  { code: 'JH', name: 'Jharkhand', capital: 'Ranchi', type: 'state', population: 39.3, area: 79710, literacy: 66.4, gdp: 45, languages: ['Hindi'], lat: 23.6102, lng: 85.2799, zone: 'East' },
  { code: 'KA', name: 'Karnataka', capital: 'Bengaluru', type: 'state', population: 68.0, area: 191791, literacy: 75.4, gdp: 260, languages: ['Kannada'], lat: 15.3173, lng: 75.7139, zone: 'South' },
  { code: 'KL', name: 'Kerala', capital: 'Thiruvananthapuram', type: 'state', population: 35.7, area: 38852, literacy: 94.0, gdp: 115, languages: ['Malayalam'], lat: 10.8505, lng: 76.2711, zone: 'South' },
  { code: 'MP', name: 'Madhya Pradesh', capital: 'Bhopal', type: 'state', population: 85.4, area: 308252, literacy: 69.3, gdp: 120, languages: ['Hindi'], lat: 22.9734, lng: 78.6569, zone: 'Central' },
  { code: 'MH', name: 'Maharashtra', capital: 'Mumbai', type: 'state', population: 126.2, area: 307713, literacy: 82.3, gdp: 430, languages: ['Marathi'], lat: 19.7515, lng: 75.7139, zone: 'West' },
  { code: 'MN', name: 'Manipur', capital: 'Imphal', type: 'state', population: 3.1, area: 22327, literacy: 79.2, gdp: 4, languages: ['Meitei'], lat: 24.6637, lng: 93.9063, zone: 'Northeast' },
  { code: 'ML', name: 'Meghalaya', capital: 'Shillong', type: 'state', population: 3.4, area: 22429, literacy: 74.4, gdp: 5, languages: ['English', 'Khasi'], lat: 25.4670, lng: 91.3662, zone: 'Northeast' },
  { code: 'MZ', name: 'Mizoram', capital: 'Aizawl', type: 'state', population: 1.2, area: 21081, literacy: 91.3, gdp: 3, languages: ['Mizo'], lat: 23.1645, lng: 92.9376, zone: 'Northeast' },
  { code: 'NL', name: 'Nagaland', capital: 'Kohima', type: 'state', population: 2.3, area: 16579, literacy: 79.6, gdp: 4, languages: ['English'], lat: 26.1584, lng: 94.5624, zone: 'Northeast' },
  { code: 'OD', name: 'Odisha', capital: 'Bhubaneswar', type: 'state', population: 46.4, area: 155707, literacy: 72.9, gdp: 65, languages: ['Odia'], lat: 20.9517, lng: 85.0985, zone: 'East' },
  { code: 'PB', name: 'Punjab', capital: 'Chandigarh', type: 'state', population: 31.0, area: 50362, literacy: 75.8, gdp: 75, languages: ['Punjabi'], lat: 31.1471, lng: 75.3412, zone: 'North' },
  { code: 'RJ', name: 'Rajasthan', capital: 'Jaipur', type: 'state', population: 81.0, area: 342239, literacy: 66.1, gdp: 130, languages: ['Hindi', 'Rajasthani'], lat: 27.0238, lng: 74.2179, zone: 'West' },
  { code: 'SK', name: 'Sikkim', capital: 'Gangtok', type: 'state', population: 0.7, area: 7096, literacy: 81.4, gdp: 4, languages: ['Nepali'], lat: 27.5330, lng: 88.5122, zone: 'Northeast' },
  { code: 'TN', name: 'Tamil Nadu', capital: 'Chennai', type: 'state', population: 77.8, area: 130058, literacy: 80.1, gdp: 280, languages: ['Tamil'], lat: 11.1271, lng: 78.6569, zone: 'South' },
  { code: 'TG', name: 'Telangana', capital: 'Hyderabad', type: 'state', population: 39.0, area: 112077, literacy: 66.5, gdp: 140, languages: ['Telugu'], lat: 18.1124, lng: 79.0193, zone: 'South' },
  { code: 'TR', name: 'Tripura', capital: 'Agartala', type: 'state', population: 4.2, area: 10486, literacy: 87.2, gdp: 7, languages: ['Bengali', 'Kokborok'], lat: 23.9408, lng: 91.9882, zone: 'Northeast' },
  { code: 'UP', name: 'Uttar Pradesh', capital: 'Lucknow', type: 'state', population: 235.0, area: 240928, literacy: 67.7, gdp: 240, languages: ['Hindi'], lat: 26.8467, lng: 80.9462, zone: 'North' },
  { code: 'UK', name: 'Uttarakhand', capital: 'Dehradun', type: 'state', population: 11.6, area: 53483, literacy: 78.8, gdp: 30, languages: ['Hindi'], lat: 30.0668, lng: 79.0193, zone: 'North' },
  { code: 'WB', name: 'West Bengal', capital: 'Kolkata', type: 'state', population: 100.9, area: 88752, literacy: 76.3, gdp: 160, languages: ['Bengali'], lat: 22.9868, lng: 87.8550, zone: 'East' },
  // Union Territories
  { code: 'AN', name: 'Andaman & Nicobar', capital: 'Port Blair', type: 'ut', population: 0.4, area: 8249, literacy: 86.6, gdp: 1, languages: ['Hindi', 'English'], lat: 11.7401, lng: 92.6586, zone: 'Islands' },
  { code: 'CH', name: 'Chandigarh', capital: 'Chandigarh', type: 'ut', population: 1.2, area: 114, literacy: 86.0, gdp: 5, languages: ['Hindi', 'Punjabi'], lat: 30.7333, lng: 76.7794, zone: 'North' },
  { code: 'DN', name: 'Dadra & Nagar Haveli and Daman & Diu', capital: 'Daman', type: 'ut', population: 0.6, area: 603, literacy: 76.2, gdp: 2, languages: ['Gujarati', 'Hindi'], lat: 20.1809, lng: 73.0169, zone: 'West' },
  { code: 'DL', name: 'Delhi', capital: 'New Delhi', type: 'ut', population: 21.0, area: 1484, literacy: 86.2, gdp: 120, languages: ['Hindi', 'English'], lat: 28.7041, lng: 77.1025, zone: 'North' },
  { code: 'JK', name: 'Jammu & Kashmir', capital: 'Srinagar', type: 'ut', population: 14.0, area: 42241, literacy: 67.2, gdp: 22, languages: ['Kashmiri', 'Urdu', 'Dogri'], lat: 33.7782, lng: 76.5762, zone: 'North' },
  { code: 'LA', name: 'Ladakh', capital: 'Leh', type: 'ut', population: 0.3, area: 59146, literacy: 77.3, gdp: 1, languages: ['Ladakhi', 'Hindi'], lat: 34.1526, lng: 77.5771, zone: 'North' },
  { code: 'LD', name: 'Lakshadweep', capital: 'Kavaratti', type: 'ut', population: 0.07, area: 32, literacy: 91.8, gdp: 0.3, languages: ['Malayalam'], lat: 10.5667, lng: 72.6417, zone: 'Islands' },
  { code: 'PY', name: 'Puducherry', capital: 'Puducherry', type: 'ut', population: 1.4, area: 479, literacy: 85.8, gdp: 5, languages: ['Tamil', 'French'], lat: 11.9416, lng: 79.8083, zone: 'South' },
];

export const ZONES = ['North', 'South', 'East', 'West', 'Central', 'Northeast', 'Islands'] as const;

export const ZONE_COLORS: Record<string, string> = {
  North: '#ff6b35',
  South: '#00d4aa',
  East: '#4ecdc4',
  West: '#ffe66d',
  Central: '#a855f7',
  Northeast: '#06b6d4',
  Islands: '#f43f5e',
};
