import { LucideIcon } from 'lucide-react';
import React from 'react';

export interface PluginMetadata {
    id: string;
    name: string;
    description: string;
    version: string;
    author: string;
}

export interface AlvisiaPlugin {
    metadata: PluginMetadata;
    icon: LucideIcon;
    component: React.ComponentType<{ addLog: (msg: string, level?: any) => void }>;
}

class PluginRegistry {
    private plugins: Map<string, AlvisiaPlugin> = new Map();

    register(plugin: AlvisiaPlugin) {
        if (this.plugins.has(plugin.metadata.id)) {
            console.warn(`Plugin ${plugin.metadata.id} is already registered. Overwriting.`);
        }
        this.plugins.set(plugin.metadata.id, plugin);
    }

    getPlugins(): AlvisiaPlugin[] {
        return Array.from(this.plugins.values());
    }

    getPlugin(id: string): AlvisiaPlugin | undefined {
        return this.plugins.get(id);
    }
}

export const registry = new PluginRegistry();
