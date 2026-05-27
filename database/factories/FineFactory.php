<?php

namespace Database\Factories;

use App\Models\Fine;
use App\Models\User;
use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;

class FineFactory extends Factory
{
    protected $model = Fine::class;

    public function definition(): array
    {
        $reasons = [
            'Ruidos molestos emitidos en horario de silencio establecido (fiesta después de las 02:00 AM).',
            'Estacionamiento de vehículo en zona no autorizada (espacio de visitas ocupado permanentemente).',
            'Tránsito de mascota sin correa y sin supervisión en pasillos principales del edificio.',
            'Disposición inapropiada de basura fuera de los ductos de basura correspondientes.',
            'Daño menor causado en áreas comunes (paredes del ascensor rayadas durante mudanza sin protección).',
            'Uso no autorizado de la piscina fuera del horario establecido.'
        ];

        $issued = fake()->dateTimeBetween('-2 months', 'now');
        $due = clone $issued;
        $due->modify('+15 days');

        return [
            'user_id' => User::factory(),
            'property_id' => Property::factory(),
            'reason' => fake()->randomElement($reasons),
            'amount' => fake()->randomFloat(2, 25000, 100000),
            'issued_date' => $issued->format('Y-m-d'),
            'due_date' => $due->format('Y-m-d'),
            'status' => fake()->randomElement(['pending', 'paid', 'appealed']),
        ];
    }
}
