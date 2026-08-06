import { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { SimpleTable, StatusBadge } from '@/Components/DashboardShared';
import UnitDetailModal360 from '@/Components/Admin/UnitDetailModal360';

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
    finesList = [],
    ticketsList = [],
    readOnly = false
}) {
    const [selectedAviso, setSelectedAviso] = useState(null);
    const [inspectingUnit360, setInspectingUnit360] = useState(null);
    const activeCondo = allCondominiums.find(c => c.id === Number(adminCondoId));
    const [modalSubTab, setModalSubTab] = useState('summary');
    const [expenseStep, setExpenseStep] = useState(1);
    const [isInstallmentsActive, setIsInstallmentsActive] = useState(false);
    const [installmentsCount, setInstallmentsCount] = useState(3);

    // Filter states for Recaudación (Payments)
    const [paymentsSearch, setPaymentsSearch] = useState('');
    const [paymentsStatusFilter, setPaymentsStatusFilter] = useState('all');
    const [paymentsStartDate, setPaymentsStartDate] = useState('');
    const [paymentsEndDate, setPaymentsEndDate] = useState('');
    const [paymentsSortBy, setPaymentsSortBy] = useState('date_desc');

    // Filter states for Ingresos (Incomes)
    const [incomeSearch, setIncomeSearch] = useState('');
    const [incomeStartDate, setIncomeStartDate] = useState('');
    const [incomeEndDate, setIncomeEndDate] = useState('');
    const [incomeSortBy, setIncomeSortBy] = useState('date_desc');

    // Filter states for Egresos (Expenses)
    const [expenseSearch, setExpenseSearch] = useState('');
    const [expenseStartDate, setExpenseStartDate] = useState('');
    const [expenseEndDate, setExpenseEndDate] = useState('');
    const [expenseSortBy, setExpenseSortBy] = useState('date_desc');

    const displayPayments = adminFilteredPayments.length > 0 
        ? adminFilteredPayments 
        : (paymentsList.length > 0 
            ? paymentsList 
            : incomesList.map(inc => ({
                id: inc.id,
                property_id: inc.property_id || inc.property?.number || 101,
                user: inc.user || { name: inc.description || 'Vecino / Copropietario' },
                amount: inc.amount,
                payment_method: 'transfer',
                payment_date: inc.date || new Date().toISOString(),
                status: 'completed'
            }))
        );

    // Computed filtered list for Recaudación
    const filteredDisplayPayments = useMemo(() => {
        let list = [...displayPayments];

        if (paymentsStatusFilter !== 'all') {
            list = list.filter(p => p.status === paymentsStatusFilter);
        }
        if (paymentsSearch.trim()) {
            const q = paymentsSearch.toLowerCase().trim();
            list = list.filter(p => 
                String(p.property_id || p.property?.number || '').toLowerCase().includes(q) ||
                String(p.user?.name || '').toLowerCase().includes(q) ||
                String(p.payment_method || '').toLowerCase().includes(q)
            );
        }
        if (paymentsStartDate) {
            list = list.filter(p => (p.payment_date || '').substring(0, 10) >= paymentsStartDate);
        }
        if (paymentsEndDate) {
            list = list.filter(p => (p.payment_date || '').substring(0, 10) <= paymentsEndDate);
        }

        return list.sort((a, b) => {
            if (paymentsSortBy === 'date_desc') return (b.payment_date || '').localeCompare(a.payment_date || '');
            if (paymentsSortBy === 'date_asc') return (a.payment_date || '').localeCompare(b.payment_date || '');
            if (paymentsSortBy === 'amount_desc') return Number(b.amount || 0) - Number(a.amount || 0);
            if (paymentsSortBy === 'amount_asc') return Number(a.amount || 0) - Number(b.amount || 0);
            if (paymentsSortBy === 'user_asc') return (a.user?.name || '').localeCompare(b.user?.name || '');
            if (paymentsSortBy === 'user_desc') return (b.user?.name || '').localeCompare(a.user?.name || '');
            if (paymentsSortBy === 'prop_asc') return Number(a.property_id || 0) - Number(b.property_id || 0);
            if (paymentsSortBy === 'prop_desc') return Number(b.property_id || 0) - Number(a.property_id || 0);
            if (paymentsSortBy === 'method_asc') return (a.payment_method || '').localeCompare(b.payment_method || '');
            if (paymentsSortBy === 'method_desc') return (b.payment_method || '').localeCompare(a.payment_method || '');
            if (paymentsSortBy === 'status_asc') return (a.status || '').localeCompare(b.status || '');
            if (paymentsSortBy === 'status_desc') return (b.status || '').localeCompare(a.status || '');
            return 0;
        });
    }, [displayPayments, paymentsStatusFilter, paymentsSearch, paymentsStartDate, paymentsEndDate, paymentsSortBy]);

    // Computed filtered list for Incomes
    const finalFilteredIncomes = useMemo(() => {
        let list = [...filteredIncomes];

        if (incomeSearch.trim()) {
            const q = incomeSearch.toLowerCase().trim();
            list = list.filter(inc => 
                String(inc.description || '').toLowerCase().includes(q) ||
                String(inc.category || '').toLowerCase().includes(q) ||
                String(inc.subcategory || '').toLowerCase().includes(q) ||
                String(inc.property_id || inc.property?.number || '').toLowerCase().includes(q)
            );
        }
        if (incomeStartDate) {
            list = list.filter(inc => (inc.date || '').substring(0, 10) >= incomeStartDate);
        }
        if (incomeEndDate) {
            list = list.filter(inc => (inc.date || '').substring(0, 10) <= incomeEndDate);
        }

        return list.sort((a, b) => {
            if (incomeSortBy === 'date_desc') return (b.date || '').localeCompare(a.date || '');
            if (incomeSortBy === 'date_asc') return (a.date || '').localeCompare(b.date || '');
            if (incomeSortBy === 'amount_desc') return Number(b.amount || 0) - Number(a.amount || 0);
            if (incomeSortBy === 'amount_asc') return Number(a.amount || 0) - Number(b.amount || 0);
            return 0;
        });
    }, [filteredIncomes, incomeSearch, incomeStartDate, incomeEndDate, incomeSortBy]);

    // Computed filtered list for Expenses
    const finalFilteredExpenses = useMemo(() => {
        let list = [...filteredExpenses];

        if (expenseSearch.trim()) {
            const q = expenseSearch.toLowerCase().trim();
            list = list.filter(exp => 
                String(exp.description || '').toLowerCase().includes(q) ||
                String(exp.category || '').toLowerCase().includes(q) ||
                String(exp.subcategory || '').toLowerCase().includes(q) ||
                String(exp.user?.name || '').toLowerCase().includes(q)
            );
        }
        if (expenseStartDate) {
            list = list.filter(exp => (exp.date || '').substring(0, 10) >= expenseStartDate);
        }
        if (expenseEndDate) {
            list = list.filter(exp => (exp.date || '').substring(0, 10) <= expenseEndDate);
        }

        return list.sort((a, b) => {
            if (expenseSortBy === 'date_desc') return (b.date || '').localeCompare(a.date || '');
            if (expenseSortBy === 'date_asc') return (a.date || '').localeCompare(b.date || '');
            if (expenseSortBy === 'amount_desc') return Number(b.amount || 0) - Number(a.amount || 0);
            if (expenseSortBy === 'amount_asc') return Number(a.amount || 0) - Number(b.amount || 0);
            return 0;
        });
    }, [filteredExpenses, expenseSearch, expenseStartDate, expenseEndDate, expenseSortBy]);

    // KPI Aggregate Metrics
    const totalCompletedPayments = useMemo(() => 
        filteredDisplayPayments.filter(p => p.status === 'completed' || p.status === 'approved').reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
    , [filteredDisplayPayments]);

    const totalPendingPayments = useMemo(() => 
        filteredDisplayPayments.filter(p => p.status === 'pending').reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
    , [filteredDisplayPayments]);

    const avgPaymentAmount = useMemo(() => 
        filteredDisplayPayments.length > 0 ? Math.round(filteredDisplayPayments.reduce((acc, curr) => acc + Number(curr.amount || 0), 0) / filteredDisplayPayments.length) : 0
    , [filteredDisplayPayments]);

    const totalIncomeAmount = useMemo(() => 
        finalFilteredIncomes.reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
    , [finalFilteredIncomes]);

    const totalIncomeGGCC = useMemo(() => 
        finalFilteredIncomes.filter(i => i.category === 'gastos_comunes').reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
    , [finalFilteredIncomes]);

    const totalIncomeOther = useMemo(() => 
        finalFilteredIncomes.filter(i => i.category !== 'gastos_comunes').reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
    , [finalFilteredIncomes]);

    const totalExpenseAmount = useMemo(() => 
        finalFilteredExpenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
    , [finalFilteredExpenses]);

    const totalExpenseOps = useMemo(() => 
        finalFilteredExpenses.filter(e => ['personal', 'servicios_basicos', 'administracion', 'seguridad', 'limpieza'].includes(e.category)).reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
    , [finalFilteredExpenses]);

    const totalExpenseMaint = useMemo(() => 
        finalFilteredExpenses.filter(e => ['mantencion', 'reparacion', 'fondo_reserva'].includes(e.category)).reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
    , [finalFilteredExpenses]);

    // Computación dinámica del resumen financiero directo desde registros reales filtrados por condominio
    const computedFinanceSummary = useMemo(() => {
        const incomesSource = filteredIncomes.length > 0 ? filteredIncomes : incomesList;
        const expensesSource = filteredExpenses.length > 0 ? filteredExpenses : expensesList;

        const incomesCatMap = {};
        let totalIncomes = 0;
        incomesSource.forEach(inc => {
            const amt = Number(inc.amount || 0);
            const cat = inc.category || 'otro';
            incomesCatMap[cat] = (incomesCatMap[cat] || 0) + amt;
            totalIncomes += amt;
        });

        const expensesCatMap = {};
        let totalExpenses = 0;
        expensesSource.forEach(exp => {
            const amt = Number(exp.amount || 0);
            const cat = exp.category || 'otro';
            expensesCatMap[cat] = (expensesCatMap[cat] || 0) + amt;
            totalExpenses += amt;
        });

        return {
            total_incomes: totalIncomes,
            total_expenses: totalExpenses,
            balance: totalIncomes - totalExpenses,
            incomes_by_category: incomesCatMap,
            expenses_by_category: expensesCatMap,
        };
    }, [filteredIncomes, incomesList, filteredExpenses, expensesList]);

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

    const [isBannerDismissed, setIsBannerDismissed] = useState(false);

    return (
        <div className="space-y-6 animate-fade-in text-left font-outfit">
            {/* Banner de Cabecera Generoso Colapsable del Módulo de Finanzas */}
            {!isBannerDismissed ? (
                <div className="bg-gradient-to-r from-indigo-50/80 via-white to-slate-50 dark:from-indigo-950/60 dark:via-slate-900 dark:to-slate-950 border border-indigo-200/80 dark:border-indigo-900/40 rounded-2xl p-6 relative overflow-hidden shadow-xs">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                        <div className="space-y-1 max-w-3xl">
                            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                                💰 Motor Contable & Tesorería
                            </span>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                Finanzas, Libro Diario & Recaudación
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                Contabilidad integral y libro diario contable del condominio. Registre la recaudación de Gastos Comunes, concilie egresos operativos de proveedores y mantenimiento, audite el fondo de reserva y verifique el balance contable en tiempo real.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsBannerDismissed(true)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shrink-0 self-start md:self-center"
                            title="Minimizar cabecera informativa"
                        >
                            <span>✕ Minimizar</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex justify-start">
                    <button
                        type="button"
                        onClick={() => setIsBannerDismissed(false)}
                        className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800/60"
                    >
                        <span>ℹ️ Mostrar guía de Finanzas & Tesorería</span>
                        <span>▼</span>
                    </button>
                </div>
            )}

            {/* Tabs header selector - 4 Pestañas Claras */}
            <div className="flex border-b border-gray-150 dark:border-slate-800/80 overflow-x-auto">
                <button
                    onClick={() => setPaymentsTabMode('ledger')}
                    className={`px-5 py-3 font-bold text-xs uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${paymentsTabMode === 'ledger' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400' : 'border-transparent text-gray-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                    ⚖️ Libro Diario Contable
                </button>
                <button
                    onClick={() => setPaymentsTabMode('payments')}
                    className={`px-5 py-3 font-bold text-xs uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${paymentsTabMode === 'payments' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400' : 'border-transparent text-gray-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                    💵 Recaudación (Copropietarios)
                </button>
                <button
                    onClick={() => {
                        setPaymentsTabMode('incomes');
                        setLedgerSubTab('incomes');
                    }}
                    className={`px-5 py-3 font-bold text-xs uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${paymentsTabMode === 'incomes' ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400' : 'border-transparent text-gray-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                    📥 Ingresos Contables
                </button>
                <button
                    onClick={() => {
                        setPaymentsTabMode('expenses');
                        setLedgerSubTab('expenses');
                    }}
                    className={`px-5 py-3 font-bold text-xs uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${paymentsTabMode === 'expenses' ? 'border-rose-600 text-rose-600 dark:text-rose-400 dark:border-rose-400' : 'border-transparent text-gray-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                    📤 Egresos Contables
                </button>
            </div>

            {paymentsTabMode === 'payments' ? (
                <div className="space-y-6 animate-fade-in text-left">
                    {/* KPI Cards Recaudación */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
                            <div className="flex justify-between items-center text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400">
                                <span>Total Recaudado</span>
                                <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">Conciliados</span>
                            </div>
                            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
                                ${totalCompletedPayments.toLocaleString('es-CL')} <span className="text-xs text-slate-400 font-medium">CLP</span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
                            <div className="flex justify-between items-center text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400">
                                <span>En Conciliación</span>
                                <span className="text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full font-bold">Pendientes</span>
                            </div>
                            <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-2">
                                ${totalPendingPayments.toLocaleString('es-CL')} <span className="text-xs text-slate-400 font-medium">CLP</span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
                            <div className="flex justify-between items-center text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400">
                                <span>Abono Promedio</span>
                                <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full font-bold">Promedio</span>
                            </div>
                            <div className="text-xl font-black text-slate-900 dark:text-white mt-2">
                                ${avgPaymentAmount.toLocaleString('es-CL')} <span className="text-xs text-slate-400 font-medium">CLP</span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
                            <div className="flex justify-between items-center text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400">
                                <span>Total Pagos</span>
                                <span className="text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-bold">Procesados</span>
                            </div>
                            <div className="text-xl font-black text-slate-900 dark:text-white mt-2">
                                {filteredDisplayPayments.length} <span className="text-xs text-slate-400 font-medium">Transacciones</span>
                            </div>
                        </div>
                    </div>

                    {/* Toolbar de Filtros Interactivos Recaudación */}
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-left">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:flex items-center gap-2 flex-1">
                            {/* Buscador */}
                            <div className="relative flex-1 min-w-[180px]">
                                <input
                                    type="text"
                                    value={paymentsSearch}
                                    onChange={(e) => setPaymentsSearch(e.target.value)}
                                    placeholder="🔍 Depto #, Vecino, Método..."
                                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                            </div>

                            {/* Estado */}
                            <select
                                value={paymentsStatusFilter}
                                onChange={(e) => setPaymentsStatusFilter(e.target.value)}
                                className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer"
                            >
                                <option value="all">🔍 Todos los Estados</option>
                                <option value="completed">✅ Conciliados / Completados</option>
                                <option value="pending">⏳ Pendientes de Revisión</option>
                                <option value="failed">❌ Rechazados</option>
                            </select>

                            {/* Fechas */}
                            <div className="flex items-center gap-1">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Desde:</span>
                                <input
                                    type="date"
                                    value={paymentsStartDate}
                                    onChange={(e) => setPaymentsStartDate(e.target.value)}
                                    className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-2 py-1.5 text-xs font-medium text-slate-800 dark:text-white"
                                />
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Hasta:</span>
                                <input
                                    type="date"
                                    value={paymentsEndDate}
                                    onChange={(e) => setPaymentsEndDate(e.target.value)}
                                    className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-2 py-1.5 text-xs font-medium text-slate-800 dark:text-white"
                                />
                            </div>

                            {/* Orden */}
                            <select
                                value={paymentsSortBy}
                                onChange={(e) => setPaymentsSortBy(e.target.value)}
                                className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer"
                            >
                                <option value="date_desc">📅 Más Recientes</option>
                                <option value="date_asc">📅 Más Antiguas</option>
                                <option value="amount_desc">💰 Mayor Monto</option>
                                <option value="amount_asc">💰 Menor Monto</option>
                            </select>

                            {/* Limpiar */}
                            {(paymentsSearch || paymentsStatusFilter !== 'all' || paymentsStartDate || paymentsEndDate || paymentsSortBy !== 'date_desc') && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPaymentsSearch('');
                                        setPaymentsStatusFilter('all');
                                        setPaymentsStartDate('');
                                        setPaymentsEndDate('');
                                        setPaymentsSortBy('date_desc');
                                    }}
                                    className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-extrabold rounded-xl border border-rose-500/30 transition-all whitespace-nowrap"
                                >
                                    Limpiar Filtros ×
                                </button>
                            )}
                        </div>

                        {!readOnly && (
                            <button
                                onClick={() => {
                                    setEditingPayment(null);
                                    setNewPaymentForm({ user_id: '', property_id: '', amount: '', payment_method: 'transfer', status: 'completed' });
                                    setShowAddPaymentForm(!showAddPaymentForm);
                                }}
                                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition-all whitespace-nowrap shrink-0"
                            >
                                {showAddPaymentForm ? 'Cerrar Form' : '➕ Registrar Pago'}
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
                            headers={[
                                <button key="hdr-user" type="button" onClick={() => setPaymentsSortBy(paymentsSortBy === 'user_asc' ? 'user_desc' : 'user_asc')} className="font-extrabold flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400">
                                    <span>Vecino</span>
                                    <span>{paymentsSortBy === 'user_asc' ? '⬆️' : paymentsSortBy === 'user_desc' ? '⬇️' : '↕️'}</span>
                                </button>,
                                <button key="hdr-prop" type="button" onClick={() => setPaymentsSortBy(paymentsSortBy === 'prop_asc' ? 'prop_desc' : 'prop_asc')} className="font-extrabold flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400">
                                    <span>Propiedad</span>
                                    <span>{paymentsSortBy === 'prop_asc' ? '⬆️' : paymentsSortBy === 'prop_desc' ? '⬇️' : '↕️'}</span>
                                </button>,
                                <button key="hdr-amt" type="button" onClick={() => setPaymentsSortBy(paymentsSortBy === 'amount_asc' ? 'amount_desc' : 'amount_asc')} className="font-extrabold flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400">
                                    <span>Monto</span>
                                    <span>{paymentsSortBy === 'amount_asc' ? '⬆️' : paymentsSortBy === 'amount_desc' ? '⬇️' : '↕️'}</span>
                                </button>,
                                <button key="hdr-method" type="button" onClick={() => setPaymentsSortBy(paymentsSortBy === 'method_asc' ? 'method_desc' : 'method_asc')} className="font-extrabold flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400">
                                    <span>Método</span>
                                    <span>{paymentsSortBy === 'method_asc' ? '⬆️' : paymentsSortBy === 'method_desc' ? '⬇️' : '↕️'}</span>
                                </button>,
                                <button key="hdr-date" type="button" onClick={() => setPaymentsSortBy(paymentsSortBy === 'date_asc' ? 'date_desc' : 'date_asc')} className="font-extrabold flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400">
                                    <span>Fecha</span>
                                    <span>{paymentsSortBy === 'date_asc' ? '⬆️' : paymentsSortBy === 'date_desc' ? '⬇️' : '↕️'}</span>
                                </button>,
                                <button key="hdr-status" type="button" onClick={() => setPaymentsSortBy(paymentsSortBy === 'status_asc' ? 'status_desc' : 'status_asc')} className="font-extrabold flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400">
                                    <span>Estado</span>
                                    <span>{paymentsSortBy === 'status_asc' ? '⬆️' : paymentsSortBy === 'status_desc' ? '⬇️' : '↕️'}</span>
                                </button>,
                                'Documentos',
                                ...(!readOnly ? ['Acciones'] : [])
                            ]}
                            rows={filteredDisplayPayments.map(p => ({
                                cells: [
                                    <button
                                        key={`user-${p.id}`}
                                        type="button"
                                        onClick={() => setInspectingUnit360({ 
                                            number: p.property_id, 
                                            id: p.property_id, 
                                            owner: p.user?.name || 'Vecino',
                                            user: p.user
                                        })}
                                        className="font-black text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer text-left"
                                        title="Ver Ficha Técnica 360° del Vecino"
                                    >
                                        <span>👤 {p.user?.name || 'Vecino'}</span>
                                    </button>,
                                    <button
                                        key={`prop-${p.id}`}
                                        type="button"
                                        onClick={() => setInspectingUnit360({ number: p.property_id, id: p.property_id })}
                                        className="font-black text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                                        title="Ver Ficha Técnica 360°"
                                    >
                                        <span>🏢 Depto #{p.property_id}</span>
                                    </button>,
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
                                        <div className="flex items-center justify-center gap-1.5" key={`act-${p.id}`}>
                                            <button
                                                type="button"
                                                title="Editar pago"
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
                                                className="px-2 py-1 sm:px-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 text-xs font-bold rounded-lg transition-all shadow-xs hover:scale-105 active:scale-95 flex items-center gap-1"
                                            >
                                                <span>✏️</span>
                                                <span className="hidden sm:inline">Editar</span>
                                            </button>
                                            <button
                                                type="button"
                                                title="Borrar pago"
                                                aria-label={`Borrar pago de ${p.user?.name || 'vecino'}`}
                                                onClick={() => {
                                                    if (confirm('¿Desea eliminar este registro de pago?')) {
                                                        setPaymentsList(prev => prev.filter(item => item.id !== p.id));
                                                    }
                                                }}
                                                className="px-2 py-1 sm:px-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 text-xs font-bold rounded-lg transition-all shadow-xs hover:scale-105 active:scale-95 flex items-center gap-1"
                                            >
                                                <span>🗑️</span>
                                                <span className="hidden sm:inline">Borrar</span>
                                            </button>
                                        </div>
                                    ] : [])
                                ]
                            }))}
                            emptyMessage="No hay cobros ni ingresos registrados para este condominio"
                        />
                    </div>
                </div>
            ) : paymentsTabMode === 'ledger' ? (
                <div className="space-y-6 animate-fade-in">
                    {/* Summary KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-gray-100 dark:border-slate-800/80">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Ingresos Contables</p>
                                    <h3 className="text-xl font-black text-emerald-600 dark:text-emerald-500 mt-1">${Number(computedFinanceSummary.total_incomes).toLocaleString('es-CL')}</h3>
                                </div>
                                <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">📥</div>
                            </div>
                        </div>
                        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-gray-100 dark:border-slate-800/80">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Egresos Contables</p>
                                    <h3 className="text-xl font-black text-rose-600 dark:text-rose-400 mt-1">${Number(computedFinanceSummary.total_expenses).toLocaleString('es-CL')}</h3>
                                </div>
                                <div className="p-2 bg-rose-500/10 rounded-xl text-rose-500">📤</div>
                            </div>
                        </div>
                        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-gray-100 dark:border-slate-800/80">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Balance de Caja</p>
                                    <h3 className={`text-xl font-black mt-1 ${Number(computedFinanceSummary.balance) >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-amber-600 dark:text-amber-500'}`}>
                                        ${Number(computedFinanceSummary.balance).toLocaleString('es-CL')}
                                    </h3>
                                </div>
                                <div className={`p-2 rounded-xl ${Number(computedFinanceSummary.balance) >= 0 ? 'bg-indigo-500/10 text-indigo-500' : 'bg-amber-500/10 text-amber-500'}`}>⚖️</div>
                            </div>
                        </div>
                    </div>

                    {/* Financial Cashflow Ratio Bar with Centered Break-Even Point (0) */}
                    {(() => {
                        const incomes = Number(computedFinanceSummary.total_incomes || 0);
                        const expenses = Number(computedFinanceSummary.total_expenses || 0);
                        const netBalance = incomes - expenses;
                        const isSurplus = netBalance >= 0;
                        const totalVolume = incomes + expenses;
                        const netPercentage = totalVolume > 0 ? ((Math.abs(netBalance) / totalVolume) * 100).toFixed(1) : '0.0';
                        const displacementWidth = Math.min(50, Math.round((Math.abs(netBalance) / (incomes || 1)) * 50));

                        return (
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-4 text-left">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                                    <div>
                                        <h5 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                            <span>⚖️</span> Equilibrio Financiero & Flujo Neto de Caja
                                        </h5>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                            El eje central representa el punto de equilibrio 1:1 entre ingresos y egresos.
                                        </p>
                                    </div>
                                    <div className={`px-3 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 shadow-xs ${
                                        isSurplus 
                                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' 
                                            : 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                                    }`}>
                                        <span>{isSurplus ? '📈' : '📉'}</span>
                                        <span>{isSurplus ? `Superávit Neto: +$${netBalance.toLocaleString('es-CL')} (+${netPercentage}%)` : `Déficit Neto: -$${Math.abs(netBalance).toLocaleString('es-CL')} (-${netPercentage}%)`}</span>
                                    </div>
                                </div>

                                <div className="relative pt-6 pb-2">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-300 dark:border-slate-700 shadow-xs z-10">
                                            Punto 0 (Equilibrio)
                                        </span>
                                        <div className="w-0.5 h-10 bg-slate-300 dark:bg-slate-700" />
                                    </div>

                                    <div className="w-full bg-slate-100 dark:bg-slate-800/80 rounded-full h-5 relative flex overflow-hidden border border-slate-200 dark:border-slate-800">
                                        <div className="w-1/2 h-full flex justify-end relative">
                                            {!isSurplus && (
                                                <div 
                                                    style={{ width: `${displacementWidth}%` }} 
                                                    className="bg-gradient-to-l from-rose-500 to-rose-600 h-full rounded-l-md shadow-inner transition-all duration-700 animate-pulse"
                                                />
                                            )}
                                        </div>

                                        <div className="w-1/2 h-full flex justify-start relative">
                                            {isSurplus && (
                                                <div 
                                                    style={{ width: `${displacementWidth}%` }} 
                                                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-r-md shadow-inner transition-all duration-700 animate-pulse"
                                                />
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 dark:text-slate-400 mt-2 px-1">
                                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                            📥 Ingresos: ${incomes.toLocaleString('es-CL')}
                                        </span>
                                        <span className="text-slate-400 font-medium">
                                            {isSurplus ? `Desplazamiento a favor: +${netPercentage}%` : `Desplazamiento en contra: -${netPercentage}%`}
                                        </span>
                                        <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                                            📤 Egresos: ${expenses.toLocaleString('es-CL')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

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
                                    const amount = Number(computedFinanceSummary.incomes_by_category?.[catKey] || 0);
                                    const totalIncomes = Number(computedFinanceSummary.total_incomes) || 0;
                                    const percentage = totalIncomes > 0 ? Math.round((amount / totalIncomes) * 100) : 0;
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
                                                setPaymentsTabMode('incomes');
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
                                    const amount = Number(computedFinanceSummary.expenses_by_category?.[catKey] || 0);
                                    const totalExpenses = Number(computedFinanceSummary.total_expenses) || 0;
                                    const percentage = totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0;
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
                                                setPaymentsTabMode('expenses');
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
                </div>
            ) : paymentsTabMode === 'incomes' ? (
                /* ================= INCOME SECTION ================= */
                <div className="space-y-6 max-w-full overflow-hidden text-left">
                    {/* KPI Cards Ingresos */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
                            <div className="flex justify-between items-center text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400">
                                <span>Total Ingresos Libro</span>
                                <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">Libro Diario</span>
                            </div>
                            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
                                ${totalIncomeAmount.toLocaleString('es-CL')} <span className="text-xs text-slate-400 font-medium">CLP</span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
                            <div className="flex justify-between items-center text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400">
                                <span>Gastos Comunes</span>
                                <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full font-bold">GGCC</span>
                            </div>
                            <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-2">
                                ${totalIncomeGGCC.toLocaleString('es-CL')} <span className="text-xs text-slate-400 font-medium">CLP</span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
                            <div className="flex justify-between items-center text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400">
                                <span>Multas & Espacios</span>
                                <span className="text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full font-bold">Extraordinarios</span>
                            </div>
                            <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-2">
                                ${totalIncomeOther.toLocaleString('es-CL')} <span className="text-xs text-slate-400 font-medium">CLP</span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
                            <div className="flex justify-between items-center text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400">
                                <span>Asientos Contables</span>
                                <span className="text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-bold">Registros</span>
                            </div>
                            <div className="text-xl font-black text-slate-900 dark:text-white mt-2">
                                {finalFilteredIncomes.length} <span className="text-xs text-slate-400 font-medium">Items</span>
                            </div>
                        </div>
                    </div>

                    {/* Toolbar de Filtros Interactivos Ingresos */}
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-left">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:flex items-center gap-2 flex-1">
                            {/* Buscador */}
                            <div className="relative flex-1 min-w-[180px]">
                                <input
                                    type="text"
                                    value={incomeSearch}
                                    onChange={(e) => setIncomeSearch(e.target.value)}
                                    placeholder="🔍 Descripción, subcategoría, Depto..."
                                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                />
                            </div>

                            {/* Categoría */}
                            <select
                                value={selectedIncomeCategory}
                                onChange={(e) => setSelectedIncomeCategory(e.target.value)}
                                className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer"
                            >
                                <option value="all">🔍 Todas las Categorías de Ingresos</option>
                                {Object.entries(financialCatalog.incomes || {}).map(([catKey, catObj]) => (
                                    <option key={catKey} value={catKey}>
                                        {formatCategoryLabel(catKey, catObj.label)}
                                    </option>
                                ))}
                            </select>

                            {/* Fechas */}
                            <div className="flex items-center gap-1">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Desde:</span>
                                <input
                                    type="date"
                                    value={incomeStartDate}
                                    onChange={(e) => setIncomeStartDate(e.target.value)}
                                    className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-2 py-1.5 text-xs font-medium text-slate-800 dark:text-white"
                                />
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Hasta:</span>
                                <input
                                    type="date"
                                    value={incomeEndDate}
                                    onChange={(e) => setIncomeEndDate(e.target.value)}
                                    className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-2 py-1.5 text-xs font-medium text-slate-800 dark:text-white"
                                />
                            </div>

                            {/* Orden */}
                            <select
                                value={incomeSortBy}
                                onChange={(e) => setIncomeSortBy(e.target.value)}
                                className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer"
                            >
                                <option value="date_desc">📅 Más Recientes</option>
                                <option value="date_asc">📅 Más Antiguas</option>
                                <option value="amount_desc">💰 Mayor Monto</option>
                                <option value="amount_asc">💰 Menor Monto</option>
                            </select>

                            {/* Limpiar */}
                            {(incomeSearch || selectedIncomeCategory !== 'all' || incomeStartDate || incomeEndDate || incomeSortBy !== 'date_desc') && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIncomeSearch('');
                                        setSelectedIncomeCategory('all');
                                        setIncomeStartDate('');
                                        setIncomeEndDate('');
                                        setIncomeSortBy('date_desc');
                                    }}
                                    className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-extrabold rounded-xl border border-rose-500/30 transition-all whitespace-nowrap"
                                >
                                    Limpiar Filtros ×
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
                                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow transition-all whitespace-nowrap shrink-0"
                            >
                                {showAddIncomeForm ? 'Cerrar Form' : '➕ Registrar Ingreso'}
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

                            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-x-auto max-w-full shadow-sm">
                                <SimpleTable
                                    headers={['Categoría / Subrubro', 'Monto', 'Fecha', 'Detalles', 'Distribución / Torre', 'Unidad / Vecino', ...(!readOnly ? ['Acciones'] : [])]}
                                    rows={finalFilteredIncomes.map(inc => {
                                        const labelVal = financialCatalog.incomes?.[inc.category]?.label || inc.category;
                                        const catName = formatCategoryLabel(inc.category, labelVal);
                                        const subName = inc.subcategory || 'Sin Subrubro';
                                        
                                        const icons = { gastos_comunes: '💵', multas: '⚖️', arriendo_espacios: '🎪', intereses_mora: '📈', cuotas_extraordinarias: '🚨', publicidad_convenios: '📢' };
                                        const icon = icons[inc.category] || '💰';

                                        const parseDateStr = (dStr) => {
                                            if (!dStr) return '—';
                                            const cleanStr = String(dStr).substring(0, 10);
                                            const parts = cleanStr.split('-');
                                            if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
                                            return cleanStr;
                                        };

                                        return {
                                            cells: [
                                                <div key={`cat-${inc.id}`} className="space-y-0.5 text-left py-0.5">
                                                    <span className="font-extrabold text-slate-800 dark:text-white text-xs flex items-center gap-1.5 whitespace-nowrap">
                                                        {icon} {catName}
                                                    </span>
                                                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 block whitespace-nowrap">
                                                        {subName}
                                                    </span>
                                                </div>,
                                                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono text-xs" key={`amt-${inc.id}`}>${Number(inc.amount).toLocaleString('es-CL')}</span>,
                                                <span className="font-mono text-xs text-slate-600 dark:text-slate-300" key={`date-${inc.id}`}>{parseDateStr(inc.date)}</span>,
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
                                                    {inc.property ? (
                                                        <>
                                                            <span className="font-bold block text-xs text-slate-900 dark:text-white">Depto #{inc.property.number}</span>
                                                            {inc.user && <span className="text-[10px] text-slate-400 block">{inc.user.name}</span>}
                                                        </>
                                                    ) : inc.tower ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold border border-indigo-500/20">
                                                            🏢 Gasto General {inc.tower.name}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-[10px] font-extrabold border border-slate-200 dark:border-slate-700">
                                                            🏙️ Gasto General Comunidad
                                                        </span>
                                                    )}
                                                </div>,
                                                ...(!readOnly ? [
                                                    <div className="flex items-center justify-center gap-1.5" key={`act-${inc.id}`}>
                                                        <button
                                                            type="button"
                                                            title="Editar ingreso"
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
                                                            className="px-2 py-1 sm:px-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 text-xs font-bold rounded-lg transition-all shadow-xs hover:scale-105 active:scale-95 flex items-center gap-1"
                                                        >
                                                            <span>✏️</span>
                                                            <span className="hidden sm:inline">Editar</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            title="Borrar ingreso"
                                                            aria-label={`Borrar ingreso ${inc.description || inc.category}`}
                                                            onClick={() => handleDeleteIncome(inc.id)}
                                                            className="px-2 py-1 sm:px-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 text-xs font-bold rounded-lg transition-all shadow-xs hover:scale-105 active:scale-95 flex items-center gap-1"
                                                        >
                                                            <span>🗑️</span>
                                                            <span className="hidden sm:inline">Borrar</span>
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
            ) : paymentsTabMode === 'expenses' ? (
                /* ================= EXPENSE SECTION ================= */
                <div className="space-y-6 max-w-full overflow-hidden text-left">
                    {/* KPI Cards Egresos */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
                            <div className="flex justify-between items-center text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400">
                                <span>Total Egresos Libro</span>
                                <span className="text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full font-bold">Operación</span>
                            </div>
                            <div className="text-xl font-black text-rose-600 dark:text-rose-500 mt-2">
                                ${totalExpenseAmount.toLocaleString('es-CL')} <span className="text-xs text-slate-400 font-medium">CLP</span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
                            <div className="flex justify-between items-center text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400">
                                <span>Servicios & Personal</span>
                                <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full font-bold">Fijos</span>
                            </div>
                            <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-2">
                                ${totalExpenseOps.toLocaleString('es-CL')} <span className="text-xs text-slate-400 font-medium">CLP</span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
                            <div className="flex justify-between items-center text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400">
                                <span>Mantención & Obras</span>
                                <span className="text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full font-bold">Variables</span>
                            </div>
                            <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-2">
                                ${totalExpenseMaint.toLocaleString('es-CL')} <span className="text-xs text-slate-400 font-medium">CLP</span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
                            <div className="flex justify-between items-center text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400">
                                <span>Comprobantes / Facturas</span>
                                <span className="text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-bold">Facturas</span>
                            </div>
                            <div className="text-xl font-black text-slate-900 dark:text-white mt-2">
                                {finalFilteredExpenses.length} <span className="text-xs text-slate-400 font-medium">Documentos</span>
                            </div>
                        </div>
                    </div>

                    {/* Toolbar de Filtros Interactivos Egresos */}
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 text-left">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:flex items-center gap-2 flex-1">
                            {/* Buscador */}
                            <div className="relative flex-1 min-w-[180px]">
                                <input
                                    type="text"
                                    value={expenseSearch}
                                    onChange={(e) => setExpenseSearch(e.target.value)}
                                    placeholder="🔍 Proveedor, N° Factura, detalle..."
                                    className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                                />
                            </div>

                            {/* Categoría */}
                            <select
                                value={selectedExpenseCategory}
                                onChange={(e) => setSelectedExpenseCategory(e.target.value)}
                                className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer"
                            >
                                <option value="all">🔍 Todas las Categorías de Egresos</option>
                                {Object.entries(financialCatalog.expenses || {}).map(([catKey, catObj]) => (
                                    <option key={catKey} value={catKey}>
                                        {formatCategoryLabel(catKey, catObj.label)}
                                    </option>
                                ))}
                            </select>

                            {/* Fechas */}
                            <div className="flex items-center gap-1">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Desde:</span>
                                <input
                                    type="date"
                                    value={expenseStartDate}
                                    onChange={(e) => setExpenseStartDate(e.target.value)}
                                    className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-2 py-1.5 text-xs font-medium text-slate-800 dark:text-white"
                                />
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-[10px] text-slate-400 font-bold uppercase">Hasta:</span>
                                <input
                                    type="date"
                                    value={expenseEndDate}
                                    onChange={(e) => setExpenseEndDate(e.target.value)}
                                    className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-2 py-1.5 text-xs font-medium text-slate-800 dark:text-white"
                                />
                            </div>

                            {/* Orden */}
                            <select
                                value={expenseSortBy}
                                onChange={(e) => setExpenseSortBy(e.target.value)}
                                className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer"
                            >
                                <option value="date_desc">📅 Más Recientes</option>
                                <option value="date_asc">📅 Más Antiguas</option>
                                <option value="amount_desc">💰 Mayor Monto</option>
                                <option value="amount_asc">💰 Menor Monto</option>
                            </select>

                            {/* Limpiar */}
                            {(expenseSearch || selectedExpenseCategory !== 'all' || expenseStartDate || expenseEndDate || expenseSortBy !== 'date_desc') && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setExpenseSearch('');
                                        setSelectedExpenseCategory('all');
                                        setExpenseStartDate('');
                                        setExpenseEndDate('');
                                        setExpenseSortBy('date_desc');
                                    }}
                                    className="px-2.5 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-extrabold rounded-xl border border-rose-500/30 transition-all whitespace-nowrap"
                                >
                                    Limpiar Filtros ×
                                </button>
                            )}
                        </div>

                        {!readOnly && (
                            <button
                                onClick={() => {
                                    setEditingExpense(null);
                                    setExpenseStep(1);
                                    setNewExpenseForm({ category: '', subcategory: '', amount: '', date: new Date().toISOString().substring(0, 10), description: '', property_id: '', user_id: '', distributable_method: 'prorated', tower_id: '' });
                                    setShowAddExpenseForm(!showAddExpenseForm);
                                }}
                                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow transition-all whitespace-nowrap shrink-0"
                            >
                                {showAddExpenseForm ? 'Cerrar Form' : '➕ Registrar Egreso'}
                            </button>
                        )}
                    </div>

                            {!readOnly && showAddExpenseForm && (
                                <form onSubmit={handleSaveExpense} className="bg-slate-50 dark:bg-slate-900/90 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-5 max-w-3xl w-full max-w-full overflow-hidden text-left shadow-xl animate-fade-in relative">
                                    {/* Header & Stepper estilo v2 */}
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-200 dark:border-slate-800">
                                        <div>
                                            <h5 className="text-sm font-extrabold text-rose-600 dark:text-rose-500 uppercase tracking-wider flex items-center gap-2">
                                                <span>📤</span> {editingExpense ? 'Editar Egreso Contable (Wizard v2)' : 'Registrar Nuevo Egreso (Wizard v2)'}
                                            </h5>
                                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                                                Flujo guiado de 3 pasos idéntico al prototipo oficial de administración
                                            </p>
                                        </div>

                                        {/* Stepper circular 1 - 2 - 3 */}
                                        <div className="flex items-center gap-2">
                                            {[
                                                { num: 1, label: 'Clasificación' },
                                                { num: 2, label: 'Referencias' },
                                                { num: 3, label: 'Prorrateo & Adjunto' }
                                            ].map((s) => (
                                                <button
                                                    key={s.num}
                                                    type="button"
                                                    onClick={() => setExpenseStep(s.num)}
                                                    className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                                                        expenseStep === s.num
                                                            ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30 scale-105'
                                                            : expenseStep > s.num
                                                            ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                                            : 'bg-gray-200 dark:bg-slate-800 text-gray-500 dark:text-slate-400'
                                                    }`}
                                                >
                                                    <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-black ${
                                                        expenseStep === s.num ? 'bg-white text-rose-600' : 'bg-slate-300 dark:bg-slate-700'
                                                    }`}>
                                                        {expenseStep > s.num ? '✓' : s.num}
                                                    </span>
                                                    <span>{s.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* PASO 1: CLASIFICACIÓN Y MONTO */}
                                    {expenseStep === 1 && (
                                        <div className="space-y-4 animate-fade-in">
                                            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 text-xs text-rose-600 dark:text-rose-400 font-medium">
                                                <strong>Paso 1 de 3:</strong> Ingrese la categoría contable, el sub-rubro y el monto en CLP.
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="expense-category" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Categoría Financiera *</label>
                                                    <select
                                                        id="expense-category"
                                                        required
                                                        value={newExpenseForm.category}
                                                        onChange={(e) => setNewExpenseForm(prev => ({ ...prev, category: e.target.value, subcategory: '' }))}
                                                        className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:ring-2 focus:ring-rose-500"
                                                    >
                                                        <option value="">Seleccione Categoría...</option>
                                                        {Object.entries(financialCatalog.expenses || {}).map(([key, obj]) => (
                                                            <option key={key} value={key}>{formatCategoryLabel(key, obj.label)}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label htmlFor="expense-subcategory" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Subcategoría Específica *</label>
                                                    <select
                                                        id="expense-subcategory"
                                                        required
                                                        value={newExpenseForm.subcategory}
                                                        onChange={(e) => setNewExpenseForm(prev => ({ ...prev, subcategory: e.target.value }))}
                                                        className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:ring-2 focus:ring-rose-500"
                                                        disabled={!newExpenseForm.category}
                                                    >
                                                        <option value="">Seleccione Subcategoría...</option>
                                                        {Object.entries(financialCatalog.expenses?.[newExpenseForm.category]?.subcategories || {}).map(([subKey, subName]) => (
                                                            <option key={subKey} value={subName}>{subName}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="expense-amount" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Monto Total ($ CLP) *</label>
                                                    <input
                                                        id="expense-amount"
                                                        type="number"
                                                        required
                                                        value={newExpenseForm.amount}
                                                        onChange={(e) => setNewExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
                                                        className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded-xl text-sm font-bold px-3 py-2 text-rose-600 dark:text-rose-400 focus:ring-2 focus:ring-rose-500"
                                                        placeholder="Ej: 150000"
                                                    />
                                                </div>

                                                <div>
                                                    <label htmlFor="expense-date" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Fecha Registro *</label>
                                                    <input
                                                        id="expense-date"
                                                        type="date"
                                                        required
                                                        value={newExpenseForm.date}
                                                        onChange={(e) => setNewExpenseForm(prev => ({ ...prev, date: e.target.value }))}
                                                        className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:ring-2 focus:ring-rose-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* PASO 2: REFERENCIAS Y ASIGNACIÓN */}
                                    {expenseStep === 2 && (
                                        <div className="space-y-4 animate-fade-in">
                                            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                                                <strong>Paso 2 de 3:</strong> Configure la asignación del egreso y detalles de respaldos.
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="expense-dist-method" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Método de Distribución *</label>
                                                    <select
                                                        id="expense-dist-method"
                                                        value={newExpenseForm.distributable_method || 'prorated'}
                                                        onChange={(e) => setNewExpenseForm(prev => ({ 
                                                            ...prev, 
                                                            distributable_method: e.target.value,
                                                            tower_id: e.target.value === 'tower_specific' ? prev.tower_id : '' 
                                                        }))}
                                                        className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                                    >
                                                        <option value="prorated">Global Prorrateado (Por Alícuota)</option>
                                                        <option value="equal">Partes Iguales entre Todas las Unidades</option>
                                                        <option value="tower_specific">Torre Específica (Solo esa Torre)</option>
                                                        <option value="unit_specific">Unidad Específica (Cobro Directo)</option>
                                                        <option value="exempt">Exento de Cobro</option>
                                                    </select>
                                                </div>

                                                {newExpenseForm.distributable_method === 'tower_specific' && (
                                                    <div>
                                                        <label htmlFor="expense-tower" className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block mb-1">Torre Destino *</label>
                                                        <select
                                                            id="expense-tower"
                                                            required
                                                            value={newExpenseForm.tower_id || ''}
                                                            onChange={(e) => setNewExpenseForm(prev => ({ ...prev, tower_id: e.target.value }))}
                                                            className="w-full bg-white dark:bg-slate-950 border border-indigo-500/50 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                                        >
                                                            <option value="">Seleccione Torre...</option>
                                                            {towersList.map(t => (
                                                                <option key={t.id} value={t.id}>{t.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}

                                                {newExpenseForm.distributable_method === 'unit_specific' && (
                                                    <div>
                                                        <label htmlFor="expense-property" className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block mb-1">Unidad Destino *</label>
                                                        <select
                                                            id="expense-property"
                                                            required
                                                            value={newExpenseForm.property_id || ''}
                                                            onChange={(e) => setNewExpenseForm(prev => ({ ...prev, property_id: e.target.value }))}
                                                            className="w-full bg-white dark:bg-slate-950 border border-amber-500/50 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500"
                                                        >
                                                            <option value="">Seleccione Unidad...</option>
                                                            {adminFilteredProperties.map(p => (
                                                                <option key={p.id} value={p.id}>Depto #{p.number}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label htmlFor="expense-user" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Proveedor / Personal Asignado</label>
                                                    <select
                                                        id="expense-user"
                                                        value={newExpenseForm.user_id}
                                                        onChange={(e) => setNewExpenseForm(prev => ({ ...prev, user_id: e.target.value }))}
                                                        className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                                    >
                                                        <option value="">Ninguno / Proveedor Externo...</option>
                                                        {adminFilteredUsers.map(u => (
                                                            <option key={u.id} value={u.id}>{u.name}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                <div>
                                                    <label htmlFor="expense-description" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Observaciones / Nº Factura</label>
                                                    <input
                                                        id="expense-description"
                                                        type="text"
                                                        value={newExpenseForm.description}
                                                        onChange={(e) => setNewExpenseForm(prev => ({ ...prev, description: e.target.value }))}
                                                        className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                                        placeholder="Nº Factura, proveedor o detalle de compra"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* PASO 3: PRORRATEO EN CUOTAS Y ADJUNTO DE RESPALDO (EXCLUSIVO V2) */}
                                    {expenseStep === 3 && (
                                        <div className="space-y-4 animate-fade-in">
                                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                                <strong>Paso 3 de 3:</strong> Prorrateo mensual de cuotas y adjunto del comprobante (Estilo Prototipo v2).
                                            </div>

                                            {/* Conmutador 1: Dividir en Cuotas */}
                                            <div className="bg-white dark:bg-slate-950 p-4 rounded-xl border border-gray-200 dark:border-slate-800 flex items-center justify-between">
                                                <div>
                                                    <span className="text-xs font-extrabold text-slate-800 dark:text-white block">Dividir en Cuotas Mensuales (Diferir Cobro)</span>
                                                    <span className="text-[11px] text-slate-400 block">Prorratea este egreso entre N meses de cobro continuo</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsInstallmentsActive(!isInstallmentsActive)}
                                                    className={`w-12 h-6 rounded-full p-1 transition-colors ${isInstallmentsActive ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-slate-800'}`}
                                                >
                                                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isInstallmentsActive ? 'translate-x-6' : 'translate-x-0'}`} />
                                                </button>
                                            </div>

                                            {isInstallmentsActive && (
                                                <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                                    <div>
                                                        <label htmlFor="installments-count" className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block mb-1">Número de Cuotas Mensuales</label>
                                                        <select
                                                            id="installments-count"
                                                            value={installmentsCount}
                                                            onChange={(e) => setInstallmentsCount(Number(e.target.value))}
                                                            className="w-full bg-white dark:bg-slate-950 border border-emerald-500/50 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white"
                                                        >
                                                            <option value={2}>2 Cuotas</option>
                                                            <option value={3}>3 Cuotas</option>
                                                            <option value={4}>4 Cuotas</option>
                                                            <option value={6}>6 Cuotas</option>
                                                            <option value={12}>12 Cuotas</option>
                                                        </select>
                                                    </div>

                                                    <div className="text-right">
                                                        <span className="text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold block">Preview de Cuota Mensual:</span>
                                                        <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 block">
                                                            ${Math.round((Number(newExpenseForm.amount) || 0) / installmentsCount).toLocaleString()} / mes
                                                        </span>
                                                        <span className="text-[10px] text-slate-400">Total: ${(Number(newExpenseForm.amount) || 0).toLocaleString()} CLP</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Resumen Final del Egreso */}
                                            <div className="bg-slate-100 dark:bg-slate-950 p-4 rounded-xl border border-gray-200 dark:border-slate-800 text-xs space-y-1">
                                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">Resumen de Captura:</span>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Categoría:</span>
                                                    <span className="font-bold text-slate-800 dark:text-white">{newExpenseForm.category || 'Sin seleccionar'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Monto Total:</span>
                                                    <span className="font-bold text-rose-600 dark:text-rose-400">${Number(newExpenseForm.amount || 0).toLocaleString()} CLP</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-500">Distribución:</span>
                                                    <span className="font-bold text-indigo-500 capitalize">{newExpenseForm.distributable_method || 'Prorrateado'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Footer con Navegación del Wizard */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-800">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                if (expenseStep > 1) {
                                                    setExpenseStep(prev => prev - 1);
                                                } else {
                                                    setShowAddExpenseForm(false);
                                                    setEditingExpense(null);
                                                }
                                            }}
                                            className="px-4 py-2 bg-gray-200 dark:bg-slate-800 dark:text-white text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-300 transition-all"
                                        >
                                            {expenseStep > 1 ? '← Anterior' : 'Cancelar'}
                                        </button>

                                        <div className="flex gap-2">
                                            {expenseStep < 3 ? (
                                                <button
                                                    type="button"
                                                    onClick={() => setExpenseStep(prev => prev + 1)}
                                                    className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1"
                                                >
                                                    <span>Siguiente Paso</span>
                                                    <span>→</span>
                                                </button>
                                            ) : (
                                                <button
                                                    type="submit"
                                                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-600/30 transition-all flex items-center gap-1.5"
                                                >
                                                    <span>💾</span>
                                                    <span>{editingExpense ? 'Guardar Cambios' : 'Confirmar & Guardar Egreso'}</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            )}

                            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-x-auto max-w-full shadow-sm">
                                <SimpleTable
                                    headers={['Categoría / Subrubro', 'Monto', 'Fecha', 'Detalles', 'Distribución / Torre', 'Unidad / Destinatario', ...(!readOnly ? ['Acciones'] : [])]}
                                    rows={finalFilteredExpenses.map(exp => {
                                        const labelVal = financialCatalog.expenses?.[exp.category]?.label || exp.category;
                                        const catName = formatCategoryLabel(exp.category, labelVal);
                                        const subName = exp.subcategory || 'Sin Subrubro';
                                        
                                        const icons = { personal: '👷', servicios_basicos: '💧', mantencion: '🔧', seguridad: '🛡️', aseo_gasto_comun: '🧹', administracion: '📁', seguros: '☂️', certificaciones: '📜', reemplazos: '🆘' };
                                        const icon = icons[exp.category] || '💸';

                                        const parseDateStr = (dStr) => {
                                            if (!dStr) return '—';
                                            const cleanStr = String(dStr).substring(0, 10);
                                            const parts = cleanStr.split('-');
                                            if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
                                            return cleanStr;
                                        };

                                        return {
                                            cells: [
                                                <div key={`cat-${exp.id}`} className="space-y-0.5 text-left py-0.5">
                                                    <span className="font-extrabold text-slate-800 dark:text-white text-xs flex items-center gap-1.5 whitespace-nowrap">
                                                        {icon} {catName}
                                                    </span>
                                                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 block whitespace-nowrap">
                                                        {subName}
                                                    </span>
                                                </div>,
                                                <span className="font-extrabold text-rose-600 dark:text-rose-400 font-mono text-xs" key={`amt-${exp.id}`}>${Number(exp.amount).toLocaleString('es-CL')}</span>,
                                                <span className="font-mono text-xs text-slate-600 dark:text-slate-300" key={`date-${exp.id}`}>{parseDateStr(exp.date)}</span>,
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
                                                    {exp.property ? (
                                                        <>
                                                            <span className="font-bold block text-xs text-slate-900 dark:text-white">Depto #{exp.property.number}</span>
                                                            {exp.user && <span className="text-[10px] text-slate-400 block">{exp.user.name}</span>}
                                                        </>
                                                    ) : exp.tower ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-extrabold border border-indigo-500/20">
                                                            🏢 Gasto General {exp.tower.name}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-[10px] font-extrabold border border-slate-200 dark:border-slate-700">
                                                            🏙️ Gasto General Comunidad
                                                        </span>
                                                    )}
                                                </div>,
                                                ...(!readOnly ? [
                                                    <div className="flex items-center justify-center gap-1.5" key={`act-${exp.id}`}>
                                                        <button
                                                            type="button"
                                                            title="Editar egreso"
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
                                                            className="px-2 py-1 sm:px-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 text-xs font-bold rounded-lg transition-all shadow-xs hover:scale-105 active:scale-95 flex items-center gap-1"
                                                        >
                                                            <span>✏️</span>
                                                            <span className="hidden sm:inline">Editar</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            title="Borrar egreso"
                                                            aria-label={`Borrar egreso ${exp.description || exp.category}`}
                                                            onClick={() => handleDeleteExpense(exp.id)}
                                                            className="px-2 py-1 sm:px-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 text-xs font-bold rounded-lg transition-all shadow-xs hover:scale-105 active:scale-95 flex items-center gap-1"
                                                        >
                                                            <span>🗑️</span>
                                                            <span className="hidden sm:inline">Borrar</span>
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
            ) : null}

            {selectedAviso && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md" onClick={() => setSelectedAviso(null)}>
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
                </div>,
                document.body
            )}

            {/* Modal de Ficha Técnica 360° Interconectada */}
            <UnitDetailModal360
                inspectingUnit={inspectingUnit360}
                onClose={() => setInspectingUnit360(null)}
                allProperties={adminFilteredProperties}
                allFines={finesList || []}
                allTickets={ticketsList || []}
                allUsers={usersList || []}
                allPayments={paymentsList || []}
                activeCondoName={activeCondo?.name || 'Condominio Alameda'}
            />
        </div>
    );
}
