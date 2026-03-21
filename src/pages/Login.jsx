import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, Loader2, AlertCircle, Eye, EyeOff,
  Users, CalendarCheck, ShieldCheck,
} from 'lucide-react';
import useStore from '../store/useStore';

const FEATURES = [
  {
    icon: Users,
    title: 'Employee Management',
    desc: 'Onboard, manage, and organise your entire team from one place.',
  },
  {
    icon: CalendarCheck,
    title: 'Attendance Tracking',
    desc: 'Mark and review daily attendance records with ease.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Reliable',
    desc: 'Role-based access keeps your HR data safe at all times.',
  },
];

const Login = () => {
  const navigate = useNavigate();
  const login = useStore((s) => s.login);

  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading]       = useState(false);
  const [loadingStep, setLoadingStep]   = useState(0); // 0=idle 1=verify 2=fetch
  const [error, setError]               = useState(null);

  const loadingLabels = ['', 'Verifying credentials…', 'Loading your workspace…'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setLoadingStep(1);
    try {
      await new Promise((r) => setTimeout(r, 450));
      setLoadingStep(2);
      await login(email, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
      setLoadingStep(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">

      {/* ════════════════════════════════════════
          LEFT  –  Brand / Hero panel
      ════════════════════════════════════════ */}
      <div
        className="hidden lg:flex lg:w-[52%] relative flex-col justify-between p-14 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0b1120 0%, #0d1f4c 45%, #130b2e 100%)',
        }}
      >
        {/* ── Dot-grid overlay ── */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* ── Glowing orbs ── */}
        <div
          className="animate-float-slow absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(59,130,246,0.35) 0%, transparent 70%)',
            filter: 'blur(48px)',
          }}
        />
        <div
          className="animate-float-mid absolute bottom-0 -left-24 w-[380px] h-[380px] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
            filter: 'blur(56px)',
          }}
        />
        <div
          className="animate-float-fast absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(14,165,233,0.15) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        {/* ── Logo ── */}
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
          >
            <Briefcase size={18} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-wide">WorkNest</span>
        </div>

        {/* ── Hero copy ── */}
        <div className="relative z-10">
          <p className="text-blue-400 text-xs font-semibold uppercase tracking-widest mb-4">
            HR Management Platform
          </p>
          <h1 className="text-white text-4xl font-extrabold leading-tight mb-5">
            Simplify your<br />
            <span
              style={{
                background: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              HR operations
            </span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            Everything you need to manage your team, track attendance,
            and keep your organisation running smoothly.
          </p>

          {/* Feature list */}
          <div className="mt-10 flex flex-col gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <Icon size={15} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold">{title}</p>
                  <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom tagline ── */}
        <p className="relative z-10 text-slate-600 text-[11px]">
          &copy; 2026 WorkNest &mdash; HR Management System
        </p>
      </div>

      {/* ════════════════════════════════════════
          RIGHT  –  Login form
      ════════════════════════════════════════ */}
      <div className="flex-1 flex items-center justify-center bg-white relative p-6">
        {/* Very subtle background tint */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 70% 20%, rgba(219,234,254,0.45) 0%, transparent 60%)',
          }}
        />

        <div className="relative z-10 w-full max-w-[380px] animate-fade-up">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-9 lg:hidden">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
            >
              <Briefcase size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-800 text-lg">WorkNest</span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Welcome back 👋</h2>
          <p className="text-slate-400 text-sm mb-8">
            Sign in to your admin account to continue
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gmail.com"
                disabled={isLoading}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-300 disabled:opacity-60"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoading}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-300 disabled:opacity-60"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="animate-fade-in flex items-center gap-2.5 text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <AlertCircle size={15} className="shrink-0" />
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 text-white text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2.5 disabled:opacity-70 shadow-lg shadow-blue-200 hover:shadow-blue-300 active:scale-[0.98]"
              style={{
                background: isLoading
                  ? '#3b82f6'
                  : 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>{loadingLabels[loadingStep]}</span>
                </>
              ) : (
                'Sign In to WorkNest'
              )}
            </button>
          </form>

          {/* Loading progress dots */}
          {isLoading && (
            <div className="animate-fade-in flex items-center justify-center gap-2 mt-4">
              {[1, 2].map((step) => (
                <div
                  key={step}
                  className="h-1.5 rounded-full transition-all duration-500"
                  style={{
                    width: loadingStep >= step ? '28px' : '8px',
                    background: loadingStep >= step ? '#3b82f6' : '#e2e8f0',
                  }}
                />
              ))}
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-slate-300 text-xs">demo access</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Demo credentials */}
          <div
            className="rounded-2xl p-4"
            style={{
              background: 'linear-gradient(135deg, #f0f7ff 0%, #f5f3ff 100%)',
              border: '1px solid #dbeafe',
            }}
          >
            <p className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest mb-3">
              Demo Credentials
            </p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Email</span>
                <span className="text-xs font-semibold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-100">
                  admin@gmail.com
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Password</span>
                <span className="text-xs font-semibold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-100">
                  admin@123
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
