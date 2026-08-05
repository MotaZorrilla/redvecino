import { useState, useEffect } from 'react';
import { Link, Head } from '@inertiajs/react';
import { Smartphone, Monitor, Sun, Moon, LogOut, MessageSquare, Home, CreditCard, Wrench, FileText, Bell } from 'lucide-react';

export default function MiVecinoLayout({
    children,
    user,
    forceMobileView,
    setForceMobileView,
    mobileTab,
    setMobileTab,
    simulatedMoroso,
    setSimulatedMoroso,
    setShowMorosidadModal,
    residentCondo = 'Condominio Alameda Loft',
    toggleTheme,
    darkMode,
}) {
    const [autoDetectedDesktop, setAutoDetectedDesktop] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 768;
        }
        return true;
    });

    useEffect(() => {
        const handleResize = () => {
            setAutoDetectedDesktop(window.innerWidth >= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isDesktop = forceMobileView !== undefined ? !forceMobileView : autoDetectedDesktop;

    const toggleView = () => {
        if (setForceMobileView) {
            setForceMobileView(!isDesktop);
        } else {
            setAutoDetectedDesktop(prev => !prev);
        }
    };

    const isPropietarioUser = user?.role_name?.toLowerCase() === 'propietario' || user?.email?.includes('propietario');

    // Botones de Navegación del Residente o Propietario
    const navItems = isPropietarioUser ? [
        { tab: 'home', label: 'Resumen Financiero', icon: Home },
        { tab: 'reports', label: 'Rendición Cuentas', icon: FileText },
        { tab: 'booking', label: 'Reservar Espacios', icon: Bell, isReservable: true },
        { tab: 'units', label: 'Unidades y Derechos', icon: CreditCard }
    ] : [
        { tab: 'home', label: 'Inicio', icon: Home },
        { tab: 'comunicados', label: 'Avisos', icon: Bell },
        { tab: 'reservas', label: 'Reservas', icon: Bell, isReservable: true },
        { tab: 'pagos', label: 'Pagos', icon: CreditCard },
        { tab: 'incidencias', label: 'Tickets', icon: Wrench },
        { tab: 'comunidad', label: 'Mensajería', icon: MessageSquare },
        { tab: 'documentos', label: 'Biblioteca', icon: FileText }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 font-sans selection:bg-emerald-500/20 selection:text-emerald-700">
            <Head>
                <title>Portal MiVecino - Tu Comunidad Conectada</title>
            </Head>

            {isDesktop ? (
                /* ================================================================= */
                /* A. VISTA ESCRITORIO PC                                            */
                /* ================================================================= */
                <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row relative w-full transition-colors duration-300">
                    {/* A.1 SIDEBAR IZQUIERDO RESIDENCIAL */}
                    <aside aria-label="Navegación principal" className="w-64 bg-slate-900 text-white flex flex-col justify-between shrink-0 fixed inset-y-0 left-0 z-30 overflow-hidden hidden md:flex border-r border-slate-800">
                        <div className="space-y-6 text-left p-4">
                            {/* Logo */}
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shrink-0">
                                    <Home className="w-5 h-5 text-white" />
                                </div>
                                <div className="text-left min-w-0">
                                    <h3 className="text-base font-black tracking-tight text-white leading-none">
                                        Mi<span className="text-emerald-450 font-extrabold">Vecino</span>
                                    </h3>
                                    <p className="text-[9px] text-slate-400 uppercase tracking-widest font-mono mt-1">Portal Residente</p>
                                </div>
                            </div>

                            {/* Condo Activo */}
                            <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-3 space-y-1 text-left">
                                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Condominio Activo</span>
                                <span className="text-xs font-bold text-slate-200 block truncate">{residentCondo}</span>
                            </div>

                            {/* Menú de Botones */}
                            <nav aria-label="Menú principal" className="space-y-1">
                                {navItems.map(item => {
                                    const isReservasLocked = simulatedMoroso && (item.tab === 'reservas' || item.tab === 'booking');
                                    const Icon = item.icon;

                                    return (
                                        <button
                                            key={item.tab}
                                            type="button"
                                            onClick={() => {
                                                if (isReservasLocked && setShowMorosidadModal) {
                                                    setShowMorosidadModal(true);
                                                    return;
                                                }
                                                if (setMobileTab) setMobileTab(item.tab);
                                            }}
                                            className={`w-full text-left rounded-xl transition-all duration-200 group border px-4 py-2.5 flex items-center gap-2.5 ${
                                                mobileTab === item.tab && !isReservasLocked
                                                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 font-bold'
                                                    : 'border-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                                            }`}
                                        >
                                            <Icon className={`w-4 h-4 ${mobileTab === item.tab && !isReservasLocked ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-300'}`} />
                                            <span className="text-xs font-bold truncate">
                                                {isReservasLocked ? 'Reservas 🔒' : item.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Perfil del Residente */}
                        <div className="p-4">
                            <div className="w-full p-3 rounded-2xl flex items-center gap-2.5 bg-slate-800/60 border border-slate-700/60">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-xs font-extrabold text-white shrink-0">
                                    {user?.name?.charAt(0) || 'U'}
                                </div>
                                <div className="min-w-0 flex-1 text-left">
                                    <span className="text-xs font-bold text-slate-200 block truncate">{user?.name}</span>
                                    <span className="text-[9px] text-slate-400 block truncate font-medium">RESIDENTE</span>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* A.2 AREA DE CONTENIDO (CON PADDING LEFT PARA EL SIDEBAR EN MD) */}
                    <div className="flex-1 flex flex-col md:pl-64 min-h-screen transition-all duration-300">
                        {/* Header Superior Fijo (h-16) */}
                        <header className="h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 md:px-10 fixed top-0 right-0 left-0 md:pl-64 z-20 transition-all duration-300">
                            <div className="flex items-center gap-3 pl-2 md:pl-4">
                                <div className="flex items-center gap-2.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 hidden sm:inline-block" />
                                    <h4 className="text-xs sm:text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                                        {navItems.find(item => item.tab === mobileTab)?.label || 'Inicio'}
                                    </h4>
                                </div>
                            </div>

                            {/* Controles del Simulador + Telemetría */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={toggleView}
                                    className="px-2.5 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider border bg-slate-100 dark:bg-slate-855 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer flex items-center gap-1.5"
                                    title="Cambiar a vista celular"
                                >
                                    <Smartphone className="w-3.5 h-3.5" />
                                    <span>Vista Celular</span>
                                </button>

                                <button
                                    onClick={() => {
                                        setSimulatedMoroso && setSimulatedMoroso(!simulatedMoroso);
                                        if (!simulatedMoroso && setMobileTab) setMobileTab('home');
                                    }}
                                    className={`px-2.5 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider border flex items-center gap-1.5 transition-colors cursor-pointer ${
                                        simulatedMoroso
                                            ? 'bg-rose-500/10 border-rose-500/35 text-rose-500 hover:bg-rose-500/20'
                                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    <span className={`h-1.5 w-1.5 rounded-full ${simulatedMoroso ? 'bg-rose-500 animate-pulse' : 'bg-slate-400'}`} />
                                    <span>{simulatedMoroso ? 'Morosidad Simulada' : 'Simular Morosidad'}</span>
                                </button>

                                {/* Info Usuario */}
                                <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-900/60 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-800">
                                    <span className="text-[11px] font-bold text-gray-700 dark:text-slate-350">{user?.name}</span>
                                    <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-extrabold uppercase px-1.5 py-0.5 rounded">RESIDENTE</span>
                                </div>

                                {/* Tema */}
                                {toggleTheme && (
                                    <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 transition-colors" aria-label="Toggle Theme">
                                        {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
                                    </button>
                                )}

                                {/* Salida */}
                                <Link href={route('logout')} method="post" as="button" className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-rose-500 dark:text-rose-450 border border-gray-200 dark:border-slate-700 transition-colors cursor-pointer" title="Cerrar sesión">
                                    <LogOut className="w-4 h-4" />
                                </Link>
                            </div>
                        </header>

                        {/* Main Content */}
                        <main className="flex-1 px-8 py-8 mt-16 overflow-y-auto bg-slate-50 dark:bg-slate-950">
                            {children}
                        </main>
                    </div>
                </div>
            ) : (
                /* ================================================================= */
                /* B. VISTA CELULAR SIMULADA (MOCKUP ACCESIBLE)                       */
                /* ================================================================= */
                <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6 bg-slate-100 dark:bg-slate-950 transition-colors">
                    {/* Botón flotante para PC */}
                    <button
                        onClick={toggleView}
                        className="mb-4 px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider border bg-white dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer flex items-center gap-1.5"
                    >
                        <Monitor className="w-3.5 h-3.5" />
                        <span>Vista PC</span>
                    </button>

                    {/* Contenedor del Celular */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[36px] overflow-hidden shadow-2xl w-full max-w-[390px] h-[720px] max-h-[calc(100dvh-80px)] relative ring-8 ring-slate-950 shadow-2xl flex flex-col transition-colors">
                        
                        {/* Cabecera App Móvil */}
                        <div className="px-6 py-5 bg-gradient-to-br from-emerald-50 to-emerald-700 text-white flex flex-col gap-3 shrink-0">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                                        <Home className="w-4 h-4 text-white" />
                                    </div>
                                    <h3 className="text-lg font-black tracking-tight font-sans">
                                        Mi<span className="text-emerald-100">Vecino</span>
                                    </h3>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    {/* Botón Simular Morosidad */}
                                    <button
                                        onClick={() => {
                                            setSimulatedMoroso && setSimulatedMoroso(!simulatedMoroso);
                                            if (!simulatedMoroso && setMobileTab) setMobileTab('home');
                                        }}
                                        className={`px-2 py-0.5 text-[8px] font-bold rounded border transition-colors ${
                                            simulatedMoroso
                                                ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                                                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                                        }`}
                                    >
                                        {simulatedMoroso ? 'Moroso' : 'Simular'}
                                    </button>

                                    {/* Tema */}
                                    {toggleTheme && (
                                        <button onClick={toggleTheme} className="p-1.5 rounded-lg border bg-white/10 hover:bg-white/20 border-white/20 text-white transition-all">
                                            {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-emerald-100" />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Scroll Content Celular */}
                        <div className="flex-1 overflow-y-auto px-4 py-4 bg-slate-50 dark:bg-slate-950/20">
                            {children}
                        </div>

                        {/* Menú de Navegación Inferior (BottomNav) */}
                        <div className="h-16 bg-white dark:bg-slate-900 border-t border-slate-150 dark:border-slate-800 flex items-center justify-around shrink-0 px-2">
                            {navItems.slice(0, 5).map(item => {
                                const isReservasLocked = simulatedMoroso && (item.tab === 'reservas' || item.tab === 'booking');
                                const Icon = item.icon;

                                return (
                                    <button
                                        key={item.tab}
                                        onClick={() => {
                                            if (isReservasLocked && setShowMorosidadModal) {
                                                setShowMorosidadModal(true);
                                                return;
                                            }
                                            if (setMobileTab) setMobileTab(item.tab);
                                        }}
                                        className={`flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all ${
                                            mobileTab === item.tab && !isReservasLocked
                                                ? 'text-emerald-500 font-bold'
                                                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-350'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className="text-[9px] mt-1 truncate">
                                            {isReservasLocked ? 'Locked 🔒' : item.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
