import { useState } from 'react';
import { toast } from '@/utils/notify';
import ToastContainer from '@/Components/Toast';

export default function TiOcrSimulator({
    ocrScanning,
    setOcrScanning,
    packages = [],
    setPackages,
    setTerminalLogs
}) {
    return (
        <div className="space-y-6 animate-fade-in text-left">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-black text-slate-100 uppercase tracking-wider flex items-center gap-2">
                    📦 Conserjería OCR & Recepción Simulator
                </h4>
                <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded font-mono">Simulador de Integración</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* OCR Scanning simulator */}
                <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-[24px] space-y-4">
                    <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Cámara de Escáner OCR</h5>
                    
                    {/* Laser simulator */}
                    <div className="bg-slate-950 aspect-[4/3] rounded-2xl border border-slate-800 flex items-center justify-center relative overflow-hidden">
                        {ocrScanning ? (
                            <div className="space-y-2 text-center z-10">
                                <div className="animate-spin h-6 w-6 border-2 border-t-transparent border-brand-teal rounded-full mx-auto" />
                                <span className="text-[9px] font-mono text-brand-teal block animate-pulse">Lector OCR: Analizando etiqueta...</span>
                            </div>
                        ) : (
                            <div className="text-center z-10 space-y-2">
                                <svg className="w-8 h-8 text-slate-600 mx-auto" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                                </svg>
                                <span className="text-[9px] font-mono text-slate-500 block">Posiciona el paquete frente al lector</span>
                            </div>
                        )}

                        {/* Custom CSS Laser Line */}
                        {ocrScanning && (
                            <div 
                                className="absolute left-0 w-full h-[2px] bg-rose-500/80 shadow-[0_0_8px_#f43f5e] z-20"
                                style={{
                                    animation: 'scanLaser 1.5s infinite ease-in-out',
                                    top: '0%'
                                }}
                            />
                        )}
                        
                        <style>{`
                            @keyframes scanLaser {
                                0% { top: 10%; }
                                50% { top: 90%; }
                                100% { top: 10%; }
                            }
                        `}</style>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label htmlFor="ocrDeptSelect" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1 text-left">Destinatario / Residencia</label>
                            <select id="ocrDeptSelect" className="w-full bg-slate-900 border border-slate-800 rounded-xl text-xs px-3 py-2 text-white focus:outline-none focus:border-brand-teal cursor-pointer">
                                <option value="Depto 202">Residente Demo (Depto 202)</option>
                                <option value="Depto 101">Propietario Demo (Depto 101)</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="ocrCarrierSelect" className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1 text-left">Empresa de Envío</label>
                            <select id="ocrCarrierSelect" className="w-full bg-slate-900 border border-slate-800 rounded-xl text-xs px-3 py-2 text-white focus:outline-none focus:border-brand-teal cursor-pointer">
                                <option value="Starken">Starken (Turbus)</option>
                                <option value="Chilexpress">Chilexpress</option>
                                <option value="CorreosChile">Correos de Chile</option>
                            </select>
                        </div>

                        <button
                            type="button"
                            disabled={ocrScanning}
                            onClick={() => {
                                setOcrScanning(true);
                                setTerminalLogs(prev => [...prev, '[OCR] Iniciando proceso de lectura óptica en etiqueta...']);
                                setTimeout(() => {
                                    setOcrScanning(false);
                                    const dept = document.getElementById('ocrDeptSelect').value;
                                    const carrier = document.getElementById('ocrCarrierSelect').value;
                                    
                                    const randTracking = carrier.slice(0,2).toUpperCase() + "-" + Math.floor(100000 + Math.random() * 900000) + "-CL";
                                    const newPkg = {
                                        id: "PKG-" + Date.now().toString().slice(-4),
                                        tracking: randTracking,
                                        carrier: carrier,
                                        resident: dept === 'Depto 202' ? 'Residente Demo' : 'Propietario Demo',
                                        property: dept,
                                        status: 'pending',
                                        date: new Date().toLocaleString('es-CL', { hour12: false })
                                    };

                                    setPackages(prev => [newPkg, ...prev]);
                                    setTerminalLogs(prev => [...prev, "[OCR] ¡Éxito! Encomienda " + randTracking + " asociada automáticamente a " + dept]);
                                    toast("OCR exitoso: Se registró el paquete " + randTracking + " de " + carrier + " para " + dept + ".", 'success');
                                }, 1500);
                            }}
                            className="w-full py-2.5 bg-brand-teal hover:bg-brand-teal-light text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                            <span>📷 Simular Escaneo OCR</span>
                        </button>
                    </div>
                </div>

                {/* Package List */}
                <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800/80 p-6 rounded-[24px] space-y-4">
                    <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Historial de Custodia e Inventario</h5>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead>
                                <tr className="bg-slate-950 text-slate-500 border-b border-slate-800">
                                    <th className="p-3 font-black text-left">ID</th>
                                    <th className="p-3 font-black text-left">Tracking</th>
                                    <th className="p-3 font-black text-left">Carrier</th>
                                    <th className="p-3 font-black text-left">Destinatario</th>
                                    <th className="p-3 font-black text-left">Depto</th>
                                    <th className="p-3 font-black text-center">Estado</th>
                                    <th className="p-3 font-black text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800 text-slate-300">
                                {packages.map((pkg) => (
                                    <tr key={pkg.id} className="hover:bg-slate-900/50">
                                        <td className="p-3 font-bold text-slate-200 text-left">{pkg.id}</td>
                                        <td className="p-3 font-mono text-brand-teal text-left">{pkg.tracking}</td>
                                        <td className="p-3 text-left">{pkg.carrier}</td>
                                        <td className="p-3 font-bold text-slate-100 text-left">{pkg.resident}</td>
                                        <td className="p-3 font-mono text-left">{pkg.property}</td>
                                        <td className="p-3 text-center">
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                                pkg.status === 'pending'
                                                    ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
                                                    : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                                            }`}>
                                                {pkg.status === 'pending' ? 'En Custodia' : 'Entregado'}
                                            </span>
                                        </td>
                                        <td className="p-3 text-right">
                                            {pkg.status === 'pending' && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPackages(prev => prev.map(p => p.id === pkg.id ? { ...p, status: 'completed' } : p));
                                                        setTerminalLogs(prev => [...prev, "[CUSTODIA] Entregado paquete " + pkg.tracking + " al residente " + pkg.resident]);
                                                    }}
                                                    className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-[10px] rounded hover:bg-emerald-500/20 transition-all"
                                                >
                                                    Entregar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
