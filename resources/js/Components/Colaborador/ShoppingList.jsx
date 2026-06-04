import { useState } from 'react';

export default function ShoppingList({ adminCondoId }) {
    const [items, setItems] = useState([
        { id: 1, name: 'Cloro líquido 5L', category: 'Limpieza', quantity: 3, unit: 'bidones', status: 'pending', priority: 'high', requestedBy: 'Carlos Mota', date: '2026-06-02' },
        { id: 2, name: 'Bolsas de basura 80L (pack 50)', category: 'Limpieza', quantity: 2, unit: 'packs', status: 'purchased', priority: 'medium', requestedBy: 'Felipe Valenzuela', date: '2026-06-01' },
        { id: 3, name: 'Ampolletas LED E27 10W', category: 'Mantenimiento', quantity: 10, unit: 'unidades', status: 'pending', priority: 'medium', requestedBy: 'Andrés Gómez', date: '2026-06-01' },
        { id: 4, name: 'Desinfectante multiuso 2L', category: 'Limpieza', quantity: 5, unit: 'botellas', status: 'pending', priority: 'low', requestedBy: 'Carlos Mota', date: '2026-05-30' },
        { id: 5, name: 'Escoba industrial', category: 'Limpieza', quantity: 2, unit: 'unidades', status: 'purchased', priority: 'low', requestedBy: 'Felipe Valenzuela', date: '2026-05-28' },
        { id: 6, name: 'Lubricante WD-40 400ml', category: 'Mantenimiento', quantity: 3, unit: 'latas', status: 'pending', priority: 'high', requestedBy: 'Andrés Gómez', date: '2026-06-03' },
    ]);

    const [showAddForm, setShowAddForm] = useState(false);
    const [newItem, setNewItem] = useState({ name: '', category: 'Limpieza', quantity: 1, unit: 'unidades', priority: 'medium' });
    const [filterStatus, setFilterStatus] = useState('all');

    const filteredItems = filterStatus === 'all' ? items : items.filter(i => i.status === filterStatus);
    const pendingCount = items.filter(i => i.status === 'pending').length;
    const purchasedCount = items.filter(i => i.status === 'purchased').length;

    const handleSubmit = (e) => {
        e.preventDefault();
        const entry = {
            id: items.length + 1,
            ...newItem,
            status: 'pending',
            requestedBy: 'Conserje Turno',
            date: new Date().toISOString().split('T')[0]
        };
        setItems(prev => [entry, ...prev]);
        setShowAddForm(false);
        setNewItem({ name: '', category: 'Limpieza', quantity: 1, unit: 'unidades', priority: 'medium' });
    };

    const toggleStatus = (id) => {
        setItems(prev => prev.map(item =>
            item.id === id
                ? { ...item, status: item.status === 'pending' ? 'purchased' : 'pending' }
                : item
        ));
    };

    const deleteItem = (id) => {
        if (confirm('¿Eliminar este artículo de la lista?')) {
            setItems(prev => prev.filter(item => item.id !== id));
        }
    };

    const priorityColors = {
        high: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
        medium: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        low: 'bg-slate-500/10 text-slate-500 border-slate-500/20'
    };

    const priorityLabels = { high: 'Urgente', medium: 'Normal', low: 'Bajo' };

    return (
        <div className="space-y-6 animate-fade-in text-left">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                        🛒 Lista de Compras e Insumos
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Gestión de insumos de limpieza, seguridad y mantenimiento del condominio.</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
                >
                    {showAddForm ? 'Cerrar' : '+ Agregar Artículo'}
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-3 text-center shadow-sm">
                    <span className="text-xl font-black text-amber-500">{pendingCount}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mt-0.5">Pendientes</span>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-3 text-center shadow-sm">
                    <span className="text-xl font-black text-emerald-500">{purchasedCount}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mt-0.5">Comprados</span>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl p-3 text-center shadow-sm">
                    <span className="text-xl font-black text-slate-800 dark:text-white">{items.length}</span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mt-0.5">Total</span>
                </div>
            </div>

            {/* Add Form */}
            {showAddForm && (
                <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-4 max-w-xl shadow-sm">
                    <h5 className="text-xs font-bold text-gray-800 dark:text-slate-200 uppercase">🛒 Nuevo Artículo</h5>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Nombre del Artículo</label>
                            <input
                                type="text"
                                required
                                value={newItem.name}
                                onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Ej: Cloro líquido 5L..."
                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Categoría</label>
                            <select
                                value={newItem.category}
                                onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                            >
                                <option value="Limpieza">🧹 Limpieza</option>
                                <option value="Mantenimiento">🔧 Mantenimiento</option>
                                <option value="Seguridad">🔒 Seguridad</option>
                                <option value="Oficina">📎 Oficina</option>
                                <option value="Otro">📦 Otro</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Prioridad</label>
                            <select
                                value={newItem.priority}
                                onChange={(e) => setNewItem(prev => ({ ...prev, priority: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                            >
                                <option value="high">🔴 Urgente</option>
                                <option value="medium">🟡 Normal</option>
                                <option value="low">⚪ Bajo</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Cantidad</label>
                            <input
                                type="number"
                                min="1"
                                value={newItem.quantity}
                                onChange={(e) => setNewItem(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Unidad</label>
                            <input
                                type="text"
                                value={newItem.unit}
                                onChange={(e) => setNewItem(prev => ({ ...prev, unit: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer">
                            Agregar
                        </button>
                        <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-gray-200 dark:bg-slate-800 dark:text-white text-gray-700 font-bold text-xs rounded-xl cursor-pointer">
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            {/* Filter Bar */}
            <div className="flex bg-gray-100 dark:bg-slate-950 p-1 rounded-lg border border-gray-200 dark:border-slate-800 w-fit">
                {[
                    { id: 'all', label: 'Todos' },
                    { id: 'pending', label: '⏳ Pendientes' },
                    { id: 'purchased', label: '✅ Comprados' },
                ].map(f => (
                    <button
                        key={f.id}
                        onClick={() => setFilterStatus(f.id)}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${filterStatus === f.id ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-white shadow' : 'text-slate-500 dark:text-slate-400'}`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Items List */}
            <div className="space-y-2">
                {filteredItems.map(item => (
                    <div
                        key={item.id}
                        className={`bg-white dark:bg-slate-900 border rounded-xl p-4 flex items-center justify-between gap-4 shadow-sm transition-all hover:shadow-md ${
                            item.status === 'purchased'
                                ? 'border-emerald-200 dark:border-emerald-900/50 opacity-70'
                                : 'border-gray-100 dark:border-slate-800'
                        }`}
                    >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            {/* Checkbox */}
                            <button
                                onClick={() => toggleStatus(item.id)}
                                className={`h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                                    item.status === 'purchased'
                                        ? 'bg-emerald-500 border-emerald-500 text-white'
                                        : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'
                                }`}
                            >
                                {item.status === 'purchased' && (
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                    </svg>
                                )}
                            </button>

                            {/* Item Info */}
                            <div className="min-w-0">
                                <span className={`text-xs font-bold block ${item.status === 'purchased' ? 'line-through text-slate-400' : 'text-slate-800 dark:text-white'}`}>
                                    {item.name}
                                </span>
                                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                    <span className="text-[10px] text-slate-400">{item.quantity} {item.unit}</span>
                                    <span className="text-[10px] text-slate-400">•</span>
                                    <span className="text-[10px] text-slate-400">{item.category}</span>
                                    <span className="text-[10px] text-slate-400">•</span>
                                    <span className="text-[10px] text-slate-400">Por: {item.requestedBy}</span>
                                </div>
                            </div>
                        </div>

                        {/* Priority + Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${priorityColors[item.priority]}`}>
                                {priorityLabels[item.priority]}
                            </span>
                            <button
                                onClick={() => deleteItem(item.id)}
                                className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 transition-all cursor-pointer"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}

                {filteredItems.length === 0 && (
                    <div className="text-center py-12">
                        <span className="text-4xl block mb-2">🛒</span>
                        <span className="text-xs text-slate-400 font-bold">No hay artículos en esta categoría</span>
                    </div>
                )}
            </div>
        </div>
    );
}
