<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Budget;
use App\Models\Condominium;

class BudgetSeeder extends Seeder
{
    /**
     * Crea presupuestos aprobados por asamblea para cada condominio y período
     * del motor contable (Fase 2). El motor exige un Budget aprobado antes de
     * emitir boletas, por lo que la demo requiere estos registros.
     */
    public function run(): void
    {
        $condos = Condominium::all();
        if ($condos->isEmpty()) return;

        $anchorYear = config('demo.anchor_year', date('Y'));

        $periods = [
            $anchorYear . '-06' => 4500000,
            $anchorYear . '-07' => 4800000,
            $anchorYear . '-08' => 5200000,
        ];

        foreach ($condos as $condo) {
            foreach ($periods as $period => $amount) {
                Budget::updateOrCreate(
                    ['condominium_id' => $condo->id, 'period' => $period],
                    [
                        'amount' => $amount,
                        'status' => 'approved',
                        'approved_by' => null,
                        'approved_at' => now(),
                    ]
                );
            }
        }
    }
}