import { useState } from 'react';

export default function BookingManager({
    amenities,
    myReservations,
    bookingAmenity,
    setBookingAmenity,
    bookingDate,
    setBookingDate,
    bookingSlot,
    setBookingSlot,
    submitBooking,
    simulatedMoroso,
    setShowMorosidadModal
}) {
    const selectedAmenityObj = amenities.find(a => a.id === bookingAmenity) || amenities[0];
    const [showBookingSuccess, setShowBookingSuccess] = useState(false);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
            {/* Booking Form Card */}
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                    📅 Solicitar Reserva de Instalación
                </h3>

                {simulatedMoroso ? (
                    <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 space-y-3">
                        <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider">
                            <span>🔒 Servicios Suspendidos por Mora</span>
                        </div>
                        <p className="text-xs leading-relaxed font-medium">
                            Tu cuenta se encuentra registrada en estado de **Morosidad**. El acceso a las reservaciones y arriendos comunes ha sido bloqueado temporalmente por administración.
                        </p>
                        <button
                            type="button"
                            onClick={() => setShowMorosidadModal(true)}
                            className="text-xs font-bold underline hover:text-rose-455 transition-colors"
                        >
                            Ver detalle de deuda &rarr;
                        </button>
                    </div>
                ) : (
                    <form onSubmit={(e) => { submitBooking(e); setShowBookingSuccess(true); setTimeout(() => setShowBookingSuccess(false), 3000); }} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-extrabold block">Selecciona el Área Común</label>
                                <select
                                    value={bookingAmenity}
                                    onChange={(e) => setBookingAmenity(e.target.value)}
                                    className="w-full px-3 py-2 text-xs border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl focus:outline-none focus:border-[#72B043] dark:text-slate-200"
                                >
                                    {amenities.map(a => (
                                        <option key={a.id} value={a.id}>
                                            {a.name} ({a.price > 0 ? `$${a.price.toLocaleString('es-CL')}` : 'Gratis'})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-extrabold block">Bloque Horario</label>
                                <select
                                    value={bookingSlot}
                                    onChange={(e) => setBookingSlot(e.target.value)}
                                    className="w-full px-3 py-2 text-xs border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl focus:outline-none focus:border-[#72B043] dark:text-slate-200"
                                >
                                    <option value="Mañana (09:00 - 13:00)">Mañana (09:00 - 13:00)</option>
                                    <option value="Tarde (14:00 - 18:00)">Tarde (14:00 - 18:00)</option>
                                    <option value="Noche (19:00 - 23:30)">Noche (19:00 - 23:30)</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-extrabold block">Fecha del Evento</label>
                            <input
                                type="date"
                                value={bookingDate}
                                onChange={(e) => setBookingDate(e.target.value)}
                                className="w-full px-3 py-2 text-xs border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl focus:outline-none focus:border-[#72B043] font-mono text-slate-700 dark:text-slate-250"
                            />
                        </div>

                        {selectedAmenityObj && (
                            <div className="p-4 bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-850 rounded-2xl space-y-2 text-xs">
                                <span className="font-bold text-gray-800 dark:text-slate-300 block">Normativa de Uso & Reglamento</span>
                                <p className="text-gray-500 dark:text-slate-400 leading-relaxed font-medium">
                                    {selectedAmenityObj.rules}
                                </p>
                                <div className="flex gap-4 pt-1 text-[10px] font-mono text-[#EC7A08] font-bold">
                                    <span>Capacidad Máxima: {selectedAmenityObj.cap}</span>
                                    {selectedAmenityObj.price > 0 && (
                                        <span>Garantía: $30.000 CLP reembolsable</span>
                                    )}
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full py-2.5 bg-brand-green hover:bg-brand-green-dark text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                        >
                            Enviar Solicitud de Reserva
                        </button>
                    </form>
                )}

                {showBookingSuccess && (
                    <div className="fixed bottom-6 right-6 z-[200] bg-emerald-500 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-scale-up">
                        <span>✅</span>
                        <span>¡Reserva enviada con éxito!</span>
                    </div>
                )}
            </div>

            {/* Reservations List */}
            <div className="lg:col-span-5 space-y-4">
                <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                        📅 Historial de Reservas Solicitadas
                    </h3>

                    <div className="space-y-3">
                        {myReservations.map(res => (
                            <div
                                key={res.id}
                                className="p-4 bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-850 rounded-2xl flex items-center justify-between text-xs shadow-sm"
                            >
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-gray-800 dark:text-white">{res.name}</span>
                                        <span className="text-[9px] text-slate-400 font-mono">#{res.id}</span>
                                    </div>
                                    <span className="text-[10px] text-slate-500 block">
                                        {res.date} &bull; {res.slot}
                                    </span>
                                </div>

                                <div className="text-right space-y-1">
                                    <span className="font-bold text-gray-800 dark:text-slate-200 block">
                                        {res.price > 0 ? `$${res.price.toLocaleString('es-CL')}` : 'Gratis'}
                                    </span>
                                    <span className={`inline-flex items-center px-2 py-0.5 text-[8px] font-bold rounded-md border ${
                                        res.status === 'approved'
                                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                            : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                                    }`}>
                                        {res.status === 'approved' ? 'Aprobada' : 'Pendiente'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
