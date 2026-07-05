<?php

namespace Database\Factories;

use App\Models\EmployeeProfile;
use App\Models\User;
use App\Models\Afp;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmployeeProfileFactory extends Factory
{
    protected $model = EmployeeProfile::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'position' => fake()->randomElement(['Conserje', 'Auxiliar de Aseo', 'Jardinero', 'Administrador de Edificio', 'Técnico en Mantención']),
            'supervisor_id' => null,
            'contract_type' => fake()->randomElement(['indefinido', 'plazo_fijo', 'honorarios']),
            'shift' => fake()->randomElement(['manana-tarde', 'tarde-noche', 'noche-manana']),
            'salary' => fake()->randomFloat(2, 400000, 1500000),
            'hire_date' => fake()->date(),
            'afp_id' => Afp::inRandomOrder()->first()?->id ?? Afp::factory(),
            'bank_name' => fake()->randomElement(['Banco Estado', 'Banco de Chile', 'Santander', 'BCI', 'Banco Falabella']),
            'account_type' => fake()->randomElement(['corriente', 'vista', 'rut']),
            'account_number' => fake()->numberBetween(10000000, 99999999),
            'payment_method' => fake()->randomElement(['transferencia', 'cheque', 'efectivo']),
        ];
    }
}
