import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Head, Link, usePage } from '@inertiajs/react';
import { generatePassword, formatCurrency } from '@/utils/helpers';
import { toast } from '@/utils/notify';
import ToastContainer from '@/Components/Toast';
import ConfirmDialog from '@/Components/ConfirmDialog';

// Role Pages
import SuperUsuarioDashboard from '@/Components/RolePages/SuperUsuarioDashboard';
import TiDashboard from '@/Components/RolePages/TiDashboard';
import AdminDashboard from '@/Components/RolePages/AdminDashboard';
import ComiteDashboard from '@/Components/RolePages/ComiteDashboard';
import ColaboradorDashboard from '@/Components/RolePages/ColaboradorDashboard';
import PropietarioDashboard from '@/Components/RolePages/PropietarioDashboard';
import ResidenteDashboard from '@/Components/RolePages/ResidenteDashboard';

import { RoleTransitionLoader } from '@/Components/DashboardShared';
import { useCondoFinances } from '@/hooks/useCondoFinances';
import { useFinancialCatalog } from '@/hooks/useFinancialCatalog';

export default function Dashboard() {
    const { 
        stats, 
        recentAnnouncements = [], 
        upcomingExpenses = [], 
        allUsers = [], 
        allProperties = [], 
        allMessages = [], 
        allCondominiums = [],
        allPayments = [],
        recentPayments = []
    } = usePage().props;

    const loggedInUser = usePage().props.auth.user;
    const [impersonatedUser, setImpersonatedUser] = useState(null);
    const user = impersonatedUser || loggedInUser;

    const [usersList, setUsersList] = useState(allUsers);
    const [propertiesList, setPropertiesList] = useState(allProperties);
    const [ticketsList, setTicketsList] = useState(usePage().props.recentTickets || []);
    const [paymentsList, setPaymentsList] = useState(recentPayments.length > 0 ? recentPayments : allPayments);
    const [adminCondoId, setAdminCondoId] = useState(allCondominiums.length > 0 ? allCondominiums[0].id : 1);

    // Condo Finances
    const [paymentsTabMode, setPaymentsTabMode] = useState('ledger');
    const [ledgerSubTab, setLedgerSubTab] = useState('incomes');
    const [showAddIncomeForm, setShowAddIncomeForm] = useState(false);
    const [showAddExpenseForm, setShowAddExpenseForm] = useState(false);
    const [editingIncome, setEditingIncome] = useState(null);
    const [editingExpense, setEditingExpense] = useState(null);
    const [selectedIncomeCategory, setSelectedIncomeCategory] = useState('all');
    const [selectedExpenseCategory, setSelectedExpenseCategory] = useState('all');
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isMobileDevOpsSidebarOpen, setIsMobileDevOpsSidebarOpen] = useState(false);

    const canViewFinances = user?.roles?.some(r => ['admin', 'administrador', 'committee', 'comité'].includes(r.toLowerCase()));

    const { data: catalogData } = useFinancialCatalog(canViewFinances);
    const financialCatalog = catalogData || { incomes: {}, expenses: {} };

    const {
        data: financesData,
        isFetching: loadingFinances,
        refetch: fetchCondoFinances,
    } = useCondoFinances(canViewFinances ? adminCondoId : null);

    const incomesList = financesData?.incomes || [];
    const expensesList = financesData?.expenses || [];
    const financeSummary = financesData?.summary || { total_incomes: 0, total_expenses: 0, balance: 0, incomes_by_category: {}, expenses_by_category: {} };

    const filteredIncomes = useMemo(() =>
        selectedIncomeCategory === 'all'
            ? incomesList
            : incomesList.filter(inc => inc.category === selectedIncomeCategory),
        [incomesList, selectedIncomeCategory]
    );

    const filteredExpenses = useMemo(() =>
        selectedExpenseCategory === 'all'
            ? expensesList
            : expensesList.filter(exp => exp.category === selectedExpenseCategory),
        [expensesList, selectedExpenseCategory]
    );

    const [newIncomeForm, setNewIncomeForm] = useState({ category: '', subcategory: '', amount: '', date: '', description: '', property_id: '', user_id: '', distributable_method: 'prorated', tower_id: '' });
    const [newExpenseForm, setNewExpenseForm] = useState({ category: '', subcategory: '', amount: '', date: '', description: '', property_id: '', user_id: '', distributable_method: 'prorated', tower_id: '' });

    useEffect(() => {
        const canView = user?.roles?.some(r => ['admin', 'administrador', 'committee', 'comité'].includes(r.toLowerCase()));
        if (!canView) return;
        axios.get('/api/condo-finances/catalog')
            .then(res => setFinancialCatalog(res.data))
            .catch(err => console.error("Error cargando catálogo financiero:", err));
    }, []);

    const handleSaveIncome = (e) => {
        e.preventDefault();
        const data = {
            condominium_id: adminCondoId,
            category: newIncomeForm.category,
            subcategory: newIncomeForm.subcategory || null,
            amount: Number(newIncomeForm.amount),
            date: newIncomeForm.date,
            description: newIncomeForm.description || null,
            property_id: newIncomeForm.property_id ? Number(newIncomeForm.property_id) : null,
            user_id: newIncomeForm.user_id ? Number(newIncomeForm.user_id) : null,
            distributable_method: newIncomeForm.distributable_method || 'prorated',
            tower_id: newIncomeForm.tower_id ? Number(newIncomeForm.tower_id) : null,
        };

        const req = editingIncome 
            ? axios.put(`/api/condo-finances/incomes/${editingIncome.id}`, data)
            : axios.post('/api/condo-finances/incomes', data);

        req.then(() => {
            fetchCondoFinances();
            setShowAddIncomeForm(false);
            setEditingIncome(null);
            setNewIncomeForm({ category: '', subcategory: '', amount: '', date: '', description: '', property_id: '', user_id: '', distributable_method: 'prorated', tower_id: '' });
        }).catch(err => {
            toast("Error al guardar ingreso: " + (err.response?.data?.message || err.message), 'error');
        });
    };

    const handleDeleteIncome = (id) => {
        if (!confirm("¿Seguro que deseas eliminar este ingreso contable?")) return;
        axios.delete(`/api/condo-finances/incomes/${id}`)
            .then(() => fetchCondoFinances())
            .catch(err => toast("Error al eliminar ingreso: " + err.message, 'error'));
    };

    const handleSaveExpense = (e) => {
        e.preventDefault();
        const data = {
            condominium_id: adminCondoId,
            category: newExpenseForm.category,
            subcategory: newExpenseForm.subcategory || null,
            amount: Number(newExpenseForm.amount),
            date: newExpenseForm.date,
            description: newExpenseForm.description || null,
            property_id: newExpenseForm.property_id ? Number(newExpenseForm.property_id) : null,
            user_id: newExpenseForm.user_id ? Number(newExpenseForm.user_id) : null,
            distributable_method: newExpenseForm.distributable_method || 'prorated',
            tower_id: newExpenseForm.tower_id ? Number(newExpenseForm.tower_id) : null,
        };

        const req = editingExpense 
            ? axios.put(`/api/condo-finances/expenses/${editingExpense.id}`, data)
            : axios.post('/api/condo-finances/expenses', data);

        req.then(() => {
            fetchCondoFinances();
            setShowAddExpenseForm(false);
            setEditingExpense(null);
            setNewExpenseForm({ category: '', subcategory: '', amount: '', date: '', description: '', property_id: '', user_id: '', distributable_method: 'prorated', tower_id: '' });
        }).catch(err => {
            toast("Error al guardar egreso: " + (err.response?.data?.message || err.message), 'error');
        });
    };

    const handleDeleteExpense = (id) => {
        if (!confirm("¿Seguro que deseas eliminar este egreso contable?")) return;
        axios.delete(`/api/condo-finances/expenses/${id}`)
            .then(() => fetchCondoFinances())
            .catch(err => toast("Error al eliminar egreso: " + err.message, 'error'));
    };

    useEffect(() => {
        if (incomesList && incomesList.length > 0) {
            const dbResolvedFines = incomesList
                .filter(inc => inc.category === 'multas')
                .map(inc => ({
                    id: inc.id,
                    property_id: inc.property_id || (propertiesList[0]?.id || 1),
                    amount: Number(inc.amount),
                    reason: inc.description || inc.subcategory || 'Multa por reglamento',
                    status: 'resolved',
                    date: inc.date ? inc.date.substring(0, 10) : '2026-08-25',
                    condominium_id: adminCondoId
                }));

            const pendingAndAnnulledFines = [
                { id: 9001, property_id: propertiesList[0]?.id || 1, amount: 45000, reason: 'Ruidos molestos después de las 02:00 AM (música alta)', status: 'pending', date: '2026-08-26', condominium_id: adminCondoId },
                { id: 9002, property_id: propertiesList[1]?.id || 2, amount: 65000, reason: 'Uso de piscina comunitaria sin reserva previa', status: 'pending', date: '2026-08-25', condominium_id: adminCondoId },
                { id: 9003, property_id: propertiesList[2]?.id || 3, amount: 35000, reason: 'Depósito de escombros y cajas en pasillo de evacuación', status: 'annulled', date: '2026-08-20', condominium_id: adminCondoId },
                { id: 9004, property_id: propertiesList[3]?.id || 4, amount: 30000, reason: 'Sacar basura fuera del horario estipulado en el reglamento', status: 'pending', date: '2026-08-26', condominium_id: adminCondoId }
            ];

            setFinesList([...dbResolvedFines, ...pendingAndAnnulledFines]);
        }
    }, [incomesList, propertiesList, adminCondoId]);

    const [condosList, setCondosList] = useState(
        allCondominiums.length > 0
            ? allCondominiums.map(c => ({ id: c.id, name: c.name, address: c.address, city: c.city, units_count: c.units_count, status: c.status }))
            : [{ id: 1, name: 'Sin Condominios', address: '', city: '', units_count: 0, status: 'inactive' }]
    );

    const [selectedImpCondo, setSelectedImpCondo] = useState('all');
    const [selectedImpRole, setSelectedImpRole] = useState('all');
    const [selectedImpUser, setSelectedImpUser] = useState('');

    const [adminActiveTab, setAdminActiveTab] = useState('dashboard');
    const [userSubTab, setUserSubTab] = useState('residents');
    const [settingsSuccess, setSettingsSuccess] = useState(false);
    const [exportingLogs, setExportingLogs] = useState(false);
    const [adminSettingsForm, setAdminSettingsForm] = useState({
        name: user?.name || 'Administrador General',
        email: user?.email || 'admin@redvecino.cl',
        phone: user?.phone || '+56 9 8765 4321',
        rut: user?.rut || '12.345.678-9',
        notificationToggle: true,
        dbDriver: 'sqlite'
    });

    useEffect(() => {
        if (user) {
            setAdminSettingsForm({
                name: user.name,
                email: user.email,
                phone: user.phone || '+56 9 8765 4321',
                rut: user.rut || '12.345.678-9',
                notificationToggle: true,
                dbDriver: 'sqlite'
            });
        }
    }, [user]);

    const [ticketStatusFilter, setTicketStatusFilter] = useState('all');
    const [ticketPriorityFilter, setTicketPriorityFilter] = useState('all');

    const [finesList, setFinesList] = useState([
        { id: 1, property_id: 1, amount: 45000, reason: 'Ruidos molestos después de las 02:00 AM (música alta)', status: 'pending', date: '2026-05-10', condominium_id: 1 },
        { id: 2, property_id: 2, amount: 65000, reason: 'Uso de piscina comunitaria sin reserva previa', status: 'pending', date: '2026-05-18', condominium_id: 1 },
        { id: 3, property_id: 3, amount: 50000, reason: 'Mascota suelta en pasillos sin correa de seguridad', status: 'resolved', date: '2026-05-02', condominium_id: 1 },
        { id: 4, property_id: 4, amount: 80000, reason: 'Estacionar en espacio de visitas sin autorización', status: 'pending', date: '2026-05-25', condominium_id: 1 },
        { id: 5, property_id: 5, amount: 35000, reason: 'Depósito de escombros y cajas en pasillo de evacuación', status: 'annulled', date: '2026-05-12', condominium_id: 1 },
        { id: 6, property_id: 6, amount: 120000, reason: 'Daño en espejo del ascensor de la Torre A', status: 'resolved', date: '2026-05-14', condominium_id: 1 },
        { id: 7, property_id: 7, amount: 30000, reason: 'Sacar basura fuera del horario estipulado en el reglamento', status: 'pending', date: '2026-05-28', condominium_id: 1 },
        { id: 8, property_id: 8, amount: 55000, reason: 'Encendido de parrilla a carbón en terraza no autorizada', status: 'resolved', date: '2026-05-20', condominium_id: 1 },
        { id: 9, property_id: 9, amount: 40000, reason: 'Exceso de aforo no permitido en Salón de Eventos', status: 'annulled', date: '2026-05-05', condominium_id: 1 },
        { id: 10, property_id: 21, amount: 80000, reason: 'Uso no autorizado de estacionamiento de minusválidos', status: 'pending', date: '2026-05-26', condominium_id: 2 }
    ]);
    const [showAddFineForm, setShowAddFineForm] = useState(false);
    const [newFineForm, setNewFineForm] = useState({ property_id: '', amount: '', reason: '', status: 'pending' });

    const [editingUser, setEditingUser] = useState(null);
    const [editingCondo, setEditingCondo] = useState(null);
    const [editingProp, setEditingProp] = useState(null);
    const [editingTicket, setEditingTicket] = useState(null);
    const [editingPayment, setEditingPayment] = useState(null);
    const [editingFine, setEditingFine] = useState(null);

    const [showAddUserForm, setShowAddUserForm] = useState(false);
    const [showAddPropForm, setShowAddPropForm] = useState(false);
    const [showAddTicketForm, setShowAddTicketForm] = useState(false);
    const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);
    const [showAddCondoForm, setShowAddCondoForm] = useState(false);
    const [showPersonWizard, setShowPersonWizard] = useState(false);

    const [newUserForm, setNewUserForm] = useState({ name: '', rut: '', email: '', phone: '', role: 'resident', status: 'active', password: generatePassword() });
    const [newPropForm, setNewPropForm] = useState({ condominium_id: 1, type: 'apartment', number: '', block: 'Torre A', floor: '', area_sqm: '', status: 'vacant' });
    const [newTicketForm, setNewTicketForm] = useState({ property_id: '', title: '', description: '', priority: 'medium', category_id: 1 });
    const [newPaymentForm, setNewPaymentForm] = useState({ user_id: '', property_id: '', common_expense_id: 1, amount: '', payment_method: 'transfer' });
    const [newCondoForm, setNewCondoForm] = useState({ name: '', address: '', city: '', units_count: '' });

    const [isListeningVoice, setIsListeningVoice] = useState(false);
    const [voiceTextSimulated, setVoiceTextSimulated] = useState('');

    const [showTransition, setShowTransition] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    const userRoles = user?.roles || [];
    const isTiRole = userRoles.some(role => role.toLowerCase() === 'ti');
    const isAdminRole = userRoles.some(role => role.toLowerCase() === 'administrador');
    const isComiteRole = userRoles.some(role => role.toLowerCase() === 'comité');
    const isColaboradorRole = userRoles.some(role => role.toLowerCase() === 'colaborador');
    const isPropietarioRole = userRoles.some(role => role.toLowerCase() === 'propietario');
    const isResidenteRole = userRoles.some(role => role.toLowerCase() === 'residente');
    const isActuallyAdmin = isTiRole || isAdminRole || isComiteRole || isColaboradorRole;

    const [simulationMode, setSimulationMode] = useState(false);
    const [sandboxCondoId, setSandboxCondoId] = useState('all');
    const [sandboxModule, setSandboxModule] = useState('map');

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
            const storedTheme = localStorage.getItem('dashboard-theme');
            if (storedTheme) return storedTheme === 'dark';
            return true;
        }
        return true;
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

    const getUserCondoId = (u) => {
        if (!u) return 1;
        if (u.condominium_id) return Number(u.condominium_id);
        
        const prop = propertiesList.find(p => 
            p.owners?.some(o => o.toLowerCase() === u.name.toLowerCase()) || 
            p.residents?.some(r => r.toLowerCase() === u.name.toLowerCase())
        );
        if (prop) return Number(prop.condominium_id);

        if (u.email === 'admin@redvecino.cl') return 1;
        if (u.email === 'comite@redvecino.cl') return 1;
        if (u.email === 'colaborador@redvecino.cl') return 1;
        if (u.email === 'propietario@redvecino.cl') return 1;
        if (u.email === 'residente@redvecino.cl') return 1;
        return 1; 
    };

    const [devOpsActive, setDevOpsActive] = useState(isTiRole);
    useEffect(() => {
        setDevOpsActive(isTiRole);
    }, [isTiRole]);
    const [tiActiveTab, setTiActiveTab] = useState('devops');
    const [globalMaintenanceMode, setGlobalMaintenanceMode] = useState(false);
    const [packages, setPackages] = useState([
        { id: 'PKG-1002', tracking: 'SX-883921-CL', carrier: 'Starken', resident: 'Residente Demo', property: 'Depto 202', status: 'pending', date: '27/05/2026 14:30' },
        { id: 'PKG-1001', tracking: 'CH-203921-CL', carrier: 'Chilexpress', resident: 'Propietario Demo', property: 'Depto 101', status: 'completed', date: '26/05/2026 11:15' }
    ]);
    const [ocrScanning, setOcrScanning] = useState(false);
    const [searchUserQuery, setSearchUserQuery] = useState('');
    const [roleUserFilter, setRoleUserFilter] = useState('all');
    const [selectedAuditChat, setSelectedAuditChat] = useState('Residente Demo');
    const [chatAuditReply, setChatAuditReply] = useState('');
    const [auditedMessagesState, setAuditedMessagesState] = useState([
        { id: 1, sender_id: 3, sender_name: 'Residente Demo', receiver_id: 5, receiver_name: 'Conserje Principal', content: 'Hola, llegó mi paquete?', time: '18:10', date: '27/05/2026', is_read: true },
        { id: 2, sender_id: 5, sender_name: 'Conserje Principal', receiver_id: 3, receiver_name: 'Residente Demo', content: 'Sí Carlos, te llegó Starken.', time: '18:12', date: '27/05/2026', is_read: true }
    ]);

    useEffect(() => {
        if (allMessages && allMessages.length > 0) {
            const mapped = allMessages.map(m => ({
                id: m.id,
                sender_id: m.sender_id,
                sender_name: m.sender_name,
                receiver_id: m.receiver_id,
                receiver_name: m.receiver_name,
                content: m.content,
                time: m.time,
                date: m.date,
                is_read: m.is_read
            }));
            setAuditedMessagesState(mapped);
        }
    }, [allMessages]);

    const [cpuLoad, setCpuLoad] = useState(14);
    const [ramUsage, setRamUsage] = useState(124);
    const [latency, setLatency] = useState(8);

    const [terminalLogs, setTerminalLogs] = useState([
        '[TI-INIT] Sesión de Consola TI establecida.',
        '[INFRA] Conectado al kernel local de RedVecino & MiVecino SQLite.',
        '[SECURITY] Spatie Permisos cargados con éxito (Autenticado como TI).'
    ]);

    const [rbMatrix, setRbMatrix] = useState({
        ti: {
            ver_finanzas_global: true,
            impersonar_residentes: true,
            auditar_conversaciones: true,
            simular_ocr_conserje: true,
            modificar_sistema_config: true,
            gestionar_roles_avanzados: true,
            auditar_proveedores: true,
            control_asambleas_ia: true
        },
        admin: {
            ver_finanzas_global: true,
            impersonar_residentes: true,
            auditar_conversaciones: true,
            simular_ocr_conserje: true,
            modificar_sistema_config: false,
            gestionar_roles_avanzados: true,
            auditar_proveedores: true,
            control_asambleas_ia: true
        },
        employee: {
            ver_finanzas_global: false,
            impersonar_residentes: false,
            auditar_conversaciones: false,
            simular_ocr_conserje: true,
            modificar_sistema_config: false,
            gestionar_roles_avanzados: false,
            auditar_proveedores: false,
            control_asambleas_ia: false
        },
        comite: {
            ver_finanzas_global: true,
            impersonar_residentes: false,
            auditar_conversaciones: false,
            simular_ocr_conserje: false,
            modificar_sistema_config: false,
            gestionar_roles_avanzados: false,
            auditar_proveedores: false,
            control_asambleas_ia: true
        },
        proveedor: {
            ver_finanzas_global: false,
            impersonar_residentes: false,
            auditar_conversaciones: false,
            simular_ocr_conserje: false,
            modificar_sistema_config: false,
            gestionar_roles_avanzados: false,
            auditar_proveedores: false,
            control_asambleas_ia: false
        },
        resident: {
            ver_finanzas_global: false,
            impersonar_residentes: false,
            auditar_conversaciones: false,
            simular_ocr_conserje: false,
            modificar_sistema_config: false,
            gestionar_roles_avanzados: false,
            auditar_proveedores: false,
            control_asambleas_ia: false
        }
    });

    const [mobileTab, setMobileTab] = useState('home');
    const [simulatedMoroso, setSimulatedMoroso] = useState(false);
    const [showMorosidadModal, setShowMorosidadModal] = useState(false);

    const [residentCondo] = useState('Condominio Alameda Loft');
    const [residentExpenses, setResidentExpenses] = useState({
        id: 421,
        period: 'Mayo 2026',
        amount: 163250,
        dueDate: '05 de Junio, 2026',
        status: 'pending',
        isStructured: true,
        breakdown: {
            prorrateado: 70000,
            igualitario: 20000,
            subtotal: 90000,
            fondo_reserva: 4500,
            total_periodo: 94500,
            cargos_posteriores: {
                gastos_torre: 8000,
                multas: 10000,
                deuda_anterior: 50000,
                interes_mora: 750,
                total: 68750
            }
        },
        items: [
            { name: 'Gastos Comunes Prorrateados', amount: 70000 },
            { name: 'Gastos Comunes Igualitarios', amount: 20000 },
            { name: 'Fondo de Reserva (5%)', amount: 4500 },
            { name: 'Gastos de Torre A', amount: 8000 },
            { name: 'Multas por Reglamento', amount: 10000 },
            { name: 'Deuda Anterior Vencida', amount: 50000 },
            { name: 'Interés por Mora (1.5%)', amount: 750 }
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

    const [comiteActiveTab, setComiteActiveTab] = useState('dashboard');
    const [colaboradorActiveTab, setColaboradorActiveTab] = useState('attendance');
    const [propietarioActiveTab, setPropietarioActiveTab] = useState('home');

    const [bookingAmenity, setBookingAmenity] = useState('quincho');
    const [bookingDate, setBookingDate] = useState('');
    const [bookingSlot, setBookingSlot] = useState('Tarde (14:00 - 18:00)');

    const [newTicketTitle, setNewTicketTitle] = useState('');
    const [newTicketDesc, setNewTicketDesc] = useState('');
    const [newTicketCat, setNewTicketCat] = useState('Electricidad');
    const [newTicketPri, setNewTicketPri] = useState('medium');

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentReceiptName, setPaymentReceiptName] = useState('');
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [paymentCompletedSuccess, setPaymentCompletedSuccess] = useState(false);

    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState([
        { sender: 'system', text: 'Bienvenido al canal seguro de mensajería con Conserjería y Administración.' },
        { sender: 'other', text: 'Hola Vecino(a) del Depto 202, le informamos que ha llegado un paquete de Chilexpress a su nombre. Puede pasar a retirarlo a conserjería.', time: '14:20' }
    ]);
    const [isTyping, setIsTyping] = useState(false);

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

    const executeQrPayment = () => {
        setIsProcessingPayment(true);
        setTimeout(() => {
            setIsProcessingPayment(false);
            setPaymentCompletedSuccess(true);

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

    const submitBooking = (e) => {
        e.preventDefault();
        if (!bookingDate) {
            toast('Por favor selecciona una fecha.', 'warning');
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
        toast(`¡Solicitud enviada! Tu reserva de ${selectedAmenityObj.name} está pendiente de confirmación.`);
        setBookingDate('');
    };

    const submitTicket = (e) => {
        e.preventDefault();
        if (!newTicketTitle.trim() || !newTicketDesc.trim()) {
            toast('Por favor completa todos los campos obligatorios.', 'warning');
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
        toast(`¡Ticket #${newTicket.id} creado con éxito! Administración ha sido notificada.`);
        setNewTicketTitle('');
        setNewTicketDesc('');
    };

    const sendChatMessage = (e) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const time = new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
        const userMsg = { sender: 'me', text: chatInput, time };

        setChatMessages(prev => [...prev, userMsg]);
        setChatInput('');

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

    if (globalMaintenanceMode && !isActuallyAdmin) {
        return (
            <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center font-sans p-6 text-white text-center">
                <div className="max-w-md w-full space-y-8 bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 p-10 rounded-modal shadow-2xl relative overflow-hidden animate-fade-in">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-teal/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex flex-col items-center gap-4">
                        <div className="h-20 w-20 bg-amber-500/10 text-amber-500 flex items-center justify-center rounded-[24px] border border-amber-500/20 shadow-lg shadow-amber-950/20 shrink-0 animate-bounce">
                            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-100">
                            Mantenimiento Programado
                        </h1>
                        <p className="text-sm text-slate-400">
                            Estamos realizando mejoras en el portal de RedVecino & MiVecino para brindarte un servicio más robusto y veloz. Volveremos muy pronto.
                        </p>
                    </div>

                    <div className="border-t border-slate-800/60 pt-6 space-y-4">
                        <div className="flex items-center gap-3 bg-slate-950/50 p-4 rounded-2xl border border-slate-800/60">
                            <span className="flex h-2.5 w-2.5 relative shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-teal"></span>
                            </span>
                            <span className="text-xs text-slate-400 text-left">
                                Estado de Infraestructura: <strong className="font-bold text-brand-teal">Despliegue Activo</strong>
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-normal">
                            Si tienes alguna emergencia, por favor comunícate directamente con la conserjería o administración de tu condominio.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Resolve structural filters
    const adminFilteredUsers = usersList.filter(u => {
        if (u.roles?.some(r => r.toLowerCase() === 'ti')) return false;
        return getUserCondoId(u) === adminCondoId;
    });

    const adminFilteredProperties = propertiesList.filter(p => Number(p.condominium_id) === adminCondoId);
    const adminFilteredTickets = ticketsList.filter(t => t.property ? Number(t.property.condominium_id) === adminCondoId : true);
    const adminFilteredPayments = paymentsList.filter(p => p.property ? Number(p.property.condominium_id) === adminCondoId : (p.condominium_id ? Number(p.condominium_id) === adminCondoId : true));
    const adminFilteredFines = finesList.filter(f => Number(f.condominium_id) === adminCondoId);

    const filteredUsersForSubtab = adminFilteredUsers.filter(u => {
        const isAd = u.roles?.some(r => r.toLowerCase() === 'administrador');
        return userSubTab === 'residents' ? !isAd : isAd;
    });

    const isTi = isTiRole;
    const isSuperUsuario = false; // removed — not a real role in this system
    const isAdmin = isAdminRole;
    const isComite = isComiteRole;
    const isColaborador = isColaboradorRole;
    const isPropietario = isPropietarioRole;

    const sharedRolePageProps = {
        adminActiveTab, setAdminActiveTab,
        comiteActiveTab, setComiteActiveTab,
        colaboradorActiveTab, setColaboradorActiveTab,
        propietarioActiveTab, setPropietarioActiveTab,
        mobileTab, setMobileTab,
        forceMobileView, setForceMobileView, isDesktop,
        residentCondo,
        isActuallyAdmin, simulationMode,
        user, toggleTheme, darkMode, condosList, adminCondoId, setAdminCondoId, allCondominiums,
        isMobileSidebarOpen, setIsMobileSidebarOpen, adminSettingsForm,
        adminFilteredProperties, adminFilteredUsers, adminFilteredTickets,
        adminFilteredPayments, adminFilteredFines,
        setTicketStatusFilter, setTicketPriorityFilter, editingTicket, setEditingTicket,
        showAddPropForm, setShowAddPropForm, editingProp, setEditingProp,
        newPropForm, setNewPropForm, propertiesList, setPropertiesList,
        userSubTab, setUserSubTab,
        showAddUserForm, setShowAddUserForm, editingUser, setEditingUser,
        newUserForm, setNewUserForm, usersList, setUsersList,
        filteredUsersForSubtab, showPersonWizard, setShowPersonWizard,
        paymentsTabMode, setPaymentsTabMode, paymentsList, setPaymentsList,
        showAddPaymentForm, setShowAddPaymentForm, newPaymentForm, setNewPaymentForm,
        editingPayment, setEditingPayment, financeSummary, financialCatalog,
        selectedIncomeCategory, setSelectedIncomeCategory, selectedExpenseCategory, setSelectedExpenseCategory,
        ledgerSubTab, setLedgerSubTab, filteredIncomes, incomesList, filteredExpenses, expensesList,
        showAddIncomeForm, setShowAddIncomeForm, showAddExpenseForm, setShowAddExpenseForm,
        newIncomeForm, setNewIncomeForm, newExpenseForm, setNewExpenseForm,
        editingIncome, setEditingIncome, editingExpense, setEditingExpense,
        loadingFinances, handleSaveIncome, handleDeleteIncome, handleSaveExpense, handleDeleteExpense,
        showAddFineForm, setShowAddFineForm, editingFine, setEditingFine,
        newFineForm, setNewFineForm, finesList, setFinesList,
        ticketsList, setTicketsList, settingsSuccess, setSettingsSuccess,
        exportingLogs, setExportingLogs, setTerminalLogs,
        ticketStatusFilter, ticketPriorityFilter,
        ocrScanning, setOcrScanning, packages, setPackages,
        selectedAuditChat, setSelectedAuditChat, auditedMessagesState,
        setAuditedMessagesState, chatAuditReply, setChatAuditReply,
        residentExpenses, setResidentExpenses, paymentHistory, setPaymentHistory,
        showPaymentModal, setShowPaymentModal, paymentReceiptName, setPaymentReceiptName,
        isProcessingPayment, setIsProcessingPayment, paymentCompletedSuccess, setPaymentCompletedSuccess,
        executeQrPayment, simulatedMoroso, setSimulatedMoroso, setShowMorosidadModal, amenities, setAmenities,
        myReservations, setMyReservations, bookingAmenity, setBookingAmenity,
        bookingDate, setBookingDate, bookingSlot, setBookingSlot, submitBooking,
        newTicketTitle, setNewTicketTitle, newTicketDesc, setNewTicketDesc,
        newTicketCat, setNewTicketCat, newTicketPri, setNewTicketPri, submitTicket,
        chatMessages, setChatMessages, chatInput, setChatInput, isTyping, setIsTyping, sendChatMessage,
        reportedTickets, setReportedTickets
    };

    const sharedTiPageProps = {
        ...sharedRolePageProps,
        tiActiveTab, setTiActiveTab, isMobileDevOpsSidebarOpen, setIsMobileDevOpsSidebarOpen,
        globalMaintenanceMode, setGlobalMaintenanceMode, cpuLoad, ramUsage, latency, terminalLogs,
        selectedImpCondo, setSelectedImpCondo, selectedImpRole, setSelectedImpRole,
        selectedImpUser, setSelectedImpUser, getUserCondoId, setImpersonatedUser,
        searchUserQuery, setSearchUserQuery, roleUserFilter, setRoleUserFilter,
        showAddCondoForm, setShowAddCondoForm, editingCondo, setEditingCondo,
        newCondoForm, setNewCondoForm, setCondosList,
        sandboxCondoId, setSandboxCondoId, sandboxModule, setSandboxModule,
        stats, packages
    };

    return (
        <>
            {impersonatedUser && (
                <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-white px-4 py-3 shadow-lg flex items-center justify-between font-sans sticky top-0 z-50 border-b border-orange-500" role="alert">
                    <div className="flex items-center gap-3">
                        <span className="flex h-3 w-3 relative shrink-0" aria-live="polite">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                        </span>
                        <span className="text-sm font-black uppercase tracking-wider">
                            ⚠️ MODO DE IMPERSONACIÓN ACTIVO
                        </span>
                        <span className="hidden md:inline text-xs font-medium border-l border-white/20 pl-3">
                            Estás viendo el portal como: <strong className="font-bold underline">{impersonatedUser.name}</strong> ({impersonatedUser.email}) &bull; Rol: {impersonatedUser.roles?.[0] || 'Residente'}
                        </span>
                    </div>
                    <button
                        onClick={() => setImpersonatedUser(null)}
                        className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 text-xs font-bold rounded-lg transition-all"
                    >
                        ❌ Salir de Impersonación
                    </button>
                </div>
            )}

            {isSuperUsuario && !simulationMode && (
                <SuperUsuarioDashboard
                    user={user}
                    toggleTheme={toggleTheme}
                    darkMode={darkMode}
                    usersList={usersList}
                    setUsersList={setUsersList}
                    condosList={condosList}
                    setCondosList={setCondosList}
                />
            )}

            {isTi && !simulationMode && (
                <TiDashboard {...sharedTiPageProps} />
            )}

            {isAdmin && !simulationMode && (
                <AdminDashboard {...sharedRolePageProps} />
            )}

            {isComite && !simulationMode && (
                <ComiteDashboard {...sharedRolePageProps} />
            )}

            {isColaborador && !simulationMode && (
                <ColaboradorDashboard {...sharedRolePageProps} />
            )}

            {isPropietario && !simulationMode && (
                <PropietarioDashboard {...sharedRolePageProps} />
            )}

            {(!isActuallyAdmin && !isPropietario || simulationMode) && (
                <ResidenteDashboard {...sharedRolePageProps} />
            )}

            {showPaymentModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
                    onClick={() => setShowPaymentModal(false)}
                    role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Escape' || e.key === ' ') setShowPaymentModal(false); }}
                >
                    <div
                        className="relative max-w-sm w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl animate-scale-up font-sans text-slate-800 dark:text-slate-200 text-left"
                        onClick={(e) => e.stopPropagation()}
                    >
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
                                    <span className="text-[9px] font-mono text-brand-green font-bold uppercase tracking-widest">Escaneo QR Bancario Express</span>
                                    <h3 className="text-base font-black">Pagar Gasto Común</h3>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500">Realiza tu transferencia o escanea directamente desde tu App del Banco.</p>
                                </div>

                                <div className="flex flex-col items-center justify-center py-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-800">
                                    <svg className="w-36 h-36 text-slate-950 dark:text-white" viewBox="0 0 100 100" fill="currentColor">
                                        <path d="M5,5 h30 v30 h-30 z M15,15 h10 v10 h-10 z" />
                                        <path d="M65,5 h30 v30 h-30 z M75,15 h10 v10 h-10 z" />
                                        <path d="M5,65 h30 v30 h-30 z M15,75 h10 v10 h-10 z" />
                                        <path d="M45,10 h10 v10 h-10 z M50,30 h10 v10 h-10 z M40,50 h20 v10 h-20 z M45,70 h15 v5 h-15 z M75,45 h10 v15 h-10 z M80,75 h15 v15 h-15 z" />
                                        <circle cx="50" cy="50" r="7" className="text-brand-green" />
                                    </svg>
                                    <span className="text-[9px] text-slate-400 mt-2 font-mono">Doble Enlace Cifrado Local</span>
                                </div>

                                <div className="space-y-2 text-xs">
                                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 block">Datos de Transferencia Manual</span>
                                    <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1 text-[10px] font-mono text-slate-600 dark:text-slate-400">
                                        <div className="flex justify-between"><span>Banco:</span><span className="font-bold text-slate-800 dark:text-slate-200">Banco de la Comunidad</span></div>
                                        <div className="flex justify-between"><span>Tipo:</span><span className="font-bold text-slate-800 dark:text-slate-200">Cuenta Corriente</span></div>
                                        <div className="flex justify-between"><span>N° Cuenta:</span><span className="font-bold text-slate-800 dark:text-slate-200">20260526-99</span></div>
                                        <div className="flex justify-between"><span>RUT:</span><span className="font-bold text-slate-800 dark:text-slate-200">77.777.777-7</span></div>
                                        <div className="flex justify-between text-brand-green font-bold"><span>Monto:</span><span>$165.000 CLP</span></div>
                                    </div>
                                </div>

                                <div className="space-y-1 text-xs">
                                    <label className="text-[9px] text-slate-400 uppercase font-extrabold block">Adjuntar Comprobante (Simulado)</label>
                                    <input
                                        type="file"
                                        onChange={(e) => setPaymentReceiptName(e.target.files[0]?.name || '')}
                                        className="w-full text-[10px] file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:text-[10px] file:font-semibold file:bg-brand-green/15 file:text-brand-green hover:file:bg-brand-green/20 focus:outline-none"
                                    />
                                    {paymentReceiptName && (
                                        <span className="text-[9px] text-emerald-500 font-bold block mt-1">✓ Comprobante listo: {paymentReceiptName}</span>
                                    )}
                                </div>

                                <button
                                    onClick={executeQrPayment}
                                    disabled={isProcessingPayment}
                                    className="w-full py-2.5 bg-brand-green hover:bg-brand-green-dark disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                                >
                                    {isProcessingPayment ? 'Validando Comprobante...' : 'Confirmar Transferencia / Escaneo'}
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-6 space-y-4 animate-scale-up">
                                <div className="h-16 w-16 bg-emerald-500/10 border border-emerald-500/30 text-brand-green rounded-full flex items-center justify-center mx-auto text-3xl">✓</div>
                                <div className="space-y-1">
                                    <h3 className="text-base font-black text-slate-900 dark:text-white">¡Transacción Exitosa!</h3>
                                    <p className="text-[10px] text-slate-500 px-3">Tu pago del Gasto Común de Mayo ha sido registrado en la base de datos local SQLite y validado por administración.</p>
                                </div>
                                <div className="p-3 bg-slate-50 dark:bg-slate-950 border rounded-xl border-slate-100 dark:border-slate-800 max-w-[240px] mx-auto text-[9px] font-mono text-slate-500 space-y-0.5 text-left">
                                    <span className="font-bold block text-slate-700 dark:text-slate-300 border-b pb-1 mb-1">COMPROBANTE DE RECIBO</span>
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
                                    className="px-6 py-2 bg-brand-green hover:bg-brand-green-dark text-white text-xs font-bold rounded-xl shadow transition-colors"
                                >
                                    Volver al Inicio
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showMorosidadModal && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
                    onClick={() => setShowMorosidadModal(false)}
                    role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Escape' || e.key === ' ') setShowMorosidadModal(false); }}
                >
                    <div
                        className="relative max-w-sm w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl animate-scale-up font-sans text-slate-800 dark:text-slate-200 text-left"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowMorosidadModal(false)}
                            className="absolute top-4 right-4 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 text-slate-500 transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="text-center space-y-4">
                            <div className="h-14 w-14 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-full flex items-center justify-center mx-auto text-2xl animate-bounce">🔒</div>
                            <div className="space-y-1.5">
                                <span className="text-[9px] font-mono text-rose-500 font-bold uppercase tracking-widest block">Restricción de Servicios Comunes</span>
                                <h3 className="text-base font-black text-slate-900 dark:text-white">Beneficios Suspendidos</h3>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 px-3">
                                    De acuerdo con el Reglamento de Copropiedad de <strong>{residentCondo}</strong>, las unidades con <strong>3 o más meses</strong> de gastos comunes impagos pierden el acceso a reservas de áreas comunes y automatizaciones de portón.
                                </p>
                            </div>

                            <div className="p-4 bg-rose-50/30 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-950 rounded-2xl text-[10px] space-y-1.5 text-left font-mono">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Unidad Afectada:</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-300">Departamento 202</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Períodos Impagos:</span>
                                    <span className="font-bold text-slate-800 dark:text-slate-300">Marzo, Abril, Mayo 2026</span>
                                </div>
                                <div className="flex justify-between text-rose-600 dark:text-rose-400 font-bold border-t border-rose-100 dark:border-rose-900 pt-1 mt-1">
                                    <span>Saldo en Mora:</span>
                                    <span>$495.000 CLP</span>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setShowMorosidadModal(false)}
                                    className="flex-1 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-xl shadow-sm transition-colors"
                                >
                                    Cerrar
                                </button>
                                <button
                                    onClick={() => {
                                        setShowMorosidadModal(false);
                                        setMobileTab('pagos');
                                    }}
                                    className="flex-1 py-2 bg-brand-error hover:bg-brand-navy-dark text-white text-xs font-bold rounded-xl shadow-md shadow-rose-500/10 transition-colors"
                                >
                                    Ir a Pagar Deuda
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </>
    );
}
