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

export default function TiTicketsGestion({
    ticketsList = [],
    setTicketsList,
    showAddTicketForm,
    setShowAddTicketForm,
    newTicketForm,
    setNewTicketForm,
    isListeningVoice,
    setIsListeningVoice,
    voiceTextSimulated,
    setVoiceTextSimulated,
    user,
    setTerminalLogs
}) {
    return (
        <div className="space-y-6 animate-fade-in text-left">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <h4 className="text-sm font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
                    🛠️ Gestión de Tickets e Incidencias
                </h4>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            setIsListeningVoice(true);
                            setVoiceTextSimulated("");
                            setTerminalLogs(prev => [...prev, "[VOICE] Escuchando audio del usuario..."]);
                            const phrase = "Hola, hay una filtración de agua importante en el pasillo del piso 3, sale agua del depto 304.";
                            let currentText = "";
                            let i = 0;
                            const interval = setInterval(() => {
                                currentText += phrase[i];
                                setVoiceTextSimulated(currentText);
                                i++;
                                if (i >= phrase.length) {
                                    clearInterval(interval);
                                    setIsListeningVoice(false);
                                    const newT = {
                                        id: ticketsList.length + 1,
                                        title: "Filtración en Pasillo Piso 3",
                                        description: phrase,
                                        priority: "high",
                                        status: "open",
                                        category: { name: "Plomería" },
                                        creator: { name: user?.name || 'Residente' },
                                        created_at: new Date().toISOString()
                                    };
                                    setTicketsList(prev => [newT, ...prev]);
                                    setTerminalLogs(prev => [...prev, "[VOICE] Ticket creado automáticamente por IA: 'Filtración en Pasillo Piso 3'"]);
                                    alert("Reporte de Voz IA: Se ha creado el ticket automáticamente y se clasificó en Plomería.");
                                }
                            }, 50);
                        }}
                        disabled={isListeningVoice}
                        className="px-4 py-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0 cursor-pointer disabled:cursor-not-allowed"
                    >
                        🎤 {isListeningVoice ? 'Escuchando...' : 'Reportar Incidencia por Voz (Simulado)'}
                    </button>
                    
                    <button
                        onClick={() => setShowAddTicketForm(!showAddTicketForm)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all shrink-0"
                    >
                        {showAddTicketForm ? 'Cerrar Formulario' : 'Crear Ticket'}
                    </button>
                </div>
            </div>

            {isListeningVoice && (
                <div className="bg-slate-900 border border-rose-500/30 p-4 rounded-xl flex items-center gap-3 animate-pulse">
                    <span className="flex h-3 w-3 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                    </span>
                    <span className="text-xs text-rose-400 font-mono">Transcripción en vivo: "{voiceTextSimulated}"</span>
                </div>
            )}

            {showAddTicketForm && (
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const newT = {
                        id: ticketsList.length + 1,
                        title: newTicketForm.title,
                        description: newTicketForm.description,
                        priority: newTicketForm.priority,
                        status: 'open',
                        category: { name: newTicketForm.category_id === 1 ? 'Mantenimiento' : 'Plomería' },
                        creator: { name: user?.name || 'Residente' }
                    };
                    setTicketsList(prev => [newT, ...prev]);
                    setTerminalLogs(prev => [...prev, `[TICKET] Creado ticket #${newT.id}: ${newT.title}`]);
                    setShowAddTicketForm(false);
                    setNewTicketForm({ property_id: '', title: '', description: '', priority: 'medium', category_id: 1 });
                }} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-4 max-w-xl text-left">
                    <h5 className="text-xs font-bold text-slate-300 uppercase">Detalles del Ticket</h5>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Título</label>
                            <input
                                type="text"
                                required
                                value={newTicketForm.title}
                                onChange={(e) => setNewTicketForm(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs px-3 py-2 text-white focus:outline-none focus:border-[#00A896]"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Prioridad</label>
                            <select
                                value={newTicketForm.priority}
                                onChange={(e) => setNewTicketForm(prev => ({ ...prev, priority: e.target.value }))}
                                className="w-full bg-slate-955 border border-slate-800 rounded-xl text-xs px-3 py-2 text-white focus:outline-none focus:border-[#00A896] cursor-pointer"
                            >
                                <option value="low">Baja</option>
                                <option value="medium">Media</option>
                                <option value="high">Alta</option>
                                <option value="urgent">Urgente</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Descripción</label>
                        <textarea
                            required
                            value={newTicketForm.description}
                            onChange={(e) => setNewTicketForm(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs px-3 py-2 text-white focus:outline-none focus:border-[#00A896] h-20"
                        />
                    </div>
                    <button type="submit" className="px-4 py-2 bg-[#00A896] hover:bg-[#00A896]/80 text-white font-bold text-xs rounded-xl shadow-md">
                        Guardar Ticket
                    </button>
                </form>
            )}

            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden shadow-inner">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="bg-slate-950 text-slate-500 border-b border-slate-800">
                                <th className="p-4 font-black text-left">ID</th>
                                <th className="p-4 font-black text-left">Título</th>
                                <th className="p-4 font-black text-left">Categoría</th>
                                <th className="p-4 font-black text-left">Prioridad</th>
                                <th className="p-4 font-black text-left">Estado</th>
                                <th className="p-4 font-black text-left">Creado por</th>
                                <th className="p-4 font-black text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                            {ticketsList.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-900/60">
                                    <td className="p-4 font-bold text-slate-100 text-left">#{t.id}</td>
                                    <td className="p-4 text-left font-bold">{t.title}</td>
                                    <td className="p-4 text-left">{t.category?.name || 'Mantenimiento'}</td>
                                    <td className="p-4 text-left"><LocalStatusBadge status={t.priority} type="priority" /></td>
                                    <td className="p-4 text-left"><LocalStatusBadge status={t.status} type="ticket" /></td>
                                    <td className="p-4 text-left">{t.creator?.name || 'Residente'}</td>
                                    <td className="p-4 text-right">
                                        {t.status === 'open' && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setTicketsList(prev => prev.map(item => item.id === t.id ? { ...item, status: 'resolved' } : item));
                                                    setTerminalLogs(prev => [...prev, `[TICKET] Ticket #${t.id} resuelto.`]);
                                                }}
                                                className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] rounded font-bold hover:bg-emerald-500/20"
                                            >
                                                Resolver
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
