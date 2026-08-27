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
      <div className="bg-gov-bg p-2.5 sm:p-3 rounded-sm border border-gov-navy flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-gov-saffron-dark animate-pulse shrink-0" />
          <div>
            <span className="font-bold text-gov-navy uppercase tracking-wider text-[10px] sm:text-[11px] block">
              ML Cash-Out Prediction Generator (POST /predict)
            </span>
            <span className="text-[10px] text-gov-text-muted">
              Submit crime parameters to trigger scikit-learn spatial KernelDensity clustering backend
            </span>
          </div>
        </div>

        <form onSubmit={handlePredictionSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-row flex-wrap items-stretch sm:items-end gap-2 w-full md:w-auto">
          <div className="sm:col-span-2 md:flex-1 md:min-w-[140px]">
            <label className="text-[9px] font-bold text-gov-text-muted uppercase block mb-0.5">Fraud Category</label>
            <select
              value={fraudCategory}
              onChange={(e) => setFraudCategory(e.target.value)}
              className="w-full bg-white border border-gov-border rounded-sm py-2 sm:py-1.5 px-2 text-xs font-semibold focus:outline-none focus:border-gov-navy min-h-[40px] sm:min-h-[auto]"
            >
              <option value="Digital Arrest Scam">Digital Arrest Scam</option>
              <option value="Part-Time Job Fraud">Part-Time Job Fraud</option>
              <option value="UPI Phishing">UPI Phishing</option>
              <option value="ATM Cash Layering">ATM Cash Layering</option>
              <option value="Investment Fraud">Investment Fraud</option>
              <option value="KYC Update Scam">KYC Update Scam</option>
            </select>
          </div>

          <div className="w-full sm:w-auto md:w-24">
            <label className="text-[9px] font-bold text-gov-text-muted uppercase block mb-0.5">Victim Lat</label>
            <input
              type="number"
              inputMode="decimal"
              step="0.0001"
              value={victimLat}
              onChange={(e) => setVictimLat(parseFloat(e.target.value) || 0)}
              className="w-full bg-white border border-gov-border rounded-sm py-2 sm:py-1.5 px-2 text-xs font-mono focus:outline-none focus:border-gov-navy min-h-[40px] sm:min-h-[auto]"
            />
          </div>

          <div className="w-full sm:w-auto md:w-24">
            <label className="text-[9px] font-bold text-gov-text-muted uppercase block mb-0.5">Victim Lng</label>
            <input
              type="number"
              inputMode="decimal"
              step="0.0001"
              value={victimLng}
              onChange={(e) => setVictimLng(parseFloat(e.target.value) || 0)}
              className="w-full bg-white border border-gov-border rounded-sm py-2 sm:py-1.5 px-2 text-xs font-mono focus:outline-none focus:border-gov-navy min-h-[40px] sm:min-h-[auto]"
            />
          </div>

          <div className="sm:col-span-2 md:w-28">
            <label className="text-[9px] font-bold text-gov-text-muted uppercase block mb-0.5">Defrauded Amount (INR)</label>
            <input
              type="number"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full bg-white border border-gov-border rounded-sm py-2 sm:py-1.5 px-2 text-xs font-mono focus:outline-none focus:border-gov-navy min-h-[40px] sm:min-h-[auto]"
            />
          </div>

          <div className="sm:col-span-2 md:w-auto pt-1 sm:pt-0">
            <button
              type="submit"
              disabled={isPredicting}
              className="gov-btn-primary bg-gov-navy hover:bg-gov-navy-dark w-full sm:w-auto px-4 py-2.5 sm:py-2 text-xs font-bold flex items-center justify-center shadow-xs cursor-pointer min-h-[44px]"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1 text-gov-saffron shrink-0" />
              {isPredicting ? 'Running Sklearn...' : 'Run ML Prediction'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white border-2 border-gov-red rounded-sm overflow-hidden shadow-sm">
        {/* Advisory Official Header Strip */}
        <div className="bg-red-50 border-b border-red-200 px-3 sm:px-4 py-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="bg-gov-red text-white p-1 rounded-sm shrink-0">
              <AlertOctagon className="w-4 h-4" />
            </span>
            <div>
              <span className="text-[9px] sm:text-[10px] font-bold text-gov-red uppercase tracking-wider font-mono block">
                OFFICIAL I4C INTELLIGENCE ADVISORY &bull; URGENT LEA ACTION REQUIRED
              </span>
              <div className="text-xs sm:text-sm font-bold text-gov-navy flex items-center">
                <FileText className="w-4 h-4 mr-1 text-gov-navy-light shrink-0" />
                REF NO: <span className="font-mono text-gov-red ml-1">{advisory.referenceNo}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 text-xs w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-red-200 pt-1.5 sm:pt-0">
            <span className="gov-badge gov-badge-critical text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1">
              RISK LEVEL: {advisory.riskLevel}
            </span>
            <span className="bg-white border border-red-300 text-gov-navy font-mono px-2 py-0.5 rounded-sm font-semibold text-[10px] sm:text-xs">
              CONFIDENCE: {advisory.confidenceScore}%
            </span>
          </div>
        </div>

        {/* Advisory Body */}
        <div className="p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          {/* Left Column: Target Zone & Key Parameters (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gov-navy border-b border-gov-border pb-1 mb-2">
                {advisory.title}
              </h2>
              <p className="text-xs text-gov-text-muted leading-relaxed">
                Automated ML-pattern match detected high-velocity cash layering across multiple mule accounts linked to active NCRP complaints. Immediate field unit dispatch and inter-bank freezing recommended to prevent ATM cash-out.
              </p>
            </div>

            {/* Parameter Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 bg-gov-bg p-3 rounded-sm border border-gov-border text-xs">
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
            <div className="pt-1 sm:pt-2">
              <div className="text-[11px] sm:text-xs font-bold text-gov-navy uppercase tracking-wider mb-2 flex items-center">
                <ChevronRight className="w-3.5 h-3.5 mr-1 text-gov-saffron-dark shrink-0" />
                OFFICIAL LEA ACTION DIRECTIVES (AUTHORIZATION REQUIRED)
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <button
                  onClick={onDispatchFieldUnit}
                  className="gov-btn-primary bg-gov-navy hover:bg-gov-navy-dark w-full sm:w-auto px-4 py-2 text-xs font-bold justify-center"
                >
                  <Send className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                  Dispatch Field Unit (Mobile Patrol)
                </button>

                <button
                  onClick={onInitiateBankFreeze}
                  className="gov-btn-danger w-full sm:w-auto px-4 py-2 text-xs font-bold justify-center"
                >
                  <Lock className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                  Initiate Bank Freeze Request (Sec 102 BNSS)
                </button>

                <button
                  onClick={onRequestCCTV}
                  className="gov-btn-secondary w-full sm:w-auto px-4 py-2 text-xs font-bold justify-center"
                >
                  <Video className="w-3.5 h-3.5 mr-1.5 text-gov-navy shrink-0" />
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
