import { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    // Symmetrical Theme Hook for persistent Light/Dark synchronization
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

    // State for interactive Role Simulator
    const [activeRole, setActiveRole] = useState('admin');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [simulatedDarkMode, setSimulatedDarkMode] = useState(true);
    const [simulatedMobileDarkMode, setSimulatedMobileDarkMode] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);

    const brandAssets = [
        {
            id: 'banner',
            title: 'MiVecino & RedVecino Brand Integration',
            image: '/images/mivecino_redvecino_brand_banner.jpeg',
            tag: 'Ecosistema de Marca',
            desc: 'Representa la sinergia e integración tecnológica de las dos interfaces: RedVecino (corporativo y analítico) y MiVecino (cercano y residencial).'
        },
        {
            id: 'branding',
            title: 'Design Guidelines & Identity Board',
            image: '/images/mivecino_redvecino_branding_board.jpeg',
            tag: 'Sistema de Diseño',
            desc: 'Especificaciones estéticas oficiales de colores HSL, tipografía Montserrat y justificación cromática (Azul #0F2557, Teal #00A896, Verde #72B043, Naranja #EC7A08).'
        },
        {
            id: 'roadmap',
            title: 'Strategic Action Roadmap',
            image: '/images/mivecino_redvecino_action_roadmap.jpeg',
            tag: 'Hoja de Ruta',
            desc: 'Fases cronológicas y sprints técnicos para el despliegue del MVP: Setup, Core relacional, Facturación, Incidencias operativas y producción final.'
        },
        {
            id: 'templates',
            title: 'Marketing & Communication Templates',
            image: '/images/mivecino_redvecino_marketing_templates.jpeg',
            tag: 'Material Promocional',
            desc: 'Plantillas de comunicados, circulares informativas y kits de bienvenida para una integración comunitaria fluida de nuevos condominios.'
        },
        {
            id: 'funnel',
            title: 'Resident Growth & Sales Funnel',
            image: '/images/mivecino_redvecino_sales_funnel.jpeg',
            tag: 'Embudo de Crecimiento',
            desc: 'Proceso de captación SaaS para incorporar condominios, activar copropietarios de forma orgánica y fidelizar la suite comunitaria.'
        }
    ];
    
    // State for Common Expenses Calculator
    const [units, setUnits] = useState(50);
    const [securityBudget, setSecurityBudget] = useState(800000);
    const [cleaningBudget, setCleaningBudget] = useState(450000);
    const [maintenanceBudget, setMaintenanceBudget] = useState(350000);
    const [utilitiesBudget, setUtilitiesBudget] = useState(250000);
    
    // State for mock interactions in simulator
    const [ownerIsPaid, setOwnerIsPaid] = useState(false);
    const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
    const [tickets, setTickets] = useState([
        { id: 108, title: 'Falla eléctrica en pasillo C', priority: 'high', status: 'open' },
        { id: 110, title: 'Puerta de acceso trabada', priority: 'urgent', status: 'in_progress' }
    ]);
    const [approvedExpenses, setApprovedExpenses] = useState({ 1: false, 2: false });
    const [terminalLogs, setTerminalLogs] = useState([
        '[SYSTEM] Booting RedVecino SaaS kernel...',
        '[DB] Connected to SQLite database source: database.sqlite',
        '[AUTH] Loaded Spatie RBAC cache (6 roles, 18 permissions).',
    ]);

    // Android Mobile App Simulator state
    const [mobileTab, setMobileTab] = useState('home');
    const [mobileGuestName, setMobileGuestName] = useState('');
    const [mobileGeneratedQr, setMobileGeneratedQr] = useState(false);
    const [mobileFingerprintScanning, setMobileFingerprintScanning] = useState(false);
    const [mobileFingerprintSuccess, setMobileFingerprintSuccess] = useState(false);
    const [mobileLogs, setMobileLogs] = useState([
        'App MiVecino iniciada v1.2.0',
        'Sesión activa: Depto 202 (Propietario)',
        'Conexión segura SSL establecida con API.'
    ]);
    const [mobileNotifications, setMobileNotifications] = useState([
        { id: 1, title: 'Paquete Recibido', desc: 'Conserjería recibió una encomienda de Chilexpress.', time: 'Hace 5m', read: false },
        { id: 2, title: 'Mantención de Ascensores', desc: 'Ascensor torre A estará fuera de servicio mañana 10-12 AM.', time: 'Hace 2h', read: true },
        { id: 3, title: 'Cobro Emitido', desc: 'Se ha emitido el Gasto Común de Mayo por $165.000.', time: 'Ayer', read: true }
    ]);
    const [activeToast, setActiveToast] = useState(null);

    const simulatePushNotification = () => {
        const time = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
        const notices = [
            { title: 'Visita en Conserjería', desc: 'Tu invitado Juan Pérez ha registrado su llegada en el acceso principal.', toast: '¡Visita registrada!' },
            { title: 'Pago Aprobado', desc: 'Tu transferencia de gasto común Depto 202 fue validada con éxito.', toast: '¡Gasto Común Pagado!' },
            { title: 'Alerta Comunitaria', desc: 'Corte de agua de emergencia por reparación de matriz a las 18:00.', toast: '¡Corte de Agua Alerta!' },
            { title: 'Correspondencia Nueva', desc: 'Se ha depositado correspondencia física en tu casillero.', toast: '¡Nuevo Correo!' }
        ];
        const randomNotice = notices[Math.floor(Math.random() * notices.length)];
        const newNotice = {
            id: Date.now(),
            title: randomNotice.title,
            desc: randomNotice.desc,
            time: 'Ahora',
            read: false
        };
        setMobileNotifications(prev => [newNotice, ...prev]);
        setActiveToast({ title: randomNotice.title, desc: randomNotice.toast });
        
        setMobileLogs(prev => [...prev, `[PUSH] Alerta recibida: ${randomNotice.title}`]);
        
        setTimeout(() => {
            setActiveToast(null);
        }, 3500);
    };

    const triggerIotApertura = () => {
        if (mobileFingerprintScanning || mobileFingerprintSuccess) return;
        setMobileFingerprintScanning(true);
        setMobileLogs(prev => [...prev, '[NFC/IoT] Escaneando huella dactilar...']);
        
        setTimeout(() => {
            setMobileFingerprintScanning(false);
            setMobileFingerprintSuccess(true);
            setMobileLogs(prev => [...prev, '[API] Auth exitosa. POST /api/v1/iot/open-gate - status 200']);
            setMobileLogs(prev => [...prev, '[IoT] Portón Vehicular Abierto con éxito.']);
            
            setTimeout(() => {
                setMobileFingerprintSuccess(false);
            }, 3000);
        }, 1500);
    };

    const generateGuestQr = (name) => {
        if (!name.trim()) return;
        setMobileGeneratedQr(true);
        setMobileLogs(prev => [...prev, `[QR] Generando token de acceso para: ${name}`]);
        setMobileLogs(prev => [...prev, `[QR] Token de acceso SHA-256 generado con éxito.`]);
    };

    // Live terminal log generator for TI role
    useEffect(() => {
        if (activeRole !== 'ti') return;
        const interval = setInterval(() => {
            const actions = [
                '[API] GET /api/users/4/profile - 200 OK (34ms)',
                '[AUTH] CheckRole middleware passed for User #12 (Administrador)',
                '[JOB] Queue worker processed job: App\\Jobs\\GenerateCommonExpenses',
                '[CACHE] Spatie permission matrix flushed and reloaded',
                '[SYSTEM] Integrity check: OK. Tables count: 18. Soft-deletes: Enabled',
                '[API] POST /api/payments - 201 Created (45ms) - Payment ID: PAY-9981'
            ];
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            const time = new Date().toLocaleTimeString();
            setTerminalLogs(prev => [...prev.slice(-6), `[${time}] ${randomAction}`]);
        }, 3000);
        return () => clearInterval(interval);
    }, [activeRole]);

    // Calculator values
    const totalExpenses = securityBudget + cleaningBudget + maintenanceBudget + utilitiesBudget;
    const expensePerUnit = Math.round(totalExpenses / units);

    // Format currency to CLP/PESO
    const formatCurrency = (val) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(val);
    };

    // Quick handlers for simulator interactions
    const handlePayClick = () => {
        setShowPaymentSuccess(true);
        setTimeout(() => {
            setOwnerIsPaid(true);
            setShowPaymentSuccess(false);
        }, 1500);
    };

    const handleResetPayment = () => {
        setOwnerIsPaid(false);
    };

    const handleApproveExpense = (id) => {
        setApprovedExpenses(prev => ({ ...prev, [id]: true }));
    };

    const handleTicketStatusChange = (id, newStatus) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    };

    const rolesInfo = {
        admin: {
            title: 'Administrador del Condominio',
            badge: 'Acceso Total',
            desc: 'Gestor operativo y financiero de la copropiedad. Emite cobros, supervisa el personal, gestiona propiedades y coordina el mantenimiento.',
            capabilities: [
                'Facturar Gastos Comunes a todo el condominio en un clic',
                'Asignar tickets de mantenimiento a Colaboradores específicos',
                'Visualizar estados de pago globales y morosidades',
                'Administrar el inventario de propiedades y residentes'
            ]
        },
        owner: {
            title: 'Propietario de Unidades',
            badge: 'Portal Financiero',
            desc: 'Dueño de inmuebles (departamento, estacionamiento, bodega). Su enfoque es la transparencia de cuentas, pagos digitales rápidos y valorización.',
            capabilities: [
                'Ver el desglose exacto de su Gasto Común mensual',
                'Registrar pagos en línea (Transferencia, Tarjeta, Efectivo)',
                'Visualizar sus estados de cuenta históricos y multas',
                'Reportar averías en sus unidades directamente'
            ]
        },
        resident: {
            title: 'Residente / Arrendatario',
            badge: 'Portal de Comunidad',
            desc: 'Habita la propiedad día a día. Requiere comunicación fluida con conserjería, reportar daños en áreas comunes y recibir noticias de la comunidad.',
            capabilities: [
                'Recibir circulares e información de urgencia al instante',
                'Reportar incidencias en áreas comunes con registro fotográfico',
                'Intercambiar correspondencia interna con la administración',
                'Verificar reglamentos y comunicados oficiales del condominio'
            ]
        },
        committee: {
            title: 'Comité de Administración',
            badge: 'Supervisión Co-propietaria',
            desc: 'Vecinos elegidos para fiscalizar la administración. Aprueban los presupuestos, auditan transacciones y publican comunicados oficiales.',
            capabilities: [
                'Aprobar o rechazar propuestas de egresos extraordinarios',
                'Revisar balances consolidados y gráficos financieros',
                'Auditar bitácoras de pagos validados por el administrador',
                'Redactar y publicar avisos con prioridad alta en el muro'
            ]
        },
        employee: {
            title: 'Colaborador (Conserjes / Mantenimiento)',
            badge: 'Panel Operativo',
            desc: 'Personal técnico o de seguridad. Gestionan el día a día operativo: atienden incidentes de mantenimiento asignados y reportan soluciones.',
            capabilities: [
                'Ver lista personalizada de tickets asignados en tiempo real',
                'Cambiar estados de solicitudes: Abierto ➔ En Proceso ➔ Resuelto',
                'Registrar notas técnicas de reparación y adjuntar evidencia',
                'Monitorear alarmas de mantenimiento preventivo'
            ]
        },
        ti: {
            title: 'Soporte TI / Súper Administrador',
            badge: 'Consola del Sistema',
            desc: 'Responsable de la seguridad informática y la estabilidad de la plataforma SaaS. Configura roles dinámicos, permisos RBAC y audita logs.',
            capabilities: [
                'Monitorear logs transaccionales y queries de base de datos',
                'Administrar roles y permisos dinámicos con Spatie v7',
                'Depurar y configurar parámetros del sistema (caché, colas)',
                'Gestionar el multitenancy y mantenimiento preventivo'
            ]
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F8FAFC] via-[#F1F5F9] to-[#E2E8F0] dark:from-[#0F2557] dark:via-[#132c66] dark:to-[#0A183A] text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-[#00A896]/30 selection:text-white overflow-x-hidden transition-colors duration-300">
            <Head title="RedVecino - La Red Inteligente de Condominios" />

            {/* Glowing background meshes (opacity-attenuated in light mode) */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#00A896]/5 dark:bg-[#00A896]/15 rounded-full blur-[120px] pointer-events-none -z-10 transition-opacity duration-300" />
            <div className="absolute top-[30%] right-10 w-[600px] h-[600px] bg-[#72B043]/5 dark:bg-[#72B043]/15 rounded-full blur-[150px] pointer-events-none -z-10 transition-opacity duration-300" />
            <div className="absolute bottom-[20%] left-10 w-[500px] h-[500px] bg-[#EC7A08]/5 dark:bg-[#EC7A08]/10 rounded-full blur-[130px] pointer-events-none -z-10 transition-opacity duration-300" />

            {/* Premium Header/Navigation */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0F2557]/80 backdrop-blur-lg border-b border-slate-200/50 dark:border-white/5 transition-colors duration-300 shadow-sm shadow-slate-100/50 dark:shadow-none">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link href="/" className="group transition-transform duration-300 hover:scale-105">
                            <ApplicationLogo size="medium" showSubtext={true} />
                        </Link>

                        {/* Navigation links */}
                        <nav className="hidden md:flex items-center gap-8">
                            <a href="#simulator" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors">Simulador de Roles</a>
                            <a href="#modules" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors">Módulos Core</a>
                            <a href="#calculator" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors">Calculadora</a>
                            <a href="#mobile-app" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors">App Android</a>
                            <a href="#roadmap" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors">Plan Técnico</a>
                            <a href="#developers" className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors">Arquitectura</a>
                        </nav>

                        {/* Auth actions and theme switcher */}
                        <div className="flex items-center gap-3">
                            {/* Hamburger Menu Button for Mobile */}
                            <button 
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.03] text-slate-505 dark:text-slate-400 hover:text-teal-600 md:hidden transition-all duration-200 shadow-sm"
                                aria-label="Abrir menú"
                            >
                                {mobileMenuOpen ? (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                    </svg>
                                )}
                            </button>
                            {/* Theme switcher */}
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.03] text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-amber-400 hover:border-teal-500/30 dark:hover:border-teal-500/20 transition-all duration-200 shadow-sm"
                                aria-label="Cambiar tema"
                            >
                                {darkMode ? (
                                    <svg className="w-5 h-5 text-amber-400 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                )}
                            </button>

                            {auth && auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="relative group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold rounded-xl hover:opacity-95 shadow-md shadow-indigo-500/20 transition-all overflow-hidden"
                                >
                                    <span className="relative z-10">Ir al Dashboard</span>
                                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-all"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="inline-flex items-center px-5 py-2.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 text-sm font-bold rounded-xl transition-all shadow-md"
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Navigation Drawer Overlay */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed top-20 left-0 right-0 bg-white/95 dark:bg-[#0F2557]/95 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 py-6 px-6 shadow-xl animate-fade-in z-[45] max-h-[calc(100vh-80px)] overflow-y-auto font-sans text-left transition-colors duration-300">
                    <nav className="flex flex-col gap-4">
                        <a 
                            onClick={() => setMobileMenuOpen(false)}
                            href="#simulator"
                            className="text-sm font-extrabold text-slate-700 dark:text-slate-300 hover:text-[#00A896] dark:hover:text-white py-2 border-b border-slate-100 dark:border-white/5 block transition-colors"
                        >
                            Simulador de Roles
                        </a>
                        <a 
                            onClick={() => setMobileMenuOpen(false)}
                            href="#modules"
                            className="text-sm font-extrabold text-slate-700 dark:text-slate-300 hover:text-[#00A896] dark:hover:text-white py-2 border-b border-slate-100 dark:border-white/5 block transition-colors"
                        >
                            Módulos Core
                        </a>
                        <a 
                            onClick={() => setMobileMenuOpen(false)}
                            href="#calculator"
                            className="text-sm font-extrabold text-slate-700 dark:text-slate-300 hover:text-[#00A896] dark:hover:text-white py-2 border-b border-slate-100 dark:border-white/5 block transition-colors"
                        >
                            Calculadora
                        </a>
                        <a 
                            onClick={() => setMobileMenuOpen(false)}
                            href="#mobile-app"
                            className="text-sm font-extrabold text-slate-700 dark:text-slate-300 hover:text-[#00A896] dark:hover:text-white py-2 border-b border-slate-100 dark:border-white/5 block transition-colors"
                        >
                            App Android
                        </a>
                        <a 
                            onClick={() => setMobileMenuOpen(false)}
                            href="#roadmap"
                            className="text-sm font-extrabold text-slate-700 dark:text-slate-300 hover:text-[#00A896] dark:hover:text-white py-2 border-b border-slate-100 dark:border-white/5 block transition-colors"
                        >
                            Plan Técnico
                        </a>
                        <a 
                            onClick={() => setMobileMenuOpen(false)}
                            href="#developers"
                            className="text-sm font-extrabold text-slate-700 dark:text-slate-300 hover:text-[#00A896] dark:hover:text-white py-2 border-b border-slate-100 dark:border-white/5 block transition-colors"
                        >
                            Arquitectura
                        </a>
                        
                        <div className="flex flex-col gap-3 pt-4">
                            {auth && auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="w-full text-center py-3 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-bold rounded-xl hover:opacity-95 shadow-md transition-all"
                                >
                                    Ir al Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="w-full text-center py-2.5 border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="w-full text-center py-3 bg-slate-950 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 text-sm font-bold rounded-xl transition-all shadow-md"
                                    >
                                        Registrarse
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            )}

            {/* Hero Section */}
            <section className="relative pt-36 pb-24 md:pt-44 md:pb-36 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                        {/* Hero Text */}
                        <div className="lg:col-span-6 text-center lg:text-left space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-full shadow-sm">
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A896] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00A896]"></span>
                                </span>
                                Versión 3.1 &middot; Listo para Producción
                            </div>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                                La plataforma definitiva para
                                <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-[#00A896] via-[#72B043] to-[#EC7A08] leading-normal font-black">
                                    Gestión de Condominios
                                </span>
                            </h1>

                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
                                Un ecosistema robusto en Laravel 13 con arquitectura multi-perfil. Automatiza cobros financieros, controla tickets de mantenimiento en tiempo real y optimiza la comunicación interna.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                                <a
                                    href="#simulator"
                                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#0F2557] to-[#00A896] hover:from-[#132c66] hover:to-[#00c2ad] text-white font-bold rounded-2xl shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20 transition-all gap-2"
                                >
                                    Probar Simulador de Roles
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
                                    </svg>
                                </a>
                                <a
                                    href="#modules"
                                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-[#0F2557]/20 border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-300 font-semibold rounded-2xl hover:bg-slate-50 dark:hover:bg-white/[0.05] transition-all"
                                >
                                    Ver Módulos Core
                                </a>
                            </div>

                            {/* Trust badges */}
                            <div className="pt-8 border-t border-slate-200 dark:border-white/10 grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0">
                                <div>
                                    <span className="block text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">100%</span>
                                    <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Transparencia Financiera</span>
                                </div>
                                <div>
                                    <span className="block text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">6 Roles</span>
                                    <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Perfiles Adaptativos</span>
                                </div>
                                <div>
                                    <span className="block text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white">&lt;10ms</span>
                                    <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">Tiempo de Respuesta</span>
                                </div>
                            </div>
                        </div>

                        {/* Hero Interactive Mockup */}
                        <div className="lg:col-span-6 relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-3xl blur-[80px] opacity-20 -z-10" />
                            
                            {/* Glass Card Dashboard Mockup */}
                            <div className="relative border border-slate-200 dark:border-white/5 bg-white/80 dark:bg-[#0F2557]/60 backdrop-blur-xl rounded-3xl p-6 shadow-2xl shadow-slate-200/40 dark:shadow-none transition-all duration-300">
                                {/* Header of mockup */}
                                <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 dark:border-white/5 mb-6">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-rose-500" />
                                        <span className="w-3 h-3 rounded-full bg-amber-500" />
                                        <span className="w-3 h-3 rounded-full bg-emerald-500" />
                                        <span className="text-xs font-mono text-slate-400 dark:text-slate-500 ml-2">redvecino_mivecino_core</span>
                                    </div>
                                    <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded">
                                        SaaS Activo
                                    </span>
                                </div>

                                {/* Mock Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-slate-50/80 dark:bg-[#0B1A3E] border border-slate-100 dark:border-white/5 p-4 rounded-2xl transition-colors duration-300">
                                        <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold block">Recaudación Mensual</span>
                                        <span className="text-xl font-bold text-slate-900 dark:text-white block mt-1">{formatCurrency(18450000)}</span>
                                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block mt-1">&uarr; +14.2% este mes</span>
                                    </div>
                                    <div className="bg-slate-50/80 dark:bg-[#0B1A3E] border border-slate-100 dark:border-white/5 p-4 rounded-2xl transition-colors duration-300">
                                        <span className="text-slate-500 dark:text-slate-400 text-xs font-semibold block">Tickets Resueltos</span>
                                        <span className="text-xl font-bold text-slate-900 dark:text-white block mt-1">94.8%</span>
                                        <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium block mt-1">Eficiencia Operativa</span>
                                    </div>
                                </div>

                                {/* Mock Content - Financial Split Preview */}
                                <div className="space-y-4">
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Distribución de Gastos (Presupuesto Base)</h4>
                                    
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-400">Seguridad & Conserjería</span>
                                            <span className="text-slate-200 font-semibold">44.4%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-[#0B1A3E] rounded-full h-2">
                                            <div className="bg-[#00A896] h-2 rounded-full" style={{ width: '44.4%' }} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-500 dark:text-slate-400">Limpieza & Ornato</span>
                                            <span className="text-slate-700 dark:text-slate-200 font-semibold">25.0%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-[#0B1A3E] rounded-full h-2">
                                            <div className="bg-[#72B043] h-2 rounded-full" style={{ width: '25.0%' }} />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-500 dark:text-slate-400">Mantención Ascensores / Bombas</span>
                                            <span className="text-slate-700 dark:text-slate-200 font-semibold">19.4%</span>
                                        </div>
                                        <div className="w-full bg-slate-100 dark:bg-[#0B1A3E] rounded-full h-2">
                                            <div className="bg-[#EC7A08] h-2 rounded-full" style={{ width: '19.4%' }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Float floating badges */}
                                <div className="absolute -bottom-6 -right-6 bg-white dark:bg-[#0B1A3E] border border-slate-200 dark:border-white/5 p-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce" style={{ animationDuration: '6s' }}>
                                    <div className="h-8 w-8 bg-emerald-500/10 text-emerald-400 flex items-center justify-center rounded-lg">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block">PAGO CONFIRMADO</span>
                                        <span className="text-xs font-bold text-slate-800 dark:text-white">DEPTO 202 &middot; Transferencia</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Android Mobile App Mockup Section */}
            <section id="mobile-app" className="py-24 border-t border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-[#0F2557]/20 backdrop-blur-md relative overflow-hidden transition-colors duration-300">
                {/* Visual decoration glows */}
                <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-[#00A896]/5 rounded-full blur-[140px] pointer-events-none -translate-x-1/2 -translate-y-1/2 -z-10" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-12 gap-12 items-center">
                        
                        {/* Left column: Text and simulator control */}
                        <div className="lg:col-span-7 space-y-6">
                            <span className="text-xs font-bold text-[#72B043] uppercase tracking-widest block">Acceso Móvil Copropietario</span>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none transition-colors duration-300">
                                MiVecino Mobile <br/>
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#72B043] to-[#EC7A08] font-black">Tu Comunidad en tu Bolsillo</span>
                            </h2>
                            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl transition-colors duration-300">
                                Conectada de forma segura mediante tokens cifrados de Laravel Sanctum a la base de datos central. Los residentes pueden gestionar todo su hogar desde su smartphone Android de manera ágil e integrada.
                            </p>
                            
                            {/* Features grids */}
                            <div className="grid sm:grid-cols-2 gap-4 pt-4">
                                <div className="p-4 bg-white/80 dark:bg-white/[0.02] dark:backdrop-blur-md border border-slate-200/50 dark:border-white/5 rounded-2xl flex gap-3 shadow-sm transition-all duration-300 hover:scale-[1.01]">
                                    <div className="h-10 w-10 shrink-0 bg-[#72B043]/10 text-[#72B043] flex items-center justify-center rounded-lg">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200">Acceso Smart IoT</h4>
                                        <p className="text-xs text-slate-600 dark:text-slate-500 mt-1">Abre portones, barreras vehiculares y accesos peatonales con un toque vía llamadas cifradas API.</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-white/80 dark:bg-white/[0.02] dark:backdrop-blur-md border border-slate-200/50 dark:border-white/5 rounded-2xl flex gap-3 shadow-sm transition-all duration-300 hover:scale-[1.01]">
                                    <div className="h-10 w-10 shrink-0 bg-emerald-500/10 text-emerald-400 flex items-center justify-center rounded-lg">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5zM13.5 16.5a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75v.75a.75.75 0 01-.75.75h-.75a.75.75 0 01-.75-.75v-.75z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200">Invitaciones QR Visitas</h4>
                                        <p className="text-xs text-slate-600 dark:text-slate-500 mt-1">Genera credenciales digitales con caducidad dinámica y compártelas directamente por chat.</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-white/80 dark:bg-white/[0.02] dark:backdrop-blur-md border border-slate-200/50 dark:border-white/5 rounded-2xl flex gap-3 shadow-sm transition-all duration-300 hover:scale-[1.01]">
                                    <div className="h-10 w-10 shrink-0 bg-[#EC7A08]/10 text-[#EC7A08] flex items-center justify-center rounded-lg">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a9.001 9.001 0 01-11.963-3.07 9.001 9.001 0 013.07-11.963c.48-.277 1.012-.456 1.56-.532a.75.75 0 01.815.58l.492 2.213a.75.75 0 01-.419.824l-1.077.538a6.502 6.502 0 003.003 3.003l.538-1.077a.75.75 0 01.824-.419l2.213.493a.75.75 0 01.58.815c-.076.548-.255 1.08-.532 1.56z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200">Notificaciones Push</h4>
                                        <p className="text-xs text-slate-600 dark:text-slate-500 mt-1">Recibe avisos inmediatos en tu celular de encomiendas entregadas, asambleas o alertas.</p>
                                    </div>
                                </div>
                                <div className="p-4 bg-white/80 dark:bg-white/[0.02] dark:backdrop-blur-md border border-slate-200/50 dark:border-white/5 rounded-2xl flex gap-3 shadow-sm transition-all duration-300 hover:scale-[1.01]">
                                    <div className="h-10 w-10 shrink-0 bg-[#72B043]/10 text-[#72B043] flex items-center justify-center rounded-lg">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5h.007v.008H3.75V4.5zM3 16.25h1.5m-1.5 3h1.5" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-slate-200">Finanzas Exprés</h4>
                                        <p className="text-xs text-slate-600 dark:text-slate-500 mt-1">Paga alícuotas y gastos comunes en segundos con integraciones bancarias transparentes.</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Copilot simulator tools with 4 interactive direct controls */}
                            <div className="pt-6 space-y-3">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Copiloto del Simulador (Prueba desde afuera)</span>
                                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
                                    <button 
                                        onClick={() => {
                                            setMobileTab('home');
                                            setMobileLogs(prev => [...prev, '[NAV] Redirigiendo a Resumen Financiero...']);
                                        }}
                                        className={`px-4 py-2.5 border text-xs font-bold rounded-xl flex items-center justify-center sm:justify-start gap-2 transition-all shadow ${
                                            mobileTab === 'home' 
                                                ? 'bg-[#72B043]/10 border-[#72B043]/40 text-[#72B043] dark:text-[#72B043] font-extrabold' 
                                                : 'bg-white/80 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.05] border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                                        }`}
                                    >
                                        <span className="h-2 w-2 rounded-full bg-[#72B043] animate-pulse" />
                                        1. Finanzas Móviles
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setMobileTab('qr');
                                            setMobileGuestName('Invitado Premium');
                                            generateGuestQr('Invitado Premium');
                                        }}
                                        className={`px-4 py-2.5 border text-xs font-bold rounded-xl flex items-center justify-center sm:justify-start gap-2 transition-all shadow ${
                                            mobileTab === 'qr' && mobileGeneratedQr
                                                ? 'bg-[#EC7A08]/10 border-[#EC7A08]/40 text-[#EC7A08] dark:text-[#EC7A08] font-extrabold' 
                                                : 'bg-white/80 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.05] border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                                        }`}
                                    >
                                        <span className="h-2 w-2 rounded-full bg-[#EC7A08] animate-pulse" />
                                        2. Invitación QR
                                    </button>
                                    <button 
                                        onClick={() => {
                                            setMobileTab('access');
                                            triggerIotApertura();
                                        }}
                                        className={`px-4 py-2.5 border text-xs font-bold rounded-xl flex items-center justify-center sm:justify-start gap-2 transition-all shadow ${
                                            mobileTab === 'access' && (mobileFingerprintScanning || mobileFingerprintSuccess)
                                                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-extrabold' 
                                                : 'bg-white/80 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.05] border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                                        }`}
                                    >
                                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                        3. Apertura IoT (Biometría)
                                    </button>
                                    <button 
                                        onClick={simulatePushNotification}
                                        className="px-4 py-2.5 bg-white/80 dark:bg-white/[0.02] hover:bg-slate-100 dark:hover:bg-white/[0.05] border border-slate-200 dark:border-white/5 text-xs font-bold rounded-xl flex items-center justify-center sm:justify-start gap-2 text-slate-600 dark:text-slate-400 dark:hover:text-white hover:border-indigo-500/30 transition-all shadow"
                                    >
                                        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                                        4. Notificaciones Push
                                    </button>
                                    <button 
                                        onClick={() => setSimulatedMobileDarkMode(!simulatedMobileDarkMode)}
                                        className={`px-4 py-2.5 border text-xs font-bold rounded-xl flex items-center justify-center sm:justify-start gap-2 transition-all shadow ${
                                            simulatedMobileDarkMode 
                                                ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400 font-extrabold hover:bg-amber-500/20' 
                                                : 'bg-[#72B043]/10 border-[#72B043]/40 text-[#72B043] dark:text-[#72B043] font-extrabold hover:bg-[#72B043]/20'
                                        }`}
                                    >
                                        <span className="h-2 w-2 rounded-full bg-indigo-550 animate-pulse" />
                                        {simulatedMobileDarkMode ? "☀️ Claro Móvil" : "🌙 Oscuro Móvil"}
                                    </button>
                                </div>
                            </div>
                        </div>
                        
                        {/* Right column: Smartphone simulator */}
                        <div className="lg:col-span-5 flex justify-center">
                            {/* Android device shell frame */}
                            <div className="relative w-[310px] h-[610px] rounded-[42px] bg-slate-900 p-3 border-4 border-slate-800 shadow-2xl shadow-indigo-950/20 outline outline-1 outline-slate-800/40 shrink-0">
                                
                                {/* Camera punch hole notch */}
                                <div className="absolute top-5 left-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-slate-950 border border-slate-900 z-30 flex items-center justify-center">
                                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-950/80" />
                                </div>
                                
                                {/* Inner application screen */}
                                <div className={`w-full h-full rounded-[32px] overflow-hidden border relative flex flex-col z-10 font-sans select-none transition-colors duration-300 ${simulatedMobileDarkMode ? "bg-[#0B1A3E] border-[#132c66] text-slate-200" : "bg-[#F8FAFC] border-slate-200 text-slate-800"}`}>
                                    
                                    {/* Smartphone Status Bar */}
                                    <div className={`h-8 px-6 pt-2 flex items-center justify-between text-[10px] font-bold font-mono tracking-tight shrink-0 select-none z-20 transition-colors duration-300 ${simulatedMobileDarkMode ? "text-slate-400" : "text-slate-500"}`}>
                                        <span>16:40</span>
                                        <div className="flex items-center gap-1.5">
                                            {/* Signal icon */}
                                            <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 3c-1.2 0-2.4.3-3.5.7L20.2 15.5c.5-.7.8-1.5.8-2.5 0-5.5-4.5-10-10-10zm-9 9c0 1.2.3 2.4.7 3.5l11.8-11.8C14.4 3.3 13.2 3 12 3 6.5 3 2 7.5 2 12z" />
                                            </svg>
                                            {/* Wi-Fi icon */}
                                            <svg className="w-3.5 h-3.5 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15.75a4.5 4.5 0 016.75 0M4.5 12a9 9 0 0115 0m-18.75-3.75a13.5 13.5 0 0122.5 0M12 18.75h.008v.008H12v-.008z" />
                                            </svg>
                                            {/* Battery icon */}
                                            <div className="w-5 h-2.5 border border-slate-500 rounded-sm p-0.5 flex items-center">
                                                <div className="w-[85%] h-full bg-indigo-500 rounded-[1px]" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Float Toast / Push Notification Simulation inside Phone Screen */}
                                    {activeToast && (
                                        <div className={`absolute top-9 left-2.5 right-2.5 p-3 backdrop-blur-md border rounded-2xl shadow-lg z-30 flex items-start gap-2.5 animate-slide-down transition-all duration-300 ${simulatedMobileDarkMode ? "bg-slate-900/95 border-slate-800 shadow-black/50 text-slate-200" : "bg-white/95 border-slate-200 shadow-slate-200/50 text-slate-900"}`}>
                                            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a9.001 9.001 0 01-11.963-3.07 9.001 9.001 0 013.07-11.963c.48-.277 1.012-.456 1.56-.532a.75.75 0 01.815.58l.492 2.213a.75.75 0 01-.419.824l-1.077.538a6.502 6.502 0 003.003 3.003l.538-1.077a.75.75 0 01.824-.419l2.213.493a.75.75 0 01.58.815c-.076.548-.255 1.08-.532 1.56z" />
                                                </svg>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[10px] font-bold text-[#EC7A08] uppercase tracking-widest">Alerta MiVecino</p>
                                                <p className="text-[11px] font-bold text-indigo-300 mt-0.5 truncate">{activeToast.title}</p>
                                                <p className="text-[9px] text-slate-400 mt-0.5 leading-snug">{activeToast.desc}</p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Application Content screen */}
                                    <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
                                        
                                        {/* Dynamic content rendering based on active mobile tab */}
                                        {mobileTab === 'home' && (
                                            <div className="space-y-4">
                                                {/* Header Welcome inside phone */}
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <span className={`text-[9px] font-extrabold uppercase tracking-widest ${simulatedMobileDarkMode ? "text-slate-500" : "text-slate-400"}`}>Copropiedad Activa</span>
                                                        <h3 className={`text-sm font-black flex items-center gap-1.5 mt-0.5 ${simulatedMobileDarkMode ? "text-white" : "text-slate-900"}`}>
                                                    <span className="flex-1">Depto 202</span>
                                                    <button 
                                                        onClick={() => setSimulatedMobileDarkMode(!simulatedMobileDarkMode)}
                                                        className={`p-1 rounded-lg border text-[8px] flex items-center justify-center transition-all ${simulatedMobileDarkMode ? "bg-slate-900 border-slate-800 text-amber-400" : "bg-white border-slate-200 text-indigo-600 shadow-sm"}`}
                                                        title="Cambiar tema móvil"
                                                    >
                                                        {simulatedMobileDarkMode ? "☀️" : "🌙"}
                                                    </button>
                                                            Depto 202
                                                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                                        </h3>
                                                    </div>
                                                    <span className={`px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-[8px] font-mono rounded-md ${simulatedMobileDarkMode ? "text-indigo-400" : "text-indigo-600 font-bold"}`}>Propietario</span>
                                                </div>
                                                
                                                {/* Simulated common expense balance card */}
                                                <div className={`p-4 border rounded-2xl space-y-2 relative overflow-hidden transition-all duration-300 ${simulatedMobileDarkMode ? "bg-gradient-to-br from-indigo-500/10 to-violet-600/10 border-indigo-500/20" : "bg-gradient-to-br from-indigo-50/70 to-violet-50/70 border-indigo-200"}`}>
                                                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-xl" />
                                                    <span className={`text-[9px] font-extrabold uppercase tracking-widest block ${simulatedMobileDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>Gasto Común Mayo</span>
                                                    <div className="flex items-baseline gap-1">
                                                        <span className={`text-xl font-black ${simulatedMobileDarkMode ? "text-white" : "text-slate-900"}`}>$165.000</span>
                                                        <span className="text-[9px] text-slate-400">CLP</span>
                                                    </div>
                                                    <div className={`flex items-center justify-between pt-1 border-t text-[9px] ${simulatedMobileDarkMode ? "border-indigo-500/10 text-slate-500" : "border-indigo-200 text-slate-600"}`}>
                                                        <span className="text-slate-500">Vencimiento: 05 Jun</span>
                                                        <span className={`px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 font-bold rounded ${simulatedMobileDarkMode ? "text-amber-400" : "text-amber-600"}`}>PENDIENTE</span>
                                                    </div>
                                                </div>
                                                
                                                {/* Quick Android IoT actions */}
                                                <div className="space-y-2">
                                                    <span className={`text-[9px] font-extrabold uppercase tracking-widest block ${simulatedMobileDarkMode ? "text-slate-500" : "text-slate-600"}`}>Accesos Rápidos IoT</span>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <button 
                                                            onClick={() => setMobileTab('access')}
                                                            className={`p-3 border rounded-xl text-left transition-all ${simulatedMobileDarkMode ? "bg-slate-900 border-slate-800 hover:border-indigo-500/30 text-slate-400" : "bg-white border-slate-200 text-slate-600 hover:border-indigo-600/30 shadow-sm"}`}
                                                        >
                                                            <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                                                            </svg>
                                                            <span className={`text-[10px] font-bold block mt-2 ${simulatedMobileDarkMode ? "text-slate-200" : "text-slate-900"}`}>Abrir Portón</span>
                                                            <span className="text-[8px] text-slate-500 block mt-0.5">Control vehicular</span>
                                                        </button>
                                                        <button 
                                                            onClick={() => setMobileTab('qr')}
                                                            className={`p-3 border rounded-xl text-left transition-all ${simulatedMobileDarkMode ? "bg-slate-900 border-slate-800 hover:border-indigo-500/30 text-slate-400" : "bg-white border-slate-200 text-slate-600 hover:border-indigo-600/30 shadow-sm"}`}
                                                        >
                                                            <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                                                            </svg>
                                                            <span className={`text-[10px] font-bold block mt-2 ${simulatedMobileDarkMode ? "text-slate-200" : "text-slate-900"}`}>Visitas QR</span>
                                                            <span className="text-[8px] text-slate-500 block mt-0.5">Generar credencial</span>
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                {/* Mini Logs stream inside dashboard */}
                                                <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl font-mono text-[8px] text-slate-500 space-y-1">
                                                    <span className="text-[7px] font-extrabold uppercase tracking-widest text-slate-500 font-sans block mb-1">Actividad del Teléfono</span>
                                                    {mobileLogs.slice(-3).map((log, i) => (
                                                        <div key={i} className="truncate">{log}</div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Tab: Access gates (IoT) */}
                                        {mobileTab === 'access' && (
                                            <div className="space-y-4 flex flex-col h-full justify-between pb-2">
                                                <div className="space-y-1.5 text-center">
                                                    <span className={`text-[9px] font-extrabold uppercase tracking-widest ${simulatedMobileDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>NFC & IoT Integrado</span>
                                                    <h3 className={`text-xs font-bold uppercase tracking-wider ${simulatedMobileDarkMode ? "text-white" : "text-slate-900"}`}>Apertura de Portón</h3>
                                                    <p className="text-[9px] text-slate-500 max-w-[200px] mx-auto">Coloca tu huella digital para activar la antena del acceso vehicular por API.</p>
                                                </div>
                                                
                                                {/* Fingerprint animated button */}
                                                <div className="flex flex-col items-center justify-center py-6">
                                                    <button 
                                                        onClick={triggerIotApertura}
                                                        className={`relative h-28 w-28 rounded-full flex items-center justify-center border transition-all duration-300 outline-none ${
                                                            mobileFingerprintSuccess 
                                                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/10 scale-105' 
                                                                : mobileFingerprintScanning 
                                                                ? 'bg-indigo-500/5 border-indigo-500/50 text-indigo-400 animate-pulse' 
                                                                : (simulatedMobileDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:border-indigo-500/40 hover:text-indigo-400 shadow' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-600/40 hover:text-indigo-600 shadow-sm')
                                                        }`}
                                                    >
                                                        {mobileFingerprintScanning && (
                                                            <div className="absolute inset-2 border-2 border-indigo-500/20 rounded-full animate-ping" />
                                                        )}
                                                        <svg className={`w-12 h-12 transition-transform duration-300 ${mobileFingerprintScanning ? 'scale-90' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.05 4.575a1 1 0 011.6-.8l8 6a1 1 0 010 1.6l-8 6a1 1 0 01-1.6-.8V4.575z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.03V3.75m0 16.5v.75M3.34 16.126l.707-.707m15.906-.002l-.707.707M16.243 7.757l.707-.707M3.75 12h.75m15 0h.75m-15.906-4.243l.707.707" />
                                                        </svg>
                                                    </button>
                                                    
                                                    {/* Scanning text */}
                                                    <span className={`text-[9px] font-bold mt-4 uppercase tracking-widest ${
                                                        mobileFingerprintSuccess 
                                                            ? 'text-emerald-500 animate-pulse' 
                                                            : mobileFingerprintScanning 
                                                            ? (simulatedMobileDarkMode ? 'text-indigo-400' : 'text-indigo-600') 
                                                            : 'text-slate-500'
                                                    }`}>
                                                        {mobileFingerprintSuccess 
                                                            ? '¡ACCESO CONCEDIDO!' 
                                                            : mobileFingerprintScanning 
                                                            ? 'ESCANEANDO...' 
                                                            : 'Presiona para Abrir'}
                                                    </span>
                                                </div>
                                                
                                                {/* Mini notification banner for Success */}
                                                <div className={`p-2.5 rounded-xl border text-[8px] text-center font-bold tracking-tight transition-all duration-300 ${
                                                    mobileFingerprintSuccess 
                                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 opacity-100 translate-y-0' 
                                                        : 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-80 translate-y-1'
                                                }`}>
                                                    {mobileFingerprintSuccess 
                                                        ? 'Portón Principal Abierto. Se cerrará en 15s.' 
                                                        : 'Enlace cifrado AES-256 local activo'}
                                                </div>
                                            </div>
                                        )}
                                        
                                        {/* Tab: Visitor QR code generator */}
                                        {mobileTab === 'qr' && (
                                            <div className="space-y-4">
                                                <div className="space-y-1 text-center">
                                                    <span className={`text-[9px] font-extrabold uppercase tracking-widest ${simulatedMobileDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>Invitaciones Express</span>
                                                    <h3 className={`text-xs font-bold uppercase tracking-wider ${simulatedMobileDarkMode ? "text-white" : "text-slate-900"}`}>Generador de QR</h3>
                                                </div>
                                                
                                                {!mobileGeneratedQr ? (
                                                    <div className="space-y-3 pt-2">
                                                        <div className="space-y-1">
                                                            <label className="text-[8px] text-slate-500 font-extrabold uppercase tracking-widest">Nombre del Invitado</label>
                                                            <input 
                                                                type="text" 
                                                                placeholder="Ej: Juan Pérez"
                                                                value={mobileGuestName}
                                                                onChange={(e) => setMobileGuestName(e.target.value)}
                                                                className={`w-full px-3 py-2 rounded-xl text-[10px] focus:outline-none focus:border-indigo-500/50 transition-colors ${simulatedMobileDarkMode ? "bg-slate-900 border-slate-800 text-white placeholder-slate-600" : "bg-white border-slate-200 text-slate-900 placeholder-slate-400"}`}
                                                            />
                                                        </div>
                                                        
                                                        {/* Presets */}
                                                        <div className="space-y-1">
                                                            <span className="text-[8px] text-slate-500 font-extrabold uppercase tracking-widest block">Sugeridos</span>
                                                            <div className="flex gap-1.5">
                                                                {['Mamá', 'Uber', 'Delivery'].map(p => (
                                                                    <button 
                                                                        key={p}
                                                                        onClick={() => setMobileGuestName(p)}
                                                                        className="px-2 py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 text-[8px] rounded-lg text-slate-400 hover:text-slate-200 transition-colors"
                                                                    >
                                                                        {p}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        
                                                        <button 
                                                            onClick={() => generateGuestQr(mobileGuestName)}
                                                            disabled={!mobileGuestName.trim()}
                                                            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white text-[10px] font-bold rounded-xl shadow transition-colors"
                                                        >
                                                            Generar Código QR
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3 flex flex-col items-center justify-center pt-1 animate-scale-up">
                                                        {/* Simulated QR graphic code */}
                                                        <div className="p-3 bg-white rounded-2xl shadow-lg shadow-black/40">
                                                            <svg className="w-24 h-24 text-slate-950" viewBox="0 0 100 100" fill="currentColor">
                                                                <path d="M5,5 h30 v30 h-30 z M15,15 h10 v10 h-10 z" />
                                                                <path d="M65,5 h30 v30 h-30 z M75,15 h10 v10 h-10 z" />
                                                                <path d="M5,65 h30 v30 h-30 z M15,75 h10 v10 h-10 z" />
                                                                <path d="M45,10 h10 v10 h-10 z M50,30 h10 v10 h-10 z M40,50 h20 v10 h-20 z M45,70 h15 v5 h-15 z M75,45 h10 v15 h-10 z M80,75 h15 v15 h-15 z" />
                                                                <circle cx="50" cy="50" r="8" className="text-indigo-600" />
                                                            </svg>
                                                        </div>
                                                        
                                                        <div className="text-center">
                                                            <span className={`text-[10px] font-bold block ${simulatedMobileDarkMode ? "text-slate-200" : "text-slate-900"}`}>Pase de {mobileGuestName}</span>
                                                            <span className="text-[7px] text-slate-500 block uppercase tracking-widest mt-0.5">Expira mañana, 16:44</span>
                                                        </div>
                                                        
                                                        <div className="grid grid-cols-2 gap-1.5 w-full text-center pt-1">
                                                            <button 
                                                                onClick={() => {
                                                                    setMobileGeneratedQr(false);
                                                                    setMobileGuestName('');
                                                                }}
                                                                className={`py-1.5 border rounded-lg text-[8px] font-bold transition-colors ${simulatedMobileDarkMode ? "bg-slate-900 border-slate-800 text-slate-400 hover:text-white" : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-sm"}`}
                                                            >
                                                                Generar Otro
                                                            </button>
                                                            <button 
                                                                onClick={() => alert(`Pase temporal copiado para compartir por WhatsApp.`)}
                                                                className="py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[8px] font-bold transition-colors"
                                                            >
                                                                Compartir Pase
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        
                                        {/* Tab: Push notifications Hub */}
                                        {mobileTab === 'notices' && (
                                            <div className="space-y-3">
                                                <div className="space-y-1 text-center">
                                                    <span className={`text-[9px] font-extrabold uppercase tracking-widest ${simulatedMobileDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>Alertas del Condominio</span>
                                                    <h3 className={`text-xs font-bold uppercase tracking-wider ${simulatedMobileDarkMode ? "text-white" : "text-slate-900"}`}>Centro de Notificaciones</h3>
                                                </div>
                                                
                                                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                                                    {mobileNotifications.map(n => (
                                                        <div 
                                                            key={n.id} 
                                                            className={`p-3 border rounded-xl space-y-1 relative transition-all ${
                                                                n.read 
                                                                    ? (simulatedMobileDarkMode ? 'bg-slate-900/40 border-slate-900 text-slate-400' : 'bg-slate-100/50 border-slate-200 text-slate-500') 
                                                                    : (simulatedMobileDarkMode ? 'bg-slate-900 border-slate-800/80 text-slate-200' : 'bg-white border-slate-200 text-slate-800 shadow-sm')
                                                            }`}
                                                        >
                                                            {!n.read && (
                                                                <span className={`absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse border ${simulatedMobileDarkMode ? "border-slate-950" : "border-white"}`} />
                                                            )}
                                                            <div className="flex items-center justify-between text-[8px] font-extrabold uppercase tracking-widest text-slate-500">
                                                                <span>{n.title}</span>
                                                                <span>{n.time}</span>
                                                            </div>
                                                            <p className={`text-[9px] leading-snug font-medium ${simulatedMobileDarkMode ? "text-slate-400" : "text-slate-600"}`}>{n.desc}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Smartphone Bottom Navigation Bar */}
                                    <div className="h-14 bg-slate-900 border-t border-slate-800 flex items-center justify-around text-slate-500 shrink-0 z-20">
                                        <button 
                                            onClick={() => setMobileTab('home')}
                                            className={`flex flex-col items-center justify-center w-12 h-full transition-colors ${mobileTab === 'home' ? (simulatedMobileDarkMode ? 'text-indigo-400' : 'text-indigo-600 font-extrabold') : (simulatedMobileDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-700')}`}
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                                            </svg>
                                            <span className="text-[8px] font-bold mt-0.5 font-sans">Home</span>
                                        </button>
                                        
                                        <button 
                                            onClick={() => {
                                                setMobileTab('access');
                                                triggerIotApertura();
                                            }}
                                            className={`flex flex-col items-center justify-center w-12 h-full transition-colors ${mobileTab === 'access' ? (simulatedMobileDarkMode ? 'text-indigo-400' : 'text-indigo-600 font-extrabold') : (simulatedMobileDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-700')}`}
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                                            </svg>
                                            <span className="text-[8px] font-bold mt-0.5 font-sans">NFC IoT</span>
                                        </button>
                                        
                                        <button 
                                            onClick={() => setMobileTab('qr')}
                                            className={`flex flex-col items-center justify-center w-12 h-full transition-colors ${mobileTab === 'qr' ? (simulatedMobileDarkMode ? 'text-indigo-400' : 'text-indigo-600 font-extrabold') : (simulatedMobileDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-700')}`}
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                                            </svg>
                                            <span className="text-[8px] font-bold mt-0.5 font-sans">Visitas</span>
                                        </button>
                                        
                                        <button 
                                            onClick={() => setMobileTab('notices')}
                                            className={`flex flex-col items-center justify-center w-12 h-full transition-colors relative ${mobileTab === 'notices' ? (simulatedMobileDarkMode ? 'text-indigo-400' : 'text-indigo-600 font-extrabold') : (simulatedMobileDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-700')}`}
                                        >
                                            {mobileNotifications.some(n => !n.read) && (
                                                <span className="absolute top-2.5 right-3 h-2 w-2 bg-indigo-500 rounded-full border border-slate-900" />
                                            )}
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a9.001 9.001 0 01-11.963-3.07 9.001 9.001 0 013.07-11.963c.48-.277 1.012-.456 1.56-.532a.75.75 0 01.815.58l.492 2.213a.75.75 0 01-.419.824l-1.077.538a6.502 6.502 0 003.003 3.003l.538-1.077a.75.75 0 01.824-.419l2.213.493a.75.75 0 01.58.815c-.076.548-.255 1.08-.532 1.56z" />
                                            </svg>
                                            <span className="text-[8px] font-bold mt-0.5 font-sans">Alertas</span>
                                        </button>
                                    </div>
                                    
                                    {/* Smartphone Bottom Home Bar */}
                                    <div className={`h-4 flex items-center justify-center shrink-0 transition-colors duration-300 ${simulatedMobileDarkMode ? "bg-slate-900" : "bg-white"}`}>
                                        <div className={`w-24 h-1 rounded-full ${simulatedMobileDarkMode ? "bg-slate-700" : "bg-slate-300"}`} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </section>

            {/* Brand Assets and Strategy Gallery Section */}
            <section id="branding-gallery" className="py-24 border-t border-slate-200/50 dark:border-white/5 bg-transparent relative transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-xs font-bold text-[#00A896] uppercase tracking-widest block mb-2">Identidad Visual y Planificación</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Manual de Marca y Hojas de Ruta
                        </h2>
                        <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg">
                            Garantizamos la fidelidad absoluta de nuestra suite. Conoce los recursos de diseño, flujos estratégicos y planificación técnica oficial de **MiVecino** y **RedVecino**.
                        </p>
                    </div>

                    {/* Image Cards Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {brandAssets.map((asset) => (
                            <div 
                                key={asset.id}
                                className="bg-white/80 dark:bg-white/[0.02] dark:backdrop-blur-md border border-slate-200/50 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#00A896]/30 dark:hover:border-[#00A896]/30 hover:scale-[1.01] transition-all group flex flex-col justify-between"
                            >
                                <div>
                                    <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-950 flex items-center justify-center">
                                        <img 
                                            src={asset.image} 
                                            alt={asset.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            onError={(e) => {
                                                // Fallback if image path is not resolved properly in browser
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                            <button 
                                                onClick={() => setSelectedImage(asset)}
                                                className="p-3 bg-white text-slate-900 rounded-full font-bold text-xs shadow-lg flex items-center gap-1.5 hover:scale-105 transition-transform"
                                            >
                                                <svg className="w-4 h-4 text-[#00A896]" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.637 10.637z" />
                                                </svg>
                                                Ampliar Vista
                                            </button>
                                        </div>
                                        <div className="hidden absolute inset-0 flex-col items-center justify-center p-4 bg-slate-950 text-slate-400 font-mono text-[10px]">
                                            <span>[Imagen: {asset.title}]</span>
                                            <span className="text-[8px] text-slate-600 mt-1">Carga local public/images</span>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-3">
                                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-[#00A896]/10 text-[#00A896] dark:bg-[#00A896]/20 dark:text-[#00A896]">
                                            {asset.tag}
                                        </span>
                                        <h3 className="text-base font-extrabold text-slate-900 dark:text-white transition-colors">{asset.title}</h3>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed transition-colors">{asset.desc}</p>
                                    </div>
                                </div>
                                <div className="px-6 pb-6 pt-2">
                                    <button 
                                        onClick={() => setSelectedImage(asset)}
                                        className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-white/[0.03] dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-355 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                                    >
                                        <svg className="w-4 h-4 text-[#00A896]" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.644L3.098 10.98a10.002 10.002 0 0117.804 0l1.062 1.258a1.012 1.012 0 010 .644l-1.062 1.258a10.002 10.002 0 01-17.804 0l-1.062-1.258z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Inspeccionar Plano
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lightbox Modal */}
                {selectedImage && (
                    <div 
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm transition-opacity duration-300"
                        onClick={() => setSelectedImage(null)}
                    >
                        <div 
                            className="relative max-w-5xl w-full max-h-[90vh] overflow-y-auto bg-[#0F2557] border border-white/10 rounded-3xl shadow-2xl animate-scale-up"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close button */}
                            <button 
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 z-50 p-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-white/10 text-white transition-all shadow"
                                title="Cerrar modal"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {/* Inner Layout */}
                            <div className="grid lg:grid-cols-12">
                                {/* Image display side */}
                                <div className="lg:col-span-8 bg-slate-950/40 border-r border-white/5 flex items-center justify-center p-6 aspect-[4/3] lg:aspect-auto">
                                    <img 
                                        src={selectedImage.image} 
                                        alt={selectedImage.title}
                                        className="max-h-[35vh] lg:max-h-[75vh] w-auto max-w-full object-contain rounded-xl shadow-lg border border-white/5"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                    <div className="hidden flex-col items-center justify-center p-8 text-slate-500 font-mono text-xs">
                                        <span>[Vista Detallada: {selectedImage.title}]</span>
                                        <span className="text-[9px] text-slate-650 mt-2">Ubicado en: {selectedImage.image}</span>
                                    </div>
                                </div>

                                {/* Text explanation side */}
                                <div className="lg:col-span-4 p-8 flex flex-col justify-between space-y-6 text-left">
                                    <div className="space-y-4">
                                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold bg-[#00A896]/20 text-cyan-300">
                                            {selectedImage.tag}
                                        </span>
                                        <h3 className="text-xl font-black text-white">{selectedImage.title}</h3>
                                        <p className="text-xs sm:text-sm text-slate-350 leading-relaxed">{selectedImage.desc}</p>
                                        
                                        <div className="pt-4 border-t border-white/5 space-y-3">
                                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">Especificaciones del Plano:</span>
                                            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-medium">
                                                <div className="bg-slate-950/60 p-2 rounded-lg border border-white/5">
                                                    <span className="block text-slate-500 font-bold">Formato</span>
                                                    <span className="text-slate-355 block mt-0.5">JPEG de Alta Def</span>
                                                </div>
                                                <div className="bg-slate-950/60 p-2 rounded-lg border border-white/5">
                                                    <span className="block text-slate-500 font-bold">Origen</span>
                                                    <span className="text-slate-355 block mt-0.5">Branding Board</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => setSelectedImage(null)}
                                        className="w-full py-3 bg-gradient-to-r from-[#00A896] to-[#72B043] text-white font-bold text-xs rounded-xl shadow-lg transition-transform hover:scale-[1.01]"
                                    >
                                        Aceptar y Volver
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Interactive Role Simulator Section */}
            <section id="simulator" className="py-24 border-t border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-[#0F2557]/20 backdrop-blur-md relative transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16 transition-colors duration-300">
                        <span className="text-xs font-bold text-[#00A896] uppercase tracking-widest block mb-2">Simulador en Tiempo Real</span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            6 Perfiles, un solo Condominio
                        </h2>
                        <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg">
                            Nuestra arquitectura implementa una matriz compleja de permisos Spatie RBAC. Haz clic en cada pestaña para experimentar exactamente cómo ve y opera la plataforma cada rol.
                        </p>
                    </div>

                    {/* Role selector tabs */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-10 bg-white/70 dark:bg-white/[0.02] dark:backdrop-blur-md p-2 rounded-2xl border border-slate-200/50 dark:border-white/5 max-w-4xl mx-auto shadow-sm">
                        {Object.keys(rolesInfo).map((roleKey) => (
                            <button
                                key={roleKey}
                                onClick={() => setActiveRole(roleKey)}
                                className={`flex-1 min-w-[120px] px-4 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                                    activeRole === roleKey
                                        ? 'bg-gradient-to-r from-[#0F2557] to-[#00A896] dark:from-[#00A896] dark:to-[#72B043] text-white shadow-md shadow-teal-500/10'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                                }`}
                            >
                                {roleKey.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {/* Simulation Console Screen */}
                    <div className="grid lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto z-10 relative">
                        
                        {/* Left Column: Role Details & Custom capabilities */}
                        <div className="lg:col-span-5 bg-white/80 dark:bg-white/[0.02] dark:backdrop-blur-xl border border-slate-200/50 dark:border-white/5 rounded-3xl p-8 flex flex-col justify-between shadow-xl shadow-slate-100/30 dark:shadow-none transition-all duration-300">
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="px-3 py-1 bg-[#00A896]/10 border border-[#00A896]/20 text-[#00A896] text-xs font-bold rounded-full uppercase tracking-wider">
                                        Rol: {activeRole}
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                                        {rolesInfo[activeRole].badge}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white transition-colors duration-300">{rolesInfo[activeRole].title}</h3>
                                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors duration-300">{rolesInfo[activeRole].desc}</p>
                                
                                <div className="mt-8 space-y-4">
                                    <h4 className="text-xs font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 dark:text-slate-400 transition-colors duration-300">Funciones Clave Habilitadas:</h4>
                                    <ul className="space-y-3">
                                        {rolesInfo[activeRole].capabilities.map((cap, i) => (
                                            <li key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 transition-colors duration-300">
                                                <svg className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>{cap}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 transition-colors duration-300">
                                <svg className="w-5 h-5 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                </svg>
                                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed transition-colors duration-300">
                                    Seguridad controlada vía Middleware de Laravel y políticas Spatie.
                                </span>
                            </div>
                        </div>
                                                    {/* Right Column: Visual Dashboard Simulator */}
                        <div className={`lg:col-span-7 backdrop-blur-xl border rounded-3xl p-6 shadow-xl relative flex flex-col justify-between min-h-[480px] transition-all duration-300 ${
                            simulatedDarkMode 
                                ? 'bg-[#0F2557]/40 border-teal-500/15 text-slate-100 shadow-[0_0_30px_rgba(0,168,150,0.05)]' 
                                : 'bg-white/90 border-slate-200/60 text-slate-900 shadow-slate-100/30'
                        }`}>
                            
                            {/* Visual Simulator Screen */}
                            <div className="flex-1">
                                <div className={`flex items-center justify-between pb-3 border-b mb-6 transition-colors duration-300 ${
                                    simulatedDarkMode ? 'border-white/5' : 'border-slate-200/65'
                                }`}>
                                    <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors duration-300 ${
                                        simulatedDarkMode ? 'text-slate-400' : 'text-slate-600'
                                    }`}>
                                        <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                                        Pantalla Interactiva en Vivo
                                    </span>
                                    
                                    {/* Simulated Web App theme switcher */}
                                    <button
                                        onClick={() => setSimulatedDarkMode(!simulatedDarkMode)}
                                        className={`px-2.5 py-1.5 border rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                                            simulatedDarkMode 
                                                ? 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700' 
                                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-slate-300'
                                        }`}
                                    >
                                        {simulatedDarkMode ? (
                                            <>
                                                <span className="text-amber-400">☀️</span> Claro
                                            </>
                                        ) : (
                                            <>
                                                <span className="text-indigo-600">🌙</span> Oscuro
                                            </>
                                        )}
                                    </button>
                                </div>

                                {/* ADMIN SIMULATOR UI */}
                                {activeRole === 'admin' && (
                                    <div className="space-y-6">
                                        <div className={`flex items-center justify-between p-4 rounded-2xl border transition-colors duration-300 ${
                                            simulatedDarkMode 
                                                ? 'bg-slate-950 border-slate-800/80 text-white' 
                                                : 'bg-slate-50 border-slate-200/80 text-slate-900'
                                        }`}>
                                            <div>
                                                <span className={`text-xs font-semibold block ${simulatedDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>Gastos del Período</span>
                                                <span className="text-base font-extrabold">Mayo 2026</span>
                                            </div>
                                            <button 
                                                onClick={() => {
                                                    alert('Ejecutado: Los gastos comunes se han generado para las 50 unidades y notificado por correo.');
                                                }}
                                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                                            >
                                                Emitir Gastos Comunes
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            <span className={`text-xs font-bold uppercase tracking-wider block transition-colors duration-300 ${
                                                simulatedDarkMode ? 'text-slate-400' : 'text-slate-600'
                                            }`}>Acciones Rápidas del Administrador</span>
                                            <div className="grid grid-cols-2 gap-3">
                                                {[
                                                    { title: 'Crear Propiedad', desc: 'Torres, parcelas, bodegas', action: 'Formulario desplegado para registrar una nueva propiedad en Condominio A' },
                                                    { title: 'Asignar Ticket', desc: 'Asignar a técnicos', action: 'Abriendo bandeja de asignaciones de tickets de mantenimiento' },
                                                    { title: 'Aplicar Multa', desc: 'Fines a unidades', action: 'Formulario para aplicar multas reglamentarias' },
                                                    { title: 'Publicar Circular', desc: 'Muro de avisos', action: 'Abriendo cargador de comunicados generales' }
                                                ].map((act, i) => (
                                                    <button 
                                                        key={i}
                                                        onClick={() => alert(act.action)} 
                                                        className={`p-3 text-left text-xs rounded-xl border transition-all shadow-sm ${
                                                            simulatedDarkMode 
                                                                ? 'bg-slate-950 hover:bg-slate-900 border-slate-800 text-white hover:border-indigo-500/30' 
                                                                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-900 hover:border-indigo-600/35'
                                                        }`}
                                                    >
                                                        <span className="font-bold block">{act.title}</span>
                                                        <span className={`text-[10px] block mt-0.5 ${simulatedDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{act.desc}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* OWNER SIMULATOR UI */}
                                {activeRole === 'owner' && (
                                    <div className="space-y-6">
                                        <div className={`p-5 rounded-2xl border flex justify-between items-center transition-colors duration-300 ${
                                            simulatedDarkMode 
                                                ? 'bg-slate-950 border-slate-800/85 text-white' 
                                                : 'bg-slate-50 border-slate-200/85 text-slate-900'
                                        }`}>
                                            <div>
                                                <span className={`text-xs font-semibold block ${simulatedDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Dpto 402 - Torre A</span>
                                                <span className="text-lg font-extrabold mt-1 block">
                                                    Mayo 2026: <span className="` + (simulatedDarkMode ? 'text-indigo-400' : 'text-indigo-600') + ` font-extrabold`">{formatCurrency(45000)}</span>
                                                </span>
                                                <span className={`text-[10px] block mt-1 ${simulatedDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Vence el 05 de Junio, 2026</span>
                                            </div>
                                            <div>
                                                {ownerIsPaid ? (
                                                    <div className="flex flex-col items-end gap-1.5">
                                                        <span className={`px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold rounded-full uppercase tracking-wider ${simulatedDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>
                                                            Pagado
                                                        </span>
                                                        <button onClick={handleResetPayment} className={`text-[10px] hover:underline font-bold ${simulatedDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>
                                                            Resetear simulación
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={handlePayClick}
                                                        disabled={showPaymentSuccess}
                                                        className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/10 transition-all flex items-center gap-2"
                                                    >
                                                        {showPaymentSuccess ? 'Procesando...' : 'Pagar en Línea'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {showPaymentSuccess && (
                                            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 animate-pulse">
                                                <div className={`h-6 w-6 bg-emerald-500/15 flex items-center justify-center rounded-full text-xs font-bold ${simulatedDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>&bull;</div>
                                                <span className={`text-xs font-bold ${simulatedDarkMode ? "text-emerald-400" : "text-emerald-600"}`}>Validando transacción con pasarela bancaria...</span>
                                            </div>
                                        )}

                                        <div className={`border rounded-2xl p-4 shadow-sm transition-colors duration-300 ${
                                            simulatedDarkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200'
                                        }`}>
                                            <div className="flex items-center justify-between mb-3">
                                                <span className={`text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                                                    simulatedDarkMode ? 'text-slate-400' : 'text-slate-600'
                                                }`}>Tus Solicitudes de Soporte</span>
                                                <button onClick={() => alert('Creando ticket de mantenimiento en Dpto 402')} className={`text-xs font-bold hover:underline ${simulatedDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>Crear Ticket</button>
                                            </div>
                                            <div className="space-y-2">
                                                <div className={`flex items-center justify-between p-2.5 rounded-xl border text-xs transition-colors duration-300 ${
                                                    simulatedDarkMode 
                                                        ? 'bg-slate-950 border-slate-800 text-slate-200' 
                                                        : 'bg-slate-50 border-slate-200 text-slate-800'
                                                }`}>
                                                    <span className="font-semibold">#987 Filtración en baño principal</span>
                                                    <span className={`px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold rounded ${simulatedDarkMode ? "text-amber-400" : "text-amber-600"}`}>
                                                        En Progreso
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* RESIDENT SIMULATOR UI */}
                                {activeRole === 'resident' && (
                                    <div className="space-y-5">
                                        <div className={`border rounded-2xl p-4 shadow-sm transition-colors duration-300 ${
                                            simulatedDarkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200'
                                        }`}>
                                            <span className={`text-xs font-bold uppercase tracking-wider block mb-3 transition-colors duration-300 ${
                                                simulatedDarkMode ? 'text-slate-400' : 'text-slate-600'
                                            }`}>Pizarrón Mural Digital</span>
                                            
                                            <div className={`p-4 rounded-xl border space-y-2 transition-colors duration-300 ${
                                                simulatedDarkMode ? 'bg-slate-950 border-slate-900' : 'bg-slate-50 border-slate-200'
                                            }`}>
                                                <div className="flex items-center justify-between">
                                                    <span className={`px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 text-[9px] font-bold rounded uppercase ${simulatedDarkMode ? "text-rose-400" : "text-rose-600"}`}>Urgente</span>
                                                    <span className={`text-[10px] ${simulatedDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Publicado Hoy 14:32</span>
                                                </div>
                                                <h4 className="text-sm font-bold">Mantenimiento Ascensor B</h4>
                                                <p className={`text-xs leading-relaxed transition-colors duration-300 ${
                                                    simulatedDarkMode ? 'text-slate-400' : 'text-slate-600'
                                                }`}>
                                                    Se suspenderá el servicio del ascensor B de la Torre 1 por mantenimiento técnico este Jueves de 10:00 a 14:00 horas. Planifique sus traslados.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 text-center">
                                            <button onClick={() => alert('Abriendo creador de incidencias comunes')} className={`p-4 border rounded-2xl transition-all shadow-sm ${
                                                simulatedDarkMode 
                                                    ? 'bg-slate-950 hover:bg-slate-900 border-slate-800 hover:border-indigo-500/30' 
                                                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-indigo-600/30 shadow-sm'
                                            }`}>
                                                <svg className="w-6 h-6 text-indigo-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="text-xs font-bold block">Reportar Avería Común</span>
                                            </button>
                                            <button onClick={() => alert('Abriendo mensajería interna con conserjería')} className={`p-4 border rounded-2xl transition-all shadow-sm ${
                                                simulatedDarkMode 
                                                    ? 'bg-slate-950 hover:bg-slate-900 border-slate-800 hover:border-indigo-500/30' 
                                                    : 'bg-white hover:bg-slate-50 border-slate-200 hover:border-indigo-600/30 shadow-sm'
                                            }`}>
                                                <svg className="w-6 h-6 text-indigo-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                                                </svg>
                                                <span className="text-xs font-bold block">Enviar Mensaje</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* COMMITTEE SIMULATOR UI */}
                                {activeRole === 'committee' && (
                                    <div className="space-y-5">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className={`p-4 rounded-xl border transition-colors duration-300 ${
                                                simulatedDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                                            }`}>
                                                <span className={`text-[10px] font-semibold block uppercase ${simulatedDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Caja Chica del Condominio</span>
                                                <span className="text-lg font-bold block mt-1">{formatCurrency(4230000)}</span>
                                            </div>
                                            <div className={`p-4 rounded-xl border transition-colors duration-300 ${
                                                simulatedDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                                            }`}>
                                                <span className={`text-[10px] font-semibold block uppercase ${simulatedDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Pendientes de Aprobación</span>
                                                <span className="text-lg font-bold block mt-1 text-indigo-500">2 Presupuestos</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <span className={`text-xs font-bold uppercase tracking-wider block transition-colors duration-300 ${
                                                simulatedDarkMode ? 'text-slate-400' : 'text-slate-600'
                                            }`}>Auditoría y Aprobación de Egresos</span>
                                            
                                            <div className="space-y-2">
                                                {[
                                                    { id: 1, title: 'Seguridad Adicional CCTV', desc: '$1,200,000 CLP &bull; Egreso Extra' },
                                                    { id: 2, title: 'Reparación Bomba Hidráulica', desc: '$350,000 CLP &bull; Mantenimiento' }
                                                ].map(item => (
                                                    <div 
                                                        key={item.id} 
                                                        className={`border p-3 rounded-xl flex items-center justify-between text-xs shadow-sm transition-colors duration-300 ${
                                                            simulatedDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                                                        }`}
                                                    >
                                                        <div>
                                                            <span className="font-bold block">{item.title}</span>
                                                            <span className={`text-[10px] block mt-0.5 ${simulatedDarkMode ? 'text-slate-500' : 'text-slate-400'}`} dangerouslySetInnerHTML={{ __html: item.desc }} />
                                                        </div>
                                                        <div>
                                                            {approvedExpenses[item.id] ? (
                                                                <span className="text-emerald-500 font-bold text-xs uppercase flex items-center gap-1">
                                                                    &bull; Aprobado
                                                                </span>
                                                            ) : (
                                                                <button 
                                                                    onClick={() => handleApproveExpense(item.id)}
                                                                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors"
                                                                >
                                                                    Aprobar
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* EMPLOYEE SIMULATOR UI */}
                                {activeRole === 'employee' && (
                                    <div className="space-y-5">
                                        <div className={`p-4 rounded-xl border transition-colors duration-300 ${
                                            simulatedDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                                        }`}>
                                            <div>
                                                <span className={`text-[10px] font-semibold block uppercase ${simulatedDarkMode ? 'text-slate-600 dark:text-slate-400' : 'text-slate-400'}`}>Operario Asignado</span>
                                                <span className="text-sm font-extrabold block mt-0.5">Juan Pérez (Mantención)</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <span className={`text-xs font-bold uppercase tracking-wider block transition-colors duration-300 ${
                                                simulatedDarkMode ? 'text-slate-400' : 'text-slate-600'
                                            }`}>Bandeja de Incidentes Asignados</span>
                                            
                                            <div className="space-y-3">
                                                {tickets.map(ticket => (
                                                    <div 
                                                        key={ticket.id} 
                                                        className={`border p-4 rounded-2xl flex flex-col justify-between gap-3 sm:flex-row sm:items-center shadow-sm transition-colors duration-300 ${
                                                            simulatedDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                                                        }`}
                                                    >
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] text-slate-500 font-mono">#{ticket.id}</span>
                                                                <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${
                                                                    ticket.priority === 'urgent' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                                                }`}>
                                                                    {ticket.priority.toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <span className="text-xs font-bold block mt-1">{ticket.title}</span>
                                                        </div>
                                                        <div>
                                                            {ticket.status === 'resolved' ? (
                                                                <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl block text-center">
                                                                    &bull; Resuelto
                                                                </span>
                                                            ) : ticket.status === 'in_progress' ? (
                                                                <button 
                                                                    onClick={() => handleTicketStatusChange(ticket.id, 'resolved')}
                                                                    className="w-full sm:w-auto px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
                                                                >
                                                                    Finalizar
                                                                </button>
                                                            ) : (
                                                                <button 
                                                                    onClick={() => handleTicketStatusChange(ticket.id, 'in_progress')}
                                                                    className="w-full sm:w-auto px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition-colors"
                                                                >
                                                                    Comenzar
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* TI SIMULATOR UI */}
                                {activeRole === 'ti' && (
                                    <div className="space-y-4">
                                        <div className={`rounded-2xl p-4 border font-mono text-xs shadow-inner max-h-[220px] overflow-y-auto space-y-1.5 transition-colors duration-300 ${
                                            simulatedDarkMode 
                                                ? 'bg-slate-950 border-slate-800 text-indigo-400' 
                                                : 'bg-slate-900 border-slate-800 text-indigo-300'
                                        }`}>
                                            <div className="flex justify-between items-center text-slate-500 text-[10px] border-b border-slate-800 pb-2 mb-2">
                                                <span>SYS_LOG_AUDIT</span>
                                                <span className="text-indigo-400 animate-pulse">● LIVE LOGGING</span>
                                            </div>
                                            {terminalLogs.map((log, i) => (
                                                <div key={i} className="whitespace-pre-wrap leading-relaxed">
                                                    {log}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono font-bold">
                                            {[
                                                { label: 'Clear Cache', cmd: 'php artisan config:cache - Config cached successfully.' },
                                                { label: 'Run Seeders', cmd: 'php artisan migrate --force - Seeders and factories up to date.' },
                                                { label: 'Reset RBAC', cmd: 'php artisan permission:cache-reset - RBAC flushing completed.' }
                                            ].map((btn, i) => (
                                                <button 
                                                    key={i}
                                                    onClick={() => {
                                                        setTerminalLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] [CMD] ${btn.cmd}`]);
                                                    }}
                                                    className={`p-2 border rounded-lg transition-all ${
                                                        simulatedDarkMode 
                                                            ? 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700' 
                                                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 shadow-sm'
                                                    }`}
                                                >
                                                    {btn.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>

                            {/* Bottom Note */}
                            <div className={`mt-8 pt-4 border-t flex items-center justify-between text-xs transition-colors duration-300 ${
                                simulatedDarkMode ? 'border-white/5 text-slate-500' : 'border-slate-100 text-slate-500'
                            }`}>
                                <span>Sistema de simulación frontend reactivo</span>
                                <span className={`font-mono transition-colors duration-300 ${simulatedDarkMode ? 'text-teal-400' : 'text-[#00A896] font-bold'}`}>redvecino.cl</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

             {/* Core Modules Detailed Section */}
            <section id="modules" className="py-24 border-t border-slate-200/50 dark:border-white/5 bg-transparent relative transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <span className="text-xs font-bold text-[#72B043] uppercase tracking-widest block mb-2 transition-colors duration-300">Características del MVP</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors duration-300">
                            Gestión Integral Automatizada
                        </h2>
                        <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg transition-colors duration-300">
                            Diseñado específicamente para cubrir las necesidades operativas de copropiedades en Chile y Latinoamérica.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Financial Module Card */}
                        <div className="bg-white/75 dark:bg-white/[0.02] dark:backdrop-blur-md border border-slate-200/50 dark:border-white/5 p-8 rounded-3xl space-y-6 hover:border-[#00A896]/30 dark:hover:border-[#00A896]/30 hover:scale-[1.01] transition-all group shadow-sm dark:shadow-none">
                            <div className="h-14 w-14 rounded-2xl bg-[#00A896]/10 border border-[#00A896]/20 text-[#00A896] dark:text-[#00A896] flex items-center justify-center group-hover:bg-[#00A896] group-hover:text-white transition-all shadow-inner">
                                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white transition-colors duration-300">Módulo de Finanzas & Pagos</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors duration-300">
                                Controla la liquidez de tu comunidad. Gestión automatizada de cobro mensual de gastos comunes, estados de cuenta transparentes, multas e integración de comprobantes de pago.
                            </p>
                            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 dark:text-slate-500 transition-colors duration-300">
                                <li className="flex items-center gap-2">&bull; Emisión automática por prorrateo de copropiedad</li>
                                <li className="flex items-center gap-2">&bull; Registro de Cash, Transferencia bancaria, Tarjetas</li>
                                <li className="flex items-center gap-2">&bull; Descarga inmediata de estados de cuenta históricos</li>
                            </ul>
                        </div>

                        {/* Tickets Module Card */}
                        <div className="bg-white/75 dark:bg-white/[0.02] dark:backdrop-blur-md border border-slate-200/50 dark:border-white/5 p-8 rounded-3xl space-y-6 hover:border-[#72B043]/30 dark:hover:border-[#72B043]/30 hover:scale-[1.01] transition-all group shadow-sm dark:shadow-none">
                            <div className="h-14 w-14 rounded-2xl bg-[#72B043]/10 border border-[#72B043]/20 text-[#72B043] dark:text-[#72B043] flex items-center justify-center group-hover:bg-[#72B043] group-hover:text-white transition-all shadow-inner">
                                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.646 5.647a1.5 1.5 0 01-2.121-2.121l5.646-5.646m0 0l5.646-5.646m-5.646 5.646L16.5 3M12 21h9" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white transition-colors duration-300">Mantenimiento & Incidentes</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors duration-300">
                                Resuelve averías sin papeleo. Residentes reportan problemas agregando evidencia fotográfica. El administrador asigna y los técnicos completan la reparación registrando notas de solución.
                            </p>
                            <ul className="space-y-2 text-xs text-slate-550 dark:text-slate-500 transition-colors duration-300">
                                <li className="flex items-center gap-2">&bull; Categorías: Electricidad, Plomería, Seguridad y más</li>
                                <li className="flex items-center gap-2">&bull; 4 Niveles de prioridad (Baja, Media, Alta, Urgente)</li>
                                <li className="flex items-center gap-2">&bull; Subida de archivos y control de bitácora técnica</li>
                            </ul>
                        </div>

                        {/* Communication Module Card */}
                        <div className="bg-white/75 dark:bg-white/[0.02] dark:backdrop-blur-md border border-slate-200/50 dark:border-white/5 p-8 rounded-3xl space-y-6 hover:border-[#EC7A08]/30 dark:hover:border-[#EC7A08]/30 hover:scale-[1.01] transition-all group shadow-sm dark:shadow-none">
                            <div className="h-14 w-14 rounded-2xl bg-[#EC7A08]/10 border border-[#EC7A08]/20 text-[#EC7A08] dark:text-[#EC7A08] flex items-center justify-center group-hover:bg-[#EC7A08] group-hover:text-white transition-all shadow-inner">
                                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white transition-colors duration-300">Comunidad & Circulares</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed transition-colors duration-300">
                                Mantén a todos en la misma página. Panel de anuncios interactivo con soporte de prioridades y mensajería interna privada para solicitudes confidenciales hacia la administración.
                            </p>
                            <ul className="space-y-2 text-xs text-slate-550 dark:text-slate-500 transition-colors duration-300">
                                <li className="flex items-center gap-2">&bull; Mural digital en el dashboard inicial</li>
                                <li className="flex items-center gap-2">&bull; Mensajes cifrados internos Emisor-Receptor</li>
                                <li className="flex items-center gap-2">&bull; Avisos generales con expiración programada</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Common Expenses Calculator Widget */}
            <section id="calculator" className="py-24 border-t border-slate-200/50 dark:border-white/5 bg-white/40 dark:bg-[#0F2557]/20 backdrop-blur-md relative transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">
                        
                        {/* Left Column: Explanations */}
                        <div className="lg:col-span-5 space-y-6">
                            <span className="text-xs font-bold text-[#00A896] uppercase tracking-widest block">Simulador Financiero</span>
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors duration-300">
                                Transparencia Absoluta en el Cálculo de Gastos
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed transition-colors duration-300">
                                En los condominios tradicionales, los cobros carecen de claridad. En **RedVecino**, cada cobro se calcula de forma transparente dividiendo el presupuesto real del mes entre el número de unidades según su coeficiente.
                            </p>
                            <div className="p-5 bg-white/80 dark:bg-white/[0.02] dark:backdrop-blur-md border border-slate-200/50 dark:border-white/5 rounded-2xl flex items-start gap-4 shadow-sm transition-all duration-300">
                                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="text-xs">
                                    <span className="font-bold text-slate-900 dark:text-white block transition-colors duration-300">Fórmula Estándar de Alícuota</span>
                                    <span className="text-slate-500 block mt-1">`Costo Unitario = (Seguridad + Limpieza + Mantención + Servicios) / Total Unidades`</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Calculator Widget */}
                        <div className="lg:col-span-7 bg-white/80 dark:bg-[#0F2557]/40 dark:backdrop-blur-xl border border-slate-200/50 dark:border-white/5 p-6 sm:p-8 rounded-3xl shadow-xl dark:shadow-[0_0_30px_rgba(0,168,150,0.02)] space-y-6 transition-all duration-300">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-wider pb-3 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
                                Ajuste del Presupuesto Comunitario
                            </h3>

                            {/* Sliders Grid */}
                            <div className="space-y-5">
                                {/* Total Units Slider */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-slate-600 dark:text-slate-400">Total Unidades (Apartamentos)</span>
                                        <span className="font-extrabold text-slate-900 dark:text-white">{units} unidades</span>
                                    </div>
                                    <input 
                                        type="range" min="10" max="150" step="5" value={units}
                                        onChange={(e) => setUnits(parseInt(e.target.value))}
                                        className="w-full accent-[#00A896] bg-slate-200 dark:bg-[#0B1A3E] rounded-lg appearance-none h-2 cursor-pointer"
                                    />
                                </div>

                                {/* Security Slider */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-slate-600 dark:text-slate-400">Seguridad & Conserjes</span>
                                        <span className="font-extrabold text-slate-900 dark:text-white">{formatCurrency(securityBudget)}</span>
                                    </div>
                                    <input 
                                        type="range" min="200000" max="3000000" step="50000" value={securityBudget}
                                        onChange={(e) => setSecurityBudget(parseInt(e.target.value))}
                                        className="w-full accent-[#00A896] bg-slate-200 dark:bg-[#0B1A3E] rounded-lg appearance-none h-2 cursor-pointer"
                                    />
                                </div>

                                {/* Cleaning Slider */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-slate-600 dark:text-slate-400">Limpieza & Ornato</span>
                                        <span className="font-extrabold text-slate-900 dark:text-white">{formatCurrency(cleaningBudget)}</span>
                                    </div>
                                    <input 
                                        type="range" min="100000" max="1500000" step="50000" value={cleaningBudget}
                                        onChange={(e) => setCleaningBudget(parseInt(e.target.value))}
                                        className="w-full accent-[#00A896] bg-slate-200 dark:bg-[#0B1A3E] rounded-lg appearance-none h-2 cursor-pointer"
                                    />
                                </div>

                                {/* Maintenance Slider */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-slate-600 dark:text-slate-400">Mantenciones Técnicas</span>
                                        <span className="font-extrabold text-slate-900 dark:text-white">{formatCurrency(maintenanceBudget)}</span>
                                    </div>
                                    <input 
                                        type="range" min="100000" max="1500000" step="50000" value={maintenanceBudget}
                                        onChange={(e) => setMaintenanceBudget(parseInt(e.target.value))}
                                        className="w-full accent-[#00A896] bg-slate-200 dark:bg-[#0B1A3E] rounded-lg appearance-none h-2 cursor-pointer"
                                    />
                                </div>

                                {/* Utilities Slider */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-slate-600 dark:text-slate-400">Servicios Básicos (Agua / Luz Común)</span>
                                        <span className="font-extrabold text-slate-900 dark:text-white">{formatCurrency(utilitiesBudget)}</span>
                                    </div>
                                    <input 
                                        type="range" min="50000" max="1000000" step="50000" value={utilitiesBudget}
                                        onChange={(e) => setUtilitiesBudget(parseInt(e.target.value))}
                                        className="w-full accent-[#00A896] bg-slate-200 dark:bg-[#0B1A3E] rounded-lg appearance-none h-2 cursor-pointer"
                                    />
                                </div>
                            </div>

                            {/* Total Result Panel */}
                            <div className="bg-slate-50 dark:bg-[#0B1A3E] border border-slate-200/60 dark:border-white/5 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 transition-all duration-300">
                                <div>
                                    <span className="text-[10px] text-slate-500 font-extrabold uppercase tracking-widest block">Gasto Total Común del Condominio</span>
                                    <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-350 block mt-1">{formatCurrency(totalExpenses)}</span>
                                </div>
                                <div className="p-3 bg-[#00A896]/10 border border-[#00A896]/20 text-[#00A896] dark:text-[#00A896] rounded-xl">
                                    <span className="text-[9px] font-extrabold uppercase tracking-widest block">Cuota por Departamento</span>
                                    <span className="text-xl sm:text-2xl font-black block mt-0.5">{formatCurrency(expensePerUnit)}</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>



            {/* Roadmap / Project Implementation Timeline Section */}
            <section id="roadmap" className="py-24 border-t border-slate-200/50 dark:border-white/5 bg-transparent relative transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16 transition-colors duration-300">
                        <span className="text-xs font-bold text-[#00A896] uppercase tracking-widest block mb-2">Hoja de Ruta del Proyecto</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight transition-colors duration-300">
                            Fases de Implementación Técnica
                        </h2>
                        <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg transition-colors duration-300">
                            Desarrollado bajo estrictos estándares de ingeniería de software. Nuestra hoja de ruta de 5 fases para asegurar la entrega sin scope-creep.
                        </p>
                    </div>

                    {/* Timeline stepper */}
                    <div className="relative border-l-2 border-slate-200/60 dark:border-white/5 ml-4 md:ml-0 md:border-l-0 md:grid md:grid-cols-5 gap-6 max-w-6xl mx-auto pl-6 md:pl-0 space-y-10 md:space-y-0 transition-all duration-300">
                        
                        {/* Step 1 */}
                        <div className="relative md:text-center space-y-4">
                            <div className="md:mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#72B043]/15 border-2 border-[#72B043] text-[#72B043] font-bold text-sm shadow-lg shadow-[#72B043]/10">
                                01
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] text-[#72B043] font-bold uppercase tracking-wider block">Fase 1: Setup & Core</span>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Configuración Inicial</h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed md:max-w-[200px] md:mx-auto transition-colors duration-300">
                                    Instalación de Laravel 13, SQLite local, Tailwind CSS v4, e integración del Starter Kit de React + Inertia.js v3.
                                </p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative md:text-center space-y-4">
                            <div className="md:mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#72B043]/15 border-2 border-[#72B043] text-[#72B043] font-bold text-sm shadow-lg shadow-[#72B043]/10">
                                02
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] text-[#72B043] font-bold uppercase tracking-wider block">Fase 2: Estructura</span>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Usuarios & Propiedades</h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed md:max-w-[200px] md:mx-auto transition-colors duration-300">
                                    Base de datos relacional de condominios y unidades. Formularios de registro específicos según los 6 perfiles dinámicos.
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative md:text-center space-y-4">
                            <div className="md:mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#72B043]/15 border-2 border-[#72B043] text-[#72B043] font-bold text-sm shadow-lg shadow-[#72B043]/10">
                                03
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] text-[#72B043] font-bold uppercase tracking-wider block">Fase 3: Finanzas</span>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Gastos Comunes</h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed md:max-w-[200px] md:mx-auto transition-colors duration-300">
                                    Algoritmo de facturación por prorrateo, portal de registro de pagos digitales, estados de cuenta descargables y multas.
                                </p>
                            </div>
                        </div>

                        {/* Step 4 */}
                        <div className="relative md:text-center space-y-4">
                            <div className="md:mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#EC7A08]/15 border-2 border-[#EC7A08] text-[#EC7A08] font-bold text-sm shadow-lg shadow-[#EC7A08]/10">
                                04
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] text-[#EC7A08] font-bold uppercase tracking-wider block animate-pulse">Fase 4: Operaciones</span>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Mantenimiento & Chat</h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed md:max-w-[200px] md:mx-auto transition-colors duration-300">
                                    Módulo de tickets de averías con asignación a técnicos. Pizarrón digital de comunicados y mensajería privada.
                                </p>
                            </div>
                        </div>

                        {/* Step 5 */}
                        <div className="relative md:text-center space-y-4">
                            <div className="md:mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/80 dark:bg-[#0B1A3E] border-2 border-slate-200/60 dark:border-white/5 text-slate-400 dark:text-slate-500 font-bold text-sm transition-colors duration-300">
                                05
                            </div>
                            <div className="space-y-1">
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Fase 5: Producción</span>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Testing & Deploy</h4>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed md:max-w-[200px] md:mx-auto transition-colors duration-300">
                                    Pruebas unitarias y de integración con Pest PHP v4, migración del core a MySQL 8+, optimización de cachés y despliegue.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Developer blueprint section with mock code terminal */}
            <section id="developers" className="py-24 border-t border-slate-200/50 dark:border-white/5 bg-transparent relative transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">
                        
                        {/* Left: Terminal Mockup */}
                        <div className="lg:col-span-7 relative">
                            <div className="absolute inset-0 bg-[#00A896]/10 rounded-2xl blur-3xl -z-10" />
                            <div className="bg-[#0B1A3E] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                                {/* Header bar */}
                                <div className="bg-[#0A183A] px-4 py-3 flex items-center justify-between border-b border-white/5">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-3 h-3 rounded-full bg-rose-500" />
                                        <span className="w-3 h-3 rounded-full bg-amber-500" />
                                        <span className="w-3 h-3 rounded-full bg-emerald-500" />
                                    </div>
                                    <span className="text-xs font-mono text-slate-500">spatie_permission_seeder.php</span>
                                </div>
                                {/* Code Editor mockup */}
                                <pre className="p-6 font-mono text-[11px] sm:text-xs text-teal-300 leading-relaxed overflow-x-auto bg-[#0A183A]/60">
<code><span className="text-slate-500">// database/seeders/RoleSeeder.php</span>{"\n"}
<span className="text-violet-400">use</span> Spatie\Permission\Models\Role;{"\n"}
<span className="text-violet-400">use</span> Spatie\Permission\Models\Permission;{"\n"}{"\n"}
<span className="text-emerald-400">public function</span> <span className="text-indigo-400">run</span>(){"\n"}
{"{"}{"\n"}
    <span className="text-slate-500">    // Crear los 6 roles core del sistema</span>{"\n"}
    <span className="text-amber-400">    $ownerRole</span> = Role::create([<span className="text-emerald-300">'name'</span> =&gt; <span className="text-emerald-300">'propietario'</span>]);{"\n"}
    <span className="text-amber-400">    $employeeRole</span> = Role::create([<span className="text-emerald-300">'name'</span> =&gt; <span className="text-emerald-300">'colaborador'</span>]);{"\n"}{"\n"}
    <span className="text-slate-500">    // Crear permisos core</span>{"\n"}
    <span className="text-amber-400">    $payExpense</span> = Permission::create([<span className="text-emerald-300">'name'</span> =&gt; <span className="text-emerald-300">'pagar gastos comunes'</span>]);{"\n"}
    <span className="text-amber-400">    $resolveTicket</span> = Permission::create([<span className="text-emerald-300">'name'</span> =&gt; <span className="text-emerald-300">'resolver tickets'</span>]);{"\n"}{"\n"}
    <span className="text-slate-500">    // Asignar la matriz relacional de RBAC</span>{"\n"}
    <span className="text-amber-400">    $ownerRole</span>-&gt;givePermissionTo(<span className="text-amber-400">$payExpense</span>);{"\n"}
    <span className="text-amber-400">    $employeeRole</span>-&gt;givePermissionTo(<span className="text-amber-400">$resolveTicket</span>);{"\n"}
{"}"}{"\n"}
</code></pre>
                            </div>
                        </div>

                        {/* Right: Technical Explanation */}
                        <div className="lg:col-span-5 space-y-6">
                            <span className="text-xs font-bold text-[#00A896] uppercase tracking-widest block">Arquitectura Limpia</span>
                            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-tight transition-colors duration-300">
                                Diseñado para Ingenieros
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed transition-colors duration-300">
                                RedVecino & MiVecino no es un simple script. Está construido sobre un robusto stack moderno con tipado fuerte, arquitectura relacional bien normalizada y separación estricta de responsabilidades operativas.
                            </p>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-white/80 dark:bg-white/[0.02] dark:backdrop-blur-md border border-slate-200/50 dark:border-white/5 rounded-xl shadow-sm transition-all duration-300">
                                    <span className="text-slate-900 dark:text-white font-bold text-sm block">Seguridad & Cryptography</span>
                                    <span className="text-slate-600 dark:text-slate-500 text-xs mt-1 block">Middleware avanzado, tokens Sanctum, y roles Spatie RBAC v7 con control estricto de accesos.</span>
                                </div>
                                <div className="p-4 bg-white/80 dark:bg-white/[0.02] dark:backdrop-blur-md border border-slate-200/50 dark:border-white/5 rounded-xl shadow-sm transition-all duration-300">
                                    <span className="text-slate-900 dark:text-white font-bold text-sm block">API RESTful e IoT</span>
                                    <span className="text-slate-600 dark:text-slate-500 text-xs mt-1 block">Arquitectura abierta de tokens lista para integraciones externas de QR, portones y CCTV.</span>
                                </div>
                                <div className="p-4 bg-white/80 dark:bg-white/[0.02] dark:backdrop-blur-md border border-slate-200/50 dark:border-white/5 rounded-xl shadow-sm transition-all duration-300">
                                    <span className="text-slate-900 dark:text-white font-bold text-sm block">Testing Suite & QA</span>
                                    <span className="text-slate-600 dark:text-slate-500 text-xs mt-1 block">Pruebas automatizadas continuas con Pest PHP v4 y Laravel Dusk con cobertura objetivo de +95%.</span>
                                </div>
                                <div className="p-4 bg-white/80 dark:bg-white/[0.02] dark:backdrop-blur-md border border-slate-200/50 dark:border-white/5 rounded-xl shadow-sm transition-all duration-300">
                                    <span className="text-slate-900 dark:text-white font-bold text-sm block">Base de Datos & ACID</span>
                                    <span className="text-slate-600 dark:text-slate-500 text-xs mt-1 block">Esquema SQLite optimizado en dev y transición fluida a MySQL 8+ con soporte para transacciones ACID.</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Premium CTA Section */}
            <section className="py-24 border-t border-slate-200/50 dark:border-white/5 bg-slate-100/30 dark:bg-[#0A183A]/60 relative overflow-hidden transition-colors duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00A896]/10 to-[#72B043]/10 pointer-events-none" />
                <div className="max-w-4xl mx-auto text-center px-4 relative z-10 space-y-6">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight transition-colors duration-300">
                        ¿Listo para llevar tu comunidad al siguiente nivel?
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto transition-colors duration-300">
                        Regístrate hoy mismo y experimenta la gestión de condominios automatizada, ágil y transparente.
                    </p>
                    <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Link
                            href={route('register')}
                            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#0F2557] to-[#00A896] hover:from-[#132c66] hover:to-[#00c2ad] text-white font-bold rounded-2xl shadow-xl transition-all"
                        >
                            Comenzar Registro Gratis
                        </Link>
                        <Link
                            href={route('login')}
                            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white/85 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-200 font-semibold rounded-2xl hover:bg-slate-50 dark:hover:bg-white/[0.08] transition-all"
                        >
                            Iniciar Sesión
                        </Link>
                    </div>
                </div>
            </section>

            {/* Robust Corporate Footer (Neobranding & Author Credits) */}
            <footer className="py-20 border-t border-slate-200/50 dark:border-white/5 bg-slate-100/50 dark:bg-[#0A183A] text-slate-600 dark:text-slate-400 transition-all duration-300 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Columns Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 pb-16">
                        
                        {/* Column 1: Brand & Slogan */}
                        <div className="space-y-4 text-left">
                            <ApplicationLogo size="small" showSubtext={true} />
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
                                Ecosistema SaaS residencial diseñado para automatizar la gestión administrativa, la fiscalización de egresos, la seguridad en accesos y la convivencia vecinal.
                            </p>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                Diseñado y desarrollado por <a href="https://github.com/motazorrilla" target="_blank" rel="noopener noreferrer" className="text-[#00A896] hover:underline font-bold">@Motazorrilla</a> en colaboración con <a href="https://neobranding.cl" target="_blank" rel="noopener noreferrer" className="text-[#00A896] hover:underline font-bold">Neobranding.cl</a>.
                            </div>
                        </div>

                        {/* Column 2: Platform Links */}
                        <div className="space-y-4 text-left">
                            <span className="text-xs font-black text-slate-900 dark:text-slate-400 uppercase tracking-widest block">Plataforma</span>
                            <ul className="space-y-2.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                                <li>
                                    <a href="#simulator" className="hover:text-[#00A896] dark:hover:text-white transition-colors">Simulador de Roles</a>
                                </li>
                                <li>
                                    <a href="#modules" className="hover:text-[#00A896] dark:hover:text-white transition-colors">Módulos Core</a>
                                </li>
                                <li>
                                    <a href="#calculator" className="hover:text-[#00A896] dark:hover:text-white transition-colors">Calculadora Financiera</a>
                                </li>
                                <li>
                                    <a href="#mobile-app" className="hover:text-[#00A896] dark:hover:text-white transition-colors">Aplicación Móvil</a>
                                </li>
                                <li>
                                    <a href="#roadmap" className="hover:text-[#00A896] dark:hover:text-white transition-colors">Plan Técnico</a>
                                </li>
                            </ul>
                        </div>

                        {/* Column 3: Legal & Support */}
                        <div className="space-y-4 text-left">
                            <span className="text-xs font-black text-slate-900 dark:text-slate-400 uppercase tracking-widest block">Legal y Soporte</span>
                            <ul className="space-y-2.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                                <li>
                                    <a href="#developers" className="hover:text-[#00A896] dark:hover:text-white transition-colors">Documentación de API</a>
                                </li>
                                <li>
                                    <button 
                                        onClick={() => alert("Términos de Servicio: El uso de la simulación RedVecino & MiVecino está destinado exclusivamente a propósitos de portafolio y demostración de capacidades bajo la licencia MIT.")}
                                        className="hover:text-[#00A896] dark:hover:text-white transition-colors text-left font-bold"
                                    >
                                        Términos de Servicio
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        onClick={() => alert("Políticas de Privacidad: Esta aplicación de demostración no realiza almacenamiento ni recolección de datos personales en servidores de terceros.")}
                                        className="hover:text-[#00A896] dark:hover:text-white transition-colors text-left font-bold"
                                    >
                                        Políticas de Privacidad
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        onClick={() => alert("Licencia de Software: Distribuido bajo la Licencia MIT. Todo el material y propiedad de marca es respaldado por Neobranding.")}
                                        className="hover:text-[#00A896] dark:hover:text-white transition-colors text-left font-bold"
                                    >
                                        Licencia MIT Residencial
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Column 4: Infrastructure Stack */}
                        <div className="space-y-4 text-left">
                            <span className="text-xs font-black text-slate-900 dark:text-slate-400 uppercase tracking-widest block">Infraestructura Tech</span>
                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {["Laravel 13", "React & Inertia", "Tailwind CSS v4", "Spatie RBAC v7", "SQLite & MySQL", "Vite 8 & esbuild"].map(tech => (
                                    <span key={tech} className="px-2 py-1 bg-slate-200/70 dark:bg-slate-900 border border-slate-300/40 dark:border-slate-800 text-[10px] font-bold rounded-lg text-slate-700 dark:text-slate-400">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Horizontal Divider */}
                    <div className="border-t border-slate-200/50 dark:border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-xs text-slate-500 font-semibold text-center md:text-left">
                            &copy; {new Date().getFullYear()} RedVecino &middot; Neobranding.cl. Todos los derechos reservados.
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 dark:text-slate-500 font-bold flex items-center gap-1">
                            <span>Hecho con ❤️ en Santiago, Chile</span>
                            <span>&middot;</span>
                            <span>Laravel v{laravelVersion}</span>
                            <span>&middot;</span>
                            <span>PHP v{phpVersion}</span>
                        </div>
                    </div>

                </div>
            </footer>
        </div>
    );
}
