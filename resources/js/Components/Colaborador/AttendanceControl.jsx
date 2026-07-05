import { useState } from 'react';
import { SimpleTable } from '@/Components/DashboardShared';

export default function AttendanceControl({ user, adminCondoId, attendance: initialAttendance }) {
    const today = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });

    const [isClockedIn, setIsClockedIn] = useState(false);
    const [clockInTime, setClockInTime] = useState(null);
    const [attendanceHistory, setAttendanceHistory] = useState(initialAttendance || []);

    const handleClockIn = () => {
        const time = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
        setIsClockedIn(true);
        setClockInTime(time);
    };

    const handleClockOut = () => {
        const time = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
        const newEntry = {
            id: attendanceHistory.length + 1,
            date: today,
            clockIn: clockInTime,
            clockOut: time,
            hours: '8h 00m',
            status: 'completed'
        };
        setAttendanceHistory(prev => [newEntry, ...prev]);
        setIsClockedIn(false);
        setClockInTime(null);
    };

    // Stats
    const totalDaysThisMonth = attendanceHistory.length;
    const avgHours = '8h 02m';

    return (
        <div className="space-y-6 animate-fade-in text-left">
            {/* Header */}
            <div>
                <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                    ⏱️ Control de Asistencia
                </h4>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Registro de entrada y salida del turno laboral.</p>
            </div>

            {/* Clock In/Out Panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Main Clock Card */}
                <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Clock Display */}
                        <div className="text-center">
                            <div className="text-5xl font-black text-slate-800 dark:text-white font-mono tracking-tight">
                                {new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </div>
                            <p className="text-xs text-slate-400 mt-1 font-medium">
                                {new Date().toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>

                        {/* Clock In/Out Button */}
                        <div className="flex-1 flex flex-col items-center gap-3">
                            {!isClockedIn ? (
                                <button
                                    onClick={handleClockIn}
                                    className="w-full max-w-xs px-8 py-4 bg-brand-green hover:bg-brand-green-dark text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                        </svg>
                                        Registrar Entrada
                                    </span>
                                </button>
                            ) : (
                                <>
                                    <div className="text-center mb-1">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-bold uppercase">
                                            <span className="relative flex h-2 w-2">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                            </span>
                                            En turno desde las {clockInTime}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleClockOut}
                                        className="w-full max-w-xs px-8 py-4 bg-brand-error hover:bg-brand-navy-dark text-white font-black text-sm rounded-2xl shadow-lg shadow-rose-500/20 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer"
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                            </svg>
                                            Registrar Salida
                                        </span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="space-y-3">
                    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Días Trabajados (Mes)</span>
                        <span className="text-2xl font-black text-slate-800 dark:text-white">{totalDaysThisMonth}</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Promedio Diario</span>
                        <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{avgHours}</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Estado Actual</span>
                        <span className={`text-sm font-black ${isClockedIn ? 'text-emerald-500' : 'text-slate-400'}`}>
                            {isClockedIn ? '🟢 En Turno' : '⚪ Fuera de Turno'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Attendance History Table */}
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 dark:border-slate-800">
                    <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Historial de Asistencia</span>
                </div>
                <SimpleTable
                    headers={['Fecha', 'Entrada', 'Salida', 'Horas Trabajadas', 'Estado']}
                    rows={attendanceHistory.map(a => ({
                        cells: [
                            <span key={`d-${a.id}`} className="font-medium text-slate-700 dark:text-slate-300">{a.date}</span>,
                            <span key={`in-${a.id}`} className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{a.clockIn}</span>,
                            <span key={`out-${a.id}`} className="font-mono font-bold text-rose-500">{a.clockOut}</span>,
                            <span key={`h-${a.id}`} className="font-bold text-slate-800 dark:text-white">{a.hours}</span>,
                            <span key={`s-${a.id}`} className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Completado
                            </span>
                        ]
                    }))}
                    emptyMessage="Sin registros de asistencia"
                />
            </div>
        </div>
    );
}
