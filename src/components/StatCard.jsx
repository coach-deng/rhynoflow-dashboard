import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ icon, label, value, subValue, trend, isUp, isLive = false }) => (
  <div className="rhyno-card group">
    <div className="flex items-start justify-between mb-1">
      <div className="card-icon-box group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-widest ${
        isLive
          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
          : 'bg-amber-50 text-amber-500 border border-amber-100'
      }`}>
        {isLive ? 'Live' : 'Demo'}
      </span>
    </div>
    <div className="stat-label">{label}</div>
    <div className="flex items-baseline gap-2 mb-1">
      <div className="stat-value">{value}</div>
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{subValue}</div>
    </div>
    <div className={`stat-trend flex items-center gap-1 ${isUp ? 'trend-up' : 'trend-down'}`}>
      {isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
      <span>{trend}</span>
    </div>
  </div>
);

export default StatCard;
