import { useState } from 'react';
import { Link, Head } from '@inertiajs/react';
import { UserCog, Building2, PanelLeftClose, PanelLeft } from 'lucide-react';

export default function SuperUsuarioLayout({
    children,
    user,
    toggleTheme,
    darkMode,
    usersList = [],
    setUsersList,
    condosList = [],
    setCondosList,
    sidebarCollapsed: sidebarCollapsedProp,
    setSidebarCollapsed: setSidebarCollapsedProp,
}) {
    const [internalCollapsed, setInternalCollapsed] = useState(false);
    const sidebarCollapsed = sidebarCollapsedProp ?? internalCollapsed;
    const setSidebarCollapsed = setSidebarCollapsedProp ?? setInternalCollapsed;

    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('admins');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [formInputs, setFormInputs] = useState({ name: '', email: '', rut: '', phone: '', status: 'active' });

    const SIDEBAR_W = sidebarCollapsed ? 'w-16' : 'w-64';
    const CONTENT_PL = sidebarCollapsed ? 'md:pl-16' : 'md:pl-64';

    const adminUsers = usersList.filter(u => u.roles?.some(r => ['admin', 'administrador'].includes(r.toLowerCase())));

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (editingAdmin) {
            setUsersList(prev => prev.map(u => u.id === editingAdmin.id ? {
                ...u,
                name: formInputs.name,
                email: formInputs.email,
                rut: formInputs.rut,
                phone: formInputs.phone,
                status: formInputs.status
            } : u));
            setEditingAdmin(null);
        } else {
            const newAdmin = {
                id: usersList.length > 0 ? Math.max(...usersList.map(u => u.id)) + 1 : 1,
                name: formInputs.name,
                email: formInputs.email,
                rut: formInputs.rut,
                phone: formInputs.phone,
                status: formInputs.status,
                roles: ['Administrador']
            };
            setUsersList(prev => [...prev, newAdmin]);
        }
        setShowAddForm(false);
        setFormInputs({ name: '', email: '', rut: '', phone: '', status: 'active' });
    };

    const tabs = [
        { id: 'admins', icon: UserCog, label: 'Administradores', desc: 'Crear y gestionar cuentas de Admin' },
        { id: 'condos', icon: Building2, label: 'Condominios Globales', desc: 'Vista general de comunidades' },
    ];

    const tabLabels = {
        admins: <><UserCog className="w-5 h-5 text-indigo-500" /> Gestión de Cuentas de Administradores</>,
        condos: <><Building2 className="w-5 h-5 text-indigo-500" /> Resumen de Condominios Licenciados</>,
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col md:flex-row relative w-full font-sans text-gray-700 dark:text-slate-200">
            <Head>
                <title>Portal Súper Usuario - RedVecino SaaS</title>
                <meta name="description" content="Portal de control comercial de RedVecino." />
            </Head>

            {/* 1. LEFT SIDEBAR */}
            <aside aria-label="Navegación principal" className={`${SIDEBAR_W} bg-slate-950 text-white flex flex-col justify-between shrink-0 font-sans transition-all duration-300 fixed inset-y-0 left-0 z-30 overflow-hidden ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="space-y-6 text-left p-4">
                    {/* Logo + Collapse Toggle */}
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                            </svg>
                        </div>
                        {!sidebarCollapsed && (
                            <div className="text-left min-w-0">
                                <h3 className="text-base font-black tracking-tight text-white leading-none">
                                    Red<span className="text-indigo-400 font-extrabold">Vecino</span>
                                </h3>
                                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-mono mt-1">Super Admin</p>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="ml-auto p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors hidden md:flex shrink-0"
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
                                    setActiveTab(tab.id);
                                    setIsMobileSidebarOpen(false);
                                }}
                                aria-current={activeTab === tab.id ? 'page' : undefined}
                                title={sidebarCollapsed ? tab.label : undefined}
                                className={`w-full text-left rounded-xl transition-all duration-200 group border ${
                                    sidebarCollapsed ? 'p-2.5 flex justify-center' : 'px-4 py-2.5 flex flex-col gap-0.5'
                                } ${
                                    activeTab === tab.id
                                        ? 'bg-indigo-600/20 border-indigo-500/50 text-white shadow-md'
                                        : 'border-transparent hover:bg-slate-900 text-slate-400 hover:text-slate-200'
                                }`}
                            >
                                <div className={`flex items-center gap-2 ${sidebarCollapsed ? 'justify-center' : ''}`}>
                                    <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                                    {!sidebarCollapsed && (
                                        <span className={`text-xs font-bold ${activeTab === tab.id ? 'text-indigo-400' : 'text-slate-300 group-hover:text-slate-200'}`}>
                                            {tab.label}
                                        </span>
                                    )}
                                </div>
                                {!sidebarCollapsed && (
                                    <span className="text-[9px] text-slate-500 font-medium pl-6 group-hover:text-slate-400">
                                        {tab.desc}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Profile Card */}
                <div className="p-4">
                    <div className={`w-full p-3 rounded-2xl space-y-2 text-left relative group bg-slate-900/60 border border-slate-800/80 ${sidebarCollapsed ? 'flex justify-center' : ''}`}>
                        <div className={`flex items-center gap-2.5 ${sidebarCollapsed ? 'justify-center' : ''}`}>
                            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-extrabold text-white shrink-0 shadow-inner">
                                {user?.name?.charAt(0) || 'S'}
                            </div>
                            {!sidebarCollapsed && (
                                <div className="min-w-0 flex-1">
                                    <span className="text-xs font-bold text-slate-200 block truncate">{user?.name || 'Comprador SaaS'}</span>
                                    <span className="text-[9px] text-slate-500 block truncate font-medium">Súper Usuario</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile sidebar overlay backdrop */}
            {isMobileSidebarOpen && (
                <div
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-20 md:hidden"
                />
            )}

            {/* 2. RIGHT CONTENT PANEL */}
            <div className={`flex-1 flex flex-col ${CONTENT_PL} min-h-screen transition-all duration-300`}>
                {/* Fixed Top Navbar */}
                <header style={{ paddingTop: 'env(safe-area-inset-top)' }} className={`h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-150 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 fixed top-0 right-0 left-0 ${CONTENT_PL} z-20 transition-all duration-300`}>
                    <div className="flex items-center gap-3 text-left">
                        <button
                            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                            className="md:hidden p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 transition-colors mr-1"
                            aria-label="Abrir menú"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5-5.25h16.5m-16.5 10.5h16.5" />
                            </svg>
                        </button>
                        <h2 className="text-xs sm:text-sm font-black text-gray-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                            {tabLabels[activeTab]}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {toggleTheme && (
                            <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 transition-colors duration-200 cursor-pointer" aria-label="Toggle Theme" title="Cambiar tema">
                                {darkMode ? (
                                    <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.75 4.75l1.59 1.59m11.32 11.32l1.59 1.59M3 12h2.25m13.5 0H21M4.75 19.25l1.59-1.59m11.32-11.32l1.59-1.59M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" /></svg>
                                ) : (
                                    <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
                                )}
                            </button>
                        )}

                        <Link href={route('logout')} method="post" as="button" className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 border border-gray-200 dark:border-slate-700 transition-colors duration-200 cursor-pointer" aria-label="Cerrar sesión" title="Cerrar sesión">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>
                        </Link>
                    </div>
                </header>

                {/* Main Scrollable Content */}
                <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 mt-16 overflow-y-auto bg-gray-50 dark:bg-slate-900/10 space-y-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
