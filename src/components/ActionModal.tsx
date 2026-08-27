import React, { useState } from 'react';
import type { Complaint } from '../types/pcwis';
import { X, Lock, Send, Video, FileText, CheckCircle2 } from 'lucide-react';

export type ModalType = 'FREEZE' | 'DISPATCH' | 'CCTV' | 'DOSSIER' | null;

interface ActionModalProps {
  type: ModalType;
  complaint: Complaint | null;
  onClose: () => void;
  onConfirmAction: (actionType: string, complaintRef: string, note: string) => void;
}

export const ActionModal: React.FC<ActionModalProps> = ({
  type,
  complaint,
  onClose,
  onConfirmAction
}) => {
  const [officialNote, setOfficialNote] = useState('');
  const [unitCode, setUnitCode] = useState('PATROL-UNIT-14 (NUH-HIGHWAY)');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!type || !complaint) return null;

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmAction(type, complaint.caseRef, officialNote || 'Authorized under Section 102 BNSS / CrPC');
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1500);
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[1px] flex items-center justify-center p-4">
      <div className="bg-white border-2 border-gov-navy rounded-sm max-w-lg w-full shadow-lg overflow-hidden">
        {/* Modal Header */}
        <div className="bg-gov-navy text-white px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider">
            {type === 'FREEZE' && <Lock className="w-4 h-4 text-gov-saffron" />}
            {type === 'DISPATCH' && <Send className="w-4 h-4 text-gov-saffron" />}
            {type === 'CCTV' && <Video className="w-4 h-4 text-gov-saffron" />}
            {type === 'DOSSIER' && <FileText className="w-4 h-4 text-gov-saffron" />}
            <span>
              {type === 'FREEZE' && 'INITIATE BANK FREEZE REQUEST (SEC 102 BNSS)'}
              {type === 'DISPATCH' && 'FIELD PATROL UNIT DISPATCH AUTHORIZATION'}
              {type === 'CCTV' && 'EMERGENCY CCTV REQUISITION NOTICE (SEC 91 CrPC)'}
              {type === 'DOSSIER' && 'COMPLETE NCRP CASE INTELLIGENCE DOSSIER'}
            </span>
          </div>

          <button 
            onClick={onClose}
            className="text-gray-300 hover:text-white text-sm font-bold focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-4 space-y-3">
          {isSuccess ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-gov-green mx-auto" />
              <h3 className="text-base font-bold text-gov-navy uppercase tracking-wide">
                {type === 'FREEZE' && 'BANK FREEZE DIRECTIVE TRANSMITTED'}
                {type === 'DISPATCH' && 'FIELD PATROL UNITS DISPATCHED TO SITE'}
                {type === 'CCTV' && 'EMERGENCY CCTV FOOTAGE ACCESS REQUESTED'}
                {type !== 'FREEZE' && type !== 'DISPATCH' && type !== 'CCTV' && 'ACTION DIRECTIVE TRANSMITTED'}
              </h3>
              <p className="text-xs text-gov-text-muted font-mono px-4">
                {type === 'FREEZE' && 'Formal lien order generated & transmitted via MHA GovNet to RBI Nodal Officers (Sec 102 BNSS).'}
                {type === 'DISPATCH' && 'Mobile Patrol Unit dispatched — requesting units on the site at predicted ATM cluster coordinates.'}
                {type === 'CCTV' && 'Requisition notice under Sec 91 CrPC issued — requesting CCTV footage access from bank branch manager.'}
                {type !== 'FREEZE' && type !== 'DISPATCH' && type !== 'CCTV' && 'Log generated & transmitted via MHA GovNet.'}
              </p>
            </div>
          ) : (
            <>
              {/* Summary Block */}
              <div className="bg-gov-bg p-3 rounded-sm border border-gov-border text-xs space-y-1">
                <div className="flex justify-between font-mono">
                  <span className="text-gov-text-muted">Case Reference:</span>
                  <span className="font-bold text-gov-navy">{complaint.caseRef}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-gov-text-muted">Victim Defrauded Capital:</span>
                  <span className="font-bold text-gov-red">{formatINR(complaint.victimAmount)}</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-gov-text-muted">Target Mule Bank:</span>
                  <span className="font-bold text-gov-navy">{complaint.muleBank} ({complaint.muleAccountRef})</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-gov-text-muted">Predicted ATM Cluster:</span>
                  <span className="font-semibold text-gov-navy">{complaint.atmTargetLocation}</span>
                </div>
              </div>

              {type === 'FREEZE' && (
                <form onSubmit={handleExecute} className="space-y-3 text-xs">
                  <div className="bg-red-50 border border-red-200 p-2 rounded-sm text-[11px] text-gov-red font-semibold">
                    &bull; This directive initiates a formal bank freeze request on target mule account {complaint.muleAccountRef} under Reserve Bank of India 1930 Cybercrime Framework.
                  </div>

                  <div>
                    <label className="font-bold text-gov-navy uppercase block mb-1">
                      Authorizing Officer Note / Order Ref:
                    </label>
                    <textarea
                      required
                      value={officialNote}
                      onChange={(e) => setOfficialNote(e.target.value)}
                      placeholder="Enter legal justification or reference directive number..."
                      className="w-full border border-gov-border rounded-sm p-2 font-mono text-xs focus:outline-none focus:border-gov-navy"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gov-border">
                    <button type="button" onClick={onClose} className="gov-btn-secondary px-3 py-1.5">
                      Cancel
                    </button>
                    <button type="submit" className="gov-btn-danger px-4 py-1.5 font-bold">
                      Transmit Bank Freeze Request Now
                    </button>
                  </div>
                </form>
              )}

              {type === 'DISPATCH' && (
                <form onSubmit={handleExecute} className="space-y-3 text-xs">
                  <div className="bg-blue-50 border border-blue-200 p-2 rounded-sm text-[11px] text-gov-navy font-semibold">
                    &bull; Transmits real-time GPS coordinates of predicted ATM cluster to active field unit.
                  </div>

                  <div>
                    <label className="font-bold text-gov-navy uppercase block mb-1">
                      Assigned Field Patrol Unit:
                    </label>
                    <select
                      value={unitCode}
                      onChange={(e) => setUnitCode(e.target.value)}
                      className="w-full border border-gov-border rounded-sm p-2 text-xs font-mono font-bold text-gov-navy focus:outline-none"
                    >
                      <option value="PATROL-UNIT-14 (NUH-HIGHWAY)">PATROL-UNIT-14 (NUH-HIGHWAY)</option>
                      <option value="PATROL-UNIT-08 (GURUGRAM SECTOR 14)">PATROL-UNIT-08 (GURUGRAM SECTOR 14)</option>
                      <option value="PATROL-UNIT-22 (SOJNA ROAD CELL)">PATROL-UNIT-22 (SOHNA ROAD CELL)</option>
                      <option value="SPECIAL-TASK-FORCE-02">SPECIAL-TASK-FORCE-02 (I4C RAPID RESP)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-gov-navy uppercase block mb-1">
                      Dispatch Operational Instructions:
                    </label>
                    <textarea
                      value={officialNote}
                      onChange={(e) => setOfficialNote(e.target.value)}
                      placeholder="e.g. Monitor ATM kiosk entry, verify suspect IMEIs, intercept physical cash layering..."
                      className="w-full border border-gov-border rounded-sm p-2 font-mono text-xs focus:outline-none focus:border-gov-navy"
                      rows={2}
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gov-border">
                    <button type="button" onClick={onClose} className="gov-btn-secondary px-3 py-1.5">
                      Cancel
                    </button>
                    <button type="submit" className="gov-btn-primary px-4 py-1.5 font-bold">
                      Authorize Patrol Dispatch
                    </button>
                  </div>
                </form>
              )}

              {type === 'CCTV' && (
                <form onSubmit={handleExecute} className="space-y-3 text-xs">
                  <div className="bg-purple-50 border border-purple-200 p-2 rounded-sm text-[11px] text-purple-900 font-semibold">
                    &bull; Generates formal Section 91 CrPC notice to bank branch manager for immediate CCTV footage extraction during window {complaint.predictedTimeWindow}.
                  </div>

                  <div>
                    <label className="font-bold text-gov-navy uppercase block mb-1">
                      Requisition Narrative:
                    </label>
                    <textarea
                      value={officialNote}
                      onChange={(e) => setOfficialNote(e.target.value)}
                      placeholder="Formally requesting high-resolution video logs for investigation of cyber fraud..."
                      className="w-full border border-gov-border rounded-sm p-2 font-mono text-xs focus:outline-none focus:border-gov-navy"
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gov-border">
                    <button type="button" onClick={onClose} className="gov-btn-secondary px-3 py-1.5">
                      Cancel
                    </button>
                    <button type="submit" className="gov-btn-primary px-4 py-1.5 font-bold">
                      Issue Section 91 Requisition
                    </button>
                  </div>
                </form>
              )}

              {type === 'DOSSIER' && (
                <div className="space-y-3 text-xs">
                  <div className="space-y-1.5 border-t border-b border-gray-200 py-2 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-gov-text-muted">Fraud Category:</span>
                      <span className="font-bold text-gov-navy">{complaint.fraudCategory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gov-text-muted">Jurisdiction:</span>
                      <span>{complaint.stateUT} ({complaint.district})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gov-text-muted">Associated IMEI:</span>
                      <span className="font-bold">{complaint.linkedIMEI}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gov-text-muted">Originating IP:</span>
                      <span className="font-bold">{complaint.ipAddress}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gov-text-muted">Syndicate Hub:</span>
                      <span className="text-gov-red font-bold">{complaint.associatedSyndicate}</span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button onClick={onClose} className="gov-btn-primary px-4 py-1.5 font-bold">
                      Close Case Dossier
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
