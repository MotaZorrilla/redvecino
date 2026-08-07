<?php

namespace Database\Seeders;

use App\Models\Facility;
use Illuminate\Database\Seeder;

class FacilitiesSeeder extends Seeder
{
    public function run(): void
    {
        $facilitiesData = [
            ['name' => 'Quincho', 'type' => 'BBQ', 'capacity' => 20, 'fee' => 15000],
            ['name' => 'Piscina', 'type' => 'Pool', 'capacity' => 15, 'fee' => 0],
            ['name' => 'Gimnasio', 'type' => 'Gym', 'capacity' => 10, 'fee' => 0],
            ['name' => 'Sala de Eventos', 'type' => 'Hall', 'capacity' => 50, 'fee' => 30000],
        ];

        $condominios = \App\Models\Condominium::all();
        foreach ($condominios as $condo) {
            foreach ($facilitiesData as $facility) {
                Facility::create(array_merge($facility, ['condominium_id' => $condo->id]));
            }
        }

        $this->command?->info('Facilities seeded for ' . $condominios->count() . ' condominiums.');
    }
}