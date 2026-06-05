import { useState } from 'react';
import axios from 'axios';

export default function DevOpsTelemetry({
    globalMaintenanceMode,
    setGlobalMaintenanceMode,
    cpuLoad,
    ramUsage,
    latency,
    terminalLogs,
    setTerminalLogs
}) {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-900 pb-4 mb-4">
                <button
                    type="button"
                    onClick={() => setGlobalMaintenanceMode(!globalMaintenanceMode)}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all duration-200 ${
                        globalMaintenanceMode
                            ? 'bg-orange-600/20 border-orange-500/50 text-orange-400 shadow-md shadow-orange-950/20 animate-pulse'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                >
                    <span className={`h-2 w-2 rounded-full ${globalMaintenanceMode ? 'bg-orange-500 animate-pulse' : 'bg-slate-500'}`} />
                    <span>⚠️ Mantenimiento: {globalMaintenanceMode ? 'BLOQUEO ACTIVO' : 'SISTEMA ONLINE (NORMAL)'}</span>
                </button>
                <span className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider text-right">database.sqlite &bull; online</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Carga CPU</span>
                    <span className="text-xl font-black text-white block mt-1 flex items-center gap-2">
                        {cpuLoad}%
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-teal"></span>
                        </span>
                    </span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">RAM Asignada</span>
                    <span className="text-xl font-black text-white block mt-1">{ramUsage} MB / 1024 MB</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Latencia Red</span>
                    <span className="text-xl font-black text-brand-teal block mt-1">{latency}ms</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Infraestructura</span>
                    <span className="text-xl font-black text-emerald-400 block mt-1 uppercase">Sana</span>
                </div>
            </div>

            {/* Syslog console (Expanded height) */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs overflow-hidden shadow-inner flex flex-col justify-between h-[400px]">
                <div className="space-y-1.5 overflow-y-auto max-h-[330px] text-brand-teal/95 text-left">
                    {terminalLogs.map((log, idx) => (
                        <div key={idx} className="flex gap-2">
                            <span className="text-slate-600 shrink-0">[{new Date().toLocaleTimeString('es-CL')}]</span>
                            <span className="break-all whitespace-pre-wrap">{log}</span>
                        </div>
                    ))}
                </div>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const cmd = e.target.commandInput.value.trim();
                    if (!cmd) return;
                    
                    if (cmd.startsWith('/help')) {
                        const reply = '[HELP] Comandos válidos en VPS: db:status, cache:clear, system:info, auth:permissions, logs:view, logs:clear, db:migrate, db:seed';
                        setTerminalLogs(prev => [...prev, `> ${cmd}`, reply]);
                        e.target.commandInput.value = '';
                        return;
                    }

                    setTerminalLogs(prev => [...prev, `> ${cmd}`]);
                    
                    axios.post('/api/ti/command', { command: cmd })
                        .then(res => {
                            setTerminalLogs(prev => [...prev, res.data.output]);
                        })
                        .catch(err => {
                            const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message;
                            setTerminalLogs(prev => [...prev, `[ERROR] Falló ejecución: ${errorMsg}`]);
                        });
                    
                    e.target.commandInput.value = '';
                }} className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-900">
                    <span className="text-slate-500 shrink-0 font-bold">$</span>
                    <input
                        type="text"
                        name="commandInput"
                        placeholder="Escribe un comando... (ej: /help, db:status, cache:clear, logs:view)"
                        className="flex-1 bg-transparent border-none focus:ring-2 focus:ring-brand-teal outline-none text-slate-100 text-xs p-0 placeholder-slate-600"
                    />
                    <button type="submit" className="px-3 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] text-slate-400 hover:text-white transition-all">Ejecutar</button>
                </form>
            </div>

            {/* Quick Command Buttons */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 space-y-3">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Acciones Rápidas DevOps (Programáticas VPS)</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { cmd: 'db:status', label: '📊 Estado BD', desc: 'Verifica SQLite' },
                        { cmd: 'cache:clear', label: '⚡ Limpiar Caché', desc: 'Config & App' },
                        { cmd: 'system:info', label: '⚙️ Info Sistema', desc: 'Versión PHP & OS' },
                        { cmd: 'auth:permissions', label: '🔐 Permisos Spatie', desc: 'Estado caché RBAC' },
                        { cmd: 'logs:view', label: '📁 Ver Logs', desc: 'Últimas 50 líneas' },
                        { cmd: 'logs:clear', label: '🗑️ Limpiar Logs', desc: 'Vaciar laravel.log' },
                        { cmd: 'db:migrate', label: '🚀 Migrar BD', desc: 'Artisan migrate' },
                        { cmd: 'db:seed', label: '🌱 Semillar BD', desc: 'Artisan db:seed' }
                    ].map(btn => (
                        <button
                            key={btn.cmd}
                            type="button"
                            onClick={() => {
                                setTerminalLogs(prev => [...prev, `> ${btn.cmd}`]);
                                axios.post('/api/ti/command', { command: btn.cmd })
                                    .then(res => {
                                        setTerminalLogs(prev => [...prev, res.data.output]);
                                    })
                                    .catch(err => {
                                        const errorMsg = err.response?.data?.error || err.response?.data?.message || err.message;
                                        setTerminalLogs(prev => [...prev, `[ERROR] Falló: ${errorMsg}`]);
                                    });
                            }}
                            className="bg-white dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:border-brand-teal/40 p-3 rounded-xl text-left transition-all duration-200 cursor-pointer group flex flex-col justify-between h-[72px] shadow-sm"
                        >
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-teal transition-colors">{btn.label}</span>
                            <span className="text-[9px] text-slate-400 dark:text-slate-550 mt-1 leading-normal">{btn.desc}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
