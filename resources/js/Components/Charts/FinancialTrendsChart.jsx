import { useMemo } from 'react';

/**
 * Modern SVG-based financial trend chart component
 * Replaces direct HTML5 Canvas Context2D manipulations with clean, responsive React SVG rendering.
 */
export default function FinancialTrendsChart({ 
    incomes = [], 
    expenses = [], 
    title = "Evolución de Ingresos y Egresos",
    height = 240 
}) {
    const chartData = useMemo(() => {
        // Aggregate monthly figures or default fallback trend
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        
        const monthlyIncomes = new Array(12).fill(0);
        const monthlyExpenses = new Array(12).fill(0);

        incomes.forEach(inc => {
            if (inc.date) {
                const monthIdx = new Date(inc.date).getMonth();
                if (monthIdx >= 0 && monthIdx < 12) {
                    monthlyIncomes[monthIdx] += Number(inc.amount || 0);
                }
            }
        });

        expenses.forEach(exp => {
            if (exp.date) {
                const monthIdx = new Date(exp.date).getMonth();
                if (monthIdx >= 0 && monthIdx < 12) {
                    monthlyExpenses[monthIdx] += Number(exp.amount || 0);
                }
            }
        });

        // Determine maximum scale
        const maxVal = Math.max(
            ...monthlyIncomes, 
            ...monthlyExpenses, 
            100000
        );

        return {
            months,
            incomes: monthlyIncomes,
            expenses: monthlyExpenses,
            maxVal
        };
    }, [incomes, expenses]);

    const { months, incomes: incValues, expenses: expValues, maxVal } = chartData;

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <span>📊</span> {title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Comparativa mensual acumulada de flujo de caja
                    </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold">
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                        <span className="text-slate-700 dark:text-slate-300">Ingresos</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                        <span className="text-slate-700 dark:text-slate-300">Egresos</span>
                    </div>
                </div>
            </div>

            {/* SVG Chart Area */}
            <div className="w-full overflow-x-auto">
                <div className="min-w-[500px]" style={{ height: `${height}px` }}>
                    <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                        {/* Grid lines */}
                        <line x1="0" y1="40" x2="600" y2="40" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="4 4" />
                        <line x1="0" y1="90" x2="600" y2="90" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="4 4" />
                        <line x1="0" y1="140" x2="600" y2="140" stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeDasharray="4 4" />

                        {/* Bars / Data Points */}
                        {months.map((m, idx) => {
                            const x = 25 + idx * 48;
                            const incH = Math.min(150, (incValues[idx] / maxVal) * 140);
                            const expH = Math.min(150, (expValues[idx] / maxVal) * 140);

                            return (
                                <g key={m} className="transition-all duration-300 hover:opacity-80">
                                    {/* Income Bar */}
                                    <rect
                                        x={x}
                                        y={170 - incH}
                                        width="16"
                                        height={incH || 4}
                                        rx="4"
                                        className="fill-emerald-500/80 hover:fill-emerald-400"
                                    >
                                        <title>{`${m} - Ingresos: $${incValues[idx].toLocaleString('es-CL')}`}</title>
                                    </rect>

                                    {/* Expense Bar */}
                                    <rect
                                        x={x + 18}
                                        y={170 - expH}
                                        width="16"
                                        height={expH || 4}
                                        rx="4"
                                        className="fill-rose-500/80 hover:fill-rose-400"
                                    >
                                        <title>{`${m} - Egresos: $${expValues[idx].toLocaleString('es-CL')}`}</title>
                                    </rect>

                                    {/* Month Label */}
                                    <text
                                        x={x + 17}
                                        y="190"
                                        textAnchor="middle"
                                        className="fill-slate-400 text-[10px] font-bold"
                                    >
                                        {m}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>
                </div>
            </div>
        </div>
    );
}
