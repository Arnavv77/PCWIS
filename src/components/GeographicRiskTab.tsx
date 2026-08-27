import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { RiskZone, Complaint, AtmLocation } from '../types/pcwis';
import { ALL_DISTRICT_ATMS } from '../data/pcwisData';
import { 
  AlertCircle, 
  Navigation, 
  MapPin, 
  Filter, 
  Search, 
  CreditCard, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Building,
  Sparkles,
  History
} from 'lucide-react';

interface GeographicRiskTabProps {
  riskZones: RiskZone[];
  complaints?: Complaint[];
  allDistrictAtms?: AtmLocation[];
  onSelectComplaintAction?: (actionType: 'FREEZE' | 'DISPATCH' | 'CCTV', complaint: Complaint) => void;
}

export type AtmRiskFilter = 'ALL' | 'MOST_RISK' | 'LESS_RISK' | 'ALMOST_NO_RISK';

export interface DistrictOption {
  id: string;
  name: string;
  shortName: string;
  cityKey: string;
  center: [number, number];
  zoom: number;
  description: string;
  appAnalysisSummary: string;
}

export const DISTRICT_OPTIONS: DistrictOption[] = [
  {
    id: 'ALL',
    name: 'All India Corridors & Districts (30 Main ATMs)',
    shortName: 'All India',
    cityKey: 'ALL',
    center: [20.5937, 78.9629],
    zoom: 5,
    description: 'Nationwide GIS view of high-risk cybercrime cash-withdrawal corridors and flagged ATM hubs.',
    appAnalysisSummary: 'Multi-state cybercrime network tracking cash-out velocity across Mewat, Jamtara, Bengaluru, Mumbai, and Noida.'
  },
  {
    id: 'NOIDA',
    name: '📍 Noida (Gautam Buddha Nagar) — 6 Main ATM Hubs',
    shortName: 'Noida Hubs',
    cityKey: 'Noida',
    center: [28.5650, 77.3500],
    zoom: 12,
    description: 'High-density commercial transit corridor with heavy Digital Arrest and UPI Phishing cash-out activity.',
    appAnalysisSummary: 'App & IMEI Analysis: High mobile device clustering around Sector 18 Commercial Plaza and Sector 62 Tech Park. Rapid IMPS layering within 4 minutes of victim deposits.'
  },
  {
    id: 'GURUGRAM',
    name: '📍 Gurugram & Nuh Corridor — 5 Main ATM Hubs',
    shortName: 'Gurugram/Nuh',
    cityKey: 'Gurugram',
    center: [28.4200, 77.0400],
    zoom: 11,
    description: 'Mewat Cyber Belt cash layering corridor along NH-48 and Sohna Road markets.',
    appAnalysisSummary: 'App & IMEI Analysis: 11 flagged IMEIs operating within 500m radius on NH-48. Cardless OTP withdrawal pattern matched with Mewat Syndicate Grid #04.'
  },
  {
    id: 'BENGALURU',
    name: '📍 Bengaluru Urban — 5 Main ATM Hubs',
    shortName: 'Bengaluru',
    cityKey: 'Bengaluru',
    center: [12.9300, 77.6200],
    zoom: 12,
    description: 'South tech corridor targeting Silk Board, Electronic City, and Koramangala commercial ATMs.',
    appAnalysisSummary: 'App & IMEI Analysis: Part-time online job scam fund layering. Multi-tier UPI routing through Tamil Nadu border mule accounts.'
  },
  {
    id: 'MUMBAI',
    name: '📍 Mumbai & Thane Grid — 5 Main ATM Hubs',
    shortName: 'Mumbai Grid',
    cityKey: 'Mumbai',
    center: [19.0800, 72.8800],
    zoom: 11,
    description: 'Financial hub grid tracking BKC, Andheri East, and Thane station cash-out outlets.',
    appAnalysisSummary: 'App & IMEI Analysis: Stock trading and Forex arbitrage fraud payouts. Rapid ATM layering following evening banking cutoff hours.'
  },
  {
    id: 'JAIPUR',
    name: '📍 Jaipur & Mewat Regional Grid — 3 Main ATM Hubs',
    shortName: 'Jaipur Grid',
    cityKey: 'Jaipur',
    center: [26.8900, 75.8000],
    zoom: 12,
    description: 'Rajasthan regional network tracking MI Road and Railway station ATM clusters.',
    appAnalysisSummary: 'App & IMEI Analysis: UPI Phishing refund fraud cashout points linked to Bharatpur & Alwar regional grids.'
  },
  {
    id: 'KOLKATA',
    name: '📍 Kolkata & Salt Lake Arc — 3 Main ATM Hubs',
    shortName: 'Kolkata Arc',
    cityKey: 'Kolkata',
    center: [22.5700, 88.3800],
    zoom: 12,
    description: 'Eastern banking phishing module targeting Salt Lake Sector V and Howrah station ATMs.',
    appAnalysisSummary: 'App & IMEI Analysis: APK hijack banking credentials. Automated cash-outs within 15 minutes of banking credential capture.'
  },
  {
    id: 'HYDERABAD',
    name: '📍 Hyderabad & Cyberabad — 3 Main ATM Hubs',
    shortName: 'Hyderabad',
    cityKey: 'Hyderabad',
    center: [17.4400, 78.4000],
    zoom: 12,
    description: 'Telangana tech hub grid targeting Mindspace and Gachibowli financial district ATMs.',
    appAnalysisSummary: 'App & IMEI Analysis: Overseas crypto investment fraud layering through local mule accounts.'
  }
];

// Risk classification details helper function
export const getAtmRiskDetails = (riskScore: number) => {
  if (riskScore >= 90) {
    return {
      tier: 'MOST_RISK' as const,
      label: 'High Risk (Critical Alert)',
      shortLabel: 'High Risk',
      color: '#DC2626', // Red
      strokeColor: '#B91C1C',
      bgClass: 'bg-red-600',
      badgeClass: 'bg-red-100 text-red-800 border-red-300 font-bold',
      pinBg: '#FEE2E2',
      dotColor: '#DC2626',
      borderColor: '#EF4444',
      badgeDot: 'bg-red-500',
      description: 'Imminent high-velocity cash layering predicted. Emergency LEA field unit dispatch advised.'
    };
  } else if (riskScore >= 70) {
    return {
      tier: 'LESS_RISK' as const,
      label: 'Medium Risk (Moderate Watch)',
      shortLabel: 'Medium Risk',
      color: '#D97706', // Yellow / Amber
      strokeColor: '#B45309',
      bgClass: 'bg-amber-500',
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300 font-bold',
      pinBg: '#FEF3C7',
      dotColor: '#D97706',
      borderColor: '#F59E0B',
      badgeDot: 'bg-amber-500',
      description: 'Suspicious transaction pattern detected. Monitored for potential mule activity.'
    };
  } else {
    return {
      tier: 'ALMOST_NO_RISK' as const,
      label: 'Low Risk (Almost No Risk)',
      shortLabel: 'Low Risk',
      color: '#16A34A', // Green
      strokeColor: '#15803D',
      bgClass: 'bg-emerald-600',
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold',
      pinBg: '#D1FAE5',
      dotColor: '#16A34A',
      borderColor: '#10B981',
      badgeDot: 'bg-emerald-500',
      description: 'Normal transaction velocity. Low likelihood of fraudulent cash withdrawal.'
    };
  }
};

// Map Recenter Helper Component
const MapRecenter: React.FC<{ center: [number, number]; zoom?: number }> = ({ center, zoom = 7 }) => {
  const map = useMap();
  React.useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
};

// Create custom official government map zone marker icon
const createGovIcon = (riskLevel: string, isSelected: boolean) => {
  const color = riskLevel === 'CRITICAL' ? '#B91C1C' : '#B45309';
  const size = isSelected ? 34 : 26;

  const svgHtml = `
    <div style="
      position: relative;
      width: ${size}px;
      height: ${size}px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}" stroke="#FFFFFF" stroke-width="1.5">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        <circle cx="12" cy="9" r="2.5" fill="#FFFFFF" />
      </svg>
      ${isSelected ? `<div style="
        position: absolute;
        top: -6px;
        width: ${size + 8}px;
        height: ${size + 8}px;
        border: 2px solid ${color};
        border-radius: 50%;
        animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
      "></div>` : ''}
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-gov-leaflet-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size]
  });
};

// Create custom ATM map marker icon with exact Risk Color (Red = High Risk, Yellow = Medium Risk, Green = Low Risk)
const createAtmMarkerIcon = (riskScore: number, isSelected: boolean) => {
  const riskInfo = getAtmRiskDetails(riskScore);
  const size = isSelected ? 38 : 30;

  const svgHtml = `
    <div style="
      position: relative;
      width: ${size}px;
      height: ${size}px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    ">
      ${riskInfo.tier === 'MOST_RISK' ? `
        <div style="
          position: absolute;
          width: ${size + 14}px;
          height: ${size + 14}px;
          border-radius: 50%;
          background-color: rgba(220, 38, 38, 0.35);
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
      ` : ''}
      <svg viewBox="0 0 36 36" width="${size}" height="${size}">
        <defs>
          <filter id="shadow-${riskScore}" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000000" flood-opacity="0.4"/>
          </filter>
        </defs>
        <!-- Pin Outer Marker Shape -->
        <path d="M18 2 C10.27 2 4 8.27 4 16 C4 25.5 18 34 18 34 C18 34 32 25.5 32 16 C32 8.27 25.73 2 18 2 Z" 
              fill="${riskInfo.color}" 
              stroke="#FFFFFF" 
              stroke-width="${isSelected ? '2.5' : '1.5'}"
              filter="url(#shadow-${riskScore})"/>
        <!-- Inner ATM Kiosk Frame -->
        <rect x="10.5" y="9.5" width="15" height="11" rx="1.5" fill="#FFFFFF"/>
        <!-- ATM Screen Line -->
        <line x1="13" y1="12.5" x2="23" y2="12.5" stroke="${riskInfo.color}" stroke-width="1.8" stroke-linecap="round"/>
        <!-- ATM Card Slot Line -->
        <line x1="13" y1="16" x2="19" y2="16" stroke="${riskInfo.color}" stroke-width="1.5" stroke-linecap="round"/>
        <!-- Cash Dispense Slot -->
        <line x1="13" y1="23" x2="23" y2="23" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: 'custom-atm-leaflet-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size]
  });
};

export const GeographicRiskTab: React.FC<GeographicRiskTabProps> = ({ 
  riskZones, 
  complaints = [],
  allDistrictAtms = ALL_DISTRICT_ATMS,
  onSelectComplaintAction
}) => {
  const [selectedZoneId, setSelectedZoneId] = useState<string>(riskZones[0]?.id || 'ZONE-01');
  const [selectedAtmId, setSelectedAtmId] = useState<string>('ATM-NOIDA-01');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('NOIDA');
  const [riskFilter, setRiskFilter] = useState<AtmRiskFilter>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showZones, setShowZones] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'ATM' | 'ZONE'>('ATM');

  const selectedDistrict = DISTRICT_OPTIONS.find(d => d.id === selectedDistrictId) || DISTRICT_OPTIONS[1];
  const selectedZone = riskZones.find(z => z.id === selectedZoneId) || riskZones[0];
  const selectedAtm = allDistrictAtms.find(a => a.id === selectedAtmId) || allDistrictAtms[0];

  // Filter district ATMs by selected district cityKey
  const districtAtms = selectedDistrict.cityKey === 'ALL' 
    ? allDistrictAtms 
    : allDistrictAtms.filter(a => a.city.toLowerCase() === selectedDistrict.cityKey.toLowerCase() || a.district.toLowerCase().includes(selectedDistrict.cityKey.toLowerCase()));

  // Calculate ATM risk stats count for current view
  const redAtmCount = districtAtms.filter(a => a.riskScore >= 90).length;
  const yellowAtmCount = districtAtms.filter(a => a.riskScore >= 70 && a.riskScore < 90).length;
  const greenAtmCount = districtAtms.filter(a => a.riskScore < 70).length;

  // Filter complaints/ATMs based on active risk filter and search query
  const filteredAtms = districtAtms.filter(a => {
    const riskTier = getAtmRiskDetails(a.riskScore).tier;
    const matchesFilter = riskFilter === 'ALL' || riskFilter === riskTier;
    const matchesSearch = searchQuery === '' || 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.bank.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.appAnalysisInsight.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate dynamic center for map focus
  const mapCenter: [number, number] = viewMode === 'ATM' && selectedAtm?.latLng
    ? selectedAtm.latLng
    : selectedDistrict.center;

  const mapZoom = viewMode === 'ATM' && selectedAtm?.latLng 
    ? (selectedDistrictId === 'ALL' ? 9 : 13)
    : selectedDistrict.zoom;

  // Handle District Dropdown Switch
  const handleDistrictChange = (districtId: string) => {
    setSelectedDistrictId(districtId);
    setViewMode('ATM');
    const matchingAtms = districtId === 'ALL' 
      ? allDistrictAtms 
      : allDistrictAtms.filter(a => {
          const matchOpt = DISTRICT_OPTIONS.find(d => d.id === districtId);
          return matchOpt && (a.city.toLowerCase() === matchOpt.cityKey.toLowerCase() || a.district.toLowerCase().includes(matchOpt.cityKey.toLowerCase()));
        });
    if (matchingAtms.length > 0) {
      setSelectedAtmId(matchingAtms[0].id);
    }
  };

  return (
    <div className="gov-card space-y-4">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gov-border pb-3">
        <div>
          <h2 className="text-sm font-bold text-gov-navy uppercase tracking-wider flex items-center">
            <Zap className="w-4 h-4 mr-2 text-gov-red animate-pulse" />
            DISTRICT-WIDE ATM RISK & APPS ANALYSIS MAP — LEAFLET GIS REALTIME ENGINE
          </h2>
          <p className="text-[11px] text-gov-text-muted">
            Analyzing main ATM hubs across districts (e.g. Noida, Gurugram, Bengaluru, Mumbai) color-coded by AI risk analysis: 🔴 High Risk, 🟡 Medium Risk, 🟢 Low Risk
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* District City Selector Dropdown */}
          <div className="flex items-center space-x-1.5 bg-gov-bg p-1 rounded border border-gov-border">
            <Building className="w-3.5 h-3.5 text-gov-navy ml-1" />
            <select
              value={selectedDistrictId}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="bg-white text-gov-navy text-xs font-bold py-1 px-2 border border-gray-300 rounded focus:outline-none focus:border-gov-navy cursor-pointer font-mono"
            >
              {DISTRICT_OPTIONS.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={() => setViewMode('ATM')}
            className={`px-3 py-1 text-xs font-bold rounded-sm border transition-colors flex items-center ${
              viewMode === 'ATM' 
                ? 'bg-gov-navy text-white border-gov-navy' 
                : 'bg-white text-gov-navy border-gov-border hover:bg-gray-50'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 mr-1" />
            ATMs ({districtAtms.length})
          </button>
          <button 
            onClick={() => setViewMode('ZONE')}
            className={`px-3 py-1 text-xs font-bold rounded-sm border transition-colors flex items-center ${
              viewMode === 'ZONE' 
                ? 'bg-gov-navy text-white border-gov-navy' 
                : 'bg-white text-gov-navy border-gov-border hover:bg-gray-50'
            }`}
          >
            <Navigation className="w-3.5 h-3.5 mr-1" />
            GIS Zones ({riskZones.length})
          </button>
        </div>
      </div>

      {/* District App & Incident Analysis Strip */}
      <div className="bg-blue-50/70 border border-blue-200 p-2.5 rounded-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-start space-x-2 max-w-4xl">
          <Sparkles className="w-4 h-4 text-gov-navy flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-gov-navy uppercase text-[11px]">
              AI Apps & History Analysis — {selectedDistrict.name}:
            </span>
            <p className="text-[11px] text-gov-text-muted mt-0.5 leading-snug">
              {selectedDistrict.appAnalysisSummary}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 font-mono text-[10px] text-gov-navy bg-white px-2.5 py-1 rounded border border-blue-200 font-bold whitespace-nowrap">
          <span>MONITORED CITY: {selectedDistrict.cityKey.toUpperCase()}</span>
        </div>
      </div>

      {/* ATM Risk Statistics Bar for Selected District */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-gov-bg p-2.5 rounded-sm border border-gov-border text-xs">
        <div className="flex items-center space-x-2 bg-white p-2 rounded border border-gray-200 shadow-xs">
          <div className="w-3.5 h-3.5 rounded-full bg-red-600 animate-pulse flex-shrink-0"></div>
          <div>
            <div className="text-[10px] text-gray-500 font-bold uppercase">🔴 High Risk (Critical)</div>
            <div className="text-sm font-bold text-red-700 font-mono">{redAtmCount} Main ATMs</div>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-white p-2 rounded border border-gray-200 shadow-xs">
          <div className="w-3.5 h-3.5 rounded-full bg-amber-500 flex-shrink-0"></div>
          <div>
            <div className="text-[10px] text-gray-500 font-bold uppercase">🟡 Medium Risk (Watch)</div>
            <div className="text-sm font-bold text-amber-700 font-mono">{yellowAtmCount} Main ATMs</div>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-white p-2 rounded border border-gray-200 shadow-xs">
          <div className="w-3.5 h-3.5 rounded-full bg-emerald-600 flex-shrink-0"></div>
          <div>
            <div className="text-[10px] text-gray-500 font-bold uppercase">🟢 Low Risk (Cleared)</div>
            <div className="text-sm font-bold text-emerald-700 font-mono">{greenAtmCount} Main ATMs</div>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-white p-2 rounded border border-gray-200 shadow-xs">
          <CreditCard className="w-4 h-4 text-gov-navy flex-shrink-0" />
          <div>
            <div className="text-[10px] text-gray-500 font-bold uppercase">District Total ATMs</div>
            <div className="text-sm font-bold text-gov-navy font-mono">{districtAtms.length} Monitored</div>
          </div>
        </div>
      </div>

      {/* Main Map & Detail Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Map Viewport Canvas (7 cols) */}
        <div className="lg:col-span-7 bg-gov-bg p-2 rounded-sm border border-gov-border relative min-h-[540px] flex flex-col justify-between">
          
          {/* Controls Bar above map */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gov-border pb-2 px-1 text-xs">
            {/* Risk Filters */}
            <div className="flex flex-wrap items-center gap-1">
              <span className="text-[10px] font-bold text-gov-text-muted mr-1 uppercase flex items-center">
                <Filter className="w-3 h-3 mr-0.5" /> Risk Filter:
              </span>
              <button
                onClick={() => setRiskFilter('ALL')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded border ${
                  riskFilter === 'ALL'
                    ? 'bg-gov-navy text-white border-gov-navy'
                    : 'bg-white text-gov-navy border-gray-300 hover:bg-gray-100'
                }`}
              >
                All ({districtAtms.length})
              </button>
              <button
                onClick={() => setRiskFilter('MOST_RISK')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded border flex items-center ${
                  riskFilter === 'MOST_RISK'
                    ? 'bg-red-600 text-white border-red-700'
                    : 'bg-red-50 text-red-700 border-red-300 hover:bg-red-100'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1"></span>
                Red: High Risk ({redAtmCount})
              </button>
              <button
                onClick={() => setRiskFilter('LESS_RISK')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded border flex items-center ${
                  riskFilter === 'LESS_RISK'
                    ? 'bg-amber-600 text-white border-amber-700'
                    : 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1"></span>
                Yellow: Medium Risk ({yellowAtmCount})
              </button>
              <button
                onClick={() => setRiskFilter('ALMOST_NO_RISK')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded border flex items-center ${
                  riskFilter === 'ALMOST_NO_RISK'
                    ? 'bg-emerald-600 text-white border-emerald-700'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1"></span>
                Green: Low Risk ({greenAtmCount})
              </button>
            </div>

            {/* Toggle GIS Corridor Circles */}
            <div className="flex items-center space-x-2 text-[10px] font-medium text-gov-text-muted">
              <label className="flex items-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showZones}
                  onChange={(e) => setShowZones(e.target.checked)}
                  className="rounded text-gov-navy focus:ring-0 mr-1"
                />
                Show Corridor Zones
              </label>
            </div>
          </div>

          {/* Real Leaflet OpenStreetMap Container */}
          <div className="w-full h-[470px] rounded-sm overflow-hidden border border-gov-border my-2 relative z-0">
            <MapContainer 
              center={selectedDistrict.center} 
              zoom={selectedDistrict.zoom} 
              scrollWheelZoom={false}
              style={{ height: '100%', width: '100%' }}
            >
              <MapRecenter center={mapCenter} zoom={mapZoom} />
              
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Government GIS Engine'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Render GIS Zones if enabled */}
              {showZones && riskZones.map((zone) => {
                const isSelected = zone.id === selectedZoneId && viewMode === 'ZONE';
                const icon = createGovIcon(zone.riskLevel, isSelected);

                return (
                  <React.Fragment key={`zone-${zone.id}`}>
                    <Circle 
                      center={zone.latLng}
                      radius={45000}
                      pathOptions={{
                        color: zone.riskLevel === 'CRITICAL' ? '#B91C1C' : '#B45309',
                        fillColor: zone.riskLevel === 'CRITICAL' ? '#B91C1C' : '#B45309',
                        fillOpacity: isSelected ? 0.22 : 0.08,
                        weight: isSelected ? 2 : 1,
                        dashArray: '4, 4'
                      }}
                    />

                    <Marker 
                      position={zone.latLng} 
                      icon={icon}
                      eventHandlers={{
                        click: () => {
                          setSelectedZoneId(zone.id);
                          setViewMode('ZONE');
                        }
                      }}
                    >
                      <Popup>
                        <div className="space-y-1">
                          <div className="font-bold text-gov-navy text-xs border-b border-gray-200 pb-1 flex items-center justify-between">
                            <span>{zone.zoneName}</span>
                            <span className="text-[9px] bg-red-100 text-red-800 px-1 rounded font-mono font-bold">GIS ZONE</span>
                          </div>
                          <div className="text-[10px] text-gov-text">
                            <div>State: <strong>{zone.state}</strong></div>
                            <div>Outflow: <strong className="text-gov-navy font-mono">₹{zone.predictedWithdrawalCr} Cr</strong></div>
                            <div className="text-gov-red font-bold">Hotspots: {zone.activeHotspots} Locations</div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  </React.Fragment>
                );
              })}

              {/* Render Color-Coded Predicted ATM Markers for District ATMs */}
              {filteredAtms.map((a) => {
                const isSelected = a.id === selectedAtmId && viewMode === 'ATM';
                const riskDetails = getAtmRiskDetails(a.riskScore);
                const icon = createAtmMarkerIcon(a.riskScore, isSelected);
                const activeComp = complaints.find(c => c.caseRef === a.activeComplaintRef);

                return (
                  <Marker 
                    key={`atm-${a.id}`}
                    position={a.latLng} 
                    icon={icon}
                    eventHandlers={{
                      click: () => {
                        setSelectedAtmId(a.id);
                        setViewMode('ATM');
                      }
                    }}
                  >
                    <Popup maxWidth={320}>
                      <div className="p-1 space-y-2 text-xs">
                        {/* Popup Header */}
                        <div className="border-b border-gray-200 pb-1.5 flex items-start justify-between gap-1">
                          <div>
                            <span className="font-mono font-bold text-gov-navy text-[11px] block">
                              {a.name}
                            </span>
                            <div className="text-[10px] text-gov-text font-bold line-clamp-1">
                              {a.bank} — {a.city}, {a.stateUT}
                            </div>
                          </div>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded border whitespace-nowrap ${riskDetails.badgeClass}`}>
                            {a.riskScore}% RISK
                          </span>
                        </div>

                        {/* Risk Tier Badge & 30-Day History */}
                        <div className={`p-1.5 rounded text-[10px] flex items-center justify-between font-bold ${
                          riskDetails.tier === 'MOST_RISK' ? 'bg-red-50 text-red-800 border border-red-200' :
                          riskDetails.tier === 'LESS_RISK' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                          'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        }`}>
                          <span className="flex items-center">
                            <span className={`w-2 h-2 rounded-full mr-1.5 ${riskDetails.badgeDot}`}></span>
                            {riskDetails.shortLabel} ATM
                          </span>
                          <span className="font-mono flex items-center">
                            <History className="w-3 h-3 mr-1" />
                            {a.historicalIncidents30D} Incidents (30D)
                          </span>
                        </div>

                        {/* App Analysis & Crime History */}
                        <div className="text-[10px] space-y-1 text-gray-700 font-sans bg-gray-50 p-1.5 rounded border border-gray-200">
                          <div><strong>AI Apps Analysis:</strong></div>
                          <div className="text-[10px] text-gov-navy leading-snug italic font-medium">"{a.appAnalysisInsight}"</div>
                          {a.predictedTimeWindow && (
                            <div className="mt-1"><strong>Predicted Window:</strong> <span className="font-mono font-bold text-red-700">{a.predictedTimeWindow}</span></div>
                          )}
                        </div>

                        {/* Quick LEA Action */}
                        <div className="pt-1.5 border-t border-gray-200 flex gap-1">
                          <button 
                            onClick={() => {
                              setSelectedAtmId(a.id);
                              if (onSelectComplaintAction && activeComp) onSelectComplaintAction('DISPATCH', activeComp);
                            }}
                            className="w-full py-1 text-[10px] font-bold bg-gov-navy text-white rounded hover:bg-gov-navy-light text-center"
                          >
                            Mobilize Patrol
                          </button>
                          <button 
                            onClick={() => {
                              setSelectedAtmId(a.id);
                              if (onSelectComplaintAction && activeComp) onSelectComplaintAction('FREEZE', activeComp);
                            }}
                            className="w-full py-1 text-[10px] font-bold bg-red-700 text-white rounded hover:bg-red-800 text-center"
                          >
                            Initiate Bank Freeze Request
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>

          {/* Map Footer GIS Legend */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-gov-text-muted border-t border-gov-border pt-2 px-2 font-mono">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-bold text-gov-navy">ATM RISK LEGEND:</span>
              <span className="flex items-center text-red-700 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block mr-1"></span>
                🔴 High Risk (&ge;90%)
              </span>
              <span className="flex items-center text-amber-700 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block mr-1"></span>
                🟡 Medium Risk (70-89%)
              </span>
              <span className="flex items-center text-emerald-700 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block mr-1"></span>
                🟢 Low Risk (&lt;70%)
              </span>
            </div>
            <span>OPENSTREETMAP GIS ENGINE</span>
          </div>
        </div>

        {/* Right Information & Predictive ATM Inspector Panel (5 cols) */}
        <div className="lg:col-span-5 gov-card bg-white border border-gov-border flex flex-col justify-between">
          <div>
            {/* Panel Header */}
            <div className="text-xs font-bold text-gov-navy uppercase tracking-wider pb-2 mb-3 border-b border-gov-border flex items-center justify-between">
              <span className="flex items-center">
                <ShieldAlert className="w-4 h-4 mr-1 text-gov-red" />
                {viewMode === 'ATM' ? 'DISTRICT ATM INTELLIGENCE DOSSIER' : 'CORRIDOR INTELLIGENCE PROFILE'}
              </span>
              
              {viewMode === 'ATM' && selectedAtm && (
                <span className={`px-2 py-0.5 text-[10px] rounded border ${getAtmRiskDetails(selectedAtm.riskScore).badgeClass}`}>
                  {getAtmRiskDetails(selectedAtm.riskScore).shortLabel.toUpperCase()}
                </span>
              )}
            </div>

            {/* View Mode: ATM Kiosk Inspector */}
            {viewMode === 'ATM' && selectedAtm && (
              <div className="space-y-3">
                {/* Search Bar for ATMs */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
                  <input 
                    type="text"
                    placeholder="Search ATM location, bank, district..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-gov-bg border border-gov-border rounded-sm focus:outline-none focus:border-gov-navy font-mono"
                  />
                </div>

                {/* Selected ATM Details Card */}
                <div className="border border-gov-border rounded-sm p-3 bg-gov-bg space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[10px] font-mono text-gov-text-muted">ATM ID: {selectedAtm.id}</div>
                      <div className="font-mono font-bold text-gov-navy text-xs">{selectedAtm.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-mono text-gov-text-muted">RISK SCORE:</div>
                      <div className={`font-mono font-bold text-sm ${
                        selectedAtm.riskScore >= 90 ? 'text-red-700' :
                        selectedAtm.riskScore >= 70 ? 'text-amber-700' : 'text-emerald-700'
                      }`}>
                        {selectedAtm.riskScore} / 100
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-gov-navy flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-gov-red flex-shrink-0" />
                      {selectedAtm.bank} Kiosk — {selectedAtm.city}
                    </h3>
                    <p className="text-[11px] text-gov-text-muted font-medium mt-0.5">
                      Jurisdiction: <span className="text-gov-navy font-bold">{selectedAtm.district}, {selectedAtm.stateUT}</span>
                    </p>
                    {selectedAtm.latLng && (
                      <div className="text-[10px] font-mono text-gov-navy mt-1 bg-white p-1 rounded border border-gray-200">
                        GPS COORDS: {selectedAtm.latLng[0].toFixed(4)}° N, {selectedAtm.latLng[1].toFixed(4)}° E
                      </div>
                    )}
                  </div>

                  {/* Risk Assessment Summary */}
                  <div className={`p-2 rounded border text-xs ${
                    getAtmRiskDetails(selectedAtm.riskScore).tier === 'MOST_RISK' ? 'bg-red-50 border-red-200 text-red-900' :
                    getAtmRiskDetails(selectedAtm.riskScore).tier === 'LESS_RISK' ? 'bg-amber-50 border-amber-200 text-amber-900' :
                    'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}>
                    <div className="font-bold uppercase text-[10px] flex items-center mb-0.5">
                      {getAtmRiskDetails(selectedAtm.riskScore).tier === 'MOST_RISK' && <AlertTriangle className="w-3.5 h-3.5 mr-1 text-red-600" />}
                      {getAtmRiskDetails(selectedAtm.riskScore).tier === 'LESS_RISK' && <AlertCircle className="w-3.5 h-3.5 mr-1 text-amber-600" />}
                      {getAtmRiskDetails(selectedAtm.riskScore).tier === 'ALMOST_NO_RISK' && <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />}
                      {getAtmRiskDetails(selectedAtm.riskScore).label}
                    </div>
                    <div className="text-[11px]">
                      {getAtmRiskDetails(selectedAtm.riskScore).description}
                    </div>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 bg-white p-2 rounded border border-gray-200 text-xs font-mono">
                    <div>
                      <div className="text-[9px] text-gov-text-muted uppercase">30D Incident Count</div>
                      <div className="text-xs font-bold text-gov-navy">{selectedAtm.historicalIncidents30D} Fraud Events</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-gov-text-muted uppercase">Predicted Window</div>
                      <div className="text-xs font-bold text-red-700">{selectedAtm.predictedTimeWindow || 'N/A Monitoring'}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-gov-text-muted uppercase">Bank Network</div>
                      <div className="text-[11px] font-bold text-gov-navy line-clamp-1">{selectedAtm.bank}</div>
                    </div>
                    <div>
                      <div className="text-[9px] text-gov-text-muted uppercase">Active Complaint</div>
                      <div className="text-[11px] font-bold text-gov-navy line-clamp-1">{selectedAtm.activeComplaintRef || 'Under Surveillance'}</div>
                    </div>
                  </div>

                  {/* AI Apps & Crime History Spec */}
                  <div className="text-[11px] space-y-1 bg-white p-2 rounded border border-gray-200">
                    <div className="font-bold text-gov-navy uppercase text-[10px] flex items-center">
                      <Sparkles className="w-3 h-3 mr-1 text-gov-saffron-dark" /> AI Apps & Crime History Insight:
                    </div>
                    <div className="text-[11px] text-gray-800 leading-snug italic bg-gray-50 p-1.5 rounded border border-gray-200">
                      "{selectedAtm.appAnalysisInsight}"
                    </div>
                  </div>
                </div>

                {/* District ATM Kiosk Quick Switcher Scrollable List */}
                <div>
                  <div className="text-[10px] font-bold text-gov-navy uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>MAIN ATMS IN {selectedDistrict.cityKey.toUpperCase()} ({filteredAtms.length})</span>
                    <span className="text-[9px] font-normal text-gov-text-muted">Click pin to focus</span>
                  </div>
                  <div className="max-h-[140px] overflow-y-auto space-y-1 pr-1">
                    {filteredAtms.map((a) => {
                      const riskInfo = getAtmRiskDetails(a.riskScore);
                      const isCurr = a.id === selectedAtmId;
                      return (
                        <div
                          key={a.id}
                          onClick={() => {
                            setSelectedAtmId(a.id);
                            setViewMode('ATM');
                          }}
                          className={`p-1.5 rounded text-xs border cursor-pointer transition-colors flex items-center justify-between ${
                            isCurr 
                              ? 'bg-gov-navy text-white border-gov-navy font-bold' 
                              : 'bg-white hover:bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${riskInfo.badgeDot}`}></span>
                            <span className="truncate text-[11px]">{a.name}</span>
                          </div>
                          <div className="flex items-center space-x-2 font-mono text-[10px] flex-shrink-0">
                            <span className={isCurr ? 'text-white font-bold' : riskInfo.badgeClass + ' px-1 rounded'}>
                              {a.riskScore}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* View Mode: Zone Inspector */}
            {viewMode === 'ZONE' && selectedZone && (
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-gov-navy">
                    {selectedZone.zoneName}
                  </h3>
                  <p className="text-xs text-gov-text-muted font-medium mt-0.5">
                    Jurisdiction: <span className="text-gov-navy font-bold">{selectedZone.state}</span>
                  </p>
                  <div className="text-[11px] font-mono text-gov-navy mt-1 bg-gray-50 p-1 rounded border border-gray-200">
                    GPS COORDS: {selectedZone.latLng[0].toFixed(4)}° N, {selectedZone.latLng[1].toFixed(4)}° E
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-gov-bg p-2.5 rounded-sm border border-gov-border text-xs font-mono">
                  <div>
                    <div className="text-[10px] text-gov-text-muted uppercase">Active ATM Hotspots</div>
                    <div className="text-sm font-bold text-gov-red">{selectedZone.activeHotspots} Locations</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gov-text-muted uppercase">Est. 24H Outflow</div>
                    <div className="text-sm font-bold text-gov-navy">₹ {selectedZone.predictedWithdrawalCr} Crore</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gov-text-muted uppercase">ATM Density Index</div>
                    <div className="text-sm font-bold text-gov-navy">{selectedZone.atmDensityScore} / 100</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gov-text-muted uppercase">Corridor ID</div>
                    <div className="text-sm font-bold text-gov-navy">{selectedZone.id}</div>
                  </div>
                </div>

                <div className="text-xs">
                  <div className="font-bold text-gov-navy uppercase text-[11px] mb-1">
                    Vulnerable District Network:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedZone.districts.map((d, i) => (
                      <span key={i} className="bg-gray-100 text-gov-navy font-mono px-2 py-0.5 text-[11px] rounded-sm border border-gray-300">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 p-2.5 rounded-sm text-xs">
                  <div className="font-bold text-gov-red text-[11px] uppercase flex items-center">
                    <AlertCircle className="w-3.5 h-3.5 mr-1" />
                    Primary Operating Syndicate:
                  </div>
                  <div className="font-semibold text-gov-navy text-xs mt-0.5">
                    {selectedZone.primarySyndicate}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Emergency Action Buttons at bottom of side panel */}
          <div className="pt-3 border-t border-gov-border space-y-2">
            {viewMode === 'ATM' && selectedAtm ? (
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => {
                    const matchComp = complaints.find(c => c.caseRef === selectedAtm.activeComplaintRef) || complaints[0];
                    if (onSelectComplaintAction && matchComp) onSelectComplaintAction('DISPATCH', matchComp);
                  }}
                  className="gov-btn-primary py-2 text-xs font-bold w-full"
                >
                  Dispatch Field Unit
                </button>
                <button 
                  onClick={() => {
                    const matchComp = complaints.find(c => c.caseRef === selectedAtm.activeComplaintRef) || complaints[0];
                    if (onSelectComplaintAction && matchComp) onSelectComplaintAction('FREEZE', matchComp);
                  }}
                  className="bg-red-700 text-white py-2 text-xs font-bold rounded hover:bg-red-800 transition-colors w-full"
                >
                  Initiate Bank Freeze Request
                </button>
              </div>
            ) : (
              <button className="gov-btn-primary w-full py-2 text-xs font-bold">
                Issue Corridor-Wide LEA High-Alert Broadcast
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
