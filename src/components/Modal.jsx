import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ title, onClose, children }) => (
  <div
    className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm"
    onClick={(e) => e.target === e.currentTarget && onClose()}
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden border border-slate-100"
    >
      <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
        <h3 className="font-extrabold text-xl tracking-tight text-slate-900">{title}</h3>
        <button
          className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all shadow-sm"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>
      </div>
      <div className="p-8">{children}</div>
    </motion.div>
  </div>
);

export default Modal;
