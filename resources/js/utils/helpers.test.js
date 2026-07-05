import { describe, it, expect } from 'vitest';
import { generatePassword, formatCurrency, shortenAddress } from './helpers';

describe('generatePassword', () => {
    it('returns a string of default length 12', () => {
        const pwd = generatePassword();
        expect(pwd).toHaveLength(12);
    });

    it('returns a string of specified length', () => {
        const pwd = generatePassword(8);
        expect(pwd).toHaveLength(8);
    });

    it('only contains valid characters', () => {
        const pwd = generatePassword();
        expect(pwd).toMatch(/^[A-Za-z0-9]+$/);
    });

    it('returns different values on successive calls', () => {
        const a = generatePassword();
        const b = generatePassword();
        expect(a).not.toBe(b);
    });
});

describe('formatCurrency', () => {
    it('formats a number with $ and CL locale', () => {
        const result = formatCurrency(150000);
        expect(result).toBe('$150.000');
    });

    it('formats zero', () => {
        expect(formatCurrency(0)).toBe('$0');
    });

    it('handles null', () => {
        expect(formatCurrency(null)).toBe('$0');
    });

    it('handles undefined', () => {
        expect(formatCurrency(undefined)).toBe('$0');
    });

    it('handles decimal values', () => {
        const result = formatCurrency(1234.56);
        expect(result).toMatch(/^\$/);
        expect(result).not.toBe('$0');
    });
});

describe('shortenAddress', () => {
    it('returns first part before comma', () => {
        expect(shortenAddress('Av. Siempre Viva 742, Santiago, Chile')).toBe('Av. Siempre Viva 742');
    });

    it('returns full address when no comma', () => {
        expect(shortenAddress('Calle 123')).toBe('Calle 123');
    });

    it('returns empty for null', () => {
        expect(shortenAddress(null)).toBe('');
    });

    it('returns empty for empty string', () => {
        expect(shortenAddress('')).toBe('');
    });

    it('trims whitespace from first part', () => {
        expect(shortenAddress('  Depto 301  , Block A')).toBe('Depto 301');
    });
});
