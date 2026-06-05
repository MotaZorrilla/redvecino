<?php

namespace Database\Factories;

use App\Models\OwnerProfile;
use App\Models\User;
use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;

class OwnerProfileFactory extends Factory
{
    protected $model = OwnerProfile::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'property_id' => Property::factory(),
            'ownership_percentage' => fake()->randomFloat(2, 1, 100),
            'financial_status' => fake()->randomElement(['al_dia', 'mora', 'moroso']),
        ];
    }
}
