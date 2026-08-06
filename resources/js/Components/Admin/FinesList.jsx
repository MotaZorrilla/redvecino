import { useState, useMemo } from 'react';
import { SimpleTable } from '@/Components/DashboardShared';
import UnitDetailModal360 from '@/Components/Admin/UnitDetailModal360';

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
    setEditingFine,
    activeCondoName = 'Condominio Alameda'
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [inspectingUnit360, setInspectingUnit360] = useState(null);
    const [isBannerDismissed, setIsBannerDismissed] = useState(false);

    // Advanced Filter & Sort States
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sortBy, setSortBy] = useState('date_desc');

    // Base list for current condominium
    const baseFines = useMemo(() => {
        return adminFilteredFines.length > 0 
            ? adminFilteredFines 
            : finesList.filter(f => !adminCondoId || f.condominium_id === Number(adminCondoId));
    }, [adminFilteredFines, finesList, adminCondoId]);

    // KPI Aggregates
    const stats = useMemo(() => {
        const resolved = baseFines.filter(f => f.status === 'resolved').reduce((acc, f) => acc + Number(f.amount), 0);
        const pending = baseFines.filter(f => f.status === 'pending').reduce((acc, f) => acc + Number(f.amount), 0);
        const annulled = baseFines.filter(f => f.status === 'annulled').reduce((acc, f) => acc + Number(f.amount), 0);
        const countResolved = baseFines.filter(f => f.status === 'resolved').length;
        const countPending = baseFines.filter(f => f.status === 'pending').length;
        const countAnnulled = baseFines.filter(f => f.status === 'annulled').length;

        return { resolved, pending, annulled, countResolved, countPending, countAnnulled };
    }, [baseFines]);

    // Filter & Sort Pipeline
    const filteredFines = useMemo(() => {
        let list = [...baseFines];

        // 1. Status Filter
        if (statusFilter !== 'all') {
            list = list.filter(f => f.status === statusFilter);
        }

        // 2. Search Query (Motivo o ID de Propiedad)
        if (searchQuery.trim() !== '') {
            const q = searchQuery.toLowerCase();
            list = list.filter(f => 
                f.reason.toLowerCase().includes(q) || 
                String(f.property_id).includes(q)
            );
        }

        // 3. Date Range Filter
        if (startDate) {
            list = list.filter(f => f.date >= startDate);
        }
        if (endDate) {
            list = list.filter(f => f.date <= endDate);
        }

        // 4. Sorting
        return list.sort((a, b) => {
            if (sortBy === 'date_desc') return b.date.localeCompare(a.date);
            if (sortBy === 'date_asc') return a.date.localeCompare(b.date);
            if (sortBy === 'amount_desc') return Number(b.amount) - Number(a.amount);
            if (sortBy === 'amount_asc') return Number(a.amount) - Number(b.amount);
            return 0;
        });
    }, [baseFines, statusFilter, searchQuery, startDate, endDate, sortBy]);

    const clearFilters = () => {
        setStatusFilter('all');
        setSearchQuery('');
        setStartDate('');
        setEndDate('');
        setSortBy('date_desc');
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
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
                condominium_id: Number(adminCondoId || 1),
                property_id: Number(newFineForm.property_id),
                amount: Number(newFineForm.amount),
                reason: newFineForm.reason,
                status: newFineForm.status,
                date: new Date().toISOString().split('T')[0]
            };
            setFinesList(prev => [newF, ...prev]);
        }
        setShowAddFineForm(false);
        setNewFineForm({ property_id: '', amount: '', reason: '', status: 'pending' });
        setIsSubmitting(false);
    };

    return (
        <div className="space-y-6 animate-fade-in text-left max-w-full overflow-hidden font-outfit">
            {/* Banner de Cabecera Generoso Colapsable del Módulo de Multas */}
            {!isBannerDismissed ? (
                <div className="bg-gradient-to-r from-indigo-50/80 via-white to-slate-50 dark:from-indigo-950/60 dark:via-slate-900 dark:to-slate-950 border border-indigo-200/80 dark:border-indigo-900/40 rounded-2xl p-6 relative overflow-hidden shadow-xs">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                        <div className="space-y-1 max-w-3xl">
                            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                                ⚖️ Fiscalización & Reglamento Interno
                            </span>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                Multas, Infracciones & Control Disciplinario
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                Registro y fiscalización del cumplimiento del Reglamento de Copropiedad de {activeCondoName}. Administre sanciones por ruidos molestos, mal uso de áreas comunes o estacionamientos, gestione descargos y sincronice los cobros directamente en la boleta de Gastos Comunes.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsBannerDismissed(true)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shrink-0 self-start md:self-center"
                            title="Minimizar cabecera informativa"
                        >
                            <span>✕ Minimizar</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex justify-start">
                    <button
                        type="button"
                        onClick={() => setIsBannerDismissed(false)}
                        className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800/60"
                    >
                        <span>ℹ️ Mostrar guía de Multas & Infracciones</span>
                        <span>▼</span>
                    </button>
                </div>
            )}

            {/* Modal / Formulario de Nueva Multa */}
            {showAddFineForm && (
                <form onSubmit={handleFormSubmit} className="bg-white dark:bg-slate-900 border border-brand-teal/30 p-6 rounded-2xl space-y-4 shadow-lg animate-fade-in">
                    <h5 className="font-extrabold text-sm text-slate-800 dark:text-white flex items-center gap-2">
                        <span>{editingFine ? '✏️' : '⚖️'}</span>
                        <span>{editingFine ? `Editar Multa #${editingFine.id}` : 'Cursar Nueva Infracción'}</span>
                    </h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div>
                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Unidad / Departamento</label>
                            <select
                                required
                                value={newFineForm.property_id}
                                onChange={(e) => setNewFineForm(prev => ({ ...prev, property_id: e.target.value }))}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-bold text-slate-900 dark:text-white"
                            >
                                <option value="">-- Seleccionar Unidad --</option>
                                {adminFilteredProperties.map(p => (
                                    <option key={p.id} value={p.id}>Depto #{p.number} ({p.block || 'Torre A'})</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Monto ($ CLP)</label>
                            <input
                                type="number"
                                required
                                min="1000"
                                placeholder="Ej: 50000"
                                value={newFineForm.amount}
                                onChange={(e) => setNewFineForm(prev => ({ ...prev, amount: e.target.value }))}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-bold text-slate-900 dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Estado Infracción</label>
                            <select
                                value={newFineForm.status}
                                onChange={(e) => setNewFineForm(prev => ({ ...prev, status: e.target.value }))}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-bold text-slate-900 dark:text-white"
                            >
                                <option value="pending">⏳ Pendiente</option>
                                <option value="resolved">✅ Resuelta / Cobrada</option>
                                <option value="annulled">🚫 Anulada</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Motivo / Reglamento Infrigido</label>
                        <textarea
                            required
                            rows="2"
                            placeholder="Ej: Ruidos molestos en horario de descanso (Art. 14 del Reglamento)..."
                            value={newFineForm.reason}
                            onChange={(e) => setNewFineForm(prev => ({ ...prev, reason: e.target.value }))}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 font-medium text-slate-900 dark:text-white"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setShowAddFineForm(false)}
                            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow"
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar Multa'}
                        </button>
                    </div>
                </form>
            )}

            {/* Filter Toolbar & KPIs a Ancho Completo Homologado */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-4 shadow-xs w-full">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                        type="button"
                        onClick={() => setStatusFilter(statusFilter === 'pending' ? 'all' : 'pending')}
                        className={`p-3 rounded-xl border text-left transition-all ${statusFilter === 'pending' ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10' : 'border-slate-200 dark:border-slate-800'}`}
                    >
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Multas Pendientes</span>
                        <div className="text-lg font-black text-amber-600 dark:text-amber-400">
                            ${stats.pending.toLocaleString('es-CL')} <span className="text-xs text-slate-400">({stats.countPending})</span>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => setStatusFilter(statusFilter === 'resolved' ? 'all' : 'resolved')}
                        className={`p-3 rounded-xl border text-left transition-all ${statusFilter === 'resolved' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' : 'border-slate-200 dark:border-slate-800'}`}
                    >
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Multas Recaudadas</span>
                        <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                            ${stats.resolved.toLocaleString('es-CL')} <span className="text-xs text-slate-400">({stats.countResolved})</span>
                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => setStatusFilter(statusFilter === 'annulled' ? 'all' : 'annulled')}
                        className={`p-3 rounded-xl border text-left transition-all ${statusFilter === 'annulled' ? 'border-slate-500 bg-slate-100 dark:bg-slate-800/40' : 'border-slate-200 dark:border-slate-800'}`}
                    >
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Multas Anuladas</span>
                        <div className="text-lg font-black text-slate-500 dark:text-slate-400">
                            ${stats.annulled.toLocaleString('es-CL')} <span className="text-xs text-slate-400">({stats.countAnnulled})</span>
                        </div>
                    </button>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 w-full">
                    <div className="flex items-center gap-2 flex-wrap flex-1">
                        <div className="relative flex-1 min-w-[200px]">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400 text-xs">🔍</span>
                            <input
                                type="text"
                                placeholder="Buscar motivo, depto..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs pl-8 pr-3 py-2 text-slate-800 dark:text-white"
                            />
                        </div>

                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white"
                        />
                        <span className="text-xs text-slate-400">a</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        {(statusFilter !== 'all' || searchQuery || startDate || endDate || sortBy !== 'date_desc') && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 font-bold text-xs rounded-xl transition-all flex items-center gap-1 shrink-0"
                            >
                                <span>Limpiar Filtros ×</span>
                            </button>
                        )}

                        <button
                            onClick={() => {
                                setEditingFine(null);
                                setNewFineForm({ property_id: '', amount: '', reason: '', status: 'pending' });
                                setShowAddFineForm(!showAddFineForm);
                            }}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer shrink-0"
                        >
                            <span>{showAddFineForm ? '✖️' : '➕'}</span>
                            <span>{showAddFineForm ? 'Cerrar Form' : 'Cursar Nueva Multa'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Results con Unidades Clickeables */}
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm max-w-full">
                <SimpleTable
                    headers={['Fecha', 'Propiedad', 'Infracción / Motivo', 'Monto', 'Estado', 'Acciones']}
                    rows={filteredFines.map(f => ({
                        cells: [
                            <span key={`date-${f.id}`} className="font-mono text-xs">{f.date}</span>,
                            <button
                                key={`prop-${f.id}`}
                                type="button"
                                onClick={() => setInspectingUnit360({ number: f.property_id, id: f.property_id })}
                                className="font-black text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                                title="Ver Ficha Técnica 360°"
                            >
                                <span>🏢 Depto #{f.property_id}</span>
                            </button>,
                            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-[320px] truncate" title={f.reason} key={`reason-${f.id}`}>{f.reason}</p>,
                            <span className="font-extrabold text-rose-600 dark:text-rose-400 font-mono text-xs" key={`amt-${f.id}`}>${Number(f.amount).toLocaleString('es-CL')}</span>,
                            <span key={`status-${f.id}`} className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 w-fit ${
                                f.status === 'resolved'
                                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                    : f.status === 'annulled'
                                    ? 'bg-slate-500/10 border border-slate-500/20 text-slate-500'
                                    : 'bg-rose-500/10 border border-rose-500/20 text-rose-500'
                            }`}>
                                <span>{f.status === 'resolved' ? '✅' : f.status === 'annulled' ? '🚫' : '⏳'}</span>
                                <span>{f.status === 'pending' ? 'pendiente' : f.status === 'resolved' ? 'resuelta' : 'anulada'}</span>
                            </span>,
                            <div className="flex items-center justify-center gap-1.5" key={`act-${f.id}`}>
                                <button
                                    onClick={() => {
                                        setEditingFine(f);
                                        setNewFineForm({ property_id: String(f.property_id), amount: String(f.amount), reason: f.reason, status: f.status });
                                        setShowAddFineForm(true);
                                    }}
                                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 font-bold text-xs"
                                    title="Editar Multa"
                                >
                                    ✏️
                                </button>
                                {f.status !== 'resolved' && (
                                    <button
                                        onClick={() => {
                                            setFinesList(prev => prev.map(item => item.id === f.id ? { ...item, status: 'resolved' } : item));
                                        }}
                                        className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 font-bold text-xs"
                                        title="Marcar como Resuelta"
                                    >
                                        ✅
                                    </button>
                                )}
                            </div>
                        ]
                    }))}
                />
            </div>

            {/* Modal de Ficha Técnica 360° Interconectada */}
            <UnitDetailModal360
                inspectingUnit={inspectingUnit360}
                onClose={() => setInspectingUnit360(null)}
                allProperties={adminFilteredProperties}
                allFines={baseFines}
                activeCondoName={activeCondoName}
            />
        </div>
    );
}
