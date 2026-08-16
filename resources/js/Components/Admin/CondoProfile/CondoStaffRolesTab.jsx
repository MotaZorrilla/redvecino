import { Plus, Edit2, Trash2 } from 'lucide-react';

export default function CondoStaffRolesTab({
    employeeRoles = [],
    onOpenModal,
    onDelete
}) {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-4 text-left">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                        Cargos Operativos de Colaboradores
                    </h4>
                    <p className="text-[11px] text-slate-400">Catálogo de funciones laborales aplicables a contratos y liquidaciones.</p>
                </div>
                <button
                    type="button"
                    onClick={() => onOpenModal()}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nuevo Cargo</span>
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-950 text-slate-400 border-b border-slate-200 dark:border-slate-800">
                            <th className="p-3 font-bold">ID</th>
                            <th className="p-3 font-bold">Nombre del Cargo</th>
                            <th className="p-3 font-bold text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                        {employeeRoles.map((role) => (
                            <tr key={role.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                <td className="p-3 font-mono text-slate-400">#{role.id}</td>
                                <td className="p-3 font-bold text-slate-900 dark:text-white">{role.name}</td>
                                <td className="p-3 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => onOpenModal(role)}
                                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDelete(role.id)}
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
