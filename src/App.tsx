import { useState, useEffect } from 'react';
import { 
  HeaderBar, 
  KpiStrip, 
  PredictionHeroAdvisory, 
  TabNavigation, 
  type TabType,
  DashboardOverviewTab,
  ComplaintRegisterTab,
  EntityMapTab,
  GeographicRiskTab,
  InterBankTab,
  AuditRegisterTab,
  ActionModal,
  type ModalType,
  Footer
} from './components/index';

import { 
  INITIAL_PREDICTION_ADVISORY, 
  KPI_METRICS, 
  INITIAL_COMPLAINTS, 
  BANK_DIRECTIVES, 
  INITIAL_AUDIT_LOGS, 
  RISK_ZONES 
} from './data/pcwisData';

import type { Complaint, AuditLog, PredictionAdvisory, KpiMetric } from './types/pcwis';

const API_BASE = "http://127.0.0.1:8000";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [kpiMetrics, setKpiMetrics] = useState<KpiMetric[]>(KPI_METRICS);
  const [advisory, setAdvisory] = useState<PredictionAdvisory>(INITIAL_PREDICTION_ADVISORY);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  // 1. Fetch KPI summary from backend
  useEffect(() => {
    fetch(`${API_BASE}/kpi-summary`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setKpiMetrics([
            {
              id: 'total_complaints',
              label: 'Total Flagged Complaints (24H)',
              value: data.totalComplaints24H ?? data.totalComplaints24h ?? 150,
              change: '+14.2%',
              trend: 'up',
              subtitle: 'National Cybercrime Register'
            },
            {
              id: 'active_networks',
              label: 'Active Fraud Syndicates',
              value: data.activeFraudNetworks ?? 14,
              change: '+3.1%',
              trend: 'up',
              subtitle: 'Mewat, Jamtara & South Grids'
            },
            {
              id: 'mule_accounts',
              label: 'Mule Accounts Flagged',
              value: data.muleAccountsFlagged ?? 142,
              change: '+8.4%',
              trend: 'up',
              subtitle: 'RBI Sec 102 BNSS Lien Target'
            },
            {
              id: 'predicted_events',
              label: 'Predicted Cash-Withdrawals',
              value: data.predictedCashWithdrawalEvents ?? 38,
              change: '-5.1%',
              trend: 'down',
              subtitle: '4H Imminent Outflow Window'
            },
            {
              id: 'capital_secured',
              label: 'Capital Secured (24H)',
              value: data.atRiskCapitalSecuredCr ?? 14.85,
              unit: 'Cr',
              change: '+22.5%',
              trend: 'down',
              subtitle: 'Inter-Bank Fast Freeze Lien'
            }
          ]);
        }
      })
      .catch((err) => console.error("Error loading KPI summary:", err));
  }, []);

  // 2. Fetch Complaints list from backend
  useEffect(() => {
    fetch(`${API_BASE}/complaints`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setComplaints(data);
        }
      })
      .catch((err) => console.error("Error loading complaints:", err));
  }, []);

  // 3. Handle live prediction trigger via POST /predict
  const handlePredictAdvisory = async (
    fraudCategory: string,
    victimLat: number,
    victimLng: number,
    amount: number
  ) => {
    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fraudCategory, victimLat, victimLng, amount })
      });
      const data = await res.json();
      if (data) {
        const newAdvisory: PredictionAdvisory = {
          referenceNo: data.advisoryReferenceNo,
          title: `High-Velocity ${fraudCategory} ATM Outflow Cluster`,
          riskLevel: (data.riskClassification?.toUpperCase() as any) || 'CRITICAL',
          targetZone: `Lat: ${data.targetZoneLat?.toFixed(4)}, Lng: ${data.targetZoneLng?.toFixed(4)} (Radius 2.5km)`,
          confidenceScore: data.confidenceScore,
          predictedTimeWindow: `${data.predictedTimeWindowStart?.toFixed(1)}h – ${data.predictedTimeWindowEnd?.toFixed(1)}h Delay Window`,
          estimatedCapitalAtRisk: data.estimatedCapitalAtRisk,
          totalMuleAccountsFlagged: Math.max(4, Math.floor((data.confidenceScore || 70) / 10)),
          explainableFactors: (data.explainableFactors || []).map((f: any) => ({
            factor: f.factor,
            weightPercentage: f.weight,
            description: `ML Feature Weight: ${f.weight}% spatial & temporal contribution.`
          }))
        };

        setAdvisory(newAdvisory);
      }
    } catch (err) {
      console.error("Error submitting prediction request:", err);
    }
  };

  // Trigger modal handlers
  const handleOpenModal = (type: ModalType, complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setActiveModal(type);
  };

  const handleHeroDispatch = () => {
    handleOpenModal('DISPATCH', complaints[0]);
  };

  const handleHeroFreeze = () => {
    handleOpenModal('FREEZE', complaints[0]);
  };

  const handleHeroCCTV = () => {
    handleOpenModal('CCTV', complaints[0]);
  };

  const handleIssueDirectLienFromBank = (bankName: string) => {
    const match = complaints.find(c => c.muleBank.toLowerCase() === bankName.toLowerCase()) || complaints[0];
    handleOpenModal('FREEZE', match);
  };

  const handleSelectCaseFromDashboard = (caseRef: string) => {
    const match = complaints.find(c => c.caseRef === caseRef);
    if (match) {
      setSelectedComplaint(match);
      setActiveTab('register');
    }
  };

  // Confirm action callback to update case status and add audit log entry
  const handleConfirmAction = (actionType: string, complaintRef: string, note: string) => {
    let newStatus: Complaint['status'] = 'UNDER_INVESTIGATION';
    let actionLogType: AuditLog['actionType'] = 'CASE_QUERY';

    if (actionType === 'FREEZE') {
      newStatus = 'BANK_FREEZE_INITIATED';
      actionLogType = 'BANK_FREEZE_ORDER';
    } else if (actionType === 'DISPATCH') {
      newStatus = 'FIELD_UNIT_DISPATCHED';
      actionLogType = 'FIELD_DISPATCH';
    } else if (actionType === 'CCTV') {
      newStatus = 'CCTV_REQUESTED';
      actionLogType = 'CCTV_REQUISITION';
    }

    // Update complaint status
    setComplaints(prev => prev.map(c => {
      if (c.caseRef === complaintRef) {
        return { ...c, status: newStatus };
      }
      return c;
    }));

    // Add new immutable audit log entry
    const newLog: AuditLog = {
      id: `LOG-2026-${Math.floor(88911 + Math.random() * 1000)}`,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
      officerId: 'LEA-ND-8942',
      officerName: 'Insp. R. K. Sharma',
      agency: 'Delhi Police Cyber Cell / I4C Desk',
      actionType: actionLogType,
      targetCaseRef: complaintRef,
      ipAddress: '10.14.88.192 (MHA GovNet)',
      details: note
    };

    setAuditLogs(prev => [newLog, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gov-bg flex flex-col font-sans overflow-x-hidden max-w-full">
      {/* Official Government Header */}
      <HeaderBar />

      {/* Main Container */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-2 sm:px-4 py-2 sm:py-3 overflow-x-hidden">
        {/* Top KPI Metric Strip */}
        <KpiStrip metrics={kpiMetrics} />

        {/* Primary Intelligence Alert Hero Advisory Circular */}
        <PredictionHeroAdvisory 
          advisory={advisory}
          onDispatchFieldUnit={handleHeroDispatch}
          onInitiateBankFreeze={handleHeroFreeze}
          onRequestCCTV={handleHeroCCTV}
          onPredictAdvisory={handlePredictAdvisory}
        />

        {/* Tab Navigation Menu */}
        <TabNavigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          complaintsCount={complaints.length}
          auditCount={auditLogs.length}
        />

        {/* Tab 1: Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <DashboardOverviewTab 
            complaints={complaints}
            riskZones={RISK_ZONES}
            onSelectCase={handleSelectCaseFromDashboard}
          />
        )}

        {/* Tab 2: Complaint Register Table */}
        {activeTab === 'register' && (
          <ComplaintRegisterTab 
            complaints={complaints}
            onInitiateFreeze={(c) => handleOpenModal('FREEZE', c)}
            onDispatchUnit={(c) => handleOpenModal('DISPATCH', c)}
            onViewDetails={(c) => handleOpenModal('DOSSIER', c)}
          />
        )}

        {/* Tab 3: Entity Relationship Map */}
        {activeTab === 'entity_map' && (
          <EntityMapTab complaints={complaints} />
        )}

        {/* Tab 4: Geographic Risk Map */}
        {activeTab === 'geo_map' && (
          <GeographicRiskTab 
            riskZones={RISK_ZONES} 
            complaints={complaints}
            onSelectComplaintAction={(type, c) => handleOpenModal(type, c)} 
          />
        )}

        {/* Tab 5: Inter-Bank Coordination Tracker */}
        {activeTab === 'bank_coordination' && (
          <InterBankTab 
            directives={BANK_DIRECTIVES}
            onIssueDirectLien={handleIssueDirectLienFromBank}
          />
        )}

        {/* Tab 6: Access & Audit Register */}
        {activeTab === 'audit_register' && (
          <AuditRegisterTab logs={auditLogs} />
        )}
      </main>

      {/* Modal Dialog for Official Actions */}
      <ActionModal 
        type={activeModal}
        complaint={selectedComplaint}
        onClose={() => setActiveModal(null)}
        onConfirmAction={handleConfirmAction}
      />

      {/* Official Government Footer */}
      <Footer />
    </div>
  );
}
