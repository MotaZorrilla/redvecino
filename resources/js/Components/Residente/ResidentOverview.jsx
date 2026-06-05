import { useState } from 'react';

export default function ResidentOverview({
    residentExpenses,
    simulatedMoroso,
    setMobileTab,
    setShowMorosidadModal,
    residentCondo = 'Condominio Parque Central',
    user
}) {
    return (
        <div className="space-y-6 animate-scale-up text-left">
            {/* Dynamic Carousel / Featured Alerts */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#EC7A08]/10 to-[#EC7A08]/5 border border-[#EC7A08]/20 p-5 flex items-start gap-4 shadow-sm">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#EC7A08]/5 rounded-full blur-xl" />
                <div className="h-10 w-10 rounded-xl bg-[#EC7A08]/15 border border-[#EC7A08]/30 text-[#EC7A08] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#EC7A08] animate-bounce" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" style={{ animationDuration: '3s' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a9.001 9.001 0 01-11.963-3.07 9.001 9.001 0 013.07-11.963c.48-.277 1.012-.456 1.56-.532a.75.75 0 01.815.58l.492 2.213a.75.75 0 01-.419.824l-1.077.538a6.502 6.502 0 003.003 3.003l.538-1.077a.75.75 0 01.824-.419l2.213.493a.75.75 0 01.58.815c-.076.548-.255 1.08-.532 1.56z" />
                    </svg>
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 bg-[#EC7A08]/15 border border-[#EC7A08]/25 text-[8px] font-bold text-[#EC7A08] uppercase tracking-wider rounded">Circular Destacada</span>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500">Hoy 15:10</span>
                    </div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-white truncate">Corte de Agua Programado</h4>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-snug">Se informa que el Jueves 28 se suspenderá el suministro de agua potable de 14:00 a 18:00 hrs por reparaciones en matriz principal.</p>
                </div>
            </div>

            {/* Outstanding Expense Summary card */}
            <div className={`border p-5 rounded-2xl flex justify-between items-center shadow-sm transition-colors duration-300 ${
                simulatedMoroso 
                    ? 'bg-rose-50/15 dark:bg-rose-950/10 border-rose-200 dark:border-rose-900/40' 
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800'
            }`}>
                <div className="space-y-1">
                    <span className={`text-[9px] font-extrabold uppercase tracking-widest ${simulatedMoroso ? 'text-rose-500' : 'text-[#72B043]'}`}>
                        {simulatedMoroso ? '⚠️ Deuda Acumulada' : 'Gasto Común Mayo'}
                    </span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-slate-900 dark:text-white">
                            {residentExpenses.status === 'completed' ? '$0' : (simulatedMoroso ? '$495.000' : '$165.000')}
                        </span>
                        <span className="text-[10px] text-slate-400">CLP</span>
                    </div>
                    <p className="text-[10px] text-slate-500">
                        {residentExpenses.status === 'completed' ? '¡Tu cuenta está al día!' : (simulatedMoroso ? '⚠️ Bloqueo por 3 meses impagos' : `Vence el ${residentExpenses.dueDate}`)}
                    </p>
                </div>
                <div>
                    {residentExpenses.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-bold text-emerald-500 dark:text-emerald-500 rounded-full uppercase tracking-wider">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Pagado
                        </span>
                    ) : (
                        <button 
                            type="button"
                            onClick={() => setMobileTab('pagos')}
                            className={`px-4 py-2 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1 ${
                                simulatedMoroso 
                                    ? 'bg-brand-error hover:bg-brand-navy-dark shadow-rose-500/10' 
                                    : 'bg-brand-green hover:bg-brand-green-dark shadow-[#72B043]/10 hover:shadow-[#72B043]/20'
                            }`}
                        >
                            Pagar
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>

            {/* 6 Icons grid layout */}
            <div className="space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">Tu Taller de MiVecino</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                        { tab: 'comunicados', label: 'Comunicados', color: 'bg-indigo-50/80 hover:border-brand-teal/30 text-brand-purple border-indigo-100 dark:bg-slate-950 dark:border-slate-800 dark:text-brand-purple', icon: '📢', desc: 'Mural de circulares' },
                        { tab: 'reservas', label: 'Reservas', color: 'bg-violet-50/80 hover:border-brand-purple/30 text-brand-purple border-violet-100 dark:bg-slate-950 dark:border-slate-800 dark:text-brand-purple', icon: '📅', desc: 'Quincho, piscina, gym' },
                        { tab: 'pagos', label: 'Pagos', color: 'bg-emerald-50/80 hover:border-emerald-500/30 text-emerald-600 border-emerald-100 dark:bg-slate-950 dark:border-slate-800 dark:text-emerald-400', icon: '💵', desc: 'Gastos y comprobantes' },
                        { tab: 'incidencias', label: 'Incidencias', color: 'bg-rose-50/80 hover:border-rose-500/30 text-rose-600 border-rose-100 dark:bg-slate-950 dark:border-slate-800 dark:text-rose-400', icon: '🛠️', desc: 'Reportar avería' },
                        { tab: 'documentos', label: 'Documentos', color: 'bg-cyan-50/80 hover:border-cyan-500/30 text-cyan-600 border-cyan-100 dark:bg-slate-950 dark:border-slate-800 dark:text-cyan-400', icon: '📄', desc: 'Reglamentos y actas' },
                        { tab: 'comunidad', label: 'Comunidad', color: 'bg-amber-50/80 hover:border-amber-500/30 text-amber-600 border-amber-100 dark:bg-slate-950 dark:border-slate-800 dark:text-amber-400', icon: '👥', desc: 'Mensajería y Conserje' }
                    ].map(item => {
                        const isReservasLocked = simulatedMoroso && item.tab === 'reservas';
                        return (
                            <button 
                                key={item.tab}
                                type="button"
                                onClick={() => {
                                    if (isReservasLocked) {
                                        setShowMorosidadModal(true);
                                    } else {
                                        setMobileTab(item.tab);
                                    }
                                }}
                                className={`p-4 border rounded-2xl text-left transition-all hover:scale-[1.02] shadow-sm flex flex-col justify-between aspect-[1.1] sm:aspect-auto ${
                                    isReservasLocked 
                                        ? 'bg-rose-50/10 border-rose-200 text-rose-700 opacity-70 dark:bg-slate-950 dark:border-rose-950/40 dark:text-rose-400' 
                                        : item.color
                                }`}
                            >
                                <span className="text-2xl">{isReservasLocked ? '🔒' : item.icon}</span>
                                <div className="mt-2 text-left">
                                    <span className="text-xs font-bold block">{isReservasLocked ? 'Reservas 🔒' : item.label}</span>
                                    <span className="text-[8px] text-slate-400 block mt-0.5 leading-tight">
                                        {isReservasLocked ? 'Suspendido por deuda' : item.desc}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Recent activity snippet */}
            <div className="bg-slate-50 dark:bg-slate-950/60 p-4 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-2.5">
                <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500 block">Resumen de Actividad Reciente</span>
                <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-3 rounded-xl flex items-center justify-between">
                        <div>
                            <span className="text-[8px] text-slate-400 font-bold block">RESERVAS</span>
                            <span className="font-bold text-slate-700 dark:text-slate-300">1 Aprobada</span>
                        </div>
                        <span className="text-emerald-500 text-lg">●</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-3 rounded-xl flex items-center justify-between">
                        <div>
                            <span className="text-[8px] text-slate-400 font-bold block">TICKETS</span>
                            <span className="font-bold text-slate-700 dark:text-slate-300">1 Pendiente</span>
                        </div>
                        <span className="text-amber-500 text-lg">●</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
