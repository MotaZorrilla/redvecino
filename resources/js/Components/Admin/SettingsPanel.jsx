import { useState } from 'react';

export default function SettingsPanel({
    adminSettingsForm,
    setAdminSettingsForm,
    settingsSuccess,
    setSettingsSuccess,
    exportingLogs,
    setExportingLogs,
    setTerminalLogs,
    usersList = [],
    propertiesList = [],
    paymentsList = []
}) {
    return (
        <div className="grid gap-6 md:grid-cols-2 animate-fade-in text-left">
            {/* Admin profile settings form */}
            <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 p-6 rounded-2xl space-y-4 shadow-sm">
                <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                    👤 Datos del Administrador
                </h4>
                <p className="text-xs text-gray-500 dark:text-slate-400">
                    Modifica la información básica del administrador del condominio.
                </p>
                {settingsSuccess && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-500 text-xs font-bold animate-fade-in">
                        ✅ ¡Datos del administrador actualizados con éxito!
                    </div>
                )}
                <form onSubmit={(e) => {
                    e.preventDefault();
                    setSettingsSuccess(true);
                    setTimeout(() => setSettingsSuccess(false), 3000);
                    if (setTerminalLogs) {
                        setTerminalLogs(prev => [...prev, `[ADMIN-SETTINGS] Datos actualizados: ${adminSettingsForm.name} (${adminSettingsForm.email})`]);
                    }
                }} className="space-y-3">
                    <div>
                        <label htmlFor="settings-name" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Nombre Completo</label>
                        <input
                            id="settings-name"
                            type="text"
                            value={adminSettingsForm.name}
                            onChange={e => setAdminSettingsForm(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-gray-800 dark:text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="settings-email" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Correo Electrónico</label>
                        <input
                            id="settings-email"
                            type="email"
                            value={adminSettingsForm.email}
                            onChange={e => setAdminSettingsForm(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-gray-800 dark:text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label htmlFor="settings-phone" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Teléfono</label>
                            <input
                                id="settings-phone"
                                type="text"
                                value={adminSettingsForm.phone}
                                onChange={e => setAdminSettingsForm(prev => ({ ...prev, phone: e.target.value }))}
                                className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-gray-800 dark:text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label htmlFor="settings-rut" className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">RUT</label>
                            <input
                                id="settings-rut"
                                type="text"
                                value={adminSettingsForm.rut}
                                onChange={e => setAdminSettingsForm(prev => ({ ...prev, rut: e.target.value }))}
                                className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-gray-800 dark:text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-2 py-2 bg-brand-teal hover:bg-brand-teal-light text-white font-bold text-xs rounded-xl shadow-md transition-all border border-transparent"
                    >
                        Guardar Cambios
                    </button>
                </form>
            </div>

            {/* System settings and simulation */}
            <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 p-6 rounded-2xl space-y-4 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-slate-100 flex items-center gap-2">
                        ⚙️ Configuración del Sistema
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                        Ajustes globales de la comunidad y base de datos simulada.
                    </p>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-950 rounded-xl border border-gray-200 dark:border-slate-800">
                            <div>
                                <span className="text-xs font-bold text-gray-800 dark:text-slate-200 block">Notificaciones por Email</span>
                                <span className="text-[10px] text-gray-500 dark:text-slate-400">Enviar correos por nuevos tickets o pagos.</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={adminSettingsForm.notificationToggle}
                                    onChange={e => setAdminSettingsForm(prev => ({ ...prev, notificationToggle: e.target.checked }))}
                                    className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-gray-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-teal"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-950 rounded-xl border border-gray-200 dark:border-slate-800">
                            <div>
                                <span className="text-xs font-bold text-gray-900 dark:text-slate-200 block">Motor de Base de Datos</span>
                                <span className="text-[10px] text-gray-500 dark:text-slate-400">Driver activo para la aplicación.</span>
                            </div>
                            <select
                                value={adminSettingsForm.dbDriver}
                                onChange={e => {
                                    const drv = e.target.value;
                                    setAdminSettingsForm(prev => ({ ...prev, dbDriver: drv }));
                                    if (setTerminalLogs) {
                                        setTerminalLogs(prev => [...prev, `[DB-CONFIG] Cambiando motor de base de datos a: ${drv.toUpperCase()}`]);
                                    }
                                }}
                                className="bg-transparent border border-gray-200 dark:border-slate-800 rounded-lg py-1 px-2 text-xs font-bold text-gray-900 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                            >
                                <option value="sqlite">SQLite (Local)</option>
                                <option value="mysql">MySQL (Producción)</option>
                                <option value="postgres">PostgreSQL</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-slate-800 space-y-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Inspección de Auditoría</span>
                    <button
                        type="button"
                        onClick={() => {
                            setExportingLogs(true);
                            setTimeout(() => {
                                setExportingLogs(false);
                                if (setTerminalLogs) {
                                    setTerminalLogs(prev => [
                                        ...prev,
                                        `[AUDIT] ${new Date().toISOString()} - Exportación de auditoría iniciada por Administrador.`,
                                        `[AUDIT] Exportado histórico de ${usersList.length} usuarios, ${propertiesList.length} propiedades y ${paymentsList.length} transacciones.`,
                                        `[AUDIT] Archivo guardado correctamente en backend: 'audit_log_${Date.now()}.json'`
                                    ]);
                                }
                                alert("¡Logs de auditoría exportados y guardados en terminalLogs con éxito!");
                            }, 1000);
                        }}
                        disabled={exportingLogs}
                        className={`w-full py-2 ${exportingLogs ? 'bg-brand-teal/40 text-slate-400 cursor-not-allowed' : 'bg-slate-900 hover:bg-slate-800 text-white'} border border-slate-700 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2`}
                    >
                        {exportingLogs ? (
                            <>
                                <span className="animate-spin h-3.5 w-3.5 border-2 border-indigo-400 border-t-transparent rounded-full"></span>
                                Generando Reporte...
                            </>
                        ) : (
                            <>📋 Exportar Logs de Auditoría</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
