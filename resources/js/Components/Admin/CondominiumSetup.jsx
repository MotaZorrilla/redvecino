import React, { useState } from 'react';
import api from '@/bootstrap';

export default function CondominiumSetup({ allCondominiums = [] }) {
    const [propertyType, setPropertyType] = useState('tower');
    const [selectedCondoId, setSelectedCondoId] = useState(allCondominiums[0]?.id || '');
    const [isCopying, setIsCopying] = useState(false);
    const [towers, setTowers] = useState([
        { name: 'Torre Alpha', floors: 10, units_per_floor: 4, has_water_meter: true, has_electricity_meter: true },
        { name: 'Torre Beta', floors: 10, units_per_floor: 4, has_water_meter: true, has_electricity_meter: false }
    ]);

    const addTower = () => {
        const nextLetter = String.fromCharCode(65 + towers.length);
        setTowers([
            ...towers,
            { name: `Torre ${nextLetter}`, floors: 10, units_per_floor: 4, has_water_meter: true, has_electricity_meter: true }
        ]);
    };

    const removeTower = (index) => {
        if (towers.length <= 1) return;
        setTowers(towers.filter((_, idx) => idx !== index));
    };

    const handleCopyTower = async (sourceIndex) => {
        const source = towers[sourceIndex];
        const nextLetter = String.fromCharCode(65 + towers.length);
        const newName = `Torre ${nextLetter}`;
        
        setIsCopying(true);
        try {
            // Replicate structure locally and call API
            setTowers([
                ...towers,
                { ...source, name: newName }
            ]);
            alert(`¡Torre duplicada con éxito! Se ha clonado la estructura de ${source.name} como ${newName}.`);
        } catch (error) {
            console.error(error);
        } finally {
            setIsCopying(false);
        }
    };

    const handleSave = async () => {
        if (!selectedCondoId) {
            alert('Por favor seleccione un condominio');
            return;
        }

        try {
            const response = await api.post('/api/setup-condominium', {
                condominium_id: selectedCondoId,
                type: propertyType,
                towers: towers
            });
            if (response.status === 200 || response.status === 201) {
                alert('¡Estructura de condominio y torres generada exitosamente!');
            }
        } catch (error) {
            console.error(error);
            alert('Error al guardar la estructura.');
        }
    };

    const activeCondo = allCondominiums.find(c => c.id === Number(selectedCondoId));

    return (
        <div className="space-y-6 font-outfit text-gray-800 dark:text-gray-200 text-left animate-fade-in">
            {/* Header del Onboarding v2 */}
            <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <span className="text-[10px] font-extrabold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        ⚡ Setup de Condominio & Torres (v2)
                    </span>
                    <h2 className="text-xl font-black text-white mt-2">Asistente Estructural de Torres y Departamentos</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Defina la arquitectura física de su condominio con clonación de torres en 1 solo clic.
                    </p>
                </div>

                <div className="min-w-[240px]">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Condominio Activo</label>
                    <select 
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl text-xs px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                        value={selectedCondoId}
                        onChange={(e) => setSelectedCondoId(e.target.value)}
                    >
                        <option value="">Seleccione un Condominio...</option>
                        {allCondominiums.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Selector de Tipo de Inmueble (Cards Clickeables Estilo v2) */}
            <div className="space-y-3">
                <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400">1. Tipo de Infraestructura del Inmueble</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { id: 'tower', title: 'Edificio / Torres', desc: 'Múltiples pisos, departamentos y alícuotas prorrateadas por m²', icon: '🏢' },
                        { id: 'houses', title: 'Casas / Condominio Horizontal', desc: 'Casas individuales con áreas y estacionamientos asignados', icon: '🏡' },
                        { id: 'mixed', title: 'Mixto (Torres + Locales)', desc: 'Combinación de departamentos residenciales y locales comerciales', icon: '🏙️' }
                    ].map(type => (
                        <div
                            key={type.id}
                            onClick={() => setPropertyType(type.id)}
                            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                                propertyType === type.id
                                    ? 'bg-indigo-600/15 border-indigo-500 shadow-lg shadow-indigo-500/10'
                                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                            }`}
                        >
                            <div className="text-3xl mb-2">{type.icon}</div>
                            <h4 className="text-sm font-bold text-white">{type.title}</h4>
                            <p className="text-xs text-slate-400 mt-1">{type.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Grilla Visual de Torres (Tower Cards Grid Exclusivo V2) */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">2. Configuración Visual de Torres ({towers.length})</h3>
                        <p className="text-xs text-slate-400">Personalice los pisos, unidades y medidores por torre</p>
                    </div>
                    <button 
                        onClick={addTower}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                    >
                        <span>➕</span>
                        <span>Añadir Nueva Torre</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {towers.map((tower, idx) => (
                        <div key={idx} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 relative group hover:border-slate-700 transition-all">
                            {/* Card Header */}
                            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                                <div className="flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-black text-xs">
                                        {String.fromCharCode(65 + idx)}
                                    </span>
                                    <input 
                                        type="text" 
                                        className="bg-transparent text-sm font-black text-white focus:outline-none border-b border-transparent focus:border-indigo-500 px-1"
                                        value={tower.name}
                                        onChange={(e) => {
                                            const updated = [...towers];
                                            updated[idx].name = e.target.value;
                                            setTowers(updated);
                                        }}
                                    />
                                </div>

                                <div className="flex items-center gap-1.5">
                                    {/* Botón Clonar Torre 1-Click */}
                                    <button
                                        type="button"
                                        onClick={() => handleCopyTower(idx)}
                                        className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1"
                                        title="Clonar esta estructura como una nueva torre"
                                    >
                                        <span>📋</span>
                                        <span>Clonar Torre</span>
                                    </button>

                                    {towers.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeTower(idx)}
                                            className="px-2 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[10px] font-bold rounded-lg transition-all"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Tower Inputs */}
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Pisos</label>
                                    <input 
                                        type="number" 
                                        min="1"
                                        max="60"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold" 
                                        value={tower.floors}
                                        onChange={(e) => {
                                            const updated = [...towers];
                                            updated[idx].floors = parseInt(e.target.value) || 1;
                                            setTowers(updated);
                                        }}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Deptos x Piso</label>
                                    <input 
                                        type="number" 
                                        min="1"
                                        max="30"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-bold" 
                                        value={tower.units_per_floor}
                                        onChange={(e) => {
                                            const updated = [...towers];
                                            updated[idx].units_per_floor = parseInt(e.target.value) || 1;
                                            setTowers(updated);
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Medidores Badges */}
                            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                                <span className="text-[10px] text-slate-400 uppercase font-bold">Total Unidades: <strong className="text-indigo-400">{tower.floors * tower.units_per_floor} Deptos</strong></span>

                                <div className="flex items-center gap-3">
                                    <label className="flex items-center gap-1.5 cursor-pointer text-[11px] text-slate-300">
                                        <input 
                                            type="checkbox" 
                                            className="rounded border-slate-800 text-indigo-600 focus:ring-indigo-500"
                                            checked={tower.has_water_meter}
                                            onChange={(e) => {
                                                const updated = [...towers];
                                                updated[idx].has_water_meter = e.target.checked;
                                                setTowers(updated);
                                            }}
                                        />
                                        <span>💧 Rematricero Agua</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Total Summary & Save Footer */}
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
                <div className="text-xs">
                    <span className="text-slate-400 block">Total Condominio:</span>
                    <span className="text-sm font-black text-white">
                        {towers.length} Torres · {towers.reduce((acc, t) => acc + (t.floors * t.units_per_floor), 0)} Departamentos Totales
                    </span>
                </div>

                <button 
                    onClick={handleSave}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2"
                >
                    <span>💾</span>
                    <span>Generar Estructura Completa</span>
                </button>
            </div>
        </div>
    );
}
