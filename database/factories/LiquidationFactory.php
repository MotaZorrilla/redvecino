<?php

namespace Database\Factories;

use App\Models\EmployeeProfile;
use App\Models\Liquidation;
use Illuminate\Database\Eloquent\Factories\Factory;

class LiquidationFactory extends Factory
{
    protected $model = Liquidation::class;

    public function definition(): array
    {
        $base = fake()->randomFloat(0, 400000, 1200000);

        return [
            'employee_profile_id' => EmployeeProfile::factory(),
            'period' => fake()->randomElement(['Enero 2026', 'Febrero 2026', 'Marzo 2026', 'Abril 2026']),
            'sueldo_base' => $base,
            'total_imponibles' => $base,
            'total_no_imponibles' => 0,
            'salud_fonasa' => $base * 0.07,
            'afp_monto' => $base * 0.1144,
            'afp_rate' => 11.44,
            'seguro_cesantia' => $base * 0.006,
            'total_previsionales' => $base * 0.2,
            'total_otros_descuentos' => 0,
            'sueldo_liquido' => $base * fake()->randomFloat(2, 0.72, 0.82),
        ];
    }
}
