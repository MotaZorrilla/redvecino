import { useState } from 'react';
import { SimpleTable, StatusBadge } from '@/Components/DashboardShared';

export default function FinancesLedger({
    adminCondoId,
    adminFilteredProperties = [],
    adminFilteredUsers = [],
    adminFilteredPayments = [],
    paymentsTabMode,
    setPaymentsTabMode,
    paymentsList = [],
    setPaymentsList,
    showAddPaymentForm,
    setShowAddPaymentForm,
    newPaymentForm,
    setNewPaymentForm,
    editingPayment,
    setEditingPayment,
    financeSummary,
    financialCatalog,
    selectedIncomeCategory,
    setSelectedIncomeCategory,
    selectedExpenseCategory,
    setSelectedExpenseCategory,
    ledgerSubTab,
    setLedgerSubTab,
    filteredIncomes = [],
    incomesList = [],
    filteredExpenses = [],
    expensesList = [],
    showAddIncomeForm,
    setShowAddIncomeForm,
    showAddExpenseForm,
    setShowAddExpenseForm,
    newIncomeForm,
    setNewIncomeForm,
    newExpenseForm,
    setNewExpenseForm,
    editingIncome,
    setEditingIncome,
    editingExpense,
    setEditingExpense,
    loadingFinances,
    handleSaveIncome,
    handleDeleteIncome,
    handleSaveExpense,
    handleDeleteExpense,
    usersList = [],
    allCondominiums = [],
    readOnly = false
}) {
    const [selectedAviso, setSelectedAviso] = useState(null);
    const activeCondo = allCondominiums.find(c => c.id === Number(adminCondoId));
    const towersList = activeCondo?.towers || [];
    const [modalSubTab, setModalSubTab] = useState('summary');

    const formatCategoryLabel = (catKey, label) => {
        if (catKey === 'gastos_comunes') {
            return 'Pagos de Gastos Comunes / Recaudación';
        }
        const rawLabel = label || catKey;
        return rawLabel
            .replace(/_/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const handlePaymentFormSubmit = (e) => {
        e.preventDefault();
        if (readOnly) return;
        const selectedUser = usersList.find(u => u.id === Number(newPaymentForm.user_id));
        if (editingPayment) {
            setPaymentsList(prev => prev.map(p => p.id === editingPayment.id ? {
                ...p,
                amount: Number(newPaymentForm.amount),
                payment_method: newPaymentForm.payment_method,
                status: newPaymentForm.status,
                user: selectedUser ? { id: selectedUser.id, name: selectedUser.name } : p.user
            } : p));
            setEditingPayment(null);
        } else {
            const newP = {
                id: paymentsList.length > 0 ? Math.max(...paymentsList.map(p => p.id)) + 1 : 1,
                property_id: Number(newPaymentForm.property_id),
                amount: Number(newPaymentForm.amount),
                payment_method: newPaymentForm.payment_method,
                status: newPaymentForm.status,
                payment_date: new Date().toISOString(),
                user: selectedUser ? { id: selectedUser.id, name: selectedUser.name } : { name: 'Vecino Anonimo' },
                property: { condominium_id: adminCondoId }
            };
            setPaymentsList(prev => [newP, ...prev]);
        }
        setShowAddPaymentForm(false);
        setNewPaymentForm({ user_id: '', property_id: '', amount: '', payment_method: 'transfer', status: 'completed' });
    };

    return (
        <div className="space-y-6 animate-fade-in text-left">
            {/* Tabs header selector */}
            <div className="flex border-b border-gray-150 dark:border-slate-800/80">
                <button
                    onClick={() => setPaymentsTabMode('payments')}
                    className={`px-6 py-3 font-bold text-xs uppercase tracking-wider transition-all border-b-2 ${paymentsTabMode === 'payments' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400' : 'border-transparent text-gray-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                    💵 Recaudación (Copropietarios)
                </button>
                <button
                    onClick={() => setPaymentsTabMode('ledger')}
                    className={`px-6 py-3 font-bold text-xs uppercase tracking-wider transition-all border-b-2 ${paymentsTabMode === 'ledger' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400' : 'border-transparent text-gray-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                    ⚖️ Libro Diario Contable
                </button>
            </div>

            {paymentsTabMode === 'payments' ? (
                <div className="space-y-6 animate-fade-in text-left">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                            <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                                💵 Registro de Recaudación y Gastos Comunes
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Registra transferencias, pagos con tarjetas y concilia expensas mensuales.</p>
                        </div>
                        {!readOnly && (
                            <button
                                onClick={() => {
                                    setEditingPayment(null);
                                    setNewPaymentForm({ user_id: '', property_id: '', amount: '', payment_method: 'transfer', status: 'completed' });
                                    setShowAddPaymentForm(!showAddPaymentForm);
                                }}
                                className="px-3.5 py-1.5 bg-brand-teal hover:bg-brand-teal-light text-white font-bold text-xs rounded-xl shadow transition-all"
                            >
                                {showAddPaymentForm ? 'Cerrar Form' : 'Registrar Pago'}
                            </button>
                        )}
                    </div>

                    {!readOnly && showAddPaymentForm && (
                        <form onSubmit={handlePaymentFormSubmit} className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-4 max-w-xl text-left">
                            <h5 className="text-xs font-bold text-gray-800 dark:text-slate-200 uppercase">{editingPayment ? '✏️ Editar Registro de Pago' : '💵 Registrar Nuevo Pago'}</h5>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="payment-property" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Propiedad Asociada</label>
                                    <select
                                        id="payment-property"
                                        required
                                        value={newPaymentForm.property_id}
                                        onChange={(e) => setNewPaymentForm(prev => ({ ...prev, property_id: e.target.value }))}
                                        className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                    >
                                        <option value="">Seleccione Unidad...</option>
                                        {adminFilteredProperties.map(p => (
                                            <option key={p.id} value={p.id}>Depto #{p.number}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="payment-user" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Vecino Pagador</label>
                                    <select
                                        id="payment-user"
                                        required
                                        value={newPaymentForm.user_id}
                                        onChange={(e) => setNewPaymentForm(prev => ({ ...prev, user_id: e.target.value }))}
                                        className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                    >
                                        <option value="">Seleccione Residente...</option>
                                        {adminFilteredUsers.map(u => (
                                            <option key={u.id} value={u.id}>{u.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="payment-amount" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Monto ($)</label>
                                    <input
                                        id="payment-amount"
                                        type="number"
                                        required
                                        value={newPaymentForm.amount}
                                        onChange={(e) => setNewPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                                        className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="payment-method" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Medio de Pago</label>
                                    <select
                                        id="payment-method"
                                        value={newPaymentForm.payment_method}
                                        onChange={(e) => setNewPaymentForm(prev => ({ ...prev, payment_method: e.target.value }))}
                                        className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                    >
                                        <option value="transfer">Transferencia</option>
                                        <option value="card">Tarjeta Débito/Crédito</option>
                                        <option value="cash">Efectivo / Depósito</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="payment-status" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Estado Conciliación</label>
                                    <select
                                        id="payment-status"
                                        value={newPaymentForm.status}
                                        onChange={(e) => setNewPaymentForm(prev => ({ ...prev, status: e.target.value }))}
                                        className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                    >
                                        <option value="completed">Completado</option>
                                        <option value="pending">Pendiente</option>
                                        <option value="failed">Rechazado</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button type="submit" className="px-4 py-2 bg-brand-teal hover:bg-brand-teal-light text-white font-bold text-xs rounded-xl shadow">
                                    {editingPayment ? 'Guardar Cambios' : 'Registrar'}
                                </button>
                                <button type="button" onClick={() => { setShowAddPaymentForm(false); setEditingPayment(null); }} className="px-4 py-2 bg-gray-200 dark:bg-slate-800 dark:text-white text-gray-700 font-bold text-xs rounded-xl">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                        <SimpleTable
                            headers={['Vecino', 'Propiedad', 'Monto', 'Método', 'Fecha', 'Estado', 'Documentos', ...(!readOnly ? ['Acciones'] : [])]}
                            rows={adminFilteredPayments.map(p => ({
                                cells: [
                                    <span className="font-bold text-gray-900 dark:text-white" key={`user-${p.id}`}>{p.user?.name || 'Vecino'}</span>,
                                    <span className="font-bold" key={`prop-${p.id}`}>Depto #{p.property_id}</span>,
                                    <span className="font-bold text-emerald-600 dark:text-emerald-500" key={`amt-${p.id}`}>${Number(p.amount).toLocaleString()}</span>,
                                    <span className="capitalize font-mono text-xs" key={`method-${p.id}`}>{p.payment_method === 'transfer' ? 'Transferencia' : p.payment_method === 'card' ? 'Tarjeta' : 'Efectivo'}</span>,
                                    <span key={`date-${p.id}`}>{new Date(p.payment_date).toLocaleDateString('es-CL')}</span>,
                                    <StatusBadge key={`status-${p.id}`} status={p.status} type="payment" />,
                                    <button
                                        key={`doc-${p.id}`}
                                        type="button"
                                        aria-label={`Ver aviso de cobro para pago de ${p.user?.name || 'vecino'}`}
                                        onClick={() => setSelectedAviso(p)}
                                        className="px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-500/25 border border-indigo-500/25 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                                    >
                                        📄 Aviso Cobro
                                    </button>,
                                    ...(!readOnly ? [
                                        <div className="flex items-center gap-2 justify-end" key={`act-${p.id}`}>
                                            <button
                                                type="button"
                                                aria-label={`Editar pago de ${p.user?.name || 'vecino'}`}
                                                onClick={() => {
                                                    setEditingPayment(p);
                                                    setNewPaymentForm({
                                                        user_id: String(p.user?.id || ''),
                                                        property_id: String(p.property_id),
                                                        amount: String(p.amount),
                                                        payment_method: p.payment_method,
                                                        status: p.status
                                                    });
                                                    setShowAddPaymentForm(true);
                                                }}
                                                className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-bold rounded-lg transition-all"
                                            >
                                                ✏️ Editar
                                            </button>
                                            <button
                                                type="button"
                                                aria-label={`Eliminar pago de ${p.user?.name || 'vecino'}`}
                                                onClick={() => {
                                                    if (confirm('¿Desea eliminar este registro de pago?')) {
                                                        setPaymentsList(prev => prev.filter(item => item.id !== p.id));
                                                    }
                                                }}
                                                className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 text-[10px] font-bold rounded-lg transition-all"
                                            >
                                                🗑️ Eliminar
                                            </button>
                                        </div>
                                    ] : [])
                                ]
                            }))}
                            emptyMessage="No hay cobros ni ingresos registrados para este condominio"
                        />
                    </div>
                </div>
            ) : (
                <div className="space-y-6 animate-fade-in">
                    {/* Summary KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-gray-100 dark:border-slate-800/80">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Ingresos Contables</p>
                                    <h3 className="text-xl font-black text-emerald-600 dark:text-emerald-500 mt-1">${Number(financeSummary.total_incomes).toLocaleString()}</h3>
                                </div>
                                <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">📥</div>
                            </div>
                        </div>
                        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-gray-100 dark:border-slate-800/80">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Egresos Contables</p>
                                    <h3 className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1">${Number(financeSummary.total_expenses).toLocaleString()}</h3>
                                </div>
                                <div className="p-2 bg-rose-500/10 rounded-xl text-rose-500">📤</div>
                            </div>
                        </div>
                        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-gray-100 dark:border-slate-800/80">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Balance de Caja</p>
                                    <h3 className={`text-xl font-black mt-1 ${Number(financeSummary.balance) >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-600 dark:text-amber-500'}`}>
                                        ${Number(financeSummary.balance).toLocaleString()}
                                    </h3>
                                </div>
                                <div className={`p-2 rounded-xl ${Number(financeSummary.balance) >= 0 ? 'bg-indigo-500/10 text-indigo-500' : 'bg-amber-500/10 text-amber-500'}`}>⚖️</div>
                            </div>
                        </div>
                    </div>

                    {/* Proportional Balance Bar Chart */}
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-2.5 text-left">
                        <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            <span>📥 Ingresos: ${Number(financeSummary.total_incomes).toLocaleString('es-CL')} ({Math.round(Number(financeSummary.total_incomes) / (Number(financeSummary.total_incomes) + Number(financeSummary.total_expenses) || 1) * 100)}%)</span>
                            <span>📤 Egresos: ${Number(financeSummary.total_expenses).toLocaleString('es-CL')} ({Math.round(Number(financeSummary.total_expenses) / (Number(financeSummary.total_incomes) + Number(financeSummary.total_expenses) || 1) * 100)}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3.5 flex overflow-hidden">
                            <div style={{ width: `${Number(financeSummary.total_incomes) / (Number(financeSummary.total_incomes) + Number(financeSummary.total_expenses) || 1) * 100}%` }} className="bg-emerald-500 h-full transition-all duration-500" />
                            <div style={{ width: `${Number(financeSummary.total_expenses) / (Number(financeSummary.total_incomes) + Number(financeSummary.total_expenses) || 1) * 100}%` }} className="bg-rose-500 h-full transition-all duration-500" />
                        </div>
                    </div>

                    {/* Dynamic Categories breakdown list with horizontal progress bars */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Income categories breakdown */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
                            <div>
                                <h5 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                    <span>📥</span> Distribución de Ingresos
                                </h5>
                                <p className="text-[10px] text-slate-400 mt-0.5">Participación de cada categoría en la recaudación total. Haz clic en una categoría para filtrar.</p>
                            </div>
                            <div className="space-y-3">
                                {Object.keys(financialCatalog.incomes || {}).map(catKey => {
                                    const amount = Number(financeSummary.incomes_by_category?.[catKey] || 0);
                                    const totalIncomes = Number(financeSummary.total_incomes) || 1;
                                    const percentage = Math.round((amount / totalIncomes) * 100);
                                    const labelVal = financialCatalog.incomes[catKey]?.label || catKey;
                                    const name = formatCategoryLabel(catKey, labelVal);
                                    const icons = { gastos_comunes: '💵', multas: '⚖️', arriendo_espacios: '🎪', intereses_mora: '📈', cuotas_extraordinarias: '🚨', publicidad_convenio: '📢' };
                                    const icon = icons[catKey] || '💰';
                                    const isActive = selectedIncomeCategory === catKey;
                                    
                                    return (
                                        <button
                                            key={catKey}
                                            onClick={() => {
                                                setSelectedIncomeCategory(isActive ? 'all' : catKey);
                                                setLedgerSubTab('incomes');
                                                setPaymentsTabMode('ledger');
                                            }}
                                            className={`w-full text-left space-y-1 p-2 rounded-xl transition-all duration-200 border hover:bg-slate-50 dark:hover:bg-slate-800 ${isActive ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-transparent border-transparent'}`}
                                        >
                                            <div className="flex justify-between text-xs">
                                                <span className="font-semibold text-slate-700 dark:text-slate-300">{icon} {name}</span>
                                                <span className="font-bold text-slate-800 dark:text-white">${amount.toLocaleString('es-CL')} <span className="text-[10px] text-slate-400 font-normal">({percentage}%)</span></span>
                                            </div>
                                            <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-full h-2 overflow-hidden">
                                                <div style={{ width: `${percentage}%` }} className="bg-emerald-500 h-full rounded-full transition-all duration-300" />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Expense categories breakdown */}
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
                            <div>
                                <h5 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                    <span>📤</span> Distribución de Egresos
                                </h5>
                                <p className="text-[10px] text-slate-400 mt-0.5">Destino de los fondos del condominio en la operación mensual. Haz clic en una categoría para filtrar.</p>
                            </div>
                            <div className="space-y-3">
                                {Object.keys(financialCatalog.expenses || {}).map(catKey => {
                                    const amount = Number(financeSummary.expenses_by_category?.[catKey] || 0);
                                    const totalExpenses = Number(financeSummary.total_expenses) || 1;
                                    const percentage = Math.round((amount / totalExpenses) * 100);
                                    const labelVal = financialCatalog.expenses[catKey]?.label || catKey;
                                    const name = formatCategoryLabel(catKey, labelVal);
                                    const icons = { personal: '👷', servicios_basicos: '💧', mantencion: '🔧', seguridad: '🛡️', limpieza: '🧹', reparacion: '🔧', seguros: '☂️', administracion: '📁', fondo_reserva: '🏦', otro: '💸' };
                                    const icon = icons[catKey] || '💸';
                                    const isActive = selectedExpenseCategory === catKey;
                                    
                                    return (
                                        <button
                                            key={catKey}
                                            onClick={() => {
                                                setSelectedExpenseCategory(isActive ? 'all' : catKey);
                                                setLedgerSubTab('expenses');
                                                setPaymentsTabMode('ledger');
                                            }}
                                            className={`w-full text-left space-y-1 p-2 rounded-xl transition-all duration-200 border hover:bg-slate-50 dark:hover:bg-slate-800 ${isActive ? 'bg-rose-500/10 border-rose-500/30' : 'bg-transparent border-transparent'}`}
                                        >
                                            <div className="flex justify-between text-xs">
                                                <span className="font-semibold text-slate-700 dark:text-slate-300">{icon} {name}</span>
                                                <span className="font-bold text-slate-800 dark:text-white">${amount.toLocaleString('es-CL')} <span className="text-[10px] text-slate-400 font-normal">({percentage}%)</span></span>
                                            </div>
                                            <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-full h-2 overflow-hidden">
                                                <div style={{ width: `${percentage}%` }} className="bg-rose-500 h-full rounded-full transition-all duration-300" />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Sub-tabs switch (Incomes vs Expenses CRUD lists) */}
                    <div className="flex gap-2.5">
                        <button
                            onClick={() => setLedgerSubTab('incomes')}
                            className={`px-4.5 py-2 rounded-xl text-xs font-extrabold transition-all border ${ledgerSubTab === 'incomes' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shadow-sm' : 'bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 border-transparent text-slate-500 dark:text-slate-400'}`}
                        >
                            📥 Libro de Ingresos Contables
                        </button>
                        <button
                            onClick={() => setLedgerSubTab('expenses')}
                            className={`px-4.5 py-2 rounded-xl text-xs font-extrabold transition-all border ${ledgerSubTab === 'expenses' ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30 shadow-sm' : 'bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 border-transparent text-slate-500 dark:text-slate-400'}`}
                        >
                            📤 Libro de Egresos Contables
                        </button>
                    </div>

                    {loadingFinances ? (
                        <div className="flex items-center justify-center py-16 gap-3">
                            <span className="animate-spin text-xl">⏳</span>
                            <span className="text-xs font-bold text-slate-400">Actualizando libro contable...</span>
                        </div>
                    ) : ledgerSubTab === 'incomes' ? (
                        /* ================= INCOME SECTION ================= */
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-left">
                                    <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Historial de Ingresos Contables ({filteredIncomes.length} / {incomesList.length})</span>
                                    {selectedIncomeCategory !== 'all' && (
                                        <button
                                            type="button"
                                            onClick={() => setSelectedIncomeCategory('all')}
                                            className="px-2 py-0.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-black rounded-lg transition-all"
                                        >
                                            Limpiar Filtro ×
                                        </button>
                                    )}
                                </div>
                                {!readOnly && (
                                    <button
                                        onClick={() => {
                                            setEditingIncome(null);
                                            setNewIncomeForm({ category: '', subcategory: '', amount: '', date: new Date().toISOString().substring(0, 10), description: '', property_id: '', user_id: '', distributable_method: 'prorated', tower_id: '' });
                                            setShowAddIncomeForm(!showAddIncomeForm);
                                        }}
                                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition-all"
                                    >
                                        {showAddIncomeForm ? 'Cerrar Formulario' : '➕ Registrar Ingreso'}
                                    </button>
                                )}
                            </div>

                            {!readOnly && showAddIncomeForm && (
                                <form onSubmit={handleSaveIncome} className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-4 max-w-2xl text-left">
                                    <h5 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">{editingIncome ? '✏️ Editar Ingreso Contable' : '📥 Registrar Nuevo Ingreso Contable'}</h5>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="income-category" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Categoría Financiera</label>
                                            <select
                                                id="income-category"
                                                required
                                                value={newIncomeForm.category}
                                                onChange={(e) => setNewIncomeForm(prev => ({ ...prev, category: e.target.value, subcategory: '' }))}
                                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                            >
                                                <option value="">Seleccione Categoría...</option>
                                                {Object.entries(financialCatalog.incomes || {}).map(([key, obj]) => (
                                                    <option key={key} value={key}>{formatCategoryLabel(key, obj.label)}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="income-subcategory" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Subcategoría Específica</label>
                                            <select
                                                id="income-subcategory"
                                                required
                                                value={newIncomeForm.subcategory}
                                                onChange={(e) => setNewIncomeForm(prev => ({ ...prev, subcategory: e.target.value }))}
                                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                                disabled={!newIncomeForm.category}
                                            >
                                                <option value="">Seleccione Subcategoría...</option>
                                                {Object.entries(financialCatalog.incomes?.[newIncomeForm.category]?.subcategories || {}).map(([subKey, subName]) => (
                                                    <option key={subKey} value={subName}>{subName}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label htmlFor="income-amount" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Monto ($ CLP)</label>
                                            <input
                                                id="income-amount"
                                                type="number"
                                                required
                                                value={newIncomeForm.amount}
                                                onChange={(e) => setNewIncomeForm(prev => ({ ...prev, amount: e.target.value }))}
                                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                                placeholder="Monto"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="income-date" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Fecha Registro</label>
                                            <input
                                                id="income-date"
                                                type="date"
                                                required
                                                value={newIncomeForm.date}
                                                onChange={(e) => setNewIncomeForm(prev => ({ ...prev, date: e.target.value }))}
                                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="income-property" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Unidad (Opcional)</label>
                                            <select
                                                id="income-property"
                                                value={newIncomeForm.property_id}
                                                onChange={(e) => setNewIncomeForm(prev => ({ ...prev, property_id: e.target.value }))}
                                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                            >
                                                <option value="">Ninguna...</option>
                                                {adminFilteredProperties.map(p => (
                                                    <option key={p.id} value={p.id}>Depto #{p.number}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="income-user" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Residente Copropietario (Opcional)</label>
                                            <select
                                                id="income-user"
                                                value={newIncomeForm.user_id}
                                                onChange={(e) => setNewIncomeForm(prev => ({ ...prev, user_id: e.target.value }))}
                                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                            >
                                                <option value="">Ninguno...</option>
                                                {adminFilteredUsers.map(u => (
                                                    <option key={u.id} value={u.id}>{u.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="income-description" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Descripción / Detalles</label>
                                            <input
                                                id="income-description"
                                                type="text"
                                                value={newIncomeForm.description}
                                                onChange={(e) => setNewIncomeForm(prev => ({ ...prev, description: e.target.value }))}
                                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                                placeholder="Comentarios adicionales o detalle del pago"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="income-dist-method" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Método de Distribución</label>
                                            <select
                                                id="income-dist-method"
                                                value={newIncomeForm.distributable_method || 'prorated'}
                                                onChange={(e) => setNewIncomeForm(prev => ({ 
                                                    ...prev, 
                                                    distributable_method: e.target.value,
                                                    tower_id: e.target.value === 'tower_specific' ? prev.tower_id : '' 
                                                }))}
                                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                            >
                                                <option value="prorated">Prorrateado (Alícuota)</option>
                                                <option value="equal">Partes Iguales</option>
                                                <option value="tower_specific">Por Torre Específica</option>
                                                <option value="unit_specific">Unidad Específica</option>
                                                <option value="exempt">Exento</option>
                                            </select>
                                        </div>

                                        {newIncomeForm.distributable_method === 'tower_specific' ? (
                                            <div>
                                                <label htmlFor="income-tower" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Torre Específica</label>
                                                <select
                                                    id="income-tower"
                                                    required
                                                    value={newIncomeForm.tower_id || ''}
                                                    onChange={(e) => setNewIncomeForm(prev => ({ ...prev, tower_id: e.target.value }))}
                                                    className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                                >
                                                    <option value="">Seleccione Torre...</option>
                                                    {towersList.map(t => (
                                                        <option key={t.id} value={t.id}>{t.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        ) : (
                                            <div className="opacity-40 pointer-events-none">
                                                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Torre Específica (Inactivo)</label>
                                                <select className="w-full bg-slate-100 dark:bg-slate-900 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-400 focus:outline-none" disabled>
                                                    <option>No aplica para este método</option>
                                                </select>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <button type="submit" className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow">
                                            {editingIncome ? 'Guardar Cambios' : 'Registrar'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowAddIncomeForm(false);
                                                setEditingIncome(null);
                                                setNewIncomeForm({ category: '', subcategory: '', amount: '', date: '', description: '', property_id: '', user_id: '', distributable_method: 'prorated', tower_id: '' });
                                            }}
                                            className="px-4 py-2 bg-gray-200 dark:bg-slate-800 dark:text-white text-gray-700 font-bold text-xs rounded-xl"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                                <SimpleTable
                                    headers={['Categoría', 'Subcategoría', 'Monto', 'Fecha', 'Detalles', 'Distribución / Torre', 'Unidad/Vecino', ...(!readOnly ? ['Acciones'] : [])]}
                                    rows={filteredIncomes.map(inc => {
                                        const labelVal = financialCatalog.incomes?.[inc.category]?.label || inc.category;
                                        const catName = formatCategoryLabel(inc.category, labelVal);
                                        const subName = inc.subcategory || 'N/A';
                                        
                                        const icons = { gastos_comunes: '💵', multas: '⚖️', arriendo_espacios: '🎪', intereses_mora: '📈', cuotas_extraordinarias: '🚨', publicidad_convenios: '📢' };
                                        const icon = icons[inc.category] || '💰';

                                        return {
                                            cells: [
                                                <span className="font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5" key={`cat-${inc.id}`}>{icon} {catName}</span>,
                                                <span className="font-semibold text-slate-500 dark:text-slate-400" key={`sub-${inc.id}`}>{subName}</span>,
                                                <span className="font-bold text-emerald-600 dark:text-emerald-500" key={`amt-${inc.id}`}>${Number(inc.amount).toLocaleString()}</span>,
                                                <span key={`date-${inc.id}`}>{new Date(inc.date + 'T12:00:00').toLocaleDateString('es-CL')}</span>,
                                                <span className="text-xs truncate max-w-xs block text-slate-500 dark:text-slate-400" title={inc.description} key={`desc-${inc.id}`}>{inc.description || '—'}</span>,
                                                <div key={`dist-${inc.id}`}>
                                                    <span className="capitalize font-semibold block text-xs">
                                                        {inc.distributable_method === 'prorated' ? 'Prorrateado' : 
                                                         inc.distributable_method === 'equal' ? 'Partes Iguales' : 
                                                         inc.distributable_method === 'tower_specific' ? 'Por Torre' : 
                                                         inc.distributable_method === 'unit_specific' ? 'Unidad Específica' : 
                                                         inc.distributable_method === 'exempt' ? 'Exento' : inc.distributable_method || 'Prorrateado'}
                                                    </span>
                                                    {inc.tower && <span className="text-[10px] text-indigo-500 font-bold block">{inc.tower.name}</span>}
                                                </div>,
                                                <div key={`unit-${inc.id}`}>
                                                    {inc.property && <span className="font-bold block text-xs">Depto #{inc.property.number}</span>}
                                                    {inc.user && <span className="text-[10px] text-slate-400 block">{inc.user.name}</span>}
                                                    {!inc.property && !inc.user && <span className="text-slate-400 text-[10px]">—</span>}
                                                </div>,
                                                ...(!readOnly ? [
                                                    <div className="flex items-center gap-2 justify-end" key={`act-${inc.id}`}>
                                                        <button
                                                            type="button"
                                                            aria-label={`Editar ingreso ${inc.description || inc.category}`}
                                                            onClick={() => {
                                                                setEditingIncome(inc);
                                                                setNewIncomeForm({
                                                                    category: inc.category,
                                                                    subcategory: inc.subcategory || '',
                                                                    amount: String(inc.amount),
                                                                    date: inc.date ? inc.date.substring(0, 10) : '',
                                                                    description: inc.description || '',
                                                                    property_id: inc.property_id ? String(inc.property_id) : '',
                                                                    user_id: inc.user_id ? String(inc.user_id) : '',
                                                                    distributable_method: inc.distributable_method || 'prorated',
                                                                    tower_id: inc.tower_id ? String(inc.tower_id) : ''
                                                                });
                                                                setShowAddIncomeForm(true);
                                                            }}
                                                            className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 text-[10px] font-bold rounded-lg transition-all"
                                                        >
                                                            ✏️ Editar
                                                        </button>
                                                        <button
                                                            type="button"
                                                            aria-label={`Eliminar ingreso ${inc.description || inc.category}`}
                                                            onClick={() => handleDeleteIncome(inc.id)}
                                                            className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 text-[10px] font-bold rounded-lg transition-all"
                                                        >
                                                            🗑️ Eliminar
                                                        </button>
                                                    </div>
                                                ] : [])
                                            ]
                                        };
                                    })}
                                    emptyMessage="No hay ingresos contables registrados en el libro diario para este condominio"
                                />
                            </div>
                        </div>
                    ) : (
                        /* ================= EXPENSE SECTION ================= */
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-left">
                                    <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Historial de Egresos Contables ({filteredExpenses.length} / {expensesList.length})</span>
                                    {selectedExpenseCategory !== 'all' && (
                                        <button
                                            type="button"
                                            onClick={() => setSelectedExpenseCategory('all')}
                                            className="px-2 py-0.5 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-600 dark:text-rose-500 text-[10px] font-black rounded-lg transition-all"
                                        >
                                            Limpiar Filtro ×
                                        </button>
                                    )}
                                </div>
                                {!readOnly && (
                                    <button
                                        onClick={() => {
                                            setEditingExpense(null);
                                            setNewExpenseForm({ category: '', subcategory: '', amount: '', date: new Date().toISOString().substring(0, 10), description: '', property_id: '', user_id: '', distributable_method: 'prorated', tower_id: '' });
                                            setShowAddExpenseForm(!showAddExpenseForm);
                                        }}
                                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow transition-all"
                                    >
                                        {showAddExpenseForm ? 'Cerrar Formulario' : '➕ Registrar Egreso'}
                                    </button>
                                )}
                            </div>

                            {!readOnly && showAddExpenseForm && (
                                <form onSubmit={handleSaveExpense} className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-4 max-w-2xl text-left">
                                    <h5 className="text-xs font-bold text-rose-600 dark:text-rose-500 uppercase tracking-wide">{editingExpense ? '✏️ Editar Egreso Contable' : '📤 Registrar Nuevo Egreso Contable'}</h5>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="expense-category" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Categoría Financiera</label>
                                            <select
                                                id="expense-category"
                                                required
                                                value={newExpenseForm.category}
                                                onChange={(e) => setNewExpenseForm(prev => ({ ...prev, category: e.target.value, subcategory: '' }))}
                                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                            >
                                                <option value="">Seleccione Categoría...</option>
                                                {Object.entries(financialCatalog.expenses || {}).map(([key, obj]) => (
                                                    <option key={key} value={key}>{formatCategoryLabel(key, obj.label)}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="expense-subcategory" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Subcategoría Específica</label>
                                            <select
                                                id="expense-subcategory"
                                                required
                                                value={newExpenseForm.subcategory}
                                                onChange={(e) => setNewExpenseForm(prev => ({ ...prev, subcategory: e.target.value }))}
                                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                                disabled={!newExpenseForm.category}
                                            >
                                                <option value="">Seleccione Subcategoría...</option>
                                                {Object.entries(financialCatalog.expenses?.[newExpenseForm.category]?.subcategories || {}).map(([subKey, subName]) => (
                                                    <option key={subKey} value={subName}>{subName}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label htmlFor="expense-amount" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Monto ($ CLP)</label>
                                            <input
                                                id="expense-amount"
                                                type="number"
                                                required
                                                value={newExpenseForm.amount}
                                                onChange={(e) => setNewExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                                placeholder="Monto"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="expense-date" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Fecha Registro</label>
                                            <input
                                                id="expense-date"
                                                type="date"
                                                required
                                                value={newExpenseForm.date}
                                                onChange={(e) => setNewExpenseForm(prev => ({ ...prev, date: e.target.value }))}
                                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="expense-property" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Unidad (Opcional)</label>
                                            <select
                                                id="expense-property"
                                                value={newExpenseForm.property_id}
                                                onChange={(e) => setNewExpenseForm(prev => ({ ...prev, property_id: e.target.value }))}
                                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                            >
                                                <option value="">Ninguna...</option>
                                                {adminFilteredProperties.map(p => (
                                                    <option key={p.id} value={p.id}>Depto #{p.number}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="expense-user" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Personal / Receptor (Opcional)</label>
                                            <select
                                                id="expense-user"
                                                value={newExpenseForm.user_id}
                                                onChange={(e) => setNewExpenseForm(prev => ({ ...prev, user_id: e.target.value }))}
                                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                            >
                                                <option value="">Ninguno...</option>
                                                {adminFilteredUsers.map(u => (
                                                    <option key={u.id} value={u.id}>{u.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label htmlFor="expense-description" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Descripción / Detalles</label>
                                            <input
                                                id="expense-description"
                                                type="text"
                                                value={newExpenseForm.description}
                                                onChange={(e) => setNewExpenseForm(prev => ({ ...prev, description: e.target.value }))}
                                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                                placeholder="Comentarios adicionales o detalle del egreso"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="expense-dist-method" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Método de Distribución</label>
                                            <select
                                                id="expense-dist-method"
                                                value={newExpenseForm.distributable_method || 'prorated'}
                                                onChange={(e) => setNewExpenseForm(prev => ({ 
                                                    ...prev, 
                                                    distributable_method: e.target.value,
                                                    tower_id: e.target.value === 'tower_specific' ? prev.tower_id : '' 
                                                }))}
                                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                            >
                                                <option value="prorated">Prorrateado (Alícuota)</option>
                                                <option value="equal">Partes Iguales</option>
                                                <option value="tower_specific">Por Torre Específica</option>
                                                <option value="unit_specific">Unidad Específica</option>
                                                <option value="exempt">Exento</option>
                                            </select>
                                        </div>

                                        {newExpenseForm.distributable_method === 'tower_specific' ? (
                                            <div>
                                                <label htmlFor="expense-tower" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Torre Específica</label>
                                                <select
                                                    id="expense-tower"
                                                    required
                                                    value={newExpenseForm.tower_id || ''}
                                                    onChange={(e) => setNewExpenseForm(prev => ({ ...prev, tower_id: e.target.value }))}
                                                    className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                                >
                                                    <option value="">Seleccione Torre...</option>
                                                    {towersList.map(t => (
                                                        <option key={t.id} value={t.id}>{t.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        ) : (
                                            <div className="opacity-40 pointer-events-none">
                                                <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Torre Específica (Inactivo)</label>
                                                <select className="w-full bg-slate-100 dark:bg-slate-900 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-400 focus:outline-none" disabled>
                                                    <option>No aplica para este método</option>
                                                </select>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <button type="submit" className="px-4 py-2 bg-rose-650 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow">
                                            {editingExpense ? 'Guardar Cambios' : 'Registrar'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowAddExpenseForm(false);
                                                setEditingExpense(null);
                                                setNewExpenseForm({ category: '', subcategory: '', amount: '', date: '', description: '', property_id: '', user_id: '', distributable_method: 'prorated', tower_id: '' });
                                            }}
                                            className="px-4 py-2 bg-gray-200 dark:bg-slate-800 dark:text-white text-gray-700 font-bold text-xs rounded-xl"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                                <SimpleTable
                                    headers={['Categoría', 'Subcategoría', 'Monto', 'Fecha', 'Detalles', 'Distribución / Torre', 'Unidad/Destinatario', ...(!readOnly ? ['Acciones'] : [])]}
                                    rows={filteredExpenses.map(exp => {
                                        const labelVal = financialCatalog.expenses?.[exp.category]?.label || exp.category;
                                        const catName = formatCategoryLabel(exp.category, labelVal);
                                        const subName = exp.subcategory || 'N/A';
                                        
                                        const icons = { personal: '👷', servicios_basicos: '💧', mantencion: '🔧', seguridad: '🛡️', aseo_gasto_comun: '🧹', administracion: '📁', seguros: '☂️', certificaciones: '📜', reemplazos: '🆘' };
                                        const icon = icons[exp.category] || '💸';

                                        return {
                                            cells: [
                                                <span className="font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5" key={`cat-${exp.id}`}>{icon} {catName}</span>,
                                                <span className="font-semibold text-slate-500 dark:text-slate-400" key={`sub-${exp.id}`}>{subName}</span>,
                                                <span className="font-bold text-rose-600 dark:text-rose-400" key={`amt-${exp.id}`}>${Number(exp.amount).toLocaleString()}</span>,
                                                <span key={`date-${exp.id}`}>{new Date(exp.date + 'T12:00:00').toLocaleDateString('es-CL')}</span>,
                                                <span className="text-xs truncate max-w-xs block text-slate-500 dark:text-slate-400" title={exp.description} key={`desc-${exp.id}`}>{exp.description || '—'}</span>,
                                                <div key={`dist-${exp.id}`}>
                                                    <span className="capitalize font-semibold block text-xs">
                                                        {exp.distributable_method === 'prorated' ? 'Prorrateado' : 
                                                         exp.distributable_method === 'equal' ? 'Partes Iguales' : 
                                                         exp.distributable_method === 'tower_specific' ? 'Por Torre' : 
                                                         exp.distributable_method === 'unit_specific' ? 'Unidad Específica' : 
                                                         exp.distributable_method === 'exempt' ? 'Exento' : exp.distributable_method || 'Prorrateado'}
                                                    </span>
                                                    {exp.tower && <span className="text-[10px] text-indigo-500 font-bold block">{exp.tower.name}</span>}
                                                </div>,
                                                <div key={`unit-${exp.id}`}>
                                                    {exp.property && <span className="font-bold block text-xs">Depto #{exp.property.number}</span>}
                                                    {exp.user && <span className="text-[10px] text-slate-400 block">{exp.user.name}</span>}
                                                    {!exp.property && !exp.user && <span className="text-slate-400 text-[10px]">—</span>}
                                                </div>,
                                                ...(!readOnly ? [
                                                    <div className="flex items-center gap-2 justify-end" key={`act-${exp.id}`}>
                                                        <button
                                                            type="button"
                                                            aria-label={`Editar egreso ${exp.description || exp.category}`}
                                                            onClick={() => {
                                                                setEditingExpense(exp);
                                                                setNewExpenseForm({
                                                                    category: exp.category,
                                                                    subcategory: exp.subcategory || '',
                                                                    amount: String(exp.amount),
                                                                    date: exp.date ? exp.date.substring(0, 10) : '',
                                                                    description: exp.description || '',
                                                                    property_id: exp.property_id ? String(exp.property_id) : '',
                                                                    user_id: exp.user_id ? String(exp.user_id) : '',
                                                                    distributable_method: exp.distributable_method || 'prorated',
                                                                    tower_id: exp.tower_id ? String(exp.tower_id) : ''
                                                                });
                                                                setShowAddExpenseForm(true);
                                                            }}
                                                            className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 text-[10px] font-bold rounded-lg transition-all"
                                                        >
                                                            ✏️ Editar
                                                        </button>
                                                        <button
                                                            type="button"
                                                            aria-label={`Eliminar egreso ${exp.description || exp.category}`}
                                                            onClick={() => handleDeleteExpense(exp.id)}
                                                            className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 text-[10px] font-bold rounded-lg transition-all"
                                                        >
                                                            🗑️ Eliminar
                                                        </button>
                                                    </div>
                                                ] : [])
                                            ]
                                        };
                                    })}
                                    emptyMessage="No hay egresos contables registrados en el libro diario para este condominio"
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

            {selectedAviso && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSelectedAviso(null)}>
                    <div className="relative max-w-4xl w-full bg-white text-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh] border border-gray-100" onClick={(e) => e.stopPropagation()}>
                        {/* Close Button */}
                        <button 
                            onClick={() => setSelectedAviso(null)}
                            className="absolute top-4 right-4 p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 transition-all cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Modal Tabs */}
                        <div className="flex gap-2 border-b border-gray-100 pb-3 mb-6">
                            <button 
                                onClick={() => setModalSubTab('summary')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${modalSubTab === 'summary' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-transparent border-transparent text-gray-500 hover:text-gray-700'}`}
                            >
                                📋 1. Aviso de Cobro (Resumen)
                            </button>
                            <button 
                                onClick={() => setModalSubTab('breakdown')}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${modalSubTab === 'breakdown' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-transparent border-transparent text-gray-500 hover:text-gray-700'}`}
                            >
                                🔍 2. Desglose de Gastos del Mes
                            </button>
                        </div>

                        {modalSubTab === 'summary' ? (
                            <div className="space-y-6 text-left">
                                {/* Header (encabezado tabla resumen) */}
                                <div className="flex justify-between items-start border-b border-gray-200 pb-4 flex-wrap gap-4">
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-black text-slate-900">Condominio Aires de Chiguayante II</h3>
                                        <p className="text-[11px] text-gray-500">Coquimbo 615, CHIGUAYANTE</p>
                                        <p className="text-[11px] text-gray-500 font-mono">Rut 65.219.801-5</p>
                                        <p className="text-[11px] text-gray-500">Teléfono: 989269313</p>
                                        <p className="text-[11px] text-gray-500">Correo: <span className="underline text-indigo-600">condominioairesdechiguayante2@gmail.com</span></p>
                                    </div>
                                    <div className="text-right">
                                        <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Aviso de Cobro Obligación Económica</h2>
                                        <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[10px] font-black uppercase mt-1">EMITIDO</span>
                                    </div>
                                </div>

                                {/* Body Info Block */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-2xl border border-gray-100">
                                    <div className="space-y-1.5 text-xs">
                                        <div className="flex justify-between"><span className="text-gray-400 font-bold uppercase text-[9px]">Periodo:</span><span className="font-bold text-gray-900">ABRIL / 2026</span></div>
                                        <div className="flex justify-between"><span className="text-gray-400 font-bold uppercase text-[9px]">Departamento:</span><span className="font-mono font-bold text-gray-900">TORRE 1-{selectedAviso.property_id}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-400 font-bold uppercase text-[9px]">Fecha Emisión:</span><span className="font-bold text-gray-900">06-05-2026</span></div>
                                        <div className="flex justify-between"><span className="text-gray-400 font-bold uppercase text-[9px]">Fecha Vencimiento:</span><span className="font-bold text-rose-600">21-05-2026</span></div>
                                        <div className="flex justify-between"><span className="text-gray-400 font-bold uppercase text-[9px]">Residente:</span><span className="font-bold text-gray-900">{selectedAviso.user?.name || 'Lucelys Elena García Cova'}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-400 font-bold uppercase text-[9px]">Propietario:</span><span className="font-bold text-gray-900">{selectedAviso.user?.name || 'Lucelys Elena García Cova'}</span></div>
                                    </div>
                                    <div className="space-y-1.5 text-xs border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6">
                                        <div className="flex justify-between"><span className="text-gray-400 font-bold uppercase text-[9px]">Total Gastos Comunes:</span><span className="font-bold text-gray-900">$5.922.800</span></div>
                                        <div className="flex justify-between"><span className="text-gray-400 font-bold uppercase text-[9px]">Total Gastos No Prorrateables:</span><span className="font-bold text-gray-900">$0</span></div>
                                        <div className="flex justify-between"><span className="text-gray-400 font-bold uppercase text-[9px]">Total Ingresos:</span><span className="font-bold text-gray-900">$7.371.241</span></div>
                                        <div className="flex justify-between"><span className="text-gray-400 font-bold uppercase text-[9px]">Prorrateo Coeficiente:</span><span className="font-mono font-bold text-gray-900">0.0067220000 (0.6722%)</span></div>
                                        <div className="flex justify-between"><span className="text-gray-400 font-bold uppercase text-[9px]">Último Pago:</span><span className="font-bold text-gray-900">09/04/2026</span></div>
                                        <div className="flex justify-between"><span className="text-gray-400 font-bold uppercase text-[9px]">Último Monto Pagado:</span><span className="font-bold text-gray-900">$42.773</span></div>
                                    </div>
                                </div>

                                {/* Summary Table */}
                                <div className="border border-gray-150 rounded-2xl overflow-hidden shadow-sm">
                                    <table className="min-w-full divide-y divide-gray-100">
                                        <thead>
                                            <tr className="bg-slate-50 text-gray-400 uppercase text-[9px] font-bold tracking-wider">
                                                <th className="px-6 py-3 text-left">Concepto / Obligación</th>
                                                <th className="px-6 py-3 text-right">Monto</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 text-xs">
                                            <tr>
                                                <td className="px-6 py-3 text-left font-medium">Gasto Común Ordinario ($5.922.800 * 0.006722)</td>
                                                <td className="px-6 py-3 text-right font-mono font-bold text-slate-800">$39.813</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-3 text-left font-medium">Fondo Común de Reserva (5.000% sobre la base de $5.922.800)</td>
                                                <td className="px-6 py-3 text-right font-mono font-bold text-slate-800">$1.991</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-3 text-left font-medium">Intereses acumulados</td>
                                                <td className="px-6 py-3 text-right font-mono font-bold text-slate-800">$0</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-3 text-left font-medium">CGE TORRE 1 (Servicio Eléctrico Adicional)</td>
                                                <td className="px-6 py-3 text-right font-mono font-bold text-slate-800">$2.981</td>
                                            </tr>
                                            <tr className="bg-slate-50/50">
                                                <td className="px-6 py-3 text-left font-black uppercase text-[10px]">TOTAL GASTOS COMUNES DEL MES</td>
                                                <td className="px-6 py-3 text-right font-mono font-black text-slate-900">$44.785</td>
                                            </tr>
                                            <tr>
                                                <td className="px-6 py-3 text-left font-medium">Saldo meses anteriores</td>
                                                <td className="px-6 py-3 text-right font-mono font-bold text-slate-800">$0</td>
                                            </tr>
                                            <tr className="bg-slate-100/30">
                                                <td className="px-6 py-4 text-left font-black text-indigo-600 uppercase text-[11px]">TOTAL A PAGAR (Obligación Económica Ley 21.442 Art. 2°)</td>
                                                <td className="px-6 py-4 text-right font-mono font-black text-indigo-600 text-sm">{"$"}{Number(selectedAviso.amount).toLocaleString('es-CL')}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Footer (pie de pagina) */}
                                <div className="bg-amber-50/20 border border-amber-200/50 p-5 rounded-2xl text-[10px] space-y-2 text-slate-600 leading-relaxed">
                                    <span className="font-extrabold text-amber-700 block text-[11px] uppercase tracking-wider">⚠️ INFORMATIVO DE COBRO</span>
                                    <p>1.- El presente Estado de Cuenta se considera <strong>APROBADO</strong> si al cabo de cinco días de recibido, este no ha sido objetado por la comunidad.</p>
                                    <p>2.- Cualquier duda o consulta hacerla llegar al correo electrónico: <strong className="text-indigo-600 underline">condominioairesdechiguayante2@gmail.com</strong></p>
                                    <p>3.- <strong>Formas de Pago GG.CC.:</strong> Cheque nominativo y cruzado a nombre de <strong>CONDOMINIO AIRES DE CHIGUAYANTE II</strong> o Transferencia Electrónica o Depósito en cuenta corriente <strong>BANCO SCOTIABANK N° 985375739, RUT N° 65.219.801-5</strong>. Enviar comprobante al mismo correo, indicando número de departamento.</p>
                                    <p>4.- Los morosos de GG.CC. deberán pagar la Multa estipulada en el Reglamento de Copropiedad, Reglamento Interno y además los Intereses estipulados en la Ley de Copropiedad.</p>
                                    <p className="text-rose-600 font-bold">5.- Tenga presente que la morosidad en el pago de GG.CC. permite la suspensión inmediata de la Energía Eléctrica, como se estipula en el Reglamento de Copropiedad, Reglamento Interno y en la Ley de Copropiedad.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6 text-left">
                                {/* Header Desglose */}
                                <div className="flex justify-between items-start border-b border-gray-200 pb-4 flex-wrap gap-4">
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-black text-slate-900">Condominio Aires de Chiguayante II</h3>
                                        <p className="text-[11px] text-gray-500 font-mono">Rut 65.219.801-5 &bull; Coquimbo 615, CHIGUAYANTE</p>
                                    </div>
                                    <div className="text-right">
                                        <h2 className="text-lg font-black text-slate-900 tracking-tight uppercase">Informe de Gastos del Mes</h2>
                                        <p className="text-xs font-black text-indigo-600 uppercase">ABRIL de 2026</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest block">GASTOS PRORRATEABLES</span>
                                    
                                    {/* 0100 Gastos de Administración */}
                                    <div className="border border-gray-150 rounded-2xl overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-100 text-xs">
                                            <thead>
                                                <tr className="bg-slate-50 font-black text-slate-700">
                                                    <th className="px-4 py-2.5 text-left w-16">Cuenta</th>
                                                    <th className="px-4 py-2.5 text-left">Descripción - GASTOS DE ADMINISTRACION</th>
                                                    <th className="px-4 py-2.5 text-right w-32">Monto</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                <tr><td className="px-4 py-2 font-mono text-gray-400">0101</td><td className="px-4 py-2">SUELDOS LIQUIDOS</td><td className="px-4 py-2 text-right font-mono font-semibold">$2.881.159</td></tr>
                                                <tr><td className="px-4 py-2 font-mono text-gray-400">0102</td><td className="px-4 py-2">COTIZACIONES PREVISIONALES</td><td className="px-4 py-2 text-right font-mono font-semibold">$713.533</td></tr>
                                                <tr><td className="px-4 py-2 font-mono text-gray-400">0107</td><td className="px-4 py-2">HONORARIOS ADMINISTRADOR</td><td className="px-4 py-2 text-right font-mono font-semibold">$500.000</td></tr>
                                                <tr><td className="px-4 py-2 font-mono text-gray-400">0109</td><td className="px-4 py-2">ANTICIPOS DE SUELDOS</td><td className="px-4 py-2 text-right font-mono font-semibold">$100.000</td></tr>
                                                <tr><td className="px-4 py-2 font-mono text-gray-400">0113</td><td className="px-4 py-2">PLATAFORMA GASTOS COMUNES</td><td className="px-4 py-2 text-right font-mono font-semibold">$25.000</td></tr>
                                                <tr><td className="px-4 py-2 font-mono text-gray-400">0118</td><td className="px-4 py-2">REEMPLAZO LICENCIA MEDICA</td><td className="px-4 py-2 text-right font-mono font-semibold">$480.000</td></tr>
                                                <tr className="bg-slate-50/40 font-bold"><td colSpan={2} className="px-4 py-2 text-left uppercase text-[10px]">Total Item Gastos de Administración</td><td className="px-4 py-2 text-right font-mono">$4.699.692</td></tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* 0200 Gastos de Mantenimiento */}
                                    <div className="border border-gray-150 rounded-2xl overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-100 text-xs">
                                            <thead>
                                                <tr className="bg-slate-50 font-black text-slate-700">
                                                    <th className="px-4 py-2.5 text-left w-16">Cuenta</th>
                                                    <th className="px-4 py-2.5 text-left">Descripción - GASTOS DE MANTENCION</th>
                                                    <th className="px-4 py-2.5 text-right w-32">Monto</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                <tr><td className="px-4 py-2 font-mono text-gray-400">0240</td><td className="px-4 py-2">FUMIGACION, DESRATIZAC.Y SANITIZ. AREAS USO COMUN</td><td className="px-4 py-2 text-right font-mono font-semibold">$89.250</td></tr>
                                                <tr><td className="px-4 py-2 font-mono text-gray-400">0251</td><td className="px-4 py-2">CORTE DE PASTO</td><td className="px-4 py-2 text-right font-mono font-semibold">$120.000</td></tr>
                                                <tr><td className="px-4 py-2 font-mono text-gray-400">0252</td><td className="px-4 py-2">RIEGO Y DESMALEZADO</td><td className="px-4 py-2 text-right font-mono font-semibold">$165.000</td></tr>
                                                <tr><td className="px-4 py-2 font-mono text-gray-400">0261</td><td className="px-4 py-2">CAMBIO POSICION FOTOCELDA PORTON SALIDA VEHICULAR</td><td className="px-4 py-2 text-right font-mono font-semibold">$66.000</td></tr>
                                                <tr><td className="px-4 py-2 font-mono text-gray-400">0262</td><td className="px-4 py-2">REVISIÓN PORTON - CAMBIO LUMINARIA</td><td className="px-4 py-2 text-right font-mono font-semibold">$88.680</td></tr>
                                                <tr className="bg-slate-50/40 font-bold"><td colSpan={2} className="px-4 py-2 text-left uppercase text-[10px]">Total Item Gastos de Mantención</td><td className="px-4 py-2 text-right font-mono">$528.930</td></tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* 0400 Gastos de Uso o Consumo */}
                                    <div className="border border-gray-150 rounded-2xl overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-100 text-xs">
                                            <thead>
                                                <tr className="bg-slate-50 font-black text-slate-700">
                                                    <th className="px-4 py-2.5 text-left w-16">Cuenta</th>
                                                    <th className="px-4 py-2.5 text-left">Descripción - GASTOS DE USO O CONSUMO</th>
                                                    <th className="px-4 py-2.5 text-right w-32">Monto</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                <tr><td className="px-4 py-2 font-mono text-gray-400">0401</td><td className="px-4 py-2">ENERGIA ELECTRICA</td><td className="px-4 py-2 text-right font-mono font-semibold">$476.000</td></tr>
                                                <tr><td className="px-4 py-2 font-mono text-gray-400">0402</td><td className="px-4 py-2">AGUA POTABLE</td><td className="px-4 py-2 text-right font-mono font-semibold">$16.640</td></tr>
                                                <tr><td className="px-4 py-2 font-mono text-gray-400">0406</td><td className="px-4 py-2">ARTICULOS DE ASEO</td><td className="px-4 py-2 text-right font-mono font-semibold">$78.590</td></tr>
                                                <tr><td className="px-4 py-2 font-mono text-gray-400">0463</td><td className="px-4 py-2">GUANTES DE TRABAJO</td><td className="px-4 py-2 text-right font-mono font-semibold">$7.590</td></tr>
                                                <tr><td className="px-4 py-2 font-mono text-gray-400">0464</td><td className="px-4 py-2">SILLA PORTERIA</td><td className="px-4 py-2 text-right font-mono font-semibold">$77.980</td></tr>
                                                <tr><td className="px-4 py-2 font-mono text-gray-400">0465</td><td className="px-4 py-2">CERRADURA PUERTA SADA BASURA</td><td className="px-4 py-2 text-right font-mono font-semibold">$30.888</td></tr>
                                                <tr><td className="px-4 py-2 font-mono text-gray-400">0466</td><td className="px-4 py-2">REMACHADORA</td><td className="px-4 py-2 text-right font-mono font-semibold">$6.490</td></tr>
                                                <tr className="bg-slate-50/40 font-bold"><td colSpan={2} className="px-4 py-2 text-left uppercase text-[10px]">Total Item Gastos de Uso o Consumo</td><td className="px-4 py-2 text-right font-mono">$694.178</td></tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Consolidated summary totals */}
                                    <div className="bg-slate-50 border border-gray-200 p-4 rounded-2xl text-xs space-y-1.5 font-bold">
                                        <div className="flex justify-between"><span>TOTAL GASTOS PRORRATEABLES</span><span className="font-mono">$5.922.800</span></div>
                                        <div className="flex justify-between text-gray-400"><span>TOTAL GASTOS NO PRORRATEABLES</span><span className="font-mono">$0</span></div>
                                        <div className="flex justify-between text-indigo-600 text-sm border-t border-gray-200 pt-1.5 mt-1.5"><span>TOTAL DE GASTOS DE LA COMUNIDAD</span><span className="font-mono font-black">$5.922.800</span></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
