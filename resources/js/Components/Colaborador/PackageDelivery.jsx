import { useState, useEffect } from 'react';
import { toast } from '@/utils/notify';
import ToastContainer from '@/Components/Toast';
import axios from 'axios';
import { Package, Camera, CheckCircle2, Truck } from 'lucide-react';

export default function PackageDelivery({
    adminCondoId = 1,
    ocrScanning: parentScanning,
    setOcrScanning: setParentScanning,
    packages: parentPackages,
    setPackages: setParentPackages,
    setTerminalLogs
}) {
    const [localScanning, setLocalScanning] = useState(false);
    const ocrScanning = parentScanning !== undefined ? parentScanning : localScanning;
    const setOcrScanning = setParentScanning || setLocalScanning;

    const [packagesList, setPackagesList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [carrier, setCarrier] = useState('Chilexpress');
    const [dept, setDept] = useState('Depto 101');
    const [recipientName, setRecipientName] = useState('Diego Alarcón');

    const fetchPackages = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/api/package-custodies?condominium_id=${adminCondoId || 1}`);
            setPackagesList(res.data || []);
        } catch (err) {
            console.error('Error cargando encomiendas:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, [adminCondoId]);

    const handleScanAndRegister = async () => {
        setOcrScanning(true);
        if (setTerminalLogs) {
            setTerminalLogs(prev => [...prev, '[OCR] Iniciando proceso de lectura óptica en etiqueta...']);
        }

        setTimeout(async () => {
            setOcrScanning(false);
            const randTracking = carrier.slice(0, 2).toUpperCase() + '-' + Math.floor(100000 + Math.random() * 900000) + '-CL';

            try {
                // Registrar vía API real
                await axios.post('/api/package-custodies', {
                    condominium_id: adminCondoId || 1,
                    property_id: 1, // Unidad demo
                    recipient_name: recipientName,
                    carrier: carrier,
                    tracking_number: randTracking,
                    notes: `Recepción escaneada en conserjería para ${dept}`,
                });

                if (setTerminalLogs) {
                    setTerminalLogs(prev => [...prev, `[OCR] ¡Éxito! Encomienda ${randTracking} asociada a ${dept}`]);
                }
                toast(`OCR exitoso: Se registró el paquete ${randTracking} de ${carrier} para ${dept}.`, 'success');
                fetchPackages();
            } catch (err) {
                toast(err.response?.data?.message || 'Error registrando paquete', 'error');
            }
        }, 1200);
    };

    const handleDeliver = async (pkgId, tracking) => {
        try {
            await axios.put(`/api/package-custodies/${pkgId}/deliver`, {
                signature: 'Firma digital confirmada en conserjería'
            });
            toast(`Paquete ${tracking} entregado conforme`, 'success');
            if (setTerminalLogs) {
                setTerminalLogs(prev => [...prev, `[CUSTODIA] Entregado paquete ${tracking}`]);
            }
            fetchPackages();
        } catch (err) {
            toast('Error al marcar entrega', 'error');
        }
    };

    return (
        <div className="space-y-6 animate-fade-in text-left">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
                        <span>📦 Recepción y Custodia de Encomiendas</span>
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Registro de paquetería con transportista, número de seguimiento y firma de entrega.
                    </p>
                </div>
                <span className="text-[10px] bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/60 text-teal-600 dark:text-teal-400 px-2.5 py-1 rounded-xl font-bold font-mono">
                    Conserjería Inteligente
                </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cámara OCR y Registro */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4 shadow-sm">
                    <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                        <Camera className="w-4 h-4 text-teal-500" />
                        <span>Cámara de Escáner OCR</span>
                    </h5>

                    {/* Laser simulator */}
                    <div className="bg-slate-950 aspect-[4/3] rounded-2xl border border-slate-800 flex items-center justify-center relative overflow-hidden">
                        {ocrScanning ? (
                            <div className="space-y-2 text-center z-10">
                                <div className="animate-spin h-6 w-6 border-2 border-t-transparent border-teal-400 rounded-full mx-auto" />
                                <span className="text-[10px] font-mono text-teal-400 block animate-pulse">Lector OCR: Analizando etiqueta...</span>
                            </div>
                        ) : (
                            <div className="text-center z-10 space-y-2">
                                <Package className="w-8 h-8 text-slate-600 mx-auto" />
                                <span className="text-[10px] font-mono text-slate-400 block">Posiciona el paquete frente al lector</span>
                            </div>
                        )}

                        {ocrScanning && (
                            <div
                                className="absolute left-0 w-full h-[2px] bg-teal-400 shadow-[0_0_10px_#2dd4bf] z-20"
                                style={{
                                    animation: 'scanLaser 1.2s infinite ease-in-out',
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
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Destinatario / Residente</label>
                            <input
                                type="text"
                                value={recipientName}
                                onChange={(e) => setRecipientName(e.target.value)}
                                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white"
                                placeholder="Nombre del residente"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Unidad de Destino</label>
                            <select
                                value={dept}
                                onChange={(e) => setDept(e.target.value)}
                                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white cursor-pointer"
                            >
                                <option value="Depto 101">Depto 101 (Torre A)</option>
                                <option value="Depto 202">Depto 202 (Torre A)</option>
                                <option value="Depto 303">Depto 303 (Torre B)</option>
                                <option value="Depto 501">Depto 501 (Torre B)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Empresa de Envío / Courier</label>
                            <select
                                value={carrier}
                                onChange={(e) => setCarrier(e.target.value)}
                                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs px-3 py-2 text-slate-800 dark:text-white cursor-pointer"
                            >
                                <option value="Chilexpress">Chilexpress</option>
                                <option value="Starken">Starken</option>
                                <option value="Blue Express">Blue Express</option>
                                <option value="Mercado Envíos">Mercado Envíos</option>
                                <option value="Correos de Chile">Correos de Chile</option>
                            </select>
                        </div>

                        <button
                            type="button"
                            disabled={ocrScanning}
                            onClick={handleScanAndRegister}
                            className="w-full py-2.5 bg-brand-teal hover:bg-brand-teal-light text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Camera className="w-4 h-4" />
                            <span>Simular Escaneo y Registrar</span>
                        </button>
                    </div>
                </div>

                {/* Lista de Paquetes en Custodia e Historial */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                            <Truck className="w-4 h-4 text-teal-500" />
                            <span>Historial de Custodia e Inventario</span>
                        </h5>
                        <span className="text-[10px] text-slate-400 font-mono">{packagesList.length} registrados</span>
                    </div>

                    {loading ? (
                        <div className="p-8 text-center text-xs text-slate-400">Cargando paquetes en custodia...</div>
                    ) : packagesList.length === 0 ? (
                        <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800">
                            No hay encomiendas registradas en este condominio.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                                        <th className="p-3 font-black text-left">Tracking</th>
                                        <th className="p-3 font-black text-left">Courier</th>
                                        <th className="p-3 font-black text-left">Destinatario</th>
                                        <th className="p-3 font-black text-left">Unidad</th>
                                        <th className="p-3 font-black text-center">Estado</th>
                                        <th className="p-3 font-black text-right">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                                    {packagesList.map((pkg) => {
                                        const isCustody = pkg.status === 'custody' || pkg.status === 'pending';
                                        return (
                                            <tr key={pkg.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                                                <td className="p-3 font-mono font-bold text-teal-600 dark:text-teal-400 text-left">
                                                    {pkg.tracking_number || pkg.tracking || `#${pkg.id}`}
                                                </td>
                                                <td className="p-3 text-left font-medium">{pkg.carrier}</td>
                                                <td className="p-3 font-bold text-slate-900 dark:text-white text-left">
                                                    {pkg.recipient_name || pkg.resident || 'Residente'}
                                                </td>
                                                <td className="p-3 font-mono text-left">
                                                    {pkg.property ? `${pkg.property.block || 'Torre'} - ${pkg.property.number}` : (pkg.property || 'Depto 101')}
                                                </td>
                                                <td className="p-3 text-center">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                                                        isCustody
                                                            ? 'bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400'
                                                            : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                                                    }`}>
                                                        {isCustody ? 'En Custodia' : 'Entregado'}
                                                    </span>
                                                </td>
                                                <td className="p-3 text-right">
                                                    {isCustody && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeliver(pkg.id, pkg.tracking_number || pkg.tracking)}
                                                            className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] rounded-lg transition-all"
                                                        >
                                                            Entregar
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}
