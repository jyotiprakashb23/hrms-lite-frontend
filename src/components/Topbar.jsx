import { Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const PAGE_META = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Manage your team members' },
  '/attendance': { title: 'Attendance', subtitle: 'Track and record attendance' },
};

const Topbar = ({ onMenuClick }) => {
  const location = useLocation();
  const page = PAGE_META[location.pathname] || { title: 'WorkNest', subtitle: '' };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="bg-white h-16 flex items-center justify-between px-5 border-b border-slate-200 shrink-0 z-10">
      <div className="flex items-center gap-4">
        <button
          className="md:hidden text-slate-500 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </button>
        <div>
          <h2 className="text-slate-800 font-bold text-base leading-tight">{page.title}</h2>
          <p className="text-slate-400 text-[11px] hidden sm:block">{page.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden md:block text-slate-400 text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
          {today}
        </span>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer">
          A
        </div>
      </div>
    </header>
  );
};

export default Topbar;
