<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Condominium;
use App\Models\CondoTower;
use App\Models\Property;

class TowerStructureSeeder extends Seeder
{
    public function run(): void
    {
        $condo = Condominium::first();
        if (!$condo) return;

        $towerA = CondoTower::firstOrCreate([
            'condominium_id' => $condo->id,
            'name' => 'Torre Alpha',
        ], [
            'has_water_meter' => true,
            'has_electricity_meter' => true,
        ]);

        $towerB = CondoTower::firstOrCreate([
            'condominium_id' => $condo->id,
            'name' => 'Torre Beta',
        ], [
            'has_water_meter' => true,
            'has_electricity_meter' => false,
        ]);

        for ($floor = 1; $floor <= 3; $floor++) {
            for ($unit = 1; $unit <= 2; $unit++) {
                $num = sprintf("%d%02d", $floor, $unit);
                Property::firstOrCreate([
                    'condominium_id' => $condo->id,
                    'tower_id' => $towerA->id,
                    'number' => 'TA-' . $num,
                ], [
                    'type' => 'apartment',
                    'floor' => $floor,
                    'area_sqm' => 75,
                    'status' => 'occupied',
                    'coefficient' => 0.0833,
                ]);

                Property::firstOrCreate([
                    'condominium_id' => $condo->id,
                    'tower_id' => $towerB->id,
                    'number' => 'TB-' . $num,
                ], [
                    'type' => 'apartment',
                    'floor' => $floor,
                    'area_sqm' => 75,
                    'status' => 'occupied',
                    'coefficient' => 0.0833,
                ]);
            }
        }
    }
}
