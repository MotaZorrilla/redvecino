<?php

namespace Database\Factories;

use App\Models\Condominium;
use Illuminate\Database\Eloquent\Factories\Factory;

class CondominiumFactory extends Factory
{
    protected $model = Condominium::class;

    public function definition(): array
    {
        $condos = [
            [
                'name' => 'Condominio Alameda Loft',
                'address' => 'Av. Libertador Bernardo O\'Higgins 1420',
                'city' => 'Santiago Centro',
                'region' => 'Metropolitana',
                'postal_code' => '8320000',
            ],
            [
                'name' => 'Condominio Parque del Inca',
                'address' => 'Av. Apoquindo 4500',
                'city' => 'Las Condes',
                'region' => 'Metropolitana',
                'postal_code' => '7550000',
            ],
            [
                'name' => 'Condominio Providencia Plaza',
                'address' => 'Av. Providencia 1230',
                'city' => 'Providencia',
                'region' => 'Metropolitana',
                'postal_code' => '7500000',
            ],
        ];

        $condo = fake()->randomElement($condos);

        return [
            'name' => $condo['name'],
            'address' => $condo['address'] . ' ' . fake()->buildingNumber(),
            'city' => $condo['city'],
            'region' => $condo['region'],
            'postal_code' => $condo['postal_code'],
            'units_count' => fake()->randomElement([20, 30, 40, 50]),
            'status' => 'active',
        ];
    }
}
