import React, { useState, useEffect } from 'react';
import { Plus, CheckCircle2, Circle, Trash2, Loader2, Zap } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

import useAuthStore from '../store/useAuthStore';

const DailyQuests = () => {
  const fetchUser = useAuthStore(state => state.fetchUser);
  const [quests, setQuests] = useState([]);
  const [newQuest, setNewQuest] = useState('');
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const fetchQuests = async () => {
    try {
      const { data } = await api.get('/daily-tasks');
      console.log('[DailyQuests] Fetched tasks:', data.tasks);
      setQuests(data.tasks || []);
    } catch (err) {
      console.error('[DailyQuests] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuests();
  }, []);

  const handleAddQuest = async (e) => {
    if (e) e.preventDefault();
    const taskText = newQuest.trim();
    if (!taskText) {
      console.log('[DailyQuests] Empty quest ignored');
      return;
    }
    
    console.log(`[DailyQuests] Attempting to add: ${taskText}`);
    setAdding(true);
    try {
      const { data } = await api.post('/daily-tasks', { text: taskText });
      console.log('[DailyQuests] POST success:', data);
      setQuests(prev => [data, ...prev]);
      setNewQuest('');
      toast.success('Quest Initiated! ⚡');
    } catch (err) {
      console.error('[DailyQuests] POST error:', err);
      toast.error('Matrix rejection. Try again.');
    } finally {
      setAdding(false);
    }
  };

  const toggleQuest = async (id) => {
    try {
      const { data } = await api.patch(`/daily-tasks/${id}`);
      setQuests(quests.map(q => q._id === id ? data : q));
      if (data.completed) {
        toast.success('Objective Secured! +10 XP', { icon: '🎯' });
        fetchUser();
      }
    } catch (err) {
      toast.error('Sync failed.');
    }
  };

  const deleteQuest = async (id) => {
    try {
      await api.delete(`/daily-tasks/${id}`);
      setQuests(quests.filter(q => q._id !== id));
      toast.success('Quest abandoned.');
    } catch (err) {
      toast.error('Deletion failed.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddQuest} className="relative">
        <input
          type="text"
          value={newQuest}
          onChange={(e) => setNewQuest(e.target.value)}
          placeholder="New Daily Quest..."
          className="w-full p-4 pr-14 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-md focus:ring-4 ring-primary-500/10 outline-none font-bold text-sm transition-all shadow-sm"
        />
        <button
          type="submit"
          disabled={adding || !newQuest.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all disabled:opacity-50"
        >
          {adding ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
        </button>
      </form>

      <div className="space-y-3">
        {quests.length > 0 ? (
          quests.map((quest) => (
            <div
              key={quest._id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between group ${
                quest.completed
                  ? 'bg-emerald-500/5 border-emerald-500/10 opacity-60'
                  : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-primary-500/30'
              }`}
            >
              <div 
                className="flex items-center space-x-4 cursor-pointer flex-1"
                onClick={() => toggleQuest(quest._id)}
              >
                <div className={`transition-all duration-300 ${quest.completed ? 'text-emerald-500 scale-110' : 'text-slate-300'}`}>
                  {quest.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                </div>
                <span className={`text-sm font-bold tracking-tight ${quest.completed ? 'line-through text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>
                  {quest.text}
                </span>
              </div>
              <button
                onClick={() => deleteQuest(quest._id)}
                className="p-1.5 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        ) : (
          <div className="py-8 text-center italic text-slate-400 text-sm">
            No active quests. Initialize some!
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyQuests;
