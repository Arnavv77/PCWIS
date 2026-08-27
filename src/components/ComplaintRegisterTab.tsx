import React, { useState, useMemo, useEffect } from 'react';
import type { Complaint, CaseStatus } from '../types/pcwis';
import { Search, Eye, Lock, Send, FileSpreadsheet, FileText } from 'lucide-react';

interface ComplaintRegisterTabProps {
  complaints: Complaint[];
  onInitiateFreeze: (complaint: Complaint) => void;
  onDispatchUnit: (complaint: Complaint) => void;
  onViewDetails: (complaint: Complaint) => void;
}

export const ComplaintRegisterTab: React.FC<ComplaintRegisterTabProps> = ({
  complaints,
  onInitiateFreeze,
  onDispatchUnit,
  onViewDetails
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [apiComplaints, setApiComplaints] = useState<Complaint[]>(complaints);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedStatus !== 'ALL') params.set('status', selectedStatus);

    fetch(`http://127.0.0.1:8000/complaints?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setApiComplaints(data);
        }
      })
      .catch((err) => {
        console.error('Error fetching live complaints API:', err);
      });
  }, [searchTerm, selectedStatus]);

  // Sync prop changes if available
  useEffect(() => {
    if (complaints && complaints.length > 0) {
      setApiComplaints(complaints);
    }
  }, [complaints]);

  // Filter complaints using useMemo over apiComplaints
  const filteredComplaints = useMemo(() => {
    const sourceList = apiComplaints.length > 0 ? apiComplaints : complaints;
    return sourceList.filter((c) => {
      const caseRefStr = c.caseRef || (c as any).caseReferenceNo || '';
      const stateStr = c.stateUT || (c as any).stateUt || '';
      const districtStr = c.district || '';
      const bankStr = c.muleBank || (c as any).bankName || '';
      const accStr = c.muleAccountRef || (c as any).linkedAccountReference || '';
      const catStr = c.fraudCategory || '';
      const synStr = c.associatedSyndicate || '';

      const matchesSearch =
        caseRefStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stateStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        districtStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bankStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        accStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        catStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
        synStr.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus || c.status?.toUpperCase() === selectedStatus.toUpperCase();
      const matchesCategory = selectedCategory === 'ALL' || c.fraudCategory === selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [apiComplaints, complaints, searchTerm, selectedStatus, selectedCategory]);

  const getStatusBadge = (status: CaseStatus) => {
    switch (status) {
      case 'UNDER_INVESTIGATION':
        return <span className="gov-badge gov-badge-warning">UNDER INVESTIGATION</span>;
      case 'BANK_FREEZE_INITIATED':
        return <span className="gov-badge gov-badge-critical">FREEZE ORDERED</span>;
      case 'FIELD_UNIT_DISPATCHED':
        return <span className="gov-badge bg-blue-100 text-gov-navy border-blue-300">FIELD DISPATCHED</span>;
      case 'CCTV_REQUESTED':
        return <span className="gov-badge bg-purple-100 text-purple-900 border-purple-300">CCTV REQUISITION</span>;
      case 'FUNDS_SECURED':
        return <span className="gov-badge gov-badge-success font-bold">FUNDS SECURED</span>;
      default:
        return <span className="gov-badge gov-badge-neutral">{status}</span>;
    }
  };

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Export Microsoft Word Document (.doc file that opens directly in MS Word / WordPad)
  const handleExportWordDoc = () => {
    const timeStr = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    const totalCapital = filteredComplaints.reduce((acc, c) => acc + c.victimAmount, 0);
    const highRiskCount = filteredComplaints.filter(c => c.riskScore >= 90).length;
    const medRiskCount = filteredComplaints.filter(c => c.riskScore >= 70 && c.riskScore < 90).length;
    const lowRiskCount = filteredComplaints.filter(c => c.riskScore < 70).length;

    const docHeader = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>MHA I4C - Official Complaint Register Document</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page WordSection1 { size: 11.0in 8.5in; mso-page-orientation: landscape; margin: 0.5in 0.5in 0.5in 0.5in; }
          div.WordSection1 { page: WordSection1; }
          body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; font-size: 10pt; color: #1E293B; }
          .header-title { background-color: #003366; color: #FFFFFF; font-weight: bold; padding: 12px; text-align: center; font-size: 15pt; }
          .sub-title { background-color: #F1F5F9; color: #003366; font-weight: bold; padding: 6px; font-size: 10pt; border-bottom: 2px solid #003366; margin-bottom: 10px; }
          .kpi-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
          .kpi-table td { border: 1px solid #CBD5E1; padding: 6px; background-color: #F8FAFC; text-align: center; }
          .kpi-label { font-size: 8pt; color: #64748B; font-weight: bold; text-transform: uppercase; }
          .kpi-val { font-size: 12pt; font-weight: bold; color: #003366; font-family: monospace; }
          table.data-table { width: 100%; border-collapse: collapse; }
          table.data-table th { background-color: #003366; color: #FFFFFF; font-weight: bold; border: 1px solid #002244; padding: 6px; font-size: 8.5pt; text-transform: uppercase; text-align: left; }
          table.data-table td { border: 1px solid #CBD5E1; padding: 5px; font-size: 8pt; vertical-align: top; }
          table.data-table tr:nth-child(even) { background-color: #F8FAFC; }
          .risk-high { background-color: #FEE2E2; color: #991B1B; font-weight: bold; padding: 2px 4px; border: 1px solid #FCA5A5; text-align: center; }
          .risk-med { background-color: #FEF3C7; color: #92400E; font-weight: bold; padding: 2px 4px; border: 1px solid #FCD34D; text-align: center; }
          .risk-low { background-color: #D1FAE5; color: #065F46; font-weight: bold; padding: 2px 4px; border: 1px solid #6EE7B7; text-align: center; }
          .footer-text { margin-top: 15px; text-align: center; font-size: 8pt; font-family: monospace; color: #64748B; border-top: 1px solid #CBD5E1; padding-top: 6px; }
        </style>
      </head>
      <body>
        <div class="WordSection1">
          <div class="header-title">
            MINISTRY OF HOME AFFAIRS (MHA) &bull; GOVERNMENT OF INDIA
          </div>
          <div class="sub-title">
            INDIAN CYBERCRIME COORDINATION CENTRE (I4C) — NATIONAL CYBERCRIME COMPLAINT REGISTER<br/>
            Report Date: ${timeStr} IST | Total Complaints: ${filteredComplaints.length} | Section 102 BNSS / CrPC Compliant
          </div>

          <table class="kpi-table">
            <tr>
              <td>
                <div class="kpi-label">Total Case Dossiers</div>
                <div class="kpi-val">${filteredComplaints.length} Cases</div>
              </td>
              <td>
                <div class="kpi-label">Total Capital Defrauded</div>
                <div class="kpi-val">₹ ${(totalCapital / 100000).toFixed(2)} Lakhs</div>
              </td>
              <td>
                <div class="kpi-label">Critical High Risk Cases</div>
                <div class="kpi-val" style="color: #DC2626;">${highRiskCount} Critical (&ge;90%)</div>
              </td>
              <td>
                <div class="kpi-label">Moderate & Low Risk Cases</div>
                <div class="kpi-val" style="color: #D97706;">${medRiskCount + lowRiskCount} Monitored</div>
              </td>
            </tr>
          </table>

          <table class="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Case Ref</th>
                <th>Date/Time (IST)</th>
                <th>Fraud Category</th>
                <th>State / UT (District)</th>
                <th>Victim Amount</th>
                <th>Mule Bank (Account Ref)</th>
                <th>Target ATM Location</th>
                <th>Predicted Window</th>
                <th>Score</th>
                <th>Risk Rating</th>
                <th>Status</th>
                <th>Linked IMEI</th>
                <th>Syndicate Network</th>
              </tr>
            </thead>
            <tbody>
              ${filteredComplaints.map((c, i) => {
                const riskTier = c.riskScore >= 90 ? 'HIGH RISK' : c.riskScore >= 70 ? 'MEDIUM RISK' : 'LOW RISK';
                const badgeClass = c.riskScore >= 90 ? 'risk-high' : c.riskScore >= 70 ? 'risk-med' : 'risk-low';
                return `
                  <tr>
                    <td>${i + 1}</td>
                    <td style="font-weight: bold; color: #003366; font-family: monospace;">${c.caseRef}</td>
                    <td style="font-family: monospace;">${c.timestamp}</td>
                    <td style="font-weight: bold;">${c.fraudCategory}</td>
                    <td>${c.stateUT} (${c.district})</td>
                    <td style="font-weight: bold; color: #003366; font-family: monospace;">₹ ${c.victimAmount.toLocaleString('en-IN')}</td>
                    <td><b>${c.muleBank}</b><br/><span style="font-family: monospace; color:#64748B;">${c.muleAccountRef}</span></td>
                    <td><b>${c.atmTargetLocation}</b></td>
                    <td style="color: #B91C1C; font-weight: bold; font-family: monospace;">${c.predictedTimeWindow}</td>
                    <td style="font-weight: bold; font-family: monospace;">${c.riskScore}%</td>
                    <td class="${badgeClass}">${riskTier}</td>
                    <td>${c.status.replace(/_/g, ' ')}</td>
                    <td style="font-family: monospace;">${c.linkedIMEI}</td>
                    <td>${c.associatedSyndicate}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>

          <div class="footer-text">
            THIS IS AN OFFICIAL IMMUTABLE LAW ENFORCEMENT REGISTER DOCUMENT &bull; GENERATED FROM MHA I4C PCWIS PLATFORM &bull; FOR OFFICIAL USE ONLY
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + docHeader], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MHA_I4C_Official_Complaint_Register_${new Date().toISOString().slice(0,10)}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Robust Tabular CSV Export with UTF-8 BOM for immediate double-click opening in Excel / Sheets
  const handleExportCSV = () => {
    const headers = [
      "S.No",
      "Case Reference No",
      "Timestamp (IST)",
      "Fraud Category",
      "State / UT",
      "District",
      "Victim Defrauded Amount (INR)",
      "Mule Bank Name",
      "Mule Account Ref",
      "Mule Branch City",
      "Target ATM Kiosk Location",
      "Predicted Time Window",
      "Risk Score (%)",
      "Risk Level Rating",
      "Case Status",
      "Linked IMEI Device",
      "Originating IP Address",
      "Associated Syndicate Grid"
    ];

    const escapeCSV = (val: string | number) => {
      const str = String(val ?? '');
      return `"${str.replace(/"/g, '""')}"`;
    };

    const rows = filteredComplaints.map((c, idx) => [
      idx + 1,
      escapeCSV(c.caseRef),
      escapeCSV(c.timestamp),
      escapeCSV(c.fraudCategory),
      escapeCSV(c.stateUT),
      escapeCSV(c.district),
      c.victimAmount,
      escapeCSV(c.muleBank),
      escapeCSV(c.muleAccountRef),
      escapeCSV(c.muleBranchCity),
      escapeCSV(c.atmTargetLocation),
      escapeCSV(c.predictedTimeWindow),
      c.riskScore,
      escapeCSV(c.riskScore >= 90 ? "HIGH RISK" : c.riskScore >= 70 ? "MEDIUM RISK" : "LOW RISK"),
      escapeCSV(c.status),
      escapeCSV(c.linkedIMEI),
      escapeCSV(c.ipAddress),
      escapeCSV(c.associatedSyndicate)
    ]);

    const csvLines = [headers.join(","), ...rows.map(row => row.join(","))];
    const csvString = "\uFEFF" + csvLines.join("\r\n");

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MHA_I4C_Official_Complaint_Register_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  };

  return (
    <div className="gov-card space-y-4">
      {/* Table Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gov-border pb-3">
        <div>
          <h2 className="text-xs sm:text-sm font-bold text-gov-navy uppercase tracking-wider flex items-center">
            NATIONAL CYBERCRIME COMPLAINT REGISTER — CASH WITDRAWAL INTELLIGENCE
          </h2>
          <p className="text-[10px] sm:text-[11px] text-gov-text-muted">
            Official central database of flagged complaints with automated predictive cash-withdrawal scoring
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleExportCSV}
            className="gov-btn-primary px-3.5 py-2 sm:py-1.5 text-xs font-bold flex items-center justify-center shadow-xs w-full sm:w-auto"
            title="Download full complaint register dataset (.csv) for Excel"
          >
            <FileSpreadsheet className="w-4 h-4 mr-1.5 shrink-0" />
            Export Register (CSV Table)
          </button>
          <button
            onClick={handleExportWordDoc}
            className="gov-btn-secondary px-3 py-2 sm:py-1.5 text-xs font-semibold flex items-center justify-center w-full sm:w-auto"
            title="Download Word Document (.doc file that opens directly in MS Word/WordPad)"
          >
            <FileText className="w-3.5 h-3.5 mr-1 text-gov-navy shrink-0" />
            Word Document (.DOC)
          </button>
        </div>
      </div>

      {/* Filter & Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-2.5 sm:gap-3 bg-gov-bg p-2.5 rounded-sm border border-gov-border text-xs">
        {/* Search Input (5 cols) */}
        <div className="sm:col-span-2 md:col-span-5 relative">
          <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
            <Search className="w-3.5 h-3.5 text-gov-text-muted shrink-0" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Case Ref, State, Bank, Mule Account, Category..."
            className="w-full pl-8 pr-3 py-2 sm:py-1.5 bg-white border border-gov-border rounded-sm text-xs font-mono focus:outline-none focus:border-gov-navy"
          />
        </div>

        {/* Status Filter Dropdown (4 cols) */}
        <div className="sm:col-span-1 md:col-span-4 flex items-center space-x-2">
          <label className="text-[10px] font-bold text-gov-text-muted uppercase whitespace-nowrap shrink-0">
            Status:
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-white border border-gov-border rounded-sm py-2 sm:py-1.5 px-2 text-xs focus:outline-none focus:border-gov-navy font-medium"
          >
            <option value="ALL">ALL STATUSES ({complaints.length})</option>
            <option value="UNDER_INVESTIGATION">UNDER INVESTIGATION</option>
            <option value="BANK_FREEZE_INITIATED">BANK FREEZE ORDERED</option>
            <option value="FIELD_UNIT_DISPATCHED">FIELD DISPATCHED</option>
            <option value="CCTV_REQUESTED">CCTV REQUISITION</option>
            <option value="FUNDS_SECURED">FUNDS SECURED</option>
          </select>
        </div>

        {/* Category Filter (3 cols) */}
        <div className="sm:col-span-1 md:col-span-3 flex items-center space-x-2">
          <label className="text-[10px] font-bold text-gov-text-muted uppercase whitespace-nowrap shrink-0">
            Category:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-white border border-gov-border rounded-sm py-2 sm:py-1.5 px-2 text-xs focus:outline-none focus:border-gov-navy font-medium"
          >
            <option value="ALL">ALL CATEGORIES</option>
            <option value="Digital Arrest Scam">Digital Arrest Scam</option>
            <option value="Part-Time Job Fraud">Part-Time Job Fraud</option>
            <option value="Investment Fraud">Investment Fraud</option>
            <option value="ATM Cash Layering">ATM Cash Layering</option>
            <option value="UPI Phishing">UPI Phishing</option>
            <option value="KYC Update Scam">KYC Update Scam</option>
          </select>
        </div>
      </div>

      {/* Main Register Data Table */}
      <div className="overflow-x-auto border border-gov-border rounded-sm scrollbar-thin">
        <table className="gov-table">
          <thead>
            <tr>
              <th>Case Reference No.</th>
              <th>Date / Time (IST)</th>
              <th>Fraud Category</th>
              <th>State / UT</th>
              <th>Linked Mule Account</th>
              <th>Victim Amount</th>
              <th>Risk Score</th>
              <th>Status</th>
              <th className="text-center">Action Directives</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-6 text-gov-text-muted italic">
                  No case records found matching your search query.
                </td>
              </tr>
            ) : (
              filteredComplaints.map((c) => (
                <tr key={c.caseRef} className="hover:bg-blue-50/40 transition-colors">
                  {/* Case Ref */}
                  <td className="font-mono font-bold text-gov-navy text-xs whitespace-nowrap">
                    {c.caseRef}
                  </td>

                  {/* Timestamp */}
                  <td className="font-mono text-[11px] text-gov-text-muted whitespace-nowrap">
                    {c.timestamp}
                  </td>

                  {/* Category */}
                  <td className="font-semibold text-gov-navy">
                    {c.fraudCategory}
                  </td>

                  {/* State */}
                  <td className="text-gov-text">
                    <span className="font-medium">{c.stateUT}</span>
                    <div className="text-[10px] text-gov-text-muted">{c.district}</div>
                  </td>

                  {/* Linked Mule */}
                  <td>
                    <div className="font-mono text-xs font-bold text-gov-navy">{c.muleBank}</div>
                    <div className="font-mono text-[10px] text-gov-text-muted">{c.muleAccountRef}</div>
                  </td>

                  {/* Amount */}
                  <td className="font-mono font-bold text-gov-navy text-xs whitespace-nowrap">
                    {formatINR(c.victimAmount)}
                  </td>

                  {/* Risk Score */}
                  <td>
                    <div className="flex items-center space-x-1">
                      <span className={`font-mono font-bold text-xs ${
                        c.riskScore >= 90 ? 'text-gov-red' : c.riskScore >= 80 ? 'text-gov-amber' : 'text-gov-navy'
                      }`}>
                        {c.riskScore}%
                      </span>
                      <div className="w-12 bg-gray-200 h-1.5 rounded-sm overflow-hidden">
                        <div 
                          className={`h-full ${
                            c.riskScore >= 90 ? 'bg-gov-red' : c.riskScore >= 80 ? 'bg-gov-amber' : 'bg-gov-navy'
                          }`}
                          style={{ width: `${c.riskScore}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    {getStatusBadge(c.status)}
                  </td>

                  {/* Actions */}
                  <td className="text-center">
                    <div className="flex items-center justify-center space-x-1.5">
                      <button
                        onClick={() => onViewDetails(c)}
                        title="View Complete Case Dossier"
                        className="gov-btn-secondary p-2 text-xs min-w-[36px] min-h-[36px] flex items-center justify-center touch-manipulation"
                      >
                        <Eye className="w-4 h-4 text-gov-navy" />
                      </button>

                      <button
                        onClick={() => onInitiateFreeze(c)}
                        title="Issue Bank Lien / Freeze Directive"
                        className="gov-btn-danger p-2 text-xs min-w-[36px] min-h-[36px] flex items-center justify-center touch-manipulation"
                      >
                        <Lock className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDispatchUnit(c)}
                        title="Dispatch Mobile Patrol Unit"
                        className="gov-btn-primary p-2 text-xs min-w-[36px] min-h-[36px] flex items-center justify-center touch-manipulation"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info Strip */}
      <div className="flex items-center justify-between text-[11px] text-gov-text-muted pt-2 border-t border-gov-border font-mono">
        <span>SHOWING {filteredComplaints.length} OF {complaints.length} CASE DOSSIERS</span>
        <span>SECTION 102 BNSS COMPLIANT CENTRAL REGISTER</span>
      </div>
    </div>
  );
};
