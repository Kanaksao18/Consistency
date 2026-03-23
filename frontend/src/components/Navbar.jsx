import { Search, Bell, Menu } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

const Navbar = ({ onMenuClick }) => {
  const user = useAuthStore(state => state.user);

  return (
    <nav className="h-20 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-40 px-4 md:px-10 flex items-center justify-between md:ml-64 transition-all duration-300">
      <div className="flex items-center space-x-6">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all text-slate-500"
        >
          <Menu size={24} />
        </button>
        
        <div className="hidden sm:flex items-center bg-white/50 dark:bg-slate-800/40 px-5 py-2.5 rounded-2xl w-64 lg:w-96 group focus-within:ring-2 ring-primary-500/30 transition-all border border-transparent focus-within:border-primary-500/20">
          <Search className="text-slate-400 mr-3 group-focus-within:text-primary-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none text-sm w-full"
          />
        </div>
      </div>

      <div className="flex items-center space-x-3 md:space-x-6">
        <button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
        </button>
        
        <div className="flex items-center space-x-4 pl-4 border-l border-slate-200/60 dark:border-slate-800/60">
           <div className="hidden xs:block text-right">
             <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[120px]">{user?.name || 'User'}</p>
             <div className="flex items-center justify-end space-x-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Lv. {user?.level || 1} Elite</p>
             </div>
           </div>
           <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-xl shadow-primary-500/20 ring-2 ring-white dark:ring-slate-900 text-sm shrink-0 hover:scale-105 transition-transform cursor-pointer">
             {user?.name?.[0]?.toUpperCase() || 'U'}
           </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
