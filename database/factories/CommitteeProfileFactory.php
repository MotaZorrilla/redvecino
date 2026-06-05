<?php

namespace Database\Factories;

use App\Models\CommitteeProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommitteeProfileFactory extends Factory
{
    protected $model = CommitteeProfile::class;

    public function definition(): array
    {
        $positions = ['president', 'vice_president', 'secretary', 'treasurer', 'vocal'];
        $periodStart = fake()->dateTimeBetween('-1 year', 'now');
        $periodEnd = clone $periodStart;
        $periodEnd->modify('+2 years');

        return [
            'user_id' => User::factory(),
            'position' => fake()->randomElement($positions),
            'period_start' => $periodStart->format('Y-m-d'),
            'period_end' => $periodEnd->format('Y-m-d'),
            'permission_level' => fake()->randomElement(['read', 'write', 'admin']),
        ];
    }
}
