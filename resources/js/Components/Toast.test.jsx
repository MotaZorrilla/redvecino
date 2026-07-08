import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import ToastContainer from './Toast';
import { toast } from '@/utils/notify';
import * as notify from '@/utils/notify';

afterEach(() => {
    document.body.innerHTML = '';
});

describe('ToastContainer', () => {
    it('renders null when no toasts', () => {
        const { container } = render(<ToastContainer />);
        expect(container.firstChild).toBeNull();
    });

    it('renders a toast when notified', () => {
        render(<ToastContainer />);

        act(() => {
            toast('Operación exitosa', 'success');
        });

        expect(screen.getByText('Operación exitosa')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('renders error toast with error icon', () => {
        render(<ToastContainer />);

        act(() => {
            toast('Algo salió mal', 'error');
        });

        expect(screen.getByText('Algo salió mal')).toBeInTheDocument();
        expect(screen.getByText('✕')).toBeInTheDocument();
    });

    it('renders warning toast with warning icon', () => {
        render(<ToastContainer />);

        act(() => {
            toast('Cuidado', 'warning');
        });

        expect(screen.getByText('Cuidado')).toBeInTheDocument();
        expect(screen.getByText('⚠')).toBeInTheDocument();
    });

    it('renders multiple toasts', () => {
        render(<ToastContainer />);

        act(() => {
            toast('First', 'success');
            toast('Second', 'error');
        });

        expect(screen.getByText('First')).toBeInTheDocument();
        expect(screen.getByText('Second')).toBeInTheDocument();
    });

    it('removes toast after 3 seconds', () => {
        vi.useFakeTimers();
        render(<ToastContainer />);

        act(() => {
            toast('Temporal', 'success');
        });

        expect(screen.getByText('Temporal')).toBeInTheDocument();

        act(() => {
            vi.advanceTimersByTime(3000);
        });

        expect(screen.queryByText('Temporal')).not.toBeInTheDocument();
        vi.useRealTimers();
    });

    it('renders success toast with success icon and success class', () => {
        render(<ToastContainer />);

        act(() => {
            toast('Éxito completo', 'success');
        });

        const element = screen.getByText('Éxito completo').parentElement;
        expect(element).toHaveClass('bg-brand-success');
        expect(screen.getByText('✓')).toBeInTheDocument();
    });

    it('renders error and warning toasts with correct CSS classes', () => {
        render(<ToastContainer />);

        act(() => {
            toast('Error grave', 'error');
            toast('Alerta leve', 'warning');
        });

        const errorEl = screen.getByText('Error grave').parentElement;
        const warningEl = screen.getByText('Alerta leve').parentElement;

        expect(errorEl).toHaveClass('bg-brand-error');
        expect(warningEl).toHaveClass('bg-brand-warning');
    });

    it('unsubscribes from listener when unmounted to prevent memory leaks', () => {
        const unsubscribeSpy = vi.fn();
        const addListenerSpy = vi.spyOn(notify, 'addToastListener').mockReturnValue(unsubscribeSpy);

        const { unmount } = render(<ToastContainer />);
        expect(addListenerSpy).toHaveBeenCalled();

        unmount();
        expect(unsubscribeSpy).toHaveBeenCalled();

        addListenerSpy.mockRestore();
    });
});
