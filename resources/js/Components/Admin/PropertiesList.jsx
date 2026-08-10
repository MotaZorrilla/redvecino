import { useState, useMemo } from 'react';
import { SimpleTable } from '@/Components/DashboardShared';
import PropertyStructureBuilder from '@/Components/Admin/PropertyStructureBuilder';
import UnitDetailModal360 from '@/Components/Admin/UnitDetailModal360';
import Modal from '@/Components/Modal';

export default function PropertiesList({
    adminCondoId,
    condosList = [],
    allCondominiums = [],
    adminFilteredProperties = [],
    propertiesList = [],
    setPropertiesList,
    newPropForm,
    setNewPropForm,
    showAddPropForm,
    setShowAddPropForm,
    editingProp,
    setEditingProp
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [subTab, setSubTab] = useState('units_table'); // 'units_table' | 'visual_builder'

    // Condominio Activo dinámico
    const activeCondoName = useMemo(() => {
        const list = condosList.length > 0 ? condosList : (allCondominiums.length > 0 ? allCondominiums : []);
        const found = list.find(c => String(c.id) === String(adminCondoId));
        return found ? found.name : 'Condominio Alameda';
    }, [condosList, allCondominiums, adminCondoId]);

    // Modo de Visualización del Registro de Unidades ('grid' = Vista Malla por Torres | 'table' = Vista Tabla Contable)
    const [unitsViewMode, setUnitsViewMode] = useState('grid');

    // Filtros avanzados
    const [propSearchQuery, setPropSearchQuery] = useState('');
    const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
    const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

    // Ordenamiento dinámico de columnas
    const [sortField, setSortField] = useState('number'); // 'number' | 'type' | 'block' | 'area_sqm' | 'status'
    const [sortDirection, setSortDirection] = useState('asc'); // 'asc' | 'desc'

    // Modal de Inspección de Ficha de Unidad
    const [inspectingUnit, setInspectingUnit] = useState(null);

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        if (editingProp) {
            setPropertiesList(prev => prev.map(p => p.id === editingProp.id ? {
                ...p,
                type: newPropForm.type,
                number: newPropForm.number,
                block: newPropForm.block,
                floor: Number(newPropForm.floor),
                area_sqm: Number(newPropForm.area_sqm),
                status: newPropForm.status
            } : p));
            setEditingProp(null);
        } else {
            const newP = {
                id: propertiesList.length > 0 ? Math.max(...propertiesList.map(p => p.id)) + 1 : 1,
                condominium_id: adminCondoId,
                type: newPropForm.type,
                number: newPropForm.number,
                block: newPropForm.block,
                floor: Number(newPropForm.floor),
                area_sqm: Number(newPropForm.area_sqm),
                status: newPropForm.status,
                owners: [],
                residents: []
            };
            setPropertiesList(prev => [...prev, newP]);
        }
        setShowAddPropForm(false);
        setNewPropForm({ condominium_id: adminCondoId, type: 'apartment', number: '', block: 'Torre A', floor: '', area_sqm: '', status: 'vacant' });
        setIsSubmitting(false);
    };

    // Calcular superficie total del condominio para el cálculo dinámico de Alícuota %
    const totalCondoAreaSqm = useMemo(() => {
        return adminFilteredProperties.reduce((acc, p) => acc + (Number(p.area_sqm) || 0), 0) || 1000;
    }, [adminFilteredProperties]);

    // Filtrado y Ordenamiento de Propiedades
    const processedProperties = useMemo(() => {
        return adminFilteredProperties
            .filter(p => {
                // Filtro por tipo
                if (selectedTypeFilter !== 'all' && p.type !== selectedTypeFilter) return false;
                // Filtro por estado
                if (selectedStatusFilter !== 'all' && p.status !== selectedStatusFilter) return false;
                // Búsqueda por texto
                if (propSearchQuery) {
                    const q = propSearchQuery.toLowerCase();
                    const numMatch = p.number?.toString().toLowerCase().includes(q);
                    const blockMatch = p.block?.toLowerCase().includes(q);
                    const typeMatch = p.type?.toLowerCase().includes(q);
                    const statusMatch = p.status?.toLowerCase().includes(q);
                    const ownerMatch = p.owners?.some(o => o.toLowerCase().includes(q));
                    const residentMatch = p.residents?.some(r => r.toLowerCase().includes(q));
                    return numMatch || blockMatch || typeMatch || statusMatch || ownerMatch || residentMatch;
                }
                return true;
            })
            .sort((a, b) => {
                let aVal = a[sortField];
                let bVal = b[sortField];

                if (sortField === 'area_sqm' || sortField === 'floor') {
                    aVal = Number(aVal) || 0;
                    bVal = Number(bVal) || 0;
                } else {
                    aVal = String(aVal || '').toLowerCase();
                    bVal = String(bVal || '').toLowerCase();
                }

                if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
    }, [adminFilteredProperties, selectedTypeFilter, selectedStatusFilter, propSearchQuery, sortField, sortDirection]);

    // Agrupamiento por Torre/Bloque y Piso para la Vista Malla de Unidades
    const propertiesByBlock = useMemo(() => {
        const map = {};
        processedProperties.forEach(p => {
            const blockName = p.block || 'Torre A';
            if (!map[blockName]) map[blockName] = [];
            map[blockName].push(p);
        });
        return map;
    }, [processedProperties]);

    // KPIs de Ocupación y Superficie Total
    const statsSummary = useMemo(() => {
        const total = processedProperties.length;
        const occupied = processedProperties.filter(p => p.status === 'occupied').length;
        const vacant = processedProperties.filter(p => p.status === 'vacant').length;
        const rate = total > 0 ? Math.round((occupied / total) * 100) : 0;
        const totalSqm = processedProperties.reduce((acc, p) => acc + (Number(p.area_sqm) || 0), 0);
        return { total, occupied, vacant, rate, totalSqm };
    }, [processedProperties]);

    const [isBannerDismissed, setIsBannerDismissed] = useState(false);

    return (
        <div className="space-y-6 animate-fade-in text-left font-outfit">
            {/* Banner de Cabecera Generoso Colapsable del Módulo de Propiedades */}
            {!isBannerDismissed ? (
                <div className="bg-gradient-to-r from-indigo-50/80 via-white to-slate-50 dark:from-indigo-950/60 dark:via-slate-900 dark:to-slate-950 border border-indigo-200/80 dark:border-indigo-900/40 rounded-2xl p-6 relative overflow-hidden shadow-xs">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                        <div className="space-y-1 max-w-3xl">
                            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20">
                                🏢 Registro & Estructura Arquitectónica
                            </span>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                                Propiedades, Coeficientes & Malla de Torres
                            </h3>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                Gestión integral de las unidades habitacionales, locales comerciales y bienes comunes de {activeCondoName}. Configure la malla de torres, desglose los coeficientes de prorrateo por m², administre las asignaciones de estacionamientos y bodegas, e inspeccione la Ficha Técnica 360° de cada propiedad.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsBannerDismissed(true)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shrink-0 self-start md:self-center"
                            title="Minimizar cabecera informativa"
                        >
                            <span>✕ Minimizar</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex justify-start">
                    <button
                        type="button"
                        onClick={() => setIsBannerDismissed(false)}
                        className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800/60"
                    >
                        <span>ℹ️ Mostrar guía de Propiedades & Torres</span>
                        <span>▼</span>
                    </button>
                </div>
            )}

            {/* Sub-Pestañas (Fichas) del Módulo de Propiedades con Subrayado Activo (Estilo Finanzas) */}
            <div className="flex border-b border-slate-200 dark:border-slate-800/80 w-full overflow-x-auto">
                <button
                    onClick={() => setSubTab('units_table')}
                    className={`px-5 py-3 font-bold text-xs uppercase tracking-wider transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                        subTab === 'units_table'
                            ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 font-extrabold'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    <span>📋</span>
                    <span>Registro de Unidades ({adminFilteredProperties.length})</span>
                </button>

                <button
                    onClick={() => setSubTab('visual_builder')}
                    className={`px-5 py-3 font-bold text-xs uppercase tracking-wider transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                        subTab === 'visual_builder'
                            ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400 font-extrabold'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                >
                    <span>🎨</span>
                    <span>Malla Arquitectónica Visual</span>
                </button>
            </div>

            {/* VISTA FICHA 2: MALLA ARQUITECTÓNICA VISUAL */}
            {subTab === 'visual_builder' && (
                <PropertyStructureBuilder 
                    activeCondoId={adminCondoId} 
                    condosList={condosList} 
                    allCondominiums={allCondominiums}
                    propertiesList={adminFilteredProperties.length > 0 ? adminFilteredProperties : propertiesList}
                    setPropertiesList={setPropertiesList}
                />
            )}

            {/* VISTA FICHA 1: REGISTRO DE UNIDADES (MALLA VISUAL POR TORRES O TABLA CONTABLE) */}
            {subTab === 'units_table' && (
                <div className="space-y-6">
                    {/* Tarjetas de Resumen KPI (Estandarizado) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Total Unidades</span>
                            <div className="text-xl font-black text-slate-900 dark:text-white mt-1">{statsSummary.total}</div>
                            <span className="text-[10px] text-slate-500">{Object.keys(propertiesByBlock).length} Torres/Sectores</span>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-wider block">Unidades Ocupadas</span>
                            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{statsSummary.occupied}</div>
                            <span className="text-[10px] text-emerald-500 font-bold">{statsSummary.rate}% Tasa Ocupación</span>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-wider block">Disponibles / Vacantes</span>
                            <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1">{statsSummary.vacant}</div>
                            <span className="text-[10px] text-amber-500 font-bold">Listas para asignación</span>
                        </div>
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-wider block">Superficie Total</span>
                            <div className="text-xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{statsSummary.totalSqm.toLocaleString()} m²</div>
                            <span className="text-[10px] text-indigo-500 font-bold">Prorrateo alícuotas</span>
                        </div>
                    </div>

                    {/* Barra de Filtros Avanzada Estandarizada */}
                    <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm space-y-3">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            {/* Selector de Modo de Vista (Malla Visual vs Tabla) */}
                            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl shrink-0">
                                <button
                                    onClick={() => setUnitsViewMode('grid')}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                                        unitsViewMode === 'grid'
                                            ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-extrabold'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                                    }`}
                                >
                                    <span>🏢</span>
                                    <span>Vista Malla por Torres</span>
                                </button>
                                <button
                                    onClick={() => setUnitsViewMode('table')}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 ${
                                        unitsViewMode === 'table'
                                            ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm font-extrabold'
                                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                                    }`}
                                >
                                    <span>📊</span>
                                    <span>Vista Tabla Contable</span>
                                </button>
                            </div>

                            {/* Buscador Omnicanal */}
                            <div className="relative flex-1 min-w-[240px]">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 text-xs">🔍</span>
                                <input
                                    type="text"
                                    placeholder="Buscar por número de depto, torre, residente, propietario..."
                                    value={propSearchQuery}
                                    onChange={(e) => setPropSearchQuery(e.target.value)}
                                    className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            {/* Filtros por Select */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <select
                                    value={selectedTypeFilter}
                                    onChange={(e) => setSelectedTypeFilter(e.target.value)}
                                    className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="all">Todos los Tipos</option>
                                    <option value="apartment">Departamento</option>
                                    <option value="house">Casa</option>
                                    <option value="parking">Estacionamiento</option>
                                    <option value="storage">Bodega</option>
                                    <option value="commercial">Local Comercial</option>
                                </select>

                                <select
                                    value={selectedStatusFilter}
                                    onChange={(e) => setSelectedStatusFilter(e.target.value)}
                                    className="px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-xl text-xs focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="all">Todos los Estados</option>
                                    <option value="occupied">Ocupado</option>
                                    <option value="vacant">Desocupado / Disponible</option>
                                    <option value="maintenance">En Mantenimiento</option>
                                </select>

                                <button
                                    onClick={() => {
                                        setEditingProp(null);
                                        setNewPropForm({ condominium_id: adminCondoId, type: 'apartment', number: '', block: 'Torre A', floor: '', area_sqm: '', status: 'vacant' });
                                        setShowAddPropForm(!showAddPropForm);
                                    }}
                                    className="px-4 py-2 bg-brand-teal hover:bg-brand-teal-light text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
                                >
                                    <span>{showAddPropForm ? '✕ Cerrar' : '➕ Añadir Unidad'}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Formulario de Alta / Edición de Propiedad */}
                    {showAddPropForm && (
                        <form onSubmit={handleFormSubmit} className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-4 max-w-xl text-left shadow-lg">
                            <h5 className="text-xs font-bold text-gray-800 dark:text-slate-200 uppercase">{editingProp ? '✏️ Editar Propiedad' : '🏢 Detalles de la Propiedad'}</h5>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="prop-type" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Tipo de Unidad</label>
                                    <select
                                        id="prop-type"
                                        value={newPropForm.type}
                                        onChange={(e) => setNewPropForm(prev => ({ ...prev, type: e.target.value }))}
                                        className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                    >
                                        <option value="apartment">Departamento</option>
                                        <option value="house">Casa</option>
                                        <option value="parking">Estacionamiento</option>
                                        <option value="storage">Bodega</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="prop-number" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Número / Identificador</label>
                                    <input
                                        id="prop-number"
                                        type="text"
                                        required
                                        value={newPropForm.number}
                                        onChange={(e) => setNewPropForm(prev => ({ ...prev, number: e.target.value }))}
                                        className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="prop-block" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Torre / Bloque</label>
                                    <input
                                        id="prop-block"
                                        type="text"
                                        value={newPropForm.block}
                                        onChange={(e) => setNewPropForm(prev => ({ ...prev, block: e.target.value }))}
                                        className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="prop-floor" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Piso</label>
                                    <input
                                        id="prop-floor"
                                        type="number"
                                        value={newPropForm.floor}
                                        onChange={(e) => setNewPropForm(prev => ({ ...prev, floor: e.target.value }))}
                                        className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="prop-area" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Metros Cuadrados (m²)</label>
                                    <input
                                        id="prop-area"
                                        type="number"
                                        value={newPropForm.area_sqm}
                                        onChange={(e) => setNewPropForm(prev => ({ ...prev, area_sqm: e.target.value }))}
                                        className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800/80 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="prop-status" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Estado de Ocupación</label>
                                <select
                                    id="prop-status"
                                    value={newPropForm.status}
                                    onChange={(e) => setNewPropForm(prev => ({ ...prev, status: e.target.value }))}
                                    className="w-full bg-white dark:bg-slate-950 border border-gray-300 dark:border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white focus:outline-none"
                                >
                                    <option value="occupied">Ocupado</option>
                                    <option value="vacant">Desocupado</option>
                                    <option value="maintenance">Mantenimiento</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-brand-teal hover:bg-brand-teal-light text-white font-bold text-xs rounded-xl shadow disabled:opacity-50 disabled:cursor-not-allowed">
                                    {editingProp ? 'Guardar Cambios' : 'Añadir Propiedad'}
                                </button>
                                <button type="button" onClick={() => { setShowAddPropForm(false); setEditingProp(null); }} className="px-4 py-2 bg-gray-200 dark:bg-slate-800 dark:text-white text-gray-700 font-bold text-xs rounded-xl">
                                    Cancelar
                                </button>
                            </div>
                        </form>
                    )}

                    {/* VISTA A: MALLA VISUAL DE UNIDADES POR TORRE Y PISO */}
                    {unitsViewMode === 'grid' && (
                        <div className="space-y-6">
                            {Object.keys(propertiesByBlock).length === 0 ? (
                                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400">
                                    <span className="text-4xl block mb-2">🔍</span>
                                    <p className="text-sm font-bold">No se encontraron propiedades que coincidan con la búsqueda.</p>
                                </div>
                            ) : (
                                Object.entries(propertiesByBlock).map(([blockName, propsList]) => {
                                    // Agrupar propiedades de esta torre por número de piso
                                    const floorsMap = {};
                                    propsList.forEach(p => {
                                        const fNum = p.floor || 1;
                                        if (!floorsMap[fNum]) floorsMap[fNum] = [];
                                        floorsMap[fNum].push(p);
                                    });
                                    const floorNumbers = Object.keys(floorsMap).map(Number).sort((a, b) => b - a); // Pisos superiores arriba

                                    return (
                                        <div key={blockName} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                                            {/* Cabecera de Torre / Bloque */}
                                            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center font-black text-sm">
                                                        🏢
                                                    </span>
                                                    <div>
                                                        <h3 className="text-base font-black text-slate-900 dark:text-white">{blockName}</h3>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                                            {propsList.length} Unidades · {propsList.filter(p => p.status === 'occupied').length} Ocupadas · {propsList.reduce((acc, p) => acc + (Number(p.area_sqm) || 0), 0)} m² Totales
                                                        </p>
                                                    </div>
                                                </div>

                                                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                                    {floorNumbers.length} Pisos
                                                </span>
                                            </div>

                                            {/* Grilla de Pisos y Celdas de Departamentos */}
                                            <div className="space-y-3">
                                                {floorNumbers.map(floorNum => (
                                                    <div key={floorNum} className="flex flex-col md:flex-row items-stretch md:items-center gap-2 bg-slate-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800/80">
                                                        <div className="w-20 shrink-0 text-[11px] font-black text-slate-400 uppercase tracking-wider text-center md:text-left">
                                                            Piso {floorNum}
                                                        </div>

                                                        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                                                            {floorsMap[floorNum].map(p => {
                                                                const isOccupied = p.status === 'occupied';
                                                                const isVacant = p.status === 'vacant';
                                                                const ownerText = p.owners?.length ? p.owners[0] : 'Sin Propietario';

                                                                return (
                                                                    <button
                                                                        key={p.id}
                                                                        onClick={() => setInspectingUnit(p)}
                                                                        className={`p-2.5 rounded-xl border text-left transition-all hover:scale-[1.02] shadow-xs flex flex-col justify-between space-y-1.5 ${
                                                                            isOccupied
                                                                                ? 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500 text-emerald-950 dark:text-emerald-100'
                                                                                : isVacant
                                                                                ? 'bg-amber-500/10 border-amber-500/30 hover:border-amber-500 text-amber-950 dark:text-amber-100'
                                                                                : 'bg-slate-500/10 border-slate-500/30 hover:border-slate-500 text-slate-900 dark:text-slate-100'
                                                                        }`}
                                                                    >
                                                                        <div className="flex items-center justify-between gap-1">
                                                                            <span className="font-black text-xs">#{p.number}</span>
                                                                            <span className={`w-2 h-2 rounded-full ${isOccupied ? 'bg-emerald-500' : isVacant ? 'bg-amber-500' : 'bg-slate-400'}`}></span>
                                                                        </div>

                                                                        <div className="text-[10px] font-medium opacity-85 truncate">
                                                                            {p.type === 'apartment' ? '🏢 Depto' : p.type === 'parking' ? '🚗 Estac.' : p.type === 'storage' ? '📦 Bodega' : p.type} · {p.area_sqm || 70}m²
                                                                        </div>

                                                                        <div className="text-[9px] font-bold truncate opacity-75">
                                                                            👤 {ownerText}
                                                                        </div>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}

                    {/* VISTA B: TABLA DE REGISTRO CONTABLE CON ENCABEZADOS ORDENABLES */}
                    {unitsViewMode === 'table' && (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                        <SimpleTable
                            headers={[
                                <button key="h-num" onClick={() => handleSort('number')} className="flex items-center gap-1 font-bold">
                                    <span>Unidad</span>
                                    <span>{sortField === 'number' ? (sortDirection === 'asc' ? '⬆️' : '⬇️') : '↕️'}</span>
                                </button>,
                                <button key="h-type" onClick={() => handleSort('type')} className="flex items-center gap-1 font-bold">
                                    <span>Tipo</span>
                                    <span>{sortField === 'type' ? (sortDirection === 'asc' ? '⬆️' : '⬇️') : '↕️'}</span>
                                </button>,
                                <button key="h-block" onClick={() => handleSort('block')} className="flex items-center gap-1 font-bold">
                                    <span>Ubicación</span>
                                    <span>{sortField === 'block' ? (sortDirection === 'asc' ? '⬆️' : '⬇️') : '↕️'}</span>
                                </button>,
                                <button key="h-area" onClick={() => handleSort('area_sqm')} className="flex items-center gap-1 font-bold">
                                    <span>Área (m²)</span>
                                    <span>{sortField === 'area_sqm' ? (sortDirection === 'asc' ? '⬆️' : '⬇️') : '↕️'}</span>
                                </button>,
                                <button key="h-status" onClick={() => handleSort('status')} className="flex items-center gap-1 font-bold">
                                    <span>Ocupación</span>
                                    <span>{sortField === 'status' ? (sortDirection === 'asc' ? '⬆️' : '⬇️') : '↕️'}</span>
                                </button>,
                                'Vecinos Asignados',
                                'Acciones'
                            ]}
                            rows={processedProperties.map(p => {
                                const ownersListText = p.owners?.join(', ') || 'Sin Propietario';
                                const residentsListText = p.residents?.join(', ') || 'Sin Residente';
                                
                                return {
                                    cells: [
                                        <button 
                                            key={`num-${p.id}`} 
                                            onClick={() => setInspectingUnit(p)}
                                            className="font-black text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5"
                                        >
                                            <span>#{p.number}</span>
                                            <span className="text-[10px] bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 rounded-md">🔍 Ver</span>
                                        </button>,
                                        <span className="capitalize text-xs font-mono" key={`type-${p.id}`}>
                                            {p.type === 'apartment' ? 'Depto' : p.type === 'parking' ? 'Estac.' : p.type}
                                        </span>,
                                        <span key={`loc-${p.id}`}>{p.block || 'Torre A'} &bull; Piso {p.floor || 1}</span>,
                                        <span className="font-mono text-xs font-bold" key={`area-${p.id}`}>{p.area_sqm || 0} m²</span>,
                                        <span key={`status-${p.id}`} className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                            p.status === 'occupied'
                                                ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                                : p.status === 'vacant'
                                                ? 'bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400'
                                                : 'bg-slate-500/10 border border-slate-500/20 text-slate-500'
                                        }`}>
                                            {p.status === 'occupied' ? 'Ocupado' : p.status === 'vacant' ? 'Disponible' : p.status}
                                        </span>,
                                        <div className="text-xs space-y-0.5" key={`vec-${p.id}`}>
                                            <div><span className="text-[10px] font-bold text-indigo-500 uppercase">Prop:</span> {ownersListText}</div>
                                            <div><span className="text-[10px] font-bold text-emerald-500 uppercase">Resi:</span> {residentsListText}</div>
                                        </div>,
                                        <div className="flex items-center gap-2 justify-end" key={`act-${p.id}`}>
                                            <button
                                                type="button"
                                                onClick={() => setInspectingUnit(p)}
                                                className="px-2 py-1 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg transition-all"
                                                title="Inspeccionar Ficha Completa"
                                            >
                                                🔍 Ficha
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingProp(p);
                                                    setNewPropForm({
                                                        condominium_id: p.condominium_id,
                                                        type: p.type,
                                                        number: p.number,
                                                        block: p.block || 'Torre A',
                                                        floor: p.floor || '',
                                                        area_sqm: p.area_sqm || '',
                                                        status: p.status
                                                    });
                                                    setShowAddPropForm(true);
                                                }}
                                                className="px-2 py-1 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-white text-xs font-bold rounded-lg transition-all"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (confirm(`¿Eliminar la unidad #${p.number}?`)) {
                                                        setPropertiesList(prev => prev.filter(item => item.id !== p.id));
                                                    }
                                                }}
                                                className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-lg transition-all"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    ]
                                };
                            })}
                        />
                    </div>
                )}
            </div>
        )}

            {/* MODAL FICHA TÉCNICA 360° UNIFICADA */}
            <UnitDetailModal360
                inspectingUnit={inspectingUnit}
                onClose={() => setInspectingUnit(null)}
                onSaveUnit={(updatedUnit) => {
                    setPropertiesList(prev => prev.map(p => 
                        (p.id === updatedUnit.id || String(p.number) === String(updatedUnit.number)) 
                            ? { ...p, ...updatedUnit } 
                            : p
                    ));
                }}
                allProperties={adminFilteredProperties}
                activeCondoName={activeCondoName}
            />
        </div>
    );
}
