import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import api from '../api/axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { TrendingUp, Calendar, Zap, Target, Loader2, BarChart3, Activity, PieChart, Info } from 'lucide-react';
import Skeleton from '../components/Skeleton';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = () => {
  const [logs, setLogs] = React.useState([]);
  const [goals, setGoals] = React.useState([]);
  const [allQuests, setAllQuests] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [intelligence, setIntelligence] = React.useState({ weeklyAverage: 0, peakDay: 'N/A' });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [logsRes, goalsRes, questsRes] = await Promise.all([
        api.get('/logs'),
        api.get('/goals'),
        api.get('/daily-tasks')
      ]);
      setLogs(logsRes.data);
      setGoals(goalsRes.data);
      setAllQuests(questsRes.data.allTasks || []);
      
      calculateStats(logsRes.data, questsRes.data.allTasks || []);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (logs, quests) => {
    // 1. Weekly Average (Holistic: Reflections + Quests)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentLogs = logs.filter(l => new Date(l.date) >= sevenDaysAgo);
    const recentQuests = quests.filter(q => new Date(q.date) >= sevenDaysAgo);
    
    const totalVictory = recentLogs.length + recentQuests.length;
    const avg = (totalVictory / 7).toFixed(1);

    // 2. Peak Efficiency (Day with total cumulative success)
    const dayCounts = [...logs, ...quests].reduce((acc, item) => {
      const day = new Date(item.date).toLocaleDateString('en-US', { weekday: 'long' });
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});
    
    const peak = Object.entries(dayCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || 'N/A';

    setIntelligence({ weeklyAverage: avg, peakDay: peak });
  };

  // Process data for Weekly Vitals (Line Chart)
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const logCounts = new Array(7).fill(0);
  const questCounts = new Array(7).fill(0);
  const today = new Date();
  
  [...logs].forEach(log => {
    const logDate = new Date(log.date);
    if (Math.floor((today - logDate) / (1000 * 60 * 60 * 24)) < 7) {
      logCounts[logDate.getDay()] += 1;
    }
  });

  [...allQuests].forEach(q => {
    const qDate = new Date(q.date);
    if (Math.floor((today - qDate) / (1000 * 60 * 60 * 24)) < 7) {
      questCounts[qDate.getDay()] += 1;
    }
  });

  const lineData = {
    labels: days,
    datasets: [
      {
        label: 'Journal Reflections',
        data: logCounts,
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#0ea5e9',
        pointBorderWidth: 2,
      },
      {
        label: 'Quests Completed',
        data: questCounts,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6366f1',
        pointBorderWidth: 2,
      },
    ],
  };

  // Process data for Expansion Pulse (Bar Chart)
  const barData = {
    labels: goals.map(g => g.title),
    datasets: [
      {
        label: 'Momentum Generated',
        data: goals.map(g => logs.filter(l => l.goalId === g._id).length),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        hoverBackgroundColor: '#6366f1',
        borderRadius: 12,
        barThickness: 24,
      },
    ],
  };

  if (loading) {
    return (
      <div className="space-y-10 animate-in fade-in duration-500">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64 rounded-2xl" />
          <Skeleton className="h-6 w-96 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Skeleton className="h-32 rounded-[2rem]" />
          <Skeleton className="h-32 rounded-[2rem]" />
          <Skeleton className="h-32 rounded-[2rem]" />
          <Skeleton className="h-32 rounded-[2rem]" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Skeleton className="h-96 rounded-[3rem]" />
          <Skeleton className="h-96 rounded-[3rem]" />
        </div>
      </div>
    );
  }

  const successRate = logs.length > 0 ? (logs.filter(l => l.isCompleted).length / logs.length * 100).toFixed(0) : 0;

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-primary-500 shadow-xl border border-slate-200 dark:border-slate-800">
              <Activity size={24} />
            </div>
            <h1 className="text-5xl font-black tracking-tighter font-display uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-indigo-600">
              Performance Blueprint
            </h1>
          </div>
          <p className="text-slate-500 font-bold text-xl italic opacity-80 leading-relaxed max-w-xl">
             "Data is the silent coach. High-fidelity tracking correlates to elite execution."
          </p>
        </div>
        <div className="flex space-x-2 bg-slate-50 dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
           <button className="px-4 py-2 bg-white dark:bg-slate-800 shadow-sm rounded-xl text-xs font-black uppercase tracking-widest text-primary-600">7 Days</button>
           <button className="px-4 py-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl text-xs font-black uppercase tracking-widest text-slate-400 transition-all">30 Days</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Weekly Average', value: `${intelligence.weeklyAverage}`, sub: 'Victories / Day', icon: <TrendingUp size={20} className="text-primary-500" /> },
          { label: 'Peak Efficiency', value: intelligence.peakDay, sub: 'Optimal Matrix Alignment', icon: <Zap size={20} className="text-amber-500" /> },
          { label: 'Success Rate', value: `${successRate}%`, sub: 'Reflection Consistency', icon: <Target size={20} className="text-emerald-500" /> },
          { label: 'Active Goals', value: goals.length, sub: 'Strategic Missions', icon: <Activity size={20} className="text-indigo-500" /> },
        ].map((stat, i) => (
          <div key={i} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 shadow-xl group hover:border-primary-500/30 transition-all">
             <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform">{stat.icon}</div>
                <div className="text-right">
                   <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">Intelligence</span>
                   <div className="w-12 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
                      <div className="w-2/3 h-full bg-primary-500 animate-pulse"></div>
                   </div>
                </div>
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
             <p className="text-3xl font-black text-slate-900 dark:text-white font-display tracking-tighter uppercase tabular-nums">{stat.value}</p>
             <p className="text-[11px] text-primary-500 font-bold mt-4 uppercase tracking-tight opacity-70">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3 bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl p-10 rounded-[3.5rem] shadow-2xl border border-white/20 dark:border-slate-800/50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] rounded-full -mr-32 -mt-32 transition-all group-hover:bg-primary-500/10" />
          <div className="flex items-center justify-between mb-12 relative z-10">
            <div>
              <h2 className="text-2xl font-black font-display uppercase tracking-tight mb-1">Vitals Stream</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Real-time productivity distribution</p>
            </div>
            <div className="flex space-x-6">
               <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-[#0ea5e9]"></div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Journal</span>
               </div>
               <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-[#6366f1]"></div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Quests</span>
               </div>
            </div>
          </div>
          <div className="h-[360px] relative z-10">
             <Line 
               data={lineData} 
               options={{ 
                 responsive: true, 
                 maintainAspectRatio: false,
                 scales: {
                   y: { grid: { color: 'rgba(148, 163, 184, 0.05)' }, border: { display: false }, ticks: { font: { weight: '800', size: 10 }, color: '#94a3b8' } },
                   x: { grid: { display: false }, border: { display: false }, ticks: { font: { weight: '800', size: 10 }, color: '#94a3b8' } }
                 },
                 plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1e293b', titleFont: { weight: '800' }, bodyFont: { weight: '600' }, padding: 12, borderRadius: 12 } }
               }} 
             />
          </div>
        </div>

        <div className="lg:col-span-2 bg-slate-900 dark:bg-slate-950 p-10 rounded-[3.5rem] shadow-2xl border border-slate-800 relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full -ml-24 -mb-24" />
          <div className="flex items-center justify-between mb-12 relative z-10">
            <div>
              <h2 className="text-2xl font-black font-display uppercase tracking-tight text-white mb-1">Expansion Pulse</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Effort distribution by strategic mission</p>
            </div>
            <BarChart3 size={20} className="text-indigo-500" />
          </div>
          <div className="h-[360px] relative z-10">
             <Bar 
               data={barData} 
               options={{ 
                 responsive: true, 
                 maintainAspectRatio: false,
                 indexAxis: 'y',
                 scales: {
                   y: { grid: { display: false }, border: { display: false }, ticks: { font: { weight: '800', size: 10 }, color: '#64748b' } },
                   x: { grid: { color: 'rgba(148, 163, 184, 0.05)' }, border: { display: false }, ticks: { font: { weight: '800', size: 10 }, color: '#64748b' } }
                 },
                 plugins: { legend: { display: false } }
               }} 
             />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
