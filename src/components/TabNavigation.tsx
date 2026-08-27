import React from 'react';
import { 
  BarChart2, 
  FileText, 
  GitCommit, 
  Map, 
  Landmark, 
  ShieldCheck 
} from 'lucide-react';

export type TabType = 
  | 'dashboard' 
  | 'register' 
  | 'entity_map' 
  | 'geo_map' 
  | 'bank_coordination' 
  | 'audit_register';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  complaintsCount: number;
  auditCount: number;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
  complaintsCount,
  auditCount
}) => {
  const tabs = [
    {
      id: 'dashboard' as TabType,
      label: '1. Dashboard Overview',
      icon: <BarChart2 className="w-4 h-4 mr-1.5" />,
    },
    {
      id: 'register' as TabType,
      label: '2. Complaint Register',
      icon: <FileText className="w-4 h-4 mr-1.5" />,
      badge: complaintsCount
    },
    {
      id: 'entity_map' as TabType,
      label: '3. Entity Relationship Map',
      icon: <GitCommit className="w-4 h-4 mr-1.5" />
    },
    {
      id: 'geo_map' as TabType,
      label: '4. Geographic Risk Map',
      icon: <Map className="w-4 h-4 mr-1.5" />
    },
    {
      id: 'bank_coordination' as TabType,
      label: '5. Inter-Bank Coordination',
      icon: <Landmark className="w-4 h-4 mr-1.5" />
    },
    {
      id: 'audit_register' as TabType,
      label: '6. Access & Audit Register',
      icon: <ShieldCheck className="w-4 h-4 mr-1.5" />,
      badge: auditCount
    }
  ];

  return (
    <div className="bg-white border-b border-gov-border mb-3 sm:mb-4">
      {/* Mobile Select Dropdown for screens under 640px */}
      <div className="sm:hidden p-2">
        <label htmlFor="mobile-tab-select" className="sr-only">Select View Tab</label>
        <select
          id="mobile-tab-select"
          value={activeTab}
          onChange={(e) => onTabChange(e.target.value as TabType)}
          className="w-full bg-gov-bg border-2 border-gov-navy text-gov-navy text-xs font-bold py-2.5 px-3 rounded-sm focus:outline-none focus:ring-1 focus:ring-gov-navy font-sans"
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label} {tab.badge !== undefined ? `(${tab.badge})` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Desktop & Tablet Horizontal Tab Navigation Bar */}
      <nav className="hidden sm:flex space-x-1 overflow-x-auto px-2 pt-1 scrollbar-thin" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center px-3.5 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors duration-150 focus:outline-none min-h-[44px] touch-manipulation ${
                isActive
                  ? 'border-gov-navy text-gov-navy bg-blue-50/60 font-bold'
                  : 'border-transparent text-gov-text-muted hover:text-gov-navy hover:border-gray-300'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`ml-2 px-1.5 py-0.2 text-[10px] font-mono font-bold rounded-sm border ${
                  isActive 
                    ? 'bg-gov-navy text-white border-gov-navy' 
                    : 'bg-gray-100 text-gov-text-muted border-gray-300'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
