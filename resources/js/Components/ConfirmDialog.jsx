import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmText = 'Eliminar', cancelText = 'Cancelar', danger = false }) {
    return (
        <Dialog open={open} onClose={() => onClose(false)} className="relative z-[9999]">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-800">
                    <DialogTitle className="text-base font-black text-slate-900 dark:text-white mb-2">
                        {title}
                    </DialogTitle>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                        {message}
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => onClose(false)}
                            className="px-4 py-2 text-xs font-bold rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            {cancelText}
                        </button>
                        <button
                            type="button"
                            onClick={() => { onConfirm(); onClose(false); }}
                            className={`px-4 py-2 text-xs font-bold rounded-xl text-white transition-colors ${
                                danger
                                    ? 'bg-rose-600 hover:bg-rose-700'
                                    : 'bg-indigo-600 hover:bg-indigo-700'
                            }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
