<?php

namespace Database\Factories;

use App\Models\TicketCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class TicketCategoryFactory extends Factory
{
    protected $model = TicketCategory::class;

    private static array $usedCategories = [];

    public function definition(): array
    {
        $categories = [
            ['name' => 'Fontanería', 'description' => 'Problemas relacionados con tuberías, llaves de paso, filtraciones de agua y baños.'],
            ['name' => 'Electricidad', 'description' => 'Cortocircuitos, ampolletas quemadas, fallas en tableros y citófonos.'],
            ['name' => 'Infraestructura', 'description' => 'Daños en muros, puertas, ventanas, portones y pisos de áreas comunes.'],
            ['name' => 'Limpieza', 'description' => 'Solicitudes de limpieza profunda, retiro de escombros o desechos especiales.'],
            ['name' => 'Seguridad', 'description' => 'Cámaras, alarmas, accesos, control de visitas y situaciones sospechosas.'],
        ];

        $available = array_filter($categories, fn($cat) => !in_array($cat['name'], self::$usedCategories));

        if (empty($available)) {
            self::$usedCategories = [];
            $available = $categories;
        }

        $selected = fake()->randomElement($available);
        self::$usedCategories[] = $selected['name'];

        return [
            'name' => $selected['name'],
            'description' => $selected['description'],
        ];
    }
}
