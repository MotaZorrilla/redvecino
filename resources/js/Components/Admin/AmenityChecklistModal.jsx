import React, { useState } from 'react';
import Modal from '@/Components/Modal';

export default function AmenityChecklistModal({
    isOpen = false,
    onClose = () => {},
    booking = null,
    onSaved = () => {},
}) {
    const [checklistType, setChecklistType] = useState('check_in'); // check_in, check_out
    const [overallStatus, setOverallStatus] = useState('conforme'); // conforme, con_observaciones, con_danos
    const [depositAction, setDepositAction] = useState('liberar'); // liberar, retener, cobrar_reparacion
    const [deductionAmount, setDeductionAmount] = useState(0);
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [items, setItems] = useState([
        { id: 1, name: 'Mobiliario (Mesas y Sillas)', status: 'ok', comment: '' },
        { id: 2, name: 'Parrilla / Cocina / Encendido', status: 'ok', comment: '' },
        { id: 3, name: 'Iluminación y Enchufes', status: 'ok', comment: '' },
        { id: 4, name: 'Aseo e Higiene General', status: 'ok', comment: '' },
        { id: 5, name: 'Refrigerador / Conservación', status: 'ok', comment: '' },
    ]);

    const handleItemStatusToggle = (id, newStatus) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
    };

    const handleItemCommentChange = (id, comment) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, comment } : item));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            condominium_id: booking?.condominium_id || 1,
            booking_id: booking?.id || null,
            facility_name: booking?.amenity_name || booking?.area_name || 'Quincho Panorámico',
            type: checklistType,
            status: overallStatus,
            items_status: items,
            deposit_action: depositAction,
            deposit_deduction_amount: Number(deductionAmount) || 0,
            notes: notes,
        };

        try {
            const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await fetch('/api/facility-checklists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': token || '',
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                const data = await res.json();
                onSaved(data);
                onClose();
            } else {
                alert('No se pudo guardar el checklist de inspección.');
            }
        } catch (err) {
            console.error('Error guardando checklist:', err);
            onSaved(payload);
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const facilityName = booking?.amenity_name || booking?.area_name || 'Área Común';
    const unitName = booking?.unit_name || 'Unidad Asignada';

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="2xl">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl text-slate-800 dark:text-slate-100">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center text-xl font-bold">
                            📋
                        </span>
                        <div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-white">
                                Inspección y Entrega · {facilityName}
                            </h3>
                            <p className="text-xs text-slate-500">
                                {unitName} · Protocolo de Check-in / Check-out y Garantías
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center font-bold"
                    >
                        ✕
                    </button>
                </div>

                {/* Tipo de Inspección (Check-in vs Check-out) */}
                <div className="grid grid-cols-2 gap-2 my-4 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                    <button
                        type="button"
                        onClick={() => setChecklistType('check_in')}
                        className={`py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                            checklistType === 'check_in'
                                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                        }`}
                    >
                        <span>🔑</span>
                        <span>Check-In (Entrega Inicial)</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setChecklistType('check_out')}
                        className={`py-2 text-xs font-black rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                            checklistType === 'check_out'
                                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-white shadow-xs'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                        }`}
                    >
                        <span>🏁</span>
                        <span>Check-Out (Devolución)</span>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                    {/* Lista de Ítems e Inventario */}
                    <div className="space-y-2">
                        <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                            Estado de Inventario y Equipamiento
                        </h4>
                        <div className="space-y-2">
                            {items.map(item => (
                                <div
                                    key={item.id}
                                    className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                                >
                                    <span className="font-bold text-slate-900 dark:text-white">
                                        {item.name}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => handleItemStatusToggle(item.id, 'ok')}
                                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                                                item.status === 'ok'
                                                    ? 'bg-emerald-500 text-white shadow-xs'
                                                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                            }`}
                                        >
                                            ✅ Conforme
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleItemStatusToggle(item.id, 'observado')}
                                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                                                item.status === 'observado'
                                                    ? 'bg-amber-500 text-white shadow-xs'
                                                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                            }`}
                                        >
                                            ⚠️ Observado
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleItemStatusToggle(item.id, 'danado')}
                                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                                                item.status === 'danado'
                                                    ? 'bg-rose-500 text-white shadow-xs'
                                                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                                            }`}
                                        >
                                            ❌ Dañado
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Estado General y Resolución de Garantía */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                                Dictamen General de la Inspección
                            </label>
                            <select
                                value={overallStatus}
                                onChange={(e) => setOverallStatus(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-bold text-slate-800 dark:text-white"
                            >
                                <option value="conforme">Conforme (Sin Novedades)</option>
                                <option value="con_observaciones">Con Observaciones Menores</option>
                                <option value="con_danos">Con Daños / Descuento de Garantía</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                                Acción sobre Garantía de Arriendo
                            </label>
                            <select
                                value={depositAction}
                                onChange={(e) => setDepositAction(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-bold text-slate-800 dark:text-white"
                            >
                                <option value="liberar">Liberar Garantía Completa</option>
                                <option value="retener">Retener para Evaluación</option>
                                <option value="cobrar_reparacion">Deducir Costo de Reparación</option>
                            </select>
                        </div>
                    </div>

                    {depositAction === 'cobrar_reparacion' && (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl space-y-1">
                            <label className="text-[10px] font-bold uppercase text-rose-600 dark:text-rose-400 block">
                                Monto a Deducir o Imputar en Gastos Comunes ($ CLP)
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={deductionAmount}
                                onChange={(e) => setDeductionAmount(e.target.value)}
                                className="w-full bg-white dark:bg-slate-950 border border-rose-300 dark:border-rose-800 rounded-xl p-2 font-black text-rose-600 dark:text-rose-400"
                                placeholder="Ej. 15000"
                            />
                        </div>
                    )}

                    {/* Observaciones y Notas */}
                    <div>
                        <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                            Observaciones de Entrega / Notas del Conserje
                        </label>
                        <textarea
                            rows="2"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Describa el estado del espacio o detalles acordados con el residente..."
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-slate-800 dark:text-white"
                        />
                    </div>

                    {/* Footer */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                        >
                            <span>💾</span>
                            <span>{isSubmitting ? 'Guardando...' : 'Registrar Inspección'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
