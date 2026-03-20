// ─── Transport Service ───
// Public transport tracking for Indian Railways, Metro, and Aviation

export interface TrainStatus {
  trainNo: string;
  trainName: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  status: 'on-time' | 'delayed' | 'cancelled' | 'running';
  delay: number;  // minutes
  currentStation: string;
  platform?: number;
  type: 'Rajdhani' | 'Shatabdi' | 'Vande Bharat' | 'Duronto' | 'Express' | 'Superfast' | 'Local';
  zone: string;
}

export interface MetroStatus {
  city: string;
  line: string;
  lineColor: string;
  status: 'normal' | 'delayed' | 'disrupted' | 'closed';
  message: string;
  frequency: string;
  ridership: number;
}

export interface FlightStatus {
  flightNo: string;
  airline: string;
  from: string;
  to: string;
  departureTime: string;
  status: 'on-time' | 'delayed' | 'cancelled' | 'boarding' | 'landed';
  delay: number;
  gate?: string;
}

const TRAIN_DATA: Omit<TrainStatus, 'status' | 'delay' | 'currentStation'>[] = [
  // Rajdhani Express
  { trainNo: '12301', trainName: 'Howrah Rajdhani Express', from: 'New Delhi', to: 'Howrah', departureTime: '16:55', arrivalTime: '09:55', type: 'Rajdhani', zone: 'ER' },
  { trainNo: '12951', trainName: 'Mumbai Rajdhani Express', from: 'Mumbai Central', to: 'New Delhi', departureTime: '16:35', arrivalTime: '08:35', type: 'Rajdhani', zone: 'WR' },
  { trainNo: '12309', trainName: 'Patna Rajdhani Express', from: 'New Delhi', to: 'Patna', departureTime: '15:35', arrivalTime: '05:10', type: 'Rajdhani', zone: 'ECR' },
  { trainNo: '12431', trainName: 'Trivandrum Rajdhani Express', from: 'New Delhi', to: 'Trivandrum', departureTime: '10:55', arrivalTime: '20:25', type: 'Rajdhani', zone: 'SR' },
  { trainNo: '12313', trainName: 'Sealdah Rajdhani Express', from: 'New Delhi', to: 'Sealdah', departureTime: '13:50', arrivalTime: '07:10', type: 'Rajdhani', zone: 'ER' },
  { trainNo: '12433', trainName: 'Chennai Rajdhani Express', from: 'New Delhi', to: 'Chennai', departureTime: '15:50', arrivalTime: '19:50', type: 'Rajdhani', zone: 'SR' },
  { trainNo: '22691', trainName: 'Bengaluru Rajdhani Express', from: 'New Delhi', to: 'Bengaluru', departureTime: '20:50', arrivalTime: '06:50', type: 'Rajdhani', zone: 'SWR' },
  { trainNo: '12425', trainName: 'Jammu Rajdhani Express', from: 'New Delhi', to: 'Jammu Tawi', departureTime: '20:20', arrivalTime: '06:20', type: 'Rajdhani', zone: 'NR' },
  { trainNo: '22811', trainName: 'Bhubaneswar Rajdhani Express', from: 'New Delhi', to: 'Bhubaneswar', departureTime: '20:00', arrivalTime: '20:35', type: 'Rajdhani', zone: 'ECoR' },
  { trainNo: '12235', trainName: 'Dibrugarh Rajdhani Express', from: 'New Delhi', to: 'Dibrugarh', departureTime: '09:55', arrivalTime: '05:50', type: 'Rajdhani', zone: 'NFR' },
  // Shatabdi Express
  { trainNo: '12002', trainName: 'Bhopal Shatabdi Express', from: 'New Delhi', to: 'Bhopal', departureTime: '06:15', arrivalTime: '13:50', type: 'Shatabdi', zone: 'WCR' },
  { trainNo: '12004', trainName: 'Lucknow Shatabdi Express', from: 'New Delhi', to: 'Lucknow', departureTime: '06:10', arrivalTime: '12:40', type: 'Shatabdi', zone: 'NR' },
  { trainNo: '12006', trainName: 'Jaipur Shatabdi Express', from: 'New Delhi', to: 'Jaipur', departureTime: '06:05', arrivalTime: '11:05', type: 'Shatabdi', zone: 'NWR' },
  { trainNo: '12008', trainName: 'Dehradun Shatabdi Express', from: 'New Delhi', to: 'Dehradun', departureTime: '06:45', arrivalTime: '11:15', type: 'Shatabdi', zone: 'NR' },
  { trainNo: '12028', trainName: 'Amritsar Shatabdi Express', from: 'New Delhi', to: 'Amritsar', departureTime: '07:20', arrivalTime: '13:20', type: 'Shatabdi', zone: 'NR' },
  { trainNo: '12010', trainName: 'Chandigarh Shatabdi Express', from: 'New Delhi', to: 'Chandigarh', departureTime: '07:40', arrivalTime: '10:55', type: 'Shatabdi', zone: 'NR' },
  // Vande Bharat Express
  { trainNo: '22436', trainName: 'Vande Bharat Express', from: 'New Delhi', to: 'Varanasi', departureTime: '06:00', arrivalTime: '14:00', type: 'Vande Bharat', zone: 'NR' },
  { trainNo: '22439', trainName: 'Vande Bharat Express', from: 'Chennai', to: 'Bengaluru', departureTime: '05:50', arrivalTime: '11:35', type: 'Vande Bharat', zone: 'SR' },
  { trainNo: '20501', trainName: 'Vande Bharat Express', from: 'Mumbai', to: 'Ahmedabad', departureTime: '06:10', arrivalTime: '12:30', type: 'Vande Bharat', zone: 'WR' },
  { trainNo: '22447', trainName: 'Vande Bharat Express', from: 'New Delhi', to: 'Jaipur', departureTime: '06:20', arrivalTime: '10:50', type: 'Vande Bharat', zone: 'NWR' },
  { trainNo: '22445', trainName: 'Vande Bharat Express', from: 'New Delhi', to: 'Lucknow', departureTime: '08:00', arrivalTime: '13:30', type: 'Vande Bharat', zone: 'NR' },
  { trainNo: '22461', trainName: 'Vande Bharat Express', from: 'Mumbai', to: 'Goa', departureTime: '06:00', arrivalTime: '13:00', type: 'Vande Bharat', zone: 'KRCL' },
  { trainNo: '22463', trainName: 'Vande Bharat Express', from: 'Hyderabad', to: 'Bengaluru', departureTime: '05:30', arrivalTime: '13:00', type: 'Vande Bharat', zone: 'SCR' },
  // Duronto Express
  { trainNo: '12245', trainName: 'Howrah Duronto Express', from: 'Howrah', to: 'New Delhi', departureTime: '20:10', arrivalTime: '10:25', type: 'Duronto', zone: 'ER' },
  { trainNo: '12213', trainName: 'Mumbai Duronto Express', from: 'New Delhi', to: 'Mumbai', departureTime: '23:00', arrivalTime: '13:00', type: 'Duronto', zone: 'WR' },
  { trainNo: '12259', trainName: 'Sealdah Duronto Express', from: 'Sealdah', to: 'Bengaluru', departureTime: '15:05', arrivalTime: '08:30', type: 'Duronto', zone: 'SWR' },
  { trainNo: '12273', trainName: 'Howrah Duronto Express', from: 'New Delhi', to: 'Howrah', departureTime: '12:55', arrivalTime: '05:00', type: 'Duronto', zone: 'ER' },
  // Superfast & Express
  { trainNo: '12621', trainName: 'Tamil Nadu Express', from: 'New Delhi', to: 'Chennai', departureTime: '22:30', arrivalTime: '07:10', type: 'Superfast', zone: 'SR' },
  { trainNo: '12627', trainName: 'Karnataka Express', from: 'New Delhi', to: 'Bengaluru', departureTime: '21:20', arrivalTime: '06:40', type: 'Superfast', zone: 'SWR' },
  { trainNo: '12839', trainName: 'Chennai Mail', from: 'Howrah', to: 'Chennai', departureTime: '23:00', arrivalTime: '04:35', type: 'Express', zone: 'SER' },
  { trainNo: '12723', trainName: 'Telangana Express', from: 'New Delhi', to: 'Hyderabad', departureTime: '06:50', arrivalTime: '08:00', type: 'Superfast', zone: 'SCR' },
  { trainNo: '12049', trainName: 'Gatimaan Express', from: 'New Delhi', to: 'Jhansi', departureTime: '08:10', arrivalTime: '12:30', type: 'Superfast', zone: 'NCR' },
  { trainNo: '12345', trainName: 'Saraighat Express', from: 'Howrah', to: 'Guwahati', departureTime: '15:50', arrivalTime: '09:50', type: 'Superfast', zone: 'NFR' },
  { trainNo: '12809', trainName: 'Mumbai Mail', from: 'Mumbai', to: 'Howrah', departureTime: '21:00', arrivalTime: '03:00', type: 'Express', zone: 'SER' },
  { trainNo: '12163', trainName: 'Dadar Chennai Express', from: 'Mumbai', to: 'Chennai', departureTime: '08:05', arrivalTime: '06:05', type: 'Superfast', zone: 'SR' },
  { trainNo: '10103', trainName: 'Mandovi Express', from: 'Mumbai', to: 'Goa', departureTime: '07:10', arrivalTime: '19:10', type: 'Express', zone: 'KRCL' },
  { trainNo: '12695', trainName: 'Trivandrum Express', from: 'Chennai', to: 'Trivandrum', departureTime: '19:15', arrivalTime: '11:15', type: 'Superfast', zone: 'SR' },
  { trainNo: '12801', trainName: 'Purushottam Express', from: 'New Delhi', to: 'Puri', departureTime: '22:35', arrivalTime: '04:35', type: 'Superfast', zone: 'ECoR' },
  { trainNo: '12127', trainName: 'Intercity Express', from: 'Mumbai', to: 'Pune', departureTime: '06:40', arrivalTime: '10:10', type: 'Express', zone: 'CR' },
  { trainNo: '12604', trainName: 'Hyderabad Chennai Express', from: 'Hyderabad', to: 'Chennai', departureTime: '18:00', arrivalTime: '07:00', type: 'Superfast', zone: 'SCR' },
  { trainNo: '12785', trainName: 'Kacheguda Express', from: 'Bengaluru', to: 'Hyderabad', departureTime: '18:15', arrivalTime: '06:15', type: 'Express', zone: 'SCR' },
  // Garib Rath
  { trainNo: '12909', trainName: 'Garib Rath Express', from: 'Bandra Terminus', to: 'Hazrat Nizamuddin', departureTime: '12:40', arrivalTime: '06:30', type: 'Superfast', zone: 'WR' },
  { trainNo: '12201', trainName: 'Garib Rath Express', from: 'Mumbai', to: 'Kochuveli', departureTime: '11:00', arrivalTime: '11:15', type: 'Superfast', zone: 'KR' },
  // Humsafar
  { trainNo: '22451', trainName: 'Chandigarh Humsafar Express', from: 'New Delhi', to: 'Chandigarh', departureTime: '23:00', arrivalTime: '05:00', type: 'Superfast', zone: 'NR' },
  { trainNo: '22453', trainName: 'Lucknow Humsafar Express', from: 'New Delhi', to: 'Lucknow', departureTime: '23:55', arrivalTime: '07:10', type: 'Superfast', zone: 'NR' },
  // Tejas Express
  { trainNo: '22120', trainName: 'Tejas Express', from: 'Mumbai', to: 'Karmali (Goa)', departureTime: '05:40', arrivalTime: '14:30', type: 'Superfast', zone: 'KRCL' },
  { trainNo: '22150', trainName: 'Tejas Express', from: 'Lucknow', to: 'New Delhi', departureTime: '06:10', arrivalTime: '12:35', type: 'Superfast', zone: 'NR' },
  // Jan Shatabdi
  { trainNo: '12051', trainName: 'Jan Shatabdi Express', from: 'Chandigarh', to: 'New Delhi', departureTime: '05:25', arrivalTime: '08:45', type: 'Shatabdi', zone: 'NR' },
  { trainNo: '12055', trainName: 'Jan Shatabdi Express', from: 'Dehradun', to: 'New Delhi', departureTime: '05:30', arrivalTime: '11:30', type: 'Shatabdi', zone: 'NR' },
  // More Express routes
  { trainNo: '12859', trainName: 'Gitanjali Express', from: 'Mumbai', to: 'Howrah', departureTime: '06:00', arrivalTime: '08:00', type: 'Superfast', zone: 'SER' },
  { trainNo: '12625', trainName: 'Kerala Express', from: 'New Delhi', to: 'Trivandrum', departureTime: '11:25', arrivalTime: '19:10', type: 'Superfast', zone: 'SR' },
  { trainNo: '12137', trainName: 'Punjab Mail', from: 'Mumbai', to: 'Firozpur', departureTime: '19:40', arrivalTime: '20:55', type: 'Express', zone: 'NR' },
  { trainNo: '12311', trainName: 'Kalka Mail', from: 'Howrah', to: 'Kalka', departureTime: '19:40', arrivalTime: '18:15', type: 'Express', zone: 'ER' },
  { trainNo: '12381', trainName: 'Poorva Express', from: 'Howrah', to: 'New Delhi', departureTime: '20:05', arrivalTime: '19:55', type: 'Superfast', zone: 'ER' },
  { trainNo: '12303', trainName: 'Poorva Express (via Gaya)', from: 'Howrah', to: 'New Delhi', departureTime: '08:10', arrivalTime: '08:40', type: 'Superfast', zone: 'ER' },
  { trainNo: '12505', trainName: 'North East Express', from: 'Guwahati', to: 'New Delhi', departureTime: '17:15', arrivalTime: '06:30', type: 'Superfast', zone: 'NFR' },
  { trainNo: '12559', trainName: 'Shiv Ganga Express', from: 'New Delhi', to: 'Varanasi', departureTime: '19:15', arrivalTime: '05:40', type: 'Superfast', zone: 'NR' },
  { trainNo: '12561', trainName: 'Swatantrata S. Express', from: 'New Delhi', to: 'Varanasi', departureTime: '14:35', arrivalTime: '04:15', type: 'Superfast', zone: 'NR' },
  { trainNo: '12397', trainName: 'Mahabodhi Express', from: 'New Delhi', to: 'Gaya', departureTime: '14:15', arrivalTime: '04:05', type: 'Superfast', zone: 'ECR' },
  { trainNo: '15635', trainName: 'Guwahati Express', from: 'Okha', to: 'Guwahati', departureTime: '05:15', arrivalTime: '05:00', type: 'Express', zone: 'NFR' },
  { trainNo: '12487', trainName: 'Seemanchal Express', from: 'New Delhi', to: 'Jogbani', departureTime: '20:05', arrivalTime: '22:00', type: 'Express', zone: 'ECR' },
  { trainNo: '12423', trainName: 'Dibrugarh Rajdhani Express', from: 'New Delhi', to: 'Dibrugarh', departureTime: '09:55', arrivalTime: '05:50', type: 'Rajdhani', zone: 'NFR' },
  { trainNo: '12269', trainName: 'Duranto Express', from: 'Chennai', to: 'Hazrat Nizamuddin', departureTime: '20:00', arrivalTime: '22:00', type: 'Duronto', zone: 'SR' },
  { trainNo: '12175', trainName: 'Chambal Express', from: 'Mumbai', to: 'Gwalior', departureTime: '23:55', arrivalTime: '23:00', type: 'Superfast', zone: 'WCR' },
  { trainNo: '12919', trainName: 'Gujarat Sampark Kranti', from: 'Ahmedabad', to: 'New Delhi', departureTime: '22:05', arrivalTime: '12:10', type: 'Superfast', zone: 'NR' },
  { trainNo: '12565', trainName: 'Bihar Sampark Kranti', from: 'New Delhi', to: 'Darbhanga', departureTime: '14:30', arrivalTime: '07:40', type: 'Superfast', zone: 'ECR' },
  { trainNo: '12649', trainName: 'Sampark Kranti Express', from: 'Hazrat Nizamuddin', to: 'Chennur', departureTime: '04:30', arrivalTime: '07:25', type: 'Superfast', zone: 'SCR' },
  { trainNo: '12519', trainName: 'Sampark Kranti Express', from: 'Lucknow', to: 'Mumbai', departureTime: '15:30', arrivalTime: '11:45', type: 'Superfast', zone: 'NR' },
  // Rajdhani additions
  { trainNo: '12305', trainName: 'Howrah Rajdhani Express', from: 'New Delhi', to: 'Howrah', departureTime: '17:10', arrivalTime: '10:45', type: 'Rajdhani', zone: 'ER' },
  { trainNo: '12953', trainName: 'August Kranti Rajdhani', from: 'Mumbai Central', to: 'Hazrat Nizamuddin', departureTime: '17:40', arrivalTime: '10:55', type: 'Rajdhani', zone: 'WR' },
  // More Vande Bharat
  { trainNo: '20901', trainName: 'Vande Bharat Express', from: 'Mumbai', to: 'Solapur', departureTime: '06:00', arrivalTime: '12:45', type: 'Vande Bharat', zone: 'CR' },
  { trainNo: '20905', trainName: 'Vande Bharat Express', from: 'Ahmedabad', to: 'Mumbai', departureTime: '06:25', arrivalTime: '12:35', type: 'Vande Bharat', zone: 'WR' },
  { trainNo: '20171', trainName: 'Vande Bharat Express', from: 'Secunderabad', to: 'Tirupati', departureTime: '05:35', arrivalTime: '12:15', type: 'Vande Bharat', zone: 'SCR' },
  { trainNo: '20607', trainName: 'Vande Bharat Express', from: 'Chennai', to: 'Coimbatore', departureTime: '06:10', arrivalTime: '12:50', type: 'Vande Bharat', zone: 'SR' },
  // More Duronto
  { trainNo: '12247', trainName: 'Hazrat Nizamuddin Duronto', from: 'Nagpur', to: 'Hazrat Nizamuddin', departureTime: '14:25', arrivalTime: '04:00', type: 'Duronto', zone: 'CR' },
  { trainNo: '12267', trainName: 'Mumbai Duronto Express', from: 'Ahmedabad', to: 'Mumbai', departureTime: '23:15', arrivalTime: '07:10', type: 'Duronto', zone: 'WR' },
  // More Superfast/Express
  { trainNo: '12302', trainName: 'New Delhi Rajdhani Express', from: 'Howrah', to: 'New Delhi', departureTime: '14:05', arrivalTime: '10:00', type: 'Rajdhani', zone: 'ER' },
  { trainNo: '12952', trainName: 'Delhi Rajdhani Express', from: 'New Delhi', to: 'Mumbai Central', departureTime: '17:00', arrivalTime: '08:35', type: 'Rajdhani', zone: 'WR' },
  { trainNo: '12622', trainName: 'Tamil Nadu Express', from: 'Chennai', to: 'New Delhi', departureTime: '22:00', arrivalTime: '07:10', type: 'Superfast', zone: 'SR' },
  { trainNo: '12628', trainName: 'Karnataka Express', from: 'Bengaluru', to: 'New Delhi', departureTime: '20:10', arrivalTime: '06:10', type: 'Superfast', zone: 'SWR' },
  { trainNo: '12810', trainName: 'Mumbai Mail', from: 'Howrah', to: 'Mumbai', departureTime: '20:00', arrivalTime: '02:00', type: 'Express', zone: 'SER' },
  { trainNo: '12840', trainName: 'Chennai Mail', from: 'Chennai', to: 'Howrah', departureTime: '21:30', arrivalTime: '02:30', type: 'Express', zone: 'SER' },
  { trainNo: '12724', trainName: 'Telangana Express', from: 'Hyderabad', to: 'New Delhi', departureTime: '06:25', arrivalTime: '07:00', type: 'Superfast', zone: 'SCR' },
  { trainNo: '12133', trainName: 'Mangalore SF Express', from: 'Mumbai', to: 'Mangalore', departureTime: '22:10', arrivalTime: '14:15', type: 'Superfast', zone: 'KR' },
  { trainNo: '12164', trainName: 'Chennai Dadar Express', from: 'Chennai', to: 'Mumbai', departureTime: '10:00', arrivalTime: '07:55', type: 'Superfast', zone: 'SR' },
  { trainNo: '12696', trainName: 'Trivandrum Express', from: 'Trivandrum', to: 'Chennai', departureTime: '14:50', arrivalTime: '06:30', type: 'Superfast', zone: 'SR' },
  { trainNo: '12126', trainName: 'Pragati Express', from: 'Pune', to: 'Mumbai', departureTime: '17:15', arrivalTime: '20:35', type: 'Superfast', zone: 'CR' },
  { trainNo: '12125', trainName: 'Pragati Express', from: 'Mumbai', to: 'Pune', departureTime: '07:40', arrivalTime: '11:10', type: 'Superfast', zone: 'CR' },
  { trainNo: '12346', trainName: 'Saraighat Express', from: 'Guwahati', to: 'Howrah', departureTime: '15:30', arrivalTime: '09:30', type: 'Superfast', zone: 'NFR' },
  { trainNo: '12460', trainName: 'Amritsar Delhi Express', from: 'Amritsar', to: 'New Delhi', departureTime: '20:45', arrivalTime: '06:15', type: 'Express', zone: 'NR' },
  // Long-distance popular trains
  { trainNo: '12903', trainName: 'Golden Temple Mail', from: 'Mumbai', to: 'Amritsar', departureTime: '21:30', arrivalTime: '04:30', type: 'Superfast', zone: 'NR' },
  { trainNo: '12261', trainName: 'Howrah Duronto Express', from: 'Howrah', to: 'Mumbai', departureTime: '20:00', arrivalTime: '19:30', type: 'Duronto', zone: 'SER' },
  { trainNo: '12009', trainName: 'Ahmedabad Shatabdi', from: 'Mumbai', to: 'Ahmedabad', departureTime: '06:25', arrivalTime: '13:05', type: 'Shatabdi', zone: 'WR' },
  { trainNo: '12155', trainName: 'Bhopal Express', from: 'Hazrat Nizamuddin', to: 'Bhopal', departureTime: '20:15', arrivalTime: '06:25', type: 'Superfast', zone: 'WCR' },
  { trainNo: '12259', trainName: 'Duronto Express', from: 'Sealdah', to: 'Bengaluru', departureTime: '15:05', arrivalTime: '03:05', type: 'Duronto', zone: 'SWR' },
  { trainNo: '12441', trainName: 'Bilaspur Rajdhani', from: 'New Delhi', to: 'Bilaspur', departureTime: '15:30', arrivalTime: '10:55', type: 'Rajdhani', zone: 'SECR' },
  { trainNo: '12615', trainName: 'Grand Trunk Express', from: 'New Delhi', to: 'Chennai', departureTime: '18:55', arrivalTime: '06:35', type: 'Superfast', zone: 'SR' },
  { trainNo: '12429', trainName: 'Lucknow Rajdhani', from: 'New Delhi', to: 'Lucknow', departureTime: '21:40', arrivalTime: '04:50', type: 'Rajdhani', zone: 'NR' },
  { trainNo: '12249', trainName: 'Anand Vihar Yuva Exp', from: 'Howrah', to: 'Anand Vihar', departureTime: '21:45', arrivalTime: '10:00', type: 'Superfast', zone: 'ER' },
  { trainNo: '12723', trainName: 'Telangana Express', from: 'New Delhi', to: 'Secunderabad', departureTime: '06:50', arrivalTime: '07:40', type: 'Superfast', zone: 'SCR' },
  { trainNo: '12617', trainName: 'Mangala Lakshadweep', from: 'Hazrat Nizamuddin', to: 'Ernakulam', departureTime: '14:30', arrivalTime: '16:35', type: 'Superfast', zone: 'SR' },
  { trainNo: '22109', trainName: 'Lucknow Jn Tejas', from: 'New Delhi', to: 'Lucknow', departureTime: '06:10', arrivalTime: '12:25', type: 'Superfast', zone: 'NR' },
  { trainNo: '16345', trainName: 'Thiruvananthapuram Exp', from: 'Lokmanya Tilak', to: 'Trivandrum', departureTime: '11:40', arrivalTime: '16:10', type: 'Express', zone: 'SR' },
  { trainNo: '12650', trainName: 'Sampark Kranti Exp', from: 'Chennai', to: 'Hazrat Nizamuddin', departureTime: '17:25', arrivalTime: '20:00', type: 'Superfast', zone: 'SCR' },
  { trainNo: '13009', trainName: 'Doon Express', from: 'Howrah', to: 'Dehradun', departureTime: '22:05', arrivalTime: '06:25', type: 'Express', zone: 'NR' },
  { trainNo: '14055', trainName: 'Brahmaputra Mail', from: 'New Delhi', to: 'Dibrugarh', departureTime: '21:20', arrivalTime: '05:50', type: 'Express', zone: 'NFR' },
  { trainNo: '15017', trainName: 'Gorakhpur Express', from: 'Lucknow', to: 'Gorakhpur', departureTime: '23:45', arrivalTime: '06:30', type: 'Express', zone: 'NER' },
];

const STATIONS = [
  'New Delhi', 'Mumbai Central', 'Howrah', 'Chennai Central', 'Bengaluru City',
  'Hyderabad', 'Ahmedabad', 'Patna', 'Lucknow', 'Jaipur', 'Bhopal',
  'Pune', 'Nagpur', 'Kanpur Central', 'Varanasi', 'Agra Cantt',
  'Allahabad Jn', 'Mathura Jn', 'Gwalior', 'Vijayawada',
];

export function getTrainStatuses(): TrainStatus[] {
  const hourSeed = new Date().getHours();
  return TRAIN_DATA.map((train, idx) => {
    // Deterministic hash so statuses stay stable within the same hour
    const hash = Array.from(train.trainNo).reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);
    const seed = Math.abs(hash + hourSeed * 7919 + idx * 31);
    const r = (seed % 100) / 100;
    let status: TrainStatus['status'];
    let delay = 0;

    if (r < 0.5) {
      status = 'on-time';
    } else if (r < 0.75) {
      status = 'running';
      delay = (seed % 30) + 5;
    } else if (r < 0.93) {
      status = 'delayed';
      delay = (seed % 120) + 15;
    } else {
      status = 'cancelled';
    }

    const stationIdx = seed % STATIONS.length;
    const currentStation = status === 'on-time' ? train.from : STATIONS[stationIdx];

    return {
      ...train,
      status,
      delay,
      currentStation,
      platform: status !== 'cancelled' ? (seed % 10) + 1 : undefined,
    };
  });
}

export function getMetroStatuses(): MetroStatus[] {
  const metros: Omit<MetroStatus, 'status' | 'message' | 'ridership'>[] = [
    { city: 'Delhi', line: 'Blue Line', lineColor: '#2563eb', frequency: '3 min' },
    { city: 'Delhi', line: 'Yellow Line', lineColor: '#eab308', frequency: '3 min' },
    { city: 'Delhi', line: 'Red Line', lineColor: '#dc2626', frequency: '4 min' },
    { city: 'Delhi', line: 'Magenta Line', lineColor: '#ec4899', frequency: '5 min' },
    { city: 'Mumbai', line: 'Line 1 (Blue)', lineColor: '#2563eb', frequency: '4 min' },
    { city: 'Mumbai', line: 'Line 2A (Yellow)', lineColor: '#eab308', frequency: '6 min' },
    { city: 'Mumbai', line: 'Line 3 (Aqua)', lineColor: '#06b6d4', frequency: '5 min' },
    { city: 'Bengaluru', line: 'Purple Line', lineColor: '#9333ea', frequency: '5 min' },
    { city: 'Bengaluru', line: 'Green Line', lineColor: '#22c55e', frequency: '5 min' },
    { city: 'Chennai', line: 'Blue Line', lineColor: '#2563eb', frequency: '6 min' },
    { city: 'Chennai', line: 'Green Line', lineColor: '#22c55e', frequency: '7 min' },
    { city: 'Kolkata', line: 'Line 1 (Blue)', lineColor: '#2563eb', frequency: '5 min' },
    { city: 'Hyderabad', line: 'Red Line', lineColor: '#dc2626', frequency: '5 min' },
    { city: 'Hyderabad', line: 'Blue Line', lineColor: '#2563eb', frequency: '6 min' },
    { city: 'Hyderabad', line: 'Green Line', lineColor: '#22c55e', frequency: '6 min' },
    { city: 'Kochi', line: 'Blue Line', lineColor: '#2563eb', frequency: '8 min' },
  ];

  return metros.map(m => {
    const r = Math.random();
    let status: MetroStatus['status'] = 'normal';
    let message = 'Services running smoothly';

    if (r > 0.85) {
      status = 'delayed';
      message = 'Minor delays due to technical issue';
    } else if (r > 0.95) {
      status = 'disrupted';
      message = 'Service disrupted between ' + m.city + ' stations';
    }

    return {
      ...m,
      status,
      message,
      ridership: Math.floor(Math.random() * 200000 + 50000),
    };
  });
}

export function getFlightStatuses(): FlightStatus[] {
  const flights: FlightStatus[] = [
    { flightNo: 'AI 101', airline: 'Air India', from: 'DEL', to: 'BOM', departureTime: '06:00', status: 'on-time', delay: 0, gate: 'A12' },
    { flightNo: '6E 201', airline: 'IndiGo', from: 'BLR', to: 'DEL', departureTime: '07:30', status: 'on-time', delay: 0, gate: 'B5' },
    { flightNo: 'SG 341', airline: 'SpiceJet', from: 'BOM', to: 'GOI', departureTime: '09:00', status: 'delayed', delay: 25, gate: 'C8' },
    { flightNo: 'UK 845', airline: 'Vistara', from: 'DEL', to: 'MAA', departureTime: '10:15', status: 'boarding', delay: 0, gate: 'A3' },
    { flightNo: '6E 504', airline: 'IndiGo', from: 'HYD', to: 'CCU', departureTime: '11:45', status: 'on-time', delay: 0, gate: 'D2' },
    { flightNo: 'AI 505', airline: 'Air India', from: 'MAA', to: 'BLR', departureTime: '08:20', status: 'landed', delay: 0 },
    { flightNo: 'QP 1312', airline: 'Akasa Air', from: 'BOM', to: 'DEL', departureTime: '13:00', status: 'on-time', delay: 0, gate: 'B10' },
    { flightNo: '6E 890', airline: 'IndiGo', from: 'DEL', to: 'AMD', departureTime: '14:30', status: 'delayed', delay: 40, gate: 'C1' },
  ];

  return flights;
}

// ─── Railway Route & Map Data ───

export interface TrainOnMap {
  trainNo: string;
  trainName: string;
  type: string;
  lat: number;
  lng: number;
  heading: number;
  progress: number;
  route: [number, number][];
  from: string;
  to: string;
}

// Major railway corridors with waypoints [lat, lng]
const ROUTES: Record<string, [number, number][]> = {
  DEL_BOM: [[28.64,77.22],[27.49,77.67],[26.85,76.62],[25.18,75.86],[23.33,75.04],[22.30,73.19],[21.17,72.83],[19.08,72.88]],
  DEL_HWH: [[28.64,77.22],[27.18,80.13],[26.45,80.35],[25.43,81.85],[25.28,83.12],[24.47,84.70],[23.79,86.43],[22.57,88.36]],
  DEL_MAS: [[28.64,77.22],[27.18,78.02],[25.45,78.57],[23.26,77.41],[21.15,79.09],[18.00,79.59],[17.43,78.50],[15.83,79.50],[13.65,79.51],[13.08,80.27]],
  DEL_SBC: [[28.64,77.22],[27.18,78.02],[25.45,78.57],[23.26,77.41],[21.15,79.09],[17.43,78.50],[15.17,77.37],[12.98,77.57]],
  BOM_MAS: [[19.08,72.88],[18.53,73.85],[17.68,75.91],[15.17,77.37],[13.65,79.51],[13.08,80.27]],
  BOM_HWH: [[19.08,72.88],[20.93,77.75],[21.15,79.09],[21.24,81.63],[22.08,82.15],[21.85,84.01],[22.57,88.36]],
  DEL_BSB: [[28.64,77.22],[27.18,80.13],[26.45,80.35],[25.43,81.85],[25.32,83.01]],
  MAS_SBC: [[13.08,80.27],[12.97,79.15],[12.98,77.57]],
  BOM_ADI: [[19.08,72.88],[21.17,72.83],[22.30,73.19],[23.02,72.57]],
  DEL_JP: [[28.64,77.22],[28.20,76.62],[27.63,76.09],[26.92,75.79]],
  HWH_MAS: [[22.57,88.36],[21.47,87.00],[20.30,85.82],[17.69,83.22],[16.51,80.65],[13.08,80.27]],
  DEL_LKO: [[28.64,77.22],[27.88,78.08],[27.18,79.41],[26.45,80.35],[26.85,80.95]],
  BOM_GOI: [[19.08,72.88],[18.99,73.12],[17.68,73.30],[16.99,73.30],[15.28,73.97]],
  DEL_ASR: [[28.64,77.22],[29.97,76.85],[30.38,76.78],[30.90,75.86],[31.33,75.58],[31.63,74.87]],
  DEL_DDN: [[28.64,77.22],[29.47,77.71],[29.87,77.89],[29.95,78.16],[30.32,78.03]],
  HWH_GHY: [[22.57,88.36],[24.99,88.14],[26.71,88.43],[26.19,91.75]],
  SBC_SC: [[12.98,77.57],[14.47,78.82],[15.17,77.37],[15.83,78.04],[17.38,78.49]],
  BOM_NGP: [[19.08,72.88],[19.99,73.79],[20.92,75.33],[21.05,75.78],[21.15,79.09]],
  DEL_PNBE: [[28.64,77.22],[26.45,80.35],[25.43,81.85],[25.28,83.12],[25.61,85.14]],
  HWH_PURI: [[22.57,88.36],[22.35,87.33],[21.47,87.00],[20.30,85.82],[19.81,85.83]],
  DEL_JAT: [[28.64,77.22],[29.97,76.85],[30.38,76.78],[30.90,75.86],[31.33,75.58],[32.73,74.87]],
  MAS_TVC: [[13.08,80.27],[11.66,78.15],[10.79,78.69],[9.92,78.12],[8.73,77.70],[8.52,76.94]],
  DEL_BPL: [[28.64,77.22],[27.18,78.02],[25.45,78.57],[23.26,77.41]],
  SC_MAS: [[17.38,78.49],[16.51,80.65],[14.68,80.15],[13.08,80.27]],
  LKO_BSB: [[26.85,80.95],[26.45,82.20],[25.43,81.85],[25.32,83.01]],
  BOM_PUNE: [[19.08,72.88],[18.85,73.28],[18.53,73.85]],
  ADI_JP: [[23.02,72.57],[23.72,72.15],[24.58,73.71],[25.78,73.32],[26.92,75.79]],
  // New routes for expanded train data
  DEL_CHG: [[28.64,77.22],[29.97,76.85],[30.38,76.78],[30.73,76.78]],
  DEL_TVC: [[28.64,77.22],[27.18,78.02],[25.45,78.57],[23.26,77.41],[21.15,79.09],[17.43,78.50],[15.17,77.37],[12.98,77.57],[10.79,78.69],[9.92,78.12],[8.52,76.94]],
  BOM_TVC: [[19.08,72.88],[17.68,73.30],[15.28,73.97],[12.98,77.57],[10.79,78.69],[9.92,78.12],[8.52,76.94]],
  DEL_GHY: [[28.64,77.22],[26.45,80.35],[25.43,81.85],[25.61,85.14],[24.99,88.14],[26.71,88.43],[26.19,91.75]],
  BOM_GWL: [[19.08,72.88],[21.15,79.09],[23.26,77.41],[25.45,78.57],[26.23,78.18]],
  ADI_DEL: [[23.02,72.57],[22.30,73.19],[25.18,75.86],[26.92,75.79],[28.64,77.22]],
  DEL_DBG: [[28.64,77.22],[26.45,80.35],[25.43,81.85],[25.61,85.14],[26.12,86.72]],
  LKO_BOM: [[26.85,80.95],[26.45,80.35],[25.45,78.57],[23.26,77.41],[21.15,79.09],[19.08,72.88]],
  BOM_FZR: [[19.08,72.88],[22.30,73.19],[25.18,75.86],[26.92,75.79],[28.64,77.22],[30.38,76.78],[30.90,75.86],[30.93,74.62]],
  HWH_KLK: [[22.57,88.36],[25.61,85.14],[25.43,81.85],[26.45,80.35],[28.64,77.22],[29.97,76.85],[30.38,76.78],[30.84,76.79]],
  DEL_GAYA: [[28.64,77.22],[26.45,80.35],[25.43,81.85],[25.28,83.12],[24.47,84.70]],
  BOM_SLR: [[19.08,72.88],[18.53,73.85],[17.68,75.91]],
  BOM_MNG: [[19.08,72.88],[17.68,73.30],[15.28,73.97],[14.47,74.58],[12.87,74.88]],
  SC_TPT: [[17.38,78.49],[15.83,79.50],[13.65,79.51]],
  MAS_CBE: [[13.08,80.27],[11.66,78.15],[11.02,77.04]],
  DEL_BIL: [[28.64,77.22],[26.45,80.35],[25.43,81.85],[23.26,77.41],[21.15,79.09],[22.08,82.15]],
  DEL_ERS: [[28.64,77.22],[27.18,78.02],[25.45,78.57],[23.26,77.41],[21.15,79.09],[17.43,78.50],[12.98,77.57],[10.79,78.69],[9.92,78.12],[10.00,76.28]],
  HWH_DDN: [[22.57,88.36],[25.61,85.14],[25.43,81.85],[26.45,80.35],[28.64,77.22],[29.47,77.71],[30.32,78.03]],
  LKO_GKP: [[26.85,80.95],[26.45,82.20],[26.76,83.37]],
  BOM_ASR: [[19.08,72.88],[22.30,73.19],[25.18,75.86],[26.92,75.79],[28.64,77.22],[30.38,76.78],[30.90,75.86],[31.33,75.58],[31.63,74.87]],
  // Additional routes for expanded train coverage
  NGP_SC: [[21.15,79.09],[20.93,77.75],[18.00,79.59],[17.38,78.49]],
  BOM_VZG: [[19.08,72.88],[20.93,77.75],[21.15,79.09],[20.30,85.82],[17.69,83.22]],
  MAS_VZG: [[13.08,80.27],[14.68,80.15],[16.51,80.65],[17.69,83.22]],
  DEL_VZG: [[28.64,77.22],[26.45,80.35],[25.43,81.85],[24.47,84.70],[22.57,88.36],[20.30,85.82],[17.69,83.22]],
  SC_SBC: [[17.38,78.49],[15.17,77.37],[12.98,77.57]],
  MAS_MDU: [[13.08,80.27],[11.66,78.15],[10.79,78.69],[9.92,78.12]],
  BOM_RPR: [[19.08,72.88],[20.93,77.75],[21.15,79.09],[21.24,81.63]],
  DEL_IDR: [[28.64,77.22],[27.18,78.02],[25.45,78.57],[23.26,77.41],[22.72,75.80]],
  ADI_BOM: [[23.02,72.57],[22.30,73.19],[21.17,72.83],[19.08,72.88]],
  HWH_BBS: [[22.57,88.36],[21.47,87.00],[20.30,85.82]],
  BOM_SBC: [[19.08,72.88],[17.68,75.91],[15.17,77.37],[12.98,77.57]],
  PNBE_DEL: [[25.61,85.14],[25.43,81.85],[26.45,80.35],[28.64,77.22]],
  DEL_RNC: [[28.64,77.22],[26.45,80.35],[25.43,81.85],[24.47,84.70],[23.79,86.43],[23.31,85.32]],
  JP_ADI: [[26.92,75.79],[25.78,73.32],[24.58,73.71],[23.02,72.57]],
  VZG_SC: [[17.69,83.22],[16.51,80.65],[17.38,78.49]],
  BPL_NGP: [[23.26,77.41],[22.72,75.80],[21.15,79.09]],
  MAS_TRY: [[13.08,80.27],[12.97,79.15],[12.98,77.57],[10.79,78.69]],
  KGP_MAS: [[21.47,87.00],[20.30,85.82],[17.69,83.22],[16.51,80.65],[13.08,80.27]],
};

// Compact train definitions: no, name, route, type, departureHour, departureMin, durationHours, reverse?
interface TrainMapDef {
  no: string; nm: string; rt: string; tp: string;
  dh: number; dm: number; dur: number; rev?: boolean;
}

const MAP_TRAINS: TrainMapDef[] = [
  // Rajdhani Express
  { no:'12301', nm:'Howrah Rajdhani', rt:'DEL_HWH', tp:'Rajdhani', dh:16, dm:55, dur:17 },
  { no:'12302', nm:'New Delhi Rajdhani', rt:'DEL_HWH', tp:'Rajdhani', dh:14, dm:5, dur:17, rev:true },
  { no:'12951', nm:'Mumbai Rajdhani', rt:'DEL_BOM', tp:'Rajdhani', dh:16, dm:35, dur:16 },
  { no:'12952', nm:'Delhi Rajdhani', rt:'DEL_BOM', tp:'Rajdhani', dh:17, dm:0, dur:16, rev:true },
  { no:'12309', nm:'Patna Rajdhani', rt:'DEL_PNBE', tp:'Rajdhani', dh:15, dm:35, dur:13 },
  { no:'12310', nm:'Delhi Rajdhani', rt:'DEL_PNBE', tp:'Rajdhani', dh:17, dm:30, dur:13, rev:true },
  { no:'12313', nm:'Sealdah Rajdhani', rt:'DEL_HWH', tp:'Rajdhani', dh:13, dm:50, dur:17 },
  { no:'12305', nm:'Howrah Rajdhani', rt:'DEL_HWH', tp:'Rajdhani', dh:17, dm:10, dur:18 },
  { no:'12433', nm:'Chennai Rajdhani', rt:'DEL_MAS', tp:'Rajdhani', dh:15, dm:50, dur:28 },
  { no:'12434', nm:'Delhi Rajdhani', rt:'DEL_MAS', tp:'Rajdhani', dh:6, dm:10, dur:28, rev:true },
  { no:'22691', nm:'Bengaluru Rajdhani', rt:'DEL_SBC', tp:'Rajdhani', dh:20, dm:50, dur:34 },
  { no:'12425', nm:'Jammu Rajdhani', rt:'DEL_JAT', tp:'Rajdhani', dh:20, dm:20, dur:10 },
  { no:'12426', nm:'Delhi Rajdhani', rt:'DEL_JAT', tp:'Rajdhani', dh:5, dm:35, dur:10, rev:true },
  // Shatabdi Express
  { no:'12002', nm:'Bhopal Shatabdi', rt:'DEL_BPL', tp:'Shatabdi', dh:6, dm:15, dur:7 },
  { no:'12001', nm:'Delhi Shatabdi', rt:'DEL_BPL', tp:'Shatabdi', dh:14, dm:30, dur:7, rev:true },
  { no:'12004', nm:'Lucknow Shatabdi', rt:'DEL_LKO', tp:'Shatabdi', dh:6, dm:10, dur:6 },
  { no:'12003', nm:'Delhi Shatabdi', rt:'DEL_LKO', tp:'Shatabdi', dh:15, dm:15, dur:6, rev:true },
  { no:'12006', nm:'Jaipur Shatabdi', rt:'DEL_JP', tp:'Shatabdi', dh:6, dm:5, dur:5 },
  { no:'12005', nm:'Delhi Shatabdi', rt:'DEL_JP', tp:'Shatabdi', dh:17, dm:50, dur:5, rev:true },
  { no:'12008', nm:'Dehradun Shatabdi', rt:'DEL_DDN', tp:'Shatabdi', dh:6, dm:45, dur:4 },
  { no:'12007', nm:'Delhi Shatabdi', rt:'DEL_DDN', tp:'Shatabdi', dh:17, dm:30, dur:4, rev:true },
  { no:'12028', nm:'Amritsar Shatabdi', rt:'DEL_ASR', tp:'Shatabdi', dh:7, dm:20, dur:6 },
  { no:'12027', nm:'Delhi Shatabdi', rt:'DEL_ASR', tp:'Shatabdi', dh:16, dm:50, dur:6, rev:true },
  { no:'12030', nm:'MAS-SBC Shatabdi', rt:'MAS_SBC', tp:'Shatabdi', dh:6, dm:0, dur:5 },
  { no:'12029', nm:'SBC-MAS Shatabdi', rt:'MAS_SBC', tp:'Shatabdi', dh:14, dm:0, dur:5, rev:true },
  // Vande Bharat Express
  { no:'22436', nm:'Vande Bharat (BSB)', rt:'DEL_BSB', tp:'Vande Bharat', dh:6, dm:0, dur:8 },
  { no:'22435', nm:'Vande Bharat (DEL)', rt:'DEL_BSB', tp:'Vande Bharat', dh:15, dm:0, dur:8, rev:true },
  { no:'22439', nm:'Vande Bharat (SBC)', rt:'MAS_SBC', tp:'Vande Bharat', dh:5, dm:50, dur:5 },
  { no:'22440', nm:'Vande Bharat (MAS)', rt:'MAS_SBC', tp:'Vande Bharat', dh:14, dm:30, dur:5, rev:true },
  { no:'20501', nm:'Vande Bharat (ADI)', rt:'BOM_ADI', tp:'Vande Bharat', dh:6, dm:10, dur:6 },
  { no:'20502', nm:'Vande Bharat (BOM)', rt:'BOM_ADI', tp:'Vande Bharat', dh:15, dm:10, dur:6, rev:true },
  { no:'22447', nm:'Vande Bharat (JP)', rt:'DEL_JP', tp:'Vande Bharat', dh:6, dm:20, dur:4 },
  { no:'22448', nm:'Vande Bharat (DEL)', rt:'DEL_JP', tp:'Vande Bharat', dh:14, dm:30, dur:4, rev:true },
  { no:'22445', nm:'Vande Bharat (LKO)', rt:'DEL_LKO', tp:'Vande Bharat', dh:8, dm:0, dur:5 },
  { no:'22446', nm:'Vande Bharat (DEL)', rt:'DEL_LKO', tp:'Vande Bharat', dh:16, dm:15, dur:5, rev:true },
  // Duronto Express
  { no:'12245', nm:'Duronto (DEL)', rt:'DEL_HWH', tp:'Duronto', dh:20, dm:10, dur:14 },
  { no:'12246', nm:'Duronto (HWH)', rt:'DEL_HWH', tp:'Duronto', dh:19, dm:50, dur:14, rev:true },
  { no:'12213', nm:'Duronto (BOM)', rt:'DEL_BOM', tp:'Duronto', dh:23, dm:0, dur:14 },
  { no:'12214', nm:'Duronto (DEL)', rt:'DEL_BOM', tp:'Duronto', dh:23, dm:30, dur:14, rev:true },
  { no:'12259', nm:'Duronto (SBC)', rt:'SBC_SC', tp:'Duronto', dh:15, dm:5, dur:12 },
  // Superfast & Express
  { no:'12621', nm:'Tamil Nadu Exp', rt:'DEL_MAS', tp:'Superfast', dh:22, dm:30, dur:33 },
  { no:'12622', nm:'Tamil Nadu Exp', rt:'DEL_MAS', tp:'Superfast', dh:22, dm:0, dur:33, rev:true },
  { no:'12627', nm:'Karnataka Exp', rt:'DEL_SBC', tp:'Superfast', dh:21, dm:20, dur:33 },
  { no:'12628', nm:'Karnataka Exp', rt:'DEL_SBC', tp:'Superfast', dh:20, dm:10, dur:33, rev:true },
  { no:'12723', nm:'Telangana Exp', rt:'DEL_MAS', tp:'Superfast', dh:6, dm:50, dur:25 },
  { no:'12724', nm:'Telangana Exp', rt:'DEL_MAS', tp:'Superfast', dh:6, dm:25, dur:25, rev:true },
  { no:'12839', nm:'Chennai Mail', rt:'HWH_MAS', tp:'Express', dh:23, dm:0, dur:28 },
  { no:'12840', nm:'Chennai Mail', rt:'HWH_MAS', tp:'Express', dh:21, dm:30, dur:28, rev:true },
  { no:'12809', nm:'Mumbai Mail', rt:'BOM_HWH', tp:'Express', dh:21, dm:0, dur:30 },
  { no:'12810', nm:'Mumbai Mail', rt:'BOM_HWH', tp:'Express', dh:20, dm:0, dur:30, rev:true },
  { no:'12163', nm:'Dadar Express', rt:'BOM_MAS', tp:'Superfast', dh:8, dm:5, dur:22 },
  { no:'12164', nm:'Dadar Express', rt:'BOM_MAS', tp:'Superfast', dh:10, dm:0, dur:22, rev:true },
  { no:'10103', nm:'Mandovi Express', rt:'BOM_GOI', tp:'Express', dh:7, dm:10, dur:12 },
  { no:'10104', nm:'Mandovi Express', rt:'BOM_GOI', tp:'Express', dh:6, dm:0, dur:12, rev:true },
  { no:'12133', nm:'Mangalore Exp', rt:'BOM_MNG', tp:'Superfast', dh:22, dm:10, dur:16 },
  { no:'12345', nm:'Saraighat Exp', rt:'HWH_GHY', tp:'Superfast', dh:15, dm:50, dur:18 },
  { no:'12346', nm:'Saraighat Exp', rt:'HWH_GHY', tp:'Superfast', dh:15, dm:30, dur:18, rev:true },
  { no:'12785', nm:'Kacheguda Exp', rt:'SBC_SC', tp:'Express', dh:18, dm:15, dur:12 },
  { no:'12786', nm:'Kacheguda Exp', rt:'SBC_SC', tp:'Express', dh:19, dm:30, dur:12, rev:true },
  { no:'12604', nm:'Hyderabad Exp', rt:'SC_MAS', tp:'Superfast', dh:18, dm:0, dur:13 },
  { no:'12603', nm:'Hyderabad Exp', rt:'SC_MAS', tp:'Superfast', dh:18, dm:45, dur:13, rev:true },
  { no:'12801', nm:'Purushottam Exp', rt:'DEL_HWH', tp:'Superfast', dh:22, dm:35, dur:30 },
  { no:'12837', nm:'Puri Express', rt:'HWH_PURI', tp:'Express', dh:22, dm:15, dur:8 },
  { no:'12838', nm:'Puri Express', rt:'HWH_PURI', tp:'Express', dh:21, dm:0, dur:8, rev:true },
  { no:'12695', nm:'Trivandrum Exp', rt:'MAS_TVC', tp:'Superfast', dh:19, dm:15, dur:16 },
  { no:'12696', nm:'Trivandrum Exp', rt:'MAS_TVC', tp:'Superfast', dh:14, dm:50, dur:16, rev:true },
  { no:'12127', nm:'Intercity Exp', rt:'BOM_PUNE', tp:'Express', dh:6, dm:40, dur:3 },
  { no:'12128', nm:'Intercity Exp', rt:'BOM_PUNE', tp:'Express', dh:17, dm:5, dur:3, rev:true },
  { no:'12125', nm:'Pragati Express', rt:'BOM_PUNE', tp:'Superfast', dh:7, dm:40, dur:3 },
  { no:'12126', nm:'Pragati Express', rt:'BOM_PUNE', tp:'Superfast', dh:17, dm:15, dur:3, rev:true },
  { no:'12049', nm:'Gatimaan Express', rt:'DEL_BPL', tp:'Superfast', dh:8, dm:10, dur:4 },
  { no:'12050', nm:'Gatimaan Express', rt:'DEL_BPL', tp:'Superfast', dh:17, dm:30, dur:4, rev:true },
  { no:'12715', nm:'Sachkhand Exp', rt:'BOM_NGP', tp:'Express', dh:21, dm:35, dur:14 },
  { no:'14235', nm:'BSB Express', rt:'LKO_BSB', tp:'Express', dh:22, dm:0, dur:7 },
  { no:'14236', nm:'BSB Express', rt:'LKO_BSB', tp:'Express', dh:23, dm:30, dur:7, rev:true },
  { no:'12460', nm:'ASR-DEL Exp', rt:'DEL_ASR', tp:'Express', dh:20, dm:45, dur:9, rev:true },
  // Extra trains for map density
  { no:'22501', nm:'Delhi Special', rt:'DEL_BOM', tp:'Express', dh:4, dm:0, dur:20 },
  { no:'22502', nm:'Mumbai Special', rt:'DEL_BOM', tp:'Express', dh:8, dm:0, dur:20, rev:true },
  { no:'22503', nm:'Kolkata Special', rt:'DEL_HWH', tp:'Express', dh:8, dm:30, dur:22 },
  { no:'22504', nm:'Delhi Special', rt:'DEL_HWH', tp:'Express', dh:10, dm:0, dur:22, rev:true },
  { no:'22505', nm:'Varanasi Spl', rt:'DEL_BSB', tp:'Express', dh:12, dm:0, dur:10 },
  { no:'22506', nm:'Chennai Spl', rt:'DEL_MAS', tp:'Express', dh:1, dm:0, dur:34 },
  { no:'22507', nm:'Bengaluru Spl', rt:'DEL_SBC', tp:'Express', dh:3, dm:30, dur:36 },
  { no:'22508', nm:'Ahmedabad Spl', rt:'BOM_ADI', tp:'Express', dh:23, dm:0, dur:8 },
  { no:'22509', nm:'Lucknow Night', rt:'DEL_LKO', tp:'Express', dh:23, dm:0, dur:8 },
  { no:'22510', nm:'Jaipur Night', rt:'DEL_JP', tp:'Express', dh:22, dm:45, dur:6 },
  { no:'22511', nm:'JP-ADI Express', rt:'ADI_JP', tp:'Express', dh:19, dm:0, dur:12 },
  { no:'22512', nm:'ADI-JP Express', rt:'ADI_JP', tp:'Express', dh:7, dm:0, dur:12, rev:true },
  // New TRAIN_DATA entries with MAP_TRAINS definitions
  { no:'22811', nm:'Bhubaneswar Rajdhani', rt:'DEL_HWH', tp:'Rajdhani', dh:20, dm:0, dur:24 },
  { no:'12235', nm:'Dibrugarh Rajdhani', rt:'DEL_GHY', tp:'Rajdhani', dh:9, dm:55, dur:38 },
  { no:'12010', nm:'Chandigarh Shatabdi', rt:'DEL_CHG', tp:'Shatabdi', dh:7, dm:40, dur:3 },
  { no:'22461', nm:'Vande Bharat (Goa)', rt:'BOM_GOI', tp:'Vande Bharat', dh:6, dm:0, dur:7 },
  { no:'22463', nm:'Vande Bharat (BLR)', rt:'SBC_SC', tp:'Vande Bharat', dh:5, dm:30, dur:7, rev:true },
  { no:'12273', nm:'Howrah Duronto', rt:'DEL_HWH', tp:'Duronto', dh:12, dm:55, dur:16 },
  { no:'12431', nm:'Trivandrum Rajdhani', rt:'DEL_TVC', tp:'Rajdhani', dh:10, dm:55, dur:46 },
  { no:'12909', nm:'Garib Rath', rt:'DEL_BOM', tp:'Superfast', dh:12, dm:40, dur:18, rev:true },
  { no:'12201', nm:'Garib Rath (TVC)', rt:'BOM_TVC', tp:'Superfast', dh:11, dm:0, dur:24 },
  { no:'22451', nm:'Chandigarh Humsafar', rt:'DEL_CHG', tp:'Superfast', dh:23, dm:0, dur:6 },
  { no:'22453', nm:'Lucknow Humsafar', rt:'DEL_LKO', tp:'Superfast', dh:23, dm:55, dur:7 },
  { no:'22120', nm:'Tejas (Goa)', rt:'BOM_GOI', tp:'Superfast', dh:5, dm:40, dur:9 },
  { no:'22150', nm:'Tejas (DEL)', rt:'DEL_LKO', tp:'Superfast', dh:6, dm:10, dur:6, rev:true },
  { no:'12051', nm:'Jan Shatabdi (DEL)', rt:'DEL_CHG', tp:'Shatabdi', dh:5, dm:25, dur:3, rev:true },
  { no:'12055', nm:'Jan Shatabdi (DEL)', rt:'DEL_DDN', tp:'Shatabdi', dh:5, dm:30, dur:6, rev:true },
  { no:'12859', nm:'Gitanjali Express', rt:'BOM_HWH', tp:'Superfast', dh:6, dm:0, dur:26 },
  { no:'12625', nm:'Kerala Express', rt:'DEL_TVC', tp:'Superfast', dh:11, dm:25, dur:44 },
  { no:'12137', nm:'Punjab Mail', rt:'BOM_FZR', tp:'Express', dh:19, dm:40, dur:25 },
  { no:'12311', nm:'Kalka Mail', rt:'HWH_KLK', tp:'Express', dh:19, dm:40, dur:23 },
  { no:'12381', nm:'Poorva Express', rt:'DEL_HWH', tp:'Superfast', dh:20, dm:5, dur:24, rev:true },
  { no:'12303', nm:'Poorva Express (Gaya)', rt:'DEL_HWH', tp:'Superfast', dh:8, dm:10, dur:25, rev:true },
  { no:'12505', nm:'North East Express', rt:'DEL_GHY', tp:'Superfast', dh:17, dm:15, dur:37, rev:true },
  { no:'12559', nm:'Shiv Ganga Express', rt:'DEL_BSB', tp:'Superfast', dh:19, dm:15, dur:10 },
  { no:'12561', nm:'Swatantrata S Express', rt:'DEL_BSB', tp:'Superfast', dh:14, dm:35, dur:14 },
  { no:'12397', nm:'Mahabodhi Express', rt:'DEL_GAYA', tp:'Superfast', dh:14, dm:15, dur:14 },
  { no:'15635', nm:'Guwahati Express', rt:'HWH_GHY', tp:'Express', dh:5, dm:15, dur:24 },
  { no:'12487', nm:'Seemanchal Express', rt:'DEL_DBG', tp:'Express', dh:20, dm:5, dur:26 },
  { no:'12423', nm:'Dibrugarh Rajdhani', rt:'DEL_GHY', tp:'Rajdhani', dh:9, dm:55, dur:38 },
  { no:'12269', nm:'Duronto (DEL)', rt:'DEL_MAS', tp:'Duronto', dh:20, dm:0, dur:26, rev:true },
  { no:'12175', nm:'Chambal Express', rt:'BOM_GWL', tp:'Superfast', dh:23, dm:55, dur:23 },
  { no:'12919', nm:'Gujarat SK', rt:'ADI_DEL', tp:'Superfast', dh:22, dm:5, dur:14 },
  { no:'12565', nm:'Bihar SK', rt:'DEL_DBG', tp:'Superfast', dh:14, dm:30, dur:17 },
  { no:'12649', nm:'Sampark Kranti', rt:'SC_MAS', tp:'Superfast', dh:4, dm:30, dur:27 },
  { no:'12519', nm:'Sampark Kranti (BOM)', rt:'LKO_BOM', tp:'Superfast', dh:15, dm:30, dur:20 },
  // Phase 9 — additional unique trains
  { no:'12953', nm:'August Kranti Rajdhani', rt:'DEL_BOM', tp:'Rajdhani', dh:17, dm:40, dur:17, rev:true },
  { no:'20901', nm:'Vande Bharat (SLR)', rt:'BOM_SLR', tp:'Vande Bharat', dh:6, dm:0, dur:7 },
  { no:'20905', nm:'Vande Bharat (BOM)', rt:'BOM_ADI', tp:'Vande Bharat', dh:6, dm:25, dur:6, rev:true },
  { no:'20171', nm:'Vande Bharat (TPT)', rt:'SC_TPT', tp:'Vande Bharat', dh:5, dm:35, dur:7 },
  { no:'20607', nm:'Vande Bharat (CBE)', rt:'MAS_CBE', tp:'Vande Bharat', dh:6, dm:10, dur:7 },
  { no:'12247', nm:'HN Duronto', rt:'BOM_NGP', tp:'Duronto', dh:14, dm:25, dur:14, rev:true },
  { no:'12267', nm:'ADI Duronto', rt:'BOM_ADI', tp:'Duronto', dh:23, dm:15, dur:8, rev:true },
  { no:'12903', nm:'Golden Temple Mail', rt:'BOM_ASR', tp:'Superfast', dh:21, dm:30, dur:31 },
  { no:'12261', nm:'Howrah Duronto', rt:'BOM_HWH', tp:'Duronto', dh:20, dm:0, dur:24, rev:true },
  { no:'12009', nm:'Ahmedabad Shatabdi', rt:'BOM_ADI', tp:'Shatabdi', dh:6, dm:25, dur:7 },
  { no:'12155', nm:'Bhopal Express', rt:'DEL_BPL', tp:'Superfast', dh:20, dm:15, dur:10 },
  { no:'12441', nm:'Bilaspur Rajdhani', rt:'DEL_BIL', tp:'Rajdhani', dh:15, dm:30, dur:20 },
  { no:'12615', nm:'Grand Trunk Express', rt:'DEL_MAS', tp:'Superfast', dh:18, dm:55, dur:36 },
  { no:'12429', nm:'Lucknow Rajdhani', rt:'DEL_LKO', tp:'Rajdhani', dh:21, dm:40, dur:7 },
  { no:'12249', nm:'Anand Vihar Yuva', rt:'DEL_HWH', tp:'Superfast', dh:21, dm:45, dur:12, rev:true },
  { no:'12617', nm:'Mangala Lakshadweep', rt:'DEL_ERS', tp:'Superfast', dh:14, dm:30, dur:50 },
  { no:'22109', nm:'Lucknow Tejas', rt:'DEL_LKO', tp:'Superfast', dh:6, dm:10, dur:6 },
  { no:'16345', nm:'Thiruvananthapuram Exp', rt:'BOM_TVC', tp:'Express', dh:11, dm:40, dur:29 },
  { no:'12650', nm:'Sampark Kranti', rt:'SC_MAS', tp:'Superfast', dh:17, dm:25, dur:27, rev:true },
  { no:'13009', nm:'Doon Express', rt:'HWH_DDN', tp:'Express', dh:22, dm:5, dur:32 },
  { no:'14055', nm:'Brahmaputra Mail', rt:'DEL_GHY', tp:'Express', dh:21, dm:20, dur:52 },
  { no:'15017', nm:'Gorakhpur Express', rt:'LKO_GKP', tp:'Express', dh:23, dm:45, dur:7 },
  // ── Phase 10: Additional trains to reach 250+ ──
  // Return journeys that were missing
  { no:'12138', nm:'Punjab Mail', rt:'BOM_FZR', tp:'Express', dh:7, dm:30, dur:25, rev:true },
  { no:'12312', nm:'Kalka Mail', rt:'HWH_KLK', tp:'Express', dh:7, dm:15, dur:23, rev:true },
  { no:'14056', nm:'Brahmaputra Mail', rt:'DEL_GHY', tp:'Express', dh:15, dm:20, dur:52, rev:true },
  { no:'13010', nm:'Doon Express', rt:'HWH_DDN', tp:'Express', dh:20, dm:55, dur:32, rev:true },
  { no:'15018', nm:'Gorakhpur Express', rt:'LKO_GKP', tp:'Express', dh:7, dm:0, dur:7, rev:true },
  { no:'12904', nm:'Golden Temple Mail', rt:'BOM_ASR', tp:'Superfast', dh:18, dm:0, dur:31, rev:true },
  { no:'12176', nm:'Chambal Express', rt:'BOM_GWL', tp:'Superfast', dh:1, dm:30, dur:23, rev:true },
  { no:'12920', nm:'Gujarat SK', rt:'ADI_DEL', tp:'Superfast', dh:9, dm:0, dur:14, rev:true },
  { no:'12566', nm:'Bihar SK', rt:'DEL_DBG', tp:'Superfast', dh:5, dm:30, dur:17, rev:true },
  { no:'12520', nm:'Sampark Kranti (LKO)', rt:'LKO_BOM', tp:'Superfast', dh:8, dm:0, dur:20, rev:true },
  { no:'12616', nm:'Grand Trunk Express', rt:'DEL_MAS', tp:'Superfast', dh:19, dm:15, dur:36, rev:true },
  { no:'12442', nm:'Bilaspur Rajdhani', rt:'DEL_BIL', tp:'Rajdhani', dh:14, dm:30, dur:20, rev:true },
  { no:'12430', nm:'Lucknow Rajdhani', rt:'DEL_LKO', tp:'Rajdhani', dh:4, dm:0, dur:7, rev:true },
  { no:'12618', nm:'Mangala Lakshadweep', rt:'DEL_ERS', tp:'Superfast', dh:12, dm:0, dur:50, rev:true },
  { no:'12398', nm:'Mahabodhi Express', rt:'DEL_GAYA', tp:'Superfast', dh:18, dm:30, dur:14, rev:true },
  { no:'12562', nm:'Swatantrata S Express', rt:'DEL_BSB', tp:'Superfast', dh:22, dm:0, dur:14, rev:true },
  { no:'12560', nm:'Shiv Ganga Express', rt:'DEL_BSB', tp:'Superfast', dh:19, dm:40, dur:10, rev:true },
  { no:'12488', nm:'Seemanchal Express', rt:'DEL_DBG', tp:'Express', dh:13, dm:30, dur:26, rev:true },
  { no:'12802', nm:'Purushottam Express', rt:'DEL_HWH', tp:'Superfast', dh:19, dm:0, dur:30, rev:true },
  // New unique trains
  { no:'12285', nm:'Secunderabad Duronto', rt:'SC_SBC', tp:'Duronto', dh:20, dm:45, dur:11 },
  { no:'12286', nm:'Bengaluru Duronto', rt:'SC_SBC', tp:'Duronto', dh:22, dm:0, dur:11, rev:true },
  { no:'12841', nm:'Coromandel Express', rt:'HWH_MAS', tp:'Superfast', dh:14, dm:50, dur:27 },
  { no:'12842', nm:'Coromandel Express', rt:'HWH_MAS', tp:'Superfast', dh:8, dm:45, dur:27, rev:true },
  { no:'12659', nm:'Gurudev Express', rt:'HWH_MAS', tp:'Superfast', dh:0, dm:15, dur:29 },
  { no:'12660', nm:'Gurudev Express', rt:'HWH_MAS', tp:'Superfast', dh:22, dm:30, dur:29, rev:true },
  { no:'12871', nm:'Ispat Express', rt:'HWH_PURI', tp:'Express', dh:7, dm:30, dur:9 },
  { no:'12872', nm:'Ispat Express', rt:'HWH_PURI', tp:'Express', dh:19, dm:0, dur:9, rev:true },
  { no:'12381', nm:'Poorva Express', rt:'DEL_HWH', tp:'Superfast', dh:20, dm:5, dur:24, rev:true },
  { no:'22825', nm:'Chennai Rajdhani', rt:'DEL_MAS', tp:'Rajdhani', dh:6, dm:0, dur:28 },
  { no:'22826', nm:'Delhi Rajdhani', rt:'DEL_MAS', tp:'Rajdhani', dh:6, dm:30, dur:28, rev:true },
  { no:'12839', nm:'HWH-MAS Mail', rt:'HWH_MAS', tp:'Express', dh:23, dm:0, dur:28 },
  { no:'22688', nm:'Vizag Rajdhani', rt:'DEL_VZG', tp:'Rajdhani', dh:15, dm:20, dur:26 },
  { no:'22687', nm:'Delhi Rajdhani', rt:'DEL_VZG', tp:'Rajdhani', dh:16, dm:0, dur:26, rev:true },
  { no:'12863', nm:'Howrah Express', rt:'BOM_HWH', tp:'Superfast', dh:17, dm:0, dur:32 },
  { no:'12864', nm:'Mumbai Express', rt:'BOM_HWH', tp:'Superfast', dh:14, dm:0, dur:32, rev:true },
  { no:'12293', nm:'Allahabad Duronto', rt:'DEL_BSB', tp:'Duronto', dh:23, dm:30, dur:9 },
  { no:'12294', nm:'Delhi Duronto', rt:'DEL_BSB', tp:'Duronto', dh:21, dm:0, dur:9, rev:true },
  { no:'12779', nm:'Goa Express', rt:'BOM_GOI', tp:'Express', dh:23, dm:0, dur:11 },
  { no:'12780', nm:'Mumbai Express', rt:'BOM_GOI', tp:'Express', dh:17, dm:0, dur:11, rev:true },
  { no:'12431', nm:'TVC Rajdhani', rt:'DEL_TVC', tp:'Rajdhani', dh:10, dm:55, dur:46 },
  { no:'12432', nm:'Delhi Rajdhani', rt:'DEL_TVC', tp:'Rajdhani', dh:12, dm:0, dur:46, rev:true },
  { no:'22691', nm:'BLR Rajdhani', rt:'DEL_SBC', tp:'Rajdhani', dh:20, dm:50, dur:34 },
  { no:'22692', nm:'Delhi Rajdhani', rt:'DEL_SBC', tp:'Rajdhani', dh:19, dm:40, dur:34, rev:true },
  { no:'16587', nm:'BKN Express', rt:'DEL_JP', tp:'Express', dh:13, dm:0, dur:7 },
  { no:'16588', nm:'YPR Express', rt:'DEL_JP', tp:'Express', dh:23, dm:30, dur:7, rev:true },
  // More Vande Bharat services (realistic new VB routes)
  { no:'20173', nm:'Vande Bharat (TPT)', rt:'SC_TPT', tp:'Vande Bharat', dh:14, dm:0, dur:7, rev:true },
  { no:'20609', nm:'Vande Bharat (MAS)', rt:'MAS_CBE', tp:'Vande Bharat', dh:14, dm:30, dur:7, rev:true },
  { no:'20903', nm:'Vande Bharat (BOM)', rt:'BOM_SLR', tp:'Vande Bharat', dh:14, dm:30, dur:7, rev:true },
  { no:'22449', nm:'Vande Bharat (DEL)', rt:'DEL_JP', tp:'Vande Bharat', dh:14, dm:0, dur:4, rev:true },
  { no:'22441', nm:'Vande Bharat (SBC)', rt:'MAS_SBC', tp:'Vande Bharat', dh:12, dm:30, dur:5 },
  { no:'22442', nm:'Vande Bharat (CBE)', rt:'MAS_CBE', tp:'Vande Bharat', dh:12, dm:0, dur:7 },
  { no:'20503', nm:'Vande Bharat (BOM)', rt:'BOM_ADI', tp:'Vande Bharat', dh:14, dm:0, dur:6, rev:true },
  { no:'22437', nm:'Vande Bharat (DEL)', rt:'DEL_BSB', tp:'Vande Bharat', dh:14, dm:30, dur:8, rev:true },
  { no:'20175', nm:'Vande Bharat (SC)', rt:'SC_SBC', tp:'Vande Bharat', dh:6, dm:0, dur:7 },
  { no:'20176', nm:'Vande Bharat (BLR)', rt:'SC_SBC', tp:'Vande Bharat', dh:15, dm:0, dur:7, rev:true },
  // Overnight express & mail trains
  { no:'11019', nm:'Konark Express', rt:'BOM_HWH', tp:'Express', dh:1, dm:50, dur:36 },
  { no:'11020', nm:'Konark Express', rt:'BOM_HWH', tp:'Express', dh:15, dm:10, dur:36, rev:true },
  { no:'12321', nm:'Howrah-Mumbai Mail', rt:'BOM_HWH', tp:'Express', dh:2, dm:0, dur:28 },
  { no:'12322', nm:'Mumbai-Howrah Mail', rt:'BOM_HWH', tp:'Express', dh:21, dm:30, dur:28, rev:true },
  { no:'12501', nm:'Sampark Kranti', rt:'DEL_GHY', tp:'Superfast', dh:4, dm:15, dur:34 },
  { no:'12502', nm:'Sampark Kranti', rt:'DEL_GHY', tp:'Superfast', dh:12, dm:0, dur:34, rev:true },
  { no:'12703', nm:'Falaknuma Express', rt:'SC_MAS', tp:'Superfast', dh:15, dm:30, dur:14 },
  { no:'12704', nm:'Falaknuma Express', rt:'SC_MAS', tp:'Superfast', dh:22, dm:0, dur:14, rev:true },
  { no:'12777', nm:'Visakha Express', rt:'MAS_VZG', tp:'Superfast', dh:20, dm:0, dur:14 },
  { no:'12778', nm:'Visakha Express', rt:'MAS_VZG', tp:'Superfast', dh:19, dm:45, dur:14, rev:true },
  { no:'12835', nm:'Hatia Express', rt:'HWH_MAS', tp:'Express', dh:3, dm:20, dur:26 },
  { no:'12836', nm:'Hatia Express', rt:'HWH_MAS', tp:'Express', dh:11, dm:0, dur:26, rev:true },
  // Short-haul commuter/intercity
  { no:'12007', nm:'Delhi Shatabdi', rt:'DEL_DDN', tp:'Shatabdi', dh:17, dm:30, dur:4 },
  { no:'12031', nm:'MAS-SBC Shatabdi', rt:'MAS_SBC', tp:'Shatabdi', dh:17, dm:0, dur:5 },
  { no:'12032', nm:'SBC-MAS Shatabdi', rt:'MAS_SBC', tp:'Shatabdi', dh:7, dm:0, dur:5, rev:true },
  { no:'12129', nm:'Pune Intercity', rt:'BOM_PUNE', tp:'Express', dh:9, dm:0, dur:3 },
  { no:'12130', nm:'Mumbai Intercity', rt:'BOM_PUNE', tp:'Express', dh:13, dm:30, dur:3, rev:true },
  { no:'12131', nm:'Pune Express', rt:'BOM_PUNE', tp:'Express', dh:15, dm:0, dur:4 },
  { no:'12132', nm:'Mumbai Express', rt:'BOM_PUNE', tp:'Express', dh:20, dm:0, dur:4, rev:true },
  { no:'14237', nm:'BSB Intercity', rt:'LKO_BSB', tp:'Express', dh:6, dm:0, dur:6 },
  { no:'14238', nm:'LKO Intercity', rt:'LKO_BSB', tp:'Express', dh:14, dm:0, dur:6, rev:true },
  // More overnight & long-distance
  { no:'12247', nm:'Nagpur Duronto', rt:'BOM_NGP', tp:'Duronto', dh:14, dm:25, dur:14, rev:true },
  { no:'12649', nm:'SK Express', rt:'SC_MAS', tp:'Superfast', dh:4, dm:30, dur:27 },
  { no:'12505', nm:'NE Express', rt:'DEL_GHY', tp:'Superfast', dh:17, dm:15, dur:37, rev:true },
  { no:'12425', nm:'Jammu Rajdhani', rt:'DEL_JAT', tp:'Rajdhani', dh:20, dm:20, dur:10 },
  { no:'12155', nm:'Bhopal Exp', rt:'DEL_BPL', tp:'Superfast', dh:20, dm:15, dur:10 },
  { no:'12156', nm:'Delhi Exp', rt:'DEL_BPL', tp:'Superfast', dh:8, dm:30, dur:10, rev:true },
  // Nagpur to Secunderabad corridor
  { no:'12271', nm:'Duronto (SC)', rt:'NGP_SC', tp:'Duronto', dh:21, dm:0, dur:12 },
  { no:'12272', nm:'Duronto (NGP)', rt:'NGP_SC', tp:'Duronto', dh:20, dm:30, dur:12, rev:true },
  { no:'12727', nm:'Godavari Express', rt:'SC_MAS', tp:'Superfast', dh:6, dm:0, dur:12 },
  { no:'12728', nm:'Godavari Express', rt:'SC_MAS', tp:'Superfast', dh:19, dm:30, dur:12, rev:true },
  // Visakhapatnam corridor
  { no:'12727', nm:'Vijaywada Express', rt:'VZG_SC', tp:'Superfast', dh:20, dm:30, dur:14 },
  { no:'12728', nm:'VZG Express', rt:'VZG_SC', tp:'Superfast', dh:18, dm:0, dur:14, rev:true },
  // BOM-SBC corridor
  { no:'12133', nm:'SBC Express', rt:'BOM_SBC', tp:'Superfast', dh:22, dm:0, dur:24 },
  { no:'12134', nm:'BOM Express', rt:'BOM_SBC', tp:'Superfast', dh:20, dm:30, dur:24, rev:true },
  { no:'16529', nm:'Udyan Express', rt:'BOM_SBC', tp:'Express', dh:8, dm:5, dur:24 },
  { no:'16530', nm:'Udyan Express', rt:'BOM_SBC', tp:'Express', dh:21, dm:10, dur:24, rev:true },
  // Additional Shatabdi / Jan Shatabdi
  { no:'12011', nm:'Chandigarh Shatabdi', rt:'DEL_CHG', tp:'Shatabdi', dh:17, dm:0, dur:3, rev:true },
  { no:'12009', nm:'ADI Shatabdi', rt:'BOM_ADI', tp:'Shatabdi', dh:6, dm:25, dur:7 },
  { no:'12010', nm:'BOM Shatabdi', rt:'BOM_ADI', tp:'Shatabdi', dh:14, dm:30, dur:7, rev:true },
  // Ranchi corridor
  { no:'12825', nm:'Jharkhand Exp', rt:'DEL_RNC', tp:'Superfast', dh:20, dm:15, dur:22 },
  { no:'12826', nm:'Jharkhand Exp', rt:'DEL_RNC', tp:'Superfast', dh:6, dm:0, dur:22, rev:true },
  // Madurai corridor
  { no:'12635', nm:'Vaigai Express', rt:'MAS_MDU', tp:'Superfast', dh:12, dm:0, dur:8 },
  { no:'12636', nm:'Vaigai Express', rt:'MAS_MDU', tp:'Superfast', dh:6, dm:0, dur:8, rev:true },
  // DEL-Indore
  { no:'12919', nm:'Malwa Express', rt:'DEL_IDR', tp:'Express', dh:18, dm:50, dur:14 },
  { no:'12920', nm:'Malwa Express', rt:'DEL_IDR', tp:'Express', dh:19, dm:30, dur:14, rev:true },
  // Patna corridor extras
  { no:'12393', nm:'Sampoorna Kranti', rt:'PNBE_DEL', tp:'Superfast', dh:18, dm:25, dur:14 },
  { no:'12394', nm:'Sampoorna Kranti', rt:'PNBE_DEL', tp:'Superfast', dh:20, dm:30, dur:14, rev:true },
  { no:'12309', nm:'Rajdhani Express', rt:'DEL_PNBE', tp:'Rajdhani', dh:15, dm:35, dur:13 },
  // Raipur corridor
  { no:'12853', nm:'Durg Express', rt:'BOM_RPR', tp:'Express', dh:18, dm:30, dur:18 },
  { no:'12854', nm:'Mumbai Express', rt:'BOM_RPR', tp:'Express', dh:15, dm:0, dur:18, rev:true },
  // Kharagpur-Chennai
  { no:'12663', nm:'Howrah Express', rt:'KGP_MAS', tp:'Superfast', dh:8, dm:30, dur:22 },
  { no:'12664', nm:'Chennai Express', rt:'KGP_MAS', tp:'Superfast', dh:21, dm:0, dur:22, rev:true },
  // High frequency slot trains (different departure times on same routes)
  { no:'22513', nm:'DEL-BOM Night', rt:'DEL_BOM', tp:'Express', dh:23, dm:30, dur:18 },
  { no:'22514', nm:'BOM-DEL Night', rt:'DEL_BOM', tp:'Express', dh:0, dm:30, dur:18, rev:true },
  { no:'22515', nm:'DEL-HWH Night', rt:'DEL_HWH', tp:'Express', dh:1, dm:0, dur:20 },
  { no:'22516', nm:'HWH-DEL Night', rt:'DEL_HWH', tp:'Express', dh:2, dm:30, dur:20, rev:true },
  { no:'22517', nm:'DEL-MAS Spl', rt:'DEL_MAS', tp:'Express', dh:10, dm:0, dur:32 },
  { no:'22518', nm:'MAS-DEL Spl', rt:'DEL_MAS', tp:'Express', dh:14, dm:0, dur:32, rev:true },
  { no:'22519', nm:'BOM-MAS Night', rt:'BOM_MAS', tp:'Express', dh:0, dm:0, dur:24 },
  { no:'22520', nm:'MAS-BOM Night', rt:'BOM_MAS', tp:'Express', dh:1, dm:30, dur:24, rev:true },
  { no:'22521', nm:'DEL-SBC Night', rt:'DEL_SBC', tp:'Express', dh:2, dm:15, dur:34 },
  { no:'22522', nm:'SBC-DEL Night', rt:'DEL_SBC', tp:'Express', dh:5, dm:0, dur:34, rev:true },
  { no:'22523', nm:'HWH-MAS Fast', rt:'HWH_MAS', tp:'Superfast', dh:5, dm:30, dur:24 },
  { no:'22524', nm:'MAS-HWH Fast', rt:'HWH_MAS', tp:'Superfast', dh:16, dm:0, dur:24, rev:true },
  { no:'22525', nm:'DEL-BSB AM', rt:'DEL_BSB', tp:'Express', dh:4, dm:30, dur:10 },
  { no:'22526', nm:'BSB-DEL AM', rt:'DEL_BSB', tp:'Express', dh:5, dm:0, dur:10, rev:true },
  { no:'22527', nm:'ADI-BOM Evening', rt:'ADI_BOM', tp:'Express', dh:17, dm:0, dur:7 },
  { no:'22528', nm:'BOM-ADI Evening', rt:'ADI_BOM', tp:'Express', dh:18, dm:30, dur:7, rev:true },
  { no:'22529', nm:'DEL-LKO Afternoon', rt:'DEL_LKO', tp:'Express', dh:14, dm:0, dur:7 },
  { no:'22530', nm:'LKO-DEL Afternoon', rt:'DEL_LKO', tp:'Express', dh:15, dm:30, dur:7, rev:true },
  { no:'22531', nm:'DEL-JP Evening', rt:'DEL_JP', tp:'Express', dh:16, dm:0, dur:5 },
  { no:'22532', nm:'JP-DEL Evening', rt:'DEL_JP', tp:'Express', dh:8, dm:30, dur:5, rev:true },
  { no:'22533', nm:'BOM-GOI Night', rt:'BOM_GOI', tp:'Express', dh:21, dm:30, dur:11 },
  { no:'22534', nm:'GOI-BOM Night', rt:'BOM_GOI', tp:'Express', dh:0, dm:30, dur:11, rev:true },
  { no:'22535', nm:'DEL-ASR PM', rt:'DEL_ASR', tp:'Express', dh:15, dm:0, dur:8 },
  { no:'22536', nm:'ASR-DEL PM', rt:'DEL_ASR', tp:'Express', dh:10, dm:0, dur:8, rev:true },
  { no:'22537', nm:'DEL-DDN AM', rt:'DEL_DDN', tp:'Express', dh:3, dm:30, dur:5 },
  { no:'22538', nm:'DDN-DEL AM', rt:'DEL_DDN', tp:'Express', dh:12, dm:0, dur:5, rev:true },
  { no:'22539', nm:'HWH-GHY Night', rt:'HWH_GHY', tp:'Express', dh:20, dm:30, dur:16 },
  { no:'22540', nm:'GHY-HWH Night', rt:'HWH_GHY', tp:'Express', dh:3, dm:0, dur:16, rev:true },
  { no:'22541', nm:'SC-MAS Express', rt:'SC_MAS', tp:'Express', dh:8, dm:0, dur:14 },
  { no:'22542', nm:'MAS-SC Express', rt:'SC_MAS', tp:'Express', dh:5, dm:30, dur:14, rev:true },
  { no:'22543', nm:'BOM-NGP Express', rt:'BOM_NGP', tp:'Express', dh:10, dm:0, dur:13 },
  { no:'22544', nm:'NGP-BOM Express', rt:'BOM_NGP', tp:'Express', dh:22, dm:30, dur:13, rev:true },
  { no:'22545', nm:'BOM-PUNE Local', rt:'BOM_PUNE', tp:'Local', dh:11, dm:0, dur:3 },
  { no:'22546', nm:'PUNE-BOM Local', rt:'BOM_PUNE', tp:'Local', dh:5, dm:30, dur:3, rev:true },
  { no:'22547', nm:'HWH-PURI Day', rt:'HWH_PURI', tp:'Express', dh:11, dm:0, dur:7 },
  { no:'22548', nm:'PURI-HWH Day', rt:'HWH_PURI', tp:'Express', dh:6, dm:0, dur:7, rev:true },
  { no:'22549', nm:'LKO-BSB Morning', rt:'LKO_BSB', tp:'Express', dh:9, dm:30, dur:6 },
  { no:'22550', nm:'BSB-LKO Morning', rt:'LKO_BSB', tp:'Express', dh:16, dm:0, dur:6, rev:true },
  { no:'22551', nm:'MAS-TVC Night', rt:'MAS_TVC', tp:'Express', dh:22, dm:0, dur:15 },
  { no:'22552', nm:'TVC-MAS Night', rt:'MAS_TVC', tp:'Express', dh:20, dm:0, dur:15, rev:true },
  { no:'22553', nm:'MAS-MDU Express', rt:'MAS_MDU', tp:'Express', dh:18, dm:0, dur:9 },
  { no:'22554', nm:'MDU-MAS Express', rt:'MAS_MDU', tp:'Express', dh:21, dm:30, dur:9, rev:true },
  { no:'22555', nm:'BPL-NGP Express', rt:'BPL_NGP', tp:'Express', dh:7, dm:0, dur:10 },
  { no:'22556', nm:'NGP-BPL Express', rt:'BPL_NGP', tp:'Express', dh:19, dm:45, dur:10, rev:true },
  { no:'22557', nm:'DEL-PNBE Night', rt:'DEL_PNBE', tp:'Express', dh:3, dm:0, dur:14 },
  { no:'22558', nm:'PNBE-DEL Night', rt:'DEL_PNBE', tp:'Express', dh:1, dm:30, dur:14, rev:true },
];

// Station name lookup from coordinates — expanded
const STATION_COORDS: Record<string, string> = {
  '28.64,77.22': 'New Delhi', '19.08,72.88': 'Mumbai CSMT', '22.57,88.36': 'Howrah Jn',
  '13.08,80.27': 'Chennai Central', '12.98,77.57': 'Bengaluru City', '17.38,78.49': 'Secunderabad',
  '23.02,72.57': 'Ahmedabad Jn', '25.32,83.01': 'Varanasi Jn', '26.85,80.95': 'Lucknow NR',
  '26.92,75.79': 'Jaipur Jn', '23.26,77.41': 'Bhopal Jn', '21.15,79.09': 'Nagpur Jn',
  '25.61,85.14': 'Patna Jn', '15.28,73.97': 'Madgaon (Goa)', '31.63,74.87': 'Amritsar Jn',
  '30.32,78.03': 'Dehradun', '26.19,91.75': 'Guwahati', '19.81,85.83': 'Puri',
  '32.73,74.87': 'Jammu Tawi', '8.52,76.94': 'Trivandrum Central', '18.53,73.85': 'Pune Jn',
  '17.43,78.50': 'Kacheguda', '25.45,78.57': 'Jhansi Jn', '20.30,85.82': 'Bhubaneswar',
  // New expanded stations
  '27.18,78.02': 'Agra Cantt', '27.49,77.67': 'Mathura Jn',
  '26.45,80.35': 'Kanpur Central', '27.18,80.13': 'Aligarh Jn',
  '25.43,81.85': 'Prayagraj Jn', '25.28,83.12': 'Mughal Sarai Jn',
  '24.47,84.70': 'Gaya Jn', '23.79,86.43': 'Dhanbad Jn',
  '21.17,72.83': 'Surat', '22.30,73.19': 'Vadodara Jn',
  '25.18,75.86': 'Kota Jn', '21.24,81.63': 'Raipur Jn',
  '22.08,82.15': 'Bilaspur Jn', '21.85,84.01': 'Jharsuguda Jn',
  '16.51,80.65': 'Vijayawada Jn', '15.83,79.50': 'Ongole',
  '13.65,79.51': 'Renigunta Jn', '12.97,79.15': 'Katpadi Jn',
  '29.97,76.85': 'Karnal', '30.38,76.78': 'Ambala Cantt',
  '30.90,75.86': 'Ludhiana Jn', '31.33,75.58': 'Jalandhar City',
  '29.47,77.71': 'Muzaffarnagar', '29.87,77.89': 'Roorkee',
  '29.95,78.16': 'Haridwar Jn',
  '14.47,78.82': 'Anantapur',
  '15.17,77.37': 'Guntakal Jn', '15.83,78.04': 'Kurnool',
  '18.99,73.12': 'Panvel', '17.68,73.30': 'Ratnagiri',
  '16.99,73.30': 'Kudal', '20.93,77.75': 'Amravati',
  '26.45,82.20': 'Sultanpur', '24.58,73.71': 'Udaipur',
  '25.78,73.32': 'Pali', '24.99,88.14': 'Malda Town',
  '26.71,88.43': 'New Jalpaiguri', '11.66,78.15': 'Salem Jn',
  '10.79,78.69': 'Trichy Jn', '9.92,78.12': 'Madurai Jn',
  '8.73,77.70': 'Tirunelveli Jn', '21.47,87.00': 'Kharagpur Jn',
  '17.69,83.22': 'Visakhapatnam', '19.99,73.79': 'Nashik Road',
  '20.92,75.33': 'Jalgaon Jn', '21.05,75.78': 'Bhusaval Jn',
  '14.68,80.15': 'Nellore', '28.20,76.62': 'Rewari Jn',
  '27.63,76.09': 'Alwar', '23.72,72.15': 'Mehsana Jn',
  '18.85,73.28': 'Lonavala',
  '27.88,78.08': 'Tundla Jn', '27.18,79.41': 'Etawah',
  '30.73,76.78': 'Chandigarh', '30.84,76.79': 'Kalka',
  '26.23,78.18': 'Gwalior Jn', '30.93,74.62': 'Firozpur',
  '26.12,86.72': 'Darbhanga', '18.00,79.59': 'Warangal',
  '22.35,87.33': 'Midnapore',
  '14.47,74.58': 'Karwar', '12.87,74.88': 'Mangalore Jn',
  '11.02,77.04': 'Coimbatore Jn', '10.00,76.28': 'Ernakulam Jn',
  '26.76,83.37': 'Gorakhpur Jn',
  '22.72,75.80': 'Indore Jn', '23.31,85.32': 'Ranchi Jn',
  '17.68,75.91': 'Solapur Jn',
};

function getStationName(wp: [number, number]): string {
  return STATION_COORDS[`${wp[0]},${wp[1]}`] || 'En Route';
}

export function getActiveTrainsOnMap(): TrainOnMap[] {
  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes();
  const results: TrainOnMap[] = [];

  for (const t of MAP_TRAINS) {
    const routeWps = ROUTES[t.rt];
    if (!routeWps) continue;

    const waypoints = t.rev ? [...routeWps].reverse() : routeWps;
    const depMin = t.dh * 60 + t.dm;
    const durMin = t.dur * 60;
    const arrMin = depMin + durMin;

    // Check if train is currently running
    let elapsed: number;
    if (arrMin > 24 * 60) {
      const arrNorm = arrMin % (24 * 60);
      if (currentMin >= depMin) {
        elapsed = currentMin - depMin;
      } else if (currentMin <= arrNorm) {
        elapsed = (24 * 60 - depMin) + currentMin;
      } else {
        continue;
      }
    } else {
      if (currentMin < depMin || currentMin > arrMin) continue;
      elapsed = currentMin - depMin;
    }

    const progress = Math.min(1, Math.max(0, elapsed / durMin));
    const totalSeg = waypoints.length - 1;
    const segPos = progress * totalSeg;
    const segIdx = Math.min(Math.floor(segPos), totalSeg - 1);
    const segFrac = segPos - segIdx;

    const wp1 = waypoints[segIdx];
    const wp2 = waypoints[Math.min(segIdx + 1, waypoints.length - 1)];
    const lat = wp1[0] + (wp2[0] - wp1[0]) * segFrac;
    const lng = wp1[1] + (wp2[1] - wp1[1]) * segFrac;

    const dlat = wp2[0] - wp1[0];
    const dlng = wp2[1] - wp1[1];
    const heading = (Math.atan2(dlng, dlat) * 180 / Math.PI + 360) % 360;

    results.push({
      trainNo: t.no,
      trainName: t.nm,
      type: t.tp,
      lat, lng, heading, progress,
      route: waypoints,
      from: getStationName(waypoints[0]),
      to: getStationName(waypoints[waypoints.length - 1]),
    });
  }

  return results;
}

export function getTotalTrainCount(): number {
  return MAP_TRAINS.length;
}

// ─── Train Route Detail (station-by-station) ───

export interface RouteStop {
  station: string;
  lat: number;
  lng: number;
  arrivalTime: string;
  departureTime: string;
  isOrigin: boolean;
  isDestination: boolean;
  distancePercent: number;
  distanceKm: number;
  haltMinutes: number;
  platform: number;
  dayNumber: number;
  delayMinutes: number;
}

// Route corridor station data: [name, km from origin, major junction flag]
type RS = [string, number, boolean?];

const ROUTE_STATIONS: Record<string, RS[]> = {
  DEL_BOM: [
    ['New Delhi', 0, true], ['Mathura Jn', 141], ['Sawai Madhopur', 330],
    ['Kota Jn', 460, true], ['Ratlam Jn', 615], ['Vadodara Jn', 843, true],
    ['Surat', 978, true], ['Borivali', 1355], ['Mumbai Central', 1384, true],
  ],
  DEL_HWH: [
    ['New Delhi', 0, true], ['Aligarh Jn', 126], ['Tundla Jn', 205],
    ['Kanpur Central', 440, true], ['Prayagraj Jn', 634, true],
    ['Mughal Sarai Jn', 764, true], ['Gaya Jn', 976], ['Dhanbad Jn', 1139, true],
    ['Asansol Jn', 1181], ['Durgapur', 1220], ['Howrah Jn', 1447, true],
  ],
  DEL_MAS: [
    ['New Delhi', 0, true], ['Agra Cantt', 195, true], ['Jhansi Jn', 403, true],
    ['Bhopal Jn', 703, true], ['Nagpur Jn', 1094, true], ['Warangal', 1268],
    ['Secunderabad', 1440, true], ['Vijayawada Jn', 1662, true],
    ['Nellore', 1900], ['Renigunta Jn', 2005], ['Chennai Central', 2182, true],
  ],
  DEL_SBC: [
    ['New Delhi', 0, true], ['Agra Cantt', 195], ['Jhansi Jn', 403, true],
    ['Bhopal Jn', 703, true], ['Nagpur Jn', 1094, true], ['Secunderabad', 1440, true],
    ['Kurnool', 1650], ['Guntakal Jn', 1776, true], ['Anantapur', 1855],
    ['Dharmavaram', 1922], ['Bengaluru City', 2444, true],
  ],
  DEL_BSB: [
    ['New Delhi', 0, true], ['Aligarh Jn', 126], ['Tundla Jn', 205],
    ['Kanpur Central', 440, true], ['Lucknow NR', 512, true],
    ['Sultanpur', 630], ['Jaunpur Jn', 680], ['Varanasi Jn', 764, true],
  ],
  BOM_HWH: [
    ['Mumbai CSMT', 0, true], ['Kalyan Jn', 54], ['Nashik Road', 183],
    ['Manmad Jn', 267], ['Bhusaval Jn', 424, true], ['Akola Jn', 562],
    ['Badnera Jn', 648], ['Nagpur Jn', 820, true], ['Gondia Jn', 920],
    ['Bilaspur Jn', 1087, true], ['Jharsuguda Jn', 1282],
    ['Rourkela Jn', 1360], ['Kharagpur Jn', 1619, true], ['Howrah Jn', 1968, true],
  ],
  BOM_MAS: [
    ['Mumbai CSMT', 0, true], ['Dadar', 8], ['Pune Jn', 192, true],
    ['Solapur Jn', 454, true], ['Guntakal Jn', 690, true], ['Anantapur', 778],
    ['Renigunta Jn', 1028, true], ['Chennai Central', 1165, true],
  ],
  MAS_SBC: [
    ['Chennai Central', 0, true], ['Arakkonam Jn', 70], ['Katpadi Jn', 128, true],
    ['Jolarpettai', 174], ['Bangarpet', 230],
    ['Krishnarajapuram', 337], ['Bengaluru City', 360, true],
  ],
  BOM_ADI: [
    ['Mumbai Central', 0, true], ['Borivali', 30], ['Vapi', 161],
    ['Surat', 263, true], ['Bharuch Jn', 327], ['Vadodara Jn', 392, true],
    ['Anand Jn', 430], ['Ahmedabad Jn', 493, true],
  ],
  DEL_JP: [
    ['New Delhi', 0, true], ['Gurgaon', 32], ['Rewari Jn', 84, true],
    ['Alwar', 166], ['Bandikui Jn', 222], ['Jaipur Jn', 303, true],
  ],
  HWH_MAS: [
    ['Howrah Jn', 0, true], ['Kharagpur Jn', 118, true], ['Balasore', 235],
    ['Bhubaneswar', 462, true], ['Brahmapur', 625], ['Visakhapatnam', 745, true],
    ['Rajahmundry', 903], ['Eluru', 973], ['Vijayawada Jn', 1037, true],
    ['Nellore', 1337], ['Gudur Jn', 1373], ['Chennai Central', 1663, true],
  ],
  DEL_LKO: [
    ['New Delhi', 0, true], ['Ghaziabad', 35], ['Aligarh Jn', 126],
    ['Tundla Jn', 205], ['Kanpur Central', 440, true], ['Lucknow NR', 512, true],
  ],
  BOM_GOI: [
    ['Mumbai CSMT', 0, true], ['Dadar', 8], ['Panvel', 42],
    ['Roha', 110], ['Chiplun', 217], ['Ratnagiri', 341, true],
    ['Kudal', 486], ['Thivim', 545], ['Karmali', 568],
    ['Madgaon (Goa)', 581, true],
  ],
  DEL_ASR: [
    ['New Delhi', 0, true], ['Panipat', 90], ['Karnal', 132],
    ['Ambala Cantt', 195, true], ['Ludhiana Jn', 313, true],
    ['Jalandhar City', 365, true], ['Beas', 408], ['Amritsar Jn', 449, true],
  ],
  DEL_DDN: [
    ['New Delhi', 0, true], ['Meerut City', 68], ['Muzaffarnagar', 116],
    ['Roorkee', 161, true], ['Haridwar Jn', 203, true], ['Dehradun', 253, true],
  ],
  HWH_GHY: [
    ['Howrah Jn', 0, true], ['Malda Town', 331, true], ['New Jalpaiguri', 547, true],
    ['New Cooch Behar', 610], ['Bongaigaon', 750], ['Guwahati', 996, true],
  ],
  SBC_SC: [
    ['Bengaluru City', 0, true], ['Anantapur', 192], ['Guntakal Jn', 290, true],
    ['Kurnool', 388], ['Mahbubnagar', 470], ['Secunderabad', 570, true],
  ],
  BOM_NGP: [
    ['Mumbai CSMT', 0, true], ['Kalyan Jn', 54], ['Nashik Road', 183],
    ['Manmad Jn', 267, true], ['Jalgaon Jn', 371], ['Bhusaval Jn', 400, true],
    ['Akola Jn', 562], ['Badnera Jn', 648, true], ['Wardha Jn', 730],
    ['Nagpur Jn', 820, true],
  ],
  DEL_PNBE: [
    ['New Delhi', 0, true], ['Kanpur Central', 440, true],
    ['Prayagraj Jn', 634, true], ['Mughal Sarai Jn', 764, true],
    ['Buxar', 816], ['Ara Jn', 903], ['Patna Jn', 991, true],
  ],
  HWH_PURI: [
    ['Howrah Jn', 0, true], ['Kharagpur Jn', 118, true], ['Balasore', 235],
    ['Cuttack', 425], ['Bhubaneswar', 462, true], ['Puri', 499, true],
  ],
  DEL_JAT: [
    ['New Delhi', 0, true], ['Ambala Cantt', 195, true], ['Ludhiana Jn', 313, true],
    ['Jalandhar City', 365, true], ['Pathankot Cantt', 437, true],
    ['Jammu Tawi', 577, true],
  ],
  MAS_TVC: [
    ['Chennai Central', 0, true], ['Villupuram Jn', 160], ['Salem Jn', 339, true],
    ['Erode Jn', 395], ['Coimbatore Jn', 499, true], ['Palakkad Jn', 550],
    ['Thrissur', 600], ['Ernakulam Jn', 700, true],
    ['Kottayam', 788], ['Trivandrum Central', 920, true],
  ],
  DEL_BPL: [
    ['New Delhi', 0, true], ['Agra Cantt', 195, true], ['Gwalior', 310],
    ['Jhansi Jn', 403, true], ['Lalitpur', 477], ['Bina Jn', 536],
    ['Vidisha', 600], ['Bhopal Jn', 703, true],
  ],
  SC_MAS: [
    ['Secunderabad', 0, true], ['Nalgonda', 115], ['Khammam', 200],
    ['Vijayawada Jn', 281, true], ['Ongole', 470], ['Nellore', 537, true],
    ['Gudur Jn', 573], ['Chennai Central', 620, true],
  ],
  LKO_BSB: [
    ['Lucknow NR', 0, true], ['Sultanpur', 144, true], ['Jaunpur Jn', 224],
    ['Varanasi Jn', 306, true],
  ],
  BOM_PUNE: [
    ['Mumbai CSMT', 0, true], ['Dadar', 8], ['Thane', 32],
    ['Kalyan Jn', 54, true], ['Karjat Jn', 100], ['Lonavala', 120, true],
    ['Talegaon', 143], ['Pune Jn', 192, true],
  ],
  ADI_JP: [
    ['Ahmedabad Jn', 0, true], ['Mehsana Jn', 74], ['Palanpur Jn', 136],
    ['Abu Road', 190], ['Falna', 260], ['Pali', 315],
    ['Ajmer Jn', 415, true], ['Jaipur Jn', 491, true],
  ],
  BOM_FZR: [
    ['Mumbai CSMT', 0, true], ['Borivali', 30], ['Surat', 263, true],
    ['Vadodara Jn', 393, true], ['Ratlam Jn', 559], ['Nagda Jn', 606],
    ['Kota Jn', 762, true], ['Sawai Madhopur', 850], ['Jaipur Jn', 1014, true],
    ['Rewari Jn', 1236], ['New Delhi', 1384, true], ['Panipat', 1474],
    ['Ambala Cantt', 1602, true], ['Ludhiana Jn', 1720, true],
    ['Jalandhar City', 1800], ['Firozpur Cantt', 1930, true],
  ],
  HWH_KLK: [
    ['Howrah Jn', 0, true], ['Asansol Jn', 210, true], ['Dhanbad Jn', 260],
    ['Gaya Jn', 448], ['Mughal Sarai Jn', 622, true], ['Prayagraj Jn', 680],
    ['Kanpur Central', 850, true], ['Tundla Jn', 1072],
    ['Aligarh Jn', 1100], ['New Delhi', 1233, true], ['Panipat', 1323],
    ['Ambala Cantt', 1428, true], ['Chandigarh', 1500], ['Kalka', 1526, true],
  ],
  DEL_TVC: [
    ['New Delhi', 0, true], ['Agra Cantt', 195], ['Jhansi Jn', 403, true],
    ['Bhopal Jn', 703, true], ['Nagpur Jn', 1094, true],
    ['Secunderabad', 1440, true], ['Bengaluru City', 2006, true],
    ['Salem Jn', 2200], ['Erode Jn', 2260],
    ['Ernakulam Jn', 2539, true], ['Trivandrum Central', 3032, true],
  ],
  BOM_TVC: [
    ['Mumbai CSMT', 0, true], ['Pune Jn', 192], ['Solapur Jn', 454],
    ['Guntakal Jn', 690, true], ['Bengaluru City', 1003, true],
    ['Salem Jn', 1210], ['Erode Jn', 1280],
    ['Coimbatore Jn', 1380, true], ['Palakkad Jn', 1430],
    ['Ernakulam Jn', 1646, true], ['Trivandrum Central', 1862, true],
  ],
  DEL_GHY: [
    ['New Delhi', 0, true], ['Aligarh Jn', 126], ['Kanpur Central', 440, true],
    ['Prayagraj Jn', 634, true], ['Mughal Sarai Jn', 764],
    ['Patna Jn', 991, true], ['Barauni Jn', 1078],
    ['Katihar Jn', 1210, true], ['New Jalpaiguri', 1508, true],
    ['New Cooch Behar', 1571], ['Guwahati', 1957, true],
  ],
  BOM_GWL: [
    ['Mumbai CSMT', 0, true], ['Nashik Road', 183], ['Manmad Jn', 267],
    ['Bhusaval Jn', 424, true], ['Bhopal Jn', 703, true],
    ['Jhansi Jn', 880, true], ['Gwalior', 990, true],
  ],
  ADI_DEL: [
    ['Ahmedabad Jn', 0, true], ['Mehsana Jn', 74], ['Palanpur Jn', 136],
    ['Abu Road', 190, true], ['Ajmer Jn', 415, true],
    ['Jaipur Jn', 491, true], ['Rewari Jn', 628],
    ['New Delhi', 778, true],
  ],
  DEL_DBG: [
    ['New Delhi', 0, true], ['Kanpur Central', 440, true],
    ['Prayagraj Jn', 634], ['Mughal Sarai Jn', 764, true],
    ['Patna Jn', 991, true], ['Barauni Jn', 1078, true],
    ['Samastipur Jn', 1115], ['Darbhanga Jn', 1175, true],
  ],
  LKO_BOM: [
    ['Lucknow NR', 0, true], ['Kanpur Central', 75], ['Jhansi Jn', 446, true],
    ['Bhopal Jn', 636, true], ['Itarsi Jn', 726],
    ['Bhusaval Jn', 960, true], ['Nashik Road', 1120],
    ['Kalyan Jn', 1300], ['Mumbai CSMT', 1350, true],
  ],
  BOM_ASR: [
    ['Mumbai CSMT', 0, true], ['Borivali', 30], ['Surat', 263, true],
    ['Vadodara Jn', 393, true], ['Ratlam Jn', 559],
    ['Kota Jn', 762, true], ['Sawai Madhopur', 850],
    ['Jaipur Jn', 1014, true], ['New Delhi', 1384, true],
    ['Ambala Cantt', 1602, true], ['Ludhiana Jn', 1720, true],
    ['Jalandhar City', 1800], ['Amritsar Jn', 1930, true],
  ],
  DEL_GAYA: [
    ['New Delhi', 0, true], ['Kanpur Central', 440, true],
    ['Prayagraj Jn', 634, true], ['Mughal Sarai Jn', 764, true],
    ['Sasaram', 855], ['Dehri on Sone', 880], ['Gaya Jn', 997, true],
  ],
  BOM_SLR: [
    ['Mumbai CSMT', 0, true], ['Pune Jn', 192, true], ['Solapur Jn', 454, true],
  ],
  BOM_MNG: [
    ['Mumbai CSMT', 0, true], ['Panvel', 42], ['Ratnagiri', 318, true],
    ['Madgaon (Goa)', 558, true], ['Karwar', 608],
    ['Udupi', 722], ['Mangalore Central', 806, true],
  ],
  SC_TPT: [
    ['Secunderabad', 0, true], ['Nalgonda', 115], ['Ongole', 310],
    ['Nellore', 370, true], ['Renigunta Jn', 450],
    ['Tirupati', 460, true],
  ],
  MAS_CBE: [
    ['Chennai Central', 0, true], ['Arakkonam Jn', 70], ['Katpadi Jn', 128],
    ['Salem Jn', 339, true], ['Erode Jn', 395, true],
    ['Tiruppur', 440], ['Coimbatore Jn', 499, true],
  ],
  DEL_BIL: [
    ['New Delhi', 0, true], ['Kanpur Central', 440, true],
    ['Prayagraj Jn', 634], ['Katni Jn', 958, true],
    ['Bilaspur Jn', 1167, true],
  ],
  DEL_ERS: [
    ['New Delhi', 0, true], ['Agra Cantt', 195], ['Jhansi Jn', 403, true],
    ['Bhopal Jn', 703, true], ['Nagpur Jn', 1094, true],
    ['Secunderabad', 1440, true], ['Bengaluru City', 2006, true],
    ['Erode Jn', 2260], ['Ernakulam Jn', 2539, true],
  ],
  HWH_DDN: [
    ['Howrah Jn', 0, true], ['Asansol Jn', 210], ['Dhanbad Jn', 260],
    ['Gaya Jn', 448, true], ['Mughal Sarai Jn', 622, true],
    ['Prayagraj Jn', 680], ['Lucknow NR', 822, true],
    ['Bareilly', 1020], ['Moradabad', 1118, true],
    ['Najibabad Jn', 1194], ['Haridwar Jn', 1279, true],
    ['Dehradun', 1326, true],
  ],
  LKO_GKP: [
    ['Lucknow NR', 0, true], ['Barabanki Jn', 26], ['Gonda Jn', 128, true],
    ['Basti', 203], ['Gorakhpur Jn', 273, true],
  ],
  DEL_CHG: [
    ['New Delhi', 0, true], ['Panipat', 90], ['Karnal', 132],
    ['Ambala Cantt', 195, true], ['Chandigarh', 243, true],
  ],
  NGP_SC: [
    ['Nagpur Jn', 0, true], ['Chandrapur', 160], ['Balharshah Jn', 230, true],
    ['Sirpur Kagaznagar', 320], ['Secunderabad', 470, true],
  ],
  BOM_VZG: [
    ['Mumbai CSMT', 0, true], ['Nashik Road', 183], ['Bhusaval Jn', 424, true],
    ['Nagpur Jn', 820, true], ['Bilaspur Jn', 1087],
    ['Jharsuguda Jn', 1282, true], ['Visakhapatnam', 1590, true],
  ],
  MAS_VZG: [
    ['Chennai Central', 0, true], ['Nellore', 175], ['Ongole', 340],
    ['Vijayawada Jn', 520, true], ['Rajahmundry', 672, true],
    ['Visakhapatnam', 812, true],
  ],
  DEL_VZG: [
    ['New Delhi', 0, true], ['Kanpur Central', 440, true],
    ['Prayagraj Jn', 634], ['Mughal Sarai Jn', 764, true],
    ['Gaya Jn', 976], ['Howrah Jn', 1447, true],
    ['Visakhapatnam', 2192, true],
  ],
  SC_SBC: [
    ['Secunderabad', 0, true], ['Kurnool', 210], ['Guntakal Jn', 310, true],
    ['Anantapur', 390], ['Bengaluru City', 570, true],
  ],
  MAS_MDU: [
    ['Chennai Central', 0, true], ['Villupuram Jn', 160],
    ['Trichy Jn', 338, true], ['Dindigul Jn', 410],
    ['Madurai Jn', 462, true],
  ],
  BOM_RPR: [
    ['Mumbai CSMT', 0, true], ['Nashik Road', 183], ['Bhusaval Jn', 424, true],
    ['Nagpur Jn', 820, true], ['Bilaspur Jn', 1087, true],
    ['Raipur Jn', 1180, true],
  ],
  DEL_IDR: [
    ['New Delhi', 0, true], ['Agra Cantt', 195], ['Jhansi Jn', 403, true],
    ['Bhopal Jn', 703, true], ['Dewas', 790], ['Indore Jn', 852, true],
  ],
  ADI_BOM: [
    ['Ahmedabad Jn', 0, true], ['Anand Jn', 63], ['Vadodara Jn', 100, true],
    ['Bharuch Jn', 166], ['Surat', 230, true], ['Vapi', 332],
    ['Mumbai Central', 493, true],
  ],
  HWH_BBS: [
    ['Howrah Jn', 0, true], ['Kharagpur Jn', 118, true],
    ['Balasore', 235], ['Cuttack', 425],
    ['Bhubaneswar', 462, true],
  ],
  BOM_SBC: [
    ['Mumbai CSMT', 0, true], ['Pune Jn', 192, true], ['Solapur Jn', 454, true],
    ['Guntakal Jn', 690, true], ['Dharmavaram', 792],
    ['Bengaluru City', 1003, true],
  ],
  PNBE_DEL: [
    ['Patna Jn', 0, true], ['Ara Jn', 58], ['Buxar', 145],
    ['Mughal Sarai Jn', 228, true], ['Prayagraj Jn', 358, true],
    ['Kanpur Central', 552, true], ['New Delhi', 991, true],
  ],
  DEL_RNC: [
    ['New Delhi', 0, true], ['Kanpur Central', 440, true],
    ['Prayagraj Jn', 634, true], ['Mughal Sarai Jn', 764],
    ['Gaya Jn', 976, true], ['Parasnath', 1080],
    ['Dhanbad Jn', 1139, true], ['Ranchi Jn', 1260, true],
  ],
  JP_ADI: [
    ['Jaipur Jn', 0, true], ['Ajmer Jn', 135, true], ['Beawar', 175],
    ['Pali', 240], ['Abu Road', 365, true],
    ['Palanpur Jn', 420], ['Ahmedabad Jn', 491, true],
  ],
  VZG_SC: [
    ['Visakhapatnam', 0, true], ['Rajahmundry', 145],
    ['Vijayawada Jn', 280, true], ['Khammam', 380],
    ['Warangal', 438, true], ['Secunderabad', 550, true],
  ],
  BPL_NGP: [
    ['Bhopal Jn', 0, true], ['Itarsi Jn', 100, true], ['Betul', 184],
    ['Nagpur Jn', 370, true],
  ],
  MAS_TRY: [
    ['Chennai Central', 0, true], ['Katpadi Jn', 128],
    ['Bengaluru City', 360, true], ['Trichy Jn', 580, true],
  ],
  KGP_MAS: [
    ['Kharagpur Jn', 0, true], ['Balasore', 117], ['Bhubaneswar', 344, true],
    ['Brahmapur', 504], ['Visakhapatnam', 627, true],
    ['Vijayawada Jn', 919, true], ['Nellore', 1219],
    ['Chennai Central', 1545, true],
  ],
};

// Seed-based random for consistent values per trainNo
function seededRand(seed: number, i: number): number {
  const x = Math.sin(seed * 9301 + i * 49297 + 233280) * 10000;
  return x - Math.floor(x);
}

export function getTrainRouteDetail(trainNo: string): { train: TrainMapDef; stops: RouteStop[] } | null {
  const train = MAP_TRAINS.find(t => t.no === trainNo);
  if (!train) return null;

  const rawStations = ROUTE_STATIONS[train.rt];
  if (!rawStations) return null;

  const seed = parseInt(trainNo.replace(/\D/g, '')) || 12345;
  const depMin = train.dh * 60 + train.dm;
  const totalDurMin = train.dur * 60;

  // Get stations and handle reversal
  let stations: RS[];
  if (train.rev) {
    const maxKm = rawStations[rawStations.length - 1][1];
    stations = [...rawStations].reverse().map(s => [s[0], maxKm - s[1], s[2]]);
  } else {
    stations = rawStations.map(s => [...s] as RS);
  }

  // Filter stops by train type — Rajdhani/Duronto/VB only stop at major junctions
  if (train.tp === 'Rajdhani' || train.tp === 'Duronto') {
    stations = stations.filter((s, i) => i === 0 || i === stations.length - 1 || s[2]);
  } else if (train.tp === 'Vande Bharat' || train.tp === 'Shatabdi') {
    // Shatabdi/VB: major junctions plus every other station
    stations = stations.filter((s, i) =>
      i === 0 || i === stations.length - 1 || s[2] || seededRand(seed, i) > 0.5
    );
  }
  // Express/Superfast/Local: all stations

  const totalKm = stations[stations.length - 1][1];

  const stops: RouteStop[] = stations.map((stn, i) => {
    const frac = totalKm > 0 ? stn[1] / totalKm : i / (stations.length - 1);
    const stationMin = depMin + frac * totalDurMin;

    // Halt times based on train type and position
    let haltMin = 0;
    if (i > 0 && i < stations.length - 1) {
      if (train.tp === 'Rajdhani' || train.tp === 'Duronto') {
        haltMin = stn[2] ? 2 : 1; // Brief tech halt at major junctions
      } else if (train.tp === 'Shatabdi' || train.tp === 'Vande Bharat') {
        haltMin = stn[2] ? 2 : 1;
      } else {
        haltMin = stn[2] ? Math.floor(seededRand(seed, i + 40) * 6 + 5) : Math.floor(seededRand(seed, i + 40) * 4 + 2);
      }
    }

    const arrMin = stationMin;
    const depMinCalc = stationMin + haltMin;
    const arrH = Math.floor(((arrMin % (24 * 60)) + 24 * 60) % (24 * 60) / 60);
    const arrM = Math.round(((arrMin % 60) + 60) % 60);
    const depH = Math.floor(((depMinCalc % (24 * 60)) + 24 * 60) % (24 * 60) / 60);
    const depM = Math.round(((depMinCalc % 60) + 60) % 60);
    const dayNumber = Math.floor(stationMin / (24 * 60)) + 1;

    const platform = (i === 0 || i === stations.length - 1)
      ? Math.floor(seededRand(seed, i + 100) * 5 + 1)
      : Math.floor(seededRand(seed, i + 50) * 8 + 1);

    // Delays: ~30% chance, higher probability at major junctions
    const delayChance = stn[2] ? 0.35 : 0.2;
    const delayMinutes = (i > 0 && seededRand(seed, i + 200) < delayChance)
      ? Math.floor(seededRand(seed, i + 300) * 25 + 5)
      : 0;

    return {
      station: stn[0],
      lat: 0,
      lng: 0,
      arrivalTime: i === 0 ? '--:--' : `${String(arrH).padStart(2, '0')}:${String(arrM).padStart(2, '0')}`,
      departureTime: i === stations.length - 1 ? '--:--' : `${String(depH).padStart(2, '0')}:${String(depM).padStart(2, '0')}`,
      isOrigin: i === 0,
      isDestination: i === stations.length - 1,
      distancePercent: Math.round(frac * 100),
      distanceKm: Math.round(stn[1]),
      haltMinutes: haltMin,
      platform,
      dayNumber: dayNumber < 1 ? 1 : dayNumber,
      delayMinutes,
    };
  });

  return { train, stops };
}
