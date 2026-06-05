import { useState } from 'react';
import { Link, Head } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function SuperUsuarioLayout({
    user,
    toggleTheme,
    darkMode,
    usersList = [],
    setUsersList,
    condosList = [],
    setCondosList
}) {
    const [activeTab, setActiveTab] = useState('admins'); // 'admins' or 'condos'
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [formInputs, setFormInputs] = useState({ name: '', email: '', rut: '', phone: '', status: 'active' });

    // Filter only Admin users
    const adminUsers = usersList.filter(u => u.roles?.some(r => ['admin', 'administrador'].includes(r.toLowerCase())));

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (editingAdmin) {
            setUsersList(prev => prev.map(u => u.id === editingAdmin.id ? {
                ...u,
                name: formInputs.name,
                email: formInputs.email,
                rut: formInputs.rut,
                phone: formInputs.phone,
                status: formInputs.status
            } : u));
            setEditingAdmin(null);
        } else {
            const newAdmin = {
                id: usersList.length > 0 ? Math.max(...usersList.map(u => u.id)) + 1 : 1,
                name: formInputs.name,
                email: formInputs.email,
                rut: formInputs.rut,
                phone: formInputs.phone,
                status: formInputs.status,
                roles: ['Administrador']
            };
            setUsersList(prev => [...prev, newAdmin]);
        }
        setShowAddForm(false);
        setFormInputs({ name: '', email: '', rut: '', phone: '', status: 'active' });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col md:flex-row relative w-full font-sans text-gray-700 dark:text-slate-200">
            <Head>
                <title>Portal Súper Usuario - RedVecino SaaS</title>
                <meta name="description" content="Portal de control comercial de RedVecino." />
            </Head>

            {/* 1. LEFT SIDEBAR */}
            <div className={`w-64 bg-slate-950 dark:bg-slate-950 text-white p-6 flex flex-col justify-between shrink-0 font-sans md:flex transition-transform duration-300 absolute md:relative inset-y-0 left-0 z-45 md:translate-x-0 ${isMobileSidebarOpen ? 'flex translate-x-0' : 'hidden -translate-x-full md:flex'}`}>
                <div className="space-y-6 text-left">
                    {/* Logo */}
                    <ApplicationLogo size="small" showSubtext={false} brand="superusuario" />

                    {/* Sidebar Tabs */}
                    <nav className="space-y-1">
                        <button
                            type="button"
                            onClick={() => { setActiveTab('admins'); setIsMobileSidebarOpen(false); }}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group flex flex-col gap-0.5 border ${activeTab === 'admins' ? 'bg-indigo-600/20 border-indigo-500/50 text-white shadow-md' : 'border-transparent hover:bg-slate-900 text-slate-400 hover:text-slate-200'}`}
                        >
                            <span className={`text-xs font-bold ${activeTab === 'admins' ? 'text-indigo-400' : 'text-slate-300'}`}>👤 Administradores</span>
                            <span className="text-[9px] text-slate-500 font-medium">Crear y gestionar cuentas de Admin</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => { setActiveTab('condos'); setIsMobileSidebarOpen(false); }}
                            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group flex flex-col gap-0.5 border ${activeTab === 'condos' ? 'bg-indigo-600/20 border-indigo-500/50 text-white shadow-md' : 'border-transparent hover:bg-slate-900 text-slate-400 hover:text-slate-200'}`}
                        >
                            <span className={`text-xs font-bold ${activeTab === 'condos' ? 'text-indigo-400' : 'text-slate-300'}`}>🏢 Condominios Globales</span>
                            <span className="text-[9px] text-slate-500 font-medium">Vista general de comunidades</span>
                        </button>
                    </nav>
                </div>

                {/* Profile Widget */}
                <div className="bg-slate-900/60 border border-slate-800 p-3 rounded-2xl space-y-2 text-left relative">
                    <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-extrabold text-white shrink-0 shadow-inner">
                            {user?.name?.charAt(0) || 'S'}
                        </div>
                        <div className="min-w-0 flex-1">
                            <span className="text-xs font-bold text-slate-200 block truncate">{user?.name || 'Comprador SaaS'}</span>
                            <span className="text-[9px] text-slate-500 dark:text-slate-500 block truncate font-medium">Súper Usuario</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile sidebar overlay backdrop */}
            {isMobileSidebarOpen && (
                <div 
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-20 md:hidden"
                />
            )}

            {/* 2. RIGHT CONTENT PANEL */}
            <div className="flex-1 flex flex-col md:pl-64 min-h-screen">
                {/* Fixed Top Navbar */}
                <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-150 dark:border-slate-800 flex items-center justify-between px-6 md:px-12 fixed top-0 right-0 left-0 md:left-64 z-20 transition-colors duration-300">
                    <div className="flex items-center gap-3 text-left">
                        <button
                            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                            className="md:hidden p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 transition-colors mr-1"
                            aria-label="Abrir menú"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5-5.25h16.5m-16.5 10.5h16.5" />
                            </svg>
                        </button>
                        <h2 className="text-sm font-black text-gray-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
                            {activeTab === 'admins' ? '👤 Gestión de Cuentas de Administradores' : '🏢 Resumen de Condominios Licenciados'}
                        </h2>
                    </div>

                    {/* Right side controls */}
                    <div className="flex items-center gap-3">
                        {toggleTheme && (
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-xl bg-gray-150 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 transition-colors duration-200 cursor-pointer"
                                aria-label="Toggle Theme"
                                title="Cambiar tema"
                            >
                                {darkMode ? (
                                    <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.75 4.75l1.59 1.59m11.32 11.32l1.59 1.59M3 12h2.25m13.5 0H21M4.75 19.25l1.59-1.59m11.32-11.32l1.59-1.59M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                                    </svg>
                                )}
                            </button>
                        )}

                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="p-2 rounded-xl bg-gray-150 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 border border-gray-200 dark:border-slate-700 transition-colors duration-200 cursor-pointer"
                            aria-label="Cerrar sesión"
                            title="Cerrar sesión"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                            </svg>
                        </Link>
                    </div>
                </header>

                {/* Main Scrollable Content */}
                <main className="flex-1 px-6 md:px-12 py-8 md:py-10 mt-16 overflow-y-auto bg-gray-50 dark:bg-slate-900/10 text-gray-700 dark:text-slate-200 text-left space-y-6">
                    {activeTab === 'admins' ? (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cuentas de Administradores Registradas ({adminUsers.length})</p>
                                <button
                                    onClick={() => {
                                        setEditingAdmin(null);
                                        setFormInputs({ name: '', email: '', rut: '', phone: '', status: 'active' });
                                        setShowAddForm(!showAddForm);
                                    }}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                                >
                                    {showAddForm ? 'Cerrar Formulario' : '➕ Crear Administrador'}
                                </button>
                            </div>

                            {showAddForm && (
                                <form onSubmit={handleFormSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-4 max-w-xl shadow-sm">
                                    <h5 className="text-xs font-bold uppercase">{editingAdmin ? '✏️ Editar Administrador' : '➕ Crear Nueva Cuenta de Admin'}</h5>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Nombre Completo</label>
                                            <input
                                                type="text"
                                                required
                                                value={formInputs.name}
                                                onChange={(e) => setFormInputs(prev => ({ ...prev, name: e.target.value }))}
                                                className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-xs px-3 py-2 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">RUT</label>
                                            <input
                                                type="text"
                                                required
                                                value={formInputs.rut}
                                                onChange={(e) => setFormInputs(prev => ({ ...prev, rut: e.target.value }))}
                                                className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-xs px-3 py-2 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Email</label>
                                            <input
                                                type="email"
                                                required
                                                value={formInputs.email}
                                                onChange={(e) => setFormInputs(prev => ({ ...prev, email: e.target.value }))}
                                                className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-xs px-3 py-2 focus:outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Teléfono</label>
                                            <input
                                                type="text"
                                                value={formInputs.phone}
                                                onChange={(e) => setFormInputs(prev => ({ ...prev, phone: e.target.value }))}
                                                className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-xs px-3 py-2 focus:outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Estado Cuenta</label>
                                        <select
                                            value={formInputs.status}
                                            onChange={(e) => setFormInputs(prev => ({ ...prev, status: e.target.value }))}
                                            className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl text-xs px-3 py-2 focus:outline-none"
                                        >
                                            <option value="active">Activa</option>
                                            <option value="inactive">Inactiva / Suspendida</option>
                                        </select>
                                    </div>
                                    <div className="flex gap-2">
                                        <button type="submit" className="px-4 py-2 bg-indigo-650 text-white font-bold text-xs rounded-xl shadow cursor-pointer">
                                            Guardar Cuenta
                                        </button>
                                        <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-gray-200 text-gray-700 font-bold text-xs rounded-xl cursor-pointer">
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            )}

                            <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
                                <table className="min-w-full divide-y divide-gray-150 dark:divide-slate-800">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-slate-950 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                                            <th className="px-6 py-3">Nombre</th>
                                            <th className="px-6 py-3">RUT</th>
                                            <th className="px-6 py-3">Correo Electrónico</th>
                                            <th className="px-6 py-3">Teléfono</th>
                                            <th className="px-6 py-3">Estado</th>
                                            <th className="px-6 py-3 text-right">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-slate-800/60 text-xs text-gray-700 dark:text-slate-300">
                                        {adminUsers.map(admin => (
                                            <tr key={admin.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{admin.name}</td>
                                                <td className="px-6 py-4 font-mono">{admin.rut}</td>
                                                <td className="px-6 py-4">{admin.email}</td>
                                                <td className="px-6 py-4 font-mono">{admin.phone || '—'}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${admin.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                                                        {admin.status === 'active' ? 'Activa' : 'Suspendida'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-1.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setEditingAdmin(admin);
                                                                setFormInputs({
                                                                    name: admin.name,
                                                                    email: admin.email,
                                                                    rut: admin.rut,
                                                                    phone: admin.phone || '',
                                                                    status: admin.status || 'active'
                                                                });
                                                                setShowAddForm(true);
                                                            }}
                                                            className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-500 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                                                        >
                                                            ✏️ Editar
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                if (confirm(`¿Estás seguro de eliminar el administrador ${admin.name}?`)) {
                                                                    setUsersList(prev => prev.filter(u => u.id !== admin.id));
                                                                }
                                                            }}
                                                            className="px-2.5 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                                                        >
                                                            🗑️ Eliminar
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-fade-in">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Resumen de Comunidades Licenciadas en Producción ({condosList.length})</p>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {condosList.map(c => (
                                    <div key={c.id} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-1">
                                                <h4 className="font-black text-slate-800 dark:text-white">{c.name}</h4>
                                                <p className="text-xs text-gray-500">{c.address}, {c.city}</p>
                                            </div>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${c.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                                                {c.status === 'active' ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </div>
                                        <div className="pt-3 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center text-xs">
                                            <span className="text-gray-400">Total Unidades:</span>
                                            <span className="font-mono font-bold">{c.units_count} unidades</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
