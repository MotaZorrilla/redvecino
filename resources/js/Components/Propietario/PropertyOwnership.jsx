import { useState } from 'react';
import { StatusBadge } from '../DashboardShared';

export default function PropertyOwnership() {
    const [properties] = useState([
        { id: 1, number: 'Depto 101', type: 'Apartamento', block: 'Torre A', floor: '1', area_sqm: '85', status: 'occupied', share: '1.25%', resident: 'Propietario Demo', parking: 'Est. 12', storage: 'Bodega 08' },
        { id: 2, number: 'Depto 202', type: 'Apartamento', block: 'Torre B', floor: '2', area_sqm: '70', status: 'occupied', share: '1.02%', resident: 'Residente Demo', parking: 'Sin Asignar', storage: 'Bodega 24' },
        { id: 3, number: 'Depto 303', type: 'Apartamento', block: 'Torre B', floor: '3', area_sqm: '110', status: 'vacant', share: '1.68%', resident: 'Vacante (Arriendo disponible)', parking: 'Est. 44', storage: 'Bodega 50' }
    ]);

    const totalShare = properties.reduce((acc, p) => acc + parseFloat(p.share), 0).toFixed(2);

    return (
        <div className="space-y-6 text-left">
            {/* Ownership stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Unidades Activas', value: `${properties.length} Propiedades`, desc: 'Departamentos registrados a su RUT', icon: '🏢', color: 'indigo' },
                    { label: 'Copropiedad Acumulada', value: `${totalShare}%`, desc: 'Coeficiente de derecho en asambleas', icon: '📊', color: 'emerald' },
                    { label: 'Unidades Arrendadas', value: `${properties.filter(p => p.status === 'occupied').length - 1} Ocupada(s)`, desc: 'Inquilinos administrados', icon: '👥', color: 'amber' }
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-start gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-gray-50 dark:bg-slate-950 flex items-center justify-center text-xl shrink-0">
                            {stat.icon}
                        </div>
                        <div className="space-y-1">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">{stat.label}</span>
                            <span className="text-xl font-black text-gray-900 dark:text-white block">{stat.value}</span>
                            <span className="text-xs text-slate-500 font-medium block">{stat.desc}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Properties Grid */}
            <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider mb-6">
                    🏢 Detalles de Mis Activos Residenciales
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map(p => (
                        <div key={p.id} className="p-5 bg-gray-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-850 rounded-3xl flex flex-col justify-between shadow-sm relative">
                            {/* share tag */}
                            <div className="absolute top-4 right-4 px-2 py-0.5 bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 rounded-lg text-[10px] font-mono font-bold">
                                Coef: {p.share}
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest block">{p.block} &bull; Piso {p.floor}</span>
                                    <h4 className="text-base font-black text-gray-900 dark:text-white">{p.number}</h4>
                                    <p className="text-xs text-gray-500 font-medium">{p.type} &bull; {p.area_sqm} m² de superficie</p>
                                </div>

                                <div className="divide-y divide-gray-200/50 dark:divide-slate-800 text-xs">
                                    <div className="flex justify-between py-2">
                                        <span className="text-slate-400 dark:text-slate-500">Estacionamiento:</span>
                                        <span className="font-semibold text-gray-800 dark:text-slate-200">{p.parking}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-slate-400 dark:text-slate-500">Bodega asignada:</span>
                                        <span className="font-semibold text-gray-800 dark:text-slate-200">{p.storage}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-slate-400 dark:text-slate-500">Residente / Ocupante:</span>
                                        <span className="font-semibold text-gray-800 dark:text-slate-200 truncate max-w-[150px]">{p.resident}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-gray-200/50 dark:border-slate-800 pt-3 mt-3 flex items-center justify-between">
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase">Estado de Ocupación</span>
                                <StatusBadge status={p.status} type="status" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
