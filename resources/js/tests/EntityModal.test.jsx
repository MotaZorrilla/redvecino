import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import EntityModal from '../Components/EntityModal';

describe('EntityModal Component', () => {
    it('does not render when isOpen is false', () => {
        const { container } = render(
            <EntityModal isOpen={false} onClose={() => {}} title="Modal Test">
                <p>Content</p>
            </EntityModal>
        );
        expect(container.firstChild).toBeNull();
    });

    it('renders title, description and children when isOpen is true', () => {
        render(
            <EntityModal
                isOpen={true}
                onClose={() => {}}
                title="Nuevo Ingreso"
                description="Complete el formulario"
            >
                <input placeholder="Nombre" />
            </EntityModal>
        );

        expect(screen.getByText('Nuevo Ingreso')).toBeDefined();
        expect(screen.getByText('Complete el formulario')).toBeDefined();
        expect(screen.getByPlaceholderText('Nombre')).toBeDefined();
    });

    it('calls onClose when close button is clicked', () => {
        const handleClose = vi.fn();
        render(
            <EntityModal isOpen={true} onClose={handleClose} title="Test">
                <div>Content</div>
            </EntityModal>
        );

        const closeBtn = screen.getByRole('button', { name: /cerrar/i });
        fireEvent.click(closeBtn);
        expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it('disables submit button and shows loading state when isLoading is true', () => {
        render(
            <EntityModal
                isOpen={true}
                onClose={() => {}}
                onSubmit={() => {}}
                title="Test"
                isLoading={true}
                submitLabel="Guardar"
            >
                <div>Content</div>
            </EntityModal>
        );

        const submitBtn = screen.getByRole('button', { name: /guardando/i });
        expect(submitBtn.hasAttribute('disabled')).toBe(true);
    });
});
