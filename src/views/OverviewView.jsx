import { Clock, Mail, Zap, CheckCircle, Target, Database, Check, Layers, Rocket, ChevronRight } from 'lucide-react';
import StatCard from '../components/StatCard';
import ActivityRow from '../components/ActivityRow';
import RevenueChart from '../components/RevenueChart';
import { REVENUE_HISTORY, MILESTONE } from '../data/config';

const timeAgo = (ts) => {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const statusDot = { success: 'bg-emerald-400', warning: 'bg-amber-400', error: 'bg-red-400' };

const OverviewView = ({
  revenueGoal, currentRevenue,
  cashBufferGoal, currentCashBuffer,
  pipelineValue, urgentTasks,
  obsidianWins, obsidianTasks,
  activityLog = [], metrics = {},
}) => {
  const pct = Math.round((currentRevenue / revenueGoal) * 100);
  const milestonePct = Math.min(Math.round((MILESTONE.current / MILESTONE.target) * 100), 100);

  return (
    <>
      {/* ── 25k Milestone Banner ────────────────────────────────────────────── */}
      <div className="rhyno-card mb-6 bg-brand-dark text-white border-none shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-green opacity-5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-green/20 flex items-center justify-center shrink-0">
              <Rocket size={22} className="text-brand-green" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Rhynoflow — App Launch Fund</p>
              <p className="text-2xl font-black text-white">
                {MILESTONE.current.toLocaleString('da-DK')} <span className="text-base font-bold text-slate-400">/ 25,000 kr</span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Target: {MILESTONE.deadline}</p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Next milestone</p>
            <div className="flex items-center gap-1.5 text-brand-green font-bold text-sm">
              <ChevronRight size={14} />
              {MILESTONE.nextClient}
            </div>
          </div>
        </div>
        <div className="mt-5">
          <div className="flex justify-between text-[10px] font-bold text-slate-500 mb-1.5">
            <span>{milestonePct}% funded</span>
            <span>{(MILESTONE.target - MILESTONE.current).toLocaleString('da-DK')} kr to go</span>
          </div>
          <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.max(milestonePct, 2)}%`, background: 'linear-gradient(90deg, #00c853, #69f0ae)' }}
            />
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard icon={<Clock size={24} />}       label="Hours Saved (7d)"       value={`${metrics.hoursSaved ?? 0}h`}        subValue="by automations"          trend="vs manual work" isUp isLive={false} />
        <StatCard icon={<Mail size={24} />}         label="Emails Drafted (7d)"    value={metrics.emailsDrafted ?? 0}            subValue="by SmartReplyDrafter"    trend="AI-powered"     isUp isLive={false} />
        <StatCard icon={<Zap size={24} />}          label="Automations Run (7d)"   value={metrics.automationsRun ?? 0}           subValue="across all scripts"      trend="24/7 active"    isUp isLive={false} />
        <StatCard icon={<CheckCircle size={24} />}  label="Success Rate"           value={`${metrics.successRate ?? 100}%`}     subValue="no failures"             trend="System healthy"  isUp isLive={true} />
      </div>

      <RevenueChart data={REVENUE_HISTORY} goal={revenueGoal} />

      <div className="intel-grid mt-6">
        <div className="intel-card shadow-sm col-span-2">
          <div className="card-title-bar">
            <h3>Live Activity Log</h3>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-brand-green uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />Live
            </span>
          </div>
          <div className="divide-y divide-slate-50">
            {activityLog.slice(0, 8).map(entry => (
              <div key={entry.id} className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${statusDot[entry.status] ?? statusDot.success}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-slate-800">{entry.automation}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">{entry.client}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{entry.action}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap shrink-0">{timeAgo(entry.ts)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rhyno-card bg-brand-dark text-white border-none shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green opacity-10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <h3 className="font-bold mb-1 flex items-center gap-2 text-sm">
              <Target size={16} className="text-brand-green" /> Revenue Target
            </h3>
            <p className="text-3xl font-black text-white mb-1">{currentRevenue.toLocaleString('da-DK')} <span className="text-base font-bold text-slate-400">kr</span></p>
            <p className="text-xs text-slate-400 mb-4">of {revenueGoal.toLocaleString('da-DK')} kr goal · {pct}%</p>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-brand-green rounded-full transition-all duration-700" style={{ width: `${Math.min(pct, 100)}%` }} />
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Cash Buffer</p>
                <p className="text-sm font-black text-white">{currentCashBuffer.toLocaleString('da-DK')} kr</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Pipeline</p>
                <p className="text-sm font-black text-brand-green">{pipelineValue.toLocaleString('da-DK')} kr</p>
              </div>
            </div>
          </div>

          <div className="intel-card shadow-sm">
            <div className="card-title-bar">
              <h3>Urgent Tasks</h3>
              <span className="text-[10px] font-bold text-red-500 uppercase">{urgentTasks.length} open</span>
            </div>
            <div className="divide-y divide-slate-50">
              {urgentTasks.map(task => (
                <ActivityRow key={task.title} time={task.time} title={task.title} desc={task.desc} action={task.action} />
              ))}
            </div>
          </div>

          {(obsidianWins || obsidianTasks) && (
            <div className="rhyno-card border-none bg-brand-dark text-white shadow-xl">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Database size={18} className="text-brand-green" /> Obsidian — Today
              </h3>
              {obsidianWins && (
                <div className="mb-4">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1"><Check size={10} className="text-brand-green" /> Wins</p>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-white/5 p-3 rounded-xl">{obsidianWins}</p>
                </div>
              )}
              {obsidianTasks && (
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1"><Layers size={10} className="text-brand-green" /> Focus</p>
                  <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-white/5 p-3 rounded-xl max-h-48 overflow-y-auto">{obsidianTasks}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OverviewView;
