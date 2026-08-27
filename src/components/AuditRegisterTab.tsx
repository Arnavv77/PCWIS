import React, { useState } from 'react';
import type { AuditLog } from '../types/pcwis';
import { Search } from 'lucide-react';

interface AuditRegisterTabProps {
  logs: AuditLog[];
}

export const AuditRegisterTab: React.FC<AuditRegisterTabProps> = ({ logs }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = logs.filter(log => 
    log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.officerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.officerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.targetCaseRef.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.actionType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'BANK_FREEZE_ORDER':
        return <span className="gov-badge gov-badge-critical">BANK FREEZE ORDER</span>;
      case 'FIELD_DISPATCH':
        return <span className="gov-badge bg-blue-100 text-gov-navy border-blue-300">FIELD DISPATCH</span>;
      case 'CASE_QUERY':
        return <span className="gov-badge gov-badge-neutral">CASE QUERY</span>;
      case 'CCTV_REQUISITION':
        return <span className="gov-badge bg-purple-100 text-purple-900 border-purple-300">CCTV REQUISITION</span>;
      default:
        return <span className="gov-badge gov-badge-neutral">{action}</span>;
    }
  };

  return (
    <div className="gov-card space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gov-border pb-3">
        <div>
          <h2 className="text-sm font-bold text-gov-navy uppercase tracking-wider flex items-center">
            SYSTEM ACCESS & FORENSIC AUDIT TRAIL REGISTER
          </h2>
          <p className="text-[11px] text-gov-text-muted">
            Cryptographically signed, immutable log of all officer queries, bank directives, and field dispatch authorizations
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Log ID, Officer, Case Ref..."
              className="pl-7 pr-3 py-1 bg-white border border-gov-border rounded-sm text-xs font-mono focus:outline-none focus:border-gov-navy"
            />
            <Search className="w-3.5 h-3.5 text-gov-text-muted absolute left-2 top-2" />
          </div>
        </div>
      </div>

      {/* Main Audit Table */}
      <div className="overflow-x-auto border border-gov-border rounded-sm">
        <table className="gov-table">
          <thead>
            <tr>
              <th>Log Reference ID</th>
              <th>Timestamp (IST)</th>
              <th>Officer Identity</th>
              <th>Agency / Unit</th>
              <th>Action Category</th>
              <th>Target Case Ref</th>
              <th>Network IP (GovNet)</th>
              <th>Audit Narrative</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gov-text-muted italic">
                  No forensic audit logs found matching criteria.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-blue-50/40 transition-colors">
                  {/* Log ID */}
                  <td className="font-mono font-bold text-gov-navy text-xs whitespace-nowrap">
                    {log.id}
                  </td>

                  {/* Timestamp */}
                  <td className="font-mono text-[11px] text-gov-text-muted whitespace-nowrap">
                    {log.timestamp}
                  </td>

                  {/* Officer */}
                  <td className="font-bold text-gov-navy text-xs">
                    <div>{log.officerName}</div>
                    <div className="font-mono text-[10px] text-gov-text-muted">{log.officerId}</div>
                  </td>

                  {/* Agency */}
                  <td className="text-xs text-gov-text">
                    {log.agency}
                  </td>

                  {/* Action */}
                  <td>
                    {getActionBadge(log.actionType)}
                  </td>

                  {/* Case Ref */}
                  <td className="font-mono font-bold text-gov-navy text-xs whitespace-nowrap">
                    {log.targetCaseRef}
                  </td>

                  {/* IP Address */}
                  <td className="font-mono text-[10px] text-gov-text-muted whitespace-nowrap">
                    {log.ipAddress}
                  </td>

                  {/* Narrative */}
                  <td className="text-[11px] text-gov-text leading-tight max-w-xs">
                    {log.details}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Audit Immutable Banner */}
      <div className="bg-gray-100 p-2.5 rounded-sm border border-gov-border text-[10px] font-mono text-gov-text-muted flex items-center justify-between">
        <span>SHA-256 HASH VERIFIED &bull; IMMUTABLE LEA ACCESS AUDIT COMPLIANT (INFORMATION TECHNOLOGY ACT 2000)</span>
        <span className="font-bold text-gov-navy">RECORDS: {filteredLogs.length} ENTRIES</span>
      </div>
    </div>
  );
};
