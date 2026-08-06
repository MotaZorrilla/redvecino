<?php

namespace Database\Seeders;

use App\Models\CommonExpensePeriod;
use App\Models\CommonExpenseReceipt;
use App\Models\Condominium;
use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Siembra el Motor Contable de Gastos Comunes (Fase 2) con datos deterministas:
 *  - Período 2026-07: cerrado (boletas pagadas), dejando 2 unidades morosas sin pagar.
 *  - Período 2026-08: emitido, con una boleta por propiedad. Las unidades morosas del
 *    período anterior arrastran Saldo Anterior + Interés por mora.
 * Replica exactamente las fórmulas del motor (Api\CommonExpensePeriodController@generateMassBilling)
 * usando el coeficiente por alícuota de modelo (properties.coefficient).
 */
class CommonExpensePeriodReceiptSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::whereEmail('admin@redvecino.cl')->first();

        $budgets = [
            'Condominio Alameda Loft'     => ['2026-07' => 5000000.00, '2026-08' => 5200000.00],
            'Condominio Parque del Inca'   => ['2026-07' => 4000000.00, '2026-08' => 4150000.00],
            'Condominio Providencia Plaza' => ['2026-07' => 3000000.00, '2026-08' => 3100000.00],
        ];

        foreach (Condominium::all() as $condo) {
            $monthBudget = $budgets[$condo->name] ?? ['2026-07' => 3000000.00, '2026-08' => 3200000.00];
            $moraRate = $condo->late_interest_rate !== null
                ? floatval($condo->late_interest_rate) / 100.0
                : 0.015;

            $this->seedPeriod($condo, '2026-07', $monthBudget['2026-07'], $admin, $moraRate, 'closed');
            $this->seedPeriod($condo, '2026-08', $monthBudget['2026-08'], $admin, $moraRate, 'issued');
        }
    }

    private function seedPeriod(
        Condominium $condo,
        string $period,
        float $totalExpenses,
        ?User $admin,
        float $moraRate,
        string $status
    ): void {
        $periodRecord = CommonExpensePeriod::updateOrCreate(
            ['condominium_id' => $condo->id, 'period' => $period],
            [
                'status' => $status,
                'total_expenses' => $totalExpenses,
                'reserve_fund_pct' => 5.00,
                'due_date' => date('Y-m-25', strtotime($period . '-01')),
                'created_by' => $admin->id ?? null,
            ]
        );

        $properties = Property::where('condominium_id', $condo->id)
            ->orderBy('id')
            ->get();

        $totalArea = $properties->sum('area_sqm') ?: 1;

        // Unidades morosas del período histórico (las 2 primeras unidades de este condominio)
        $morosos = Property::where('condominium_id', $condo->id)
            ->where('type', 'apartment')
            ->orderBy('id')
            ->limit(2)
            ->pluck('id')
            ->all();

        foreach ($properties as $property) {
            $coefficient = $property->coefficient !== null
                ? floatval($property->coefficient)
                : (floatval($property->area_sqm ?: 70) / $totalArea);

            $base = round($totalExpenses * $coefficient, 2);
            $reserve = round(($totalExpenses * 0.05) * $coefficient, 2);

            if ($status === 'closed') {
                $isMoroso = in_array($property->id, $morosos, true);
                $fields = [
                    'previous_balance' => 0.00,
                    'interest_amount' => 0.00,
                    'total_amount' => round($base + $reserve, 2),
                    'status' => $isMoroso ? 'pending' : 'paid',
                    'paid_at' => $isMoroso ? null : now()->subDays(5),
                ];
            } else {
                $previousReceipt = CommonExpenseReceipt::where('condominium_id', $condo->id)
                    ->where('property_id', $property->id)
                    ->where('status', 'pending')
                    ->whereHas('period', fn ($q) => $q->where('period', '2026-07'))
                    ->first();

                $previousBalance = $previousReceipt ? floatval($previousReceipt->total_amount) : 0.00;
                $interest = $previousBalance > 0 ? round($previousBalance * $moraRate, 2) : 0.00;

                $fields = [
                    'previous_balance' => $previousBalance,
                    'interest_amount' => $interest,
                    'total_amount' => round($base + $reserve + $previousBalance + $interest, 2),
                    'status' => 'pending',
                    'paid_at' => null,
                ];
            }

            CommonExpenseReceipt::updateOrCreate(
                ['period_id' => $periodRecord->id, 'property_id' => $property->id],
                [
                    'condominium_id' => $condo->id,
                    'alicuota_pct' => $coefficient,
                    'base_amount' => $base,
                    'reserve_fund_amount' => $reserve,
                    'individual_consumption' => 0.00,
                    'due_date' => date('Y-m-25', strtotime($period . '-01')),
                ] + $fields
            );
        }
    }
}