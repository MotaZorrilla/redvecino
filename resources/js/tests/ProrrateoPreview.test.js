import { describe, it, expect } from 'vitest';

export function calculateInstallmentsPreview(totalAmount, months) {
    if (!totalAmount || totalAmount <= 0 || !months || months <= 1) {
        return { isProrated: false, monthlyAmount: totalAmount, months: 1 };
    }
    const monthly = Math.round(totalAmount / months);
    return {
        isProrated: true,
        monthlyAmount: monthly,
        months: Number(months),
    };
}

describe('ProrrateoPreview Utility', () => {
    it('returns flat amount if not prorated', () => {
        const res = calculateInstallmentsPreview(100000, 1);
        expect(res.isProrated).toBe(false);
        expect(res.monthlyAmount).toBe(100000);
    });

    it('calculates rounded monthly installments when prorated', () => {
        const res = calculateInstallmentsPreview(100000, 4);
        expect(res.isProrated).toBe(true);
        expect(res.monthlyAmount).toBe(25000);
        expect(res.months).toBe(4);
    });
});
