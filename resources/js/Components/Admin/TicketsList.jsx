import { useState } from 'react';
import { SimpleTable, StatusBadge } from '@/Components/DashboardShared';

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
    setEditingTicket
}) {
    return (
        <div className="space-y-6 animate-fade-in text-left">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                        🛠️ Consola de Tickets e Infracciones
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Inspecciona, asigna personal y resuelve incidentes de copropietarios.</p>
                </div>
                
                {/* Filters */}
                <div className="flex items-center gap-3">
                    <select
                        value={ticketStatusFilter}
                        onChange={(e) => setTicketStatusFilter(e.target.value)}
                        className="px-3 py-1.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800/80 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                    >
                        <option value="all">Todos los Estados</option>
                        <option value="open">Abierto</option>
                        <option value="in_progress">En Progreso</option>
                        <option value="resolved">Resuelto</option>
                    </select>
                    <select
                        value={ticketPriorityFilter}
                        onChange={(e) => setTicketPriorityFilter(e.target.value)}
                        className="px-3 py-1.5 bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800/80 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
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
                        headers={['ID', 'Título', 'Vecino', 'Prioridad', 'Estado', 'Acción']}
                        rows={adminFilteredTickets
                            .filter(t => {
                                if (ticketStatusFilter !== 'all' && t.status !== ticketStatusFilter) return false;
                                if (ticketPriorityFilter !== 'all' && t.priority !== ticketPriorityFilter) return false;
                                return true;
                            })
                            .map(t => ({
                                cells: [
                                    <span className="font-mono text-xs text-slate-500" key={`id-${t.id}`}>#{t.id}</span>,
                                    <span className="font-bold text-gray-900 dark:text-white truncate block max-w-[160px]" key={`title-${t.id}`}>{t.title}</span>,
                                    <span className="text-xs" key={`creator-${t.id}`}>{t.creator?.name || 'Vecino'}</span>,
                                    <StatusBadge key={`prio-${t.id}`} status={t.priority} type="priority" />,
                                    <StatusBadge key={`status-${t.id}`} status={t.status} type="ticket" />,
                                    <button
                                        key={`act-${t.id}`}
                                        type="button"
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
                                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Estado de la Solicitud</label>
                                <select
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
                                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Asignar Operador / Conserje</label>
                                <select
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
        </div>
    );
}
