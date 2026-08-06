import { useState } from 'react';
import { SimpleTable, StatusBadge } from '@/Components/DashboardShared';
import UnitDetailModal360 from '@/Components/Admin/UnitDetailModal360';

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

    return (
        <div className="space-y-6 animate-fade-in text-left font-outfit">
            {/* Banner de Cabecera Generoso Colapsable del Módulo de Tickets */}
            {!isBannerDismissed ? (
                <div className="bg-gradient-to-r from-indigo-50/80 via-white to-slate-50 dark:from-indigo-950/60 dark:via-slate-900 dark:to-slate-950 border border-indigo-200/80 dark:border-indigo-900/40 rounded-2xl p-6 relative overflow-hidden shadow-xs">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                        <div className="space-y-1 max-w-3xl">
                            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                                🛠️ Atención & Solicitudes Comunitarias
                            </span>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                Tickets de Asistencia, Reclamos & Manutención
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                Consola central de resolución de solicitudes de los residentes de {activeCondoName}. Clasifique las incidencias por categoría o prioridad, asigne personal colaborador o conserjería, audite la bitácora de seguimiento e inspeccione la Ficha 360° del departamento involucrado.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsBannerDismissed(true)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shrink-0 self-start md:self-center"
                            title="Minimizar cabecera informativa"
                        >
                            <span>✕ Minimizar</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex justify-start">
                    <button
                        type="button"
                        onClick={() => setIsBannerDismissed(false)}
                        className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800/60"
                    >
                        <span>ℹ️ Mostrar guía de Tickets & Solicitudes</span>
                        <span>▼</span>
                    </button>
                </div>
            )}

            {/* Controls Toolbar a Ancho Completo */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                <div className="relative flex-1 min-w-[240px]">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 text-xs">🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar ticket, vecino, categoría..."
                        value={ticketSearchQuery}
                        onChange={(e) => setTicketSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <select
                        value={ticketStatusFilter}
                        onChange={(e) => setTicketStatusFilter(e.target.value)}
                        className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">Todos los Estados</option>
                        <option value="open">Abierto</option>
                        <option value="in_progress">En Progreso</option>
                        <option value="resolved">Resuelto</option>
                    </select>

                    <select
                        value={ticketPriorityFilter}
                        onChange={(e) => setTicketPriorityFilter(e.target.value)}
                        className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="all">Todas las Prioridades</option>
                        <option value="low">Baja</option>
                        <option value="medium">Media</option>
                        <option value="high">Alta</option>
                    </select>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3 items-start">
                {/* Tickets List */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    <SimpleTable
                        headers={['ID', 'Título', 'Vecino / Unidad', 'Prioridad', 'Estado', 'Acción']}
                        rows={adminFilteredTickets
                            .filter(t => {
                                if (ticketStatusFilter !== 'all' && t.status !== ticketStatusFilter) return false;
                                if (ticketPriorityFilter !== 'all' && t.priority !== ticketPriorityFilter) return false;
                                if (ticketSearchQuery) {
                                    const q = ticketSearchQuery.toLowerCase();
                                    const titleMatch = t.title?.toLowerCase().includes(q);
                                    const descMatch = t.description?.toLowerCase().includes(q);
                                    const creatorMatch = t.creator?.name?.toLowerCase().includes(q);
                                    const catMatch = t.category?.name?.toLowerCase().includes(q);
                                    return titleMatch || descMatch || creatorMatch || catMatch;
                                }
                                return true;
                            })
                            .map(t => ({
                                cells: [
                                    <span className="font-mono text-xs text-slate-500" key={`id-${t.id}`}>#{t.id}</span>,
                                    <span className="font-bold text-gray-900 dark:text-white truncate block max-w-[160px]" key={`title-${t.id}`}>{t.title}</span>,
                                    <div className="flex flex-col" key={`creator-${t.id}`}>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white">{t.creator?.name || 'Vecino'}</span>
                                        <button
                                            type="button"
                                            onClick={() => setInspectingUnit360({ number: t.unit || '501', id: t.property_id || '501' })}
                                            className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-extrabold flex items-center gap-1"
                                        >
                                            🏢 Depto {t.unit || '501'}
                                        </button>
                                    </div>,
                                    <StatusBadge key={`prio-${t.id}`} status={t.priority} type="priority" />,
                                    <StatusBadge key={`status-${t.id}`} status={t.status} type="ticket" />,
                                    <button
                                        key={`act-${t.id}`}
                                        type="button"
                                        aria-label={`Inspeccionar ticket ${t.title}`}
                                        onClick={() => setEditingTicket(t)}
                                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-indigo-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-lg transition-all"
                                    >
                                        🔍 Inspeccionar
                                    </button>
                                ]
                            }))
                        }
                        emptyMessage="No hay tickets que coincidan con los filtros"
                    />
                </div>

                {/* Details & Assignment Card */}
                <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-4">
                    <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detalle del Ticket</h5>
                    {editingTicket ? (
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <span className="font-mono text-xs text-slate-500 font-bold">#{editingTicket.id}</span>
                                    <StatusBadge status={editingTicket.priority} type="priority" />
                                </div>
                                <h6 className="font-bold text-sm text-gray-900 dark:text-white">{editingTicket.title}</h6>
                                <p className="text-xs text-gray-600 dark:text-slate-400 bg-white dark:bg-slate-950 p-3 rounded-lg border border-gray-200 dark:border-slate-800/80 min-h-[60px]">{editingTicket.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <span className="text-[9px] text-slate-400 block uppercase font-bold">Solicitante:</span>
                                    <span className="font-medium">{editingTicket.creator?.name || 'Coproprietario'}</span>
                                </div>
                                <div>
                                    <span className="text-[9px] text-slate-400 block uppercase font-bold">Categoría:</span>
                                    <span className="font-medium">{editingTicket.category?.name || 'Mantenimiento'}</span>
                                </div>
                            </div>

                            {/* Status Update */}
                            <div>
                                <label htmlFor="ticket-status" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Estado de la Solicitud</label>
                                <select
                                    id="ticket-status"
                                    value={editingTicket.status}
                                    onChange={(e) => {
                                        const updatedStatus = e.target.value;
                                        setTicketsList(prev => prev.map(t => t.id === editingTicket.id ? { ...t, status: updatedStatus } : t));
                                        setEditingTicket(prev => ({ ...prev, status: updatedStatus }));
                                    }}
                                    className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                                >
                                    <option value="open">Abierto / Recibido</option>
                                    <option value="in_progress">En Progreso / Asignado</option>
                                    <option value="resolved">Resuelto</option>
                                </select>
                            </div>

                            {/* Employee Assignment */}
                            <div>
                                <label htmlFor="ticket-assignee" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Asignar Operador / Conserje</label>
                                <select
                                    id="ticket-assignee"
                                    value={editingTicket.assigned_to || ''}
                                    onChange={(e) => {
                                        const assigneeName = e.target.value;
                                        setTicketsList(prev => prev.map(t => t.id === editingTicket.id ? { ...t, assigned_to: assigneeName } : t));
                                        setEditingTicket(prev => ({ ...prev, assigned_to: assigneeName }));
                                    }}
                                    className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                                >
                                    <option value="">Sin Asignar</option>
                                    {adminFilteredUsers
                                        .filter(u => u.roles?.some(r => ['employee', 'colaborador', 'comite', 'admin'].includes(r.toLowerCase())))
                                        .map(u => (
                                            <option key={u.id} value={u.name}>{u.name} ({u.roles[0]})</option>
                                        ))
                                    }
                                </select>
                            </div>
                            
                            {editingTicket.assigned_to && (
                                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-500 text-xs rounded-xl flex items-center gap-2">
                                    <span>👷</span>
                                    <span>Asignado correctamente a <strong>{editingTicket.assigned_to}</strong></span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-400 dark:text-slate-500 text-center py-8">Seleccione un ticket de la lista para inspeccionar y resolver.</p>
                    )}
                </div>
            </div>

            {/* Modal de Ficha Técnica 360° Interconectada */}
            <UnitDetailModal360
                inspectingUnit={inspectingUnit360}
                onClose={() => setInspectingUnit360(null)}
                allProperties={adminFilteredUsers}
                allTickets={ticketsList}
                activeCondoName={activeCondoName}
            />
        </div>
    );
}
