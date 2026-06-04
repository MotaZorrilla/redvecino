import { useState } from 'react';

export default function ContractViewer({ user }) {
    const [activeContractTab, setActiveContractTab] = useState('contract');

    // Mock contract data
    const contractData = {
        type: 'Plazo Fijo',
        startDate: '01/04/2026',
        endDate: '30/06/2026',
        contractNumber: 2,
        employer: 'Condominio Aires de Chiguayante II',
        representative: 'Enrique Tirapegui T.',
        position: 'Auxiliar de Aseo / Portería',
        area: 'Seguridad y Limpieza',
        workSchedule: 'Lunes a Viernes, 06:00 a 14:00',
        baseSalary: 539000,
        transportAllowance: 66896,
        mealAllowance: 66896,
    };

    // Mock liquidation data (based on ORGANIZACION_SISTEMA.md)
    const liquidation = {
        period: 'Mayo 2026',
        daysWorked: 30,
        baseSalary: 539000,
        transportAllowance: 66896,
        mealAllowance: 66896,
        totalGross: 672592,
        healthDeduction: 37730,
        pensionDeduction: 61662,
        unemploymentDeduction: 3234,
        totalDeductions: 102626,
        netPay: 569966,
    };

    const liquidationHistory = [
        { period: 'Mayo 2026', netPay: 569966, status: 'paid', date: '31/05/2026' },
        { period: 'Abril 2026', netPay: 569966, status: 'paid', date: '30/04/2026' },
        { period: 'Marzo 2026', netPay: 569966, status: 'paid', date: '31/03/2026' },
    ];

    const formatCLP = (n) => '$' + n.toLocaleString('es-CL');

    return (
        <div className="space-y-6 animate-fade-in text-left">
            {/* Header */}
            <div>
                <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                    📋 Contratos y Liquidaciones
                </h4>
                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Visualiza tu contrato de trabajo vigente y el historial de liquidaciones de sueldo.</p>
            </div>

            {/* Sub-tab selector */}
            <div className="flex bg-gray-100 dark:bg-slate-950 p-1 rounded-lg border border-gray-200 dark:border-slate-800 w-fit">
                <button
                    onClick={() => setActiveContractTab('contract')}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${activeContractTab === 'contract' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-white shadow' : 'text-slate-500 dark:text-slate-400'}`}
                >
                    📝 Contrato Vigente
                </button>
                <button
                    onClick={() => setActiveContractTab('liquidation')}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${activeContractTab === 'liquidation' ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-white shadow' : 'text-slate-500 dark:text-slate-400'}`}
                >
                    💵 Liquidaciones
                </button>
            </div>

            {/* Contract View */}
            {activeContractTab === 'contract' && (
                <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                    {/* Contract Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-5 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h5 className="text-base font-black">Contrato Individual de Trabajo</h5>
                                <p className="text-xs text-indigo-200 mt-0.5">Contrato N°{contractData.contractNumber} — {contractData.type}</p>
                            </div>
                            <div className="text-right">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 rounded-full text-[10px] font-bold uppercase">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                    Vigente
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Contract Body */}
                    <div className="p-6 space-y-5">
                        {/* Timeline */}
                        <div className="flex items-center gap-4">
                            <div className="text-center flex-1">
                                <span className="text-[10px] text-slate-400 font-bold uppercase block">1er Contrato (3m)</span>
                                <span className="text-xs font-bold text-slate-500 line-through">01/01/2026 — 31/03/2026</span>
                                <span className="block text-[9px] text-emerald-500 font-bold">✓ Vencido</span>
                            </div>
                            <div className="h-0.5 w-8 bg-emerald-500 rounded-full" />
                            <div className="text-center flex-1 p-3 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 rounded-xl">
                                <span className="text-[10px] text-indigo-500 font-bold uppercase block">2do Contrato (3m) — Actual</span>
                                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">{contractData.startDate} — {contractData.endDate}</span>
                                <span className="block text-[9px] text-indigo-500 font-bold">⏳ Vigente</span>
                            </div>
                            <div className="h-0.5 w-8 bg-slate-300 dark:bg-slate-700 rounded-full" />
                            <div className="text-center flex-1">
                                <span className="text-[10px] text-slate-400 font-bold uppercase block">Próximo</span>
                                <span className="text-xs font-bold text-slate-500">Indefinido</span>
                                <span className="block text-[9px] text-slate-400 font-bold">Pendiente</span>
                            </div>
                        </div>

                        {/* Contract Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[
                                { label: 'Empleador', value: contractData.employer },
                                { label: 'Representante', value: contractData.representative },
                                { label: 'Cargo', value: contractData.position },
                                { label: 'Área', value: contractData.area },
                                { label: 'Jornada', value: contractData.workSchedule },
                                { label: 'Sueldo Base', value: formatCLP(contractData.baseSalary) },
                                { label: 'Asig. Locomoción', value: formatCLP(contractData.transportAllowance) },
                                { label: 'Asig. Colación', value: formatCLP(contractData.mealAllowance) },
                                { label: 'Total Haberes', value: formatCLP(contractData.baseSalary + contractData.transportAllowance + contractData.mealAllowance) },
                            ].map((item, i) => (
                                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl">
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">{item.label}</span>
                                    <span className="text-xs font-bold text-slate-800 dark:text-white mt-0.5 block">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Liquidation View */}
            {activeContractTab === 'liquidation' && (
                <div className="space-y-4">
                    {/* Current Month Liquidation */}
                    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-5 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h5 className="text-base font-black">Liquidación de Remuneración</h5>
                                    <p className="text-xs text-emerald-200 mt-0.5">Período: {liquidation.period} — {liquidation.daysWorked} días trabajados</p>
                                </div>
                                <button className="px-3 py-1.5 bg-white/15 hover:bg-white/25 rounded-xl text-[10px] font-bold uppercase transition-all cursor-pointer">
                                    📥 Descargar PDF
                                </button>
                            </div>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Haberes */}
                            <div>
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block mb-2">💰 Haberes (Ingresos)</span>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center px-3 py-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg text-xs">
                                        <span className="text-slate-700 dark:text-slate-300">Sueldo Base Pactado (Imponible)</span>
                                        <span className="font-bold text-slate-800 dark:text-white">{formatCLP(liquidation.baseSalary)}</span>
                                    </div>
                                    <div className="flex justify-between items-center px-3 py-2 bg-slate-50 dark:bg-slate-950/50 rounded-lg text-xs">
                                        <span className="text-slate-600 dark:text-slate-400">Asig. Locomoción (No Imponible)</span>
                                        <span className="font-bold text-slate-700 dark:text-slate-300">{formatCLP(liquidation.transportAllowance)}</span>
                                    </div>
                                    <div className="flex justify-between items-center px-3 py-2 bg-slate-50 dark:bg-slate-950/50 rounded-lg text-xs">
                                        <span className="text-slate-600 dark:text-slate-400">Asig. Colación (No Imponible)</span>
                                        <span className="font-bold text-slate-700 dark:text-slate-300">{formatCLP(liquidation.mealAllowance)}</span>
                                    </div>
                                    <div className="flex justify-between items-center px-3 py-2 border-t border-emerald-200 dark:border-emerald-900 text-xs font-black">
                                        <span className="text-emerald-700 dark:text-emerald-400">Total Haberes Bruto</span>
                                        <span className="text-emerald-700 dark:text-emerald-400">{formatCLP(liquidation.totalGross)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Deducciones */}
                            <div>
                                <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider block mb-2">📉 Deducciones Previsionales</span>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center px-3 py-2 bg-rose-50 dark:bg-rose-950/20 rounded-lg text-xs">
                                        <span className="text-slate-600 dark:text-slate-400">Salud — Fonasa (7%)</span>
                                        <span className="font-bold text-rose-600 dark:text-rose-400">-{formatCLP(liquidation.healthDeduction)}</span>
                                    </div>
                                    <div className="flex justify-between items-center px-3 py-2 bg-slate-50 dark:bg-slate-950/50 rounded-lg text-xs">
                                        <span className="text-slate-600 dark:text-slate-400">Pensión — AFP Capital (11.44%)</span>
                                        <span className="font-bold text-rose-500">-{formatCLP(liquidation.pensionDeduction)}</span>
                                    </div>
                                    <div className="flex justify-between items-center px-3 py-2 bg-slate-50 dark:bg-slate-950/50 rounded-lg text-xs">
                                        <span className="text-slate-600 dark:text-slate-400">Seguro Cesantía — AFC (0.60%)</span>
                                        <span className="font-bold text-rose-500">-{formatCLP(liquidation.unemploymentDeduction)}</span>
                                    </div>
                                    <div className="flex justify-between items-center px-3 py-2 border-t border-rose-200 dark:border-rose-900 text-xs font-black">
                                        <span className="text-rose-600 dark:text-rose-400">Total Descuentos</span>
                                        <span className="text-rose-600 dark:text-rose-400">-{formatCLP(liquidation.totalDeductions)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Net Pay */}
                            <div className="p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-950/40 dark:to-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block">Sueldo Líquido a Transferir</span>
                                        <span className="text-[9px] text-slate-500 dark:text-slate-400 block mt-0.5">Pago vía transferencia electrónica</span>
                                    </div>
                                    <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{formatCLP(liquidation.netPay)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Liquidation History */}
                    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 dark:border-slate-800">
                            <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Historial de Liquidaciones</span>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-slate-800">
                            {liquidationHistory.map((l, i) => (
                                <div key={i} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 text-xs font-bold">
                                            💵
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-slate-800 dark:text-white block">{l.period}</span>
                                            <span className="text-[10px] text-slate-400 block">Pagado el {l.date}</span>
                                        </div>
                                    </div>
                                    <div className="text-right flex items-center gap-3">
                                        <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{formatCLP(l.netPay)}</span>
                                        <button className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 text-[10px] font-bold rounded-lg transition-all cursor-pointer">
                                            📥 PDF
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
