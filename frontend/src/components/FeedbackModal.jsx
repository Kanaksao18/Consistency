import React, { useState } from 'react';
import { X, Send, MessageSquare, Loader2, Sparkles } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const FeedbackModal = ({ isOpen, onClose }) => {
  const [type, setType] = useState('Improvement');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setLoading(true);
    try {
      await api.post('/feedback', { type, message });
      toast.success('Strategy log received. Evolution initiated! 🚀');
      setMessage('');
      onClose();
    } catch (err) {
      toast.error('Sync failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Improvement', 'Bug', 'Feature Request', 'Other'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl p-8 sm:p-10 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex items-center space-x-4 mb-8">
           <div className="w-12 h-12 bg-primary-500/10 rounded-2xl flex items-center justify-center text-primary-500">
              <MessageSquare size={24} />
           </div>
           <div>
              <h2 className="text-2xl font-black font-display uppercase tracking-tight">Mission Feedback</h2>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Help us evolve the matrix</p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
           <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Type of intel</label>
              <div className="grid grid-cols-2 gap-3">
                 {categories.map((cat) => (
                   <button
                     key={cat}
                     type="button"
                     onClick={() => setType(cat)}
                     className={`px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                       type === cat 
                         ? 'bg-primary-500 border-primary-600 text-white shadow-lg shadow-primary-500/20' 
                         : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500 hover:border-primary-500/30'
                     }`}
                   >
                     {cat}
                   </button>
                 ))}
              </div>
           </div>

           <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Your suggestion</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we make Consistency. better for you?"
                className="w-full h-40 p-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[1.5rem] text-sm font-medium outline-none focus:ring-4 ring-primary-500/10 transition-all resize-none placeholder:text-slate-400"
                required
              />
           </div>

           <div className="bg-primary-500/5 p-4 rounded-2xl border border-primary-500/10 flex items-start space-x-3">
              <Sparkles size={16} className="text-primary-500 shrink-0 mt-0.5" />
              <p className="text-[10px] font-bold text-primary-600 dark:text-primary-400 leading-relaxed uppercase tracking-tight">
                Your feedback is analyzed by our core team to prioritize the next evolution of the platform.
              </p>
           </div>

           <button
             type="submit"
             disabled={loading || !message.trim()}
             className="w-full py-5 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-sm shadow-xl shadow-primary-500/20 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center"
           >
             {loading ? <Loader2 className="animate-spin mr-2" size={20} /> : <Send className="mr-2" size={18} />}
             Broadcast Suggestion
           </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
