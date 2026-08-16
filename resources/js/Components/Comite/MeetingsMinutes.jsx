import { useState, useEffect } from 'react';
import { SimpleTable } from '@/Components/DashboardShared';
import axios from 'axios';
import { toast } from '@/utils/notify';
import { Vote, FileText, Plus, CheckCircle2, AlertCircle, Percent, Users } from 'lucide-react';

export default function MeetingsMinutes({ adminCondoId, minutes: initialMinutes }) {
    const [subTab, setSubTab] = useState('votings'); // 'votings' | 'minutes'
    const [minutesList, setMinutesList] = useState(initialMinutes || []);
    const [votingsList, setVotingsList] = useState([]);
    const [loadingVotings, setLoadingVotings] = useState(false);

    // Formulario de nueva votación
    const [showAddVotingForm, setShowAddVotingForm] = useState(false);
    const [newVoting, setNewVoting] = useState({
        title: '',
        description: '',
        quorum_required_percent: 50.0,
        options: [
            { title: 'Aprobar Propuesta', description: '' },
            { title: 'Rechazar Propuesta', description: '' },
        ],
    });

    // Formulario de acta manual
    const [showAddForm, setShowAddForm] = useState(false);
    const [newMinute, setNewMinute] = useState({ date: '', title: '', quorum: '', status: 'pending', decisions: '' });

    const fetchVotings = async () => {
        setLoadingVotings(true);
        try {
            const res = await axios.get(`/api/assembly-votings?condominium_id=${adminCondoId || 1}`);
            setVotingsList(res.data || []);
        } catch (err) {
            console.error('Error cargando votaciones:', err);
        } finally {
            setLoadingVotings(false);
        }
    };

    useEffect(() => {
        fetchVotings();
    }, [adminCondoId]);

    const handleCreateVoting = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/assembly-votings', {
                condominium_id: adminCondoId || 1,
                ...newVoting,
            });
            toast('Votación formal de asamblea creada con éxito conforme a Ley 21.442', 'success');
            setShowAddVotingForm(false);
            setNewVoting({
                title: '',
                description: '',
                quorum_required_percent: 50.0,
                options: [
                    { title: 'Aprobar Propuesta', description: '' },
                    { title: 'Rechazar Propuesta', description: '' },
                ],
            });
            fetchVotings();
        } catch (err) {
            toast(err.response?.data?.message || 'Error al crear votación', 'error');
        }
    };

    const handleCloseVoting = async (votingId) => {
        if (!confirm('¿Desea cerrar formalmente esta votación y consolidar el acta final?')) return;
        try {
            await axios.put(`/api/assembly-votings/${votingId}/close`);
            toast('Votación cerrada y acta consolidada', 'success');
            fetchVotings();
        } catch (err) {
            toast('Error al cerrar votación', 'error');
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const minute = {
            id: minutesList.length + 1,
            ...newMinute,
        };
        setMinutesList(prev => [minute, ...prev]);
        setShowAddForm(false);
        setNewMinute({ date: '', title: '', quorum: '', status: 'pending', decisions: '' });
        toast('Acta registrada con éxito', 'success');
    };

    return (
        <div className="space-y-6 animate-fade-in text-left">
            {/* Header y Sub-Pestañas */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <span>🏛️ Asambleas, Votaciones & Actas Oficiales</span>
                        <span className="text-[10px] font-mono text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/60 px-2 py-0.5 rounded-md">
                            Ley 21.442
                        </span>
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                        Gestión de votaciones con ponderación de alícuota por unidad (Art. 15) y archivo digital de actas.
                    </p>
                </div>

                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl">
                    <button
                        type="button"
                        onClick={() => setSubTab('votings')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            subTab === 'votings'
                                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                    >
                        <Vote className="w-3.5 h-3.5" />
                        <span>Votaciones de Ley</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setSubTab('minutes')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            subTab === 'minutes'
                                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                    >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Libro de Actas</span>
                    </button>
                </div>
            </div>

            {/* A. SECCIÓN DE VOTACIONES POR UNIDAD */}
            {subTab === 'votings' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Votaciones en Curso & Históricas
                        </span>
                        <button
                            type="button"
                            onClick={() => setShowAddVotingForm(!showAddVotingForm)}
                            className="px-3.5 py-1.5 bg-brand-teal hover:bg-brand-teal-light text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>{showAddVotingForm ? 'Cerrar Form' : 'Nueva Votación'}</span>
                        </button>
                    </div>

                    {showAddVotingForm && (
                        <form onSubmit={handleCreateVoting} className="bg-slate-50 dark:bg-slate-900/80 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                            <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase flex items-center gap-2">
                                <Vote className="w-4 h-4 text-teal-500" />
                                <span>Crear Votación Formal de Asamblea</span>
                            </h5>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Materia / Título de Votación</label>
                                    <input
                                        type="text"
                                        required
                                        value={newVoting.title}
                                        onChange={(e) => setNewVoting(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white"
                                        placeholder="Ej: Aprobación Cambio de Ascensores Schindler"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Quórum Requerido (%)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="100"
                                        required
                                        value={newVoting.quorum_required_percent}
                                        onChange={(e) => setNewVoting(prev => ({ ...prev, quorum_required_percent: e.target.value }))}
                                        className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Descripción y Antecedentes Legales</label>
                                <textarea
                                    rows="2"
                                    value={newVoting.description}
                                    onChange={(e) => setNewVoting(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white"
                                    placeholder="Detalles de la moción sometida a consulta..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Opciones de Voto</label>
                                {newVoting.options.map((opt, idx) => (
                                    <div key={idx} className="flex gap-2 items-center">
                                        <input
                                            type="text"
                                            required
                                            value={opt.title}
                                            onChange={(e) => {
                                                const opts = [...newVoting.options];
                                                opts[idx].title = e.target.value;
                                                setNewVoting(prev => ({ ...prev, options: opts }));
                                            }}
                                            className="flex-1 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs px-3 py-1.5 text-slate-800 dark:text-white"
                                            placeholder={`Opción ${idx + 1}`}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2 pt-2">
                                <button type="submit" className="px-4 py-2 bg-brand-teal hover:bg-brand-teal-light text-white font-bold text-xs rounded-xl shadow">
                                    Publicar Votación
                                </button>
                                <button type="button" onClick={() => setShowAddVotingForm(false)} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 dark:text-white text-slate-700 font-bold text-xs rounded-xl">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    )}

                    {loadingVotings ? (
                        <div className="p-8 text-center text-xs text-slate-400">Cargando votaciones de asamblea...</div>
                    ) : votingsList.length === 0 ? (
                        <div className="p-8 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                            No hay votaciones registradas en esta comunidad.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {votingsList.map(v => (
                                <div key={v.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-3 shadow-sm">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase mb-1.5 ${
                                                v.status === 'open'
                                                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                                    : 'bg-slate-500/10 border border-slate-500/20 text-slate-500'
                                            }`}>
                                                <span className={`w-1.5 h-1.5 rounded-full ${v.status === 'open' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                                                {v.status === 'open' ? 'En votación' : 'Cerrada'}
                                            </span>
                                            <h5 className="text-xs font-black text-slate-900 dark:text-white">{v.title}</h5>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{v.description}</p>
                                        </div>
                                        {v.status === 'open' && (
                                            <button
                                                type="button"
                                                onClick={() => handleCloseVoting(v.id)}
                                                className="px-2.5 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-bold rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
                                            >
                                                Cerrar
                                            </button>
                                        )}
                                    </div>

                                    {/* Opciones y conteo ponderado */}
                                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Opciones & Votos Emitidos por Unidad</p>
                                        {v.options?.map(opt => {
                                            const count = opt.votes?.length || 0;
                                            const totalVotes = v.votes?.length || 1;
                                            const pct = Math.round((count / (totalVotes || 1)) * 100);
                                            return (
                                                <div key={opt.id} className="bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl text-xs space-y-1">
                                                    <div className="flex justify-between items-center font-bold">
                                                        <span className="text-slate-800 dark:text-slate-200">{opt.title}</span>
                                                        <span className="text-teal-600 dark:text-teal-400 font-mono text-[11px]">{count} unid. ({pct}%)</span>
                                                    </div>
                                                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                                        <div className="bg-teal-500 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="flex items-center justify-between pt-2 text-[10px] text-slate-400 font-medium border-t border-slate-100 dark:border-slate-800">
                                        <span className="flex items-center gap-1">
                                            <Users className="w-3 h-3" />
                                            <span>{v.votes?.length || 0} unidades votaron</span>
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Percent className="w-3 h-3" />
                                            <span>Quórum min: {v.quorum_required_percent}%</span>
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* B. SECCIÓN DE LIBRO DE ACTAS */}
            {subTab === 'minutes' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                            Actas Digitalizadas
                        </span>
                        <button
                            type="button"
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="px-3.5 py-1.5 bg-brand-teal hover:bg-brand-teal-light text-white font-bold text-xs rounded-xl shadow transition-all"
                        >
                            {showAddForm ? 'Cerrar Form' : 'Subir Acta Firmada'}
                        </button>
                    </div>

                    {showAddForm && (
                        <form onSubmit={handleFormSubmit} className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-4 max-w-xl text-left">
                            <h5 className="text-xs font-bold text-gray-800 dark:text-slate-200 uppercase">📄 Registrar Acta de Asamblea</h5>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="minuteTitle" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Título de Asamblea</label>
                                    <input
                                        id="minuteTitle"
                                        type="text"
                                        required
                                        value={newMinute.title}
                                        onChange={(e) => setNewMinute(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                        placeholder="Ej: Asamblea Ordinaria Mayo"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="minuteDate" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Fecha</label>
                                    <input
                                        id="minuteDate"
                                        type="date"
                                        required
                                        value={newMinute.date}
                                        onChange={(e) => setNewMinute(prev => ({ ...prev, date: e.target.value }))}
                                        className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="minuteQuorum" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Quorum (%)</label>
                                    <input
                                        id="minuteQuorum"
                                        type="text"
                                        required
                                        value={newMinute.quorum}
                                        onChange={(e) => setNewMinute(prev => ({ ...prev, quorum: e.target.value }))}
                                        className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                        placeholder="Ej: 75%"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="minuteStatus" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Estado Firma</label>
                                    <select
                                        id="minuteStatus"
                                        value={newMinute.status}
                                        onChange={(e) => setNewMinute(prev => ({ ...prev, status: e.target.value }))}
                                        className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                    >
                                        <option value="signed">Firmado por Comité</option>
                                        <option value="pending">Pendiente de Firma</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="minuteDecisions" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Decisiones / Resoluciones Principales</label>
                                <textarea
                                    id="minuteDecisions"
                                    required
                                    rows="3"
                                    value={newMinute.decisions}
                                    onChange={(e) => setNewMinute(prev => ({ ...prev, decisions: e.target.value }))}
                                    className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                                    placeholder="Describa los puntos aprobados y resoluciones..."
                                />
                            </div>
                            <div className="flex gap-2">
                                <button type="submit" className="px-4 py-2 bg-brand-teal hover:bg-brand-teal-light text-white font-bold text-xs rounded-xl shadow">
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
                                            type="button"
                                            onClick={() => toast(`Descargando acta oficial en PDF: ${m.title}`, 'success')}
                                            className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-brand-teal/30 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-lg transition-all"
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
            )}
        </div>
    );
}
