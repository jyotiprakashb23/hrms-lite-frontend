import React, { useState } from 'react';
import { Search, CheckCircle2, User, CalendarCheck, Loader2, AlertCircle, Clock, TrendingUp } from 'lucide-react';
import useStore from '../store/useStore';
import { apiService } from '../services/apiService';
import { format } from 'date-fns';

const Attendance = () => {
  const { employees, markAttendance } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [status, setStatus] = useState('present');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [records, setRecords] = useState([]);
  const [isFetchingRecords, setIsFetchingRecords] = useState(false);
  const [recordsError, setRecordsError] = useState(null);

  const filteredEmployees =
    searchTerm === ''
      ? []
      : employees.filter((emp) => {
          const name = (emp.full_name || emp.name || '').toLowerCase();
          const id = String(emp.employee_id || emp.id).toLowerCase();
          return name.includes(searchTerm.toLowerCase()) || id.includes(searchTerm.toLowerCase());
        });

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
      await fetchRecords(selectedEmp.employee_id || selectedEmp.id);
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      setSubmitError(err.message || 'Failed to save. A record may already exist for this date.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayName = (emp) => emp?.full_name || emp?.name || 'Unknown';
  const presentCount = records.filter((r) => r.status === 'present').length;
  const absentCount = records.filter((r) => r.status === 'absent').length;
  const attendanceRate = records.length > 0 ? Math.round((presentCount / records.length) * 100) : null;

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="flex flex-col h-full">

      {/* ── Banner ── */}
      <div
        className="rounded-2xl p-6 mb-5 relative overflow-hidden shrink-0"
        style={{ background: 'linear-gradient(135deg, #052e16 0%, #064e3b 55%, #065f46 100%)' }}
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
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.4) 0%, transparent 70%)', filter: 'blur(32px)' }}
        />
        <div
          className="absolute right-20 bottom-0 w-28 h-28 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.25) 0%, transparent 70%)', filter: 'blur(24px)' }}
        />

        <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-emerald-300 text-xs font-semibold mb-1">Attendance Management</p>
            <h1 className="text-white text-xl font-extrabold leading-tight">Track Attendance</h1>
            <p className="text-emerald-400/70 text-xs mt-1">{today}</p>
          </div>
          {/* Mini stats in banner */}
          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 text-center border border-white/10">
              <p className="text-white text-lg font-extrabold leading-none">{employees.length}</p>
              <p className="text-emerald-300 text-[10px] mt-0.5 font-medium">Employees</p>
            </div>
            {selectedEmp && records.length > 0 && (
              <>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 text-center border border-white/10">
                  <p className="text-white text-lg font-extrabold leading-none">{presentCount}</p>
                  <p className="text-emerald-300 text-[10px] mt-0.5 font-medium">Present</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 text-center border border-white/10">
                  <p className="text-white text-lg font-extrabold leading-none">{attendanceRate}%</p>
                  <p className="text-emerald-300 text-[10px] mt-0.5 font-medium">Rate</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ── Two panels ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1 min-h-0">

        {/* ── Left: Record Attendance ── */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col shadow-sm">
          {/* Panel header */}
          <div
            className="px-6 py-4 shrink-0"
            style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                <CalendarCheck size={16} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Record Attendance</h3>
                <p className="text-slate-500 text-[11px] mt-0.5">Select an employee and mark their attendance</p>
              </div>
            </div>
          </div>

          <div className="p-6 flex flex-col gap-5 flex-1">
            {!selectedEmp ? (
              <div className="relative">
                <label className="block text-[11px] font-bold text-slate-500 mb-2 uppercase tracking-wider">
                  Select Employee
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input
                    type="text"
                    placeholder="Search by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 pl-9 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                  />
                </div>
                {searchTerm && (
                  <div className="absolute top-full left-0 w-full mt-1.5 bg-white border border-slate-200 shadow-xl rounded-xl max-h-48 overflow-y-auto z-10">
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map((emp) => (
                        <div
                          key={emp.employee_id || emp.id}
                          onClick={() => handleSelect(emp)}
                          className="px-4 py-3 hover:bg-emerald-50 cursor-pointer border-b border-slate-50 last:border-0 flex items-center gap-3"
                        >
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                            <User size={14} className="text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-slate-800">{displayName(emp)}</p>
                            <p className="text-xs text-slate-400">
                              {emp.employee_id || emp.id} &bull; {emp.department}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-4 text-sm text-slate-400 text-center">
                        No employee found.
                      </div>
                    )}
                  </div>
                )}

                {/* Empty prompt */}
                {!searchTerm && (
                  <div className="mt-8 flex flex-col items-center justify-center py-10 border-2 border-dashed border-slate-100 rounded-2xl">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-3">
                      <User size={22} className="text-emerald-400" />
                    </div>
                    <p className="text-slate-600 font-semibold text-sm">Search for an employee</p>
                    <p className="text-slate-400 text-xs mt-1">Type a name or ID above to get started</p>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleMarkAttendance} className="flex flex-col gap-4">
                {/* Selected Employee chip */}
                <div className="flex items-center justify-between bg-emerald-50 p-3.5 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                      <User size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-emerald-900 leading-tight">{displayName(selectedEmp)}</p>
                      <p className="text-xs text-emerald-500 mt-0.5">#{selectedEmp.employee_id || selectedEmp.id}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setSelectedEmp(null); setRecords([]); setSubmitError(null); }}
                    className="text-xs text-emerald-600 hover:text-emerald-800 font-semibold bg-white px-2.5 py-1 rounded-lg border border-emerald-200 hover:border-emerald-400 transition-colors"
                  >
                    Change
                  </button>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                    Date
                  </label>
                  <input
                    type="date" required value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                  />
                </div>

                {/* Status toggle */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                    Status
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setStatus('present')}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                        status === 'present'
                          ? 'bg-green-600 text-white border-green-600 shadow-sm'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-green-300 hover:text-green-600'
                      }`}
                    >
                      Present
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus('absent')}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                        status === 'absent'
                          ? 'bg-red-600 text-white border-red-600 shadow-sm'
                          : 'bg-white text-slate-500 border-slate-200 hover:border-red-300 hover:text-red-600'
                      }`}
                    >
                      Absent
                    </button>
                  </div>
                </div>

                {submitError && (
                  <div className="flex items-start gap-2 text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl p-3">
                    <AlertCircle size={15} className="mt-0.5 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <button
                  type="submit" disabled={isSubmitting}
                  className="w-full py-2.5 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-md shadow-emerald-200 hover:shadow-emerald-300 active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #059669 0%, #0d9488 100%)' }}
                >
                  {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                  {isSubmitting ? 'Saving...' : 'Save Record'}
                </button>

                {submitSuccess && (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-semibold justify-center bg-green-50 py-2.5 rounded-xl border border-green-100">
                    <CheckCircle2 size={15} />
                    Attendance marked successfully!
                  </div>
                )}
              </form>
            )}
          </div>
        </div>

        {/* ── Right: Attendance Records ── */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col shadow-sm">
          {/* Panel header */}
          <div
            className="px-6 py-4 shrink-0"
            style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-teal-600 rounded-xl flex items-center justify-center shadow-sm shrink-0">
                  <TrendingUp size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">
                    {selectedEmp ? `${displayName(selectedEmp)}'s Records` : 'Attendance Records'}
                  </h3>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    {selectedEmp ? `${records.length} total record${records.length !== 1 ? 's' : ''}` : 'Select an employee to view'}
                  </p>
                </div>
              </div>
              {selectedEmp && records.length > 0 && (
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                    {presentCount} present
                  </span>
                  <span className="text-[11px] font-semibold bg-red-50 text-red-600 px-2.5 py-1 rounded-full">
                    {absentCount} absent
                  </span>
                </div>
              )}
            </div>

            {/* Attendance rate bar */}
            {selectedEmp && records.length > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-400 font-medium">Attendance rate</span>
                  <span className="text-[10px] font-bold text-emerald-600">{attendanceRate}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${attendanceRate}%`,
                      background: attendanceRate >= 75
                        ? 'linear-gradient(90deg, #059669, #34d399)'
                        : attendanceRate >= 50
                        ? 'linear-gradient(90deg, #d97706, #fbbf24)'
                        : 'linear-gradient(90deg, #dc2626, #f87171)',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {isFetchingRecords ? (
              <div className="flex items-center justify-center h-32 text-slate-400 gap-2">
                <Loader2 size={16} className="animate-spin" />
                <span className="text-sm">Loading records...</span>
              </div>
            ) : recordsError ? (
              <div className="text-red-500 text-sm text-center mt-8">{recordsError}</div>
            ) : records.length > 0 ? (
              <div className="space-y-2">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${
                      record.status === 'present'
                        ? 'bg-green-50/60 border-green-100 hover:bg-green-50'
                        : 'bg-red-50/40 border-red-100 hover:bg-red-50/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          record.status === 'present' ? 'bg-green-100' : 'bg-red-100'
                        }`}
                      >
                        <Clock size={13} className={record.status === 'present' ? 'text-green-600' : 'text-red-500'} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-800">
                          {format(new Date(record.date), 'MMM dd, yyyy')}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">#{record.employee_id}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${
                        record.status === 'present'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {record.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3 py-12">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
                  <CalendarCheck size={24} className="text-emerald-300" />
                </div>
                <p className="text-sm font-semibold text-slate-500">
                  {selectedEmp ? 'No records found' : 'No employee selected'}
                </p>
                <p className="text-xs text-slate-400 text-center max-w-[180px]">
                  {selectedEmp
                    ? 'Mark attendance on the left to get started.'
                    : 'Search and select an employee to view their attendance history.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;
