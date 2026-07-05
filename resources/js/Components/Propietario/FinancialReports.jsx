import { useState } from 'react';

export default function FinancialReports({ reports: initialReports }) {
    const [reports] = useState(initialReports || []);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    const filteredReports = reports.filter(r => {
        const matchesSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.desc.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'all' || r.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const handleDownload = (title) => {
        const { toast } = require('@/utils/notify');
        toast(`Descargando: ${title}`, 'success');
    };

    return (
        <div className="space-y-6 text-left">
            {/* Search and Filters Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
                <div className="w-full sm:max-w-xs relative">
                    <input
                        type="text"
                        placeholder="Buscar informes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-xs border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-xl focus:outline-none focus:border-brand-green dark:text-slate-200"
                    />
                    <div className="absolute left-3 top-2.5 text-slate-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
                    {['all', 'Finanzas', 'Auditoría', 'Actas', 'Presupuesto'].map(cat => (
                        <button
                            key={cat}
                            type="button"
                            onClick={() => setFilterCategory(cat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                                filterCategory === cat
                                    ? 'bg-brand-green border-brand-green text-white'
                                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-600 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900'
                            }`}
                        >
                            {cat === 'all' ? 'Ver Todos' : cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Document List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredReports.length > 0 ? (
                    filteredReports.map((doc, idx) => (
                        <div
                            key={idx}
                            className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl p-5 hover:border-brand-green/30 dark:hover:border-brand-green/30 transition-all flex flex-col justify-between shadow-sm space-y-4"
                        >
                            <div className="space-y-2">
                                <div className="flex justify-between items-start gap-2">
                                    <span className="px-2 py-0.5 bg-brand-green/15 text-brand-green dark:bg-brand-green/10 text-[9px] font-extrabold uppercase rounded-md tracking-wider">
                                        {doc.category}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-mono font-medium">{doc.date}</span>
                                </div>
                                <h4 className="text-sm font-black text-gray-900 dark:text-white leading-tight">{doc.title}</h4>
                                <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed font-medium">
                                    {doc.desc}
                                </p>
                            </div>

                            <div className="flex items-center justify-between border-t border-gray-100 dark:border-slate-800/80 pt-3">
                                <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-bold uppercase">
                                    {doc.type} &bull; {doc.size}
                                </span>
                                <button
                                    onClick={() => handleDownload(doc.title)}
                                    className="px-3.5 py-1.5 rounded-xl bg-brand-green/10 hover:bg-brand-green border-brand-green/20 hover:border-transparent text-brand-green hover:text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                                >
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>
                                    Descargar
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl">
                        <p className="text-sm text-slate-400 dark:text-slate-500">No se encontraron reportes que coincidan con los criterios de búsqueda.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
