/**
 * @file useFinanceMutations.test.jsx
 * @description TDD para el hook useFinanceMutations (React Query).
 * Verifica CRUD de ingresos/gastos (POST/PUT/DELETE) e invalidación del cache de finanzas.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFinanceMutations } from '@/hooks/useFinanceMutations';

vi.mock('axios', () => ({
    default: { post: vi.fn(), put: vi.fn(), delete: vi.fn() },
}));

import axios from 'axios';

const makeClient = () => new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: {} },
});

const wrapper = (client) => ({ children }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
);

const flush = () => act(async () => { await Promise.resolve(); });

describe('useFinanceMutations', () => {
    beforeEach(() => vi.clearAllMocks());

    it('crea un ingreso con POST y devuelve éxito', async () => {
        axios.post.mockResolvedValue({ data: { id: 99 } });
        const client = makeClient();
        const spy = vi.spyOn(client, 'invalidateQueries').mockResolvedValue(undefined);
        const { result } = renderHook(() => useFinanceMutations(7), { wrapper: wrapper(client) });

        await act(async () => { await result.current.saveIncome.mutateAsync({ id: null, amount: 5000 }); });

        expect(axios.post).toHaveBeenCalledWith('/api/condo-finances/incomes', { id: null, amount: 5000 });
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({ queryKey: ['condo-finances', 7] }));
    });

    it('actualiza un ingreso con PUT cuando presenta id', async () => {
        axios.put.mockResolvedValue({});
        const { result } = renderHook(() => useFinanceMutations(7), { wrapper: wrapper(makeClient()) });

        await act(async () => { await result.current.saveIncome.mutateAsync({ id: 99, amount: 9000 }); });

        expect(axios.put).toHaveBeenCalledWith('/api/condo-finances/incomes/99', { id: 99, amount: 9000 });
        expect(axios.post).not.toHaveBeenCalled();
    });

    it('elimina un ingreso con DELETE por id', async () => {
        axios.delete.mockResolvedValue({});
        const { result } = renderHook(() => useFinanceMutations(7), { wrapper: wrapper(makeClient()) });

        await act(async () => { await result.current.deleteIncome.mutateAsync(55); });

        expect(axios.delete).toHaveBeenCalledWith('/api/condo-finances/incomes/55');
    });

    it('crea un egreso con POST', async () => {
        axios.post.mockResolvedValue({ data: { id: 1 } });
        const { result } = renderHook(() => useFinanceMutations(7), { wrapper: wrapper(makeClient()) });

        await act(async () => { await result.current.saveExpense.mutateAsync({ amount: 3000 }); });

        expect(axios.post).toHaveBeenCalledWith('/api/condo-finances/expenses', { amount: 3000 });
    });

    it('elimina un egreso con DELETE por id', async () => {
        axios.delete.mockResolvedValue({});
        const { result } = renderHook(() => useFinanceMutations(7), { wrapper: wrapper(makeClient()) });

        await act(async () => { await result.current.deleteExpense.mutateAsync(66); });

        expect(axios.delete).toHaveBeenCalledWith('/api/condo-finances/expenses/66');
    });
});