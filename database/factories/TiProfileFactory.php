<?php

namespace Database\Factories;

use App\Models\TiProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TiProfileFactory extends Factory
{
    protected $model = TiProfile::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'access_level' => fake()->randomElement(['full', 'limited']),
            'system_logs_permission' => fake()->boolean(),
        ];
    }
}
