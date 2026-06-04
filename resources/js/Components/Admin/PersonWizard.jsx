import { useState, useRef, useEffect } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// PersonWizard — Wizard modal de 5 pasos para crear personas/usuarios
// en el sistema de administración de condominios RedVecino / MiVecino
// ─────────────────────────────────────────────────────────────────────────────

/* ── Utilidades ─────────────────────────────────────────────────────────── */

/** Genera una contraseña temporal aleatoria de 8 caracteres */
function generatePassword(len = 8) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#';
    let pwd = '';
    for (let i = 0; i < len; i++) pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    return pwd;
}

/** Genera un username a partir de nombre y apellido */
function generateUsername(nombres, apellidos) {
    const first = (nombres || '').trim().split(/\s+/)[0] || '';
    const last  = (apellidos || '').trim().split(/\s+/)[0] || '';
    return (first + '.' + last).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9.]/g, '');
}

/** Formato de fecha legible */
function todayFormatted() {
    return new Date().toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

/* ── Constantes ─────────────────────────────────────────────────────────── */

const STEP_META = [
    { label: 'Persona',           icon: '👤', color: 'bg-[#0F2557]', ring: 'ring-[#0F2557]', text: 'text-[#0F2557]', btnBg: 'bg-[#0F2557] hover:bg-[#1a3578]' },
    { label: 'Relación',          icon: '🏠', color: 'bg-[#00A896]', ring: 'ring-[#00A896]', text: 'text-[#00A896]', btnBg: 'bg-[#00A896] hover:bg-[#00c4af]' },
    { label: 'Funciones',         icon: '👔', color: 'bg-[#EC7A08]', ring: 'ring-[#EC7A08]', text: 'text-[#EC7A08]', btnBg: 'bg-[#EC7A08] hover:bg-[#f59325]' },
    { label: 'Acceso',            icon: '🔐', color: 'bg-indigo-600', ring: 'ring-indigo-600', text: 'text-indigo-600', btnBg: 'bg-indigo-600 hover:bg-indigo-500' },
    { label: 'Resumen',           icon: '📋', color: 'bg-[#72B043]', ring: 'ring-[#72B043]', text: 'text-[#72B043]', btnBg: 'bg-[#72B043] hover:bg-[#85c155]' },
];

const RELATION_OPTIONS = [
    { id: 'propietario',   label: 'Propietario' },
    { id: 'residente',     label: 'Residente' },
    { id: 'arrendatario',  label: 'Arrendatario' },
    { id: 'familiar',      label: 'Familiar / Autorizado' },
    { id: 'otro',          label: 'Otro' },
];

const ROLE_CARDS = [
    { id: 'colaborador',  label: 'Colaborador',             emoji: '🔧', accent: 'border-[#EC7A08]/40 bg-[#EC7A08]/5',  activeAccent: 'border-[#EC7A08] bg-[#EC7A08]/15 ring-2 ring-[#EC7A08]/30' },
    { id: 'comite',        label: 'Comité Administrativo',   emoji: '🏛️', accent: 'border-indigo-400/40 bg-indigo-50/50 dark:bg-indigo-900/10', activeAccent: 'border-indigo-500 bg-indigo-500/15 ring-2 ring-indigo-500/30' },
    { id: 'admin',         label: 'Administrador',           emoji: '⚙️', accent: 'border-[#7A5299]/40 bg-[#7A5299]/5',  activeAccent: 'border-[#7A5299] bg-[#7A5299]/15 ring-2 ring-[#7A5299]/30' },
    { id: 'proveedor',     label: 'Proveedor Permanente',    emoji: '📦', accent: 'border-teal-400/40 bg-teal-50/50 dark:bg-teal-900/10',   activeAccent: 'border-teal-500 bg-teal-500/15 ring-2 ring-teal-500/30' },
    { id: 'ninguna',       label: 'Ninguna función adicional', emoji: '—', accent: 'border-gray-300/60 bg-gray-50/50 dark:bg-slate-800/40',  activeAccent: 'border-gray-400 bg-gray-200/30 ring-2 ring-gray-400/30' },
];

const CARGO_OPTIONS   = ['Conserje / Recepcionista', 'Auxiliar de Aseo', 'Jardinero', 'Técnico', 'Guardia'];
const AREA_OPTIONS    = ['Seguridad', 'Limpieza', 'Mantenimiento', 'Administración'];
const CONTRATO_OPTIONS = ['Plazo Fijo', 'Indefinido'];

const EXAMPLE_PROFILES = [
    {
        label: 'Propietario que vive en el depto',
        dot: 'bg-emerald-500',
        data: {
            nombres: 'Carlos', apellidos: 'Vergara Soto', rut: '12.345.678-9',
            email: 'carlos.vergara@mail.cl', telefono: '912345678',
            asociada: true, relations: ['propietario', 'residente'],
            role: 'ninguna', hasAccess: true, sendEmail: true,
        },
    },
    {
        label: 'Arrendatario',
        dot: 'bg-blue-500',
        data: {
            nombres: 'María', apellidos: 'López Díaz', rut: '15.678.901-2',
            email: 'maria.lopez@mail.cl', telefono: '987654321',
            asociada: true, relations: ['arrendatario', 'residente'],
            role: 'ninguna', hasAccess: true, sendEmail: true,
        },
    },
    {
        label: 'Colaborador externo (Conserje)',
        dot: 'bg-[#EC7A08]',
        data: {
            nombres: 'Pedro', apellidos: 'Muñoz Rojas', rut: '18.234.567-8',
            email: 'pedro.munoz@mail.cl', telefono: '911223344',
            asociada: false, relations: [],
            role: 'colaborador', cargo: 'Conserje / Recepcionista', area: 'Seguridad',
            tipoContrato: 'Indefinido', externo: true, hasAccess: true, sendEmail: false,
        },
    },
    {
        label: 'Administrador externo',
        dot: 'bg-[#7A5299]',
        data: {
            nombres: 'Andrea', apellidos: 'Fuentes Gil', rut: '10.111.222-3',
            email: 'andrea.fuentes@admin.cl', telefono: '955667788',
            asociada: false, relations: [],
            role: 'admin', hasAccess: true, sendEmail: true,
        },
    },
    {
        label: 'Familiar autorizado',
        dot: 'bg-[#00A896]',
        data: {
            nombres: 'Tomás', apellidos: 'Vergara López', rut: '20.345.678-1',
            email: 'tomas.vergara@mail.cl', telefono: '944556677',
            asociada: true, relations: ['familiar'],
            role: 'ninguna', hasAccess: false, sendEmail: false,
        },
    },
];

/* ── Componente de entrada reutilizable ──────────────────────────────────── */

function InputField({ label, children }) {
    return (
        <div>
            <label className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block mb-1">
                {label}
            </label>
            {children}
        </div>
    );
}

const inputCls = 'w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all placeholder:text-slate-400';
const selectCls = inputCls;

/* ════════════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
   ════════════════════════════════════════════════════════════════════════════ */

export default function PersonWizard({ isOpen, onClose, onSave, condosList = [], propertiesList = [], adminCondoId }) {

    /* ── Estado del wizard ───────────────────────────────────────────────── */
    const [step, setStep] = useState(0);
    const fileRef = useRef(null);

    // Step 1 — Datos personales
    const [photo, setPhoto] = useState(null);
    const [photoPreview, setPhotoPreview] = useState(null);
    const [rut, setRut] = useState('');
    const [nombres, setNombres] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');

    // Step 2 — Relación con la unidad
    const [asociada, setAsociada] = useState(null);   // true | false | null
    const [torre, setTorre] = useState('');
    const [unidad, setUnidad] = useState('');
    const [relations, setRelations] = useState([]);    // array of ids

    // Step 3 — Funciones y roles
    const [roles, setRoles] = useState([]);
    const [cargo, setCargo] = useState('');
    const [area, setArea] = useState('');
    const [fechaIngreso, setFechaIngreso] = useState('');
    const [tipoContrato, setTipoContrato] = useState('');
    const [externo, setExterno] = useState(false);

    // Detalles del Comité
    const [comiteCargo, setComiteCargo] = useState('');
    const [comiteFechaInicio, setComiteFechaInicio] = useState('');
    const [comitePeriodo, setComitePeriodo] = useState('');

    // Detalles del Administrador
    const [adminTipo, setAdminTipo] = useState('');
    const [adminRpa, setAdminRpa] = useState('');
    const [adminFechaContrato, setAdminFechaContrato] = useState('');

    // Detalles del Proveedor
    const [provEmpresa, setProvEmpresa] = useState('');
    const [provRut, setProvRut] = useState('');
    const [provRubro, setProvRubro] = useState('');

    // Step 4 — Acceso al sistema
    const [hasAccess, setHasAccess] = useState(null);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [sendEmail, setSendEmail] = useState(false);

    /* ── Auto-generar username / password cuando se necesiten ────────── */
    useEffect(() => {
        if (hasAccess && !username) {
            setUsername(generateUsername(nombres, apellidos));
        }
        if (hasAccess && !password) {
            setPassword(generatePassword());
        }
    }, [hasAccess]);

    /* ── Reset al cerrar ─────────────────────────────────────────────── */
    function resetAll() {
        setStep(0);
        setPhoto(null); setPhotoPreview(null);
        setRut(''); setNombres(''); setApellidos(''); setEmail(''); setTelefono('');
        setAsociada(null); setTorre(''); setUnidad(''); setRelations([]);
        setRoles([]); setCargo(''); setArea(''); setFechaIngreso(''); setTipoContrato(''); setExterno(false);
        setComiteCargo(''); setComiteFechaInicio(''); setComitePeriodo('');
        setAdminTipo(''); setAdminRpa(''); setAdminFechaContrato('');
        setProvEmpresa(''); setProvRut(''); setProvRubro('');
        setHasAccess(null); setUsername(''); setPassword(''); setSendEmail(false);
    }

    function handleClose() {
        resetAll();
        onClose();
    }

    /* ── Photo handler ───────────────────────────────────────────────── */
    function handlePhotoChange(e) {
        const file = e.target.files?.[0];
        if (file) {
            setPhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => setPhotoPreview(reader.result);
            reader.readAsDataURL(file);
        }
    }

    /* ── Toggle relation checkbox ────────────────────────────────────── */
    function toggleRelation(id) {
        setRelations(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
    }

    /* ── Toggle roles ────────────────────────────────────────────────── */
    function toggleRole(id) {
        if (id === 'ninguna') {
            setRoles(['ninguna']);
            setCargo(''); setArea(''); setFechaIngreso(''); setTipoContrato(''); setExterno(false);
            setComiteCargo(''); setComiteFechaInicio(''); setComitePeriodo('');
            setAdminTipo(''); setAdminRpa(''); setAdminFechaContrato('');
            setProvEmpresa(''); setProvRut(''); setProvRubro('');
        } else {
            setRoles(prev => {
                const filtered = prev.filter(r => r !== 'ninguna');
                const isSelected = filtered.includes(id);
                const next = isSelected ? filtered.filter(r => r !== id) : [...filtered, id];
                if (!next.includes('colaborador')) {
                    setCargo(''); setArea(''); setFechaIngreso(''); setTipoContrato(''); setExterno(false);
                }
                if (!next.includes('comite')) {
                    setComiteCargo(''); setComiteFechaInicio(''); setComitePeriodo('');
                }
                if (!next.includes('admin')) {
                    setAdminTipo(''); setAdminRpa(''); setAdminFechaContrato('');
                }
                if (!next.includes('proveedor')) {
                    setProvEmpresa(''); setProvRut(''); setProvRubro('');
                }
                return next;
            });
        }
    }

    /* ── Ejemplo rápido ──────────────────────────────────────────────── */
    function applyExample(data) {
        setNombres(data.nombres || '');
        setApellidos(data.apellidos || '');
        setRut(data.rut || '');
        setEmail(data.email || '');
        setTelefono(data.telefono || '');
        setAsociada(data.asociada ?? null);
        setRelations(data.relations || []);
        if (data.roles) {
            setRoles(data.roles);
        } else if (data.role) {
            setRoles([data.role]);
        } else {
            setRoles(['ninguna']);
        }
        setCargo(data.cargo || '');
        setArea(data.area || '');
        setTipoContrato(data.tipoContrato || '');
        setExterno(data.externo || false);
        setComiteCargo(data.comiteCargo || '');
        setComiteFechaInicio(data.comiteFechaInicio || '');
        setComitePeriodo(data.comitePeriodo || '');
        setAdminTipo(data.adminTipo || '');
        setAdminRpa(data.adminRpa || '');
        setAdminFechaContrato(data.adminFechaContrato || '');
        setProvEmpresa(data.provEmpresa || '');
        setProvRut(data.provRut || '');
        setProvRubro(data.provRubro || '');
        setHasAccess(data.hasAccess ?? null);
        setSendEmail(data.sendEmail || false);
        setUsername(generateUsername(data.nombres, data.apellidos));
        setPassword(generatePassword());
    }

    /* ── Validación por paso ─────────────────────────────────────────── */
    function isStepCompleted(index) {
        if (index === 0) {
            return !!(rut.trim() && nombres.trim() && apellidos.trim() && email.trim());
        }
        if (index === 1) {
            if (asociada === null) return false;
            if (asociada === false) return true;
            return !!(torre && unidad && relations.length > 0);
        }
        if (index === 2) {
            if (roles.length === 0) return false;
            if (roles.includes('ninguna')) return true;
            
            // If other roles are selected, check their details:
            if (roles.includes('colaborador')) {
                if (!cargo || !area || !fechaIngreso || !tipoContrato) return false;
            }
            if (roles.includes('comite')) {
                if (!comiteCargo || !comitePeriodo || !comiteFechaInicio) return false;
            }
            if (roles.includes('admin')) {
                if (!adminTipo || !adminRpa || !adminFechaContrato) return false;
            }
            if (roles.includes('proveedor')) {
                if (!provEmpresa || !provRut || !provRubro) return false;
            }
            return true;
        }
        if (index === 3) {
            if (hasAccess === null) return false;
            if (hasAccess === false) return true;
            return !!(username.trim() && password.trim());
        }
        return false;
    }

    function canAdvance() {
        return isStepCompleted(step);
    }

    function isFormValid() {
        return isStepCompleted(0) && isStepCompleted(1) && isStepCompleted(2) && isStepCompleted(3);
    }

    /* ── Guardar ─────────────────────────────────────────────────────── */
    function collectData() {
        return {
            photo, rut, nombres, apellidos, email, telefono,
            asociada, torre, unidad, relations,
            roles,
            role: roles.includes('colaborador') ? 'colaborador' : (roles[0] || 'ninguna'),
            cargo, area, fechaIngreso, tipoContrato, externo,
            comiteCargo, comiteFechaInicio, comitePeriodo,
            adminTipo, adminRpa, adminFechaContrato,
            provEmpresa, provRut, provRubro,
            hasAccess, username, password, sendEmail,
            condominioId: adminCondoId,
            createdAt: new Date().toISOString(),
        };
    }

    function handleSave() {
        onSave(collectData());
        handleClose();
    }

    function handleSaveAndNew() {
        onSave(collectData());
        resetAll();
    }

    /* ── Render gate ─────────────────────────────────────────────────── */
    if (!isOpen) return null;

    const sm = STEP_META[step];

    /* ════════════════════════════════════════════════════════════════════
       RENDER
       ════════════════════════════════════════════════════════════════════ */
    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm font-[Montserrat] p-4">
            <div className="relative max-w-3xl w-full h-[680px] max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl animate-scale-up flex flex-col">

                {/* ── Botón cerrar ───────────────────────────────────────── */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-500 dark:text-slate-400 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-all cursor-pointer text-sm font-bold"
                >
                    ✕
                </button>

                {/* ── Stepper de progreso ────────────────────────────────── */}
                <div className="px-8 pt-6 pb-4 border-b border-gray-100 dark:border-slate-800 shrink-0">
                    <div className="flex items-center justify-between max-w-lg mx-auto">
                        {STEP_META.map((s, i) => {
                            const isCompleted = isStepCompleted(i);
                            const isCurrent   = i === step;
                            return (
                                <div key={i} className="flex items-center flex-1 last:flex-none">
                                    {/* Círculo del paso */}
                                    <button
                                        type="button"
                                        onClick={() => setStep(i)}
                                        className="relative flex flex-col items-center gap-1 group transition-all cursor-pointer"
                                    >
                                        <span className={`
                                            w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all
                                            ${isCompleted ? 'bg-[#72B043] text-white shadow-md shadow-green-300/30' : ''}
                                            ${isCurrent   ? `${s.color} text-white shadow-lg shadow-indigo-300/20 ring-4 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ${s.ring}/30 scale-110` : ''}
                                            ${!isCompleted && !isCurrent ? 'bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-slate-600' : ''}
                                        `}>
                                            {isCompleted ? '✓' : s.icon}
                                        </span>
                                        <span className={`text-[9px] font-bold uppercase tracking-wider whitespace-nowrap ${isCurrent ? s.text + ' dark:text-white' : 'text-gray-400 dark:text-slate-600'}`}>
                                            {s.label}
                                        </span>
                                    </button>

                                    {/* Línea conectora */}
                                    {i < STEP_META.length - 1 && (
                                        <div className={`flex-1 mx-2 border-t-2 border-dashed transition-colors ${isStepCompleted(i) ? 'border-[#72B043]' : 'border-gray-200 dark:border-slate-800'}`} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── Contenido del paso (scrollable) ───────────────────── */}
                <div className="flex-1 overflow-y-auto px-8 py-6">

                    {/* ══════════ STEP 1: Datos de la Persona ══════════════ */}
                    {step === 0 && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                                    👤 Datos de la Persona
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                                    Ingresa la información personal básica para el registro.
                                </p>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 space-y-5">
                                {/* Foto */}
                                <div className="flex justify-center">
                                    <button
                                        type="button"
                                        onClick={() => fileRef.current?.click()}
                                        className="relative group cursor-pointer"
                                    >
                                        <div className={`
                                            w-24 h-24 rounded-full border-2 border-dashed border-gray-300 dark:border-slate-700
                                            flex items-center justify-center overflow-hidden
                                            bg-gray-100 dark:bg-slate-800 transition-all
                                            group-hover:border-indigo-400 group-hover:shadow-lg group-hover:shadow-indigo-500/10
                                        `}>
                                            {photoPreview ? (
                                                <img src={photoPreview} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-3xl text-gray-300 dark:text-slate-600">📷</span>
                                            )}
                                        </div>
                                        <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs shadow-lg group-hover:scale-110 transition-transform">
                                            +
                                        </span>
                                        <input
                                            ref={fileRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handlePhotoChange}
                                        />
                                    </button>
                                </div>

                                {/* Campos */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InputField label="RUT / Identificación *">
                                        <input
                                            type="text"
                                            required
                                            value={rut}
                                            onChange={e => setRut(e.target.value)}
                                            placeholder="12.345.678-9"
                                            className={inputCls}
                                        />
                                    </InputField>
                                    <InputField label="Correo Electrónico *">
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="correo@ejemplo.cl"
                                            className={inputCls}
                                        />
                                    </InputField>
                                    <InputField label="Nombres *">
                                        <input
                                            type="text"
                                            required
                                            value={nombres}
                                            onChange={e => setNombres(e.target.value)}
                                            placeholder="Ingresa los nombres"
                                            className={inputCls}
                                        />
                                    </InputField>
                                    <InputField label="Apellidos *">
                                        <input
                                            type="text"
                                            required
                                            value={apellidos}
                                            onChange={e => setApellidos(e.target.value)}
                                            placeholder="Ingresa los apellidos"
                                            className={inputCls}
                                        />
                                    </InputField>
                                    <div className="sm:col-span-2">
                                        <InputField label="Teléfono">
                                            <div className="flex">
                                                <span className="inline-flex items-center px-3 text-xs font-bold text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 border border-r-0 border-gray-300 dark:border-slate-800 rounded-l-xl">
                                                    +56
                                                </span>
                                                <input
                                                    type="text"
                                                    value={telefono}
                                                    onChange={e => setTelefono(e.target.value)}
                                                    placeholder="9 1234 5678"
                                                    className={inputCls + ' rounded-l-none'}
                                                />
                                            </div>
                                        </InputField>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ══════════ STEP 2: Relación con la Unidad ═══════════ */}
                    {step === 1 && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                                    🏠 Relación con la Unidad
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                                    ¿La persona vive o está asociada a una unidad del condominio?
                                </p>
                            </div>

                            {/* Toggle Sí / No */}
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setAsociada(true)}
                                    className={`flex-1 flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                                        asociada === true
                                            ? 'border-[#72B043] bg-[#72B043]/10 ring-2 ring-[#72B043]/20'
                                            : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-gray-300'
                                    }`}
                                >
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${asociada === true ? 'bg-[#72B043] text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}>
                                        ✓
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800 dark:text-white">Sí, está asociada</p>
                                        <p className="text-[10px] text-gray-400 dark:text-slate-500">Tiene una unidad o torre asignada</p>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setAsociada(false); setTorre(''); setUnidad(''); setRelations([]); }}
                                    className={`flex-1 flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                                        asociada === false
                                            ? 'border-red-400 bg-red-50/60 dark:bg-red-900/10 ring-2 ring-red-300/20'
                                            : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-gray-300'
                                    }`}
                                >
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${asociada === false ? 'bg-red-400 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}>
                                        ✕
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800 dark:text-white">No, no está asociada</p>
                                        <p className="text-[10px] text-gray-400 dark:text-slate-500">Personal externo o proveedor</p>
                                    </div>
                                </button>
                            </div>

                            {/* Campos de unidad (solo si asociada = true) */}
                            {asociada === true && (
                                <div className="bg-slate-50 dark:bg-slate-950/50 border border-gray-200 dark:border-slate-800 rounded-2xl p-5 space-y-5 animate-fade-in">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InputField label="Torre / Edificio">
                                            <select
                                                value={torre}
                                                onChange={e => setTorre(e.target.value)}
                                                className={selectCls}
                                            >
                                                <option value="">Seleccionar torre...</option>
                                                <option value="Torre A">Torre A</option>
                                                <option value="Torre B">Torre B</option>
                                                <option value="Torre C">Torre C</option>
                                                {condosList.map((c, i) => {
                                                    const val = typeof c === 'object' && c !== null ? c.name : c;
                                                    return (
                                                        <option key={i} value={val}>{val}</option>
                                                    );
                                                })}
                                            </select>
                                        </InputField>
                                        <InputField label="Unidad / Departamento">
                                            <select
                                                value={unidad}
                                                onChange={e => setUnidad(e.target.value)}
                                                className={selectCls}
                                            >
                                                <option value="">Seleccionar unidad...</option>
                                                {propertiesList.length > 0
                                                    ? propertiesList.map((p, i) => {
                                                        const val = typeof p === 'object' && p !== null ? p.number : p;
                                                        const lbl = typeof p === 'object' && p !== null 
                                                            ? (p.block ? `${p.block} - Depto ${p.number}` : `Depto ${p.number}`) 
                                                            : p;
                                                        return (
                                                            <option key={i} value={val}>{lbl}</option>
                                                        );
                                                    })
                                                    : ['101', '102', '103', '201', '202', '203', '301', '302', '303'].map(u => (
                                                        <option key={u} value={u}>Depto {u}</option>
                                                    ))
                                                }
                                            </select>
                                        </InputField>
                                    </div>

                                    {/* Relaciones */}
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                                            Tipo de relación con la unidad (puede seleccionar varias)
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {RELATION_OPTIONS.map(opt => {
                                                const active = relations.includes(opt.id);
                                                return (
                                                    <button
                                                        key={opt.id}
                                                        type="button"
                                                        onClick={() => toggleRelation(opt.id)}
                                                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                                                            active
                                                                ? 'border-[#00A896] bg-[#00A896]/10 text-[#00A896] dark:text-[#00d4c0] ring-1 ring-[#00A896]/20'
                                                                : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-gray-500 dark:text-slate-400 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        {active && <span className="mr-1.5">✓</span>}
                                                        {opt.label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ══════════ STEP 3: Funciones y Roles ═══════════════ */}
                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in flex-1">
                            <div>
                                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                                    👔 Funciones y Roles
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                                    Selecciona las funciones adicionales que cumple la persona en el condominio (puedes seleccionar varias).
                                </p>
                            </div>

                            {/* Selector de roles (Cards) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {ROLE_CARDS.map(opt => {
                                    const active = roles.includes(opt.id);
                                    const cardStyle = active ? opt.activeAccent : opt.accent;
                                    return (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => toggleRole(opt.id)}
                                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-left flex items-start gap-3 w-full relative ${cardStyle}`}
                                        >
                                            <span className="text-2xl mt-0.5">{opt.emoji}</span>
                                            <div className="flex-1 min-w-0 pr-4">
                                                <div className="flex items-center justify-between gap-1">
                                                    <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{opt.label}</p>
                                                    {active && (
                                                        <span className="shrink-0 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold shadow-sm">
                                                            ✓
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-0.5">
                                                    {opt.id === 'colaborador' && 'Conserje, aseo, mantención'}
                                                    {opt.id === 'comite' && 'Presidente, tesorero, vocales'}
                                                    {opt.id === 'admin' && 'Administración general del edificio'}
                                                    {opt.id === 'proveedor' && 'Empresas de servicios recurrentes'}
                                                    {opt.id === 'ninguna' && 'Solo propietario/residente/arrendatario'}
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Campos adicionales para Colaborador */}
                            {roles.includes('colaborador') && (
                                <div className="bg-[#EC7A08]/5 border border-[#EC7A08]/20 rounded-2xl p-5 space-y-4 animate-fade-in">
                                    <p className="text-[10px] font-bold text-[#EC7A08] uppercase tracking-wider">
                                        🔧 Detalles del Colaborador
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InputField label="Cargo">
                                            <select value={cargo} onChange={e => setCargo(e.target.value)} className={selectCls}>
                                                <option value="">Seleccionar cargo...</option>
                                                {CARGO_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </InputField>
                                        <InputField label="Área">
                                            <select value={area} onChange={e => setArea(e.target.value)} className={selectCls}>
                                                <option value="">Seleccionar área...</option>
                                                {AREA_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                                            </select>
                                        </InputField>
                                        <InputField label="Fecha de Ingreso">
                                            <input
                                                type="date"
                                                value={fechaIngreso}
                                                onChange={e => setFechaIngreso(e.target.value)}
                                                className={inputCls}
                                            />
                                        </InputField>
                                        <InputField label="Tipo de Contrato">
                                            <select value={tipoContrato} onChange={e => setTipoContrato(e.target.value)} className={selectCls}>
                                                <option value="">Seleccionar tipo...</option>
                                                {CONTRATO_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </InputField>
                                    </div>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={externo}
                                            onChange={e => setExterno(e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-[#EC7A08] focus:ring-[#EC7A08] cursor-pointer"
                                        />
                                        <span className="text-xs text-gray-600 dark:text-slate-300 group-hover:text-gray-800 dark:group-hover:text-white transition-colors">
                                            Personal externo (no vive en el condominio)
                                        </span>
                                    </label>
                                </div>
                            )}

                            {/* Campos adicionales para Comité */}
                            {roles.includes('comite') && (
                                <div className="bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-200/50 dark:border-indigo-800/20 rounded-2xl p-5 space-y-4 animate-fade-in">
                                    <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                        🏛️ Detalles del Comité Administrativo
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InputField label="Cargo en el Comité">
                                            <select value={comiteCargo} onChange={e => setComiteCargo(e.target.value)} className={selectCls}>
                                                <option value="">Seleccionar cargo...</option>
                                                <option value="Presidente">Presidente</option>
                                                <option value="Secretario">Secretario</option>
                                                <option value="Tesorero">Tesorero</option>
                                                <option value="Director / Vocal">Director / Vocal</option>
                                            </select>
                                        </InputField>
                                        <InputField label="Duración del Período">
                                            <select value={comitePeriodo} onChange={e => setComitePeriodo(e.target.value)} className={selectCls}>
                                                <option value="">Seleccionar duración...</option>
                                                <option value="1 Año">1 Año</option>
                                                <option value="2 Años">2 Años</option>
                                                <option value="Indefinido">Indefinido</option>
                                            </select>
                                        </InputField>
                                        <div className="sm:col-span-2">
                                            <InputField label="Fecha de Inicio del Período">
                                                <input
                                                    type="date"
                                                    value={comiteFechaInicio}
                                                    onChange={e => setComiteFechaInicio(e.target.value)}
                                                    className={inputCls}
                                                />
                                            </InputField>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Campos adicionales para Administrador */}
                            {roles.includes('admin') && (
                                <div className="bg-purple-50/50 dark:bg-purple-950/10 border border-purple-200/50 dark:border-purple-800/20 rounded-2xl p-5 space-y-4 animate-fade-in">
                                    <p className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                                        ⚙️ Detalles de la Administración
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InputField label="Tipo de Administrador">
                                            <select value={adminTipo} onChange={e => setAdminTipo(e.target.value)} className={selectCls}>
                                                <option value="">Seleccionar tipo...</option>
                                                <option value="Administrador General">Administrador General</option>
                                                <option value="Co-administrador">Co-administrador</option>
                                                <option value="Asistente de Administración">Asistente de Administración</option>
                                            </select>
                                        </InputField>
                                        <InputField label="Registro Nacional (RPA) / ID">
                                            <input
                                                type="text"
                                                value={adminRpa}
                                                onChange={e => setAdminRpa(e.target.value)}
                                                placeholder="RPA-12345-CH"
                                                className={inputCls}
                                            />
                                        </InputField>
                                        <div className="sm:col-span-2">
                                            <InputField label="Fecha de Contratación">
                                                <input
                                                    type="date"
                                                    value={adminFechaContrato}
                                                    onChange={e => setAdminFechaContrato(e.target.value)}
                                                    className={inputCls}
                                                />
                                            </InputField>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Campos adicionales para Proveedor */}
                            {roles.includes('proveedor') && (
                                <div className="bg-teal-50/50 dark:bg-teal-950/10 border border-teal-200/50 dark:border-teal-800/20 rounded-2xl p-5 space-y-4 animate-fade-in">
                                    <p className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                                        📦 Detalles del Proveedor Permanente
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InputField label="Empresa / Razón Social">
                                            <input
                                                type="text"
                                                value={provEmpresa}
                                                onChange={e => setProvEmpresa(e.target.value)}
                                                placeholder="Servicios Integrales Ltda."
                                                className={inputCls}
                                            />
                                        </InputField>
                                        <InputField label="RUT de la Empresa">
                                            <input
                                                type="text"
                                                value={provRut}
                                                onChange={e => setProvRut(e.target.value)}
                                                placeholder="76.543.210-K"
                                                className={inputCls}
                                            />
                                        </InputField>
                                        <div className="sm:col-span-2">
                                            <InputField label="Rubro / Especialidad">
                                                <select value={provRubro} onChange={e => setProvRubro(e.target.value)} className={selectCls}>
                                                    <option value="">Seleccionar rubro...</option>
                                                    <option value="Mantenimiento de Ascensores">Mantenimiento de Ascensores</option>
                                                    <option value="Seguridad / Conserjería Externa">Seguridad / Conserjería Externa</option>
                                                    <option value="Control de Plagas">Control de Plagas</option>
                                                    <option value="Jardinería y Paisajismo">Jardinería y Paisajismo</option>
                                                    <option value="Mantenimiento Bombas / Calderas">Mantenimiento Bombas / Calderas</option>
                                                    <option value="Aseo y Ornato Externo">Aseo y Ornato Externo</option>
                                                </select>
                                            </InputField>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ══════════ STEP 4: Acceso al Sistema ════════════════ */}
                    {step === 3 && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                                    🔐 Acceso al Sistema
                                </h3>
                                <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                                    ¿Tendrá acceso a la plataforma MiVecino?
                                </p>
                            </div>

                            {/* Toggle Sí / No */}
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setHasAccess(true);
                                        if (!username) setUsername(generateUsername(nombres, apellidos));
                                        if (!password) setPassword(generatePassword());
                                    }}
                                    className={`flex-1 flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                                        hasAccess === true
                                            ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-900/10 ring-2 ring-indigo-300/20'
                                            : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-gray-300'
                                    }`}
                                >
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${hasAccess === true ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}>
                                        🔓
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800 dark:text-white">Sí, tendrá acceso</p>
                                        <p className="text-[10px] text-gray-400 dark:text-slate-500">Podrá iniciar sesión en MiVecino</p>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setHasAccess(false); setUsername(''); setPassword(''); setSendEmail(false); }}
                                    className={`flex-1 flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                                        hasAccess === false
                                            ? 'border-gray-400 bg-gray-100/60 dark:bg-slate-800/60 ring-2 ring-gray-300/20'
                                            : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-gray-300'
                                    }`}
                                >
                                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${hasAccess === false ? 'bg-gray-500 text-white' : 'bg-gray-100 dark:bg-slate-800 text-gray-400'}`}>
                                        🔒
                                    </span>
                                    <div>
                                        <p className="text-xs font-bold text-slate-800 dark:text-white">No, sin acceso</p>
                                        <p className="text-[10px] text-gray-400 dark:text-slate-500">Solo registro informativo</p>
                                    </div>
                                </button>
                            </div>

                            {/* Campos de acceso */}
                            {hasAccess === true && (
                                <div className="bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-200 dark:border-indigo-800/30 rounded-2xl p-5 space-y-4 animate-fade-in">
                                    <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                                        🔑 Credenciales de Acceso
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <InputField label="Nombre de Usuario">
                                            <input
                                                type="text"
                                                value={username}
                                                onChange={e => setUsername(e.target.value)}
                                                className={inputCls}
                                                placeholder="usuario.ejemplo"
                                            />
                                        </InputField>
                                        <InputField label="Contraseña Temporal">
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={password}
                                                    readOnly
                                                    className={inputCls + ' font-mono tracking-wider bg-gray-50 dark:bg-slate-950'}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setPassword(generatePassword())}
                                                    className="shrink-0 w-10 h-auto rounded-xl bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 flex items-center justify-center text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-400 transition-all cursor-pointer"
                                                    title="Regenerar contraseña"
                                                >
                                                    🔄
                                                </button>
                                            </div>
                                        </InputField>
                                    </div>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            checked={sendEmail}
                                            onChange={e => setSendEmail(e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                        />
                                        <span className="text-xs text-gray-600 dark:text-slate-300 group-hover:text-gray-800 dark:group-hover:text-white transition-colors">
                                            📧 Enviar acceso por correo electrónico
                                        </span>
                                    </label>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ══════════ STEP 5: Resumen ══════════════════════════ */}
                    {step === 4 && (
                        <div className="space-y-5 animate-fade-in">
                            {/* Badge de confirmación y feedback de campos faltantes */}
                            {!isFormValid() ? (
                                <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-2xl p-5 space-y-3 animate-pulse-subtle">
                                    <div className="flex items-center gap-2">
                                        <span className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center text-sm font-bold shadow-md shadow-rose-300/30">
                                            ⚠
                                        </span>
                                        <p className="text-xs font-bold text-rose-700 dark:text-rose-455">
                                            Información Incompleta. Por favor completa los siguientes campos obligatorios para guardar:
                                        </p>
                                    </div>
                                    <ul className="list-disc list-inside text-[11px] text-rose-600 dark:text-rose-400 space-y-1 pl-2 font-medium">
                                        {!isStepCompleted(0) && (
                                            <li>
                                                <span className="font-bold">👤 Datos de la Persona:</span> RUT, Nombres, Apellidos y Correo son obligatorios.
                                            </li>
                                        )}
                                        {!isStepCompleted(1) && (
                                            <li>
                                                <span className="font-bold">🏠 Relación con la Unidad:</span> Debe definir si está asociada a una unidad. Si está asociada (Sí), debe seleccionar Torre, Unidad/Depto y al menos un tipo de Relación.
                                            </li>
                                        )}
                                        {!isStepCompleted(2) && (
                                            <li>
                                                <span className="font-bold">👔 Funciones y Roles:</span> Debe seleccionar al menos una función (o "Ninguna"). Si selecciona funciones activas (Colaborador, Comité, Administrador o Proveedor), debe completar todos sus campos de detalles obligatorios.
                                            </li>
                                        )}
                                        {!isStepCompleted(3) && (
                                            <li>
                                                <span className="font-bold">🔐 Acceso al Sistema:</span> Debe responder si tendrá acceso. Si tiene acceso (Sí), el usuario y la contraseña no pueden estar vacíos.
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 rounded-xl px-4 py-3">
                                    <span className="w-7 h-7 rounded-full bg-[#72B043] text-white flex items-center justify-center text-sm font-bold shadow-md shadow-emerald-300/30 animate-bounce">
                                        ✓
                                    </span>
                                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                                        ¡Excelente! Registro listo para guardar.
                                    </p>
                                </div>
                            )}

                            {/* Header con datos personales */}
                            <div className="flex items-center gap-4 bg-gradient-to-r from-[#0F2557] to-indigo-700 rounded-2xl p-5 text-white">
                                <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center overflow-hidden shrink-0">
                                    {photoPreview ? (
                                        <img src={photoPreview} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl">👤</span>
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-base font-black truncate">{nombres} {apellidos}</h3>
                                    <p className="text-xs text-indigo-200 font-mono">{rut}</p>
                                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1 text-[10px] text-indigo-300">
                                        <span>📧 {email}</span>
                                        {telefono && <span>📞 +56 {telefono}</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Status badges */}
                            <div className="flex flex-wrap gap-2 text-[10px] font-bold">
                                <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40">
                                    ● Estado: Activo
                                </span>
                                <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700">
                                    📅 Fecha creación: {todayFormatted()}
                                </span>
                                <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/40">
                                    👤 Creado por: Administrador
                                </span>
                            </div>

                            {/* Tab-cards de resumen */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* 🏠 Relación con la Unidad */}
                                <div className="border border-[#00A896]/20 bg-[#00A896]/5 rounded-2xl p-4 space-y-2">
                                    <p className="text-[10px] font-black text-[#00A896] uppercase tracking-wider">🏠 Relación con la Unidad</p>
                                    {asociada ? (
                                        <div className="space-y-1 text-xs text-gray-700 dark:text-slate-300">
                                            {torre && <p><span className="font-bold text-gray-500 dark:text-slate-400">Torre:</span> {torre}</p>}
                                            {unidad && <p><span className="font-bold text-gray-500 dark:text-slate-400">Unidad:</span> Depto {unidad}</p>}
                                            {relations.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {relations.map(r => (
                                                        <span key={r} className="px-2 py-0.5 rounded-lg bg-[#00A896]/10 text-[#00A896] text-[10px] font-bold border border-[#00A896]/20 capitalize">
                                                            {RELATION_OPTIONS.find(o => o.id === r)?.label || r}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-400 dark:text-slate-500 italic">No asociada a unidad</p>
                                    )}
                                </div>

                                {/* 👔 Funciones y Roles */}
                                <div className="border border-[#EC7A08]/20 bg-[#EC7A08]/5 rounded-2xl p-4 space-y-2">
                                    <p className="text-[10px] font-black text-[#EC7A08] uppercase tracking-wider">👔 Funciones y Roles</p>
                                    {roles.length > 0 ? (
                                        <div className="space-y-2 text-xs text-gray-700 dark:text-slate-300">
                                            <div>
                                                <span className="font-bold text-gray-500 dark:text-slate-400">Funciones:</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {roles.map(r => (
                                                        <span key={r} className="px-2 py-0.5 rounded-lg bg-[#EC7A08]/10 text-[#EC7A08] dark:text-orange-400 text-[10px] font-bold border border-[#EC7A08]/20 capitalize">
                                                            {ROLE_CARDS.find(o => o.id === r)?.label || r}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            {/* Detalles del Colaborador */}
                                            {roles.includes('colaborador') && (
                                                <div className="border-t border-[#EC7A08]/15 pt-2 mt-2 space-y-1">
                                                    <p className="text-[9px] font-bold text-[#EC7A08] uppercase">Detalles Colaborador</p>
                                                    {cargo && <p><span className="font-bold text-gray-500 dark:text-slate-400">Cargo:</span> {cargo}</p>}
                                                    {area && <p><span className="font-bold text-gray-500 dark:text-slate-400">Área:</span> {area}</p>}
                                                    {tipoContrato && <p><span className="font-bold text-gray-500 dark:text-slate-400">Contrato:</span> {tipoContrato}</p>}
                                                    {fechaIngreso && <p><span className="font-bold text-gray-500 dark:text-slate-400">Ingreso:</span> {fechaIngreso}</p>}
                                                    {externo && (
                                                        <span className="inline-block mt-0.5 px-2 py-0.5 rounded-lg bg-amber-100 dark:bg-amber-900/20 text-amber-600 text-[10px] font-bold border border-amber-200 dark:border-amber-800/30">
                                                            Externo
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Detalles del Comité */}
                                            {roles.includes('comite') && (
                                                <div className="border-t border-[#EC7A08]/15 pt-2 mt-2 space-y-1">
                                                    <p className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">Detalles Comité</p>
                                                    {comiteCargo && <p><span className="font-bold text-gray-500 dark:text-slate-400">Puesto:</span> {comiteCargo}</p>}
                                                    {comitePeriodo && <p><span className="font-bold text-gray-500 dark:text-slate-400">Período:</span> {comitePeriodo}</p>}
                                                    {comiteFechaInicio && <p><span className="font-bold text-gray-500 dark:text-slate-400">Inicio:</span> {comiteFechaInicio}</p>}
                                                </div>
                                            )}

                                            {/* Detalles del Administrador */}
                                            {roles.includes('admin') && (
                                                <div className="border-t border-[#EC7A08]/15 pt-2 mt-2 space-y-1">
                                                    <p className="text-[9px] font-bold text-purple-600 dark:text-purple-400 uppercase">Detalles Administración</p>
                                                    {adminTipo && <p><span className="font-bold text-gray-500 dark:text-slate-400">Tipo:</span> {adminTipo}</p>}
                                                    {adminRpa && <p><span className="font-bold text-gray-500 dark:text-slate-400">Registro RPA:</span> {adminRpa}</p>}
                                                    {adminFechaContrato && <p><span className="font-bold text-gray-500 dark:text-slate-400">Contrato:</span> {adminFechaContrato}</p>}
                                                </div>
                                            )}

                                            {/* Detalles del Proveedor */}
                                            {roles.includes('proveedor') && (
                                                <div className="border-t border-[#EC7A08]/15 pt-2 mt-2 space-y-1">
                                                    <p className="text-[9px] font-bold text-teal-600 dark:text-teal-400 uppercase">Detalles Proveedor</p>
                                                    {provEmpresa && <p><span className="font-bold text-gray-500 dark:text-slate-400">Empresa:</span> {provEmpresa}</p>}
                                                    {provRut && <p><span className="font-bold text-gray-500 dark:text-slate-400">RUT:</span> {provRut}</p>}
                                                    {provRubro && <p><span className="font-bold text-gray-500 dark:text-slate-400">Rubro:</span> {provRubro}</p>}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-400 dark:text-slate-500 italic">Sin función asignada</p>
                                    )}
                                </div>

                                {/* 🔐 Acceso al Sistema */}
                                <div className="border border-indigo-300/30 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl p-4 space-y-2">
                                    <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">🔐 Acceso al Sistema</p>
                                    {hasAccess ? (
                                        <div className="space-y-1 text-xs text-gray-700 dark:text-slate-300">
                                            <p><span className="font-bold text-gray-500 dark:text-slate-400">Usuario:</span> <span className="font-mono">{username}</span></p>
                                            <p><span className="font-bold text-gray-500 dark:text-slate-400">Contraseña:</span> <span className="font-mono tracking-wider">{password}</span></p>
                                            {sendEmail && (
                                                <span className="inline-block mt-1 px-2 py-0.5 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-600 text-[10px] font-bold border border-blue-200 dark:border-blue-800/30">
                                                    📧 Se enviará por correo
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-400 dark:text-slate-500 italic">Sin acceso al sistema</p>
                                    )}
                                </div>

                                {/* ℹ️ Información Adicional */}
                                <div className="border border-[#7A5299]/20 bg-[#7A5299]/5 rounded-2xl p-4 space-y-2">
                                    <p className="text-[10px] font-black text-[#7A5299] uppercase tracking-wider">ℹ️ Información Adicional</p>
                                    <div className="space-y-1 text-xs text-gray-700 dark:text-slate-300">
                                        <p><span className="font-bold text-gray-500 dark:text-slate-400">Condominio ID:</span> {adminCondoId || '—'}</p>
                                        <p><span className="font-bold text-gray-500 dark:text-slate-400">Foto:</span> {photo ? '✅ Cargada' : '—'}</p>
                                        <p><span className="font-bold text-gray-500 dark:text-slate-400">Teléfono:</span> {telefono ? `+56 ${telefono}` : '—'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* ── Footer con botones de navegación ───────────────────── */}
                <div className="px-8 py-4 border-t border-gray-100 dark:border-slate-800 shrink-0">
                    <div className="flex items-center justify-between">
                        {/* Volver */}
                        <div>
                            {step > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setStep(s => s - 1)}
                                    className="px-4 py-2 text-xs font-bold text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer"
                                >
                                    ← Volver
                                </button>
                            )}
                        </div>

                        {/* Acciones de avance / guardar */}
                        <div className="flex items-center gap-2">
                            {step < 4 ? (
                                <button
                                    type="button"
                                    disabled={!canAdvance()}
                                    onClick={() => setStep(s => s + 1)}
                                    className={`px-5 py-2 text-xs font-bold text-white rounded-xl shadow transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${sm.btnBg}`}
                                >
                                    Continuar →
                                </button>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        disabled={!isFormValid()}
                                        onClick={handleSaveAndNew}
                                        className="px-4 py-2 text-xs font-bold text-gray-600 dark:text-slate-300 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        Guardar y crear otro
                                    </button>
                                    <button
                                        type="button"
                                        disabled={!isFormValid()}
                                        onClick={handleSave}
                                        className="px-5 py-2 text-xs font-bold text-white bg-[#72B043] hover:bg-[#85c155] rounded-xl shadow transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        ✓ Guardar
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
