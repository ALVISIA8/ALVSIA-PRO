import React, { useState } from 'react';
import { Package, ShieldAlert, Play, Trash2 } from 'lucide-react';
import { AlvisiaPlugin, registry } from '../plugins';

const SandboxModule: React.FC<{ addLog: (msg: string, level?: any) => void }> = ({ addLog }) => {
    const [isRunning, setIsRunning] = useState(false);

    const startSim = () => {
        setIsRunning(true);
        addLog('Initializing Virtual Sandbox Environment...', 'INFO');
        setTimeout(() => {
            addLog('HEURISTIC_TRIGGER: Suspicious API call detected (VirtualAllocEx)', 'WARNING');
            addLog('Malware behavior simulated successfully.', 'SUCCESS');
            setIsRunning(false);
        }, 3000);
    };

    return (
        <div className="max-w-4xl space-y-8">
            <section className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-white tracking-tighter uppercase">Virtual Malware Sandbox</h3>
                        <p className="text-zinc-500 text-sm">Isolated runtime for behavioral analysis of suspicious artifacts.</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center border border-purple-500/20">
                        <ShieldAlert className="w-6 h-6 text-purple-400" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button 
                        disabled={isRunning}
                        onClick={startSim}
                        className="flex items-center justify-center gap-3 p-6 bg-zinc-800/40 border border-zinc-800 rounded-2xl hover:bg-zinc-800 transition-all group"
                    >
                        <Play className="w-5 h-5 text-green-400 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-zinc-300 uppercase">Execute Analysis</span>
                    </button>
                    <button className="flex items-center justify-center gap-3 p-6 bg-zinc-800/40 border border-zinc-800 rounded-2xl hover:bg-red-900/20 transition-all group">
                        <Trash2 className="w-5 h-5 text-red-400" />
                        <span className="text-xs font-bold text-zinc-300 uppercase">Wipe Snapshot</span>
                    </button>
                </div>

                <div className="p-4 bg-black/50 border border-zinc-800 rounded-xl">
                    <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.2em] mb-2">Sandbox Environment Status</p>
                    <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${isRunning ? 'bg-green-500' : 'bg-zinc-700'}`} />
                        <span className="text-xs font-mono text-zinc-400">{isRunning ? 'ANALYZING_LIVE_DATA' : 'READY_STANDBY'}</span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export const SandboxPlugin: AlvisiaPlugin = {
    metadata: {
        id: 'sandbox',
        name: 'Malware Sandbox',
        description: 'Heuristic-based malware behavioral analysis tool.',
        version: '1.0.0',
        author: '@ALVISIA_TEAM'
    },
    icon: Package,
    component: SandboxModule
};

// Auto-register for demo
registry.register(SandboxPlugin);
