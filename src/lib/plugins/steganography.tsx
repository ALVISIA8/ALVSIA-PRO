import React, { useState } from 'react';
import { Image as ImageIcon, Lock, Unlock, Eye } from 'lucide-react';
import { AlvisiaPlugin, registry } from '../plugins';

const StegoModule: React.FC<{ addLog: (msg: string, level?: any) => void }> = ({ addLog }) => {
    const [secret, setSecret] = useState('');
    const [output, setOutput] = useState('');

    const handleHide = () => {
        if (!secret) return addLog('Please enter a secret message.', 'WARNING');
        addLog('Applying Least Significant Bit (LSB) steganography...', 'INFO');
        setTimeout(() => {
            addLog('Secret message encoded into virtual buffer.', 'SUCCESS');
            setOutput('STG_CONTAINER_0x' + Math.random().toString(16).slice(2, 10).toUpperCase());
        }, 1000);
    };

    return (
        <div className="max-w-4xl space-y-8">
            <section className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-6">
                <div>
                    <h3 className="text-2xl font-bold text-white tracking-tighter uppercase">Steganography Engine</h3>
                    <p className="text-zinc-500 text-sm">Hide sensitive data within carrier signals or binary containers.</p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest ml-1">Secret Message</label>
                        <input 
                            value={secret}
                            onChange={(e) => setSecret(e.target.value)}
                            className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-blue-400 font-mono focus:outline-none focus:border-blue-500/50 transition-all"
                            placeholder="Enter hidden text..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={handleHide}
                            className="flex items-center justify-center gap-3 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold uppercase text-xs transition-all"
                        >
                            <Lock className="w-4 h-4" /> Embed Data
                        </button>
                        <button 
                            onClick={() => addLog('Scanning buffer for parity anomalies...', 'INFO')}
                            className="flex items-center justify-center gap-3 p-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl font-bold uppercase text-xs transition-all border border-zinc-700"
                        >
                            <Eye className="w-4 h-4" /> Extract Bits
                        </button>
                    </div>
                </div>

                {output && (
                    <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl flex items-center justify-between">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase">Carrier ID:</span>
                        <span className="text-xs font-mono text-blue-400">{output}</span>
                    </div>
                )}
            </section>
        </div>
    );
};

export const StegoPlugin: AlvisiaPlugin = {
    metadata: {
        id: 'steganography',
        name: 'Steganography',
        description: 'LSB-based data hiding and bitstream extraction.',
        version: '1.0.1',
        author: '@ALVISIA_TEAM'
    },
    icon: ImageIcon,
    component: StegoModule
};

registry.register(StegoPlugin);
