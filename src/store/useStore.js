import { create } from 'zustand';
import { apiService } from '../services/apiService';

const useStore = create((set, get) => ({
  employees: [],
  attendance: [],
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
    set((state) => ({ employees: state.employees.filter(e => e.employee_id !== employeeId) }));
  },

  markAttendance: async (record) => {
    const result = await apiService.markAttendance(record);
    set((state) => ({ attendance: [result, ...state.attendance] }));
    return result;
  },
}));

export default useStore;
