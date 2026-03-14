import { NavLink } from 'react-router-dom';
import { Users, CalendarCheck } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const Sidebar = ({ closeSidebar }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Users },
    { name: 'Attendance', path: '/attendance', icon: CalendarCheck },
  ];

  return (
    <aside className="w-64 bg-[#151e32] text-white flex flex-col h-full shadow-xl z-20 shrink-0">
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-wide">WorkNest</h1>
      </div>
      
      <nav className="flex-1 py-6 px-3 flex flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={closeSidebar}
            className={({ isActive }) => 
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive 
                  ? "bg-[#2563eb] text-white" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )
            }
          >
            <item.icon size={18} />
            {item.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-white/10 text-xs text-slate-500 text-center">
        &copy; 2026 HRMS System
      </div>
    </aside>
  );
};

export default Sidebar;