import { useState, useEffect, useCallback } from 'react';
import { LEADS_API_URL, URGENT_TASKS, GAS_API_URL } from '../data/config';

const SEEN_KEY = 'rf_seenNotifications';

function loadSeen() {
  try { return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || '[]')); }
  catch { return new Set(); }
}

function saveSeen(set) {
  localStorage.setItem(SEEN_KEY, JSON.stringify([...set].slice(-200)));
}

export function useNotifications() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [seen, setSeen]       = useState(loadSeen);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    const results = [];

    // ── 1. New leads (last 48h) ─────────────────────────────────────────────
    try {
      const res  = await fetch(`${LEADS_API_URL}/leads`);
      const data = await res.json();
      const cutoff = Date.now() - 48 * 60 * 60 * 1000;

      (data.leads ?? []).forEach(lead => {
        const raw = lead.created_at;
        const ts  = raw
          ? new Date(raw.includes('T') ? raw + (raw.endsWith('Z') ? '' : 'Z') : raw.replace(' ', 'T') + 'Z').getTime()
          : 0;
        if (ts < cutoff) return;

        const isCal = lead.org === 'cal.com';
        results.push({
          id:     `lead-${lead.id}`,
          type:   'lead',
          title:  isCal ? `📅 New booking: ${lead.name}` : `🔔 New lead: ${lead.name}`,
          desc:   lead.email,
          time:   ts,
          urgent: true,
          action: { label: 'Reply', href: `mailto:${lead.email}` },
        });
      });
    } catch (_) {}

    // ── 2. Urgent/overdue tasks ─────────────────────────────────────────────
    URGENT_TASKS.forEach((task, i) => {
      const isOverdue = task.time === 'OVERDUE';
      results.push({
        id:     `task-${i}`,
        type:   'task',
        title:  `⚠️ ${task.title}`,
        desc:   task.desc,
        time:   isOverdue ? Date.now() - 1000 : Date.now() - i * 60000,
        urgent: isOverdue,
        action: task.action ?? null,
      });
    });

    // ── 3. Gmail drafts (from GAS API if available) ─────────────────────────
    try {
      const res  = await fetch(`${GAS_API_URL}?action=drafts`);
      const data = await res.json();
      (data.drafts ?? []).forEach((draft, i) => {
        results.push({
          id:     `draft-${i}`,
          type:   'draft',
          title:  `📧 Unsent draft: ${draft.subject || '(no subject)'}`,
          desc:   draft.to ? `To: ${draft.to}` : 'Pending send',
          time:   draft.ts ?? Date.now() - i * 60000,
          urgent: false,
          action: draft.url ? { label: 'Open', href: draft.url } : null,
        });
      });
    } catch (_) {}

    // Sort: urgent first, then newest
    results.sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0) || b.time - a.time);
    setItems(results);
    setLoading(false);
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  const markSeen = useCallback((id) => {
    setSeen(prev => {
      const next = new Set(prev);
      next.add(id);
      saveSeen(next);
      return next;
    });
  }, []);

  const markAllSeen = useCallback(() => {
    setSeen(prev => {
      const next = new Set(prev);
      items.forEach(item => next.add(item.id));
      saveSeen(next);
      return next;
    });
  }, [items]);

  const unseenItems  = items.filter(i => !seen.has(i.id));
  const unseenCount  = unseenItems.length;

  return { items, unseenItems, unseenCount, loading, markSeen, markAllSeen, refresh: fetch_ };
}
