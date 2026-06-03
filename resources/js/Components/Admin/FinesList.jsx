import { useState } from 'react';
import { SimpleTable, StatusBadge } from '@/Components/DashboardShared';

export default function FinesList({
    adminCondoId,
    adminFilteredProperties = [],
    adminFilteredFines = [],
    finesList = [],
    setFinesList,
    newFineForm,
    setNewFineForm,
    showAddFineForm,
    setShowAddFineForm,
    editingFine,
    setEditingFine
}) {
    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (editingFine) {
            setFinesList(prev => prev.map(f => f.id === editingFine.id ? {
                ...f,
                property_id: Number(newFineForm.property_id),
                amount: Number(newFineForm.amount),
                reason: newFineForm.reason,
                status: newFineForm.status
            } : f));
            setEditingFine(null);
        } else {
            const newF = {
                id: finesList.length > 0 ? Math.max(...finesList.map(f => f.id)) + 1 : 1,
                property_id: Number(newFineForm.property_id),
                amount: Number(newFineForm.amount),
                reason: newFineForm.reason,
                status: newFineForm.status,
                date: new Date().toISOString().split('T')[0],
                condominium_id: adminCondoId
            };
            setFinesList(prev => [newF, ...prev]);
        }
        setShowAddFineForm(false);
        setNewFineForm({ property_id: '', amount: '', reason: '', status: 'pending' });
    };

    return (
        <div className="space-y-6 animate-fade-in text-left">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                        ⚖️ Infracciones y Multas
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Sanciona infracciones al reglamento de copropiedad (ruidos, mascotas, etc.).</p>
                </div>
                <button
                    onClick={() => {
                        setEditingFine(null);
                        setNewFineForm({ property_id: '', amount: '', reason: '', status: 'pending' });
                        setShowAddFineForm(!showAddFineForm);
                    }}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition-all"
                >
                    {showAddFineForm ? 'Cerrar Form' : 'Cursar Multa'}
                </button>
            </div>

            {showAddFineForm && (
                <form onSubmit={handleFormSubmit} className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-4 max-w-xl text-left">
                    <h5 className="text-xs font-bold text-gray-800 dark:text-slate-200 uppercase">{editingFine ? '✏️ Editar Multa' : '⚖️ Detalles de la Multa / Sanción'}</h5>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Propiedad Infractora</label>
                            <select
                                required
                                value={newFineForm.property_id}
                                onChange={(e) => setNewFineForm(prev => ({ ...prev, property_id: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-955 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                            >
                                <option value="">Seleccione Unidad...</option>
                                {adminFilteredProperties.map(p => (
                                    <option key={p.id} value={p.id}>Depto #{p.number}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Monto de la Sanción ($)</label>
                            <input
                                type="number"
                                required
                                value={newFineForm.amount}
                                onChange={(e) => setNewFineForm(prev => ({ ...prev, amount: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-955 border border-gray-300 dark:border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Motivo / Infracción Detallada</label>
                        <textarea
                            required
                            rows="3"
                            value={newFineForm.reason}
                            onChange={(e) => setNewFineForm(prev => ({ ...prev, reason: e.target.value }))}
                            className="w-full bg-white dark:bg-slate-955 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                            placeholder="Describa la infracción (ej. Ruidos molestos, desacato reglamento)..."
                        />
                    </div>
                    <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Estado</label>
                        <select
                            value={newFineForm.status}
                            onChange={(e) => setNewFineForm(prev => ({ ...prev, status: e.target.value }))}
                            className="w-full bg-white dark:bg-slate-955 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                        >
                            <option value="pending">Pendiente de Pago</option>
                            <option value="resolved">Pagada / Resuelta</option>
                            <option value="annulled">Anulada</option>
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow">
                            {editingFine ? 'Guardar Cambios' : 'Cursar Multa'}
                        </button>
                        <button type="button" onClick={() => { setShowAddFineForm(false); setEditingFine(null); }} className="px-4 py-2 bg-gray-200 dark:bg-slate-800 dark:text-white text-gray-700 font-bold text-xs rounded-xl">
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <SimpleTable
                    headers={['Fecha', 'Propiedad', 'Infracción / Motivo', 'Monto', 'Estado', 'Acciones']}
                    rows={adminFilteredFines.map(f => ({
                        cells: [
                            <span key={`date-${f.id}`}>{f.date}</span>,
                            <span className="font-bold" key={`prop-${f.id}`}>Depto #{f.property_id}</span>,
                            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-[320px] truncate" title={f.reason} key={`reason-${f.id}`}>{f.reason}</p>,
                            <span className="font-bold text-rose-500" key={`amt-${f.id}`}>${Number(f.amount).toLocaleString()}</span>,
                            <span key={`status-${f.id}`} className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                f.status === 'resolved'
                                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500'
                                    : f.status === 'annulled'
                                    ? 'bg-slate-500/10 border border-slate-500/20 text-slate-500'
                                    : 'bg-rose-500/10 border border-rose-500/20 text-rose-500'
                            }`}>
                                {f.status === 'pending' ? 'pendiente' : f.status === 'resolved' ? 'resuelta' : 'anulada'}
                            </span>,
                            <div className="flex items-center gap-2 justify-end" key={`act-${f.id}`}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingFine(f);
                                        setNewFineForm({
                                            property_id: String(f.property_id),
                                            amount: String(f.amount),
                                            reason: f.reason,
                                            status: f.status
                                        });
                                        setShowAddFineForm(true);
                                    }}
                                    className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 text-[10px] font-bold rounded-lg transition-all"
                                >
                                    ✏️ Editar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (confirm('¿Desea anular o eliminar esta sanción?')) {
                                            setFinesList(prev => prev.filter(item => item.id !== f.id));
                                        }
                                    }}
                                    className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 text-[10px] font-bold rounded-lg transition-all"
                                >
                                    🗑️ Eliminar
                                </button>
                            </div>
                        ]
                    }))}
                    emptyMessage="No hay multas registradas en esta comunidad"
                />
            </div>
        </div>
    );
}
