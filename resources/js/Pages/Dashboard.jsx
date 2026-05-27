import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

function StatCard({ title, value, icon, description, color = 'indigo' }) {
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
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-sm border border-gray-100 dark:border-slate-800/80 hover:shadow-md transition-shadow">
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

function Badge({ children, variant = 'default' }) {
    const variants = {
        default: 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-slate-300 dark:border dark:border-slate-700/60',
        success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-450 dark:border dark:border-emerald-500/20',
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

function StatusBadge({ status, type = 'status' }) {
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

function StatRow({ label, value, icon }) {
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

function SectionCard({ title, link, children, emptyMessage = 'No hay datos disponibles' }) {
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

function SimpleTable({ headers, rows, emptyMessage = 'No hay registros' }) {
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

function RoleTransitionLoader({ user, fadeOut }) {
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

export default function Dashboard() {
    const { stats, recentTickets, recentAnnouncements, recentPayments, upcomingExpenses } = usePage().props;
    const user = usePage().props.auth.user;

    const [showTransition, setShowTransition] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);
    
    // Core Role Detection
    const userRoles = user?.roles || [];
    const isActuallyAdmin = userRoles.some(role => 
        ['admin', 'ti', 'committee', 'employee', 'colaborador', 'administrador', 'comité'].includes(role.toLowerCase())
    );
    
    // Interactive Simulation Toggle for Admins/TI
    const [simulationMode, setSimulationMode] = useState(false);
    
    // Check if the current render should be Admin view or Resident view
    const renderAdminView = isActuallyAdmin && !simulationMode;

    // Layout simulation states
    const [forceMobileView, setForceMobileView] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const checkResolution = () => {
            setIsDesktop(window.innerWidth >= 768);
        };
        checkResolution();
        window.addEventListener('resize', checkResolution);
        return () => window.removeEventListener('resize', checkResolution);
    }, []);

    useEffect(() => {
        const fadeTimer = setTimeout(() => {
            setFadeOut(true);
        }, 1600);
        
        const transitionTimer = setTimeout(() => {
            setShowTransition(false);
        }, 2100);
        
        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(transitionTimer);
        };
    }, []);

    const [darkMode, setDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('dashboard-theme') === 'dark' || document.documentElement.classList.contains('dark');
        }
        return false;
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('dashboard-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('dashboard-theme', 'light');
        }
    }, [darkMode]);

    const toggleTheme = () => {
        setDarkMode(prev => !prev);
    };

    const [devOpsActive, setDevOpsActive] = useState(false);
    
    // DevOps Telemetry Stats
    const [cpuLoad, setCpuLoad] = useState(14);
    const [ramUsage, setRamUsage] = useState(124);
    const [latency, setLatency] = useState(8);
    
    // DevOps console logs
    const [terminalLogs, setTerminalLogs] = useState([
        '[TI-INIT] Sesión de Consola TI establecida.',
        '[INFRA] Conectado al kernel local de RedVecino & MiVecino SQLite.',
        '[SECURITY] Spatie Permisos cargados con éxito (Autenticado como TI).'
    ]);
    
    // Spatie RBAC interactive matrix
    const [rbMatrix, setRbMatrix] = useState({
        admin: { read_profile: true, pay_expenses: true, resolve_tickets: true, publish_announcements: true, config_ti: false },
        owner: { read_profile: true, pay_expenses: true, resolve_tickets: false, publish_announcements: false, config_ti: false },
        resident: { read_profile: true, pay_expenses: false, resolve_tickets: false, publish_announcements: false, config_ti: false },
        committee: { read_profile: true, pay_expenses: false, resolve_tickets: false, publish_announcements: true, config_ti: false },
        employee: { read_profile: true, pay_expenses: false, resolve_tickets: true, publish_announcements: false, config_ti: false },
        ti: { read_profile: true, pay_expenses: true, resolve_tickets: true, publish_announcements: true, config_ti: true }
    });

    // Resident View (MiVecino) state hooks
    const [mobileTab, setMobileTab] = useState('home');
    
    // Resident interactive states
    const [residentCondo, setResidentCondo] = useState('Condominio Parque Central');
    const [residentExpenses, setResidentExpenses] = useState({
        id: 421,
        period: 'Mayo 2026',
        amount: 165000,
        dueDate: '05 de Junio, 2026',
        status: 'pending',
        items: [
            { name: 'Seguridad & Conserjería', amount: 73260 },
            { name: 'Limpieza & Ornato', amount: 41250 },
            { name: 'Mantenciones Técnicas', amount: 32010 },
            { name: 'Servicios Básicos Comunes', amount: 18480 }
        ]
    });
    
    const [paymentHistory, setPaymentHistory] = useState([
        { id: 402, period: 'Abril 2026', amount: 165000, date: '04/04/2026', method: 'Transferencia', status: 'completed' },
        { id: 388, period: 'Marzo 2026', amount: 158000, date: '02/03/2026', method: 'Tarjeta de Crédito', status: 'completed' },
        { id: 374, period: 'Febrero 2026', amount: 158000, date: '04/02/2026', method: 'Transferencia', status: 'completed' }
    ]);

    const [reportedTickets, setReportedTickets] = useState([
        { id: 108, title: 'Falla de luminaria en pasillo C', category: 'Electricidad', priority: 'high', status: 'open', date: '25/05/2026', desc: 'La luz de emergencia parpadea continuamente.' },
        { id: 94, title: 'Puerta de piscina no cierra con pestillo', category: 'Seguridad', priority: 'medium', status: 'in_progress', date: '18/05/2026', desc: 'Riesgo para niños, necesita ajuste de bisagra.' }
    ]);
    
    const [amenities, setAmenities] = useState([
        { id: 'quincho', name: 'Quincho Principal', price: 20000, cap: '25 personas', rules: 'Aseo no incluido. Música moderada hasta 23:30.' },
        { id: 'piscina', name: 'Piscina / reposeras', price: 0, cap: '8 personas por depto', rules: 'Gorra obligatoria, menores acompañados.' },
        { id: 'gym', name: 'Gimnasio Equipado', price: 0, cap: '4 personas simultáneas', rules: 'Uso máximo 1 hora por depto, zapatillas obligatorias.' },
        { id: 'sala', name: 'Sala Multiuso / Cine', price: 15000, cap: '15 personas', rules: 'Garantía reembolsable de $30.000 por limpieza.' }
    ]);
    
    const [myReservations, setMyReservations] = useState([
        { id: 74, name: 'Quincho Principal', date: '30/05/2026', slot: 'Tarde (14:00 - 18:00)', price: 20000, status: 'approved' }
    ]);

    // Forms states
    const [bookingAmenity, setBookingAmenity] = useState('quincho');
    const [bookingDate, setBookingDate] = useState('');
    const [bookingSlot, setBookingSlot] = useState('Tarde (14:00 - 18:00)');
    
    const [newTicketTitle, setNewTicketTitle] = useState('');
    const [newTicketDesc, setNewTicketDesc] = useState('');
    const [newTicketCat, setNewTicketCat] = useState('Electricidad');
    const [newTicketPri, setNewTicketPri] = useState('medium');
    const [newTicketFile, setNewTicketFile] = useState(null);

    // Modal state for QR Payment
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentReceiptName, setPaymentReceiptName] = useState('');
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [paymentCompletedSuccess, setPaymentCompletedSuccess] = useState(false);

    // Community Chat state
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState([
        { sender: 'system', text: 'Bienvenido al canal seguro de mensajería con Conserjería y Administración.' },
        { sender: 'other', text: 'Hola Vecino(a) del Depto 202, le informamos que ha llegado un paquete de Chilexpress a su nombre. Puede pasar a retirarlo a conserjería.', time: '14:20' }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    // Simulated background logging and telemetry fluctuations when DevOps console is open
    useEffect(() => {
        if (!devOpsActive) return;
        const telemetryInterval = setInterval(() => {
            setCpuLoad(Math.floor(Math.random() * (22 - 11) + 11));
            setRamUsage(Math.floor(Math.random() * (132 - 122) + 122));
            setLatency(Math.floor(Math.random() * (14 - 6) + 6));
        }, 2000);

        const logsInterval = setInterval(() => {
            const time = new Date().toLocaleTimeString();
            const logEntries = [
                `[${time}] [QUERY] select count(*) as aggregate from "users" where "status" = 'active' (0.84ms)`,
                `[${time}] [QUERY] select "roles".* from "roles" inner join "model_has_roles" on "roles"."id" = "model_has_roles"."role_id" where "model_has_roles"."model_id" = 1 (1.12ms)`,
                `[${time}] [CACHE] Hit: users_count_cache`,
                `[${time}] [QUEUE] Queue worker processed job: App\\Jobs\\CalculateCommonExpenses (14.2ms)`,
                `[${time}] [INFO] Request GET /api/payments - 200 OK (22ms)`,
                `[${time}] [QUERY] select * from "tickets" where "status" = 'open' limit 10 (1.45ms)`,
                `[${time}] [CACHE] Flushed expired Spatie RBAC cache permissions`
            ];
            const randomEntry = logEntries[Math.floor(Math.random() * logEntries.length)];
            setTerminalLogs(prev => [...prev.slice(-9), randomEntry]);
        }, 4000);

        return () => {
            clearInterval(telemetryInterval);
            clearInterval(logsInterval);
        };
    }, [devOpsActive]);

    const handleTogglePermission = (role, permission) => {
        setRbMatrix(prev => ({
            ...prev,
            [role]: {
                ...prev[role],
                [permission]: !prev[role][permission]
            }
        }));
        const time = new Date().toLocaleTimeString();
        const actionStatus = !rbMatrix[role][permission] ? 'GRANT' : 'REVOKE';
        setTerminalLogs(prev => [
            ...prev,
            `[${time}] [RBAC] SQL EXEC: update model_has_permissions set status = '${actionStatus}' where role = '${role}' and permission = '${permission}'`,
            `[${time}] [CACHE] Flushed role permissions mapping cache for role: ${role}`
        ]);
    };

    const runDevOpsCmd = (cmdName, outputLog) => {
        const time = new Date().toLocaleTimeString();
        setTerminalLogs(prev => [
            ...prev,
            `[${time}] [CMD] php artisan ${cmdName}`,
            `[${time}] ${outputLog}`,
            `[${time}] Operation completed successfully.`
        ]);
        alert(`Comando ejecutado con éxito: php artisan ${cmdName}`);
    };

    // Simulated resident payment flow
    const executeQrPayment = () => {
        setIsProcessingPayment(true);
        setTimeout(() => {
            setIsProcessingPayment(false);
            setPaymentCompletedSuccess(true);
            
            // Register payment in state
            const today = new Date().toLocaleDateString('es-CL');
            setPaymentHistory(prev => [
                {
                    id: residentExpenses.id,
                    period: residentExpenses.period,
                    amount: residentExpenses.amount,
                    date: today,
                    method: 'Transferencia QR',
                    status: 'completed'
                },
                ...prev
            ]);
            
            setResidentExpenses(prev => ({ ...prev, status: 'completed' }));
        }, 2000);
    };

    // Simulated resident booking flow
    const submitBooking = (e) => {
        e.preventDefault();
        if (!bookingDate) {
            alert('Por favor selecciona una fecha.');
            return;
        }
        
        const selectedAmenityObj = amenities.find(a => a.id === bookingAmenity);
        const formatD = bookingDate.split('-').reverse().join('/');
        
        const newBooking = {
            id: Math.floor(Math.random() * 200) + 100,
            name: selectedAmenityObj.name,
            date: formatD,
            slot: bookingSlot,
            price: selectedAmenityObj.price,
            status: 'pending'
        };
        
        setMyReservations(prev => [newBooking, ...prev]);
        alert(`¡Solicitud enviada! Tu reserva de ${selectedAmenityObj.name} está pendiente de confirmación.`);
        setBookingDate('');
    };

    // Simulated resident ticket flow
    const submitTicket = (e) => {
        e.preventDefault();
        if (!newTicketTitle.trim() || !newTicketDesc.trim()) {
            alert('Por favor completa todos los campos obligatorios.');
            return;
        }
        
        const newTicket = {
            id: Math.floor(Math.random() * 200) + 100,
            title: newTicketTitle,
            category: newTicketCat,
            priority: newTicketPri,
            status: 'open',
            date: new Date().toLocaleDateString('es-CL'),
            desc: newTicketDesc
        };
        
        setReportedTickets(prev => [newTicket, ...prev]);
        alert(`¡Ticket #${newTicket.id} creado con éxito! Administración ha sido notificada.`);
        setNewTicketTitle('');
        setNewTicketDesc('');
    };

    // Simulated resident chat flow
    const sendChatMessage = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;
        
        const time = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
        const userMsg = { sender: 'me', text: chatInput, time };
        
        setChatMessages(prev => [...prev, userMsg]);
        setChatInput('');
        
        // Trigger auto-reply
        setIsTyping(true);
        setTimeout(() => {
            setIsTyping(false);
            const replies = [
                "Perfecto vecino, hemos recibido tu reporte. El conserje de turno está al tanto e irá a verificar.",
                "Hola, te confirmamos que conserjería recibió tu encomienda. Puedes retirarla cuando gustes presentando tu firma.",
                "Estimado copropietario, tu comprobante de pago está siendo conciliado por administración. Recibirás tu recibo oficial en breve.",
                "Entendido. Se registrará la observación para plantearla en la próxima asamblea comunitaria."
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            setChatMessages(prev => [...prev, { sender: 'other', text: randomReply, time }]);
        }, 1800);
    };

    if (showTransition) {
        return <RoleTransitionLoader user={user} fadeOut={fadeOut} />;
    }

    return (
        <AuthenticatedLayout
            hideNav={!renderAdminView}
            header={
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold leading-tight text-gray-800 dark:text-slate-100 font-sans">
                            {renderAdminView ? 'Consola de RedVecino' : 'Portal MiVecino'}
                        </h2>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            renderAdminView 
                                ? 'bg-indigo-500/10 border border-indigo-500/20 text-indigo-500' 
                                : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500'
                        }`}>
                            {renderAdminView ? 'Rol: Administrativo' : 'Rol: Copropietario'}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Interactive simulation toggle visible only for admins / TI to switch views easily */}
                        {isActuallyAdmin && (
                            <button
                                onClick={() => {
                                    setSimulationMode(!simulationMode);
                                    setMobileTab('home');
                                }}
                                className={`px-4 py-2 border rounded-xl font-extrabold text-xs shadow-sm transition-all duration-200 flex items-center gap-2 ${
                                    simulationMode 
                                        ? 'bg-gradient-to-r from-[#0F2557] to-[#00A896] text-white border-transparent' 
                                        : 'bg-white hover:bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-[#72B043] dark:text-[#72B043] dark:hover:bg-slate-800'
                                }`}
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                                </svg>
                                {simulationMode ? 'Volver a RedVecino' : 'Ver Vista MiVecino (Residente)'}
                            </button>
                        )}

                        <span className="hidden sm:block h-6 w-px bg-gray-200 dark:bg-slate-800" />
                        
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 dark:text-slate-400">Hola,</span>
                            <span className="text-xs font-semibold text-gray-700 dark:text-slate-200">{user.name}</span>
                        </div>
                        
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl bg-gray-150 hover:bg-gray-200 text-gray-600 dark:bg-slate-850 dark:hover:bg-slate-850 dark:text-slate-350 transition-colors duration-200"
                            aria-label="Toggle Theme"
                            title="Cambiar tema"
                        >
                            {darkMode ? (
                                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.75 4.75l1.59 1.59m11.32 11.32l1.59 1.59M3 12h2.25m13.5 0H21M4.75 19.25l1.59-1.59m11.32-11.32l1.59-1.59M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" />
                                </svg>
                            ) : (
                                <svg className="w-4 h-4 text-indigo-650" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            }
        >
            <Head title={renderAdminView ? 'Dashboard RedVecino' : 'Portal MiVecino'} />

            {/* ======================================================== */}
            {/* 🔵 ADMIN / TI VIEW - CORPORATE REDVECINO (PRESERVED)     */}
            {/* ======================================================== */}
            {renderAdminView && (
                <div className="py-8 animate-fade-in font-sans">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
                        
                        {/* DevOps TI Control Banner */}
                        <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-slate-900 border border-slate-800 rounded-2xl gap-4 shadow-sm">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-indigo-500/10 text-indigo-400 flex items-center justify-center rounded-xl border border-indigo-500/20 shrink-0">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0Z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                                        Consola de Operaciones DevOps TI
                                        <span className="px-2 py-0.5 bg-[#00A896]/10 border border-[#00A896]/20 text-[#00A896] text-[10px] font-bold rounded">
                                            Modo Pruebas
                                        </span>
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1">Monitorea la salud del servidor, interactúa con logs en vivo y configura los permisos Spatie de los roles.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setDevOpsActive(!devOpsActive)}
                                className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow transition-all ${
                                    devOpsActive
                                        ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-900/10'
                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-900/10'
                                }`}
                            >
                                {devOpsActive ? 'Desactivar Consola TI' : 'Activar Consola TI'}
                            </button>
                        </div>

                        {/* DevOps Console Panel */}
                        {devOpsActive && (
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl animate-fade-in text-slate-350">
                                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                                    <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-[#00A896] animate-pulse" />
                                        Centro de Control Técnico & Telemetría
                                    </h3>
                                    <span className="text-[10px] font-mono text-slate-500">Root Access &bull; database.sqlite</span>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                                        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">Carga de CPU</span>
                                        <span className="text-xl font-black text-white block mt-1 flex items-center gap-2">
                                            {cpuLoad}%
                                            <span className="flex h-2 w-2 relative">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                            </span>
                                        </span>
                                        <span className="text-[9px] text-slate-500 block mt-1">Carga balanceada</span>
                                    </div>
                                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                                        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">Uso de RAM</span>
                                        <span className="text-xl font-black text-white block mt-1">{ramUsage} MB</span>
                                        <span className="text-[9px] text-slate-500 block mt-1">De 512 MB de alocación</span>
                                    </div>
                                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                                        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">Base de Datos</span>
                                        <span className="text-xl font-black text-white block mt-1 flex items-center gap-2">
                                            SQLite
                                            <span className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-bold rounded">
                                                ACTIVE
                                            </span>
                                        </span>
                                        <span className="text-[9px] text-slate-500 block mt-1">Normalizado & Integridad OK</span>
                                    </div>
                                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                                        <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider block">Latencia de API</span>
                                        <span className="text-xl font-black text-white block mt-1">{latency} ms</span>
                                        <span className="text-[9px] text-slate-500 block mt-1">Tiempo medio de respuesta</span>
                                    </div>
                                </div>

                                <div className="grid lg:grid-cols-12 gap-6 items-start">
                                    <div className="lg:col-span-8 space-y-2">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Bitácora Transaccional (Live Syslog)</span>
                                        <div className="bg-black/90 p-4 rounded-2xl border border-slate-800/80 font-mono text-[10px] sm:text-xs text-[#00A896] max-h-[220px] overflow-y-auto space-y-1.5 shadow-inner">
                                            {terminalLogs.map((log, i) => (
                                                <div key={i} className="whitespace-pre-wrap break-all leading-relaxed">
                                                    {log}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="lg:col-span-4 space-y-3">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Herramientas DevOps Rápidas</span>
                                        <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-mono font-bold">
                                            <button 
                                                onClick={() => runDevOpsCmd('cache:clear', '[CACHE] Flushed configurations, route mappings, and view caches.')}
                                                className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-slate-350 hover:border-indigo-500/40 hover:text-white transition-all shadow"
                                            >
                                                Limpiar Caché
                                            </button>
                                            <button 
                                                onClick={() => runDevOpsCmd('migrate --force', '[DB] Verified database tables integrity. 0 migrations pending.')}
                                                className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-slate-350 hover:border-indigo-500/40 hover:text-white transition-all shadow"
                                            >
                                                Migrar BD
                                            </button>
                                            <button 
                                                onClick={() => runDevOpsCmd('optimize', '[INFRA] Rebuilt optimized configuration cache and route mappings.')}
                                                className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-slate-350 hover:border-indigo-500/40 hover:text-white transition-all shadow"
                                            >
                                                Optimizar
                                            </button>
                                            <button 
                                                onClick={() => runDevOpsCmd('backup:run', '[INFRA] backup_2026-05-25_1635.zip generated successfully (14.2MB).')}
                                                className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-slate-350 hover:border-indigo-500/40 hover:text-white transition-all shadow"
                                            >
                                                Forzar Backup
                                            </button>
                                        </div>
                                        <div className="bg-slate-950 p-4 border border-slate-800 rounded-2xl flex items-center gap-3 text-xs text-slate-400">
                                            <svg className="w-5 h-5 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                            <span>Interactúa en caliente con las variables del entorno del servidor y optimiza la latencia.</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-slate-800">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Matriz de Permisos Spatie RBAC</span>
                                    <div className="overflow-x-auto border border-slate-850 rounded-2xl bg-slate-950">
                                        <table className="min-w-full divide-y divide-slate-850 font-mono text-[10px] sm:text-xs">
                                            <thead>
                                                <tr className="bg-slate-900/60 text-slate-450">
                                                    <th className="px-4 py-3 text-left font-bold uppercase">Rol del Sistema</th>
                                                    <th className="px-3 py-3 text-center font-bold uppercase">Ver Perfil</th>
                                                    <th className="px-3 py-3 text-center font-bold uppercase">Pagar Gasto</th>
                                                    <th className="px-3 py-3 text-center font-bold uppercase">Resolver Ticket</th>
                                                    <th className="px-3 py-3 text-center font-bold uppercase">Circulares</th>
                                                    <th className="px-3 py-3 text-center font-bold uppercase">Soporte TI</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-900 text-slate-350">
                                                {Object.keys(rbMatrix).map((role) => (
                                                    <tr key={role} className="hover:bg-slate-900/40 transition-colors">
                                                        <td className="px-4 py-3 font-bold text-white uppercase">{role}</td>
                                                        <td className="px-3 py-3 text-center">
                                                            <input 
                                                                type="checkbox" checked={rbMatrix[role].read_profile}
                                                                onChange={() => handleTogglePermission(role, 'read_profile')}
                                                                className="h-4 w-4 rounded accent-[#00A896] cursor-pointer"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-3 text-center">
                                                            <input 
                                                                type="checkbox" checked={rbMatrix[role].pay_expenses}
                                                                onChange={() => handleTogglePermission(role, 'pay_expenses')}
                                                                className="h-4 w-4 rounded accent-[#00A896] cursor-pointer"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-3 text-center">
                                                            <input 
                                                                type="checkbox" checked={rbMatrix[role].resolve_tickets}
                                                                onChange={() => handleTogglePermission(role, 'resolve_tickets')}
                                                                className="h-4 w-4 rounded accent-[#00A896] cursor-pointer"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-3 text-center">
                                                            <input 
                                                                type="checkbox" checked={rbMatrix[role].publish_announcements}
                                                                onChange={() => handleTogglePermission(role, 'publish_announcements')}
                                                                className="h-4 w-4 rounded accent-[#00A896] cursor-pointer"
                                                            />
                                                        </td>
                                                        <td className="px-3 py-3 text-center">
                                                            <input 
                                                                type="checkbox" checked={rbMatrix[role].config_ti}
                                                                onChange={() => handleTogglePermission(role, 'config_ti')}
                                                                className="h-4 w-4 rounded accent-[#00A896] cursor-pointer"
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <span className="text-[10px] text-slate-500 block leading-relaxed">
                                        * Nota: Marcar o desmarcar permisos genera consultas inmediatas en la base de datos simuladas en caliente en la consola superior.
                                    </span>
                        </div>
                    </div>
                )}

                        {/* Stats Cards Grid */}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                            <StatCard
                                title="Usuarios"
                                value={stats.users.total}
                                description={`${stats.users.active} activos`}
                                color="indigo"
                                icon={
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                    </svg>
                                }
                            />
                            <StatCard
                                title="Propiedades"
                                value={stats.properties.total}
                                description={`${stats.properties.occupied} ocupadas, ${stats.properties.vacant} disponibles`}
                                color="emerald"
                                icon={
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                                    </svg>
                                }
                            />
                            <StatCard
                                title="Condominios"
                                value={stats.condominiums}
                                color="violet"
                                icon={
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                                    </svg>
                                }
                            />
                            <StatCard
                                title="Tickets"
                                value={stats.tickets.open}
                                description={`${stats.tickets.inProgress} en curso`}
                                color="amber"
                                icon={
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.646 5.647a1.5 1.5 0 01-2.121-2.121l5.646-5.646m0 0l5.646-5.646m-5.646 5.646L16.5 3M12 21h9" />
                                    </svg>
                                }
                            />
                            <StatCard
                                title="Pagos Pend."
                                value={stats.finances.pendingPayments}
                                description={`${stats.finances.overduePayments} vencidos`}
                                color="rose"
                                icon={
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                }
                            />
                            <StatCard
                                title="Multas"
                                value={stats.finances.pendingFines}
                                description={`Total: $${Number(stats.finances.totalFines).toLocaleString()}`}
                                color="cyan"
                                icon={
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                                    </svg>
                                }
                            />
                        </div>

                        {/* Users by Role & Ticket Status */}
                        <div className="grid gap-6 lg:grid-cols-3">
                            <SectionCard title="Usuarios por Rol">
                                <div className="space-y-1">
                                    {Object.entries(stats.usersByRole || {}).map(([role, count]) => (
                                        <StatRow
                                            key={role}
                                            label={role}
                                            value={count}
                                        />
                                    ))}
                                </div>
                            </SectionCard>

                            <SectionCard title="Estado de Tickets">
                                <div className="space-y-1">
                                    <StatRow label="Abiertos" value={stats.tickets.open} />
                                    <StatRow label="En Progreso" value={stats.tickets.inProgress} />
                                    <StatRow label="Resueltos" value={stats.tickets.resolved} />
                                    <StatRow label="Alta Prioridad" value={stats.tickets.highPriority} />
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-700 dark:text-slate-400">Total gastos</span>
                                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                                            ${Number(stats.finances.totalExpenses).toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-sm font-medium text-gray-700 dark:text-slate-400">Total pagos</span>
                                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-450">
                                            ${Number(stats.finances.totalPayments).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </SectionCard>

                            <SectionCard title="Resumen Rápido">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border dark:border-indigo-500/20">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-slate-200">
                                                {stats.unreadMessages > 0 ? (
                                                    <span>{stats.unreadMessages} mensaje{stats.unreadMessages !== 1 ? 's' : ''} sin leer</span>
                                                ) : (
                                                    <span>No hay mensajes sin leer</span>
                                                )}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-slate-500">Bandeja de entrada</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 dark:border dark:border-amber-500/20">
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-slate-200">
                                                {stats.tickets.highPriority > 0 ? (
                                                    <span>{stats.tickets.highPriority} ticket{stats.tickets.highPriority !== 1 ? 's' : ''} urgentes</span>
                                                ) : (
                                                    <span>Sin tickets urgentes</span>
                                                )}
                                            </p>
                                            <p className="text-xs text-gray-400 dark:text-slate-500">Requieren atención</p>
                                        </div>
                                    </div>
                                </div>
                            </SectionCard>
                        </div>

                        {/* Recent Tickets */}
                        <SectionCard title="Tickets Recientes" link="/tickets">
                            <SimpleTable
                                headers={['ID', 'Título', 'Categoría', 'Prioridad', 'Estado', 'Creado por']}
                                rows={recentTickets?.map(t => ({
                                    cells: [
                                        <span className="font-medium text-gray-900 dark:text-white">#{t.id}</span>,
                                        <span className="max-w-[200px] truncate block">{t.title}</span>,
                                        t.category?.name || '-',
                                        <StatusBadge status={t.priority} type="priority" />,
                                        <StatusBadge status={t.status} type="ticket" />,
                                        t.creator?.name || '-',
                                    ]
                                }))}
                                emptyMessage="No hay tickets registrados"
                            />
                        </SectionCard>

                        {/* Recent Payments & Upcoming Expenses */}
                        <div className="grid gap-6 lg:grid-cols-2">
                            <SectionCard title="Pagos Recientes" link="/payments">
                                <SimpleTable
                                    headers={['Usuario', 'Propiedad', 'Monto', 'Método', 'Estado', 'Fecha']}
                                    rows={recentPayments?.map(p => ({
                                        cells: [
                                            p.user?.name || '-',
                                            <span className="dark:text-slate-400">#{p.property_id}</span>,
                                            <span className="font-medium dark:text-emerald-450">${Number(p.amount).toLocaleString()}</span>,
                                            p.payment_method,
                                            <StatusBadge status={p.status} type="payment" />,
                                            new Date(p.payment_date).toLocaleDateString('es-CL'),
                                        ]
                                    }))}
                                    emptyMessage="No hay pagos registrados"
                                />
                            </SectionCard>

                            <SectionCard title="Próximos Gastos Comunes">
                                <SimpleTable
                                    headers={['Condominio', 'Período', 'Monto', 'Vencimiento', 'Estado']}
                                    rows={upcomingExpenses?.map(e => ({
                                        cells: [
                                            e.condominium?.name || '-',
                                            e.period,
                                            <span className="font-medium dark:text-slate-200">${Number(e.amount).toLocaleString()}</span>,
                                            new Date(e.due_date).toLocaleDateString('es-CL'),
                                            <StatusBadge status={e.status} type="payment" />,
                                        ]
                                    }))}
                                    emptyMessage="No hay gastos próximos"
                                />
                            </SectionCard>
                        </div>

                        {/* Recent Announcements */}
                        <SectionCard title="Últimos Anuncios" link="/announcements">
                            {recentAnnouncements && recentAnnouncements.length > 0 ? (
                                <div className="divide-y divide-gray-50 dark:divide-slate-800">
                                    {recentAnnouncements.map(a => (
                                        <div key={a.id} className="py-3 flex items-start justify-between">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-gray-900 dark:text-slate-200 truncate">{a.title}</p>
                                                <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">
                                                    {new Date(a.published_at).toLocaleDateString('es-CL', {
                                                        year: 'numeric', month: 'long', day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                            <div className="ml-4 flex-shrink-0">
                                                <span className="text-xs text-gray-400 dark:text-slate-500">por {a.creator?.name || '-'}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-4">No hay anuncios publicados</p>
                            )}
                        </SectionCard>
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* 🍏 RESIDENT VIEW - MIVECINO HIGH-FIDELITY MVP PORTAL      */}
            {/* ======================================================== */}
            {!renderAdminView && (
                <div className="py-8 animate-fade-in font-sans selection:bg-[#72B043]/30 selection:text-white">
                    {isDesktop && !forceMobileView ? (
                        /* GORGEOUS WIDESCREEN DESKTOP PORTAL FOR MIVECINO */
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-[32px] overflow-hidden shadow-2xl h-[780px] transition-colors duration-300">
                                
                                {/* 1. LEFT SIDEBAR */}
                                <div className="w-64 bg-slate-950 text-white p-6 flex flex-col justify-between shrink-0 font-sans">
                                    <div className="space-y-6">
                                        {/* Logo */}
                                        <div className="flex items-center gap-3">
                                            <div className="h-9 w-9 rounded-xl bg-[#72B043] flex items-center justify-center shadow-lg shadow-[#72B043]/20">
                                                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-base font-black tracking-tight">
                                                    Mi<span className="text-[#72B043]">Vecino</span>
                                                </h3>
                                                <span className="text-[8px] tracking-[0.2em] font-bold text-slate-500 uppercase block">Portal Residente</span>
                                            </div>
                                        </div>                                         {/* Resident Profile Card */}
                                         <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-3">
                                             <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#72B043] to-[#EC7A08] flex items-center justify-center font-bold text-white text-sm">
                                                 {user.name.charAt(0)}
                                             </div>
                                             <div className="min-w-0 flex-1">
                                                 <p className="text-xs font-black truncate">{user.name}</p>
                                                 <span className="text-[9px] text-[#72B043] font-bold block">Depto 202 &bull; Vecino</span>
                                             </div>
                                         </div>

                                         {/* Nav Links */}
                                         <div className="space-y-1 pt-4">
                                             {[
                                                 { tab: 'home', label: '🏠 Inicio / Resumen' },
                                                 { tab: 'comunicados', label: '📢 Comunicados' },
                                                 { tab: 'reservas', label: '📅 Reservas' },
                                                 { tab: 'pagos', label: '💵 Pagos / Gastos' },
                                                 { tab: 'incidencias', label: '🛠️ Incidencias' },
                                                 { tab: 'documentos', label: '📄 Documentos' },
                                                 { tab: 'comunidad', label: '👥 Comunidad Chat' },
                                                 { tab: 'configuracion', label: '⚙️ Ajustes / Cuenta' }
                                             ].map(item => (
                                                 <button
                                                     key={item.tab}
                                                     onClick={() => setMobileTab(item.tab)}
                                                     className={`w-full text-left px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                                                         mobileTab === item.tab 
                                                             ? 'bg-[#72B043] text-white shadow shadow-[#72B043]/10' 
                                                             : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                                                     }`}
                                                 >
                                                     {item.label}
                                                 </button>
                                             ))}
                                         </div>
                                         </div>

                                     {/* Sidebar Footer Controls */}
                                    <div className="space-y-3 pt-4 border-t border-slate-900">
                                        <button
                                            onClick={() => setForceMobileView(true)}
                                            className="w-full py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] font-extrabold rounded-xl transition-all flex items-center justify-center gap-1.5 text-slate-350"
                                        >
                                            <svg className="w-3.5 h-3.5 text-[#72B043]" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                                            </svg>
                                            Ver Vista Celular
                                        </button>
                                        <div className="flex items-center justify-between text-slate-500 text-[9px] font-mono">
                                            <span>Modo: Escritorio</span>
                                            <span>v1.2.0</span>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. RIGHT WORKSPACE CONTENT PANELS */}
                                <div className="flex-1 flex flex-col min-w-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
                                    {/* Top Widescreen Header */}
                                    <div className="px-8 py-5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between shrink-0">
                                        <div>
                                            <h4 className="text-sm font-black text-slate-850 dark:text-slate-100 uppercase tracking-wider">
                                                {mobileTab === 'home' && 'Panel Resumen Residente'}
                                                {mobileTab === 'comunicados' && 'Circular de Copropietarios'}
                                                {mobileTab === 'reservas' && 'Reservación de Instalaciones'}
                                                {mobileTab === 'pagos' && 'Gastos Comunes y Recaudación'}
                                                {mobileTab === 'incidencias' && 'Orden de Mantenimiento Vecinal'}                                                 {mobileTab === 'documentos' && 'Biblioteca Legal y Minutas'}
                                                 {mobileTab === 'comunidad' && 'Mensajería Vecinal Inteligente'}
                                                 {mobileTab === 'configuracion' && 'Ajustes de Perfil y Sistema'}
                                            </h4>
                                            <p className="text-[10px] text-slate-450 dark:text-slate-555 mt-0.5">Gestión operativa en tiempo real del {residentCondo}.</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-bold rounded-md uppercase tracking-wider">
                                                Conexión SQLite Segura
                                            </span>
                                        </div>
                                    </div>

                                    {/* Main Scrollable Workstation */}
                                    <div className="flex-1 overflow-y-auto p-8 space-y-6">
                                        
                                        {/* Widescreen Tab Views */}
                                        {mobileTab === 'home' && (
                                            <div className="space-y-6 animate-scale-up text-xs">
                                                {/* Header Welcome banner */}
                                                <div className="p-6 bg-gradient-to-r from-[#72B043] to-[#85c851] rounded-2xl text-white flex justify-between items-center shadow-md">
                                                    <div className="space-y-1">
                                                        <h3 className="text-lg font-black font-sans">¡Qué bueno verte, {user.name}!</h3>
                                                        <p className="text-xs text-emerald-100">Tienes todos tus servicios comunitarios al día. Revisa comunicados destacados aquí.</p>
                                                    </div>
                                                    <span className="text-4xl">🏡</span>
                                                </div>

                                                <div className="grid md:grid-cols-3 gap-6">
                                                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between h-36">
                                                        <div>
                                                            <span className="text-[8px] font-black text-[#72B043] uppercase tracking-widest block">Mi Gasto Común</span>
                                                            <h4 className="text-2xl font-black text-slate-800 dark:text-white mt-1">
                                                                {residentExpenses.status === 'completed' ? '$0' : '$165.000'}
                                                            </h4>
                                                        </div>
                                                        <button onClick={() => setMobileTab('pagos')} className="w-full py-2 bg-[#72B043] hover:bg-[#629b37] text-white text-[10px] font-bold rounded-xl shadow-sm transition-all text-center">
                                                            {residentExpenses.status === 'completed' ? 'Ver Comprobante' : 'Realizar Pago QR'}
                                                        </button>
                                                    </div>

                                                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between h-36">
                                                        <div>
                                                            <span className="text-[8px] font-black text-[#EC7A08] uppercase tracking-widest block">Mis Reservaciones</span>
                                                            <h4 className="text-2xl font-black text-slate-800 dark:text-white mt-1">1 Activa</h4>
                                                        </div>
                                                        <button onClick={() => setMobileTab('reservas')} className="w-full py-2 bg-[#EC7A08] hover:bg-[#cf6a06] text-white text-[10px] font-bold rounded-xl shadow-sm transition-all text-center">
                                                            Reservar Nueva Instalación
                                                        </button>
                                                    </div>

                                                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between h-36">
                                                        <div>
                                                            <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest block">Tickets Pendientes</span>
                                                            <h4 className="text-2xl font-black text-slate-800 dark:text-white mt-1">{reportedTickets.filter(t => t.status !== 'resolved').length} Activos</h4>
                                                        </div>
                                                        <button onClick={() => setMobileTab('incidencias')} className="w-full py-2 bg-indigo-650 hover:bg-indigo-700 text-white text-[10px] font-bold rounded-xl shadow-sm transition-all text-center">
                                                            Reportar Nueva Incidencia
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Grid: Announcements & Quick Chat */}
                                                <div className="grid lg:grid-cols-12 gap-6 items-start">
                                                    {/* Announcements column */}
                                                    <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-sm border-gray-100">
                                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block border-b pb-2 dark:border-slate-800">Circulares de la Comunidad</span>
                                                        <div className="space-y-4">
                                                            {[
                                                                { id: 1, title: 'Corte de Agua Programado', date: 'Hoy 15:10', body: 'Se suspenderá el suministro el Jueves 28 de 14:00 a 18:00 hrs por reparaciones en matriz principal.', priority: 'warning' },
                                                                { id: 2, title: 'Fumigación de Áreas Verdes', date: 'Ayer', body: 'Se procederá a realizar la fumigación de jardines este Sábado. Mantenga ventanas cerradas.', priority: 'info' }
                                                            ].map(item => (
                                                                <div key={item.id} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl space-y-1.5 border border-slate-100 dark:border-slate-850">
                                                                    <div className="flex justify-between items-center text-[10px] font-medium text-slate-550">
                                                                        <span className="font-bold text-[#EC7A08]">{item.date}</span>
                                                                        <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-500 rounded text-[8px] font-bold">Circular</span>
                                                                    </div>
                                                                    <h4 className="font-black text-slate-800 dark:text-white">{item.title}</h4>
                                                                    <p className="text-[11px] text-slate-650 dark:text-slate-400 leading-snug">{item.body}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Documents column */}
                                                    <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl space-y-4 shadow-sm border-gray-100">
                                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block border-b pb-2 dark:border-slate-800">Biblioteca del Condominio</span>
                                                        <div className="space-y-2.5">
                                                            {[
                                                                { title: 'Reglamento de Copropiedad Oficial', type: 'PDF', size: '2.4 MB' },
                                                                { title: 'Minuta Asamblea Extraordinaria - Mayo', type: 'PDF', size: '820 KB' }
                                                            ].map((doc, i) => (
                                                                <div key={i} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl flex items-center justify-between border border-slate-100 dark:border-slate-850">
                                                                    <div className="min-w-0 flex-1">
                                                                        <p className="font-bold text-slate-750 dark:text-slate-350 truncate">{doc.title}</p>
                                                                        <span className="text-[9px] text-slate-450 block">{doc.type} &bull; {doc.size}</span>
                                                                    </div>
                                                                    <button type="button" onClick={() => alert(`Descargando ${doc.title}...`)} className="p-1.5 hover:bg-[#72B043]/10 text-[#72B043] rounded-lg transition-colors shrink-0">
                                                                        📥
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Widescreen Comunicados */}
                                        {mobileTab === 'comunicados' && (
                                            <div className="space-y-4 animate-scale-up text-xs">
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    {[
                                                        { id: 1, title: 'Fumigación de Áreas Verdes', category: 'Importante', date: '24/05/2026', body: 'Se procederá a realizar la fumigación de jardines comunes este Sábado a partir de las 08:30 hrs. Mantenga ventanas cerradas y retire mascotas.', priority: 'warning' },
                                                        { id: 2, title: 'Prueba de Alarmas de Incendio', category: 'Normal', date: '20/05/2026', body: 'El Miércoles 27 a las 12:00 se realizarán las pruebas reglamentarias del sistema de evacuación. Sonará por bloques de 15 segundos.', priority: 'default' },
                                                        { id: 3, title: 'Pago Gasto Común Disponible', category: 'Urgente', date: '15/05/2026', body: 'Se informa la emisión del cobro del mes de Mayo. Agradecemos registrar sus transferencias mediante nuestro nuevo visor QR express.', priority: 'danger' }
                                                    ].map(item => (
                                                        <div key={item.id} className="p-5 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-3 bg-white dark:bg-slate-900 shadow-sm">
                                                            <div className="flex justify-between items-center">
                                                                <span className={`px-2 py-0.5 text-[8px] font-bold rounded uppercase ${
                                                                    item.priority === 'danger' ? 'bg-rose-500/10 text-rose-500' :
                                                                    item.priority === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-200 text-slate-700 dark:bg-slate-850 dark:text-slate-400'
                                                                }`}>
                                                                    {item.category}
                                                                </span>
                                                                <span className="text-[9px] text-slate-450 dark:text-slate-500">{item.date}</span>
                                                            </div>
                                                            <h4 className="text-sm font-black text-slate-850 dark:text-white">{item.title}</h4>
                                                            <p className="text-[11px] text-slate-650 dark:text-slate-400 leading-relaxed">{item.body}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Widescreen Reservas */}
                                        {mobileTab === 'reservas' && (
                                            <div className="grid lg:grid-cols-12 gap-8 animate-scale-up text-xs items-start">
                                                <form onSubmit={submitBooking} className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm border-gray-105">
                                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#72B043] block border-b pb-2 dark:border-slate-800">Nueva Reservación de Espacio</span>
                                                    
                                                    <div className="space-y-3">
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] text-slate-450 uppercase font-extrabold">Selecciona Espacio</label>
                                                            <select 
                                                                value={bookingAmenity} 
                                                                onChange={(e) => setBookingAmenity(e.target.value)}
                                                                className="w-full px-3 py-2 border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none focus:border-[#72B043] font-bold text-slate-700 dark:text-slate-350"
                                                            >
                                                                {amenities.map(a => (
                                                                    <option key={a.id} value={a.id}>{a.name} ({a.price > 0 ? `${a.price.toLocaleString()}` : 'Gratis'})</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] text-slate-450 uppercase font-extrabold">Bloque Horario</label>
                                                            <select 
                                                                value={bookingSlot} 
                                                                onChange={(e) => setBookingSlot(e.target.value)}
                                                                className="w-full px-3 py-2 border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none focus:border-[#72B043] font-bold text-slate-700 dark:text-slate-355"
                                                            >
                                                                <option value="Mañana (09:00 - 13:00)">Mañana (09:00 - 13:00)</option>
                                                                <option value="Tarde (14:00 - 18:00)">Tarde (14:00 - 18:00)</option>
                                                                <option value="Noche (19:00 - 23:30)">Noche (19:00 - 23:30)</option>
                                                            </select>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] text-slate-450 uppercase font-extrabold block">Fecha del Evento</label>
                                                            <input 
                                                                type="date"
                                                                value={bookingDate}
                                                                onChange={(e) => setBookingDate(e.target.value)}
                                                                className="w-full px-3 py-2 border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none focus:border-[#72B043] font-mono text-slate-700 dark:text-slate-355"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl text-[9px] text-slate-500 space-y-1.5">
                                                        <span className="font-bold text-slate-700 dark:text-slate-355 block">Normas generales de reserva:</span>
                                                        <p className="leading-snug">{amenities.find(a => a.id === bookingAmenity)?.rules}</p>
                                                        <p className="font-bold text-[#EC7A08] leading-snug">Capacidad máx: {amenities.find(a => a.id === bookingAmenity)?.cap}</p>
                                                    </div>

                                                    <button type="submit" className="w-full py-2.5 bg-[#72B043] hover:bg-[#629b37] text-white text-xs font-bold rounded-xl shadow-md transition-colors">
                                                        Confirmar Solicitud de Reserva
                                                    </button>
                                                </form>

                                                <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm h-full">
                                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block border-b pb-2 dark:border-slate-800">Tus Reservas Activas e Historial</span>
                                                    <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                                                        {myReservations.map(res => (
                                                            <div key={res.id} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl flex items-center justify-between text-xs">
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-black text-slate-800 dark:text-white text-xs">{res.name}</span>
                                                                        <span className="text-[9px] text-slate-450 font-mono">#{res.id}</span>
                                                                    </div>
                                                                    <span className="text-[10px] text-slate-550 block">{res.date} &bull; {res.slot}</span>
                                                                </div>
                                                                <div className="text-right space-y-1">
                                                                    <span className="font-bold block text-slate-850 dark:text-slate-200">{res.price > 0 ? `${res.price.toLocaleString()}` : 'Gratis'}</span>
                                                                    <span className={`px-2 py-0.5 text-[8px] font-bold rounded uppercase block text-center ${
                                                                        res.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                                                    }`}>
                                                                        {res.status === 'approved' ? 'Aprobada' : 'Pendiente'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Widescreen Pagos */}
                                        {mobileTab === 'pagos' && (
                                            <div className="grid lg:grid-cols-12 gap-8 animate-scale-up text-xs items-start">
                                                <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm border-gray-105">
                                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#72B043] block border-b pb-2 dark:border-slate-800">Estado de Gasto Común</span>
                                                    
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <span className="text-[9px] font-mono text-slate-500">Período de Facturación</span>
                                                            <h4 className="text-xs font-black text-slate-850 dark:text-white">{residentExpenses.period}</h4>
                                                        </div>
                                                        <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                                            residentExpenses.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                                        }`}>
                                                            {residentExpenses.status === 'completed' ? 'PAGADO' : 'PENDIENTE'}
                                                        </span>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 block mb-1">Desglose de Conceptos</span>
                                                        {residentExpenses.items.map((item, i) => (
                                                            <div key={i} className="flex justify-between items-center py-2 border-b border-dashed border-slate-150 dark:border-slate-800 last:border-b-0 text-slate-650 dark:text-slate-400">
                                                                <span>{item.name}</span>
                                                                <span className="font-mono text-slate-900 dark:text-slate-200 font-bold">${item.amount.toLocaleString()}</span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="flex justify-between items-center pt-3 border-t dark:border-slate-800">
                                                        <span className="font-extrabold text-slate-800 dark:text-white">Monto Consolidado:</span>
                                                        <span className="text-base font-black text-[#72B043] font-mono">
                                                            {residentExpenses.status === 'completed' ? '$0' : `${residentExpenses.amount.toLocaleString()}`}
                                                        </span>
                                                    </div>

                                                    {residentExpenses.status !== 'completed' && (
                                                        <button 
                                                            type="button"
                                                            onClick={() => {
                                                                setPaymentCompletedSuccess(false);
                                                                setPaymentReceiptName('');
                                                                setShowPaymentModal(true);
                                                            }}
                                                            className="w-full py-3 bg-[#72B043] hover:bg-[#629b37] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                                                        >
                                                            Pagar Gasto Común Express
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm h-full border-gray-105">
                                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block border-b pb-2 dark:border-slate-800">Historial de Transacciones Consolidadas</span>
                                                    <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                                                        {paymentHistory.map(hist => (
                                                            <div key={hist.id} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl flex items-center justify-between text-xs">
                                                                <div className="space-y-1">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-black text-slate-800 dark:text-white">{hist.period}</span>
                                                                        <span className="text-[8px] text-slate-550 font-mono">ID: PAY-{hist.id}</span>
                                                                    </div>
                                                                    <span className="text-[9px] text-slate-555 block">{hist.date} &bull; {hist.method}</span>
                                                                </div>
                                                                <div className="text-right space-y-1">
                                                                    <span className="font-mono font-bold block text-slate-850 dark:text-slate-200">${hist.amount.toLocaleString()}</span>
                                                                    <span className="text-[9px] text-emerald-500 font-extrabold uppercase flex items-center justify-end gap-1">
                                                                        ✓ Validado
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Widescreen Incidencias */}
                                        {mobileTab === 'incidencias' && (
                                            <div className="grid lg:grid-cols-12 gap-8 animate-scale-up text-xs items-start">
                                                <form onSubmit={submitTicket} className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm border-gray-105">
                                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#72B043] block border-b pb-2 dark:border-slate-800">Levantar Reporte Técnico</span>
                                                    
                                                    <div className="space-y-3">
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] text-slate-450 uppercase font-extrabold">Título de la Incidencia</label>
                                                            <input 
                                                                type="text"
                                                                placeholder="Ej: Ampolleta quemada en pasillo C"
                                                                value={newTicketTitle}
                                                                onChange={(e) => setNewTicketTitle(e.target.value)}
                                                                className="w-full px-3 py-2 border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none focus:border-[#72B043]"
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-1">
                                                                <label className="text-[9px] text-slate-450 uppercase font-extrabold">Categoría</label>
                                                                <select 
                                                                    value={newTicketCat} 
                                                                    onChange={(e) => setNewTicketCat(e.target.value)}
                                                                    className="w-full px-3 py-2 border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none focus:border-[#72B043]"
                                                                >
                                                                    <option value="Electricidad">Electricidad</option>
                                                                    <option value="Plomería">Plomería</option>
                                                                    <option value="Seguridad">Seguridad</option>
                                                                    <option value="Ascensores">Ascensores</option>
                                                                    <option value="Limpieza">Limpieza</option>
                                                                    <option value="Otros">Otros</option>
                                                                </select>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[9px] text-slate-450 uppercase font-extrabold">Prioridad de Solicitud</label>
                                                                <select 
                                                                    value={newTicketPri} 
                                                                    onChange={(e) => setNewTicketPri(e.target.value)}
                                                                    className="w-full px-3 py-2 border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none focus:border-[#72B043]"
                                                                >
                                                                    <option value="low">Baja (General)</option>
                                                                    <option value="medium">Media (Necesaria)</option>
                                                                    <option value="high">Alta (Urgente)</option>
                                                                    <option value="urgent">Crítica (Emergencia)</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] text-slate-450 uppercase font-extrabold">Descripción del Problema</label>
                                                            <textarea 
                                                                rows="3"
                                                                placeholder="Detalla lo que ocurre para agilizar la asignación..."
                                                                value={newTicketDesc}
                                                                onChange={(e) => setNewTicketDesc(e.target.value)}
                                                                className="w-full px-3 py-2 border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none focus:border-[#72B043] resize-none"
                                                            />
                                                        </div>
                                                    </div>

                                                    <button type="submit" className="w-full py-2.5 bg-[#72B043] hover:bg-[#629b37] text-white text-xs font-bold rounded-xl shadow-md transition-colors">
                                                        Crear Ticket e Iniciar Seguimiento
                                                    </button>
                                                </form>

                                                <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm h-full border-gray-105">
                                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block border-b pb-2 dark:border-slate-800">Tus Reportes de Incidencias Levantados</span>
                                                    <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                                                        {reportedTickets.map(tick => (
                                                            <div key={tick.id} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-2 shadow-sm text-xs">
                                                                <div className="flex justify-between items-center">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="font-black text-slate-800 dark:text-white">{tick.title}</span>
                                                                        <span className="text-[9px] text-slate-450 font-mono">#{tick.id}</span>
                                                                    </div>
                                                                    <StatusBadge status={tick.status} type="ticket" />
                                                                </div>
                                                                <p className="text-[10px] text-slate-650 dark:text-slate-400 bg-white/70 dark:bg-slate-900 p-2.5 border border-slate-100 dark:border-slate-850 rounded-xl">{tick.desc}</p>
                                                                <div className="flex items-center justify-between text-[9px] text-slate-500 font-medium">
                                                                    <span>Fecha: {tick.date} &bull; Categoría: {tick.category}</span>
                                                                    <span className="font-extrabold uppercase">Prioridad: {tick.priority}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Widescreen Documentos */}
                                        {mobileTab === 'documentos' && (
                                            <div className="bg-white dark:bg-slate-900 p-6 border border-slate-100 dark:border-slate-800 rounded-3xl space-y-4 shadow-sm animate-scale-up text-xs border-gray-105">
                                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block border-b pb-2 dark:border-slate-800">Biblioteca Completa de Documentos</span>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    {[
                                                        { title: 'Reglamento de Copropiedad Oficial', type: 'PDF', size: '2.4 MB', date: '01/01/2026' },
                                                        { title: 'Minuta Asamblea Extraordinaria - Mayo', type: 'PDF', size: '820 KB', date: '12/05/2026' },
                                                        { title: 'Balance Consolidado Gastos Comunes Q1', type: 'XLSX', size: '1.2 MB', date: '10/04/2026' }
                                                    ].map((doc, i) => (
                                                        <div key={i} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl flex items-center justify-between shadow-sm hover:border-[#72B043]/30 transition-all">
                                                            <div>
                                                                <p className="font-black text-slate-800 dark:text-white text-xs">{doc.title}</p>
                                                                <span className="text-[9px] text-slate-450 block mt-0.5">{doc.type} &bull; {doc.size} &bull; Subido el {doc.date}</span>
                                                            </div>
                                                            <button type="button" onClick={() => alert(`Descargando ${doc.title}...`)} className="px-4 py-2 bg-[#72B043]/10 hover:bg-[#72B043]/20 text-[#72B043] font-bold rounded-xl transition-all">
                                                                Descargar
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Widescreen Comunidad */}
                                        {mobileTab === 'comunidad' && (
                                            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm h-[560px] flex overflow-hidden animate-scale-up text-xs border-gray-105">
                                                {/* Left Chat side panel */}
                                                <div className="w-56 border-r border-slate-100 dark:border-slate-850 p-4 space-y-4 shrink-0 bg-slate-50/50 dark:bg-slate-950/20">
                                                    <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-450 block">Contactos de Soporte</span>
                                                    <div className="space-y-2">
                                                        <div className="p-2.5 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl flex items-center gap-2">
                                                            <div className="h-6 w-6 rounded-full bg-[#EC7A08]/15 flex items-center justify-center text-xs">👥</div>
                                                            <div className="min-w-0 flex-1">
                                                                <h5 className="font-bold text-slate-850 dark:text-slate-200 truncate leading-tight">Conserjería</h5>
                                                                <span className="text-[8px] text-emerald-500 font-bold block">● En línea</span>
                                                            </div>
                                                        </div>
                                                        <div className="p-2.5 hover:bg-white dark:hover:bg-slate-900 rounded-xl flex items-center gap-2 cursor-pointer transition-colors text-slate-500">
                                                            <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-xs">👔</div>
                                                            <div className="min-w-0 flex-1">
                                                                    <h5 className="font-bold truncate leading-tight">Administrador</h5>
                                                                    <span className="text-[8px] block">Fuera de línea</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Right Chat core panel */}
                                                <div className="flex-1 flex flex-col p-6 min-w-0">
                                                    <div className="flex-1 overflow-y-auto pr-1 py-2 space-y-3 max-h-[380px]">
                                                        {chatMessages.map((msg, i) => (
                                                            <div 
                                                                key={i} 
                                                                className={`flex flex-col max-w-[70%] rounded-2xl px-4 py-2.5 relative shadow-sm ${
                                                                    msg.sender === 'system' 
                                                                        ? 'mx-auto bg-slate-100 text-slate-500 text-[10px] text-center max-w-[80%] dark:bg-slate-950 border border-slate-150 dark:border-slate-850'
                                                                        : msg.sender === 'me'
                                                                        ? 'ml-auto bg-[#72B043] text-white rounded-br-none'
                                                                        : 'bg-slate-50 border border-slate-150 dark:bg-slate-950 dark:border-slate-850 text-slate-800 dark:text-slate-200 rounded-bl-none'
                                                                }`}
                                                            >
                                                                <p className="leading-relaxed">{msg.text}</p>
                                                                {msg.time && (
                                                                    <span className={`text-[7px] block text-right mt-1 ${msg.sender === 'me' ? 'text-white/60' : 'text-slate-450'}`}>{msg.time}</span>
                                                                )}
                                                            </div>
                                                        ))}
                                                        {isTyping && (
                                                            <div className="bg-slate-50 border border-slate-150 dark:bg-slate-950 dark:border-slate-850 text-slate-500 px-4 py-2 rounded-2xl rounded-bl-none max-w-[120px] flex items-center gap-1 shadow-sm">
                                                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <form onSubmit={sendChatMessage} className="flex gap-2 pt-4 border-t dark:border-slate-800 shrink-0">
                                                        <input 
                                                            type="text"
                                                            placeholder="Escribe tu mensaje aquí..."
                                                            value={chatInput}
                                                            onChange={(e) => setChatInput(e.target.value)}
                                                            className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 text-xs rounded-xl focus:outline-none focus:border-[#72B043]"
                                                        />
                                                        <button type="submit" className="px-5 py-2 bg-[#72B043] hover:bg-[#629b37] text-white text-xs font-bold rounded-xl shadow transition-colors">
                                                            Enviar
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </div>

                            </div>
                        </div>
                    ) : (
                        <>
                        <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-6">
                        
                        {/* Smartphone Wrapper Layout for native premium look */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-3xl md:rounded-[40px] overflow-hidden shadow-xl flex flex-col w-full md:max-w-[390px] md:h-[720px] md:max-h-[calc(100dvh-120px)] mx-auto relative transition-colors duration-300 md:ring-12 md:ring-slate-950/90 shadow-2xl">
                            
                            {/* Inner App Header */}
                            <div className="px-6 py-5 bg-gradient-to-br from-[#72B043] via-[#85c851] to-[#5a932f] text-white flex flex-col gap-3 shrink-0">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-black tracking-tight font-sans">
                                            Mi<span className="text-emerald-100">Vecino</span>
                                        </h3>
                                    </div>                                     <div className="flex items-center gap-2">
                                         {isDesktop && (
                                             <button
                                                 onClick={() => setForceMobileView(false)}
                                                 className="px-2 py-1 bg-white/20 hover:bg-white/30 border border-white/20 rounded-lg text-[9px] font-bold transition-all uppercase tracking-wider"
                                                 title="Cambiar a Vista Widescreen de PC"
                                             >
                                                 Vista PC
                                             </button>
                                         )}
                                         <button
                                             onClick={() => setMobileTab(mobileTab === 'configuracion' ? 'home' : 'configuracion')}
                                             className={`p-1.5 rounded-lg border transition-all ${
                                                 mobileTab === 'configuracion' 
                                                     ? 'bg-white text-[#72B043] border-white' 
                                                     : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                                             }`}
                                             title="Configuración"
                                         >
                                             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                                 <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.43l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.991l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                                                 <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                             </svg>
                                         </button>
                                     </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <span className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest block">Vecino Autenticado</span>
                                        <h4 className="text-sm font-extrabold flex items-center gap-1.5">
                                            ¡Hola, {user.name}! 
                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 animate-pulse" />
                                        </h4>
                                    </div>
                                    <span className="px-2 py-0.5 bg-white/15 border border-white/25 rounded-md text-[9px] font-mono tracking-wider font-extrabold">Depto 202</span>
                                </div>
                            </div>

                            {/* Inner Tab Controller */}
                            <div className="flex-1 overflow-y-auto p-6 pb-20 space-y-6">
                                
                                {/* 1. HOME SCREEN */}
                                {mobileTab === 'home' && (
                                    <div className="space-y-6 animate-scale-up">
                                        {/* Dynamic Carousel / Featured Alerts */}
                                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#EC7A08]/10 to-[#EC7A08]/5 border border-[#EC7A08]/20 p-5 flex items-start gap-4 shadow-sm">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-[#EC7A08]/5 rounded-full blur-xl" />
                                            <div className="h-10 w-10 rounded-xl bg-[#EC7A08]/15 border border-[#EC7A08]/30 text-[#EC7A08] flex items-center justify-center shrink-0">
                                                <svg className="w-5 h-5 text-[#EC7A08] animate-bounce" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" style={{ animationDuration: '3s' }}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a9.001 9.001 0 01-11.963-3.07 9.001 9.001 0 013.07-11.963c.48-.277 1.012-.456 1.56-.532a.75.75 0 01.815.58l.492 2.213a.75.75 0 01-.419.824l-1.077.538a6.502 6.502 0 003.003 3.003l.538-1.077a.75.75 0 01.824-.419l2.213.493a.75.75 0 01.58.815c-.076.548-.255 1.08-.532 1.56z" />
                                                </svg>
                                            </div>
                                            <div className="min-w-0 flex-1 space-y-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="px-2 py-0.5 bg-[#EC7A08]/15 border border-[#EC7A08]/25 text-[8px] font-bold text-[#EC7A08] uppercase tracking-wider rounded">Circular Destacada</span>
                                                    <span className="text-[9px] text-slate-450 dark:text-slate-500">Hoy 15:10</span>
                                                </div>
                                                <h4 className="text-xs font-black text-slate-800 dark:text-white truncate">Corte de Agua Programado</h4>
                                                <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-snug">Se informa que el Jueves 28 se suspenderá el suministro de agua potable de 14:00 a 18:00 hrs por reparaciones en matriz principal.</p>
                                            </div>
                                        </div>

                                        {/* Outstanding Expense Summary card */}
                                        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl flex justify-between items-center shadow-sm">
                                            <div className="space-y-1">
                                                <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#72B043]">Gasto Común Mayo</span>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-2xl font-black text-slate-900 dark:text-white">
                                                        {residentExpenses.status === 'completed' ? '$0' : '$165.000'}
                                                    </span>
                                                    <span className="text-[10px] text-slate-450">CLP</span>
                                                </div>
                                                <p className="text-[10px] text-slate-500">
                                                    {residentExpenses.status === 'completed' ? '¡Tu cuenta está al día!' : `Vence el ${residentExpenses.dueDate}`}
                                                </p>
                                            </div>
                                            <div>
                                                {residentExpenses.status === 'completed' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/25 text-[10px] font-bold text-emerald-500 dark:text-emerald-450 rounded-full uppercase tracking-wider">
                                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                        Pagado
                                                    </span>
                                                ) : (
                                                    <button 
                                                        onClick={() => setMobileTab('pagos')}
                                                        className="px-4 py-2 bg-[#72B043] hover:bg-[#629b37] text-white text-xs font-bold rounded-xl shadow-md shadow-[#72B043]/10 hover:shadow-[#72B043]/20 transition-all flex items-center gap-1"
                                                    >
                                                        Ir a Pagar
                                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* 6 Icons grid layout */}
                                        <div className="space-y-3">
                                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">Tu Taller de MiVecino</span>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                                {[
                                                    { tab: 'comunicados', label: 'Comunicados', color: 'bg-indigo-50/80 hover:border-indigo-500/30 text-indigo-650 border-indigo-100 dark:bg-slate-950 dark:border-slate-850 dark:text-indigo-400', icon: '📢', desc: 'Mural de circulares' },
                                                    { tab: 'reservas', label: 'Reservas', color: 'bg-violet-50/80 hover:border-violet-500/30 text-violet-650 border-violet-100 dark:bg-slate-950 dark:border-slate-850 dark:text-violet-400', icon: '📅', desc: 'Quincho, piscina, gym' },
                                                    { tab: 'pagos', label: 'Pagos', color: 'bg-emerald-50/80 hover:border-emerald-500/30 text-emerald-650 border-emerald-100 dark:bg-slate-950 dark:border-slate-850 dark:text-emerald-400', icon: '💵', desc: 'Gastos y comprobantes' },
                                                    { tab: 'incidencias', label: 'Incidencias', color: 'bg-rose-50/80 hover:border-rose-500/30 text-rose-650 border-rose-100 dark:bg-slate-950 dark:border-slate-850 dark:text-rose-400', icon: '🛠️', desc: 'Reportar avería' },
                                                    { tab: 'documentos', label: 'Documentos', color: 'bg-cyan-50/80 hover:border-cyan-500/30 text-cyan-650 border-cyan-100 dark:bg-slate-950 dark:border-slate-850 dark:text-cyan-400', icon: '📄', desc: 'Reglamentos y actas' },
                                                    { tab: 'comunidad', label: 'Comunidad', color: 'bg-amber-50/80 hover:border-amber-500/30 text-amber-650 border-amber-100 dark:bg-slate-950 dark:border-slate-850 dark:text-amber-400', icon: '👥', desc: 'Mensajería y Conserje' }
                                                ].map(item => (
                                                    <button 
                                                        key={item.tab}
                                                        onClick={() => setMobileTab(item.tab)}
                                                        className={`p-4 border rounded-2xl text-left transition-all hover:scale-[1.02] shadow-sm flex flex-col justify-between aspect-[1.1] sm:aspect-auto ${item.color}`}
                                                    >
                                                        <span className="text-2xl">{item.icon}</span>
                                                        <div className="mt-2 text-left">
                                                            <span className="text-xs font-bold block">{item.label}</span>
                                                            <span className="text-[8px] text-slate-450 block mt-0.5 leading-tight">{item.desc}</span>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Recent activity snippet */}
                                        <div className="bg-slate-50 dark:bg-slate-950/60 p-4 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-2.5">
                                            <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500 block">Resumen de Actividad Reciente</span>
                                            <div className="grid grid-cols-2 gap-4 text-xs">
                                                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-3 rounded-xl flex items-center justify-between">
                                                    <div>
                                                        <span className="text-[8px] text-slate-450 font-bold block">RESERVAS</span>
                                                        <span className="font-bold text-slate-700 dark:text-slate-300">1 Aprobada</span>
                                                    </div>
                                                    <span className="text-emerald-500 text-lg">●</span>
                                                </div>
                                                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-3 rounded-xl flex items-center justify-between">
                                                    <div>
                                                        <span className="text-[8px] text-slate-450 font-bold block">TICKETS</span>
                                                        <span className="font-bold text-slate-700 dark:text-slate-300">1 Pendiente</span>
                                                    </div>
                                                    <span className="text-amber-500 text-lg">●</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 2. COMUNICADOS SCREEN */}
                                {mobileTab === 'comunicados' && (
                                    <div className="space-y-4 animate-scale-up">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setMobileTab('home')} className="text-slate-400 hover:text-slate-650 transition-colors">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                                </svg>
                                            </button>
                                            <h3 className="text-sm font-black uppercase tracking-wider text-slate-850 dark:text-slate-200">Mural de Comunicados</h3>
                                        </div>

                                        <div className="space-y-3">
                                            {[
                                                { id: 1, title: 'Fumigación de Áreas Verdes', category: 'Importante', date: '24/05/2026', body: 'Se procederá a realizar la fumigación de jardines comunes este Sábado a partir de las 08:30 hrs. Mantenga ventanas cerradas y retire mascotas.', priority: 'warning' },
                                                { id: 2, title: 'Prueba de Alarmas de Incendio', category: 'Normal', date: '20/05/2026', body: 'El Miércoles 27 a las 12:00 se realizarán las pruebas reglamentarias del sistema de evacuación. Sonará por bloques de 15 segundos.', priority: 'default' },
                                                { id: 3, title: 'Pago Gasto Común Disponible', category: 'Urgente', date: '15/05/2026', body: 'Se informa la emisión del cobro del mes de Mayo. Agradecemos registrar sus transferencias mediante nuestro nuevo visor QR express.', priority: 'danger' }
                                            ].map(item => (
                                                <div key={item.id} className="p-4 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-2 bg-slate-50/50 dark:bg-slate-950 shadow-sm">
                                                    <div className="flex justify-between items-center">
                                                        <span className={`px-2 py-0.5 text-[8px] font-bold rounded uppercase ${
                                                            item.priority === 'danger' ? 'bg-rose-500/10 text-rose-500' :
                                                            item.priority === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-200 text-slate-700 dark:bg-slate-850 dark:text-slate-400'
                                                        }`}>
                                                            {item.category}
                                                        </span>
                                                        <span className="text-[9px] text-slate-450 dark:text-slate-500">{item.date}</span>
                                                    </div>
                                                    <h4 className="text-xs font-black text-slate-800 dark:text-white">{item.title}</h4>
                                                    <p className="text-[10px] text-slate-650 dark:text-slate-400 leading-relaxed">{item.body}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 3. RESERVAS SCREEN */}
                                {mobileTab === 'reservas' && (
                                    <div className="space-y-6 animate-scale-up">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setMobileTab('home')} className="text-slate-400 hover:text-slate-650 transition-colors">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                                </svg>
                                            </button>
                                            <h3 className="text-sm font-black uppercase tracking-wider text-slate-850 dark:text-slate-200">Reservar Áreas Comunes</h3>
                                        </div>

                                        {/* Form block */}
                                        <form onSubmit={submitBooking} className="bg-slate-50 dark:bg-slate-950 p-5 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-4">
                                            <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#72B043] block border-b pb-2 dark:border-slate-800">Nueva Reservación</span>
                                            
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] text-slate-450 uppercase font-extrabold">Selecciona Espacio</label>
                                                    <select 
                                                        value={bookingAmenity} 
                                                        onChange={(e) => setBookingAmenity(e.target.value)}
                                                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:outline-none focus:border-[#72B043]"
                                                    >
                                                        {amenities.map(a => (
                                                            <option key={a.id} value={a.id}>{a.name} ({a.price > 0 ? `$${a.price.toLocaleString()}` : 'Gratis'})</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] text-slate-450 uppercase font-extrabold">Horario</label>
                                                    <select 
                                                        value={bookingSlot} 
                                                        onChange={(e) => setBookingSlot(e.target.value)}
                                                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:outline-none focus:border-[#72B043]"
                                                    >
                                                        <option value="Mañana (09:00 - 13:00)">Mañana (09:00 - 13:00)</option>
                                                        <option value="Tarde (14:00 - 18:00)">Tarde (14:00 - 18:00)</option>
                                                        <option value="Noche (19:00 - 23:30)">Noche (19:00 - 23:30)</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[9px] text-slate-450 uppercase font-extrabold block">Fecha del Evento</label>
                                                <input 
                                                    type="date"
                                                    value={bookingDate}
                                                    onChange={(e) => setBookingDate(e.target.value)}
                                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:outline-none focus:border-[#72B043] font-mono text-slate-700 dark:text-slate-350"
                                                />
                                            </div>

                                            {/* Details indicator */}
                                            <div className="p-3 bg-white/70 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-xl text-[9px] text-slate-500 space-y-1">
                                                <span className="font-bold text-slate-750 block">Normas generales de reserva:</span>
                                                <p className="leading-snug">{amenities.find(a => a.id === bookingAmenity)?.rules}</p>
                                                <p className="font-bold text-[#EC7A08] leading-snug">Capacidad máx: {amenities.find(a => a.id === bookingAmenity)?.cap}</p>
                                            </div>

                                            <button 
                                                type="submit"
                                                className="w-full py-2.5 bg-[#72B043] hover:bg-[#629b37] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                                            >
                                                Confirmar Solicitud de Reserva
                                            </button>
                                        </form>

                                        {/* User's reservation list */}
                                        <div className="space-y-3">
                                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">Tus Reservas Históricas</span>
                                            
                                            <div className="space-y-2">
                                                {myReservations.map(res => (
                                                    <div key={res.id} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl flex items-center justify-between text-xs shadow-sm">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-slate-800 dark:text-white">{res.name}</span>
                                                                <span className="text-[9px] text-slate-450 font-mono">#{res.id}</span>
                                                            </div>
                                                            <span className="text-[10px] text-slate-500 block">{res.date} &bull; {res.slot}</span>
                                                        </div>
                                                        <div className="text-right space-y-1">
                                                            <span className="font-bold block text-slate-750">{res.price > 0 ? `$${res.price.toLocaleString()}` : 'Gratis'}</span>
                                                            <span className={`px-2 py-0.5 text-[8px] font-bold rounded uppercase block text-center ${
                                                                res.status === 'approved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                                            }`}>
                                                                {res.status === 'approved' ? 'Aprobada' : 'Pendiente'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 4. PAGOS SCREEN */}
                                {mobileTab === 'pagos' && (
                                    <div className="space-y-6 animate-scale-up">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setMobileTab('home')} className="text-slate-400 hover:text-slate-650 transition-colors">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                                </svg>
                                            </button>
                                            <h3 className="text-sm font-black uppercase tracking-wider text-slate-850 dark:text-slate-200">Finanzas y Gastos Comunes</h3>
                                        </div>

                                        {/* Outstanding Expense breakdown */}
                                        <div className="bg-slate-50 dark:bg-slate-950 p-5 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-4">
                                            <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800">
                                                <div>
                                                    <span className="text-[9px] font-mono text-slate-550 uppercase">Período de Facturación</span>
                                                    <h4 className="text-xs font-black text-slate-800 dark:text-white">{residentExpenses.period}</h4>
                                                </div>
                                                <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                                    residentExpenses.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                                }`}>
                                                    {residentExpenses.status === 'completed' ? 'PAGADO' : 'PENDIENTE'}
                                                </span>
                                            </div>

                                            <div className="space-y-2 text-xs">
                                                <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 block mb-1">Desglose de Ítems</span>
                                                {residentExpenses.items.map((item, i) => (
                                                    <div key={i} className="flex justify-between items-center py-1.5 border-b border-dashed border-slate-200/50 dark:border-slate-800 last:border-b-0 text-slate-600 dark:text-slate-450">
                                                        <span>{item.name}</span>
                                                        <span className="font-mono text-slate-900 dark:text-slate-200">${item.amount.toLocaleString()}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex justify-between items-center pt-3 border-t dark:border-slate-800 text-xs">
                                                <span className="font-extrabold text-slate-800 dark:text-white">Monto Consolidado:</span>
                                                <span className="text-sm font-black text-[#72B043] font-mono">
                                                    {residentExpenses.status === 'completed' ? '$0' : `$${residentExpenses.amount.toLocaleString()}`}
                                                </span>
                                            </div>

                                            {residentExpenses.status !== 'completed' && (
                                                <button 
                                                    onClick={() => {
                                                        setPaymentCompletedSuccess(false);
                                                        setPaymentReceiptName('');
                                                        setShowPaymentModal(true);
                                                    }}
                                                    className="w-full py-3 bg-[#72B043] hover:bg-[#629b37] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                                                >
                                                    Pagar Gasto Común Express
                                                </button>
                                            )}
                                        </div>

                                        {/* Payments log */}
                                        <div className="space-y-3">
                                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">Historial de Transacciones</span>
                                            
                                            <div className="space-y-2">
                                                {paymentHistory.map(hist => (
                                                    <div key={hist.id} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl flex items-center justify-between text-xs shadow-sm">
                                                        <div className="space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-slate-800 dark:text-white">{hist.period}</span>
                                                                <span className="text-[8px] text-slate-550 font-mono">ID: PAY-{hist.id}</span>
                                                            </div>
                                                            <span className="text-[9px] text-slate-500 block">{hist.date} &bull; {hist.method}</span>
                                                        </div>
                                                        <div className="text-right space-y-1">
                                                            <span className="font-mono font-bold block text-slate-800 dark:text-white">${hist.amount.toLocaleString()}</span>
                                                            <span className="text-[9px] text-emerald-500 font-extrabold uppercase flex items-center justify-end gap-1">
                                                                &bull; Validado
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 5. INCIDENCIAS SCREEN */}
                                {mobileTab === 'incidencias' && (
                                    <div className="space-y-6 animate-scale-up">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setMobileTab('home')} className="text-slate-400 hover:text-slate-650 transition-colors">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                                </svg>
                                            </button>
                                            <h3 className="text-sm font-black uppercase tracking-wider text-slate-850 dark:text-slate-200">Reportar Incidencias / Averías</h3>
                                        </div>

                                        {/* Ticket creation Form */}
                                        <form onSubmit={submitTicket} className="bg-slate-50 dark:bg-slate-950 p-5 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-4">
                                            <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#72B043] block border-b pb-2 dark:border-slate-800">Levantar Reporte Técnico</span>
                                            
                                            <div className="space-y-1">
                                                <label className="text-[9px] text-slate-450 uppercase font-extrabold">Título de la Incidencia</label>
                                                <input 
                                                    type="text"
                                                    placeholder="Ej: Ampolleta quemada en ascensor"
                                                    value={newTicketTitle}
                                                    onChange={(e) => setNewTicketTitle(e.target.value)}
                                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:outline-none focus:border-[#72B043]"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[9px] text-slate-450 uppercase font-extrabold">Categoría</label>
                                                    <select 
                                                        value={newTicketCat} 
                                                        onChange={(e) => setNewTicketCat(e.target.value)}
                                                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:outline-none focus:border-[#72B043]"
                                                    >
                                                        <option value="Electricidad">Electricidad</option>
                                                        <option value="Plomería">Plomería</option>
                                                        <option value="Seguridad">Seguridad</option>
                                                        <option value="Ascensores">Ascensores</option>
                                                        <option value="Limpieza">Limpieza</option>
                                                        <option value="Otros">Otros</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[9px] text-slate-450 uppercase font-extrabold">Prioridad de Solicitud</label>
                                                    <select 
                                                        value={newTicketPri} 
                                                        onChange={(e) => setNewTicketPri(e.target.value)}
                                                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:outline-none focus:border-[#72B043]"
                                                    >
                                                        <option value="low">Baja (General)</option>
                                                        <option value="medium">Media (Necesaria)</option>
                                                        <option value="high">Alta (Urgente)</option>
                                                        <option value="urgent">Crítica (Emergencia)</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-1">
                                                <label className="text-[9px] text-slate-450 uppercase font-extrabold">Descripción del Problema</label>
                                                <textarea 
                                                    rows="3"
                                                    placeholder="Detalla lo que ocurre para agilizar la asignación al personal de mantenimiento..."
                                                    value={newTicketDesc}
                                                    onChange={(e) => setNewTicketDesc(e.target.value)}
                                                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-xs focus:outline-none focus:border-[#72B043] resize-none"
                                                />
                                            </div>

                                            {/* Photo simulation attachment */}
                                            <div className="space-y-1">
                                                <label className="text-[9px] text-slate-450 uppercase font-extrabold block">Adjuntar Evidencia Fotográfica (Simulado)</label>
                                                <div className="border border-dashed border-slate-250/60 dark:border-slate-850 p-4 rounded-xl flex flex-col items-center justify-center text-center gap-1 bg-white/50 dark:bg-slate-900">
                                                    <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                                    </svg>
                                                    <span className="text-[10px] font-bold text-slate-500 mt-1">Cargar Archivo JPG/PNG</span>
                                                    <span className="text-[8px] text-slate-450 block">Máximo 15MB de tamaño</span>
                                                </div>
                                            </div>

                                            <button 
                                                type="submit"
                                                className="w-full py-2.5 bg-[#72B043] hover:bg-[#629b37] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                                            >
                                                Crear Ticket e Iniciar Seguimiento
                                            </button>
                                        </form>

                                        {/* Reported tickets list */}
                                        <div className="space-y-3">
                                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 block">Tus Reportes de Incidencia</span>
                                            
                                            <div className="space-y-3">
                                                {reportedTickets.map(tick => (
                                                    <div key={tick.id} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-3 shadow-sm text-xs">
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-black text-slate-800 dark:text-white">{tick.title}</span>
                                                                <span className="text-[9px] text-slate-450 font-mono">#{tick.id}</span>
                                                            </div>
                                                            <StatusBadge status={tick.status} type="ticket" />
                                                        </div>
                                                        <p className="text-[10px] text-slate-650 dark:text-slate-400 leading-relaxed bg-white/70 dark:bg-slate-900 p-2.5 border border-slate-100/50 dark:border-slate-850 rounded-xl">{tick.desc}</p>
                                                        <div className="flex items-center justify-between text-[9px] text-slate-500 font-medium">
                                                            <span>Fecha: {tick.date} &bull; Categoría: {tick.category}</span>
                                                            <span className="font-extrabold uppercase">Prioridad: {tick.priority}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* 6. DOCUMENTOS SCREEN */}
                                {mobileTab === 'documentos' && (
                                    <div className="space-y-4 animate-scale-up">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setMobileTab('home')} className="text-slate-400 hover:text-slate-650 transition-colors">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                                </svg>
                                            </button>
                                            <h3 className="text-sm font-black uppercase tracking-wider text-slate-850 dark:text-slate-200">Biblioteca de Documentos</h3>
                                        </div>

                                        <div className="space-y-2.5">
                                            {[
                                                { title: 'Reglamento de Copropiedad Oficial', type: 'PDF', size: '2.4 MB', date: '01/01/2026' },
                                                { title: 'Minuta Asamblea Extraordinaria - Mayo', type: 'PDF', size: '820 KB', date: '12/05/2026' },
                                                { title: 'Balance Consolidado Gastos Comunes Q1', type: 'XLSX', size: '1.2 MB', date: '10/04/2026' }
                                            ].map((doc, i) => (
                                                <div 
                                                    key={i} 
                                                    className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl flex items-center justify-between text-xs shadow-sm hover:border-[#72B043]/30 dark:hover:border-[#72B043]/30 transition-all"
                                                >
                                                    <div className="space-y-1">
                                                        <span className="font-bold text-slate-800 dark:text-white block">{doc.title}</span>
                                                        <span className="text-[9px] text-slate-500 block">Formato: {doc.type} &bull; Peso: {doc.size} &bull; Fecha: {doc.date}</span>
                                                    </div>
                                                    <button 
                                                        onClick={() => alert(`Simulando descarga de: ${doc.title}`)}
                                                        className="h-9 w-9 rounded-xl bg-[#72B043]/10 hover:bg-[#72B043] text-[#72B043] hover:text-white border border-[#72B043]/20 flex items-center justify-center transition-all shadow-sm"
                                                        title="Descargar archivo"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* 7. COMUNIDAD/CHAT SCREEN */}
                                {mobileTab === 'comunidad' && (
                                    <div className="space-y-4 flex flex-col h-[500px] justify-between pb-2 animate-scale-up">
                                        <div className="flex items-center gap-2 border-b pb-3 dark:border-slate-800 shrink-0">
                                            <button onClick={() => setMobileTab('home')} className="text-slate-400 hover:text-slate-650 transition-colors">
                                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                                </svg>
                                            </button>
                                            <div className="flex items-center gap-2">
                                                <div className="h-7 w-7 rounded-full bg-[#EC7A08]/15 border border-[#EC7A08]/30 flex items-center justify-center text-xs">👥</div>
                                                <div>
                                                    <h4 className="text-xs font-black text-slate-850 dark:text-slate-200">Conserjería y Soporte Vecinal</h4>
                                                    <span className="text-[8px] text-emerald-500 font-bold block">● En línea</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Message thread */}
                                        <div className="flex-1 overflow-y-auto pr-1 py-2 space-y-3 font-sans text-xs">
                                            {chatMessages.map((msg, i) => (
                                                <div 
                                                    key={i} 
                                                    className={`flex flex-col max-w-[80%] rounded-2xl px-4 py-2.5 relative shadow-sm ${
                                                        msg.sender === 'system' 
                                                            ? 'mx-auto bg-slate-100 border border-slate-200/50 text-slate-500 text-[10px] text-center max-w-[90%] dark:bg-slate-950 dark:border-slate-850'
                                                            : msg.sender === 'me'
                                                            ? 'ml-auto bg-[#72B043] text-white rounded-br-none'
                                                            : 'bg-slate-50 border border-slate-100 dark:bg-slate-950 dark:border-slate-850 text-slate-800 dark:text-slate-200 rounded-bl-none'
                                                    }`}
                                                >
                                                    <p className="leading-relaxed">{msg.text}</p>
                                                    {msg.time && (
                                                        <span className={`text-[7px] block text-right mt-1 ${msg.sender === 'me' ? 'text-white/60' : 'text-slate-450'}`}>{msg.time}</span>
                                                    )}
                                                </div>
                                            ))}
                                            
                                            {isTyping && (
                                                <div className="bg-slate-50 border border-slate-100 dark:bg-slate-950 dark:border-slate-850 text-slate-500 px-4 py-2 rounded-2xl rounded-bl-none max-w-[120px] flex items-center gap-1 shadow-sm">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Input form */}
                                        <form onSubmit={sendChatMessage} className="flex gap-2 pt-2 border-t dark:border-slate-800 shrink-0">
                                            <input 
                                                type="text"
                                                placeholder="Escribe tu mensaje aquí..."
                                                value={chatInput}
                                                onChange={(e) => setChatInput(e.target.value)}
                                                className="flex-1 px-4 py-2 border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs rounded-xl focus:outline-none focus:border-[#72B043]"
                                            />
                                            <button 
                                                type="submit"
                                                className="px-4 py-2 bg-[#72B043] hover:bg-[#629b37] text-white text-xs font-bold rounded-xl shadow transition-colors"
                                            >
                                                Enviar
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>

                            {/* Inner Fixed App Bottom Navigation Grid */}
                            <div className="absolute bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-slate-800 flex items-center justify-around text-slate-500 z-20 shadow-lg select-none">
                                <button 
                                    onClick={() => setMobileTab('home')}
                                    className={`flex flex-col items-center justify-center w-12 h-full transition-colors ${mobileTab === 'home' ? 'text-[#72B043] font-bold' : 'text-slate-500 hover:text-slate-350'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                    </svg>
                                    <span className="text-[8px] font-bold mt-0.5 font-sans">Inicio</span>
                                </button>
                                
                                <button 
                                    onClick={() => setMobileTab('reservas')}
                                    className={`flex flex-col items-center justify-center w-12 h-full transition-colors ${mobileTab === 'reservas' ? 'text-[#72B043] font-bold' : 'text-slate-500 hover:text-slate-350'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15z" />
                                    </svg>
                                    <span className="text-[8px] font-bold mt-0.5 font-sans">Reservas</span>
                                </button>
                                
                                {/* Floating central + button in bottom nav */}
                                <button 
                                    onClick={() => setMobileTab('incidencias')}
                                    className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-[#72B043] to-[#EC7A08] text-white rounded-full shadow-lg shadow-[#72B043]/15 hover:scale-105 transition-transform duration-200 z-30 -translate-y-4"
                                >
                                    <span className="text-xl font-bold font-sans">+</span>
                                </button>
                                
                                <button 
                                    onClick={() => setMobileTab('pagos')}
                                    className={`flex flex-col items-center justify-center w-12 h-full transition-colors ${mobileTab === 'pagos' ? 'text-[#72B043] font-bold' : 'text-slate-500 hover:text-slate-350'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h.007v.008H3.75V4.5zM3 16.25h1.5m-1.5 3h1.5" />
                                    </svg>
                                    <span className="text-[8px] font-bold mt-0.5 font-sans">Pagos</span>
                                </button>

                                <button 
                                    onClick={() => setMobileTab('comunidad')}
                                    className={`flex flex-col items-center justify-center w-12 h-full transition-colors ${mobileTab === 'comunidad' ? 'text-[#72B043] font-bold' : 'text-slate-500 hover:text-slate-355'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                                    </svg>
                                    <span className="text-[8px] font-bold mt-0.5 font-sans">Chat</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ======================================================== */}
            {/* 🔴 QR CODE SIMULATION MODAL FOR MIVECINO RESIDENT        */}
            {/* ======================================================== */}
            {showPaymentModal && (
                <div 
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
                    onClick={() => setShowPaymentModal(false)}
                >
                    <div 
                        className="relative max-w-sm w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl animate-scale-up font-sans text-slate-800 dark:text-slate-200 text-left"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button 
                            onClick={() => setShowPaymentModal(false)}
                            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 text-slate-500 transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {!paymentCompletedSuccess ? (
                            <div className="space-y-5">
                                <div className="text-center space-y-1">
                                    <span className="text-[9px] font-mono text-[#72B043] font-bold uppercase tracking-widest">Escaneo QR Bancario Express</span>
                                    <h3 className="text-base font-black">Pagar Gasto Común</h3>
                                    <p className="text-[10px] text-slate-450 dark:text-slate-500">Realiza tu transferencia o escanea directamente desde tu App del Banco.</p>
                                </div>

                                {/* Dynamic QR Code Box */}
                                <div className="flex flex-col items-center justify-center py-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                                    <svg className="w-36 h-36 text-slate-950 dark:text-white" viewBox="0 0 100 100" fill="currentColor">
                                        <path d="M5,5 h30 v30 h-30 z M15,15 h10 v10 h-10 z" />
                                        <path d="M65,5 h30 v30 h-30 z M75,15 h10 v10 h-10 z" />
                                        <path d="M5,65 h30 v30 h-30 z M15,75 h10 v10 h-10 z" />
                                        <path d="M45,10 h10 v10 h-10 z M50,30 h10 v10 h-10 z M40,50 h20 v10 h-20 z M45,70 h15 v5 h-15 z M75,45 h10 v15 h-10 z M80,75 h15 v15 h-15 z" />
                                        <circle cx="50" cy="50" r="7" className="text-[#72B043]" />
                                    </svg>
                                    <span className="text-[9px] text-slate-450 mt-2 font-mono">Doble Enlace Cifrado Local</span>
                                </div>

                                <div className="space-y-2 text-xs">
                                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 block">Datos de Transferencia Manual</span>
                                    <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-850 space-y-1 text-[10px] font-mono text-slate-650 dark:text-slate-400">
                                        <div className="flex justify-between"><span>Banco:</span><span className="font-bold text-slate-800 dark:text-slate-200">Banco de la Comunidad</span></div>
                                        <div className="flex justify-between"><span>Tipo:</span><span className="font-bold text-slate-800 dark:text-slate-200">Cuenta Corriente</span></div>
                                        <div className="flex justify-between"><span>N° Cuenta:</span><span className="font-bold text-slate-800 dark:text-slate-200">20260526-99</span></div>
                                        <div className="flex justify-between"><span>RUT:</span><span className="font-bold text-slate-800 dark:text-slate-200">77.777.777-7</span></div>
                                        <div className="flex justify-between text-[#72B043] font-bold"><span>Monto:</span><span>$165.000 CLP</span></div>
                                    </div>
                                </div>

                                {/* receipt upload simulation */}
                                <div className="space-y-1 text-xs">
                                    <label className="text-[9px] text-slate-450 uppercase font-extrabold block">Adjuntar Comprobante (Simulado)</label>
                                    <input 
                                        type="file"
                                        onChange={(e) => setPaymentReceiptName(e.target.files[0]?.name || '')}
                                        className="w-full text-[10px] file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-[#72B043]/15 file:text-[#72B043] hover:file:bg-[#72B043]/20 focus:outline-none"
                                    />
                                    {paymentReceiptName && (
                                        <span className="text-[9px] text-emerald-500 font-bold block mt-1">✓ Comprobante listo: {paymentReceiptName}</span>
                                    )}
                                </div>

                                <button 
                                    onClick={executeQrPayment}
                                    disabled={isProcessingPayment}
                                    className="w-full py-2.5 bg-[#72B043] hover:bg-[#629b37] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                                >
                                    {isProcessingPayment ? 'Validando Comprobante...' : 'Confirmar Transferencia / Escaneo'}
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-6 space-y-4 animate-scale-up">
                                <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 text-[#72B043] rounded-full flex items-center justify-center mx-auto text-3xl">
                                    ✓
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-base font-black text-slate-900 dark:text-white">¡Transacción Exitosa!</h3>
                                    <p className="text-[10px] text-slate-500 px-3">Tu pago del Gasto Común de Mayo ha sido registrado en la base de datos local SQLite y validado por administración.</p>
                                </div>
                                
                                <div className="p-3 bg-slate-50 dark:bg-slate-950 border rounded-xl border-slate-100 dark:border-slate-850 max-w-[240px] mx-auto text-[9px] font-mono text-slate-550 space-y-0.5 text-left">
                                    <span className="font-bold block text-slate-700 dark:text-slate-350 border-b pb-1 mb-1">COMPROBANTE DE RECIBO</span>
                                    <div>Folio: REC-421-2026</div>
                                    <div>Monto: $165.000 CLP</div>
                                    <div>Método: Transferencia QR</div>
                                    <div>Estado: Acreditado</div>
                                </div>

                                <button 
                                    onClick={() => {
                                        setShowPaymentModal(false);
                                        setMobileTab('home');
                                    }}
                                    className="px-6 py-2 bg-[#72B043] hover:bg-[#629b37] text-white text-xs font-bold rounded-xl shadow transition-colors"
                                >
                                    Volver al Inicio
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
            </div>
        )}
        </AuthenticatedLayout>
    );
}
