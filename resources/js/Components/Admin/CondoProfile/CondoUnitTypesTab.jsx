import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function CondoUnitTypesTab({
    unitTypes = [],
    onOpenModal,
    onDelete
}) {
    const totalSqm = unitTypes.reduce((acc, curr) => acc + (Number(curr.sqm) || 0), 0);
    const totalPct = unitTypes.reduce((acc, curr) => acc + (Number(curr.alicuota_pct) || 0), 0);

    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-4 text-left">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                        Tipos de Unidades y Alícuotas por Modelo
                    </h4>
                    <p className="text-[11px] text-slate-400">Define los modelos de departamentos o casas para cálculo de prorrateo.</p>
                </div>
                <button
                    type="button"
                    onClick={() => onOpenModal()}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nuevo Modelo</span>
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 border-b border-slate-200 dark:border-slate-800">
                            <th className="p-3 font-bold">Código / Modelo</th>
                            <th className="p-3 font-bold text-right">Superficie (m²)</th>
                            <th className="p-3 font-bold text-right">Alícuota (%)</th>
                            <th className="p-3 font-bold text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                        {unitTypes.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                <td className="p-3 font-bold text-slate-900 dark:text-white">{u.code}</td>
                                <td className="p-3 text-right font-mono">{u.sqm} m²</td>
                                <td className="p-3 text-right font-mono font-bold text-indigo-600 dark:text-indigo-400">{u.alicuota_pct}%</td>
                                <td className="p-3 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => onOpenModal(u)}
                                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDelete(u.id)}
                                            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-slate-50 dark:bg-slate-950 font-bold border-t border-slate-200 dark:border-slate-800">
                            <td className="p-3">Total Consolidado</td>
                            <td className="p-3 text-right font-mono">{totalSqm} m²</td>
                            <td className="p-3 text-right font-mono text-indigo-600 dark:text-indigo-400">{totalPct.toFixed(2)}%</td>
                            <td className="p-3"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}
