import React from 'react';

export default function CommonExpensesCalculator({
    units,
    setUnits,
    securityBudget,
    setSecurityBudget,
    cleaningBudget,
    setCleaningBudget,
    maintenanceBudget,
    setMaintenanceBudget,
    utilitiesBudget,
    setUtilitiesBudget
}) {
    const totalExpenses = securityBudget + cleaningBudget + maintenanceBudget + utilitiesBudget;
    const reserveFund5Pct = totalExpenses * 0.05;
    const grossBilling = totalExpenses + reserveFund5Pct;
    const perUnitFee = units > 0 ? grossBilling / units : 0;

    return (
        <section className="mb-20 bg-slate-900 text-white rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl mb-8">
                <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
                    Simulador Interactivo de Gastos Comunes
                </span>
                <h3 className="text-3xl font-black mt-3">
                    Calculadora Transparente de Alícuotas y Prorrateo
                </h3>
                <p className="text-slate-400 text-sm mt-1">
                    Ajusta las variables operativas de un condominio tipo para visualizar la distribución automática en tiempo real.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sliders de entrada */}
                <div className="lg:col-span-7 space-y-5 bg-slate-950/60 p-6 rounded-2xl border border-slate-800/80">
                    <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="text-slate-300">Cantidad de Departamentos / Unidades</span>
                            <span className="text-emerald-400 font-mono text-sm">{units} unidades</span>
                        </div>
                        <input
                            type="range"
                            min="10"
                            max="250"
                            step="5"
                            value={units}
                            onChange={(e) => setUnits(Number(e.target.value))}
                            className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="text-slate-300">Seguridad & Conserjería</span>
                            <span className="text-emerald-400 font-mono">${securityBudget.toLocaleString('es-CL')}</span>
                        </div>
                        <input
                            type="range"
                            min="200000"
                            max="3000000"
                            step="50000"
                            value={securityBudget}
                            onChange={(e) => setSecurityBudget(Number(e.target.value))}
                            className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="text-slate-300">Aseo & Espacios Comunes</span>
                            <span className="text-emerald-400 font-mono">${cleaningBudget.toLocaleString('es-CL')}</span>
                        </div>
                        <input
                            type="range"
                            min="100000"
                            max="1500000"
                            step="25000"
                            value={cleaningBudget}
                            onChange={(e) => setCleaningBudget(Number(e.target.value))}
                            className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="text-slate-300">Mantenimiento de Ascensores / Bombas</span>
                            <span className="text-emerald-400 font-mono">${maintenanceBudget.toLocaleString('es-CL')}</span>
                        </div>
                        <input
                            type="range"
                            min="100000"
                            max="2000000"
                            step="25000"
                            value={maintenanceBudget}
                            onChange={(e) => setMaintenanceBudget(Number(e.target.value))}
                            className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="text-slate-300">Servicios Básicos Comunes (Agua/Luz)</span>
                            <span className="text-emerald-400 font-mono">${utilitiesBudget.toLocaleString('es-CL')}</span>
                        </div>
                        <input
                            type="range"
                            min="50000"
                            max="1000000"
                            step="25000"
                            value={utilitiesBudget}
                            onChange={(e) => setUtilitiesBudget(Number(e.target.value))}
                            className="w-full accent-emerald-500 bg-slate-800 rounded-lg cursor-pointer"
                        />
                    </div>
                </div>

                {/* Resumen de cobros */}
                <div className="lg:col-span-5 bg-gradient-to-br from-slate-950 to-slate-900 p-6 rounded-2xl border border-emerald-500/30 flex flex-col justify-between">
                    <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
                            Resumen de Prorrateo Mensual
                        </h4>

                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">Gastos Operativos Netos</span>
                            <span className="font-mono text-slate-200">${totalExpenses.toLocaleString('es-CL')}</span>
                        </div>

                        <div className="flex justify-between items-center text-xs">
                            <span className="text-slate-400">Fondo de Reserva Obligatorio (5%)</span>
                            <span className="font-mono text-emerald-400">+${reserveFund5Pct.toLocaleString('es-CL')}</span>
                        </div>

                        <div className="flex justify-between items-center text-xs font-bold text-slate-300 pt-2 border-t border-slate-800">
                            <span>Monto Total Facturable</span>
                            <span className="font-mono text-emerald-400">${grossBilling.toLocaleString('es-CL')}</span>
                        </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-emerald-500/20 bg-emerald-950/40 p-4 rounded-xl text-center">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 block mb-1">
                            Gasto Común Estimado por Unidad (Alícuota Promedio)
                        </span>
                        <span className="text-3xl font-black font-mono text-white">
                            ${Math.round(perUnitFee).toLocaleString('es-CL')}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-1">
                            / mes por departamento
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
