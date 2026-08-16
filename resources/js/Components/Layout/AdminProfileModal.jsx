import { useState } from 'react';
import Modal from '@/Components/Modal';
import axios from 'axios';

export default function AdminProfileModal({
    isOpen,
    onClose,
    user,
    role = 'admin'
}) {
    const [profileForm, setProfileForm] = useState({
        name: user?.name || 'Administrador General',
        email: user?.email || 'admin@redvecino.cl',
        rut: user?.rut || '15.432.109-8',
        phone: user?.phone || '+56 9 8765 4321',
        roleTitle: role === 'admin' ? 'Administrador General de Copropiedad' : role
    });
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(user?.avatar_path ? `/storage/${user.avatar_path}` : null);

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSavingProfile(true);
        try {
            const formData = new FormData();
            formData.append('name', profileForm.name);
            formData.append('email', profileForm.email);
            if (profileForm.rut) formData.append('rut', profileForm.rut);
            if (profileForm.phone) formData.append('phone', profileForm.phone);
            if (avatarFile) formData.append('avatar', avatarFile);

            await axios.post('/api/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setIsSavingProfile(false);
            setProfileSuccessMsg('¡Perfil y foto actualizados con éxito!');
            setTimeout(() => {
                setProfileSuccessMsg('');
                onClose();
            }, 1200);
        } catch (err) {
            setIsSavingProfile(false);
            setProfileSuccessMsg('Error al actualizar perfil');
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="md">
            <form onSubmit={handleProfileSubmit} className="p-6 space-y-5 bg-white dark:bg-slate-900 text-left">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div>
                        <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                            Perfil de Administrador
                        </h4>
                        <p className="text-xs text-slate-400">Datos personales, contacto y fotografía de usuario.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold"
                    >
                        ✕
                    </button>
                </div>

                {profileSuccessMsg && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 font-bold text-xs rounded-xl">
                        {profileSuccessMsg}
                    </div>
                )}

                <div className="space-y-4 text-xs">
                    {/* Avatar Picker */}
                    <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-base font-black text-indigo-600 dark:text-indigo-400">
                                    {profileForm.name.slice(0, 2).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div className="flex-1">
                            <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Foto / Avatar de Perfil</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="w-full text-[11px] text-slate-500 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-950 dark:file:text-indigo-400 cursor-pointer"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Nombre Completo</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-3.5 py-2 font-bold focus:ring-2 focus:ring-indigo-500"
                            value={profileForm.name}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">RUT</label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-3.5 py-2 font-bold focus:ring-2 focus:ring-indigo-500"
                                value={profileForm.rut}
                                onChange={(e) => setProfileForm(prev => ({ ...prev, rut: e.target.value }))}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Teléfono</label>
                            <input
                                type="text"
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-3.5 py-2 font-bold focus:ring-2 focus:ring-indigo-500"
                                value={profileForm.phone}
                                onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Correo Electrónico</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-3.5 py-2 font-bold focus:ring-2 focus:ring-indigo-500"
                            value={profileForm.email}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs rounded-xl"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isSavingProfile}
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                    >
                        {isSavingProfile ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
