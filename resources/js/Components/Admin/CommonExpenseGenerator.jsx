import React, { useState, useEffect } from 'react';
import api from '@/bootstrap';
import Modal from '@/Components/Modal';

export default function CommonExpenseGenerator({ adminCondoId = 1, activeCondoName = 'Condominio Principal' }) {
    const [period, setPeriod] = useState('2026-08');
    const [reserveFundPct, setReserveFundPct] = useState(5.00);
    const [dueDate, setDueDate] = useState('2026-08-25');
    const [isGenerating, setIsGenerating] = useState(false);
    const [periodData, setPeriodData] = useState(null);
    const [receiptsList, setReceiptsList] = useState([]);
    const [selectedReceipt, setSelectedReceipt] = useState(null); // Modal Aviso de Cobro
    const [isClosingPeriod, setIsClosingPeriod] = useState(false);

    // Cargar períodos guardados o historial al cargar
    const fetchPeriods = async () => {
        try {
            const res = await api.get(`/api/common-expense-periods?condominium_id=${adminCondoId}`);
            if (res.data && res.data.length > 0) {
                const current = res.data[0];
                setPeriodData(current);
                fetchReceipts(current.id);
            }
        } catch (error) {
            console.error('Error cargando períodos de gastos comunes:', error);
        }
    };

    const fetchReceipts = async (periodId) => {
        try {
            const res = await api.get(`/api/common-expense-periods/${periodId}/receipts`);
            if (res.data && res.data.receipts) {
                const list = Array.isArray(res.data.receipts)
                    ? res.data.receipts
                    : (res.data.receipts.data || []);
                setReceiptsList(list);
            }
        } catch (error) {
            console.error('Error cargando recibos del período:', error);
        }
    };

    useEffect(() => {
        fetchPeriods();
    }, [adminCondoId]);

    // Ejecutar Generación Masiva del Período
    const handleGenerateMassBilling = async () => {
        setIsGenerating(true);
        try {
            const res = await api.post('/api/common-expense-periods/generate', {
                condominium_id: adminCondoId,
                period: period,
                due_date: dueDate,
                reserve_fund_pct: Number(reserveFundPct)
            });

            if (res.data && res.data.period) {
                setPeriodData(res.data.period);
                const list = Array.isArray(res.data.period.receipts)
                    ? res.data.period.receipts
                    : (res.data.period.receipts?.data || []);
                setReceiptsList(list);
                alert(res.data.message || '¡Cobro masivo generado exitosamente!');
            }
        } catch (error) {
            console.error('Error en emisión masiva:', error);
            alert(error.response?.data?.message || 'Error al emitir los cobros masivos.');
        } finally {
            setIsGenerating(false);
        }
    };

    // Cerrar Período Contable
    const handleClosePeriod = async () => {
        if (!periodData) return;
        if (!confirm(`¿Está seguro de cerrar y auditar definitivamente el período contable ${periodData.period}?`)) return;

        setIsClosingPeriod(true);
        try {
            const res = await api.post(`/api/common-expense-periods/${periodData.id}/close`);
            setPeriodData(res.data.period);
            alert(res.data.message || 'Período cerrado exitosamente.');
        } catch (error) {
            console.error('Error cerrando período:', error);
            alert('Ocurrió un error al cerrar el período.');
        } finally {
            setIsClosingPeriod(false);
        }
    };

    // Estadísticas del Período
    const safeReceipts = Array.isArray(receiptsList) ? receiptsList : [];
    const totalExpensesAmount = periodData ? Number(periodData.total_expenses) : 5922800;
    const reserveFundTotalAmount = totalExpensesAmount * (Number(reserveFundPct) / 100);
    const totalBilledAmount = safeReceipts.reduce((acc, r) => acc + Number(r.total_amount || 0), 0);

    return (
        <div className="space-y-6 font-outfit text-left text-slate-800 dark:text-slate-100 animate-fade-in">
            {/* Cabecera & Selector de Período Contable */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
                            📊 Motor Contable Fase 2
                        </span>
                        {periodData && (
                            <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider border ${
                                periodData.status === 'closed'
                                    ? 'bg-slate-100 dark:bg-slate-800 border-slate-300 text-slate-600 dark:text-slate-400'
                                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                            }`}>
                                {periodData.status === 'closed' ? '🔒 Período Cerrado' : '⚡ Período Activo'}
                            </span>
                        )}
                    </div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white mt-2">
                        Emisión Masiva de Gastos Comunes · <span className="text-indigo-600 dark:text-indigo-400">{activeCondoName}</span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Cálculo automático de prorrateo por $m^2$, fondo de reserva (5%), cargas individuales y emisión de avisos de cobro.
                    </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <div>
                        <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Período Mensual</label>
                        <input
                            type="month"
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-black focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Fondo Reserva (%)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={reserveFundPct}
                            onChange={(e) => setReserveFundPct(e.target.value)}
                            className="w-20 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-black focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Vencimiento</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <button
                        onClick={handleGenerateMassBilling}
                        disabled={isGenerating || (periodData && periodData.status === 'closed')}
                        className="self-end px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span>⚡</span>
                        <span>{isGenerating ? 'Generando Cobro...' : 'Generar Cobro Masivo'}</span>
                    </button>
                </div>
            </div>

            {/* Tarjetas KPI de Resumen Financiero del Período */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Gastos Prorrateables ($E_{"total"}$)</span>
                    <div className="text-xl font-black text-slate-900 dark:text-white mt-1">
                        ${totalExpensesAmount.toLocaleString('es-CL')}
                    </div>
                    <span className="text-[10px] text-slate-500">Base contable del período</span>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-wider block">Fondo de Reserva ({reserveFundPct}%)</span>
                    <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
                        ${reserveFundTotalAmount.toLocaleString('es-CL')}
                    </div>
                    <span className="text-[10px] text-indigo-500 font-bold">Aporte legal acumulativo</span>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider block">Total Recaudación Estimada</span>
                    <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                        ${(totalBilledAmount || (totalExpensesAmount + reserveFundTotalAmount)).toLocaleString('es-CL')}
                    </div>
                    <span className="text-[10px] text-emerald-500 font-bold">{receiptsList.length} Unidades Cobradas</span>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex flex-col justify-between">
                    <div>
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-wider block">Estado de Auditoría</span>
                        <div className="text-sm font-black text-slate-800 dark:text-white mt-1">
                            {periodData ? (periodData.status === 'closed' ? '🔒 Período Auditado' : '📝 Período Abierto') : 'Sin Emitir'}
                        </div>
                    </div>
                    {periodData && periodData.status !== 'closed' && (
                        <button
                            onClick={handleClosePeriod}
                            disabled={isClosingPeriod}
                            className="mt-2 text-[10px] font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white underline text-left"
                        >
                            {isClosingPeriod ? 'Cerrando...' : '🔒 Cerrar Período Mensual'}
                        </button>
                    )}
                </div>
            </div>

            {/* Tabla de Avisos de Cobro Generados por Unidad */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <span className="text-base">📋</span>
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                            Desglose de Boletas / Avisos de Cobro por Unidad ({receiptsList.length})
                        </h3>
                    </div>
                    <span className="text-xs font-bold text-slate-500">
                        Período: <strong className="text-indigo-600 dark:text-indigo-400">{period}</strong>
                    </span>
                </div>

                {receiptsList.length === 0 ? (
                    <div className="p-12 text-center text-slate-400">
                        <span className="text-4xl block mb-2">⚡</span>
                        <p className="text-sm font-bold">No hay cobros generados para este período.</p>
                        <p className="text-xs opacity-75 mt-1">Haga clic en <strong>"Generar Cobro Masivo"</strong> para calcular el prorrateo contable por unidad.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase text-slate-400">
                                    <th className="py-3 px-3">Unidad / Ubicación</th>
                                    <th className="py-3 px-3 text-right">Alícuotas (%)</th>
                                    <th className="py-3 px-3 text-right">Gasto Base ($G$)</th>
                                    <th className="py-3 px-3 text-right">Fondo Reserva ($FR$)</th>
                                    <th className="py-3 px-3 text-right">Consumos ($C_{"ind"}$)</th>
                                    <th className="py-3 px-3 text-right">Total Boleta ($)</th>
                                    <th className="py-3 px-3 text-center">Estado</th>
                                    <th className="py-3 px-3 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-mono">
                                {receiptsList.map((r) => {
                                    const unitNum = r.property?.number || `#${r.property_id}`;
                                    const blockName = r.property?.block || 'Torre A';
                                    const alicuotaFormatted = (Number(r.alicuota_pct) * 100).toFixed(4) + '%';
                                    const baseVal = Number(r.base_amount);
                                    const reserveVal = Number(r.reserve_fund_amount);
                                    const indVal = Number(r.individual_consumption);
                                    const totalVal = Number(r.total_amount);

                                    return (
                                        <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                                            <td className="py-3 px-3 font-sans">
                                                <span className="font-black text-indigo-600 dark:text-indigo-400">#{unitNum}</span>
                                                <span className="text-[10px] text-slate-400 block">{blockName}</span>
                                            </td>
                                            <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-300">{alicuotaFormatted}</td>
                                            <td className="py-3 px-3 text-right">${baseVal.toLocaleString('es-CL')}</td>
                                            <td className="py-3 px-3 text-right text-indigo-600 dark:text-indigo-400">${reserveVal.toLocaleString('es-CL')}</td>
                                            <td className="py-3 px-3 text-right text-slate-500">${indVal.toLocaleString('es-CL')}</td>
                                            <td className="py-3 px-3 text-right font-black text-emerald-600 dark:text-emerald-400 text-sm">
                                                ${totalVal.toLocaleString('es-CL')}
                                            </td>
                                            <td className="py-3 px-3 text-center font-sans">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                                    r.status === 'paid'
                                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                                }`}>
                                                    {r.status === 'paid' ? 'Pagado' : 'Pendiente'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 text-right font-sans">
                                                <button
                                                    onClick={() => setSelectedReceipt(r)}
                                                    className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg transition-all"
                                                >
                                                    🧾 Ver Aviso
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* MODAL FICHA / AVISO OFICIAL DE COBRO DE GASTOS COMUNES */}
            <Modal show={!!selectedReceipt} onClose={() => setSelectedReceipt(null)} maxWidth="lg">
                {selectedReceipt && (
                    <div className="p-6 font-outfit text-left space-y-6 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                        {/* Header del Aviso de Cobro */}
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                            <div>
                                <span className="text-[10px] font-black uppercase bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                                    📜 Aviso de Cobro de Gastos Comunes
                                </span>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                                    Unidad #{selectedReceipt.property?.number || selectedReceipt.property_id} · {activeCondoName}
                                </h3>
                                <p className="text-xs text-slate-500">Período Contable: <strong>{periodData?.period || period}</strong></p>
                            </div>
                            <button
                                onClick={() => setSelectedReceipt(null)}
                                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Desglose Matemático Oficial del Cobro (Fórmulas Aplicadas) */}
                        <div className="space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                                <div>
                                    <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Coeficiente de Prorrateo</span>
                                    <div className="text-base font-black text-indigo-600 dark:text-indigo-400">
                                        {(Number(selectedReceipt.alicuota_pct) * 100).toFixed(4)}%
                                    </div>
                                </div>
                                <div>
                                    <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Fecha Límite de Vencimiento</span>
                                    <div className="text-base font-black text-slate-800 dark:text-white">
                                        {selectedReceipt.due_date || dueDate}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900">
                                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
                                    Detalle del Cobro Mensual
                                </h4>

                                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                                    <span className="text-slate-600 dark:text-slate-300">1. Gasto Común Base Prorrateado ($G$):</span>
                                    <span className="font-mono font-bold">${Number(selectedReceipt.base_amount).toLocaleString('es-CL')}</span>
                                </div>

                                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                                    <span className="text-slate-600 dark:text-slate-300">2. Fondo de Reserva Estipulado (5% $FR$):</span>
                                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">${Number(selectedReceipt.reserve_fund_amount).toLocaleString('es-CL')}</span>
                                </div>

                                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60">
                                    <span className="text-slate-600 dark:text-slate-300">3. Cargas Individuales / Medidores ($C_{"ind"}$):</span>
                                    <span className="font-mono font-bold">${Number(selectedReceipt.individual_consumption).toLocaleString('es-CL')}</span>
                                </div>

                                <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800/60 text-amber-600">
                                    <span>4. Saldo Anterior Pendiente + Intereses Mora:</span>
                                    <span className="font-mono font-bold">${(Number(selectedReceipt.previous_balance) + Number(selectedReceipt.interest_amount)).toLocaleString('es-CL')}</span>
                                </div>

                                <div className="flex justify-between pt-2 font-black text-sm text-emerald-600 dark:text-emerald-400">
                                    <span>TOTAL OBLIGACIÓN ECONÓMICA A PAGAR:</span>
                                    <span className="font-mono text-base">${Number(selectedReceipt.total_amount).toLocaleString('es-CL')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer con Botón de Imprimir / Cerrar */}
                        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                            <button
                                onClick={() => window.print()}
                                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl flex items-center gap-1.5"
                            >
                                <span>🖨️</span>
                                <span>Imprimir Recibo</span>
                            </button>
                            <button
                                onClick={() => setSelectedReceipt(null)}
                                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
