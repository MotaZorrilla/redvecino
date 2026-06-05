<?php

namespace Database\Factories;

use App\Models\EmployeeProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmployeeProfileFactory extends Factory
{
    protected $model = EmployeeProfile::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'position' => fake()->jobTitle(),
            'supervisor_id' => null,
            'contract_type' => fake()->randomElement(['full_time', 'part_time', 'temporary']),
            'shift' => fake()->randomElement(['morning', 'afternoon', 'night']),
            'salary' => fake()->randomFloat(2, 400000, 1500000),
            'hire_date' => fake()->date(),
        ];
    }
}
