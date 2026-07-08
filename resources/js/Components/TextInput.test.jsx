import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import React, { createRef } from 'react';
import TextInput from './TextInput';

afterEach(() => {
    document.body.innerHTML = '';
});

describe('TextInput', () => {
    it('renders text input by default', () => {
        render(<TextInput data-testid="test-input" />);
        const input = screen.getByTestId('test-input');
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('type', 'text');
    });

    it('renders with specified input type', () => {
        render(<TextInput data-testid="test-input" type="password" />);
        const input = screen.getByTestId('test-input');
        expect(input).toHaveAttribute('type', 'password');
    });

    it('forwards custom class names', () => {
        render(<TextInput data-testid="test-input" className="custom-class" />);
        const input = screen.getByTestId('test-input');
        expect(input).toHaveClass('custom-class');
        expect(input).toHaveClass('rounded-md'); // Clase por defecto
    });

    it('propagates other HTML input attributes', () => {
        render(<TextInput data-testid="test-input" placeholder="Escribe aquí" disabled required />);
        const input = screen.getByTestId('test-input');
        expect(input).toHaveAttribute('placeholder', 'Escribe aquí');
        expect(input).toBeDisabled();
        expect(input).toBeRequired();
    });

    it('focuses the input when isFocused is true', () => {
        render(<TextInput data-testid="test-input" isFocused={true} />);
        const input = screen.getByTestId('test-input');
        expect(input).toHaveFocus();
    });

    it('does not focus the input when isFocused is false', () => {
        render(<TextInput data-testid="test-input" isFocused={false} />);
        const input = screen.getByTestId('test-input');
        expect(input).not.toHaveFocus();
    });

    it('exposes focus method through React ref', () => {
        const ref = createRef();
        render(<TextInput ref={ref} data-testid="test-input" />);
        const input = screen.getByTestId('test-input');

        expect(ref.current).toHaveProperty('focus');
        expect(typeof ref.current.focus).toBe('function');

        expect(input).not.toHaveFocus();
        ref.current.focus();
        expect(input).toHaveFocus();
    });
});
