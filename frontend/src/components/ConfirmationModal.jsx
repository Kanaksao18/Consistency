import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', type = 'danger' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
        <div className="p-8 text-center space-y-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto ring-1 ${
            type === 'danger' ? 'bg-rose-500/10 ring-rose-500/30 text-rose-500' : 'bg-amber-500/10 ring-amber-500/30 text-amber-500'
          }`}>
            <AlertTriangle size={32} />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black font-display text-slate-900 dark:text-white uppercase tracking-tight">{title}</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed px-4">
              {message}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button 
              onClick={onClose}
              className="flex-1 px-6 py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className={`flex-1 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all text-white shadow-lg ${
                type === 'danger' ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/20' : 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20'
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
