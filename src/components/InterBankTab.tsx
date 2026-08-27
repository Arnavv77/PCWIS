import React from 'react';
import type { BankDirective } from '../types/pcwis';
import { Landmark, RefreshCw, CheckCircle2, AlertTriangle, ShieldCheck, Mail } from 'lucide-react';

interface InterBankTabProps {
  directives: BankDirective[];
  onIssueDirectLien: (bankName: string) => void;
}

export const InterBankTab: React.FC<InterBankTabProps> = ({ directives, onIssueDirectLien }) => {
  return (
    <div className="gov-card space-y-4">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gov-border pb-3">
        <div>
          <h2 className="text-sm font-bold text-gov-navy uppercase tracking-wider flex items-center">
            INTER-BANK NODAL COORDINATION & FREEZE PROTOCOL TRACKER (RBI 1930 FRAMEWORK)
          </h2>
          <p className="text-[11px] text-gov-text-muted">
            Direct API & formal Nodal Officer communication hub for automated Lien marking under Sec 102 CrPC / BNSS
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button className="gov-btn-secondary px-3 py-1.5 text-xs font-semibold">
            <RefreshCw className="w-3.5 h-3.5 mr-1 text-gov-navy" />
            Sync Bank API Gateway
          </button>
        </div>
      </div>

      {/* Main Directives Data Table */}
      <div className="overflow-x-auto border border-gov-border rounded-sm">
        <table className="gov-table">
          <thead>
            <tr>
              <th>Banking Entity</th>
              <th>RBI Code</th>
              <th>Reference Directive No.</th>
              <th>Nodal Officer Contact</th>
              <th>Active Lien Count</th>
              <th>Funds Secured (Today)</th>
              <th>Avg Latency</th>
              <th>Gateway Status</th>
              <th className="text-center">Action Protocol</th>
            </tr>
          </thead>
          <tbody>
            {directives.map((b) => (
              <tr key={b.rbiCode} className="hover:bg-blue-50/40 transition-colors">
                {/* Bank Name */}
                <td className="font-bold text-gov-navy text-xs">
                  <div className="flex items-center">
                    <Landmark className="w-4 h-4 mr-1.5 text-gov-navy-light" />
                    {b.bankName}
                  </div>
                </td>

                {/* RBI Code */}
                <td className="font-mono text-xs text-gov-text-muted">
                  {b.rbiCode}
                </td>

                {/* Directive Ref */}
                <td className="font-mono text-xs font-semibold text-gov-navy">
                  {b.referenceNo}
                </td>

                {/* Nodal Officer Contact */}
                <td className="text-[11px] font-mono text-gov-text">
                  <div className="flex items-center">
                    <Mail className="w-3 h-3 mr-1 text-gov-navy" />
                    {b.nodelOfficerContact}
                  </div>
                </td>

                {/* Active Lien Count */}
                <td className="font-mono font-bold text-gov-navy text-xs">
                  {b.activeFreezeCount} Accounts
                </td>

                {/* Funds Secured */}
                <td className="font-mono font-bold text-gov-green text-xs">
                  ₹ {b.fundsSecuredTodayCr.toFixed(2)} Cr
                </td>

                {/* Latency */}
                <td className="font-mono text-xs">
                  <span className={b.avgResponseTimeMin > 20 ? 'text-gov-red font-bold' : 'text-gov-navy font-semibold'}>
                    {b.avgResponseTimeMin} mins
                  </span>
                </td>

                {/* Gateway Status */}
                <td>
                  {b.status === 'OPTIMAL' ? (
                    <span className="gov-badge gov-badge-success flex items-center w-fit">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> OPTIMAL
                    </span>
                  ) : (
                    <span className="gov-badge gov-badge-warning flex items-center w-fit">
                      <AlertTriangle className="w-3 h-3 mr-1" /> DELAY
                    </span>
                  )}
                </td>

                {/* Action */}
                <td className="text-center">
                  <button
                    onClick={() => onIssueDirectLien(b.bankName)}
                    className="gov-btn-primary py-1 px-2.5 text-[10px] font-bold"
                  >
                    Issue Formal Circular
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Inter-Departmental Disclaimer */}
      <div className="bg-gov-bg p-3 rounded-sm border border-gov-border text-xs flex items-center justify-between font-mono">
        <div>
          <span className="font-bold text-gov-navy">RESERVE BANK OF INDIA (RBI) CIRCULAR REGISTRATION:</span>
          <span className="text-gov-text-muted ml-2">DBS.CO.FCCD.BC.No.6/14.01.005/2026-27</span>
        </div>
        <span className="text-gov-green font-bold flex items-center">
          <ShieldCheck className="w-4 h-4 mr-1" /> 100% BANK ENCRYPTION GATEWAY ACTIVE
        </span>
      </div>
    </div>
  );
};
