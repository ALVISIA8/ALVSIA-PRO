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
        const args = cleanCmd.split(' ');
        const baseCmd = args[0];

        if (baseCmd === 'help') {
            newHistory.push('AVAILABLE COMMANDS:', 
                ' - SCAN [target]: Initiate network probe', 
                ' - PING [host]: Test connectivity', 
                ' - IFCONFIG: Show network interfaces',
                ' - NETSTAT: List active connections',
                ' - WHOAMI: Display identity', 
                ' - UNAME -A: Kernel info',
                ' - LS: List directory contents',
                ' - CLEAR: Purge terminal history');
        } else if (baseCmd === 'scan') {
            const target = args[1] || '192.168.1.0/24';
            newHistory.push(`PROBING_${target}...`, 'IDENTIFYING ALIVE HOSTS...');
            setTimeout(() => {
                setHistory(prev => [...prev, 'HOST 192.168.1.1 [UP] - GATEWAY', 'HOST 192.168.1.15 [UP] - SMARTPHONE_ANDROID', 'HOST 192.168.1.102 [UP] - LAPTOP_WSL', 'SCAN_COMPLETE: 3 HOSTS ALIVE.']);
            }, 500);
            addLog(`Terminal scan started on ${target}`, 'INFO');
        } else if (baseCmd === 'ping') {
            const host = args[1] || 'google.com';
            newHistory.push(`PING ${host} (142.250.67.46): 56 data bytes`);
            for(let i=0; i<4; i++) {
                setTimeout(() => {
                    setHistory(prev => [...prev, `64 bytes from 142.250.67.46: icmp_seq=${i} ttl=118 time=${(20 + Math.random()*10).toFixed(2)} ms`]);
                }, (i+1) * 300);
            }
        } else if (baseCmd === 'ifconfig' || baseCmd === 'ip') {
            newHistory.push('eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500',
                           '        inet 172.17.0.2  netmask 255.255.0.0  broadcast 172.17.255.255',
                           '        ether 02:42:ac:11:00:02  txqueuelen 0  (Ethernet)',
                           'lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536',
                           '        inet 127.0.0.1  netmask 255.0.0.0');
        } else if (baseCmd === 'netstat') {
            newHistory.push('Active Internet connections (w/o servers)',
                           'Proto Recv-Q Send-Q Local Address           Foreign Address         State',
                           'tcp        0      0 172.17.0.2:44332        142.250.67.46:443       ESTABLISHED',
                           'tcp        0      0 172.17.0.2:51732        52.216.42.128:443       ESTABLISHED');
        } else if (cleanCmd === 'uname -a') {
            newHistory.push('Linux alvisia-core 6.1.0-21-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.90-1 (2024-05-03) x86_64 GNU/Linux');
        } else if (baseCmd === 'ls') {
            newHistory.push('bin/  etc/  home/  lib/  mnt/  opt/  proc/  root/  sys/  tmp/  usr/  var/');
        } else if (baseCmd === 'whoami') {
            newHistory.push('alvisia_pro_superuser_0x1');
        } else if (baseCmd === 'clear') {
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
