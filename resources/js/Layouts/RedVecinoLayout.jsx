import { useState } from 'react';
import { Link, Head } from '@inertiajs/react';
import { 
    Monitor, Shield, Users, Building2, Bug, 
    LayoutDashboard, Wrench, CircleDollarSign, Scale, 
    PanelLeftClose, PanelLeft, Sun, Moon, LogOut,
    MessageSquare, FileText, Sparkles, Package
} from 'lucide-react';
import AdminProfileModal from '@/Components/Layout/AdminProfileModal';
import CondoSelectorModal from '@/Components/Layout/CondoSelectorModal';

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
    const [showCondoSelectorModal, setShowCondoSelectorModal] = useState(false);
    const [showUserProfileModal, setShowUserProfileModal] = useState(false);

    const SIDEBAR_W = sidebarCollapsed ? 'w-16' : 'w-64';
    const CONTENT_PL = sidebarCollapsed ? 'md:pl-16' : 'md:pl-64';

    // Condominio Activo Resuelto
    const activeCondo = condosList.find(c => String(c.id) === String(adminCondoId)) || condosList[0] || { name: 'Condominio Alameda' };

    // Configuración de Acentos Cromáticos por Rol
    const THEME_CONFIG = {
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
    };

    const themeStyles = THEME_CONFIG[role.toLowerCase()] || THEME_CONFIG.admin;

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
                    { id: 'employees', icon: Users, label: 'Colaboradores', desc: 'Personal y RRHH' },
                    { id: 'payments', icon: CircleDollarSign, label: 'Finanzas', desc: 'Libro diario, recaudación y egresos' },
                    { id: 'fines', icon: Scale, label: 'Multas', desc: 'Infracciones y cargos' },
                    { id: 'amenities', icon: Sparkles, label: 'Espacios Comunes', desc: 'Amenidades, reservas y checklists' },
                    { id: 'packages', icon: Package, label: 'Encomiendas', desc: 'Recepción y firmas de entrega' },
                    { id: 'messages', icon: MessageSquare, label: 'Mensajería', desc: 'Canales oficiales y chat' },
                    { id: 'actas', icon: FileText, label: 'Actas & Votaciones', desc: 'Asambleas y Ley 21.442' },
                    { id: 'condo_profile', icon: Building2, label: 'Perfil Condominio', desc: 'Datos, alícuotas y estructura' },
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
            <aside aria-label="Navegación principal" className={`${SIDEBAR_W} bg-white dark:bg-slate-900 text-slate-800 dark:text-white border-r border-slate-200 dark:border-slate-800/80 flex flex-col justify-between shrink-0 transition-all duration-300 fixed inset-y-0 left-0 z-30 overflow-hidden ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <div className="space-y-6 text-left p-4">
                    {/* Logo + Toggle Button */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="flex items-center gap-3 w-full justify-between">
                            <div className="flex items-center gap-3">
                                {/* RedVecino Official Brand Icon Image Asset */}
                                <img
                                    src="/images/icon_redvecino.png"
                                    alt="RedVecino Icon"
                                    className="h-9 w-9 object-contain shrink-0 rounded-xl shadow-md"
                                />
                                {!sidebarCollapsed && (
                                    <div className="text-left min-w-0 animate-fade-in">
                                        <h3 className="text-base font-black tracking-tight text-slate-900 dark:text-white leading-none">
                                            Red<span className={`${themeStyles.text} font-extrabold`}>Vecino</span>
                                        </h3>
                                        <p className="text-[9px] text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono mt-1">{themeStyles.panelText}</p>
                                    </div>
                                )}
                            </div>
                            {!sidebarCollapsed && (
                                <button
                                    type="button"
                                    onClick={() => setSidebarCollapsed(true)}
                                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors hidden md:flex"
                                    aria-label="Colapsar menú"
                                    title="Colapsar menú lateral"
                                >
                                    <PanelLeftClose className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Dedicated Toggle Button underneath Logo when Collapsed */}
                        {sidebarCollapsed && (
                            <button
                                type="button"
                                onClick={() => setSidebarCollapsed(false)}
                                className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-white transition-all flex items-center justify-center border border-slate-200 dark:border-slate-700/60 shadow-xs group hidden md:flex"
                                aria-label="Expandir menú"
                                title="Expandir menú lateral"
                            >
                                <PanelLeft className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            </button>
                        )}
                    </div>

                    {/* Botón Interactivo de Tarjeta del Condominio Activo */}
                    {!sidebarCollapsed && role !== 'ti' && condosList.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setShowCondoSelectorModal(true)}
                            className="w-full bg-indigo-50/80 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/60 rounded-2xl p-3 text-left transition-all shadow-xs group animate-fade-in"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                                    🏢 Condominio Activo
                                </span>
                                <span className="text-[9px] bg-indigo-600 text-white font-bold px-2 py-0.5 rounded-full group-hover:scale-105 transition-transform flex items-center gap-1">
                                    <span>Cambiar</span>
                                    <span>🔄</span>
                                </span>
                            </div>
                            <div className="text-xs font-black text-slate-900 dark:text-white truncate mt-1">
                                {activeCondo.name}
                            </div>
                        </button>
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
                                        ? `${themeStyles.bg} ${themeStyles.border} text-slate-900 dark:text-white shadow-xs font-bold`
                                        : 'border-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                                }`}
                            >
                                <div className="flex items-center gap-2">
                                    <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? themeStyles.text : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
                                    {!sidebarCollapsed && (
                                        <span className={`text-xs font-bold ${activeTab === tab.id ? themeStyles.text : 'text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100'}`}>
                                            {tab.label}
                                        </span>
                                    )}
                                </div>
                                {!sidebarCollapsed && (
                                    <span className="text-[9px] text-slate-500 dark:text-slate-500 font-medium pl-6 group-hover:text-slate-600 dark:group-hover:text-slate-400">
                                        {tab.desc}
                                    </span>
                                )}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Perfil del Administrador Clickeable y Badge de Versión */}
                <div className="p-4 space-y-2">
                    <button
                        type="button"
                        onClick={() => setShowUserProfileModal(true)}
                        className={`w-full p-3 rounded-2xl flex items-center gap-2.5 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 transition-all cursor-pointer group text-left ${sidebarCollapsed ? 'justify-center' : ''}`}
                        title="Editar Mi Perfil de Administrador"
                    >
                        <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${themeStyles.gradient} flex items-center justify-center text-xs font-extrabold text-white shrink-0 group-hover:scale-105 transition-transform`}>
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        {!sidebarCollapsed && (
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-black text-slate-900 dark:text-slate-100 truncate">{user?.name || 'Administrador General'}</p>
                                    <span className="text-[10px] text-indigo-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">✏️</span>
                                </div>
                                <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider truncate">
                                    {role === 'admin' ? 'Administrador General' : role}
                                </p>
                            </div>
                        )}
                    </button>

                    {!sidebarCollapsed && (
                        <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between px-1 text-[10px] font-mono text-slate-400 dark:text-slate-500">
                            <span className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>v0.0.15-dev</span>
                            </span>
                            <span className="text-[9px] font-sans font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                                Build 2026.08
                            </span>
                        </div>
                    )}
                </div>
            </aside>

            {/* B. ÁREA PRINCIPAL CON HEADER SUPERIOR */}
            <div className={`flex-1 flex flex-col min-w-0 ${CONTENT_PL} transition-all duration-300`}>
                {/* Header Superior Móvil & Escritorio */}
                <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between fixed top-0 right-0 left-0 z-20 transition-all duration-300 md:pl-64">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
                            aria-label="Abrir menú móvil"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5-5.25h16.5m-16.5 10.5h16.5" />
                            </svg>
                        </button>
                        <div className="flex flex-col text-left pl-2 sm:pl-4">
                            <div className="flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${themeStyles.bg} border ${themeStyles.border} shrink-0`} />
                                <h4 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                                    {tabs.find(t => t.id === activeTab)?.label || 'Resumen'} <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">· {activeCondo.name}</span>
                                </h4>
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block pl-4">
                                {tabs.find(t => t.id === activeTab)?.desc || 'Vista general del condominio'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Botón Móvil/Escritorio de Cambio de Condominio en Header */}
                        {role !== 'ti' && condosList.length > 0 && (
                            <button
                                type="button"
                                onClick={() => setShowCondoSelectorModal(true)}
                                className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/30 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-black text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                                <span>🏢</span>
                                <span className="hidden md:inline">{activeCondo.name}</span>
                                <span>🔄</span>
                            </button>
                        )}

                        {/* Cambiar Tema */}
                        {toggleTheme && (
                            <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-750 transition-colors cursor-pointer" aria-label="Toggle Theme">
                                {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-600" />}
                            </button>
                        )}

                        {/* Info Usuario Clickeable (Perfil de Administrador) */}
                        <button 
                            type="button"
                            onClick={() => setShowUserProfileModal(true)}
                            className="flex items-center gap-2 bg-slate-100 dark:bg-slate-900/60 hover:bg-slate-200 dark:hover:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 transition-all cursor-pointer group"
                            title="Ver / Editar Mi Perfil"
                        >
                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 hidden sm:inline truncate max-w-[140px]">
                                {user?.name || 'Administrador General'}
                            </span>
                            <span className={`text-[8px] ${themeStyles.bg} border ${themeStyles.border} ${themeStyles.text} font-extrabold uppercase px-1.5 py-0.5 rounded`}>
                                {role === 'admin' ? 'Admin General' : role}
                            </span>
                        </button>

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

            {/* Modales Desacoplados (Skinny Resources) */}
            <CondoSelectorModal
                isOpen={showCondoSelectorModal}
                onClose={() => setShowCondoSelectorModal(false)}
                condosList={condosList}
                adminCondoId={adminCondoId}
                setAdminCondoId={setAdminCondoId}
                user={user}
            />

            <AdminProfileModal
                isOpen={showUserProfileModal}
                onClose={() => setShowUserProfileModal(false)}
                user={user}
                role={role}
            />
        </div>
    );
}
