const BASE_URL = 'https://hrms-lite-backend-dlkd.onrender.com';

const request = async (path, options = {}) => {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    // throw new Error(error.detail || 'Request failed');
    throw new Error(
    Array.isArray(error.detail) ? error.detail[0].msg : error.detail || 'Request failed'
);
  }
  // 204 No Content
  if (res.status === 204) return null;
  return res.json();
};

export const apiService = {
  getEmployees: () => request('/employees'),
  addEmployee: (payload) => request('/employees', { method: 'POST', body: JSON.stringify(payload) }),
  deleteEmployee: (employeeId) => request(`/employees/${employeeId}`, { method: 'DELETE' }),
  markAttendance: (payload) => request('/attendance', { method: 'POST', body: JSON.stringify(payload) }),
  getAttendanceByEmployee: (employeeId) => request(`/attendance/${encodeURIComponent(employeeId)}`),
};
