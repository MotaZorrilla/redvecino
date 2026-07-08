import { useState } from 'react';
import { Link, Head } from '@inertiajs/react';
import { Monitor, Shield, Users, Building2, Bug, PanelLeftClose, PanelLeft } from 'lucide-react';

export default function TiLayout({
    children,
    user,
    tiActiveTab,
    setTiActiveTab,
    isMobileDevOpsSidebarOpen,
    setIsMobileDevOpsSidebarOpen,
    toggleTheme,
    darkMode,
    sidebarCollapsed: sidebarCollapsedProp,
    setSidebarCollapsed: setSidebarCollapsedProp,
}) {
    const [internalCollapsed, setInternalCollapsed] = useState(false);
    const sidebarCollapsed = sidebarCollapsedProp ?? internalCollapsed;
    const setSidebarCollapsed = setSidebarCollapsedProp ?? setInternalCollapsed;

    const SIDEBAR_W = sidebarCollapsed ? 'w-16' : 'w-64';
    const CONTENT_PL = sidebarCollapsed ? 'md:pl-16' : 'md:pl-64';

    const tabs = [
        { id: 'devops', icon: Monitor, label: 'DevOps & Telemetría', desc: 'Monitoreo e Infraestructura' },
        { id: 'matrix', icon: Shield, label: 'Matriz Spatie', desc: 'Mapeo Real de Permisos (BD)' },
        { id: 'impersonation', icon: Users, label: 'Impersonación', desc: 'Matriz de Simulación Spatie' },
        { id: 'users', icon: Users, label: 'Usuarios Globales', desc: 'Spatie Roles & Permisos' },
        { id: 'condos', icon: Building2, label: 'Condominios', desc: 'Gestión de Comunidades' },
        { id: 'sandbox', icon: Bug, label: 'Sandbox de Inspección', desc: 'Módulos por Condominio' },
    ];

    const tabLabels = {
        devops: <><Monitor className="w-5 h-5 text-cyan-500" /> DevOps & Telemetría</>,
        matrix: <><Shield className="w-5 h-5 text-cyan-500" /> Matriz de Permisos Spatie</>,
        impersonation: <><Users className="w-5 h-5 text-cyan-500" /> Matriz de Impersonación</>,
        users: <><Users className="w-5 h-5 text-cyan-500" /> Usuarios Globales</>,
        condos: <><Building2 className="w-5 h-5 text-cyan-500" /> Gestión de Condominios</>,
        sandbox: <><Bug className="w-5 h-5 text-cyan-500" /> Sandbox de Inspección</>,
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-200 font-sans selection:bg-brand-teal/30 flex flex-col md:flex-row relative w-full transition-colors duration-300">
            <Head>
                <title>Dashboard RedVecino - Estación DevOps</title>
                <meta name="description" content="Portal interactivo de RedVecino para soporte TI y DevOps." />
            </Head>

            {/* 1. LEFT SIDEBAR */}
            <aside aria-label="Navegación principal" className={`${SIDEBAR_W} bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0 font-sans transition-all duration-300 fixed inset-y-0 left-0 z-30 overflow-hidden ${isMobileDevOpsSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="space-y-6 text-left p-4">
                    {/* Logo + Collapse Toggle */}
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
                            <Monitor className="w-5 h-5 text-white" />
                        </div>
                        {!sidebarCollapsed && (
                            <div className="text-left min-w-0">
                                <h3 className="text-base font-black tracking-tight text-slate-800 dark:text-white leading-none">
                                    Red<span className="text-cyan-600 dark:text-cyan-400 font-extrabold">Vecino</span>
                                </h3>
                                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-mono mt-1">Estación TI</p>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="ml-auto p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors hidden md:flex shrink-0"
                            aria-label={sidebarCollapsed ? 'Expandir menú' : 'Colapsar menú'}
                            title={sidebarCollapsed ? 'Expandir' : 'Colapsar'}
                        >
                            {sidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav aria-label="Menú principal" className="space-y-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => {
                                    setTiActiveTab(tab.id);
                                    setIsMobileDevOpsSidebarOpen(false);
                                }}
                                aria-current={tiActiveTab === tab.id ? 'page' : undefined}
                                title={sidebarCollapsed ? tab.label : undefined}
                                className={`w-full text-left rounded-xl transition-all duration-200 group border ${
                                    sidebarCollapsed ? 'p-2.5 flex justify-center' : 'px-4 py-2.5 flex flex-col gap-0.5'
                                } ${
                                    tiActiveTab === tab.id
                                        ? 'bg-cyan-500/10 border-cyan-500/50 text-white shadow-md'
                                        : 'border-transparent hover:bg-slate-100/60 dark:hover:bg-slate-800/40 text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-205'
                                }`}
                            >
                                <div className={`flex items-center gap-2 ${sidebarCollapsed ? 'justify-center' : ''}`}>
                                    <tab.icon className={`w-4 h-4 ${tiActiveTab === tab.id ? 'text-cyan-500' : 'text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300'}`} />
                                    {!sidebarCollapsed && (
                                        <span className={`text-xs font-bold ${tiActiveTab === tab.id ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                            {tab.label}
                                        </span>
                                    )}
                                </div>
                                {!sidebarCollapsed && (
                                    <span className="text-[9px] text-slate-400 dark:text-slate-550 font-medium pl-6 group-hover:text-slate-500 dark:group-hover:text-slate-400">
                                        {tab.desc}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Profile Card */}
                <div className="p-4">
                    <div className={`w-full p-3 rounded-2xl space-y-2 text-left relative group bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
                        <div className={`flex items-center gap-2.5 ${sidebarCollapsed ? 'justify-center' : ''}`}>
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-brand-navy to-brand-teal flex items-center justify-center text-xs font-extrabold text-white shrink-0 shadow-inner">
                                {user?.name?.charAt(0) || 'T'}
                            </div>
                            {!sidebarCollapsed && (
                                <div className="min-w-0 flex-1">
                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block truncate">{user?.name}</span>
                                    <span className="text-[9px] text-slate-400 dark:text-slate-500 block truncate font-medium">Estación TI / DevOps</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile sidebar overlay backdrop */}
            {isMobileDevOpsSidebarOpen && (
                <div
                    onClick={() => setIsMobileDevOpsSidebarOpen(false)}
                    className="fixed inset-0 bg-slate-950/40 dark:bg-slate-950/60 backdrop-blur-sm z-20 md:hidden"
                />
            )}

            {/* 2. RIGHT CONTENT PANEL */}
            <div className={`flex-1 flex flex-col ${CONTENT_PL} min-h-screen transition-all duration-300`}>
                {/* Fixed Top Navbar */}
                <header style={{ paddingTop: 'env(safe-area-inset-top)' }} className={`h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 fixed top-0 right-0 left-0 ${CONTENT_PL} z-20 transition-all duration-300`}>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileDevOpsSidebarOpen(!isMobileDevOpsSidebarOpen)}
                            className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 transition-colors mr-1"
                            aria-label="Abrir menú"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5-5.25h16.5m-16.5 10.5h16.5" />
                            </svg>
                        </button>
                        <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                            {tabLabels[tiActiveTab]}
                        </h4>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {toggleTheme && (
                            <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors duration-200 cursor-pointer" aria-label="Toggle Theme" title="Cambiar tema">
                                {darkMode ? (
                                    <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.75 4.75l1.59 1.59m11.32 11.32l1.59 1.59M3 12h2.25m13.5 0H21M4.75 19.25l1.59-1.59m11.32-11.32l1.59-1.59M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" /></svg>
                                ) : (
                                    <svg className="w-4 h-4 text-cyan-600" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
                                )}
                            </button>
                        )}

                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-950/40 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                            <div className="h-6 w-6 rounded bg-gradient-to-r from-brand-navy to-brand-teal flex items-center justify-center font-bold text-white text-[10px]">
                                {user?.name?.charAt(0) || 'T'}
                            </div>
                            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 hidden sm:inline">{user?.name}</span>
                            <span className="text-[8px] bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-extrabold uppercase px-1.5 py-0.5 rounded hidden sm:inline">TI</span>
                        </div>

                        <Link href={route('logout')} method="post" as="button" className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-rose-500 dark:text-rose-400 border border-slate-200 dark:border-slate-700 transition-colors duration-200" aria-label="Cerrar sesión" title="Cerrar sesión">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                        </Link>
                    </div>
                </header>

                {/* Main Scrollable Content */}
                <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 mt-16 overflow-y-auto bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-850 dark:text-slate-200 transition-colors duration-300">
                    {children}
                </main>
            </div>
        </div>
    );
}
