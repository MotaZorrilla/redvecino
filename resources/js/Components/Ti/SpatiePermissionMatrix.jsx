import { useState, useEffect } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';

export default function SpatiePermissionMatrix({ setTerminalLogs }) {
    const [matrixData, setMatrixData] = useState({ roles: [], permissions: [], matrix: {} });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPermissionsMatrix = () => {
        setLoading(true);
        axios.get('/api/ti/roles-permissions')
            .then(res => {
                setMatrixData(res.data);
                setError(null);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error al cargar la matriz de permisos Spatie:", err);
                setError("No se pudo cargar la matriz desde el servidor.");
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchPermissionsMatrix();
    }, []);

    const handleToggle = (role, permission) => {
        axios.post('/api/ti/roles-permissions/toggle', { role, permission })
            .then(res => {
                setMatrixData(prev => {
                    const currentPermissions = prev.matrix[role] || [];
                    const exists = currentPermissions.includes(permission);
                    const nextPermissions = exists 
                        ? currentPermissions.filter(p => p !== permission)
                        : [...currentPermissions, permission];
                    return {
                        ...prev,
                        matrix: {
                            ...prev.matrix,
                            [role]: nextPermissions
                        }
                    };
                });
                
                if (setTerminalLogs) {
                    setTerminalLogs(prev => [...prev, `[SPATIE] ${res.data.message}`]);
                }

                // Hot reload page data to synchronize local user session permissions
                router.reload();
            })
            .catch(err => {
                const errMsg = err.response?.data?.error || err.message;
                alert("Error al modificar permiso Spatie: " + errMsg);
            });
    };

    if (loading) {
        return (
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 text-center animate-pulse">
                <span className="text-xs text-slate-500 font-mono">Cargando matriz real de roles y permisos Spatie...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-rose-950/20 border border-rose-900/30 rounded-3xl p-6 text-center text-xs text-rose-400 font-mono">
                ⚠️ {error}
                <button 
                    onClick={fetchPermissionsMatrix} 
                    className="ml-3 px-3 py-1 bg-rose-900/30 border border-rose-800 text-rose-300 rounded-lg hover:bg-rose-900/50 transition-all"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 md:p-8 space-y-6 text-left max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
            {/* Decorative background gradients */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#00A896]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="border-b border-slate-800 pb-4 flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h4 className="text-sm font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
                        ⚖️ Matriz Real Spatie RBAC (Persistente)
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                        Modifica directamente en la base de datos VPS los mapeos de roles a permisos del kernel de Laravel.
                    </p>
                </div>
                <button
                    onClick={fetchPermissionsMatrix}
                    className="px-3 py-1.5 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-[10px] font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                    title="Actualizar datos desde la base de datos"
                >
                    🔄 Recargar
                </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/40">
                <table className="w-full text-left text-[11px] font-mono border-collapse">
                    <thead>
                        <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-500">
                            <th className="py-3 px-4 text-left font-bold uppercase tracking-wider text-slate-400">Permiso / Operación</th>
                            {matrixData.roles.map(role => (
                                <th key={role} className="py-3 px-2 text-center font-bold uppercase tracking-wider text-[10px]">
                                    {role}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                        {matrixData.permissions.map(perm => (
                            <tr key={perm} className="hover:bg-slate-900/30 transition-colors">
                                <td className="py-3 px-4 font-bold text-slate-200 text-left border-r border-slate-850 bg-slate-950/10">
                                    {perm}
                                </td>
                                {matrixData.roles.map(role => {
                                    const hasPerm = (matrixData.matrix[role] || []).includes(perm);
                                    return (
                                        <td key={role} className="py-3 px-2 text-center">
                                            <button
                                                type="button"
                                                onClick={() => handleToggle(role, perm)}
                                                className={`inline-flex h-5 w-5 rounded-lg border ${
                                                    hasPerm
                                                        ? 'bg-[#00A896]/15 border-[#00A896]/50 text-[#00A896] hover:bg-[#00A896]/30 shadow-md shadow-[#00A896]/5'
                                                        : 'bg-rose-500/5 border-rose-500/10 text-rose-500 hover:bg-rose-500/20'
                                                } items-center justify-center mx-auto text-[10px] font-black transition-all cursor-pointer transform active:scale-90`}
                                                title={`Alternar '${perm}' para el rol '${role}'`}
                                            >
                                                {hasPerm ? '✓' : '✗'}
                                            </button>
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="flex items-center gap-2 text-slate-500 text-[10px] font-medium leading-relaxed pl-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Cambios en vivo: al hacer click, se ejecuta un query SQL en el VPS y se invalida la caché de Spatie inmediatamente.</span>
            </div>
        </div>
    );
}
