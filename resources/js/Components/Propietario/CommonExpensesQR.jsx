import { useState } from 'react';
import { StatusBadge } from '../DashboardShared';

export default function CommonExpensesQR({
    residentExpenses,
    simulatedMoroso,
    paymentHistory,
    executeQrPayment,
    isProcessingPayment,
    paymentCompletedSuccess,
    paymentReceiptName,
    setPaymentReceiptName,
    setPaymentCompletedSuccess,
    showPaymentModal,
    setShowPaymentModal
}) {
    const isStructured = residentExpenses.isStructured;
    const breakdown = residentExpenses.breakdown;

    return (
        <div className="space-y-6">
            {/* Main Billing Card */}
            <div className={`p-6 rounded-3xl border shadow-sm transition-all duration-350 bg-white dark:bg-slate-900 border-gray-150 dark:border-slate-800 text-gray-800 dark:text-slate-100`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-4 border-gray-150 dark:border-slate-800">
                    <div className="text-left">
                        <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Período Actual de Cobro</span>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white mt-1">{residentExpenses.period}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                        <StatusBadge status={residentExpenses.status} type="payment" />
                        <span className="text-xs text-slate-400 dark:text-slate-500">Vence: {residentExpenses.dueDate}</span>
                    </div>
                </div>

                {/* Structured Breakdown or simple items loop */}
                {isStructured && breakdown ? (
                    <div className="py-4 space-y-6 text-left">
                        {/* Seccion A: Gastos Comunes */}
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-blue-500 dark:text-blue-400">
                                A) Gastos Comunes (Cálculo Principal)
                            </h4>
                            <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/80 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">Gastos Prorrateados (Alícuota 1.05%)</span>
                                    <span className="font-mono font-semibold">${breakdown.prorrateado.toLocaleString('es-CL')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">Gastos Igualitarios</span>
                                    <span className="font-mono font-semibold">${breakdown.igualitario.toLocaleString('es-CL')}</span>
                                </div>
                                <div className="border-t border-slate-200 dark:border-slate-800 pt-2 flex justify-between text-sm font-semibold">
                                    <span>Subtotal Gastos Comunes</span>
                                    <span className="font-mono">${breakdown.subtotal.toLocaleString('es-CL')}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                                    <span>Fondo de Reserva (5%)</span>
                                    <span className="font-mono font-semibold">${breakdown.fondo_reserva.toLocaleString('es-CL')}</span>
                                </div>
                                <div className="border-t border-slate-200 dark:border-slate-800 pt-2 flex justify-between text-sm font-bold text-gray-900 dark:text-white">
                                    <span>Total Gastos Comunes del Período</span>
                                    <span className="font-mono text-brand-green">${breakdown.total_periodo.toLocaleString('es-CL')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Seccion B: Cargos Posteriores */}
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                B) Cargos Posteriores (Exentos de Fondo de Reserva)
                            </h4>
                            <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 border border-slate-100 dark:border-slate-800/80 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">Gastos de Torre (Torre A)</span>
                                    <span className="font-mono font-semibold">${breakdown.cargos_posteriores.gastos_torre.toLocaleString('es-CL')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">Multas e Individuales</span>
                                    <span className="font-mono font-semibold">${breakdown.cargos_posteriores.multas.toLocaleString('es-CL')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">Deuda Anterior</span>
                                    <span className="font-mono font-semibold text-rose-500">${breakdown.cargos_posteriores.deuda_anterior.toLocaleString('es-CL')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">Intereses por Mora (1.5%)</span>
                                    <span className="font-mono font-semibold text-rose-500">${breakdown.cargos_posteriores.interes_mora.toLocaleString('es-CL')}</span>
                                </div>
                                <div className="border-t border-slate-200 dark:border-slate-800 pt-2 flex justify-between text-sm font-bold text-gray-900 dark:text-white">
                                    <span>Total Cargos Posteriores</span>
                                    <span className="font-mono text-amber-600">${breakdown.cargos_posteriores.total.toLocaleString('es-CL')}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-4 space-y-3 text-left">
                        <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">Desglose de Conceptos</h4>
                        <div className="divide-y divide-gray-150 dark:divide-slate-800/60">
                            {residentExpenses.items.map((item, i) => (
                                <div key={i} className="flex justify-between items-center py-2 text-sm text-gray-600 dark:text-slate-350">
                                    <span>{item.name}</span>
                                    <span className="font-semibold text-gray-800 dark:text-slate-200 font-mono">${item.amount.toLocaleString('es-CL')}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Consolidated Total and Payment Button */}
                <div className="border-t border-gray-150 dark:border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-left flex items-baseline gap-2">
                        <span className="text-sm font-extrabold text-gray-800 dark:text-slate-200">Total a Pagar:</span>
                        <span className="text-2xl font-black text-[#72B043] font-mono">
                            {residentExpenses.status === 'completed' ? '$0' : `$${residentExpenses.amount.toLocaleString('es-CL')}`}
                        </span>
                        <span className="text-xs font-mono text-slate-400">CLP</span>
                    </div>

                    {residentExpenses.status !== 'completed' && (
                        <button
                            type="button"
                            onClick={() => {
                                setPaymentCompletedSuccess(false);
                                setPaymentReceiptName('');
                                setShowPaymentModal(true);
                            }}
                            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 ${
                                simulatedMoroso
                                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/10'
                                    : 'bg-brand-green hover:bg-brand-green-dark shadow-[#72B043]/10 hover:shadow-[#72B043]/20'
                            }`}
                        >
                            Pagar Gasto Común Express
                        </button>
                    )}
                </div>
            </div>

            {/* Payment History Log */}
            <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider text-left mb-4">
                    📜 Historial de Pagos Conciliados
                </h3>

                <div className="space-y-3">
                    {paymentHistory.map((hist) => (
                        <div key={hist.id} className="p-4 bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-800/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm text-left">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-black text-gray-800 dark:text-white">{hist.period}</span>
                                    <span className="text-[9px] text-slate-400 font-mono">ID: PAY-{hist.id}</span>
                                </div>
                                <span className="text-[10px] text-slate-500 block">
                                    Fecha de pago: {hist.date} &bull; Medio: {hist.method}
                                </span>
                            </div>
                            <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                                <span className="font-mono text-xs font-black text-[#72B043]">${hist.amount.toLocaleString('es-CL')}</span>
                                <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-500 uppercase">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    Validado
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment QR Modal */}
            {showPaymentModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
                    onClick={() => setShowPaymentModal(false)}
                >
                    <div
                        className="relative max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl animate-scale-up font-sans text-slate-800 dark:text-slate-200 text-left"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowPaymentModal(false)}
                            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 text-slate-500 transition-all"
                            aria-label="Cerrar"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {!paymentCompletedSuccess ? (
                            <div className="space-y-5">
                                <div className="text-center space-y-1">
                                    <span className="text-[9px] font-mono text-[#72B043] font-bold uppercase tracking-widest">Escaneo QR Bancario Express</span>
                                    <h3 className="text-base font-black">Pagar Gasto Común</h3>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500">Realiza tu transferencia o escanea directamente desde tu App del Banco.</p>
                                </div>

                                <div className="flex flex-col items-center justify-center py-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-800">
                                    <svg className="w-40 h-40 text-slate-950 dark:text-white" viewBox="0 0 100 100" fill="currentColor">
                                        <path d="M5,5 h30 v30 h-30 z M15,15 h10 v10 h-10 z" />
                                        <path d="M65,5 h30 v30 h-30 z M75,15 h10 v10 h-10 z" />
                                        <path d="M5,65 h30 v30 h-30 z M15,75 h10 v10 h-10 z" />
                                        <path d="M45,10 h10 v10 h-10 z M50,30 h10 v10 h-10 z M40,50 h20 v10 h-20 z M45,70 h15 v5 h-15 z M75,45 h10 v15 h-10 z M80,75 h15 v15 h-15 z" />
                                        <circle cx="50" cy="50" r="7" className="text-[#72B043]" />
                                    </svg>
                                    <span className="text-[9px] text-slate-400 mt-2 font-mono">Doble Enlace Cifrado Local</span>
                                </div>

                                <div className="space-y-2 text-xs">
                                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 block">Datos de Transferencia Manual</span>
                                    <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1 text-[10px] font-mono text-slate-600 dark:text-slate-400">
                                        <div className="flex justify-between"><span>Banco:</span><span className="font-bold text-slate-850 dark:text-slate-200">Banco de la Comunidad</span></div>
                                        <div className="flex justify-between"><span>Tipo:</span><span className="font-bold text-slate-850 dark:text-slate-200">Cuenta Corriente</span></div>
                                        <div className="flex justify-between"><span>N° Cuenta:</span><span className="font-bold text-slate-850 dark:text-slate-200">20260526-99</span></div>
                                        <div className="flex justify-between"><span>RUT:</span><span className="font-bold text-slate-850 dark:text-slate-200">77.777.777-7</span></div>
                                        <div className="flex justify-between text-[#72B043] font-bold"><span>Monto:</span><span>${residentExpenses.amount.toLocaleString('es-CL')} CLP</span></div>
                                    </div>
                                </div>

                                <div className="space-y-1 text-xs">
                                    <label htmlFor="paymentReceipt" className="text-[9px] text-slate-400 uppercase font-extrabold block">Adjuntar Comprobante (Simulado)</label>
                                    <input
                                        id="paymentReceipt"
                                        type="file"
                                        onChange={(e) => setPaymentReceiptName(e.target.files[0]?.name || '')}
                                        className="w-full text-[10px] file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-brand-green/15 file:text-brand-green hover:file:bg-brand-green/20 focus:outline-none"
                                    />
                                    {paymentReceiptName && (
                                        <span className="text-[9px] text-emerald-500 font-bold block mt-1">✓ Comprobante listo: {paymentReceiptName}</span>
                                    )}
                                </div>

                                <button
                                    onClick={executeQrPayment}
                                    disabled={isProcessingPayment}
                                    className="w-full py-2.5 bg-brand-green hover:bg-brand-green-dark disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                                >
                                    {isProcessingPayment ? 'Validando Comprobante...' : 'Confirmar Transferencia / Escaneo'}
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-6 space-y-4 animate-scale-up">
                                <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 text-[#72B043] rounded-full flex items-center justify-center mx-auto text-3xl">
                                    ✓
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-base font-black text-slate-900 dark:text-white">¡Transacción Exitosa!</h3>
                                    <p className="text-[10px] text-slate-500 px-3">Tu pago del Gasto Común de {residentExpenses.period} ha sido registrado en la base de datos local SQLite y validado por administración.</p>
                                </div>
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="w-full py-2.5 bg-brand-green hover:bg-brand-green-dark text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                                >
                                    Entendido
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
