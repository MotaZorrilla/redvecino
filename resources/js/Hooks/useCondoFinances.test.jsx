/**
 * @file useCondoFinances.test.jsx
 * @description TDD para el hook useCondoFinances (React Query + axios).
 * Verifica que consulte summary, incomes y expenses del condominio y que
 * no dispare consultas cuando no hay condominiumId (enabled:false).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCondoFinances } from '@/hooks/useCondoFinances';

vi.mock('axios', () => ({
    default: { get: vi.fn() },
}));

import axios from 'axios';

const wrapper = ({ children }) => {
    const qc = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
};

describe('useCondoFinances', () => {
    beforeEach(() => vi.clearAllMocks());

    it('consulta summary, incomes y expenses del condominio y los devuelve juntos', async () => {
        axios.get.mockImplementation((url) => {
            if (url.includes('/summary'))
                return Promise.resolve({ data: { total_incomes: 100, balance: 50 } });
            if (url.includes('/incomes'))
                return Promise.resolve({ data: { data: [{ id: 1, category: 'ingresos' }] } });
            if (url.includes('/expenses'))
                return Promise.resolve({ data: { data: [{ id: 2, category: 'agua' }] } });
            return Promise.reject(new Error('no mock: ' + url));
        });

        const { result } = renderHook(() => useCondoFinances(7), { wrapper });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data.summary.total_incomes).toBe(100);
        expect(result.current.data.incomes).toEqual([{ id: 1, category: 'ingresos' }]);
        expect(result.current.data.expenses).toEqual([{ id: 2, category: 'agua' }]);
        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining('/api/condo-finances/summary?condominium_id=7'),
        );
        expect(axios.get).toHaveBeenCalledWith(
            expect.stringContaining('/api/condo-finances/incomes?condominium_id=7'),
        );
    });

    it('no dispara consultas cuando no hay condominiumId (enabled:false)', () => {
        const { result } = renderHook(() => useCondoFinances(null), { wrapper });
        expect(axios.get).not.toHaveBeenCalled();
        expect(result.current.fetchStatus).toBe('idle');
    });
});