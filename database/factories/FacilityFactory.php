<?php

namespace Database\Factories;

use App\Models\Condominium;
use App\Models\Facility;
use Illuminate\Database\Eloquent\Factories\Factory;

class FacilityFactory extends Factory
{
    protected $model = Facility::class;

    public function definition(): array
    {
        return [
            'condominium_id' => Condominium::factory(),
            'name' => fake()->randomElement(['Quincho', 'Salón de Eventos', 'Piscina', 'Gimnasio', 'Cancha de Fútbol', 'Cancha de Tenis', 'Sala de Estar', 'Área de Parillas']),
            'type' => fake()->randomElement(['quincho', 'salon_eventos', 'cancha', 'piscina', 'gimnasio', 'otro']),
            'capacity' => fake()->randomElement([10, 20, 30, 50, 100]),
            'fee' => fake()->randomElement([0, 5000, 10000, 15000, 20000]),
        ];
    }
}
