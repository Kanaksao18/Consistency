import React from 'react';
import { X, Clock, Calendar, CheckCircle, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const TimetableModal = ({ isOpen, onClose, onSuccess, initialDay, initialTime, slotToEdit = null }) => {
  const [taskName, setTaskName] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setTaskName(slotToEdit ? slotToEdit.taskName : '');
    }
  }, [isOpen, slotToEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/timetable', {
        dayOfWeek: initialDay,
        timeSlot: initialTime,
        taskName
      });
      toast.success(slotToEdit ? 'Matrix Re-calibrated! ⚡' : 'Task Integrated into Matrix! 🎯');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error updating timetable:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/30">
          <h2 className="text-xl font-black font-display uppercase tracking-tight flex items-center">
            <Clock className="mr-2 text-primary-500" size={24} />
            Slot Calibration
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="flex items-center space-x-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
             <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-500">
                <Calendar size={20} />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Target Dimension</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white uppercase">{initialDay} at {initialTime}</p>
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Task Definition</label>
            <input 
              autoFocus
              required
              className="w-full p-4 bg-slate-100 dark:bg-slate-800/50 rounded-2xl outline-none focus:ring-4 ring-primary-500/10 font-bold text-lg placeholder:text-slate-300 dark:placeholder:text-slate-600 transition-all"
              placeholder="e.g., Deep Work: Algorithm Mastery"
              value={taskName}
              onChange={e => setTaskName(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary-500/30 hover:bg-primary-700 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle size={20} />}
            <span>{slotToEdit ? 'Commit Changes' : 'Initialize Slot'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default TimetableModal;
