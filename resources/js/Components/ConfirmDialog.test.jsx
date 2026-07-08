import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ConfirmDialog from './ConfirmDialog';

afterEach(() => {
    document.body.innerHTML = '';
});

describe('ConfirmDialog', () => {
    const defaultProps = {
        open: true,
        onClose: vi.fn(),
        onConfirm: vi.fn(),
        title: '¿Confirmar acción?',
        message: 'Esta acción no se puede deshacer.',
    };

    it('does not render when open is false', () => {
        let container;
        act(() => {
            const rendered = render(<ConfirmDialog {...defaultProps} open={false} />);
            container = rendered.container;
        });
        expect(screen.queryByText('¿Confirmar acción?')).not.toBeInTheDocument();
        expect(container.firstChild).toBeNull();
    });

    it('renders title, message and buttons when open is true', () => {
        act(() => {
            render(<ConfirmDialog {...defaultProps} />);
        });
        
        expect(screen.getByText('¿Confirmar acción?')).toBeInTheDocument();
        expect(screen.getByText('Esta acción no se puede deshacer.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Eliminar' })).toBeInTheDocument();
    });

    it('renders custom button texts', () => {
        act(() => {
            render(
                <ConfirmDialog 
                    {...defaultProps} 
                    confirmText="Sí, aceptar" 
                    cancelText="No, volver" 
                />
            );
        });

        expect(screen.getByRole('button', { name: 'No, volver' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Sí, aceptar' })).toBeInTheDocument();
    });

    it('calls onClose(false) when cancel button is clicked', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        
        act(() => {
            render(<ConfirmDialog {...defaultProps} onClose={onClose} />);
        });

        const cancelBtn = screen.getByRole('button', { name: 'Cancelar' });
        await act(async () => {
            await user.click(cancelBtn);
        });

        expect(onClose).toHaveBeenCalledWith(false);
    });

    it('calls onConfirm and onClose(false) when confirm button is clicked', async () => {
        const user = userEvent.setup();
        const onConfirm = vi.fn();
        const onClose = vi.fn();
        
        act(() => {
            render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} onClose={onClose} />);
        });

        const confirmBtn = screen.getByRole('button', { name: 'Eliminar' });
        await act(async () => {
            await user.click(confirmBtn);
        });

        expect(onConfirm).toHaveBeenCalled();
        expect(onClose).toHaveBeenCalledWith(false);
    });

    it('applies danger styling class to confirm button if danger is true', () => {
        act(() => {
            render(<ConfirmDialog {...defaultProps} danger={true} />);
        });
        const confirmBtn = screen.getByRole('button', { name: 'Eliminar' });
        expect(confirmBtn).toHaveClass('bg-brand-error');
        expect(confirmBtn).not.toHaveClass('bg-brand-teal');
    });

    it('applies teal styling class to confirm button if danger is false', () => {
        act(() => {
            render(<ConfirmDialog {...defaultProps} danger={false} />);
        });
        const confirmBtn = screen.getByRole('button', { name: 'Eliminar' });
        expect(confirmBtn).toHaveClass('bg-brand-teal');
        expect(confirmBtn).not.toHaveClass('bg-brand-error');
    });
});
