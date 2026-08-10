<?php

namespace App\Services;

use App\Models\Property;

final class UnitCoefficientResolver
{
    /**
     * Resuelve la alícuota o coeficiente de cobro de una propiedad/unidad.
     * Prioridad de resolución:
     * 1. Coeficiente explícito asignado a la propiedad ($property->coefficient).
     * 2. Porcentaje de copropiedad ($property->ownership_percentage).
     * 3. Área de la unidad proporcional ($property->area_sqm).
     * 4. Fallback por defecto configurable ($defaultFallback).
     *
     * @param Property|object $property
     * @param float $defaultFallback Coeficiente o porcentaje por defecto en caso de no estar definido (Default: 0.0100 -> 1%)
     * @return float
     */
    public static function resolve($property, float $defaultFallback = 0.0100): float
    {
        if (isset($property->coefficient) && !is_null($property->coefficient) && (float)$property->coefficient > 0) {
            return (float) $property->coefficient;
        }

        if (isset($property->owners) && $property->owners->first() && (float)$property->owners->first()->ownership_percentage > 0) {
            return (float) $property->owners->first()->ownership_percentage / 100.0;
        }

        if (isset($property->ownership_percentage) && !is_null($property->ownership_percentage) && (float)$property->ownership_percentage > 0) {
            $val = (float) $property->ownership_percentage;
            return $val > 1.0 ? $val / 100.0 : $val;
        }

        if (isset($property->area_sqm) && !is_null($property->area_sqm) && (float)$property->area_sqm > 0 && isset($property->condominium_id)) {
            $totalArea = Property::where('condominium_id', $property->condominium_id)->sum('area_sqm');
            if ($totalArea > 0) {
                return (float)$property->area_sqm / (float)$totalArea;
            }
            return (float) $property->area_sqm;
        }

        return $defaultFallback;
    }
}
