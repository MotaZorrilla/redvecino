import React, { useState, useEffect } from 'react';

export default function AttendancePunchClock({ employeeProfileId = 1, condoId = 1 }) {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('es-CL'));
    const [todayStatus, setTodayStatus] = useState({
        has_checked_in: false,
        has_checked_out: false,
        check_in_time: null,
        check_out_time: null
    });
    const [msg, setMsg] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('es-CL'));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleCheckIn = () => {
        const timeStr = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
        setTodayStatus({
            ...todayStatus,
            has_checked_in: true,
            check_in_time: timeStr
        });
        setMsg(`¡Entrada registrada a las ${timeStr}!`);
        setTimeout(() => setMsg(''), 4000);
    };

    const handleCheckOut = () => {
        const timeStr = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
        setTodayStatus({
            ...todayStatus,
            has_checked_out: true,
            check_out_time: timeStr
        });
        setMsg(`¡Salida registrada a las ${timeStr}! Turno finalizado.`);
        setTimeout(() => setMsg(''), 4000);
    };

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-4 text-left font-outfit">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/30">
                        ⏰ Reloj Control Digital
                    </span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white mt-1">
                        Control de Asistencia y Turno
                    </h3>
                </div>
                <div className="text-right">
                    <span className="text-xs font-mono font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800">
                        {currentTime}
                    </span>
                </div>
            </div>

            {msg && (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 p-3 rounded-xl text-xs font-bold animate-fade-in flex items-center gap-2">
                    <span>✅</span>
                    <span>{msg}</span>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Entrada Hoy</span>
                        <span className="text-sm font-black font-mono text-slate-800 dark:text-slate-200">
                            {todayStatus.check_in_time ? `🟢 ${todayStatus.check_in_time}` : 'Pendiente'}
                        </span>
                    </div>
                    <button
                        type="button"
                        disabled={todayStatus.has_checked_in}
                        onClick={handleCheckIn}
                        className={`px-4 py-2 text-xs font-black rounded-xl shadow-xs transition-all ${
                            todayStatus.has_checked_in
                                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                        }`}
                    >
                        {todayStatus.has_checked_in ? 'Registrada' : 'Marcar Entrada'}
                    </button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">Salida Hoy</span>
                        <span className="text-sm font-black font-mono text-slate-800 dark:text-slate-200">
                            {todayStatus.check_out_time ? `🔴 ${todayStatus.check_out_time}` : 'Pendiente'}
                        </span>
                    </div>
                    <button
                        type="button"
                        disabled={!todayStatus.has_checked_in || todayStatus.has_checked_out}
                        onClick={handleCheckOut}
                        className={`px-4 py-2 text-xs font-black rounded-xl shadow-xs transition-all ${
                            !todayStatus.has_checked_in || todayStatus.has_checked_out
                                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                        }`}
                    >
                        {todayStatus.has_checked_out ? 'Finalizado' : 'Marcar Salida'}
                    </button>
                </div>
            </div>
        </div>
    );
}
