import { StatCard, SectionCard, SimpleTable, StatusBadge } from '@/Components/DashboardShared';

export default function DashboardOverview({
    condosList = [],
    adminCondoId,
    adminFilteredProperties = [],
    adminFilteredUsers = [],
    adminFilteredTickets = [],
    adminFilteredPayments = [],
    adminFilteredFines = [],
    setAdminActiveTab,
    setTicketStatusFilter,
    setTicketPriorityFilter,
    setEditingTicket
}) {
    const activeCondo = condosList.find(c => c.id === adminCondoId) || { name: 'Condominio', address: '', city: '' };

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Condo Banner */}
            <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 border border-indigo-950 rounded-2xl p-6 text-white relative overflow-hidden shadow-md">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-1 text-left">
                    <span className="text-[10px] bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 font-bold px-2 py-0.5 rounded uppercase">Comunidad Activa</span>
                    <h4 className="text-xl font-black">{activeCondo.name}</h4>
                    <p className="text-xs text-indigo-200">{activeCondo.address}, {activeCondo.city}</p>
                </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <StatCard
                    title="Propiedades"
                    value={adminFilteredProperties.length}
                    description={`${adminFilteredProperties.filter(p => p.status === 'occupied').length} ocupadas`}
                    color="emerald"
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                        </svg>
                    }
                    onClick={() => setAdminActiveTab('properties')}
                />
                <StatCard
                    title="Usuarios"
                    value={adminFilteredUsers.length}
                    description="Ver residentes & admins"
                    color="indigo"
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                        </svg>
                    }
                    onClick={() => setAdminActiveTab('users')}
                />
                <StatCard
                    title="Tickets Activos"
                    value={adminFilteredTickets.filter(t => t.status !== 'resolved').length}
                    description="Pendientes o en curso"
                    color="amber"
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.646 5.647a1.5 1.5 0 01-2.121-2.121l5.646-5.646m0 0l5.646-5.646m-5.646 5.646L16.5 3M12 21h9" />
                        </svg>
                    }
                    onClick={() => {
                        setTicketStatusFilter('all');
                        setTicketPriorityFilter('all');
                        setAdminActiveTab('tickets');
                    }}
                />
                <StatCard
                    title="Pagos Registrados"
                    value={adminFilteredPayments.length}
                    description={`Monto: $${adminFilteredPayments.reduce((acc, curr) => acc + Number(curr.amount), 0).toLocaleString()}`}
                    color="rose"
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                    onClick={() => setAdminActiveTab('payments')}
                />
                <StatCard
                    title="Multas Pendentes"
                    value={adminFilteredFines.filter(f => f.status === 'pending').length}
                    description={`Total: $${adminFilteredFines.reduce((acc, curr) => acc + Number(curr.amount), 0).toLocaleString()}`}
                    color="cyan"
                    icon={
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                    }
                    onClick={() => setAdminActiveTab('fines')}
                />
            </div>

            {/* Quick Summary Section */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Tickets Recientes */}
                <SectionCard title="Tickets Recientes del Condominio">
                    <SimpleTable
                        headers={['ID', 'Título', 'Prioridad', 'Estado', 'Vecino']}
                        rows={adminFilteredTickets.slice(0, 5).map(t => ({
                            cells: [
                                <span className="font-mono text-xs text-gray-500" key={`id-${t.id}`}>#{t.id}</span>,
                                <button 
                                    key={`btn-${t.id}`}
                                    onClick={() => {
                                        setEditingTicket(t);
                                        setAdminActiveTab('tickets');
                                    }}
                                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline text-left font-medium block truncate max-w-full"
                                >
                                    {t.title}
                                </button>,
                                <StatusBadge key={`prio-${t.id}`} status={t.priority} type="priority" />,
                                <StatusBadge key={`status-${t.id}`} status={t.status} type="ticket" />,
                                <span key={`creator-${t.id}`} className="text-xs text-slate-500">{t.creator?.name || 'Vecino'}</span>
                            ]
                        }))}
                        emptyMessage="No hay tickets recientes en esta comunidad"
                    />
                </SectionCard>

                {/* Pagos Recientes */}
                <SectionCard title="Últimos Pagos Registrados">
                    <SimpleTable
                        headers={['Propiedad', 'Vecino', 'Monto', 'Fecha', 'Estado']}
                        rows={adminFilteredPayments.slice(0, 5).map(p => ({
                            cells: [
                                <span className="font-mono font-bold" key={`prop-${p.id}`}>#{p.property_id}</span>,
                                <span className="text-xs" key={`user-${p.id}`}>{p.user?.name || '-'}</span>,
                                <span className="font-bold text-emerald-600 dark:text-emerald-500" key={`amt-${p.id}`}>${Number(p.amount).toLocaleString()}</span>,
                                <span className="text-xs text-slate-500" key={`date-${p.id}`}>{new Date(p.payment_date).toLocaleDateString('es-CL')}</span>,
                                <StatusBadge key={`status-${p.id}`} status={p.status} type="payment" />
                            ]
                        }))}
                        emptyMessage="No hay cobros ni pagos recientes"
                    />
                </SectionCard>
            </div>
        </div>
    );
}
