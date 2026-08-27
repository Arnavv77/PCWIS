import React from 'react';
import { ShieldCheck, Database, Cpu, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-8 border-t-2 border-gov-navy bg-white text-xs">
      {/* System Status Line Bar */}
      <div className="bg-gov-bg border-b border-gov-border px-3 sm:px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono text-gov-text-muted">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <span className="flex items-center text-gov-green font-bold whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-gov-green mr-1.5 animate-pulse shrink-0"></span>
            DATABASE: CONNECTED (PG-PROD-01)
          </span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span className="flex items-center text-gov-navy font-semibold whitespace-nowrap">
            <Cpu className="w-3 h-3 mr-1 shrink-0" />
            API GATEWAY: ACTIVE (24ms)
          </span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span className="flex items-center whitespace-nowrap">
            <Database className="w-3 h-3 mr-1 text-gov-text-muted shrink-0" />
            LAST SYNC: 2026-08-24 14:52:15 IST
          </span>
        </div>

        <div className="flex items-center space-x-2 text-gov-navy shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-gov-green shrink-0" />
          <span className="font-bold">I4C ADVANCED PREDICTIVE CORE v4.2</span>
        </div>
      </div>

      {/* Official Government Disclaimer Footer */}
      <div className="px-4 py-4 text-center space-y-1.5 bg-white text-gov-text-muted">
        <div className="flex items-center justify-center space-x-2 text-[11px] font-semibold text-gov-navy uppercase tracking-wider">
          <Lock className="w-3.5 h-3.5 text-gov-saffron-dark" />
          <span>MINISTRY OF HOME AFFAIRS &bull; INDIAN CYBERCRIME COORDINATION CENTRE (I4C)</span>
        </div>
        <p className="text-[11px] leading-relaxed max-w-4xl mx-auto">
          &copy; Government of India | Ministry of Home Affairs | Indian Cybercrime Coordination Centre (I4C). This is a classified internal intelligence platform restricted to authorized Law Enforcement Agencies (LEAs), State Police Cyber Cells, and Financial Nodal Officers. Unauthorized access or data exfiltration is strictly prohibited under the Information Technology Act, 2000 and Bharatiya Nyaya Sanhita (BNS).
        </p>
      </div>
    </footer>
  );
};
