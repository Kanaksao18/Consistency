import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Loader2, Clock, Trash2, Edit3, Target, Zap, TrendingUp, BarChart3, CheckCircle2, Circle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Skeleton from '../components/Skeleton';
import TimetableModal from '../components/TimetableModal';

const Timetable = () => {
  const [slots, setSlots] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState('');
  const [selectedTime, setSelectedTime] = React.useState('');
  const [slotToEdit, setSlotToEdit] = React.useState(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const times = Array.from({ length: 18 }, (_, i) => `${(i + 6).toString().padStart(2, '0')}:00`);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data: slotsData } = await api.get('/timetable');
      setSlots(slotsData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };


  const openModal = (day, time, slot = null) => {
    setSelectedDay(day);
    setSelectedTime(time);
    setSlotToEdit(slot);
    setIsModalOpen(true);
  };

  const handleDeleteSlot = async (e, id) => {
    e.stopPropagation();
    try {
      await api.delete(`/timetable/${id}`);
      toast.success('Matrix Segment Purged. 🧹');
      fetchData();
    } catch (err) {
      console.error('Error deleting slot:', err);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header & Intelligence Pane */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary-500/40">
              <Zap size={24} fill="white" />
            </div>
            <h1 className="text-5xl font-black tracking-tighter font-display uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">
              Success Matrix
            </h1>
          </div>
          <p className="text-slate-500 font-bold text-xl italic opacity-80 leading-relaxed max-w-xl">
             "Precision in planning, excellence in execution. The matrix tracks your evolution."
          </p>
        </div>

      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Weekly Matrix */}
        <div className="w-full">
          <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[3.5rem] shadow-2xl border border-white/20 dark:border-slate-800/50 overflow-hidden ring-1 ring-black/5">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-950/50">
                    <th className="px-8 py-10 border-r border-slate-200/30 dark:border-slate-800/30 font-black text-slate-400 dark:text-slate-500 uppercase text-[10px] tracking-[0.3em] text-left">
                      Timeline
                    </th>
                    {days.map(day => (
                      <th key={day} className="px-8 py-10 text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-slate-100 border-r border-slate-200/30 dark:border-slate-800/30 min-w-[220px] font-display text-center relative overflow-hidden">
                        <div className="relative z-10">{day}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {times.map(time => (
                    <tr key={time} className="group hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-8 py-10 border-r border-slate-200/30 dark:border-slate-800/30 tabular-nums bg-slate-50/20 dark:bg-slate-950/20">
                        <div className="flex items-center space-x-3">
                           <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-sm">
                              <Clock size={14} className="text-primary-500" />
                           </div>
                           <span className="text-xs font-black text-slate-600 dark:text-slate-300 tracking-widest">{time}</span>
                        </div>
                      </td>
                      {days.map(day => {
                        const slot = slots.find(s => s.dayOfWeek === day && s.timeSlot === time);
                        return (
                          <td 
                            key={day} 
                            onClick={() => !loading && openModal(day, time, slot)}
                            className="px-4 py-4 border-r border-slate-200/30 dark:border-slate-800/30 align-top transition-all group/cell relative min-h-[120px] cursor-pointer"
                          >
                             {loading ? (
                               <Skeleton className="h-16 rounded-2xl w-full opacity-50" />
                             ) : slot ? (
                               <div className="bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-5 rounded-[1.5rem] shadow-lg group-hover/cell:shadow-primary-500/10 transition-all relative group h-full">
                                  <p className="text-sm font-black text-slate-900 dark:text-white font-display uppercase tracking-tight mb-3 pr-6 truncate">{slot.taskName}</p>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center text-[9px] text-primary-500 font-black uppercase tracking-widest bg-primary-500/5 px-2 py-1 rounded-lg">
                                       <Target size={10} className="mr-1" />
                                       <span>Active</span>
                                    </div>
                                    <button onClick={(e) => handleDeleteSlot(e, slot._id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-rose-500 transition-all"><Trash2 size={14} /></button>
                                  </div>
                               </div>
                             ) : (
                               <div className="opacity-0 group-hover/cell:opacity-100 transition-all h-full flex items-center justify-center">
                                  <div className="w-10 h-10 rounded-xl bg-primary-500 text-white shadow-lg flex items-center justify-center transform hover:scale-110 transition-all"><Plus size={20} /></div>
                               </div>
                             )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <TimetableModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSlotToEdit(null); }}
        onSuccess={fetchData}
        initialDay={selectedDay}
        initialTime={selectedTime}
        slotToEdit={slotToEdit}
      />
    </div>
  );
};

export default Timetable;
