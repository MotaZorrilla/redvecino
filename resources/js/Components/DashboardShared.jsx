import { Link, usePage } from '@inertiajs/react';

export function StatCard({ title, value, icon, description, color = 'indigo', onClick }) {
    const colors = {
        indigo: {
            bg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border dark:border-indigo-500/20',
            text: 'text-indigo-600 dark:text-indigo-400'
        },
        emerald: {
            bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border dark:border-emerald-500/20',
            text: 'text-emerald-600 dark:text-emerald-400'
        },
        amber: {
            bg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 dark:border dark:border-amber-500/20',
            text: 'text-amber-600 dark:text-amber-400'
        },
        rose: {
            bg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 dark:border dark:border-rose-500/20',
            text: 'text-rose-600 dark:text-rose-400'
        },
        violet: {
            bg: 'bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400 dark:border dark:border-violet-500/20',
            text: 'text-violet-600 dark:text-violet-400'
        },
        cyan: {
            bg: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400 dark:border dark:border-cyan-500/20',
            text: 'text-cyan-600 dark:text-cyan-400'
        },
    };

    const activeColor = colors[color] || colors.indigo;

    return (
        <div className={`relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-gray-100 dark:border-slate-800/80 hover:shadow-md transition-all duration-200 ${onClick ? 'cursor-pointer hover:border-[#00A896]/60 hover:bg-slate-50/50 dark:hover:bg-slate-800/10 active:scale-98' : ''}`} onClick={onClick}>
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-slate-400">{title}</p>
                    <p className={`mt-2 text-3xl font-bold ${activeColor.text}`}>{value}</p>
                    {description && (
                        <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">{description}</p>
                    )}
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${activeColor.bg}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}

export function Badge({ children, variant = 'default' }) {
    const variants = {
        default: 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300 dark:border dark:border-slate-700/60',
        success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-500 dark:border dark:border-emerald-500/20',
        warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 dark:border dark:border-amber-500/20',
        danger: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 dark:border dark:border-rose-500/20',
        info: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 dark:border dark:border-blue-500/20',
        purple: 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400 dark:border dark:border-violet-500/20',
    };

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant] || variants.default}`}>
            {children}
        </span>
    );
}

export function StatusBadge({ status, type = 'status' }) {
    const configs = {
        status: {
            active: { label: 'Activo', variant: 'success' },
            inactive: { label: 'Inactivo', variant: 'danger' },
            occupied: { label: 'Ocupado', variant: 'success' },
            vacant: { label: 'Disponible', variant: 'warning' },
        },
        ticket: {
            open: { label: 'Abierto', variant: 'info' },
            in_progress: { label: 'En Progreso', variant: 'warning' },
            resolved: { label: 'Resuelto', variant: 'success' },
            closed: { label: 'Cerrado', variant: 'default' },
            cancelled: { label: 'Cancelado', variant: 'danger' },
        },
        priority: {
            low: { label: 'Baja', variant: 'default' },
            medium: { label: 'Media', variant: 'warning' },
            high: { label: 'Alta', variant: 'danger' },
            urgent: { label: 'Urgente', variant: 'danger' },
        },
        payment: {
            pending: { label: 'Pendiente', variant: 'warning' },
            completed: { label: 'Pagado', variant: 'success' },
            overdue: { label: 'Vencido', variant: 'danger' },
            cancelled: { label: 'Cancelado', variant: 'default' },
        },
    };

    const config = configs[type]?.[status] || { label: status, variant: 'default' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function StatRow({ label, value, icon }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-gray-50/50 dark:border-slate-800/40 last:border-b-0">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-400">
                {icon && <span className="text-gray-400 dark:text-slate-500">{icon}</span>}
                {label}
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-slate-200">{value}</span>
        </div>
    );
}

export function SectionCard({ title, link, children, emptyMessage = 'No hay datos disponibles' }) {
    return (
        <div className="rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-800">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
                {link && (
                    <Link href={link} className="text-sm font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                        Ver todos
                    </Link>
                )}
            </div>
            <div className="px-6 py-4">
                {children || (
                    <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-4">{emptyMessage}</p>
                )}
            </div>
        </div>
    );
}

export function SimpleTable({ headers, rows, emptyMessage = 'No hay registros' }) {
    if (!rows || rows.length === 0) {
        return <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-4">{emptyMessage}</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-slate-800">
                <thead>
                    <tr>
                        {headers.map((header, i) => (
                            <th
                                key={i}
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider"
                            >
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-slate-900">
                    {rows.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors">
                            {row.cells.map((cell, j) => (
                                <td key={j} className="px-4 py-3 text-sm text-gray-700 dark:text-slate-300 whitespace-nowrap">
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function RoleTransitionLoader({ user, fadeOut }) {
    const userRoles = user?.roles || [];
    const isAdminSide = userRoles.some(role => 
        ['admin', 'ti', 'committee', 'employee', 'colaborador', 'administrador', 'comité'].includes(role.toLowerCase())
    );

    return (
        <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-500 ease-in-out ${
            fadeOut ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
        } ${
            isAdminSide 
                ? 'bg-gradient-to-br from-[#0F2557] via-[#122e6b] to-[#0A183A]' 
                : 'bg-gradient-to-br from-[#72B043] via-[#85c851] to-[#5a932f]'
        }`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.03)_1px,_transparent_1px)] bg-[size:24px_24px] opacity-40" />
            
            <div className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center animate-scale-up">
                {isAdminSide ? (
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative flex items-center justify-center w-24 h-24 rounded-3xl bg-slate-900/40 border border-slate-700/30 shadow-2xl shadow-cyan-500/10">
                            <svg className="w-16 h-16 text-[#00A896]" viewBox="0 0 100 100" fill="none">
                                <path d="M25,80 L25,20 L55,20 C70,20 75,32 65,45 C55,55 45,55 45,55 L65,80" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="25" cy="20" r="5" fill="#72B043" className="animate-ping" />
                                <circle cx="25" cy="20" r="4" fill="#72B043" />
                                <circle cx="55" cy="20" r="4" fill="#00A896" />
                                <circle cx="65" cy="45" r="4" fill="#72B043" />
                                <circle cx="25" cy="80" r="4" fill="#00A896" />
                                <circle cx="65" cy="80" r="5" fill="#00A896" className="animate-pulse" />
                                <circle cx="65" cy="80" r="4" fill="#00A896" />
                            </svg>
                        </div>
                        
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black tracking-tight text-white font-sans">
                                Red<span className="text-[#00A896]">Vecino</span>
                            </h1>
                            <p className="text-[10px] tracking-[0.25em] font-bold text-cyan-400 uppercase">
                                La Red Inteligente de Condominios
                            </p>
                        </div>

                        <div className="mt-8 px-5 py-3 rounded-2xl bg-slate-900/50 backdrop-blur border border-slate-800 text-slate-300 text-xs flex flex-col items-center gap-2 shadow-lg">
                            <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                                <span className="font-mono text-cyan-400 uppercase tracking-wider font-bold">Rol Administrativo Detectado</span>
                            </span>
                            <span className="text-[11px] text-slate-400">Verificando accesos en base de datos local SQLite...</span>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-6">
                        <div className="relative flex items-center justify-center w-24 h-24 rounded-3xl bg-white/10 border border-white/20 shadow-2xl shadow-emerald-500/10">
                            <svg className="w-16 h-16 text-white" viewBox="0 0 100 100" fill="none">
                                <path d="M50,15 L15,45 L25,45 L25,80 L75,80 L75,45 L85,45 Z" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                                <circle cx="35" cy="65" r="5" fill="#72B043" />
                                <circle cx="50" cy="55" r="5" fill="#00A896" />
                                <circle cx="65" cy="65" r="5" fill="#EC7A08" />
                                <path d="M30,73 C30,68 40,68 40,73" stroke="#72B043" strokeWidth="3" strokeLinecap="round" />
                                <path d="M45,63 C45,58 55,58 55,63" stroke="#00A896" strokeWidth="3" strokeLinecap="round" />
                                <path d="M60,73 C60,68 70,68 70,73" stroke="#EC7A08" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                        </div>
                        
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black tracking-tight text-white font-sans">
                                Mi<span className="text-emerald-100">Vecino</span>
                            </h1>
                            <p className="text-[10px] tracking-[0.2em] font-bold text-emerald-200 uppercase">
                                Tu comunidad, en una sola app
                            </p>
                        </div>

                        <div className="mt-8 px-5 py-3 rounded-2xl bg-white/10 backdrop-blur border border-white/15 text-white text-xs flex flex-col items-center gap-2 shadow-lg">
                            <span className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-emerald-300 animate-ping" />
                                <span className="font-mono text-emerald-300 uppercase tracking-wider font-bold">Rol Residente Detectado</span>
                            </span>
                            <span className="text-[11px] text-emerald-100/80">Conectando con tu condominio...</span>
                        </div>
                    </div>
                )}

                <p className="mt-16 text-xs text-white/50 italic font-medium tracking-wide">
                    "Más que vecinos, somos comunidad."
                </p>
            </div>
        </div>
    );
}
