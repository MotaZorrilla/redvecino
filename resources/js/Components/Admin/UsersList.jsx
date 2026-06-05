import { useState } from 'react';
import { SimpleTable, StatusBadge } from '@/Components/DashboardShared';
import { generatePassword } from '@/utils/helpers';

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
    onOpenWizard
}) {
    const [selectedWorker, setSelectedWorker] = useState(null);
    const [selectedContract, setSelectedContract] = useState(null);
    const [selectedFiniquito, setSelectedFiniquito] = useState(null);

    // Filter based on selected sub-tab
    const filteredUsersForSubtab = adminFilteredUsers.filter(u => {
        const isAd = u.roles?.some(r => ['admin', 'administrador'].includes(r.toLowerCase()));
        const isStaff = u.roles?.some(r => ['colaborador', 'employee'].includes(r.toLowerCase()));
        
        if (userSubTab === 'residents') {
            return !isAd && !isStaff;
        } else if (userSubTab === 'admins') {
            return isAd;
        } else {
            return isStaff;
        }
    });

    const handleFormSubmit = (e) => {
        e.preventDefault();
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
    };

    return (
        <div className="space-y-6 animate-fade-in text-left">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                        👥 Gestión de Usuarios del Condominio
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Administra residentes, administradores y personal colaborador con sus respectivas obligaciones y documentos contables.</p>
                </div>
                
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex bg-gray-100 dark:bg-slate-950 p-1 rounded-lg border border-gray-200 dark:border-slate-800/80 mr-2">
                        <button
                            onClick={() => setUserSubTab('residents')}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${userSubTab === 'residents' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-white shadow' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                            Residentes ({adminFilteredUsers.filter(u => !u.roles?.some(r => ['admin', 'administrador', 'colaborador', 'employee'].includes(r.toLowerCase()))).length})
                        </button>
                        <button
                            onClick={() => setUserSubTab('admins')}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${userSubTab === 'admins' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-white shadow' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                            Administradores ({adminFilteredUsers.filter(u => u.roles?.some(r => ['admin', 'administrador'].includes(r.toLowerCase()))).length})
                        </button>
                        <button
                            onClick={() => setUserSubTab('staff')}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${userSubTab === 'staff' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-white shadow' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                            Colaboradores ({adminFilteredUsers.filter(u => u.roles?.some(r => ['colaborador', 'employee'].includes(r.toLowerCase()))).length})
                        </button>
                    </div>

                    <button
                        onClick={() => {
                            setEditingUser(null);
                            setNewUserForm({ name: '', rut: '', email: '', phone: '', role: userSubTab === 'admins' ? 'admin' : userSubTab === 'staff' ? 'colaborador' : 'resident', status: 'active', password: 'password' });
                            setShowAddUserForm(!showAddUserForm);
                        }}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
                    >
                        {showAddUserForm ? 'Cerrar Form' : 'Añadir Rápido'}
                    </button>
                    {onOpenWizard && (
                        <button
                            onClick={onOpenWizard}
                            className="px-3.5 py-1.5 bg-gradient-to-r from-[#00A896] to-[#72B043] hover:from-[#009886] hover:to-[#629b37] text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                            </svg>
                            Asistente de Creación
                        </button>
                    )}
                </div>
            </div>

            {showAddUserForm && (
                <form onSubmit={handleFormSubmit} className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-4 max-w-xl text-left shadow-sm">
                    <h5 className="text-xs font-bold text-gray-800 dark:text-slate-200 uppercase">{editingUser ? '✏️ Editar Usuario' : '👥 Detalles del Usuario'}</h5>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Nombre completo</label>
                            <input
                                type="text"
                                required
                                value={newUserForm.name}
                                onChange={(e) => setNewUserForm(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">RUT / Identificación</label>
                            <input
                                type="text"
                                required
                                value={newUserForm.rut}
                                onChange={(e) => setNewUserForm(prev => ({ ...prev, rut: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Correo Electrónico</label>
                            <input
                                type="email"
                                required
                                value={newUserForm.email}
                                onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Teléfono</label>
                            <input
                                type="text"
                                value={newUserForm.phone}
                                onChange={(e) => setNewUserForm(prev => ({ ...prev, phone: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Rol</label>
                            <select
                                value={newUserForm.role}
                                onChange={(e) => setNewUserForm(prev => ({ ...prev, role: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                            >
                                <option value="resident">Residente</option>
                                <option value="owner">Propietario</option>
                                <option value="comite">Comité</option>
                                <option value="colaborador">Colaborador</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Estado</label>
                            <select
                                value={newUserForm.status}
                                onChange={(e) => setNewUserForm(prev => ({ ...prev, status: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                            >
                                <option value="active">Activo</option>
                                <option value="inactive">Inactivo</option>
                                <option value="suspended">Suspendido</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer">
                            {editingUser ? 'Guardar Cambios' : 'Añadir Usuario'}
                        </button>
                        <button type="button" onClick={() => { setShowAddUserForm(false); setEditingUser(null); }} className="px-4 py-2 bg-gray-200 dark:bg-slate-800 dark:text-white text-gray-700 font-bold text-xs rounded-xl cursor-pointer">
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
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
                                {u.area && (
                                    <span className="text-[10px] text-gray-500 dark:text-slate-400">
                                        Área: {u.area}
                                    </span>
                                )}
                            </div>,
                            <div className="space-y-0.5 text-[10px]" key={`contrato-${u.id}`}>
                                <div><span className="font-bold text-indigo-500">1º Fijo (3m):</span> Vencido</div>
                                <div><span className="font-bold text-indigo-500">2º Fijo (3m):</span> {u.tipoContrato ? `${u.tipoContrato} (Ingreso: ${u.fechaIngreso || '01/01/2026'})` : 'Vigente (Cierre: 30/06/2026)'}</div>
                            </div>,
                            <div className="flex items-center gap-2 justify-end" key={`act-${u.id}`}>
                                <button
                                    type="button"
                                    onClick={() => setSelectedContract(u)}
                                    className="px-2.5 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/25 text-indigo-600 dark:text-indigo-450 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                                >
                                    📝 Contrato
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedWorker(u)}
                                    className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-emerald-600 dark:text-emerald-450 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                                >
                                    💵 Liquidación
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedFiniquito(u)}
                                    className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-500 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                                >
                                    ❌ Finiquitar
                                </button>
                            </div>
                        ] : [
                            <span className="font-bold text-gray-900 dark:text-white" key={`name-${u.id}`}>{u.name}</span>,
                            <span className="font-mono text-xs" key={`rut-${u.id}`}>{u.rut}</span>,
                            <span key={`email-${u.id}`}>{u.email}</span>,
                            <div key={`role-${u.id}`} className="flex flex-wrap gap-1">
                                {(u.roles || ['Residente']).map(r => (
                                    <span key={r} className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400">
                                        {r}
                                    </span>
                                ))}
                            </div>,
                            <span key={`status-${u.id}`} className={`inline-flex items-center gap-1.5 text-xs ${u.status === 'active' ? 'text-emerald-500' : 'text-slate-500'}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                                <span className="capitalize">{u.status || 'Active'}</span>
                            </span>,
                            <div className="flex items-center gap-2 justify-end" key={`act-${u.id}`}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingUser(u);
                                        setNewUserForm({
                                            name: u.name,
                                            rut: u.rut,
                                            email: u.email,
                                            phone: u.phone || '',
                                            role: u.roles[0] || 'resident',
                                            status: u.status || 'active',
                                            password: ''
                                        });
                                        setShowAddUserForm(true);
                                    }}
                                    className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                                >
                                    ✏️ Editar
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (confirm(`¿Estás seguro de eliminar a ${u.name}?`)) {
                                            setUsersList(prev => prev.filter(item => item.id !== u.id));
                                        }
                                    }}
                                    className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                                >
                                    🗑️ Eliminar
                                </button>
                            </div>
                        ]
                    }))}
                    emptyMessage="No hay usuarios en este segmento"
                />
            </div>

            {/* 📝 CONTRACT MODAL (dos contratos fijos de 3 meses, luego indefinido) */}
            {selectedContract && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSelectedContract(null)}>
                    <div className="relative max-w-3xl w-full bg-white text-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[85vh] border border-gray-100 text-left" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setSelectedContract(null)} className="absolute top-4 right-4 p-2 rounded-xl bg-gray-100 text-gray-500 cursor-pointer">✕</button>
                        <div className="space-y-4 font-serif text-sm">
                            <h3 className="text-center font-bold text-lg border-b pb-3 uppercase tracking-wider font-sans">Contrato Individual de Trabajo</h3>
                            <p className="text-xs text-right font-sans font-semibold text-gray-500">Periodo de Relación: Plazo Fijo Dual</p>
                            
                            <p className="text-justify leading-relaxed">
                                En la comuna de Concepción, a 01 de abril de 2025, entre <strong>CONDOMINIO AIRES DE CHIGUAYANTE II</strong>, 
                                representado por su administrador Sr. <strong>Enrique Tirapegui T.</strong>, en adelante "el empleador", 
                                y don <strong>{selectedContract.name}</strong>, RUT <strong>{selectedContract.rut}</strong>, en adelante "el trabajador", 
                                se ha convenido el siguiente contrato de trabajo:
                            </p>

                            <p className="font-bold uppercase text-xs tracking-wider font-sans text-slate-700">CLÁUSULA PRIMERA: Funciones y Cargo</p>
                            <p className="text-justify leading-relaxed">
                                El trabajador se compromete a desempeñar sus funciones como <strong>Auxiliar de Aseo Full Time y Portería</strong>, 
                                ejecutando las labores de limpieza de áreas comunes, control peatonal, correspondencia y rondas perimetrales según el reglamento interno.
                            </p>

                            <p className="font-bold uppercase text-xs tracking-wider font-sans text-slate-700">CLÁUSULA SEGUNDA: Duración y Regla de Plazo Fijo Dual (zAux)</p>
                            <p className="text-justify leading-relaxed border-l-4 border-indigo-500 pl-4 bg-slate-50 py-2.5 rounded-r-xl font-sans text-xs">
                                De acuerdo con las políticas corporativas del Condominio, la relación laboral se regirá bajo la modalidad de 
                                <strong> dos contratos iniciales de plazo fijo de 3 meses cada uno</strong>. El primer periodo comprende desde el 01/04/2025 al 30/06/2025 (vencido). 
                                El segundo periodo comprende desde el 01/07/2025 al 30/09/2025. Transcurridos exitosamente estos 6 meses totales de prueba dual, 
                                el contrato pasará automáticamente a tener la condición jurídica de <strong>plazo indefinido</strong>.
                            </p>

                            <p className="font-bold uppercase text-xs tracking-wider font-sans text-slate-700">CLÁUSULA TERCERA: Jornada y Remuneración</p>
                            <p className="text-justify leading-relaxed">
                                La jornada de trabajo será de 44 horas semanales. El empleador pagará al trabajador un sueldo base bruto mensual imponible de 
                                <strong> $539.000</strong>, además de asignaciones no imponibles de colación y locomoción.
                            </p>

                            <div className="pt-10 flex justify-around text-center font-sans text-xs">
                                <div>
                                    <div className="w-48 border-t border-slate-400 pt-2">Firma Empleador</div>
                                    <p className="text-[10px] text-gray-400">RUT: 65.219.801-5</p>
                                </div>
                                <div>
                                    <div className="w-48 border-t border-slate-400 pt-2">Firma Trabajador</div>
                                    <p className="text-[10px] text-gray-400">RUT: {selectedContract.rut}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 💵 PAYROLL DEDUCTION MODAL (Liquidación René Ambiado) */}
            {selectedWorker && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSelectedWorker(null)}>
                    <div className="relative max-w-2xl w-full bg-white text-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh] border border-gray-100 text-left font-sans" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setSelectedWorker(null)} className="absolute top-4 right-4 p-2 rounded-xl bg-gray-100 text-gray-500 cursor-pointer">✕</button>
                        
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="flex justify-between items-start border-b pb-4">
                                <div className="text-xs space-y-0.5">
                                    <span className="text-[9px] text-indigo-600 font-extrabold uppercase block tracking-wider">Detalle del Empleador</span>
                                    <p className="font-bold">CONDOMINIO AIRES DE CHIGUAYANTE II</p>
                                    <p className="text-gray-400">Representante: Enrique Tirapegui T. &bull; Esperanza 775</p>
                                    <p className="text-gray-400 font-mono">RUT: 65.247.879-4</p>
                                </div>
                                <div className="text-right">
                                    <h3 className="text-base font-black uppercase text-slate-900 tracking-tight">Liquidación de Remuneraciones</h3>
                                    <span className="inline-block px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[9px] font-black uppercase mt-1">Mes: MARZO / 2026</span>
                                </div>
                            </div>

                            {/* Worker details */}
                            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-gray-150 text-xs">
                                <div className="space-y-1">
                                    <div><span className="text-gray-400 font-bold uppercase text-[9px]">Trabajador:</span> <strong className="text-gray-900">{selectedWorker.name}</strong></div>
                                    <div><span className="text-gray-400 font-bold uppercase text-[9px]">RUT:</span> <strong className="text-gray-900 font-mono">{selectedWorker.rut}</strong></div>
                                    <div><span className="text-gray-400 font-bold uppercase text-[9px]">Fecha Último Contrato:</span> <strong className="text-gray-900">01/04/2025</strong></div>
                                </div>
                                <div className="space-y-1 border-l pl-4 border-gray-200">
                                    <div><span className="text-gray-400 font-bold uppercase text-[9px]">Cargo:</span> <strong className="text-gray-900">Auxiliar de aseo Full Time</strong></div>
                                    <div><span className="text-gray-400 font-bold uppercase text-[9px]">Tipo de Contrato:</span> <strong className="text-gray-900">Indefinido</strong></div>
                                    <div><span className="text-gray-400 font-bold uppercase text-[9px]">Días Trabajados:</span> <strong className="text-gray-900">30 días</strong></div>
                                </div>
                            </div>

                            {/* Calculations Table */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start text-xs">
                                {/* Haberes */}
                                <div className="border border-gray-150 rounded-2xl overflow-hidden shadow-sm bg-white">
                                    <table className="min-w-full divide-y divide-gray-100">
                                        <thead>
                                            <tr className="bg-slate-50 font-black text-slate-700"><th className="px-4 py-2 text-left text-[9px] uppercase font-bold tracking-wider" colSpan={2}>Haberes del Trabajador</th></tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 font-medium">
                                            <tr><td className="px-4 py-2.5 text-left">Sueldo Base (Pactado $539.000)</td><td className="px-4 py-2.5 text-right font-mono font-bold">$539.000</td></tr>
                                            <tr className="bg-slate-50/20"><td className="px-4 py-2 text-left text-[9px] uppercase font-bold text-gray-400" colSpan={2}>Total Haberes Imponibles: $539.000</td></tr>
                                            <tr><td className="px-4 py-2.5 text-left">Asignación de Locomoción</td><td className="px-4 py-2.5 text-right font-mono font-bold">$66.896</td></tr>
                                            <tr><td className="px-4 py-2.5 text-left">Asignación de Colación</td><td className="px-4 py-2.5 text-right font-mono font-bold">$66.896</td></tr>
                                            <tr className="bg-slate-50/20"><td className="px-4 py-2 text-left text-[9px] uppercase font-bold text-gray-400" colSpan={2}>Total Haberes No Imponibles: $133.592</td></tr>
                                            <tr className="bg-slate-100/50 font-black text-slate-900">
                                                <td className="px-4 py-2.5 text-left text-[10px] uppercase">TOTAL DE HABERES BRUTOS</td>
                                                <td className="px-4 py-2.5 text-right font-mono text-xs">$672.592</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Deducciones */}
                                <div className="border border-gray-150 rounded-2xl overflow-hidden shadow-sm bg-white">
                                    <table className="min-w-full divide-y divide-gray-100">
                                        <thead>
                                            <tr className="bg-slate-50 font-black text-slate-700"><th className="px-4 py-2 text-left text-[9px] uppercase font-bold tracking-wider" colSpan={2}>Descuentos y Deducciones</th></tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 font-medium">
                                            <tr><td className="px-4 py-2.5 text-left">Cotización Salud (Fonasa 7.00%)</td><td className="px-4 py-2.5 text-right font-mono font-bold text-rose-600">$37.730</td></tr>
                                            <tr><td className="px-4 py-2.5 text-left">Fondo Pensión (AFP Capital 11.44%)</td><td className="px-4 py-2.5 text-right font-mono font-bold text-rose-600">$61.662</td></tr>
                                            <tr><td className="px-4 py-2.5 text-left">Seguro de Cesantía (AFC 0.60%)</td><td className="px-4 py-2.5 text-right font-mono font-bold text-rose-600">$3.234</td></tr>
                                            <tr className="bg-slate-50/20"><td className="px-4 py-2 text-left text-[9px] uppercase font-bold text-gray-400" colSpan={2}>Total Descuentos Previsionales: $102.626</td></tr>
                                            <tr><td className="px-4 py-2.5 text-left">Otros descuentos adicionales</td><td className="px-4 py-2.5 text-right font-mono font-bold text-rose-600">$0</td></tr>
                                            <tr className="bg-slate-100/50 font-black text-rose-700">
                                                <td className="px-4 py-2.5 text-left text-[10px] uppercase">TOTAL DEDUCCIONES</td>
                                                <td className="px-4 py-2.5 text-right font-mono text-xs">$102.626</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Net Liquido */}
                            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex justify-between items-center text-xs font-black">
                                <span className="text-emerald-800 text-[11px] uppercase tracking-wider">SUELDO LÍQUIDO A PAGAR / TRANSFERENCIA</span>
                                <span className="text-emerald-700 font-mono text-sm font-black">$569.966</span>
                            </div>

                            <p className="text-[10px] italic text-gray-400 leading-snug text-center pt-2">
                                "Certifico que he recibido de mi Empleador Enrique Tirapegui T., a mi total y entera satisfacción el saldo líquido indicado en la presente liquidación, sin tener cargo ni cobro posterior alguno que hacer."
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ❌ FINIQUITO MODAL */}
            {selectedFiniquito && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={() => setSelectedFiniquito(null)}>
                    <div className="relative max-w-3xl w-full bg-white text-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[85vh] border border-gray-100 text-left" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setSelectedFiniquito(null)} className="absolute top-4 right-4 p-2 rounded-xl bg-gray-100 text-gray-500 cursor-pointer">✕</button>
                        <div className="space-y-4 font-serif text-sm">
                            <h3 className="text-center font-bold text-lg border-b pb-3 uppercase tracking-wider font-sans">Acta de Finiquito de Contrato</h3>
                            <p className="text-xs text-right font-sans font-semibold text-rose-500">Estado: Término de Relación Laboral</p>
                            
                            <p className="text-justify leading-relaxed">
                                En la comuna de Concepción, a 31 de marzo de 2026, las partes comparecientes, a saber, 
                                <strong> CONDOMINIO AIRES DE CHIGUAYANTE II</strong>, como empleador, y don <strong>{selectedFiniquito.name}</strong>, 
                                como trabajador, acuerdan de mutuo acuerdo poner término a la relación laboral y firmar el presente finiquito:
                            </p>

                            <p className="font-bold uppercase text-xs tracking-wider font-sans text-slate-700">CÁLCULO DE HABERES PENDIENTES Y LIQUIDACIÓN</p>
                            <div className="border rounded-2xl overflow-hidden font-sans text-xs">
                                <table className="min-w-full divide-y divide-gray-100">
                                    <tbody className="divide-y divide-gray-100">
                                        <tr><td className="px-4 py-2 text-left font-medium">Feriado Proporcional Pendiente (Vacaciones no tomadas)</td><td className="px-4 py-2 text-right font-mono font-bold">$124.300</td></tr>
                                        <tr><td className="px-4 py-2 text-left font-medium">Aguinaldo Fiestas Patrias Proporcional</td><td className="px-4 py-2 text-right font-mono font-bold">$45.000</td></tr>
                                        <tr><td className="px-4 py-2 text-left font-medium">Indemnización por Años de Servicio</td><td className="px-4 py-2 text-right font-mono font-bold">$0 (Relación inferior a 1 año)</td></tr>
                                        <tr className="bg-slate-50 font-bold text-indigo-650">
                                            <td className="px-4 py-2 text-left">TOTAL DE HABERES DE LIQUIDACIÓN DE FINIQUITO</td>
                                            <td className="px-4 py-2 text-right font-mono">$169.300</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <p className="text-justify leading-relaxed">
                                El trabajador manifiesta expresamente que durante el tiempo que prestó servicios al empleador, 
                                este le pagó íntegra y oportunamente todas sus remuneraciones, cotizaciones previsionales, feriados y demás beneficios legales, 
                                no teniendo ninguna reclamación posterior que formular.
                            </p>

                            <div className="pt-10 flex justify-around text-center font-sans text-xs">
                                <div>
                                    <div className="w-48 border-t border-slate-400 pt-2">Firma Empleador</div>
                                </div>
                                <div>
                                    <div className="w-48 border-t border-slate-400 pt-2">Firma Trabajador</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
