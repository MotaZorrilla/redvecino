<?php

namespace Database\Factories;

use App\Models\CondoIncome;
use App\Models\Condominium;
use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CondoIncomeFactory extends Factory
{
    protected $model = CondoIncome::class;

    public function definition(): array
    {
        return [
            'condominium_id' => Condominium::factory(),
            'category' => fake()->randomElement(['multas', 'gastos_comunes', 'arriendo_espacios', 'intereses_mora', 'cuotas_extraordinarias', 'publicidad_convenio', 'otro']),
            'subcategory' => fake()->optional()->word(),
            'amount' => fake()->randomFloat(2, 10000, 2000000),
            'date' => fake()->date(),
            'description' => fake()->sentence(),
            'property_id' => null,
            'user_id' => null,
        ];
    }
}
