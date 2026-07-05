<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        $rutBase = fake()->numberBetween(10, 25) . '.' . fake()->numberBetween(100, 999) . '.' . fake()->numberBetween(100, 999);
        $dv = fake()->randomElement(['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'K']);

        return [
            'name' => fake()->name(),
            'rut' => $rutBase . '-' . $dv,
            'email' => fake()->unique()->safeEmail(),
            'phone' => '+569' . fake()->numberBetween(60000000, 99999999),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'status' => fake()->randomElement(['active', 'active', 'active', 'inactive']),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
