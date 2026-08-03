import { useState } from 'react';
import { Link, Head } from '@inertiajs/react';
import { 
    Monitor, Shield, Users, Building2, Bug, 
    LayoutDashboard, Wrench, CircleDollarSign, Scale, 
    PanelLeftClose, PanelLeft, Sun, Moon, LogOut,
    MessageSquare, FileText
} from 'lucide-react';


export default function RedVecinoLayout({
    children,
    user,
    role = 'admin', // 'ti', 'admin', 'comite', 'colaborador'
    activeTab,
    setActiveTab,
    condosList = [],
    adminCondoId,
    setAdminCondoId,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    toggleTheme,
    darkMode,
}) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const SIDEBAR_W = sidebarCollapsed ? 'w-16' : 'w-64';
    const CONTENT_PL = sidebarCollapsed ? 'md:pl-16' : 'md:pl-64';

    // Configuración de Acentos Cromáticos por Rol
    const themeStyles = {
        ti: {
            color: 'cyan',
            text: 'text-cyan-600 dark:text-cyan-400',
            bg: 'bg-cyan-500/10',
            border: 'border-cyan-500/50',
            gradient: 'from-cyan-500 to-cyan-700',
            panelText: 'ESTACIÓN TI / DEVOPS'
        },
        admin: {
            color: 'indigo',
            text: 'text-indigo-600 dark:text-indigo-400',
            bg: 'bg-indigo-500/10',
            border: 'border-indigo-500/50',
            gradient: 'from-indigo-500 to-indigo-700',
            panelText: 'PANEL ADMINISTRACIÓN'
        },
        comite: {
            color: 'violet',
            text: 'text-violet-600 dark:text-violet-400',
            bg: 'bg-violet-500/10',
            border: 'border-violet-500/50',
            gradient: 'from-violet-500 to-violet-700',
            panelText: 'AUDITORÍA COMITÉ'
        },
        colaborador: {
            color: 'orange',
            text: 'text-orange-600 dark:text-orange-400',
            bg: 'bg-orange-500/10',
            border: 'border-orange-500/50',
            gradient: 'from-orange-500 to-orange-700',
            panelText: 'CONSOLA OPERATIVA'
        }
    }[role.toLowerCase()] || themeStyles.admin;

    // Configuración de Pestañas según el Rol
    const getTabsByRole = () => {
        switch (role.toLowerCase()) {
            case 'ti':
                return [
                    { id: 'devops', icon: Monitor, label: 'DevOps & Telemetría', desc: 'Monitoreo e Infraestructura' },
                    { id: 'matrix', icon: Shield, label: 'Matriz Spatie', desc: 'Mapeo Real de Permisos' },
                    { id: 'impersonation', icon: Users, label: 'Impersonación', desc: 'Matriz de Simulación' },
                    { id: 'users', icon: Users, label: 'Usuarios Globales', desc: 'Spatie Roles & Permisos' },
                    { id: 'condos', icon: Building2, label: 'Condominios', desc: 'Gestión de Comunidades' },
                    { id: 'sandbox', icon: Bug, label: 'Sandbox de Inspección', desc: 'Módulos por Condominio' },
                ];
            case 'admin':
                return [
                    { id: 'dashboard', icon: LayoutDashboard, label: 'Resumen', desc: 'Vista general' },
                    { id: 'properties', icon: Building2, label: 'Propiedades', desc: 'Casas y departamentos' },
                    { id: 'users', icon: Users, label: 'Usuarios', desc: 'Vecinos y directiva' },
                    { id: 'tickets', icon: Wrench, label: 'Tickets', desc: 'Casos y solicitudes' },
                    { id: 'payments', icon: CircleDollarSign, label: 'Pagos', desc: 'Historial y registros' },
                    { id: 'fines', icon: Scale, label: 'Multas', desc: 'Infracciones y cargos' },
                ];
            case 'comite':
                return [
                    { id: 'dashboard', icon: LayoutDashboard, label: 'Resumen', desc: 'Vista general' },
                    { id: 'finances', icon: CircleDollarSign, label: 'Finanzas', desc: 'Auditoría de ingresos' },
                    { id: 'chats', icon: MessageSquare, label: 'Auditoría Chats', desc: 'Bitácora de mensajería' },
                    { id: 'actas', icon: FileText, label: 'Actas de Copropiedad', desc: 'Reuniones y asambleas' },
                ];
            case 'colaborador':
                return [
                    { id: 'attendance', icon: Users, label: 'Asistencia', desc: 'Registro de turno' },
                    { id: 'packages', icon: Building2, label: 'Encomiendas', desc: 'Entrega de paquetes' },
                    { id: 'tickets', icon: Wrench, label: 'Tareas Asignadas', desc: 'Órdenes de mantenimiento' },
                ];
            default:
                return [];
        }
    };

    const tabs = getTabsByRole();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-slate-200 font-sans flex flex-col md:flex-row relative w-full transition-colors duration-300">
            <Head>
                <title>{`RedVecino - ${themeStyles.panelText}`}</title>
            </Head>

            {/* A. SIDEBAR IZQUIERDO */}
            <aside aria-label="Navegación principal" className={`${SIDEBAR_W} bg-slate-900 text-white flex flex-col justify-between shrink-0 transition-all duration-300 fixed inset-y-0 left-0 z-30 overflow-hidden ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="space-y-6 text-left p-4">
                    {/* Logo + Toggle */}
                    <div className="flex items-center gap-3">
                        <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${themeStyles.gradient} flex items-center justify-center shadow-lg shrink-0`}>
                            <Building2 className="w-5 h-5 text-white" />
                        </div>
                        {!sidebarCollapsed && (
                            <div className="text-left min-w-0 animate-fade-in">
                                <h3 className="text-base font-black tracking-tight text-white leading-none">
                                    Red<span className={`${themeStyles.text} font-extrabold`}>Vecino</span>
                                </h3>
                                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-mono mt-1">{themeStyles.panelText}</p>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="ml-auto p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors hidden md:flex"
                            aria-label={sidebarCollapsed ? 'Expandir menú' : 'Colapsar menú'}
                        >
                            {sidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Selector de Condominio (Sólo Admin/Comite/Colaborador) */}
                    {!sidebarCollapsed && role !== 'ti' && condosList.length > 0 && (
                        <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 space-y-1 text-left animate-fade-in">
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Condominio Activo</span>
                            <select
                                value={adminCondoId}
                                onChange={(e) => setAdminCondoId && setAdminCondoId(Number(e.target.value))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-lg py-1.5 px-3 text-xs font-bold text-slate-100 cursor-pointer focus:ring-1 focus:ring-slate-700 pr-8"
                            >
                                {condosList.map(c => (
                                    <option key={c.id} value={c.id} className="bg-slate-900 text-slate-100">{c.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Menú de Botones */}
                    <nav aria-label="Menú principal" className="space-y-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => {
                                    setActiveTab(tab.id);
                                    if (setIsMobileSidebarOpen) setIsMobileSidebarOpen(false);
                                }}
                                className={`w-full text-left rounded-xl transition-all duration-200 group border ${
                                    sidebarCollapsed ? 'p-2.5 flex justify-center' : 'px-4 py-2.5 flex flex-col gap-0.5'
                                } ${
                                    activeTab === tab.id
                                        ? `${themeStyles.bg} ${themeStyles.border} text-white shadow-md`
                                        : 'border-transparent hover:bg-slate-800 text-slate-450 hover:text-slate-200'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? themeStyles.text : 'text-slate-400 group-hover:text-slate-300'}`} />
                                    {!sidebarCollapsed && (
                                        <span className={`text-xs font-bold ${activeTab === tab.id ? themeStyles.text : 'text-slate-300 group-hover:text-slate-200'}`}>
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

                {/* Perfil del Administrador */}
                <div className="p-4">
                    <div className={`w-full p-3 rounded-2xl flex items-center gap-2.5 bg-slate-800/60 border border-slate-700/60 ${sidebarCollapsed ? 'justify-center' : ''}`}>
                        <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${themeStyles.gradient} flex items-center justify-center text-xs font-extrabold text-white shrink-0`}>
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        {!sidebarCollapsed && (
                            <div className="min-w-0 flex-1 text-left">
                                <span className="text-xs font-bold text-slate-200 block truncate">{user?.name}</span>
                                <span className="text-[9px] text-slate-400 block truncate font-medium">{role.toUpperCase()}</span>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* B. CONTENIDO DERECHO */}
            <div className={`flex-1 flex flex-col ${CONTENT_PL} min-h-screen transition-all duration-300`}>
                {/* Header Superior Fijo (h-16) */}
                <header className={`h-16 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-850 flex items-center justify-between px-6 fixed top-0 right-0 left-0 ${CONTENT_PL} z-20 transition-all duration-300`}>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileSidebarOpen && setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                            className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5-5.25h16.5m-16.5 10.5h16.5" />
                            </svg>
                        </button>
                        <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                            {tabs.find(t => t.id === activeTab)?.label || 'Resumen'}
                        </h4>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Cambiar Tema */}
                        {toggleTheme && (
                            <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-750 transition-colors" aria-label="Toggle Theme">
                                {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-600" />}
                            </button>
                        )}

                        {/* Info Usuario */}
                        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800">
                            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 hidden sm:inline">{user?.name}</span>
                            <span className={`text-[8px] ${themeStyles.bg} border ${themeStyles.border} ${themeStyles.text} font-extrabold uppercase px-1.5 py-0.5 rounded`}>
                                {role}
                            </span>
                        </div>

                        {/* Cerrar Sesión */}
                        <Link href={route('logout')} method="post" as="button" className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-rose-500 dark:text-rose-450 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer" title="Cerrar sesión">
                            <LogOut className="w-4 h-4" />
                        </Link>
                    </div>
                </header>

                {/* Área de Contenido con Scroll */}
                <main className="flex-1 px-6 py-8 mt-16 overflow-y-auto bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
                    {children}
                </main>
            </div>
        </div>
    );
}
