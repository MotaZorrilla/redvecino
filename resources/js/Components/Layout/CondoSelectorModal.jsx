import Modal from '@/Components/Modal';
import { Building2 } from 'lucide-react';

export default function CondoSelectorModal({
    isOpen,
    onClose,
    condosList = [],
    adminCondoId,
    setAdminCondoId,
    user
}) {
    return (
        <Modal show={isOpen} onClose={onClose} maxWidth="lg">
            <div className="p-6 space-y-4 bg-white dark:bg-slate-900 text-left">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                    <div>
                        <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">
                            Seleccionar Condominio Activo
                        </h4>
                        <p className="text-xs text-slate-400">Administra las operaciones del condominio seleccionado.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold"
                    >
                        ✕
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {condosList.map((condo) => {
                        const isSelected = String(condo.id) === String(adminCondoId);
                        return (
                            <button
                                key={condo.id}
                                type="button"
                                onClick={() => {
                                    setAdminCondoId(condo.id);
                                    onClose();
                                }}
                                className={`p-4 rounded-2xl border text-left transition-all ${
                                    isSelected
                                        ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                                        : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h5 className="text-xs font-black text-slate-900 dark:text-white">{condo.name}</h5>
                                        <span className="text-[10px] text-slate-400 font-mono">{condo.rut || 'RUT: N/A'}</span>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center justify-between text-[10px]">
                                    <span className="text-slate-500">{condo.city || 'Chile'}</span>
                                    <span className={`font-black uppercase ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`}>
                                        {isSelected ? '✓ Seleccionado' : 'Elegir'}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </Modal>
    );
}
