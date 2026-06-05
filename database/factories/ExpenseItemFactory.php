<?php

namespace Database\Factories;

use App\Models\CommonExpense;
use App\Models\ExpenseItem;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExpenseItemFactory extends Factory
{
    protected $model = ExpenseItem::class;

    public function definition(): array
    {
        return [
            'common_expense_id' => CommonExpense::factory(),
            'category' => fake()->randomElement(['personal', 'mantencion', 'servicios_basicos', 'seguridad', 'administracion', 'otro']),
            'description' => fake()->sentence(),
            'amount' => fake()->randomFloat(2, 10000, 500000),
        ];
    }
}
