/**
 * Role Simulator Panel for Welcome page
 */
export default function RoleSimulatorPanel({
    activeRole,
    setActiveRole,
    rolesInfo,
    simulatedDarkMode,
    setSimulatedDarkMode,
    ownerIsPaid,
    handlePayClick,
    handleResetPayment,
    showPaymentSuccess,
    tickets,
    handleTicketStatusChange,
    approvedExpenses,
    handleApproveExpense,
    terminalLogs
}) {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 text-left">
            {/* Header & Role Selector Tabs */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                <div>
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                        Simulador Interactivo de Roles
                    </span>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                        Explora la Experiencia Multirrol Sincronizada
                    </h3>
                </div>

                {/* Dark Mode Toggle for Simulator */}
                <button
                    onClick={() => setSimulatedDarkMode(!simulatedDarkMode)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer"
                >
                    <span>{simulatedDarkMode ? '🌙 Modo Oscuro' : '☀️ Modo Claro'}</span>
                </button>
            </div>

            {/* Role Buttons Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {[
                    { id: 'admin', label: '👑 Admin', color: 'indigo' },
                    { id: 'owner', label: '🏡 Propietario', color: 'emerald' },
                    { id: 'resident', label: '👤 Residente', color: 'teal' },
                    { id: 'committee', label: '📊 Comité', color: 'purple' },
                    { id: 'staff', label: '👷 Colaborador', color: 'amber' },
                    { id: 'ti', label: '⚙️ TI / DevOps', color: 'rose' }
                ].map(r => (
                    <button
                        key={r.id}
                        onClick={() => setActiveRole(r.id)}
                        className={`px-3 py-2.5 rounded-xl font-extrabold text-xs transition-all cursor-pointer ${
                            activeRole === r.id
                                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md scale-105'
                                : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                        }`}
                    >
                        {r.label}
                    </button>
                ))}
            </div>

            {/* Simulated Workspace View */}
            <div className={`rounded-2xl border p-6 transition-all duration-300 ${simulatedDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                {/* Role Details */}
                <div className="flex items-center justify-between border-b border-slate-200/20 pb-4 mb-4">
                    <div>
                        <h4 className="text-lg font-black">{rolesInfo[activeRole]?.title}</h4>
                        <p className="text-xs opacity-75">{rolesInfo[activeRole]?.desc}</p>
                    </div>
                    <span className="text-xs font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-3 py-1 rounded-full">
                        {rolesInfo[activeRole]?.badge}
                    </span>
                </div>

                {/* Interactive Dynamic Action Box per Role */}
                {activeRole === 'owner' && (
                    <div className="space-y-4 animate-fade-in">
                        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                            <div>
                                <span className="text-xs font-bold uppercase text-emerald-400">Gasto Común Período Mayo 2026</span>
                                <div className="text-xl font-black">$165.000 CLP</div>
                            </div>
                            {ownerIsPaid ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1.5 rounded-full border border-emerald-500/30">
                                        ✅ Pagado & Conciliado
                                    </span>
                                    <button onClick={handleResetPayment} className="text-xs underline opacity-70 hover:opacity-100">
                                        Reiniciar
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handlePayClick}
                                    disabled={showPaymentSuccess}
                                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
                                >
                                    {showPaymentSuccess ? '⚡ Procesando en Webpay...' : '💳 Pagar en Línea Ahora'}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {activeRole === 'staff' && (
                    <div className="space-y-3 animate-fade-in">
                        <h5 className="text-xs font-bold text-slate-400 uppercase">Tickets de Mantención Asignados</h5>
                        {tickets.map(t => (
                            <div key={t.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                                <div>
                                    <span className="font-bold text-white">#{t.id} - {t.title}</span>
                                    <span className={`ml-2 text-[10px] px-2 py-0.5 rounded-full font-bold ${t.priority === 'urgent' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                        {t.priority}
                                    </span>
                                </div>
                                <select
                                    value={t.status}
                                    onChange={(e) => handleTicketStatusChange(t.id, e.target.value)}
                                    className="bg-slate-800 border border-slate-700 text-xs font-bold text-white rounded-lg px-2 py-1 cursor-pointer"
                                >
                                    <option value="open">Abierto</option>
                                    <option value="in_progress">En Curso</option>
                                    <option value="resolved">Resuelto ✅</option>
                                </select>
                            </div>
                        ))}
                    </div>
                )}

                {activeRole === 'committee' && (
                    <div className="space-y-3 animate-fade-in">
                        <h5 className="text-xs font-bold text-slate-400 uppercase">Solicitudes de Egreso Pendientes de Firma</h5>
                        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                            <div>
                                <span className="font-bold text-white">Reparación de Bomba Hidráulica Torre B</span>
                                <span className="block text-[10px] text-slate-400">Monto: $450.000 CLP</span>
                            </div>
                            {approvedExpenses[1] ? (
                                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full">
                                    ✓ Aprobado por Comité
                                </span>
                            ) : (
                                <button
                                    onClick={() => handleApproveExpense(1)}
                                    className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg shadow-md transition-all cursor-pointer"
                                >
                                    ✍️ Firmar & Aprobar
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {activeRole === 'ti' && (
                    <div className="space-y-2 animate-fade-in font-mono text-[11px] bg-slate-900 p-4 rounded-xl border border-slate-800 text-emerald-400 max-h-48 overflow-y-auto">
                        <div className="text-slate-400 font-bold mb-2">=== RedVecino CLI Live Kernel Logs ===</div>
                        {terminalLogs.map((log, idx) => (
                            <div key={idx} className="leading-tight">{log}</div>
                        ))}
                    </div>
                )}

                {/* Capabilities Bullet List */}
                <div className="mt-4 pt-4 border-t border-slate-200/10">
                    <h5 className="text-xs font-bold opacity-80 mb-2">Capacidades del Rol:</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {rolesInfo[activeRole]?.capabilities.map((c, i) => (
                            <div key={i} className="flex items-center gap-2">
                                <span className="text-emerald-400 font-bold">✓</span>
                                <span className="opacity-90">{c}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
