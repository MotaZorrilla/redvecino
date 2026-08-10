import React, { useState, useEffect, useMemo } from 'react';
import Modal from '@/Components/Modal';
import { useBookings, mapBookingToPanel } from '@/hooks/useBookings';

export default function AmenitiesBookingPanel({ adminCondoId = 1 }) {
    const { data: realBookings = [] } = useBookings(true);
    const [bookings, setBookings] = useState([
        {
            id: 1,
            amenity_name: 'Sala Eventos',
            unit_name: 'Torre 1 - Depto 142',
            date: '2026-06-29',
            time_slot: '20:30 - 23:40',
            amount: 25000,
            notes: 'reunion familiar',
            status: 'Realizado'
        },
        {
            id: 2,
            amenity_name: 'Piscina',
            unit_name: 'Torre 1 - Depto 142',
            date: '2026-06-30',
            time_slot: '10:00 - 11:00',
            amount: 5000,
            notes: 'familia',
            status: 'Pendiente'
        }
    ]);

    const [selectedAmenityFilter, setSelectedAmenityFilter] = useState('all');
    const [showNewBookingModal, setShowNewBookingModal] = useState(false);

    // Merge reservas reales desde /api/bookings (fuente de verdad cuando existen).
    useEffect(() => {
        if (realBookings.length > 0) {
            setBookings(prev => {
                const knownIds = new Set(prev.map(b => b.id));
                const fresh = realBookings
                    .filter(b => !knownIds.has(b.id))
                    .map(mapBookingToPanel);
                return [...fresh, ...prev];
            });
        }
    }, [realBookings]);
    const [newBooking, setNewBooking] = useState({
        amenity_name: 'Sala Eventos',
        unit_name: 'Torre 1 - Depto 142',
        date: '2026-08-15',
        time_slot: '19:00 - 22:00',
        amount: 25000,
        notes: ''
    });

    // Calcular Recaudado Realizados
    const totalCollectedRealized = bookings
        .filter(b => b.status === 'Realizado')
        .reduce((sum, b) => sum + b.amount, 0);

    const handleMarkRealized = (id) => {
        setBookings(bookings.map(b => b.id === id ? { ...b, status: 'Realizado' } : b));
    };

    const handleCreateBooking = (e) => {
        e.preventDefault();
        if (!newBooking.unit_name || !newBooking.date) return;
        const created = {
            id: Date.now(),
            ...newBooking,
            amount: Number(newBooking.amount) || 0,
            status: 'Pendiente'
        };
        setBookings([created, ...bookings]);
        setShowNewBookingModal(false);
        setNewBooking({ amenity_name: 'Sala Eventos', unit_name: 'Torre 1 - Depto 142', date: '2026-08-15', time_slot: '19:00 - 22:00', amount: 25000, notes: '' });
    };

    const filteredBookings = bookings.filter(b => {
        if (selectedAmenityFilter === 'all') return true;
        return b.amenity_name.toLowerCase().includes(selectedAmenityFilter.toLowerCase());
    });

    // Estado de navegación del calendario (Año / Mes)
    const [currentYear, setCurrentYear] = useState(2026);
    const [currentMonth, setCurrentMonth] = useState(7); // 0-indexed: 7 = Agosto

    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(prev => prev - 1);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(prev => prev + 1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    };

    // Generar días dinámicos del calendario según currentYear y currentMonth
    const dynamicCalendarDays = useMemo(() => {
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

        // Ajustar primer día a Lunes = 0 (JSgetDay: Dom=0, Lun=1 ... Sáb=6)
        let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
        if (startingDayOfWeek === -1) startingDayOfWeek = 6;

        const totalDays = lastDayOfMonth.getDate();
        const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();

        const today = new Date();
        const isCurrentMonthToday = today.getFullYear() === currentYear && today.getMonth() === currentMonth;

        const days = [];

        // Días del mes anterior
        for (let i = startingDayOfWeek - 1; i >= 0; i--) {
            days.push({ day: prevMonthLastDay - i, inMonth: false });
        }

        // Días del mes actual
        for (let d = 1; d <= totalDays; d++) {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const hasBooking = bookings.some(b => b.date === dateStr && (selectedAmenityFilter === 'all' || b.amenity_name.toLowerCase().includes(selectedAmenityFilter.toLowerCase())));
            days.push({
                day: d,
                inMonth: true,
                isToday: isCurrentMonthToday && today.getDate() === d,
                hasBooking,
                dateStr
            });
        }

        // Días del mes siguiente para completar la cuadrícula (múltiplo de 7)
        const remaining = (7 - (days.length % 7)) % 7;
        for (let j = 1; j <= remaining; j++) {
            days.push({ day: j, inMonth: false });
        }

        return days;
    }, [currentYear, currentMonth, bookings, selectedAmenityFilter]);

    return (
        <div className="space-y-6 font-outfit text-left text-slate-800 dark:text-slate-100 animate-fade-in w-full">
            {/* Header Módulo Arriendo de Áreas Comunes */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <span className="text-[10px] font-black uppercase bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full tracking-wider">
                        📅 Gestión de Arriendo de Áreas Comunes
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                        Ingresos por Arriendo
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Gestione el arriendo de áreas comunes y prevenga cruces de horarios.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-right">
                        <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Recaudado Realizados</span>
                        <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                            ${totalCollectedRealized.toLocaleString('es-CL')}
                        </span>
                    </div>

                    <button
                        onClick={() => setShowNewBookingModal(true)}
                        className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
                    >
                        <span>➕</span>
                        <span>Nueva Reserva</span>
                    </button>
                </div>
            </div>

            {/* SECCIÓN CALENDARIO MENSUAL DINÁMICO CON NAVEGACIÓN */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                        <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <span>🗓️</span>
                            <span>{monthNames[currentMonth]} {currentYear}</span>
                        </h3>
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
                            <button
                                onClick={handlePrevMonth}
                                title="Mes Anterior"
                                className="px-2.5 py-1 text-xs font-black bg-white dark:bg-slate-900 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                            >
                                ◀
                            </button>
                            <button
                                onClick={() => {
                                    setCurrentMonth(new Date().getMonth());
                                    setCurrentYear(new Date().getFullYear());
                                }}
                                title="Ir al mes actual"
                                className="px-2 py-1 text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 hover:underline"
                            >
                                Hoy
                            </button>
                            <button
                                onClick={handleNextMonth}
                                title="Mes Siguiente"
                                className="px-2.5 py-1 text-xs font-black bg-white dark:bg-slate-900 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-all text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                            >
                                ▶
                            </button>
                        </div>
                    </div>

                    {/* Filtro por Área Común */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500">Filtrar Área:</span>
                        <select
                            value={selectedAmenityFilter}
                            onChange={(e) => setSelectedAmenityFilter(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white cursor-pointer"
                        >
                            <option value="all">🔍 Todas las Áreas</option>
                            <option value="Piscina">🏊 Piscina</option>
                            <option value="Sala Eventos">🎉 Sala Eventos</option>
                            <option value="Quincho">🍖 Quincho</option>
                        </select>
                    </div>
                </div>

                {/* Grid del Calendario */}
                <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs">
                    {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(d => (
                        <div key={d} className="py-2 bg-slate-100 dark:bg-slate-800/60 rounded-lg text-slate-500 text-[11px] font-black uppercase">
                            {d}
                        </div>
                    ))}

                    {dynamicCalendarDays.map((cd, idx) => (
                        <div
                            key={idx}
                            className={`min-h-[50px] p-2 rounded-xl border transition-all flex flex-col justify-between items-center text-xs ${
                                cd.isToday
                                    ? 'bg-indigo-600 text-white font-black border-indigo-600 shadow-md shadow-indigo-500/20'
                                    : cd.hasBooking
                                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold'
                                    : cd.inMonth
                                    ? 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                                    : 'bg-transparent border-transparent text-slate-300 dark:text-slate-700 opacity-40'
                            }`}
                        >
                            <span>{cd.day}</span>
                            {cd.isToday && <span className="text-[9px] uppercase font-black tracking-wider">Hoy</span>}
                        </div>
                    ))}
                </div>
            </div>

            {/* SECCIÓN TABLA HISTORIAL DE ARRIENDOS REGISTRADOS */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-4">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
                    <span>📋</span>
                    <span>Historial de Arriendos Registrados</span>
                </h3>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase text-slate-400">
                                <th className="py-3 px-4">Área Común</th>
                                <th className="py-3 px-4">Unidad</th>
                                <th className="py-3 px-4">Fecha</th>
                                <th className="py-3 px-4">Horario</th>
                                <th className="py-3 px-4 text-right">Costo Pagado</th>
                                <th className="py-3 px-4">Observaciones</th>
                                <th className="py-3 px-4 text-center">Estado</th>
                                <th className="py-3 px-4 text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-bold">
                            {filteredBookings.map(b => (
                                <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                                    <td className="py-3 px-4 font-black text-indigo-600 dark:text-indigo-400">{b.amenity_name}</td>
                                    <td className="py-3 px-4 text-slate-900 dark:text-white">{b.unit_name}</td>
                                    <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-300">{b.date}</td>
                                    <td className="py-3 px-4 font-mono text-slate-500">{b.time_slot}</td>
                                    <td className="py-3 px-4 text-right font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">
                                        ${b.amount.toLocaleString('es-CL')}
                                    </td>
                                    <td className="py-3 px-4 text-slate-500 font-normal">{b.notes || '-'}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                            b.status === 'Realizado'
                                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                        }`}>
                                            {b.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-right font-sans">
                                        {b.status === 'Realizado' ? (
                                            <span className="text-[10px] text-slate-400 font-normal">Realizado</span>
                                        ) : (
                                            <button
                                                onClick={() => handleMarkRealized(b.id)}
                                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-lg shadow-sm transition-all whitespace-nowrap"
                                            >
                                                Marcar Realizado
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL NUEVA RESERVA */}
            <Modal show={showNewBookingModal} onClose={() => setShowNewBookingModal(false)} maxWidth="md">
                <form onSubmit={handleCreateBooking} className="p-6 font-outfit text-left space-y-4 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                    <h3 className="text-base font-black text-slate-900 dark:text-white">Nueva Reserva de Área Común</h3>
                    <div className="space-y-3 text-xs">
                        <div>
                            <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Área Común *</label>
                            <select
                                value={['Sala Eventos', 'Piscina', 'Quincho'].includes(newBooking.amenity_name) ? newBooking.amenity_name : 'Otro'}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    const defaultAmounts = { 'Sala Eventos': 25000, 'Piscina': 5000, 'Quincho': 15000 };
                                    if (val === 'Otro') {
                                        setNewBooking({ ...newBooking, amenity_name: '', amount: 0 });
                                    } else {
                                        setNewBooking({ ...newBooking, amenity_name: val, amount: defaultAmounts[val] ?? newBooking.amount });
                                    }
                                }}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white mb-2"
                            >
                                <option value="Quincho">🍖 Quincho ($15.000 sugerido)</option>
                                <option value="Piscina">🏊 Piscina ($5.000 sugerido)</option>
                                <option value="Sala Eventos">🎉 Sala Eventos ($25.000 sugerido)</option>
                                <option value="Otro">✏️ Personalizado (Escribir nombre y monto a mano)</option>
                            </select>
                            {!['Sala Eventos', 'Piscina', 'Quincho'].includes(newBooking.amenity_name) && (
                                <input
                                    type="text"
                                    required
                                    placeholder="Escriba el nombre del área (ej: Quincho VIP, Multicancha...)"
                                    value={newBooking.amenity_name}
                                    onChange={(e) => setNewBooking({ ...newBooking, amenity_name: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white"
                                />
                            )}
                        </div>

                        <div>
                            <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Unidad del Reservante *</label>
                            <input
                                type="text"
                                required
                                placeholder="Ej: Torre 1 - Depto 142"
                                value={newBooking.unit_name}
                                onChange={(e) => setNewBooking({ ...newBooking, unit_name: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Fecha *</label>
                                <input
                                    type="date"
                                    required
                                    value={newBooking.date}
                                    onChange={(e) => setNewBooking({ ...newBooking, date: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Horario *</label>
                                <input
                                    type="text"
                                    placeholder="Ej: 20:30 - 23:40"
                                    value={newBooking.time_slot}
                                    onChange={(e) => setNewBooking({ ...newBooking, time_slot: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Costo Pagado ($)</label>
                                <input
                                    type="number"
                                    value={newBooking.amount}
                                    onChange={(e) => setNewBooking({ ...newBooking, amount: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Observaciones</label>
                                <input
                                    type="text"
                                    placeholder="Ej: reunión familiar"
                                    value={newBooking.notes}
                                    onChange={(e) => setNewBooking({ ...newBooking, notes: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                        <button type="button" onClick={() => setShowNewBookingModal(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-xl">Cancelar</button>
                        <button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-black text-xs rounded-xl shadow-lg">Guardar Reserva</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
