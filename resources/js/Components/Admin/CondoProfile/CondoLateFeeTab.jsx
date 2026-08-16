export default function CondoLateFeeTab({ lateFeeData, setLateFeeData }) {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-5 text-left">
            <div>
                <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                    Parámetros de Morosidad e Intereses (Ley 21.442)
                </h4>
                <p className="text-[11px] text-slate-400">
                    Configuración de días de gracia y tasa porcentual de interés aplicable sobre saldos insolutos vencidos.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Día de Vencimiento de Boleta</label>
                    <input
                        type="number"
                        min="1"
                        max="31"
                        value={lateFeeData.due_day || 15}
                        onChange={(e) => setLateFeeData(p => ({ ...p, due_day: Number(e.target.value) }))}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-white font-bold"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Día del mes límite para pago sin mora.</span>
                </div>
                <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Tasa Mensual de Interés por Mora (%)</label>
                    <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        value={lateFeeData.late_fee_rate || 2.0}
                        onChange={(e) => setLateFeeData(p => ({ ...p, late_fee_rate: Number(e.target.value) }))}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-white font-bold"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Aplicado sobre el saldo insoluto del mes anterior.</span>
                </div>
            </div>
        </div>
    );
}
