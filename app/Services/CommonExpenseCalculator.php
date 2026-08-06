<?php

namespace App\Services;

use App\Models\Condominium;
use App\Models\Property;
use App\Models\CondoExpense;
use App\Models\CondoIncome;

final class CommonExpenseCalculator
{
    public function calculateForUnit(Property $property, string $period, float $previousDebt = 0.0, int $daysOverdue = 0): array
    {
        $condoId = $property->condominium_id;

        $totalUnits = Property::where('condominium_id', $condoId)->count();
        if ($totalUnits === 0) {
            $totalUnits = 1;
        }

        $prorrateoCoeff = $this->getApportionmentCoefficient($property);

        $egresosProrrateados = CondoExpense::where('condominium_id', $condoId)
            ->where('date', 'like', "$period%")
            ->where('distributable_method', 'prorated')
            ->sum('amount');

        $ingresosProrrateados = CondoIncome::where('condominium_id', $condoId)
            ->where('date', 'like', "$period%")
            ->where('distributable_method', 'prorated')
            ->sum('amount');

        $baseProrrateable = max(0, $egresosProrrateados - $ingresosProrrateados);
        $montoProrrateado = round($baseProrrateable * $prorrateoCoeff);

        $egresosIgualitarios = CondoExpense::where('condominium_id', $condoId)
            ->where('date', 'like', "$period%")
            ->where('distributable_method', 'equal')
            ->sum('amount');

        $ingresosIgualitarios = CondoIncome::where('condominium_id', $condoId)
            ->where('date', 'like', "$period%")
            ->where('distributable_method', 'equal')
            ->sum('amount');

        $baseIgualitaria = max(0, $egresosIgualitarios - $ingresosIgualitarios);
        $montoIgualitario = round($baseIgualitaria / $totalUnits);

        $subtotalGastosComunes = $montoProrrateado + $montoIgualitario;

        $fondoReserva = round($subtotalGastosComunes * 0.05);

        $totalGastosComunesPeriodo = $subtotalGastosComunes + $fondoReserva;

        $montoGastoTorre = 0.0;
        if ($property->tower_id) {
            $egresosTorre = CondoExpense::where('condominium_id', $condoId)
                ->where('date', 'like', "$period%")
                ->where('distributable_method', 'tower_specific')
                ->where('tower_id', $property->tower_id)
                ->sum('amount');

            $ingresosTorre = CondoIncome::where('condominium_id', $condoId)
                ->where('date', 'like', "$period%")
                ->where('distributable_method', 'tower_specific')
                ->where('tower_id', $property->tower_id)
                ->sum('amount');

            $baseTorre = max(0, $egresosTorre - $ingresosTorre);
            $unitsInTower = Property::where('condominium_id', $condoId)
                ->where('tower_id', $property->tower_id)
                ->count();
            if ($unitsInTower > 0) {
                $montoGastoTorre = round($baseTorre / $unitsInTower);
            }
        }

        $egresosIndividuales = CondoExpense::where('condominium_id', $condoId)
            ->where('date', 'like', "$period%")
            ->where('distributable_method', 'unit_specific')
            ->where('property_id', $property->id)
            ->sum('amount');

        $ingresosIndividuales = CondoIncome::where('condominium_id', $condoId)
            ->where('date', 'like', "$period%")
            ->where('distributable_method', 'unit_specific')
            ->where('property_id', $property->id)
            ->sum('amount');

        $montoIndividual = max(0, $egresosIndividuales - $ingresosIndividuales);

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
        if ($property->coefficient !== null) {
            return $property->coefficient;
        }

        $ownerProfile = $property->owners()->first();
        if ($ownerProfile && $ownerProfile->ownership_percentage > 0) {
            return $ownerProfile->ownership_percentage / 100.0;
        }

        $totalArea = Property::where('condominium_id', $property->condominium_id)->sum('area_sqm');
        if ($totalArea > 0 && $property->area_sqm > 0) {
            return floatval($property->area_sqm) / floatval($totalArea);
        }

        return 0.0100;
    }
}
