import { AlertTriangle, Loader2 } from 'lucide-react';

const DeleteConfirmModal = ({ employee, onConfirm, onCancel, isDeleting }) => {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="p-6">
          {/* Icon + title */}
          <div className="flex flex-col items-center text-center mb-5">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-3">
              <AlertTriangle className="text-red-500" size={24} />
            </div>
            <h2 className="text-base font-bold text-slate-800">Delete Employee</h2>
            <p className="text-slate-400 text-sm mt-1">This action cannot be undone.</p>
          </div>

          {/* Employee preview */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 mb-6">
            <p className="text-sm font-semibold text-slate-800">
              {employee.full_name || employee.name}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {employee.employee_id} &bull; {employee.department}
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-medium transition-colors border border-slate-200 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isDeleting && <Loader2 size={14} className="animate-spin" />}
              {isDeleting ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
