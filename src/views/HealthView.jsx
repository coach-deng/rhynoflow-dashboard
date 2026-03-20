import { Database, ExternalLink } from 'lucide-react';
import { SYSTEMS } from '../data/config';

const statusConfig = {
  Healthy:  { pill: 'bg-emerald-50 text-emerald-700', dot: '!bg-emerald-500',  label: 'Operational' },
  Warning:  { pill: 'bg-amber-50  text-amber-700',   dot: '!bg-amber-500',    label: 'Pending' },
  Critical: { pill: 'bg-red-50    text-red-700',     dot: '!bg-red-500',      label: 'Critical' },
};

const clientGroups = [
  { label: 'Talata Basketball', key: 'Talata', color: 'text-brand-green' },
  { label: 'Sporting Health Club', key: 'SHC',    color: 'text-blue-500' },
];

const HealthView = ({ systems = SYSTEMS }) => (
  <div className="space-y-8">
    {clientGroups.map(group => {
      const grouped = systems.filter(s => s.client === group.key);
      if (!grouped.length) return null;
      const allHealthy = grouped.every(s => s.status === 'Healthy');
      const anyWarning = grouped.some(s => s.status === 'Warning');
      return (
        <div key={group.key}>
          <div className="flex items-center justify-between mb-3">
            <h3 className={`text-xs font-black uppercase tracking-widest ${group.color}`}>
              {group.label}
            </h3>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
              allHealthy ? 'bg-emerald-50 text-emerald-600' : anyWarning ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
            }`}>
              {allHealthy ? `${grouped.length} systems operational` : anyWarning ? 'Pending GWS access' : 'Needs attention'}
            </span>
          </div>
          <div className="space-y-3">
            {grouped.map(sys => {
              const cfg = statusConfig[sys.status] ?? statusConfig.Healthy;
              return (
                <div key={sys.name} className="rhyno-card flex items-center justify-between py-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                      sys.status === 'Healthy' ? 'bg-slate-900 text-white' : 'bg-amber-50 text-amber-500'
                    }`}>
                      <Database size={18} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{sys.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono tracking-tighter uppercase">{sys.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Last Check</p>
                      <p className="text-xs font-bold text-slate-600">{sys.lastCheck ?? 'Daily 07:00'}</p>
                    </div>
                    <div className={`health-pill border-none ${cfg.pill}`}>
                      <div className={`status-dot ${cfg.dot}`} />
                      <span>{cfg.label}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    })}

    {/* Footer note */}
    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
      <p className="text-xs text-slate-400 font-medium">
        SHC systems activate once Google Workspace access is granted · <span className="font-bold text-slate-600">Due Mar 20</span>
      </p>
    </div>
  </div>
);

export default HealthView;
