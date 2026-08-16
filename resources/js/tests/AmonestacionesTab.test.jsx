import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import AmonestacionesTab from '../Components/Admin/AmonestacionesTab';

describe('AmonestacionesTab Component', () => {
    const mockEmployees = [
        { id: 1, name: 'José Andrade', role_name: 'Recepcionista' },
        { id: 2, name: 'Mario Carrasco', role_name: 'Conserje' }
    ];

    it('renders initial sanctions list and filter dropdown', () => {
        render(<AmonestacionesTab adminCondoId={1} employees={mockEmployees} />);

        expect(screen.getByText('Registrar Amonestación')).toBeDefined();
        expect(screen.getByText('José Andrade')).toBeDefined();
        expect(screen.getByText('Mario Carrasco')).toBeDefined();
    });

    it('filters sanctions by selected employee', () => {
        render(<AmonestacionesTab adminCondoId={1} employees={mockEmployees} />);

        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: '1' } });

        expect(screen.getByText('José Andrade')).toBeDefined();
        expect(screen.queryByText('Mario Carrasco')).toBeNull();
    });

    it('opens registration modal on button click', () => {
        render(<AmonestacionesTab adminCondoId={1} employees={mockEmployees} />);

        const registerBtn = screen.getByText('Registrar Amonestación');
        fireEvent.click(registerBtn);

        expect(screen.getByText('Nueva Amonestación Laboral')).toBeDefined();
        expect(screen.getByText('Guardar Amonestación')).toBeDefined();
    });
});
