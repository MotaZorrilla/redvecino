import { useState, useMemo, useEffect } from 'react';
import Modal from '@/Components/Modal';

export default function UnitDetailModal360({
    inspectingUnit = null,
    onClose = () => {},
    onSaveUnit = () => {},
    allProperties = [],
    allFines = [],
    allTickets = [],
    allUsers = [],
    allPayments = [],
    totalCondoAreaSqm = 14000,
    activeCondoName = 'Condominio Alameda'
}) {
    // Tab por defecto: Copropietario & Residentes (Solicitado por el usuario)
    const [activeTab, setActiveTab] = useState('people'); // 'people', 'general', 'finances', 'fines', 'tickets'

    // Resolve property details
    const unitNumber = inspectingUnit?.number || inspectingUnit?.name || inspectingUnit?.property_id || '501';
    const propId = inspectingUnit?.id || inspectingUnit?.property_id;

    // Formulario de edición sincronizado con la unidad inspeccionada
    const [editForm, setEditForm] = useState({
        ownerName: '',
        ownerRut: '',
        ownerPhone: '',
        ownerEmail: '',
        areaSqm: 70,
        parking: '',
        storage: ''
    });

    useEffect(() => {
        if (inspectingUnit) {
            const initialOwnerName = inspectingUnit.user?.name || inspectingUnit.owner || (inspectingUnit.number === 10 ? 'Diego Alarcón' : 'Lucelys Elena García Cova');
            const initialOwnerRut = inspectingUnit.user?.rut || inspectingUnit.rut || '12.345.678-9';
            const initialOwnerPhone = inspectingUnit.user?.phone || inspectingUnit.phone || '+56 9 9123 4567';
            const initialOwnerEmail = inspectingUnit.user?.email || inspectingUnit.email || 'vecino@redvecino.cl';

            setEditForm({
                ownerName: initialOwnerName,
                ownerRut: initialOwnerRut,
                ownerPhone: initialOwnerPhone,
                ownerEmail: initialOwnerEmail,
                areaSqm: Number(inspectingUnit.area_sqm) || 70,
                parking: inspectingUnit.parkings?.join(', ') || inspectingUnit.parking || `E-${inspectingUnit.number || inspectingUnit.id || '10'}`,
                storage: inspectingUnit.storages?.join(', ') || inspectingUnit.storage || `B-${inspectingUnit.number || inspectingUnit.id || '10'}`
            });
        }
    }, [inspectingUnit]);

    // Filter associated Fines for this unit
    const unitFines = useMemo(() => {
        if (!inspectingUnit) return [];
        return allFines.filter(f => 
            String(f.property_id) === String(propId) || 
            String(f.property?.number) === String(unitNumber) ||
            String(f.property_id) === String(unitNumber)
        );
    }, [allFines, propId, unitNumber, inspectingUnit]);

    // Filter associated Tickets for this unit
    const unitTickets = useMemo(() => {
        if (!inspectingUnit) return [];
        return allTickets.filter(t => 
            String(t.property_id) === String(propId) || 
            String(t.property?.number) === String(unitNumber) ||
            String(t.unit) === String(unitNumber)
        );
    }, [allTickets, propId, unitNumber, inspectingUnit]);

    // Filter associated Users for this unit
    const unitUsers = useMemo(() => {
        if (!inspectingUnit) return [];
        return allUsers.filter(u => 
            String(u.property_id) === String(propId) ||
            (u.properties && u.properties.some(p => String(p.id) === String(propId) || String(p.number) === String(unitNumber)))
        );
    }, [allUsers, propId, unitNumber, inspectingUnit]);

    // Filter associated Payments / Gastos Comunes for this unit
    const unitPayments = useMemo(() => {
        if (!inspectingUnit) return [];
        return allPayments.filter(p => 
            String(p.property_id) === String(propId) || 
            String(p.property?.number) === String(unitNumber)
        );
    }, [allPayments, propId, unitNumber, inspectingUnit]);

    if (!inspectingUnit) return null;

    const areaSqm = Number(editForm.areaSqm) || 70;
    const alicuotaPercent = (((areaSqm) / (totalCondoAreaSqm || 14000)) * 100).toFixed(4);
    
    // Cálculo estimado de boleta mensual de Gastos Comunes por Alícuota (Base estimada $5.922.800)
    const totalCondoMonthlyExpenses = 5922800;
    const estimatedBaseMonthlyBill = Math.round(totalCondoMonthlyExpenses * (Number(alicuotaPercent) / 100));
    const estimatedReserveFund = Math.round(estimatedBaseMonthlyBill * 0.05);
    const estimatedTotalBill = estimatedBaseMonthlyBill + estimatedReserveFund;

    const isUnitUpToDate = unitPayments.some(p => p.status === 'completed') || unitFines.every(f => f.status === 'resolved' || f.status === 'annulled');

    const handleSaveAndClose = () => {
        if (onSaveUnit) {
            onSaveUnit({
                ...inspectingUnit,
                owner: editForm.ownerName,
                area_sqm: editForm.areaSqm,
                parking: editForm.parking,
                storage: editForm.storage,
                user: {
                    ...(inspectingUnit.user || {}),
                    name: editForm.ownerName,
                    rut: editForm.ownerRut,
                    phone: editForm.ownerPhone,
                    email: editForm.ownerEmail
                }
            });
        }
        onClose();
    };

    return (
        <Modal show={!!inspectingUnit} onClose={onClose} maxWidth="2xl">
            <div className="bg-white dark:bg-slate-900 p-6 space-y-6 text-left rounded-2xl font-outfit max-h-[90vh] overflow-y-auto">
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                        <span className="w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-600/30 flex items-center justify-center font-black text-xl">
                            🏢
                        </span>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                                    Ficha Técnica · Departamento {unitNumber}
                                </h3>
                                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
                                    {inspectingUnit.block || 'Torre A'} · Piso {inspectingUnit.floor || '5'}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {activeCondoName} · Ficha 360° Modificable
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold cursor-pointer"
                    >
                        ✕
                    </button>
                </div>

                {/* Navigation Sub-Tabs inside Modal - Diseño Flex-Wrap Limpio sin Scrollbar Horizontal */}
                <div className="flex flex-wrap items-center gap-2 bg-slate-100 dark:bg-slate-950 p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <button
                        type="button"
                        onClick={() => setActiveTab('people')}
                        className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                            activeTab === 'people'
                                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-white shadow-xs border border-indigo-500/20'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <span>👤</span>
                        <span>Copropietario & Residentes</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('general')}
                        className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                            activeTab === 'general'
                                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-white shadow-xs border border-indigo-500/20'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <span>📐</span>
                        <span>Ficha Física & Alícuota</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('finances')}
                        className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                            activeTab === 'finances'
                                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-white shadow-xs border border-indigo-500/20'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <span>💰</span>
                        <span>Gastos Comunes & Avisos</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('fines')}
                        className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                            activeTab === 'fines'
                                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-white shadow-xs border border-indigo-500/20'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <span>⚖️</span>
                        <span>Multas ({unitFines.length})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('tickets')}
                        className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                            activeTab === 'tickets'
                                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-white shadow-xs border border-indigo-500/20'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <span>🛠️</span>
                        <span>Tickets ({unitTickets.length})</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('pets')}
                        className={`px-3 py-1.5 text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                            activeTab === 'pets'
                                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-white shadow-xs border border-indigo-500/20'
                                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                        }`}
                    >
                        <span>🐾</span>
                        <span>Mascotas & Chip</span>
                    </button>
                </div>

                {/* TAB 1: COPROPIETARIO & RESIDENTES (CAMPOS EDITABLES) */}
                {activeTab === 'people' && (
                    <div className="space-y-4 animate-fade-in">
                        {/* Formulario Editable del Copropietario Titular */}
                        <div className="bg-gradient-to-r from-indigo-50/80 via-white to-slate-50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-slate-950 p-4 rounded-xl border border-indigo-200/80 dark:border-indigo-900/60 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/20">
                                    ✏️ Copropietario Titular Responsable (Editable)
                                </span>
                                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                                    Modifique y presione Guardar y Cerrar
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                                <div>
                                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Nombre Completo</label>
                                    <input
                                        type="text"
                                        value={editForm.ownerName}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, ownerName: e.target.value }))}
                                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-extrabold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">RUT / Identificación</label>
                                    <input
                                        type="text"
                                        value={editForm.ownerRut}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, ownerRut: e.target.value }))}
                                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-bold font-mono text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Teléfono Móvil</label>
                                    <input
                                        type="text"
                                        value={editForm.ownerPhone}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, ownerPhone: e.target.value }))}
                                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Correo Electrónico</label>
                                    <input
                                        type="email"
                                        value={editForm.ownerEmail}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, ownerEmail: e.target.value }))}
                                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Ocupantes / Residentes */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h5 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                                    Residentes u Ocupantes Vinculados ({unitUsers.length})
                                </h5>
                                <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                                    unitUsers.length > 3
                                        ? 'bg-rose-500/15 text-rose-600 border border-rose-500/30'
                                        : 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/30'
                                }`}>
                                    {unitUsers.length > 3 ? '⚠️ Excede Máx. 3 Residentes' : `✅ ${unitUsers.length}/3 Residentes Autorizados`}
                                </span>
                            </div>
                            <div className="space-y-2">
                                {unitUsers.map((user, idx) => (
                                    <div key={user.id || idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                                        <div className="flex items-center gap-2.5">
                                            <span className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300">
                                                👤
                                            </span>
                                            <div>
                                                <span className="font-extrabold text-slate-900 dark:text-white block">{user.name}</span>
                                                <span className="text-[10px] text-slate-400">{user.email} · {user.phone || 'Sin Teléfono'}</span>
                                            </div>
                                        </div>

                                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                            {user.roles?.join(', ') || user.role || 'Residente'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: FICHA FÍSICA Y ALÍCUOTA (CAMPOS EDITABLES) */}
                {activeTab === 'general' && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Superficie Útil (m²)</label>
                                <input
                                    type="number"
                                    min="10"
                                    value={editForm.areaSqm}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, areaSqm: e.target.value }))}
                                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-extrabold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">🚗 Estacionamiento</label>
                                <input
                                    type="text"
                                    value={editForm.parking}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, parking: e.target.value }))}
                                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-extrabold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">📦 Bodega Asignada</label>
                                <input
                                    type="text"
                                    value={editForm.storage}
                                    onChange={(e) => setEditForm(prev => ({ ...prev, storage: e.target.value }))}
                                    className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-2 font-extrabold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        {/* Alícuota Banner */}
                        <div className="bg-gradient-to-r from-indigo-500/10 via-emerald-500/10 to-amber-500/10 p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 space-y-1">
                            <span className="text-[10px] font-extrabold uppercase text-indigo-600 dark:text-indigo-400 block">
                                Coeficiente Recalculado de Alícuota (%)
                            </span>
                            <div className="text-2xl font-black text-indigo-700 dark:text-indigo-300">
                                {alicuotaPercent}%
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Calculado en tiempo real sobre {areaSqm} m² respecto a los {totalCondoAreaSqm.toLocaleString('es-CL')} m² totales del condominio.
                            </p>
                        </div>
                    </div>
                )}

                {/* TAB 3: GASTOS COMUNES, AVISOS & PAGOS */}
                {activeTab === 'finances' && (
                    <div className="space-y-4 animate-fade-in">
                        {/* Estado del Período / Al Día */}
                        <div className={`p-4 rounded-xl border flex items-center justify-between ${
                            isUnitUpToDate 
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400' 
                                : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-400'
                        }`}>
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{isUnitUpToDate ? '🟢' : '🔴'}</span>
                                <div>
                                    <h5 className="font-black text-sm uppercase tracking-tight">
                                        {isUnitUpToDate ? 'Unidad al Día en Gastos Comunes' : 'Cuenta con Deuda Pendiente'}
                                    </h5>
                                    <p className="text-xs opacity-90">
                                        {isUnitUpToDate ? 'No presenta cobros vencidos al período actual.' : 'Existen cuotas pendientes de conciliación.'}
                                    </p>
                                </div>
                            </div>
                            <span className="font-extrabold text-xs px-3 py-1 rounded-full bg-white dark:bg-slate-900 shadow-xs">
                                {isUnitUpToDate ? 'Vigente' : 'Cobro Pendiente'}
                            </span>
                        </div>

                        {/* Simulación / Desglose del Aviso de Cobro */}
                        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-2">
                                <span className="text-xs font-black uppercase text-slate-800 dark:text-white">
                                    📄 Aviso de Cobro Estimado · Período Vigente
                                </span>
                                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                                    Alícuota: {alicuotaPercent}%
                                </span>
                            </div>

                            <div className="space-y-1.5 text-xs">
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                    <span>Gasto Común Base ({areaSqm} m²):</span>
                                    <span className="font-mono font-bold text-slate-900 dark:text-white">${estimatedBaseMonthlyBill.toLocaleString('es-CL')}</span>
                                </div>
                                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                                    <span>Fondo de Reserva Ley 21.442 (5%):</span>
                                    <span className="font-mono font-bold text-slate-900 dark:text-white">${estimatedReserveFund.toLocaleString('es-CL')}</span>
                                </div>
                                <div className="flex justify-between text-indigo-600 dark:text-indigo-400 font-extrabold pt-2 border-t border-slate-200 dark:border-slate-800 text-sm">
                                    <span>TOTAL AVISO DE COBRO:</span>
                                    <span className="font-mono text-base">${estimatedTotalBill.toLocaleString('es-CL')} CLP</span>
                                </div>
                            </div>
                        </div>

                        {/* Historial de Pagos / Transacciones */}
                        <div className="space-y-2">
                            <h5 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                                Historial de Pagos Registrados ({unitPayments.length})
                            </h5>
                            {unitPayments.length === 0 ? (
                                <p className="text-xs text-slate-400 italic py-3 text-center bg-slate-50 dark:bg-slate-950 rounded-xl">No hay pagos registrados para este departamento.</p>
                            ) : (
                                <div className="space-y-2">
                                    {unitPayments.map(p => (
                                        <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                                            <div>
                                                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 font-mono text-sm block">
                                                    ${Number(p.amount).toLocaleString('es-CL')}
                                                </span>
                                                <span className="text-[10px] text-slate-400">
                                                    {new Date(p.payment_date).toLocaleDateString('es-CL')} · Método: {p.payment_method}
                                                </span>
                                            </div>
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                {p.status === 'completed' ? 'Conciliado' : p.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 4: HISTORIAL DE MULTAS */}
                {activeTab === 'fines' && (
                    <div className="space-y-3 animate-fade-in">
                        {unitFines.length === 0 ? (
                            <div className="p-8 text-center bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                                <span className="text-3xl block mb-1">🎉</span>
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Sin Infracciones Registradas</p>
                                <p className="text-[10px] text-slate-400">Esta propiedad no posee historial de multas disciplinarias.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {unitFines.map(fine => (
                                    <div key={fine.id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono text-[10px] text-slate-400">{fine.date}</span>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                fine.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                                            }`}>
                                                {fine.status === 'resolved' ? 'Resuelta' : 'Pendiente'}
                                            </span>
                                        </div>
                                        <p className="font-medium text-slate-800 dark:text-slate-200">{fine.reason}</p>
                                        <span className="font-extrabold text-rose-600 dark:text-rose-400 font-mono block">
                                            ${Number(fine.amount).toLocaleString('es-CL')} CLP
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 5: HISTORIAL DE TICKETS */}
                {activeTab === 'tickets' && (
                    <div className="space-y-3 animate-fade-in">
                        {unitTickets.length === 0 ? (
                            <div className="p-8 text-center bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                                <span className="text-3xl block mb-1">📋</span>
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Sin Tickets Registrados</p>
                                <p className="text-[10px] text-slate-400">No existen solicitudes de asistencia o reclamos activos para este departamento.</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {unitTickets.map(ticket => (
                                    <div key={ticket.id} className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="font-extrabold text-slate-900 dark:text-white">#{ticket.id} · {ticket.title || ticket.category}</span>
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/10 text-indigo-600">
                                                {ticket.status || 'Abierto'}
                                            </span>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 text-[11px]">{ticket.description || ticket.details || 'Sin descripción adicional'}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* TAB 6: MASCOTAS Y REGISTRO SANITARIO */}
                {activeTab === 'pets' && (
                    <div className="space-y-4 animate-fade-in text-left">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-md border border-indigo-500/20">
                                🐾 Ley de Tenencia Responsable de Mascotas (Chile)
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                                Microchip de 15 dígitos & Registro Sanitario
                            </span>
                        </div>

                        <div className="space-y-3">
                            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <span className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl">
                                        🐕
                                    </span>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-900 dark:text-white">
                                            Toby (Golden Retriever)
                                        </h4>
                                        <p className="text-[11px] font-mono text-slate-500">
                                            N° Chip: <span className="font-bold text-slate-800 dark:text-slate-200">941000025874123</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                                        ✅ Vacunas al Día
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => alert('Visualizando carnet sanitario oficial de vacunas.')}
                                        className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold text-xs rounded-lg hover:underline"
                                    >
                                        📄 Ver Carnet
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Modal Action */}
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs rounded-xl"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        onClick={handleSaveAndClose}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-1.5"
                    >
                        <span>💾</span>
                        <span>Guardar y Cerrar</span>
                    </button>
                </div>
            </div>
        </Modal>
    );
}
