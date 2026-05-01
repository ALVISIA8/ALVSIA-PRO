import React, { useState } from 'react';
import { Lock, ShieldCheck, Terminal as TerminalIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoginProps {
  onSuccess: () => void;
}

export default function Login({ onSuccess }: LoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [attempts, setAttempts] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hidden real password as requested: "4lvisia_Premium_Tool"
    if (password === '4lvisia_Premium_Tool') {
      onSuccess();
    } else {
      setError(true);
      setAttempts(prev => prev - 1);
      if (attempts <= 1) {
          alert("SECURITY LOCKDOWN: Maximum attempts reached.");
          window.location.reload();
      }
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-zinc-900/80 border border-blue-500/30 p-8 rounded-2xl backdrop-blur-xl shadow-[0_0_50px_-12px_rgba(59,130,246,0.3)]">
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20 mb-4 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
              <ShieldCheck className="w-10 h-10 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tighter">ALVISIA PRO EDITION</h1>
            <p className="text-zinc-500 text-sm">SECURITY CLEARANCE REQUIRED</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="ACCESS PASSWORD"
                className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-blue-500/50 transition-colors"
                autoFocus
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <TerminalIcon className="w-4 h-4" />
              INITIALIZE SYSTEM
            </button>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-center text-sm font-medium"
              >
                ACCESS DENIED. {attempts} ATTEMPTS REMAINING.
              </motion.p>
            )}
          </form>

          <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
            <p className="text-xs text-zinc-600">V8.0 ULTIMATE TOOLKIT • @ALVISIA_PRO</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
