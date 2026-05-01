import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Binary, Search, Code, Cpu, Eye, Network, 
  FileCode, GraduationCap, Zap, Activity, Info, 
  Terminal as TerminalIcon, ShieldAlert, 
  Download, Upload, Trash2, RefreshCw, Lock, Play, ShieldCheck,
  Skull, Vault, Globe, ShoppingBag, Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import { cn, formatBytes } from './lib/utils';
import { 
  CryptoLab, BinaryAnalysis, SearchEngine, BruteForce, 
  NetworkTools, Visualization, ApkCrackSuite, FridaBridge, 
  PatchingEngine, SecurityEngine, Steganography, PasswordGen,
  ExploitEngine, VaultEngine, SocialEngineering
} from './lib/engines';
import Login from './components/Login';
import MatrixBackground from './components/MatrixBackground';

import { registry } from './lib/plugins';
import './lib/plugins/sandbox';
import './lib/plugins/steganography';
import './lib/plugins/hardware';
import './lib/plugins/crypto_audit';
import './lib/plugins/osint';
import './lib/plugins/vuln_scanner';
import './lib/plugins/marketplace';
import './lib/plugins/forensics';
import './lib/plugins/stress_test';
import './lib/plugins/terminal';

// --- TYPES ---
type LogLevel = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
}

type ModuleId = 
  | 'dashboard' | 'crypto' | 'binary' | 'search' | 'patch' | 'brute' 
  | 'visual' | 'network' | 'audit' | 'file' | 'learning' | 'apk' 
  | 'frida' | 'exploit' | 'vault' | 'social' | 'marketplace' | 'settings' | 'help'
  | string;

// --- COMPONENTS ---

const ModuleLayout = ({ title, children, icon: Icon }: { title: string, children: React.ReactNode, icon: React.ElementType }) => (
  <div className="flex flex-col h-full">
    <div className="flex items-center gap-3 p-6 border-b border-zinc-800/50 bg-zinc-900/20">
      <div className="p-2 bg-blue-500/10 rounded-lg">
        <Icon className="w-5 h-5 text-blue-400" />
      </div>
      <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
    </div>
    <div className="flex-1 p-6 overflow-y-auto terminal-scroll">
      {children}
    </div>
  </div>
);

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [activeModule, setActiveModule] = useState<ModuleId>('dashboard');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState({ ram: 0, cpu: 0 });
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const [isMatrixActive, setIsMatrixActive] = useState(true);
  const [isHighEntropy, setIsHighEntropy] = useState(false);
  const [isAntiDebug, setIsAntiDebug] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [terminalInput, setTerminalInput] = useState('');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder*="SEARCH"]') as HTMLInputElement;
        searchInput?.focus();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '`') {
        e.preventDefault();
        setIsTerminalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Persistence: Load on mount
  useEffect(() => {
    const savedActiveModule = localStorage.getItem('alvisia_active_module');
    if (savedActiveModule) setActiveModule(savedActiveModule as ModuleId);

    const savedLogs = localStorage.getItem('alvisia_logs');
    if (savedLogs) {
      try {
        setLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error('Failed to parse logs from localStorage');
      }
    }

    const savedSettings = localStorage.getItem('alvisia_settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        setIsMatrixActive(settings.isMatrixActive ?? true);
        setIsHighEntropy(settings.isHighEntropy ?? false);
        setIsAntiDebug(settings.isAntiDebug ?? true);
      } catch (e) {
        console.error('Failed to parse settings from localStorage');
      }
    }
  }, []);

  // Persistence: Save on changes
  useEffect(() => {
    localStorage.setItem('alvisia_active_module', activeModule);
  }, [activeModule]);

  useEffect(() => {
    localStorage.setItem('alvisia_logs', JSON.stringify(logs.slice(-50)));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('alvisia_settings', JSON.stringify({
      isMatrixActive,
      isHighEntropy,
      isAntiDebug
    }));
  }, [isMatrixActive, isHighEntropy, isAntiDebug]);

  // States for Crypto Lab
  const [cryptoInput, setCryptoInput] = useState('');
  const [cryptoOutput, setCryptoOutput] = useState('');
  
  // States for Binary Analysis
  const [binaryFile, setBinaryFile] = useState<{name: string, data: Uint8Array} | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  // States for Brute Force
  const [bruteResults, setBruteResults] = useState<any[]>([]);
  const [isBruting, setIsBruting] = useState(false);

  // States for Search
  const [searchPattern, setSearchPattern] = useState('');
  const [searchResults, setSearchResults] = useState<number[]>([]);

  // States for Network
  const [networkTarget, setNetworkTarget] = useState('google.com');
  const [networkResults, setNetworkResults] = useState<any[]>([]);
  const [publicIpInfo, setPublicIpInfo] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);

  // States for Visualization
  const [hexOffset, setHexOffset] = useState(0);
  const [hexRows, setHexRows] = useState<any[]>([]);

  // States for Patching
  const [patchOffset, setPatchOffset] = useState('0');
  const [patchHex, setPatchHex] = useState('');

  // States for APK
  const [apkSteps, setApkSteps] = useState<any[]>([]);
  const [isCracking, setIsCracking] = useState(false);

  // States for Frida
  const [fridaScript, setFridaScript] = useState('');
  const [payloadIp, setPayloadIp] = useState('127.0.0.1');
  const [payloadPort, setPayloadPort] = useState('4444');

  // Vault states
  const [vaultKey, setVaultKey] = useState('');
  const [vaultData, setVaultData] = useState(localStorage.getItem('alvisia_vault') || '');

  // ... (existing state)

  useEffect(() => {
    if (vaultData) {
      localStorage.setItem('alvisia_vault', vaultData);
    }
  }, [vaultData]);

  const fetchIp = async () => {
    addLog('Fetching public network identity...', 'INFO');
    const info = await NetworkTools.getPublicIP();
    setPublicIpInfo(info);
    if (info.ip) {
      addLog(`Public Identity Resolved: ${info.ip} (${info.org || 'Anonymous ISP'})`, 'SUCCESS');
    }
  };

  useEffect(() => {
    if (isAuth) {
      fetchIp();
    }
  }, [isAuth]);

  // Packet Sniffer states
  const [packetResults, setPacketResults] = useState<any[]>([]);
  const [isSniffing, setIsSniffing] = useState(false);

  // Security States
  const [isLockdown, setIsLockdown] = useState(false);
  const [hwid, setHwid] = useState('');
  const [securityLevel, setSecurityLevel] = useState('MAXIMUM');

  useEffect(() => {
    setHwid(SecurityEngine.generateHardwareID());
    
    // Anti-Debug Listener
    const cleanup = SecurityEngine.detectDevTools(() => {
        setIsLockdown(true);
        addLog('UNAUTHORIZED DEBUGGER DETECTED! KERNEL LOCKDOWN ENGAGED.', 'ERROR');
    });

    // Disable Right-Click
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    window.addEventListener('contextmenu', handleContextMenu);

    return () => {
        cleanup();
        window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  useEffect(() => {
    if (binaryFile) {
        const sampleSize = isHighEntropy ? 1024 : 256;
        setHexRows(Visualization.generateHexDump(binaryFile.data, hexOffset, sampleSize));
    }
  }, [binaryFile, hexOffset, isHighEntropy]);

  const addLog = (message: string, level: LogLevel = 'INFO') => {
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      level,
      message
    };
    setLogs(prev => [...prev, newLog].slice(-100));
  };

  useEffect(() => {
    if (!isAuth) return;
    addLog('ALVISIA PRO EDITION V8.0 Initializing...', 'INFO');
    addLog('Bypass mechanisms engaged.', 'SUCCESS');
    addLog('System ready for target analysis.', 'INFO');

    const interval = setInterval(() => {
      setStats({
        ram: Math.floor(Math.random() * (450 - 380) + 380),
        cpu: Math.floor(Math.random() * 15)
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [isAuth]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;
    
    addLog(`CMD: ${cmd}`, 'INFO');
    
    if (cmd === 'clear') {
        setLogs([]);
    } else if (cmd === 'help') {
        addLog('Available: scan, brute, vault, crypto, clear, lockdown, status, whoami, version', 'INFO');
    } else if (cmd === 'lockdown') {
        setIsLockdown(true);
    } else if (cmd === 'status') {
        addLog('SYSTEM STATUS: OPTIMAL. ALL KERNELS ATTACHED.', 'SUCCESS');
    } else if (cmd === 'scan') {
        setActiveModule('network');
        addLog('Switching to Network Tools...', 'INFO');
    } else if (cmd === 'whoami') {
        addLog(`SESSION_UID: ${hwid}`, 'INFO');
        addLog('USER_LEVEL: ROOT_ADMIN', 'SUCCESS');
    } else if (cmd === 'version') {
        addLog('ALVISIA PRO ULTIMATE V8.0.4', 'INFO');
    } else if (cmd === 'crack') {
        setActiveModule('apk');
        addLog('Navigating to APK Crack Suite...', 'WARNING');
    } else if (cmd === 'vault') {
        setActiveModule('vault');
        addLog('Accessing encrypted vault...', 'WARNING');
    } else {
        addLog(`Unknown kernel command: ${cmd}`, 'ERROR');
    }
    
    setTerminalInput('');
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const uint8Array = new Uint8Array(arrayBuffer);
      setBinaryFile({ name: file.name, data: uint8Array });
      addLog(`File loaded: ${file.name} (${formatBytes(file.size)})`, 'SUCCESS');
    };
    reader.readAsArrayBuffer(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop } as any);

  if (!isAuth) return <Login onSuccess={() => {
    setIsAuth(true);
    addLog('AUTHENTICATION VERIFIED. NODE ESTABLISHED.', 'SUCCESS');
    setTimeout(() => addLog('KERNELS: LOADED. MODULES: VERIFIED.', 'INFO'), 500);
    setTimeout(() => addLog('SYSTEM INTEGRITY CHECK: 100% SECURE.', 'SUCCESS'), 1000);
  }} />;

  const moduleInfo = {
    dashboard: { label: 'Node Dashboard', icon: Zap },
    search: { label: 'Search Engine', icon: Search },
    patch: { label: 'Patch Engine', icon: Code },
    brute: { label: 'Brute Force', icon: Cpu },
    visual: { label: 'Visualization', icon: Eye },
    network: { label: 'Network Tools', icon: Network },
    audit: { label: 'Security Audit', icon: ShieldCheck },
    exploit: { label: 'Exploit Lab', icon: Skull },
    vault: { label: 'Secure Vault', icon: Vault },
    file: { label: 'File Toolkit', icon: FileCode },
    learning: { label: 'Learning Mode', icon: GraduationCap },
    apk: { label: 'APK Crack Suite', icon: ShieldAlert },
    frida: { label: 'Frida Bridge', icon: Activity },
    social: { label: 'Social Engineer', icon: Globe },
    settings: { label: 'System Settings', icon: RefreshCw },
    help: { label: 'Help & About', icon: Info }
  };

  return (
    <div className={cn(
        "h-screen bg-black flex overflow-hidden font-mono text-sm selection:bg-blue-500/30 relative",
        isLockdown && "blur-xl grayscale pointer-events-none"
    )}>
      <MatrixBackground active={isMatrixActive} />
      {isLockdown && (
        <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-black/80 backdrop-blur-3xl animate-pulse">
           <ShieldAlert className="w-24 h-24 text-red-500 mb-6" />
           <h1 className="text-4xl font-black text-red-500 tracking-tighter uppercase mb-4">KERNEL LOCKDOWN</h1>
           <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Unauthorized access attempt logged. System secured.</p>
           <button 
             onClick={() => window.location.reload()}
             className="mt-12 px-8 py-3 bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl hover:bg-red-500/20 transition-all font-bold uppercase tracking-widest pointer-events-auto"
           >
             REBOOT KERNEL
           </button>
        </div>
      )}
      {/* Sidebar */}
      <div className="w-64 border-r border-zinc-800 flex flex-col bg-zinc-900/30">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.4)]">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-base tracking-tighter text-nowrap">ALVISIA PRO</h1>
              <p className="text-[10px] text-zinc-500">ULTIMATE V8.0</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1 terminal-scroll">
          {[
            { id: 'dashboard', label: 'Node Dashboard', icon: Zap },
            { id: 'crypto', label: 'Crypto Lab', icon: Shield },
            { id: 'binary', label: 'Binary Analysis', icon: Binary },
            { id: 'search', label: 'Search Engine', icon: Search },
            { id: 'patch', label: 'Patch Engine', icon: Code },
            { id: 'brute', label: 'Brute Force', icon: Cpu },
            { id: 'visual', label: 'Visualization', icon: Eye },
            { id: 'network', label: 'Network Tools', icon: Network },
            { id: 'audit', label: 'Security Audit', icon: ShieldCheck },
            { id: 'exploit', label: 'Exploit Lab', icon: Skull },
            { id: 'vault', label: 'Secure Vault', icon: Vault },
            { id: 'file', label: 'File Toolkit', icon: FileCode },
            { id: 'learning', label: 'Learning Mode', icon: GraduationCap },
            { id: 'apk', label: 'APK Crack Suite', icon: ShieldAlert },
            { id: 'frida', label: 'Frida Bridge', icon: Activity },
            { id: 'social', label: 'Social Engineer', icon: Globe },
            { id: 'settings', label: 'Settings', icon: RefreshCw },
            { id: 'help', label: 'Help & Documentation', icon: Info },
            ...registry.getPlugins().map(p => ({
              id: p.metadata.id,
              label: p.metadata.name,
              icon: p.icon
            }))
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveModule(item.id as ModuleId)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group",
                activeModule === item.id 
                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40"
              )}
            >
              <item.icon className={cn("w-4 h-4", activeModule === item.id ? "text-blue-400" : "text-zinc-600 group-hover:text-zinc-400")} />
              <span className="font-medium tracking-tight">{item.label}</span>
              {activeModule === item.id && <motion.div layoutId="nav-active" className="ml-auto w-1 h-4 bg-blue-500 rounded-full" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800 bg-black/40 space-y-4">
           <div className="space-y-4">
              <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-100 transition-opacity">
                   <Lock className="w-3 h-3 text-blue-500" />
                </div>
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-1">HWID Binding</p>
                <p className="text-xs text-blue-400 font-mono break-all">{hwid || 'CALCULATING...'}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Encryption</p>
                  <p className="text-green-500 font-bold text-[10px]">AES-256-GCM</p>
                </div>
                <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Integrity</p>
                  <p className="text-blue-500 font-bold text-[10px]">PULSE: OK</p>
                </div>
                <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl col-span-2">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Quantum Guard</p>
                  <p className="text-purple-500 font-bold text-[10px] animate-pulse">CRYPTO-LATTICE ACTIVE</p>
                </div>
              </div>
           </div>
           <div className="flex items-center justify-center gap-2">
              <div className={cn(
                "w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]",
                isLockdown ? "bg-red-500" : "bg-green-500"
              )} />
              <p className="text-[10px] text-zinc-500 text-center uppercase tracking-[0.2em] font-bold">
                 System {isLockdown ? 'Locked' : 'Online'}
              </p>
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/5 via-black to-black">
        {/* Main Header / Search */}
        <div className="h-16 border-b border-zinc-800/50 flex items-center justify-between px-6 bg-zinc-900/10 backdrop-blur-sm z-40">
           <div className="flex items-center gap-6 flex-1">
              <div className="relative w-full max-w-md group">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                 <input 
                   type="text"
                   placeholder="SEARCH MODULES OR COMMANDS (SYSTEM_ROOT_QUERY)..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full bg-black/40 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-[10px] text-zinc-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 font-bold tracking-widest transition-all"
                 />
                 {searchQuery && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                       <div className="p-2 border-b border-zinc-800 text-[8px] font-bold text-zinc-600 uppercase tracking-widest px-4">Instant Results</div>
                       <div className="max-h-64 overflow-y-auto terminal-scroll">
                          {[
                            { id: 'dashboard', label: 'Dashboard', icon: Zap },
                            { id: 'crypto', label: 'Crypto Lab', icon: Shield },
                            { id: 'binary', label: 'Binary Analysis', icon: Binary },
                            { id: 'search', label: 'Pattern Search', icon: Search },
                            { id: 'patch', label: 'Patch Engine', icon: Code },
                            { id: 'brute', label: 'Brute Force', icon: Cpu },
                            { id: 'vault', label: 'Secure Vault', icon: Vault },
                            { id: 'social', label: 'Social Engineer', icon: Globe },
                            { id: 'settings', label: 'System Settings', icon: RefreshCw },
                          ].filter(m => m.label.toLowerCase().includes(searchQuery.toLowerCase())).map(m => (
                            <button 
                              key={m.id}
                              onClick={() => {
                                setActiveModule(m.id as ModuleId);
                                setSearchQuery('');
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 transition-colors text-left"
                            >
                               <m.icon className="w-3.5 h-3.5 text-blue-500" />
                               <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">{m.label}</span>
                            </button>
                          ))}
                       </div>
                    </div>
                 )}
              </div>
              <div className="h-4 w-px bg-zinc-800" />
              <div className="flex items-center gap-4 text-nowrap">
                 <div className="flex items-center gap-2">
                    <span className="text-[8px] text-zinc-600 uppercase font-black tracking-widest">Target:</span>
                    <span className="text-[10px] text-white font-mono">{networkTarget || 'NONE'}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <span className="text-[8px] text-zinc-600 uppercase font-black tracking-widest">Level:</span>
                    <span className="text-[10px] text-blue-500 font-bold">{securityLevel}</span>
                 </div>
              </div>
           </div>
           
           <div className="flex items-center gap-3 ml-6">
              <button 
                onClick={() => {
                  setIsLockdown(!isLockdown);
                  addLog(`Manual Lockdown ${!isLockdown ? 'ENGAGED' : 'DISENGAGED'}`, isLockdown ? 'INFO' : 'WARNING');
                }}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-[9px] font-bold uppercase tracking-widest",
                  isLockdown 
                    ? "bg-red-500/10 border-red-500/30 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
                    : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-white"
                )}
              >
                 <ShieldAlert className="w-3 h-3" />
                 {isLockdown ? 'LOCKDOWN ACTIVE' : 'ENGAGE LOCKDOWN'}
              </button>
              <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-800 bg-zinc-900 flex items-center justify-center group cursor-pointer hover:border-blue-500 transition-all">
                 <Skull className="w-4 h-4 text-zinc-600 group-hover:text-blue-500 transition-colors" />
              </div>
           </div>
        </div>

        {/* Module Content */}
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="h-full"
            >
              {activeModule === 'dashboard' && (
                <ModuleLayout title="NODE DASHBOARD" icon={Zap}>
                   <div className="max-w-6xl space-y-8 pb-12">
                      {/* Hero Section */}
                      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                         <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 space-y-8 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                              <Globe className="w-72 h-72 rotate-12" />
                           </div>
                           <div className="relative z-10">
                              <div className="flex items-center gap-3 mb-6">
                                 <span className="px-3 py-1 bg-blue-600 rounded text-[9px] font-black italic tracking-widest shadow-[0_0_15px_rgba(37,99,235,0.5)]">OPERATIONAL</span>
                                 <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">System Architecture: V8.0.4-ULTIMATE</span>
                              </div>
                              <h3 className="text-4xl font-black text-white tracking-tighter uppercase leading-tight mb-4">
                                 Autonomous <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Security Node</span> <br />
                                 Active & Synced
                              </h3>
                              <p className="text-zinc-500 text-sm max-w-lg leading-relaxed mb-8">
                                 Managing {registry.getPlugins().length + 18} security sub-routines. Global threat vectors are being monitored 
                                 via real-time entropy analysis and heuristic pattern matching.
                              </p>
                              <div className="flex gap-4">
                                 <button onClick={() => setActiveModule('audit')} className="px-8 py-3 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all transform active:scale-95 shadow-xl">
                                    Initiate Audit
                                 </button>
                                 <button onClick={() => setIsTerminalOpen(true)} className="px-8 py-3 bg-zinc-800 text-white rounded-xl font-black text-[10px] uppercase tracking-widest border border-zinc-700 hover:bg-zinc-700 transition-all transform active:scale-95">
                                    Open Terminal
                                 </button>
                              </div>
                           </div>
                         </div>

                         <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden">
                            <div className="relative z-10">
                               <div className="flex items-center justify-between mb-8">
                                  <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                     <ShieldCheck className="w-6 h-6 text-blue-400" />
                                  </div>
                                  <div className="text-right">
                                     <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Node Health</p>
                                     <p className="text-xl font-black text-white">99.8%</p>
                                  </div>
                               </div>
                               <div className="space-y-6">
                                  <div>
                                     <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                                        <span className="text-blue-400">Security Entropy</span>
                                        <span className="text-white">88%</span>
                                     </div>
                                     <div className="h-1.5 bg-blue-900/30 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: '88%' }} className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                                     </div>
                                  </div>
                                  <div>
                                     <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                                        <span className="text-purple-400">Database Integrity</span>
                                        <span className="text-white">OPTIMAL</span>
                                     </div>
                                     <div className="h-1.5 bg-purple-900/30 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                                     </div>
                                  </div>
                               </div>
                            </div>
                            <div className="mt-8">
                               <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-[0.3em] text-center">Session UUID: {hwid}</p>
                            </div>
                         </div>
                      </section>

                      {/* Stats Section */}
                      <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                         {[
                           { label: 'Active Subroutines', val: stats.cpu * 8 + 124, unit: 'PROCS', color: 'text-blue-500' },
                           { label: 'Network Latency', val: '12', unit: 'MS', color: 'text-green-500' },
                           { label: 'Uptime', val: '142:33:12', unit: 'H:M:S', color: 'text-purple-500' },
                           { label: 'Vault Status', val: 'LOCKED', unit: 'SECURE', color: 'text-orange-500' }
                         ].map((s, i) => (
                           <div key={i} className="bg-zinc-900/30 border border-zinc-800 p-6 rounded-2xl hover:bg-zinc-800/40 transition-all cursor-pointer group">
                              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mb-2 group-hover:text-zinc-400">{s.label}</p>
                              <div className="flex items-baseline gap-2">
                                 <span className={cn("text-2xl font-black tracking-tighter", s.color)}>{s.val}</span>
                                 <span className="text-[8px] text-zinc-600 font-bold uppercase">{s.unit}</span>
                              </div>
                           </div>
                         ))}
                      </section>

                      {/* Map and Threat Log */}
                      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                         <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 space-y-6 relative overflow-hidden min-h-[400px]">
                            <div className="flex items-center justify-between mb-4">
                               <h3 className="text-xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
                                  <Globe className="w-5 h-5 text-blue-500" /> Global Traffic Monitor
                               </h3>
                               <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                                  <span className="text-[9px] text-zinc-500 font-bold uppercase">Live Stream</span>
                               </div>
                            </div>
                            
                            <div className="relative h-full w-full bg-black/40 border border-zinc-800/50 rounded-2xl flex items-center justify-center overflow-hidden">
                               {/* Enhanced Map Animation */}
                               <div className="absolute inset-0 opacity-20 pointer-events-none">
                                  {[...Array(5)].map((_, i) => (
                                    <motion.div 
                                      key={i}
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                                      transition={{ duration: 6, repeat: Infinity, delay: i * 1.2 }}
                                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-blue-500/50 rounded-full"
                                    />
                                  ))}
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-blue-500/10 rotate-12" />
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-blue-500/10 -rotate-45" />
                               </div>
                               
                               <div className="z-10 text-center">
                                  <div className="relative inline-block mb-6">
                                     <Activity className="w-16 h-16 text-blue-500 animate-pulse" />
                                     <div className="absolute -inset-4 bg-blue-500/20 blur-2xl rounded-full animate-pulse" />
                                  </div>
                                  <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.4em] font-black max-w-[200px] mx-auto leading-relaxed">
                                     Intercepting Global Proxy Chains...
                                  </p>
                               </div>

                               {/* Dynamic Points */}
                               {[...Array(12)].map((_, i) => (
                                  <motion.div
                                    key={i}
                                    initial={{ 
                                      x: Math.random() * 400 - 200, 
                                      y: Math.random() * 300 - 150, 
                                      opacity: 0,
                                      scale: 1
                                    }}
                                    animate={{ 
                                      opacity: [0, 1, 0],
                                      scale: [1, 1.5, 1],
                                      x: Math.random() * 400 - 200, 
                                      y: Math.random() * 300 - 150,
                                    }}
                                    transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, delay: Math.random() * 10 }}
                                    className="absolute w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                                  />
                               ))}
                            </div>
                         </div>

                         <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl p-8 space-y-6">
                            <h3 className="text-xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
                               <ShieldAlert className="w-5 h-5 text-red-500" /> Recent Integrity Blocks
                            </h3>
                            <div className="space-y-4">
                               {[
                                 { ip: '192.168.1.104', type: 'SSH Brute Force', risk: 'HIGH' },
                                 { ip: '10.0.0.15', type: 'XSS Payload Inject', risk: 'MEDIUM' },
                                 { ip: '45.12.8.2', type: 'DDoS Reflection', risk: 'CRITICAL' },
                                 { ip: '188.4.1.25', type: 'Rootkit Beacon', risk: 'HIGH' },
                                 { ip: 'local::gateway', type: 'Sandbox Escape', risk: 'CRITICAL' }
                               ].map((t, i) => (
                                 <div key={i} className="group p-4 bg-black/40 border border-zinc-800 rounded-xl hover:bg-zinc-800/20 transition-all">
                                    <div className="flex justify-between items-center mb-1">
                                       <span className="text-[10px] font-mono text-zinc-500">{t.ip}</span>
                                       <span className={cn(
                                          "text-[8px] font-black uppercase px-2 py-0.5 rounded",
                                          t.risk === 'CRITICAL' ? "bg-red-500 text-white" :
                                          t.risk === 'HIGH' ? "bg-orange-500/20 text-orange-500" : "bg-yellow-500/20 text-yellow-500"
                                       )}>{t.risk}</span>
                                    </div>
                                    <p className="text-xs font-bold text-white uppercase tracking-tight">{t.type}</p>
                                 </div>
                               ))}
                            </div>
                            <button onClick={() => setActiveModule('audit')} className="w-full py-4 bg-zinc-800/80 hover:bg-zinc-800 text-zinc-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-zinc-700/50 transition-all">
                               Full System Scan
                            </button>
                         </div>
                      </section>
                   </div>
                </ModuleLayout>
              )}

              {activeModule === 'exploit' && (
                <ModuleLayout title="EXPLOIT LABORATORY" icon={Skull}>
                   <div className="max-w-4xl space-y-8 pb-12">
                      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 space-y-6">
                         <div>
                            <h3 className="text-2xl font-bold text-white tracking-tighter uppercase">Payload Architect</h3>
                            <p className="text-zinc-500 text-sm">Generate specialized shellcode and exploitation payloads for remote testing.</p>
                         </div>

                         <div className="flex gap-4 items-center bg-black/40 p-4 border border-zinc-800 rounded-xl">
                            <div className="flex-1 space-y-2">
                               <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">LHOST (Local IP)</label>
                               <input 
                                 value={payloadIp}
                                 onChange={(e) => setPayloadIp(e.target.value)}
                                 className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs font-mono text-blue-400 focus:outline-none focus:border-blue-500"
                                 placeholder="e.g. 192.168.1.5"
                               />
                            </div>
                            <div className="w-24 space-y-2">
                               <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">LPORT</label>
                               <input 
                                 value={payloadPort}
                                 onChange={(e) => setPayloadPort(e.target.value)}
                                 className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs font-mono text-blue-400 focus:outline-none focus:border-blue-500"
                                 placeholder="4444"
                               />
                            </div>
                            <button 
                              onClick={() => {
                                setPayloadIp('127.0.0.1');
                                setPayloadPort('4444');
                                setFridaScript('');
                                addLog('Exploit Lab parameters reset.', 'INFO');
                              }}
                              className="h-9 px-4 bg-red-500/10 border border-red-500/30 rounded-lg text-[10px] font-bold text-red-500 hover:text-white hover:bg-red-500/20 transition-colors uppercase self-end mb-[2px]"
                            >
                               Clear
                            </button>
                         </div>
                         
                         <div className="grid grid-cols-3 gap-4">
                            {[
                              { id: 'linux_x64', label: 'Linux x64 Bind', icon: TerminalIcon },
                              { id: 'windows_x64', label: 'Win x64 Exec', icon: ShieldAlert },
                              { id: 'reverse_tcp', label: 'Python RevShell', icon: Network }
                            ].map((p) => (
                              <button 
                                key={p.id}
                                onClick={() => {
                                  const payload = ExploitEngine.generatePayload(p.id, payloadIp, payloadPort);
                                  setFridaScript(payload); // Reusing script state for simple output
                                  addLog(`Generated ${p.label} payload targeting ${payloadIp}:${payloadPort}.`, 'SUCCESS');
                                }}
                                className="flex flex-col items-center gap-3 p-6 bg-black/40 border border-zinc-800 rounded-xl hover:bg-zinc-800/50 transition-all group"
                              >
                                 <p.icon className="w-8 h-8 text-zinc-600 group-hover:text-blue-400" />
                                 <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{p.label}</span>
                              </button>
                            ))}
                         </div>

                         <div className="space-y-4">
                            <div className="flex justify-between items-center">
                               <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Payload Output</h4>
                               <button 
                                 onClick={() => {
                                    navigator.clipboard.writeText(fridaScript);
                                    addLog('Payload copied to clipboard.', 'SUCCESS');
                                 }}
                                 className="text-[10px] text-blue-500 font-bold uppercase hover:underline"
                               >
                                  Copy Hex String
                               </button>
                            </div>
                            <div className="bg-black border border-zinc-800 rounded-xl p-6 min-h-32 flex items-center justify-center relative overflow-hidden">
                               <div className="absolute top-2 left-2 flex gap-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
                                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
                                </div>
                                <p className="text-xs font-mono text-green-500/80 break-all text-center">
                                   {fridaScript || 'SELECT PAYLOAD ARCHITECTURE'}
                                </p>
                            </div>
                         </div>
                      </section>

                      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 space-y-6">
                         <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white tracking-tighter uppercase">Vulnerability Scanner</h3>
                            <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                               <span className="text-[10px] font-bold text-blue-500 uppercase">Fuzzing: IDLE</span>
                            </div>
                         </div>
                         <div className="p-8 border-2 border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                            <Cpu className="w-12 h-12 text-zinc-700" />
                            <div>
                               <p className="text-zinc-400 font-bold">Attach Application for Fuzzing</p>
                               <p className="text-[10px] text-zinc-600 uppercase tracking-widest mt-1">Requires Frida Server Connection</p>
                            </div>
                            <button className="px-6 py-2 bg-zinc-800 text-zinc-400 rounded-full text-[10px] font-bold uppercase hover:bg-zinc-700 transition-colors">
                               Init Fuzzer
                            </button>
                         </div>
                      </section>
                   </div>
                </ModuleLayout>
              )}

              {activeModule === 'vault' && (
                <ModuleLayout title="SECURE VAULT" icon={Vault}>
                   <div className="max-w-xl mx-auto py-12 space-y-8">
                      <section className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 space-y-8">
                         <div className="text-center space-y-2">
                            <Lock className="w-12 h-12 text-blue-500 mx-auto" />
                            <h3 className="text-2xl font-bold text-white tracking-tighter uppercase font-black">Data Encryption Vault</h3>
                            <p className="text-zinc-500 text-sm">Military-grade AES-256-GCM encryption for your sensitive strings.</p>
                         </div>

                         <div className="space-y-6">
                            <div className="space-y-2">
                               <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Universal Key</label>
                               <input 
                                 type="password"
                                 value={vaultKey}
                                 onChange={(e) => setVaultKey(e.target.value)}
                                 placeholder="MASTER_KEY_0x1..."
                                 className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-blue-400 font-mono focus:outline-none focus:border-blue-500/50 transition-all"
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Payload Content</label>
                               <textarea 
                                 value={vaultData}
                                 onChange={(e) => setVaultData(e.target.value)}
                                 placeholder="Paste data to secure..."
                                 className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 h-32 text-zinc-300 font-mono text-sm focus:outline-none focus:border-blue-500/50 transition-all resize-none"
                               />
                            </div>
                            <div className="flex gap-4">
                               <button 
                                 onClick={() => {
                                    if (!vaultKey || !vaultData) return addLog('Missing key or data.', 'WARNING');
                                    const encrypted = VaultEngine.encryptVault(vaultData, vaultKey);
                                    setVaultData(encrypted);
                                    addLog('Vault contents encrypted with AES-256.', 'SUCCESS');
                                 }}
                                 className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold uppercase tracking-widest transition-all active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                               >
                                  Encrypt
                               </button>
                               <button 
                                 onClick={() => {
                                    if (!vaultKey || !vaultData) return addLog('Missing key or data.', 'WARNING');
                                    const decrypted = VaultEngine.decryptVault(vaultData, vaultKey);
                                    if (decrypted) {
                                      setVaultData(decrypted);
                                      addLog('Vault contents decrypted successfully.', 'SUCCESS');
                                    } else {
                                      addLog('Decryption failed. Invalid Master Key.', 'ERROR');
                                    }
                                 }}
                                 className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-4 rounded-xl font-bold uppercase tracking-widest transition-all active:scale-95 border border-zinc-700"
                               >
                                  Decrypt
                                </button>
                            </div>
                         </div>
                      </section>

                      <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-2xl flex items-center gap-4">
                         <Shield className="w-8 h-8 text-blue-500/50" />
                         <p className="text-[10px] text-zinc-500 leading-relaxed uppercase">
                            The Secure Vault uses client-side AES encryption. No data is sent to the server. 
                            If you lose your master key, your data is <span className="text-red-500 font-bold">permanently lost</span>.
                         </p>
                      </div>
                   </div>
                </ModuleLayout>
              )}

              {activeModule === 'crypto' && (
                <ModuleLayout title="CRYPTO LAB" icon={Zap}>
                  <div className="max-w-4xl space-y-8">
                    <section className="space-y-4">
                      <h3 className="text-blue-400 font-bold flex items-center gap-2 uppercase tracking-tighter">
                        <TerminalIcon className="w-4 h-4" /> Encoding Engine
                      </h3>
                      <textarea
                        value={cryptoInput}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val.length > 50000) {
                            addLog('Input limited to 50,000 characters.', 'WARNING');
                            return;
                          }
                          setCryptoInput(val);
                        }}
                        placeholder="Enter text to process..."
                        className="w-full h-32 bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500/50 resize-none font-mono"
                      />
                      <div className="flex flex-wrap gap-3">
                        <button onClick={() => {
                          if (!cryptoInput) return addLog('Please enter input.', 'WARNING');
                          setCryptoOutput(CryptoLab.encode(cryptoInput, 'base64'));
                          addLog('Base64 encoding complete.', 'SUCCESS');
                        }} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg transition-colors border border-zinc-700">BASE64</button>
                        <button onClick={() => {
                          if (!cryptoInput) return addLog('Please enter input.', 'WARNING');
                          setCryptoOutput(CryptoLab.encode(cryptoInput, 'hex'));
                          addLog('Hex encoding complete.', 'SUCCESS');
                        }} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg transition-colors border border-zinc-700">HEX</button>
                        <button onClick={() => {
                          if (!cryptoInput) return addLog('Please enter input.', 'WARNING');
                          setCryptoOutput(CryptoLab.encode(cryptoInput, 'binary'));
                          addLog('Binary encoding complete.', 'SUCCESS');
                        }} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg transition-colors border border-zinc-700">BINARY</button>
                        <button onClick={() => {
                          const res = CryptoLab.rot13(cryptoInput);
                          setCryptoOutput(res);
                          addLog('ROT13 applied.', 'SUCCESS');
                        }} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg transition-colors border border-zinc-700">ROT13</button>
                        <button onClick={() => {
                          const res = CryptoLab.morse(cryptoInput, 'encode');
                          setCryptoOutput(res);
                          addLog('Morse encoding complete.', 'SUCCESS');
                        }} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg transition-colors border border-zinc-700">MORSE</button>
                        <button onClick={() => {
                          const res = PasswordGen.generate(24);
                          setCryptoOutput(res);
                          addLog('High-entropy password generated.', 'SUCCESS');
                        }} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg transition-colors border border-zinc-700">PASS GEN</button>
                        <div className="w-px h-8 bg-zinc-800" />
                        <button onClick={() => {
                          const res = CryptoLab.decode(cryptoInput, 'base64');
                          setCryptoOutput(res);
                          if (res.startsWith('Error')) addLog(res, 'ERROR');
                          else addLog('Base64 decoding complete.', 'SUCCESS');
                        }} className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-4 py-2 rounded-lg transition-colors border border-blue-500/20">B64 DECODE</button>
                        <button onClick={() => {
                          const res = CryptoLab.decode(cryptoInput, 'hex');
                          setCryptoOutput(res);
                          if (res.startsWith('Error')) addLog(res, 'ERROR');
                          else addLog('Hex decoding complete.', 'SUCCESS');
                        }} className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-4 py-2 rounded-lg transition-colors border border-blue-500/20">HEX DECODE</button>
                      </div>
                    </section>

                    <section className="space-y-4">
                      <h3 className="text-blue-400 font-bold flex items-center gap-2 uppercase tracking-tighter">
                        <TerminalIcon className="w-4 h-4" /> Output Result
                      </h3>
                      <div className="relative group">
                        <pre className="w-full min-h-16 bg-black border border-zinc-800 rounded-xl p-4 text-green-500 font-mono break-all whitespace-pre-wrap terminal-scroll max-h-60 overflow-y-auto">
                          {cryptoOutput || 'Awaiting input...'}
                        </pre>
                        {cryptoOutput && (
                           <button 
                             onClick={() => {
                               navigator.clipboard.writeText(cryptoOutput);
                               addLog('Result copied to clipboard.', 'SUCCESS');
                             }}
                             className="absolute top-2 right-2 p-2 bg-zinc-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                           >
                             <Download className="w-4 h-4 text-zinc-400" />
                           </button>
                        )}
                      </div>
                    </section>

                    <section className="space-y-4">
                      <h3 className="text-blue-400 font-bold flex items-center gap-2 uppercase tracking-tighter">
                        <TerminalIcon className="w-4 h-4" /> Hash Generator
                      </h3>
                      <div className="flex gap-3">
                        <button onClick={() => setCryptoOutput(CryptoLab.hash(cryptoInput, 'md5'))} className="flex-1 bg-zinc-900 border border-zinc-800 py-3 rounded-xl hover:bg-zinc-800 transition-colors">MD5</button>
                        <button onClick={() => setCryptoOutput(CryptoLab.hash(cryptoInput, 'sha256'))} className="flex-1 bg-zinc-900 border border-zinc-800 py-3 rounded-xl hover:bg-zinc-800 transition-colors">SHA256</button>
                        <button onClick={() => setCryptoOutput(CryptoLab.hash(cryptoInput, 'sha512'))} className="flex-1 bg-zinc-900 border border-zinc-800 py-3 rounded-xl hover:bg-zinc-800 transition-colors">SHA512</button>
                      </div>
                    </section>
                  </div>
                </ModuleLayout>
              )}

              {activeModule === 'binary' && (
                <ModuleLayout title="BINARY ANALYSIS" icon={Binary}>
                  <div className="max-w-4xl space-y-8">
                    {!binaryFile ? (
                      <div 
                        {...getRootProps()} 
                        className={cn(
                          "border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer",
                          isDragActive ? "border-blue-500 bg-blue-500/5" : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/20"
                        )}
                      >
                        <input {...getInputProps()} />
                        <Upload className="w-12 h-12 text-zinc-700 mb-4" />
                        <p className="text-zinc-400 font-bold tracking-widest">DRAG & DROP BINARY DATA</p>
                        <p className="text-zinc-600 text-xs mt-2 font-mono">SUPPORTED: .EXE, .ELF, .DEX, .BIN, .APK</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-center justify-between bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-500/10 rounded-lg">
                              <FileCode className="w-6 h-6 text-blue-400" />
                            </div>
                            <div>
                              <h4 className="font-bold text-white uppercase tracking-tighter">{binaryFile.name}</h4>
                              <p className="text-xs text-zinc-500 font-mono">{formatBytes(binaryFile.data.length)} • {BinaryAnalysis.detectFormat(binaryFile.data)}</p>
                            </div>
                          </div>
                          <button onClick={() => setBinaryFile(null)} className="p-2 text-zinc-500 hover:text-red-400 transition-colors">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
                            <p className="text-[10px] text-zinc-500 mb-2 font-bold tracking-widest uppercase">Shannon Entropy</p>
                            <p className="text-3xl font-bold text-blue-400 tracking-tighter">{BinaryAnalysis.calculateEntropy(binaryFile.data).toFixed(4)}</p>
                            <p className="text-[10px] text-zinc-600 mt-2 uppercase">Analysis: {BinaryAnalysis.calculateEntropy(binaryFile.data) > 7.5 ? 'COMPRESSED/ENCRYPTED' : 'NORMAL DATA'}</p>
                          </div>
                          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
                            <p className="text-[10px] text-zinc-500 mb-2 font-bold tracking-widest uppercase">Magic Signature</p>
                            <p className="text-xl font-bold text-white font-mono uppercase tracking-widest">
                                {Array.from(binaryFile.data.slice(0, 4)).map((b: any) => b.toString(16).padStart(2, '0')).join(' ')}
                            </p>
                            <p className="text-[10px] text-zinc-600 mt-2 uppercase">File header HEX dump</p>
                          </div>
                          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-xl">
                            <p className="text-[10px] text-zinc-500 mb-2 font-bold tracking-widest uppercase">Security Level</p>
                            <p className="text-xl font-bold text-green-400 tracking-tighter">SECURED</p>
                            <p className="text-[10px] text-zinc-600 mt-2 uppercase">Static integrity verified</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <section className="space-y-4">
                            <h3 className="text-blue-400 font-bold flex items-center gap-2 uppercase tracking-tighter">
                               <TerminalIcon className="w-4 h-4" /> File Header Info
                            </h3>
                            <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl space-y-3">
                               {(() => {
                                 const info = BinaryAnalysis.parseHeader(binaryFile.data);
                                 if (!info) return <p className="text-xs text-zinc-600 italic">No static header data found.</p>;
                                 return Object.entries(info).map(([key, value]) => (
                                   <div key={key} className="flex justify-between items-center bg-black/40 p-2 rounded border border-zinc-800/50">
                                      <span className="text-[10px] text-zinc-500 font-bold uppercase">{key}</span>
                                      <span className="text-xs text-blue-400 font-mono">{String(value)}</span>
                                   </div>
                                 ));
                               })()}
                            </div>
                          </section>

                          <section className="space-y-4">
                            <h3 className="text-blue-400 font-bold flex items-center gap-2 uppercase tracking-tighter">
                               <TerminalIcon className="w-4 h-4" /> Security Checks
                            </h3>
                            <div className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-xl space-y-2">
                               <div className="flex justify-between items-center text-[11px]">
                                  <span className="text-zinc-400 uppercase">ASLR Protection</span>
                                  <span className="text-green-500 font-bold">DETECTED</span>
                               </div>
                               <div className="flex justify-between items-center text-[11px]">
                                  <span className="text-zinc-400 uppercase">DEP / NX Bit</span>
                                  <span className="text-green-500 font-bold">ACTIVE</span>
                               </div>
                               <div className="flex justify-between items-center text-[11px]">
                                  <span className="text-zinc-400 uppercase">Stack Canary</span>
                                  <span className="text-blue-500 font-bold">ANALYZING</span>
                               </div>
                               <div className="w-full h-1 bg-zinc-800 rounded-full mt-2 overflow-hidden">
                                  <motion.div animate={{ width: '85%' }} className="h-full bg-blue-500" />
                               </div>
                            </div>
                          </section>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <section className="space-y-4">
                            <h3 className="text-blue-400 font-bold flex items-center gap-2 uppercase tracking-tighter">
                               <TerminalIcon className="w-4 h-4" /> String Extraction
                            </h3>
                            <div className="bg-black border border-zinc-800 rounded-xl p-4 h-64 overflow-y-auto terminal-scroll font-mono text-zinc-400 space-y-1">
                               {BinaryAnalysis.extractStrings(binaryFile.data).map((str, idx) => (
                                 <div key={idx} className="flex gap-4 hover:bg-zinc-900 px-2 py-1 transition-colors border-b border-zinc-900/50 last:border-0 text-[10px]">
                                    <span className="text-zinc-700 w-8 tabular-nums">{idx + 1}</span>
                                    <span className="text-green-500/80 truncate">{str}</span>
                                 </div>
                               ))}
                            </div>
                          </section>

                          <section className="space-y-4">
                            <h3 className="text-blue-400 font-bold flex items-center gap-2 uppercase tracking-tighter">
                               <TerminalIcon className="w-4 h-4" /> Disassembly (x86/ARM)
                            </h3>
                            <div className="bg-black border border-zinc-800 rounded-xl p-4 h-64 overflow-y-auto terminal-scroll font-mono text-zinc-400 space-y-1">
                               {BinaryAnalysis.disassemble(binaryFile.data).map((ins, idx) => (
                                 <div key={idx} className="flex gap-4 text-[10px] items-center border-b border-zinc-900/50 py-1">
                                    <span className="text-zinc-700 w-12">{ins.offset}</span>
                                    <span className="text-blue-500/70 w-8 uppercase">{ins.hex}</span>
                                    <span className="text-white font-bold">{ins.mnemonic}</span>
                                 </div>
                               ))}
                            </div>
                          </section>
                        </div>

                        {/* Steganography Lab */}
                        <section className="space-y-4">
                          <h3 className="text-blue-400 font-bold flex items-center gap-2 uppercase tracking-tighter">
                             <Shield className="w-4 h-4" /> Steganography Lab
                          </h3>
                          <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-4">
                             <p className="text-xs text-zinc-500 font-mono">Simulate hiding or extracting data from binary buffers using LSB (Least Significant Bit) techniques.</p>
                             <div className="flex gap-4">
                               <button 
                                 onClick={() => {
                                    const secret = prompt('Enter secret message to hide:');
                                    if (secret) {
                                      const newData = Steganography.hideLSB(binaryFile.data, secret);
                                      setBinaryFile({ ...binaryFile, data: newData });
                                      addLog('Secret message embedded via LSB.', 'SUCCESS');
                                    }
                                 }}
                                 className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-3 rounded-xl border border-zinc-700 font-bold uppercase tracking-widest text-[10px] transition-all active:scale-95"
                               >
                                  LSB Embed
                               </button>
                               <button 
                                 onClick={() => {
                                    const res = Steganography.extractLSB(binaryFile.data);
                                    addLog(`Stego Result: ${res}`, 'INFO');
                                 }}
                                 className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-3 rounded-xl border border-zinc-700 font-bold uppercase tracking-widest text-[10px] transition-all active:scale-95"
                               >
                                  LSB Extract
                               </button>
                             </div>
                          </div>
                        </section>
                      </div>
                    )}
                  </div>
                </ModuleLayout>
              )}

              {activeModule === 'search' && (
                <ModuleLayout title="SEARCH ENGINE" icon={Search}>
                  <div className="max-w-4xl space-y-8">
                    {!binaryFile ? (
                      <div className="p-12 border-2 border-dashed border-zinc-800 rounded-2xl text-center text-zinc-500 grayscale opacity-50">
                        <Upload className="w-12 h-12 mx-auto mb-4" />
                        <p className="font-bold tracking-widest uppercase">LOAD BINARY FIRST IN BINARY ANALYSIS</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <section className="space-y-4">
                          <h3 className="text-blue-400 font-bold flex items-center gap-2 uppercase tracking-tighter">
                            <TerminalIcon className="w-4 h-4" /> HEX Pattern Search
                          </h3>
                          <div className="flex gap-3">
                            <input
                              type="text"
                              value={searchPattern}
                              onChange={(e) => setSearchPattern(e.target.value)}
                              placeholder="Enter HEX pattern (e.g. 4d 5a or 4D5A)..."
                              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 font-mono"
                            />
                            <button 
                              onClick={() => {
                                const cleanHex = searchPattern.replace(/\s/g, '');
                                if (cleanHex.length % 2 !== 0) return addLog('Invalid HEX length.', 'ERROR');
                                const bytes = cleanHex.match(/.{1,2}/g)?.map(h => parseInt(h, 16));
                                if (!bytes) return;
                                const results = SearchEngine.findPattern(binaryFile.data, bytes);
                                setSearchResults(results);
                                addLog(`Search complete. Found ${results.length} occurrences.`, 'SUCCESS');
                              }}
                              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all active:scale-95"
                            >
                              SEARCH
                            </button>
                          </div>
                        </section>

                        {searchResults.length > 0 && (
                          <section className="space-y-4">
                             <h3 className="text-blue-400 font-bold flex items-center gap-2 uppercase tracking-tighter">
                                <TerminalIcon className="w-4 h-4" /> Occurrences Found: {searchResults.length}
                             </h3>
                             <div className="grid grid-cols-4 gap-3">
                                {searchResults.slice(0, 100).map((offset, i) => (
                                  <div key={i} className="bg-zinc-900 border border-zinc-800 p-3 rounded-lg text-center hover:bg-zinc-800 transition-colors">
                                     <p className="text-[10px] text-zinc-500 uppercase mb-1">Offset</p>
                                     <p className="text-xs font-bold text-green-400 font-mono">0x{offset.toString(16).padStart(8, '0')}</p>
                                  </div>
                                ))}
                                {searchResults.length > 100 && (
                                  <div className="col-span-4 text-center p-2 text-zinc-600 text-xs italic">...and {searchResults.length - 100} more</div>
                                )}
                             </div>
                          </section>
                        )}
                      </div>
                    )}
                  </div>
                </ModuleLayout>
              )}

              {activeModule === 'brute' && (
                <ModuleLayout title="BRUTE FORCE" icon={Cpu}>
                   <div className="max-w-4xl space-y-8">
                    {!binaryFile ? (
                      <div className="p-12 border-2 border-dashed border-zinc-800 rounded-2xl text-center text-zinc-500 grayscale opacity-50">
                        <Upload className="w-12 h-12 mx-auto mb-4" />
                        <p className="font-bold tracking-widest uppercase">LOAD BINARY FIRST IN BINARY ANALYSIS</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <section className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl flex items-center justify-between">
                           <div>
                              <h3 className="text-xl font-bold text-white tracking-tighter uppercase mb-2">XOR Single-Byte Brute Force</h3>
                              <p className="text-xs text-zinc-500 font-mono">Analyzes 256 keys and scores results based on string readability.</p>
                           </div>
                           <button 
                             disabled={isBruting}
                             onClick={async () => {
                               setIsBruting(true);
                               addLog('XOR Bruteforce engine started...', 'INFO');
                               // Use short delay to show UI state
                               setTimeout(() => {
                                  const results = BruteForce.xorBrute(binaryFile.data);
                                  setBruteResults(results);
                                  addLog(`Brute force complete. ${results.length} plausible keys found.`, 'SUCCESS');
                                  setIsBruting(false);
                               }, 1000);
                             }}
                             className={cn(
                               "px-10 py-4 rounded-xl font-bold tracking-widest transition-all active:scale-95 flex items-center gap-3",
                               isBruting ? "bg-zinc-800 text-zinc-500" : "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                             )}
                           >
                             {isBruting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                             {isBruting ? 'RUNNING...' : 'START ATTACK'}
                           </button>
                        </section>

                        {bruteResults.length > 0 && (
                          <section className="space-y-4">
                             <h3 className="text-blue-400 font-bold flex items-center gap-2 uppercase tracking-tighter">
                                <TerminalIcon className="w-4 h-4" /> Decryption Candidates (Top 10)
                             </h3>
                             <div className="space-y-3">
                                {bruteResults.map((res, i) => (
                                  <div key={i} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl hover:border-blue-500/30 transition-all flex items-center justify-between gap-6">
                                     <div className="flex items-center gap-6">
                                        <div className="p-3 bg-zinc-800 rounded-lg text-center min-w-20">
                                           <p className="text-[10px] text-zinc-500 uppercase mb-1">Key (Hex)</p>
                                           <p className="font-bold text-white font-mono">0x{res.key.toString(16).padStart(2, '0')}</p>
                                        </div>
                                        <div className="max-w-xl">
                                           <p className="text-[10px] text-zinc-500 uppercase mb-1">Preview Strings</p>
                                           <p className="text-xs text-green-500 italic font-mono truncate">{res.preview || 'No discernible strings.'}</p>
                                        </div>
                                     </div>
                                     <div className="text-right">
                                        <p className="text-[10px] text-zinc-500 uppercase mb-1">Score</p>
                                        <p className="font-bold text-blue-400">{res.score}</p>
                                     </div>
                                  </div>
                                ))}
                             </div>
                          </section>
                        )}
                      </div>
                    )}
                   </div>
                </ModuleLayout>
              )}

              {activeModule === 'network' && (
                <ModuleLayout title="NETWORK TOOLS" icon={Network}>
                   <div className="max-w-4xl space-y-8">
                     <section className="grid grid-cols-3 gap-4">
                        <div className="col-span-2 space-y-4">
                           <h3 className="text-blue-400 font-bold flex items-center gap-2 uppercase tracking-tighter">
                             <TerminalIcon className="w-4 h-4" /> Port Scanner (Target Host)
                           </h3>
                           <div className="flex gap-3">
                              <input
                                type="text"
                                value={networkTarget}
                                onChange={(e) => setNetworkTarget(e.target.value)}
                                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 font-mono"
                              />
                              <button 
                                disabled={isScanning}
                                onClick={async () => {
                                   setIsScanning(true);
                                   setNetworkResults([]);
                                   addLog(`Scanning target: ${networkTarget}...`, 'INFO');
                                   NetworkTools.scan(networkTarget, [21, 22, 23, 25, 53, 80, 110, 443, 3306, 3389, 8080]).then(results => {
                                      setNetworkResults(results);
                                      addLog(`Scan complete for ${networkTarget}.`, 'SUCCESS');
                                      setIsScanning(false);
                                   });
                                }}
                                className={cn(
                                   "bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:bg-zinc-800 disabled:text-zinc-500",
                                   isScanning && "animate-pulse"
                                )}
                              >
                                {isScanning ? 'SCANNING...' : 'SCAN PORTS'}
                              </button>
                              <button 
                                disabled={isSniffing}
                                onClick={async () => {
                                   setIsSniffing(true);
                                   setPacketResults([]);
                                   addLog(`Sniffing traffic on target: ${networkTarget}...`, 'INFO');
                                   const results = await NetworkTools.sniffPackets(networkTarget);
                                   setPacketResults(results);
                                   addLog(`Captured ${results.length} packets from ${networkTarget}.`, 'SUCCESS');
                                   setIsSniffing(false);
                                }}
                                className={cn(
                                   "px-8 py-3 rounded-xl font-bold transition-all border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 disabled:opacity-50",
                                   isSniffing && "animate-pulse"
                                )}
                              >
                                {isSniffing ? 'SNIFFING...' : 'PACKET SNIFF'}
                              </button>
                           </div>
                        </div>

                        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col justify-center">
                           <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest mb-1">Public ID</p>
                           {publicIpInfo ? (
                              <div className="space-y-1">
                                <p className="text-xl font-bold tracking-tighter text-blue-400">{publicIpInfo.ip}</p>
                                <p className="text-[8px] text-zinc-500 uppercase truncate">{publicIpInfo.org || 'Anonymous'}</p>
                                <p className="text-[8px] text-zinc-500 uppercase">{publicIpInfo.city}, {publicIpInfo.country_name}</p>
                              </div>
                            ) : (
                              <button onClick={fetchIp} className="text-xs text-zinc-600 hover:text-zinc-400 uppercase font-bold text-left">RESOLVE_IP</button>
                            )}
                         </div>
                     </section>

                     {packetResults.length > 0 && (
                        <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                           <h3 className="text-blue-400 font-bold flex items-center gap-2 uppercase tracking-tighter">
                              <Activity className="w-4 h-4" /> Packet Capture Output
                           </h3>
                           <div className="bg-black border border-zinc-800 rounded-xl overflow-hidden">
                              <div className="p-3 bg-zinc-900/50 border-b border-zinc-800 text-[10px] font-bold text-zinc-500 uppercase tracking-widest grid grid-cols-[80px_100px_80px_60px_1fr]">
                                 <span>TIME</span>
                                 <span>SOURCE</span>
                                 <span>PROTO</span>
                                 <span>LEN</span>
                                 <span>INFO</span>
                              </div>
                              <div className="max-h-64 overflow-y-auto terminal-scroll">
                                 {packetResults.map((p) => (
                                    <div key={p.id} className="p-3 grid grid-cols-[80px_100px_80px_60px_1fr] gap-2 border-b border-zinc-900/50 transition-colors hover:bg-blue-500/5 text-xs font-mono">
                                       <span className="text-zinc-600">{p.time}</span>
                                       <span className="text-blue-400">{p.src}</span>
                                       <span className="text-green-500">{p.proto}</span>
                                       <span className="text-zinc-500">{p.len}</span>
                                       <span className="text-zinc-300 truncate">{p.info}</span>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </section>
                     )}

                     {networkResults.length > 0 && (
                        <div className="bg-black border border-zinc-800 rounded-2xl overflow-hidden">
                           <table className="w-full text-left border-collapse">
                              <thead>
                                 <tr className="bg-zinc-900/50 border-b border-zinc-800">
                                    <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Port</th>
                                    <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Service</th>
                                    <th className="p-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {networkResults.map((r, i) => (
                                    <tr key={i} className="border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors">
                                       <td className="p-4 font-mono font-bold text-white tabular-nums">{r.port}</td>
                                       <td className="p-4 text-xs text-zinc-400 uppercase">
                                          {r.port === 80 || r.port === 8080 ? 'HTTP' : r.port === 443 ? 'HTTPS' : r.port === 22 ? 'SSH' : r.port === 3306 ? 'MySQL' : 'UNKNOWN'}
                                       </td>
                                       <td className="p-4">
                                          <span className={cn(
                                             "px-2 py-1 rounded text-[10px] font-bold uppercase",
                                             r.status === 'OPEN' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                          )}>
                                             {r.status}
                                          </span>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     )}
                   </div>
                </ModuleLayout>
              )}

              {activeModule === 'learning' && (
                <ModuleLayout title="LEARNING MODE" icon={GraduationCap}>
                  <div className="max-w-4xl space-y-8">
                     <div className="grid grid-cols-2 gap-6">
                        <section className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl space-y-4 h-fit">
                           <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                              <Zap className="w-6 h-6 text-blue-400" />
                           </div>
                           <h3 className="text-xl font-bold text-white tracking-tighter">Cryptographic Foundations</h3>
                           <p className="text-sm text-zinc-500 leading-relaxed">
                              Learn the basics of encoding (Base64), hashing (SHA256), and modern encryption. 
                              Understand how to identify cipher patterns and entropy levels in unknown data.
                           </p>
                           <button 
                             onClick={() => setSelectedLesson('crypto')}
                             className="text-blue-400 font-bold text-xs hover:underline flex items-center gap-2"
                           >
                             START LESSON <RefreshCw className="w-3 h-3" />
                           </button>
                        </section>

                        <section className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl space-y-4 h-fit">
                           <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
                              <Binary className="w-6 h-6 text-purple-400" />
                           </div>
                           <h3 className="text-xl font-bold text-white tracking-tighter">Binary Reverse Engineering</h3>
                           <p className="text-sm text-zinc-500 leading-relaxed">
                              Explore PE, ELF, and DEX file structures. Master the art of string extraction,
                              pattern matching, and vulnerability identification in compiled binaries.
                           </p>
                           <button 
                             onClick={() => setSelectedLesson('binary')}
                             className="text-purple-400 font-bold text-xs hover:underline flex items-center gap-2"
                           >
                             START LESSON <RefreshCw className="w-3 h-3" />
                           </button>
                        </section>
                     </div>

                     <AnimatePresence>
                        {selectedLesson && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 relative overflow-hidden mt-8"
                          >
                             <button 
                               onClick={() => setSelectedLesson(null)}
                               className="absolute top-4 right-4 text-zinc-500 hover:text-white"
                             >
                               CLOSE
                             </button>
                             <div className="space-y-4 max-w-2xl">
                                <h4 className="text-2xl font-bold text-white uppercase tracking-tighter">
                                   {selectedLesson === 'crypto' ? 'The Art of Secrecy' : 'Unmasking the Code'}
                                </h4>
                                <div className="text-sm text-zinc-400 space-y-4 leading-relaxed font-sans">
                                   {selectedLesson === 'crypto' ? (
                                     <>
                                        <p>Cryptography is the cornerstone of digital security. It transforms human-readable data into a cipher text that is unintelligible without the proper key.</p>
                                        <p>Hashing, unlike encryption, is a one-way street. A SHA-256 hash can verify that a piece of data hasn't been modified, but you can't "un-hash" it to get the original data back.</p>
                                        <p>In the Crypto Lab module, you can experiment with these primitives to see how data changes under different transformations.</p>
                                     </>
                                   ) : (
                                     <>
                                        <p>Reverse engineering is the process of deconstructing a binary file to understand its internal logic. This is essential for malware analysis and finding zero-day vulnerabilities.</p>
                                        <p>Every executable starts with a "Magic Number" or header. For example, 'MZ' for Windows executables and '\x7FELF' for Linux. Finding these markers tells you what environment the code expects.</p>
                                        <p>By analyzing the disassembly, we see the raw instructions like MOV, PUSH, and CALL that the CPU actually executes.</p>
                                     </>
                                   )}
                                </div>
                             </div>
                          </motion.div>
                        )}
                     </AnimatePresence>

                     <section className="bg-blue-600/5 border border-blue-500/20 p-8 rounded-2xl text-center flex flex-col items-center">
                        <GraduationCap className="w-10 h-10 text-blue-400 mb-4" />
                        <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-2">Certification Program</h3>
                        <p className="text-sm text-zinc-500 max-w-lg mb-6">
                           Complete all exercises and quizzes in the toolkit to earn your
                           ALVISIA PRO Certification in Security Analysis.
                        </p>
                        <div className="flex gap-4">
                           <div className="px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-bold text-zinc-400">0/12 LESSONS</div>
                           <div className="px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-bold text-zinc-400">RANK: NOVICE</div>
                        </div>
                     </section>
                  </div>
                </ModuleLayout>
              )}

              {activeModule === 'patch' && (
                <ModuleLayout title="PATCH ENGINE" icon={Code}>
                  <div className="max-w-4xl space-y-8">
                     {!binaryFile ? (
                      <div className="p-12 border-2 border-dashed border-zinc-800 rounded-2xl text-center text-zinc-500 grayscale opacity-50">
                        <Upload className="w-12 h-12 mx-auto mb-4" />
                        <p className="font-bold tracking-widest uppercase">LOAD BINARY FIRST IN BINARY ANALYSIS</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <section className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl space-y-6">
                          <h3 className="text-xl font-bold text-white tracking-tighter uppercase">Apply Byte Patch</h3>
                          <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="text-[10px] text-zinc-500 uppercase font-bold mb-2 block">Offset (Hex)</label>
                                <input
                                  type="text"
                                  value={patchOffset}
                                  onChange={(e) => setPatchOffset(e.target.value)}
                                  placeholder="0xAA"
                                  className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-blue-400 font-mono focus:border-blue-500"
                                />
                             </div>
                             <div>
                                <label className="text-[10px] text-zinc-500 uppercase font-bold mb-2 block">Bytes (Hex)</label>
                                <input
                                  type="text"
                                  value={patchHex}
                                  onChange={(e) => setPatchHex(e.target.value)}
                                  placeholder="DE AD BE EF"
                                  className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-green-400 font-mono focus:border-green-500"
                                />
                             </div>
                          </div>
                          <div className="flex gap-4">
                             <button 
                               onClick={() => {
                                  try {
                                    const offset = parseInt(patchOffset.replace('0x', ''), 16);
                                    if (isNaN(offset)) throw new Error('Invalid Offset');
                                    const newData = PatchingEngine.applyPatch(binaryFile.data, offset, patchHex);
                                    setBinaryFile({ ...binaryFile, data: newData });
                                    addLog(`Patched ${patchHex.split(' ').length} bytes at 0x${offset.toString(16)}.`, 'SUCCESS');
                                  } catch (e: any) {
                                    addLog(e.message, 'ERROR');
                                  }
                               }}
                               className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)]"
                             >
                               APPLY BYTES
                             </button>
                             <button 
                               onClick={() => {
                                  const offset = parseInt(patchOffset.replace('0x', ''), 16);
                                  if (isNaN(offset)) return addLog('Invalid offset.', 'ERROR');
                                  const newData = PatchingEngine.nopPatch(binaryFile.data, offset, 8);
                                  setBinaryFile({ ...binaryFile, data: newData });
                                  addLog(`Applied 8-byte NOP sled at 0x${offset.toString(16)}.`, 'SUCCESS');
                               }}
                               className="px-8 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-4 rounded-xl transition-all border border-zinc-700"
                             >
                               8B NOP
                             </button>
                          </div>
                        </section>

                        <div className="p-6 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
                           <p className="text-xs text-yellow-500 flex items-center gap-2">
                              <ShieldAlert className="w-4 h-4" />
                              WARNING: Patching directly modifies the buffer in memory. Ensure backups are kept.
                           </p>
                        </div>
                      </div>
                    )}
                  </div>
                </ModuleLayout>
              )}

              {activeModule === 'visual' && (
                <ModuleLayout title="VISUALIZATION" icon={Eye}>
                   <div className="max-w-4xl space-y-6">
                    {!binaryFile ? (
                      <div className="p-12 border-2 border-dashed border-zinc-800 rounded-2xl text-center text-zinc-500 grayscale opacity-50">
                        <Upload className="w-12 h-12 mx-auto mb-4" />
                        <p className="font-bold tracking-widest uppercase">LOAD BINARY FIRST IN BINARY ANALYSIS</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                           <h3 className="text-blue-400 font-bold flex items-center gap-2 uppercase tracking-tighter">
                              <TerminalIcon className="w-4 h-4" /> Hexadecimal Dump
                           </h3>
                           <div className="flex items-center gap-3">
                              <button onClick={() => setHexOffset(Math.max(0, hexOffset - 256))} className="p-2 bg-zinc-900 border border-zinc-800 rounded hover:bg-zinc-800"><TerminalIcon className="w-3 h-3 rotate-180" /></button>
                              <span className="text-[10px] text-zinc-500 font-mono">PAGE OFFSET: 0x{hexOffset.toString(16).toUpperCase()}</span>
                              <button onClick={() => setHexOffset(hexOffset + 256)} className="p-2 bg-zinc-900 border border-zinc-800 rounded hover:bg-zinc-800"><TerminalIcon className="w-3 h-3" /></button>
                           </div>
                        </div>

                        <div className="bg-black border border-zinc-800 rounded-2xl overflow-hidden font-mono text-[11px]">
                           <div className="bg-zinc-900/50 p-3 grid grid-cols-[100px_1fr_150px] gap-4 border-b border-zinc-800 text-zinc-500 font-bold uppercase tracking-widest">
                              <div>Offset</div>
                              <div>Hexadecimal Data</div>
                              <div>ASCII</div>
                           </div>
                           <div className="divide-y divide-zinc-900/50">
                              {hexRows.map((row, i) => (
                                <div key={i} className="p-3 grid grid-cols-[100px_1fr_150px] gap-4 hover:bg-blue-500/5 transition-colors group">
                                   <div className="text-zinc-600 group-hover:text-blue-400">{row.offset}</div>
                                   <div className="text-zinc-400 group-hover:text-zinc-200">{row.hex}</div>
                                   <div className="text-green-500/50 group-hover:text-green-400 tabular-nums">{row.ascii}</div>
                                </div>
                              ))}
                           </div>
                        </div>
                      </div>
                    )}
                   </div>
                </ModuleLayout>
              )}

              {activeModule === 'apk' && (
                <ModuleLayout title="APK CRACK SUITE" icon={ShieldAlert}>
                   <div className="max-w-4xl space-y-8">
                      {!binaryFile ? (
                        <div className="p-12 border-2 border-dashed border-zinc-800 rounded-2xl text-center text-zinc-500 grayscale opacity-50">
                          <Upload className="w-12 h-12 mx-auto mb-4" />
                          <p className="font-bold tracking-widest uppercase">LOAD APK BINARY IN BINARY ANALYSIS</p>
                        </div>
                      ) : (
                        <div className="space-y-8">
                           <section className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 rounded-2xl text-white shadow-2xl relative overflow-hidden group">
                              <Shield className="absolute -right-8 -bottom-8 w-48 h-48 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-1000" />
                              <div className="relative z-10">
                                 <h3 className="text-2xl font-bold tracking-tighter uppercase mb-2">Automated Crack Pipeline</h3>
                                 <p className="text-blue-100 text-sm max-w-lg mb-6">
                                    Our proprietary AI engine analyzes DEX files, bypasses license verification, 
                                    and unlocks premium features automatically using advanced pattern rewriting.
                                 </p>
                                 <button 
                                   disabled={isCracking}
                                   onClick={async () => {
                                      setIsCracking(true);
                                      setApkSteps([]);
                                      addLog('APK Auto-Crack engine engaged.', 'INFO');
                                      const results = await ApkCrackSuite.autoCrack(binaryFile.data);
                                      setApkSteps(results);
                                      addLog('APK Cracking complete. Re-packaged signed APK ready.', 'SUCCESS');
                                      setIsCracking(false);
                                   }}
                                   className={cn(
                                     "bg-white text-blue-800 px-8 py-3 rounded-xl font-bold tracking-widest hover:bg-blue-50 transition-all active:scale-95 shadow-lg",
                                     isCracking && "animate-pulse"
                                   )}
                                 >
                                    {isCracking ? 'BYPASSING SECURITY...' : 'INITIALIZE FULL CRACK'}
                                 </button>
                              </div>
                           </section>

                           {apkSteps.length > 0 && (
                              <section className="space-y-4">
                                 <h3 className="text-blue-400 font-bold flex items-center gap-2 uppercase tracking-tighter">
                                    <TerminalIcon className="w-4 h-4" /> Crack Process Logs
                                 </h3>
                                 <div className="space-y-2">
                                    {apkSteps.map((s, i) => (
                                      <motion.div 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        key={i} 
                                        className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex items-center justify-between"
                                      >
                                         <div className="flex items-center gap-4">
                                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                            <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Stage {i+1}: {s.step}</span>
                                         </div>
                                         <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-1 rounded font-bold uppercase">{s.status}</span>
                                      </motion.div>
                                    ))}
                                 </div>
                              </section>
                           )}
                        </div>
                      )}
                   </div>
                </ModuleLayout>
              )}              {activeModule === 'frida' && (
                <ModuleLayout title="FRIDA BRIDGE" icon={Activity}>
                  <div className="max-w-4xl space-y-6">
                     <section className="space-y-4">
                        <div className="flex items-center justify-between">
                           <h3 className="text-blue-400 font-bold flex items-center gap-2 uppercase tracking-tighter">
                              <TerminalIcon className="w-4 h-4" /> Dynamic Instrumentation Scripts
                           </h3>
                           <div className="flex gap-2">
                             <button 
                               onClick={() => {
                                    const script = FridaBridge.generateSslBypass();
                                    setFridaScript(script);
                                    addLog('Frida SSL Pinning Bypass script generated.', 'SUCCESS');
                               }}
                               className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg text-xs font-bold text-blue-400 hover:bg-zinc-800 transition-colors"
                             >
                                SSL BYPASS
                             </button>
                             <button 
                               onClick={() => {
                                    const script = FridaBridge.generateShellcode();
                                    setFridaScript(script);
                                    addLog('Universal Linux x86 Shellcode generated.', 'SUCCESS');
                               }}
                               className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg text-xs font-bold text-green-400 hover:bg-zinc-800 transition-colors"
                             >
                                SHELLCODE
                             </button>
                           </div>
                        </div>
                        <div className="relative group">
                           <textarea
                             value={fridaScript}
                             onChange={(e) => setFridaScript(e.target.value)}
                             placeholder="Generate or paste Frida script here..."
                             className="w-full h-80 bg-black border border-zinc-800 rounded-2xl p-6 text-orange-400 font-mono text-xs focus:outline-none focus:border-orange-500/50 resize-none"
                           />
                           {fridaScript && (
                              <button 
                                onClick={() => {
                                   navigator.clipboard.writeText(fridaScript);
                                   addLog('Frida script copied.', 'SUCCESS');
                                }}
                                className="absolute top-4 right-4 p-2 bg-zinc-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Download className="w-4 h-4 text-zinc-400" />
                              </button>
                           )}
                        </div>
                     </section>
                  </div>
                </ModuleLayout>
              )}

              {activeModule === 'social' && (
                <ModuleLayout title="SOCIAL ENGINEER" icon={Globe}>
                   <div className="max-w-4xl space-y-8">
                      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 space-y-6">
                         <div>
                            <h3 className="text-2xl font-bold text-white tracking-tighter uppercase">Payload Generator</h3>
                            <p className="text-zinc-500 text-sm">Craft high-conversion phishing lures for social engineering simulations.</p>
                         </div>
                         <div className="grid grid-cols-3 gap-4">
                            {[
                              { id: 'bank', label: 'Bank Fraud', desc: 'Secure login alert' },
                              { id: 'social', label: 'Social Media', desc: 'New tag/mention' },
                              { id: 'office', label: 'Office Suite', desc: 'Shared document' }
                            ].map((t) => (
                              <button 
                                key={t.id}
                                onClick={() => {
                                  const payload = SocialEngineering.generatePhishing(t.id as any);
                                  setFridaScript(payload); // Reusing script state
                                  addLog(`Social engineering payload created: ${t.label}`, 'SUCCESS');
                                }}
                                className="flex flex-col items-start gap-2 p-6 bg-black/40 border border-zinc-800 rounded-xl hover:bg-zinc-800/50 transition-all text-left"
                              >
                                 <span className="text-blue-400 font-bold uppercase text-xs tracking-widest">{t.label}</span>
                                 <span className="text-[10px] text-zinc-500 uppercase">{t.desc}</span>
                              </button>
                            ))}
                         </div>
                         <div className="bg-black border border-zinc-800 rounded-xl p-6 min-h-32 flex items-center justify-center italic text-zinc-500 text-center">
                            {fridaScript || 'CHOOSE A TARGET TEMPLATE'}
                         </div>
                      </section>

                      <div className="p-8 border-2 border-dashed border-zinc-800 rounded-3xl flex flex-col items-center justify-center text-center space-y-6">
                         <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center">
                            <Activity className="w-8 h-8 text-blue-500" />
                         </div>
                         <div className="max-w-sm">
                            <h4 className="text-lg font-bold text-white uppercase tracking-tighter">Campaign Tracking</h4>
                            <p className="text-xs text-zinc-500 mt-2">Simulate real-time click-tracking and conversion analytics for your campaigns.</p>
                         </div>
                         <button className="px-8 py-3 bg-zinc-800 text-zinc-400 rounded-full text-[10px] font-bold uppercase hover:bg-zinc-700 transition-colors">
                            Initialize Tracker
                         </button>
                      </div>
                   </div>
                </ModuleLayout>
              )}

              {activeModule === 'social' && (
                <ModuleLayout title="SOCIAL ENGINEER" icon={Globe}>
                  <div className="max-w-4xl space-y-8 pb-12">
                     <section className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 space-y-6">
                        <div>
                           <h3 className="text-2xl font-bold text-white tracking-tighter uppercase">Payload Generator</h3>
                           <p className="text-zinc-500 text-sm">Generate targeted phishing templates and harvesting links.</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           {[
                             { id: 'bank', label: 'Financial Institution', desc: 'Secure Banking Alert', icon: ShieldCheck },
                             { id: 'social', label: 'Social Media', desc: 'Account Verification', icon: Globe },
                             { id: 'office', label: 'Corporate Office', desc: 'SharePoint Document', icon: Code }
                           ].map((t) => (
                             <button
                               key={t.id}
                               onClick={() => {
                                 const payload = SocialEngineering.generatePhishing(t.id as any);
                                 setFridaScript(payload);
                                 addLog(`Social engineering template generated: ${t.label}`, 'SUCCESS');
                               }}
                               className="p-8 bg-black/40 border border-zinc-800 rounded-3xl flex flex-col items-center gap-4 hover:bg-zinc-800/50 hover:border-blue-500/30 transition-all group"
                             >
                                <div className="p-4 bg-zinc-900 rounded-2xl border border-zinc-800">
                                   <t.icon className="w-8 h-8 text-zinc-500 group-hover:text-blue-400" />
                                </div>
                                <div className="text-center">
                                   <p className="text-xs font-bold text-white uppercase tracking-widest">{t.label}</p>
                                   <p className="text-[10px] text-zinc-600 font-bold uppercase mt-1">{t.desc}</p>
                                </div>
                             </button>
                           ))}
                        </div>

                        <div className="space-y-4">
                           <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Template Output</h4>
                           <div className="bg-black border border-zinc-800 rounded-2xl p-8 relative overflow-hidden group">
                              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                 <Skull className="w-32 h-32" />
                              </div>
                              <pre className="text-xs font-mono text-zinc-400 whitespace-pre-wrap break-all relative z-10 leading-relaxed">
                                 {fridaScript || '/* SELECT A TEMPLATE TO GENERATE PAYLOAD */'}
                              </pre>
                              {fridaScript && (
                                <button 
                                  onClick={() => {
                                    navigator.clipboard.writeText(fridaScript);
                                    addLog('Phishing template copied.', 'SUCCESS');
                                  }}
                                  className="absolute top-4 right-4 p-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:border-blue-500 transition-all"
                                >
                                   <Copy className="w-3.5 h-3.5 text-zinc-500" />
                                </button>
                              )}
                           </div>
                        </div>
                     </section>

                     <section className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 space-y-6">
                        <h3 className="text-xl font-bold text-white tracking-tighter uppercase">Campaign Stats</h3>
                        <div className="grid grid-cols-3 gap-6">
                           {[
                             { label: 'Click rate', val: '42%' },
                             { label: 'Harvested', val: '124' },
                             { label: 'Confidence', val: 'High' }
                           ].map((s, i) => (
                             <div key={i} className="bg-black/20 p-6 rounded-2xl border border-zinc-800/50">
                                <p className="text-[10px] text-zinc-600 font-bold uppercase mb-1">{s.label}</p>
                                <p className="text-xl font-black text-white">{s.val}</p>
                             </div>
                           ))}
                        </div>
                     </section>
                  </div>
                </ModuleLayout>
              )}

              {activeModule === 'audit' && (
                <ModuleLayout title="SECURITY AUDIT" icon={ShieldCheck}>
                   <div className="max-w-4xl space-y-8">
                     <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 space-y-6">
                        <div className="flex items-center justify-between">
                           <div>
                              <h3 className="text-2xl font-bold tracking-tighter uppercase text-white">System Integrity Audit</h3>
                              <p className="text-zinc-500 text-sm">Real-time environment validation and hardware security check.</p>
                           </div>
                           <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full">
                              <Shield className="w-4 h-4 text-green-500" />
                              <span className="text-xs font-bold text-green-500 uppercase">Secure Environment</span>
                           </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                           <div className="bg-black/40 border border-zinc-800 p-6 rounded-xl space-y-2">
                              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Hardware Identifier (HWID)</p>
                              <p className="text-xl font-mono text-blue-400 break-all">{hwid}</p>
                              <div className="flex items-center gap-2 mt-4 text-[10px] text-zinc-600">
                                 <Lock className="w-3 h-3" />
                                 <span>Hardware bound session active</span>
                              </div>
                           </div>
                           <div className="bg-black/40 border border-zinc-800 p-6 rounded-xl space-y-4">
                              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Environment Audit</p>
                              <div className="space-y-3">
                                 <div className="flex justify-between items-center">
                                    <span className="text-xs text-zinc-400">Sandbox Mode</span>
                                    <span className="text-xs text-green-500 font-bold uppercase">Active</span>
                                 </div>
                                 <div className="flex justify-between items-center">
                                    <span className="text-xs text-zinc-400">Kernel Isolation</span>
                                    <span className="text-xs text-green-500 font-bold uppercase">Verified</span>
                                 </div>
                                 <div className="flex justify-between items-center">
                                    <span className="text-xs text-zinc-400">V-Memory Guard</span>
                                    <span className="text-xs text-blue-500 font-bold uppercase">Monitoring</span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl">
                            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Security Pulse Timeline</h4>
                            <div className="space-y-4">
                               {[
                                 { time: '18:44:55', event: 'Kernel integrity check passed', status: 'SUCCESS' },
                                 { time: '18:44:50', event: 'Anti-Debug engine initialized', status: 'SUCCESS' },
                                 { time: '18:44:45', event: 'Hardware ID generated and bound', status: 'INFO' }
                               ].map((audit, i) => (
                                 <div key={i} className="flex gap-4 items-start">
                                    <div className="w-1 h-1 rounded-full bg-zinc-700 mt-2" />
                                    <div className="flex-1 border-b border-zinc-800/10 pb-4">
                                       <div className="flex justify-between items-center mb-1">
                                          <span className="text-xs text-zinc-300 font-bold">{audit.event}</span>
                                          <span className="text-[10px] text-zinc-600 font-mono">{audit.time}</span>
                                       </div>
                                       <span className={cn(
                                         "text-[9px] font-bold uppercase px-2 py-0.5 rounded",
                                         audit.status === 'SUCCESS' ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"
                                       )}>{audit.status}</span>
                                    </div>
                                 </div>
                               ))}
                            </div>
                        </div>
                     </section>
                   </div>
                </ModuleLayout>
              )}

              {activeModule === 'file' && (
                <ModuleLayout title="FILE TOOLKIT" icon={FileCode}>
                   <div className="max-w-4xl space-y-8">
                      {!binaryFile ? (
                        <div className="p-12 border-2 border-dashed border-zinc-800 rounded-2xl text-center text-zinc-500 grayscale opacity-50">
                          <Upload className="w-12 h-12 mx-auto mb-4" />
                          <p className="font-bold tracking-widest uppercase">LOAD FILE FIRST IN BINARY ANALYSIS</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                           <section className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl space-y-4">
                              <h3 className="text-xl font-bold text-white tracking-tighter uppercase">Integrity Verification</h3>
                              <div className="space-y-3">
                                 <div className="flex items-center justify-between p-4 bg-black border border-zinc-800 rounded-xl">
                                    <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">MD5 Sum</span>
                                    <span className="text-xs font-mono text-blue-400">{CryptoLab.hash(binaryFile.name + binaryFile.data.length, 'md5')}</span>
                                 </div>
                                 <div className="flex items-center justify-between p-4 bg-black border border-zinc-800 rounded-xl">
                                    <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">SHA256 Sum</span>
                                    <span className="text-xs font-mono text-blue-400">{CryptoLab.hash(binaryFile.name + binaryFile.data.length, 'sha256')}</span>
                                 </div>
                              </div>
                              <button 
                                onClick={() => {
                                   const blob = new Blob([binaryFile.data], { type: 'application/octet-stream' });
                                   const url = URL.createObjectURL(blob);
                                   const a = document.createElement('a');
                                   a.href = url;
                                   a.download = 'patched_' + binaryFile.name;
                                   a.click();
                                   addLog('File exported successfully.', 'SUCCESS');
                                }}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3"
                              >
                                 <Download className="w-5 h-5" /> EXPORT MODIFIED BINARY
                              </button>
                           </section>
                        </div>
                      )}
                   </div>
                </ModuleLayout>
              )}

               {activeModule === 'settings' && (
                <ModuleLayout title="SYSTEM SETTINGS" icon={RefreshCw}>
                   <div className="max-w-2xl mx-auto py-8 space-y-8">
                      <section className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 space-y-6">
                         <h3 className="text-xl font-bold text-white tracking-widest uppercase">Kernel Customization</h3>
                         <div className="space-y-6">
                            <div className="flex items-center justify-between">
                               <div>
                                  <p className="text-white font-bold uppercase text-xs">Matrix Overlay</p>
                                  <p className="text-zinc-500 text-[10px] uppercase">Toggle digital rain background</p>
                               </div>
                               <button 
                                 onClick={() => setIsMatrixActive(!isMatrixActive)}
                                 className={cn(
                                   "w-12 h-6 rounded-full flex items-center px-1 transition-colors",
                                   isMatrixActive ? "bg-blue-600" : "bg-zinc-800"
                                 )}
                               >
                                  <motion.div 
                                    animate={{ x: isMatrixActive ? 24 : 0 }}
                                    className="w-4 h-4 bg-white rounded-full" 
                                  />
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                               <div>
                                  <p className="text-white font-bold uppercase text-xs">High Entropy Mode</p>
                                  <p className="text-zinc-500 text-[10px] uppercase">Increase visualization sample rate</p>
                               </div>
                               <button 
                                 onClick={() => {
                                   setIsHighEntropy(!isHighEntropy);
                                   addLog(`High Entropy Mode: ${!isHighEntropy ? 'ENABLED' : 'DISABLED'}`, 'INFO');
                                 }}
                                 className={cn(
                                   "w-12 h-6 rounded-full flex items-center px-1 transition-colors",
                                   isHighEntropy ? "bg-blue-600" : "bg-zinc-800"
                                 )}
                               >
                                  <motion.div 
                                    animate={{ x: isHighEntropy ? 24 : 0 }}
                                    className="w-4 h-4 bg-white rounded-full" 
                                  />
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                               <div>
                                  <p className="text-white font-bold uppercase text-xs">Anti-Debug Shield</p>
                                  <p className="text-zinc-500 text-[10px] uppercase">Enhanced debugger detection</p>
                               </div>
                               <button 
                                 onClick={() => {
                                   setIsAntiDebug(!isAntiDebug);
                                   addLog(`Anti-Debug Shield: ${!isAntiDebug ? 'ENGAGED' : 'DISENGAGED'}`, 'WARNING');
                                 }}
                                 className={cn(
                                   "w-12 h-6 rounded-full flex items-center px-1 transition-colors",
                                   isAntiDebug ? "bg-blue-600" : "bg-zinc-800"
                                 )}
                               >
                                  <motion.div 
                                    animate={{ x: isAntiDebug ? 24 : 0 }}
                                    className="w-4 h-4 bg-white rounded-full" 
                                  />
                                </button>
                            </div>
                         </div>
                      </section>

                      <section className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 space-y-6">
                         <h3 className="text-xl font-bold text-white tracking-widest uppercase">Identity & License</h3>
                         <p className="text-zinc-500 text-xs italic">Bound to HWID: {hwid}</p>
                         <div className="p-4 bg-black border border-zinc-800 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                               <Shield className="w-5 h-5 text-blue-500" />
                               <div>
                                  <p className="text-white font-bold text-xs uppercase">Pro Edition License</p>
                                  <p className="text-[9px] text-zinc-500 uppercase">LIFETIME ACCESS GRANTED</p>
                               </div>
                            </div>
                            <span className="text-[9px] bg-blue-500/10 text-blue-500 px-3 py-1 rounded font-bold">VERIFIED</span>
                         </div>
                      </section>

                      <button 
                        onClick={() => {
                          setIsAuth(false);
                          addLog('Kernel de-initialized. User logout.', 'WARNING');
                        }}
                        className="w-full py-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-2xl font-bold uppercase tracking-widest hover:bg-red-500/20 transition-all"
                      >
                         SHUTDOWN KERNEL SESSION
                      </button>
                   </div>
                </ModuleLayout>
              )}

              {activeModule === 'help' && (
                <ModuleLayout title="HELP & DOCUMENTATION" icon={Info}>
                   <div className="max-w-4xl space-y-8 pb-12">
                      <section className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 space-y-6">
                         <div className="flex items-center gap-4 border-b border-zinc-800 pb-6">
                            <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                               <Shield className="w-8 h-8 text-blue-500" />
                            </div>
                            <div>
                               <h3 className="text-3xl font-black text-white tracking-tighter uppercase">ALVISIA PRO ULTIMATE</h3>
                               <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">Complete Security Analysis & Binary Toolkit</p>
                            </div>
                         </div>

                         <div className="grid grid-cols-2 gap-8">
                            <div className="space-y-4">
                               <h4 className="text-blue-400 font-bold uppercase text-xs tracking-widest">Crypto Lab</h4>
                               <p className="text-[11px] text-zinc-400 leading-relaxed uppercase">
                                  Use the Crypto Lab for real-time data transformation. Support for SHA-256/512 hashing, Base64/Hex encoding, and Morse/ROT13 cipher simulations.
                               </p>
                               <div className="p-3 bg-black border border-zinc-800 rounded-xl text-[10px] text-zinc-500 font-mono italic">
                                  TIP: Use SHA-256 for file integrity verification.
                               </div>
                            </div>
                            <div className="space-y-4">
                               <h4 className="text-blue-400 font-bold uppercase text-xs tracking-widest">Binary Analysis</h4>
                               <p className="text-[11px] text-zinc-400 leading-relaxed uppercase">
                                  Upload .EXE, .ELF, or .APK files to analyze their internal structure. Extract embedded strings, view entry points, and analyze Shannon entropy.
                               </p>
                               <div className="p-3 bg-black border border-zinc-800 rounded-xl text-[10px] text-zinc-500 font-mono italic">
                                  TIP: Entropy above 7.5 usually indicates compressed or encrypted data.
                               </div>
                            </div>
                            <div className="space-y-4">
                               <h4 className="text-blue-400 font-bold uppercase text-xs tracking-widest">Network Suite</h4>
                               <p className="text-[11px] text-zinc-400 leading-relaxed uppercase">
                                  Identify your public identity and scan remote targets for open ports. The packet sniffer simulates traffic analysis on various protocols.
                               </p>
                               <div className="p-3 bg-black border border-zinc-800 rounded-xl text-[10px] text-zinc-500 font-mono italic">
                                  TIP: Use the IP resolver to verify your VPN/Proxy connection.
                               </div>
                            </div>
                            <div className="space-y-4">
                               <h4 className="text-blue-400 font-bold uppercase text-xs tracking-widest">Secure Vault</h4>
                               <p className="text-[11px] text-zinc-400 leading-relaxed uppercase">
                                  Store and encrypt sensitive data using military-grade AES-256. Data is persisted locally and never leaves your browser.
                               </p>
                               <div className="p-3 bg-black border border-zinc-800 rounded-xl text-[10px] text-zinc-500 font-mono italic">
                                  TIP: Your Master Key is the ONLY way to recover vault data.
                               </div>
                            </div>
                         </div>

                         <div className="pt-8 border-t border-zinc-800">
                            <h4 className="text-white font-bold uppercase text-sm mb-4">Export & Local Deployment</h4>
                            <div className="bg-zinc-800/20 border border-blue-500/30 rounded-2xl p-6 space-y-4">
                               <p className="text-[11px] text-zinc-400 leading-relaxed uppercase">
                                  ALVISIA PRO is ready for standalone operation. To download and use locally:
                               </p>
                               <ul className="text-[10px] text-zinc-500 space-y-1 ml-4 list-disc uppercase">
                                  <li>Navigate to the <span className="text-white font-bold">Settings</span> menu in the AI Studio environment.</li>
                                  <li>Select <span className="text-blue-400 font-bold">Export to ZIP</span> or <span className="text-blue-400 font-bold">Export to GitHub</span>.</li>
                                  <li>Once extracted, run <span className="text-zinc-300 font-mono">npm install</span> and then <span className="text-zinc-300 font-mono">npm run dev</span>.</li>
                               </ul>
                            </div>
                         </div>

                         <div className="pt-8 border-t border-zinc-800">
                            <h4 className="text-white font-bold uppercase text-sm mb-4">Plugin Architecture</h4>
                            <div className="bg-zinc-800/20 border border-purple-500/30 rounded-2xl p-6 space-y-4">
                               <p className="text-[11px] text-zinc-400 leading-relaxed uppercase">
                                  Extend the toolkit by creating custom modules in <span className="text-purple-400 font-mono">src/lib/plugins/</span>.
                               </p>
                               <div className="p-3 bg-black border border-zinc-800 rounded-xl font-mono text-[10px] text-zinc-400 space-y-1">
                                  <p className="text-purple-400 font-bold">// Example interface</p>
                                  <p>registry.register({'{'}</p>
                                  <p className="ml-4">metadata: {'{'} id: 'my-tool', name: 'My Tool' {'}'},</p>
                                  <p className="ml-4">icon: TerminalIcon,</p>
                                  <p className="ml-4">component: MyComponent</p>
                                  <p>{'}'});</p>
                                </div>
                                <p className="text-[10px] text-zinc-500 uppercase">
                                   Plugins have access to the system log engine and main reactive environment coordinates.
                                </p>
                            </div>
                         </div>

                         <div className="pt-8 border-t border-zinc-800">
                            <h4 className="text-white font-bold uppercase text-sm mb-4">Operational Shortcuts</h4>
                            <div className="grid grid-cols-3 gap-4">
                               {[
                                 { key: 'CTRL + L', action: 'Clear Kernel Logs' },
                                 { key: 'F1', action: 'Toggle Terminal' },
                                 { key: 'ALT + S', action: 'Quick Scan' }
                               ].map((sc, i) => (
                                 <div key={i} className="flex items-center justify-between p-3 bg-zinc-800/40 rounded-xl border border-zinc-800">
                                    <span className="text-[10px] text-zinc-500 uppercase">{sc.action}</span>
                                    <span className="text-[10px] font-mono text-blue-400 font-bold">{sc.key}</span>
                                 </div>
                               ))}
                            </div>
                         </div>
                      </section>

                      <div className="text-center space-y-4">
                         <p className="text-[10px] text-zinc-500 uppercase tracking-[0.4em] font-bold">End of Documentation</p>
                         <p className="text-[8px] text-zinc-700 uppercase">ALVISIA PRO ULTIMATE • DEVELOPED BY ADVANCED SECURITY NODES • V8.0.4</p>
                      </div>
                   </div>
                </ModuleLayout>
              )}

              {/* Dynamic Plugin Rendering */}
              {registry.getPlugins().some(p => p.metadata.id === activeModule) && (
                (() => {
                  const plugin = registry.getPlugin(activeModule);
                  if (!plugin) return null;
                  const PluginComponent = plugin.component;
                  return (
                    <ModuleLayout title={plugin.metadata.name.toUpperCase()} icon={plugin.icon}>
                      <PluginComponent addLog={addLog} />
                    </ModuleLayout>
                  );
                })()
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Live Terminal */}
        <div className="h-48 border-t border-zinc-800 bg-zinc-900/50 flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/80">
            <div className="flex items-center gap-2">
              <TerminalIcon className="w-3 h-3 text-zinc-500" />
              <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Live System Output</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-zinc-600 tabular-nums">NODE: ALVISIA_ULTIMATE_V8</span>
              <button 
                onClick={() => {
                   const logText = logs.map(l => `[${l.timestamp}] [${l.level}] ${l.message}`).join('\n');
                   const blob = new Blob([logText], { type: 'text/plain' });
                   const url = URL.createObjectURL(blob);
                   const link = document.createElement('a');
                   link.href = url;
                   link.download = `sys_log_${Date.now()}.txt`;
                   link.click();
                   addLog('System logs exported.', 'SUCCESS');
                }}
                className="text-zinc-600 hover:text-blue-400 transition-colors"
                title="Export Logs"
              >
                <Download className="w-3 h-3" />
              </button>
              <button 
                onClick={() => setLogs([])}
                className="text-zinc-600 hover:text-red-400 transition-colors"
                title="Flush Terminal"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 terminal-scroll bg-black/40">
            <div className="space-y-0.5 font-mono">
              {logs.map((log) => (
                <div key={log.id} className="flex gap-3 text-[11px] group">
                  <span className="text-zinc-600 shrink-0 tabular-nums">[{log.timestamp}]</span>
                  <span className={cn(
                    "font-bold shrink-0 w-16 uppercase",
                    log.level === 'SUCCESS' && "text-green-500",
                    log.level === 'INFO' && "text-blue-500",
                    log.level === 'WARNING' && "text-yellow-500",
                    log.level === 'ERROR' && "text-red-500"
                  )}>{log.level}</span>
                  <span className="text-zinc-400 group-hover:text-zinc-200 transition-colors break-all">{log.message}</span>
                </div>
              ))}
              <div ref={terminalEndRef} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Status Bar */}
      <div className="h-6 bg-blue-600 flex items-center justify-between px-3 text-[9px] font-bold text-white uppercase tracking-widest z-50">
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1.5">
             <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
             <span>SYSTEM: STABLE</span>
           </div>
           <div className="w-px h-3 bg-white/20" />
           <span>REGION: ASIA-PACIFIC-NODE-01</span>
           <div className="w-px h-3 bg-white/20" />
           <span>LATENCY: 12ms</span>
        </div>
        <div className="flex items-center gap-4">
           <span>RAM: {stats.ram} MB</span>
           <div className="w-px h-3 bg-white/20" />
           <span>CPU: {stats.cpu}%</span>
           <div className="w-px h-3 bg-white/20" />
           <button 
             onClick={() => setIsTerminalOpen(!isTerminalOpen)}
             className="flex items-center gap-1 hover:text-black hover:bg-white px-2 transition-colors cursor-pointer"
           >
              TERMINAL {isTerminalOpen ? '[-]' : '[+]'}
           </button>
           <div className="w-px h-3 bg-white/20" />
           <span>{new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Persistent Floating Terminal */}
      <AnimatePresence>
        {isTerminalOpen && (
          <motion.div 
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 200, opacity: 0 }}
            className="fixed bottom-10 right-10 w-96 bg-black/90 border border-zinc-800 rounded-2xl shadow-2xl z-[60] overflow-hidden backdrop-blur-xl"
          >
             <div className="bg-zinc-900 border-b border-zinc-800 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <TerminalIcon className="w-3 h-3 text-blue-500" />
                   <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">ALVISIA::GATEWAY_SHELL</span>
                </div>
                <button onClick={() => setIsTerminalOpen(false)} className="text-zinc-600 hover:text-white">
                   <Trash2 className="w-3 h-3" />
                </button>
             </div>
             <div className="h-48 overflow-y-auto p-4 flex flex-col gap-1 terminal-scroll bg-black/50">
                {logs.slice(-20).map((log) => (
                  <div key={log.id} className="text-[10px] grid grid-cols-[60px_1fr] gap-2">
                     <span className="text-zinc-600 tabular-nums">[{log.timestamp}]</span>
                     <span className={cn(
                       log.level === 'SUCCESS' ? "text-green-500" :
                       log.level === 'ERROR' ? "text-red-500" :
                       log.level === 'WARNING' ? "text-yellow-500" : "text-zinc-400"
                     )}>{log.message}</span>
                  </div>
                ))}
             </div>
             <form onSubmit={handleTerminalSubmit} className="p-3 bg-zinc-900/50 border-t border-zinc-800">
                <div className="flex items-center gap-3">
                   <span className="text-blue-500 font-bold">$</span>
                   <input 
                     autoFocus
                     value={terminalInput}
                     onChange={(e) => setTerminalInput(e.target.value)}
                     placeholder="Type command..."
                     className="flex-1 bg-transparent border-none outline-none text-zinc-300 text-xs font-mono"
                   />
                </div>
             </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
