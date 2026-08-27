import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import type { Complaint, RiskZone } from '../types/pcwis';
import { AlertCircle, Landmark, Activity, MapPin, ArrowUpRight } from 'lucide-react';

interface DashboardOverviewTabProps {
  complaints: Complaint[];
  riskZones: RiskZone[];
  onSelectCase: (caseRef: string) => void;
}

export const DashboardOverviewTab: React.FC<DashboardOverviewTabProps> = ({
  complaints,
  riskZones,
  onSelectCase
}) => {
  // Hourly velocity mock data
  const velocityData = [
    { time: '08:00', actualLakhs: 42, predictedLakhs: 45 },
    { time: '09:00', actualLakhs: 68, predictedLakhs: 70 },
    { time: '10:00', actualLakhs: 110, predictedLakhs: 105 },
    { time: '11:00', actualLakhs: 195, predictedLakhs: 180 },
    { time: '12:00', actualLakhs: 240, predictedLakhs: 250 },
    { time: '13:00', actualLakhs: 180, predictedLakhs: 190 },
    { time: '14:00', actualLakhs: 310, predictedLakhs: 295 },
    { time: '15:00', actualLakhs: 420, predictedLakhs: 410 },
    { time: '16:00 (EST)', actualLakhs: null, predictedLakhs: 580 },
    { time: '17:00 (EST)', actualLakhs: null, predictedLakhs: 620 },
    { time: '18:00 (EST)', actualLakhs: null, predictedLakhs: 390 },
  ];

  // Fraud category count
  const categoryCounts = [
    { category: 'Digital Arrest Scam', count: 342, valueCr: 18.4, color: '#003366' },
    { category: 'Investment Fraud', count: 289, valueCr: 24.1, color: '#0B3D91' },
    { category: 'ATM Cash Layering', count: 215, valueCr: 12.8, color: '#B91C1C' },
    { category: 'Part-Time Job Fraud', count: 194, valueCr: 8.5, color: '#B45309' },
    { category: 'UPI Phishing', count: 178, valueCr: 4.2, color: '#FF9933' },
    { category: 'KYC Update Scam', count: 142, valueCr: 3.1, color: '#4B5563' },
  ];

  const formatLakhs = (val: number) => `₹ ${val} L`;

  return (
    <div className="space-y-4">
      {/* Top Row: Hourly Velocity Chart & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Hourly Cash Layering & Withdrawal Velocity Chart (7 cols) */}
        <div className="lg:col-span-7 gov-card">
          <div className="flex items-center justify-between border-b border-gov-border pb-2 mb-3">
            <div>
              <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center">
                <Activity className="w-4 h-4 mr-1.5 text-gov-navy-light" />
                Hourly Cash Layering & ATM Withdrawal Velocity (₹ Lakhs)
              </h3>
              <p className="text-[10px] text-gov-text-muted">
                Comparison of actual reported victim cash-out vs ML predicted withdrawal trajectory
              </p>
            </div>
            <span className="bg-blue-50 text-gov-navy font-mono text-[10px] px-2 py-0.5 border border-blue-200 font-semibold">
              WINDOW: 24H REALTIME
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#4B5563' }} />
                <YAxis tickFormatter={formatLakhs} tick={{ fontSize: 10, fill: '#4B5563' }} />
                <Tooltip 
                  formatter={(value: any) => [`₹ ${value ?? 0} Lakhs`, 'Amount']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D1D5DB', fontSize: '11px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="actualLakhs" 
                  name="Actual Confirmed Layering (₹ L)" 
                  stroke="#003366" 
                  fill="#003366" 
                  fillOpacity={0.2}
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="predictedLakhs" 
                  name="Predicted Cash Out Window (₹ L)" 
                  stroke="#B91C1C" 
                  fill="#B91C1C" 
                  fillOpacity={0.15}
                  strokeDasharray="4 4"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fraud Category Volume & Capital Loss (5 cols) */}
        <div className="lg:col-span-5 gov-card">
          <div className="flex items-center justify-between border-b border-gov-border pb-2 mb-3">
            <div>
              <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center">
                <Landmark className="w-4 h-4 mr-1.5 text-gov-saffron-dark" />
                Fraud Category Distribution & Loss (₹ Cr)
              </h3>
              <p className="text-[10px] text-gov-text-muted">
                Categorized by NCRP complaint type
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-gov-navy">
              TOTAL: ₹ 71.1 Cr
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryCounts} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#4B5563' }} />
                <YAxis dataKey="category" type="category" tick={{ fontSize: 9, fill: '#003366' }} width={110} />
                <Tooltip 
                  formatter={(val: any) => [`₹ ${val ?? 0} Crore`, 'Capital at Risk']}
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#D1D5DB', fontSize: '11px' }}
                />
                <Bar dataKey="valueCr" name="Capital Loss (₹ Cr)" radius={[0, 2, 2, 0]}>
                  {categoryCounts.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: High-Risk ATM Hotspots & Live Incident Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* High-Risk ATM Hotspots Matrix (6 cols) */}
        <div className="lg:col-span-6 gov-card">
          <div className="flex items-center justify-between border-b border-gov-border pb-2 mb-3">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center">
              <MapPin className="w-4 h-4 mr-1.5 text-gov-red" />
              High-Risk ATM Withdrawal Hotspots (Predicted 4H Window)
            </h3>
            <span className="gov-badge gov-badge-critical text-[10px]">
              CRITICAL MONITORING
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Zone / Region</th>
                  <th>State / District</th>
                  <th>Primary Bank</th>
                  <th>Density Score</th>
                  <th>Est. Outflow</th>
                </tr>
              </thead>
              <tbody>
                {riskZones.map((zone) => (
                  <tr key={zone.id}>
                    <td className="font-bold text-gov-navy">
                      <div className="flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                          zone.riskLevel === 'CRITICAL' ? 'bg-gov-red' : 'bg-gov-amber'
                        }`}></span>
                        {zone.zoneName}
                      </div>
                    </td>
                    <td className="text-gov-text-muted">{zone.state}</td>
                    <td className="font-mono">SBI / PNB / HDFC</td>
                    <td className="font-mono font-bold text-gov-red">{zone.atmDensityScore} / 100</td>
                    <td className="font-mono font-bold text-gov-navy">₹ {zone.predictedWithdrawalCr} Cr</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Complaint Queue for Quick Action (6 cols) */}
        <div className="lg:col-span-6 gov-card">
          <div className="flex items-center justify-between border-b border-gov-border pb-2 mb-3">
            <h3 className="text-xs font-bold text-gov-navy uppercase tracking-wider flex items-center">
              <AlertCircle className="w-4 h-4 mr-1.5 text-gov-amber" />
              Priority Incident Feed (Immediate LEA Action)
            </h3>
            <span className="text-[10px] font-mono text-gov-text-muted">
              SHOWING TOP {complaints.slice(0, 4).length} CRITICAL
            </span>
          </div>

          <div className="space-y-2">
            {complaints.slice(0, 4).map((c) => (
              <div 
                key={c.caseRef}
                className="bg-gov-bg p-2.5 rounded-sm border border-gov-border hover:border-gov-navy transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-gov-navy text-xs">
                      {c.caseRef}
                    </span>
                    <span className="gov-badge gov-badge-neutral text-[9px]">
                      {c.fraudCategory}
                    </span>
                    <span className="text-[10px] font-mono text-gov-red font-bold">
                      RISK: {c.riskScore}%
                    </span>
                  </div>
                  <div className="text-[11px] text-gov-text-muted mt-0.5 flex items-center space-x-3">
                    <span>Mule: <strong className="font-mono text-gov-navy">{c.muleBank} ({c.muleBranchCity})</strong></span>
                    <span>Target ATM: <strong className="text-gov-navy">{c.atmTargetLocation}</strong></span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-mono font-bold text-gov-navy text-xs">
                    ₹ {(c.victimAmount / 100000).toFixed(2)} Lakhs
                  </div>
                  <button 
                    onClick={() => onSelectCase(c.caseRef)}
                    className="gov-btn-primary py-0.5 px-2 text-[10px] mt-1"
                  >
                    Inspect <ArrowUpRight className="w-3 h-3 ml-0.5 inline" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
