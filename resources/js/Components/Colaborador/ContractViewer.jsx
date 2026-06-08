import { useState } from 'react';

export default function ContractViewer({ user }) {
    const [activeContractTab, setActiveContractTab] = useState('contract');
    const [selectedPeriod, setSelectedPeriod] = useState('demo-mayo');

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

    const liquidations = {
        'demo-mayo': {
            period: 'Mayo 2026',
            employeeName: user?.name || 'Conserje Principal',
            rut: user?.rut || '55.555.555-5',
            position: 'Auxiliar de Aseo / Portería',
            daysWorked: 30,
            baseSalary: 539000,
            transportAllowance: 66896,
            mealAllowance: 66896,
            responsibilityAllowance: 0,
            overtime: 0,
            clothingAllowance: 0,
            totalGross: 672592,
            healthDeduction: 37730,
            pensionDeduction: 61662,
            pensionRate: '11.44%',
            pensionName: 'AFP Capital',
            unemploymentDeduction: 3234,
            totalDeductions: 102626,
            anticipo: 0,
            prestamo: 0,
            totalOtherDeductions: 0,
            netPay: 569966,
            bankName: 'Banco Estado',
            accountType: 'Cuenta Rut',
            accountNumber: '12345678',
            paymentMethod: 'Transferencia Electrónica',
            observations: 'Pago mensual regular.'
        },
        'juan-carlos-abril': {
            period: 'Abril 2026',
            employeeName: 'Juan Carlos Pérez González',
            rut: '12.345.678-9',
            position: 'Conserje',
            daysWorked: 30,
            baseSalary: 850000,
            transportAllowance: 40000,
            mealAllowance: 50000,
            responsibilityAllowance: 80000,
            overtime: 30000,
            clothingAllowance: 15000,
            totalGross: 1065000,
            healthDeduction: 67200,
            pensionDeduction: 96000,
            pensionRate: '10.00%',
            pensionName: 'AFP Habitat',
            unemploymentDeduction: 5760,
            totalDeductions: 168960,
            anticipo: 50000,
            prestamo: 20000,
            totalOtherDeductions: 70000,
            netPay: 826040,
            bankName: 'Banco Estado',
            accountType: 'Cuenta Rut',
            accountNumber: '12345678',
            paymentMethod: 'Transferencia Electrónica',
            observations: 'Nota: El comprobante impreso oficial tiene un error tipográfico de $1.000 CLP en la suma de descuentos previsionales impreso como $169.960. El cálculo correcto real es de $168.960, resultando en un Sueldo Líquido de $826.040 CLP.'
        }
    };

    const currentLiquidation = liquidations[selectedPeriod] || liquidations['demo-mayo'];

    const liquidationHistory = [
        { key: 'demo-mayo', period: 'Mayo 2026', netPay: 569966, status: 'paid', date: '31/05/2026' },
        { key: 'juan-carlos-abril', period: 'Abril 2026 (Ficha Juan Carlos Pérez)', netPay: 826040, status: 'paid', date: '30/04/2026' },
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
                <div className="space-y-6">
                    {/* Current Month Liquidation */}
                    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-5 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h5 className="text-base font-black">Liquidación de Remuneración</h5>
                                    <p className="text-xs text-emerald-200 mt-0.5">Período: {currentLiquidation.period} — {currentLiquidation.daysWorked} días trabajados</p>
                                </div>
                                <span className="px-3 py-1.5 bg-white/15 rounded-xl text-[10px] font-bold uppercase">
                                    EMPLEADO: {currentLiquidation.employeeName} (RUT {currentLiquidation.rut})
                                </span>
                            </div>
                        </div>

                        <div className="p-6 space-y-5">
                            {/* Haberes */}
                            <div>
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block mb-2">💰 Haberes (Ingresos)</span>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center px-3 py-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg text-xs">
                                        <span className="text-slate-700 dark:text-slate-300 font-medium">Sueldo Base Pactado</span>
                                        <span className="font-bold text-slate-800 dark:text-white">{formatCLP(currentLiquidation.baseSalary)}</span>
                                    </div>
                                    {currentLiquidation.responsibilityAllowance > 0 && (
                                        <div className="flex justify-between items-center px-3 py-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg text-xs">
                                            <span className="text-slate-700 dark:text-slate-300 font-medium">Asignación de Responsabilidad</span>
                                            <span className="font-bold text-slate-800 dark:text-white">{formatCLP(currentLiquidation.responsibilityAllowance)}</span>
                                        </div>
                                    )}
                                    {currentLiquidation.overtime > 0 && (
                                        <div className="flex justify-between items-center px-3 py-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg text-xs">
                                            <span className="text-slate-700 dark:text-slate-300 font-medium">Horas Extras</span>
                                            <span className="font-bold text-slate-800 dark:text-white">{formatCLP(currentLiquidation.overtime)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center px-3 py-2 bg-slate-50 dark:bg-slate-950/50 rounded-lg text-xs">
                                        <span className="text-slate-600 dark:text-slate-400">Asig. Locomoción (No Imponible)</span>
                                        <span className="font-bold text-slate-700 dark:text-slate-300">{formatCLP(currentLiquidation.transportAllowance)}</span>
                                    </div>
                                    <div className="flex justify-between items-center px-3 py-2 bg-slate-50 dark:bg-slate-950/50 rounded-lg text-xs">
                                        <span className="text-slate-600 dark:text-slate-400">Asig. Colación (No Imponible)</span>
                                        <span className="font-bold text-slate-700 dark:text-slate-300">{formatCLP(currentLiquidation.mealAllowance)}</span>
                                    </div>
                                    {currentLiquidation.clothingAllowance > 0 && (
                                        <div className="flex justify-between items-center px-3 py-2 bg-slate-50 dark:bg-slate-950/50 rounded-lg text-xs">
                                            <span className="text-slate-600 dark:text-slate-400">Asig. Vestuario (No Imponible)</span>
                                            <span className="font-bold text-slate-700 dark:text-slate-300">{formatCLP(currentLiquidation.clothingAllowance)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center px-3 py-2 border-t border-emerald-250 dark:border-emerald-900 text-xs font-black">
                                        <span className="text-emerald-700 dark:text-emerald-400 uppercase text-[10px]">Total Haberes Bruto</span>
                                        <span className="text-emerald-700 dark:text-emerald-400">{formatCLP(currentLiquidation.totalGross)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Deducciones */}
                            <div>
                                <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider block mb-2">📉 Deducciones Previsionales y Descuentos</span>
                                <div className="space-y-1.5">
                                    <div className="flex justify-between items-center px-3 py-2 bg-rose-50 dark:bg-rose-950/20 rounded-lg text-xs">
                                        <span className="text-slate-600 dark:text-slate-400">Salud — Fonasa (7.00%)</span>
                                        <span className="font-bold text-rose-600 dark:text-rose-400">-{formatCLP(currentLiquidation.healthDeduction)}</span>
                                    </div>
                                    <div className="flex justify-between items-center px-3 py-2 bg-rose-50 dark:bg-rose-950/20 rounded-lg text-xs">
                                        <span className="text-slate-600 dark:text-slate-400">Pensión — {currentLiquidation.pensionName} ({currentLiquidation.pensionRate})</span>
                                        <span className="font-bold text-rose-600 dark:text-rose-400">-{formatCLP(currentLiquidation.pensionDeduction)}</span>
                                    </div>
                                    {currentLiquidation.unemploymentDeduction > 0 && (
                                        <div className="flex justify-between items-center px-3 py-2 bg-rose-50 dark:bg-rose-950/20 rounded-lg text-xs">
                                            <span className="text-slate-600 dark:text-slate-400">Seguro Cesantía — AFC (0.60%)</span>
                                            <span className="font-bold text-rose-600 dark:text-rose-400">-{formatCLP(currentLiquidation.unemploymentDeduction)}</span>
                                        </div>
                                    )}
                                    {currentLiquidation.anticipo > 0 && (
                                        <div className="flex justify-between items-center px-3 py-2 bg-slate-50 dark:bg-slate-950/50 rounded-lg text-xs">
                                            <span className="text-slate-600 dark:text-slate-400">Anticipo de Sueldo</span>
                                            <span className="font-bold text-rose-500">-{formatCLP(currentLiquidation.anticipo)}</span>
                                        </div>
                                    )}
                                    {currentLiquidation.prestamo > 0 && (
                                        <div className="flex justify-between items-center px-3 py-2 bg-slate-50 dark:bg-slate-950/50 rounded-lg text-xs">
                                            <span className="text-slate-600 dark:text-slate-400">Préstamo Social</span>
                                            <span className="font-bold text-rose-500">-{formatCLP(currentLiquidation.prestamo)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center px-3 py-2 border-t border-rose-250 dark:border-rose-900 text-xs font-black">
                                        <span className="text-rose-600 dark:text-rose-400 uppercase text-[10px]">Total Descuentos</span>
                                        <span className="text-rose-600 dark:text-rose-400">-{formatCLP(currentLiquidation.totalDeductions + currentLiquidation.totalOtherDeductions)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Net Pay */}
                            <div className="p-5 bg-gradient-to-r from-emerald-500/10 to-emerald-500/20 border border-emerald-500/20 rounded-2xl">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block">Sueldo Líquido Transferido</span>
                                        <span className="text-[9px] text-slate-500 dark:text-slate-400 block mt-0.5">Vía {currentLiquidation.paymentMethod} &bull; {currentLiquidation.bankName}</span>
                                    </div>
                                    <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{formatCLP(currentLiquidation.netPay)}</span>
                                </div>
                            </div>

                            {/* Reconciliation Alert for Juan Carlos */}
                            {selectedPeriod === 'juan-carlos-abril' && (
                                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-4 rounded-xl text-[11px] text-amber-800 dark:text-amber-400 font-sans space-y-1">
                                    <span className="font-extrabold uppercase block">⚠️ Nota de Conciliación Matemática (Infografía)</span>
                                    <p>La liquidación de Juan Carlos Pérez contiene un error de suma impreso en los descuentos previsionales de la infografía (Fonasa $67.200 + AFP $96.000 + Cesantía $5.760 = $168.960, pero impreso como $169.960). Nuestro sistema realiza la sumatoria matemáticamente exacta de $168.960, resultando en un Sueldo Líquido de $826.040 CLP (en lugar de los $825.040 CLP informados con error).</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Liquidation History */}
                    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 dark:border-slate-800">
                            <span className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Historial de Liquidaciones</span>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-slate-800">
                            {liquidationHistory.map((l, i) => (
                                <div key={i} className={`flex items-center justify-between px-5 py-3 transition-colors ${selectedPeriod === l.key ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-l-4 border-emerald-500' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => setSelectedPeriod(l.key)}
                                            className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 text-xs font-bold hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                                            title="Ver liquidación detallada"
                                        >
                                            👁️
                                        </button>
                                        <div>
                                            <button 
                                                onClick={() => setSelectedPeriod(l.key)}
                                                className="text-xs font-bold text-slate-800 dark:text-white block hover:text-emerald-600 transition-colors text-left"
                                            >
                                                {l.period}
                                            </button>
                                            <span className="text-[10px] text-slate-400 block">Pagado el {l.date}</span>
                                        </div>
                                    </div>
                                    <div className="text-right flex items-center gap-3">
                                        <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{formatCLP(l.netPay)}</span>
                                        <button 
                                            onClick={() => setSelectedPeriod(l.key)}
                                            className="px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                                        >
                                            🔍 Detalle
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
