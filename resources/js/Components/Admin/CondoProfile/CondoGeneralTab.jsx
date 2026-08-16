export default function CondoGeneralTab({ formData, setFormData }) {
    return (
        <div className="space-y-6 text-left">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-4">
                <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                    1. Identificación y Ubicación Física
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nombre del Condominio</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-white font-bold"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">RUT o ROL Legal</label>
                        <input
                            type="text"
                            value={formData.rut}
                            onChange={(e) => setFormData(p => ({ ...p, rut: e.target.value }))}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-white font-bold"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Dirección Completa</label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-white font-bold"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Correo Electrónico de Contacto</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-white font-bold"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Teléfono Móvil / Fijo</label>
                        <input
                            type="text"
                            value={formData.phone}
                            onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-white font-bold"
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xs space-y-4">
                <h4 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                    2. Configuración Estructural (Torres y Unidades)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">N° Total de Torres / Manzanas</label>
                        <input
                            type="number"
                            value={formData.towers_count}
                            onChange={(e) => setFormData(p => ({ ...p, towers_count: Number(e.target.value) }))}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-white font-bold"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">N° de Unidades Habitacionales</label>
                        <input
                            type="number"
                            value={formData.units_count}
                            onChange={(e) => setFormData(p => ({ ...p, units_count: Number(e.target.value) }))}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-white font-bold"
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nomenclatura de Torres</label>
                        <select
                            value={formData.tower_naming}
                            onChange={(e) => setFormData(p => ({ ...p, tower_naming: e.target.value }))}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-800 dark:text-white font-bold"
                        >
                            <option value="numbers">Numérica (Torre 1, Torre 2)</option>
                            <option value="letters">Alfabética (Torre A, Torre B)</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
