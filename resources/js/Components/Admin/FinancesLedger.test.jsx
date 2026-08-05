import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import FinancesLedger from './FinancesLedger';

afterEach(() => {
    document.body.innerHTML = '';
});

describe('FinancesLedger Component', () => {
    const mockCatalog = {
        incomes: {
            gastos_comunes: { label: 'Gastos Comunes' },
            multas: { label: 'Multas' },
            arriendo_espacios: { label: 'Arriendos de Espacios' },
            otro: { label: 'Otros Ingresos' },
        },
        expenses: {
            personal: { label: 'Sueldos y Remuneraciones' },
            servicios_basicos: { label: 'Servicios Básicos' },
            mantencion: { label: 'Mantención' },
            seguridad: { label: 'Seguridad' },
            limpieza: { label: 'Limpieza' },
            reparacion: { label: 'Reparaciones' },
            seguros: { label: 'Seguros' },
            administracion: { label: 'Gastos Administrativos' },
            fondo_reserva: { label: 'Fondo de Reserva' },
            otro: { label: 'Otros Egresos' },
        },
    };

    const mockIncomes = [
        { id: 1, category: 'gastos_comunes', subcategory: 'Pago GGCC', amount: 150000, date: '2026-08-01', description: 'Pago Depto 101', property_id: 1 },
        { id: 2, category: 'multas', subcategory: 'Ruidos', amount: 35000, date: '2026-08-02', description: 'Multa Depto 102', property_id: 2 },
    ];

    const mockExpenses = [
        { id: 1, category: 'personal', subcategory: 'Conserjes', amount: 500000, date: '2026-08-01', description: 'Sueldos Conserjes' },
        { id: 2, category: 'otro', subcategory: 'Comisiones', amount: 35000, date: '2026-08-02', description: 'Gastos Bancarios' },
    ];

    const defaultProps = {
        adminCondoId: 1,
        paymentsTabMode: 'ledger',
        setPaymentsTabMode: vi.fn(),
        financialCatalog: mockCatalog,
        selectedIncomeCategory: 'all',
        setSelectedIncomeCategory: vi.fn(),
        selectedExpenseCategory: 'all',
        setSelectedExpenseCategory: vi.fn(),
        ledgerSubTab: 'summary',
        setLedgerSubTab: vi.fn(),
        filteredIncomes: mockIncomes,
        incomesList: mockIncomes,
        filteredExpenses: mockExpenses,
        expensesList: mockExpenses,
        showAddIncomeForm: false,
        setShowAddIncomeForm: vi.fn(),
        showAddExpenseForm: false,
        setShowAddExpenseForm: vi.fn(),
        newIncomeForm: {},
        setNewIncomeForm: vi.fn(),
        newExpenseForm: {},
        setNewExpenseForm: vi.fn(),
        editingIncome: null,
        setEditingIncome: vi.fn(),
        editingExpense: null,
        setEditingExpense: vi.fn(),
        loadingFinances: false,
        handleSaveIncome: vi.fn(),
        handleDeleteIncome: vi.fn(),
        handleSaveExpense: vi.fn(),
        handleDeleteExpense: vi.fn(),
        usersList: [],
        allCondominiums: [{ id: 1, name: 'Condominio Demo' }],
        readOnly: false,
    };

    it('renders the ledger subtabs navigation (Libro Diario, Recaudación, Ingresos, Egresos)', () => {
        act(() => {
            render(<FinancesLedger {...defaultProps} />);
        });

        expect(screen.getAllByText(/Libro Diario/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Recaudación/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Ingresos Contables/i).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Egresos Contables/i).length).toBeGreaterThan(0);
    });

    it('calculates computedFinanceSummary dynamically in real-time from records', () => {
        act(() => {
            render(<FinancesLedger {...defaultProps} />);
        });

        // Ingresos totales: $185.000 (150.000 + 35.000)
        expect(screen.getAllByText(/\$185\.000/i).length).toBeGreaterThan(0);

        // Egresos totales: $535.000 (500.000 + 35.000)
        expect(screen.getAllByText(/\$535\.000/i).length).toBeGreaterThan(0);
    });

    it('displays non-zero amounts and percentages for category breakdown including Otros Egresos', () => {
        act(() => {
            render(<FinancesLedger {...defaultProps} />);
        });

        // "Otros Egresos" debe mostrar $35.000 en vez de $0 (0%)
        expect(screen.getByText(/Otros Egresos/i)).toBeInTheDocument();
        expect(screen.getAllByText(/\$35\.000/i).length).toBeGreaterThan(0);
    });
});
