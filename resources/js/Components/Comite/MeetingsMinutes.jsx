import { useState } from 'react';
import { SimpleTable, StatusBadge } from '@/Components/DashboardShared';

export default function MeetingsMinutes({ adminCondoId }) {
    const [minutesList, setMinutesList] = useState([
        { id: 1, date: '2026-05-15', title: 'Asamblea General Ordinaria de Copropietarios', quorum: '78.4%', status: 'signed', decisions: 'Aprobación de balance anual, presupuesto 2026 y reelección de administración.' },
        { id: 2, date: '2026-03-22', title: 'Sesión Extraordinaria: Proyecto CCTV', quorum: '62.1%', status: 'signed', decisions: 'Aprobación de cuota extraordinaria de $25.000 para renovación de 16 cámaras.' },
        { id: 3, date: '2026-02-10', title: 'Reunión Ordinaria de Comité', quorum: '100.0%', status: 'signed', decisions: 'Revisión de bitácoras de conserjería e informe de morosidad.' },
        { id: 4, date: '2026-06-10', title: 'Próxima Asamblea General Anual', quorum: 'Pendiente', status: 'pending', decisions: 'Discusión de reglamento interno para mascotas y multas por ruidos.' }
    ]);

    const [showAddForm, setShowAddForm] = useState(false);
    const [newMinute, setNewMinute] = useState({ date: '', title: '', quorum: '', status: 'pending', decisions: '' });

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const minute = {
            id: minutesList.length + 1,
            ...newMinute
        };
        setMinutesList(prev => [minute, ...prev]);
        setShowAddForm(false);
        setNewMinute({ date: '', title: '', quorum: '', status: 'pending', decisions: '' });
    };

    return (
        <div className="space-y-6 animate-fade-in text-left">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                        📄 Historial de Actas y Asambleas
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Controla y publica actas oficiales de decisiones tomadas en asamblea.</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition-all"
                >
                    {showAddForm ? 'Cerrar Form' : 'Subir Acta Firmada'}
                </button>
            </div>

            {showAddForm && (
                <form onSubmit={handleFormSubmit} className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-4 max-w-xl text-left">
                    <h5 className="text-xs font-bold text-gray-800 dark:text-slate-200 uppercase">📄 Registrar Acta de Asamblea</h5>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Título de Asamblea</label>
                            <input
                                type="text"
                                required
                                value={newMinute.title}
                                onChange={(e) => setNewMinute(prev => ({ ...prev, title: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-955 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                placeholder="Ej: Asamblea Ordinaria Mayo"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Fecha</label>
                            <input
                                type="date"
                                required
                                value={newMinute.date}
                                onChange={(e) => setNewMinute(prev => ({ ...prev, date: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-955 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Quorum (%)</label>
                            <input
                                type="text"
                                required
                                value={newMinute.quorum}
                                onChange={(e) => setNewMinute(prev => ({ ...prev, quorum: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-955 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                placeholder="Ej: 75%"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Estado Firma</label>
                            <select
                                value={newMinute.status}
                                onChange={(e) => setNewMinute(prev => ({ ...prev, status: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-955 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                            >
                                <option value="signed">Firmado por Comité</option>
                                <option value="pending">Pendiente de Firma</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Decisiones / Resoluciones Principales</label>
                        <textarea
                            required
                            rows="3"
                            value={newMinute.decisions}
                            onChange={(e) => setNewMinute(prev => ({ ...prev, decisions: e.target.value }))}
                            className="w-full bg-white dark:bg-slate-955 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                            placeholder="Describa los puntos aprobados y resoluciones..."
                        />
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow">
                            Registrar Acta
                        </button>
                        <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-gray-200 dark:bg-slate-800 dark:text-white text-gray-700 font-bold text-xs rounded-xl">
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <SimpleTable
                    headers={['Fecha', 'Asamblea / Reunión', 'Quorum', 'Decisiones Aprobadas', 'Estado', 'Acciones']}
                    rows={minutesList.map(m => ({
                        cells: [
                            <span key={`date-${m.id}`}>{m.date}</span>,
                            <span className="font-bold text-gray-900 dark:text-white" key={`title-${m.id}`}>{m.title}</span>,
                            <span className="font-mono text-xs" key={`quorum-${m.id}`}>{m.quorum}</span>,
                            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-[320px] truncate" title={m.decisions} key={`dec-${m.id}`}>{m.decisions}</p>,
                            <span key={`status-${m.id}`}>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                    m.status === 'signed'
                                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500'
                                        : 'bg-amber-500/10 border border-amber-500/20 text-amber-500'
                                }`}>
                                    {m.status === 'signed' ? 'firmada' : 'pendiente'}
                                </span>
                            </span>,
                            <div className="flex items-center gap-2" key={`act-${m.id}`}>
                                <button
                                    onClick={() => alert(`Descargando acta oficial en PDF: ${m.title}`)}
                                    className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-indigo-200 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-lg transition-all"
                                >
                                    📥 PDF
                                </button>
                            </div>
                        ]
                    }))}
                    emptyMessage="No hay actas registradas"
                />
            </div>
        </div>
    );
}
