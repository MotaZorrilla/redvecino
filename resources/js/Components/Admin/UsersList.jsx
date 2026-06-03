import { useState } from 'react';
import { SimpleTable, StatusBadge } from '@/Components/DashboardShared';

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
    setUserSubTab
}) {
    const filteredUsersForSubtab = adminFilteredUsers.filter(u => {
        const isAdmin = u.roles?.some(r => ['admin', 'administrador'].includes(r.toLowerCase()));
        return userSubTab === 'residents' ? !isAdmin : isAdmin;
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
        setNewUserForm({ name: '', rut: '', email: '', phone: '', role: 'resident', status: 'active', password: 'password' });
    };

    return (
        <div className="space-y-6 animate-fade-in text-left">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                        👥 Gestión de Usuarios
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Administra residentes y personal con accesos restringidos.</p>
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="flex bg-gray-100 dark:bg-slate-950 p-1 rounded-lg border border-gray-200 dark:border-slate-800/80 mr-2">
                        <button
                            onClick={() => setUserSubTab('residents')}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${userSubTab === 'residents' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-white shadow' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                            Residentes ({adminFilteredUsers.filter(u => !u.roles?.some(r => ['admin', 'administrador'].includes(r.toLowerCase()))).length})
                        </button>
                        <button
                            onClick={() => setUserSubTab('admins')}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${userSubTab === 'admins' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-white shadow' : 'text-slate-500 dark:text-slate-400'}`}
                        >
                            Administradores ({adminFilteredUsers.filter(u => u.roles?.some(r => ['admin', 'administrador'].includes(r.toLowerCase()))).length})
                        </button>
                    </div>

                    <button
                        onClick={() => {
                            setEditingUser(null);
                            setNewUserForm({ name: '', rut: '', email: '', phone: '', role: userSubTab === 'admins' ? 'admin' : 'resident', status: 'active', password: 'password' });
                            setShowAddUserForm(!showAddUserForm);
                        }}
                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition-all"
                    >
                        {showAddUserForm ? 'Cerrar Form' : 'Añadir Usuario'}
                    </button>
                </div>
            </div>

            {showAddUserForm && (
                <form onSubmit={handleFormSubmit} className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-4 max-w-xl text-left">
                    <h5 className="text-xs font-bold text-gray-800 dark:text-slate-200 uppercase">{editingUser ? '✏️ Editar Usuario' : '👥 Detalles del Usuario'}</h5>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Nombre completo</label>
                            <input
                                type="text"
                                required
                                value={newUserForm.name}
                                onChange={(e) => setNewUserForm(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-955 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">RUT / Identificación</label>
                            <input
                                type="text"
                                required
                                value={newUserForm.rut}
                                onChange={(e) => setNewUserForm(prev => ({ ...prev, rut: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-955 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
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
                                className="w-full bg-white dark:bg-slate-955 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Teléfono</label>
                            <input
                                type="text"
                                value={newUserForm.phone}
                                onChange={(e) => setNewUserForm(prev => ({ ...prev, phone: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-955 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Rol</label>
                            <select
                                value={newUserForm.role}
                                onChange={(e) => setNewUserForm(prev => ({ ...prev, role: e.target.value }))}
                                className="w-full bg-white dark:bg-slate-955 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
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
                                className="w-full bg-white dark:bg-slate-955 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                            >
                                <option value="active">Activo</option>
                                <option value="inactive">Inactivo</option>
                                <option value="suspended">Suspendido</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow">
                            {editingUser ? 'Guardar Cambios' : 'Añadir Usuario'}
                        </button>
                        <button type="button" onClick={() => { setShowAddUserForm(false); setEditingUser(null); }} className="px-4 py-2 bg-gray-200 dark:bg-slate-800 dark:text-white text-gray-700 font-bold text-xs rounded-xl">
                            Cancelar
                        </button>
                    </div>
                </form>
            )}

            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <SimpleTable
                    headers={['Nombre Completo', 'RUT', 'Correo', 'Rol', 'Estado', 'Acciones']}
                    rows={filteredUsersForSubtab.map(u => ({
                        cells: [
                            <span className="font-bold text-gray-900 dark:text-white" key={`name-${u.id}`}>{u.name}</span>,
                            <span className="font-mono text-xs" key={`rut-${u.id}`}>{u.rut}</span>,
                            <span key={`email-${u.id}`}>{u.email}</span>,
                            <span key={`role-${u.id}`} className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 dark:text-indigo-400">
                                {u.roles[0] || 'Residente'}
                            </span>,
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
                                    className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 text-[10px] font-bold rounded-lg transition-all"
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
                                    className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 text-[10px] font-bold rounded-lg transition-all"
                                >
                                    🗑️ Eliminar
                                </button>
                            </div>
                        ]
                    }))}
                    emptyMessage="No hay usuarios en este segmento"
                />
            </div>
        </div>
    );
}
