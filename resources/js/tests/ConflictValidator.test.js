import { describe, it, expect } from 'vitest';

export function hasBookingConflict(existingBookings, newBooking, facilityCapacity = 1) {
    const overlapping = existingBookings.filter((b) => {
        if (b.facility_id !== newBooking.facility_id || b.date !== newBooking.date) {
            return false;
        }
        // Check time overlap: start1 < end2 && start2 < end1
        return b.start_time < newBooking.end_time && newBooking.start_time < b.end_time;
    });

    return overlapping.length >= facilityCapacity;
}

describe('ConflictValidator Utility (Client-side validation)', () => {
    const existing = [
        { id: 1, facility_id: 10, date: '2026-08-15', start_time: '14:00', end_time: '18:00' },
    ];

    it('detects overlap on exact same time slot when capacity is 1', () => {
        const newBooking = { facility_id: 10, date: '2026-08-15', start_time: '14:00', end_time: '18:00' };
        expect(hasBookingConflict(existing, newBooking, 1)).toBe(true);
    });

    it('detects partial overlap', () => {
        const newBooking = { facility_id: 10, date: '2026-08-15', start_time: '16:00', end_time: '20:00' };
        expect(hasBookingConflict(existing, newBooking, 1)).toBe(true);
    });

    it('allows booking on different date', () => {
        const newBooking = { facility_id: 10, date: '2026-08-16', start_time: '14:00', end_time: '18:00' };
        expect(hasBookingConflict(existing, newBooking, 1)).toBe(false);
    });

    it('allows booking when capacity allows multiple simultaneous bookings', () => {
        const newBooking = { facility_id: 10, date: '2026-08-15', start_time: '14:00', end_time: '18:00' };
        expect(hasBookingConflict(existing, newBooking, 2)).toBe(false);
    });
});
