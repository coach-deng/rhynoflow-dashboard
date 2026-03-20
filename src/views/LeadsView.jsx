import { useState, useEffect } from 'react';
import { Mail, Building2, RefreshCw, CalendarCheck, FileText, Send } from 'lucide-react';
import { LEADS_API_URL } from '../data/config';

const LeadsView = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${LEADS_API_URL}/leads`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setLeads(data.leads ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const calLeads  = leads.filter(l => l.org === 'cal.com');
  const formLeads = leads.filter(l => l.org !== 'cal.com');

  const buildReplyHref = (lead) => {
    const isCal = lead.org === 'cal.com';
    const subject = isCal
      ? `Re: Your Rhynoflow demo`
      : `Re: Your message to Rhynoflow`;
    const body = isCal
      ? `Hi ${lead.name},\n\nLooking forward to our demo. Let me know if anything comes up before then.\n\nBest,\nDeng — Rhynoflow`
      : `Hi ${lead.name},\n\nThanks for reaching out! Happy to jump on a quick call to walk you through what Rhynoflow can do for you.\n\nWould [day/time] work?\n\nBest,\nDeng — Rhynoflow`;
    return `mailto:${lead.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="space-y-6">

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="metric-card">
          <div className="metric-label">Total Leads</div>
          <div className="metric-value">{loading ? '–' : leads.length}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Cal.com Bookings</div>
          <div className="metric-value" style={{ color: '#3b82f6' }}>{loading ? '–' : calLeads.length}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Contact Forms</div>
          <div className="metric-value" style={{ color: 'var(--brand-green)' }}>{loading ? '–' : formLeads.length}</div>
        </div>
      </div>

      {/* List header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-700">
          All Inbound Leads
          {!loading && <span className="ml-2 text-xs font-medium text-slate-400">· newest first</span>}
        </h2>
        <button
          onClick={fetchLeads}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold bg-brand-green/10 text-brand-green hover:bg-brand-green hover:text-white transition-all disabled:opacity-40"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* States */}
      {loading && (
        <div className="text-center py-16 text-slate-400 font-medium">Loading leads…</div>
      )}

      {!loading && error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
          Could not fetch leads: {error}
        </div>
      )}

      {!loading && !error && leads.length === 0 && (
        <div className="text-center py-16 text-slate-400 font-medium">No leads yet — share rhynoflow.com to get started</div>
      )}

      {/* Leads list */}
      {!loading && !error && leads.length > 0 && (
        <div className="space-y-3">
          {leads.map((lead, i) => {
            const isCal = lead.org === 'cal.com';
            const rawDate = lead.created_at;
            // D1 stores datetime('now') as UTC without Z — append it
            const date = rawDate ? new Date(rawDate.includes('T') ? rawDate + (rawDate.endsWith('Z') ? '' : 'Z') : rawDate.replace(' ', 'T') + 'Z') : null;

            return (
              <div
                key={i}
                className={`p-4 rounded-xl border shadow-sm ${
                  isCal
                    ? 'bg-blue-50/40 border-blue-100'
                    : 'bg-white border-slate-100'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">

                    {/* Name + badge */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-800">{lead.name || '(no name)'}</span>
                      {isCal ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">
                          <CalendarCheck size={10} /> BOOKING
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                          <FileText size={10} /> CONTACT FORM
                        </span>
                      )}
                    </div>

                    {/* Email + org */}
                    <div className="flex items-center gap-4 mt-1 flex-wrap">
                      {lead.email && (
                        <a
                          href={`mailto:${lead.email}`}
                          className="flex items-center gap-1 text-sm text-brand-green hover:underline font-medium"
                        >
                          <Mail size={12} />
                          {lead.email}
                        </a>
                      )}
                      {lead.org && lead.org !== 'cal.com' && (
                        <span className="flex items-center gap-1 text-sm text-slate-500">
                          <Building2 size={12} />
                          {lead.org}
                        </span>
                      )}
                    </div>

                    {/* Message */}
                    {lead.message && (
                      <p className="text-sm text-slate-500 mt-1.5 leading-snug">{lead.message}</p>
                    )}
                  </div>

                  {/* Date + Reply */}
                  <div className="text-right shrink-0 flex flex-col items-end gap-2">
                    {date && !isNaN(date) ? (
                      <>
                        <div className="text-[11px] font-semibold text-slate-500">
                          {date.toLocaleDateString('da-DK', { day: '2-digit', month: 'short' })}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {date.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </>
                    ) : (
                      <span className="text-[10px] text-slate-400">–</span>
                    )}
                    {lead.email && (
                      <a
                        href={buildReplyHref(lead)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold bg-brand-green/10 text-brand-green hover:bg-brand-green hover:text-white transition-all"
                      >
                        <Send size={10} /> Reply
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LeadsView;
