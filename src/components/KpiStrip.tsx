import React from 'react';
import type { KpiMetric } from '../types/pcwis';
import { ArrowUpRight, ArrowDownRight, AlertCircle, ShieldCheck, Database, Layers, Landmark } from 'lucide-react';

interface KpiStripProps {
  metrics: KpiMetric[];
}

export const KpiStrip: React.FC<KpiStripProps> = ({ metrics }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'total_complaints':
        return <Database className="w-4 h-4 text-gov-navy" />;
      case 'active_networks':
        return <Layers className="w-4 h-4 text-gov-amber" />;
      case 'mule_accounts':
        return <AlertCircle className="w-4 h-4 text-gov-red" />;
      case 'predicted_events':
        return <Landmark className="w-4 h-4 text-gov-red" />;
      case 'capital_secured':
        return <ShieldCheck className="w-4 h-4 text-gov-green" />;
      default:
        return <Database className="w-4 h-4 text-gov-navy" />;
    }
  };

  return (
    <section className="my-2.5 sm:my-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {metrics.map((metric) => (
          <div 
            key={metric.id} 
            className="gov-card border-t-2 border-t-gov-navy flex flex-col justify-between hover:border-gov-navy-light transition-colors"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-gov-text-muted uppercase tracking-wider mb-1">
                <span>{metric.label}</span>
                {getIcon(metric.id)}
              </div>

              <div className="flex items-baseline space-x-1 my-1">
                <span className="text-xl font-bold font-mono text-gov-navy tracking-tight">
                  {metric.value}
                </span>
                {metric.unit && (
                  <span className="text-xs font-bold text-gov-navy font-mono">
                    {metric.unit}
                  </span>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
              <span className="text-gov-text-muted truncate text-[10px]" title={metric.subtitle}>
                {metric.subtitle}
              </span>
              <span className={`inline-flex items-center font-semibold font-mono text-[10px] ${
                metric.trend === 'up' ? 'text-gov-red' : metric.trend === 'down' ? 'text-gov-green' : 'text-gov-amber'
              }`}>
                {metric.trend === 'up' && <ArrowUpRight className="w-3 h-3 mr-0.5 inline" />}
                {metric.trend === 'down' && <ArrowDownRight className="w-3 h-3 mr-0.5 inline" />}
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
