import { useState } from 'react';
import { SimpleTable, StatusBadge } from '@/Components/DashboardShared';

export default function PropertiesList({
    adminCondoId,
    adminFilteredProperties = [],
    propertiesList = [],
    setPropertiesList,
    newPropForm,
    setNewPropForm,
    showAddPropForm,
    setShowAddPropForm,
    editingProp,
    setEditingProp
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (editingProp) {
            setPropertiesList(prev => prev.map(p => p.id === editingProp.id ? {
                ...p,
                type: newPropForm.type,
                number: newPropForm.number,
                block: newPropForm.block,
                floor: Number(newPropForm.floor),
                area_sqm: Number(newPropForm.area_sqm),
                status: newPropForm.status
            } : p));
            setEditingProp(null);
        } else {
            const newP = {
                id: propertiesList.length > 0 ? Math.max(...propertiesList.map(p => p.id)) + 1 : 1,
                condominium_id: adminCondoId,
                type: newPropForm.type,
                number: newPropForm.number,
                block: newPropForm.block,
                floor: Number(newPropForm.floor),
                area_sqm: Number(newPropForm.area_sqm),
                status: newPropForm.status,
                owners: [],
                residents: []
            };
            setPropertiesList(prev => [...prev, newP]);
        }
        setShowAddPropForm(false);
        setNewPropForm({ condominium_id: adminCondoId, type: 'apartment', number: '', block: 'Torre A', floor: '', area_sqm: '', status: 'vacant' });
        setIsSubmitting(false);
    };

    return (
        <div className="space-y-6 animate-fade-in text-left">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                        🏢 Registro de Unidades (Propiedades)
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Gestiona departamentos, estacionamientos y asignación de vecinos.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingProp(null);
                        setNewPropForm({ condominium_id: adminCondoId, type: 'apartment', number: '', block: 'Torre A', floor: '', area_sqm: '', status: 'vacant' });
                        setShowAddPropForm(!showAddPropForm);
                    }}
                    className="px-3.5 py-1.5 bg-brand-teal hover:bg-brand-teal-light text-white font-bold text-xs rounded-xl shadow transition-all"
                >
                    {showAddPropForm ? 'Cerrar Form' : 'Añadir Unidad'}
                </button>
            </div>

            {showAddPropForm && (
                <form onSubmit={handleFormSubmit} className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-4 max-w-xl text-left">
                    <h5 className="text-xs font-bold text-gray-800 dark:text-slate-200 uppercase">{editingProp ? '✏️ Editar Propiedad' : '🏢 Detalles de la Propiedad'}</h5>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="prop-type" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Tipo de Unidad</label>
                            <select
                                id="prop-type"
                                value={newPropForm.type}
                                onChange={(e) => setNewPropForm(prev => ({ ...prev, type: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                            >
                                <option value="apartment">Departamento</option>
                                <option value="house">Casa</option>
                                <option value="parking">Estacionamiento</option>
                                <option value="storage">Bodega</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="prop-number" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Número / Identificador</label>
                            <input
                                id="prop-number"
                                type="text"
                                required
                                value={newPropForm.number}
                                onChange={(e) => setNewPropForm(prev => ({ ...prev, number: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label htmlFor="prop-block" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Torre / Bloque</label>
                            <input
                                id="prop-block"
                                type="text"
                                value={newPropForm.block}
                                onChange={(e) => setNewPropForm(prev => ({ ...prev, block: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="prop-floor" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Piso</label>
                            <input
                                id="prop-floor"
                                type="number"
                                value={newPropForm.floor}
                                onChange={(e) => setNewPropForm(prev => ({ ...prev, floor: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="prop-area" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Metros Cuadrados (m²)</label>
                            <input
                                id="prop-area"
                                type="number"
                                value={newPropForm.area_sqm}
                                onChange={(e) => setNewPropForm(prev => ({ ...prev, area_sqm: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="prop-status" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Estado de Ocupación</label>
                        <select
                            id="prop-status"
                            value={newPropForm.status}
                            onChange={(e) => setNewPropForm(prev => ({ ...prev, status: e.target.value }))}
                            className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                        >
                            <option value="occupied">Ocupado</option>
                            <option value="vacant">Desocupado</option>
                            <option value="maintenance">Mantenimiento</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-brand-teal hover:bg-brand-teal-light text-white font-bold text-xs rounded-xl shadow disabled:opacity-50 disabled:cursor-not-allowed">
                            {editingProp ? 'Guardar Cambios' : 'Añadir Propiedad'}
                        </button>
                        <button type="button" onClick={() => { setShowAddPropForm(false); setEditingProp(null); }} className="px-4 py-2 bg-gray-200 dark:bg-slate-800 dark:text-white text-gray-700 font-bold text-xs rounded-xl">
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <SimpleTable
                    headers={['Unidad', 'Tipo', 'Ubicación', 'Área (m²)', 'Ocupación', 'Vecinos Asignados', 'Acciones']}
                    rows={adminFilteredProperties.map(p => {
                        const ownersListText = p.owners?.join(', ') || 'Sin Propietario';
                        const residentsListText = p.residents?.join(', ') || 'Sin Residente';
                        
                        return {
                            cells: [
                                <span className="font-bold text-gray-900 dark:text-white" key={`num-${p.id}`}>#{p.number}</span>,
                                <span className="capitalize text-xs font-mono" key={`type-${p.id}`}>{p.type === 'apartment' ? 'Depto' : p.type === 'parking' ? 'Estac.' : p.type}</span>,
                                <span key={`loc-${p.id}`}>{p.block || 'Torre A'} &bull; Piso {p.floor || 1}</span>,
                                <span className="font-mono text-xs" key={`area-${p.id}`}>{p.area_sqm || 0} m²</span>,
                                <span key={`status-${p.id}`} className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                    p.status === 'occupied'
                                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500'
                                        : p.status === 'vacant'
                                        ? 'bg-slate-500/10 border border-slate-500/20 text-slate-500'
                                        : 'bg-amber-500/10 border border-amber-500/20 text-amber-500'
                                }`}>
                                    {p.status}
                                </span>,
                                <div className="text-xs space-y-0.5" key={`vec-${p.id}`}>
                                    <div><span className="text-[10px] font-bold text-indigo-500 uppercase">Prop:</span> {ownersListText}</div>
                                    <div><span className="text-[10px] font-bold text-emerald-500 uppercase">Resi:</span> {residentsListText}</div>
                                </div>,
                                <div className="flex items-center gap-2 justify-end" key={`act-${p.id}`}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingProp(p);
                                            setNewPropForm({
                                                condominium_id: p.condominium_id,
                                                type: p.type,
                                                number: p.number,
                                                block: p.block || 'Torre A',
                                                floor: p.floor || '',
                                                area_sqm: p.area_sqm || '',
                                                status: p.status
                                            });
                                            setShowAddPropForm(true);
                                        }}
                                        className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 text-[10px] font-bold rounded-lg transition-all"
                                    >
                                        ✏️ Editar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (confirm(`¿Estás seguro de eliminar la unidad #${p.number}?`)) {
                                                setPropertiesList(prev => prev.filter(item => item.id !== p.id));
                                            }
                                        }}
                                        className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 text-[10px] font-bold rounded-lg transition-all"
                                    >
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            ]
                        };
                    })}
                    emptyMessage="No hay propiedades registradas en este condominio"
                />
            </div>
        </div>
    );
}
