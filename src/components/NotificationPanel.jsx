import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RefreshCw, CheckCheck, ExternalLink } from 'lucide-react';

const TYPE_COLORS = {
  lead:  { bg: 'bg-blue-50',   border: 'border-blue-100',   dot: 'bg-blue-400' },
  task:  { bg: 'bg-amber-50',  border: 'border-amber-100',  dot: 'bg-amber-400' },
  draft: { bg: 'bg-violet-50', border: 'border-violet-100', dot: 'bg-violet-400' },
  event: { bg: 'bg-emerald-50',border: 'border-emerald-100',dot: 'bg-emerald-400' },
};

const timeAgo = (ts) => {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

const NotificationPanel = ({ items, unseenItems, loading, onMarkSeen, onMarkAllSeen, onRefresh, onClose }) => {
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const sections = [
    { label: '🔴 Needs Action',  filter: i => i.urgent,        items: items.filter(i => i.urgent) },
    { label: '📋 Pending',       filter: i => !i.urgent,       items: items.filter(i => !i.urgent) },
  ].filter(s => s.items.length > 0);

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0,  scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.97 }}
        transition={{ duration: 0.15 }}
        className="notification-panel"
      >
        {/* Header */}
        <div className="notification-header">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm" style={{color:'#f1f5f9'}}>Pending Work</span>
            {unseenItems.length > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{background:'#ef4444',color:'white'}}>
                {unseenItems.length} new
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-1.5 rounded-lg transition-all"
              style={{color:'rgba(255,255,255,0.4)'}}
              title="Refresh"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            </button>
            {unseenItems.length > 0 && (
              <button
                onClick={onMarkAllSeen}
                className="p-1.5 rounded-lg transition-all"
                style={{color:'rgba(255,255,255,0.4)'}}
                title="Mark all seen"
              >
                <CheckCheck size={13} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-all"
              style={{color:'rgba(255,255,255,0.4)'}}
            >
              <X size={13} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="notification-body">
          {loading && (
            <div className="py-8 text-center text-slate-400 text-xs font-medium">Loading…</div>
          )}

          {!loading && items.length === 0 && (
            <div className="py-10 text-center">
              <div className="text-2xl mb-2">✅</div>
              <p className="text-sm font-bold" style={{color:'#f1f5f9'}}>All clear</p>
              <p className="text-xs mt-1" style={{color:'rgba(255,255,255,0.35)'}}>Nothing pending right now</p>
            </div>
          )}

          {!loading && sections.map(section => (
            <div key={section.label} className="notification-section">
              <div className="notification-section-label">{section.label}</div>
              {section.items.map(item => {
                const colors = TYPE_COLORS[item.type] ?? TYPE_COLORS.task;
                const isUnseen = unseenItems.some(u => u.id === item.id);
                return (
                  <div
                    key={item.id}
                    className={`notification-item ${colors.bg} ${colors.border} ${isUnseen ? 'ring-1 ring-blue-200' : ''}`}
                    onClick={() => onMarkSeen(item.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`notification-dot ${colors.dot} ${isUnseen ? 'animate-pulse' : ''}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-800 leading-snug">{item.title}</p>
                        {item.desc && (
                          <p className="text-[11px] text-slate-500 mt-0.5 truncate">{item.desc}</p>
                        )}
                        <div className="flex items-center justify-between mt-2 gap-2">
                          <span className="text-[10px] text-slate-400 font-medium">{timeAgo(item.time)}</span>
                          {item.action && (
                            <a
                              href={item.action.href}
                              target={item.action.href.startsWith('mailto') ? '_self' : '_blank'}
                              rel="noreferrer"
                              onClick={e => e.stopPropagation()}
                              className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-brand-green hover:bg-brand-green hover:text-white hover:border-brand-green transition-all"
                            >
                              {item.action.label}
                              <ExternalLink size={8} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 text-center" style={{borderTop:'1px solid rgba(255,255,255,0.06)'}}>
          <p className="text-[10px]" style={{color:'rgba(255,255,255,0.25)'}}>
            WhatsApp not connected — check manually
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationPanel;
