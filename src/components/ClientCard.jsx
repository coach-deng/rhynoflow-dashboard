import { motion } from 'framer-motion';
import { Zap, Check, Linkedin } from 'lucide-react';

const ClientCard = ({ name, org, progress, status, phases, currentPhase, linkedin, onSelect }) => (
  <div
    className="rhyno-card group cursor-pointer hover:border-brand-green transition-all flex-1 min-w-[280px]"
    onClick={onSelect}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onSelect()}
  >
    <div className="flex justify-between items-start mb-6">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-brand-green flex items-center justify-center transition-all">
          <Zap size={22} />
        </div>
        <div>
          <h3 className="font-bold text-xl text-slate-900 group-hover:text-brand-green transition-colors">{name}</h3>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">{org}</p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <span className="text-xs font-bold text-brand-green italic bg-emerald-50 px-2 py-1 rounded-md">{status}</span>
        {linkedin && (
          <a
            href={linkedin}
            target="_blank"
            rel="noreferrer"
            className="p-1.5 rounded-lg bg-slate-50 text-slate-300 hover:text-brand-green transition-colors"
            onClick={(e) => e.stopPropagation()}
            aria-label={`${name} on LinkedIn`}
          >
            <Linkedin size={14} />
          </a>
        )}
      </div>
    </div>

    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progress</span>
        <span className="text-lg font-black text-brand-green">{progress}%</span>
      </div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-brand-green"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between gap-1">
        {phases.map((p, idx) => {
          const isDone = idx <= currentPhase;
          const isCurrent = idx === currentPhase;
          return (
            <div key={p} className="flex-1 flex flex-col gap-2">
              <div className={`h-1.5 rounded-full ${isDone ? 'bg-brand-green' : 'bg-slate-100'}`} />
              <div className="flex items-center justify-center gap-1">
                {isDone && <Check size={10} className="text-brand-green stroke-[3px]" />}
                <span className={`text-[9px] font-bold text-center leading-tight ${isCurrent ? 'text-brand-green' : isDone ? 'text-slate-600' : 'text-slate-400'}`}>
                  {p}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export default ClientCard;
