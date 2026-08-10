<?php

namespace Database\Seeders;

use App\Models\Afp;
use App\Models\Condominium;
use App\Models\CondoTower;
use Illuminate\Database\Seeder;

class CondominiumSeeder extends Seeder
{
    public function run(): void
    {
        // 1. AFPs
        Afp::firstOrCreate(['name' => 'Habitat'], ['commission_rate' => 10.00]);
        Afp::firstOrCreate(['name' => 'Capital'], ['commission_rate' => 11.44]);
        Afp::firstOrCreate(['name' => 'Modelo'], ['commission_rate' => 10.58]);
        Afp::firstOrCreate(['name' => 'Cuprum'], ['commission_rate' => 11.44]);
        Afp::firstOrCreate(['name' => 'Provida'], ['commission_rate' => 11.45]);

        // 2. 6 Condominiums (1 Main + 5 Secondary)
        $condosData = [
            [
                'name' => 'Condominio Altos del Valle',
                'address' => 'Av. Libertador Bernardo O\'Higgins 1420',
                'city' => 'Santiago Centro',
                'region' => 'Metropolitana',
                'postal_code' => '8320000',
                'units_count' => 60,
                'status' => 'active',
                'towers' => ['Torre A (Norte)', 'Torre B (Sur)', 'Torre C (Poniente)'],
            ],
            [
                'name' => 'Condominio Parque del Inca',
                'address' => 'Av. Apoquindo 4500',
                'city' => 'Las Condes',
                'region' => 'Metropolitana',
                'postal_code' => '7550000',
                'units_count' => 45,
                'status' => 'active',
                'towers' => ['Torre Cordillera', 'Torre Valle'],
            ],
            [
                'name' => 'Condominio Providencia Plaza',
                'address' => 'Av. Providencia 1230',
                'city' => 'Providencia',
                'region' => 'Metropolitana',
                'postal_code' => '7500000',
                'units_count' => 45,
                'status' => 'active',
                'towers' => ['Torre Orión', 'Torre Sirio'],
            ],
            [
                'name' => 'Condominio Bosques de la Dehesa',
                'address' => 'Av. El Rodeo 12800',
                'city' => 'Lo Barnechea',
                'region' => 'Metropolitana',
                'postal_code' => '7690000',
                'units_count' => 30,
                'status' => 'active',
                'towers' => ['Torre Robles', 'Torre Araucarias'],
            ],
            [
                'name' => 'Condominio Marina Poniente',
                'address' => 'Av. Borgoño 15300',
                'city' => 'Viña del Mar',
                'region' => 'Valparaíso',
                'postal_code' => '2520000',
                'units_count' => 30,
                'status' => 'active',
                'towers' => ['Torre Pacífico', 'Torre Brisa'],
            ],
            [
                'name' => 'Condominio Portal del Sur',
                'address' => 'Av. Alemania 0890',
                'city' => 'Temuco',
                'region' => 'Araucanía',
                'postal_code' => '4780000',
                'units_count' => 30,
                'status' => 'active',
                'towers' => ['Torre Volcán', 'Torre Llaima'],
            ],
        ];

        foreach ($condosData as $data) {
            $towers = $data['towers'];
            unset($data['towers']);

            $condo = Condominium::firstOrCreate(
                ['name' => $data['name']],
                $data
            );

            foreach ($towers as $towerName) {
                CondoTower::firstOrCreate(
                    [
                        'condominium_id' => $condo->id,
                        'name' => $towerName,
                    ],
                    [
                        'has_water_meter' => true,
                        'has_electricity_meter' => true,
                    ]
                );
            }
        }

        $this->command?->info('CondominiumSeeder: 6 Condominiums and their Towers seeded successfully.');
    }
}
