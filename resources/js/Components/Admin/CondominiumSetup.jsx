import React, { useState } from 'react';
import api from '@/bootstrap';

export default function CondominiumSetup({ allCondominiums = [] }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        condominium_id: '',
        type: 'tower',
        towers: [
            { name: 'Torre A', floors: 10, units_per_floor: 4, has_water_meter: true, has_electricity_meter: false }
        ]
    });

    const addTower = () => {
        setFormData({
            ...formData,
            towers: [...formData.towers, { name: `Torre ${String.fromCharCode(65 + formData.towers.length)}`, floors: 10, units_per_floor: 4, has_water_meter: true, has_electricity_meter: false }]
        });
    };

    const handleSave = async () => {
        try {
            // Assume axios is globally configured or imported
            const response = await api.post('/api/setup-condominium', formData);
            if (response.status === 201) {
                alert('Estructura guardada exitosamente.');
            }
        } catch (error) {
            console.error(error);
            alert('Error al guardar la estructura.');
        }
    };

    return (
        <div className="space-y-6 font-outfit text-gray-800 dark:text-gray-200">
            <h2 className="text-2xl font-bold dark:text-white">Asistente de Configuración Estructural</h2>
            <div className="bg-white dark:bg-brand-bg-secondary p-6 rounded-card border border-gray-200 dark:border-slate-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Condominio</label>
                        <select 
                            className="w-full rounded-btn border-gray-300 dark:border-slate-700 dark:bg-slate-900"
                            value={formData.condominium_id}
                            onChange={(e) => setFormData({...formData, condominium_id: e.target.value})}
                        >
                            <option value="">Seleccione un Condominio...</option>
                            {allCondominiums.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-8 space-y-4">
                    <h3 className="text-lg font-semibold">Torres / Bloques</h3>
                    {formData.towers.map((tower, idx) => (
                        <div key={idx} className="flex gap-4 items-end bg-gray-50 dark:bg-slate-900 p-4 rounded-btn border border-gray-200 dark:border-slate-800">
                            <div>
                                <label className="block text-xs uppercase text-gray-500">Nombre de Torre</label>
                                <input type="text" className="mt-1 block w-full rounded-btn border-gray-300 dark:border-slate-700 dark:bg-brand-bg-secondary" 
                                    value={tower.name}
                                    onChange={(e) => {
                                        const t = [...formData.towers];
                                        t[idx].name = e.target.value;
                                        setFormData({...formData, towers: t});
                                    }}
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase text-gray-500">Pisos</label>
                                <input type="number" className="mt-1 block w-full rounded-btn border-gray-300 dark:border-slate-700 dark:bg-brand-bg-secondary" 
                                    value={tower.floors}
                                    onChange={(e) => {
                                        const t = [...formData.towers];
                                        t[idx].floors = parseInt(e.target.value);
                                        setFormData({...formData, towers: t});
                                    }}
                                />
                            </div>
                            <div>
                                <label className="block text-xs uppercase text-gray-500">Unidades x Piso</label>
                                <input type="number" className="mt-1 block w-full rounded-btn border-gray-300 dark:border-slate-700 dark:bg-brand-bg-secondary" 
                                    value={tower.units_per_floor}
                                    onChange={(e) => {
                                        const t = [...formData.towers];
                                        t[idx].units_per_floor = parseInt(e.target.value);
                                        setFormData({...formData, towers: t});
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                    <button onClick={addTower} className="text-sm text-brand-teal font-medium hover:underline">
                        + Añadir Torre
                    </button>
                </div>

                <div className="mt-8 flex justify-end">
                    <button onClick={handleSave} className="bg-brand-teal text-white px-6 py-2 rounded-btn font-semibold hover:bg-teal-600 transition-colors">
                        Generar Estructura
                    </button>
                </div>
            </div>
        </div>
    );
}
