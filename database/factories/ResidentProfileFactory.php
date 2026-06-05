<?php

namespace Database\Factories;

use App\Models\ResidentProfile;
use App\Models\User;
use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;

class ResidentProfileFactory extends Factory
{
    protected $model = ResidentProfile::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'property_id' => Property::factory(),
            'resident_type' => fake()->randomElement(['owner', 'tenant', 'family']),
            'relationship' => fake()->randomElement(['titular', 'conyuge', 'hijo', 'otro']),
            'lease_start' => fake()->date(),
            'lease_end' => fake()->date(),
        ];
    }
}
