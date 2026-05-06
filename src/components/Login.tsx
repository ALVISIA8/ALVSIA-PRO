import React, { useState } from 'react';
import { Lock, ShieldCheck, Terminal as TerminalIcon } from 'lucide-react';
import { motion } from 'motion/react';

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
    <div className="fixed inset-0 bg-black flex items-center justify-center p-4 overflow-hidden">
      <div className="crt-overlay" />
      <div className="scanline" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-lg z-10"
      >
        <div className="hacker-panel p-10 backdrop-blur-2xl shadow-[0_0_80px_-20px_rgba(59,130,246,0.3)]">
          <div className="flex flex-col items-center mb-10">
            <div className="w-24 h-24 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/30 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.2)] animate-glitch">
              <ShieldCheck className="w-12 h-12 text-blue-400" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-[0.2em] uppercase italic italic">ALVISIA <span className="text-blue-500">PRO</span></h1>
            <div className="flex items-center gap-3 mt-2">
               <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
               <p className="text-zinc-500 text-[10px] font-black tracking-[0.4em] uppercase">Security Clearance Required</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
               <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest ml-1">Kernel_Passkey</span>
               <div className="relative">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                 <input
                   type="password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder="TYPE_SECRET_KEY"
                   className="w-full bg-black/60 border border-zinc-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-zinc-800 focus:outline-none focus:border-blue-500/50 transition-all font-bold tracking-widest text-sm"
                   autoFocus
                 />
               </div>
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[0_0_30px_rgba(37,99,235,0.3)] border border-blue-400/50 uppercase tracking-widest text-xs"
            >
              <TerminalIcon className="w-4 h-4" />
              Initialize Secure_Session
            </button>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center justify-center gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <p className="text-red-500 text-center text-[10px] font-black uppercase tracking-widest">
                  Access_Denied. {attempts} Attempts_Remaining.
                </p>
              </motion.div>
            )}
          </form>

          <div className="mt-10 pt-8 border-t border-zinc-800 text-center flex flex-col items-center gap-2">
            <p className="text-[9px] text-zinc-600 font-black tracking-[0.3em] uppercase">V8.4 ULTIMATE TOOLKIT • KERNEL_ALFA_BUILD</p>
            <div className="flex gap-4">
               <span className="text-[8px] text-zinc-800 font-bold uppercase tracking-widest">AES-256_ACTIVE</span>
               <span className="text-[8px] text-zinc-800 font-bold uppercase tracking-widest">RSA-4096_SYNC</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
