<?php

namespace Database\Factories;

use App\Models\CondoExpense;
use App\Models\Condominium;
use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CondoExpenseFactory extends Factory
{
    protected $model = CondoExpense::class;

    public function definition(): array
    {
        return [
            'condominium_id' => Condominium::factory(),
            'category' => fake()->randomElement(['personal', 'mantencion', 'servicios_basicos', 'seguridad', 'administracion', 'otro']),
            'subcategory' => fake()->optional()->word(),
            'amount' => fake()->randomFloat(2, 10000, 2000000),
            'date' => fake()->date(),
            'description' => fake()->sentence(),
            'property_id' => null,
            'user_id' => null,
            'common_expense_id' => null,
            'expense_item_id' => null,
        ];
    }
}
