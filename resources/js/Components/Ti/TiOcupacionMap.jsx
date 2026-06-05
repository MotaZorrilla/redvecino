import { useState } from 'react';

export default function TiOcupacionMap({
    propertiesList = [],
    setPropertiesList,
    showAddPropForm,
    setShowAddPropForm,
    newPropForm,
    setNewPropForm,
    selectedAuditChat,
    setSelectedAuditChat,
    usersList = [],
    setImpersonatedUser,
    setTerminalLogs
}) {
    return (
        <div className="space-y-6 animate-fade-in text-left">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h4 className="text-sm font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
                        🏢 Grid 2D de Propiedades y Mapa de Morosidad
                    </h4>
                    <button
                        onClick={() => setShowAddPropForm(!showAddPropForm)}
                        className="px-4 py-2 bg-brand-teal hover:bg-brand-teal-light text-white font-bold text-xs rounded-xl shadow-lg transition-all animate-fade-in shrink-0"
                    >
                        {showAddPropForm ? 'Cerrar Formulario' : 'Crear Propiedad'}
                    </button>
                </div>
                <div className="flex gap-4 text-[10px] font-bold">
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Al día</span>
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" /> Moroso &gt;= 3 meses</span>
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500" /> Mantenimiento</span>
                    <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-500" /> Vacante</span>
                </div>
            </div>

            {showAddPropForm && (
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const newP = {
                        id: propertiesList.length + 1,
                        condominium_id: 1,
                        condo_name: 'Residencial MiVecino',
                        type: newPropForm.type,
                        number: newPropForm.number,
                        block: newPropForm.block || 'Torre A',
                        floor: Number(newPropForm.floor) || 1,
                        area_sqm: Number(newPropForm.area_sqm) || 60,
                        status: newPropForm.status,
                        owners: ['Asignado en Venta'],
                        residents: ['Vacante']
                    };
                    setPropertiesList(prev => [...prev, newP]);
                    setTerminalLogs(prev => [...prev, `[PROPIEDAD] Creada propiedad #${newP.number} en Piso ${newP.floor}`]);
                    setShowAddPropForm(false);
                    setNewPropForm({ condominium_id: 1, type: 'apartment', number: '', block: 'Torre A', floor: '', area_sqm: '', status: 'vacant' });
                }} className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 space-y-4 max-w-xl text-left mb-6">
                    <h5 className="text-xs font-bold text-slate-300 uppercase">Detalles de la Unidad</h5>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="om-number" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Número de Depto</label>
                            <input
                                id="om-number"
                                type="text"
                                required
                                placeholder="Ej: 504"
                                value={newPropForm.number}
                                onChange={(e) => setNewPropForm(prev => ({ ...prev, number: e.target.value }))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs px-3 py-2 text-white focus:outline-none focus:border-brand-teal"
                            />
                        </div>
                        <div>
                            <label htmlFor="om-floor" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Piso</label>
                            <input
                                id="om-floor"
                                type="number"
                                required
                                placeholder="Ej: 5"
                                value={newPropForm.floor}
                                onChange={(e) => setNewPropForm(prev => ({ ...prev, floor: e.target.value }))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs px-3 py-2 text-white focus:outline-none focus:border-brand-teal"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="om-type" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Tipo de Propiedad</label>
                            <select
                                id="om-type"
                                value={newPropForm.type}
                                onChange={(e) => setNewPropForm(prev => ({ ...prev, type: e.target.value }))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs px-3 py-2 text-white focus:outline-none focus:border-brand-teal cursor-pointer"
                            >
                                <option value="apartment">Departamento</option>
                                <option value="house">Casa</option>
                                <option value="parking">Estacionamiento</option>
                                <option value="storage">Bodega</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="om-status" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Estado de Pago / Convivencia</label>
                            <select
                                id="om-status"
                                value={newPropForm.status}
                                onChange={(e) => setNewPropForm(prev => ({ ...prev, status: e.target.value }))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs px-3 py-2 text-white focus:outline-none focus:border-brand-teal cursor-pointer"
                            >
                                <option value="occupied">Ocupado (Al día)</option>
                                <option value="delinquent">{"Moroso (>= 3 meses)"}</option>
                                <option value="maintenance">Mantenimiento</option>
                                <option value="vacant">Vacante / Disponible</option>
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="px-4 py-2 bg-brand-teal text-white font-bold text-xs rounded-xl shadow-md">
                        Guardar Propiedad
                    </button>
                </form>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/80 p-6 rounded-[24px] space-y-4 shadow-inner">
                    <h5 className="text-xs font-bold text-slate-400 text-left">Torre A - MiVecino Residences</h5>
                    
                    <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((floor) => (
                            <div key={floor} className="flex items-center gap-4">
                                <span className="text-[10px] font-bold text-slate-500 w-12 font-mono uppercase shrink-0">Piso {floor}</span>
                                <div className="grid grid-cols-4 gap-3 flex-1">
                                    {[1, 2, 3, 4].map((num) => {
                                        const condoNum = `Depto ${floor}0${num}`;
                                        const property = propertiesList.find(p => p.number === `${floor}0${num}`) || {
                                            id: floor * 100 + num,
                                            number: `${floor}0${num}`,
                                            status: floor === 2 && num === 1 ? 'delinquent' : floor === 3 && num === 3 ? 'vacant' : floor === 4 && num === 2 ? 'maintenance' : 'occupied',
                                            owners: ['Juan Pérez'],
                                            residents: ['Carlos Resident']
                                        };
                                        
                                        const status = property.status;
                                        let color = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25';
                                        if (status === 'delinquent' || condoNum === 'Depto 201') {
                                            color = 'bg-rose-500/10 border-rose-500/40 text-rose-400 hover:bg-rose-500/25 shadow-lg shadow-rose-950/15 animate-pulse';
                                        } else if (status === 'maintenance' || condoNum === 'Depto 202' || condoNum === 'Depto 402') {
                                            color = 'bg-amber-500/10 border-amber-500/40 text-amber-400 hover:bg-amber-500/25';
                                        } else if (status === 'vacant' || condoNum === 'Depto 102' || condoNum === 'Depto 303') {
                                            color = 'bg-slate-500/10 border-slate-500/30 text-slate-400 hover:bg-slate-500/25';
                                        }

                                        return (
                                            <button
                                                key={num}
                                                type="button"
                                                onClick={() => {
                                                    setSelectedAuditChat(condoNum);
                                                }}
                                                className={`py-3.5 border rounded-xl text-center font-bold text-xs transition-all ${color}`}
                                            >
                                                {condoNum}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Property Detail overlay */}
                <div className="bg-slate-900/60 border border-slate-800/80 p-6 rounded-[24px] flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="border-b border-slate-800 pb-3">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Ficha Técnica de Residencia</span>
                            <h4 className="text-base font-black text-slate-100 mt-1 text-left">{selectedAuditChat || 'Depto 202'}</h4>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Copropietario:</span>
                                <span className="font-bold text-slate-300">
                                    {selectedAuditChat === 'Depto 201' ? 'Sofía Valenzuela' : selectedAuditChat === 'Depto 102' || selectedAuditChat === 'Depto 303' ? 'Sin asignar' : 'Carlos Residente'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Residente Activo:</span>
                                <span className="font-bold text-slate-300">
                                    {selectedAuditChat === 'Depto 201' ? 'Sofía Valenzuela' : selectedAuditChat === 'Depto 102' || selectedAuditChat === 'Depto 303' ? 'Vacante' : 'Carlos Residente'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Estado de Cuenta:</span>
                                <span className={`font-bold ${selectedAuditChat === 'Depto 201' ? 'text-rose-400' : 'text-emerald-400'}`}>
                                    {selectedAuditChat === 'Depto 201' ? 'Moroso (3 Meses)' : 'Al Día'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Saldo Pendiente:</span>
                                <span className={`font-bold ${selectedAuditChat === 'Depto 201' ? 'text-rose-400' : 'text-slate-300'}`}>
                                    {selectedAuditChat === 'Depto 201' ? '$231,450' : '$0'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {selectedAuditChat !== 'Depto 102' && selectedAuditChat !== 'Depto 303' && (
                        <button
                            type="button"
                            onClick={() => {
                                const matched = usersList.find(u => u.name.includes('Carlos') || u.name.includes('Residente')) || usersList[0];
                                setImpersonatedUser(matched);
                                setTerminalLogs(prev => [...prev, `[IMPERSONATION] Impersonando desde mapa 2D: ${matched.name}`]);
                            }}
                            className="w-full mt-6 py-2.5 bg-brand-teal/10 hover:bg-brand-teal/20 border border-brand-teal/30 text-brand-teal font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            <span>💻 Impersonar Residente</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
