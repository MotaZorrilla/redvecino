<?php

namespace Database\Factories;

use App\Models\Payment;
use App\Models\User;
use App\Models\Property;
use App\Models\CommonExpense;
use Illuminate\Database\Eloquent\Factories\Factory;

class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition(): array
    {
        $amount = fake()->randomFloat(2, 45000, 150000);
        $methods = ['transferencia', 'efectivo', 'tarjeta_debito', 'tarjeta_credito'];
        
        return [
            'user_id' => User::factory(),
            'property_id' => Property::factory(),
            'common_expense_id' => CommonExpense::factory(),
            'amount' => $amount,
            'payment_date' => fake()->dateTimeBetween('-3 months', 'now')->format('Y-m-d'),
            'payment_method' => fake()->randomElement($methods),
            'reference' => 'TXN-' . fake()->unique()->numberBetween(100000, 999999),
            'status' => fake()->randomElement(['pending', 'approved', 'rejected']),
        ];
    }
}
