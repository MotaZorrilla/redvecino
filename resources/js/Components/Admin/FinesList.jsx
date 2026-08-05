import { useState, useMemo } from 'react';
import { SimpleTable } from '@/Components/DashboardShared';

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
    const [isSubmitting, setIsSubmitting] = useState(false);

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

        return {
            totalResolved: resolved,
            totalPending: pending,
            totalAnnulled: annulled,
            totalGross: resolved + pending + annulled,
            countResolved,
            countPending,
            countAnnulled,
            countTotal: baseFines.length
        };
    }, [baseFines]);

    // Filtered & Sorted List
    const filteredFines = useMemo(() => {
        let list = [...baseFines];

        // 1. Status Filter
        if (statusFilter !== 'all') {
            list = list.filter(f => f.status === statusFilter);
        }

        // 2. Search Query (property number or reason)
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            list = list.filter(f => 
                String(f.property_id).toLowerCase().includes(q) ||
                String(f.reason).toLowerCase().includes(q)
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
        setIsSubmitting(false);
    };

    return (
        <div className="space-y-6 animate-fade-in text-left max-w-full overflow-hidden">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 max-w-full">
                <div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <span>⚖️</span> Infracciones, Multas y Sanciones
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Control disciplinario del Reglamento de Copropiedad (ruidos, mascotas, estacionamientos, etc.).
                    </p>
                </div>
                <button
                    onClick={() => {
                        setEditingFine(null);
                        setNewFineForm({ property_id: '', amount: '', reason: '', status: 'pending' });
                        setShowAddFineForm(!showAddFineForm);
                    }}
                    className="px-4 py-2 bg-brand-teal hover:bg-brand-teal-light text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                    <span>{showAddFineForm ? '✖️' : '➕'}</span>
                    <span>{showAddFineForm ? 'Cerrar Formulario' : 'Cursar Nueva Multa'}</span>
                </button>
            </div>

            {/* Header KPI Summary Badges / Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-full">
                {/* Cobrado / Resuelto */}
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-emerald-500/20 shadow-xs space-y-1 min-w-0">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider gap-1">
                        <span className="truncate">Cobrado / Resuelto</span>
                        <span className="text-emerald-500 font-extrabold shrink-0">{stats.countResolved}</span>
                    </div>
                    <p className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400 truncate">
                        ${stats.totalResolved.toLocaleString('es-CL')}
                    </p>
                    <span className="text-[10px] text-emerald-600/70 font-semibold block truncate">Ingresado a Diario</span>
                </div>

                {/* Por Cobrar / Pendiente */}
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-rose-500/20 shadow-xs space-y-1 min-w-0">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider gap-1">
                        <span className="truncate">Por Cobrar</span>
                        <span className="text-rose-500 font-extrabold shrink-0">{stats.countPending}</span>
                    </div>
                    <p className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400 truncate">
                        ${stats.totalPending.toLocaleString('es-CL')}
                    </p>
                    <span className="text-[10px] text-rose-600/70 font-semibold block truncate">Cuentas activas</span>
                </div>

                {/* Anuladas */}
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1 min-w-0">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider gap-1">
                        <span className="truncate">Anuladas</span>
                        <span className="text-slate-500 font-extrabold shrink-0">{stats.countAnnulled}</span>
                    </div>
                    <p className="text-base sm:text-lg font-black text-slate-600 dark:text-slate-400 truncate">
                        ${stats.totalAnnulled.toLocaleString('es-CL')}
                    </p>
                    <span className="text-[10px] text-slate-400 font-semibold block truncate">Sin impacto</span>
                </div>

                {/* Total Cursado */}
                <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-indigo-500/20 shadow-xs space-y-1 min-w-0">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider gap-1">
                        <span className="truncate">Total Cursado</span>
                        <span className="text-indigo-500 font-extrabold shrink-0">{stats.countTotal}</span>
                    </div>
                    <p className="text-base sm:text-lg font-black text-indigo-600 dark:text-indigo-400 truncate">
                        ${stats.totalGross.toLocaleString('es-CL')}
                    </p>
                    <span className="text-[10px] text-indigo-500/70 font-semibold block truncate">Monto histórico</span>
                </div>
            </div>

            {/* Add / Edit Form */}
            {showAddFineForm && (
                <form onSubmit={handleFormSubmit} className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-4 max-w-xl text-left shadow-md">
                    <h5 className="text-xs font-bold text-gray-800 dark:text-slate-200 uppercase flex items-center gap-2">
                        <span>{editingFine ? '✏️' : '⚖️'}</span>
                        <span>{editingFine ? 'Editar Multa Cursada' : 'Detalles de la Nueva Multa / Sanción'}</span>
                    </h5>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="fine-property" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Propiedad Infractora</label>
                            <select
                                id="fine-property"
                                required
                                value={newFineForm.property_id}
                                onChange={(e) => setNewFineForm(prev => ({ ...prev, property_id: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                            >
                                <option value="">Seleccione Unidad...</option>
                                {adminFilteredProperties.map(p => (
                                    <option key={p.id} value={p.id}>Depto #{p.number}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="fine-amount" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Monto Sanción ($)</label>
                            <input
                                id="fine-amount"
                                type="number"
                                required
                                value={newFineForm.amount}
                                onChange={(e) => setNewFineForm(prev => ({ ...prev, amount: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="fine-reason" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Motivo / Artículo Infringido</label>
                        <input
                            id="fine-reason"
                            type="text"
                            required
                            placeholder="Ej: Ruidos molestos en horario nocturno (Art. 14 del Reglamento)"
                            value={newFineForm.reason}
                            onChange={(e) => setNewFineForm(prev => ({ ...prev, reason: e.target.value }))}
                            className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="fine-status" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Estado de la Sanción</label>
                        <select
                            id="fine-status"
                            value={newFineForm.status}
                            onChange={(e) => setNewFineForm(prev => ({ ...prev, status: e.target.value }))}
                            className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                        >
                            <option value="pending">⏳ Pendiente de Pago</option>
                            <option value="resolved">✅ Resuelta / Cobrada (Alimenta Libro Diario)</option>
                            <option value="annulled">🚫 Anulada tras Descargo</option>
                        </select>
                    </div>
                    <div className="flex gap-2 pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-brand-teal text-white text-xs font-bold rounded-xl hover:bg-brand-teal-light transition-all"
                        >
                            {editingFine ? 'Guardar Cambios' : 'Registrar Sanción'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowAddFineForm(false)}
                            className="px-4 py-2 border border-gray-300 text-gray-500 text-xs font-bold rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            {/* Advanced Interactive Control Toolbar (Grid Responsivo sin desbordamiento) */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-xs space-y-3 max-w-full overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3 w-full items-center">
                    {/* Search Input */}
                    <div className="relative md:col-span-1 lg:col-span-2 min-w-0">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
                            🔍
                        </span>
                        <input
                            type="text"
                            placeholder="Buscar por depto o motivo..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:border-brand-teal"
                        />
                    </div>

                    {/* Status Filter Dropdown */}
                    <div className="flex items-center gap-1.5 min-w-0">
                        <label htmlFor="fine-status-filter" className="text-[11px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap shrink-0">
                            Estado:
                        </label>
                        <select
                            id="fine-status-filter"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full min-w-0 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-xs px-2.5 py-2 rounded-xl focus:outline-none truncate"
                        >
                            <option value="all">Todos ({stats.countTotal})</option>
                            <option value="pending">⏳ Pendientes ({stats.countPending})</option>
                            <option value="resolved">✅ Resueltas ({stats.countResolved})</option>
                            <option value="annulled">🚫 Anuladas ({stats.countAnnulled})</option>
                        </select>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-1.5 min-w-0">
                        <label htmlFor="fine-sort-by" className="text-[11px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap shrink-0">
                            Orden:
                        </label>
                        <select
                            id="fine-sort-by"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full min-w-0 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white text-xs px-2.5 py-2 rounded-xl focus:outline-none truncate"
                        >
                            <option value="date_desc">📅 Recientes</option>
                            <option value="date_asc">📅 Antiguas</option>
                            <option value="amount_desc">💰 Mayor monto</option>
                            <option value="amount_asc">💰 Menor monto</option>
                        </select>
                    </div>
                </div>

                {/* Secondary Row: Date Range & Clear Filters */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/60 max-w-full">
                    <div className="flex items-center gap-2 text-xs flex-wrap max-w-full">
                        <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 shrink-0">📅 Fechas:</span>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs px-2 py-1 text-slate-800 dark:text-white"
                        />
                        <span className="text-slate-400 shrink-0">a</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-xs px-2 py-1 text-slate-800 dark:text-white"
                        />
                    </div>

                    {(statusFilter !== 'all' || searchQuery || startDate || endDate || sortBy !== 'date_desc') && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 font-bold text-xs rounded-xl transition-all flex items-center gap-1 shrink-0"
                        >
                            <span>Limpiar Filtros ×</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Table Results */}
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm max-w-full">
                <SimpleTable
                    headers={['Fecha', 'Propiedad', 'Infracción / Motivo', 'Monto', 'Estado', 'Acciones']}
                    rows={filteredFines.map(f => ({
                        cells: [
                            <span key={`date-${f.id}`} className="font-mono text-xs">{f.date}</span>,
                            <span className="font-extrabold text-slate-900 dark:text-white" key={`prop-${f.id}`}>Depto #{f.property_id}</span>,
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
                                    type="button"
                                    title="Editar sanción"
                                    aria-label="Editar sanción"
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
                                    className="px-2 py-1 sm:px-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 text-xs font-bold rounded-lg transition-all shadow-xs hover:scale-105 active:scale-95 flex items-center gap-1"
                                >
                                    <span>✏️</span>
                                    <span className="hidden sm:inline">Editar</span>
                                </button>
                                <button
                                    type="button"
                                    title="Borrar sanción"
                                    aria-label="Borrar sanción"
                                    onClick={() => {
                                        if (confirm('¿Desea anular o eliminar esta sanción?')) {
                                            setFinesList(prev => prev.filter(item => item.id !== f.id));
                                        }
                                    }}
                                    className="px-2 py-1 sm:px-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 text-xs font-bold rounded-lg transition-all shadow-xs hover:scale-105 active:scale-95 flex items-center gap-1"
                                >
                                    <span>🗑️</span>
                                    <span className="hidden sm:inline">Borrar</span>
                                </button>
                            </div>
                        ]
                    }))}
                    emptyMessage="No hay multas que coincidan con los filtros seleccionados"
                />
            </div>
        </div>
    );
}
