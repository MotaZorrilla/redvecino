<?php

namespace App\Services;

use App\Models\Condominium;
use App\Models\Property;
use App\Models\CondoExpense;
use App\Models\CondoIncome;

class CommonExpenseCalculator
{
    /**
     * Calculates the common expenses details for a single unit in a condominium for a specific period.
     *
     * @param Property $property
     * @param string $period (e.g. "2026-04")
     * @param float $previousDebt
     * @param int $daysOverdue
     * @return array
     */
    public function calculateForUnit(Property $property, string $period, float $previousDebt = 0.0, int $daysOverdue = 0): array
    {
        $condoId = $property->condominium_id;

        // 1. Get total units count for equal division
        $totalUnits = Property::where('condominium_id', $condoId)->count();
        if ($totalUnits === 0) {
            $totalUnits = 1;
        }

        // 2. Coeficiente de Prorrateo (Alícuota)
        // In the database area_sqm is a percentage if we seed it or we can determine it based on type.
        // Let's check how property's alícuota is determined.
        // We'll use a mapping or fallback to area_sqm if it is a percentage, or use alícuotas from the mockup:
        // Type A: 0.80% (0.0080), Type B: 1.05% (0.0105), Type C: 1.50% (0.0150)
        // If type is not standard, fallback to: area_sqm / sum(area_sqm)
        $prorrateoCoeff = $this->getApportionmentCoefficient($property);

        // 3. Egresos & Ingresos Prorrateados
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

        // 4. Egresos & Ingresos Igualitarios
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

        // 5. Subtotal Gastos Comunes
        $subtotalGastosComunes = $montoProrrateado + $montoIgualitario;

        // 6. Fondo de Reserva (5%)
        $fondoReserva = round($subtotalGastosComunes * 0.05);

        // 7. Total Gastos Comunes del Período
        $totalGastosComunesPeriodo = $subtotalGastosComunes + $fondoReserva;

        // --- CARGOS POSTERIORES (No incluyen Fondo de Reserva) ---

        // 8. Gastos de Torre (if property has tower_id)
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
            // Distribute tower expenses among units in the same tower
            $unitsInTower = Property::where('condominium_id', $condoId)
                ->where('tower_id', $property->tower_id)
                ->count();
            if ($unitsInTower > 0) {
                $montoGastoTorre = round($baseTorre / $unitsInTower);
            }
        }

        // 9. Multas y Cargos Individuales (Unit Specific)
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

        // 10. Interés por Mora (1.5% monthly if daysOverdue > 10)
        $montoInteresMora = 0.0;
        if ($previousDebt > 0 && $daysOverdue > 10) {
            $montoInteresMora = round($previousDebt * 0.015);
        }

        // 11. Total Cargos Posteriores
        $totalCargosPosteriores = $montoGastoTorre + $montoIndividual + $previousDebt + $montoInteresMora;

        // 12. Total Final a Pagar
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

    /**
     * Resolves the apportionment coefficient for a property.
     *
     * @param Property $property
     * @return float
     */
    private function getApportionmentCoefficient(Property $property): float
    {
        // Check if there is an owner profile specifying the percentage
        $ownerProfile = $property->owners()->first();
        if ($ownerProfile && $ownerProfile->ownership_percentage > 0) {
            return $ownerProfile->ownership_percentage / 100.0;
        }

        // Falls back to type-based mapping:
        // A -> 0.80% (0.0080), B -> 1.05% (0.0105), C -> 1.50% (0.0150)
        // If type property matches the letters or names
        $typeChar = strtoupper(substr($property->number, 0, 1));
        if ($typeChar === 'A') {
            return 0.0080;
        } elseif ($typeChar === 'B') {
            return 0.0105;
        } elseif ($typeChar === 'C') {
            return 0.0150;
        }

        // If floor or number matches somehow, or fall back to area_sqm / total_area_sqm
        $totalArea = Property::where('condominium_id', $property->condominium_id)->sum('area_sqm');
        if ($totalArea > 0 && $property->area_sqm > 0) {
            return floatval($property->area_sqm) / floatval($totalArea);
        }

        return 0.0100; // Fallback to 1%
    }
}
