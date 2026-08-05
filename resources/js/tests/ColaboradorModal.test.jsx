import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React, { useState } from 'react';

function ColaboradorModalMock({ employee }) {
    const [activeTab, setActiveTab] = useState('personales');

    return (
        <div>
            <h2>Ficha Colaborador: {employee.name}</h2>
            <div className="tab-buttons">
                <button onClick={() => setActiveTab('personales')}>Datos Personales</button>
                <button onClick={() => setActiveTab('contrato')}>Contrato</button>
                <button onClick={() => setActiveTab('liquidaciones')}>Liquidaciones</button>
                <button onClick={() => setActiveTab('amonestaciones')}>Amonestaciones</button>
            </div>
            <div className="tab-content" data-testid="active-tab-content">
                {activeTab === 'personales' && <div>Pestaña Personales</div>}
                {activeTab === 'contrato' && <div>Pestaña Contrato: {employee.contractType}</div>}
                {activeTab === 'liquidaciones' && <div>Pestaña Liquidaciones</div>}
                {activeTab === 'amonestaciones' && <div>Pestaña Amonestaciones</div>}
            </div>
        </div>
    );
}

describe('ColaboradorModal Multi-tab Navigation Component', () => {
    const employee = { id: 1, name: 'Pedro Conserje', contractType: 'Indefinido' };

    it('renders initial active tab (personales)', () => {
        render(<ColaboradorModalMock employee={employee} />);
        expect(screen.getByText('Pestaña Personales')).toBeDefined();
    });

    it('switches tabs on button click', () => {
        render(<ColaboradorModalMock employee={employee} />);
        fireEvent.click(screen.getByText('Contrato'));
        expect(screen.getByText('Pestaña Contrato: Indefinido')).toBeDefined();
    });
});
