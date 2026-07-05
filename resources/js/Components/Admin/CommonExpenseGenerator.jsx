import React, { useState } from 'react';
import api from '@/bootstrap';

export default function CommonExpenseGenerator({ adminCondoId }) {
    const [period, setPeriod] = useState('');
    const [preview, setPreview] = useState(null);

    const generatePreview = async () => {
        try {
            const res = await api.post('/api/common-expenses/generate', {
                condominium_id: adminCondoId,
                period: period
            });
            setPreview(res.data);
        } catch (error) {
            console.error(error);
            alert("Error al generar vista previa");
        }
    };

    const publish = async () => {
        if (!preview) return;
        try {
            const res = await api.post('/api/common-expenses/publish', {
                condominium_id: adminCondoId,
                period: period,
                due_date: `${period}-05`, // mock default 5th of next month
                total_amount: preview.total_condo_expense
            });
            alert("Periodo publicado con éxito.");
            setPreview(null);
        } catch (error) {
            console.error(error);
            alert("Error al publicar periodo");
        }
    };

    return (
        <div className="space-y-6 font-outfit">
            <h2 className="text-2xl font-bold dark:text-white">Generación de Gastos Comunes</h2>
            
            <div className="bg-white dark:bg-brand-bg-secondary p-6 rounded-card border border-gray-200 dark:border-slate-800">
                <div className="flex items-end gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Periodo (Ej. 2026-07)</label>
                        <input type="month" className="rounded-btn border-gray-300 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                            value={period} onChange={e => setPeriod(e.target.value)}
                        />
                    </div>
                    <button onClick={generatePreview} className="bg-brand-navy dark:bg-brand-teal text-white px-6 py-2 rounded-btn font-semibold">
                        Previsualizar Cobros
                    </button>
                </div>
            </div>

            {preview && (
                <div className="bg-white dark:bg-brand-bg-secondary p-6 rounded-card border border-gray-200 dark:border-slate-800 mt-6">
                    <h3 className="text-xl font-bold mb-4 dark:text-white">Resumen: {preview.period}</h3>
                    <p className="text-2xl text-brand-green font-bold mb-6">Total a Recaudar: ${preview.total_condo_expense.toLocaleString()}</p>
                    
                    <div className="max-h-96 overflow-y-auto mb-6 border border-gray-200 dark:border-slate-800 rounded-lg">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-100 dark:bg-slate-900 sticky top-0">
                                <tr>
                                    <th className="p-3 text-sm font-semibold dark:text-gray-300">Unidad</th>
                                    <th className="p-3 text-sm font-semibold dark:text-gray-300">Gasto Prorrateado</th>
                                    <th className="p-3 text-sm font-semibold dark:text-gray-300">Fondo Reserva</th>
                                    <th className="p-3 text-sm font-semibold dark:text-gray-300">Total a Pagar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                                {preview.bills.map(b => (
                                    <tr key={b.property_id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                        <td className="p-3 text-sm dark:text-gray-300">{b.property_number}</td>
                                        <td className="p-3 text-sm dark:text-gray-300">${(b.details.prorrateado || 0).toLocaleString()}</td>
                                        <td className="p-3 text-sm dark:text-gray-300">${(b.details.fondo_reserva || 0).toLocaleString()}</td>
                                        <td className="p-3 text-sm font-bold text-brand-orange">${b.total_to_pay.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end">
                        <button onClick={publish} className="bg-brand-green text-white px-6 py-2 rounded-btn font-semibold hover:bg-green-600 transition-colors">
                            Aprobar y Emitir Boletas
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
