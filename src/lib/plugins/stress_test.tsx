import React, { useState, useEffect } from 'react';
import { Activity, Zap, ShieldAlert, Wifi, Server, AlertTriangle } from 'lucide-react';
import { AlvisiaPlugin, registry } from '../plugins';

const StressTestModule: React.FC<{ addLog: (msg: string, level?: any) => void }> = ({ addLog }) => {
    const [active, setActive] = useState(false);
    const [load, setLoad] = useState(0);
    const [reqs, setReqs] = useState(0);

    useEffect(() => {
        let interval: any;
        if (active) {
            interval = setInterval(() => {
                setLoad(prev => Math.min(100, prev + (active ? 2 : -5)));
                setReqs(prev => prev + Math.floor(Math.random() * 5000));
                
                if (Math.random() > 0.95) {
                    addLog('WARNING: Target latency exceeding 500ms threshold.', 'WARNING');
                }
            }, 500);
        } else {
            setLoad(0);
        }
        return () => clearInterval(interval);
    }, [active]);

    const toggle = () => {
        if (!active) {
            addLog('Initializing DDoS stress test on target buffer...', 'WARNING');
            setActive(true);
        } else {
            addLog('Stress test sequence terminated by operator.', 'INFO');
            setActive(false);
        }
    };

    return (
        <div className="max-w-4xl space-y-8">
            <section className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-white tracking-tighter uppercase">Network Stress Engine</h3>
                        <p className="text-zinc-500 text-sm">Assess infrastructure resilience under massive concurrent request loads.</p>
                    </div>
                    <Zap className={active ? "w-10 h-10 text-yellow-400 animate-bounce" : "w-10 h-10 text-zinc-700"} />
                </div>

                <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                             <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                                <span>Target Load Level</span>
                                <span className={load > 80 ? "text-red-500" : "text-blue-400"}>{load}%</span>
                             </div>
                             <div className="h-4 bg-black border border-zinc-800 rounded-full overflow-hidden p-1">
                                <div 
                                    className={`h-full rounded-full transition-all duration-500 ${
                                        load > 85 ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 
                                        load > 50 ? 'bg-orange-500' : 'bg-blue-500'
                                    }`}
                                    style={{ width: `${load}%` }}
                                />
                             </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black border border-zinc-800 p-4 rounded-xl">
                                <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Total Requests</p>
                                <p className="text-xl font-mono text-white tabular-nums">{reqs.toLocaleString()}</p>
                            </div>
                            <div className="bg-black border border-zinc-800 p-4 rounded-xl">
                                <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">PPS Rate</p>
                                <p className="text-xl font-mono text-yellow-500 tabular-nums">{(reqs / 10).toFixed(0)}k</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-black/40 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center gap-6">
                        <div className="relative">
                             <div className={`absolute -inset-4 rounded-full blur-2xl transition-all duration-300 ${active ? 'bg-red-600/30' : 'bg-zinc-800/0'}`} />
                             <button 
                                onClick={toggle}
                                className={`relative w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all ${
                                    active ? "border-red-500 bg-red-600/10 text-red-500" : "border-zinc-800 bg-zinc-900 text-zinc-600"
                                } shadow-2xl`}
                             >
                                <Activity className="w-8 h-8" />
                             </button>
                        </div>
                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">{active ? 'DESTRUCTIVE_ACTIVE' : 'IDLE_STANDBY'}</p>
                    </div>
                </div>

                <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl flex items-center gap-4">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <p className="text-[10px] text-zinc-500 leading-relaxed uppercase">
                        WARNING: Unauthorized stress testing of external infrastructure is illegal. This module is intended for internal capacity planning only.
                    </p>
                </div>
            </section>
        </div>
    );
};

export const StressPlugin: AlvisiaPlugin = {
    metadata: {
        id: 'stress-tester',
        name: 'Stress Engine',
        description: 'Layer 7 load generation and infrastructure durability testing.',
        version: '1.5.0',
        author: '@ALVISIA_TEAM'
    },
    icon: Activity,
    component: StressTestModule
};

registry.register(StressPlugin);
