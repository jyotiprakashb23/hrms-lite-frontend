import React, { useEffect, useState, useMemo } from 'react';
import useStore from '../store/useStore';
import EmployeeCard from '../components/EmployeeCard';
import AddEmployeeModal from '../components/AddEmployeeModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import { Loader2, Users, Plus, Building2, Search, X } from 'lucide-react';

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const Dashboard = () => {
  const { employees, fetchEmployees, deleteEmployee, isLoadingEmployees, error } = useStore();
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [empToDelete, setEmpToDelete]   = useState(null);
  const [isDeleting, setIsDeleting]     = useState(false);
  const [search, setSearch]             = useState('');
  const [deptFilter, setDeptFilter]     = useState(null);

  useEffect(() => {
    if (employees.length === 0 && !isLoadingEmployees) fetchEmployees();
  }, []);

  const handleDeleteRequest = (id) => {
    setEmpToDelete(employees.find((e) => e.employee_id === id));
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

  const departments = useMemo(
    () => [...new Set(employees.map((e) => e.department).filter(Boolean))].sort(),
    [employees],
  );

  const filtered = useMemo(() => {
    return employees.filter((e) => {
      const name = (e.full_name || e.name || '').toLowerCase();
      const dept = (e.department || '').toLowerCase();
      const matchSearch =
        !search ||
        name.includes(search.toLowerCase()) ||
        dept.includes(search.toLowerCase()) ||
        String(e.employee_id || e.id).includes(search);
      const matchDept = !deptFilter || e.department === deptFilter;
      return matchSearch && matchDept;
    });
  }, [employees, search, deptFilter]);

  const hasFilters = search || deptFilter;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="flex flex-col h-full">

      {/* ── Welcome Banner ── */}
      <div
        className="rounded-2xl p-6 mb-5 relative overflow-hidden shrink-0"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #312e81 100%)' }}
      >
        {/* Dot grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Orbs */}
        <div
          className="absolute -right-12 -top-12 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)', filter: 'blur(32px)' }}
        />
        <div
          className="absolute right-20 bottom-0 w-28 h-28 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)', filter: 'blur(24px)' }}
        />

        <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-blue-300 text-xs font-semibold mb-1">{getGreeting()}, Admin 👋</p>
            <h1 className="text-white text-xl font-extrabold leading-tight">Team Overview</h1>
            <p className="text-blue-400/70 text-xs mt-1">{today}</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-white text-blue-900 hover:bg-blue-50 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-lg shrink-0"
          >
            <Plus size={15} />
            Add Employee
          </button>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      {!isLoadingEmployees && !error && employees.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-5 shrink-0">

          <div
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)' }}
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full" />
            <div className="absolute right-6 bottom-1 w-10 h-10 bg-white/5 rounded-full" />
            <div className="relative z-10">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                <Users size={16} className="text-white" />
              </div>
              <p className="text-white text-3xl font-extrabold leading-none">{employees.length}</p>
              <p className="text-blue-200 text-xs mt-1.5 font-medium">Total Employees</p>
            </div>
          </div>

          <div
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full" />
            <div className="absolute right-6 bottom-1 w-10 h-10 bg-white/5 rounded-full" />
            <div className="relative z-10">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                <Building2 size={16} className="text-white" />
              </div>
              <p className="text-white text-3xl font-extrabold leading-none">{departments.length}</p>
              <p className="text-purple-200 text-xs mt-1.5 font-medium">Departments</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Search + Dept filters ── */}
      {!isLoadingEmployees && !error && employees.length > 0 && (
        <div className="mb-4 shrink-0 flex flex-col gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, department or ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-slate-200 rounded-xl pl-9 pr-9 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-300"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Dept chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setDeptFilter(null)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                !deptFilter
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              All
            </button>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setDeptFilter(dept === deptFilter ? null : dept)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  deptFilter === dept
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Employee Grid ── */}
      <div className="flex-1 overflow-y-auto pb-10 min-h-0">
        {isLoadingEmployees ? (
          <div className="flex items-center justify-center h-48 text-slate-400 gap-3">
            <Loader2 className="animate-spin" size={20} />
            <span className="text-sm">Loading employees…</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-48 text-red-500 text-sm">
            Failed to load employees: {error}
          </div>
        ) : employees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
              <Users size={26} className="text-slate-300" />
            </div>
            <p className="text-slate-700 font-semibold text-sm">No employees yet</p>
            <p className="text-slate-400 text-xs mt-1 mb-5">Add your first employee to get started</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              <Plus size={14} />
              Add Employee
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-slate-200">
            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-3">
              <Search size={22} className="text-slate-300" />
            </div>
            <p className="text-slate-700 font-semibold text-sm">No results found</p>
            <p className="text-slate-400 text-xs mt-1 mb-4">Try a different name or department</p>
            <button
              onClick={() => { setSearch(''); setDeptFilter(null); }}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-400 font-medium">
                {hasFilters ? `${filtered.length} of ${employees.length}` : `${employees.length}`} employee{employees.length !== 1 ? 's' : ''}
                {deptFilter && <span className="ml-1 text-blue-500">in {deptFilter}</span>}
              </p>
              {hasFilters && (
                <button
                  onClick={() => { setSearch(''); setDeptFilter(null); }}
                  className="text-xs text-blue-500 hover:text-blue-700 font-semibold flex items-center gap-1"
                >
                  <X size={11} /> Clear
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((emp) => (
                <EmployeeCard key={emp.id || emp.employee_id} employee={emp} onDelete={handleDeleteRequest} />
              ))}
            </div>
          </>
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
