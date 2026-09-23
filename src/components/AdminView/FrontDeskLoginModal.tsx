import React, { useState } from 'react';
import { Lock, Shield, Eye, EyeOff, KeyRound, AlertCircle, CheckCircle2, X } from 'lucide-react';

interface FrontDeskLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const FrontDeskLoginModal: React.FC<FrontDeskLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const cleanUser = username.trim();
      const cleanPass = password.trim();

      if (cleanUser === 'admin' && cleanPass === 'apelin@123') {
        sessionStorage.setItem('div_front_desk_authenticated', 'true');
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setErrorMessage('Invalid username or password. Please verify your credentials.');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header decoration */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6 text-white text-center relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center shadow-inner mb-3">
            <Shield className="w-7 h-7 text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Front Desk Portal</h2>
          <p className="text-xs text-slate-300 mt-1">
            Restricted Staff & Management Access
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Staff Username
            </label>
            <div className="relative">
              <input
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Enter username (e.g. admin)"
                className="w-full pl-3.5 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Enter password"
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isLoading ? 'Verifying...' : 'Sign In to Front Desk'}</span>
            </button>
          </div>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={onClose}
              className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
            >
              Return to Guest View
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
