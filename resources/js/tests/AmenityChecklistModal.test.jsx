import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AmenityChecklistModal from '@/Components/Admin/AmenityChecklistModal';

describe('AmenityChecklistModal Component', () => {
    const mockBooking = {
        id: 1,
        condominium_id: 1,
        amenity_name: 'Quincho Panorámico',
        unit_name: 'Torre A - Depto 501',
    };

    it('renders modal with facility name and checklist items when isOpen is true', () => {
        render(
            <AmenityChecklistModal
                isOpen={true}
                onClose={() => {}}
                booking={mockBooking}
            />
        );

        expect(screen.getByText(/Inspección y Entrega · Quincho Panorámico/i)).toBeInTheDocument();
        expect(screen.getByText(/Mobiliario \(Mesas y Sillas\)/i)).toBeInTheDocument();
        expect(screen.getByText(/Parrilla \/ Cocina \/ Encendido/i)).toBeInTheDocument();
    });

    it('switches between Check-In and Check-Out inspection modes', () => {
        render(
            <AmenityChecklistModal
                isOpen={true}
                onClose={() => {}}
                booking={mockBooking}
            />
        );

        const checkOutBtn = screen.getByRole('button', { name: /Check-Out \(Devolución\)/i });
        fireEvent.click(checkOutBtn);

        expect(checkOutBtn).toHaveClass('bg-white');
    });

    it('displays deduction amount input when cobrar_reparacion is selected', () => {
        render(
            <AmenityChecklistModal
                isOpen={true}
                onClose={() => {}}
                booking={mockBooking}
            />
        );

        const selects = screen.getAllByRole('combobox');
        const depositActionSelect = selects[1];

        fireEvent.change(depositActionSelect, { target: { value: 'cobrar_reparacion' } });

        expect(screen.getByText(/Monto a Deducir o Imputar en Gastos Comunes/i)).toBeInTheDocument();
    });
});
