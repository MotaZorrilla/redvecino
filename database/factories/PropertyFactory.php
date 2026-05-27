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
        $types = ['departamento', 'casa', 'estacionamiento', 'bodega'];
        $type = fake()->randomElement($types);
        
        $floor = $type === 'departamento' ? fake()->numberBetween(1, 15) : null;
        $area = match ($type) {
            'departamento' => fake()->randomFloat(2, 45, 120),
            'casa' => fake()->randomFloat(2, 80, 220),
            'estacionamiento' => 12.50,
            'bodega' => fake()->randomFloat(2, 4, 10),
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
