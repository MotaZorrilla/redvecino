import { useState } from 'react';
import { Link, Head } from '@inertiajs/react';

export default function AdminLayout({
    children,
    condosList = [],
    adminCondoId,
    setAdminCondoId,
    adminActiveTab,
    setAdminActiveTab,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    adminSettingsForm = { name: 'Administrador', rut: '', email: '' },
    toggleTheme,
    darkMode,
    user
}) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col md:flex-row relative w-full font-sans text-gray-700 dark:text-slate-200">
            <Head>
                <title>Dashboard RedVecino - Gestión de Condominio</title>
                <meta name="description" content="Portal interactivo de RedVecino para la administración inteligente." />
            </Head>

            {/* 1. LEFT SIDEBAR (Dark Premium Menu, Height complete) */}
            <div className={`w-64 bg-slate-950 text-white p-6 flex flex-col justify-between shrink-0 font-sans transition-transform duration-300 fixed inset-y-0 left-0 z-30 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="space-y-6 text-left">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <h3 className="text-base font-black tracking-tight text-white leading-none">
                                Red<span className="text-indigo-400 font-extrabold">Vecino</span>
                            </h3>
                            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-mono mt-1">Panel Administración</p>
                        </div>
                    </div>

                    {/* Active Condo Selector Dropdown */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 space-y-1.5 text-left">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Condominio Activo</span>
                        <div className="relative">
                            <select
                                value={adminCondoId}
                                onChange={(e) => {
                                    setAdminCondoId(Number(e.target.value));
                                    setAdminActiveTab('dashboard'); // reset to dashboard on condo switch
                                    setIsMobileSidebarOpen(false);
                                }}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-3 text-xs font-bold text-slate-100 focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer appearance-none pr-8"
                            >
                                {condosList.map(c => (
                                    <option key={c.id} value={c.id} className="bg-slate-900 text-slate-100">{c.name}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                            </div>
                        </div>
                    </div>

                    {/* Vertical Navigation Buttons */}
                    <nav className="space-y-1">
                        {[
                            { id: 'dashboard', label: '📊 Resumen', desc: 'Vista general' },
                            { id: 'properties', label: '🏢 Propiedades', desc: 'Casas y departamentos' },
                            { id: 'users', label: '👥 Usuarios', desc: 'Vecinos y directiva' },
                            { id: 'tickets', label: '🛠️ Tickets', desc: 'Casos y solicitudes' },
                            { id: 'payments', label: '💵 Pagos', desc: 'Historial y registros' },
                            { id: 'fines', label: '⚖️ Multas', desc: 'Infracciones y cargos' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => {
                                    setAdminActiveTab(tab.id);
                                    setIsMobileSidebarOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 rounded-xl transition-all duration-200 group flex flex-col gap-0.5 border ${
                                    adminActiveTab === tab.id
                                        ? 'bg-indigo-600/20 border-indigo-500/50 text-white shadow-md'
                                        : 'border-transparent hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                <span className={`text-xs font-bold ${adminActiveTab === tab.id ? 'text-indigo-400' : 'text-slate-300'}`}>
                                    {tab.label}
                                </span>
                                <span className="text-[9px] text-slate-500 font-medium">
                                    {tab.desc}
                                </span>
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Admin Profile Card (Clickable to edit profile settings) */}
                <button
                    type="button"
                    onClick={() => setAdminActiveTab('settings')}
                    className={`w-full bg-slate-900/60 hover:bg-slate-900/90 border transition-all duration-200 p-3 rounded-2xl space-y-2 text-left relative group ${
                        adminActiveTab === 'settings'
                            ? 'border-indigo-500 shadow-md ring-1 ring-indigo-500/25 bg-slate-900'
                            : 'border-slate-800/80 hover:border-slate-700'
                    }`}
                >
                    <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-extrabold text-white shrink-0 shadow-inner group-hover:scale-105 transition-all">
                            {adminSettingsForm.name?.charAt(0) || 'A'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-200 block truncate group-hover:text-white transition-colors">{adminSettingsForm.name}</span>
                                <span className="text-[10px] opacity-0 group-hover:opacity-100 text-indigo-400 font-mono transition-opacity">⚙️</span>
                            </div>
                            <span className="text-[9px] text-slate-500 dark:text-slate-500 block truncate font-medium">Administrador (Configurar)</span>
                        </div>
                    </div>
                    <div className="pt-1.5 border-t border-slate-800/60 flex justify-between items-center text-[9px] text-slate-400 group-hover:text-slate-300 transition-colors">
                        <span>RUT: {adminSettingsForm.rut}</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    </div>
                </button>
            </div>

            {/* Mobile sidebar overlay backdrop */}
            {isMobileSidebarOpen && (
                <div 
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-20 md:hidden"
                />
            )}

            {/* 2. RIGHT CONTENT PANEL */}
            <div className="flex-1 flex flex-col md:pl-64 min-h-screen">
                {/* Fixed Top Navbar */}
                <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-150 dark:border-slate-800 flex items-center justify-between px-6 md:px-12 fixed top-0 right-0 left-0 md:left-64 z-20 transition-colors duration-300">
                    <div className="flex items-center gap-3 text-left">
                        <button
                            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                            className="md:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 transition-colors mr-1"
                            aria-label="Abrir menú"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5-5.25h16.5m-16.5 10.5h16.5" />
                            </svg>
                        </button>
                        <h2 className="text-sm font-black text-gray-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                            {adminActiveTab === 'dashboard' && '📊 Panel de Resumen'}
                            {adminActiveTab === 'properties' && '🏢 Propiedades de la Comunidad'}
                            {adminActiveTab === 'users' && '👥 Usuarios y Copropietarios'}
                            {adminActiveTab === 'tickets' && '🛠️ Gestión de Tickets de Soporte'}
                            {adminActiveTab === 'payments' && '💵 Registro de Pagos e Ingresos'}
                            {adminActiveTab === 'fines' && '⚖️ Control de Multas y Sanciones'}
                            {adminActiveTab === 'settings' && '⚙️ Configuración y Ajustes'}
                            <span className="text-xs px-2.5 py-0.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full font-bold">
                                {condosList.find(c => c.id === adminCondoId)?.name || 'Condominio'}
                            </span>
                        </h2>
                    </div>

                    {/* Right side controls: Profile, Theme, and Logout */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-950/40 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-800">
                            <div className="h-6 w-6 rounded bg-indigo-600 flex items-center justify-center font-bold text-white text-[10px]">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <span className="text-[11px] font-bold text-gray-700 dark:text-slate-350 hidden sm:inline">{user?.name}</span>
                            <span className="text-[8px] bg-indigo-500/10 border border-indigo-500/30 text-indigo-500 font-extrabold uppercase px-1.5 py-0.5 rounded">ADMIN</span>
                        </div>

                        {toggleTheme && (
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 transition-colors duration-200 cursor-pointer"
                                aria-label="Toggle Theme"
                                title="Cambiar tema"
                            >
                                {darkMode ? (
                                    <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.75 4.75l1.59 1.59m11.32 11.32l1.59 1.59M3 12h2.25m13.5 0H21M4.75 19.25l1.59-1.59m11.32-11.32l1.59-1.59M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                                    </svg>
                                )}
                            </button>
                        )}

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 border border-gray-200 dark:border-slate-700 transition-colors duration-200 cursor-pointer"
                            aria-label="Cerrar sesión"
                            title="Cerrar sesión"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                            </svg>
                        </Link>
                    </div>
                </header>

                {/* Main Scrollable Content */}
                <main className="flex-1 px-6 md:px-12 py-8 md:py-10 mt-16 overflow-y-auto bg-gray-50 dark:bg-slate-900/10 text-gray-700 dark:text-slate-200">
                    {children}
                </main>
            </div>
        </div>
    );
}
