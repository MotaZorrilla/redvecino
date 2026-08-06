import React, { useState } from 'react';
import Modal from '@/Components/Modal';

export default function EmployeesList({ adminCondoId = 1 }) {
    const [employees, setEmployees] = useState([
        {
            id: 1,
            name: 'José Andrade',
            role_name: 'Recepcionista',
            shift_detail: 'Por Días: 4 días [20:00 - 08:00] (colación 60m) (44.0 hrs/sem)',
            age: 40,
            phone: '+56 9326 65487',
            email: 'msdfs@correo.cl',
            contract_status: 'No cargado',
            liquid_salary: 720000,
            status: 'Activo'
        },
        {
            id: 2,
            name: 'Mario Carrasco',
            role_name: 'Recepcionista',
            shift_detail: 'Por Días: 4 días [08:00 - 20:00] (colación 60m) (44.0 hrs/sem)',
            age: 54,
            phone: '+56 9653 54218',
            email: 'marioc@correo.cl',
            contract_status: 'No cargado',
            liquid_salary: 720000,
            status: 'Activo'
        },
        {
            id: 3,
            name: 'María Rojas Muñoz',
            role_name: 'Auxiliar de limpieza',
            shift_detail: 'Básico (38.0 hrs/sem)',
            age: 30,
            phone: '+56 9325 63254',
            email: 'asfef@correo.cl',
            contract_status: 'No cargado',
            liquid_salary: 685000,
            status: 'Activo'
        }
    ]);

    const [subTab, setSubTab] = useState('list'); // 'list' | 'supplies' | 'liquidations'
    const [showAddModal, setShowAddModal] = useState(false);
    const [showSupplyModal, setShowSupplyModal] = useState(false);

    // Estado del Pedido de Materiales e Insumos
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [supplyStatus, setSupplyStatus] = useState('en_compra'); // 'en_compra' | 'comprado'
    const [supplySuccessMsg, setSupplySuccessMsg] = useState('');

    const [suppliesList, setSuppliesList] = useState([
        { id: 1, name: 'escobas', qty: 4, category: 'repuesto', status: 'en_compra', date: '01/07/2026' },
        { id: 2, name: 'POE', qty: 12, category: 'limpieza', status: 'en_compra', date: '01/07/2026' },
        { id: 3, name: 'Litros de cloro', qty: 8, category: 'limpieza', status: 'en_compra', date: '30/06/2026' },
        { id: 4, name: 'Bomba para expandir matamaleza', qty: 1, category: 'repuesto', status: 'en_compra', date: '30/06/2026' },
        { id: 5, name: 'Liquido matamalez', qty: 2, category: 'repuesto', status: 'en_compra', date: '30/06/2026' }
    ]);

    const [newEmp, setNewEmp] = useState({
        name: '', role_name: 'Recepcionista', shift_detail: 'Básico (44.0 hrs/sem)',
        age: 35, phone: '', email: '', liquid_salary: 720000
    });

    const [selectedEmp, setSelectedEmp] = useState(null);

    const handleAddEmployee = (e) => {
        e.preventDefault();
        if (!newEmp.name) return;
        const created = {
            id: Date.now(),
            ...newEmp,
            age: Number(newEmp.age) || 30,
            liquid_salary: Number(newEmp.liquid_salary) || 720000,
            contract_status: 'No cargado',
            status: 'Activo'
        };
        setEmployees([created, ...employees]);
        setShowAddModal(false);
        setNewEmp({ name: '', role_name: 'Recepcionista', shift_detail: 'Básico (44.0 hrs/sem)', age: 35, phone: '', email: '', liquid_salary: 720000 });
    };

    const handleMarkPurchased = () => {
        if (!invoiceNumber.trim()) {
            alert('Por favor ingrese el N° de Factura o Boleta para registrar la compra.');
            return;
        }
        setSupplyStatus('comprado');
        setSuppliesList(suppliesList.map(s => ({ ...s, status: 'comprado' })));
        setSupplySuccessMsg(`¡Materiales registrados como COMPRADOS bajo N° Factura ${invoiceNumber}!`);
        setTimeout(() => setSupplySuccessMsg(''), 4000);
    };

    return (
        <div className="space-y-6 font-outfit text-left text-slate-800 dark:text-slate-100 animate-fade-in w-full">
            {/* Header Principal Colaboradores */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <span className="text-[10px] font-black uppercase bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 px-3 py-1 rounded-full tracking-wider">
                        👷 Administración de Personal, Sueldos, Amonestaciones y Contratos
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                        Colaboradores del Condominio
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Fichas de personal, contratos, liquidaciones de sueldo e historial de amonestaciones.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <button
                        onClick={() => setShowSupplyModal(true)}
                        className="px-4 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-2"
                    >
                        <span>📦</span>
                        <span>Pedido de Materiales ({suppliesList.length})</span>
                    </button>

                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
                    >
                        <span>👤</span>
                        <span>Ingreso de Personal</span>
                    </button>
                </div>
            </div>

            {/* Sub-Navegación de Pestañas */}
            <div className="flex border-b border-slate-200 dark:border-slate-800">
                <button
                    onClick={() => setSubTab('list')}
                    className={`px-5 py-3 font-bold text-xs uppercase tracking-wider transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                        subTab === 'list'
                            ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-black'
                            : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    }`}
                >
                    <span>👥 Nómina de Personal ({employees.length})</span>
                </button>

                <button
                    onClick={() => setSubTab('supplies')}
                    className={`px-5 py-3 font-bold text-xs uppercase tracking-wider transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                        subTab === 'supplies'
                            ? 'border-amber-500 text-amber-600 dark:text-amber-400 font-black'
                            : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    }`}
                >
                    <span>📦 Solicitud de Insumos</span>
                </button>

                <button
                    onClick={() => setSubTab('liquidations')}
                    className={`px-5 py-3 font-bold text-xs uppercase tracking-wider transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${
                        subTab === 'liquidations'
                            ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 font-black'
                            : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400'
                    }`}
                >
                    <span>📄 Liquidaciones de Sueldo</span>
                </button>
            </div>

            {/* VISTA 1: TABLA NÓMINA DE PERSONAL */}
            {subTab === 'list' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            <thead>
                                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase text-slate-400">
                                    <th className="py-3 px-4">Nombre Completo & Cargo</th>
                                    <th className="py-3 px-4">Edad</th>
                                    <th className="py-3 px-4">Contacto</th>
                                    <th className="py-3 px-4">Contrato</th>
                                    <th className="py-3 px-4 text-right">Sueldo Líquido</th>
                                    <th className="py-3 px-4 text-center">Estado</th>
                                    <th className="py-3 px-4 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                                {employees.map(emp => (
                                    <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                                        <td className="py-3.5 px-4">
                                            <div className="font-black text-slate-900 dark:text-white text-sm">
                                                {emp.name}
                                            </div>
                                            <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mt-0.5">
                                                {emp.role_name}
                                            </div>
                                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                                {emp.shift_detail}
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300">
                                            {emp.age} años
                                        </td>
                                        <td className="py-3.5 px-4 space-y-0.5">
                                            <div className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">{emp.phone}</div>
                                            <div className="text-[11px] text-slate-400">{emp.email}</div>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                {emp.contract_status}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-right font-mono font-black text-slate-900 dark:text-white text-sm">
                                            ${emp.liquid_salary.toLocaleString('es-CL')}
                                        </td>
                                        <td className="py-3.5 px-4 text-center">
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                                {emp.status}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => setSelectedEmp(emp)}
                                                    className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg transition-all flex items-center gap-1"
                                                    title="Ver Liquidación de Sueldo"
                                                >
                                                    <span>📄</span>
                                                    <span>Liquidación</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* VISTA 2: SECCIÓN PEDIDO DE MATERIALES Y MATERIALES DE INSUMO */}
            {(subTab === 'supplies' || showSupplyModal) && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                        <div>
                            <span className="text-[10px] font-black uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full border border-amber-500/20">
                                📦 Módulo de Insumos & Repuestos
                            </span>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-2">
                                Pedido de Materiales e Insumos
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl">
                                Revise las solicitudes de compra hechas por el personal del condominio. Al registrar la factura o boleta, la lista de insumos pasará al estado <span className="font-bold text-amber-500">"En Proceso de Compra"</span> o <span className="font-bold text-emerald-500">"Comprado"</span> y se bloqueará para el colaborador.
                            </p>
                        </div>
                    </div>

                    {supplySuccessMsg && (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
                            <span>✅</span>
                            <span>{supplySuccessMsg}</span>
                        </div>
                    )}

                    {/* Ficha Solicitud Colaborador (José Andrade - 5 artículos) */}
                    <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
                                    JA
                                </div>
                                <div>
                                    <h4 className="text-base font-black text-slate-900 dark:text-white">José Andrade</h4>
                                    <span className="text-xs text-amber-600 dark:text-amber-400 font-extrabold">
                                        {suppliesList.length} artículos solicitados
                                    </span>
                                </div>
                            </div>

                            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                                supplyStatus === 'comprado'
                                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                                    : 'bg-amber-500/10 text-amber-600 border border-amber-500/30'
                            }`}>
                                {supplyStatus === 'comprado' ? '✅ Comprado' : '⏳ En Proceso de Compra'}
                            </span>
                        </div>

                        {/* Listado de Artículos Solicitados */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {suppliesList.map(item => (
                                <div key={item.id} className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs space-y-1">
                                    <div className="flex justify-between items-start">
                                        <span className="font-black text-slate-900 dark:text-white text-xs">
                                            {item.name} <span className="text-indigo-600 dark:text-indigo-400">(x{item.qty})</span>
                                        </span>
                                        <span className="text-[9px] font-mono text-slate-400">{item.date}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="text-slate-500 font-bold uppercase">Categoría: {item.category}</span>
                                        <span className="text-amber-600 font-mono font-bold">{item.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Formulario Registrar Compra de Materiales */}
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-end justify-between gap-3 pt-4">
                            <div className="w-full md:w-auto flex-1">
                                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">
                                    Registrar Compra de Materiales: N° Factura o Boleta
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: F-987452"
                                    value={invoiceNumber}
                                    onChange={(e) => setInvoiceNumber(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 font-mono font-bold text-slate-900 dark:text-white text-xs"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={handleMarkPurchased}
                                className="w-full md:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                            >
                                <span>✅</span>
                                <span>Marcar Comprado</span>
                            </button>
                        </div>
                    </div>

                    {showSupplyModal && (
                        <div className="flex justify-end pt-2">
                            <button onClick={() => setShowSupplyModal(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-xl">Cerrar</button>
                        </div>
                    )}
                </div>
            )}

            {/* VISTA 3: LIQUIDACIONES DE SUELDO */}
            {subTab === 'liquidations' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2">
                        Historial de Liquidaciones de Remuneración
                    </h3>
                    <div className="space-y-3">
                        {employees.map(emp => (
                            <div key={emp.id} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                                <div>
                                    <span className="text-[10px] font-black text-indigo-500 uppercase">{emp.role_name}</span>
                                    <h4 className="text-base font-black text-slate-900 dark:text-white">{emp.name}</h4>
                                    <p className="text-xs text-slate-500">Edad: {emp.age} años &bull; {emp.shift_detail}</p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Sueldo Líquido</span>
                                        <span className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">${emp.liquid_salary.toLocaleString('es-CL')}</span>
                                    </div>
                                    <button
                                        onClick={() => setSelectedEmp(emp)}
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-md transition-all"
                                    >
                                        🧾 Ver Liquidación
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* MODAL INGRESO DE PERSONAL */}
            <Modal show={showAddModal} onClose={() => setShowAddModal(false)} maxWidth="md">
                <form onSubmit={handleAddEmployee} className="p-6 font-outfit text-left space-y-4 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                    <h3 className="text-base font-black text-slate-900 dark:text-white">Ingreso de Personal (Colaborador)</h3>
                    <div className="space-y-3 text-xs">
                        <div>
                            <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Nombre Completo *</label>
                            <input
                                type="text"
                                required
                                value={newEmp.name}
                                onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Cargo</label>
                                <select
                                    value={newEmp.role_name}
                                    onChange={(e) => setNewEmp({ ...newEmp, role_name: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white"
                                >
                                    <option value="Recepcionista">Recepcionista</option>
                                    <option value="Auxiliar de limpieza">Auxiliar de limpieza</option>
                                    <option value="Guardia de Seguridad">Guardia de Seguridad</option>
                                    <option value="Conserje Nocturno">Conserje Nocturno</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Edad</label>
                                <input
                                    type="number"
                                    value={newEmp.age}
                                    onChange={(e) => setNewEmp({ ...newEmp, age: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Turno / Horario</label>
                            <input
                                type="text"
                                value={newEmp.shift_detail}
                                onChange={(e) => setNewEmp({ ...newEmp, shift_detail: e.target.value })}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Contacto Teléfono</label>
                                <input
                                    type="text"
                                    value={newEmp.phone}
                                    onChange={(e) => setNewEmp({ ...newEmp, phone: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">Sueldo Líquido ($)</label>
                                <input
                                    type="number"
                                    value={newEmp.liquid_salary}
                                    onChange={(e) => setNewEmp({ ...newEmp, liquid_salary: e.target.value })}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 font-bold text-slate-900 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                        <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-xl">Cancelar</button>
                        <button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-black text-xs rounded-xl shadow-lg">Guardar Colaborador</button>
                    </div>
                </form>
            </Modal>

            {/* MODAL DETALLE DE LIQUIDACIÓN */}
            <Modal show={!!selectedEmp} onClose={() => setSelectedEmp(null)} maxWidth="md">
                {selectedEmp && (
                    <div className="p-6 font-outfit text-left space-y-4 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                            <div>
                                <span className="text-[10px] font-black uppercase text-indigo-500">Liquidación de Sueldo Oficial</span>
                                <h3 className="text-lg font-black text-slate-900 dark:text-white">{selectedEmp.name}</h3>
                                <p className="text-xs text-slate-500">{selectedEmp.role_name} &bull; {selectedEmp.shift_detail}</p>
                            </div>
                            <button onClick={() => setSelectedEmp(null)} className="text-slate-400 font-bold">✕</button>
                        </div>
                        <div className="space-y-2 text-xs font-mono bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                            <div className="flex justify-between"><span>Sueldo Base:</span><span>${selectedEmp.liquid_salary.toLocaleString('es-CL')}</span></div>
                            <div className="flex justify-between text-slate-500"><span>Asignación Movilidad / Colación:</span><span>+$120.000</span></div>
                            <div className="flex justify-between text-rose-500"><span>Cotizaciones (AFP + Fonasa 7%):</span><span>-$65.000</span></div>
                            <div className="flex justify-between font-black text-sm text-emerald-600 pt-2 border-t border-slate-200 dark:border-slate-800">
                                <span>SUELDO LÍQUIDO A RECIBIR:</span>
                                <span>${selectedEmp.liquid_salary.toLocaleString('es-CL')}</span>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button onClick={() => window.print()} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-bold rounded-xl">🖨️ Imprimir Liquidación</button>
                            <button onClick={() => setSelectedEmp(null)} className="px-4 py-2 bg-indigo-600 text-white font-black text-xs rounded-xl">Cerrar</button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
