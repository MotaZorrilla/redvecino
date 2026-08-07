/**
 * @file useBookings.test.jsx
 * @description TDD para el hook useBookings (React Query + axios).
 * Consulta las reservas reales del usuario autenticado en /api/bookings.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBookings } from '@/hooks/useBookings';

vi.mock('axios', () => ({
    default: { get: vi.fn() },
}));

import axios from 'axios';

const wrapper = ({ children }) => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
};

describe('useBookings', () => {
    beforeEach(() => vi.clearAllMocks());

    it('consulta /api/bookings y devuelve las reservas', async () => {
        axios.get.mockResolvedValue({
            data: [
                { id: 10, area_name: 'Piscina', booking_date: '2026-08-15', time_slot: '10:00-11:00', status: 'Pendiente' },
            ],
        });

        const { result } = renderHook(() => useBookings(true), { wrapper });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data).toEqual([
            { id: 10, area_name: 'Piscina', booking_date: '2026-08-15', time_slot: '10:00-11:00', status: 'Pendiente' },
        ]);
        expect(axios.get).toHaveBeenCalledWith('/api/bookings');
    });

    it('no consulta cuando enabled es false', () => {
        renderHook(() => useBookings(false), { wrapper });
        expect(axios.get).not.toHaveBeenCalled();
    });
});