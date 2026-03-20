import { useState, useEffect } from 'react';

// Persists toggle state to localStorage under key rf_setting_<id>
const SettingItem = ({ id, label, desc, initialActive }) => {
  const storageKey = `rf_setting_${id}`;
  const [active, setActive] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved !== null ? JSON.parse(saved) : (initialActive ?? false);
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(active));
  }, [active, storageKey]);

  return (
    <div
      className="flex items-center justify-between group cursor-pointer"
      onClick={() => setActive(v => !v)}
      role="switch"
      aria-checked={active}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && setActive(v => !v)}
    >
      <div>
        <p className="text-sm font-bold text-slate-800 group-hover:text-brand-green transition-colors">{label}</p>
        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">{desc}</p>
      </div>
      <div className={`w-10 h-5 rounded-full relative transition-all duration-300 flex-shrink-0 ${active ? 'bg-brand-green' : 'bg-slate-200'}`}>
        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-1'}`} />
      </div>
    </div>
  );
};

export default SettingItem;
