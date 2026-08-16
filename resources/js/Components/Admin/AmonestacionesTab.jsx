import React, { useState, useEffect } from 'react';
import Modal from '@/Components/Modal';

export default function AmonestacionesTab({ adminCondoId = 1, employees = [] }) {
    const [sanctions, setSanctions] = useState([
        {
            id: 1,
            employee_name: 'José Andrade',
            employee_profile_id: 1,
            date: '2026-08-10',
            time: '08:45',
            reason: 'Atraso reiterado',
            description: 'Tercer atraso del mes sin previo aviso a conserjería.',
            document_path: null,
            created_at: '2026-08-10 09:00'
        },
        {
            id: 2,
            employee_name: 'Mario Carrasco',
            employee_profile_id: 2,
            date: '2026-08-04',
            time: '14:20',
            reason: 'Abandono de puesto',
            description: 'Ausencia del puesto de vigilancia durante 40 minutos en horario punta.',
            document_path: 'sanctions/amonestacion_mario.pdf',
            created_at: '2026-08-04 15:30'
        }
    ]);

    const [selectedEmployeeId, setSelectedEmployeeId] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [viewDocModal, setViewDocModal] = useState(null);
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        employee_profile_id: employees[0]?.id || 1,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        reason: 'Atraso reiterado',
        description: '',
        document: null
    });

    const reasonsList = [
        'Atraso reiterado',
        'Abandono de puesto de trabajo',
        'Falta de respeto a copropietario o residente',
        'Incumplimiento de funciones de aseo o vigilancia',
        'Uso indebido de uniforme o presentación personal',
        'Otro motivo disciplinario'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.reason || !form.description.trim()) {
            alert('Por favor complete el motivo y la descripción.');
            return;
        }

        const selectedEmp = employees.find(emp => emp.id === Number(form.employee_profile_id));
        const newSanction = {
            id: Date.now(),
            employee_name: selectedEmp ? selectedEmp.name : 'Colaborador',
            employee_profile_id: Number(form.employee_profile_id),
            date: form.date,
            time: form.time,
            reason: form.reason,
            description: form.description,
            document_path: form.document ? URL.createObjectURL(form.document) : null,
            created_at: new Date().toLocaleString()
        };

        setSanctions([newSanction, ...sanctions]);
        setShowModal(false);
        setForm({
            employee_profile_id: employees[0]?.id || 1,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toTimeString().slice(0, 5),
            reason: 'Atraso reiterado',
            description: '',
            document: null
        });
    };

    const handleDelete = (id) => {
        if (confirm('¿Está seguro de eliminar esta amonestación?')) {
            setSanctions(sanctions.filter(s => s.id !== id));
        }
    };

    const filteredSanctions = selectedEmployeeId === 'all'
        ? sanctions
        : sanctions.filter(s => s.employee_profile_id === Number(selectedEmployeeId));

    return (
        <div className="space-y-6">
            {/* Barra de Filtros y Acciones */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <span className="text-xs font-black uppercase text-slate-500 tracking-wider">Filtrar por:</span>
                    <select
                        value={selectedEmployeeId}
                        onChange={(e) => setSelectedEmployeeId(e.target.value)}
                        className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-rose-500"
                    >
                        <option value="all">Todos los Colaboradores</option>
                        {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.name} ({emp.role_name || 'Personal'})</option>
                        ))}
                    </select>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="w-full md:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
                >
                    <span>⚠️</span>
                    <span>Registrar Amonestación</span>
                </button>
            </div>

            {/* Listado de Amonestaciones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSanctions.length === 0 ? (
                    <div className="col-span-full bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 p-12 text-center rounded-2xl">
                        <span className="text-3xl block mb-2">📋</span>
                        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No hay amonestaciones registradas</h4>
                        <p className="text-xs text-slate-400 mt-1">El personal seleccionado no tiene llamados de atención en su historial.</p>
                    </div>
                ) : (
                    filteredSanctions.map((sanction) => (
                        <div
                            key={sanction.id}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs hover:border-rose-300 dark:hover:border-rose-500/40 transition-all relative group flex flex-col justify-between"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-2 mb-3">
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-wider bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 px-2.5 py-1 rounded-md border border-rose-200 dark:border-rose-500/30 inline-block mb-1">
                                            {sanction.reason}
                                        </span>
                                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                                            {sanction.employee_name}
                                        </h4>
                                    </div>
                                    <div className="text-right text-[11px] text-slate-400 font-mono">
                                        📅 {sanction.date} {sanction.time && `· ⏰ ${sanction.time}`}
                                    </div>
                                </div>

                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 mb-3">
                                    {sanction.description}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/80">
                                <div>
                                    {sanction.document_path ? (
                                        <button
                                            onClick={() => setViewDocModal(sanction)}
                                            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5"
                                        >
                                            <span>📎</span>
                                            <span>Ver Documento Adjunto</span>
                                        </button>
                                    ) : (
                                        <span className="text-[11px] text-slate-400 italic">Sin archivo adjunto</span>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleDelete(sanction.id)}
                                    className="text-xs font-bold text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors p-1"
                                    title="Eliminar amonestación"
                                >
                                    🗑️ Eliminar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal de Registro de Amonestación */}
            <Modal show={showModal} onClose={() => setShowModal(false)} maxWidth="md">
                <div className="p-6 text-left">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">⚠️</span>
                            <h3 className="text-base font-black text-slate-900 dark:text-white">
                                Nueva Amonestación Laboral
                            </h3>
                        </div>
                        <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">✕</button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
                        <div>
                            <label className="block text-slate-600 dark:text-slate-400 mb-1">Colaborador Sancionado:</label>
                            <select
                                value={form.employee_profile_id}
                                onChange={(e) => setForm({ ...form, employee_profile_id: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200"
                            >
                                {employees.map(emp => (
                                    <option key={emp.id} value={emp.id}>{emp.name} ({emp.role_name})</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-slate-600 dark:text-slate-400 mb-1">Fecha:</label>
                                <input
                                    type="date"
                                    value={form.date}
                                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-slate-600 dark:text-slate-400 mb-1">Hora (Opcional):</label>
                                <input
                                    type="time"
                                    value={form.time}
                                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-slate-600 dark:text-slate-400 mb-1">Motivo de la Sanción:</label>
                            <select
                                value={form.reason}
                                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-200"
                            >
                                {reasonsList.map(r => (
                                    <option key={r} value={r}>{r}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-slate-600 dark:text-slate-400 mb-1">Descripción de los Hechos:</label>
                            <textarea
                                rows="3"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                placeholder="Detalle lo sucedido y descargos del colaborador..."
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-800 dark:text-slate-200"
                                required
                            ></textarea>
                        </div>

                        <div>
                            <label className="block text-slate-600 dark:text-slate-400 mb-1">Documento de Respaldo (PDF o Foto firmada):</label>
                            <input
                                type="file"
                                accept=".pdf,image/png,image/jpeg"
                                onChange={(e) => setForm({ ...form, document: e.target.files[0] || null })}
                                className="w-full text-[11px] text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-rose-50 dark:file:bg-rose-500/20 file:text-rose-600 dark:file:text-rose-400 hover:file:bg-rose-100"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-black shadow-md shadow-rose-600/30"
                            >
                                Guardar Amonestación
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Modal de Vista de Documento */}
            <Modal show={!!viewDocModal} onClose={() => setViewDocModal(null)} maxWidth="lg">
                <div className="p-6 text-left">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white">
                            Respaldo de Amonestación — {viewDocModal?.employee_name}
                        </h3>
                        <button onClick={() => setViewDocModal(null)} className="text-slate-400 hover:text-slate-600 text-sm font-bold">✕</button>
                    </div>
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-xl text-center">
                        <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
                            Archivo adjunto registrado el {viewDocModal?.date}:
                        </p>
                        <span className="font-mono text-xs bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 inline-block mb-4">
                            {viewDocModal?.document_path || 'documento_amonestacion.pdf'}
                        </span>
                        <div className="flex justify-center gap-3">
                            <a
                                href={viewDocModal?.document_path || '#'}
                                target="_blank"
                                rel="noreferrer"
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-sm"
                            >
                                📥 Descargar / Abrir Archivo
                            </a>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
