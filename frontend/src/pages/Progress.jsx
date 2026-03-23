import React, { useState, useEffect } from 'react';
import { BookOpen, Award, AlertCircle, Save, Loader2, CheckCircle, Flame, Target } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Skeleton from '../components/Skeleton';

const Progress = () => {
  const [goals, setGoals] = React.useState([]);
  const [selectedGoal, setSelectedGoal] = React.useState(null);
  const [tasks, setTasks] = React.useState([]);
  const [did, setDid] = React.useState('');
  const [learned, setLearned] = React.useState('');
  const [challenges, setChallenges] = React.useState('');
  const [logs, setLogs] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [fetching, setFetching] = React.useState(true);
  const [success, setSuccess] = React.useState(false);
  const location = useLocation();

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [{ data: goalsData }, { data: logsData }] = await Promise.all([
        api.get('/goals'),
        api.get('/logs')
      ]);
      
      setGoals(goalsData);
      setLogs(logsData);
      
      if (goalsData.length > 0) {
        // Prioritize goal from navigation state
        const targetGoalId = location.state?.goalId;
        const targetGoal = targetGoalId 
          ? goalsData.find(g => g._id === targetGoalId) 
          : goalsData[0];
        
        const finalGoal = targetGoal || goalsData[0];
        setSelectedGoal(finalGoal);
        loadTodayLog(finalGoal, logsData);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setFetching(false);
    }
  };

  const loadTodayLog = (goal, allLogs) => {
    const today = new Date().setHours(0,0,0,0);
    const log = allLogs.find(l => 
      l.goalId === goal._id && 
      new Date(l.date).setHours(0,0,0,0) === today
    );

    if (log) {
      setTasks(log.tasksCompleted.map(t => ({ label: t.title, completed: t.completed })));
      setDid(log.journalEntry?.did || '');
      setLearned(log.journalEntry?.learned || '');
      setChallenges(log.journalEntry?.challenges || '');
    } else {
      setTasks(goal.tasks.map(t => ({ label: t.title || t, completed: false })));
      setDid('');
      setLearned('');
      setChallenges('');
    }
  };

  const handleGoalChange = (id) => {
    const goal = goals.find(g => g._id === id);
    setSelectedGoal(goal);
    loadTodayLog(goal, logs);
  };

  const toggleTask = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGoal) return;
    setLoading(true);
    try {
      const { data } = await api.post('/logs', {
        goalId: selectedGoal._id,
        date: new Date().toISOString(),
        tasksCompleted: tasks.map(t => ({ title: t.label, completed: t.completed })),
        journalEntry: { did, learned, challenges },
        isCompleted: tasks.every(t => t.completed)
      });
      
      toast.success('Reflection Secured! Momentum Growing. 🔥');
      setSuccess(true);
      // Update local logs for streak calculation
      setLogs([...logs.filter(l => l._id !== data._id), data]);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving log:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to calculate consecutive streak for the goal
  const calculateStreak = () => {
    if (!logs.length) return 0;
    const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
    let streakCount = 0;
    const today = new Date().setHours(0,0,0,0);
    
    // We start checking from today. If nothing for today, check starting from yesterday.
    // This allows the streak to persist until the end of the day.
    let expectedDate = today;
    let logIndex = 0;

    // Skip to first log if it's today
    const firstLogDate = new Date(sortedLogs[0].date).setHours(0,0,0,0);
    if (firstLogDate < today - 86400000) return 0; // Streak broken if no log today or yesterday
    
    if (firstLogDate === today) {
       // Start from today
       expectedDate = today;
    } else {
       // Start from yesterday
       expectedDate = today - 86400000;
    }

    for (let i = 0; i < sortedLogs.length; i++) {
      const logDate = new Date(sortedLogs[i].date).setHours(0,0,0,0);
      if (logDate === expectedDate && sortedLogs[i].isCompleted) {
        streakCount++;
        expectedDate -= 86400000; // Look for the previous day
      } else if (logDate < expectedDate) {
        break;
      }
    }
    return streakCount;
  };

  const streak = calculateStreak();

  if (fetching) {
    return (
      <div className="space-y-10 animate-pulse">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-[500px] rounded-[2.5rem]" />
          </div>
          <div className="space-y-8">
            <Skeleton className="h-64 rounded-[2.5rem]" />
            <Skeleton className="h-96 rounded-[2.5rem]" />
          </div>
        </div>
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-700">
        <div className="bg-slate-50 dark:bg-slate-900/50 p-12 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-center max-w-md">
           <Flame className="mx-auto text-slate-300 dark:text-slate-700 mb-6" size={80} />
           <h2 className="text-2xl font-black mb-4">Your journey hasn't started yet</h2>
           <p className="text-slate-500 font-medium mb-8">You need at least one goal to start journaling your progress. Let's create one now!</p>
           <a href="/" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-primary-500/20 transition-all inline-block">
             Create My First Goal
           </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight font-display mb-2">Daily Journal</h1>
          <p className="text-slate-500 font-medium text-lg italic">"What you do today can improve all your tomorrows."</p>
        </div>
        <div className="w-full md:w-80">
           <div className="relative group">
             <select 
               value={selectedGoal?._id || ''} 
               onChange={(e) => handleGoalChange(e.target.value)}
               className="w-full p-4 pl-6 pr-12 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-md focus:ring-4 ring-primary-500/10 outline-none font-black uppercase tracking-widest text-xs transition-all appearance-none cursor-pointer"
             >
               {goals.map(g => <option key={g._id} value={g._id}>{g.title}</option>)}
             </select>
             <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-primary-500 transition-colors">
                <Target size={20} />
             </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-slate-200/60 dark:border-slate-800/60">
          <h2 className="text-2xl font-black mb-8 flex items-center font-display uppercase tracking-tight">
             <BookOpen className="mr-3 text-primary-500" size={28} />
             Daily Reflection
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 dark:text-slate-300 uppercase tracking-widest pl-1">Daily Victories</label>
              <textarea 
                value={did}
                onChange={(e) => setDid(e.target.value)}
                placeholder="What did you dominate today?"
                className="w-full p-5 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl bg-white/40 dark:bg-slate-950/40 focus:ring-4 ring-primary-500/10 outline-none transition-all resize-none font-medium text-slate-800 dark:text-slate-200 min-h-[140px]"
                required
              ></textarea>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 dark:text-slate-300 uppercase tracking-widest pl-1 flex items-center">
                 <Award className="mr-2 text-amber-500" size={16} />
                 Key Insights
              </label>
              <textarea 
                value={learned}
                onChange={(e) => setLearned(e.target.value)}
                placeholder="What's the #1 thing you learned?"
                className="w-full p-5 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl bg-white/40 dark:bg-slate-950/40 focus:ring-4 ring-primary-500/10 outline-none transition-all resize-none font-medium text-slate-800 dark:text-slate-200 min-h-[100px]"
              ></textarea>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black text-slate-500 dark:text-slate-300 uppercase tracking-widest pl-1 flex items-center">
                 <AlertCircle className="mr-2 text-rose-500" size={16} />
                 Battle Report
              </label>
              <textarea 
                value={challenges}
                onChange={(e) => setChallenges(e.target.value)}
                placeholder="What obstacles did you face?"
                className="w-full p-5 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl bg-white/40 dark:bg-slate-950/40 focus:ring-4 ring-primary-500/10 outline-none transition-all resize-none font-medium text-slate-800 dark:text-slate-200 min-h-[100px]"
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-4 px-4 rounded-xl font-bold shadow-lg transition-all transform hover:-translate-y-1 ${
                success ? 'bg-green-500' : 'bg-primary-600 hover:bg-primary-700'
              } text-white shadow-primary-500/30`}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                success ? <><CheckCircle className="mr-2" size={20} /> Log Saved!</> : <><Save className="mr-2" size={20} /> Submit Daily Log</>
              )}
            </button>
          </form>
        </div>

        <div className="space-y-8">
           <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-2xl border border-slate-200/60 dark:border-slate-800/60">
              <h2 className="text-2xl font-black mb-8 flex items-center font-display uppercase tracking-tight">Today's Objectives</h2>
              <div className="space-y-4">
                 {tasks.length > 0 ? tasks.map((task, idx) => (
                   <div 
                     key={idx} 
                     onClick={() => toggleTask(idx)}
                     className={`p-5 rounded-2xl border transition-all transform active:scale-95 cursor-pointer ${
                       task.completed 
                         ? 'bg-emerald-500/10 border-emerald-500/20 opacity-60' 
                         : 'bg-white/50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800/60 hover:border-primary-500/50 hover:shadow-lg'
                     }`}
                   >
                      <div className="flex items-center space-x-4">
                        <div className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                          task.completed 
                            ? 'bg-emerald-500 border-emerald-500 text-white rotate-0' 
                            : 'border-slate-300 dark:border-slate-700 rotate-45 group-hover:rotate-0'
                        }`}>
                          {task.completed && <CheckCircle size={16} />}
                        </div>
                        <div>
                           <p className={`text-lg font-bold ${task.completed ? 'line-through text-slate-500' : 'text-slate-900 dark:text-slate-100'}`}>{task.label}</p>
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">{task.completed ? 'Objective Secured' : 'Awaiting Completion'}</p>
                        </div>
                      </div>
                   </div>
                 )) : (
                   <p className="text-center text-slate-500 py-8 italic font-medium">No objectives detected for this goal.</p>
                 )}
              </div>
           </div>

           <div className="bg-gradient-to-br from-primary-600 via-indigo-600 to-violet-700 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-3xl font-black font-display uppercase tracking-tight mb-3">Momentum 🔥</h3>
                <p className="opacity-80 font-medium text-lg leading-relaxed text-indigo-50">Consistency is the bridge between goals and accomplishment.</p>
                <div className="mt-8 flex items-baseline space-x-3">
                   <span className="text-7xl font-black font-display tracking-tighter drop-shadow-2xl">{streak}</span>
                   <div className="flex flex-col">
                      <span className="text-xl font-black uppercase tracking-widest text-white/90">Day Streak</span>
                      <span className="text-xs font-bold text-white/60 uppercase tracking-widest">{streak > 5 ? 'Elite Tier' : 'Growing Stronger'}</span>
                   </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 group-hover:scale-[1.7] transition-transform duration-700">
                 <Flame size={120} />
              </div>
              <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-[100px]"></div>
           </div>
        </div>
      </div>

      {/* Journal Archive Section */}
      <div className="mt-20 space-y-12 pb-20">
         <div className="flex items-center space-x-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>
            <h2 className="text-3xl font-black font-display uppercase tracking-widest text-slate-400 opacity-50 italic">Journal Archive</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent"></div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {logs.length > 0 ? logs
              .filter(log => log.goalId === selectedGoal?._id)
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .map((log, idx) => {
                const totalTasks = log.tasksCompleted?.length || 0;
                const doneTasks = log.tasksCompleted?.filter(t => t.completed).length || 0;
                const hasJournal = log.journalEntry && (log.journalEntry.did || log.journalEntry.learned || log.journalEntry.challenges);
                
                return (
                  <div key={idx} className="glass-card p-8 rounded-[2rem] border-slate-200/60 dark:border-slate-800/60 flex flex-col h-full group hover:bg-white/80 dark:hover:bg-slate-900/80">
                     <div className="flex items-center justify-between mb-6">
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black uppercase tracking-widest text-primary-500">Log #{logs.length - idx}</span>
                           <h3 className="text-lg font-black font-display text-slate-900 dark:text-white mt-1">
                              {new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                           </h3>
                        </div>
                        <div className="flex items-center space-x-3">
                           <div className="px-3 py-1 bg-primary-500/10 text-primary-600 dark:text-primary-400 rounded-full text-[10px] font-black uppercase tracking-widest">
                              {doneTasks}/{totalTasks} Tasks
                           </div>
                           <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl group-hover:scale-110 transition-transform">
                              <BookOpen size={18} className="text-primary-500" />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-6 flex-1">
                        {!hasJournal && (
                           <p className="text-xs font-medium text-slate-400 dark:text-slate-500 italic pb-4">No journal entry for this session.</p>
                        )}
                        
                        {log.journalEntry?.did && (
                          <div className="space-y-2">
                             <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">
                                <CheckCircle size={12} className="mr-1.5" /> Victories
                             </div>
                             <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed border-l-2 border-emerald-500/20 pl-4">{log.journalEntry.did}</p>
                          </div>
                        )}

                        {log.journalEntry?.learned && (
                          <div className="space-y-2">
                             <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-amber-500 mb-2">
                                <Award size={12} className="mr-1.5" /> Insights
                             </div>
                             <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed border-l-2 border-amber-500/20 pl-4 italic">"{log.journalEntry.learned}"</p>
                          </div>
                        )}

                        {log.journalEntry?.challenges && (
                          <div className="space-y-2">
                             <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-rose-500 mb-2">
                                <AlertCircle size={12} className="mr-1.5" /> Battle Report
                             </div>
                             <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed border-l-2 border-rose-500/20 pl-4 line-clamp-3">{log.journalEntry.challenges}</p>
                          </div>
                        )}
                     </div>

                     <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</span>
                        <div className="flex items-center">
                           <div className={`w-2 h-2 rounded-full mr-2 ${log.isCompleted ? 'bg-emerald-500' : 'bg-primary-500'}`}></div>
                           <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                              {log.isCompleted ? 'Objective Secured' : 'In Progress'}
                           </span>
                        </div>
                     </div>
                  </div>
                );
              }) : (
              <div className="col-span-full py-20 text-center">
                 <p className="text-slate-400 font-medium italic">No activity logs detected for this goal yet.</p>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default Progress;
