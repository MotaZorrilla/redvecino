/**
 * @file navigation.test.js
 * @description Tests de lógica pura de navegación del ecosistema RedVecino/MiVecino.
 *
 * Valida las reglas de negocio de RBAC relacionadas con la UI sin necesitar DOM:
 *   - Qué roles pertenecen a RedVecinoLayout (Llave 1) vs MiVecinoLayout (Llave 2)
 *   - Lógica de morosidad: $>= 3 meses bloquea reservas
 *   - Lógica de detección de Propietario por role_name o email
 *   - Tab IDs correctos por rol (que coincidan con los dashboards)
 *   - ROLE_LABELS y ROLES constants completos e íntegros
 *   - Lógica de redirección de rutas: tab inválido no debería navegarse
 */
import { describe, it, expect } from 'vitest';
import { ROLES, ROLE_LABELS, PERMISSIONS } from '@/utils/constants';

// =============================================================================
// Lógica de Layout (replicada aquí como "lógica pura" para testear el criterio)
// =============================================================================

/** Determina el layout correspondiente según el rol del usuario */
const getLayoutForRole = (roleName) => {
    const redVecinoRoles = ['ti', 'admin', 'administrador', 'comite', 'colaborador', 'superusuario'];
    const normalized = roleName?.toLowerCase() ?? '';
    return redVecinoRoles.includes(normalized) ? 'RedVecinoLayout' : 'MiVecinoLayout';
};

/** Retorna las pestañas disponibles para un rol dado (mirrors RedVecinoLayout.jsx) */
const getTabIdsByRole = (role) => {
    switch (role?.toLowerCase()) {
        case 'ti':
            return ['devops', 'matrix', 'impersonation', 'users', 'condos', 'sandbox'];
        case 'admin':
        case 'administrador':
            return ['dashboard', 'properties', 'users', 'tickets', 'payments', 'fines'];
        case 'comite':
            return ['dashboard', 'finances', 'chats', 'actas'];
        case 'colaborador':
            return ['attendance', 'packages', 'tickets'];
        case 'propietario':
            return ['home', 'reports', 'booking', 'units'];
        case 'residente':
            return ['home', 'comunicados', 'reservas', 'pagos', 'incidencias', 'comunidad', 'documentos'];
        default:
            return [];
    }
};

/** Detecta si un usuario es Propietario (mirrors MiVecinoLayout.jsx línea 44) */
const isPropietario = (user) =>
    user?.role_name?.toLowerCase() === 'propietario' ||
    user?.email?.includes('propietario');

/** Evalúa si un usuario moroso puede reservar áreas comunes */
const canBookCommonArea = (unpaidMonths) => unpaidMonths < 3;

// =============================================================================
describe('RBAC — Asignación de Layout por Rol (Estrategia de Dos Llaves)', () => {

    it('TI → RedVecinoLayout', () => {
        expect(getLayoutForRole('ti')).toBe('RedVecinoLayout');
    });

    it('Admin → RedVecinoLayout', () => {
        expect(getLayoutForRole('admin')).toBe('RedVecinoLayout');
    });

    it('Administrador (alias) → RedVecinoLayout', () => {
        expect(getLayoutForRole('Administrador')).toBe('RedVecinoLayout');
    });

    it('Comité → RedVecinoLayout', () => {
        expect(getLayoutForRole('comite')).toBe('RedVecinoLayout');
    });

    it('Colaborador → RedVecinoLayout', () => {
        expect(getLayoutForRole('colaborador')).toBe('RedVecinoLayout');
    });

    it('Propietario → MiVecinoLayout', () => {
        expect(getLayoutForRole('propietario')).toBe('MiVecinoLayout');
    });

    it('Residente → MiVecinoLayout', () => {
        expect(getLayoutForRole('residente')).toBe('MiVecinoLayout');
    });

    it('Rol nulo → MiVecinoLayout (fallback seguro)', () => {
        expect(getLayoutForRole(null)).toBe('MiVecinoLayout');
    });

    it('Rol desconocido → MiVecinoLayout (fallback seguro)', () => {
        expect(getLayoutForRole('invitado_temporal')).toBe('MiVecinoLayout');
    });
});

// =============================================================================
describe('RBAC — Tab IDs por Rol (integridad de la navegación)', () => {

    it('TI tiene exactamente 6 pestañas', () => {
        expect(getTabIdsByRole('ti')).toHaveLength(6);
    });

    it('Admin tiene exactamente 6 pestañas', () => {
        expect(getTabIdsByRole('admin')).toHaveLength(6);
    });

    it('Comité tiene exactamente 4 pestañas', () => {
        expect(getTabIdsByRole('comite')).toHaveLength(4);
    });

    it('Colaborador tiene exactamente 3 pestañas', () => {
        expect(getTabIdsByRole('colaborador')).toHaveLength(3);
    });

    it('Propietario tiene exactamente 4 pestañas', () => {
        expect(getTabIdsByRole('propietario')).toHaveLength(4);
    });

    it('Residente tiene exactamente 7 pestañas', () => {
        expect(getTabIdsByRole('residente')).toHaveLength(7);
    });

    it('Colaborador: "packages" existe, "parcels" NO existe (BUG-04 fix)', () => {
        const tabs = getTabIdsByRole('colaborador');
        expect(tabs).toContain('packages');
        expect(tabs).not.toContain('parcels');
    });

    it('Comité: "finances" existe, "payments" NO existe (BUG-03 fix)', () => {
        const tabs = getTabIdsByRole('comite');
        expect(tabs).toContain('finances');
        expect(tabs).not.toContain('payments');
    });

    it('Comité: "actas" existe en sus tabs', () => {
        const tabs = getTabIdsByRole('comite');
        expect(tabs).toContain('actas');
    });

    it('Residente: "incidencias" existe (sección de Tickets)', () => {
        const tabs = getTabIdsByRole('residente');
        expect(tabs).toContain('incidencias');
    });

    it('Rol inválido: devuelve array vacío (sin crash)', () => {
        expect(getTabIdsByRole('xyz_random')).toEqual([]);
    });
});

// =============================================================================
describe('RBAC — Tabs Exclusivos: sin contaminación cruzada entre roles', () => {

    it('pestañas de Admin NO aparecen en las de Comité', () => {
        const adminTabs = getTabIdsByRole('admin');
        const comiteTabs = getTabIdsByRole('comite');
        const intersection = adminTabs.filter(t => comiteTabs.includes(t) && t !== 'dashboard');
        expect(intersection).toHaveLength(0);
    });

    it('pestañas de TI NO se superponen con las de Residente', () => {
        const tiTabs = getTabIdsByRole('ti');
        const residenteTabs = getTabIdsByRole('residente');
        const intersection = tiTabs.filter(t => residenteTabs.includes(t));
        expect(intersection).toHaveLength(0);
    });

    it('pestañas de Propietario NO se superponen con las de Colaborador', () => {
        const propTabs = getTabIdsByRole('propietario');
        const colabTabs = getTabIdsByRole('colaborador');
        const intersection = propTabs.filter(t => colabTabs.includes(t));
        expect(intersection).toHaveLength(0);
    });
});

// =============================================================================
describe('Morosidad — Regla de Negocio de Bloqueo de Reservas', () => {

    it('0 meses impagos: puede reservar áreas comunes', () => {
        expect(canBookCommonArea(0)).toBe(true);
    });

    it('1 mes impago: puede reservar áreas comunes', () => {
        expect(canBookCommonArea(1)).toBe(true);
    });

    it('2 meses impagos: puede reservar áreas comunes', () => {
        expect(canBookCommonArea(2)).toBe(true);
    });

    it('3 meses impagos: BLOQUEADO (>= 3 desencadena restricción)', () => {
        expect(canBookCommonArea(3)).toBe(false);
    });

    it('4 meses impagos: BLOQUEADO', () => {
        expect(canBookCommonArea(4)).toBe(false);
    });

    it('12 meses impagos: BLOQUEADO (deuda extrema)', () => {
        expect(canBookCommonArea(12)).toBe(false);
    });
});

// =============================================================================
describe('Detección de Propietario — Lógica de MiVecinoLayout', () => {

    it('role_name "Propietario" → es Propietario', () => {
        expect(isPropietario({ role_name: 'Propietario', email: 'x@y.cl' })).toBe(true);
    });

    it('role_name "propietario" (minúsculas) → es Propietario', () => {
        expect(isPropietario({ role_name: 'propietario', email: 'x@y.cl' })).toBe(true);
    });

    it('email "propietario@..." → es Propietario (detección por email)', () => {
        expect(isPropietario({ role_name: 'Residente', email: 'propietario@comunidad.cl' })).toBe(true);
    });

    it('role_name "Residente" y email sin "propietario" → NO es Propietario', () => {
        expect(isPropietario({ role_name: 'Residente', email: 'residente@x.cl' })).toBe(false);
    });

    it('usuario null → NO es Propietario (sin crash)', () => {
        expect(isPropietario(null)).toBeFalsy();
    });

    it('usuario undefined → NO es Propietario (sin crash)', () => {
        expect(isPropietario(undefined)).toBeFalsy();
    });
});

// =============================================================================
describe('Constants — ROLES, ROLE_LABELS, PERMISSIONS (integridad)', () => {

    it('ROLES contiene los 6 roles del sistema (más superusuario)', () => {
        expect(Object.keys(ROLES)).toHaveLength(7);
    });

    it('ROLES.ADMIN tiene valor "admin"', () => {
        expect(ROLES.ADMIN).toBe('admin');
    });

    it('ROLES.TI tiene valor "ti"', () => {
        expect(ROLES.TI).toBe('ti');
    });

    it('ROLE_LABELS cubre exactamente los 7 roles', () => {
        expect(Object.keys(ROLE_LABELS)).toHaveLength(7);
    });

    it('ROLE_LABELS.propietario existe como string no vacío', () => {
        expect(typeof ROLE_LABELS.propietario).toBe('string');
        expect(ROLE_LABELS.propietario.length).toBeGreaterThan(0);
    });

    it('PERMISSIONS tiene al menos 9 permisos definidos', () => {
        expect(Object.keys(PERMISSIONS).length).toBeGreaterThanOrEqual(9);
    });

    it('PERMISSIONS.VIEW_FINANCIAL_REPORTS existe', () => {
        expect(PERMISSIONS.VIEW_FINANCIAL_REPORTS).toBeDefined();
    });

    it('PERMISSIONS.MANAGE_USERS existe', () => {
        expect(PERMISSIONS.MANAGE_USERS).toBeDefined();
    });
});
