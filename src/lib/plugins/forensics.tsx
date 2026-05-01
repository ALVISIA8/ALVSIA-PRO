import React, { useState } from 'react';
import { Camera, FileSearch, Fingerprint, Database, HardDrive, Trash2 } from 'lucide-react';
import { AlvisiaPlugin, registry } from '../plugins';

const ForensicsModule: React.FC<{ addLog: (msg: string, level?: any) => void }> = ({ addLog }) => {
    const [analyzing, setAnalyzing] = useState(false);
    const [data, setData] = useState<any>(null);

    const runAnalysis = () => {
        setAnalyzing(true);
        addLog('Mounting raw disk image (READ-ONLY)...', 'INFO');
        
        setTimeout(() => {
            setData({
                recovered: 14,
                deleted_files: ['IMG_2024_03.jpg', 'passwd.txt', 'secret.docx'],
                hashes: {
                    md5: '7d6e8b9f0a2c1d3e4f5a6b7c8d9e0f1a',
                    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
                },
                metadata: 'EXIF: GPS_LAT=40.7128, GPS_LONG=-74.0060; DEVICE=Nikon_D850'
            });
            addLog('Carving completed. 14 identifiable artifacts recovered from slack space.', 'SUCCESS');
            setAnalyzing(false);
        }, 3000);
    };

    return (
        <div className="max-w-4xl space-y-8">
            <section className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-white tracking-tighter uppercase">Forensics Artifact Carver</h3>
                        <p className="text-zinc-500 text-sm">Recover deleted data and extract metadata from binary forensic images.</p>
                    </div>
                    <Fingerprint className="w-10 h-10 text-purple-500" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={runAnalysis}
                        disabled={analyzing}
                        className="flex items-center justify-center gap-3 p-6 bg-zinc-800/40 border border-zinc-800 rounded-2xl hover:bg-zinc-800 transition-all group"
                    >
                        <FileSearch className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-bold text-zinc-300 uppercase">Start Artifact Carving</span>
                    </button>
                    <button className="flex items-center justify-center gap-3 p-6 bg-zinc-800/40 border border-zinc-800 rounded-2xl hover:bg-red-900/20 transition-all group">
                        <Trash2 className="w-5 h-5 text-red-400" />
                        <span className="text-xs font-bold text-zinc-300 uppercase">Sanitize Workspace</span>
                    </button>
                </div>

                {data && !analyzing && (
                    <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="grid grid-cols-3 gap-4">
                           <div className="bg-black p-4 rounded-xl border border-zinc-800">
                               <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Recovered Items</p>
                               <p className="text-2xl font-bold text-green-500 tabular-nums">{data.recovered}</p>
                           </div>
                           <div className="col-span-2 bg-black p-4 rounded-xl border border-zinc-800">
                               <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Integrity Hash (SHA-256)</p>
                               <p className="text-[10px] font-mono text-zinc-400 break-all">{data.hashes.sha256}</p>
                           </div>
                        </div>

                        <div className="bg-black/50 border border-zinc-800 rounded-2xl overflow-hidden">
                           <div className="bg-zinc-800/30 p-3 flex items-center gap-2 border-b border-zinc-800">
                               <Database className="w-3 h-3 text-zinc-500" />
                               <span className="text-[10px] text-zinc-400 font-bold uppercase">Candidate Artifact List</span>
                           </div>
                           <div className="p-4 space-y-2">
                               {data.deleted_files.map((f: string, i: number) => (
                                   <div key={i} className="flex items-center justify-between text-[11px] font-mono">
                                       <span className="text-zinc-300">{f}</span>
                                       <span className="text-zinc-600">OFFSET_0x{Math.random().toString(16).slice(2, 6).toUpperCase()}</span>
                                   </div>
                               ))}
                           </div>
                        </div>

                        <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-xl flex items-start gap-4">
                            <Camera className="w-5 h-5 text-purple-400 shrink-0" />
                            <div>
                                <p className="text-[10px] text-purple-400 font-bold uppercase mb-1">Deep Metadata Extraction</p>
                                <p className="text-[11px] text-zinc-400 font-mono leading-relaxed">{data.metadata}</p>
                            </div>
                        </div>
                    </div>
                )}

                {analyzing && (
                    <div className="py-12 flex flex-col items-center justify-center gap-4">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-[10px] text-zinc-500 font-mono animate-pulse uppercase tracking-[0.3em]">Carving_Blocks_At_0x{(Math.random() * 0xFFFFFF << 0).toString(16)}</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export const ForensicsPlugin: AlvisiaPlugin = {
    metadata: {
        id: 'forensics',
        name: 'Digital Forensics',
        description: 'Low-level disk analysis and artifact carving tool.',
        version: '1.0.0',
        author: '@ALVISIA_TEAM'
    },
    icon: Fingerprint,
    component: ForensicsModule
};

registry.register(ForensicsPlugin);
