import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Users, Mail, FileText, Linkedin, DollarSign, Plus, Trash2, ChevronRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import ClientCard from '../components/ClientCard';
import Modal from '../components/Modal';
import AddClientModal from '../components/AddClientModal';
import { useClients } from '../hooks/useClients';

const ClientsView = () => {
  const { clients, addClient, deleteClient, advancePhase } = useClients();
  const [selected, setSelected]     = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleDelete = (id) => {
    deleteClient(id);
    setSelected(null);
    setConfirmDelete(null);
  };

  return (
    <>
      {/* Header row with Add button */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500 font-medium">
          {clients.length} client{clients.length !== 1 ? 's' : ''} · {clients.filter(c => c.status === 'Active' || c.status === 'Onboarding').length} active
        </p>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-green text-white text-xs font-bold hover:bg-emerald-600 transition-all shadow-sm"
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={14} />
          Add Client
        </button>
      </div>

      {/* Client cards */}
      {clients.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <Users size={40} className="mx-auto mb-4 opacity-30" />
          <p className="font-bold">No clients yet</p>
          <p className="text-sm mt-1">Add your first client to get started</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-8">
          {clients.map(client => (
            <ClientCard
              key={client.id}
              name={client.name}
              org={client.org}
              progress={client.progress}
              status={client.status}
              phases={client.phases}
              currentPhase={client.currentPhase}
              linkedin={client.linkedin}
              onSelect={() => setSelected(client)}
            />
          ))}
        </div>
      )}

      {/* Add Client modal */}
      <AnimatePresence>
        {showAddForm && (
          <AddClientModal
            onClose={() => setShowAddForm(false)}
            onSave={addClient}
          />
        )}
      </AnimatePresence>

      {/* Client detail modal */}
      <AnimatePresence>
        {selected && (
          <Modal title={selected.name} onClose={() => setSelected(null)}>
            <div className="space-y-5">
              {/* Header block */}
              <div className="p-6 bg-brand-dark text-white rounded-2xl relative overflow-hidden">
                <Users size={48} className="absolute -right-4 -bottom-4 opacity-10 rotate-12" />
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Client Intel</p>
                    <p className="text-xs text-slate-300">{selected.org}{selected.location ? ` · ${selected.location}` : ''}</p>
                  </div>
                  {selected.linkedin && (
                    <a href={selected.linkedin} target="_blank" rel="noreferrer"
                      className="text-brand-green hover:text-white transition-colors p-1">
                      <Linkedin size={18} />
                    </a>
                  )}
                </div>
                <h3 className="text-lg font-bold mb-4">{selected.detail || `${selected.status} — Phase ${selected.currentPhase + 1} of ${selected.phases.length}`}</h3>
                <div className="flex gap-2 mb-2">
                  {selected.phases.map((p, i) => (
                    <div key={p}
                      className={`h-1 flex-1 rounded-full ${i <= selected.currentPhase ? 'bg-brand-green' : 'bg-slate-700'}`}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  <span>{selected.phases[selected.currentPhase]}</span>
                  <span>{selected.progress}% complete</span>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <DollarSign size={16} className="text-brand-green shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Monthly Value</p>
                    <p className="text-sm font-bold">{selected.value || 'TBD'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <FileText size={16} className="text-brand-green shrink-0" />
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Tier</p>
                    <p className="text-sm font-bold">{selected.tier || 'Business'}</p>
                  </div>
                </div>
                {selected.paidStart && (
                  <div className="col-span-2 flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <Clock size={16} className="text-brand-green shrink-0" />
                    <div>
                      <p className="text-[10px] text-emerald-600 font-bold uppercase">Paid Start</p>
                      <p className="text-xs font-bold text-slate-700">{selected.paidStart}</p>
                    </div>
                  </div>
                )}
                {selected.painPoints?.length > 0 && (
                  <div className="col-span-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Pain Points</p>
                    <div className="flex flex-wrap gap-1.5">
                      {selected.painPoints.map(p => (
                        <span key={p} className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">{p}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Next Actions */}
              {selected.nextActions?.length > 0 && (
                <div className="p-4 bg-slate-900 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <AlertCircle size={10} className="text-brand-green" /> Next Actions
                  </p>
                  <div className="space-y-2">
                    {selected.nextActions.map((action, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center mt-0.5 shrink-0">
                          <span className="text-[8px] font-black text-slate-500">{i + 1}</span>
                        </div>
                        <p className="text-xs text-slate-300 font-medium leading-snug">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {selected.currentPhase < selected.phases.length - 1 && (
                  <button
                    className="flex-1 flex items-center justify-center gap-2 btn-primary py-3 text-xs"
                    onClick={() => { advancePhase(selected.id); setSelected(c => ({ ...c, currentPhase: Math.min(c.currentPhase + 1, c.phases.length - 1), progress: Math.round(((c.currentPhase + 1) / (c.phases.length - 1)) * 100) })); }}
                  >
                    <ChevronRight size={14} />
                    Advance to {selected.phases[selected.currentPhase + 1]}
                  </button>
                )}
                <button
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border border-red-100 text-red-400 hover:bg-red-50 text-xs font-bold transition-all"
                  onClick={() => setConfirmDelete(selected.id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <button className="w-full btn-ghost py-3 text-xs" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Confirm delete */}
      <AnimatePresence>
        {confirmDelete && (
          <Modal title="Remove Client?" onClose={() => setConfirmDelete(null)}>
            <div className="space-y-5">
              <p className="text-sm text-slate-600">This will remove the client from your dashboard. This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all"
                  onClick={() => handleDelete(confirmDelete)}
                >
                  Remove Client
                </button>
                <button className="btn-ghost px-6 py-3" onClick={() => setConfirmDelete(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
};

export default ClientsView;
