import { describe, it, expect, vi } from 'vitest';
import { addToastListener, toast } from './notify';

describe('notify', () => {
    it('addToastListener returns a cleanup function', () => {
        const fn = vi.fn();
        const cleanup = addToastListener(fn);
        expect(cleanup).toBeInstanceOf(Function);
    });

    it('toast notifies all listeners', () => {
        const fn1 = vi.fn();
        const fn2 = vi.fn();
        addToastListener(fn1);
        addToastListener(fn2);

        toast('Hello', 'success');

        expect(fn1).toHaveBeenCalledWith({ message: 'Hello', type: 'success', id: expect.any(Number) });
        expect(fn2).toHaveBeenCalledWith({ message: 'Hello', type: 'success', id: expect.any(Number) });
    });

    it('toast defaults to success type', () => {
        const fn = vi.fn();
        addToastListener(fn);

        toast('Test');

        expect(fn).toHaveBeenCalledWith({ message: 'Test', type: 'success', id: expect.any(Number) });
    });

    it('cleanup removes listener', () => {
        const fn = vi.fn();
        const cleanup = addToastListener(fn);
        cleanup();

        toast('Should not be received');

        expect(fn).not.toHaveBeenCalled();
    });

    it('handles multiple toasts with different types', () => {
        const fn = vi.fn();
        addToastListener(fn);

        toast('Error!', 'error');
        toast('Warning!', 'warning');

        expect(fn).toHaveBeenCalledTimes(2);
        expect(fn).toHaveBeenCalledWith({ message: 'Error!', type: 'error', id: expect.any(Number) });
        expect(fn).toHaveBeenCalledWith({ message: 'Warning!', type: 'warning', id: expect.any(Number) });
    });
});
