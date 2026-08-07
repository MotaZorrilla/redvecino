/**
 * @file condoProfileWizard.js
 * @description Ayudante puro del Wizard de CondoProfilePanel.
 * Define el orden de pasos y la validación que habilita avanzar a cada uno.
 */
export const STEPS = [
    { key: 'general', title: 'Información General', icon: 'ℹ️' },
    { key: 'estructura', title: 'Estructura Física', icon: '🏢' },
    { key: 'tipos', title: 'Tipos de Unidades', icon: '📐' },
    { key: 'areas', title: 'Áreas Comunes', icon: '🏊' },
    { key: 'cargos', title: 'Cargos de Colaboradores', icon: '👷' },
    { key: 'parametros', title: 'Parámetros & Mora', icon: '⚙️', isLast: true },
];

export function validateStep(key, formData, lists = {}) {
    switch (key) {
        case 'general':
            return !!(formData.name && formData.rut && formData.address && formData.email && formData.phone);
        case 'estructura':
            return Number(formData.towers_count) > 0 && Number(formData.units_count) > 0;
        case 'tipos':
            return (lists.unitTypes || []).length > 0;
        case 'areas':
            return true;
        case 'cargos':
            return true;
        case 'parametros':
            return !!(formData.due_day && formData.mora_rate);
        default:
            return true;
    }
}

export default STEPS;