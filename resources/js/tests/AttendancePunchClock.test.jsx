import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import AttendancePunchClock from '../Components/AttendancePunchClock';

describe('AttendancePunchClock Component', () => {
    it('renders initial clock and check-in/out buttons', () => {
        render(<AttendancePunchClock employeeProfileId={1} condoId={1} />);

        expect(screen.getByText('Control de Asistencia y Turno')).toBeDefined();
        expect(screen.getByText('Marcar Entrada')).toBeDefined();
        expect(screen.getByText('Marcar Salida')).toBeDefined();
    });

    it('enables check-out after checking in', () => {
        render(<AttendancePunchClock employeeProfileId={1} condoId={1} />);

        const checkInBtn = screen.getByText('Marcar Entrada');
        fireEvent.click(checkInBtn);

        expect(screen.getByText('Registrada')).toBeDefined();

        const checkOutBtn = screen.getByText('Marcar Salida');
        fireEvent.click(checkOutBtn);

        expect(screen.getByText('Finalizado')).toBeDefined();
    });
});
