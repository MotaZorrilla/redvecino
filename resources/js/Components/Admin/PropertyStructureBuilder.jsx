import React, { useState, useMemo } from 'react';
import api from '@/bootstrap';
import Modal from '@/Components/Modal';

export default function PropertyStructureBuilder({
    allCondominiums = [],
    activeCondoId = '',
    propertiesList = [],
    setPropertiesList = () => {},
    onStructureSaved = () => {}
}) {
    const [selectedCondoId, setSelectedCondoId] = useState(activeCondoId || allCondominiums[0]?.id || '');
    const [viewMode, setViewMode] = useState('visual_grid'); // 'visual_grid' | 'generator' | 'alicuotas'
    const [isSaving, setIsSaving] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState(null); // Unit Modal inspector
    const [searchQuery, setSearchQuery] = useState(''); // Buscador dinámico

    // Encontrar nombre del condominio activo
    const activeCondoName = useMemo(() => {
        const found = allCondominiums.find(c => String(c.id) === String(selectedCondoId || activeCondoId));
        return found ? found.name : 'Condominio Principal';
    }, [allCondominiums, selectedCondoId, activeCondoId]);

    // Configuración de Torres y Unidades sincronizada con el estado maestro o mock inicial
    const [towers, setTowers] = useState([
        {
            id: 1,
            name: 'Torre A',
            floors: 10,
            units_per_floor: 4,
            has_water_meter: true,
            has_electricity_meter: true,
            units: Array.from({ length: 40 }, (_, i) => {
                const floor = Math.floor(i / 4) + 1;
                const numInFloor = (i % 4) + 1;
                const unitNum = `${floor}${numInFloor.toString().padStart(2, '0')}`;
                return {
                    id: `ta-${floor}-${numInFloor}`,
                    number: unitNum,
                    block: 'Torre A',
                    floor: floor,
                    area_sqm: floor === 10 ? 95 : 70, // PH en piso 10
                    type: floor === 10 ? 'penthouse' : 'apartment',
                    status: 'vacant',
                    parkings: [`E-${floor}${numInFloor}-A`, `E-${floor}${numInFloor}-B`], // Múltiples estacionamientos
                    storages: [`B-${floor}${numInFloor}`], // Múltiples bodegas
                    owners: ['Carlos Mendoza (RUT: 12.345.678-9)'],
                    residents: ['Familia Mendoza']
                };
            })
        },
        {
            id: 2,
            name: 'Torre B',
            floors: 10,
            units_per_floor: 4,
            has_water_meter: true,
            has_electricity_meter: false,
            units: Array.from({ length: 40 }, (_, i) => {
                const floor = Math.floor(i / 4) + 1;
                const numInFloor = (i % 4) + 1;
                const unitNum = `${floor}${numInFloor.toString().padStart(2, '0')}`;
                return {
                    id: `tb-${floor}-${numInFloor}`,
                    number: unitNum,
                    block: 'Torre B',
                    floor: floor,
                    area_sqm: 70,
                    type: 'apartment',
                    status: 'vacant',
                    parkings: [`E-B${floor}${numInFloor}`],
                    storages: [`B-B${floor}${numInFloor}`],
                    owners: ['María Silva (RUT: 15.678.901-2)'],
                    residents: ['María Silva']
                };
            })
        }
    ]);

    // Estadísticas globales de $m^2$ y Alícuotas
    const totalAreaSqm = useMemo(() => {
        return towers.reduce((accT, tower) => {
            return accT + tower.units.reduce((accU, u) => accU + (Number(u.area_sqm) || 0), 0);
        }, 0);
    }, [towers]);

    const totalUnitsCount = useMemo(() => {
        return towers.reduce((acc, t) => acc + t.units.length, 0);
    }, [towers]);

    // Asignación de Alícuota basada en m²
    const calculatedAlicuotas = useMemo(() => {
        if (totalAreaSqm <= 0) return {};
        const map = {};
        towers.forEach(t => {
            t.units.forEach(u => {
                const pct = ((Number(u.area_sqm) || 0) / totalAreaSqm) * 100;
                map[u.id] = pct;
            });
        });
        return map;
    }, [towers, totalAreaSqm]);

    const sumAlicuotasPct = useMemo(() => {
        return Object.values(calculatedAlicuotas).reduce((acc, val) => acc + val, 0);
    }, [calculatedAlicuotas]);

    // Acciones de Torre
    const addTower = () => {
        const nextLetter = String.fromCharCode(65 + towers.length);
        const newTowerId = Date.now();
        const defaultFloors = 8;
        const defaultUnitsPerFloor = 4;
        const newUnits = Array.from({ length: defaultFloors * defaultUnitsPerFloor }, (_, i) => {
            const floor = Math.floor(i / defaultUnitsPerFloor) + 1;
            const numInFloor = (i % defaultUnitsPerFloor) + 1;
            const unitNum = `${floor}${numInFloor.toString().padStart(2, '0')}`;
            return {
                id: `t${newTowerId}-${floor}-${numInFloor}`,
                number: unitNum,
                block: `Torre ${nextLetter}`,
                floor: floor,
                area_sqm: 70,
                type: 'apartment',
                status: 'vacant',
                parkings: [`E-${unitNum}`],
                storages: [`B-${unitNum}`],
                owners: [],
                residents: []
            };
        });

        setTowers([
            ...towers,
            {
                id: newTowerId,
                name: `Torre ${nextLetter}`,
                floors: defaultFloors,
                units_per_floor: defaultUnitsPerFloor,
                has_water_meter: true,
                has_electricity_meter: true,
                units: newUnits
            }
        ]);
    };

    const cloneTower = (sourceIdx) => {
        const source = towers[sourceIdx];
        const nextLetter = String.fromCharCode(65 + towers.length);
        const newTowerId = Date.now();
        const clonedUnits = source.units.map(u => ({
            ...u,
            id: `t${newTowerId}-${u.floor}-${u.number}`,
            block: `Torre ${nextLetter} (Copia)`
        }));

        setTowers([
            ...towers,
            {
                ...source,
                id: newTowerId,
                name: `Torre ${nextLetter} (Copia)`,
                units: clonedUnits
            }
        ]);
    };

    const removeTower = (towerId) => {
        if (towers.length <= 1) return;
        setTowers(towers.filter(t => t.id !== towerId));
    };

    // Actualización de unidad individual con soporte para múltiples estacionamientos y bodegas
    const handleUpdateUnit = (towerId, unitId, updatedFields) => {
        setTowers(prev => prev.map(t => {
            if (t.id !== towerId) return t;
            return {
                ...t,
                units: t.units.map(u => u.id === unitId ? { ...u, ...updatedFields } : u)
            };
        }));

        if (selectedUnit && selectedUnit.unit.id === unitId) {
            setSelectedUnit(prev => ({
                ...prev,
                unit: { ...prev.unit, ...updatedFields }
            }));
        }
    };

    // Guardado mediante API
    const handleSaveStructure = async () => {
        const targetCondoId = selectedCondoId || activeCondoId;
        if (!targetCondoId) {
            alert('Por favor seleccione un condominio para guardar.');
            return;
        }

        setIsSaving(true);
        try {
            const payload = {
                condominium_id: targetCondoId,
                type: 'tower',
                towers: towers.map(t => ({
                    name: t.name,
                    floors: t.floors,
                    units_per_floor: t.units_per_floor,
                    has_water_meter: t.has_water_meter,
                    has_electricity_meter: t.has_electricity_meter
                }))
            };

            const res = await api.post('/api/setup-condominium', payload);
            if (res.status === 200 || res.status === 201) {
                alert('¡Estructura de condominio generada exitosamente!');
                onStructureSaved();
            }
        } catch (error) {
            console.error('Error guardando estructura:', error);
            alert('Ocurrió un error al guardar la estructura.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 font-outfit text-slate-800 dark:text-slate-100 text-left animate-fade-in">
            {/* Header del Constructor Visual */}
            <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
                            🏢 Módulo Visual v2.0
                        </span>
                        <span className="text-[10px] font-black bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 px-3 py-1 rounded-full uppercase tracking-wider">
                            Ficha 360° Entrelazada
                        </span>
                    </div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white mt-2">
                        Malla Arquitectónica · <span className="text-indigo-600 dark:text-indigo-400">{activeCondoName}</span>
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Edificios, alícuotas, múltiples estacionamientos/bodegas y datos de propietarios sincronizados.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Buscador Integrado */}
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 text-xs">🔍</span>
                        <input
                            type="text"
                            placeholder="Buscar depto, torre, piso..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 min-w-[200px]"
                        />
                    </div>

                    <button
                        onClick={handleSaveStructure}
                        disabled={isSaving}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        <span>💾</span>
                        <span>{isSaving ? 'Guardando...' : 'Guardar Estructura'}</span>
                    </button>
                </div>
            </div>

            {/* Sub-Navegación por Pestañas */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 gap-3">
                <div className="flex items-center gap-2">
                    {[
                        { id: 'visual_grid', label: '🏢 Malla Arquitectónica Visual', icon: '🎨' },
                        { id: 'generator', label: '⚡ Generador & Clonación', icon: '📋' },
                        { id: 'alicuotas', label: '⚖️ Resumen de Alícuotas (m²)', icon: '📐' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setViewMode(tab.id)}
                            className={`px-4 py-2 text-xs font-black rounded-xl transition-all flex items-center gap-2 ${
                                viewMode === tab.id
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                    : 'bg-slate-100 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800'
                            }`}
                        >
                            <span>{tab.icon}</span>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Total: <strong className="text-indigo-600 dark:text-indigo-400">{towers.length} Torres</strong> · <strong className="text-emerald-600 dark:text-emerald-400">{totalUnitsCount} Unidades</strong> · <strong className="text-amber-600 dark:text-amber-400">{totalAreaSqm.toLocaleString()} m²</strong>
                </div>
            </div>

            {/* VISTA 1: MALLA ARQUITECTÓNICA VISUAL (Edificios Piso por Piso) */}
            {viewMode === 'visual_grid' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {towers.map((tower, tIdx) => {
                            const maxFloor = Math.max(...tower.units.map(u => u.floor), 1);
                            const floorNumbers = Array.from({ length: maxFloor }, (_, i) => maxFloor - i);

                            return (
                                <div key={tower.id} className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                                    {/* Header de la Torre */}
                                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center font-black text-sm">
                                                {String.fromCharCode(65 + tIdx)}
                                            </span>
                                            <div>
                                                <h3 className="text-base font-black text-slate-900 dark:text-white">{tower.name}</h3>
                                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                                    {tower.floors} Pisos · {tower.units.length} Deptos · {tower.units.reduce((acc, u) => acc + (Number(u.area_sqm) || 0), 0)} m²
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => cloneTower(tIdx)}
                                                className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-xl transition-all flex items-center gap-1"
                                                title="Clonar esta torre con su estructura exacta"
                                            >
                                                <span>📋</span>
                                                <span>Clonar</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Leyenda de Colores */}
                                    <div className="flex items-center gap-4 text-[10px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800/80">
                                        <span className="flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                                            <span>Departamento</span>
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                                            <span>Penthouse</span>
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                                            <span>Local Comercial</span>
                                        </span>
                                    </div>

                                    {/* Edificio Vertical (Grilla Piso por Piso) */}
                                    <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 max-h-[500px] overflow-y-auto">
                                        {floorNumbers.map(floorNum => {
                                            const floorUnits = tower.units.filter(u => {
                                                if (u.floor !== floorNum) return false;
                                                if (!searchQuery) return true;
                                                const q = searchQuery.toLowerCase();
                                                return u.number.toLowerCase().includes(q) ||
                                                       tower.name.toLowerCase().includes(q) ||
                                                       u.type.toLowerCase().includes(q);
                                            });

                                            if (searchQuery && floorUnits.length === 0) return null;

                                            return (
                                                <div key={floorNum} className="flex items-center gap-3">
                                                    <span className="w-16 text-[10px] font-extrabold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                                                        PISO {floorNum.toString().padStart(2, '0')}
                                                    </span>

                                                    <div className="flex-1 grid grid-cols-4 gap-2">
                                                        {floorUnits.map(unit => {
                                                            const alicuota = calculatedAlicuotas[unit.id] || 0;
                                                            const isSelected = selectedUnit?.unit.id === unit.id;

                                                            let typeColor = 'bg-indigo-50 dark:bg-indigo-600/20 border-indigo-200 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-600/30';
                                                            if (unit.type === 'penthouse') typeColor = 'bg-amber-50 dark:bg-amber-500/20 border-amber-200 dark:border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-500/30';
                                                            if (unit.type === 'commercial') typeColor = 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/30';

                                                            return (
                                                                <div
                                                                    key={unit.id}
                                                                    onClick={() => setSelectedUnit({ tower, unit })}
                                                                    className={`p-2.5 rounded-xl border cursor-pointer transition-all ${typeColor} ${
                                                                        isSelected ? 'ring-2 ring-indigo-500 scale-105 shadow-md' : ''
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center justify-between text-xs font-black">
                                                                        <span>#{unit.number}</span>
                                                                        <span className="text-[9px] opacity-75">{unit.area_sqm} m²</span>
                                                                    </div>
                                                                    <div className="text-[9px] opacity-70 mt-0.5">
                                                                        {alicuota.toFixed(4)}% alícuota
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* VISTA 2: GENERADOR & CLONACIÓN MASIVA */}
            {viewMode === 'generator' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Parámetros de Torres & Unidades</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Agregue o duplique torres rápidamente</p>
                        </div>
                        <button
                            onClick={addTower}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5"
                        >
                            <span>➕</span>
                            <span>Añadir Torre</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {towers.map((tower, idx) => (
                            <div key={tower.id} className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                                    <input 
                                        type="text"
                                        className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-sm font-black text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                        value={tower.name}
                                        onChange={(e) => {
                                            const updated = [...towers];
                                            updated[idx].name = e.target.value;
                                            setTowers(updated);
                                        }}
                                    />
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => cloneTower(idx)}
                                            className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 text-[10px] font-bold rounded-lg"
                                        >
                                            📋 Duplicar Torre
                                        </button>
                                        {towers.length > 1 && (
                                            <button
                                                onClick={() => removeTower(tower.id)}
                                                className="px-2 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30 text-[10px] font-bold rounded-lg"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">Cantidad de Pisos</label>
                                        <input 
                                            type="number" 
                                            min="1" 
                                            max="50"
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-bold"
                                            value={tower.floors}
                                            onChange={(e) => {
                                                const floors = parseInt(e.target.value) || 1;
                                                const updated = [...towers];
                                                updated[idx].floors = floors;
                                                const newUnits = Array.from({ length: floors * tower.units_per_floor }, (_, i) => {
                                                    const floor = Math.floor(i / tower.units_per_floor) + 1;
                                                    const numInFloor = (i % tower.units_per_floor) + 1;
                                                    const unitNum = `${floor}${numInFloor.toString().padStart(2, '0')}`;
                                                    return {
                                                        id: `t${tower.id}-${floor}-${numInFloor}`,
                                                        number: unitNum,
                                                        block: tower.name,
                                                        floor: floor,
                                                        area_sqm: 70,
                                                        type: 'apartment',
                                                        status: 'vacant',
                                                        parkings: [`E-${unitNum}`],
                                                        storages: [`B-${unitNum}`]
                                                    };
                                                });
                                                updated[idx].units = newUnits;
                                                setTowers(updated);
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">Deptos x Piso</label>
                                        <input 
                                            type="number" 
                                            min="1" 
                                            max="20"
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-bold"
                                            value={tower.units_per_floor}
                                            onChange={(e) => {
                                                const upf = parseInt(e.target.value) || 1;
                                                const updated = [...towers];
                                                updated[idx].units_per_floor = upf;
                                                const newUnits = Array.from({ length: tower.floors * upf }, (_, i) => {
                                                    const floor = Math.floor(i / upf) + 1;
                                                    const numInFloor = (i % upf) + 1;
                                                    const unitNum = `${floor}${numInFloor.toString().padStart(2, '0')}`;
                                                    return {
                                                        id: `t${tower.id}-${floor}-${numInFloor}`,
                                                        number: unitNum,
                                                        block: tower.name,
                                                        floor: floor,
                                                        area_sqm: 70,
                                                        type: 'apartment',
                                                        status: 'vacant',
                                                        parkings: [`E-${unitNum}`],
                                                        storages: [`B-${unitNum}`]
                                                    };
                                                });
                                                updated[idx].units = newUnits;
                                                setTowers(updated);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* VISTA 3: ALÍCUOTAS & RESUMEN PRORRATEO */}
            {viewMode === 'alicuotas' && (
                <div className="space-y-4 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Cálculo Proporcional de Alícuotas (%)</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Verifique la distribución exacta del prorrateo según metros cuadrados</p>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Suma Total Alícuotas</span>
                            <span className={`text-lg font-black ${Math.abs(sumAlicuotasPct - 100) < 0.01 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                {sumAlicuotasPct.toFixed(4)}%
                            </span>
                        </div>
                    </div>

                    <div className="w-full bg-slate-100 dark:bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
                        <div 
                            className="bg-gradient-to-r from-indigo-500 via-emerald-500 to-amber-500 h-full transition-all"
                            style={{ width: `${Math.min(sumAlicuotasPct, 100)}%` }}
                        ></div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 uppercase text-[10px] font-extrabold">
                                <tr>
                                    <th className="p-3">Torre</th>
                                    <th className="p-3">Depto / Unidad</th>
                                    <th className="p-3">Piso</th>
                                    <th className="p-3">Superficie (m²)</th>
                                    <th className="p-3">Alícuota Calculada (%)</th>
                                    <th className="p-3">Propietario / Residente</th>
                                    <th className="p-3">Ficha 360°</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                                {towers.flatMap(t => t.units.map(u => (
                                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                        <td className="p-3 font-bold text-slate-900 dark:text-white">{t.name}</td>
                                        <td className="p-3 font-black text-indigo-600 dark:text-indigo-400">#{u.number}</td>
                                        <td className="p-3 text-slate-500 dark:text-slate-400">Piso {u.floor}</td>
                                        <td className="p-3 font-bold">{u.area_sqm} m²</td>
                                        <td className="p-3 font-black text-emerald-600 dark:text-emerald-400">
                                            {(calculatedAlicuotas[u.id] || 0).toFixed(4)}%
                                        </td>
                                        <td className="p-3 text-[11px] text-slate-500">
                                            {u.owners?.[0] || u.residents?.[0] || 'Sin Asignación'}
                                        </td>
                                        <td className="p-3">
                                            <button
                                                onClick={() => setSelectedUnit({ tower: t, unit: u })}
                                                className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 text-[10px] font-bold rounded-lg"
                                            >
                                                🔍 Ficha 360°
                                            </button>
                                        </td>
                                    </tr>
                                )))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* MODAL FICHA TÉCNICA (Múltiples Estacionamientos/Bodegas + Datos Integrales) */}
            <Modal show={!!selectedUnit} onClose={() => setSelectedUnit(null)} maxWidth="lg">
                {selectedUnit && (
                    <div className="bg-white dark:bg-slate-900 p-6 space-y-6 text-left rounded-2xl font-outfit">
                        {/* Header Destacado del Modal */}
                        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                            <div className="flex items-center gap-3.5">
                                <span className="w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30 flex items-center justify-center font-black text-2xl">
                                    🏢
                                </span>
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-xs font-black bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 px-3 py-0.5 rounded-full uppercase">
                                            {selectedUnit.tower.name} &bull; Piso {selectedUnit.unit.floor}
                                        </span>
                                        <span className="text-xs font-black bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 px-3 py-0.5 rounded-full uppercase">
                                            {activeCondoName}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                                        Ficha Técnica &bull; Departamento {selectedUnit.unit.number}
                                    </h3>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedUnit(null)}
                                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Ficha Técnica: Datos Físicos, Financieros y Personales Entrelazados */}
                        <div className="space-y-4 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Superficie Utilizable (m²)</label>
                                    <input 
                                        type="number" 
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-3 py-2 font-black text-sm focus:ring-2 focus:ring-indigo-500"
                                        value={selectedUnit.unit.area_sqm}
                                        onChange={(e) => handleUpdateUnit(selectedUnit.tower.id, selectedUnit.unit.id, { area_sqm: Number(e.target.value) || 0 })}
                                    />
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Tipo de Inmueble</label>
                                    <select 
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-3 py-2 font-black text-xs truncate focus:ring-2 focus:ring-indigo-500"
                                        value={selectedUnit.unit.type}
                                        onChange={(e) => handleUpdateUnit(selectedUnit.tower.id, selectedUnit.unit.id, { type: e.target.value })}
                                    >
                                        <option value="apartment">Depto Habitacional</option>
                                        <option value="penthouse">Penthouse / Dúplex</option>
                                        <option value="commercial">Local Comercial</option>
                                    </select>
                                </div>
                            </div>

                            {/* Múltiples Estacionamientos y Múltiples Bodegas */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950/70 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1">
                                        🚗 Estacionamientos Asignados
                                    </label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-3 py-2 font-bold text-xs"
                                        value={(selectedUnit.unit.parkings || [selectedUnit.unit.parking || '']).join(', ')}
                                        onChange={(e) => {
                                            const arr = e.target.value.split(',').map(s => s.trim());
                                            handleUpdateUnit(selectedUnit.tower.id, selectedUnit.unit.id, { parkings: arr, parking: arr[0] });
                                        }}
                                        placeholder="Ej: E-202A, E-202B"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase text-slate-500 dark:text-slate-400 mb-1">
                                        📦 Bodegas Asignadas
                                    </label>
                                    <input 
                                        type="text" 
                                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-xl px-3 py-2 font-bold text-xs"
                                        value={(selectedUnit.unit.storages || [selectedUnit.unit.storage || '']).join(', ')}
                                        onChange={(e) => {
                                            const arr = e.target.value.split(',').map(s => s.trim());
                                            handleUpdateUnit(selectedUnit.tower.id, selectedUnit.unit.id, { storages: arr, storage: arr[0] });
                                        }}
                                        placeholder="Ej: B-15, B-16"
                                    />
                                </div>
                            </div>

                            {/* Propietarios y Residentes Vinculados */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-indigo-50/50 dark:bg-indigo-950/30 p-3.5 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                                    <span className="text-[10px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400 block mb-1">
                                        👤 Propietario Registrado
                                    </span>
                                    <span className="text-xs font-black text-slate-800 dark:text-white block truncate">
                                        {selectedUnit.unit.owners?.join(', ') || 'Carlos Mendoza (RUT: 12.345.678-9)'}
                                    </span>
                                </div>

                                <div className="bg-emerald-50/50 dark:bg-emerald-950/30 p-3.5 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
                                    <span className="text-[10px] font-extrabold uppercase text-emerald-600 dark:text-emerald-400 block mb-1">
                                        🏡 Residente / Ocupante Actual
                                    </span>
                                    <span className="text-xs font-black text-slate-800 dark:text-white block truncate">
                                        {selectedUnit.unit.residents?.join(', ') || 'Familia Mendoza'}
                                    </span>
                                </div>
                            </div>

                            {/* Coeficiente de Alícuota Calculado */}
                            <div className="bg-gradient-to-r from-indigo-500/10 via-emerald-500/10 to-amber-500/10 p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 space-y-1">
                                <span className="text-[10px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400 block">
                                    Coeficiente de Alícuota de Prorrateo (%)
                                </span>
                                <div className="text-2xl font-black text-indigo-700 dark:text-indigo-300">
                                    {(calculatedAlicuotas[selectedUnit.unit.id] || 0).toFixed(4)}%
                                </div>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                    Calculado según {selectedUnit.unit.area_sqm} m² de superficie sobre el total de {totalAreaSqm} m² en {activeCondoName}.
                                </p>
                            </div>
                        </div>

                        {/* Footer Modal */}
                        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                            <button
                                onClick={() => setSelectedUnit(null)}
                                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
                            >
                                Guardar y Cerrar
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
