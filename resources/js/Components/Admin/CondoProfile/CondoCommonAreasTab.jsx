import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function CondoCommonAreasTab({
    commonAreas = [],
    onOpenModal,
    onDelete
}) {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-4 text-left">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                        Áreas Comunes, Amenidades y Equipamiento
                    </h4>
                    <p className="text-[11px] text-slate-400">Espacios de uso comunitario sujetos a reservas, arriendos o acceso libre.</p>
                </div>
                <button
                    type="button"
                    onClick={() => onOpenModal()}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nueva Área</span>
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 border-b border-slate-200 dark:border-slate-800">
                            <th className="p-3 font-bold">Clasificación</th>
                            <th className="p-3 font-bold">Nombre del Espacio</th>
                            <th className="p-3 font-bold">Condición de Uso</th>
                            <th className="p-3 font-bold text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                        {commonAreas.map((area) => (
                            <tr key={area.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                <td className="p-3 font-medium text-slate-500">{area.classification}</td>
                                <td className="p-3 font-bold text-slate-900 dark:text-white">{area.name}</td>
                                <td className="p-3">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                        area.condition === 'Gratuito'
                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                            : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                    }`}>
                                        {area.condition}
                                    </span>
                                </td>
                                <td className="p-3 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => onOpenModal(area)}
                                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDelete(area.id)}
                                            className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
