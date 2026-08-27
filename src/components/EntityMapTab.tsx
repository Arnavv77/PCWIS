import React, { useState } from 'react';
import type { Complaint } from '../types/pcwis';
import { User, CreditCard, Smartphone, MapPin } from 'lucide-react';

interface EntityMapTabProps {
  complaints: Complaint[];
}

export const EntityMapTab: React.FC<EntityMapTabProps> = ({ complaints }) => {
  const [selectedCaseRef, setSelectedCaseRef] = useState<string>(complaints[0]?.caseRef || '');
  const [selectedNode, setSelectedNode] = useState<string>('mule_account');

  const currentCase = complaints.find(c => c.caseRef === selectedCaseRef) || complaints[0];

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="gov-card space-y-4">
      {/* Header & Case Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gov-border pb-3">
        <div>
          <h2 className="text-sm font-bold text-gov-navy uppercase tracking-wider flex items-center">
            ENTITY RELATIONSHIP & FINANCIAL FLOW DIAGRAM
          </h2>
          <p className="text-[11px] text-gov-text-muted">
            Structured forensic trace: Victim Deposit &bull; Tier-1 Mule Account &bull; Device / IP Footprint &bull; ATM Cash Layering
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-xs font-bold text-gov-navy uppercase">Select Case Ref:</label>
          <select
            value={selectedCaseRef}
            onChange={(e) => setSelectedCaseRef(e.target.value)}
            className="bg-white border border-gov-border rounded-sm py-1 px-3 text-xs font-mono font-bold text-gov-navy focus:outline-none focus:border-gov-navy"
          >
            {complaints.map(c => (
              <option key={c.caseRef} value={c.caseRef}>
                {c.caseRef} ({c.fraudCategory})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Flow Canvas & Inspection Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Flow Diagram (8 cols) */}
        <div className="lg:col-span-8 bg-gov-bg p-4 rounded-sm border border-gov-border">
          <div className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-4 pb-2 border-b border-gov-border flex items-center justify-between">
            <span>Official Flow Architecture — {currentCase.caseRef}</span>
            <span className="gov-badge gov-badge-neutral font-mono">
              CONFIDENCE: {currentCase.riskScore}%
            </span>
          </div>

          {/* Org-chart / Flow Diagram Nodes */}
          <div className="space-y-6">
            {/* Step 1: Victim Source */}
            <div className="flex items-center justify-center">
              <div 
                onClick={() => setSelectedNode('victim')}
                className={`w-72 bg-white border-2 p-3 rounded-sm shadow-sm cursor-pointer transition-all ${
                  selectedNode === 'victim' ? 'border-gov-navy ring-1 ring-gov-navy' : 'border-gov-border hover:border-gray-400'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-gov-navy border-b border-gray-100 pb-1 mb-1">
                  <span className="flex items-center">
                    <User className="w-4 h-4 mr-1 text-gov-navy-light" />
                    VICTIM SOURCE NODE
                  </span>
                  <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 font-mono text-gov-text">COMPLAINANT</span>
                </div>
                <div className="text-xs space-y-0.5">
                  <div className="text-gov-text font-medium">{currentCase.district}, {currentCase.stateUT}</div>
                  <div className="font-mono text-gov-red font-bold">Loss: {formatINR(currentCase.victimAmount)}</div>
                  <div className="text-[10px] text-gov-text-muted">Channel: UPI / RTGS Online Banking</div>
                </div>
              </div>
            </div>

            {/* Connecting Arrow 1 */}
            <div className="flex flex-col items-center justify-center text-gov-navy">
              <div className="h-4 w-0.5 bg-gov-navy"></div>
              <div className="bg-blue-50 border border-blue-200 px-3 py-0.5 text-[10px] font-mono text-gov-navy rounded-sm font-semibold flex items-center my-0.5">
                IMPS / UPI Deposit Transaction &bull; Instant Layering
              </div>
              <div className="h-4 w-0.5 bg-gov-navy"></div>
            </div>

            {/* Step 2: Tier-1 Mule Account */}
            <div className="flex items-center justify-center">
              <div 
                onClick={() => setSelectedNode('mule_account')}
                className={`w-80 bg-white border-2 p-3 rounded-sm shadow-sm cursor-pointer transition-all ${
                  selectedNode === 'mule_account' ? 'border-gov-navy ring-1 ring-gov-navy' : 'border-gov-border hover:border-gray-400'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-gov-navy border-b border-gray-100 pb-1 mb-1">
                  <span className="flex items-center">
                    <CreditCard className="w-4 h-4 mr-1 text-gov-amber" />
                    MULE ACCOUNT (TIER-1 LIEN TARGET)
                  </span>
                  <span className="gov-badge gov-badge-critical text-[9px]">SEC 102 BNSS</span>
                </div>
                <div className="text-xs space-y-0.5">
                  <div className="font-mono font-bold text-gov-navy">{currentCase.muleBank}</div>
                  <div className="font-mono text-gov-text text-[11px]">A/C: {currentCase.muleAccountRef}</div>
                  <div className="text-[10px] text-gov-text-muted">Branch: {currentCase.muleBranchCity}</div>
                </div>
              </div>
            </div>

            {/* Connecting Split Arrows */}
            <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
              <div className="flex flex-col items-center">
                <div className="h-4 w-0.5 bg-gov-navy"></div>
                <div className="bg-amber-50 border border-amber-200 px-2 py-0.5 text-[9px] font-mono text-gov-amber font-bold rounded-sm">
                  Device IMEI Correlation
                </div>
                <div className="h-4 w-0.5 bg-gov-navy"></div>
              </div>
              <div className="flex flex-col items-center">
                <div className="h-4 w-0.5 bg-gov-navy"></div>
                <div className="bg-red-50 border border-red-200 px-2 py-0.5 text-[9px] font-mono text-gov-red font-bold rounded-sm">
                  Geo ATM Withdrawal Target
                </div>
                <div className="h-4 w-0.5 bg-gov-navy"></div>
              </div>
            </div>

            {/* Step 3: Dual Output Nodes (Device & ATM) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {/* Device Node */}
              <div 
                onClick={() => setSelectedNode('device')}
                className={`bg-white border-2 p-3 rounded-sm shadow-sm cursor-pointer transition-all ${
                  selectedNode === 'device' ? 'border-gov-navy ring-1 ring-gov-navy' : 'border-gov-border hover:border-gray-400'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-gov-navy border-b border-gray-100 pb-1 mb-1">
                  <span className="flex items-center">
                    <Smartphone className="w-4 h-4 mr-1 text-gov-navy" />
                    FLAGGED DEVICE / IMEI
                  </span>
                  <span className="text-[10px] font-mono text-gov-text-muted">CEIR LINKED</span>
                </div>
                <div className="text-xs space-y-0.5 font-mono">
                  <div>IMEI: {currentCase.linkedIMEI}</div>
                  <div className="text-[11px] text-gov-text-muted">IP: {currentCase.ipAddress}</div>
                </div>
              </div>

              {/* ATM Location Node */}
              <div 
                onClick={() => setSelectedNode('atm')}
                className={`bg-white border-2 p-3 rounded-sm shadow-sm cursor-pointer transition-all ${
                  selectedNode === 'atm' ? 'border-gov-navy ring-1 ring-gov-navy' : 'border-gov-border hover:border-gray-400'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-gov-navy border-b border-gray-100 pb-1 mb-1">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1 text-gov-red" />
                    PREDICTED ATM OUTLET
                  </span>
                  <span className="gov-badge gov-badge-critical text-[9px]">TARGET</span>
                </div>
                <div className="text-xs space-y-0.5">
                  <div className="font-semibold text-gov-navy">{currentCase.atmTargetLocation}</div>
                  <div className="font-mono text-[10px] text-gov-red font-bold">Window: {currentCase.predictedTimeWindow}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Node Inspection Panel (4 cols) */}
        <div className="lg:col-span-4 gov-card bg-white border border-gov-border">
          <div className="text-xs font-bold text-gov-navy uppercase tracking-wider pb-2 mb-3 border-b border-gov-border flex items-center justify-between">
            <span>FORENSIC NODE INSPECTION</span>
            <span className="text-[10px] font-mono text-gov-navy uppercase">{selectedNode}</span>
          </div>

          {selectedNode === 'mule_account' && (
            <div className="space-y-3 text-xs">
              <div className="bg-blue-50 border border-blue-200 p-2 rounded-sm">
                <div className="font-bold text-gov-navy text-xs">Tier-1 Mule Account Details</div>
                <div className="text-[11px] text-gov-text-muted mt-0.5">Account held in high-vulnerability branch network</div>
              </div>

              <div className="space-y-2 border-t border-b border-gray-200 py-2 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-gov-text-muted">Account Ref:</span>
                  <span className="font-bold text-gov-navy">{currentCase.muleAccountRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gov-text-muted">Banking Entity:</span>
                  <span className="font-semibold text-gov-navy">{currentCase.muleBank}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gov-text-muted">Branch / District:</span>
                  <span>{currentCase.muleBranchCity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gov-text-muted">Lien Status:</span>
                  <span className="text-gov-red font-bold">FREEZE PENDING</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gov-text-muted">Associated Syndicate:</span>
                  <span className="text-gov-navy font-semibold">{currentCase.associatedSyndicate}</span>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <div className="text-[10px] font-bold text-gov-navy uppercase">Legal Directives Available</div>
                <button className="gov-btn-danger w-full text-xs font-bold py-1.5">
                  Issue Immediate Bank Lien (Form 102)
                </button>
                <button className="gov-btn-secondary w-full text-xs font-bold py-1.5">
                  Request KYC & Statement Audit
                </button>
              </div>
            </div>
          )}

          {selectedNode === 'victim' && (
            <div className="space-y-3 text-xs">
              <div className="bg-gray-50 border border-gray-200 p-2 rounded-sm">
                <div className="font-bold text-gov-navy text-xs">Victim Complainant Dossier</div>
                <div className="text-[11px] text-gov-text-muted">NCRP Portal Registered Incident</div>
              </div>

              <div className="space-y-2 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-gov-text-muted">NCRP Case Ref:</span>
                  <span className="font-bold text-gov-navy">{currentCase.caseRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gov-text-muted">Category:</span>
                  <span className="font-semibold">{currentCase.fraudCategory}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gov-text-muted">State / UT:</span>
                  <span>{currentCase.stateUT}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gov-text-muted">Capital Defrauded:</span>
                  <span className="text-gov-red font-bold">{formatINR(currentCase.victimAmount)}</span>
                </div>
              </div>
            </div>
          )}

          {selectedNode === 'device' && (
            <div className="space-y-3 text-xs">
              <div className="bg-gray-50 border border-gray-200 p-2 rounded-sm">
                <div className="font-bold text-gov-navy text-xs">Device & Telecom Intelligence</div>
                <div className="text-[11px] text-gov-text-muted">Cross-referenced against CEIR database</div>
              </div>

              <div className="space-y-2 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-gov-text-muted">IMEI Number:</span>
                  <span className="font-bold text-gov-navy">{currentCase.linkedIMEI}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gov-text-muted">IP Address:</span>
                  <span className="font-bold text-gov-navy">{currentCase.ipAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gov-text-muted">Location Cluster:</span>
                  <span>NH-48 Telecom Corridor</span>
                </div>
              </div>
            </div>
          )}

          {selectedNode === 'atm' && (
            <div className="space-y-3 text-xs">
              <div className="bg-red-50 border border-red-200 p-2 rounded-sm">
                <div className="font-bold text-gov-red text-xs">ATM Cash Withdrawal Outflow Target</div>
                <div className="text-[11px] text-gov-text-muted">High probability predictive cash-out zone</div>
              </div>

              <div className="space-y-2 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-gov-text-muted">Outlet Location:</span>
                  <span className="font-bold text-gov-navy">{currentCase.atmTargetLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gov-text-muted">Time Window:</span>
                  <span className="text-gov-red font-bold">{currentCase.predictedTimeWindow}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gov-text-muted">Risk Score:</span>
                  <span className="text-gov-red font-bold">{currentCase.riskScore}%</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
