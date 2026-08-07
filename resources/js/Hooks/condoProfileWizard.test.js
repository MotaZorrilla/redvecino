/**
 * @file condoProfileWizard.test.js
 * @description TDD para el ayudante puro del Wizard de CondoProfilePanel.
 * Define el orden de pasos y qué validación bloquea avanzar.
 */
import { describe, it, expect } from 'vitest';
import { STEPS, validateStep } from '@/hooks/condoProfileWizard';

describe('CondoProfileWizard — pasos y validación', () => {
    it('define 6 pasos en orden lógico', () => {
        expect(STEPS).toHaveLength(6);
        expect(STEPS.map(s => s.key)).toEqual([
            'general', 'estructura', 'tipos', 'areas', 'cargos', 'parametros',
        ]);
    });

    it('valida general: exige nombre, rut, dirección, email y teléfono', () => {
        const partial = { name: 'C', rut: '12.3-9', address: 'Av x', email: 'a@b.cl' };
        expect(validateStep('general', partial, {})).toBe(false);
        expect(validateStep('general', { ...partial, phone: '+56' }, {})).toBe(true);
    });

    it('valida estructura: exige torres y unidades > 0', () => {
        expect(validateStep('estructura', { towers_count: 0, units_count: 10 }, {})).toBe(false);
        expect(validateStep('estructura', { towers_count: 1, units_count: 10 }, {})).toBe(true);
    });

    it('valida tipos: exige al menos un modelo de unidad', () => {
        expect(validateStep('tipos', {}, { unitTypes: [] })).toBe(false);
        expect(validateStep('tipos', {}, { unitTypes: [{ id: 1 }] })).toBe(true);
    });

    it('parametros: exige due_day y mora_rate', () => {
        expect(validateStep('parametros', { due_day: 10 }, {})).toBe(false);
        expect(validateStep('parametros', { due_day: 10, mora_rate: 2 }, {})).toBe(true);
    });

    it('el paso final es parametros y permite el envío del formulario', () => {
        expect(STEPS[STEPS.length - 1].key).toBe('parametros');
        expect(STEPS[STEPS.length - 1].isLast).toBe(true);
    });
});