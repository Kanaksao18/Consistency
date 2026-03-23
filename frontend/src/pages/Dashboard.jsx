import React, { useState, useEffect } from 'react';
import { Plus, Flame, Target, CheckCircle2, Trophy, ArrowUpRight, Calendar, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';
import GoalModal from '../components/GoalModal';
import ConfirmationModal from '../components/ConfirmationModal';
import Skeleton from '../components/Skeleton';

import DailyQuests from '../components/DailyQuests';

const Dashboard = () => {
  const [goals, setGoals] = React.useState([]);
  const [logs, setLogs] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [goalToEdit, setGoalToEdit] = React.useState(null);
  const [deleteId, setDeleteId] = React.useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const [goalsRes, logsRes] = await Promise.all([
        api.get('/goals'),
        api.get('/logs')
      ]);
      setGoals(goalsRes.data);
      setLogs(logsRes.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/goals/${deleteId}`);
      toast.success('Mission Terminated. Data Cleaned. 🧹');
      fetchData();
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    } catch (err) {
      console.error('Error deleting goal:', err);
    }
  };

  const openEditModal = (goal) => {
    setGoalToEdit(goal);
    setIsModalOpen(true);
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  // Helper to calculate streak
  const calculateStreak = () => {
    if (!logs.length) return 0;
    const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
    let streak = 0;
    const today = new Date().setHours(0,0,0,0);
    
    for (let i = 0; i < sortedLogs.length; i++) {
      const logDate = new Date(sortedLogs[i].date).setHours(0,0,0,0);
      const expectedDate = today - (i * 86400000);
      if (logDate === expectedDate && sortedLogs[i].isCompleted) {
        streak++;
      } else if (logDate < expectedDate) {
        break;
      }
    }
    return streak;
  };

  const streak = calculateStreak();
  const completionRate = logs.length > 0 
    ? Math.round((logs.filter(l => l.isCompleted).length / (goals.length * 7 || 1)) * 100) 
    : 0;

  const stats = [
    { label: 'Current Streak', value: `${streak} Days`, icon: <Flame className="text-orange-500" />, color: 'bg-orange-50 dark:bg-orange-900/10' },
    { label: 'Goals Active', value: goals.length, icon: <Target className="text-primary-500" />, color: 'bg-primary-50 dark:bg-primary-900/10' },
    { label: 'Completion Rate', value: `${completionRate}%`, icon: <CheckCircle2 className="text-green-500" />, color: 'bg-green-50 dark:bg-green-900/10' },
    { label: 'Experience Points', value: user?.experience || 0, icon: <Trophy className="text-yellow-500" />, color: 'bg-yellow-50 dark:bg-yellow-900/10' },
  ];

  const level = Math.floor((user?.experience || 0) / 100) + 1;
  const xpInLevel = (user?.experience || 0) % 100;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-4xl font-black tracking-tight font-display mb-2">Welcome back, {user?.name.split(' ')[0]}! 👋</h1>
          <div className="flex items-center space-x-4 mb-4">
             <div className="px-3 py-1 bg-primary-600 text-white rounded-lg font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary-500/20">
               LVL {level}
             </div>
             <div className="flex-1 max-w-xs h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
               <div 
                 className="h-full bg-gradient-to-r from-primary-500 to-indigo-500 transition-all duration-1000" 
                 style={{ width: `${xpInLevel}%` }}
               />
             </div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{xpInLevel}/100 XP</span>
          </div>
          <p className="text-slate-500 font-medium text-lg italic">The path to mastery is paved with daily consistency.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-3 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-primary-500/30 transition-all hover:-translate-y-1 active:translate-y-0 scale-hover"
        >
          <Plus size={24} />
          <span className="uppercase tracking-widest text-sm">Create New Goal</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {loading ? [...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-[2rem]" />
        )) : stats.map((stat, idx) => (
          <div key={idx} className="glass-card p-8 rounded-[2rem] border-slate-200/50 dark:border-slate-800/50 relative overflow-hidden group">
            <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
              {stat.icon}
            </div>
            <p className="text-xs font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white font-display uppercase">{stat.value}</p>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-10 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 shadow-2xl">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-black font-display uppercase tracking-tight">Active Goals</h2>
              <button className="text-primary-600 dark:text-primary-400 font-black text-xs uppercase tracking-widest hover:underline flex items-center">
                View library <ArrowUpRight size={16} className="ml-1" />
              </button>
            </div>
            
            <div className="space-y-4">
              {loading ? [...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              )) : goals.length > 0 ? goals.map(goal => {
                const goalLogs = logs.filter(l => l.goalId === goal._id);
                const totalDays = Math.max(1, Math.ceil((new Date(goal.endDate) - new Date(goal.startDate)) / (1000 * 60 * 60 * 24)));
                const progress = Math.min(100, Math.round((goalLogs.length / totalDays) * 100));
                const daysLeft = Math.ceil((new Date(goal.endDate) - new Date()) / (1000 * 60 * 60 * 24));

                return (
                  <div 
                    key={goal._id} 
                    onClick={() => navigate('/progress', { state: { goalId: goal._id } })}
                    className="p-4 border border-slate-100 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all group cursor-pointer active:scale-[0.98]"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-col">
                        <h3 className="font-black text-xl font-display group-hover:text-primary-600 transition-colors uppercase tracking-tight">{goal.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <button 
                            onClick={(e) => { e.stopPropagation(); openEditModal(goal); }}
                            className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-400 hover:text-primary-500 transition-all active:scale-95"
                            title="Edit Goal"
                          >
                            <Pencil size={14} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); openDeleteModal(goal._id); }}
                            className="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-900/30 text-slate-400 hover:text-rose-500 rounded-lg transition-all active:scale-95"
                            title="Delete Goal"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        goal.difficulty === 'Hard' ? 'bg-red-500/10 text-red-500 ring-1 ring-red-500/20' : 
                        goal.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20' : 
                        'bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20'
                      }`}>
                        {goal.difficulty}
                      </div>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden mb-4 p-[2px]">
                      <div 
                        className="bg-gradient-to-r from-primary-600 to-indigo-500 h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-400 dark:text-slate-300 font-black uppercase tracking-widest">{progress}% Mastery</span>
                      <div className="flex items-center space-x-1.5 text-primary-500">
                         <Calendar size={12} />
                         <span className="text-[10px] font-black uppercase tracking-widest">{daysLeft > 0 ? `${daysLeft}d left` : 'Mission End'}</span>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-900/40 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-500">
                   <div className="w-20 h-20 bg-primary-500/10 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-primary-500/20">
                     <Target className="text-primary-500" size={40} />
                   </div>
                   <h3 className="text-xl font-black font-display uppercase tracking-tight mb-2">The Mission Awaits</h3>
                   <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto mb-8 text-sm italic">
                     "The secret of getting ahead is getting started." Begin your journey by defining your first high-impact goal.
                   </p>
                   <button 
                     onClick={() => setIsModalOpen(true)}
                     className="px-6 py-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-all border border-slate-200 dark:border-slate-700 shadow-xl"
                   >
                     Initialize First Goal
                   </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-10 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 shadow-2xl">
              <h2 className="text-2xl font-black font-display uppercase tracking-tight mb-8">Daily Quests</h2>
              <DailyQuests />
            </div>
            
            <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-10 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 shadow-2xl">
              <h2 className="text-2xl font-black font-display uppercase tracking-tight mb-8">Quick Focus</h2>
              <div className="space-y-6">
                 <div className="flex items-center space-x-5 p-6 bg-gradient-to-br from-primary-500 to-indigo-700 rounded-3xl shadow-xl shadow-primary-500/20 transform hover:scale-[1.02] transition-transform cursor-pointer">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white shrink-0">
                       <Flame size={32} />
                    </div>
                    <div>
                       <p className="font-black text-white text-xl font-display">{streak} DAY STREAK</p>
                       <p className="text-xs text-white/80 font-bold uppercase tracking-widest">{streak > 0 ? 'Legendary momentum! 🔥' : 'Time to start! 🏹'}</p>
                    </div>
                 </div>
                 {goals.length > 0 && (
                   <div className="p-6 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl bg-white dark:bg-slate-900/50">
                     <p className="text-[10px] font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest mb-3">Priority Goal</p>
                     <p className="text-xl font-black text-slate-900 dark:text-white font-display uppercase leading-tight mb-2">{goals[0].title}</p>
                     <div className="flex items-center text-primary-500 space-x-2">
                        <ArrowUpRight size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Focusing Now</span>
                     </div>
                   </div>
                 )}
              </div>
            </div>
        </div>
      </div>
      <GoalModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setGoalToEdit(null); }} 
        onSuccess={fetchData}
        goalToEdit={goalToEdit}
      />

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => { setIsDeleteModalOpen(false); setDeleteId(null); }}
        onConfirm={handleDelete}
        title="Terminate Mission?"
        message="This action is irreversible. All hard-earned progress and daily logs for this goal will be erased from the matrix."
        confirmText="Confirm Deletion"
      />
    </div>
  );
};

export default Dashboard;
