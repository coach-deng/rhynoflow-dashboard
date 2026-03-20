import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'rf_activityLog';
const MAX_ENTRIES = 100;

// Seed with realistic recent history if log is empty
const SEED_LOG = [
  { id: 's1', ts: Date.now() - 1000*60*8,    automation: 'SmartReplyDrafter', action: '3 drafts created — camp inquiry, billing question, membership', status: 'success', client: 'Talata' },
  { id: 's2', ts: Date.now() - 1000*60*32,   automation: 'MorningBriefing',   action: 'Daily briefing sent — 5 events, 12 unread emails flagged',     status: 'success', client: 'Talata' },
  { id: 's3', ts: Date.now() - 1000*60*55,   automation: 'SubstituteFinder',  action: 'Shift covered — Tue 14:00 spin class, 4 trainers notified',    status: 'success', client: 'SHC' },
  { id: 's4', ts: Date.now() - 1000*60*60,   automation: 'EmailCategorizer',  action: '8 emails labelled — 3 Membership, 2 Booking, 3 Inquiry',       status: 'success', client: 'Talata' },
  { id: 's5', ts: Date.now() - 1000*60*120,  automation: 'RevenueTracker',    action: 'MobilePay sync — 700 kr logged, 1% fee deducted (693 kr net)', status: 'success', client: 'Talata' },
  { id: 's6', ts: Date.now() - 1000*60*180,  automation: 'SubstituteFinder',  action: 'Alert sent — Thu 09:00 PT session needs cover, 2 available',   status: 'success', client: 'SHC' },
  { id: 's7', ts: Date.now() - 1000*60*300,  automation: 'SmartReplyDrafter', action: '1 draft created — DGI camp inquiry',                           status: 'success', client: 'Talata' },
  { id: 's8', ts: Date.now() - 1000*60*480,  automation: 'MorningBriefing',   action: 'Daily briefing sent — 3 events, 7 unread emails flagged',       status: 'success', client: 'Talata' },
  { id: 's9', ts: Date.now() - 1000*60*600,  automation: 'DeadlineAlerts',    action: 'Alert sent — DIF/DGI deadline in 7 days (Mar 31)',             status: 'success', client: 'Talata' },
  { id: 's10',ts: Date.now() - 1000*60*1440, automation: 'GameDayReminder',   action: 'Game reminder sent to 23 parents — U17 vs Hørsholm 8 PM',      status: 'success', client: 'Talata' },
  { id: 's11',ts: Date.now() - 1000*60*1500, automation: 'WeeklyParentEmail', action: 'Weekly schedule sent to 149 parents',                          status: 'success', client: 'Talata' },
  { id: 's12',ts: Date.now() - 1000*60*2880, automation: 'SalaryHoursAuto',   action: 'Feb hours logged — 14 trainers, 312 hours exported to Sheets', status: 'success', client: 'SHC' },
  { id: 's13',ts: Date.now() - 1000*60*3000, automation: 'RevenueTracker',    action: 'Weekly summary — 8,418 kr / 22,718 kr goal (37%)',             status: 'success', client: 'Talata' },
];

function loadLog() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return saved.length > 0 ? saved : SEED_LOG;
  } catch {
    return SEED_LOG;
  }
}

export function useActivityLog() {
  const [log, setLog] = useState(loadLog);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(log.slice(0, MAX_ENTRIES)));
  }, [log]);

  const addEntry = useCallback((automation, action, status = 'success', client = 'Talata') => {
    const entry = {
      id:         `e${Date.now()}`,
      ts:         Date.now(),
      automation,
      action,
      status,
      client,
    };
    setLog(prev => [entry, ...prev].slice(0, MAX_ENTRIES));
    return entry;
  }, []);

  const clearLog = useCallback(() => {
    setLog(SEED_LOG);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_LOG));
  }, []);

  // ── Derived metrics ──────────────────────────────────────────────────────────
  const now = Date.now();
  const last7d = log.filter(e => now - e.ts < 7 * 24 * 60 * 60 * 1000);

  const HOURS_SAVED_MAP = {
    SmartReplyDrafter: 0.25,  // 15 min per run
    MorningBriefing:   0.20,  // 12 min saved per briefing
    EmailCategorizer:  0.15,  // 9 min saved per run
    RevenueTracker:    0.30,  // 18 min saved per sync
    GameDayReminder:   0.50,  // 30 min saved per reminder batch
    WeeklyParentEmail: 0.75,  // 45 min saved per email
    DeadlineAlerts:    0.10,  // 6 min saved
    SubstituteFinder:  1.00,  // 60 min saved per sub search
    SalaryHoursAuto:   2.00,  // 2hr saved per monthly run
  };

  const hoursSaved = last7d.reduce((acc, e) => {
    return acc + (HOURS_SAVED_MAP[e.automation] ?? 0.15);
  }, 0);

  const emailsDrafted = last7d
    .filter(e => e.automation === 'SmartReplyDrafter' && e.status === 'success')
    .reduce((acc, e) => {
      const match = e.action.match(/(\d+)\s+draft/);
      return acc + (match ? parseInt(match[1]) : 1);
    }, 0);

  const automationsRun = last7d.filter(e => e.status === 'success').length;

  return {
    log,
    addEntry,
    clearLog,
    metrics: {
      hoursSaved:    Math.round(hoursSaved * 10) / 10,
      emailsDrafted,
      automationsRun,
      successRate:   last7d.length > 0
        ? Math.round((last7d.filter(e => e.status === 'success').length / last7d.length) * 100)
        : 100,
    },
  };
}
