import { useState } from 'react';

export default function AnnouncementsList({ setMobileTab }) {
    const [items] = useState([
        { id: 1, title: 'Fumigación de Áreas Verdes', category: 'Importante', date: '24/05/2026', body: 'Se procederá a realizar la fumigación de jardines comunes este Sábado a partir de las 08:30 hrs. Mantenga ventanas cerradas y retire mascotas.', priority: 'warning' },
        { id: 2, title: 'Prueba de Alarmas de Incendio', category: 'Normal', date: '20/05/2026', body: 'El Miércoles 27 a las 12:00 se realizarán las pruebas reglamentarias del sistema de evacuación. Sonará por bloques de 15 segundos.', priority: 'default' },
        { id: 3, title: 'Pago Gasto Común Disponible', category: 'Urgente', date: '15/05/2026', body: 'Se informa la emisión del cobro del mes de Mayo. Agradecemos registrar sus transferencias mediante nuestro nuevo visor QR express.', priority: 'danger' }
    ]);

    return (
        <div className="space-y-4 animate-scale-up text-left">
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => setMobileTab('home')} 
                    className="text-slate-500 hover:text-slate-700 transition-colors"
                    type="button"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">Mural de Comunicados</h3>
            </div>

            <div className="space-y-3">
                {items.map(item => (
                    <div key={item.id} className="p-4 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-2 bg-slate-50/50 dark:bg-slate-950 shadow-sm">
                        <div className="flex justify-between items-center">
                            <span className={`px-2 py-0.5 text-[8px] font-bold rounded uppercase ${
                                item.priority === 'danger' ? 'bg-rose-500/10 text-rose-500' :
                                item.priority === 'warning' ? 'bg-amber-500/10 text-amber-500' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                            }`}>
                                {item.category}
                            </span>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500">{item.date}</span>
                        </div>
                        <h4 className="text-xs font-black text-slate-800 dark:text-white">{item.title}</h4>
                        <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{item.body}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
