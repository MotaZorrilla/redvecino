import { useState } from 'react';
import { SimpleTable } from '@/Components/DashboardShared';

export default function ShiftLogs({ adminCondoId }) {
    const [shifts, setShifts] = useState([
        { id: 1, date: '2026-06-02', conserje: 'Felipe Valenzuela', shift: 'Tarde (14:00 - 22:00)', notes: 'Todo tranquilo. Se entregaron 3 paquetes de Starken. Recibido cambio de turno de Carlos.' },
        { id: 2, date: '2026-06-02', conserje: 'Carlos Mota', shift: 'Mañana (06:00 - 14:00)', notes: 'Se realiza aseo de entrada principal. Se registra mantención de ascensor Torre B (11:00 a 13:00).' },
        { id: 3, date: '2026-06-01', conserje: 'Andrés Gómez', shift: 'Noche (22:00 - 06:00)', notes: 'Ronda perimetral sin novedades. Portón vehicular funciona correctamente.' }
    ]);

    const [showAddForm, setShowAddForm] = useState(false);
    const [newLog, setNewLog] = useState({ conserje: 'Felipe Valenzuela', shift: 'Tarde (14:00 - 22:00)', notes: '' });

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const entry = {
            id: shifts.length + 1,
            date: new Date().toISOString().split('T')[0],
            conserje: newLog.conserje,
            shift: newLog.shift,
            notes: newLog.notes
        };
        setShifts(prev => [entry, ...prev]);
        setShowAddForm(false);
        setNewLog(prev => ({ ...prev, notes: '' }));
    };

    return (
        <div className="space-y-6 animate-fade-in text-left">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                        📝 Bitácora de Turnos y Novedades
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Bitácora oficial de relevo de turnos e incidencias diarias.</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition-all"
                >
                    {showAddForm ? 'Cerrar Form' : 'Nueva Entrada'}
                </button>
            </div>

            {showAddForm && (
                <form onSubmit={handleFormSubmit} className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-4 max-w-xl text-left">
                    <h5 className="text-xs font-bold text-gray-800 dark:text-slate-200 uppercase">📝 Añadir Entrada a Bitácora</h5>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Nombre del Conserje</label>
                            <input
                                type="text"
                                required
                                value={newLog.conserje}
                                onChange={(e) => setNewLog(prev => ({ ...prev, conserje: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-955 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Horario del Turno</label>
                            <select
                                value={newLog.shift}
                                onChange={(e) => setNewLog(prev => ({ ...prev, shift: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-955 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                            >
                                <option value="Mañana (06:00 - 14:00)">Mañana (06:00 - 14:00)</option>
                                <option value="Tarde (14:00 - 22:00)">Tarde (14:00 - 22:00)</option>
                                <option value="Noche (22:00 - 06:00)">Noche (22:00 - 06:00)</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Novedades / Notas del Turno</label>
                        <textarea
                            required
                            rows="4"
                            value={newLog.notes}
                            onChange={(e) => setNewLog(prev => ({ ...prev, notes: e.target.value }))}
                            className="w-full bg-white dark:bg-slate-955 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                            placeholder="Ej: Mantenciones, reclamos de ruidos, entrega de correspondencia especial..."
                        />
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow">
                            Guardar Nota
                        </button>
                        <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-gray-200 dark:bg-slate-800 dark:text-white text-gray-700 font-bold text-xs rounded-xl">
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <SimpleTable
                    headers={['Fecha', 'Conserje Responsable', 'Turno', 'Novedades y Registro de Bitácora']}
                    rows={shifts.map(s => ({
                        cells: [
                            <span key={`date-${s.id}`}>{s.date}</span>,
                            <span className="font-bold text-gray-900 dark:text-white" key={`conserje-${s.id}`}>{s.conserje}</span>,
                            <span className="text-xs" key={`shift-${s.id}`}>{s.shift}</span>,
                            <p className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap text-left" key={`notes-${s.id}`}>{s.notes}</p>
                        ]
                    }))}
                    emptyMessage="No hay novedades registradas en la bitácora"
                />
            </div>
        </div>
    );
}
