import React, { useState } from 'react';
import { Activity, ShieldAlert, Crosshair, Zap, Bug, Server } from 'lucide-react';
import { AlvisiaPlugin, registry } from '../plugins';

const VulnScannerModule: React.FC<{ addLog: (msg: string, level?: any) => void }> = ({ addLog }) => {
    const [target, setTarget] = useState('192.168.1.1');
    const [scanning, setScanning] = useState(false);
    const [vulns, setVulns] = useState<any[]>([]);

    const scanNetwork = async () => {
        if (!target) return addLog('Please specify a target for scanning.', 'WARNING');
        setScanning(true);
        setVulns([]);
        addLog(`Probing target ${target} for known CVEs and misconfigurations...`, 'INFO');
        
        try {
            const { PentestSuite } = await import('../engines');
            const results = await PentestSuite.scanVulnerabilities(target);
            await new Promise(r => setTimeout(r, 1500));
            addLog(`Found ${results.length} vulnerability signatures.`, results.length > 0 ? 'WARNING' : 'SUCCESS');
            setVulns(results.map(v => ({ ...v, severity: v.CVSS > 8 ? 'CRITICAL' : v.CVSS > 6 ? 'HIGH' : 'MEDIUM' })));
        } catch (e) {
            addLog('Critical error during heuristic analysis.', 'ERROR');
        } finally {
            setScanning(false);
        }
    };

    return (
        <div className="max-w-4xl space-y-8">
            <section className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-white tracking-tighter uppercase">Vulnerability Scanner</h3>
                        <p className="text-zinc-500 text-sm">Automated identification of misconfigurations and exploits across assets.</p>
                    </div>
                    <Crosshair className="w-10 h-10 text-red-500 animate-pulse" />
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] block ml-1">Target Host / URL</label>
                    <div className="flex gap-4">
                        <input 
                            value={target}
                            onChange={(e) => setTarget(e.target.value)}
                            placeholder="Enter IP or Domain..."
                            className="flex-1 bg-black border border-zinc-800 rounded-xl px-4 py-3 text-zinc-300 font-mono focus:border-red-500 transition-all outline-none"
                        />
                        <button 
                            onClick={scanNetwork}
                            disabled={scanning}
                            className="px-8 bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 text-white rounded-xl font-black uppercase text-xs tracking-widest transition-all shadow-lg shadow-red-600/20"
                        >
                            {scanning ? 'SCANNING...' : 'SCAN'}
                        </button>
                    </div>
                </div>

                {vulns.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {vulns.map((v, i) => (
                            <div key={i} className="bg-black/60 border border-zinc-800 p-6 rounded-2xl space-y-3 hover:border-red-500/40 transition-colors">
                                <div className="flex justify-between items-start">
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border ${
                                        v.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border-red-500/40' :
                                        v.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' :
                                        'bg-yellow-500/20 text-yellow-400 border-yellow-500/40'
                                    }`}>
                                        {v.severity}
                                    </span>
                                    <Bug className="w-4 h-4 text-zinc-700" />
                                </div>
                                <h4 className="text-white font-bold text-sm tracking-tight">{v.title}</h4>
                                <div className="flex items-center gap-2">
                                    <Server className="w-3 h-3 text-zinc-500" />
                                    <span className="text-[10px] text-zinc-500 font-mono">{v.service}</span>
                                    <span className="text-[10px] text-zinc-700 font-mono ml-auto">{v.id}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="p-4 bg-zinc-800/10 border border-zinc-800 rounded-xl flex items-center gap-4">
                    <Zap className="w-4 h-4 text-orange-400" />
                    <p className="text-[10px] text-zinc-500 uppercase font-bold">Heuristic Engine: <span className="text-white ml-1">v8.4-RELEASE</span></p>
                </div>
            </section>
        </div>
    );
};

export const VulnScannerPlugin: AlvisiaPlugin = {
    metadata: {
        id: 'vuln-scanner',
        name: 'Vulnerability Scan',
        description: 'Passive and active vulnerability discovery engine.',
        version: '2.1.2',
        author: '@ALVISIA_TEAM'
    },
    icon: Bug,
    component: VulnScannerModule
};

registry.register(VulnScannerPlugin);
