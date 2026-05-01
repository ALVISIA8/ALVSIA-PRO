import React from 'react';
import { ShoppingBag, Star, Download, Cpu, Shield, Zap, Globe, Package } from 'lucide-react';
import { AlvisiaPlugin, registry } from '../plugins';

const MarketplaceModule: React.FC<{ addLog: (msg: string, level?: any) => void }> = ({ addLog }) => {
    const upcomingPlugins = [
        { name: 'Quantum Cracker', desc: 'Shor\'s algorithm implementation for RSA-2048.', icon: Shield, author: '@NSA_DEV', rating: 4.9 },
        { name: 'DarkNet Crawler', desc: 'Indexed search through Tor and I2P hidden services.', icon: Globe, author: '@OnionMaster', rating: 4.7 },
        { name: 'IoT Hijacker', desc: 'Protocol analysis for Zigbee and MQTT smart devices.', icon: Zap, author: '@HardwareHack', rating: 4.5 },
    ];

    const currentPlugins = registry.getPlugins();

    return (
        <div className="max-w-5xl space-y-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Extension Marketplace</h3>
                    <p className="text-zinc-500 text-sm">Download and integrate community-developed security modules.</p>
                </div>
                <div className="flex gap-2">
                    <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-2">
                        <Package className="w-4 h-4 text-blue-400" />
                        <span className="text-xs font-bold text-white tabular-nums">{currentPlugins.length} INSTALLED</span>
                    </div>
                </div>
            </header>

            <section className="space-y-6">
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] ml-1">Installed Modules</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {currentPlugins.map((p) => (
                        <div key={p.metadata.id} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl group hover:border-blue-500/30 transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-black rounded-xl border border-zinc-800">
                                    <p.icon className="w-6 h-6 text-blue-400" />
                                </div>
                                <span className="text-[8px] font-bold bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20 uppercase tracking-widest">Active</span>
                            </div>
                            <h5 className="text-white font-bold tracking-tight mb-1">{p.metadata.name}</h5>
                            <p className="text-xs text-zinc-500 mb-4 line-clamp-2">{p.metadata.description}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
                                <span className="text-[10px] text-zinc-600 font-mono uppercase">{p.metadata.author}</span>
                                <span className="text-[10px] text-zinc-600 font-mono">v{p.metadata.version}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="space-y-6">
                <div className="flex items-center gap-4">
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] ml-1">Community Recommendations</h4>
                    <div className="h-px flex-1 bg-zinc-800" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {upcomingPlugins.map((p, i) => (
                     <div key={i} className="bg-black border border-zinc-800 rounded-3xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <ShoppingBag className="w-24 h-24 text-white -rotate-12" />
                        </div>
                        <div className="relative z-10 space-y-6">
                            <div className="p-4 bg-zinc-900 border border-zinc-800 w-fit rounded-2xl">
                                <p.icon className="w-8 h-8 text-zinc-400" />
                            </div>
                            <div>
                                <h5 className="text-xl font-bold text-white tracking-tighter uppercase">{p.name}</h5>
                                <div className="flex items-center gap-2 mt-1">
                                    <Star className="w-3 h-3 text-orange-400 fill-orange-400" />
                                    <span className="text-[10px] font-bold text-orange-400">{p.rating}</span>
                                    <span className="text-zinc-600 text-[10px] uppercase font-bold">• {p.author}</span>
                                </div>
                            </div>
                            <p className="text-xs text-zinc-500 leading-relaxed uppercase">{p.desc}</p>
                            <button 
                                onClick={() => addLog(`Purchasing ${p.name}... Authorization token required.`, 'ERROR')}
                                className="w-full py-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-[10px] font-bold uppercase flex items-center justify-center gap-2 mt-4 transition-all"
                            >
                                <Download className="w-3 h-3" /> Get Extension
                            </button>
                        </div>
                     </div>
                   ))}
                </div>
            </section>
        </div>
    );
};

export const MarketplacePlugin: AlvisiaPlugin = {
    metadata: {
        id: 'marketplace',
        name: 'Extensions',
        description: 'Advanced intelligence gathering and identity correlation engine.',
        version: '1.0.0',
        author: '@ALVISIA_TEAM'
    },
    icon: ShoppingBag,
    component: MarketplaceModule
};

registry.register(MarketplacePlugin);
