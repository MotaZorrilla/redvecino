/**
 * @file useBookings.js
 * @description Hook de React Query para las reservas de áreas comunes del usuario.
 * Consume la API real /api/bookings (RoadmapFeaturesController). Reemplaza
 * el estado mock hardcodeado de AmenitiesBookingPanel.
 */
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const fetchBookings = async () => {
    const res = await axios.get('/api/bookings');
    return res.data;
};

export const mapBookingToPanel = (b) => ({
    id: b.id,
    amenity_name: b.area_name || b.amenity_name || 'Reserva',
    unit_name: b.unit_name || '',
    date: b.booking_date || b.date || '',
    time_slot: b.time_slot || '',
    amount: b.amount || 0,
    notes: b.notes || '',
    status: b.status || 'Pendiente',
});

export function useBookings(enabled) {
    return useQuery({
        queryKey: ['bookings'],
        queryFn: fetchBookings,
        enabled: !!enabled,
    });
}

export default useBookings;