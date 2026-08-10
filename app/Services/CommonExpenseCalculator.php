<?php

namespace App\Services;

use App\Models\Condominium;
use App\Models\Property;
use App\Models\CondoExpense;
use App\Models\CondoIncome;

final class CommonExpenseCalculator
{
    public function calculateForUnit(Property $property, string $period, float $previousDebt = 0.0, int $daysOverdue = 0, float $reserveFundPct = 5.0): array
    {
        $condoId = $property->condominium_id;

        $totalUnits = Property::where('condominium_id', $condoId)->count() ?: 1;
        $prorrateoCoeff = $this->getApportionmentCoefficient($property);

        // 1. Prorrateado por Coeficiente
        [$egresosProrrateados, $ingresosProrrateados, $baseProrrateable] = $this->getNetCategoryAmount($condoId, $period, 'prorated');
        $montoProrrateado = round($baseProrrateable * $prorrateoCoeff);

        // 2. Distribuido Igualitariamente
        [$egresosIgualitarios, $ingresosIgualitarios, $baseIgualitaria] = $this->getNetCategoryAmount($condoId, $period, 'equal');
        $montoIgualitario = round($baseIgualitaria / $totalUnits);

        $subtotalGastosComunes = $montoProrrateado + $montoIgualitario;

        // Fondo Reserva configurable por parámetro / config (fallback 5%)
        $fondoReservaRate = $reserveFundPct / 100.0;
        $fondoReserva = round($subtotalGastosComunes * $fondoReservaRate);

        $totalGastosComunesPeriodo = $subtotalGastosComunes + $fondoReserva;

        // 3. Específico de Torre
        $montoGastoTorre = 0.0;
        if ($property->tower_id) {
            [, , $baseTorre] = $this->getNetCategoryAmount($condoId, $period, 'tower_specific', 'tower_id', $property->tower_id);
            $unitsInTower = Property::where('condominium_id', $condoId)->where('tower_id', $property->tower_id)->count();
            if ($unitsInTower > 0) {
                $montoGastoTorre = round($baseTorre / $unitsInTower);
            }
        }

        // 4. Específico de Unidad
        [, , $montoIndividual] = $this->getNetCategoryAmount($condoId, $period, 'unit_specific', 'property_id', $property->id);

        // 5. Interés de Mora
        $montoInteresMora = 0.0;
        if ($previousDebt > 0 && $daysOverdue > $this->moraDaysOverdueThreshold($condoId)) {
            $montoInteresMora = round($previousDebt * $this->moraRate($condoId));
        }

        $totalCargosPosteriores = $montoGastoTorre + $montoIndividual + $previousDebt + $montoInteresMora;
        $totalAPagar = $totalGastosComunesPeriodo + $totalCargosPosteriores;

        return [
            'prorrateado' => $montoProrrateado,
            'igualitario' => $montoIgualitario,
            'subtotal_gastos_comunes' => $subtotalGastosComunes,
            'fondo_reserva' => $fondoReserva,
            'total_gastos_comunes_periodo' => $totalGastosComunesPeriodo,
            'gastos_torre' => $montoGastoTorre,
            'multas_individuales' => $montoIndividual,
            'deuda_anterior' => $previousDebt,
            'interes_mora' => $montoInteresMora,
            'total_cargos_posteriores' => $totalCargosPosteriores,
            'total_a_pagar' => $totalAPagar,
            'detalles' => [
                'coeficiente_prorrateo' => $prorrateoCoeff,
                'total_egresos_prorrateados' => $egresosProrrateados,
                'total_ingresos_prorrateados' => $ingresosProrrateados,
                'total_egresos_igualitarios' => $egresosIgualitarios,
                'total_ingresos_igualitarios' => $ingresosIgualitarios,
            ]
        ];
    }

    private function getNetCategoryAmount(int $condoId, string $period, string $method, ?string $extraColumn = null, $extraValue = null): array
    {
        $expQuery = CondoExpense::where('condominium_id', $condoId)
            ->where('date', 'like', "$period%")
            ->where('distributable_method', $method);

        $incQuery = CondoIncome::where('condominium_id', $condoId)
            ->where('date', 'like', "$period%")
            ->where('distributable_method', $method);

        if ($extraColumn && $extraValue) {
            $expQuery->where($extraColumn, $extraValue);
            $incQuery->where($extraColumn, $extraValue);
        }

        $egresos = $expQuery->sum('amount');
        $ingresos = $incQuery->sum('amount');
        $neto = max(0, $egresos - $ingresos);

        return [(float)$egresos, (float)$ingresos, (float)$neto];
    }

    private function moraRate(int $condoId): float
    {
        $rate = Condominium::where('id', $condoId)->value('late_interest_rate');
        if ($rate !== null) {
            // stored as percentage (2.00 = 2%); convertir a fracción.
            return (float) $rate / 100.0;
        }
        return 0.015; // legado 1.5%
    }

    private function moraDaysOverdueThreshold(int $condoId): int
    {
        $dueDay = Condominium::where('id', $condoId)->value('due_day');
        return $dueDay !== null ? (int) $dueDay : 10;
    }

    private function getApportionmentCoefficient(Property $property): float
    {
        return \App\Services\UnitCoefficientResolver::resolve($property);
    }
}
