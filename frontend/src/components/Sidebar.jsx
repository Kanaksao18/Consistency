import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Calendar, BarChart3, LogOut, Moon, Sun, X, Zap, MessageSquare, ShieldCheck } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { useTheme } from './ThemeProvider';
import FeedbackModal from './FeedbackModal';
// Production-ready Sidebar

const Sidebar = ({ isOpen, onClose }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const logout = useAuthStore(state => state.logout);
  const user = useAuthStore(state => state.user);
  const [isFeedbackOpen, setIsFeedbackOpen] = React.useState(false);

  const navItems = React.useMemo(() => [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/quests', icon: <Zap size={20} />, label: 'Daily Quests' },
    { to: '/progress', icon: <CheckSquare size={20} />, label: 'Daily Progress' },
    { to: '/timetable', icon: <Calendar size={20} />, label: 'Timetable' },
    { to: '/analytics', icon: <BarChart3 size={20} />, label: 'Analytics' },
    ...(user?.role === 'admin' ? [{ to: '/feedback-intel', icon: <ShieldCheck size={20} />, label: 'Feedback Intel' }] : []),
  ], [user?.role]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <div className={`w-64 h-screen bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-800/50 flex flex-col fixed left-0 top-0 z-[70] transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
               <LayoutDashboard className="text-white" size={20} />
            </div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent italic tracking-tighter font-display">
              Consistency.
            </h1>
          </div>
          <button 
            onClick={onClose}
            className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => {
                if (window.innerWidth < 768) onClose();
              }}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-5 py-3.5 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25 font-semibold' 
                    : 'text-slate-500 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-primary-600 overflow-hidden font-medium'
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-4 pb-6 space-y-2">
          <button
            onClick={toggleDarkMode}
            className="flex items-center space-x-3 w-full px-4 py-3 text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="flex items-center space-x-3 w-full px-4 py-3 text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-all"
          >
            <MessageSquare size={20} />
            <span>Support & Feedback</span>
          </button>
          <button
            onClick={logout}
            className="flex items-center space-x-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </>
  );
};

export default Sidebar;
