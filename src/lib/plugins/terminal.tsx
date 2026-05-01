import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, ChevronRight, Cpu } from 'lucide-react';
import { AlvisiaPlugin, registry } from '../plugins';

const TerminalModule: React.FC<{ addLog: (msg: string, level?: any) => void }> = ({ addLog }) => {
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>(['ALVISIA CORE TERMINAL [Version 8.0.4]', '(c) 2026 Alvisia Systems. All rights reserved.', '']);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [history]);

    const executeCommand = (cmd: string) => {
        const newHistory = [...history, `> ${cmd}`];
        
        const cleanCmd = cmd.toLowerCase().trim();
        if (cleanCmd === 'help') {
            newHistory.push('AVAILABLE COMMANDS:', ' - SCAN: Initiate network probe', ' - LOGS: Show recent system events', ' - WHOAMI: Display identity', ' - CLEAR: Purge terminal history');
        } else if (cleanCmd === 'scan') {
            newHistory.push('PROBING_INTERFACES...', 'FOUND 12 CLIENTS ON SUBNET 192.168.1.0/24');
            addLog('Terminal scan command executed.', 'INFO');
        } else if (cleanCmd === 'whoami') {
            newHistory.push('ALVISIA_PRO_SUPERUSER_0x1');
        } else if (cleanCmd === 'clear') {
            setHistory(['']);
            return;
        } else if (cleanCmd !== '') {
            newHistory.push(`ERR: Command '${cleanCmd}' not found or permission denied.`);
        }

        setHistory(newHistory);
        setInput('');
    };

    return (
        <div className="max-w-5xl h-[600px] flex flex-col bg-black border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <TerminalIcon className="w-4 h-4 text-blue-400" />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Interactive Shell (Sh)</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Cpu className="w-3 h-3 text-zinc-600" />
                        <span className="text-[9px] text-zinc-600 font-mono">CPU: 2.1%</span>
                    </div>
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                        <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                    </div>
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 font-mono text-xs text-blue-400 space-y-1 selection:bg-blue-500/30">
                {history.map((line, i) => (
                    <div key={i} className={line.startsWith('>') ? "text-white font-bold" : ""}>{line}</div>
                ))}
            </div>

            <div className="p-4 bg-zinc-900/50 border-t border-zinc-800 flex items-center gap-3">
                <ChevronRight className="w-4 h-4 text-zinc-500 shrink-0" />
                <input 
                    autoFocus
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && executeCommand(input)}
                    className="flex-1 bg-transparent border-none outline-none text-white text-xs font-mono"
                    placeholder="Enter system command..."
                />
            </div>
        </div>
    );
};

export const TerminalPlugin: AlvisiaPlugin = {
    metadata: {
        id: 'terminal',
        name: 'System Shell',
        description: 'Low-level interactive CLI for kernel-space operations.',
        version: '2.0.1',
        author: '@ALVISIA_TEAM'
    },
    icon: TerminalIcon,
    component: TerminalModule
};

registry.register(TerminalPlugin);
