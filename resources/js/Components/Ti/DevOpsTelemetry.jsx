import { useState } from 'react';

export default function DevOpsTelemetry({
    globalMaintenanceMode,
    setGlobalMaintenanceMode,
    cpuLoad,
    ramUsage,
    latency,
    terminalLogs,
    setTerminalLogs,
    usersList,
    propertiesList,
    rbMatrix,
    handleTogglePermission
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
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A896] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00A896]"></span>
                        </span>
                    </span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">RAM Asignada</span>
                    <span className="text-xl font-black text-white block mt-1">{ramUsage} MB / 1024 MB</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Latencia Red</span>
                    <span className="text-xl font-black text-[#00A896] block mt-1">{latency}ms</span>
                </div>
                <div className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl">
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Infraestructura</span>
                    <span className="text-xl font-black text-emerald-400 block mt-1 uppercase">Sana</span>
                </div>
            </div>

            {/* Syslog console */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs overflow-hidden shadow-inner flex flex-col justify-between h-[200px]">
                <div className="space-y-1.5 overflow-y-auto max-h-[140px] text-[#00A896]/95 text-left">
                    {terminalLogs.map((log, idx) => (
                        <div key={idx} className="flex gap-2">
                            <span className="text-slate-600 shrink-0">[{new Date().toLocaleTimeString('es-CL')}]</span>
                            <span className="break-all">{log}</span>
                        </div>
                    ))}
                </div>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const cmd = e.target.commandInput.value.trim();
                    if (!cmd) return;
                    let reply = `[CMD] '${cmd}' ejecutado sin resultados.`;
                    if (cmd.startsWith('/help')) {
                        reply = '[HELP] Comandos válidos: db:status, cache:clear, system:info, auth:permissions';
                    } else if (cmd === 'db:status') {
                        reply = '[DATABASE] SQLite: OK. ' + usersList.length + ' usuarios, ' + propertiesList.length + ' departamentos cargados.';
                    } else if (cmd === 'cache:clear') {
                        reply = '[CACHE] Éxito: Caché de la aplicación de RedVecino limpiada por completo (Vite & Laravel).';
                    } else if (cmd === 'system:info') {
                        reply = '[SYSTEM] OS: Windows/Host XAMPP. DB: sqlite. PHP: 8.2. Laravel: 10. React: 18.';
                    } else if (cmd === 'auth:permissions') {
                        reply = '[SPATIE] Roles: Admin (All), TI (All), Resident (Limited), Conserje (Audits).';
                    }
                    setTerminalLogs(prev => [...prev, `> ${cmd}`, reply]);
                    e.target.commandInput.value = '';
                }} className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-900">
                    <span className="text-slate-500 shrink-0 font-bold">$</span>
                    <input
                        type="text"
                        name="commandInput"
                        placeholder="Escribe un comando... (ej: /help, db:status, cache:clear)"
                        className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-slate-100 text-xs p-0 placeholder-slate-600"
                    />
                    <button type="submit" className="px-3 py-1 bg-slate-900 border border-slate-800 rounded text-[10px] text-slate-400 hover:text-white transition-all">Ejecutar</button>
                </form>
            </div>

            {/* RBAC Matrix */}
            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Matriz Interactiva de Permisos Spatie (RBAC)</h5>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px] font-mono">
                        <thead>
                            <tr className="border-b border-slate-800 text-slate-500">
                                <th className="py-2 pr-4 text-left">Permiso / Operación</th>
                                <th className="py-2 text-center">TI (DevOps)</th>
                                <th className="py-2 text-center">Administrador</th>
                                <th className="py-2 text-center">Conserjería</th>
                                <th className="py-2 text-center">Residente</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                            {[
                                { p: 'ver_finanzas_global', roles: ['ti', 'admin'] },
                                { p: 'impersonar_residentes', roles: ['ti', 'admin'] },
                                { p: 'auditar_conversaciones', roles: ['ti', 'admin', 'employee'] },
                                { p: 'simular_ocr_conserje', roles: ['ti', 'admin', 'employee'] },
                                { p: 'modificar_sistema_config', roles: ['ti'] }
                            ].map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-900/50">
                                    <td className="py-2.5 font-bold text-slate-200 text-left">{row.p}</td>
                                    {['ti', 'admin', 'employee', 'resident'].map((roleKey, rIdx) => {
                                        const hasPerm = rbMatrix[roleKey]?.[row.p] ?? row.roles.includes(roleKey);
                                        return (
                                            <td key={rIdx} className="py-2.5 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleTogglePermission(roleKey, row.p)}
                                                    className={`inline-block h-3.5 w-3.5 rounded-full border ${
                                                        hasPerm
                                                            ? 'bg-[#00A896]/20 border-[#00A896] text-[#00A896]'
                                                            : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                                                    } flex items-center justify-center mx-auto text-[9px] font-black`}
                                                >
                                                    {hasPerm ? '✓' : '✗'}
                                                </button>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
