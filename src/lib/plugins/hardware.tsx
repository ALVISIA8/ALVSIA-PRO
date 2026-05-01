import React, { useEffect, useState } from 'react';
import { Monitor, Cpu, HardDrive, ShieldCheck } from 'lucide-react';
import { AlvisiaPlugin, registry } from '../plugins';

const HardwareModule: React.FC<{ addLog: (msg: string, level?: any) => void }> = ({ addLog }) => {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        addLog('Initiating Deep Hardware Audit...', 'INFO');
        setTimeout(() => {
            setStats({
                cpu: 'Intel(R) Core(TM) i9-12900K @ 3.20GHz',
                cores: 16,
                ram: '65536 MB LPDDR5',
                gpu: 'NVIDIA GeForce RTX 4090 (Virtual)',
                os: 'Alvisia Kernel 8.0.4-x86_64',
                uptime: '152d 04h 22m 11s'
            });
            addLog('Hardware fingerprinting successfully completed.', 'SUCCESS');
        }, 1500);
    }, []);

    if (!stats) return <div className="p-12 text-center text-zinc-500 animate-pulse uppercase tracking-[0.3em]">Auditing Resources...</div>;

    return (
        <div className="max-w-4xl space-y-8">
            <section className="grid grid-cols-2 gap-6">
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-6">
                    <div className="flex items-center gap-4 text-blue-400">
                        <Cpu className="w-6 h-6" />
                        <h3 className="font-bold uppercase tracking-tighter">Processor Architecture</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Model Name</p>
                            <p className="text-sm text-white font-mono">{stats.cpu}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Logical Cores</p>
                                <p className="text-xl text-blue-400 font-mono">{stats.cores}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Clock Speed</p>
                                <p className="text-xl text-blue-400 font-mono">3.20 GHz</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-6">
                    <div className="flex items-center gap-4 text-purple-400">
                        <Monitor className="w-6 h-6" />
                        <h3 className="font-bold uppercase tracking-tighter">Memory & Graphics</h3>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">System RAM</p>
                            <p className="text-sm text-white font-mono">{stats.ram}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">GPU Target</p>
                            <p className="text-sm text-purple-400 font-mono">{stats.gpu}</p>
                        </div>
                    </div>
                </div>

                <div className="col-span-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-zinc-800 p-8 rounded-3xl flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-black border border-zinc-800 rounded-2xl flex items-center justify-center shadow-2xl">
                             <ShieldCheck className="w-8 h-8 text-green-500" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white uppercase tracking-tighter">System Integrity Report</h3>
                            <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">{stats.os}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Current Uptime</p>
                        <p className="text-lg font-mono text-blue-400 tabular-nums">{stats.uptime}</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export const HardwarePlugin: AlvisiaPlugin = {
    metadata: {
        id: 'hardware-audit',
        name: 'Hardware Auditor',
        description: 'Low-level hardware fingerprinting and system telemetry.',
        version: '1.2.0',
        author: '@ALVISIA_TEAM'
    },
    icon: HardDrive,
    component: HardwareModule
};

registry.register(HardwarePlugin);
