import React, { useState } from 'react';
import { Search, CheckCircle2, User, CalendarCheck, Loader2, AlertCircle } from 'lucide-react';
import useStore from '../store/useStore';
import { apiService } from '../services/apiService';
import { format } from 'date-fns';

const Attendance = () => {
  const { employees, markAttendance } = useStore();

  // Left panel: marking state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [status, setStatus] = useState('present');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Right panel: attendance records for the selected employee
  const [records, setRecords] = useState([]);
  const [isFetchingRecords, setIsFetchingRecords] = useState(false);
  const [recordsError, setRecordsError] = useState(null);

  const filteredEmployees = searchTerm === ''
    ? []
    : employees.filter(emp =>
        (emp.full_name || emp.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(emp.employee_id || emp.id).toLowerCase().includes(searchTerm.toLowerCase())
      );

  const fetchRecords = async (employeeId) => {
    setIsFetchingRecords(true);
    setRecordsError(null);
    setRecords([]);
    try {
      const data = await apiService.getAttendanceByEmployee(employeeId);
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      setRecordsError(err.message);
    } finally {
      setIsFetchingRecords(false);
    }
  };

  const handleSelect = (emp) => {
    setSelectedEmp(emp);
    setSearchTerm('');
    setSubmitError(null);
    setSubmitSuccess(false);
    fetchRecords(emp.employee_id || emp.id);
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    if (!selectedEmp) return;
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    try {
      await markAttendance({
        employee_id: selectedEmp.employee_id || String(selectedEmp.id),
        date,
        status,
      });
      setSubmitSuccess(true);
      // Refresh the records panel
      await fetchRecords(selectedEmp.employee_id || selectedEmp.id);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      setSubmitError(err.message || 'Failed to save. A record may already exist for this date.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayName = (emp) => emp?.full_name || emp?.name || 'Unknown';

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Attendance Management</h2>
        <p className="text-slate-500 text-sm mt-1">Search an employee to mark or view their attendance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">

        {/* ── Left: Record Attendance ── */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
          <h3 className="font-bold text-lg text-slate-800 border-b pb-2">Record Attendance</h3>

          {/* Search */}
          {!selectedEmp ? (
            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Employee</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 pl-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {searchTerm && (
                <div className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-200 shadow-lg rounded-lg max-h-48 overflow-y-auto z-10">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map(emp => (
                      <div
                        key={emp.employee_id || emp.id}
                        onClick={() => handleSelect(emp)}
                        className="px-4 py-2 hover:bg-slate-50 cursor-pointer border-b border-white last:border-0 flex flex-col"
                      >
                        <span className="font-semibold text-sm text-slate-800">{displayName(emp)}</span>
                        <span className="text-xs text-slate-500">{emp.employee_id || emp.id} &bull; {emp.department}</span>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-slate-500 text-center">No employee found.</div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleMarkAttendance} className="space-y-4">
              {/* Selected Employee chip */}
              <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-100">
                <div className="flex items-center gap-3">
                  <User className="text-blue-500 bg-white p-1 rounded-full border border-blue-200" size={28} />
                  <div>
                    <p className="font-semibold text-sm text-blue-900">{displayName(selectedEmp)}</p>
                    <p className="text-xs text-blue-700">{selectedEmp.employee_id || selectedEmp.id}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedEmp(null); setRecords([]); setSubmitError(null); }}
                  className="text-xs text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  Change
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input
                  type="date" required value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="present">Present</option>
                  <option value="absent">Absent</option>
                </select>
              </div>

              {/* Error (e.g. duplicate date) */}
              {submitError && (
                <div className="flex items-start gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                {isSubmitting ? 'Saving...' : 'Save Record'}
              </button>

              {submitSuccess && (
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium justify-center">
                  <CheckCircle2 size={16} /> Attendance marked successfully!
                </div>
              )}
            </form>
          )}
        </div>

        {/* ── Right: Attendance Records ── */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col overflow-hidden">
          <h3 className="font-bold text-lg text-slate-800 border-b pb-2 shrink-0 mb-4">
            {selectedEmp ? `Records — ${displayName(selectedEmp)}` : 'Attendance Records'}
          </h3>

          <div className="flex-1 overflow-y-auto pr-1">
            {isFetchingRecords ? (
              <div className="flex items-center justify-center h-32 text-slate-400 gap-2">
                <Loader2 size={18} className="animate-spin" /> Loading records...
              </div>
            ) : recordsError ? (
              <div className="text-red-500 text-sm text-center mt-8">{recordsError}</div>
            ) : records.length > 0 ? (
              <div className="space-y-3">
                {records.map(record => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-slate-50 hover:bg-white transition-colors"
                  >
                    <div>
                      <p className="text-xs text-slate-500 font-mono">{record.employee_id}</p>
                      <p className="font-medium text-sm text-slate-800">
                        {format(new Date(record.date), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                      record.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {record.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                <CalendarCheck size={40} className="text-slate-200" />
                <p className="text-sm">{selectedEmp ? 'No records for this employee.' : 'Select an employee to view records.'}</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Attendance;
