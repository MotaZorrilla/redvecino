import React, { useState, useEffect } from 'react';
import api from '@/bootstrap';
import Modal from '@/Components/Modal';
import CondoGeneralTab from './CondoProfile/CondoGeneralTab';
import CondoUnitTypesTab from './CondoProfile/CondoUnitTypesTab';
import CondoCommonAreasTab from './CondoProfile/CondoCommonAreasTab';
import CondoStaffRolesTab from './CondoProfile/CondoStaffRolesTab';
import CondoLateFeeTab from './CondoProfile/CondoLateFeeTab';
import { Building2, Layers, Sparkles, Users, Clock } from 'lucide-react';

export default function CondoProfilePanel({ adminCondoId = 1, condosList = [], allCondominiums = [] }) {
    const activeCondo = (condosList.length > 0 ? condosList : allCondominiums).find(c => String(c.id) === String(adminCondoId)) || {
        name: 'Condominio Torre ENTEL',
        address: 'Av. Manuel Rodriguez 5364, Chiguayante',
        city: 'Chiguayante',
        rut: '12.345.678-9',
        type: 'Condominio de Edificios',
        email: 'pedro.perez@gmail.com',
        phone: '+56 9322 66558',
        units_count: 160,
        towers_count: 5,
        tower_naming: 'numbers'
    };

    const [activeTab, setActiveTab] = useState('general');
    const [formData, setFormData] = useState({ ...activeCondo });
    const [lateFeeData, setLateFeeData] = useState({ due_day: 15, late_fee_rate: 2.0 });

    const [unitTypes, setUnitTypes] = useState([
        { id: 1, code: 'Local', sqm: 56, alicuota_pct: 0.6 },
        { id: 2, code: 'tipo A', sqm: 86, alicuota_pct: 1.0 },
        { id: 3, code: 'tipo B', sqm: 75, alicuota_pct: 0.8 },
        { id: 4, code: 'tipo C', sqm: 68, alicuota_pct: 0.6 }
    ]);
    const [editingUnitType, setEditingUnitType] = useState(null);
    const [unitTypeForm, setUnitTypeForm] = useState({ code: '', sqm: '', alicuota_pct: '' });
    const [showUnitTypeModal, setShowUnitTypeModal] = useState(false);

    const [commonAreas, setCommonAreas] = useState([
        { id: 1, classification: 'Área Común', name: 'Gimnasio', condition: 'Gratuito' },
        { id: 2, classification: 'Área Común', name: 'Piscina', condition: 'Se Arrienda' },
        { id: 3, classification: 'Área Común', name: 'Sala Eventos', condition: 'Se Arrienda' }
    ]);
    const [editingArea, setEditingArea] = useState(null);
    const [areaForm, setAreaForm] = useState({ classification: 'Área Común', name: '', condition: 'Gratuito' });
    const [showAreaModal, setShowAreaModal] = useState(false);

    const [employeeRoles, setEmployeeRoles] = useState([
        { id: 1, name: 'Auxiliar de limpieza' },
        { id: 2, name: 'Recepcionista' },
        { id: 3, name: 'Guardia de Seguridad' },
        { id: 4, name: 'Conserje Nocturno' }
    ]);
    const [editingRole, setEditingRole] = useState(null);
    const [roleForm, setRoleForm] = useState({ name: '' });
    const [showRoleModal, setShowRoleModal] = useState(false);

    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

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

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            await api.put(`/api/condominiums/${adminCondoId || 1}`, formData);
            setSaveSuccessMsg('¡Parámetros del condominio guardados con éxito!');
            setTimeout(() => setSaveSuccessMsg(''), 2500);
        } catch (err) {
            console.error('Error guardando perfil:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: 'general', label: 'Estructura & Datos', icon: Building2 },
        { id: 'unit_types', label: 'Modelos & Alícuotas', icon: Layers },
        { id: 'common_areas', label: 'Áreas Comunes', icon: Sparkles },
        { id: 'roles', label: 'Cargos de Personal', icon: Users },
        { id: 'mora', label: 'Parámetros de Mora', icon: Clock }
    ];

    return (
        <div className="space-y-6 animate-fade-in text-left font-sans">
            {/* Header del Panel */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <span>🏛️ Perfil y Parametrización del Condominio</span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Administración centralizada de infraestructura, alícuotas y normativas operacionales.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {saveSuccessMsg && (
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-fade-in">
                            {saveSuccessMsg}
                        </span>
                    )}
                    <button
                        type="button"
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50 cursor-pointer"
                    >
                        {isSaving ? 'Guardando...' : '💾 Guardar Cambios'}
                    </button>
                </div>
            </div>

            {/* Pestañas de Navegación */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                                isActive
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Renderizado de Subcomponentes Skinny */}
            {activeTab === 'general' && (
                <CondoGeneralTab formData={formData} setFormData={setFormData} />
            )}

            {activeTab === 'unit_types' && (
                <CondoUnitTypesTab
                    unitTypes={unitTypes}
                    onOpenModal={(item) => {
                        setEditingUnitType(item || null);
                        setUnitTypeForm(item ? { code: item.code, sqm: item.sqm, alicuota_pct: item.alicuota_pct } : { code: '', sqm: '', alicuota_pct: '' });
                        setShowUnitTypeModal(true);
                    }}
                    onDelete={(id) => setUnitTypes(unitTypes.filter(u => u.id !== id))}
                />
            )}

            {activeTab === 'common_areas' && (
                <CondoCommonAreasTab
                    commonAreas={commonAreas}
                    onOpenModal={(item) => {
                        setEditingArea(item || null);
                        setAreaForm(item ? { classification: item.classification, name: item.name, condition: item.condition } : { classification: 'Área Común', name: '', condition: 'Gratuito' });
                        setShowAreaModal(true);
                    }}
                    onDelete={(id) => setCommonAreas(commonAreas.filter(a => a.id !== id))}
                />
            )}

            {activeTab === 'roles' && (
                <CondoStaffRolesTab
                    employeeRoles={employeeRoles}
                    onOpenModal={(item) => {
                        setEditingRole(item || null);
                        setRoleForm(item ? { name: item.name } : { name: '' });
                        setShowRoleModal(true);
                    }}
                    onDelete={(id) => setEmployeeRoles(employeeRoles.filter(r => r.id !== id))}
                />
            )}

            {activeTab === 'mora' && (
                <CondoLateFeeTab lateFeeData={lateFeeData} setLateFeeData={setLateFeeData} />
            )}

            {/* Modal Unit Types */}
            <Modal show={showUnitTypeModal} onClose={() => setShowUnitTypeModal(false)} maxWidth="sm">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!unitTypeForm.code || !unitTypeForm.sqm) return;
                        if (editingUnitType) {
                            setUnitTypes(unitTypes.map(u => u.id === editingUnitType.id ? { ...u, code: unitTypeForm.code, sqm: Number(unitTypeForm.sqm), alicuota_pct: Number(unitTypeForm.alicuota_pct) } : u));
                        } else {
                            setUnitTypes([...unitTypes, { id: Date.now(), code: unitTypeForm.code, sqm: Number(unitTypeForm.sqm), alicuota_pct: Number(unitTypeForm.alicuota_pct) || 0 }]);
                        }
                        setShowUnitTypeModal(false);
                    }}
                    className="p-5 space-y-4 bg-white dark:bg-slate-900 text-left"
                >
                    <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase">
                        {editingUnitType ? 'Editar Modelo de Unidad' : 'Nuevo Modelo de Unidad'}
                    </h4>
                    <div className="space-y-3 text-xs">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nombre / Código</label>
                            <input
                                type="text"
                                required
                                value={unitTypeForm.code}
                                onChange={(e) => setUnitTypeForm(p => ({ ...p, code: e.target.value }))}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Superficie (m²)</label>
                            <input
                                type="number"
                                required
                                value={unitTypeForm.sqm}
                                onChange={(e) => setUnitTypeForm(p => ({ ...p, sqm: e.target.value }))}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Alícuota Base (%)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={unitTypeForm.alicuota_pct}
                                onChange={(e) => setUnitTypeForm(p => ({ ...p, alicuota_pct: e.target.value }))}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                        <button type="button" onClick={() => setShowUnitTypeModal(false)} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs rounded-xl font-bold">Cancelar</button>
                        <button type="submit" className="px-4 py-1.5 bg-indigo-600 text-white text-xs rounded-xl font-bold">Guardar</button>
                    </div>
                </form>
            </Modal>

            {/* Modal Common Areas */}
            <Modal show={showAreaModal} onClose={() => setShowAreaModal(false)} maxWidth="sm">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!areaForm.name) return;
                        if (editingArea) {
                            setCommonAreas(commonAreas.map(a => a.id === editingArea.id ? { ...a, ...areaForm } : a));
                        } else {
                            setCommonAreas([...commonAreas, { id: Date.now(), ...areaForm }]);
                        }
                        setShowAreaModal(false);
                    }}
                    className="p-5 space-y-4 bg-white dark:bg-slate-900 text-left"
                >
                    <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase">
                        {editingArea ? 'Editar Área Común' : 'Nueva Área Común'}
                    </h4>
                    <div className="space-y-3 text-xs">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nombre del Espacio</label>
                            <input
                                type="text"
                                required
                                value={areaForm.name}
                                onChange={(e) => setAreaForm(p => ({ ...p, name: e.target.value }))}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Condición de Uso</label>
                            <select
                                value={areaForm.condition}
                                onChange={(e) => setAreaForm(p => ({ ...p, condition: e.target.value }))}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                            >
                                <option value="Gratuito">Gratuito</option>
                                <option value="Se Arrienda">Se Arrienda</option>
                                <option value="Uso Restringido">Uso Restringido</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                        <button type="button" onClick={() => setShowAreaModal(false)} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs rounded-xl font-bold">Cancelar</button>
                        <button type="submit" className="px-4 py-1.5 bg-indigo-600 text-white text-xs rounded-xl font-bold">Guardar</button>
                    </div>
                </form>
            </Modal>

            {/* Modal Roles */}
            <Modal show={showRoleModal} onClose={() => setShowRoleModal(false)} maxWidth="sm">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!roleForm.name) return;
                        if (editingRole) {
                            setEmployeeRoles(employeeRoles.map(r => r.id === editingRole.id ? { ...r, ...roleForm } : r));
                        } else {
                            setEmployeeRoles([...employeeRoles, { id: Date.now(), ...roleForm }]);
                        }
                        setShowRoleModal(false);
                    }}
                    className="p-5 space-y-4 bg-white dark:bg-slate-900 text-left"
                >
                    <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase">
                        {editingRole ? 'Editar Cargo' : 'Nuevo Cargo de Colaborador'}
                    </h4>
                    <div className="space-y-3 text-xs">
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nombre del Cargo</label>
                            <input
                                type="text"
                                required
                                value={roleForm.name}
                                onChange={(e) => setRoleForm(p => ({ ...p, name: e.target.value }))}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                        <button type="button" onClick={() => setShowRoleModal(false)} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-xs rounded-xl font-bold">Cancelar</button>
                        <button type="submit" className="px-4 py-1.5 bg-indigo-600 text-white text-xs rounded-xl font-bold">Guardar</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
