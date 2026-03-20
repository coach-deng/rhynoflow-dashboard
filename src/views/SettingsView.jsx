import { useState } from 'react';
import { Moon, Sun, Bell, Shield, User, Mail, Calendar, Zap, CheckCircle, ExternalLink, Database } from 'lucide-react';

const ConnectedBadge = ({ ok }) => ok
  ? <span className="flex items-center gap-1 text-[10px] font-bold text-brand-green"><CheckCircle size={10} /> Connected</span>
  : <span className="text-[10px] font-bold text-red-400">Disconnected</span>;

const Toggle = ({ on, onToggle }) => (
  <button
    onClick={onToggle}
    style={{ width: 48, height: 24, borderRadius: 12, position: 'relative', border: 'none', cursor: 'pointer', transition: 'background 0.3s', background: on ? '#00c853' : '#94a3b8', flexShrink: 0 }}
  >
    <div style={{ position: 'absolute', top: 4, width: 16, height: 16, borderRadius: '50%', background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'left 0.3s', left: on ? 28 : 4 }} />
  </button>
);

const SettingsView = ({ onClearLog, dark, onToggleDark: toggle }) => {
  const [notifications, setNotifications] = useState(() =>
    JSON.parse(localStorage.getItem('rf_notifPrefs') || JSON.stringify({
      morningBriefing: true, failureAlerts: true, weeklyReport: false, newDrafts: true,
    }))
  );
  const [saved, setSaved] = useState(false);

  const setNotif = (key, val) => {
    setNotifications(prev => {
      const next = { ...prev, [key]: val };
      localStorage.setItem('rf_notifPrefs', JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="rhyno-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="card-icon-box"><User size={20} /></div>
          <h3 className="font-bold text-lg">Profile</h3>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Name</label>
              <input defaultValue="Deng Awak" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold outline-none focus:border-brand-green focus:bg-white transition-all" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Business</label>
              <input defaultValue="Rhynoflow" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold outline-none focus:border-brand-green focus:bg-white transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Email</label>
            <input defaultValue="deng@rhynoflow.dk" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold outline-none focus:border-brand-green focus:bg-white transition-all" />
          </div>
          <button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }}
            className={`btn-primary px-6 py-2.5 text-sm transition-all ${saved ? 'bg-emerald-500' : ''}`}>
            {saved ? '✓ Saved' : 'Save Profile'}
          </button>
        </div>
      </div>

      <div className="rhyno-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="card-icon-box">{dark ? <Moon size={20} /> : <Sun size={20} />}</div>
          <h3 className="font-bold text-lg">Appearance</h3>
        </div>
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
          <div>
            <p className="font-bold text-sm text-slate-800">Dark Mode</p>
            <p className="text-xs text-slate-500 mt-0.5">Easier on the eyes at night</p>
          </div>
          <Toggle on={dark} onToggle={toggle} />
        </div>
      </div>

      <div className="rhyno-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="card-icon-box"><Shield size={20} /></div>
          <h3 className="font-bold text-lg">Connected Accounts</h3>
        </div>
        <div className="space-y-3">
          {[
            { icon: <Mail size={16} />,     label: 'Gmail',            detail: 'coach@talatabasketball.dk', ok: true },
            { icon: <Calendar size={16} />, label: 'Google Calendar',  detail: 'Primary calendar linked',   ok: true },
            { icon: <Database size={16} />, label: 'Google Sheets',    detail: 'Revenue + Tasks sheets',    ok: true },
            { icon: <Zap size={16} />,      label: 'Apps Script (GAS)',detail: 'Web App deployed',          ok: true },
            { icon: <Zap size={16} />,      label: 'Claude API',       detail: 'SmartReplyDrafter active',  ok: true },
          ].map(({ icon, label, detail, ok }) => (
            <div key={label} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-600 shadow-sm">{icon}</div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{label}</p>
                  <p className="text-[10px] text-slate-400 font-medium">{detail}</p>
                </div>
              </div>
              <ConnectedBadge ok={ok} />
            </div>
          ))}
        </div>
      </div>

      <div className="rhyno-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="card-icon-box"><Bell size={20} /></div>
          <h3 className="font-bold text-lg">Notifications</h3>
        </div>
        <div className="space-y-3">
          {[
            { key: 'morningBriefing', label: 'Morning Briefing email', desc: 'Daily at 6:30 AM' },
            { key: 'failureAlerts',   label: 'Failure alerts',         desc: 'When an automation errors' },
            { key: 'newDrafts',       label: 'New draft ready',        desc: 'When SmartReplyDrafter creates a draft' },
            { key: 'weeklyReport',    label: 'Weekly summary',         desc: 'Every Monday morning' },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div>
                <p className="text-sm font-bold text-slate-800">{label}</p>
                <p className="text-xs text-slate-400">{desc}</p>
              </div>
              <Toggle on={notifications[key]} onToggle={() => setNotif(key, !notifications[key])} />
            </div>
          ))}
        </div>
      </div>

      <div className="rhyno-card">
        <div className="flex items-center gap-3 mb-6">
          <div className="card-icon-box"><Database size={20} /></div>
          <h3 className="font-bold text-lg">Data & System</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
            <div>
              <p className="text-sm font-bold text-slate-800">Clear Activity Log</p>
              <p className="text-xs text-slate-400">Resets the live activity feed</p>
            </div>
            <button onClick={onClearLog} className="text-xs font-bold px-4 py-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all">
              Clear Log
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
            <div>
              <p className="text-sm font-bold text-slate-800">Apps Script Console</p>
              <p className="text-xs text-slate-400">View execution logs on Google</p>
            </div>
            <a href="https://script.google.com" target="_blank" rel="noreferrer"
              className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-brand-green/10 hover:text-brand-green transition-all">
              <ExternalLink size={12} /> Open
            </a>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">RhynoFlow OS · v2.0</p>
            <p className="text-[10px] text-slate-300 mt-0.5">rhynoflow.dk · Powering admin for ambitious clubs</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
