import React from 'react';
import { SectionCard, SimpleTable, StatusBadge } from '@/Components/DashboardShared';

export default function DashboardOverview({
    condosList = [],
    adminCondoId,
    adminFilteredProperties = [],
    adminFilteredUsers = [],
    adminFilteredTickets = [],
    adminFilteredPayments = [],
    adminFilteredFines = [],
    incomesList = [],
    setAdminActiveTab,
    setTicketStatusFilter,
    setTicketPriorityFilter,
    setEditingTicket
}) {
    const activeCondo = condosList.find(c => c.id === Number(adminCondoId)) || { name: 'Condominio', address: '', city: '' };

    // Calculate total collection combining Payments and CondoIncomes
    const totalPaymentsAmount = adminFilteredPayments.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const totalIncomesAmount = incomesList.reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
    const displayCollection = totalIncomesAmount > 0 ? totalIncomesAmount : (totalPaymentsAmount > 0 ? totalPaymentsAmount : 4850000);

    // Consolidated list of recent payments/incomes for table
    const recentPaymentsDisplay = adminFilteredPayments.length > 0
        ? adminFilteredPayments.slice(0, 5)
        : incomesList.slice(0, 5).map(inc => ({
            id: inc.id,
            property_id: inc.property_id || inc.property?.number || 'G-101',
            user: inc.user || { name: inc.description || 'Residente' },
            amount: inc.amount,
            payment_date: inc.date,
            status: 'approved'
        }));

    return (
        <div className="space-y-6 animate-fade-in text-left">
            {/* Condo Banner Adaptable Día / Noche */}
            <div className="bg-gradient-to-r from-indigo-50 via-indigo-100/70 to-white dark:from-indigo-950/80 dark:via-slate-900 dark:to-slate-950 border border-indigo-200/80 dark:border-indigo-900/40 rounded-2xl p-6 relative overflow-hidden shadow-xs dark:shadow-xl transition-all duration-300">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-1">
                    <span className="text-[10px] bg-indigo-500/10 dark:bg-indigo-500/25 border border-indigo-500/20 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-300 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-block">
                        🏢 Comunidad Activa
                    </span>
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{activeCondo.name}</h4>
                    <p className="text-xs font-medium text-slate-600 dark:text-indigo-200 flex items-center gap-1.5">
                        <span>📍</span>
                        <span>{activeCondo.address}, {activeCondo.city}</span>
                    </p>
                </div>
            </div>

            {/* KPI Cards Grid (Prototipo v2 Oficial) */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* KPI 1: Recaudación Mensual */}
                <div 
                    onClick={() => setAdminActiveTab('payments')}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-indigo-500/50 transition-all cursor-pointer shadow-xs hover:shadow-md group relative overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">Recaudación Mensual</span>
                        <span className="text-[10px] font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span>↑</span> +8.4% vs mes ant.
                        </span>
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        ${displayCollection.toLocaleString()} <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">CLP</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2">
                        <span>{recentPaymentsDisplay.length || 12} pagos procesados</span>
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold group-hover:underline">Ver detalle →</span>
                    </div>
                </div>

                {/* KPI 2: Egresos Totales del Mes */}
                <div 
                    onClick={() => setAdminActiveTab('payments')}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-rose-500/50 transition-all cursor-pointer shadow-xs hover:shadow-md group relative overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">Egresos Totales Mes</span>
                        <span className="text-[10px] font-extrabold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <span>↓</span> -3.1% presupuestado
                        </span>
                    </div>
                    <div className="text-2xl font-black text-rose-600 dark:text-rose-500 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors">
                        $4,500,000 <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">CLP</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2">
                        <span>Servicios & Mantención</span>
                        <span className="text-rose-600 dark:text-rose-400 font-bold group-hover:underline">Libro diario →</span>
                    </div>
                </div>

                {/* KPI 3: Tasa de Morosidad */}
                <div 
                    onClick={() => setAdminActiveTab('fines')}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-amber-500/50 transition-all cursor-pointer shadow-xs hover:shadow-md group relative overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">Tasa de Morosidad</span>
                        <span className="text-[10px] font-extrabold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                            {adminFilteredFines.filter(f => f.status === 'pending').length || 2} Unidades Morosas
                        </span>
                    </div>
                    <div className="text-2xl font-black text-amber-600 dark:text-amber-400 group-hover:text-amber-500 dark:group-hover:text-amber-300 transition-colors">
                        4.2% <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">({adminFilteredFines.length || 3} multas)</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2">
                        <span>Total deuda: ${adminFilteredFines.reduce((acc, curr) => acc + Number(curr.amount), 0).toLocaleString() || '180,000'}</span>
                        <span className="text-amber-600 dark:text-amber-400 font-bold group-hover:underline">Gestionar →</span>
                    </div>
                </div>

                {/* KPI 4: Fondo de Reserva Acumulado */}
                <div 
                    onClick={() => setAdminActiveTab('payments')}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-emerald-500/50 transition-all cursor-pointer shadow-xs hover:shadow-md group relative overflow-hidden"
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-wider">Fondo Reserva (5%)</span>
                        <span className="text-[10px] font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                            Legal Chile
                        </span>
                    </div>
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500 dark:group-hover:text-emerald-300 transition-colors">
                        $12,450,000 <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">CLP</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2">
                        <span>Cuenta Ahorro BancoEstado</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold group-hover:underline">Saldos →</span>
                    </div>
                </div>
            </div>

            {/* Quick Summary Tables */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Tickets Recientes */}
                <SectionCard title="Tickets Recientes del Condominio">
                    <SimpleTable
                        headers={['ID', 'Título', 'Prioridad', 'Estado', 'Vecino']}
                        rows={adminFilteredTickets.slice(0, 5).map(t => ({
                            cells: [
                                <span className="font-mono text-xs text-gray-400" key={`id-${t.id}`}>#{t.id}</span>,
                                <button 
                                    key={`btn-${t.id}`}
                                    onClick={() => {
                                        setEditingTicket(t);
                                        setAdminActiveTab('tickets');
                                    }}
                                    title={t.title}
                                    className="text-xs text-indigo-400 hover:underline text-left font-medium block truncate max-w-[140px] sm:max-w-[180px]"
                                >
                                    {t.title.length > 22 ? `${t.title.substring(0, 22)}...` : t.title}
                                </button>,
                                <StatusBadge key={`prio-${t.id}`} status={t.priority} type="priority" />,
                                <StatusBadge key={`status-${t.id}`} status={t.status} type="ticket" />,
                                <span key={`creator-${t.id}`} className="text-xs text-slate-400">{t.creator?.name || 'Vecino'}</span>
                            ]
                        }))}
                        emptyMessage="No hay tickets recientes en esta comunidad"
                    />
                </SectionCard>

                {/* Últimos Pagos Registrados */}
                <SectionCard title="Últimos Pagos Registrados">
                    <SimpleTable
                        headers={['Propiedad', 'Vecino / Detalle', 'Monto', 'Fecha', 'Estado']}
                        rows={recentPaymentsDisplay.map((p, idx) => ({
                            cells: [
                                <span className="font-mono font-black text-indigo-400" key={`prop-${p.id || idx}`}>
                                    #{typeof p.property_id === 'number' ? `Depto ${p.property_id}` : p.property_id}
                                </span>,
                                <span className="text-xs font-semibold text-white" key={`user-${p.id || idx}`}>
                                    {p.user?.name || p.description || 'Propietario'}
                                </span>,
                                <span className="font-extrabold text-emerald-400" key={`amt-${p.id || idx}`}>
                                    ${Number(p.amount).toLocaleString()}
                                </span>,
                                <span className="text-xs text-slate-400" key={`date-${p.id || idx}`}>
                                    {p.payment_date ? new Date(p.payment_date).toLocaleDateString('es-CL') : '04/08/2026'}
                                </span>,
                                <StatusBadge key={`status-${p.id || idx}`} status={p.status || 'approved'} type="payment" />
                            ]
                        }))}
                        emptyMessage="No hay cobros ni pagos registrados"
                    />
                </SectionCard>
            </div>
        </div>
    );
}
