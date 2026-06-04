import { useState } from 'react';

function LocalBadge({ children, variant = 'default' }) {
    const variants = {
        default: 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300 dark:border dark:border-slate-700/60',
        success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-500 dark:border dark:border-emerald-500/20',
        warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 dark:border dark:border-amber-500/20',
        danger: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 dark:border dark:border-rose-500/20',
        info: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 dark:border dark:border-blue-500/20',
        purple: 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400 dark:border dark:border-violet-500/20',
    };

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant] || variants.default}`}>
            {children}
        </span>
    );
}

function LocalStatusBadge({ status, type = 'status' }) {
    const configs = {
        status: {
            active: { label: 'Activo', variant: 'success' },
            inactive: { label: 'Inactivo', variant: 'danger' },
            occupied: { label: 'Ocupado', variant: 'success' },
            vacant: { label: 'Disponible', variant: 'warning' },
        },
        payment: {
            pending: { label: 'Pendiente', variant: 'warning' },
            completed: { label: 'Pagado', variant: 'success' },
            overdue: { label: 'Vencido', variant: 'danger' },
            cancelled: { label: 'Cancelado', variant: 'default' },
        },
    };

    const config = configs[type]?.[status] || { label: status, variant: 'default' };
    return <LocalBadge variant={config.variant}>{config.label}</LocalBadge>;
}

export default function TiFinancesRecaudacion({
    paymentsList = [],
    setPaymentsList,
    showAddPaymentForm,
    setShowAddPaymentForm,
    newPaymentForm,
    setNewPaymentForm,
    setTerminalLogs
}) {
    return (
        <div className="space-y-6 animate-fade-in text-left">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <h4 className="text-sm font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
                    💵 Finanzas y Recaudación de Gastos
                </h4>
                <button
                    onClick={() => setShowAddPaymentForm(!showAddPaymentForm)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all shrink-0"
                >
                    {showAddPaymentForm ? 'Cerrar Formulario' : 'Registrar Pago'}
                </button>
            </div>

            {showAddPaymentForm && (
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const newP = {
                        id: paymentsList.length + 1,
                        user_id: 1,
                        property_id: newPaymentForm.property_id || '202',
                        amount: newPaymentForm.amount,
                        payment_method: newPaymentForm.payment_method,
                        status: 'completed',
                        payment_date: new Date().toISOString(),
                        user: { name: 'Residente Demo' }
                    };
                    setPaymentsList(prev => [newP, ...prev]);
                    setTerminalLogs(prev => [...prev, `[PAGO] Registrado pago #${newP.id} por $${newP.amount}`]);
                    setShowAddPaymentForm(false);
                    setNewPaymentForm({ user_id: '', property_id: '', common_expense_id: 1, amount: '', payment_method: 'transfer' });
                }} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-4 max-w-xl">
                    <h5 className="text-xs font-bold text-slate-300 uppercase">Detalles del Pago</h5>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Monto ($)</label>
                            <input
                                type="number"
                                required
                                value={newPaymentForm.amount}
                                onChange={(e) => setNewPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs px-3 py-2 text-white focus:outline-none focus:border-[#00A896]"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Departamento</label>
                            <input
                                type="text"
                                required
                                placeholder="Ej: 202"
                                value={newPaymentForm.property_id}
                                onChange={(e) => setNewPaymentForm(prev => ({ ...prev, property_id: e.target.value }))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs px-3 py-2 text-white focus:outline-none focus:border-[#00A896]"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Método de Pago</label>
                        <select
                            value={newPaymentForm.payment_method}
                            onChange={(e) => setNewPaymentForm(prev => ({ ...prev, payment_method: e.target.value }))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs px-3 py-2 text-white focus:outline-none focus:border-[#00A896] cursor-pointer"
                        >
                            <option value="transfer">Transferencia</option>
                            <option value="card">Tarjeta Crédito/Débito</option>
                            <option value="cash">Efectivo</option>
                        </select>
                    </div>
                    <button type="submit" className="px-4 py-2 bg-[#00A896] hover:bg-[#00A896]/80 text-white font-bold text-xs rounded-xl shadow-md">
                        Registrar Pago
                    </button>
                </form>
            )}

            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden shadow-inner">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="bg-slate-950 text-slate-500 border-b border-slate-800">
                                <th className="p-4 font-black text-left">Usuario</th>
                                <th className="p-4 font-black text-left">Propiedad</th>
                                <th className="p-4 font-black text-left">Monto</th>
                                <th className="p-4 font-black text-left">Método</th>
                                <th className="p-4 font-black text-left">Estado</th>
                                <th className="p-4 font-black text-right">Fecha</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                            {paymentsList.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-900/60">
                                    <td className="p-4 font-bold text-slate-100 text-left">{p.user?.name || 'Residente'}</td>
                                    <td className="p-4 text-left font-mono text-slate-400">Depto {p.property_id}</td>
                                    <td className="p-4 text-left font-bold text-emerald-500">${Number(p.amount).toLocaleString()}</td>
                                    <td className="p-4 text-left uppercase text-[10px] font-bold">{p.payment_method}</td>
                                    <td className="p-4 text-left"><LocalStatusBadge status={p.status || 'completed'} type="payment" /></td>
                                    <td className="p-4 text-right text-slate-500">{new Date(p.payment_date).toLocaleDateString('es-CL')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
