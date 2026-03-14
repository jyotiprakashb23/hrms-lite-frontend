import { Trash2 } from 'lucide-react';

const EmployeeCard = ({ employee, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-[0_2px_8px_rgb(0,0,0,0.08)] border border-slate-100 p-5 flex flex-col items-center relative group hover:shadow-md transition-shadow">

      <button 
        onClick={() => onDelete(employee.employee_id || employee.id)}
        className="absolute top-3 right-3 flex items-center gap-1.5 bg-red-50 hover:bg-red-600 text-red-500 hover:text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all opacity-0 group-hover:opacity-100 shadow-sm"
        title="Delete Employee"
      >
        <Trash2 size={13} />
        Delete
      </button>

      <div className="w-20 h-20 bg-slate-200 rounded-full mb-4 flex items-center justify-center overflow-hidden">
        <svg className="w-12 h-12 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </div>

      <div className="text-center w-full space-y-1">
        <p className="text-slate-400 text-xs font-medium tracking-wide">{employee.employee_id || employee.id}</p>
        <h3 className="font-bold text-[#333333] text-[15px] truncate">
          {employee.full_name || employee.name}
        </h3>
        
        <p className="text-slate-500 text-xs truncate w-full" title={employee.email}>
          {employee.email}
        </p>
        
        <p className="text-slate-400 text-xs truncate w-full inline-block mt-2">
          {employee.department}
        </p>
      </div>
    </div>
  );
};

export default EmployeeCard;
