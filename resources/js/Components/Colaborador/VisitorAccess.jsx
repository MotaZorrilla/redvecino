import { useState } from 'react';
import { SimpleTable, StatusBadge } from '@/Components/DashboardShared';

export default function VisitorAccess({ adminCondoId }) {
    const [visitors, setVisitors] = useState([
        { id: 1, name: 'Juan Carlos Pérez', rut: '15.654.321-K', dest: 'Depto 202', plate: 'AB-CD-12', entryTime: '17:35', exitTime: '', status: 'active' },
        { id: 2, name: 'María Ignacia Silva', rut: '18.992.341-3', dest: 'Depto 101', plate: 'Ninguno', entryTime: '14:20', exitTime: '16:05', status: 'completed' },
        { id: 3, name: 'Repartidor PedidosYa (Felipe)', rut: '24.221.849-0', dest: 'Depto 304', plate: 'Moto 998', entryTime: '18:10', exitTime: '', status: 'active' }
    ]);

    const [showAddForm, setShowAddForm] = useState(false);
    const [newVisitor, setNewVisitor] = useState({ name: '', rut: '', dest: 'Depto 202', plate: '', entryTime: '' });

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const entry = newVisitor.entryTime || new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
        const v = {
            id: visitors.length + 1,
            name: newVisitor.name,
            rut: newVisitor.rut,
            dest: newVisitor.dest,
            plate: newVisitor.plate || 'Ninguno',
            entryTime: entry,
            exitTime: '',
            status: 'active'
        };
        setVisitors(prev => [v, ...prev]);
        setShowAddForm(false);
        setNewVisitor({ name: '', rut: '', dest: 'Depto 202', plate: '', entryTime: '' });
    };

    return (
        <div className="space-y-6 animate-fade-in text-left">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                        👮 Control de Accesos y Visitas
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Controla y autoriza el ingreso de personas ajenas al condominio.</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition-all"
                >
                    {showAddForm ? 'Cerrar Form' : 'Registrar Ingreso'}
                </button>
            </div>

            {showAddForm && (
                <form onSubmit={handleFormSubmit} className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-4 max-w-xl text-left">
                    <h5 className="text-xs font-bold text-gray-800 dark:text-slate-200 uppercase">👮 Registrar Visita</h5>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Nombre Completo</label>
                            <input
                                type="text"
                                required
                                value={newVisitor.name}
                                onChange={(e) => setNewVisitor(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">RUT / Identificación</label>
                            <input
                                type="text"
                                required
                                value={newVisitor.rut}
                                onChange={(e) => setNewVisitor(prev => ({ ...prev, rut: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Unidad Destino</label>
                            <select
                                value={newVisitor.dest}
                                onChange={(e) => setNewVisitor(prev => ({ ...prev, dest: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                            >
                                <option value="Depto 202">Depto 202</option>
                                <option value="Depto 101">Depto 101</option>
                                <option value="Depto 304">Depto 304</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Patente (Opcional)</label>
                            <input
                                type="text"
                                value={newVisitor.plate}
                                onChange={(e) => setNewVisitor(prev => ({ ...prev, plate: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                placeholder="AB-CD-12"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Hora Ingreso</label>
                            <input
                                type="text"
                                value={newVisitor.entryTime}
                                onChange={(e) => setNewVisitor(prev => ({ ...prev, entryTime: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                placeholder="E.g., 18:30"
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow">
                            Registrar Ingreso
                        </button>
                        <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-gray-200 dark:bg-slate-800 dark:text-white text-gray-700 font-bold text-xs rounded-xl">
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <SimpleTable
                    headers={['Nombre Visita', 'RUT', 'Unidad Destino', 'Patente Vehículo', 'Hora Ingreso', 'Hora Salida', 'Estado', 'Acción']}
                    rows={visitors.map(v => ({
                        cells: [
                            <span className="font-bold text-gray-900 dark:text-white" key={`name-${v.id}`}>{v.name}</span>,
                            <span className="font-mono text-xs" key={`rut-${v.id}`}>{v.rut}</span>,
                            <span className="font-bold" key={`dest-${v.id}`}>{v.dest}</span>,
                            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xs" key={`plate-${v.id}`}>{v.plate}</span>,
                            <span key={`entry-${v.id}`}>{v.entryTime}</span>,
                            <span key={`exit-${v.id}`}>{v.exitTime || '—'}</span>,
                            <span key={`status-${v.id}`}>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                    v.status === 'active'
                                        ? 'bg-amber-500/10 border border-amber-500/20 text-amber-500'
                                        : 'bg-slate-500/10 border border-slate-500/20 text-slate-500'
                                }`}>
                                    {v.status === 'active' ? 'dentro' : 'salida'}
                                </span>
                            </span>,
                            <div className="flex items-center gap-2" key={`act-${v.id}`}>
                                {v.status === 'active' && (
                                    <button
                                        onClick={() => {
                                            const timeNow = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
                                            setVisitors(prev => prev.map(item => item.id === v.id ? { ...item, status: 'completed', exitTime: timeNow } : item));
                                        }}
                                        className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 text-[10px] font-bold rounded-lg transition-all"
                                    >
                                        Marcar Salida
                                    </button>
                                )}
                            </div>
                        ]
                    }))}
                    emptyMessage="No hay registros de visitas de hoy"
                />
            </div>
        </div>
    );
}
