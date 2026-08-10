import { useState, useEffect } from 'react';

/**
 * Mobile App Simulator (Android UI Frame) for Welcome page
 */
export default function MobileAppSimulator({ 
    simulatedMobileDarkMode, 
    setSimulatedMobileDarkMode,
    mobileTab,
    setMobileTab,
    mobileNotifications,
    triggerIotApertura,
    mobileFingerprintScanning,
    mobileFingerprintSuccess,
    generateGuestQr,
    mobileGuestName,
    setMobileGuestName,
    mobileGeneratedQr,
    activeToast
}) {
    return (
        <div className={`w-[320px] h-[640px] rounded-[48px] border-[10px] border-slate-900 shadow-2xl relative overflow-hidden flex flex-col transition-all duration-300 ${simulatedMobileDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            {/* Top Bar / Notch */}
            <div className="h-6 bg-slate-900 w-full flex items-center justify-between px-6 shrink-0 z-30">
                <span className="text-[10px] font-mono text-slate-400">09:41</span>
                <div className="w-16 h-3 bg-black rounded-full"></div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                    <span>5G</span>
                    <span>🔋</span>
                </div>
            </div>

            {/* Header Toolbar */}
            <div className={`p-4 border-b shrink-0 flex items-center justify-between z-20 ${simulatedMobileDarkMode ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white/90'} backdrop-blur-md`}>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white font-black text-xs shadow-md">
                        MV
                    </div>
                    <div className="text-left">
                        <h4 className="text-xs font-black tracking-tight leading-none">MiVecino App</h4>
                        <span className="text-[9px] text-emerald-500 font-bold">Depto 202 - Online</span>
                    </div>
                </div>
                <button
                    onClick={() => setSimulatedMobileDarkMode(!simulatedMobileDarkMode)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs transition-colors ${simulatedMobileDarkMode ? 'bg-slate-800 text-amber-400' : 'bg-slate-100 text-slate-700'}`}
                >
                    {simulatedMobileDarkMode ? '🌙' : '☀️'}
                </button>
            </div>

            {/* Active Toast Notification */}
            {activeToast && (
                <div className="absolute top-16 left-3 right-3 z-50 animate-bounce">
                    <div className="bg-emerald-500 text-white p-3 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-400 text-left">
                        <span className="text-xl">🔔</span>
                        <div>
                            <h5 className="text-xs font-black">{activeToast.title}</h5>
                            <p className="text-[10px] opacity-90">{activeToast.desc}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* App Body Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-left">
                {mobileTab === 'home' && (
                    <div className="space-y-4 animate-fade-in">
                        {/* Quick Action Cards */}
                        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-4 text-white shadow-lg space-y-2 relative overflow-hidden">
                            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">Próximo Gasto Común</span>
                            <div className="text-2xl font-black">$165.000 <span className="text-xs font-normal opacity-80">CLP</span></div>
                            <div className="flex justify-between items-center text-[10px] opacity-90 pt-1">
                                <span>Vence: 05 Junio</span>
                                <span className="bg-white/20 px-2 py-0.5 rounded-full font-bold">Pendiente</span>
                            </div>
                        </div>

                        {/* IoT Gate Access */}
                        <div className={`p-4 rounded-2xl border transition-all ${simulatedMobileDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-extrabold flex items-center gap-1.5">
                                    <span>🚗</span> Apertura de Portón IoT
                                </span>
                                <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">NFC / Bluetooth</span>
                            </div>
                            <button
                                onClick={triggerIotApertura}
                                disabled={mobileFingerprintScanning || mobileFingerprintSuccess}
                                className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                                    mobileFingerprintSuccess
                                        ? 'bg-emerald-500 text-white'
                                        : mobileFingerprintScanning
                                            ? 'bg-amber-500 text-white animate-pulse'
                                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md active:scale-95'
                                }`}
                            >
                                {mobileFingerprintSuccess ? (
                                    <><span>✅</span> ¡Portón Abierto!</>
                                ) : mobileFingerprintScanning ? (
                                    <><span>⏳</span> Validando Huella...</>
                                ) : (
                                    <><span>👆</span> Presionar para Abrir Access Gate</>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {mobileTab === 'qr' && (
                    <div className="space-y-4 animate-fade-in text-center">
                        <div className={`p-4 rounded-2xl border ${simulatedMobileDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                            <h4 className="text-xs font-black mb-1">Pase de Visita Express QR</h4>
                            <p className="text-[10px] text-slate-400 mb-3">Genera un código QR dinámico con vencimiento para tus invitados.</p>

                            <input
                                type="text"
                                value={mobileGuestName}
                                onChange={(e) => setMobileGuestName(e.target.value)}
                                placeholder="Nombre de la visita..."
                                className={`w-full px-3 py-2 rounded-xl text-xs font-bold mb-3 border focus:outline-none focus:ring-2 focus:ring-emerald-500 ${simulatedMobileDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                            />

                            <button
                                onClick={() => generateGuestQr(mobileGuestName)}
                                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-all shadow-md active:scale-95"
                            >
                                ⚡ Generar Código QR
                            </button>

                            {mobileGeneratedQr && (
                                <div className="mt-4 p-4 bg-white rounded-xl shadow-inner inline-block border border-slate-200 animate-scale-up">
                                    <div className="w-32 h-32 bg-slate-900 rounded-lg p-2 flex flex-col justify-between items-center text-white">
                                        <div className="grid grid-cols-4 gap-1 w-full h-full p-1 border-2 border-emerald-400 rounded">
                                            <div className="bg-emerald-400 rounded-xs"></div>
                                            <div className="bg-white rounded-xs"></div>
                                            <div className="bg-white rounded-xs"></div>
                                            <div className="bg-emerald-400 rounded-xs"></div>
                                            <div className="bg-white rounded-xs"></div>
                                            <div className="bg-emerald-400 rounded-xs"></div>
                                            <div className="bg-emerald-400 rounded-xs"></div>
                                            <div className="bg-white rounded-xs"></div>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-bold text-slate-700 mt-2 block">Token Válido x 2 Hrs</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {mobileTab === 'notices' && (
                    <div className="space-y-3 animate-fade-in">
                        <h4 className="text-xs font-black tracking-tight">Notificaciones Recientes</h4>
                        {mobileNotifications.map(n => (
                            <div key={n.id} className={`p-3 rounded-xl border transition-all ${simulatedMobileDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'}`}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold">{n.title}</span>
                                    <span className="text-[9px] opacity-60">{n.time}</span>
                                </div>
                                <p className="text-[10px] opacity-80 leading-relaxed">{n.desc}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Nav Bar */}
            <div className={`h-14 border-t shrink-0 grid grid-cols-3 items-center text-center z-20 ${simulatedMobileDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}>
                <button
                    onClick={() => setMobileTab('home')}
                    className={`flex flex-col items-center justify-center text-[10px] font-bold transition-colors ${mobileTab === 'home' ? 'text-emerald-500' : 'opacity-50'}`}
                >
                    <span className="text-base">🏠</span>
                    <span>Inicio</span>
                </button>
                <button
                    onClick={() => setMobileTab('qr')}
                    className={`flex flex-col items-center justify-center text-[10px] font-bold transition-colors ${mobileTab === 'qr' ? 'text-emerald-500' : 'opacity-50'}`}
                >
                    <span className="text-base">📱</span>
                    <span>Acceso QR</span>
                </button>
                <button
                    onClick={() => setMobileTab('notices')}
                    className={`flex flex-col items-center justify-center text-[10px] font-bold transition-colors relative ${mobileTab === 'notices' ? 'text-emerald-500' : 'opacity-50'}`}
                >
                    <span className="text-base">🔔</span>
                    <span>Noticias</span>
                    {mobileNotifications.some(n => !n.read) && (
                        <span className="absolute top-1 right-8 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
                    )}
                </button>
            </div>
        </div>
    );
}
