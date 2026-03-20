import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3, Users, Settings, Bell, Zap,
  Activity, ChevronRight, Menu, X,
  FileText, Layers, RefreshCw, DollarSign, Inbox
} from 'lucide-react';

import NavItem from './components/NavItem';
import NotificationPanel from './components/NotificationPanel';
import { useActivityLog } from './hooks/useActivityLog';
import { useDarkMode } from './hooks/useDarkMode';
import { useNotifications } from './hooks/useNotifications';
import OverviewView    from './views/OverviewView';
import ClientsView     from './views/ClientsView';
import AutomationsView from './views/AutomationsView';
import HealthView      from './views/HealthView';
import SettingsView    from './views/SettingsView';
import FinanceView     from './views/FinanceView';
import LeadsView       from './views/LeadsView';

import { GAS_API_URL, POLL_INTERVAL_MS, REVENUE, URGENT_TASKS, QUICK_LINKS } from './data/config';

// ─── Persist active tab across sessions ──────────────────────────────────────
const TABS = ['Overview', 'Clients', 'Leads', 'Automations', 'Health', 'Finance', 'Settings'];

const getSavedTab = () => {
  const saved = localStorage.getItem('rf_activeTab');
  return TABS.includes(saved) ? saved : 'Overview';
};

// ─── App ─────────────────────────────────────────────────────────────────────
const App = () => {
  const [activeTab, setActiveTab]     = useState(getSavedTab);
  const [isMenuOpen, setIsMenuOpen]   = useState(false);
  const [liveData, setLiveData]       = useState(null);
  const [isSyncing, setIsSyncing]     = useState(false);
  const [gasError, setGasError]       = useState(false);
  const [lastSynced, setLastSynced]   = useState(null);

  const { log: activityLog, addEntry, clearLog, metrics } = useActivityLog();
  const { dark, toggle: toggleDark } = useDarkMode();
  const { items: notifItems, unseenItems, unseenCount, loading: notifLoading, markSeen, markAllSeen, refresh: refreshNotifs } = useNotifications();
  const [notifOpen, setNotifOpen] = useState(false);

  // Persist active tab
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('rf_activeTab', tab);
    setIsMenuOpen(false); // close mobile menu on nav
  };

  // ── GAS fetch with proper error handling ────────────────────────────────────
  const fetchLiveData = useCallback(async () => {
    setIsSyncing(true);
    setGasError(false);
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout
      const response = await fetch(GAS_API_URL, { signal: controller.signal });
      clearTimeout(timeout);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setLiveData(data);
      setLastSynced(new Date());
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('GAS sync unavailable — using local data:', err.message);
      }
      setGasError(true);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchLiveData]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && setIsMenuOpen(false);
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ── Resolved data (live > fallback) ─────────────────────────────────────────
  const revenueGoal      = liveData?.revenue?.goal        ?? REVENUE.goal;
  const currentRevenue   = liveData?.revenue?.current     ?? REVENUE.current;
  const cashBufferGoal   = REVENUE.cashBufferGoal;
  const currentCashBuffer= liveData?.revenue?.cashBuffer  ?? REVENUE.cashBuffer;
  const pipelineValue    = liveData?.revenue?.pipeline    ?? REVENUE.pipeline;
  const urgentTasks      = liveData?.tasks?.length > 0 ? liveData.tasks : URGENT_TASKS;

  return (
    <div className="dashboard-wrapper">

      {/* ── Mobile overlay ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ────────────────────────────────────────────────────────── */}
      <aside className={`sidebar ${isMenuOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-logo">
          Rhyno<span>flow</span>
        </div>

        <nav className="flex-1">
          <NavItem icon={<BarChart3 size={20} />} label="Overview"    active={activeTab === 'Overview'}    onClick={() => handleTabChange('Overview')} />
          <NavItem icon={<Zap size={20} />}       label="Clients"     active={activeTab === 'Clients'}     onClick={() => handleTabChange('Clients')} />
          <NavItem icon={<Inbox size={20} />}     label="Leads"       active={activeTab === 'Leads'}       onClick={() => handleTabChange('Leads')} />
          <NavItem icon={<Layers size={20} />}    label="Automations" active={activeTab === 'Automations'} onClick={() => handleTabChange('Automations')} />
          <NavItem icon={<Activity size={20} />}    label="Health"      active={activeTab === 'Health'}      onClick={() => handleTabChange('Health')} />
          <NavItem icon={<DollarSign size={20} />} label="Finance"     active={activeTab === 'Finance'}     onClick={() => handleTabChange('Finance')} />

          <div className="nav-section-title">System</div>
          <NavItem icon={<Settings size={20} />}  label="Settings"    active={activeTab === 'Settings'}    onClick={() => handleTabChange('Settings')} />

          <div className="nav-section-title">Quick Access</div>
          <a href={QUICK_LINKS.revenueSheet} target="_blank" rel="noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-brand-green hover:bg-emerald-50/50 transition-all font-bold text-sm">
            <FileText size={20} /><span>Revenue Sheet</span>
          </a>
          <a href={QUICK_LINKS.leadMasterList} target="_blank" rel="noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-brand-green hover:bg-emerald-50/50 transition-all font-bold text-sm">
            <Users size={20} /><span>Lead Master List</span>
          </a>
        </nav>

        {/* Sidebar footer */}
        <div className="px-4 py-3 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
            RhynoFlow OS · v2.0
          </p>
        </div>
      </aside>

      {/* ── Main Area ──────────────────────────────────────────────────────── */}
      <main className="main-content">

        {/* ── Top Header ── */}
        <header className="top-header">
          <div className="flex items-center gap-3 min-w-0">
            {/* Hamburger — mobile only */}
            <button
              className="mobile-menu-btn"
              onClick={() => setIsMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span className="font-bold text-slate-400 whitespace-nowrap hidden sm:block">RhynoFlow OS</span>
            <ChevronRight size={14} className="text-slate-300 shrink-0 hidden sm:block" />
            <span className="font-bold text-slate-800 truncate">{activeTab}</span>
          </div>

          <div className="header-actions shrink-0">
            <button
              onClick={fetchLiveData}
              disabled={isSyncing}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all
                ${isSyncing
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  : 'bg-brand-green/10 text-brand-green hover:bg-brand-green hover:text-white'
                }`}
            >
              {isSyncing
                ? <RefreshCw size={14} className="animate-spin" />
                : <Zap size={14} />
              }
              <span className="hidden sm:inline">
                {isSyncing ? 'SYNCING...' : 'RUN ALL HOOKS'}
              </span>
            </button>

            <div className="notification-badge mx-4 relative">
              <button
                onClick={() => { setNotifOpen(v => !v); if (!notifOpen) refreshNotifs(); }}
                className="relative p-1 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Notifications"
              >
                <Bell size={20} className={unseenCount > 0 ? 'text-brand-green' : 'text-slate-500'} />
                {unseenCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center">
                    {unseenCount > 9 ? '9+' : unseenCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <NotificationPanel
                  items={notifItems}
                  unseenItems={unseenItems}
                  loading={notifLoading}
                  onMarkSeen={markSeen}
                  onMarkAllSeen={markAllSeen}
                  onRefresh={refreshNotifs}
                  onClose={() => setNotifOpen(false)}
                />
              )}
            </div>

            <div className="profile-box pl-4 border-l border-slate-100 flex items-center gap-3">
              <div className="w-9 h-9 shrink-0 rounded-full bg-brand-dark flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-transparent hover:ring-brand-green transition-all">
                D
              </div>
              <span className="text-sm font-bold text-slate-900 hidden sm:block leading-tight">Deng</span>
            </div>
          </div>
        </header>

        {/* ── GAS Error Banner — only show if GAS_API_URL is a real deployed endpoint ── */}
        {/* Suppressed until GAS is deployed */}

        {/* ── Content View ── */}
        <div className="view-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
            >
              {/* View header */}
              <div className="view-header flex justify-between items-end">
                <div>
                  <h1 className="view-title">{activeTab}</h1>
                  <p className="text-slate-500 font-medium">
                    RhynoFlow OS &middot; <span className="text-brand-green font-bold italic">Active Intelligence</span>
                  </p>
                </div>
                <div className="health-pill mb-1 shadow-sm">
                  <div className="status-dot animate-pulse" />
                  <span>{isSyncing ? 'Syncing…' : 'OS Live'}</span>
                  {lastSynced && (
                    <span className="text-[10px] text-slate-400 ml-1 hidden sm:inline">
                      · {lastSynced.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              </div>

              {/* Views */}
              {activeTab === 'Overview' && (
                <OverviewView
                  revenueGoal={revenueGoal}
                  currentRevenue={currentRevenue}
                  cashBufferGoal={cashBufferGoal}
                  currentCashBuffer={currentCashBuffer}
                  pipelineValue={pipelineValue}
                  urgentTasks={urgentTasks}
                  obsidianWins={liveData?.obsidian?.wins}
                  obsidianTasks={liveData?.obsidian?.tasks}
                  activityLog={activityLog}
                  metrics={metrics}
                />
              )}
              {activeTab === 'Clients'     && <ClientsView />}
              {activeTab === 'Leads'       && <LeadsView />}
              {activeTab === 'Automations' && <AutomationsView onRunAutomation={addEntry} />}
              {activeTab === 'Health'      && <HealthView />}
              {activeTab === 'Finance'     && <FinanceView liveExpenses={liveData?.expenses} />}
              {activeTab === 'Settings'    && <SettingsView onClearLog={clearLog} dark={dark} onToggleDark={toggleDark} />}

            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default App;
