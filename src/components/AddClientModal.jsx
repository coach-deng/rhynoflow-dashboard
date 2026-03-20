import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, UserPlus } from 'lucide-react';
import { TIERS, STATUSES, TIER_PHASES } from '../hooks/useClients';

const EMPTY = {
  name: '', org: '', location: '', linkedin: '',
  tier: 'Business', status: 'Onboarding', value: '', detail: '',
};

const AddClientModal = ({ onClose, onSave }) => {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm(prev => ({ ...prev, [k]: v }));
    setErrors(prev => ({ ...prev, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name = 'Name is required';
    if (!form.org.trim())   e.org  = 'Organisation is required';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
    onClose();
  };

  const phases = TIER_PHASES[form.tier] ?? TIER_PHASES.Solo;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-green/10 flex items-center justify-center">
              <UserPlus size={16} className="text-brand-green" />
            </div>
            <h3 className="font-extrabold text-xl tracking-tight text-slate-900">Add New Client</h3>
          </div>
          <button
            className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <div className="p-8 overflow-y-auto flex-1 space-y-5">
          {/* Name + Org */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Client Name *" error={errors.name}>
              <input
                className={inputCls(errors.name)}
                placeholder="James Young"
                value={form.name}
                onChange={e => set('name', e.target.value)}
              />
            </Field>
            <Field label="Organisation *" error={errors.org}>
              <input
                className={inputCls(errors.org)}
                placeholder="Sporting Health Club"
                value={form.org}
                onChange={e => set('org', e.target.value)}
              />
            </Field>
          </div>

          {/* Tier + Status */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tier">
              <select className={inputCls()} value={form.tier} onChange={e => set('tier', e.target.value)}>
                {TIERS.map(t => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select className={inputCls()} value={form.status} onChange={e => set('status', e.target.value)}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          {/* Phases preview */}
          <div className="p-4 bg-slate-50 rounded-xl">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Onboarding Phases ({form.tier})</p>
            <div className="flex gap-2 flex-wrap">
              {phases.map((p, i) => (
                <span key={p} className={`text-xs font-bold px-2 py-1 rounded-full ${i === 0 ? 'bg-brand-green/10 text-brand-green' : 'bg-slate-100 text-slate-500'}`}>
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* Value + Location */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Monthly Value">
              <input
                className={inputCls()}
                placeholder="1,500 DKK/mo"
                value={form.value}
                onChange={e => set('value', e.target.value)}
              />
            </Field>
            <Field label="Location">
              <input
                className={inputCls()}
                placeholder="Copenhagen"
                value={form.location}
                onChange={e => set('location', e.target.value)}
              />
            </Field>
          </div>

          {/* LinkedIn */}
          <Field label="LinkedIn URL">
            <input
              className={inputCls()}
              placeholder="https://linkedin.com/in/..."
              value={form.linkedin}
              onChange={e => set('linkedin', e.target.value)}
            />
          </Field>

          {/* Notes */}
          <Field label="Status note">
            <input
              className={inputCls()}
              placeholder="Discovery done · Waiting for GWS access"
              value={form.detail}
              onChange={e => set('detail', e.target.value)}
            />
          </Field>
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-slate-100 flex gap-3 flex-shrink-0">
          <button className="flex-1 btn-primary py-3" onClick={handleSave}>
            Add Client
          </button>
          <button className="btn-ghost px-6 py-3" onClick={onClose}>
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const inputCls = (error) =>
  `w-full px-4 py-2.5 rounded-xl border text-sm font-medium outline-none transition-all
   ${error
     ? 'border-red-300 bg-red-50 focus:border-red-400'
     : 'border-slate-200 bg-slate-50 focus:border-brand-green focus:bg-white'
   }`;

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">{label}</label>
    {children}
    {error && <p className="text-[10px] text-red-500 font-bold mt-1">{error}</p>}
  </div>
);

export default AddClientModal;
