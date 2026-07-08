import { useState, useEffect } from 'react';
import { Link, Head } from '@inertiajs/react';
import { Smartphone, Monitor } from 'lucide-react';

export default function ResidentLayout({
    children,
    user,
    forceMobileView,
    setForceMobileView,
    mobileTab,
    setMobileTab,
    simulatedMoroso,
    setSimulatedMoroso,
    setShowMorosidadModal,
    residentCondo = 'Condominio Parque Central',
    toggleTheme,
    darkMode,
    isDesktop: isDesktopProp,
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

    const isDesktop = forceMobileView !== undefined
        ? !forceMobileView
        : isDesktopProp !== undefined
            ? isDesktopProp
            : autoDetectedDesktop;

    const toggleView = () => {
        if (setForceMobileView) {
            setForceMobileView(!isDesktop);
        } else {
            setAutoDetectedDesktop(prev => !prev);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 font-sans selection:bg-brand-green/30 selection:text-white">
            <Head>
                <title>Portal MiVecino - Tu Comunidad Conectada</title>
                <meta name="description" content="Acceso residente a copropiedad, historial de pagos y reglamentos en MiVecino." />
            </Head>

            {isDesktop ? (
                /* WIDESCREEN DESKTOP PORTAL */
                <div className="flex flex-col min-h-screen">
                    {/* Fixed Top Navbar */}
                    <header style={{ paddingTop: 'env(safe-area-inset-top)' }} className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-150 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 lg:px-8 fixed top-0 right-0 left-0 z-20 transition-colors duration-300">
                        <div className="flex items-center gap-3 text-left">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                </svg>
                            </div>
                            <h2 className="text-xs sm:text-sm font-black text-gray-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                                <span className="text-emerald-500">MiVecino</span>
                                <span className="text-[10px] sm:text-xs px-2.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full font-bold hidden sm:inline">
                                    {residentCondo}
                                </span>
                            </h2>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                            <button
                                onClick={toggleView}
                                type="button"
                                className="px-2.5 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider border transition-all duration-300 flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
                                title="Cambiar a vista celular"
                            >
                                <Smartphone className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Vista Celular</span>
                            </button>

                            <button
                                onClick={() => {
                                    setSimulatedMoroso(!simulatedMoroso);
                                    if (!simulatedMoroso) setMobileTab('home');
                                }}
                                className={`px-2.5 py-1 text-[10px] font-bold rounded-md uppercase tracking-wider border transition-all duration-300 flex items-center gap-1.5 ${
                                    simulatedMoroso
                                        ? 'bg-rose-500/10 border-rose-500/35 text-rose-500 hover:bg-rose-500/20 shadow-sm shadow-rose-500/5'
                                        : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                            >
                                <span aria-live="polite" className={`h-1.5 w-1.5 rounded-full ${simulatedMoroso ? 'bg-rose-500 animate-pulse' : 'bg-slate-400'}`} />
                                <span className="hidden sm:inline">{simulatedMoroso ? 'Morosidad Simulada' : 'Simular Morosidad'}</span>
                            </button>

                            <div className="flex items-center gap-2 bg-gray-100 dark:bg-slate-950/40 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-800">
                                <div className="h-6 w-6 rounded bg-emerald-600 flex items-center justify-center font-bold text-white text-[10px]">
                                    {user?.name?.charAt(0) || 'R'}
                                </div>
                                <span className="text-[11px] font-bold text-gray-700 dark:text-slate-350 hidden sm:inline">{user?.name}</span>
                                <span className="text-[8px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 font-extrabold uppercase px-1.5 py-0.5 rounded hidden sm:inline">RESIDENTE</span>
                            </div>

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

                    {/* Main Content */}
                    <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 mt-16 overflow-y-auto bg-gray-50 dark:bg-slate-900/10">
                        {children}
                    </main>
                </div>
            ) : (
                /* SMARTPHONE MOCKUP VIEW */
                <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 py-6">
                    {/* Toggle Button */}
                    <button
                        onClick={toggleView}
                        type="button"
                        className="mb-4 px-3 py-1.5 text-[10px] font-bold rounded-lg uppercase tracking-wider border transition-all duration-300 flex items-center gap-1.5 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                        title="Cambiar a vista escritorio"
                    >
                        <Monitor className="w-3.5 h-3.5" />
                        Vista PC
                    </button>

                    {/* Phone Mockup */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl md:rounded-[40px] overflow-hidden shadow-xl w-full max-w-[390px] h-[720px] max-h-[calc(100dvh-80px)] relative transition-colors duration-300 ring-8 ring-slate-950/90 shadow-2xl flex flex-col">

                        {/* Inner App Header */}
                        <div className="px-6 py-5 bg-gradient-to-br from-brand-green via-emerald-500 to-emerald-700 text-white flex flex-col gap-3 shrink-0">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-black tracking-tight font-sans">
                                        Mi<span className="text-emerald-100">Vecino</span>
                                    </h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setSimulatedMoroso(!simulatedMoroso);
                                            if (!simulatedMoroso) setMobileTab('home');
                                        }}
                                        type="button"
                                        className={`px-2 py-0.5 text-[8px] font-bold rounded border transition-all duration-300 ${
                                            simulatedMoroso
                                                ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                                                : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                                        }`}
                                        title="Simular Estado Moroso"
                                    >
                                        {simulatedMoroso ? 'Moroso' : 'Simular'}
                                    </button>
                                    {toggleTheme && (
                                        <button onClick={toggleTheme} type="button" className="p-1.5 rounded-lg border bg-white/10 hover:bg-white/20 border-white/20 text-white transition-all shadow-sm" aria-label="Toggle Theme" title="Cambiar tema">
                                            {darkMode ? (
                                                <svg className="w-4 h-4 text-amber-300" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.75 4.75l1.59 1.59m11.32 11.32l1.59 1.59M3 12h2.25m13.5 0H21M4.75 19.25l1.59-1.59m11.32-11.32l1.59-1.59M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" /></svg>
                                            ) : (
                                                <svg className="w-4 h-4 text-emerald-100" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
                                            )}
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setMobileTab(mobileTab === 'configuracion' ? 'home' : 'configuracion')}
                                        type="button"
                                        className={`p-1.5 rounded-lg border transition-all shadow-sm ${
                                            mobileTab === 'configuracion'
                                                ? 'bg-white text-[#72B043] border-white'
                                                : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                                        }`}
                                        title="Configuración"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </button>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="p-1.5 rounded-lg border bg-white/10 hover:bg-white/20 border-white/20 text-rose-300 hover:text-rose-200 transition-all shadow-sm"
                                        aria-label="Cerrar sesión"
                                        title="Cerrar sesión"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-left">
                                <div className="space-y-0.5">
                                    <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest block">Vecino Autenticado</span>
                                    <h4 className="text-sm font-extrabold flex items-center gap-1.5">
                                        Hola, {user?.name}!
                                        <span aria-live="polite" className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                                    </h4>
                                </div>
                                <span className="px-2 py-0.5 bg-white/15 border border-white/25 rounded-md text-[9px] font-mono tracking-wider font-extrabold">Depto 202</span>
                            </div>
                        </div>

                        {/* Inner App Content */}
                        <main className="flex-1 overflow-y-auto p-6 pb-20 space-y-6 text-left">
                            {children}
                        </main>

                        {/* Bottom Tab Bar */}
                        <nav style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} className="h-16 bg-slate-950 dark:bg-slate-950 border-t border-slate-900/60 flex justify-around items-center px-4 shrink-0 z-20 absolute bottom-0 left-0 right-0">
                            {[
                                { tab: 'home', label: 'Inicio', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg> },
                                { tab: 'reservas', label: 'Reservas', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" /></svg> },
                                { tab: 'pagos', label: 'Pagos', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h16.5M4.5 19.25h15M3.75 9h16.5M12 9v9M12 9a3 3 0 00-3-3H6.75M12 9a3 3 0 013-3h2.25" /></svg> },
                                { tab: 'comunidad', label: 'Chat', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.007-.018.01-.039.01-.061 0-.077-.033-.146-.086-.195a.3.3 0 00-.038-.03C19.53 7.828 18 6.75 18 6.75h-3.75V3.375A2.625 2.625 0 0011.625.75H2.625A2.625 2.625 0 000 3.375v10.5A2.625 2.625 0 002.625 16.5h3.75V19.875A2.625 2.625 0 009 22.5h9c1.45 0 2.625-1.175 2.625-2.625V8.511z" /></svg> }
                            ].map(item => {
                                const isReservasLocked = simulatedMoroso && item.tab === 'reservas';
                                return (
                                    <button
                                        key={item.tab}
                                        onClick={() => {
                                            if (isReservasLocked) {
                                                setShowMorosidadModal(true);
                                            } else {
                                                setMobileTab(item.tab);
                                            }
                                        }}
                                        type="button"
                                        aria-current={isReservasLocked ? undefined : (mobileTab === item.tab ? 'page' : undefined)}
                                        className={`flex flex-col items-center justify-center w-12 h-full transition-colors ${
                                            isReservasLocked
                                                ? 'text-rose-500'
                                                : mobileTab === item.tab
                                                ? 'text-brand-green font-bold'
                                                : 'text-slate-500 hover:text-slate-350'
                                        }`}
                                    >
                                        {item.icon}
                                        <span className="text-[9px] mt-0.5 font-bold uppercase tracking-wider">{item.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
}
