import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import ToastContainer from './Toast';
import { toast } from '@/utils/notify';

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
});
