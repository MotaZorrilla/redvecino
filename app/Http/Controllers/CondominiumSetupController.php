<?php

namespace App\Http\Controllers;

use App\Models\Condominium;
use App\Models\CondoTower;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CondominiumSetupController extends Controller
{
    /**
     * Set up the initial structural layout for a condominium (towers, floors, units).
     */
    public function setup(Request $request)
    {
        $data = $request->validate([
            'condominium_id' => 'required|exists:condominiums,id',
            'type' => 'required|string|in:tower,horizontal',
            'towers' => 'required|array',
            'towers.*.name' => 'required|string',
            'towers.*.floors' => 'required|integer|min:1',
            'towers.*.units_per_floor' => 'required|integer|min:1',
            'towers.*.has_water_meter' => 'boolean',
            'towers.*.has_electricity_meter' => 'boolean',
        ]);

        $condominium = Condominium::findOrFail($data['condominium_id']);

        DB::beginTransaction();
        try {
            foreach ($data['towers'] as $towerData) {
                $tower = CondoTower::create([
                    'condominium_id' => $condominium->id,
                    'name' => $towerData['name'],
                    'has_water_meter' => $towerData['has_water_meter'] ?? false,
                    'has_electricity_meter' => $towerData['has_electricity_meter'] ?? false,
                ]);

                $floors = $towerData['floors'];
                $unitsPerFloor = $towerData['units_per_floor'];

                for ($floor = 1; $floor <= $floors; $floor++) {
                    for ($unit = 1; $unit <= $unitsPerFloor; $unit++) {
                        $unitNumber = sprintf("%d%02d", $floor, $unit);
                        Property::create([
                            'condominium_id' => $condominium->id,
                            'tower_id' => $tower->id,
                            'type' => 'apartment',
                            'number' => $unitNumber,
                            'floor' => $floor,
                            'area_sqm' => 70, // Default area, can be edited later
                            'status' => 'vacant'
                        ]);
                    }
                }
            }
            
            DB::commit();
            return response()->json(['message' => 'Structure generated successfully.'], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error generating structure: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Copy structure from one tower to another (or create a new tower with the same layout).
     */
    public function copyTowerStructure(Request $request)
    {
        $data = $request->validate([
            'condominium_id' => 'required|exists:condominiums,id',
            'source_tower_id' => 'required|exists:condo_towers,id',
            'new_tower_name' => 'required|string',
        ]);

        $sourceTower = CondoTower::with('properties')->findOrFail($data['source_tower_id']);
        
        DB::beginTransaction();
        try {
            $newTower = CondoTower::create([
                'condominium_id' => $data['condominium_id'],
                'name' => $data['new_tower_name'],
                'has_water_meter' => $sourceTower->has_water_meter,
                'has_electricity_meter' => $sourceTower->has_electricity_meter,
            ]);

            foreach ($sourceTower->properties as $prop) {
                Property::create([
                    'condominium_id' => $data['condominium_id'],
                    'tower_id' => $newTower->id,
                    'type' => $prop->type,
                    'number' => $prop->number,
                    'block' => $prop->block,
                    'floor' => $prop->floor,
                    'area_sqm' => $prop->area_sqm,
                    'status' => 'vacant',
                ]);
            }

            DB::commit();
            return response()->json(['message' => 'Tower structure copied successfully.', 'tower' => $newTower], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Error copying tower: ' . $e->getMessage()], 500);
        }
    }
}
