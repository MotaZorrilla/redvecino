import { useState } from 'react';
import { SimpleTable, StatusBadge } from '@/Components/DashboardShared';
import { generatePassword } from '@/utils/helpers';
import UnitDetailModal360 from '@/Components/Admin/UnitDetailModal360';
import Modal from '@/Components/Modal';

export default function UsersList({
    adminCondoId,
    adminFilteredUsers = [],
    usersList = [],
    setUsersList,
    newUserForm,
    setNewUserForm,
    showAddUserForm,
    setShowAddUserForm,
    editingUser,
    setEditingUser,
    userSubTab,
    setUserSubTab,
    onOpenWizard,
    activeCondoName = 'Condominio Alameda'
}) {
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [selectedContract, setSelectedContract] = useState(null);
    const [selectedFiniquito, setSelectedFiniquito] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userSearchQuery, setUserSearchQuery] = useState('');
    const [inspectingUnit360, setInspectingUnit360] = useState(null);

    // Estado Ficha de Residentes / Nueva Asignación de Unidad
    const [showResidentForm, setShowResidentForm] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState('');
    const [parkingNumber, setParkingNumber] = useState('');
    const [vehiclePlate, setVehiclePlate] = useState('');
    const [residentNotes, setResidentNotes] = useState('');

    // Listado de Integrantes de la Unidad
    const [members, setMembers] = useState([
        {
            id: 1,
            firstName: 'Pedro',
            lastName: 'Pérez Cardozo',
            rut: '19.345.678-K',
            dob: '1995-05-12',
            age: 31,
            phone: '+56 9 8765 4321',
            email: 'pedro.perez@gmail.com',
            isOwner: true,
            livesHere: true,
            hasPlatformAccess: true
        }
    ]);

    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [editingMember, setEditingMember] = useState(null);
    const [memberForm, setMemberForm] = useState({
        firstName: '', lastName: '', rut: '', dob: '', phone: '', email: '',
        isOwner: false, livesHere: true, hasPlatformAccess: true
    });

    // Calcular edad en base a fecha de nacimiento
    const calculateAge = (dobString) => {
        if (!dobString) return '-';
        const birthDate = new Date(dobString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age > 0 ? age : 0;
    };

    // Filter based on selected sub-tab & search query
    const filteredUsersForSubtab = adminFilteredUsers.filter(u => {
        const isAd = u.roles?.some(r => ['admin', 'administrador'].includes(r.toLowerCase()));
        const isStaff = u.roles?.some(r => ['colaborador', 'employee'].includes(r.toLowerCase()));
        
        let matchesTab = false;
        if (userSubTab === 'residents') {
            matchesTab = !isAd && !isStaff;
        } else if (userSubTab === 'admins') {
            matchesTab = isAd;
        } else {
            matchesTab = isStaff;
        }

        if (!matchesTab) return false;

        if (userSearchQuery) {
            const q = userSearchQuery.toLowerCase();
            const nameMatch = u.name?.toLowerCase().includes(q);
            const rutMatch = u.rut?.toLowerCase().includes(q);
            const emailMatch = u.email?.toLowerCase().includes(q);
            const phoneMatch = u.phone?.toLowerCase().includes(q);
            const roleMatch = u.roles?.some(r => r.toLowerCase().includes(q));
            return nameMatch || rutMatch || emailMatch || phoneMatch || roleMatch;
        }

        return true;
    });

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (editingUser) {
            setUsersList(prev => prev.map(u => u.id === editingUser.id ? {
                ...u,
                name: newUserForm.name,
                rut: newUserForm.rut,
                email: newUserForm.email,
                phone: newUserForm.phone,
                status: newUserForm.status,
                roles: [newUserForm.role]
            } : u));
            setEditingUser(null);
        } else {
            const newU = {
                id: usersList.length > 0 ? Math.max(...usersList.map(u => u.id)) + 1 : 1,
                name: newUserForm.name,
                rut: newUserForm.rut,
                email: newUserForm.email,
                phone: newUserForm.phone,
                status: newUserForm.status,
                roles: [newUserForm.role],
                condominium_id: adminCondoId
            };
            setUsersList(prev => [...prev, newU]);
        }
        setShowAddUserForm(false);
        setNewUserForm({ name: '', rut: '', email: '', phone: '', role: 'resident', status: 'active', password: generatePassword() });
        setIsSubmitting(false);
    };

    // Agregar / Editar Integrante de la Ficha
    const handleOpenMemberModal = (member = null) => {
        if (member) {
            setEditingMember(member);
            setMemberForm({ ...member });
        } else {
            setEditingMember(null);
            setMemberForm({
                firstName: '', lastName: '', rut: '', dob: '', phone: '', email: '',
                isOwner: false, livesHere: true, hasPlatformAccess: true
            });
        }
        setShowAddMemberModal(true);
    };

    const handleSaveMember = (e) => {
        e.preventDefault();
        if (!memberForm.firstName || !memberForm.lastName || !memberForm.rut) return;

        const age = calculateAge(memberForm.dob);

        if (editingMember) {
            setMembers(members.map(m => m.id === editingMember.id ? { ...memberForm, age } : m));
        } else {
            setMembers([...members, { id: Date.now(), ...memberForm, age }]);
        }

        // Si se otorga acceso a plataforma o es residente nuevo, registrarlo en la lista global de usuarios
        if (memberForm.hasPlatformAccess) {
            const fullName = `${memberForm.firstName} ${memberForm.lastName}`.trim();
            const exists = usersList.some(u => u.rut === memberForm.rut);
            if (!exists) {
                setUsersList(prev => [...prev, {
                    id: Date.now(),
                    name: fullName,
                    rut: memberForm.rut,
                    email: memberForm.email || `${memberForm.rut}@redvecino.cl`,
                    phone: memberForm.phone || '+56 9 0000 0000',
                    status: 'active',
                    roles: [memberForm.isOwner ? 'owner' : 'resident'],
                    condominium_id: adminCondoId
                }]);
            }
        }

        setShowAddMemberModal(false);
    };

    const handleDeleteMember = (id) => {
        setMembers(members.filter(m => m.id !== id));
    };

    const [isBannerDismissed, setIsBannerDismissed] = useState(false);

    return (
        <div className="space-y-6 animate-fade-in text-left font-outfit w-full">
            {/* Header Ficha de Residentes */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <span className="text-[10px] font-black uppercase bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 px-3 py-1 rounded-full tracking-wider">
                        🏘️ Gestión de Habitantes y Vehículos
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                        Ficha de Residentes
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Administra los habitantes, estacionamientos e información de vehículos de cada unidad.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <button
                        onClick={() => setShowResidentForm(!showResidentForm)}
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
                    >
                        <span>{showResidentForm ? '✖️' : '➕'}</span>
                        <span>{showResidentForm ? 'Cerrar Ficha' : 'Nueva Asignación'}</span>
                    </button>

                    <button
                        onClick={() => {
                            setUserSubTab('residents');
                            setUserSearchQuery('propietario');
                        }}
                        className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-extrabold text-xs rounded-xl border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-2"
                    >
                        <span>📋</span>
                        <span>Listado de Propietarios</span>
                    </button>
                </div>
            </div>

            {/* FORMULARIO DE NUEVA ASIGNACIÓN DE FICHA DE RESIDENTES */}
            {showResidentForm && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-6 animate-fade-in">
                    {/* SECCIÓN 1: DATOS DE LA UNIDAD, ESTACIONAMIENTO Y VEHÍCULO */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
                            <span className="p-1.5 bg-indigo-500/10 text-indigo-500 rounded-lg">🚗</span>
                            <span>Datos de la Unidad, Estacionamiento y Vehículo</span>
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                            <div>
                                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Seleccionar Unidad *</label>
                                <select
                                    value={selectedUnit}
                                    onChange={(e) => setSelectedUnit(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                                >
                                    <option value="">Seleccione una unidad...</option>
                                    <option value="101-A">Depto 101 (Torre A)</option>
                                    <option value="102-A">Depto 102 (Torre A)</option>
                                    <option value="201-A">Depto 201 (Torre A)</option>
                                    <option value="202-A">Depto 202 (Torre A)</option>
                                    <option value="PH-01">Penthouse 01 (Torre A)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Número de Estacionamiento</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Estac. 15, Subt 2 o N/A"
                                    value={parkingNumber}
                                    onChange={(e) => setParkingNumber(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Patente / Placa del Vehículo</label>
                                <input
                                    type="text"
                                    placeholder="Ej: AB-CD-12"
                                    value={vehiclePlate}
                                    onChange={(e) => setVehiclePlate(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-mono font-black uppercase text-indigo-600 dark:text-indigo-400 focus:ring-2 focus:ring-indigo-500 text-sm"
                                />
                            </div>

                            <div className="md:col-span-3">
                                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Referencias u Observaciones</label>
                                <textarea
                                    rows="2"
                                    placeholder="Ej: Mascotas permitidas, arrendatarios, etc. (Máximo 3 líneas)"
                                    value={residentNotes}
                                    onChange={(e) => setResidentNotes(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 text-xs"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN 2: INTEGRANTES Y RESIDENTES DE LA UNIDAD */}
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                <span className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg">👨‍👩‍👧‍👦</span>
                                <span>Integrantes y Residentes de la Unidad</span>
                            </h3>

                            <button
                                type="button"
                                onClick={() => handleOpenMemberModal()}
                                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                            >
                                <span>➕</span>
                                <span>Agregar Integrante</span>
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[950px]">
                                <thead>
                                    <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase text-slate-400">
                                        <th className="py-2.5 px-3">Nombres y Apellidos *</th>
                                        <th className="py-2.5 px-3">RUT *</th>
                                        <th className="py-2.5 px-3">F. Nacimiento</th>
                                        <th className="py-2.5 px-3">Edad</th>
                                        <th className="py-2.5 px-3">Contacto</th>
                                        <th className="py-2.5 px-3 text-center">Dueño / Prop.</th>
                                        <th className="py-2.5 px-3 text-center">¿Vive aquí?</th>
                                        <th className="py-2.5 px-3 text-center">Acceso Plat.</th>
                                        <th className="py-2.5 px-3 text-right">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                                    {members.map(m => (
                                        <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                                            <td className="py-2.5 px-3 font-black text-slate-900 dark:text-white">
                                                {m.firstName} {m.lastName}
                                            </td>
                                            <td className="py-2.5 px-3 font-mono font-bold text-slate-600 dark:text-slate-300">{m.rut}</td>
                                            <td className="py-2.5 px-3 font-mono text-slate-500">{m.dob || 'dd/mm/aaaa'}</td>
                                            <td className="py-2.5 px-3 font-bold text-indigo-600 dark:text-indigo-400">{m.age !== '-' ? `${m.age} años` : '-'}</td>
                                            <td className="py-2.5 px-3 space-y-0.5">
                                                <div className="font-mono text-[11px] text-slate-700 dark:text-slate-300">{m.phone || 's/n'}</div>
                                                <div className="text-[10px] text-slate-400">{m.email || 's/n'}</div>
                                            </td>
                                            <td className="py-2.5 px-3 text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                                    m.isOwner
                                                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                                }`}>
                                                    {m.isOwner ? 'Sí' : 'No'}
                                                </span>
                                            </td>
                                            <td className="py-2.5 px-3 text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                                    m.livesHere
                                                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                                }`}>
                                                    {m.livesHere ? 'Sí' : 'No'}
                                                </span>
                                            </td>
                                            <td className="py-2.5 px-3 text-center">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                                    m.hasPlatformAccess
                                                        ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                                }`}>
                                                    {m.hasPlatformAccess ? 'Concedido' : 'Sin Acceso'}
                                                </span>
                                            </td>
                                            <td className="py-2.5 px-3 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => handleOpenMemberModal(m)}
                                                        className="p-1 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-lg"
                                                        title="Editar integrante"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteMember(m.id)}
                                                        className="p-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-lg"
                                                        title="Eliminar integrante"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Sub-pestañas con Subrayado Activo */}
            <div className="flex border-b border-gray-200 dark:border-slate-800/80 w-full overflow-x-auto">
                <button
                    onClick={() => setUserSubTab('residents')}
                    className={`px-5 py-3 font-bold text-xs uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
                        userSubTab === 'residents'
                            ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 font-extrabold'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    🏠 Residentes & Copropietarios ({adminFilteredUsers.filter(u => !u.roles?.some(r => ['admin', 'administrador', 'colaborador', 'employee'].includes(r.toLowerCase()))).length})
                </button>
                <button
                    onClick={() => setUserSubTab('admins')}
                    className={`px-5 py-3 font-bold text-xs uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
                        userSubTab === 'admins'
                            ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 font-extrabold'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    👑 Administradores ({adminFilteredUsers.filter(u => u.roles?.some(r => ['admin', 'administrador'].includes(r.toLowerCase()))).length})
                </button>
                <button
                    onClick={() => setUserSubTab('staff')}
                    className={`px-5 py-3 font-bold text-xs uppercase tracking-wider transition-all border-b-2 whitespace-nowrap ${
                        userSubTab === 'staff'
                            ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 font-extrabold'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    👷 Personal Colaborador ({adminFilteredUsers.filter(u => u.roles?.some(r => ['colaborador', 'employee'].includes(r.toLowerCase()))).length})
                </button>
            </div>

            {/* Barra de Búsqueda y Acciones a Ancho Completo */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
                <div className="relative flex-1 min-w-[240px]">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 text-xs">🔍</span>
                    <input
                        type="text"
                        placeholder="Buscar residente por nombre, RUT, email..."
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            setEditingUser(null);
                            setNewUserForm({ name: '', rut: '', email: '', phone: '', role: 'resident', status: 'active', password: generatePassword() });
                            setShowAddUserForm(!showAddUserForm);
                        }}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                        <span>{showAddUserForm ? '✖️' : '➕'}</span>
                        <span>{showAddUserForm ? 'Cerrar Formulario' : 'Nuevo Usuario'}</span>
                    </button>
                </div>
            </div>

            {/* TABLA PRINCIPAL DE USUARIOS */}
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
                <SimpleTable
                    headers={
                        userSubTab === 'staff' 
                            ? ['Nombre Completo', 'RUT', 'Correo', 'Cargo / Función', 'Contratos', 'Acciones Laborales']
                            : ['Nombre Completo', 'RUT', 'Correo', 'Rol', 'Estado', 'Acciones']
                    }
                    rows={filteredUsersForSubtab.map(u => ({
                        cells: userSubTab === 'staff' ? [
                            <span className="font-bold text-gray-900 dark:text-white" key={`name-${u.id}`}>{u.name}</span>,
                            <span className="font-mono text-xs" key={`rut-${u.id}`}>{u.rut}</span>,
                            <span key={`email-${u.id}`}>{u.email}</span>,
                            <div key={`cargo-${u.id}`} className="flex flex-col">
                                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                                    {u.cargo || 'Auxiliar de Aseo / Portería'}
                                </span>
                            </div>,
                            <div className="space-y-0.5 text-[10px]" key={`contrato-${u.id}`}>
                                <div><span className="font-bold text-indigo-500">1º Fijo (3m):</span> Vencido</div>
                                <div><span className="font-bold text-indigo-500">2º Fijo (3m):</span> Vigente</div>
                            </div>,
                            <div className="flex items-center gap-2 justify-end" key={`act-${u.id}`}>
                                <button
                                    type="button"
                                    onClick={() => setSelectedWorker(u)}
                                    className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-500/25 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-lg"
                                >
                                    📄 Ficha
                                </button>
                            </div>
                        ] : [
                            <button
                                key={`name-${u.id}`}
                                type="button"
                                onClick={() => setInspectingUnit360({
                                    number: u.property_id || u.property?.number || '101',
                                    type: 'apartment',
                                    block: 'Torre A',
                                    floor: 1
                                })}
                                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline text-left cursor-pointer"
                            >
                                {u.name}
                            </button>,
                            <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300" key={`rut-${u.id}`}>{u.rut}</span>,
                            <span key={`email-${u.id}`}>{u.email}</span>,
                            <span className="capitalize font-bold text-indigo-600 dark:text-indigo-400" key={`role-${u.id}`}>
                                {u.roles?.[0] || 'Residente'}
                            </span>,
                            <StatusBadge key={`status-${u.id}`} status={u.status || 'active'} />,
                            <div className="flex items-center gap-1.5 justify-end" key={`actions-${u.id}`}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingUser(u);
                                        setNewUserForm({
                                            name: u.name,
                                            rut: u.rut,
                                            email: u.email,
                                            phone: u.phone || '',
                                            role: u.roles?.[0] || 'resident',
                                            status: u.status || 'active',
                                            password: ''
                                        });
                                        setShowAddUserForm(true);
                                    }}
                                    className="p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 text-slate-600 dark:text-slate-300 hover:text-indigo-600 text-xs font-bold rounded-lg transition-colors"
                                    title="Editar usuario"
                                >
                                    ✏️
                                </button>
                            </div>
                        ]
                    }))}
                />
            </div>

            {/* MODAL AGREGAR / EDITAR INTEGRANTE DE LA UNIDAD */}
            {showAddMemberModal && (
                <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <form onSubmit={handleSaveMember} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl max-w-lg w-full text-left space-y-4 shadow-2xl">
                        <h3 className="text-base font-black text-slate-900 dark:text-white">
                            {editingMember ? '✏️ Editar Integrante de la Unidad' : '➕ Agregar Integrante a la Unidad'}
                        </h3>

                        <div className="space-y-3 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Nombres *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Nombres"
                                        value={memberForm.firstName}
                                        onChange={(e) => setMemberForm({ ...memberForm, firstName: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Apellidos *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Apellidos"
                                        value={memberForm.lastName}
                                        onChange={(e) => setMemberForm({ ...memberForm, lastName: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">RUT *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ej: 19.345.678-K"
                                        value={memberForm.rut}
                                        onChange={(e) => setMemberForm({ ...memberForm, rut: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-mono font-bold text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Fecha Nacimiento *</label>
                                    <input
                                        type="date"
                                        required
                                        value={memberForm.dob}
                                        onChange={(e) => setMemberForm({ ...memberForm, dob: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Teléfono (Opcional)</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: +56 9 8765 4321"
                                        value={memberForm.phone}
                                        onChange={(e) => setMemberForm({ ...memberForm, phone: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Email (Opcional)</label>
                                    <input
                                        type="email"
                                        placeholder="Ej: user@mail.com"
                                        value={memberForm.email}
                                        onChange={(e) => setMemberForm({ ...memberForm, email: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            {/* Opciones Checkbox de Rol y Estado de Habitante */}
                            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={memberForm.isOwner}
                                        onChange={(e) => setMemberForm({ ...memberForm, isOwner: e.target.checked })}
                                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="font-bold text-slate-800 dark:text-slate-200">Dueño / Copropietario Titular</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={memberForm.livesHere}
                                        onChange={(e) => setMemberForm({ ...memberForm, livesHere: e.target.checked })}
                                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    <span className="font-bold text-slate-800 dark:text-slate-200">¿Vive actualmente en la unidad?</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={memberForm.hasPlatformAccess}
                                        onChange={(e) => setMemberForm({ ...memberForm, hasPlatformAccess: e.target.checked })}
                                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="font-bold text-slate-800 dark:text-slate-200">Conceder Acceso a la Plataforma RedVecino</span>
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                            <button type="button" onClick={() => setShowAddMemberModal(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-xl">Cancelar</button>
                            <button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-black text-xs rounded-xl shadow-lg">Guardar Integrante</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Modal Ficha Técnica 360° */}
            {inspectingUnit360 && (
                <UnitDetailModal360
                    inspectingUnit={inspectingUnit360}
                    onClose={() => setInspectingUnit360(null)}
                    allProperties={[]}
                    allFines={[]}
                    allTickets={[]}
                    allUsers={usersList}
                    allPayments={[]}
                    activeCondoName={activeCondoName}
                />
            )}
        </div>
    );
}
