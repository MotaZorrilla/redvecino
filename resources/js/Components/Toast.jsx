import { useState, useEffect } from 'react';
import { addToastListener } from '@/utils/notify';

export default function ToastContainer() {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        const unsub = addToastListener((t) => {
            setToasts(prev => [...prev, t]);
            setTimeout(() => {
                setToasts(prev => prev.filter(x => x.id !== t.id));
            }, 3000);
        });
        return unsub;
    }, []);

    if (toasts.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-toast flex flex-col gap-2 max-w-sm">
            {toasts.map(t => (
                <div
                    key={t.id}
                    className={`animate-fade-in px-4 py-3 rounded-modal shadow-xl text-sm font-bold text-white flex items-center gap-2 ${
                        t.type === 'error' ? 'bg-brand-error' :
                        t.type === 'warning' ? 'bg-brand-warning' :
                        'bg-brand-success'
                    }`}
                    role="alert"
                >
                    <span>{t.type === 'error' ? '✕' : t.type === 'warning' ? '⚠' : '✓'}</span>
                    <span>{t.message}</span>
                </div>
            ))}
        </div>
    );
}
