import React, { useState } from 'react';
import { UserRole } from '../types';
import { PenTool, GraduationCap, Cpu, Key, Mail, User, AlertCircle } from 'lucide-react';
import { loginWithFirebase, registerWithFirebase } from '../services/firebase';

interface LoginProps {
  onLogin: (username: string, role: UserRole) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (tab === 'signin') {
        if (!email || !password) {
          throw new Error("Please fill in email and password.");
        }
        const user = await loginWithFirebase(email, password);
        // Find saved role from localStorage
        const users = JSON.parse(localStorage.getItem('scrolliq_users') || '[]');
        const found = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
        const role = found ? found.role : 'student';
        const displayName = found ? found.username : (user.displayName || "User");
        onLogin(displayName, role);
      } else {
        if (!email || !password || !username) {
          throw new Error("Please fill in all registration fields.");
        }
        const displayName = username.trim();
        await registerWithFirebase(email, password, displayName, selectedRole);
        onLogin(displayName, selectedRole);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Authentication failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      id: 'student' as UserRole,
      title: 'Student Consumer',
      description: 'Discover software structures, algorithms, and build your career pathway.',
      icon: GraduationCap,
      color: 'border-indigo-200 text-indigo-600 bg-indigo-50/50',
      activeColor: 'border-indigo-600 text-indigo-700 bg-indigo-50'
    },
    {
      id: 'creator' as UserRole,
      title: 'Content Creator',
      description: 'Upload system design, AI models, and coding clips for your followers.',
      icon: PenTool,
      color: 'border-purple-200 text-purple-600 bg-purple-50/50',
      activeColor: 'border-purple-600 text-purple-700 bg-purple-50'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#ECEFFE] via-[#F4F5FB] to-[#FCEEF5] relative overflow-hidden">
      
      {/* Background overlapping graphics */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] rounded-full bg-indigo-200/40 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] rounded-full bg-pink-200/40 blur-3xl pointer-events-none"></div>

      <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-[0_24px_70px_rgba(0,0,0,0.06)] border border-white/80 p-8 flex flex-col gap-6.5 text-slate-800">
        
        {/* Logo Section */}
        <div className="text-center flex flex-col items-center gap-3">
          <div className="relative w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-lg">
            <Cpu className="w-5 h-6 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white animate-ping"></div>
          </div>
          <div>
            <h1 className="text-2xl font-black text-black tracking-tight flex items-center justify-center gap-1.5">
              <span>ScrollIQ</span>
              <span className="text-[9px] bg-accent-primary/10 text-accent-primary font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Active
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">Make every scroll count. Your feed. Your interests.</p>
          </div>
        </div>

        {/* Tab selector */}
        <div className="flex bg-slate-100 rounded-xl p-1 gap-1 border border-slate-200/45">
          <button
            type="button"
            onClick={() => { setTab('signin'); setErrorMsg(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all focus:outline-none ${
              tab === 'signin' ? 'bg-white text-black shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setErrorMsg(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all focus:outline-none ${
              tab === 'register' ? 'bg-white text-black shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Notification Alert */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs flex gap-2 items-center">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-semibold leading-normal">{errorMsg}</span>
          </div>
        )}

        {/* Form elements */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          
          {tab === 'register' && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="user-reg-name" className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                Username / Handle
              </label>
              <input
                id="user-reg-name"
                type="text"
                placeholder="e.g. TechGeek..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200/80 focus:border-black focus:bg-white focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 transition-colors"
                required
              />
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="user-auth-email" className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              Email Address
            </label>
            <input
              id="user-auth-email"
              type="email"
              placeholder="e.g. dev@scrolliq.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 focus:border-black focus:bg-white focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="user-auth-pass" className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <Key className="w-3.5 h-3.5" />
              Password
            </label>
            <input
              id="user-auth-pass"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200/80 focus:border-black focus:bg-white focus:outline-none rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 transition-colors"
              required
            />
          </div>

          {tab === 'register' && (
            <div className="flex flex-col gap-2.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                Choose App Role
              </span>
              <div className="grid grid-cols-2 gap-3.5">
                {roles.map(r => {
                  const Icon = r.icon;
                  const isActive = selectedRole === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelectedRole(r.id)}
                      className={`flex flex-col items-center text-center p-3 rounded-2xl border text-xs transition-all outline-none ${
                        isActive ? r.activeColor : r.color
                      }`}
                    >
                      <Icon className="w-5 h-5 mb-1.5" />
                      <span className="font-extrabold block text-[10px]">{r.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-slate-900 text-white font-extrabold py-3 rounded-2xl text-xs tracking-wider uppercase transition-all shadow-md focus:outline-none disabled:opacity-55"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-1.5">
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Authenticating...</span>
              </span>
            ) : (
              tab === 'signin' ? 'Sign In to ScrollIQ' : 'Create Account'
            )}
          </button>
        </form>

        <p className="text-[9px] text-slate-400 text-center leading-normal">
          By signing in, you connect to the ScrollIQ Firebase Auth services. 
          If configuration credentials are not set in the build variables, 
          the system defaults to the LocalStorage Sandbox Auth fallback.
        </p>

      </div>
    </div>
  );
};
export default Login;
