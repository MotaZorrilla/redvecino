<?php

namespace App\Services;

use App\Models\EmployeeProfile;
use App\Models\Afp;

class PayrollCalculator
{
    /**
     * Calculates the detailed payroll/liquidation components for an employee.
     *
     * @param EmployeeProfile $employee
     * @param array $overrides (allows custom values for allowances and deductions)
     * @return array
     */
    public function calculate(EmployeeProfile $employee, array $overrides = []): array
    {
        // 1. Base Imponible inputs
        $sueldoBase = floatval($employee->salary ?? 0.0);
        $asignacionResponsabilidad = floatval($overrides['asignacion_responsabilidad'] ?? 0.0);
        $horasExtras = floatval($overrides['horas_extras'] ?? 0.0);
        
        $totalImponibles = round($sueldoBase + $asignacionResponsabilidad + $horasExtras);

        // 2. Non-imponible inputs
        $asignacionColacion = floatval($overrides['asignacion_colacion'] ?? 0.0);
        $asignacionMovilizacion = floatval($overrides['asignacion_movilizacion'] ?? 0.0);
        $asignacionVestuario = floatval($overrides['asignacion_vestuario'] ?? 0.0);
        
        $totalNoImponibles = round($asignacionColacion + $asignacionMovilizacion + $asignacionVestuario);

        // 3. Previsional Deductions
        $saludFonasa = round($totalImponibles * 0.07); // 7.00% Fonasa

        // Get AFP rate
        $afp = $employee->afp;
        $afpRate = $afp ? floatval($afp->commission_rate) : 10.00;
        $afpMonto = round($totalImponibles * ($afpRate / 100.0));

        // Seguro de Cesantía (AFC): 0.60% for employee in indefinite contract
        $seguroCesantia = 0.0;
        if (strtolower($employee->contract_type) === 'indefinido') {
            $seguroCesantia = round($totalImponibles * 0.006);
        }

        $totalPrevisionales = round($saludFonasa + $afpMonto + $seguroCesantia);

        // 4. Other Deductions
        $anticipo = floatval($overrides['anticipo'] ?? 0.0);
        $prestamo = floatval($overrides['prestamo'] ?? 0.0);
        $multasAtrasos = floatval($overrides['multas_atrasos'] ?? 0.0);

        $totalOtrosDescuentos = round($anticipo + $prestamo + $multasAtrasos);

        // 5. Sueldo Líquido
        $sueldoLiquido = round(($totalImponibles + $totalNoImponibles) - ($totalPrevisionales + $totalOtrosDescuentos));

        return [
            'sueldo_base' => $sueldoBase,
            'asignacion_responsabilidad' => $asignacionResponsabilidad,
            'horas_extras' => $horasExtras,
            'total_imponibles' => $totalImponibles,
            'asignacion_colacion' => $asignacionColacion,
            'asignacion_movilizacion' => $asignacionMovilizacion,
            'asignacion_vestuario' => $asignacionVestuario,
            'total_no_imponibles' => $totalNoImponibles,
            'salud_fonasa' => $saludFonasa,
            'afp_id' => $employee->afp_id,
            'afp_monto' => $afpMonto,
            'afp_rate' => $afpRate,
            'seguro_cesantia' => $seguroCesantia,
            'total_previsionales' => $totalPrevisionales,
            'anticipo' => $anticipo,
            'prestamo' => $prestamo,
            'multas_atrasos' => $multasAtrasos,
            'total_otros_descuentos' => $totalOtrosDescuentos,
            'sueldo_liquido' => $sueldoLiquido,
            'bank_name' => $employee->bank_name,
            'account_type' => $employee->account_type,
            'account_number' => $employee->account_number,
            'payment_method' => $employee->payment_method,
        ];
    }
}
