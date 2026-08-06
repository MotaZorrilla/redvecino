import { useState } from 'react';
import { SimpleTable, StatusBadge } from '@/Components/DashboardShared';
import UnitDetailModal360 from '@/Components/Admin/UnitDetailModal360';
import Modal from '@/Components/Modal';

export default function TicketsList({
    adminFilteredUsers = [],
    adminFilteredTickets = [],
    ticketsList = [],
    setTicketsList,
    ticketStatusFilter,
    setTicketStatusFilter,
    ticketPriorityFilter,
    setTicketPriorityFilter,
    editingTicket,
    setEditingTicket,
    activeCondoName = 'Condominio Alameda'
}) {
    const [ticketSearchQuery, setTicketSearchQuery] = useState('');
    const [inspectingUnit360, setInspectingUnit360] = useState(null);
    const [isBannerDismissed, setIsBannerDismissed] = useState(false);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

    // Tickets pre-poblados con datos exactos del usuario
    const defaultResidentTickets = [
        {
            id: 101,
            unit: 'Torre 1 - Depto 142',
            creator_name: 'Miguel',
            email: 'ambiado@gmail.com',
            type: 'sugerencia',
            title: 'Deberían colocar un microondas en sala de eventos',
            description: 'Deberían colocar un microondas en sala de eventos para calentamiento de alimentos en eventos familiares.',
            created_at: '2026-06-30 00:02:05',
            status: 'open',
            priority: 'low'
        },
        {
            id: 102,
            unit: 'Torre 1 - Depto 142',
            creator_name: 'Rene',
            email: 'ambiado@gmail.com',
            type: 'queja',
            title: 'Robo de neumático de repuesto en estacionamiento',
            description: 'Me robaron el neumatico de repuesto de mi vehículo en la noche del lunes 23, llegue a las 23 hrs. y me di cuenta el 24 a las 8:00',
            created_at: '2026-06-29 23:26:33',
            status: 'in_progress',
            priority: 'high'
        }
    ];

    // Combinar tickets pre-poblados con tickets de props si existen
    const displayTickets = ticketsList && ticketsList.length > 0 ? ticketsList : defaultResidentTickets;

    const filteredTickets = displayTickets.filter(t => {
        if (ticketStatusFilter !== 'all' && t.status !== ticketStatusFilter) return false;
        if (selectedCategoryFilter !== 'all' && t.type !== selectedCategoryFilter) return false;
        if (ticketSearchQuery) {
            const q = ticketSearchQuery.toLowerCase();
            const titleMatch = t.title?.toLowerCase().includes(q);
            const descMatch = t.description?.toLowerCase().includes(q);
            const creatorMatch = t.creator_name?.toLowerCase().includes(q) || t.creator?.name?.toLowerCase().includes(q);
            const unitMatch = t.unit?.toLowerCase().includes(q);
            const emailMatch = t.email?.toLowerCase().includes(q);
            return titleMatch || descMatch || creatorMatch || unitMatch || emailMatch;
        }
        return true;
    });

    return (
        <div className="space-y-6 animate-fade-in text-left font-outfit w-full">
            {/* Header Módulo Tickets de Residentes */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <span className="text-[10px] font-black uppercase bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 px-3 py-1 rounded-full tracking-wider">
                        📩 Reclamaciones & Sugerencias de la Comunidad
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                        Tickets de Residentes
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Listado de consultas, sugerencias, quejas y reclamos recibidos y enviados por los residentes de {activeCondoName}.
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Filtrar Asunto:</span>
                    <select
                        value={selectedCategoryFilter}
                        onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                    >
                        <option value="all">🔍 Todos los Tipos</option>
                        <option value="sugerencia">💡 Sugerencias</option>
                        <option value="queja">⚠️ Quejas</option>
                        <option value="reclamo">🚨 Reclamos</option>
                        <option value="consulta">❓ Consultas</option>
                    </select>
                </div>
            </div>

            {/* Controls Toolbar a Ancho Completo */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                <div className="relative flex-1 min-w-[240px]">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 text-xs">🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar por departamento, nombre de residente, correo o asunto..."
                        value={ticketSearchQuery}
                        onChange={(e) => setTicketSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 font-medium"
                    />
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <select
                        value={ticketStatusFilter}
                        onChange={(e) => setTicketStatusFilter(e.target.value)}
                        className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">Todos los Estados</option>
                        <option value="open">Abierto / Recibido</option>
                        <option value="in_progress">En Progreso / Asignado</option>
                        <option value="resolved">Resuelto</option>
                    </select>
                </div>
            </div>

            {/* TABLA PRINCIPAL DE TICKETS DE RESIDENTES */}
            <div className="grid gap-6 lg:grid-cols-3 items-start">
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[750px]">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase text-slate-400">
                                    <th className="py-3 px-4">Unidad</th>
                                    <th className="py-3 px-4">Nombre</th>
                                    <th className="py-3 px-4">Contacto (Correo)</th>
                                    <th className="py-3 px-4">Tipo Asunto</th>
                                    <th className="py-3 px-4">Descripción</th>
                                    <th className="py-3 px-4">Fecha</th>
                                    <th className="py-3 px-4 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-bold">
                                {filteredTickets.map(t => (
                                    <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                                        <td className="py-3.5 px-4 font-black text-indigo-600 dark:text-indigo-400">
                                            <button
                                                type="button"
                                                onClick={() => setInspectingUnit360({ number: t.unit || '142', block: 'Torre 1' })}
                                                className="hover:underline text-left cursor-pointer"
                                            >
                                                {t.unit || 'Torre 1 - Depto 142'}
                                            </button>
                                        </td>
                                        <td className="py-3.5 px-4 text-slate-900 dark:text-white font-black">
                                            {t.creator_name || t.creator?.name || 'Residente'}
                                        </td>
                                        <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                                            {t.email || 'ambiado@gmail.com'}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                                t.type === 'queja' || t.type === 'reclamo'
                                                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                                                    : t.type === 'sugerencia'
                                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                                    : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                                            }`}>
                                                {t.type || 'consulta'}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 font-normal text-slate-700 dark:text-slate-300 max-w-[240px]">
                                            <p className="line-clamp-2">{t.description}</p>
                                        </td>
                                        <td className="py-3.5 px-4 font-mono text-[10px] text-slate-400 whitespace-nowrap">
                                            {t.created_at || '2026-06-30 00:02:05'}
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() => setEditingTicket(t)}
                                                className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-indigo-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-lg transition-all"
                                            >
                                                🔍 Inspeccionar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Panel lateral de inspección y asignación */}
                <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                    <h5 className="text-xs font-black text-slate-400 uppercase tracking-wider">Detalle del Ticket</h5>
                    {editingTicket ? (
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-xs text-indigo-500 font-bold">{editingTicket.unit || 'Torre 1 - Depto 142'}</span>
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/10 text-amber-600 border border-amber-500/20">
                                        {editingTicket.type || 'incidencia'}
                                    </span>
                                </div>
                                <h6 className="font-black text-sm text-slate-900 dark:text-white">{editingTicket.title}</h6>
                                <p className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 min-h-[60px] font-medium">{editingTicket.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <span className="text-[9px] text-slate-400 block uppercase font-bold">Solicitante:</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-200">{editingTicket.creator_name || editingTicket.creator?.name || 'Residente'}</span>
                                </div>
                                <div>
                                    <span className="text-[9px] text-slate-400 block uppercase font-bold">Contacto:</span>
                                    <span className="font-mono text-[11px] text-slate-500">{editingTicket.email || 'ambiado@gmail.com'}</span>
                                </div>
                            </div>

                            {/* Estado Update */}
                            <div>
                                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Estado de la Solicitud</label>
                                <select
                                    value={editingTicket.status || 'open'}
                                    onChange={(e) => {
                                        const updatedStatus = e.target.value;
                                        if (setTicketsList) {
                                            setTicketsList(prev => prev.map(t => t.id === editingTicket.id ? { ...t, status: updatedStatus } : t));
                                        }
                                        setEditingTicket(prev => ({ ...prev, status: updatedStatus }));
                                    }}
                                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-900 dark:text-white font-bold"
                                >
                                    <option value="open">Abierto / Recibido</option>
                                    <option value="in_progress">En Progreso / Asignado</option>
                                    <option value="resolved">Resuelto</option>
                                </select>
                            </div>
                        </div>
                    ) : (
                        <p className="text-xs text-slate-400 dark:text-slate-500 text-center py-8">Seleccione un ticket de la lista para inspeccionar y resolver.</p>
                    )}
                </div>
            </div>

            {/* Modal de Ficha Técnica 360° Interconectada */}
            {inspectingUnit360 && (
                <UnitDetailModal360
                    inspectingUnit={inspectingUnit360}
                    onClose={() => setInspectingUnit360(null)}
                    allProperties={adminFilteredUsers}
                    allTickets={displayTickets}
                    activeCondoName={activeCondoName}
                />
            )}
        </div>
    );
}
