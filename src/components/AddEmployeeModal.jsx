import React, { useState } from 'react';
import { X, Loader2, User, Mail, Building2, AlertCircle } from 'lucide-react';
import useStore from '../store/useStore';

const DEPARTMENTS = [
  { name: 'Engineering',              bg: '#dbeafe', text: '#1e40af' },
  { name: 'Human Resources',          bg: '#fce7f3', text: '#be185d' },
  { name: 'Finance',                  bg: '#dcfce7', text: '#166534' },
  { name: 'Sales',                    bg: '#ffedd5', text: '#c2410c' },
  { name: 'Marketing',                bg: '#fef3c7', text: '#92400e' },
  { name: 'IT',                       bg: '#e0e7ff', text: '#4338ca' },
  { name: 'Operations',               bg: '#cffafe', text: '#155e75' },
  { name: 'Legal',                    bg: '#f3f4f6', text: '#374151' },
  { name: 'Product',                  bg: '#ede9fe', text: '#6d28d9' },
  { name: 'Admin',                    bg: '#f0fdf4', text: '#166534' },
  { name: 'Data & Analytics',         bg: '#fdf4ff', text: '#9333ea' },
  { name: 'Customer Support',         bg: '#fff1f2', text: '#be123c' },
  { name: 'CPU-S2P-Product-Delivery', bg: '#f1f5f9', text: '#475569' },
];

const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #3b82f6, #6366f1)',
  'linear-gradient(135deg, #8b5cf6, #ec4899)',
  'linear-gradient(135deg, #10b981, #06b6d4)',
  'linear-gradient(135deg, #f97316, #eab308)',
  'linear-gradient(135deg, #ec4899, #f97316)',
  'linear-gradient(135deg, #06b6d4, #3b82f6)',
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'linear-gradient(135deg, #14b8a6, #10b981)',
];

const getAvatarGradient = (name = '') => {
  const code = (name.charCodeAt(0) || 0) + (name.charCodeAt(1) || 0);
  return AVATAR_GRADIENTS[code % AVATAR_GRADIENTS.length];
};

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const AddEmployeeModal = ({ isOpen, onClose }) => {
  const addEmployee   = useStore((s) => s.addEmployee);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError]               = useState(null);
  const [formData, setFormData]         = useState({ full_name: '', email: '', department: '' });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await addEmployee(formData);
      setFormData({ full_name: '', email: '', department: '' });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const selectedDept = DEPARTMENTS.find((d) => d.name === formData.department);
  const initials     = getInitials(formData.full_name);
  const avatarGrad   = getAvatarGradient(formData.full_name);

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* ── Gradient Header ── */}
        <div
          className="px-6 pt-6 pb-10 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 55%, #312e81 100%)' }}
        >
          {/* dot grid */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          />
          {/* orb */}
          <div
            className="absolute -right-8 -top-8 w-36 h-36 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)',
              filter: 'blur(24px)',
            }}
          />

          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-blue-300 text-[10px] font-bold uppercase tracking-widest mb-1">
                New Record
              </p>
              <h2 className="text-white text-lg font-extrabold leading-tight">Add Employee</h2>
              <p className="text-blue-400/70 text-xs mt-0.5">Fill in the details to onboard a new member</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/40 hover:text-white p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Live avatar preview — sits on the bottom edge, overlapping body */}
          <div className="relative z-10 flex flex-col items-center mt-5">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-xl ring-4 ring-white/20 select-none transition-all duration-300"
              style={{ background: formData.full_name ? avatarGrad : 'rgba(255,255,255,0.12)' }}
            >
              {formData.full_name ? initials : <User size={24} className="text-white/40" />}
            </div>
            <p className="text-white/80 text-xs font-semibold mt-2 min-h-[16px]">
              {formData.full_name || <span className="text-white/30">Employee name</span>}
            </p>
            {selectedDept && (
              <span
                className="mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                style={{ backgroundColor: selectedDept.bg, color: selectedDept.text }}
              >
                {selectedDept.name}
              </span>
            )}
          </div>
        </div>

        {/* ── Form Body ── */}
        <form onSubmit={handleSubmit} className="px-6 pt-5 pb-6 space-y-4">

          {/* Full Name */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                required type="text" name="full_name" value={formData.full_name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                required type="email" name="email" value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@company.com"
                className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* Department chips */}
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
              Department
            </label>
            <div className="flex flex-wrap gap-2 max-h-[108px] overflow-y-auto pr-1">
              {DEPARTMENTS.map((dept) => {
                const active = formData.department === dept.name;
                return (
                  <button
                    key={dept.name}
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, department: active ? '' : dept.name }))}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all border"
                    style={
                      active
                        ? { backgroundColor: dept.text, color: '#fff', borderColor: dept.text }
                        : { backgroundColor: dept.bg, color: dept.text, borderColor: 'transparent' }
                    }
                  >
                    {dept.name}
                  </button>
                );
              })}
            </div>
            {/* hidden select for required validation */}
            <select
              required
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="sr-only"
              tabIndex={-1}
              aria-hidden="true"
            >
              <option value="" />
              {DEPARTMENTS.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
            </select>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">
              <AlertCircle size={14} className="shrink-0" />
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button" onClick={onClose}
              className="flex-1 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl text-sm font-medium transition-colors border border-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={isSubmitting}
              className="flex-1 py-2.5 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-md shadow-blue-200 hover:shadow-blue-300 active:scale-[0.98]"
              style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)' }}
            >
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              {isSubmitting ? 'Saving…' : 'Add Employee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
