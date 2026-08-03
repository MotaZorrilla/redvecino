import '@testing-library/jest-dom/vitest';

// Stub global de la función route() de Ziggy (Inertia/Laravel).
// Los layouts usan route('logout') en el botón "Cerrar sesión".
// Sin este stub, los tests fallan con "ReferenceError: route is not defined".
global.route = (name) => `/__stub__/${name}`;
