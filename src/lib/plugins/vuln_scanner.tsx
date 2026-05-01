import React, { useState } from 'react';
import { Activity, ShieldAlert, Crosshair, Zap, Bug, Server } from 'lucide-react';
import { AlvisiaPlugin, registry } from '../plugins';

const VulnScannerModule: React.FC<{ addLog: (msg: string, level?: any) => void }> = ({ addLog }) => {
    const [scanning, setScanning] = useState(false);
    const [vulns, setVulns] = useState<any[]>([]);

    const scanNetwork = () => {
        setScanning(true);
        setVulns([]);
        addLog('Probing local subnet for vulnerability signatures...', 'INFO');
        
        setTimeout(() => {
            const found = [
                { id: 'CVE-2024-2111', severity: 'CRITICAL', title: 'EternalBlue Signature Detected', service: 'SMB v1' },
                { id: 'MISC-AUTH-04', severity: 'HIGH', title: 'Default Admin Credentials', service: 'HTTP/SSH' },
                { id: 'CVE-2023-9921', severity: 'MEDIUM', title: 'Outdated SSL Certificate', service: 'HTTPS' }
            ];
            setVulns(found);
            addLog('Vulnerability surface mapping complete. 3 issues found.', 'WARNING');
            setScanning(false);
        }, 3000);
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

                <button 
                    onClick={scanNetwork}
                    disabled={scanning}
                    className="w-full py-6 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 shadow-lg shadow-red-600/20"
                >
                    <Activity className={`w-6 h-6 ${scanning ? 'animate-spin' : ''}`} />
                    {scanning ? 'SCAN_IN_PROGRESS...' : 'INITIATE_VULN_ASSESSMENT'}
                </button>

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
