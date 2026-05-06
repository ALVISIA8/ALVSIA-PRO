import React, { useState } from 'react';
import { Search, Globe, User, Database, ShieldAlert, Cpu } from 'lucide-react';
import { AlvisiaPlugin, registry } from '../plugins';
import { cn } from '../utils';

const OSINTModule: React.FC<{ addLog: (msg: string, level?: any) => void }> = ({ addLog }) => {
    const [query, setQuery] = useState('');
    const [searching, setSearching] = useState(false);
    const [results, setResults] = useState<any[]>([]);

    const handleSearch = async () => {
        if (!query) return;
        setSearching(true);
        setResults([]);
        addLog(`Initiating OSINT scan across surface and deep web for: ${query}`, 'INFO');
        
        try {
            const { OSINTLab } = await import('../engines');
            
            // Check if input is likely an IP or username
            if (/^(?:\d{1,3}\.){3}\d{1,3}$/.test(query)) {
                const ipRes = await OSINTLab.ipIntelligence(query);
                setResults([{
                    type: 'GEO_INTEL',
                    val: `${ipRes.city}, ${ipRes.country_name}`,
                    leak: `ASN: ${ipRes.asn || 'N/A'}`
                }, {
                    type: 'DOMAIN',
                    val: query,
                    leak: `ISP: ${ipRes.org}`
                }]);
            } else {
                const userRes = await OSINTLab.usernameSearch(query);
                setResults(userRes.map(r => ({
                    type: r.status === 'FOUND' ? 'ACCOUNT_IDENTIFIED' : 'PLATFORM_EMPTY',
                    val: r.platform,
                    leak: r.status === 'FOUND' ? r.url : 'SECURE'
                })));
            }
            
            addLog('Intelligence gathering phase complete.', 'SUCCESS');
        } catch (e) {
            addLog('OSINT bridge failed to resolve target.', 'ERROR');
        } finally {
            setSearching(false);
        }
    };

    return (
        <div className="max-w-4xl space-y-8">
            <section className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-6">
                <div>
                    <h3 className="text-2xl font-bold text-white tracking-tighter uppercase">Intelligence Engine</h3>
                    <p className="text-zinc-500 text-sm">Cross-referencing global databases for identity and infrastructure leaks.</p>
                </div>

                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <input 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Target username or IPv4..."
                            className="w-full bg-black border border-zinc-800 rounded-xl pl-12 pr-4 py-4 text-blue-400 font-mono focus:border-blue-500 transition-all outline-none"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 w-5 h-5" />
                    </div>
                    <button 
                        onClick={handleSearch}
                        disabled={searching}
                        className="px-8 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-800 text-white rounded-xl font-bold uppercase transition-all"
                    >
                        {searching ? 'SCANNING...' : 'EXECUTE'}
                    </button>
                </div>

                {results.length > 0 && (
                    <div className="space-y-4 pt-4">
                         <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Discovered Artifacts</p>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {results.map((res, i) => (
                                <div key={i} className="p-4 bg-black/40 border border-zinc-800 rounded-2xl flex items-center justify-between group hover:border-blue-500/30 transition-colors">
                                    <div className="flex items-center gap-4 overflow-hidden">
                                        <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center shrink-0">
                                            {res.type.includes('ACCOUNT') && <User className="w-5 h-5 text-purple-400" />}
                                            {res.type.includes('GEO') && <Globe className="w-5 h-5 text-green-400" />}
                                            {res.type.includes('PLATFORM') && <ShieldAlert className="w-5 h-5 text-zinc-700" />}
                                            {res.type.includes('DOMAIN') && <Database className="w-5 h-5 text-blue-400" />}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-xs text-white font-mono truncate">{res.val}</p>
                                            <p className="text-[10px] text-zinc-500 uppercase">{res.type}</p>
                                        </div>
                                    </div>
                                    <span className={cn("text-[9px] px-3 py-1 rounded-full border font-bold shrink-0 ml-2", 
                                        res.leak.includes('http') ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                        res.leak === 'SECURE' ? 'bg-zinc-500/10 text-zinc-600 border-zinc-500/10' :
                                        'bg-red-500/10 text-red-400 border-red-500/20'
                                    )}>
                                        {res.leak.length > 20 ? 'DETECTED' : res.leak}
                                    </span>
                                </div>
                            ))}
                         </div>
                    </div>
                )}
            </section>
        </div>
    );
};

export const OSINTPlugin: AlvisiaPlugin = {
    metadata: {
        id: 'osint-engine',
        name: 'OSINT Intelligence',
        description: 'Advanced intelligence gathering and identity correlation engine.',
        version: '1.4.0',
        author: '@ALVISIA_TEAM'
    },
    icon: Globe,
    component: OSINTModule
};

registry.register(OSINTPlugin);
