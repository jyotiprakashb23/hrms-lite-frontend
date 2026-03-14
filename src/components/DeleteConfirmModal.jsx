import { AlertTriangle, X } from 'lucide-react';

const DeleteConfirmModal = ({ employee, onConfirm, onCancel }) => {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
              <AlertTriangle className="text-red-500" size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Delete Employee</h2>
              <p className="text-slate-500 text-sm">This action cannot be undone.</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 mb-6">
            <p className="text-sm font-semibold text-slate-800">{employee.full_name || employee.name}</p>
            <p className="text-xs text-slate-500">{employee.employee_id} &bull; {employee.department}</p>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
