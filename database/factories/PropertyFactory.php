<?php

namespace Database\Factories;

use App\Models\Property;
use App\Models\Condominium;
use Illuminate\Database\Eloquent\Factories\Factory;

class PropertyFactory extends Factory
{
    protected $model = Property::class;

    public function definition(): array
    {
        $types = ['apartment', 'house', 'parking', 'storage', 'commercial'];
        $type = fake()->randomElement($types);
        
        $floor = $type === 'apartment' ? fake()->numberBetween(1, 15) : null;
        $area = match ($type) {
            'apartment' => fake()->randomFloat(2, 45, 120),
            'house' => fake()->randomFloat(2, 80, 220),
            'parking' => 12.50,
            'storage' => fake()->randomFloat(2, 4, 10),
            'commercial' => fake()->randomFloat(2, 50, 300),
        };

        return [
            'condominium_id' => Condominium::factory(),
            'type' => $type,
            'number' => (string) fake()->unique()->numberBetween(101, 999),
            'block' => fake()->randomElement(['Torre A', 'Torre B', 'Sector Norte', 'Sector Sur']),
            'floor' => $floor,
            'area_sqm' => $area,
            'status' => fake()->randomElement(['occupied', 'vacant', 'maintenance']),
        ];
    }
}
