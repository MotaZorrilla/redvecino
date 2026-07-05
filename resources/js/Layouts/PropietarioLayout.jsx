import { useState } from 'react';
import { Link, Head } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { CircleDollarSign, BarChart3, CalendarDays, Building2 } from 'lucide-react';

export default function PropietarioLayout({
    children,
    user,
    propietarioActiveTab,
    setPropietarioActiveTab,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    toggleTheme,
    darkMode
}) {
    return (
        <div className="flex bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800/80 rounded-[32px] overflow-hidden shadow-2xl transition-colors duration-300 relative text-gray-700 dark:text-slate-200 font-sans">
            <Head>
                <title>Portal Propietario - Mis Activos RedVecino</title>
                <meta name="description" content="Portal de Copropietarios e Inversionistas de RedVecino." />
            </Head>

            {/* 1. LEFT SIDEBAR */}
            <aside aria-label="Navegación principal" className={`w-64 bg-slate-950 text-white p-6 flex flex-col justify-between shrink-0 font-sans transition-transform duration-300 fixed md:relative inset-y-0 left-0 z-45 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
                <div className="space-y-6 text-left">
                    {/* Logo */}
                    <ApplicationLogo size="small" showSubtext={false} brand="propietario" />

                    {/* Sidebar Tabs */}
                    <nav aria-label="Menú principal" className="space-y-1">
                        {[
                            { id: 'home', icon: CircleDollarSign, label: 'Resumen Financiero', desc: 'Saldos y gastos comunes' },
                            { id: 'reports', icon: BarChart3, label: 'Rendición Cuentas', desc: 'Balances mensuales de administración' },
                            { id: 'booking', icon: CalendarDays, label: 'Reservar Espacios', desc: 'Quinchos, salones, gym' },
                            { id: 'units', icon: Building2, label: 'Unidades y Derechos', desc: 'Mis unidades residenciales' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => {
                                    setPropietarioActiveTab(tab.id);
                                    setIsMobileSidebarOpen(false);
                                }}
                                aria-current={propietarioActiveTab === tab.id ? 'page' : undefined}
                                className={`w-full text-left px-4 py-2.5 rounded-xl transition-all duration-200 group flex flex-col gap-0.5 border ${
                                     propietarioActiveTab === tab.id
                                         ? 'bg-brand-green/20 border-brand-green/40 text-white shadow-md'
                                         : 'border-transparent hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                                 }`}
                            >
                                <div className="flex items-center gap-2">
                                    <tab.icon className={`w-4 h-4 ${propietarioActiveTab === tab.id ? 'text-brand-green' : 'text-slate-400 group-hover:text-slate-300'}`} />
                                    <span className={`text-xs font-bold ${propietarioActiveTab === tab.id ? 'text-brand-green' : 'text-slate-300 group-hover:text-slate-200'}`}>
                                        {tab.label}
                                    </span>
                                </div>
                                <span className="text-[9px] text-slate-500 font-medium pl-6 group-hover:text-slate-400">
                                    {tab.desc}
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Profile Widget */}
                <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-2xl space-y-2 text-left relative">
                    <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-brand-green flex items-center justify-center text-xs font-extrabold text-white shrink-0 shadow-inner">
                            {user?.name?.charAt(0) || 'P'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-slate-200 block truncate">{user?.name}</span>
                            <span className="text-[9px] text-slate-500 dark:text-slate-500 block truncate font-medium">Propietario Inversionista</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile sidebar overlay backdrop */}
            {isMobileSidebarOpen && (
                <div 
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Escape' && setIsMobileSidebarOpen(false)}
                />
            )}

            {/* 2. RIGHT CONTENT PANEL */}
            <main className="flex-1 flex flex-col bg-gray-50 dark:bg-slate-900/30 px-6 md:px-12 py-8 md:py-10 overflow-y-auto max-h-[850px] space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 dark:border-slate-800 pb-4 gap-2 text-left">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                            className="md:hidden p-2.5 -ml-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 transition-colors"
                            aria-label="Abrir menú"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5-5.25h16.5m-16.5 10.5h16.5" />
                            </svg>
                        </button>
                        <div>
                            <h2 className="text-lg font-black text-gray-900 dark:text-slate-100 flex items-center gap-2">
                                {propietarioActiveTab === 'home' && <><CircleDollarSign className="w-5 h-5 text-brand-green" /> Resumen Financiero de Unidades</>}
                                {propietarioActiveTab === 'reports' && <><BarChart3 className="w-5 h-5 text-brand-green" /> Rendición Contable de Administración</>}
                                {propietarioActiveTab === 'booking' && <><CalendarDays className="w-5 h-5 text-brand-green" /> Reserva de Áreas de Esparcimiento</>}
                                {propietarioActiveTab === 'units' && <><Building2 className="w-5 h-5 text-brand-green" /> Mis Propiedades y Unidades</>}
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-slate-400">
                                {propietarioActiveTab === 'home' && 'Control de gastos comunes, boletas mensuales y generación de QR de pago.'}
                                {propietarioActiveTab === 'reports' && 'Auditoría mensual de gastos comunes del condominio y estados financieros.'}
                                {propietarioActiveTab === 'booking' && 'Gestión y reserva directa de quinchos, gimnasios y salas multiuso.'}
                                {propietarioActiveTab === 'units' && 'Detalles de propiedad, porcentajes de copropiedad y derecho de voto.'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={toggleTheme}
                            className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-350 transition-colors duration-200"
                            aria-label="Toggle Theme"
                            title="Cambiar tema"
                        >
                            {darkMode ? (
                                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.75 4.75l1.59 1.59m11.32 11.32l1.59 1.59M3 12h2.25m13.5 0H21M4.75 19.25l1.59-1.59m11.32-11.32l1.59-1.59M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {children}
            </main>
        </div>
    );
}
