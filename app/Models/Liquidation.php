<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Liquidation extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_profile_id',
        'period',
        'liquidation_number',
        'sueldo_base',
        'asignacion_responsabilidad',
        'horas_extras',
        'total_imponibles',
        'asignacion_colacion',
        'asignacion_movilizacion',
        'asignacion_vestuario',
        'total_no_imponibles',
        'salud_fonasa',
        'afp_id',
        'afp_monto',
        'afp_rate',
        'seguro_cesantia',
        'total_previsionales',
        'anticipo',
        'prestamo',
        'multas_atrasos',
        'total_otros_descuentos',
        'sueldo_liquido',
        'bank_name',
        'account_type',
        'account_number',
        'payment_date',
        'payment_method',
        'observations',
    ];

    protected function casts(): array
    {
        return [
            'sueldo_base' => 'decimal:2',
            'asignacion_responsabilidad' => 'decimal:2',
            'horas_extras' => 'decimal:2',
            'total_imponibles' => 'decimal:2',
            'asignacion_colacion' => 'decimal:2',
            'asignacion_movilizacion' => 'decimal:2',
            'asignacion_vestuario' => 'decimal:2',
            'total_no_imponibles' => 'decimal:2',
            'salud_fonasa' => 'decimal:2',
            'afp_monto' => 'decimal:2',
            'afp_rate' => 'decimal:2',
            'seguro_cesantia' => 'decimal:2',
            'total_previsionales' => 'decimal:2',
            'anticipo' => 'decimal:2',
            'prestamo' => 'decimal:2',
            'multas_atrasos' => 'decimal:2',
            'total_otros_descuentos' => 'decimal:2',
            'sueldo_liquido' => 'decimal:2',
            'payment_date' => 'date',
        ];
    }

    public function employeeProfile()
    {
        return $this->belongsTo(EmployeeProfile::class);
    }

    public function afp()
    {
        return $this->belongsTo(Afp::class);
    }
}
