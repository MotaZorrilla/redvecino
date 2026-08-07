/**
 * @file useFinancialCatalog.test.jsx
 * @description TDD para el hook useFinancialCatalog (React Query + axios).
 * Consulta el catálogo financiero (incomes/expenses) y respeta enabled.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFinancialCatalog } from '@/hooks/useFinancialCatalog';

vi.mock('axios', () => ({
    default: { get: vi.fn() },
}));

import axios from 'axios';

const wrapper = ({ children }) => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
};

describe('useFinancialCatalog', () => {
    beforeEach(() => vi.clearAllMocks());

    it('consulta /api/condo-finances/catalog y devuelve el catálogo', async () => {
        axios.get.mockResolvedValue({
            data: { incomes: { A: ['a1'] }, expenses: { B: ['b1'] } },
        });

        const { result } = renderHook(() => useFinancialCatalog(true), { wrapper });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data.incomes).toEqual({ A: ['a1'] });
        expect(result.current.data.expenses).toEqual({ B: ['b1'] });
        expect(axios.get).toHaveBeenCalledWith('/api/condo-finances/catalog');
    });

    it('no consulta cuando enabled es false', () => {
        renderHook(() => useFinancialCatalog(false), { wrapper });
        expect(axios.get).not.toHaveBeenCalled();
    });
});