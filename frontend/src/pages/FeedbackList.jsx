import React, { useState, useEffect } from 'react';
import { MessageSquare, Calendar, User, Tag, Trash2, Loader2, Search, Filter } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import Skeleton from '../components/Skeleton';

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const fetchData = async () => {
    try {
      const { data } = await api.get('/feedback');
      setFeedbacks(data);
    } catch (err) {
      toast.error('Failed to intercept feedback stream.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to purge this intel?')) return;
    try {
      await api.delete(`/feedback/${id}`);
      setFeedbacks(feedbacks.filter(f => f._id !== id));
      toast.success('Intel purged.');
    } catch (err) {
      toast.error('Purge failed.');
    }
  };

  const filteredFeedbacks = filter === 'All' 
    ? feedbacks 
    : feedbacks.filter(f => f.type === filter);

  const categories = ['All', 'Improvement', 'Bug', 'Feature Request', 'Other'];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-500/20">
              <MessageSquare size={32} />
            </div>
            <div>
              <h1 className="text-5xl font-black tracking-tighter font-display uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                Command Center
              </h1>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Feedback Intelligence Terminal</p>
            </div>
          </div>
          <p className="text-slate-500 font-medium text-lg italic max-w-2xl leading-relaxed">
            Review user suggestions and bug reports to guide the next evolution of the matrix.
          </p>
        </div>

        <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-2xl shadow-xl overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                filter === cat 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                  : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          [...Array(4)].map((_, i) => <Skeleton key={i} className="h-48 rounded-[2.5rem]" />)
        ) : filteredFeedbacks.length > 0 ? (
          filteredFeedbacks.map((f) => (
            <div key={f._id} className="group bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl hover:border-indigo-500/30 transition-all relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full -mr-16 -mt-16" />
               
               <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
                  <div className="flex-1 space-y-6">
                     <div className="flex items-center space-x-3">
                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ring-1 ${
                          f.type === 'Bug' ? 'bg-rose-500/10 text-rose-500 ring-rose-500/20' :
                          f.type === 'Feature Request' ? 'bg-amber-500/10 text-amber-500 ring-amber-500/20' :
                          'bg-indigo-500/10 text-indigo-500 ring-indigo-500/20'
                        }`}>
                           {f.type}
                        </div>
                        <div className="flex items-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                           <Calendar size={12} className="mr-1" />
                           {new Date(f.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                        </div>
                     </div>
                     
                     <p className="text-xl font-bold text-slate-800 dark:text-slate-200 leading-relaxed italic">
                        "{f.message}"
                     </p>
                     
                     <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                           <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500">
                             <User size={14} />
                           </div>
                           <div className="text-left">
                              <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-tight">{f.userId?.name || 'Anonymous'}</p>
                              <p className="text-[9px] font-bold text-slate-400 lowercase italic">{f.userId?.email || 'N/A'}</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  <button 
                    onClick={() => handleDelete(f._id)}
                    className="md:opacity-0 group-hover:opacity-100 p-4 text-slate-300 hover:text-rose-500 bg-slate-50 dark:bg-slate-800 hover:bg-rose-500/10 rounded-2xl transition-all shadow-sm"
                    title="Purge Intel"
                  >
                    <Trash2 size={20} />
                  </button>
               </div>
            </div>
          ))
        ) : (
          <div className="text-center py-24 bg-slate-50/50 dark:bg-slate-900/40 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
             <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-indigo-500" size={40} />
             </div>
             <h3 className="text-xl font-black font-display uppercase tracking-tight mb-2">No Intel Intercepted</h3>
             <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xs mx-auto italic">
               The feedback stream is currently silent. Await user broadcasts.
             </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackList;
