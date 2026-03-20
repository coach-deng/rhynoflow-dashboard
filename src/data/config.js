// ─── RhynoFlow Dashboard — Central Config & Data ─────────────────────────────
// Move sensitive keys to .env in production: VITE_GAS_API_URL=...

export const GAS_API_URL = import.meta.env.VITE_GAS_API_URL ||
  "https://script.google.com/macros/s/AKfycbxgn1dn0iS0aTn4ADi3WfVyqVIZAS9AMnt-DK718kChOu4nq1MDubRqG-VSYjbRyc4/exec";

export const LEADS_API_URL = import.meta.env.VITE_LEADS_API_URL ||
  "https://rhynoflow-api.coach-258.workers.dev";

export const POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

// ─── Rhynoflow 25k Milestone ──────────────────────────────────────────────────
export const MILESTONE = {
  target: 25000,
  current: 0,
  label: 'App Launch Fund',
  deadline: 'Sep 30, 2026',
  nextClient: 'James Young → Apr 7',
  monthlyRunRate: 0, // updates when James converts to paid
};

// ─── Revenue Targets ─────────────────────────────────────────────────────────
export const REVENUE = {
  goal: 25000,        // 25k milestone target
  current: 0,         // Rhynoflow revenue so far
  cashBufferGoal: 24000,
  cashBuffer: 4000,
  pipeline: 5000,     // James (3,500/mo) + Sofie TBD — potential
};

// ─── Monthly Revenue History (for chart) — Rhynoflow ─────────────────────────
export const REVENUE_HISTORY = [
  { month: 'Mar', revenue: 0,    goal: 25000 },
  { month: 'Apr', revenue: 0,    goal: 25000 },
  { month: 'May', revenue: 0,    goal: 25000 },
  { month: 'Jun', revenue: 0,    goal: 25000 },
  { month: 'Jul', revenue: 0,    goal: 25000 },
  { month: 'Aug', revenue: 0,    goal: 25000 },
  { month: 'Sep', revenue: 0,    goal: 25000 },
];

// ─── Urgent Tasks ─────────────────────────────────────────────────────────────
export const URGENT_TASKS = [
  { title: 'James — GWS Access',        time: 'OVERDUE',    desc: 'Get Google Workspace access → deploy Phase 1 automations (MorningBriefing + EmailCategorizer + SmartReply)',  action: { label: 'Email James', href: 'mailto:james@sportinghealth.dk' } },
  { title: 'Sofie — Board Decision',    time: 'Due Mar 22', desc: 'Follow up if no board decision reply by Mar 22 — book discovery call if approved',                             action: { label: 'Email Sofie',  href: 'mailto:sofiejuleandersen@gmail.com' } },
  { title: 'Board Chairman Candidates', time: 'Due Mar 22', desc: 'Identify 2–3 candidates before General Assembly (Apr 22)',                                                     action: { label: 'Open Notes',   href: 'obsidian://open?vault=SecondBrain&file=Talata/General Assembly 2026' } },
  { title: 'DIF/DGI Foreningspulje',    time: 'Due Mar 31', desc: 'Apply at medlemstal.dk — Talata annual grant deadline',                                                        action: { label: 'Apply Now',    href: 'https://www.medlemstal.dk' } },
  { title: 'James — Convert to Paid',   time: 'Apr 7',      desc: 'Pilot ends Apr 7 — confirm paid plan (Business 3,500 DKK/mo). First Rhynoflow revenue.',                      action: { label: 'Email James',  href: 'mailto:james@sportinghealth.dk' } },
];

// ─── System Health ─────────────────────────────────────────────────────────────
export const SYSTEMS = [
  { name: 'Revenue Tracker 2026',       id: 'REVENUE_SHEET',  status: 'Healthy', lastCheck: 'Today 08:00', client: 'Talata' },
  { name: 'Deadlines & Milestones',     id: 'DEADLINE_SHEET', status: 'Healthy', lastCheck: 'Today 07:30', client: 'Talata' },
  { name: 'Talata Task Tracker',        id: 'TASK_SHEET',     status: 'Healthy', lastCheck: 'Today 07:00', client: 'Talata' },
  { name: 'Talata Contact Master List', id: 'CONTACT_SHEET',  status: 'Healthy', lastCheck: 'Today 07:00', client: 'Talata' },
  { name: 'SHC — Trainer Schedule',     id: 'SHC_SCHEDULE',   status: 'Warning', lastCheck: 'Pending GWS', client: 'SHC' },
  { name: 'SHC — Salary Hours Tracker', id: 'SHC_SALARY',     status: 'Warning', lastCheck: 'Pending GWS', client: 'SHC' },
  { name: 'SHC — Booking System',       id: 'SHC_BOOKINGS',   status: 'Warning', lastCheck: 'Pending GWS', client: 'SHC' },
];

// ─── Automation Templates ─────────────────────────────────────────────────────
export const TEMPLATES = [
  { name: 'MorningBriefing.gs',     desc: 'Daily inbox + calendar summary at 6:30 AM',  status: 'Live',  icon: 'briefing' },
  { name: 'SmartReplyDrafter.gs',   desc: 'AI-powered auto-draft replies with Claude',   status: 'Live',  icon: 'reply' },
  { name: 'EmailCategorizer.gs',    desc: 'Auto-label: Membership, Booking, Inquiry',    status: 'Live',  icon: 'categorize' },
  { name: 'CalendarDigest.gs',      desc: 'Clean daily schedule summary email at 7 AM',  status: 'Live',  icon: 'calendar' },
  { name: 'SubstituteFinder.gs',    desc: 'Auto-broadcast uncovered shifts to trainers', status: 'New',   icon: 'substitute' },
  { name: 'SalaryHoursAuto.gs',     desc: 'Pull trainer hours → Google Sheets monthly',  status: 'New',   icon: 'salary' },
];

// ─── Clients ──────────────────────────────────────────────────────────────────
export const CLIENTS = [
  {
    id: 'james-young',
    name: 'James Young',
    org: 'Sporting Health Club',
    progress: 33,
    status: 'Onboarding',
    phases: ['Discovery', 'GWS Access', 'Script Deploy', 'Monitoring'],
    currentPhase: 1,
    linkedin: 'https://www.linkedin.com/in/james-young-shc/',
    detail: 'Discovery DONE · GWS access overdue — chase James this week',
    location: '7 locations, Copenhagen',
    value: '3,500 DKK/mo',
    tier: 'Business',
    nextActions: [
      'Get Google Workspace access (OVERDUE — chase James)',
      'Deploy MorningBriefing + EmailCategorizer + SmartReply',
      'Build Substitute Finder script (due Mar 25)',
      'Build Salary Hours automation (due Mar 28)',
      'Convert to paid — Apr 7',
    ],
    painPoints: ['Substitute finder', 'Salary hours copy-paste', 'Email management'],
    paidStart: 'Apr 7, 2026',
  },
  {
    id: 'sofie-jule',
    name: 'Sofie Jule Andersen',
    org: 'Dansk Puslespil Forening',
    progress: 15,
    status: 'Lead',
    phases: ['Intro Meeting', 'Board Approval', 'Discovery Call', 'Deploy'],
    currentPhase: 1,
    linkedin: 'https://www.linkedin.com/in/sofiejuleandersen/',
    detail: 'Met Mar 15 · Board review in progress',
    location: 'Copenhagen',
    value: '1,500 DKK/mo',
    tier: 'Forening',
    nextActions: [
      'Follow up if no reply by Mar 22',
      'Once board approves: book discovery call',
      'Scope: email, member comms, deadline tracking',
      'Proposal: Forening plan (no setup — early adopter)',
    ],
    painPoints: ['Email management', 'Member communications', 'Admin workflows'],
    paidStart: 'Target: May 2026',
  },
];

// ─── Quick Access Links ───────────────────────────────────────────────────────
export const QUICK_LINKS = {
  revenueSheet: 'https://docs.google.com/spreadsheets/d/1djqZgHsjZ_17KAhMWXMRt3xRYv38miNfn6bUHQ5k0nA/edit',
  leadMasterList: 'https://drive.google.com/drive/search?q=master+contacts',
};
