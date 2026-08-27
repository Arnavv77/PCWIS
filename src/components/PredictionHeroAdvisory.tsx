import React, { useState } from 'react';
import type { PredictionAdvisory } from '../types/pcwis';
import { AlertOctagon, FileText, Send, Lock, Video, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

interface PredictionHeroAdvisoryProps {
  advisory: PredictionAdvisory;
  onDispatchFieldUnit: () => void;
  onInitiateBankFreeze: () => void;
  onRequestCCTV: () => void;
  onPredictAdvisory?: (fraudCategory: string, victimLat: number, victimLng: number, amount: number) => void;
}

export const PredictionHeroAdvisory: React.FC<PredictionHeroAdvisoryProps> = ({
  advisory,
  onDispatchFieldUnit,
  onInitiateBankFreeze,
  onRequestCCTV,
  onPredictAdvisory
}) => {
  const [fraudCategory, setFraudCategory] = useState<string>('Digital Arrest Scam');
  const [victimLat, setVictimLat] = useState<number>(28.6139);
  const [victimLng, setVictimLng] = useState<number>(77.2090);
  const [amount, setAmount] = useState<number>(500000);
  const [isPredicting, setIsPredicting] = useState<boolean>(false);

  const handlePredictionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onPredictAdvisory) {
      setIsPredicting(true);
      await onPredictAdvisory(fraudCategory, Number(victimLat), Number(victimLng), Number(amount));
      setIsPredicting(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <section className="my-3 space-y-3">
      {/* Interactive ML Prediction Simulation Form */}
      <div className="bg-gov-bg p-3 rounded-sm border border-gov-navy flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-gov-saffron-dark animate-pulse" />
          <div>
            <span className="font-bold text-gov-navy uppercase tracking-wider text-[11px] block">
              ML Cash-Out Prediction Generator (POST /predict)
            </span>
            <span className="text-[10px] text-gov-text-muted">
              Submit crime parameters to trigger scikit-learn spatial KernelDensity clustering backend
            </span>
          </div>
        </div>

        <form onSubmit={handlePredictionSubmit} className="flex flex-wrap items-center gap-2">
          <div>
            <label className="text-[9px] font-bold text-gov-text-muted uppercase block">Fraud Category</label>
            <select
              value={fraudCategory}
              onChange={(e) => setFraudCategory(e.target.value)}
              className="bg-white border border-gov-border rounded-sm py-1 px-2 text-xs font-semibold focus:outline-none focus:border-gov-navy"
            >
              <option value="Digital Arrest Scam">Digital Arrest Scam</option>
              <option value="Part-Time Job Fraud">Part-Time Job Fraud</option>
              <option value="UPI Phishing">UPI Phishing</option>
              <option value="ATM Cash Layering">ATM Cash Layering</option>
              <option value="Investment Fraud">Investment Fraud</option>
              <option value="KYC Update Scam">KYC Update Scam</option>
            </select>
          </div>

          <div>
            <label className="text-[9px] font-bold text-gov-text-muted uppercase block">Victim Lat</label>
            <input
              type="number"
              step="0.0001"
              value={victimLat}
              onChange={(e) => setVictimLat(parseFloat(e.target.value) || 0)}
              className="w-24 bg-white border border-gov-border rounded-sm py-1 px-2 text-xs font-mono focus:outline-none focus:border-gov-navy"
            />
          </div>

          <div>
            <label className="text-[9px] font-bold text-gov-text-muted uppercase block">Victim Lng</label>
            <input
              type="number"
              step="0.0001"
              value={victimLng}
              onChange={(e) => setVictimLng(parseFloat(e.target.value) || 0)}
              className="w-24 bg-white border border-gov-border rounded-sm py-1 px-2 text-xs font-mono focus:outline-none focus:border-gov-navy"
            />
          </div>

          <div>
            <label className="text-[9px] font-bold text-gov-text-muted uppercase block">Defrauded Amount (INR)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-28 bg-white border border-gov-border rounded-sm py-1 px-2 text-xs font-mono focus:outline-none focus:border-gov-navy"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isPredicting}
              className="gov-btn-primary bg-gov-navy hover:bg-gov-navy-dark px-3 py-1.5 text-xs font-bold flex items-center shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1 text-gov-saffron" />
              {isPredicting ? 'Running Sklearn...' : 'Run ML Prediction'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white border-2 border-gov-red rounded-sm overflow-hidden shadow-sm">
        {/* Advisory Official Header Strip */}
        <div className="bg-red-50 border-b border-red-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="bg-gov-red text-white p-1 rounded-sm">
              <AlertOctagon className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[10px] font-bold text-gov-red uppercase tracking-wider font-mono">
                OFFICIAL I4C INTELLIGENCE ADVISORY &bull; URGENT LEA ACTION REQUIRED
              </span>
              <div className="text-sm font-bold text-gov-navy flex items-center">
                <FileText className="w-4 h-4 mr-1 text-gov-navy-light" />
                REF NO: <span className="font-mono text-gov-red ml-1">{advisory.referenceNo}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="gov-badge gov-badge-critical text-xs px-2.5 py-1">
              RISK LEVEL: {advisory.riskLevel}
            </span>
            <span className="bg-white border border-red-300 text-gov-navy font-mono px-2 py-0.5 rounded-sm font-semibold">
              CONFIDENCE SCORE: {advisory.confidenceScore}%
            </span>
          </div>
        </div>

        {/* Advisory Body */}
        <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Target Zone & Key Parameters (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <h2 className="text-base font-bold text-gov-navy border-b border-gov-border pb-1 mb-2">
                {advisory.title}
              </h2>
              <p className="text-xs text-gov-text-muted leading-relaxed">
                Automated ML-pattern match detected high-velocity cash layering across multiple mule accounts linked to active NCRP complaints. Immediate field unit dispatch and inter-bank freezing recommended to prevent ATM cash-out.
              </p>
            </div>

            {/* Parameter Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gov-bg p-3 rounded-sm border border-gov-border text-xs">
              <div>
                <div className="text-[10px] font-bold text-gov-text-muted uppercase">Target Operational Zone</div>
                <div className="font-semibold text-gov-navy mt-0.5 text-[11px] leading-tight">
                  {advisory.targetZone}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-gov-text-muted uppercase">Predicted Withdrawal Window</div>
                <div className="font-mono font-bold text-gov-red mt-0.5 text-[11px]">
                  {advisory.predictedTimeWindow}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-gov-text-muted uppercase">Capital at Risk</div>
                <div className="font-mono font-bold text-gov-navy mt-0.5 text-[11px]">
                  {formatCurrency(advisory.estimatedCapitalAtRisk)}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-gov-text-muted uppercase">Linked Mule Accounts</div>
                <div className="font-mono font-bold text-gov-navy mt-0.5 text-[11px]">
                  {advisory.totalMuleAccountsFlagged} Verified Accounts
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-gov-text-muted uppercase">Primary Syndicate</div>
                <div className="font-semibold text-gov-navy mt-0.5 text-[11px]">
                  Mewat Grid-04 (Digital Arrest)
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-gov-text-muted uppercase">Action Directive</div>
                <div className="font-bold text-gov-red mt-0.5 text-[11px]">
                  IMMEDIATE LIEN & PATROL
                </div>
              </div>
            </div>

            {/* Official Action Protocol Triggers */}
            <div className="pt-2">
              <div className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-2 flex items-center">
                <ChevronRight className="w-3.5 h-3.5 mr-1 text-gov-saffron-dark" />
                OFFICIAL LEA ACTION DIRECTIVES (AUTHORIZATION REQUIRED)
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={onDispatchFieldUnit}
                  className="gov-btn-primary bg-gov-navy hover:bg-gov-navy-dark px-4 py-2 text-xs font-bold"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  Dispatch Field Unit (Mobile Patrol)
                </button>

                <button
                  onClick={onInitiateBankFreeze}
                  className="gov-btn-danger px-4 py-2 text-xs font-bold"
                >
                  <Lock className="w-3.5 h-3.5 mr-1.5" />
                  Initiate Bank Freeze Request (Sec 102 BNSS)
                </button>

                <button
                  onClick={onRequestCCTV}
                  className="gov-btn-secondary px-4 py-2 text-xs font-bold"
                >
                  <Video className="w-3.5 h-3.5 mr-1.5 text-gov-navy" />
                  Request Emergency CCTV Feed
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Explainable AI Factors Table (5 cols) */}
          <div className="lg:col-span-5 bg-gov-bg p-3 rounded-sm border border-gov-border">
            <div className="text-xs font-bold text-gov-navy uppercase tracking-wider mb-2 flex items-center justify-between border-b border-gov-border pb-1">
              <span>Explainable AI Risk Factors</span>
              <span className="text-[10px] font-mono text-gov-text-muted">Weight (%)</span>
            </div>

            <div className="space-y-2">
              {advisory.explainableFactors.map((item, idx) => (
                <div key={idx} className="bg-white p-2 rounded-sm border border-gray-200 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gov-navy text-[11px]">
                      {item.factor}
                    </span>
                    <span className="font-mono font-bold text-gov-red bg-red-50 px-1.5 py-0.2 rounded border border-red-200 text-[10px]">
                      {item.weightPercentage}%
                    </span>
                  </div>
                  {/* Progress Weight Bar */}
                  <div className="w-full bg-gray-200 h-1.5 rounded-sm overflow-hidden mb-1">
                    <div 
                      className="bg-gov-navy h-full" 
                      style={{ width: `${item.weightPercentage * 2}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-gov-text-muted leading-tight">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-3 text-[10px] text-gov-text-muted flex items-center justify-between border-t border-gov-border pt-2 font-mono">
              <span>MODEL: I4C-PCWIS-v4.2-RNN</span>
              <span className="text-gov-green font-semibold flex items-center">
                <CheckCircle2 className="w-3 h-3 mr-1" /> VERIFIED BY I4C DESK
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
