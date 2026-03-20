import { useState } from 'react';
import { TrendingUp, DollarSign, AlertTriangle, ExternalLink, RefreshCw, Receipt } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { QUICK_LINKS } from '../data/config';

// ─── Static expense data (replaced by liveData?.expenses when GAS is live) ───
const FALLBACK_EXPENSES = [
  { date: 'Mar 18', vendor: 'DHL Express',    desc: 'Import duty — GLORY SPORTWEAR',     amount: 614,  category: 'Equipment',    status: 'Paid' },
  { date: 'Mar 18', vendor: 'Anthropic',       desc: 'Claude API — Receipt #2711-7649',   amount: 101,  category: 'Tech / AI',    status: 'Paid' },
  { date: 'Mar 16', vendor: 'Netlify',         desc: '1000 credits/month — hosting',       amount: 63,   category: 'Tech / AI',    status: 'Paid' },
  { date: 'Mar 16', vendor: 'Swapfiets',       desc: 'Invoice 878864-2506',               amount: 217,  category: 'Subscriptions',status: 'Disputed' },
  { date: 'Mar 15', vendor: 'Anthropic',       desc: 'Claude API — Receipt #2935-9950',   amount: 96,   category: 'Tech / AI',    status: 'Paid' },
  { date: 'Mar 15', vendor: 'Anthropic',       desc: 'Claude API — Receipt #2152-0080',   amount: 96,   category: 'Tech / AI',    status: 'Paid' },
  { date: 'Mar 13', vendor: 'DSB',             desc: 'Train — kvittering',                amount: 89,   category: 'Transport',    status: 'Paid' },
  { date: 'Mar 12', vendor: 'Anthropic',       desc: 'Claude API — Receipt #2912-0787',   amount: 96,   category: 'Tech / AI',    status: 'Paid' },
  { date: 'Mar 12', vendor: 'Anthropic',       desc: 'Claude API — FAILED PAYMENT',       amount: 101,  category: 'Tech / AI',    status: 'Failed' },
  { date: 'Mar 11', vendor: 'DSB',             desc: 'Pendlerkort — Espergærde + Metro',   amount: 312,  category: 'Transport',    status: 'Paid' },
];

const CATEGORY_COLORS = {
  'Tech / AI':    '#00c853',
  'Transport':    '#2196f3',
  'Equipment':    '#ff9800',
  'Subscriptions':'#9c27b0',
  'Club Payments':'#f44336',
  'Other':        '#78909c',
};

const statusStyle = {
  Paid:     'bg-emerald-50 text-emerald-700',
  Failed:   'bg-red-50 text-red-600',
  Disputed: 'bg-amber-50 text-amber-600',
  Pending:  'bg-slate-100 text-slate-500',
};

const FinanceView = ({ liveExpenses }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const expenses   = liveExpenses?.items?.length > 0 ? liveExpenses.items : FALLBACK_EXPENSES;
  const isLiveData = liveExpenses?.items?.length > 0;

  // ── Totals by category ──────────────────────────────────────────────────────
  const totals = expenses.reduce((acc, e) => {
    if (e.status !== 'Failed') {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
    }
    return acc;
  }, {});

  const grandTotal  = Object.values(totals).reduce((a, b) => a + b, 0);
  const chartData   = Object.entries(totals).map(([name, value]) => ({ name, value }))
                        .sort((a, b) => b.value - a.value);
  const categories  = ['All', ...Object.keys(totals)];

  const filtered = activeCategory === 'All'
    ? expenses
    : expenses.filter(e => e.category === activeCategory);

  const alerts = expenses.filter(e => e.status === 'Failed' || e.status === 'Disputed');

  return (
    <>
      {/* ── Alert bar ─────────────────────────────────────────────────────── */}
      {alerts.length > 0 && (
        <div className="flex items-center gap-3 px-5 py-3 mb-6 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs font-bold">
          <AlertTriangle size={14} className="shrink-0" />
          <span>{alerts.length} item{alerts.length > 1 ? 's' : ''} need attention —&nbsp;
            {alerts.map(a => `${a.vendor} (${a.status})`).join(', ')}
          </span>
        </div>
      )}

      {/* ── Summary stat cards ────────────────────────────────────────────── */}
      <div className="stats-grid mb-6">
        <div className="rhyno-card">
          <div className="card-icon-box"><DollarSign size={24} /></div>
          <div className="stat-label">Total Expenses</div>
          <div className="stat-value">{grandTotal.toLocaleString('da-DK')} kr</div>
          <p className="text-xs text-slate-400 font-medium mt-1">March 2026</p>
        </div>
        <div className="rhyno-card">
          <div className="card-icon-box"><TrendingUp size={24} /></div>
          <div className="stat-label">Tech / AI</div>
          <div className="stat-value">{(totals['Tech / AI'] || 0).toLocaleString('da-DK')} kr</div>
          <p className="text-xs text-slate-400 font-medium mt-1">Anthropic + Netlify</p>
        </div>
        <div className="rhyno-card">
          <div className="card-icon-box"><Receipt size={24} /></div>
          <div className="stat-label">Receipts Logged</div>
          <div className="stat-value">{expenses.length}</div>
          <p className={`text-xs font-bold mt-1 ${isLiveData ? 'text-brand-green' : 'text-slate-400'}`}>
            {isLiveData ? '● Live from Sheets' : '● Local data'}
          </p>
        </div>
        <div className="rhyno-card">
          <div className="card-icon-box" style={{ background: '#fff0f0', color: '#e53935' }}>
            <AlertTriangle size={24} />
          </div>
          <div className="stat-label">Needs Attention</div>
          <div className="stat-value" style={{ color: alerts.length ? '#e53935' : 'inherit' }}>{alerts.length}</div>
          <p className="text-xs text-slate-400 font-medium mt-1">Failed or disputed</p>
        </div>
      </div>

      <div className="intel-grid">
        {/* ── Bar chart ──────────────────────────────────────────────────── */}
        <div className="rhyno-card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg">Spending by Category</h3>
            <a href={QUICK_LINKS.revenueSheet} target="_blank" rel="noreferrer"
              className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-brand-green transition-colors">
              <ExternalLink size={12} /> Open Sheet
            </a>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                tickFormatter={v => v === 0 ? '' : `${v}`} />
              <Tooltip
                formatter={(v, n) => [`${v.toLocaleString('da-DK')} kr`, n]}
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12, fontWeight: 700 }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] ?? '#78909c'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Category totals ─────────────────────────────────────────────── */}
        <div className="rhyno-card">
          <h3 className="font-bold text-lg mb-5">Breakdown</h3>
          <div className="space-y-3">
            {chartData.map(({ name, value }) => (
              <div key={name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: CATEGORY_COLORS[name] ?? '#78909c' }} />
                  <span className="text-sm font-bold text-slate-700">{name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-slate-900">{value.toLocaleString('da-DK')} kr</span>
                  <span className="text-[10px] text-slate-400 font-bold ml-2">
                    {Math.round((value / grandTotal) * 100)}%
                  </span>
                </div>
              </div>
            ))}
            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <span className="text-sm font-black text-slate-900">Total</span>
              <span className="text-base font-black text-brand-green">{grandTotal.toLocaleString('da-DK')} kr</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Expense table ───────────────────────────────────────────────────── */}
      <div className="intel-card shadow-sm mt-6">
        <div className="card-title-bar">
          <h3>Expense Log</h3>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[10px] font-bold px-3 py-1 rounded-full transition-all ${
                  activeCategory === cat
                    ? 'bg-brand-dark text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                {['Date', 'Vendor', 'Description', 'Amount', 'Category', 'Status'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((e, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-xs font-bold text-slate-500 whitespace-nowrap">{e.date}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-800 whitespace-nowrap">{e.vendor}</td>
                  <td className="px-6 py-4 text-xs text-slate-500 max-w-xs truncate">{e.desc}</td>
                  <td className="px-6 py-4 text-sm font-black text-slate-900 whitespace-nowrap">
                    {e.amount.toLocaleString('da-DK')} kr
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                      {e.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${statusStyle[e.status] ?? statusStyle.Pending}`}>
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Receipt size={32} className="mx-auto mb-3 opacity-30" />
              <p className="font-bold text-sm">No expenses in this category</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FinanceView;
