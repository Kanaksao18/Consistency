import React from 'react';
import { Zap, Trophy, Target, Star } from 'lucide-react';
import DailyQuests from '../components/DailyQuests';
import useAuthStore from '../store/useAuthStore';

const Quests = () => {
  const user = useAuthStore(state => state.user);
  
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-primary-500/20 ring-4 ring-white dark:ring-slate-900">
              <Zap size={32} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-5xl font-black tracking-tighter font-display uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">
                Quest Log
              </h1>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Daily Objectives Matrix</p>
            </div>
          </div>
          <p className="text-slate-500 font-medium text-lg italic max-w-2xl leading-relaxed">
            "Your future is created by what you do today, not tomorrow." Conquer these daily trials to evolve your potential.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current XP</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white font-display tabular-nums">{user?.experience || 0}</p>
           </div>
           <div className="p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rank</p>
              <p className="text-2xl font-black text-primary-500 font-display uppercase">Elite</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl p-10 rounded-[3rem] shadow-2xl border border-white/20 dark:border-slate-800/50 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] rounded-full -mr-32 -mt-32" />
            
            <div className="flex items-center justify-between mb-10 relative z-10">
               <h2 className="text-2xl font-black font-display uppercase tracking-tight flex items-center">
                 <Target className="mr-3 text-primary-500" size={28} />
                 Active Trials
               </h2>
               <div className="px-4 py-1.5 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                 Resets in 14h 22m
               </div>
            </div>

            <DailyQuests />
          </div>
        </div>

        <div className="space-y-8">
           <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <Trophy className="text-amber-500 mb-6 group-hover:scale-110 transition-transform" size={48} />
                <h3 className="text-2xl font-black font-display uppercase tracking-tight mb-4">Mastery Rewards</h3>
                <ul className="space-y-4">
                   {[
                     { label: 'Complete 3 Quests', xp: '+30 XP', done: false },
                     { label: '5 Day Streak', xp: '+100 XP', done: true },
                     { label: 'Weekend Warrior', xp: '+50 XP', done: false },
                   ].map((item, i) => (
                     <li key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                        <span className={`text-sm font-bold ${item.done ? 'opacity-50 line-through' : ''}`}>{item.label}</span>
                        <span className="text-[10px] font-black text-amber-500 uppercase">{item.xp}</span>
                     </li>
                   ))}
                </ul>
              </div>
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary-500/10 rounded-full blur-[80px]"></div>
           </div>

           <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative">
              <h3 className="text-xl font-black font-display uppercase tracking-tight mb-6">Quest Logic</h3>
              <div className="space-y-4">
                 <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                       <Star size={16} />
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                      Completing a quest immediately injects **10 XP** into your profile.
                    </p>
                 </div>
                 <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-500 shrink-0">
                       <Zap size={16} />
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                      Quests reset daily at stroke of midnight (system time).
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Quests;
