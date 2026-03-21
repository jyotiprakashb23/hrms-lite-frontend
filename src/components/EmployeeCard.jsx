import { Trash2, Mail } from 'lucide-react';

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #3b82f6, #6366f1)',
  'linear-gradient(135deg, #8b5cf6, #ec4899)',
  'linear-gradient(135deg, #10b981, #06b6d4)',
  'linear-gradient(135deg, #f97316, #eab308)',
  'linear-gradient(135deg, #ec4899, #f97316)',
  'linear-gradient(135deg, #06b6d4, #3b82f6)',
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #14b8a6, #10b981)',
];

const DEPT_COLORS = {
  'Engineering':              { bg: '#dbeafe', text: '#1e40af' },
  'Human Resources':          { bg: '#fce7f3', text: '#be185d' },
  'Finance':                  { bg: '#dcfce7', text: '#166534' },
  'Sales':                    { bg: '#ffedd5', text: '#c2410c' },
  'Marketing':                { bg: '#fef3c7', text: '#92400e' },
  'IT':                       { bg: '#e0e7ff', text: '#4338ca' },
  'Operations':               { bg: '#cffafe', text: '#155e75' },
  'Legal':                    { bg: '#f3f4f6', text: '#374151' },
  'Product':                  { bg: '#ede9fe', text: '#6d28d9' },
  'Admin':                    { bg: '#f0fdf4', text: '#166534' },
  'Data & Analytics':         { bg: '#fdf4ff', text: '#9333ea' },
  'Customer Support':         { bg: '#fff1f2', text: '#be123c' },
};

const getAvatarGradient = (name = '') => {
  const code = (name.charCodeAt(0) || 0) + (name.charCodeAt(1) || 0);
  return AVATAR_GRADIENTS[code % AVATAR_GRADIENTS.length];
};

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return (parts[0][0] || '?').toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getDeptStyle = (dept) => DEPT_COLORS[dept] || { bg: '#f1f5f9', text: '#475569' };

const EmployeeCard = ({ employee, onDelete }) => {
  const name = employee.full_name || employee.name || '';
  const deptStyle = getDeptStyle(employee.department);
  const avatarGradient = getAvatarGradient(name);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden group hover:shadow-xl hover:shadow-slate-200/70 hover:-translate-y-0.5 transition-all duration-200">

      {/* Colored header */}
      <div
        className="h-16 relative flex items-start justify-end p-2.5"
        style={{ backgroundColor: deptStyle.bg }}
      >
        <button
          onClick={() => onDelete(employee.employee_id || employee.id)}
          className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-black/10"
          style={{ color: deptStyle.text }}
          title="Delete Employee"
        >
          <Trash2 size={13} />
        </button>

        {/* Avatar — overlaps header/body boundary */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-md ring-[3px] ring-white select-none"
          style={{ background: avatarGradient }}
        >
          {getInitials(name)}
        </div>
      </div>

      {/* Body */}
      <div className="pt-10 pb-4 px-4 text-center">
        <h3 className="font-bold text-slate-800 text-sm truncate">{name}</h3>
        <div className="flex items-center justify-center gap-1 mt-1 mb-3">
          <Mail size={10} className="text-slate-300 shrink-0" />
          <p className="text-slate-400 text-[11px] truncate" title={employee.email}>
            {employee.email}
          </p>
        </div>
        <span
          className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold"
          style={{ backgroundColor: deptStyle.bg, color: deptStyle.text }}
        >
          {employee.department}
        </span>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-50 px-4 py-2.5 text-center">
        <span className="text-slate-300 text-[10px] font-mono">
          #{employee.employee_id || employee.id}
        </span>
      </div>
    </div>
  );
};

export default EmployeeCard;
