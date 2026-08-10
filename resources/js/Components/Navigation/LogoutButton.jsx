import React from 'react';
import { router } from '@inertiajs/react';

export default function LogoutButton({ className = '', children = 'Cerrar sesión' }) {
    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <button
            onClick={handleLogout}
            className={className || "w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all flex items-center gap-2"}
        >
            <span>🚪</span>
            <span>{children}</span>
        </button>
    );
}
