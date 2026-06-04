import { useState } from 'react';

export default function SpatieImpersonator({
    selectedImpCondo,
    setSelectedImpCondo,
    selectedImpRole,
    setSelectedImpRole,
    selectedImpUser,
    setSelectedImpUser,
    condosList = [],
    usersList = [],
    getUserCondoId,
    setAdminCondoId,
    setImpersonatedUser,
    setTerminalLogs
}) {
    const selectedUserObj = selectedImpUser ? usersList.find(u => u.id === Number(selectedImpUser)) : null;

    return (
        <div className="space-y-6 animate-fade-in text-left max-w-4xl mx-auto">
            <div className="bg-slate-900/80 border border-slate-800/80 p-6 md:p-8 rounded-3xl space-y-6 relative overflow-hidden shadow-2xl">
                {/* Decorative gradient overlay */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#00A896]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="border-b border-slate-800 pb-4">
                    <h4 className="text-sm font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
                        👑 Simulador de Impersonación Spatie
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1">
                        Esta consola te permite auditar el comportamiento de la interfaz y la contención de datos simulando la sesión de cualquier usuario del sistema.
                    </p>
                </div>

                {/* Step-by-step interactive filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Step 1: Condo selection */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="h-5 w-5 rounded-full bg-[#00A896]/10 border border-[#00A896]/30 text-[#00A896] flex items-center justify-center text-[10px] font-black font-mono">1</span>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Condominio</label>
                        </div>
                        <select
                            value={selectedImpCondo}
                            onChange={(e) => {
                                setSelectedImpCondo(e.target.value);
                                setSelectedImpUser('');
                            }}
                            className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-xs px-3.5 py-2.5 text-slate-850 dark:text-white focus:outline-none focus:border-[#00A896] hover:border-slate-700 transition-all font-medium focus:ring-0 cursor-pointer"
                        >
                            <option value="all" className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100">Todos los Condominios</option>
                            {condosList.map(c => (
                                <option key={c.id} value={c.id} className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100">{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Step 2: Role selection */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="h-5 w-5 rounded-full bg-[#00A896]/10 border border-[#00A896]/30 text-[#00A896] flex items-center justify-center text-[10px] font-black font-mono">2</span>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rol de Acceso</label>
                        </div>
                        <select
                            value={selectedImpRole}
                            onChange={(e) => {
                                setSelectedImpRole(e.target.value);
                                setSelectedImpUser('');
                            }}
                            className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-xs px-3.5 py-2.5 text-slate-850 dark:text-white focus:outline-none focus:border-[#00A896] hover:border-slate-700 transition-all font-medium focus:ring-0 cursor-pointer"
                        >
                            <option value="all" className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100">Todos los Roles</option>
                            <option value="super_usuario" className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100">Súper Usuario</option>
                            <option value="admin" className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100">Administrador</option>
                            <option value="propietario" className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100">Propietario</option>
                            <option value="resident" className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100">Residente</option>
                            <option value="comite" className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100">Comité</option>
                            <option value="colaborador" className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100">Colaborador</option>
                        </select>
                    </div>

                    {/* Step 3: User selection */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="h-5 w-5 rounded-full bg-[#00A896]/10 border border-[#00A896]/30 text-[#00A896] flex items-center justify-center text-[10px] font-black font-mono">3</span>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Usuario Destino</label>
                        </div>
                        <select
                            value={selectedImpUser}
                            onChange={(e) => setSelectedImpUser(e.target.value)}
                            className="w-full bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-xs px-3.5 py-2.5 text-slate-850 dark:text-white focus:outline-none focus:border-[#00A896] hover:border-slate-700 transition-all font-medium focus:ring-0 cursor-pointer"
                        >
                            <option value="" className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100">Seleccione Usuario...</option>
                            {usersList
                                .filter(u => {
                                    if (selectedImpCondo !== 'all') {
                                        const condoId = getUserCondoId(u);
                                        const isStaff = u.roles?.some(role => 
                                            ['administrador', 'admin', 'comité', 'comite', 'colaborador', 'ti', 'super_usuario', 'súper usuario'].includes(role.toLowerCase())
                                        );
                                        if (!isStaff && condoId !== Number(selectedImpCondo)) return false;
                                    }
                                    if (selectedImpRole !== 'all') {
                                        const r = selectedImpRole.toLowerCase();
                                        const hasRole = u.roles?.some(role => role.toLowerCase() === r || (r === 'admin' && role.toLowerCase() === 'administrador'));
                                        if (!hasRole) return false;
                                    }
                                    return true;
                                })
                                .map(u => (
                                    <option key={u.id} value={u.id} className="bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100">{u.name} ({u.roles[0] || 'Residente'})</option>
                                ))
                            }
                        </select>
                    </div>
                </div>

                {/* Live User Preview Card */}
                {selectedUserObj && (
                    <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 mt-4 flex items-center justify-between gap-4 animate-fade-in text-left">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-[#0F2557] to-[#00A896] flex items-center justify-center font-extrabold text-white text-lg shadow-lg">
                                {selectedUserObj.name.charAt(0)}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <h5 className="text-sm font-bold text-slate-100">{selectedUserObj.name}</h5>
                                    <span className="text-[9px] bg-[#00A896]/10 border border-[#00A896]/30 text-[#00A896] font-extrabold uppercase px-2 py-0.5 rounded">
                                        {selectedUserObj.roles?.[0] || 'Residente'}
                                    </span>
                                    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${
                                        selectedUserObj.status === 'active' 
                                            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                                            : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                                    }`}>
                                        {selectedUserObj.status === 'active' ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-1 font-mono">{selectedUserObj.email} &bull; RUT: {selectedUserObj.rut}</p>
                            </div>
                        </div>
                        <div className="text-right hidden sm:block">
                            <span className="text-[9px] text-slate-500 block uppercase font-bold tracking-wider">Condominio Simulado</span>
                            <span className="text-xs font-bold text-slate-300 block mt-0.5">
                                {selectedImpCondo === 'all' 
                                    ? (condosList.find(c => c.id === getUserCondoId(selectedUserObj))?.name || 'Condominio Alameda Loft')
                                    : (condosList.find(c => c.id === Number(selectedImpCondo))?.name || 'Condominio Alameda Loft')
                                }
                            </span>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-800/80 flex-wrap">
                    <div className="flex items-center gap-2 text-amber-500 text-[10px] font-bold uppercase tracking-wider">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>La simulación genera registros de auditoría local en SQLite</span>
                    </div>
                    
                    <button
                        type="button"
                        onClick={() => {
                            if (!selectedImpUser) return alert('Por favor, seleccione un usuario de la lista.');
                            const targetUser = usersList.find(u => u.id === Number(selectedImpUser));
                            if (targetUser) {
                                if (selectedImpCondo !== 'all') {
                                    setAdminCondoId(Number(selectedImpCondo));
                                } else {
                                    setAdminCondoId(getUserCondoId(targetUser));
                                }
                                setImpersonatedUser(targetUser);
                                setTerminalLogs(prev => [...prev, `[IMPERSONATION] Impersonando a ${targetUser.name} (${targetUser.roles[0]})`]);
                            }
                        }}
                        className="px-6 py-2.5 bg-[#00A896] hover:bg-[#00A896]/80 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-[#00A896]/20 transition-all flex items-center gap-2 duration-200 transform active:scale-95"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                        </svg>
                        <span>💻 ACCEDER A LA VISTA SIMULADA</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
