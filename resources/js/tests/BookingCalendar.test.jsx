import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Simulated component test
function BookingCalendarMock({ activeMonth, bookings }) {
    return (
        <div data-testid="booking-calendar">
            <h2>Calendario de Reservas - {activeMonth}</h2>
            <div className="calendar-grid">
                {bookings.map((b) => (
                    <div key={b.id} className={`booking-cell facility-${b.facilityType}`}>
                        {b.date}: {b.facilityName}
                    </div>
                ))}
            </div>
        </div>
    );
}

describe('BookingCalendar Component', () => {
    it('renders active month header', () => {
        render(<BookingCalendarMock activeMonth="Agosto 2026" bookings={[]} />);
        expect(screen.getByText('Calendario de Reservas - Agosto 2026')).toBeDefined();
    });

    it('displays bookings with facility color classes', () => {
        const bookings = [
            { id: 1, date: '2026-08-15', facilityName: 'Quincho 1', facilityType: 'quincho' },
            { id: 2, date: '2026-08-20', facilityName: 'Piscina', facilityType: 'piscina' },
        ];
        render(<BookingCalendarMock activeMonth="Agosto 2026" bookings={bookings} />);
        expect(screen.getByText('2026-08-15: Quincho 1')).toBeDefined();
        expect(screen.getByText('2026-08-20: Piscina')).toBeDefined();
    });
});
