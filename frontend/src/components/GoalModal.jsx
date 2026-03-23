import React, { useState, useEffect } from 'react';
import { X, Target, Calendar, AlertCircle, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const GoalModal = ({ isOpen, onClose, onSuccess, goalToEdit = null }) => {
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    difficulty: 'Medium',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });
  const [tasks, setTasks] = React.useState(['']);
  const [loading, setLoading] = React.useState(false);

  // Populate form for editing
  React.useEffect(() => {
    if (isOpen && goalToEdit) {
      setFormData({
        title: goalToEdit.title || '',
        description: goalToEdit.description || '',
        difficulty: goalToEdit.difficulty || 'Medium',
        startDate: goalToEdit.startDate ? goalToEdit.startDate.split('T')[0] : new Date().toISOString().split('T')[0],
        endDate: goalToEdit.endDate ? goalToEdit.endDate.split('T')[0] : '',
      });
      setTasks(goalToEdit.tasks?.map(t => t.title) || ['']);
    } else if (isOpen && !goalToEdit) {
      // Reset for new goal
      setFormData({
        title: '',
        description: '',
        difficulty: 'Medium',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
      });
      setTasks(['']);
    }
  }, [isOpen, goalToEdit]);

  if (!isOpen) return null;

  const handleAddTask = () => setTasks([...tasks, '']);
  const handleTaskChange = (index, value) => {
    const newTasks = [...tasks];
    newTasks[index] = value;
    setTasks(newTasks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Map tasks to objects for the backend model
      const taskObjects = tasks
        .filter(t => t.trim())
        .map(t => ({ title: t }));
      
      if (goalToEdit) {
        await api.put(`/goals/${goalToEdit._id}`, { ...formData, tasks: taskObjects });
        toast.success('Mission Updated! 🛡️');
      } else {
        await api.post('/goals', { ...formData, tasks: taskObjects });
        toast.success('New Mission Initiated! 🎯');
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error creating goal:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/30">
          <h2 className="text-xl font-bold flex items-center">
            <Target className="mr-2 text-primary-500" size={24} />
            {goalToEdit ? 'Redefine Your Mission' : 'Create Your Vision'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Goal Title</label>
            <input 
              required
              className="w-full p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl outline-none focus:ring-2 ring-primary-500/20 font-bold"
              placeholder="e.g., Master Data Structures"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Description</label>
            <textarea 
              className="w-full p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl outline-none focus:ring-2 ring-primary-500/20 min-h-[60px]"
              placeholder="Break it down..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-400">Daily Tasks</label>
            {tasks.map((task, index) => (
              <input 
                key={index}
                className="w-full p-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl outline-none focus:ring-2 ring-primary-500/10 mb-2 font-medium"
                placeholder={`Task ${index + 1}`}
                value={task}
                onChange={e => handleTaskChange(index, e.target.value)}
              />
            ))}
            <button 
              type="button" 
              onClick={handleAddTask}
              className="text-xs font-bold text-primary-500 hover:text-primary-600 flex items-center mt-1"
            >
              <Plus size={14} className="mr-1" /> Add another task
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Difficulty</label>
              <select 
                className="w-full p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl outline-none focus:ring-2 ring-primary-500/20 font-bold appearance-none"
                value={formData.difficulty}
                onChange={e => setFormData({...formData, difficulty: e.target.value})}
              >
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 block">Start Date</label>
              <input 
                type="date"
                required
                className="w-full p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl font-bold"
                value={formData.startDate}
                onChange={e => setFormData({...formData, startDate: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 block">End Date</label>
              <input 
                type="date"
                required
                className="w-full p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl font-bold"
                value={formData.endDate}
                onChange={e => setFormData({...formData, endDate: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary-500/30 hover:bg-primary-700 transition-all hover:-translate-y-1 disabled:opacity-50 mt-4"
          >
            {loading ? 'Creating...' : 'Start Journey'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GoalModal;
