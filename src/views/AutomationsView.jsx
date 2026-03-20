import { useState } from 'react';
import { Layers, Mail, Calendar, Bell, Users, DollarSign, Play, CheckCircle, AlertCircle, ToggleLeft, ToggleRight } from 'lucide-react';
import { TEMPLATES } from '../data/config';

const iconMap = {
  briefing: <Bell size={20} />, reply: <Mail size={20} />, categorize: <Layers size={20} />,
  calendar: <Calendar size={20} />, substitute: <Users size={20} />, salary: <DollarSign size={20} />,
};

const statusStyles = {
  Live: 'bg-emerald-50 text-brand-green', New: 'bg-blue-50 text-blue-600', Draft: 'bg-amber-50 text-amber-600',
};

const LAST_RUN = {
  'MorningBriefing.gs':   '6:30 AM today',
  'SmartReplyDrafter.gs': '8 min ago',
  'EmailCategorizer.gs':  '1h ago',
  'CalendarDigest.gs':    '6:30 AM today',
  'SubstituteFinder.gs':  'Deploying — GWS access pending',
  'SalaryHoursAuto.gs':   'Deploying — GWS access pending',
};

const AutomationsView = ({ onRunAutomation }) => {
  const [enabled, setEnabled] = useState(() => {
    try { return JSON.parse(localStorage.getItem('rf_automationsEnabled') || '{}'); } catch { return {}; }
  });
  const [running, setRunning]   = useState({});
  const [runResult, setRunResult] = useState({});

  const toggleEnabled = (name) => {
    setEnabled(prev => {
      const next = { ...prev, [name]: !(prev[name] ?? true) };
      localStorage.setItem('rf_automationsEnabled', JSON.stringify(next));
      return next;
    });
  };

  const handleRun = async (tmpl) => {
    if (tmpl.status !== 'Live') return;
    setRunning(r => ({ ...r, [tmpl.name]: true }));
    setRunResult(r => ({ ...r, [tmpl.name]: null }));
    await new Promise(res => setTimeout(res, 1500 + Math.random() * 1000));
    const success = Math.random() > 0.1;
    setRunning(r => ({ ...r, [tmpl.name]: false }));
    setRunResult(r => ({ ...r, [tmpl.name]: success ? 'success' : 'error' }));
    if (onRunAutomation) onRunAutomation(tmpl.name.replace('.gs',''), success ? 'Manual run — completed successfully' : 'Manual run — error', success ? 'success' : 'error');
    setTimeout(() => setRunResult(r => ({ ...r, [tmpl.name]: null })), 3000);
  };

  const isOn = (name) => enabled[name] !== false;

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500 font-medium">
          {TEMPLATES.filter(t => t.status === 'Live').length} live · {TEMPLATES.filter(t => t.status === 'New').length} deploying
        </p>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
          <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />All live scripts running
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES.map(tmpl => {
          const on = isOn(tmpl.name);
          const busy = running[tmpl.name];
          const result = runResult[tmpl.name];
          const canRun = tmpl.status === 'Live' && on && !busy;
          return (
            <div key={tmpl.name} className={`rhyno-card group transition-all ${on ? 'opacity-100' : 'opacity-50'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`card-icon-box transition-all ${busy ? 'bg-brand-green text-white animate-pulse' : 'group-hover:bg-brand-green group-hover:text-white'}`}>
                  {iconMap[tmpl.icon] ?? <Layers size={20} />}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${statusStyles[tmpl.status] ?? statusStyles.Draft}`}>{tmpl.status}</span>
                  <button onClick={() => toggleEnabled(tmpl.name)} className="text-slate-300 hover:text-brand-green transition-colors">
                    {on ? <ToggleRight size={20} className="text-brand-green" /> : <ToggleLeft size={20} />}
                  </button>
                </div>
              </div>
              <h4 className="font-bold text-base text-slate-800 leading-tight mb-1 group-hover:text-brand-green transition-colors">{tmpl.name}</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">{tmpl.desc}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">
                Last run: <span className="text-slate-600 normal-case font-bold">{LAST_RUN[tmpl.name] ?? '—'}</span>
              </p>
              {result && (
                <div className={`flex items-center gap-2 text-xs font-bold mb-3 ${result === 'success' ? 'text-brand-green' : 'text-red-500'}`}>
                  {result === 'success' ? <><CheckCircle size={12} /> Completed successfully</> : <><AlertCircle size={12} /> Run failed — check logs</>}
                </div>
              )}
              {tmpl.status === 'Live' ? (
                <button disabled={!canRun} onClick={() => handleRun(tmpl)}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all
                    ${canRun ? 'bg-brand-green/10 text-brand-green hover:bg-brand-green hover:text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                  {busy ? <><span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" /> Running…</> : <><Play size={12} /> Run Now</>}
                </button>
              ) : (
                <div className="w-full py-2.5 rounded-xl text-xs font-bold text-center bg-slate-50 text-slate-400">Deploy pending GWS access</div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default AutomationsView;
