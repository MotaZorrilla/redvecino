import { useState } from 'react';

function LocalBadge({ children, variant = 'default' }) {
    const variants = {
        default: 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300 dark:border dark:border-slate-700/60',
        success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-500 dark:border dark:border-emerald-500/20',
        warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 dark:border dark:border-amber-500/20',
        danger: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 dark:border dark:border-rose-500/20',
        info: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 dark:border dark:border-blue-500/20',
        purple: 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400 dark:border dark:border-violet-500/20',
    };

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant] || variants.default}`}>
            {children}
        </span>
    );
}

function LocalStatusBadge({ status, type = 'status' }) {
    const configs = {
        status: {
            active: { label: 'Activo', variant: 'success' },
            inactive: { label: 'Inactivo', variant: 'danger' },
            occupied: { label: 'Ocupado', variant: 'success' },
            vacant: { label: 'Disponible', variant: 'warning' },
        },
        ticket: {
            open: { label: 'Abierto', variant: 'info' },
            in_progress: { label: 'En Progreso', variant: 'warning' },
            resolved: { label: 'Resuelto', variant: 'success' },
            closed: { label: 'Cerrado', variant: 'default' },
            cancelled: { label: 'Cancelado', variant: 'danger' },
        },
        priority: {
            low: { label: 'Baja', variant: 'default' },
            medium: { label: 'Media', variant: 'warning' },
            high: { label: 'Alta', variant: 'danger' },
            urgent: { label: 'Urgente', variant: 'danger' },
        },
        payment: {
            pending: { label: 'Pendiente', variant: 'warning' },
            completed: { label: 'Pagado', variant: 'success' },
            overdue: { label: 'Vencido', variant: 'danger' },
            cancelled: { label: 'Cancelado', variant: 'default' },
        },
    };

    const config = configs[type]?.[status] || { label: status, variant: 'default' };
    return <LocalBadge variant={config.variant}>{config.label}</LocalBadge>;
}

export default function SandboxInspeccion({
    sandboxCondoId,
    setSandboxCondoId,
    sandboxModule,
    setSandboxModule,
    condosList = [],
    propertiesList = [],
    ticketsList = [],
    paymentsList = [],
    stats = {},
    auditedMessagesState = [],
    packages = [],
    setImpersonatedUser,
    setTerminalLogs,
    usersList = []
}) {
    return (
        <div className="space-y-6 animate-fade-in text-left">
            {/* Condominium Selector */}
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Condominio:</label>
                    <select
                        value={sandboxCondoId}
                        onChange={(e) => setSandboxCondoId(e.target.value)}
                        className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:border-[#00A896] cursor-pointer"
                    >
                        <option value="all" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">Todos los Condominios</option>
                        {condosList.map(c => (
                            <option key={c.id} value={c.id} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">{c.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Module Sub-tabs */}
            <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
                {[
                    { id: 'map', name: '🏢 Mapa de Ocupación' },
                    { id: 'tickets', name: '🛠️ Tickets' },
                    { id: 'finances', name: '💵 Finanzas' },
                    { id: 'chats', name: '💬 Auditoría de Chats' },
                    { id: 'ocr', name: '📦 Correspondencia OCR' },
                ].map(mod => (
                    <button
                        key={mod.id}
                        type="button"
                        onClick={() => setSandboxModule(mod.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            sandboxModule === mod.id
                                ? 'bg-[#00A896]/20 text-[#00A896] border border-[#00A896]/30'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                        }`}
                    >
                        {mod.name}
                    </button>
                ))}
            </div>

            {/* Sandbox Module Content */}
            {sandboxModule === 'map' && (
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-inner">
                    <h5 className="text-xs font-bold text-slate-300 mb-4 flex items-center gap-2">
                        <span className="text-[#00A896]">●</span>
                        Mapa de Ocupación {sandboxCondoId !== 'all' ? `— ${condosList.find(c => c.id === Number(sandboxCondoId))?.name || ''}` : '(Todos los condominios)'}
                    </h5>
                    <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2">
                        {propertiesList
                            .filter(p => sandboxCondoId === 'all' || p.condominium_id === Number(sandboxCondoId))
                            .map(p => {
                                const ownerName = p.owners?.[0];
                                const residentName = p.residents?.[0];
                                const matched = usersList.find(u => 
                                    (ownerName && u.name.toLowerCase() === ownerName.toLowerCase()) ||
                                    (residentName && u.name.toLowerCase() === residentName.toLowerCase())
                                );

                                return (
                                    <div
                                        key={p.id}
                                        onClick={() => {
                                            setTerminalLogs(prev => [...prev, `[SANDBOX] Inspeccionando propiedad #${p.id}: ${p.number} (${p.status === 'occupied' ? 'Ocupado' : 'Disponible'})`]);
                                            if (matched) {
                                                setTerminalLogs(prev => [...prev, `[SANDBOX] Auto-impersonando usuario responsable: ${matched.name} (${matched.roles?.[0] || 'Residente'})`]);
                                                setImpersonatedUser(matched);
                                            } else {
                                                setTerminalLogs(prev => [...prev, `[SANDBOX] No se encontró un usuario activo asociado a la propiedad ${p.number}.`]);
                                            }
                                        }}
                                        className={`p-2 rounded-xl border text-center cursor-pointer transition-all hover:scale-105 ${
                                            p.status === 'occupied'
                                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                                : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50 text-slate-500 dark:text-slate-400'
                                        }`}
                                        title={matched ? `Usuario: ${matched.name} (${matched.roles?.[0] || 'Residente'})` : 'Sin asignar'}
                                    >
                                        <span className="text-[9px] font-bold block">{p.number}</span>
                                        <span className="text-[7px] opacity-70 block">{p.type}</span>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}

            {sandboxModule === 'tickets' && (
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-inner">
                    <h5 className="text-xs font-bold text-slate-300 mb-4 flex items-center gap-2">
                        <span className="text-[#00A896]">●</span>
                        Tickets e Incidencias {sandboxCondoId !== 'all' ? `— ${condosList.find(c => c.id === Number(sandboxCondoId))?.name || ''}` : '(Todos los condominios)'}
                    </h5>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {ticketsList
                            .filter(t => sandboxCondoId === 'all' || t.property?.condominium_id === Number(sandboxCondoId))
                            .slice(0, 8)
                            .map(t => (
                                <div key={t.id} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/60">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <span className="text-[10px] font-mono text-slate-500 shrink-0">#{t.id}</span>
                                        <span className="text-xs font-medium text-slate-200 truncate">{t.title}</span>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <LocalStatusBadge status={t.priority} type="priority" />
                                        <LocalStatusBadge status={t.status} type="ticket" />
                                    </div>
                                </div>
                            ))}
                        {ticketsList.filter(t => sandboxCondoId === 'all' || t.property?.condominium_id === Number(sandboxCondoId)).length === 0 && (
                            <p className="text-xs text-slate-500 text-center py-4">No hay tickets para este condominio.</p>
                        )}
                    </div>
                </div>
            )}

            {sandboxModule === 'finances' && (
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-inner">
                    <h5 className="text-xs font-bold text-slate-300 mb-4 flex items-center gap-2">
                        <span className="text-[#00A896]">●</span>
                        Finanzas y Cobros {sandboxCondoId !== 'all' ? `— ${condosList.find(c => c.id === Number(sandboxCondoId))?.name || ''}` : '(Todos los condominios)'}
                    </h5>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/60">
                            <span className="text-[10px] text-slate-400 block">Total Gastos</span>
                            <span className="text-lg font-black text-slate-100">${Number(stats?.finances?.totalExpenses || 0).toLocaleString()}</span>
                        </div>
                        <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/60">
                            <span className="text-[10px] text-slate-400 block">Total Pagos</span>
                            <span className="text-lg font-black text-emerald-400">${Number(stats?.finances?.totalPayments || 0).toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                        {paymentsList
                            .filter(p => sandboxCondoId === 'all' || p.property?.condominium_id === Number(sandboxCondoId))
                            .slice(0, 6)
                            .map(p => (
                                <div key={p.id} className="flex items-center justify-between p-2 bg-slate-950/50 rounded-xl border border-slate-800/60">
                                    <span className="text-xs text-slate-400">{p.user?.name || '-'} — Prop #{p.property_id}</span>
                                    <span className="text-xs font-bold text-slate-200">${Number(p.amount).toLocaleString()}</span>
                                </div>
                            ))}
                    </div>
                </div>
            )}

            {sandboxModule === 'chats' && (
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-inner">
                    <h5 className="text-xs font-bold text-slate-300 mb-4 flex items-center gap-2">
                        <span className="text-[#00A896]">●</span>
                        Auditoría de Mensajería {sandboxCondoId !== 'all' ? `— ${condosList.find(c => c.id === Number(sandboxCondoId))?.name || ''}` : '(Todos los condominios)'}
                    </h5>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {auditedMessagesState.slice(0, 8).map(msg => (
                            <div key={msg.id} className="flex items-start gap-3 p-3 bg-slate-950/50 rounded-xl border border-slate-800/60">
                                <div className="h-7 w-7 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-300 shrink-0">
                                    {msg.sender_name?.charAt(0)}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-slate-300">{msg.sender_name}</span>
                                        <span className="text-[8px] text-slate-600">→ {msg.receiver_name}</span>
                                        <span className="text-[8px] text-slate-600 ml-auto">{msg.time}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-400 mt-1 truncate">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {sandboxModule === 'ocr' && (
                <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-inner">
                    <h5 className="text-xs font-bold text-slate-300 mb-4 flex items-center gap-2">
                        <span className="text-[#00A896]">●</span>
                        Correspondencia y Paquetería {sandboxCondoId !== 'all' ? `— ${condosList.find(c => c.id === Number(sandboxCondoId))?.name || ''}` : '(Todos los condominios)'}
                    </h5>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                        {packages.map(pkg => (
                            <div key={pkg.id} className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/60">
                                <div className="flex items-center gap-3 min-w-0">
                                    <span className={`text-[10px] font-mono ${pkg.status === 'completed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                        {pkg.status === 'completed' ? '📦' : '📋'}
                                    </span>
                                    <div className="min-w-0">
                                        <span className="text-xs font-medium text-slate-200 block truncate">{pkg.tracking}</span>
                                        <span className="text-[9px] text-slate-500">{pkg.carrier} → {pkg.resident}</span>
                                    </div>
                                </div>
                                <span className="text-[9px] text-slate-600 shrink-0">{pkg.date}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
