import React, { useState, useEffect } from 'react';
import { Shield, Clock, Lock, User, MapPin } from 'lucide-react';

export const HeaderBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      setCurrentTime(now.toLocaleString('en-IN', options) + ' IST');
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white border-b-2 border-gov-navy shadow-sm">
      {/* Top Banner: Official Classification Bar */}
      <div className="bg-gov-navy-dark text-white px-3 sm:px-4 py-1 flex items-center justify-between text-[10px] sm:text-[11px] font-medium tracking-wide border-b border-navy-900">
        <div className="flex items-center space-x-2 sm:space-x-3 truncate">
          <span className="flex items-center text-gov-saffron truncate">
            <Shield className="w-3.5 h-3.5 mr-1 shrink-0" />
            MINISTRY OF HOME AFFAIRS (MHA) &bull; GOVT. OF INDIA
          </span>
          <span className="text-gray-400 hidden sm:inline">|</span>
          <span className="hidden md:inline text-gray-300">INDIAN CYBERCRIME COORDINATION CENTRE (I4C)</span>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
          <span className="bg-gray-800 text-gray-200 px-1.5 sm:px-2 py-0.5 rounded-sm border border-gray-700 text-[9px] sm:text-[10px] uppercase font-mono tracking-wider hidden xs:inline">
            RESTRICTED ACCESS
          </span>
          <span className="flex items-center text-green-400 text-[10px] sm:text-[11px]">
            <Lock className="w-3 h-3 mr-1" />
            SECURE GOVNET
          </span>
        </div>
      </div>

      {/* Main Header Content */}
      <div className="px-3 sm:px-4 py-2.5 sm:py-3 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Official Emblem & Ministry Branding */}
        <div className="flex items-center space-x-3">
          {/* Ashoka Emblem Vector Placeholder */}
          <div className="w-9 sm:w-10 h-10 sm:h-12 flex flex-col items-center justify-center border-r border-gov-border pr-2.5 sm:pr-3 shrink-0">
            <svg viewBox="0 0 100 120" className="w-7 sm:w-8 h-9 sm:h-10 fill-gov-navy">
              <circle cx="50" cy="30" r="16" fill="none" stroke="#003366" strokeWidth="4" />
              <path d="M50 14 L50 46 M34 30 L66 30 M38 18 L62 42 M38 42 L62 18" stroke="#003366" strokeWidth="2" />
              <rect x="25" y="50" width="50" height="12" fill="#003366" rx="1" />
              <circle cx="50" cy="56" r="4" fill="#FF9933" />
              <path d="M20 66 L80 66 L75 90 L25 90 Z" fill="#003366" />
              <rect x="35" y="92" width="30" height="6" fill="#1B7A43" />
              <text x="50" y="112" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#003366">सत्यमेव जयते</text>
            </svg>
          </div>

          <div>
            <div className="text-[10px] sm:text-[11px] font-bold text-gov-navy uppercase tracking-wider leading-tight">
              गृह मंत्रालय | Ministry of Home Affairs
            </div>
            <div className="text-[11px] sm:text-xs font-semibold text-gov-text-muted leading-tight">
              भारतीय साइबर अपराध समन्वय केंद्र | Indian Cybercrime Coordination Centre (I4C)
            </div>
            <h1 className="text-base sm:text-lg font-bold text-gov-navy mt-0.5 tracking-tight flex flex-wrap items-center gap-1.5">
              <span>Predictive Cash-Withdrawal Intelligence System (PCWIS)</span>
              <span className="bg-blue-100 text-gov-navy text-[10px] font-mono px-1.5 py-0.5 rounded border border-blue-300">
                v4.2-PROD
              </span>
            </h1>
          </div>
        </div>

        {/* Right: Officer Identity Block & IST Time */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-start gap-2 sm:gap-4 bg-gov-bg p-2 rounded-sm border border-gov-border text-xs w-full md:w-auto">
          <div className="flex items-center space-x-2 border-r border-gov-border pr-3">
            <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-sm bg-gov-navy text-white flex items-center justify-center font-bold text-xs shrink-0">
              RK
            </div>
            <div>
              <div className="font-bold text-gov-navy flex items-center text-xs">
                <User className="w-3 h-3 mr-1 text-gov-navy-light shrink-0" />
                Insp. R. K. Sharma
              </div>
              <div className="text-[9px] sm:text-[10px] text-gov-text-muted font-mono">
                BADGE: LEA-ND-8942
              </div>
            </div>
          </div>

          <div className="border-r border-gov-border pr-3">
            <div className="text-[9px] sm:text-[10px] uppercase font-semibold text-gov-text-muted">
              JURISDICTION
            </div>
            <div className="font-semibold text-gov-navy flex items-center text-[10px] sm:text-[11px]">
              <MapPin className="w-3 h-3 mr-1 text-gov-saffron-dark shrink-0" />
              Delhi NCR - Cyber Cell
            </div>
          </div>

          <div>
            <div className="text-[9px] sm:text-[10px] uppercase font-semibold text-gov-text-muted flex items-center">
              <Clock className="w-3 h-3 mr-1 text-gov-navy shrink-0" />
              SYSTEM TIME (IST)
            </div>
            <div className="font-mono font-bold text-gov-navy text-xs">
              {currentTime || 'Loading IST...'}
            </div>
          </div>
        </div>
      </div>

      {/* Saffron Accent Line */}
      <div className="h-1 bg-gov-saffron w-full"></div>
    </header>
  );
};
