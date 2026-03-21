import { NavLink, useNavigate } from 'react-router-dom';
import { Users, CalendarCheck, Briefcase, LogOut } from 'lucide-react';
import useStore from '../store/useStore';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: Users },
  { name: 'Attendance', path: '/attendance', icon: CalendarCheck },
];

const Sidebar = ({ closeSidebar }) => {
  const logout = useStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="w-64 flex flex-col h-full shrink-0 bg-[#0d1f17] shadow-2xl">
      {/* Brand */}
      <div className="px-5 py-5 flex items-center gap-3 border-b border-white/10">
        <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
          <Briefcase size={17} className="text-white" />
        </div>
        <div>
          <h1 className="text-white text-[15px] font-bold leading-tight">WorkNest</h1>
          <p className="text-slate-500 text-[10px]">HR Management System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 pt-5 flex flex-col gap-1">
        <p className="text-slate-600 text-[9px] font-bold uppercase tracking-widest px-3 mb-2">
          Main Menu
        </p>
        {navItems.map((item) => (
          <NavLink key={item.name} to={item.path} onClick={closeSidebar}>
            {({ isActive }) => (
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive ? 'bg-white/20' : 'bg-white/5'
                  }`}
                >
                  <item.icon size={16} />
                </div>
                <span>{item.name}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-1 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            A
          </div>
          <div className="min-w-0">
            <p className="text-slate-300 text-xs font-semibold leading-tight truncate">Admin User</p>
            <p className="text-slate-600 text-[10px]">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-500 hover:bg-white/5 hover:text-red-400 transition-colors text-xs font-medium"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
