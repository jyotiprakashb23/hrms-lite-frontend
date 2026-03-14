import React, { useEffect, useState } from 'react';
import useStore from '../store/useStore';
import EmployeeCard from '../components/EmployeeCard';
import AddEmployeeModal from '../components/AddEmployeeModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { employees, fetchEmployees, deleteEmployee, isLoadingEmployees, error } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [empToDelete, setEmpToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDeleteRequest = (id) => {
    const emp = employees.find(e => e.employee_id === id);
    setEmpToDelete(emp);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteEmployee(empToDelete.employee_id);
    } finally {
      setIsDeleting(false);
      setEmpToDelete(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-end mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm"
        >
          + Add Employee
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-10">
        {isLoadingEmployees ? (
          <div className="flex items-center justify-center h-48 text-slate-400 gap-3">
            <Loader2 className="animate-spin" size={22} />
            <span>Loading employees...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-48 text-red-500 gap-2">
            Failed to load employees: {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {employees.map(emp => (
              <EmployeeCard key={emp.id} employee={emp} onDelete={handleDeleteRequest} />
            ))}
            {employees.length === 0 && (
              <div className="col-span-full py-20 text-center text-slate-500 bg-white rounded-xl border border-slate-200 border-dashed">
                No employees found. Add one to get started!
              </div>
            )}
          </div>
        )}
      </div>

      <AddEmployeeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <DeleteConfirmModal
        employee={empToDelete}
        isDeleting={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setEmpToDelete(null)}
      />
    </div>
  );
};

export default Dashboard;
