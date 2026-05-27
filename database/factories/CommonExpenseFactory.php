<?php

namespace Database\Factories;

use App\Models\CommonExpense;
use App\Models\Condominium;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommonExpenseFactory extends Factory
{
    protected $model = CommonExpense::class;

    public function definition(): array
    {
        $amount = fake()->randomFloat(2, 800000, 3500000);
        $periods = ['2026-03', '2026-04', '2026-05'];
        $period = fake()->randomElement($periods);
        
        $due_date = match ($period) {
            '2026-03' => '2026-04-05',
            '2026-04' => '2026-05-05',
            '2026-05' => '2026-06-05',
            default => '2026-06-05',
        };

        return [
            'condominium_id' => Condominium::factory(),
            'period' => $period,
            'amount' => $amount,
            'description' => 'Gasto Común General correspondiente al periodo ' . $period . '. Incluye seguridad, mantención de áreas comunes, agua de riego y administración.',
            'due_date' => $due_date,
            'status' => 'pending',
        ];
    }
}
