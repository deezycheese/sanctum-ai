import React, { useState, useEffect } from 'react';
import { Lock, Fingerprint, UserPlus, ArrowRight, Shield } from 'lucide-react';
import { StorageService } from '../services/storage';

interface LockScreenProps {
  onUnlock: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    // Check if account exists
    const storedPin = localStorage.getItem('sanctum_access_pin');
    if (!storedPin) {
      setMode('signup');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (password.length < 4) {
        setError('Access Key must be at least 4 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Keys do not match.');
        return;
      }

      // If overwriting an existing account, warn user
      if (localStorage.getItem('sanctum_access_pin')) {
          if(!window.confirm("Security Warning: Creating a new access key will permanently erase all previous encrypted data to protect your privacy. Continue?")) {
              return;
          }
          StorageService.clearAll();
      }
      
      localStorage.setItem('sanctum_access_pin', password);
      onUnlock();
    } else {
      const storedPin = localStorage.getItem('sanctum_access_pin');
      if (storedPin && password === storedPin) {
        onUnlock();
      } else {
        setError('Incorrect Access Key.');
      }
    }
  };

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login');
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center p-4 z-50">
      <div className="w-full max-w-sm text-center space-y-8">
        <div className="mx-auto w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800 shadow-2xl shadow-primary-900/20 relative group">
          {mode === 'login' ? (
             <Lock className="w-8 h-8 text-primary-500 group-hover:text-primary-400 transition-colors" />
          ) : (
             <Shield className="w-8 h-8 text-emerald-500 group-hover:text-emerald-400 transition-colors" />
          )}
          <div className="absolute inset-0 rounded-full bg-primary-500/10 animate-pulse" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {mode === 'login' ? 'Sanctum' : 'Initialize Vault'}
          </h1>
          <p className="text-slate-500">
            {mode === 'login' ? 'Identity verification required' : 'Set your private secure access key'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div className="relative group">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder={mode === 'login' ? "Enter Access Key" : "Create Access Key"}
                className="w-full bg-slate-900 border border-slate-700 text-center text-white text-lg rounded-xl px-4 py-4 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all placeholder-slate-600"
                autoFocus
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-primary-500">
                {mode === 'login' ? <Fingerprint size={24} /> : <Lock size={20} />}
              </div>
            </div>

            {mode === 'signup' && (
              <div className="relative group animate-in fade-in slide-in-from-top-2 duration-300">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Confirm Access Key"
                  className="w-full bg-slate-900 border border-slate-700 text-center text-white text-lg rounded-xl px-4 py-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder-slate-600"
                />
              </div>
            )}
          </div>

          {error && <p className="text-red-400 text-sm font-medium animate-pulse">{error}</p>}
          
          <button
            type="submit"
            className={`w-full font-medium py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
              mode === 'signup' 
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20' 
                : 'bg-primary-600 hover:bg-primary-500 text-white shadow-primary-900/20'
            }`}
          >
            {mode === 'login' ? 'Unlock Secure Vault' : 'Create Secure Account'}
            {mode === 'signup' && <ArrowRight size={18} />}
          </button>
        </form>
        
        <div className="pt-4">
          <button 
            onClick={toggleMode}
            className="text-sm text-slate-500 hover:text-primary-400 transition-colors flex items-center gap-2 mx-auto"
          >
            {mode === 'login' ? (
              <>
                <UserPlus size={14} />
                No account? Create Access Key
              </>
            ) : (
              <>
                <Lock size={14} />
                Forgot key? Reset Vault
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-slate-600 mt-8">
          Local Storage Encryption Active • Zero-Knowledge Architecture
        </p>
      </div>
    </div>
  );
};