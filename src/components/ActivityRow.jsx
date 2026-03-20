const ActivityRow = ({ time, title, desc, action }) => (
  <div className="activity-row hover:bg-slate-50/50 transition-colors">
    <div className={`activity-time ${time === 'OVERDUE' ? 'text-red-500' : ''}`}>{time}</div>
    <div className="activity-content flex-1 min-w-0">
      <h4>{title}</h4>
      <p className="truncate">{desc}</p>
    </div>
    {action && (
      <a
        href={action.href}
        target={action.href.startsWith('http') ? '_blank' : '_self'}
        rel="noreferrer"
        className="shrink-0 ml-3 text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-brand-green/10 text-brand-green hover:bg-brand-green hover:text-white transition-all whitespace-nowrap"
        onClick={e => e.stopPropagation()}
      >
        {action.label} →
      </a>
    )}
  </div>
);

export default ActivityRow;
