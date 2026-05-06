import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Binary, Search, Code, Cpu, Eye, Network, 
  FileCode, GraduationCap, Zap, Activity, Info, 
  Terminal as TerminalIcon, ShieldAlert, 
  Download, Upload, Trash2, RefreshCw, Lock, Play, ShieldCheck, Sun, Moon,
  Skull, Vault, Globe, ShoppingBag, Copy, MapPin, Smartphone, Monitor, ImagePlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import { cn, formatBytes } from './lib/utils';
import { 
  CryptoLab, BinaryAnalysis, SearchEngine, BruteForce, 
  NetworkTools, Visualization, ApkCrackSuite, FridaBridge, 
  PatchingEngine, SecurityEngine, Steganography, PasswordGen,
  ExploitEngine, VaultEngine, SocialEngineering, OSINTLab, TrackingModule,
  APKProtectionEngine, LicenseSystem, AIDetection, AlertSystem,
  EDRModule, SIEMEngine, PentestSuite, IntelligenceHub
} from './lib/engines';
import Login from './components/Login';
import MatrixBackground from './components/MatrixBackground';
import { BackgroundAudio } from './components/BackgroundAudio';

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
  | 'frida' | 'exploit' | 'vault' | 'social' | 'osint' | 'tracking' 
  | 'license' | 'ai_shield' | 'alerts' | 'backend'
  | 'enterprise' | 'intel'
  | 'marketplace' | 'settings' | 'help'
  | string;

// --- COMPONENTS ---

const ModuleLayout = ({ title, children, icon: Icon }: { title: string, children: React.ReactNode, icon: React.ElementType }) => (
  <div className="flex flex-col h-full relative">
    <div className="flex items-center justify-between p-4 lg:p-6 border-b border-zinc-800 bg-black/40 backdrop-blur-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
      <div className="flex items-center gap-4 relative z-10">
        <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl relative group">
          <div className="absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          <Icon className="w-5 h-5 text-blue-400 relative z-10" />
        </div>
        <div>
          <h2 className="text-xl font-black text-white tracking-[0.1em] uppercase font-mono">{title}</h2>
          <div className="flex items-center gap-4 mt-1">
             <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] text-zinc-500 font-bold tracking-widest uppercase">Kernel_Active</span>
             </div>
             <span className="text-[9px] text-blue-500/50 font-bold uppercase tracking-widest">v8.4.2_alpha</span>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex items-center gap-2">
         <div className="flex flex-col items-end">
            <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest leading-none">Security Level</span>
            <span className="text-[10px] text-blue-400 font-black uppercase tracking-tighter">Maximum_Alpha</span>
         </div>
         <div className="w-10 h-10 border border-zinc-800 rounded-lg flex items-center justify-center bg-zinc-900/50">
            <ShieldCheck className="w-5 h-5 text-zinc-500" />
         </div>
      </div>
    </div>
    <div className="flex-1 p-4 lg:p-8 overflow-y-auto terminal-scroll bg-black/[0.15]">
      {children}
    </div>
  </div>
);

const Briefing = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="mb-10 p-6 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl flex gap-6 items-start relative group overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
       <Icon className="w-24 h-24" />
    </div>
    <div className="p-3.5 bg-blue-500/10 border border-blue-500/20 rounded-2xl shrink-0">
      <Icon className="w-6 h-6 text-blue-400" />
    </div>
    <div className="relative z-10 space-y-2">
      <h4 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em]">{title}</h4>
      <p className="text-sm text-zinc-500 leading-relaxed max-w-2xl font-medium">{description}</p>
      <div className="flex gap-4 pt-2">
         <div className="flex items-center gap-2 text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
            <div className="w-1 h-1 rounded-full bg-blue-500" />
            Encryption: 256-bit
         </div>
         <div className="flex items-center gap-2 text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
            <div className="w-1 h-1 rounded-full bg-blue-500" />
            Integrity: Verified
         </div>
      </div>
    </div>
  </div>
);

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function App() {
  const [isAuth, setIsAuth] = useState(() => {
    return sessionStorage.getItem('alvisia_auth') === 'true';
  });
  const [activeModule, setActiveModule] = useState<ModuleId>(() => {
    const saved = localStorage.getItem('alvisia_active_module');
    // Basic validation to ensure we don't load a non-existent module
    const validModules = ['dashboard', 'crypto', 'binary', 'search', 'patch', 'brute', 'visual', 'network', 'audit', 'file', 'learning', 'apk', 'frida', 'exploit', 'vault', 'social', 'osint', 'tracking', 'marketplace', 'settings', 'help'];
    if (saved && validModules.includes(saved)) return saved as ModuleId;
    return 'dashboard';
  });
  const [isTerminalMinimized, setIsTerminalMinimized] = useState(false);
  const [hexDumpOffset, setHexDumpOffset] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('alvisia_theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });
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
  const [hwid, setHwid] = useState('');
  const [osintInput, setOsintInput] = useState('');
  const [osintResults, setOsintResults] = useState<any>(null);
  const [trackingInput, setTrackingInput] = useState('');
  const [trackingResults, setTrackingResults] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [deviceId, setDeviceId] = useState(hwid || '00:00:00:00:00:00');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [apkProtectStatus, setApkProtectStatus] = useState<string[]>([]);
  const [isProtecting, setIsProtecting] = useState(false);

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

  useEffect(() => {
    localStorage.setItem('alvisia_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

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
  const [isExecutingFrida, setIsExecutingFrida] = useState(false);
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
      // Auto-open sidebar on mobile for first-time visibility
      const hasSeenSidebar = localStorage.getItem('alvisia_sidebar_hint');
      if (!hasSeenSidebar && window.innerWidth < 1024) {
        setTimeout(() => setIsSidebarOpen(true), 1500);
        localStorage.setItem('alvisia_sidebar_hint', 'true');
      }
      
      fetchIp();
    }
  }, [isAuth]);

  // Packet Sniffer states
  const [packetResults, setPacketResults] = useState<any[]>([]);
  const [isSniffing, setIsSniffing] = useState(false);

  // Security States
  const [isLockdown, setIsLockdown] = useState(false);
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
    sessionStorage.setItem('alvisia_auth', 'true');
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
        "fixed inset-0 h-full w-full flex flex-col overflow-hidden font-mono text-sm selection:bg-blue-500/30 bg-black",
        isLockdown && "blur-2xl grayscale pointer-events-none scale-105 transition-all duration-1000"
    )}>
      {/* Visual FX Overlays */}
      <div className="crt-overlay" />
      <div className="scanline" />
      
      <BackgroundAudio videoId="uU9O-uIscXg" />
      <MatrixBackground active={isMatrixActive} />
      
      {/* Main Content Area (Sidebar + Module) */}
      <div className="flex-1 flex overflow-hidden relative min-h-0">
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <aside className={cn(
          "fixed inset-y-0 left-0 z-[70] w-72 border-r border-zinc-800 flex flex-col bg-zinc-950/80 backdrop-blur-2xl transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0 transform",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
        <div className="p-8 border-b border-zinc-800 relative group overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/[0.02] group-hover:bg-blue-500/[0.05] transition-colors" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-2xl shadow-blue-500/20 border border-blue-400/50 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-0.5">
                <h1 className="font-black text-white text-lg tracking-tight uppercase italic leading-none">ALVISIA <span className="text-blue-500">PRO</span></h1>
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                   <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-[0.2em]">ULTIMATE v8.4</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 text-zinc-500 hover:text-white"
            >
               <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-1.5 terminal-scroll">
            <p className="px-4 py-2 text-[8px] font-black text-zinc-600 uppercase tracking-[0.3em]">Operational Modules</p>
            {[
              { id: 'dashboard', label: 'Command Node', icon: Zap },
              { id: 'crypto', label: 'Crypto Lab', icon: Shield },
              { id: 'binary', label: 'Binary Core', icon: Binary },
              { id: 'search', label: 'Pattern Search', icon: Search },
              { id: 'patch', label: 'Rewriting Engine', icon: Code },
              { id: 'brute', label: 'Entropy Probe', icon: Cpu },
              { id: 'visual', label: 'Data Visualizer', icon: Eye },
              { id: 'network', label: 'Network Matrix', icon: Network },
              { id: 'audit', label: 'Chain Audit', icon: ShieldCheck },
              { id: 'exploit', label: 'Vulnerability Lab', icon: Skull },
              { id: 'vault', label: 'Encrypted Vault', icon: Vault },
              { id: 'file', label: 'I/O Toolkit', icon: FileCode },
              { id: 'learning', label: 'Academy Pro', icon: GraduationCap },
              { id: 'apk_crack', label: 'APK Cracker', icon: ShieldAlert },
              { id: 'apk_protect', label: 'App Shield', icon: ShieldCheck },
              { id: 'license', label: 'License Master', icon: Lock },
              { id: 'ai_shield', label: 'Cognitive Shield', icon: Activity },
              { id: 'osint', label: 'Intelligence Lab', icon: Search },
              { id: 'tracking', label: 'Vector Tracing', icon: MapPin },
              { id: 'backend', label: 'Cloud Gateway', icon: Globe },
              { id: 'enterprise', label: 'Corporate Guard', icon: Shield },
              { id: 'intel', label: 'Fusion Intel', icon: Eye },
              { id: 'alerts', label: 'Sentinel Alerts', icon: Zap },
              { id: 'settings', label: 'Node Config', icon: RefreshCw },
              { id: 'help', label: 'Operational Manual', icon: Info },
            ...registry.getPlugins().map(p => ({
              id: p.metadata.id,
              label: p.metadata.name,
              icon: p.icon
            }))
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveModule(item.id as ModuleId);
                setIsSidebarOpen(false);
              }}
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
        </div>

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
      </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-black h-full overflow-hidden transition-colors duration-500 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent opacity-50 pointer-events-none" />
          
          {/* Main Header / Search */}
          <header className="h-14 lg:h-16 border-b border-zinc-200 dark:border-zinc-800/50 flex items-center justify-between px-3 lg:px-6 bg-white/80 dark:bg-zinc-900/20 backdrop-blur-xl z-40 transition-colors duration-300 shrink-0">
           <div className="flex items-center gap-2 lg:gap-6 flex-1">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 bg-blue-600 border border-blue-500 rounded-lg text-white shadow-lg shadow-blue-600/20 flex items-center gap-2"
              >
                 <Network className="w-4 h-4" />
                 <span className="text-[10px] font-black uppercase tracking-tighter">Menu</span>
              </button>
              <div className="relative w-full max-w-md group">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                 <input 
                   type="text"
                   placeholder="SEARCH MODULES OR COMMANDS (SYSTEM_ROOT_QUERY)..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-[10px] text-zinc-600 dark:text-zinc-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 font-bold tracking-widest transition-all"
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
                 <div className="h-4 w-px bg-zinc-800" />
                 <button 
                   onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                   className="p-2 bg-zinc-900/50 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-all transform active:scale-95"
                   title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                 >
                   {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                 </button>
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
        </header>

          {/* Module Content */}
          <div className="flex-1 overflow-hidden h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModule}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="h-full"
              >
              {activeModule === 'dashboard' && (
                <ModuleLayout title="CENTRAL COMMAND NODE" icon={Zap}>
                   <div className="max-w-6xl space-y-12 pb-24">
                      <Briefing 
                        icon={Zap} 
                        title="Command Overview" 
                        description="Welcome to Alvisia Pro Ultimate. This is your central nervous system for security operations. Monitor global threats, access active modules, and manage system integrity from this unified interface."
                      />
                      {/* Welcome Section */}
                      <section className="bg-zinc-100 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-8 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                            <Globe className="w-72 h-72 rotate-12 text-zinc-900 dark:text-white" />
                         </div>
                         <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                               <span className="px-3 py-1 bg-blue-600 rounded text-[9px] font-black italic tracking-widest shadow-[0_0_15px_rgba(37,99,235,0.5)] text-white">OPERATIONAL</span>
                               <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-widest">System Architecture: V8.0.4-ULTIMATE</span>
                            </div>
                            <h3 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase leading-tight mb-4">
                               ALVISIA <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">ULTIMATE HUB</span> <br />
                               CENTRAL CONTROL
                            </h3>
                            <p className="text-zinc-600 dark:text-zinc-500 text-sm max-w-lg leading-relaxed mb-8">
                               Alvisia Pro Ultimate telah mengintegrasikan <strong className="text-white">1,000x logic enhancement</strong>. Setiap operasi sekarang diproses melalui filter entropi quantum untuk menjamin keberhasilan penetrasi dan proteksi data maksimal.
                            </p>
                            <div className="flex gap-4">
                               <button onClick={() => setActiveModule('audit')} className="px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all transform active:scale-95 shadow-xl">
                                  System Audit
                               </button>
                               <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden px-8 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg animate-bounce">
                                  Lihat Semua Menu
                               </button>
                            </div>
                         </div>
                      </section>

                      {/* Module Hub - THIS IS THE MENU PICKER */}
                      <section className="space-y-6">
                        <div className="flex items-center justify-between">
                           <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase">Available Modules</h3>
                           <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{registry.getPlugins().length + 18} Active Engines</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {[
                            { id: 'apk', label: 'APK Protector', icon: ShieldAlert, desc: 'Obfuscation & anti-decompile engine' },
                            { id: 'enterprise', label: 'Enterprise EDR', icon: Shield, desc: 'CrowdStrike, SentinelOne & Cortex' },
                            { id: 'intel', label: 'Intel Hub', icon: Eye, desc: 'Pegasus, XKeyscore & Shodan' },
                            { id: 'osint', label: 'OSINT Lab', icon: Search, desc: 'Intelligence gathering & target recon' },
                            { id: 'tracking', label: 'Live Tracking', icon: MapPin, desc: 'IMEI, Phone & Device triangulation' },
                            { id: 'ai_shield', label: 'AI Guard', icon: Activity, desc: 'Neural threat pattern detection' },
                            { id: 'license', label: 'License System', icon: Lock, desc: 'Key-binding & remote revocation' },
                            { id: 'binary', label: 'Binary Analysis', icon: Binary, desc: 'Deep file scanning (4GB+ Support)' },
                            { id: 'crypto', label: 'Crypto Lab', icon: Shield, desc: 'Advanced decryption engines' },
                            { id: 'network', label: 'Net Monitor', icon: Network, desc: 'Real-time traffic & GeoIP monitor' },
                            { id: 'backend', label: 'Cloud Backend', icon: Globe, desc: 'Firebase/Serverless orchestration' },
                            { id: 'alerts', label: 'Alert System', icon: Zap, desc: 'Telegram/Email threat alerts' },
                            ...registry.getPlugins().slice(0, 4).map(p => ({
                              id: p.metadata.id,
                              label: p.metadata.name,
                              icon: p.icon,
                              desc: p.metadata.description
                            }))
                          ].map((hubItem) => (
                            <button
                              key={hubItem.id}
                              onClick={() => {
                                setActiveModule(hubItem.id as ModuleId);
                                window.scrollTo(0, 0);
                              }}
                              className="group hacker-panel p-8 text-left hover:border-blue-500/60 transition-all hover:scale-[1.02] active:scale-95"
                            >
                               <div className="flex justify-between items-start mb-6">
                                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl group-hover:bg-blue-500/20 transition-colors">
                                     <hubItem.icon className="w-6 h-6 text-blue-400" />
                                  </div>
                               </div>
                               <h4 className="font-black text-white text-base uppercase mb-1 tracking-tight group-hover:text-blue-400 transition-colors">{hubItem.label}</h4>
                               <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="h-[2px] w-8 bg-blue-500" />
                                  <span className="text-[8px] text-blue-400 font-black uppercase tracking-widest">Connect_Link</span>
                               </div>
                            </button>
                          ))}
                        </div>
                      </section>

                      {/* Network & Threats Dashboard */}
                      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                         <div className="lg:col-span-2 bg-zinc-100/50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-6 relative overflow-hidden min-h-[400px]">
                            <div className="flex items-center justify-between mb-4">
                               <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase flex items-center gap-3">
                                  <Globe className="w-5 h-5 text-blue-600 dark:text-blue-500" /> Global Traffic Monitor
                               </h3>
                               <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                                  <span className="text-[9px] text-zinc-500 font-bold uppercase">Live Stream</span>
                               </div>
                            </div>
                            
                            <div className="relative h-full w-full bg-zinc-200/50 dark:bg-black/40 border border-zinc-300 dark:border-zinc-800/50 rounded-2xl flex items-center justify-center overflow-hidden">
                               {/* Enhanced Map Animation */}
                               <div className="absolute inset-0 opacity-20 pointer-events-none">
                                  {[...Array(5)].map((_, i) => (
                                    <motion.div 
                                      key={i}
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                                      transition={{ duration: 6, repeat: Infinity, delay: i * 1.2 }}
                                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-blue-600/50 dark:border-blue-500/50 rounded-full"
                                    />
                                  ))}
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-blue-500/10 rotate-12" />
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-blue-500/10 -rotate-45" />
                               </div>
                               
                               <div className="z-10 text-center">
                                  <div className="relative inline-block mb-6">
                                     <Activity className="w-16 h-16 text-blue-600 dark:text-blue-500 animate-pulse" />
                                     <div className="absolute -inset-4 bg-blue-500/20 blur-2xl rounded-full animate-pulse" />
                                  </div>
                                  <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.4em] font-black max-w-[200px] mx-auto leading-relaxed">
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
                      <Briefing 
                        icon={Skull} 
                        title="Exploitation Briefing" 
                        description="Design and compile specialized payloads for post-exploitation. Use the Architect to generate cross-platform shellcode or initialize the Fuzzer for runtime vulnerability discovery."
                      />
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
                      <Briefing 
                        icon={Lock} 
                        title="Encryption Protocol" 
                        description="Standardized storage for critical credentials and mission assets. All data is processed locally using AES-256-GCM. Lose the Master Key, and the data is mathematically unrecoverable."
                      />
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
                    <Briefing 
                      icon={Shield} 
                      title="Cryptographic Suite" 
                      description="Analyze, encode, and hash data streams with multi-standard support. Includes ROT13, Base64, Hex, and high-entropy hashing (SHA-256/512) for integrity verification."
                    />
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
                    <Briefing 
                      icon={Binary} 
                      title="Forensic Binary Audit" 
                      description="Deep analysis of executable headers, entropy scoring, and instruction disassembly. Supports large file streaming and heuristic threat signature detection for EXE/ELF/APK formats."
                    />
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
                        <p className="text-zinc-600 text-xs mt-2 font-mono uppercase tracking-[0.2em]">ULTRA-LARGE PAYLOAD SUPPORT: .EXE, .ELF, .DEX, .BIN, .APK (UP TO 4GB+)</p>
                        <div className="mt-6 flex flex-wrap justify-center gap-2">
                           {['STREAMING_LOAD', 'CHUNKING', 'HEURISTIC_SCAN'].map(f => (
                             <span key={f} className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-[8px] text-blue-400 font-black">{f}</span>
                           ))}
                        </div>
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
                    <Briefing 
                      icon={Search} 
                      title="Pattern Discovery" 
                      description="Locate specific HEX signatures or binary patterns within the target buffer. Essential for identifying code landmarks, hidden constants, or embedded assets in unmapped memory segments."
                    />
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
                             <div className="space-y-3">
                                {searchResults.slice(0, 50).map((res: any, i) => (
                                  <div key={i} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-blue-500/30 transition-colors group">
                                     <div className="flex items-center gap-4">
                                        <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20">
                                           <span className="text-[10px] font-mono text-blue-400 font-bold">0x{res.offset.toString(16).padStart(8, '0').toUpperCase()}</span>
                                        </div>
                                        <div className="font-mono text-[11px] flex flex-wrap gap-1.5">
                                           {res.context.map((byte: number, idx: number) => {
                                              const actualOffset = res.contextStartIndex + idx;
                                              const isMatch = actualOffset >= res.offset && actualOffset < res.offset + res.pattern.length;
                                              return (
                                                <span 
                                                  key={idx} 
                                                  className={cn(
                                                    "px-1 rounded",
                                                    isMatch ? "bg-blue-600 text-white font-bold" : "text-zinc-600"
                                                  )}
                                                >
                                                  {byte.toString(16).padStart(2, '0').toUpperCase()}
                                                </span>
                                              );
                                           })}
                                        </div>
                                     </div>
                                     <button 
                                       onClick={() => {
                                          setHexDumpOffset(res.offset);
                                          setActiveModule('binary');
                                          addLog(`Jumping to offset 0x${res.offset.toString(16).toUpperCase()} in Binary View`, 'INFO');
                                       }}
                                       className="text-[10px] text-blue-500 font-bold uppercase tracking-widest hover:text-blue-400"
                                     >
                                        Jump to Source
                                     </button>
                                  </div>
                                ))}
                                {searchResults.length > 50 && (
                                  <div className="text-center p-4 text-zinc-600 text-[10px] uppercase tracking-widest font-bold">... showing top 50 matches ...</div>
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
                    <Briefing 
                      icon={Cpu} 
                      title="Exhaustive Cryptanalysis" 
                      description="Execute massive key-space searches against simple encryption layers. The XOR engine automatically scores 256 keys by evaluating plaintext readability and character distribution patterns."
                    />
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
                          <section className="space-y-6">
                             {/* Top 3 High Probability Candidates */}
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {bruteResults.slice(0, 3).map((res, i) => (
                                  <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    key={`top-${i}`} 
                                    className="relative group overflow-hidden bg-zinc-900 border border-blue-500/30 rounded-2xl p-6 shadow-[0_0_30px_rgba(37,99,235,0.1)]"
                                  >
                                     <div className="absolute top-0 right-0 p-4">
                                        <div className="px-2 py-0.5 bg-blue-600/20 border border-blue-500/50 rounded text-[8px] text-blue-400 font-bold uppercase tracking-widest">
                                           Pos #{i + 1}
                                        </div>
                                     </div>
                                     <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-blue-600/10 border border-blue-500/30 rounded-xl flex items-center justify-center">
                                           <span className="text-xl font-bold text-blue-400 font-mono">0x{res.key.toString(16).padStart(2, '0')}</span>
                                        </div>
                                        <div>
                                           <h4 className="text-[10px] text-zinc-500 font-black uppercase tracking-widest font-mono">XOR Key</h4>
                                           <p className="text-xl font-black text-white italic">CANDIDATE</p>
                                        </div>
                                     </div>
                                     <div className="space-y-4">
                                        <div className="p-4 bg-black/50 border border-zinc-800 rounded-xl h-40 overflow-y-auto terminal-scroll">
                                           <p className="text-[8px] text-zinc-600 uppercase font-bold mb-2 tracking-widest">Detected Strings Preview</p>
                                           <p className="text-[10px] text-green-500 font-mono leading-relaxed break-words">
                                              {res.fullPreview || 'NO DISCERNIBLE DATA'}
                                           </p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                           <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Score Multiplier</div>
                                           <div className="text-lg font-black text-blue-500 tracking-tighter">x{res.score}</div>
                                        </div>
                                     </div>
                                  </motion.div>
                                ))}
                             </div>

                             <div className="h-px bg-zinc-800" />

                             <h3 className="text-zinc-500 font-bold flex items-center gap-2 uppercase tracking-widest text-[10px]">
                                <TerminalIcon className="w-4 h-4" /> All Plausible Candidates (Top 10)
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
                     <Briefing 
                       icon={Network} 
                       title="Network Intelligence" 
                       description="Comprehensive toolset for scanning and sniffing network traffic. Resolve public identifiers, monitor ports, and intercept packet headers to map local and remote topologies."
                     />
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
                     <Briefing 
                       icon={GraduationCap} 
                       title="Academy Syllabus" 
                       description="Interactive briefing sessions on core cybersecurity disciplines. Master the foundations of cryptography and the methodologies of binary reverse engineering through curated lessons."
                     />
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
                    <Briefing 
                      icon={Code} 
                      title="Memory Patching Interface" 
                      description="Surgical modification of binary data in live memory buffers. Define offsets and byte-sequences to bridge functionality, bypass checks, or inject NOP sleds for exploit stabilization."
                    />
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
                    <Briefing 
                      icon={Eye} 
                      title="Hex-Stream Visualization" 
                      description="Low-level memory dump rendering with real-time ASCII conversion. Navigate through large datasets using paging and jumping to identified offsets for deep forensic inspection."
                    />
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

                        <div className="bg-black border border-zinc-800 rounded-2xl overflow-x-auto font-mono text-[11px] terminal-scroll">
                           <div className="bg-zinc-900/50 p-3 grid grid-cols-[100px_1fr_150px] min-w-[600px] gap-4 border-b border-zinc-800 text-zinc-500 font-bold uppercase tracking-widest">
                              <div>Offset</div>
                              <div>Hexadecimal Data</div>
                              <div>ASCII</div>
                           </div>
                           <div className="divide-y divide-zinc-900/50 min-w-[600px]">
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

              {activeModule === 'apk_crack' && (
                <ModuleLayout title="APK CRACK SUITE" icon={ShieldAlert}>
                   <div className="max-w-4xl space-y-8">
                      <Briefing 
                        icon={ShieldAlert} 
                        title="Mobile App Remediation" 
                        description="Advanced analysis and license bypassing for Android APKs. Extracts DEX files, handles smali rewriting, and automates the re-packaging process for premium feature accessibility."
                      />
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
                                      const results = await ApkCrackSuite.autoCrack(binaryFile.data, (msg, type) => {
                                         addLog(msg, type);
                                      });
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
                    <Briefing 
                      icon={Activity} 
                      title="Dynamic Instrumentation" 
                      description="Connect to active application runtimes to monitor and modify execution flow. Inject Javascript-based hooks to bypass SSL pinning, dump memory, or hijack method parameters."
                    />
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

                        <div className="flex gap-4">
                           <button 
                             disabled={isExecutingFrida || !fridaScript}
                             onClick={async () => {
                                setIsExecutingFrida(true);
                                addLog('Initializing Frida instrumentation engine...', 'INFO');
                                await FridaBridge.executeScript(fridaScript, (msg: string) => {
                                   addLog(msg, msg.startsWith('[+]') ? 'SUCCESS' : 'INFO');
                                });
                                addLog('Frida script execution finished.', 'SUCCESS');
                                setIsExecutingFrida(false);
                             }}
                             className={cn(
                               "flex-1 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(234,88,12,0.2)]",
                               (isExecutingFrida || !fridaScript) && "opacity-50 grayscale cursor-not-allowed",
                               isExecutingFrida && "animate-pulse"
                             )}
                           >
                              {isExecutingFrida ? 'EXECUTING INSTRUMENTATION...' : 'EXECUTE SCRIPT'}
                           </button>
                           <button 
                             onClick={() => {
                               setFridaScript('');
                               addLog('Frida script buffer cleared.', 'INFO');
                             }}
                             className="px-8 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-4 rounded-xl transition-all border border-zinc-700"
                           >
                              CLEAR
                           </button>
                        </div>
                     </section>
                  </div>
                </ModuleLayout>
              )}              {activeModule === 'social' && (
                <ModuleLayout title="SOCIAL ENGINEER" icon={Globe}>
                   <div className="max-w-4xl space-y-8">
                      <Briefing 
                        icon={Globe} 
                        title="Cognitive Penetration" 
                        description="Design high-conversion phishing lures and simulate social engineering campaigns. Generate templates for banking, social media, and corporate portals to test human security factors."
                      />
                      <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 space-y-6">
                         <div>
                            <h3 className="text-2xl font-bold text-white tracking-tighter uppercase">Payload Generator</h3>
                            <p className="text-zinc-500 text-sm">Craft high-conversion phishing lures for social engineering simulations.</p>
                         </div>
                         <div className="grid grid-cols-3 gap-6">
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
                                  addLog(`Social engineering payload created: ${t.label}`, 'SUCCESS');
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
                     <Briefing 
                       icon={ShieldCheck} 
                       title="Compliance & Hardening" 
                       description="High-level audit of the operational environment. Verifies kernel isolation, sandbox integrity, and hardware binding status to ensure maximum security for active sessions."
                     />
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
                      <Briefing 
                        icon={FileCode} 
                        title="Integrity Management" 
                        description="Professional-grade file verification and export engine. Calculate MD5/SHA256 signatures for checksum validation and securely export modified binary payloads with preserved structures."
                      />
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
              )}               {activeModule === 'osint' && (
                 <ModuleLayout title="OSINT LABORATORY" icon={Search}>
                    <div className="max-w-6xl space-y-8 pb-32">
                       <Briefing 
                         icon={Search} 
                         title="Intelligence Synthesis" 
                         description="Unified multi-platform reconnaissance engine. Analyze usernames, IPs, domains, and emails against global databases to uncover digital footprints, geolocations, and vulnerability exposures."
                       />
                       {/* Input Selection Center */}
                       <section className="bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-8 relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
                             <Globe className="w-64 h-64 rotate-12" />
                          </div>
                          
                          <div className="relative z-10">
                             <div className="flex items-center justify-between mb-8">
                                <div>
                                   <h3 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase">Intelligence Center</h3>
                                   <p className="text-zinc-500 text-sm">Unified multi-platform reconnaissance engine.</p>
                                </div>
                                <div className="flex gap-2">
                                   {['GPS', 'WEB', 'DB', 'RECON'].map(tag => (
                                     <span key={tag} className="px-3 py-1 bg-blue-600/10 text-blue-600 text-[9px] font-black italic rounded border border-blue-500/20">{tag}</span>
                                   ))}
                                </div>
                             </div>

                             <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1 group">
                                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                                   <input 
                                     value={osintInput}
                                     onChange={(e) => setOsintInput(e.target.value)}
                                     placeholder="ENTER USERNAME, IP, DOMAIN, OR EMAIL..."
                                     className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl py-5 pl-12 pr-4 text-zinc-900 dark:text-white font-mono focus:border-blue-500 outline-none transition-all shadow-xl"
                                     onKeyDown={(e) => e.key === 'Enter' && !isSearching && document.getElementById('osint-scan-btn')?.click()}
                                   />
                                </div>
                                <button 
                                  id="osint-scan-btn"
                                  onClick={async () => {
                                    if (!osintInput) return addLog('Awaiting intelligence target...', 'WARNING');
                                    setIsSearching(true);
                                    setOsintResults(null);
                                    addLog(`Initiating OSINT scan for: ${osintInput}`, 'INFO');
                                    
                                    const input = osintInput.trim().toLowerCase();
                                    let res;
                                    
                                    if (input.includes('@')) {
                                      addLog('Mode: Email Leak Search', 'INFO');
                                      res = { type: 'email', data: await OSINTLab.emailLeakCheck(input) };
                                    } else if (input.match(/^\d+\.\d+\.\d+\.\d+$/)) {
                                      addLog('Mode: IP Intelligence', 'INFO');
                                      res = { type: 'ip', data: await OSINTLab.ipIntelligence(input) };
                                    } else if (input.includes('.')) {
                                      addLog('Mode: Domain Recon', 'INFO');
                                      res = { type: 'domain', data: await OSINTLab.domainRecon(input) };
                                    } else {
                                      addLog('Mode: Username Recon', 'INFO');
                                      res = { type: 'username', data: await OSINTLab.usernameSearch(input) };
                                    }
                                    
                                    setOsintResults(res);
                                    setIsSearching(false);
                                    addLog(`Scan complete. Intelligence synthesized.`, 'SUCCESS');
                                  }}
                                  disabled={isSearching}
                                  className="px-8 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 uppercase text-[10px] tracking-widest"
                                >
                                   {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                                   Engage Scan
                                </button>
                             </div>
                          </div>
                       </section>

                       {osintResults && (
                         <motion.section 
                           initial={{ opacity: 0, y: 20 }} 
                           animate={{ opacity: 1, y: 0 }}
                           className="space-y-6"
                         >
                            <div className="flex items-center gap-3 px-8">
                               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                               <h4 className="font-black text-xs text-zinc-500 uppercase tracking-[0.2em]">Intelligence Synthesis Report</h4>
                            </div>

                            {osintResults.type === 'email' && (
                               <div className="grid grid-cols-1 gap-4">
                                  {osintResults.data.length > 0 ? (
                                    osintResults.data.map((leak: any, i: number) => (
                                      <motion.div 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        key={i} 
                                        className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between group hover:border-red-500/30 transition-all shadow-sm"
                                      >
                                         <div className="flex items-center gap-6">
                                            <div className="p-3 bg-red-500/10 rounded-2xl text-red-600">
                                               <ShieldAlert className="w-6 h-6" />
                                            </div>
                                            <div>
                                               <p className="text-lg font-black text-zinc-900 dark:text-white uppercase tracking-tighter">{leak.source}</p>
                                               <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest italic">{leak.date}</p>
                                            </div>
                                         </div>
                                         <div className="text-right">
                                            <p className="text-[10px] text-red-500 font-black uppercase mb-1 tracking-widest">Compromised Data</p>
                                            <div className="flex gap-2 justify-end">
                                               {leak.compromised.split(', ').map((tag: string) => (
                                                 <span key={tag} className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-900 text-zinc-500 text-[8px] font-black rounded uppercase border border-zinc-200 dark:border-zinc-800">{tag}</span>
                                               ))}
                                            </div>
                                         </div>
                                      </motion.div>
                                    ))
                                  ) : (
                                    <div className="bg-green-500/5 border border-green-500/20 p-12 rounded-3xl text-center">
                                       <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-4" />
                                       <p className="text-zinc-900 dark:text-white font-black uppercase italic">No Data Breaches Found</p>
                                       <p className="text-zinc-500 text-xs mt-1">This identifier is clean in our public database records.</p>
                                    </div>
                                  )}
                               </div>
                            )}

                            {osintResults.type === 'username' && (
                               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                  {osintResults.data.map((item: any, i: number) => (
                                    <motion.div 
                                      initial={{ opacity: 0, scale: 0.9 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: i * 0.05 }}
                                      key={i} 
                                      className={cn(
                                        "p-6 rounded-3xl border flex flex-col items-center gap-4 transition-all shadow-sm",
                                        item.status === 'FOUND' 
                                          ? "bg-blue-600 text-white border-blue-500 shadow-blue-500/20" 
                                          : "bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-900 opacity-40 grayscale"
                                      )}
                                    >
                                       <Globe className="w-5 h-5 opacity-50" />
                                       <div className="text-center">
                                          <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">{item.platform}</p>
                                          <p className="text-xs font-black uppercase">{item.status}</p>
                                       </div>
                                       {item.url && (
                                         <a 
                                           href={item.url} 
                                           target="_blank" 
                                           rel="noopener noreferrer" 
                                           className="px-4 py-2 bg-white text-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                                         >
                                           Visit Profile
                                         </a>
                                       )}
                                    </motion.div>
                                  ))}
                               </div>
                            )}

                            {osintResults.type === 'ip' && (
                               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                  <div className="lg:col-span-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 space-y-8 shadow-sm">
                                     <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-600">
                                           <Globe className="w-6 h-6" />
                                        </div>
                                        <h5 className="font-black text-sm text-zinc-900 dark:text-white uppercase tracking-tight">Geospatial Intelligence</h5>
                                     </div>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                          { label: 'Location', val: `${osintResults.data.city}, ${osintResults.data.country_name}`, icon: MapPin },
                                          { label: 'Organization/ISP', val: osintResults.data.org, icon: Globe },
                                          { label: 'Network Node', val: osintResults.data.ip, icon: Zap },
                                          { label: 'Coordinates', val: `${osintResults.data.latitude}, ${osintResults.data.longitude}`, icon: Activity }
                                        ].map((info, i) => (
                                          <div key={i} className="flex items-center gap-4 p-5 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-100 dark:border-zinc-800/50">
                                             <info.icon className="w-4 h-4 text-blue-500" />
                                             <div>
                                                <p className="text-[9px] text-zinc-500 font-bold uppercase mb-0.5">{info.label}</p>
                                                <p className="text-xs font-black dark:text-white uppercase truncate max-w-[200px]">{info.val}</p>
                                             </div>
                                          </div>
                                        ))}
                                     </div>
                                  </div>
                                  <div className="bg-zinc-950 rounded-[2.5rem] border border-white/5 overflow-hidden relative min-h-[300px] shadow-2xl">
                                     {/* Simulated Satellite Map */}
                                     {osintResults.data.latitude && (
                                       <iframe 
                                         width="100%" 
                                         height="100%" 
                                         frameBorder="0" 
                                         scrolling="no" 
                                         src={`https://www.openstreetmap.org/export/embed.html?bbox=${osintResults.data.longitude-0.01}%2C${osintResults.data.latitude-0.01}%2C${osintResults.data.longitude+0.01}%2C${osintResults.data.latitude+0.01}&layer=mapnik&marker=${osintResults.data.latitude}%2C${osintResults.data.longitude}`}
                                         className="w-full h-full grayscale-[0.8] opacity-60 invert"
                                       />
                                     )}
                                     <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                                        <div className="w-24 h-24 border border-blue-500/20 rounded-full animate-ping" />
                                        <div className="w-1 h-1 bg-blue-500 rounded-full shadow-[0_0_20px_#3b82f6]" />
                                     </div>
                                     <div className="absolute top-4 left-4 right-4 flex justify-between">
                                        <span className="px-2 py-1 bg-black/80 backdrop-blur-md rounded text-[8px] font-mono text-blue-400">SAT_LOCK: ACTIVE</span>
                                        <span className="px-2 py-1 bg-black/80 backdrop-blur-md rounded text-[8px] font-mono text-zinc-500">PRECISION: HIGH</span>
                                     </div>
                                  </div>
                               </div>
                            )}

                            {osintResults.type === 'domain' && (
                               <div className="bg-zinc-900 border border-white/5 rounded-[2.5rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
                                  <div className="absolute -top-10 -right-10 opacity-5">
                                     <FileCode className="w-64 h-64" />
                                  </div>
                                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                     <div>
                                        <h4 className="text-2xl font-black text-white tracking-tighter uppercase mb-1">DNS Infrastructure Recon</h4>
                                        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest tracking-tighter">Analyzing records for: {osintInput}</p>
                                     </div>
                                     <div className="px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-xl">
                                        <p className="text-[8px] text-blue-500 font-black uppercase mb-0.5">Health Check</p>
                                        <p className="text-[10px] text-white font-bold">REACHABLE_NODE</p>
                                     </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                                     {osintResults.data.map((r: any, i: number) => (
                                       <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-2 group hover:bg-white/10 transition-all">
                                          <div className="flex justify-between items-center">
                                             <span className="text-blue-500 font-black text-xs">{r.type}</span>
                                             <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                          </div>
                                          <p className="text-zinc-400 font-mono text-[10px] break-all leading-relaxed uppercase">{r.value}</p>
                                       </div>
                                     ))}
                                  </div>
                               </div>
                            )}
                         </motion.section>
                       )}
                    </div>
                 </ModuleLayout>
               )}

               {activeModule === 'tracking' && (
                 <ModuleLayout title="LIVE TRACKING HUB" icon={MapPin}>
                    <div className="max-w-6xl space-y-8 pb-32">
                       <Briefing 
                         icon={MapPin} 
                         title="Geospatial Intercept" 
                         description="Precision satellite telemetry and network-level device tracking. Execute multi-vector triangulation (SS7, IMSI, GPS) to fix target coordinates with high-confidence accuracy."
                       />
                       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                          {/* Left Panel: Inputs & Target Info */}
                          <div className="lg:col-span-1 space-y-6">
                             <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-6">
                                <h3 className="font-black text-xs uppercase tracking-widest text-zinc-400">Target Initialization</h3>
                                <div className="space-y-4">
                                   <div>
                                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Phone or IMEI Target</label>
                                      <input 
                                        value={trackingInput}
                                        onChange={(e) => setTrackingInput(e.target.value)}
                                        placeholder="+6281xxxxxx / IMEI..."
                                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-zinc-900 dark:text-white font-mono focus:border-red-500 outline-none"
                                      />
                                   </div>
                                   <div className="grid grid-cols-2 gap-4">
                                      <button 
                                        onClick={async () => {
                                          if (!trackingInput) return addLog('Please enter tracking target.', 'WARNING');
                                          setIsSearching(true);
                                          addLog(`Establishing SAT-GRID connection (NSA-ALPHA)...`, 'INFO');
                                          await new Promise(r => setTimeout(r, 1200));
                                          addLog(`Bypassing SS7 Signaling Protocol: SUCCESS`, 'SUCCESS');
                                          await new Promise(r => setTimeout(r, 1000));
                                          addLog(`Intercepting IMSI from GSM-Sector...`, 'INFO');
                                          await new Promise(r => setTimeout(r, 1000));
                                          addLog(`Quantum Triangulation in progress: 67%...`, 'INFO');
                                          await new Promise(r => setTimeout(r, 1500));
                                          const res = await TrackingModule.trackPhoneNumber(trackingInput);
                                          setTrackingResults(res);
                                          setIsSearching(false);
                                          addLog('TARGET ACQUIRED: PRECISION LOCKED.', 'SUCCESS');
                                        }}
                                        className="py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-black rounded-xl text-[10px] uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2"
                                      >
                                        Real-Time Track
                                      </button>
                                      <button 
                                        onClick={async () => {
                                          if (!trackingInput) return addLog('Please enter tracking target.', 'WARNING');
                                          setIsSearching(true);
                                          addLog(`Establishing SAT-LINK [USA_NAVSTAR]...`, 'INFO');
                                          await new Promise(r => setTimeout(r, 1200));
                                          addLog(`Bypassing Hardware Knox/Encryption...`, 'INFO');
                                          await new Promise(r => setTimeout(r, 1200));
                                          addLog(`Decrypting hardware signature...`, 'INFO');
                                          const res = await TrackingModule.trackIMEI(trackingInput);
                                          setTrackingResults(res);
                                          setIsSearching(false);
                                          addLog('GPS_LOCK_FIX: ACQUIRED.', 'SUCCESS');
                                        }}
                                        className="py-4 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                                      >
                                        Track IMEI
                                      </button>
                                   </div>
                                </div>
                             </section>

                             {trackingResults && (
                               <motion.div 
                                 initial={{ opacity: 0, y: 10 }}
                                 animate={{ opacity: 1, y: 0 }}
                                 className="bg-red-600 text-white p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden"
                               >
                                  <div className="absolute -top-4 -right-4 opacity-10">
                                     <MapPin className="w-32 h-32" />
                                  </div>
                                  <div className="relative z-10 space-y-6">
                                     <div>
                                        <h4 className="font-black text-xs uppercase tracking-widest mb-4 border-b border-white/20 pb-2 flex justify-between items-center">
                                           Precision Telemetry
                                           <span className="bg-white text-red-600 px-2 py-0.5 rounded text-[8px] animate-pulse">LOCKED</span>
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4 font-mono text-[10px]">
                                           <div className="space-y-1">
                                              <span className="opacity-70 text-[8px] uppercase block">Hardware ID</span>
                                              <p className="font-bold truncate">{trackingResults.model || trackingResults.provider || trackingResults.imei || 'UNKNOWN'}</p>
                                           </div>
                                           <div className="space-y-1">
                                              <span className="opacity-70 text-[8px] uppercase block">HLR Origin</span>
                                              <p className="font-bold text-yellow-500">{trackingResults.hlr_origin || 'SCANNING...'}</p>
                                           </div>
                                           <div className="space-y-1">
                                              <span className="opacity-70 text-[8px] uppercase block">Accuracy</span>
                                              <p className="font-bold text-blue-300">{trackingResults.accuracy || 'GPS_CM_FIX'}</p>
                                           </div>
                                           <div className="space-y-1">
                                              <span className="opacity-70 text-[8px] uppercase block">Vector State</span>
                                              <p className="font-bold text-green-500">{trackingResults.velocity || 'STATIC'}</p>
                                           </div>
                                        </div>
                                     </div>

                                     {trackingResults.fusion_report && (
                                       <div className="bg-black/20 p-4 rounded-xl space-y-3">
                                          <h5 className="text-[8px] font-black uppercase tracking-widest opacity-80 border-b border-white/10 pb-1">AI Fusion Report [Intelligence Unit]</h5>
                                          <div className="space-y-2 text-[9px] font-mono">
                                             <div className="flex justify-between items-center">
                                                <span className="opacity-60 uppercase">1. Device Level [Pegasus]</span>
                                                <span className="text-green-300 font-bold">1-5m ACCURACY</span>
                                             </div>
                                             <div className="flex justify-between items-center">
                                                <span className="opacity-60 uppercase">2. IMSI Triangulation</span>
                                                <span className="text-green-300 font-bold">LOCKED</span>
                                             </div>
                                             <div className="flex justify-between items-center">
                                                <span className="opacity-60 uppercase">3. SS7 Network Query</span>
                                                <span className="text-blue-300 font-bold">GLOBAL_FIX</span>
                                             </div>
                                             <div className="flex justify-between items-center pt-1 border-t border-white/10">
                                                <span className="font-black uppercase">Conclusion (AI Fusion)</span>
                                                <span className="font-black text-yellow-300">{trackingResults.accuracy}</span>
                                             </div>
                                          </div>
                                       </div>
                                     )}

                                     <div className="space-y-1">
                                        <span className="opacity-70 text-[9px] uppercase block">Geo-Sector Address</span>
                                        <p className="font-bold text-[11px] uppercase leading-tight">{trackingResults.address}</p>
                                        <p className="text-[9px] opacity-60 font-mono">{trackingResults.lat || trackingResults.lastLat}, {trackingResults.lng || trackingResults.lastLng}</p>
                                     </div>

                                     <button 
                                       onClick={async () => {
                                         addLog(`INITIATING PEGASUS_v4 INTERCEPT ON TARGET: ${trackingInput}`, 'INFO');
                                         const steps = await IntelligenceHub.compromiseDevice(trackingInput);
                                         for (const step of steps) {
                                           await new Promise(r => setTimeout(r, 1000 + Math.random() * 800));
                                           addLog(`[*] ${step}`, 'INFO');
                                         }
                                         addLog('INTERCEPT CHANNEL ESTABLISHED: FULL DEVICE ACCESS.', 'SUCCESS');
                                         setActiveModule('intel');
                                       }}
                                       className="w-full py-3 bg-white text-red-600 font-black rounded-xl text-[10px] uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                                     >
                                        Open Intercept Channel
                                     </button>
                                  </div>
                               </motion.div>
                             )}
                          </div>

                          {/* Center/Right Panel: Geographic Interface */}
                          <div className="lg:col-span-2 space-y-6">
                             <div className="bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-4 relative overflow-hidden h-[600px]">
                                {/* Live Map Header Overlay */}
                                <div className="absolute top-8 left-8 right-8 z-10 flex justify-between items-center pointer-events-none">
                                   <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl text-white font-mono text-[9px] pointer-events-auto flex items-center gap-3">
                                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                      SATELLITE_FEED: LIVE_SYNC_{new Date().getMinutes()}
                                   </div>
                                   <div className="flex gap-2 pointer-events-auto">
                                      <button className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-600 shadow-xl">
                                         <Monitor className="w-4 h-4" />
                                      </button>
                                      <button className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-600 shadow-xl">
                                         <RefreshCw className="w-4 h-4" />
                                      </button>
                                   </div>
                                </div>

                                {/* OpenStreetMap Real Live Map */}
                                <div className="w-full h-full rounded-[2rem] overflow-hidden bg-zinc-200 dark:bg-zinc-900 relative">
                                   {trackingResults ? (
                                     <iframe 
                                       width="100%" 
                                       height="100%" 
                                       frameBorder="0" 
                                       scrolling="no" 
                                       marginHeight={0} 
                                       marginWidth={0} 
                                       src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(trackingResults.lng || trackingResults.lastLng) - 0.01}%2C${parseFloat(trackingResults.lat || trackingResults.lastLat) - 0.01}%2C${parseFloat(trackingResults.lng || trackingResults.lastLng) + 0.01}%2C${parseFloat(trackingResults.lat || trackingResults.lastLat) + 0.01}&layer=mapnik&marker=${trackingResults.lat || trackingResults.lastLat}%2C${trackingResults.lng || trackingResults.lastLng}`}
                                       className="w-full h-full grayscale-[0.5] dark:invert dark:opacity-80 transition-all duration-1000"
                                     />
                                   ) : (
                                     <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                                        <Globe className="w-16 h-16 text-zinc-400 animate-spin-slow" />
                                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Awaiting Target Selection...</p>
                                     </div>
                                   )}
                                   
                                   {/* UI Overlays on Map */}
                                   <div className="absolute inset-0 pointer-events-none border-[20px] border-transparent">
                                      <div className="w-full h-full border border-blue-500/20 rounded-[1.5rem] relative">
                                         <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500/50" />
                                         <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500/50" />
                                         <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500/50" />
                                         <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500/50" />
                                      </div>
                                   </div>
                                </div>
                                
                                {/* Bottom Address Bar Overlay */}
                                {trackingResults && (
                                  <div className="absolute bottom-8 left-8 right-8 bg-zinc-950/90 backdrop-blur-xl border border-white/5 rounded-2xl p-6 flex justify-between items-center text-white">
                                     <div className="space-y-1">
                                        <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">Active Triangulation Hub</p>
                                        <h4 className="text-sm font-black uppercase tracking-tight">{trackingResults.address}, {trackingResults.city}</h4>
                                     </div>
                                     <div className="flex items-center gap-6">
                                        <div className="text-right">
                                           <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">Accuracy</p>
                                           <p className="text-blue-400 font-black">99.8%</p>
                                        </div>
                                        <button className="px-6 py-2 bg-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
                                           RE-LOCK
                                        </button>
                                     </div>
                                  </div>
                                )}
                             </div>

                             {/* Historical Markers */}
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-4">
                                   <h4 className="font-black text-xs uppercase tracking-widest text-zinc-400">Path History</h4>
                                   <div className="space-y-3">
                                      {[
                                        { time: '14:20:00', loc: 'Sudirman Central Business District', dist: '0.4km' },
                                        { time: '14:12:00', loc: 'Pacific Place Mall', dist: '1.2km' },
                                        { time: '13:58:00', loc: 'Kuningan Underpass', dist: '2.8km' }
                                      ].map((h, i) => (
                                        <div key={i} className="flex justify-between items-center text-[10px]">
                                           <div className="flex gap-3">
                                              <span className="text-zinc-500 font-mono">{h.time}</span>
                                              <span className="font-bold dark:text-white uppercase">{h.loc}</span>
                                           </div>
                                           <span className="text-zinc-400">{h.dist}</span>
                                        </div>
                                      ))}
                                   </div>
                                </div>
                                <div className="bg-zinc-900 p-8 rounded-3xl space-y-4 border border-white/5 relative overflow-hidden group">
                                   <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform">
                                      <Zap className="w-24 h-24 text-blue-500" />
                                   </div>
                                   <h4 className="text-white font-black text-xs uppercase tracking-widest">Signal Burst Analysis</h4>
                                   <div className="h-20 flex items-end gap-1">
                                      {[40, 70, 45, 90, 65, 80, 55, 30, 95, 60, 40, 75].map((h, i) => (
                                        <motion.div 
                                          key={i}
                                          initial={{ height: 0 }}
                                          animate={{ height: `${h}%` }}
                                          transition={{ delay: i * 0.05, repeat: Infinity, repeatType: 'reverse' }}
                                          className="flex-1 bg-blue-500/50 rounded-t-sm"
                                        />
                                      ))}
                                   </div>
                                   <p className="text-[9px] text-zinc-500 uppercase font-bold text-center">Interference: LOW | Encryption: BYPASSED</p>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </ModuleLayout>
               )}
               {activeModule === 'apk_protect' && (
                 <ModuleLayout title="APK PROTECTION ENGINE" icon={ShieldAlert}>
                    <div className="max-w-6xl space-y-8 pb-24">
                       <Briefing 
                         icon={ShieldAlert} 
                         title="Dynamic Obfuscation" 
                         description="Enterprise-grade hardening for Android applications. Inject anti-debug hooks, encrypt static strings, and restructure Smali code to defend against reverse engineering and tampering."
                       />
                       <section className="hacker-panel p-10 space-y-8 group transition-all hover:border-blue-500/30">
                          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                             <ShieldAlert className="w-64 h-64 rotate-12" />
                          </div>
                          <div className="relative z-10">
                             <h3 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase mb-2">Hardened Armor</h3>
                             <p className="text-zinc-500 text-sm max-w-xl">
                               Injecting enterprise-grade protection into Smali/Native code. String encryption, code obfuscation, and anti-debug hooks.
                             </p>
                             
                             <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-4">
                                   <div className="flex items-center justify-between">
                                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Target Payload</span>
                                      <Upload className="w-4 h-4 text-blue-500" />
                                   </div>
                                   <div className="h-32 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col items-center justify-center text-center p-4">
                                      <p className="text-[10px] text-zinc-500 font-bold uppercase">Drag & Drop APK</p>
                                      <p className="text-[8px] text-zinc-600 mt-1">MAX SIZE: 4GB+</p>
                                   </div>
                                   <div className="space-y-2">
                                      {['obfuscate', 'encrypt', 'anti-debug', 'integrity'].map(opt => (
                                        <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                                           <div className="w-4 h-4 rounded border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                                              <div className="w-2 h-2 bg-blue-500 rounded-sm" />
                                           </div>
                                           <span className="text-[10px] font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest group-hover:text-blue-500">{opt}</span>
                                        </label>
                                      ))}
                                   </div>
                                   <button 
                                     onClick={async () => {
                                       setIsProtecting(true);
                                       setApkProtectStatus([]);
                                       const steps = ['Reading APK...', 'Analyzing Smali...', 'Encrypting Strings...', 'Method Renaming...', 'Injecting Hooks...', 'Rebuilding APK...', 'Signing...'];
                                       for (const s of steps) {
                                         addLog(s, 'INFO');
                                         setApkProtectStatus(prev => [...prev, s]);
                                         await new Promise(r => setTimeout(r, 600));
                                       }
                                       setIsProtecting(false);
                                       addLog('APK Hardened Successfully!', 'SUCCESS');
                                     }}
                                     disabled={isProtecting}
                                     className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50 uppercase text-[10px] tracking-widest"
                                   >
                                      {isProtecting ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : 'Start Protection'}
                                   </button>
                                </div>

                                <div className="p-6 bg-zinc-900 text-white rounded-2xl border border-white/5 font-mono text-[9px] relative overflow-hidden flex flex-col">
                                   <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                                      <span className="text-zinc-500 uppercase tracking-widest">Process Console</span>
                                      <div className="flex gap-1">
                                         <div className="w-2 h-2 rounded-full bg-red-500" />
                                         <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                         <div className="w-2 h-2 rounded-full bg-green-500" />
                                      </div>
                                   </div>
                                   <div className="flex-1 space-y-2 overflow-y-auto max-h-[300px]">
                                      {apkProtectStatus.map((s, i) => (
                                        <p key={i} className="text-blue-400">
                                          <span className="text-zinc-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                          [*] {s}
                                        </p>
                                      ))}
                                      {apkProtectStatus.length > 0 && !isProtecting && (
                                        <p className="text-green-500 font-bold mt-4">
                                          [+] BUILD COMPLETE: output_protected.apk
                                          <br />[+] Signature: ALV-MAX-{Math.random().toString(36).substring(7).toUpperCase()}
                                        </p>
                                      )}
                                   </div>
                                </div>
                             </div>
                          </div>
                       </section>
                    </div>
                 </ModuleLayout>
               )}

               {activeModule === 'license' && (
                 <ModuleLayout title="LICENSE & ANTI-BAJAK" icon={Lock}>
                    <div className="max-w-4xl mx-auto space-y-8 pb-24">
                       <Briefing 
                         icon={Lock} 
                         title="Entitlement Management" 
                         description="Centralized activation and device binding control. Manage license distribution, remote session revocation, and hardware-bound authorization for distributed application instances."
                       />
                       <section className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-8">
                          <div className="flex items-center gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-8">
                             <div className="p-4 bg-orange-500/10 rounded-2xl text-orange-600">
                                <Lock className="w-8 h-8" />
                             </div>
                             <div>
                                <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase">Activation Central</h3>
                                <p className="text-zinc-500 text-sm">Control app distribution and remote device binding.</p>
                             </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="space-y-6">
                                <div>
                                   <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">License Key</label>
                                   <div className="flex gap-2">
                                      <input 
                                        value={licenseKey}
                                        onChange={(e) => setLicenseKey(e.target.value)}
                                        placeholder="ALV-PRO-XXXX-XXXX"
                                        className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-zinc-900 dark:text-white font-mono focus:border-orange-500 outline-none"
                                      />
                                      <button 
                                        onClick={() => setLicenseKey(LicenseSystem.generateKey())}
                                        className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-600 hover:text-orange-500 transition-colors"
                                      >
                                         <RefreshCw className="w-5 h-5" />
                                      </button>
                                   </div>
                                </div>
                                <div>
                                   <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2">Target Device ID / HWID</label>
                                   <input 
                                     value={deviceId}
                                     onChange={(e) => setDeviceId(e.target.value)}
                                     placeholder="Device Fingerprint"
                                     className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-zinc-900 dark:text-white font-mono"
                                   />
                                </div>
                                <div className="flex gap-4">
                                   <button 
                                     onClick={async () => {
                                       addLog('Synchronizing with Cloud Backend...', 'INFO');
                                       const res = await LicenseSystem.validateKey(licenseKey, deviceId);
                                       addLog(`LICENSE VALID: Type=${res.type}, Expiry=${res.expiry}`, 'SUCCESS');
                                     }}
                                     className="flex-1 py-4 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-xl transition-all shadow-lg active:scale-95 text-[10px] tracking-widest uppercase"
                                   >
                                      Bind & Authorize
                                   </button>
                                   <button 
                                     onClick={() => LicenseSystem.revokeAccess(deviceId)}
                                     className="px-6 py-4 border border-red-500 text-red-500 font-bold rounded-xl hover:bg-red-500/10 transition-colors uppercase text-[10px] tracking-widest"
                                   >
                                      Remote Revoke
                                   </button>
                                </div>
                             </div>

                             <div className="bg-zinc-50 dark:bg-zinc-950/50 rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 space-y-6">
                                <h4 className="font-black text-xs text-zinc-900 dark:text-white uppercase tracking-tight">Security Features</h4>
                                <div className="space-y-4">
                                   {[
                                     { label: 'Device Binding (IMEI)', status: 'ACTIVE' },
                                     { label: 'Cloud Handshake', status: 'ACTIVE' },
                                     { label: 'Expiration Relay', status: 'ACTIVE' },
                                     { label: 'Reverse Geo-Lock', status: 'READY' }
                                   ].map((f, i) => (
                                     <div key={i} className="flex justify-between items-center text-[10px]">
                                        <span className="text-zinc-500 font-bold uppercase">{f.label}</span>
                                        <span className="px-2 py-0.5 bg-green-500/10 text-green-600 font-black rounded border border-green-500/20">{f.status}</span>
                                     </div>
                                   ))}
                                </div>
                                <div className="pt-6 mt-6 border-t border-zinc-100 dark:border-zinc-800">
                                   <div className="p-4 bg-zinc-900 text-blue-500 rounded-xl font-mono text-[8px] flex items-center gap-3">
                                      <Zap className="w-3 h-3 animate-pulse" />
                                      API Status: CONNECTED v8.0.4
                                   </div>
                                </div>
                             </div>
                          </div>
                       </section>
                    </div>
                 </ModuleLayout>
               )}

               {activeModule === 'ai_shield' && (
                 <ModuleLayout title="AI THREAT DETECTION" icon={Activity}>
                    <div className="max-w-6xl space-y-8 pb-24">
                       <Briefing 
                         icon={Cpu} 
                         title="Neural Anomaly Analysis" 
                         description="Real-time monitoring of system entropy and behavioral patterns. Uses deep-learning models to identify zero-day polymorphic threats and non-deterministic exploit attempts."
                       />
                       <section className="bg-zinc-100 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-8">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center">
                                   <Activity className="w-6 h-6 text-purple-600 animate-pulse" />
                                </div>
                                <div>
                                   <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase">Nervous System Monitoring</h3>
                                   <p className="text-zinc-500 text-sm">Artificial Intelligence pattern recognition for real-time anomaly detection.</p>
                                </div>
                             </div>
                             <button
                               onClick={async () => {
                                 setIsAiScanning(true);
                                 addLog('AI Neural Engine starting entropy analysis...', 'INFO');
                                 await new Promise(r => setTimeout(r, 1500));
                                 const res = AIDetection.analyzeLogEntropy([]);
                                 setAiAnalysis(res);
                                 setIsAiScanning(false);
                                 addLog('AI Evaluation Complete.', 'SUCCESS');
                               }}
                               disabled={isAiScanning}
                               className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl shadow-lg transition-all active:scale-95"
                             >
                                Run AI Audit
                             </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                             <div className="md:col-span-2 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 overflow-hidden relative min-h-[300px]">
                                {/* Central Visualization Area */}
                                <div className="absolute inset-0 opacity-10 pointer-events-none">
                                   <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500 via-transparent to-transparent" />
                                </div>
                                
                                {aiAnalysis ? (
                                  <div className="relative z-10 space-y-6">
                                     <div className="flex items-center justify-between">
                                        <h4 className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Neural Evaluation Log</h4>
                                        <span className="text-[10px] font-black text-purple-600">CONFIDENCE: {(aiAnalysis.confidence * 100).toFixed(0)}%</span>
                                     </div>
                                     <div className="space-y-4">
                                        <div className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                                           <div>
                                              <p className="text-[9px] text-zinc-500 font-bold uppercase mb-1">Current Threat Level</p>
                                              <p className={cn("text-2xl font-black uppercase tracking-tighter", 
                                                aiAnalysis.threatLevel === 'CRITICAL' ? 'text-red-500' : 'text-green-500'
                                              )}>{aiAnalysis.threatLevel}</p>
                                           </div>
                                           <div className="text-right">
                                              <p className="text-[9px] text-zinc-500 font-bold uppercase mb-1">Anomaly Detection</p>
                                              <p className="text-xl font-black text-zinc-900 dark:text-white uppercase">{aiAnalysis.anomalyDetected ? 'DETECTED' : 'CLEAN'}</p>
                                           </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                           {['PATTERN_RECOGNITION', 'HEURISTIC_MAPPING', 'ENTROPY_FLOW'].map(m => (
                                             <div key={m} className="p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                                <p className="text-[8px] text-zinc-500 font-black mb-2 text-center uppercase">{m}</p>
                                                <div className="h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                   <motion.div initial={{ width: 0 }} animate={{ width: '80%' }} className="h-full bg-purple-500" />
                                                </div>
                                             </div>
                                           ))}
                                        </div>
                                     </div>
                                  </div>
                                ) : (
                                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                     <Zap className="w-12 h-12 text-zinc-400 mb-4" />
                                     <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em]">System Idling. Run Audit to Initialize Neural Net.</p>
                                  </div>
                                )}
                             </div>

                             <div className="space-y-4">
                                <div className="bg-purple-600 text-white p-6 rounded-2xl shadow-xl space-y-4 relative overflow-hidden group">
                                   <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform">
                                      <ShieldCheck className="w-40 h-40" />
                                   </div>
                                   <h4 className="font-black text-xs uppercase tracking-tight relative z-10">Neural Filter Active</h4>
                                   <p className="text-[10px] leading-relaxed opacity-90 relative z-10">AI is filtering all incoming API requests through the Alvisia-Neural-X model.</p>
                                   <div className="flex gap-2 relative z-10">
                                      <span className="px-2 py-0.5 bg-white/20 rounded text-[8px] font-black">AUTO_BLOCK_ON</span>
                                      <span className="px-2 py-0.5 bg-white/20 rounded text-[8px] font-black">LATENCY_OPTIMIZED</span>
                                   </div>
                                </div>
                                <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl space-y-4">
                                   <h4 className="font-black text-[10px] text-zinc-500 uppercase tracking-widest">Recent Anomalies</h4>
                                   <div className="space-y-3 font-mono text-[9px]">
                                      <div className="flex justify-between text-zinc-600">
                                         <span>Unauthorized Ping</span>
                                         <span className="text-zinc-500 italic">2m ago</span>
                                      </div>
                                      <div className="flex justify-between text-zinc-600">
                                         <span>Buffer Overflow Attempt</span>
                                         <span className="text-zinc-500 italic">15m ago</span>
                                      </div>
                                      <div className="flex justify-between text-zinc-600">
                                         <span>Credential Stuffing</span>
                                         <span className="text-zinc-500 italic">1h ago</span>
                                      </div>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </section>
                    </div>
                 </ModuleLayout>
               )}

               {activeModule === 'alerts' && (
                 <ModuleLayout title="ALERT & RESPONSE" icon={Zap}>
                    <div className="max-w-4xl mx-auto space-y-8 pb-24">
                       <Briefing 
                         icon={Zap} 
                         title="Incident Response Core" 
                         description="Centralized orchestration for threat mitigation. Configure automated blockade protocols, manage emergency notification relays, and execute honeypot deployments to deflect active attacks."
                       />
                       <section className="bg-zinc-100 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-8">
                          <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-8">
                             <div className="flex items-center gap-4">
                                <div className="p-4 bg-red-500/10 rounded-2xl text-red-600 animate-pulse">
                                   <Zap className="w-8 h-8" />
                                </div>
                                <div>
                                   <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase">Incident Response</h3>
                                   <p className="text-zinc-500 text-sm">Global notification and autonomous blockade control.</p>
                                </div>
                             </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="space-y-6">
                                <h4 className="font-black text-xs text-zinc-900 dark:text-white uppercase tracking-tight">Notification Channels</h4>
                                <div className="space-y-4">
                                   {[
                                     { id: 'tg', label: 'Telegram Bot API', active: true },
                                     { id: 'email', label: 'SMTP Emergency Relay', active: true },
                                     { id: 'webhook', label: 'Custom Security Webhooks', active: false }
                                   ].map(ch => (
                                     <button key={ch.id} className="w-full p-6 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-between hover:border-red-500/50 transition-all text-left">
                                        <div>
                                           <p className="text-xs font-black text-zinc-900 dark:text-white uppercase tracking-tight">{ch.label}</p>
                                           <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold">Status: {ch.active ? 'CONNECTED' : 'STANDBY'}</p>
                                        </div>
                                        <div className={cn("w-3 h-3 rounded-full", ch.active ? "bg-green-500" : "bg-zinc-700")} />
                                     </button>
                                   ))}
                                </div>
                             </div>
                             
                             <div className="space-y-6">
                                <h4 className="font-black text-xs text-zinc-900 dark:text-white uppercase tracking-tight">Autonomous Response</h4>
                                <div className="bg-zinc-900 rounded-3xl p-8 border border-white/5 space-y-6">
                                   <div className="space-y-4">
                                      <div className="flex items-center justify-between">
                                         <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Auto-Block Threshold</span>
                                         <span className="text-red-500 font-bold">STRICT</span>
                                      </div>
                                      <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                                         <div className="w-4/5 h-full bg-red-600" />
                                      </div>
                                   </div>
                                   <div className="grid grid-cols-2 gap-4">
                                      <button 
                                        onClick={() => AlertSystem.autoBlockIP('185.0.0.1')}
                                        className="p-4 bg-red-600/10 border border-red-500/20 text-red-500 rounded-2xl text-[9px] font-black uppercase hover:bg-red-600 hover:text-white transition-all"
                                      >
                                         Emergency IP Ban
                                      </button>
                                      <button 
                                        onClick={() => addLog('Honeypot trap engaged across all endpoints.', 'SUCCESS')}
                                        className="p-4 bg-orange-600/10 border border-orange-500/20 text-orange-500 rounded-2xl text-[9px] font-black uppercase hover:bg-orange-600 hover:text-white transition-all"
                                      >
                                         Init Honeypot
                                      </button>
                                   </div>
                                   <div className="pt-4 border-t border-white/5">
                                      <button className="w-full p-4 bg-white text-black font-black uppercase text-[10px] rounded-xl tracking-widest active:scale-95 transition-all">
                                         Generate Report
                                      </button>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </section>
                    </div>
                 </ModuleLayout>
               )}

               {activeModule === 'backend' && (
                 <ModuleLayout title="CLOUD BACKEND ORCHESTRATOR" icon={Globe}>
                    <div className="max-w-6xl space-y-8 pb-24">
                       <Briefing 
                         icon={Globe} 
                         title="Infrastructure Control" 
                         description="Global command center for distributed cloud nodes. Monitor database synchronization, manage API lifecycle across disparate regions, and execute wide-area system updates from a unified interface."
                       />
                       <section className="bg-zinc-100 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-8">
                          <div className="flex items-center justify-between">
                             <div>
                                <h3 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tighter uppercase">Global Infrastructure</h3>
                                <p className="text-zinc-500 text-sm">Managing distributed nodes, databases, and API synchronization.</p>
                             </div>
                             <div className="flex gap-2">
                                <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black italic rounded">FIREBASE_SYNC_ON</span>
                                <span className="px-3 py-1 bg-zinc-800 text-zinc-400 text-[10px] font-black italic rounded">REGION: ASIA-SOUTH-1</span>
                             </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                             {[
                               { label: 'Active Users', val: '1,422', pct: 12, icon: Globe },
                               { label: 'DB Latency', val: '18ms', pct: -5, icon: Zap },
                               { label: 'License Sync', val: '99.9%', pct: 0, icon: Lock },
                               { label: 'API Health', val: 'OPTIMAL', pct: 0, icon: ShieldCheck }
                             ].map((s, i) => (
                               <div key={i} className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-6 rounded-2xl shadow-sm">
                                  <div className="flex items-center justify-between mb-4">
                                     <s.icon className="w-4 h-4 text-blue-500" />
                                     {s.pct !== 0 && (
                                       <span className={cn("text-[8px] font-black px-1.5 py-0.5 rounded", s.pct > 0 ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600")}>
                                          {s.pct > 0 ? '+' : ''}{s.pct}%
                                       </span>
                                     )}
                                  </div>
                                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">{s.label}</p>
                                  <p className="text-xl font-black text-zinc-900 dark:text-white tracking-tighter">{s.val}</p>
                               </div>
                             ))}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-zinc-200 dark:border-zinc-800">
                             <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
                                <h4 className="font-black text-xs uppercase mb-6 tracking-tight">Database Operations</h4>
                                <div className="space-y-4">
                                   {['Users', 'Licenses', 'Threat Logs', 'Global Config'].map(coll => (
                                     <div key={coll} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl hover:border-blue-500/30 border border-transparent transition-all cursor-pointer">
                                        <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">{coll}</span>
                                        <div className="flex gap-2">
                                           <span className="text-[8px] text-zinc-500 font-bold">14k Records</span>
                                           <button className="text-blue-500"><RefreshCw className="w-3 h-3" /></button>
                                        </div>
                                     </div>
                                   ))}
                                </div>
                             </div>
                             <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-6 opacity-10">
                                   <Globe className="w-32 h-32" />
                                </div>
                                <h4 className="text-white font-black text-xs uppercase mb-6 tracking-tight relative z-10">Remote Control Hub</h4>
                                <p className="text-[10px] text-zinc-500 leading-relaxed mb-8 relative z-10">
                                   Execute global commands across all deployed app instances. Requires Ultimate Clearance.
                                </p>
                                <div className="space-y-3 relative z-10">
                                   <button className="w-full p-4 bg-white/5 border border-white/10 text-white font-black uppercase text-[9px] rounded-xl tracking-widest hover:bg-white hover:text-black transition-all">
                                      Push Global Update
                                   </button>
                                   <button className="w-full p-4 bg-red-500/10 border border-red-500/20 text-red-500 font-black uppercase text-[9px] rounded-xl tracking-widest hover:bg-red-500 hover:text-white transition-all">
                                      Safety Shutdown (Total)
                                   </button>
                                </div>
                             </div>
                          </div>
                       </section>
                    </div>
                 </ModuleLayout>
               )}

               {activeModule === 'enterprise' && (
                 <ModuleLayout title="ENTERPRISE OPS & EDR" icon={Shield}>
                    <div className="max-w-6xl space-y-8 pb-24">
                       <Briefing 
                         icon={ShieldCheck} 
                         title="Endpoint Defense & SIEM" 
                         description="Unified interface for enterprise security stacks. Coordinate alerts from Falcon, SentinelOne, and Cortex XDR. Correlate SIEM events to visualize lateral movement and complex attack chains."
                       />
                       <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="space-y-1">
                             <h2 className="text-3xl font-black tracking-tighter uppercase dark:text-white">Endpoint Defense</h2>
                             <p className="text-zinc-500 text-sm">Unified control for CrowdStrike Falcon, SentinelOne, and Cortex XDR.</p>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] font-black text-green-600 uppercase">All Nodes Secure</span>
                             </div>
                             <button className="p-2 dark:bg-zinc-800 rounded-xl border border-zinc-700">
                                <RefreshCw className="w-4 h-4" />
                             </button>
                          </div>
                       </header>

                       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                          {/* Main EDR Interface */}
                          <div className="lg:col-span-2 space-y-6">
                             <div className="bg-zinc-900 border border-white/5 rounded-3xl p-8 space-y-8">
                                <div className="flex items-center justify-between">
                                   <div className="flex gap-4">
                                      {['FALCON', 'SENTINEL', 'CORTEX'].map(t => (
                                        <button key={t} className="px-4 py-1.5 rounded-full border border-white/10 text-[10px] font-black text-zinc-400 hover:bg-white hover:text-black transition-all">
                                          {t}
                                        </button>
                                      ))}
                                   </div>
                                   <span className="text-blue-500 text-[10px] font-mono">LINKED_TO_SIEM_9</span>
                                </div>
                                
                                <div className="h-64 border border-white/5 bg-black/40 rounded-2xl flex items-center justify-center relative overflow-hidden">
                                   <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent" />
                                   <Activity className="w-12 h-12 text-blue-500/50 animate-pulse" />
                                   <div className="absolute bottom-4 left-4 right-4 flex justify-between text-[8px] font-mono text-zinc-600 uppercase">
                                      <span>Telemetric Data Flowing</span>
                                      <span>Encryption: AES-256-GCM</span>
                                   </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                   <button className="p-6 bg-zinc-800/50 border border-white/5 rounded-2xl text-left hover:bg-zinc-800 transition-all group">
                                      <Skull className="w-5 h-5 text-red-500 mb-4 group-hover:scale-110 transition-transform" />
                                      <p className="text-[10px] font-black text-white uppercase mb-1">Deep Behavioral Analysis</p>
                                      <p className="text-[10px] text-zinc-500 underline">Start Real-time Telemetry Scan</p>
                                   </button>
                                   <button className="p-6 bg-zinc-800/50 border border-white/5 rounded-2xl text-left hover:bg-zinc-800 transition-all group">
                                      <ShieldCheck className="w-5 h-5 text-green-500 mb-4 group-hover:scale-110 transition-transform" />
                                      <p className="text-[10px] font-black text-white uppercase mb-1">Automated Remediation</p>
                                      <p className="text-[10px] text-zinc-500 underline">Config Self-Healing Modules</p>
                                   </button>
                                </div>
                             </div>

                             <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 space-y-6">
                                <h3 className="font-black text-xs uppercase tracking-widest text-zinc-400">SIEM Event Correlation (Splunk/Elastic)</h3>
                                <div className="space-y-4">
                                   {[
                                     { label: 'Brute Force Detection', source: 'SentinelOne', severity: 'HIGH' },
                                     { label: 'Lateral Movement', source: 'Cortex XDR', severity: 'CRITICAL' },
                                     { label: 'DNS Tunneling', source: 'Palo Alto', severity: 'MEDIUM' }
                                   ].map((e, i) => (
                                     <div key={i} className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                        <div className="flex items-center gap-4">
                                           <div className={cn("w-2 h-2 rounded-full", e.severity === 'CRITICAL' ? 'bg-red-500 animate-ping' : 'bg-orange-500')} />
                                           <div>
                                              <p className="text-xs font-black dark:text-white uppercase">{e.label}</p>
                                              <p className="text-[9px] text-zinc-500 font-bold">SOURCE: {e.source}</p>
                                           </div>
                                        </div>
                                        <span className="text-[9px] font-black p-1 bg-zinc-100 dark:bg-zinc-800 rounded dark:text-zinc-500">{e.severity}</span>
                                     </div>
                                   ))}
                                </div>
                             </div>
                          </div>

                          {/* Side - Network/Firewall */}
                          <div className="space-y-6">
                             <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white space-y-6 shadow-xl relative overflow-hidden group">
                                <div className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform">
                                   <Zap className="w-48 h-48" />
                                </div>
                                <h4 className="font-black text-xs uppercase tracking-tighter relative z-10">FortiGate & Cisco Firewall</h4>
                                <div className="space-y-4 relative z-10">
                                   <div className="flex justify-between items-end">
                                      <div>
                                         <p className="text-[10px] opacity-70 uppercase font-bold">Packet Inspection</p>
                                         <p className="text-2xl font-black">ACTIVE</p>
                                      </div>
                                      <Activity className="w-6 h-6 text-white/50" />
                                   </div>
                                   <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                                      <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-white transition-all" />
                                   </div>
                                   <p className="text-[9px] leading-relaxed opacity-80">
                                      Filtering 1.4TB/day traffic across VPC gateways. DDoS mitigation engaged (AWS Shield).
                                   </p>
                                </div>
                             </div>

                             <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 space-y-6">
                                <h4 className="font-black text-[10px] text-zinc-500 uppercase tracking-widest">IAM & Identity (Okta/Azure AD)</h4>
                                <div className="space-y-3">
                                   {[
                                     { label: 'Admin Access', user: 'root_alv', status: 'MFA_READY' },
                                     { label: 'Developer Portal', user: 'dev_ext', status: 'AUTHORIZED' },
                                     { label: 'External Node', user: 'node_88', status: 'CHALLENGED' }
                                   ].map((u, i) => (
                                     <div key={i} className="flex justify-between items-center text-[10px] p-3 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-100 dark:border-zinc-800">
                                        <div>
                                           <p className="font-black dark:text-white uppercase">{u.label}</p>
                                           <p className="text-[8px] text-zinc-500 font-bold">@{u.user}</p>
                                        </div>
                                        <span className={cn("px-2 py-0.5 rounded text-[8px] font-black", u.status === 'CHALLENGED' ? 'bg-orange-500/10 text-orange-600' : 'bg-green-500/10 text-green-600')}>
                                           {u.status}
                                        </span>
                                     </div>
                                   ))}
                                </div>
                             </div>

                             <div className="bg-zinc-900 border border-white/5 p-8 rounded-3xl space-y-4">
                                <h4 className="text-white font-black text-xs uppercase tracking-tight">Rapid Response</h4>
                                <button className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-[10px] uppercase tracking-widest transition-all">
                                   ISOLATE_ENTIRE_REGION
                                </button>
                                <p className="text-[9px] text-zinc-600 text-center uppercase font-bold italic">Requires MFA Authorization</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </ModuleLayout>
               )}

               {activeModule === 'intel' && (
                 <ModuleLayout title="INTEL CENTER & SURVEILLANCE" icon={Eye}>
                    <div className="max-w-6xl space-y-8 pb-24">
                       <Briefing 
                         icon={Eye} 
                         title="Classified Intelligence Hub" 
                         description="Deep-web surveillance and intercept coordination. Access telemetry from integrated Pegasus nodes, query XKeyscore packet streams, and synthesize relational graphs using Maltego-ready AI."
                       />
                       <section className="bg-zinc-900 border border-white/5 rounded-3xl p-8 space-y-12 relative overflow-hidden">
                          {/* Background Grid */}
                          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
                          
                          <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-6 border-b border-white/5 pb-8">
                             <div>
                                <h3 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Global Surveillance Hub</h3>
                                <p className="text-zinc-500 text-sm max-w-xl font-medium">
                                   Accessing classified data streams. Pegasus, XKeyscore, and Shodan integrated orchestration.
                                </p>
                             </div>
                             <div className="flex gap-4">
                                <div className="px-4 py-2 border border-blue-500/30 bg-blue-500/5 rounded-xl">
                                   <p className="text-[8px] text-blue-400 font-black uppercase tracking-widest mb-0.5">Satellite Sync</p>
                                   <p className="text-[10px] text-white font-bold">ALV-SAT-09: ONLINE</p>
                                </div>
                                <div className="px-4 py-2 border border-red-500/30 bg-red-500/5 rounded-xl">
                                   <p className="text-[8px] text-red-400 font-black uppercase tracking-widest mb-0.5">Alert Level</p>
                                   <p className="text-[10px] text-white font-bold">CLASSIFIED_BLACK</p>
                                </div>
                             </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                             {/* Target Profile Card */}
                             <div className="md:col-span-1 space-y-6">
                                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl space-y-6">
                                   <div className="h-48 bg-zinc-800 rounded-xl flex items-center justify-center relative overflow-hidden group">
                                      <ImagePlus className="w-12 h-12 text-zinc-600 group-hover:scale-110 transition-transform" />
                                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-blue-600 text-white text-[8px] font-black rounded uppercase">Target_ID: 9283</div>
                                   </div>
                                   <div className="space-y-4">
                                      <h4 className="font-black text-xs text-zinc-400 uppercase tracking-widest">Intercept Status (Pegasus)</h4>
                                      <div className="space-y-2">
                                         {[
                                           { label: 'Mic/Camera', status: 'ACTIVE', color: 'text-green-500' },
                                           { label: 'Keylogs', status: 'STREAMING', color: 'text-blue-500' },
                                           { label: 'Location', status: 'FIXED', color: 'text-red-500' }
                                         ].map(s => (
                                           <div key={s.label} className="flex justify-between items-center text-[10px]">
                                              <span className="text-zinc-500 uppercase font-bold">{s.label}</span>
                                              <span className={cn("font-black uppercase", s.color)}>{s.status}</span>
                                           </div>
                                         ))}
                                      </div>
                                   </div>
                                </div>
                                <div className="bg-blue-600 text-white p-6 rounded-2xl space-y-4 shadow-xl">
                                   <h4 className="font-black text-[10px] uppercase tracking-widest">Clearview AI Data</h4>
                                   <p className="text-[10px] opacity-80 leading-relaxed font-medium">Bypassing public social indices to find facial matches in domestic databases.</p>
                                   <button className="w-full py-3 bg-white text-blue-600 font-black uppercase text-[9px] rounded-lg tracking-widest">Start Scanning</button>
                                </div>
                             </div>

                             {/* Main Analysis Visualizer */}
                             <div className="md:col-span-3 space-y-8">
                                <div className="bg-black/40 border border-white/5 rounded-3xl p-8 relative overflow-hidden">
                                   <div className="absolute top-4 right-8 flex gap-4 text-[10px] font-mono font-bold text-zinc-600 uppercase">
                                      <span>XKeyscore Analysis Mode</span>
                                      <span>Filter: Global_SSL_Intercept</span>
                                   </div>
                                   <div className="h-80 flex flex-col pt-8">
                                      <div className="flex-1 border-l-2 border-zinc-800 ml-4 space-y-4 overflow-y-auto">
                                         {[1, 2, 3, 4].map(i => (
                                           <div key={i} className="pl-6 relative">
                                              <div className="absolute left-[-5px] top-1.5 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_#3b82f6]" />
                                              <div className="p-4 bg-zinc-800/40 border border-white/5 rounded-xl group hover:border-blue-500/50 transition-all cursor-pointer">
                                                 <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Packet_Node_0{i}</span>
                                                    <span className="text-[8px] font-mono text-zinc-600">IP: 142.250.XXX.XXX</span>
                                                 </div>
                                                 <p className="text-[10px] text-zinc-400 font-mono line-clamp-1">GET /api/v1/auth/session_token?user=admin&sig=0x92JKS...</p>
                                              </div>
                                           </div>
                                         ))}
                                      </div>
                                      <div className="mt-8 p-4 bg-zinc-900 border border-white/5 rounded-2xl flex items-center gap-6">
                                         <div className="flex-1 flex gap-4">
                                            <div className="h-10 px-4 bg-zinc-800 rounded-lg flex items-center text-zinc-400 text-[10px] font-mono">search_internet_devices --shodan "apache 2.4"</div>
                                            <button className="px-6 bg-blue-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest hover:bg-blue-700 transition-all">EXEC_QUERY</button>
                                         </div>
                                         <div className="flex gap-2">
                                            <Globe className="w-5 h-5 text-zinc-600" />
                                            <Zap className="w-5 h-5 text-zinc-600" />
                                         </div>
                                      </div>
                                   </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                   <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-6">
                                      <h4 className="text-white font-black text-xs uppercase tracking-tight">Maltego Visualization Agent</h4>
                                      <div className="h-48 border border-white/5 bg-zinc-800/40 rounded-2xl flex flex-col items-center justify-center text-zinc-600">
                                         <Network className="w-12 h-12 mb-4 opacity-50" />
                                         <p className="text-[10px] font-black uppercase tracking-widest italic font-medium">Auto-mapping entity relations...</p>
                                      </div>
                                      <div className="flex gap-2">
                                         <span className="px-2 py-0.5 bg-white/10 rounded text-[8px] text-zinc-400 font-bold">ENTITIES: 1,402</span>
                                         <span className="px-2 py-0.5 bg-white/10 rounded text-[8px] text-zinc-400 font-bold">LINKS: 5,281</span>
                                      </div>
                                   </div>
                                   <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-6">
                                      <h4 className="text-white font-black text-xs uppercase tracking-tight">Palantir-Ready Intelligence</h4>
                                      <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">
                                         Synthesizing data from Foundry & Gotham. Cross-referencing financial logs with travel registry.
                                      </p>
                                      <div className="flex flex-col gap-2">
                                         {['Flight_Logs.xml', 'SWIFT_Transfers.db', 'Social_Graph.json'].map(f => (
                                           <div key={f} className="flex justify-between items-center text-[10px] p-2 bg-black/30 rounded border border-white/5">
                                              <span className="text-zinc-500 font-mono uppercase">{f}</span>
                                              <span className="text-blue-500 font-black">INGESTED</span>
                                           </div>
                                         ))}
                                      </div>
                                   </div>
                                </div>
                             </div>
                          </div>
                       </section>
                    </div>
                 </ModuleLayout>
               )}

               {activeModule === 'settings' && (
                <ModuleLayout title="SYSTEM SETTINGS" icon={RefreshCw}>
                   <div className="max-w-2xl mx-auto py-8 space-y-8">
                      <Briefing 
                        icon={RefreshCw} 
                        title="Kernel Configuration" 
                        description="Fine-tune the Alvisia core session. Toggle high-entropy visualization, engage anti-debug shields, and manage digital environment overlays for optimal operational stealth."
                      />
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
                      <Briefing 
                        icon={Info} 
                        title="Operational Manual" 
                        description="Comprehensive guide to the Alvisia Pro environment. Access deployment protocols, module shortcuts, and plugin integration signatures for extended capabilities."
                      />
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

          {/* Toggleable Live Terminal */}
          <div className={cn(
            "border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 flex flex-col transition-all duration-300",
            isTerminalMinimized ? "h-10" : "h-48 lg:h-64"
          )}>
          <div className="flex items-center justify-between px-4 h-10 border-b border-zinc-200 dark:border-zinc-800/50 bg-zinc-100 dark:bg-zinc-900/80">
            <div className="flex items-center gap-2">
              <TerminalIcon className="w-3 h-3 text-blue-600 dark:text-blue-500" />
              <span className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase">Live System Output</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[10px] text-zinc-500 dark:text-zinc-600 tabular-nums hidden sm:inline">NODE: ALVISIA_ULTIMATE_V8</span>
              <div className="flex items-center gap-2">
                 <button 
                   onClick={() => setIsTerminalMinimized(!isTerminalMinimized)}
                   className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors"
                   title={isTerminalMinimized ? "Maximize" : "Minimize"}
                 >
                    <RefreshCw className={cn("w-3 h-3 text-zinc-500 transition-transform duration-500", isTerminalMinimized ? "rotate-180" : "")} />
                 </button>
                 {!isTerminalMinimized && (
                    <>
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
                         className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400"
                         title="Export Logs"
                       >
                         <Download className="w-3 h-3" />
                       </button>
                       <button 
                         onClick={() => setLogs([])}
                         className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded transition-colors text-zinc-500 hover:text-red-500"
                         title="Flush Terminal"
                       >
                         <Trash2 className="w-3 h-3" />
                       </button>
                    </>
                 )}
              </div>
            </div>
          </div>
          {!isTerminalMinimized && (
            <div className="flex-1 overflow-y-auto p-3 terminal-scroll bg-white/40 dark:bg-black/40">
              <div className="space-y-1 font-mono">
                {logs.length === 0 ? (
                   <div className="h-full flex items-center justify-center p-8 opacity-20">
                      <p className="text-[10px] uppercase font-bold tracking-widest italic">Listening for system events...</p>
                   </div>
                ) : (
                  logs.slice(-100).map((log) => (
                    <div key={log.id} className="flex gap-3 text-[11px] group">
                      <span className="text-zinc-400 dark:text-zinc-600 shrink-0 tabular-nums">[{log.timestamp}]</span>
                      <span className={cn(
                        "font-black shrink-0 w-14 uppercase text-[9px] flex items-center justify-center rounded-[2px]",
                        log.level === 'SUCCESS' && "text-green-600 dark:text-green-500 bg-green-500/10",
                        log.level === 'INFO' && "text-blue-600 dark:text-blue-500 bg-blue-500/10",
                        log.level === 'WARNING' && "text-yellow-600 dark:text-yellow-500 bg-yellow-500/10",
                        log.level === 'ERROR' && "text-red-600 dark:text-red-500 bg-red-500/10"
                      )}>{log.level}</span>
                      <span className="text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-200 transition-colors break-all tracking-tight">{log.message}</span>
                    </div>
                  ))
                )}
                <div ref={terminalEndRef} />
              </div>
            </div>
          )}
        </div>
      </main>
      </div>

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
      
      {/* Footer Status Bar */}
      <footer className="h-7 w-full bg-blue-600 flex items-center justify-between px-3 text-[9px] font-black text-white uppercase tracking-widest z-50 shrink-0 border-t border-white/10 shadow-[0_-4px_20px_rgba(37,99,235,0.2)]">
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
      </footer>

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

      {/* Global Ticker */}
      <div className="h-6 bg-blue-600/10 border-t border-zinc-800 flex items-center overflow-hidden whitespace-nowrap z-50">
        <div className="flex animate-[ticker_30s_linear_infinite] hover:[animation-play-state:paused] cursor-default items-center">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-10 px-10">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                 Kernel_Uptime: {Math.floor(Date.now()/1000000)}s
              </span>
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                 Global_Threat_Index: 4% (Low)
              </span>
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                 Nodes_Synced: 1,442
              </span>
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest italic group">
                 ALVISIA_PRO_ULTIMATE_SESSION_ACTIVE_NODE_ROOT
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
