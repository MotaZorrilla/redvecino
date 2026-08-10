import React from 'react';

export default function BrandAssetsGallery({ brandAssets, setSelectedImage }) {
    return (
        <section className="mb-20">
            <div className="text-center max-w-3xl mx-auto mb-10">
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                    Recursos de Identidad Visual
                </span>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-4">
                    Documentación de Marca y Roadmap Estratégico
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">
                    Haz clic en cualquier recurso gráfico para inspeccionarlo en alta resolución.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {brandAssets.map((asset) => (
                    <div
                        key={asset.id}
                        onClick={() => setSelectedImage(asset)}
                        className="group bg-white dark:bg-slate-900 rounded-3xl p-4 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all cursor-pointer overflow-hidden flex flex-col justify-between"
                    >
                        <div>
                            <div className="relative aspect-video rounded-2xl overflow-hidden mb-4 bg-slate-950">
                                <img
                                    src={asset.image}
                                    alt={asset.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/10 transition-colors" />
                                <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider bg-slate-900/90 text-emerald-400 backdrop-blur-md px-2.5 py-1 rounded-full border border-emerald-500/30">
                                    {asset.tag}
                                </span>
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-base mb-1 group-hover:text-emerald-500 transition-colors">
                                {asset.title}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                                {asset.desc}
                            </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                            <span>Inspeccionar recurso</span>
                            <span>🔍</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
