import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

function ResidentAutocompleteMock({ query, results }) {
    if (!query || query.length < 2) {
        return <div data-testid="autocomplete-hint">Ingrese al menos 2 caracteres</div>;
    }

    return (
        <ul data-testid="autocomplete-results">
            {results.map((r) => (
                <li key={r.id}>
                    {r.name} - Depto {r.unit}
                </li>
            ))}
        </ul>
    );
}

describe('ResidentAutocomplete Component', () => {
    it('shows hint when query is shorter than 2 characters', () => {
        render(<ResidentAutocompleteMock query="J" results={[]} />);
        expect(screen.getByTestId('autocomplete-hint')).toBeDefined();
    });

    it('renders matching results when query is 2+ characters', () => {
        const results = [{ id: 1, name: 'Juan Pérez', unit: '101' }];
        render(<ResidentAutocompleteMock query="Ju" results={results} />);
        expect(screen.getByText('Juan Pérez - Depto 101')).toBeDefined();
    });
});
