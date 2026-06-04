import { useState } from 'react';

export default function GlobalUsersTable({
    usersList = [],
    setUsersList,
    searchUserQuery,
    setSearchUserQuery,
    roleUserFilter,
    setRoleUserFilter,
    showAddUserForm,
    setShowAddUserForm,
    editingUser,
    setEditingUser,
    newUserForm,
    setNewUserForm,
    setImpersonatedUser,
    setTerminalLogs
}) {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Registro de Usuarios */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button
                        onClick={() => {
                            setEditingUser(null);
                            setNewUserForm({ name: '', rut: '', email: '', phone: '', role: 'resident', status: 'active', password: 'password' });
                            setShowAddUserForm(!showAddUserForm);
                        }}
                        className="px-4 py-2 bg-indigo-600 hover:bg-[#00A896] text-white font-bold text-xs rounded-xl shadow-lg transition-all shrink-0"
                    >
                        {showAddUserForm ? 'Cerrar Form' : 'Crear Usuario'}
                    </button>
                    <input
                        type="text"
                        value={searchUserQuery}
                        onChange={(e) => setSearchUserQuery(e.target.value)}
                        placeholder="Buscar por Nombre, RUT..."
                        className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00A896] w-full md:w-64"
                    />
                    <select
                        value={roleUserFilter}
                        onChange={(e) => setRoleUserFilter(e.target.value)}
                        className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#00A896]"
                    >
                        <option value="all">Todos los Roles</option>
                        <option value="ti">TI</option>
                        <option value="super_usuario">Súper Usuario</option>
                        <option value="admin">Administrador</option>
                        <option value="resident">Residente</option>
                        <option value="owner">Propietario</option>
                        <option value="comite">Comité</option>
                        <option value="colaborador">Colaborador</option>
                    </select>
                </div>
            </div>

            {showAddUserForm && (
                <form onSubmit={(e) => {
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
                        setTerminalLogs(prev => [...prev, `[USER] Actualizado usuario #${editingUser.id}: ${newUserForm.name}`]);
                        setEditingUser(null);
                    } else {
                        const newU = {
                            id: usersList.length > 0 ? Math.max(...usersList.map(u => u.id)) + 1 : 1,
                            name: newUserForm.name,
                            rut: newUserForm.rut,
                            email: newUserForm.email,
                            phone: newUserForm.phone,
                            status: newUserForm.status,
                            roles: [newUserForm.role]
                        };
                        setUsersList(prev => [...prev, newU]);
                        setTerminalLogs(prev => [...prev, `[USER] Creado usuario #${newU.id}: ${newU.name} con rol ${newUserForm.role}`]);
                    }
                    setShowAddUserForm(false);
                    setNewUserForm({ name: '', rut: '', email: '', phone: '', role: 'resident', status: 'active', password: 'password' });
                }} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-4 max-w-xl text-left mb-6">
                    <h5 className="text-xs font-bold text-slate-300 uppercase">{editingUser ? '✏️ Editar Usuario' : 'Detalles del Usuario'}</h5>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Nombre completo</label>
                            <input
                                type="text"
                                required
                                value={newUserForm.name}
                                onChange={(e) => setNewUserForm(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs px-3 py-2 text-white focus:outline-none focus:border-[#00A896]"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">RUT / Identificación</label>
                            <input
                                type="text"
                                required
                                value={newUserForm.rut}
                                onChange={(e) => setNewUserForm(prev => ({ ...prev, rut: e.target.value }))}
                                className="w-full bg-slate-955 border border-slate-800 rounded-xl text-xs px-3 py-2 text-white focus:outline-none focus:border-[#00A896]"
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
                                className="w-full bg-slate-955 border border-slate-800 rounded-xl text-xs px-3 py-2 text-white focus:outline-none focus:border-[#00A896]"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Teléfono</label>
                            <input
                                type="text"
                                required
                                value={newUserForm.phone}
                                onChange={(e) => setNewUserForm(prev => ({ ...prev, phone: e.target.value }))}
                                className="w-full bg-slate-955 border border-slate-800 rounded-xl text-xs px-3 py-2 text-white focus:outline-none focus:border-[#00A896]"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Rol</label>
                            <select
                                value={newUserForm.role}
                                onChange={(e) => setNewUserForm(prev => ({ ...prev, role: e.target.value }))}
                                className="w-full bg-slate-955 border border-slate-800 rounded-xl text-xs px-3 py-2 text-white focus:outline-none focus:border-[#00A896] cursor-pointer"
                            >
                                <option value="ti">TI</option>
                                <option value="super_usuario">Súper Usuario</option>
                                <option value="admin">Administrador</option>
                                <option value="resident">Residente</option>
                                <option value="owner">Propietario</option>
                                <option value="comite">Comité</option>
                                <option value="colaborador">Colaborador</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Estado</label>
                            <select
                                value={newUserForm.status}
                                onChange={(e) => setNewUserForm(prev => ({ ...prev, status: e.target.value }))}
                                className="w-full bg-slate-955 border border-slate-800 rounded-xl text-xs px-3 py-2 text-white focus:outline-none focus:border-[#00A896] cursor-pointer"
                            >
                                <option value="active">Activo</option>
                                <option value="inactive">Inactivo</option>
                                <option value="suspended">Suspendido</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="px-4 py-2 bg-[#00A896] hover:bg-[#00A896]/80 text-white font-bold text-xs rounded-xl shadow-md transition-all">
                        Guardar Usuario
                    </button>
                </form>
            )}

            <div className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden shadow-inner">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="bg-slate-950 text-slate-500 border-b border-slate-800">
                                <th className="p-4 font-black text-left">Nombre completo</th>
                                <th className="p-4 font-black text-left">RUT / Identificación</th>
                                <th className="p-4 font-black text-left">Correo Electrónico</th>
                                <th className="p-4 font-black text-left">Rol Principal</th>
                                <th className="p-4 font-black text-left">Estado</th>
                                <th className="p-4 font-black text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300">
                            {usersList
                                .filter(u => {
                                    const matchesSearch = u.name.toLowerCase().includes(searchUserQuery.toLowerCase()) || u.rut.includes(searchUserQuery);
                                    if (roleUserFilter === 'all') return matchesSearch;
                                    return matchesSearch && u.roles?.some(r => r.toLowerCase() === roleUserFilter.toLowerCase());
                                })
                                .map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-900/60">
                                        <td className="p-4 font-bold text-slate-100 text-left">{u.name}</td>
                                        <td className="p-4 font-mono text-left">{u.rut}</td>
                                        <td className="p-4 text-left">{u.email}</td>
                                        <td className="p-4 text-left">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                                                u.roles?.includes('ti')
                                                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                                                    : u.roles?.includes('admin') || u.roles?.includes('administrador')
                                                    ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
                                                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                            }`}>
                                                {u.roles?.[0] || 'Residente'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-left">
                                            <span className="inline-flex items-center gap-1">
                                                <span className={`h-1.5 w-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-500' : 'bg-slate-500'}`} />
                                                <span className="capitalize">{u.status}</span>
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setImpersonatedUser(u);
                                                        setTerminalLogs(prev => [...prev, `[IMPERSONATION] Iniciando sesión como usuario: ${u.name}`]);
                                                    }}
                                                    className="px-2.5 py-1 bg-[#00A896]/10 hover:bg-[#00A896]/20 border border-[#00A896]/30 text-[#00A896] text-[10px] font-bold rounded-lg transition-all"
                                                >
                                                    💻 Impersonar
                                                </button>
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
                                                    className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] font-bold rounded-lg transition-all"
                                                >
                                                    ✏️ Editar
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (confirm(`¿Estás seguro de eliminar el usuario ${u.name}?`)) {
                                                            setUsersList(prev => prev.filter(item => item.id !== u.id));
                                                            setTerminalLogs(prev => [...prev, `[DELETE] Usuario eliminado: ${u.name} (ID: ${u.id})`]);
                                                        }
                                                    }}
                                                    className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[10px] font-bold rounded-lg transition-all"
                                                >
                                                    🗑️ Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
