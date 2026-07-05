import { describe, it, expect } from 'vitest';
import { ROLES, ROLE_LABELS, PERMISSIONS } from './constants';

describe('constants', () => {
    describe('ROLES', () => {
        it('has all 7 roles defined', () => {
            expect(Object.keys(ROLES)).toHaveLength(7);
        });

        it('each role has a corresponding label', () => {
            for (const key of Object.keys(ROLES)) {
                expect(ROLE_LABELS).toHaveProperty(ROLES[key]);
            }
        });
    });

    describe('PERMISSIONS', () => {
        it('has all required permissions', () => {
            expect(PERMISSIONS.MANAGE_USERS).toBe('manage users');
            expect(PERMISSIONS.APPROVE_EXPENSES).toBe('approve expenses');
            expect(PERMISSIONS.VIEW_FINANCIAL_REPORTS).toBe('view financial reports');
            expect(PERMISSIONS.CONFIGURE_SYSTEM).toBe('configure system');
            expect(PERMISSIONS.ASSIGN_TICKETS).toBe('assign tickets');
            expect(PERMISSIONS.RESOLVE_TICKETS).toBe('resolve tickets');
            expect(PERMISSIONS.PUBLISH_ANNOUNCEMENTS).toBe('publish announcements');
            expect(PERMISSIONS.VIEW_LOGS).toBe('view logs');
            expect(PERMISSIONS.MANAGE_ROLES).toBe('manage roles');
        });

        it('all permission values are non-empty strings', () => {
            for (const value of Object.values(PERMISSIONS)) {
                expect(value).toBeTruthy();
                expect(typeof value).toBe('string');
            }
        });
    });
});
