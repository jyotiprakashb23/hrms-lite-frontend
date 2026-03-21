import { create } from 'zustand';
import { apiService } from '../services/apiService';

const CREDENTIALS = { email: 'admin@gmail.com', password: 'admin@123' };

const useStore = create((set, get) => ({
  // ── Auth ──────────────────────────────────────────────
  isAuthenticated: sessionStorage.getItem('hrms_auth') === '1',

  login: async (email, password) => {
    if (email !== CREDENTIALS.email || password !== CREDENTIALS.password) {
      throw new Error('Invalid email or password.');
    }
    // Fetch employees while "logging in" so dashboard is ready instantly
    set({ isLoadingEmployees: true, error: null });
    try {
      const data = await apiService.getEmployees();
      set({ employees: data });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ isLoadingEmployees: false });
    }
    set({ isAuthenticated: true });
    sessionStorage.setItem('hrms_auth', '1');
  },

  logout: () => {
    set({ isAuthenticated: false, employees: [], attendance: [] });
    sessionStorage.removeItem('hrms_auth');
  },

  // ── Employees ─────────────────────────────────────────
  employees: [],
  isLoadingEmployees: false,
  error: null,

  fetchEmployees: async () => {
    set({ isLoadingEmployees: true, error: null });
    try {
      const data = await apiService.getEmployees();
      set({ employees: data });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ isLoadingEmployees: false });
    }
  },

  addEmployee: async (payload) => {
    const newEmp = await apiService.addEmployee(payload);
    set((state) => ({ employees: [...state.employees, newEmp] }));
    return newEmp;
  },

  deleteEmployee: async (employeeId) => {
    await apiService.deleteEmployee(employeeId);
    set((state) => ({
      employees: state.employees.filter((e) => e.employee_id !== employeeId),
    }));
  },

  // ── Attendance ────────────────────────────────────────
  attendance: [],

  markAttendance: async (record) => {
    const result = await apiService.markAttendance(record);
    set((state) => ({ attendance: [result, ...state.attendance] }));
    return result;
  },
}));

export default useStore;
