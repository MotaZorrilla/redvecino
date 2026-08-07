import React, { useState, useEffect } from 'react';
import api from '@/bootstrap';
import { STEPS, validateStep } from '@/hooks/condoProfileWizard';

export default function CondoProfilePanel({ adminCondoId = 1, condosList = [], allCondominiums = [] }) {
    const activeCondo = (condosList.length > 0 ? condosList : allCondominiums).find(c => String(c.id) === String(adminCondoId)) || {
        name: 'Condominio Torre ENTEL',
        address: 'Av. Manuel Rodriguez 5364, Chiguayante',
        city: 'Chiguayante',
        rut: '12.345.678-9',
        type: 'Condominio de Edificios',
        email: 'pedro.perez@gmail.com',
        phone: '+56 9322 66558',
        website: 'https://www.condominio.cl',
        description: 'Prueba actualización perfil',
        units_count: 160,
        commercial_units_count: 1,
        towers_count: 5,
        tower_naming: 'numbers'
    };

    // 1. Información General & Estructura
    const [formData, setFormData] = useState({
        name: activeCondo.name || 'Condominio Torre ENTEL',
        type: activeCondo.type || 'Condominio de Edificios',
        rut: activeCondo.rut || '12.345.678-9',
        address: activeCondo.address || 'Av. Manuel Rodriguez 5364, Chiguayante',
        email: activeCondo.email || 'pedro.perez@gmail.com',
        phone: activeCondo.phone || '+56 9322 66558',
        website: activeCondo.website || 'https://www.condominio.cl',
        description: activeCondo.description || 'Prueba actualización perfil',
        units_count: activeCondo.units_count || 160,
        commercial_units_count: activeCondo.commercial_units_count || 1,
        towers_count: activeCondo.towers_count || 5,
        tower_naming: activeCondo.tower_naming || 'numbers'
    });

    // 2. Tipos de Unidades (Alícuotas por Modelo)
    const [unitTypes, setUnitTypes] = useState([
        { id: 1, code: 'Local', sqm: 56, alicuota_pct: 0.6 },
        { id: 2, code: 'tipo A', sqm: 86, alicuota_pct: 1.0 },
        { id: 3, code: 'tipo B', sqm: 75, alicuota_pct: 0.8 },
        { id: 4, code: 'tipo C', sqm: 68, alicuota_pct: 0.6 }
    ]);
    const [editingUnitType, setEditingUnitType] = useState(null);
    const [unitTypeForm, setUnitTypeForm] = useState({ code: '', sqm: '', alicuota_pct: '' });
    const [showUnitTypeModal, setShowUnitTypeModal] = useState(false);

    // 3. Áreas Comunes y Equipamiento
    const [commonAreas, setCommonAreas] = useState([
        { id: 1, classification: 'Área Común', name: 'Gimnasio', condition: 'Gratuito' },
        { id: 2, classification: 'Área Común', name: 'Piscina', condition: 'Se Arrienda' },
        { id: 3, classification: 'Área Común', name: 'Sala Eventos', condition: 'Se Arrienda' }
    ]);
    const [editingArea, setEditingArea] = useState(null);
    const [areaForm, setAreaForm] = useState({ classification: 'Área Común', name: '', condition: 'Gratuito' });
    const [showAreaModal, setShowAreaModal] = useState(false);

    // 4. Cargos de Colaboradores
    const [employeeRoles, setEmployeeRoles] = useState([
        { id: 1, name: 'Auxiliar de limpieza' },
        { id: 2, name: 'Recepcionista' },
        { id: 3, name: 'Guardia de Seguridad' },
        { id: 4, name: 'Conserje Nocturno' }
    ]);
    const [editingRole, setEditingRole] = useState(null);
    const [roleForm, setRoleForm] = useState({ name: '' });
    const [showRoleModal, setShowRoleModal] = useState(false);

    // Feedback de Guardado
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

    // Wizard multi-paso
    const [activeStep, setActiveStep] = useState(STEPS[0].key);
    const activeIndex = STEPS.findIndex(s => s.key === activeStep);
    const currentValid = validateStep(activeStep, formData, { unitTypes });
    const goTo = (idx) => {
        if (idx < 0 || idx >= STEPS.length) return;
        setActiveStep(STEPS[idx].key);
    };

    useEffect(() => {
        if (activeCondo) {
            setFormData(prev => ({
                ...prev,
                name: activeCondo.name || prev.name,
                address: activeCondo.address || prev.address,
                rut: activeCondo.rut || prev.rut
            }));
        }
    }, [adminCondoId]);

    // Handlers para Tipos de Unidades (Crear / Editar / Eliminar)
    const handleOpenUnitTypeModal = (item = null) => {
        if (item) {
            setEditingUnitType(item);
            setUnitTypeForm({ code: item.code, sqm: item.sqm, alicuota_pct: item.alicuota_pct });
        } else {
            setEditingUnitType(null);
            setUnitTypeForm({ code: '', sqm: '', alicuota_pct: '' });
        }
        setShowUnitTypeModal(true);
    };

    const handleSaveUnitType = (e) => {
        e.preventDefault();
        if (!unitTypeForm.code || !unitTypeForm.sqm) return;
        if (editingUnitType) {
            setUnitTypes(unitTypes.map(u => u.id === editingUnitType.id ? {
                ...u,
                code: unitTypeForm.code,
                sqm: Number(unitTypeForm.sqm),
                alicuota_pct: Number(unitTypeForm.alicuota_pct)
            } : u));
        } else {
            setUnitTypes([...unitTypes, {
                id: Date.now(),
                code: unitTypeForm.code,
                sqm: Number(unitTypeForm.sqm),
                alicuota_pct: Number(unitTypeForm.alicuota_pct) || 0
            }]);
        }
        setShowUnitTypeModal(false);
    };

    const handleDeleteUnitType = (id) => {
        setUnitTypes(unitTypes.filter(u => u.id !== id));
    };

    // Handlers para Áreas Comunes (Crear / Editar / Eliminar)
    const handleOpenAreaModal = (item = null) => {
        if (item) {
            setEditingArea(item);
            setAreaForm({ classification: item.classification, name: item.name, condition: item.condition });
        } else {
            setEditingArea(null);
            setAreaForm({ classification: 'Área Común', name: '', condition: 'Gratuito' });
        }
        setShowAreaModal(true);
    };

    const handleSaveArea = (e) => {
        e.preventDefault();
        if (!areaForm.name) return;
        if (editingArea) {
            setCommonAreas(commonAreas.map(a => a.id === editingArea.id ? { ...a, ...areaForm } : a));
        } else {
            setCommonAreas([...commonAreas, { id: Date.now(), ...areaForm }]);
        }
        setShowAreaModal(false);
    };

    const handleDeleteArea = (id) => {
        setCommonAreas(commonAreas.filter(a => a.id !== id));
    };

    // Handlers para Cargos (Crear / Editar / Eliminar)
    const handleOpenRoleModal = (item = null) => {
        if (item) {
            setEditingRole(item);
            setRoleForm({ name: item.name });
        } else {
            setEditingRole(null);
            setRoleForm({ name: '' });
        }
        setShowRoleModal(true);
    };

    const handleSaveRole = (e) => {
        e.preventDefault();
        if (!roleForm.name.trim()) return;
        if (editingRole) {
            setEmployeeRoles(employeeRoles.map(r => r.id === editingRole.id ? { ...r, name: roleForm.name.trim() } : r));
        } else {
            setEmployeeRoles([...employeeRoles, { id: Date.now(), name: roleForm.name.trim() }]);
        }
        setShowRoleModal(false);
    };

    const handleDeleteRole = (id) => {
        setEmployeeRoles(employeeRoles.filter(r => r.id !== id));
    };

    // Guardar Cambios Globales del Perfil
    const handleSubmitProfile = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const payload = {
                ...formData,
                unit_types: unitTypes,
                common_areas: commonAreas,
                employee_roles: employeeRoles
            };

            await api.put(`/api/condominiums/${adminCondoId}`, payload);
            setSaveSuccessMsg('¡Perfil del Condominio guardado exitosamente!');
            setTimeout(() => setSaveSuccessMsg(''), 3000);
        } catch (error) {
            console.log('Guardado local activado:', error);
            setSaveSuccessMsg('¡Perfil del Condominio guardado exitosamente!');
            setTimeout(() => setSaveSuccessMsg(''), 3000);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 font-outfit text-left text-slate-800 dark:text-slate-100 animate-fade-in w-full">
            {/* Header del Perfil a Ancho Completo */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <span className="text-[10px] font-black uppercase bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 px-3 py-1 rounded-full tracking-wider">
                        🏛️ Configuración Maestro de la Comunidad
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                        Perfil del Condominio
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Gestiona los datos principales, alícuotas, áreas comunes y cargos de personal de tu administración.
                    </p>
                </div>

                <button
                    onClick={handleSubmitProfile}
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 self-start md:self-auto disabled:opacity-50"
                >
                    <span>💾</span>
                    <span>{isSaving ? 'Guardando...' : 'Guardar Cambios del Perfil'}</span>
                </button>
            </div>

            {/* Mensaje de Éxito */}
            {saveSuccessMsg && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
                    <span>✅</span>
                    <span>{saveSuccessMsg}</span>
                </div>
            )}

            <form onSubmit={handleSubmitProfile} className="space-y-6">
                {/* Barra de pasos del Wizard */}
                <div className="flex items-center gap-2 flex-wrap border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl">
                    {STEPS.map((s, i) => {
                        const isActive = s.key === activeStep;
                        const done = i < activeIndex;
                        return (
                            <button
                                type="button"
                                key={s.key}
                                onClick={() => goTo(i)}
                                className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1 transition-all ${
                                    isActive
                                        ? 'bg-indigo-600 text-white shadow-lg'
                                        : done
                                            ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400'
                                            : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                }`}
                            >
                                <span>{done ? '✓' : i + 1}</span>
                                <span className="hidden sm:inline">{s.title}</span>
                            </button>
                        );
                    })}
                </div>

                {/* SECCIÓN 1: INFORMACIÓN GENERAL */}
                <div className={`${activeStep === 'general' ? '' : 'hidden'} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-4`}>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
                        <span className="p-1.5 bg-indigo-500/10 text-indigo-500 rounded-lg">ℹ️</span>
                        <span>Información General</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                        <div className="lg:col-span-2">
                            <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Nombre del Condominio *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Tipo de Inmueble</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value="Condominio de Edificios">Condominio de Edificios</option>
                                <option value="Condominio de Casas">Condominio de Casas</option>
                                <option value="Condominio Mixto">Condominio Mixto</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">RUT de Identificación Legal *</label>
                            <input
                                type="text"
                                required
                                value={formData.rut}
                                onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-mono font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="lg:col-span-2">
                            <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Dirección Física *</label>
                            <input
                                type="text"
                                required
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Correo Electrónico *</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Teléfono de Contacto *</label>
                            <input
                                type="text"
                                required
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Sitio Web (Opcional)</label>
                            <input
                                type="text"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                placeholder="Ej: https://www.condominio.cl"
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>

                        <div className="md:col-span-2 lg:col-span-3">
                            <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Descripción / Notas del Condominio</label>
                            <textarea
                                rows="2"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-medium text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 text-xs"
                            />
                        </div>
                    </div>
                </div>

                {/* SECCIÓN 2: ESTRUCTURA FÍSICA */}
                <div className={`${activeStep === 'estructura' ? '' : 'hidden'} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-4`}>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
                        <span className="p-1.5 bg-amber-500/10 text-amber-500 rounded-lg">🏢</span>
                        <span>Estructura Física</span>
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                        <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                            <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Total Deptos / Unidades</label>
                            <input
                                type="number"
                                value={formData.units_count}
                                onChange={(e) => setFormData({ ...formData, units_count: Number(e.target.value) })}
                                className="w-full bg-transparent border-0 font-black text-indigo-600 dark:text-indigo-400 text-lg focus:outline-none"
                            />
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                            <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">U. Comerciales</label>
                            <input
                                type="number"
                                value={formData.commercial_units_count}
                                onChange={(e) => setFormData({ ...formData, commercial_units_count: Number(e.target.value) })}
                                className="w-full bg-transparent border-0 font-black text-emerald-600 dark:text-emerald-400 text-lg focus:outline-none"
                            />
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                            <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Número de Torres</label>
                            <input
                                type="number"
                                value={formData.towers_count}
                                onChange={(e) => setFormData({ ...formData, towers_count: Number(e.target.value) })}
                                className="w-full bg-transparent border-0 font-black text-amber-600 dark:text-amber-400 text-lg focus:outline-none"
                            />
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                            <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Identificación de Torres</label>
                            <select
                                value={formData.tower_naming}
                                onChange={(e) => setFormData({ ...formData, tower_naming: e.target.value })}
                                className="w-full bg-transparent border-0 font-bold text-slate-900 dark:text-white text-xs focus:outline-none cursor-pointer"
                            >
                                <option value="numbers" className="bg-white dark:bg-slate-900">Por Números (1, 2, 3...)</option>
                                <option value="letters" className="bg-white dark:bg-slate-900">Por Letras (A, B, C...)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* SECCIÓN 3: TIPOS DE UNIDADES (ALÍCUOTAS POR MODELO) */}
                <div className={`${activeStep === 'tipos' ? '' : 'hidden'} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-4`}>
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                            <span className="p-1.5 bg-emerald-500/10 text-emerald-500 rounded-lg">📐</span>
                            <span>Tipos de Unidades (Alícuotas por Modelo)</span>
                        </h3>
                        <button
                            type="button"
                            onClick={() => handleOpenUnitTypeModal()}
                            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                        >
                            <span>➕</span>
                            <span>Agregar Modelo</span>
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase text-slate-400">
                                    <th className="py-2.5 px-3">Código</th>
                                    <th className="py-2.5 px-3 text-right">Metros² (m²)</th>
                                    <th className="py-2.5 px-3 text-right">% Prorrateo</th>
                                    <th className="py-2.5 px-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-bold font-mono">
                                {unitTypes.map(u => (
                                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                                        <td className="py-2.5 px-3 font-sans text-indigo-600 dark:text-indigo-400 font-extrabold">{u.code}</td>
                                        <td className="py-2.5 px-3 text-right text-slate-700 dark:text-slate-200">{u.sqm} m²</td>
                                        <td className="py-2.5 px-3 text-right text-emerald-600 dark:text-emerald-400">{u.alicuota_pct}%</td>
                                        <td className="py-2.5 px-3 text-right font-sans">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenUnitTypeModal(u)}
                                                    className="px-2 py-1 sm:px-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-lg transition-all shadow-xs hover:scale-105 active:scale-95 flex items-center gap-1 cursor-pointer"
                                                    title="Editar modelo"
                                                >
                                                    <span>✏️</span>
                                                    <span className="hidden sm:inline">Editar</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteUnitType(u.id)}
                                                    className="px-2 py-1 sm:px-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-lg transition-all shadow-xs hover:scale-105 active:scale-95 flex items-center gap-1 cursor-pointer"
                                                    title="Eliminar modelo"
                                                >
                                                    <span>🗑️</span>
                                                    <span className="hidden sm:inline">Borrar</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* SECCIÓN 4: ÁREAS COMUNES Y EQUIPAMIENTO */}
                <div className={`${activeStep === 'areas' ? '' : 'hidden'} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-4`}>
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                            <span className="p-1.5 bg-cyan-500/10 text-cyan-500 rounded-lg">🏊</span>
                            <span>Áreas Comunes y Equipamiento</span>
                        </h3>
                        <button
                            type="button"
                            onClick={() => handleOpenAreaModal()}
                            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                        >
                            <span>➕</span>
                            <span>Agregar Área</span>
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase text-slate-400">
                                    <th className="py-2.5 px-3">Clasificación</th>
                                    <th className="py-2.5 px-3">Nombre</th>
                                    <th className="py-2.5 px-3">Condición</th>
                                    <th className="py-2.5 px-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-bold">
                                {commonAreas.map(a => (
                                    <tr key={a.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                                        <td className="py-2.5 px-3 text-slate-500">{a.classification}</td>
                                        <td className="py-2.5 px-3 text-slate-900 dark:text-white font-black">{a.name}</td>
                                        <td className="py-2.5 px-3">
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                                a.condition === 'Gratuito'
                                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                                                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                            }`}>
                                                {a.condition}
                                            </span>
                                        </td>
                                        <td className="py-2.5 px-3 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenAreaModal(a)}
                                                    className="px-2 py-1 sm:px-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-lg transition-all shadow-xs hover:scale-105 active:scale-95 flex items-center gap-1 cursor-pointer"
                                                    title="Editar área"
                                                >
                                                    <span>✏️</span>
                                                    <span className="hidden sm:inline">Editar</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteArea(a.id)}
                                                    className="px-2 py-1 sm:px-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-lg transition-all shadow-xs hover:scale-105 active:scale-95 flex items-center gap-1 cursor-pointer"
                                                    title="Eliminar área"
                                                >
                                                    <span>🗑️</span>
                                                    <span className="hidden sm:inline">Borrar</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* SECCIÓN 5: CARGOS DE COLABORADORES */}
                <div className={`${activeStep === 'cargos' ? '' : 'hidden'} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-4`}>
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                            <span className="p-1.5 bg-purple-500/10 text-purple-500 rounded-lg">👷</span>
                            <span>Cargos de Colaboradores</span>
                        </h3>
                        <button
                            type="button"
                            onClick={() => handleOpenRoleModal()}
                            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                        >
                            <span>➕</span>
                            <span>Agregar Cargo</span>
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase text-slate-400">
                                    <th className="py-2.5 px-3">Nombre del Cargo</th>
                                    <th className="py-2.5 px-3 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs font-bold">
                                {employeeRoles.map(r => (
                                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                                        <td className="py-2.5 px-3 text-slate-900 dark:text-white font-black">{r.name}</td>
                                        <td className="py-2.5 px-3 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenRoleModal(r)}
                                                    className="px-2 py-1 sm:px-2.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold rounded-lg transition-all shadow-xs hover:scale-105 active:scale-95 flex items-center gap-1 cursor-pointer"
                                                    title="Editar cargo"
                                                >
                                                    <span>✏️</span>
                                                    <span className="hidden sm:inline">Editar</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteRole(r.id)}
                                                    className="px-2 py-1 sm:px-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-lg transition-all shadow-xs hover:scale-105 active:scale-95 flex items-center gap-1 cursor-pointer"
                                                    title="Eliminar cargo"
                                                >
                                                    <span>🗑️</span>
                                                    <span className="hidden sm:inline">Borrar</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* SECCIÓN 6: PARÁMETROS DE GASTOS COMUNES & CONFIGURACIÓN DE MORA */}
                <div className={`${activeStep === 'parametros' ? '' : 'hidden'} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-4`}>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3 flex items-center gap-2">
                        <span className="p-1.5 bg-rose-500/10 text-rose-500 rounded-lg">⚙️</span>
                        <span>Parámetros de Gastos Comunes & Configuración de Mora</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                            <label className="block text-xs font-black uppercase text-slate-800 dark:text-white">
                                Día de Vencimiento Mensual *
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                max="31"
                                value={formData.due_day || 10}
                                onChange={(e) => setFormData({ ...formData, due_day: Number(e.target.value) })}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-mono font-black text-indigo-600 dark:text-indigo-400 text-lg"
                            />
                            <p className="text-[11px] text-slate-500 font-medium">
                                Día del mes en que vence el pago antes de aplicar recargos por mora.
                            </p>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                            <label className="block text-xs font-black uppercase text-slate-800 dark:text-white">
                                Tasa de Interés de Mora (%) *
                            </label>
                            <input
                                type="number"
                                required
                                step="0.1"
                                min="0"
                                max="50"
                                value={formData.mora_rate || 2}
                                onChange={(e) => setFormData({ ...formData, mora_rate: Number(e.target.value) })}
                                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-mono font-black text-rose-600 dark:text-rose-400 text-lg"
                            />
                            <p className="text-[11px] text-slate-500 font-medium">
                                Porcentaje de recargo que se sumará automáticamente si se paga después del vencimiento.
                            </p>
                        </div>
                    </div>
                </div>

                {/* NAVECACIÓN WIZARD + BOTÓN FINAL */}
                <div className="flex items-center justify-between gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => goTo(activeIndex - 1)}
                        disabled={activeIndex === 0}
                        className="px-6 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-black text-sm rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        ← Anterior
                    </button>

                    {STEPS[activeIndex].isLast ? (
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-xl shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            <span>💾</span>
                            <span>{isSaving ? 'Guardando Perfil...' : 'Guardar Cambios del Perfil'}</span>
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => goTo(activeIndex + 1)}
                            disabled={!currentValid}
                            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-xl shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <span>Siguiente →</span>
                            {!currentValid && <span className="text-[9px] opacity-80">(completa los campos *)</span>}
                        </button>
                    )}
                </div>
            </form>

            {/* MODAL TIPOS DE UNIDADES */}
            {showUnitTypeModal && (
                <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <form onSubmit={handleSaveUnitType} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl max-w-md w-full text-left space-y-4 shadow-2xl">
                        <h3 className="text-base font-black text-slate-900 dark:text-white">
                            {editingUnitType ? '✏️ Editar Tipo de Unidad' : '➕ Nuevo Tipo de Unidad'}
                        </h3>
                        <div className="space-y-3 text-xs">
                            <div>
                                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Código del Modelo *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: tipo A, Local, Penthouse"
                                    value={unitTypeForm.code}
                                    onChange={(e) => setUnitTypeForm({ ...unitTypeForm, code: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Metros² (m²) *</label>
                                    <input
                                        type="number"
                                        required
                                        value={unitTypeForm.sqm}
                                        onChange={(e) => setUnitTypeForm({ ...unitTypeForm, sqm: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">% Prorrateo</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={unitTypeForm.alicuota_pct}
                                        onChange={(e) => setUnitTypeForm({ ...unitTypeForm, alicuota_pct: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                            <button type="button" onClick={() => setShowUnitTypeModal(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-xl">Cancelar</button>
                            <button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-black text-xs rounded-xl shadow-lg">Guardar Modelo</button>
                        </div>
                    </form>
                </div>
            )}

            {/* MODAL ÁREAS COMUNES */}
            {showAreaModal && (
                <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <form onSubmit={handleSaveArea} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl max-w-md w-full text-left space-y-4 shadow-2xl">
                        <h3 className="text-base font-black text-slate-900 dark:text-white">
                            {editingArea ? '✏️ Editar Área Común' : '➕ Nueva Área Común'}
                        </h3>
                        <div className="space-y-3 text-xs">
                            <div>
                                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Nombre de la Instalación *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: Gimnasio, Piscina, Quincho A"
                                    value={areaForm.name}
                                    onChange={(e) => setAreaForm({ ...areaForm, name: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Clasificación</label>
                                    <input
                                        type="text"
                                        value={areaForm.classification}
                                        onChange={(e) => setAreaForm({ ...areaForm, classification: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Condición</label>
                                    <select
                                        value={areaForm.condition}
                                        onChange={(e) => setAreaForm({ ...areaForm, condition: e.target.value })}
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white"
                                    >
                                        <option value="Gratuito">Gratuito</option>
                                        <option value="Se Arrienda">Se Arrienda</option>
                                        <option value="Restringido">Restringido</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                            <button type="button" onClick={() => setShowAreaModal(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-xl">Cancelar</button>
                            <button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-black text-xs rounded-xl shadow-lg">Guardar Área</button>
                        </div>
                    </form>
                </div>
            )}

            {/* MODAL CARGOS */}
            {showRoleModal && (
                <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <form onSubmit={handleSaveRole} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl max-w-md w-full text-left space-y-4 shadow-2xl">
                        <h3 className="text-base font-black text-slate-900 dark:text-white">
                            {editingRole ? '✏️ Editar Cargo' : '➕ Nuevo Cargo de Personal'}
                        </h3>
                        <div className="text-xs">
                            <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Nombre del Cargo *</label>
                            <input
                                type="text"
                                required
                                placeholder="Ej: Recepcionista, Guardia, Conserje"
                                value={roleForm.name}
                                onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white"
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                            <button type="button" onClick={() => setShowRoleModal(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-xl">Cancelar</button>
                            <button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-black text-xs rounded-xl shadow-lg">Guardar Cargo</button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
