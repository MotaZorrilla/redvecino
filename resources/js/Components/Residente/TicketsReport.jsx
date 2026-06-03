import { useState } from 'react';
import { StatusBadge } from '../DashboardShared';

export default function TicketsReport({
    newTicketTitle,
    setNewTicketTitle,
    newTicketDesc,
    setNewTicketDesc,
    newTicketCat,
    setNewTicketCat,
    newTicketPri,
    setNewTicketPri,
    submitTicket,
    reportedTickets,
    setMobileTab
}) {
    return (
        <div className="space-y-6 animate-scale-up text-left">
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => setMobileTab('home')} 
                    className="text-slate-400 hover:text-slate-650 transition-colors"
                    type="button"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">Reportar Incidencias / Averías</h3>
            </div>

            {/* Ticket creation Form */}
            <form onSubmit={submitTicket} className="bg-slate-50 dark:bg-slate-950 p-5 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-4">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#72B043] block border-b pb-2 dark:border-slate-800">Levantar Reporte Técnico</span>
                
                <div className="space-y-1">
                    <label className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-extrabold block">Título de la Incidencia</label>
                    <input 
                        type="text"
                        placeholder="Ej: Ampolleta quemada en ascensor"
                        value={newTicketTitle}
                        onChange={(e) => setNewTicketTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:outline-none focus:border-[#72B043] dark:text-slate-200"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-extrabold block">Categoría</label>
                        <select 
                            value={newTicketCat} 
                            onChange={(e) => setNewTicketCat(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:outline-none focus:border-[#72B043] dark:text-slate-200"
                        >
                            <option value="Electricidad">Electricidad</option>
                            <option value="Plomería">Plomería</option>
                            <option value="Seguridad">Seguridad</option>
                            <option value="Ascensores">Ascensores</option>
                            <option value="Limpieza">Limpieza</option>
                            <option value="Otros">Otros</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-extrabold block">Prioridad de Solicitud</label>
                        <select 
                            value={newTicketPri} 
                            onChange={(e) => setNewTicketPri(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:outline-none focus:border-[#72B043] dark:text-slate-200"
                        >
                            <option value="low">Baja (General)</option>
                            <option value="medium">Media (Necesaria)</option>
                            <option value="high">Alta (Urgente)</option>
                            <option value="urgent">Crítica (Emergencia)</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-extrabold block">Descripción del Problema</label>
                    <textarea 
                        rows="3"
                        placeholder="Detalla lo que ocurre para agilizar la asignación al personal de mantenimiento..."
                        value={newTicketDesc}
                        onChange={(e) => setNewTicketDesc(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:outline-none focus:border-[#72B043] resize-none dark:text-slate-200"
                    />
                </div>

                {/* Photo simulation attachment */}
                <div className="space-y-1">
                    <label className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-extrabold block">Adjuntar Evidencia Fotográfica (Simulado)</label>
                    <div className="border border-dashed border-slate-200/60 dark:border-slate-800 p-4 rounded-xl flex flex-col items-center justify-center text-center gap-1 bg-white/50 dark:bg-slate-900">
                        <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                        </svg>
                        <span className="text-[10px] font-bold text-slate-500 mt-1">Cargar Archivo JPG/PNG</span>
                        <span className="text-[8px] text-slate-400 block">Máximo 15MB de tamaño</span>
                    </div>
                </div>

                <button 
                    type="submit"
                    className="w-full py-2.5 bg-[#72B043] hover:bg-[#629b37] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                >
                    Crear Ticket e Iniciar Mantenimiento
                </button>
            </form>

            {/* Reported tickets list */}
            <div className="space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">Tus Reportes de Incidencia</span>
                
                <div className="space-y-3">
                    {reportedTickets.map(tick => (
                        <div key={tick.id} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-3 shadow-sm text-xs">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="font-black text-slate-800 dark:text-white">{tick.title}</span>
                                    <span className="text-[9px] text-slate-400 font-mono">#{tick.id}</span>
                                </div>
                                <StatusBadge status={tick.status} type="ticket" />
                            </div>
                            <p className="text-[10px] text-slate-650 dark:text-slate-400 leading-relaxed bg-white/70 dark:bg-slate-900 p-2.5 border border-slate-100/50 dark:border-slate-800 rounded-xl">{tick.desc}</p>
                            <div className="flex items-center justify-between text-[9px] text-slate-500 font-medium">
                                <span>Fecha: {tick.date} &bull; Cat: {tick.category}</span>
                                <span className="font-extrabold uppercase">Prioridad: {tick.priority}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
