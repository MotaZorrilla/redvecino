import { useState } from 'react';
import { StatusBadge } from '@/Components/DashboardShared';

function LocalBadge({ children, variant = 'default' }) {
    const variants = {
        default: 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300 dark:border dark:border-slate-700/60',
        success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-500 dark:border dark:border-emerald-500/20',
        warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 dark:border dark:border-amber-500/20',
        danger: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 dark:border dark:border-rose-500/20',
        info: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 dark:border dark:border-blue-500/20',
        purple: 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400 dark:border dark:border-violet-500/20',
    };

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant] || variants.default}`}>
            {children}
        </span>
    );
}

function LocalStatusBadge({ status, type = 'status' }) {
    const configs = {
        status: {
            active: { label: 'Activo', variant: 'success' },
            inactive: { label: 'Inactivo', variant: 'danger' },
            occupied: { label: 'Ocupado', variant: 'success' },
            vacant: { label: 'Disponible', variant: 'warning' },
        }
    };

    const config = configs[type]?.[status] || { label: status, variant: 'default' };
    return <LocalBadge variant={config.variant}>{config.label}</LocalBadge>;
}

export default function CondosManagement({
    condosList = [],
    setCondosList,
    showAddCondoForm,
    setShowAddCondoForm,
    editingCondo,
    setEditingCondo,
    newCondoForm,
    setNewCondoForm,
    adminCondoId,
    setAdminCondoId,
    setTerminalLogs
}) {
    return (
        <div className="space-y-6 animate-fade-in text-left">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Gestión de Condominios */}
                <button
                    onClick={() => {
                        setEditingCondo(null);
                        setNewCondoForm({ name: '', address: '', city: '', units_count: '' });
                        setShowAddCondoForm(!showAddCondoForm);
                    }}
                    className="px-4 py-2 bg-brand-teal hover:bg-brand-teal-light text-white font-bold text-xs rounded-xl shadow-lg transition-all shrink-0"
                >
                    {showAddCondoForm ? 'Cerrar Formulario' : 'Crear Condominio'}
                </button>
            </div>

            {showAddCondoForm && (
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (editingCondo) {
                        setCondosList(prev => prev.map(c => c.id === editingCondo.id ? {
                            ...c,
                            name: newCondoForm.name,
                            address: newCondoForm.address,
                            city: newCondoForm.city,
                            units_count: Number(newCondoForm.units_count) || 50
                        } : c));
                        setTerminalLogs(prev => [...prev, `[CONDO] Editado condominio #${editingCondo.id}: ${newCondoForm.name}`]);
                        setEditingCondo(null);
                    } else {
                        const newC = {
                            id: condosList.length + 1,
                            name: newCondoForm.name,
                            address: newCondoForm.address,
                            city: newCondoForm.city,
                            units_count: Number(newCondoForm.units_count) || 50,
                            status: 'active'
                        };
                        setCondosList(prev => [...prev, newC]);
                        setTerminalLogs(prev => [...prev, `[CONDO] Creado condominio #${newC.id}: ${newC.name}`]);
                    }
                    setShowAddCondoForm(false);
                    setNewCondoForm({ name: '', address: '', city: '', units_count: '' });
                }} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-4 max-w-xl">
                    <h5 className="text-xs font-bold text-slate-300 uppercase">{editingCondo ? 'Editar Condominio' : 'Detalles del Condominio'}</h5>
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="condo-name" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Nombre</label>
                        <input
                            id="condo-name"
                            type="text"
                            required
                            value={newCondoForm.name}
                            onChange={(e) => setNewCondoForm(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs px-3 py-2 text-white focus:outline-none focus:border-brand-teal"
                        />
                    </div>
                    <div>
                        <label htmlFor="condo-address" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Dirección</label>
                        <input
                            id="condo-address"
                            type="text"
                            required
                            value={newCondoForm.address}
                            onChange={(e) => setNewCondoForm(prev => ({ ...prev, address: e.target.value }))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs px-3 py-2 text-white focus:outline-none focus:border-brand-teal"
                        />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="condo-city" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Ciudad</label>
                        <input
                            id="condo-city"
                            type="text"
                            required
                            value={newCondoForm.city}
                            onChange={(e) => setNewCondoForm(prev => ({ ...prev, city: e.target.value }))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs px-3 py-2 text-white focus:outline-none focus:border-brand-teal"
                        />
                    </div>
                    <div>
                        <label htmlFor="condo-units" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Número de Unidades</label>
                        <input
                            id="condo-units"
                            type="number"
                            required
                            value={newCondoForm.units_count}
                            onChange={(e) => setNewCondoForm(prev => ({ ...prev, units_count: e.target.value }))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs px-3 py-2 text-white focus:outline-none focus:border-brand-teal"
                        />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" className="px-4 py-2 bg-brand-teal text-white font-bold text-xs rounded-xl shadow-md">
                            {editingCondo ? 'Actualizar Condominio' : 'Guardar Condominio'}
                        </button>
                        {editingCondo && (
                            <button 
                                type="button" 
                                onClick={() => {
                                    setEditingCondo(null);
                                    setShowAddCondoForm(false);
                                    setNewCondoForm({ name: '', address: '', city: '', units_count: '' });
                                }}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            )}

            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden shadow-inner">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="bg-slate-950 text-slate-500 border-b border-slate-800">
                                <th className="p-4 font-black text-left">ID</th>
                                <th className="p-4 font-black text-left">Nombre</th>
                                <th className="p-4 font-black text-left">Dirección</th>
                                <th className="p-4 font-black text-left">Ciudad</th>
                                <th className="p-4 font-black text-left">Unidades</th>
                                <th className="p-4 font-black text-left">Estado</th>
                                <th className="p-4 font-black text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                            {condosList.map((c) => (
                                <tr key={c.id} className="hover:bg-slate-900/60">
                                    <td className="p-4 font-bold text-slate-100 text-left">#{c.id}</td>
                                    <td className="p-4 text-left font-bold">{c.name}</td>
                                    <td className="p-4 text-left">{c.address}</td>
                                    <td className="p-4 text-left">{c.city}</td>
                                    <td className="p-4 text-left font-mono">{c.units_count} unidades</td>
                                    <td className="p-4 text-left"><LocalStatusBadge status={c.status} type="status" /></td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingCondo(c);
                                                    setNewCondoForm({
                                                        name: c.name,
                                                        address: c.address,
                                                        city: c.city,
                                                        units_count: c.units_count
                                                    });
                                                    setShowAddCondoForm(true);
                                                }}
                                                className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-bold rounded-lg transition-all"
                                            >
                                                ✏️ Editar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (confirm(`¿Estás seguro de eliminar el condominio ${c.name}?`)) {
                                                        setCondosList(prev => prev.filter(item => item.id !== c.id));
                                                        setTerminalLogs(prev => [...prev, `[DELETE] Condominio eliminado: ${c.name} (ID: ${c.id})`]);
                                                        if (adminCondoId === c.id) {
                                                            setAdminCondoId(1); // Reset selected condo if deleted
                                                        }
                                                    }
                                                }}
                                                className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[10px] font-bold rounded-lg transition-all"
                                            >
                                                🗑️ Eliminar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
