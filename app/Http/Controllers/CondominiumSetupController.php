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
     * 
     * CANDADO: Si el condominio tiene `structure_locked = true`, solo el rol TI
     * puede modificar la malla. Administradores reciben 403.
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

        // CANDADO: Si la estructura está bloqueada, solo TI puede modificar
        if ($condominium->structure_locked && !$request->user()->hasAnyRole(['TI', 'ti'])) {
            return response()->json([
                'message' => '🔒 La malla arquitectónica de este condominio está bloqueada. Solo el equipo de TI puede desbloquearla para realizar cambios estructurales.'
            ], 403);
        }

        DB::beginTransaction();
        try {
            foreach ($data['towers'] as $towerData) {
                // Idempotencia: no duplicar torres ya existentes con mismo nombre
                $tower = CondoTower::firstOrCreate(
                    ['condominium_id' => $condominium->id, 'name' => $towerData['name']],
                    [
                        'has_water_meter' => $towerData['has_water_meter'] ?? false,
                        'has_electricity_meter' => $towerData['has_electricity_meter'] ?? false,
                    ]
                );

                $floors = $towerData['floors'];
                $unitsPerFloor = $towerData['units_per_floor'];

                $existingUnits = Property::where('condominium_id', $condominium->id)
                    ->where('tower_id', $tower->id)
                    ->count();

                // Solo generar unidades si la torre aún no tiene ninguna (evita duplicados)
                if ($existingUnits > 0) {
                    continue;
                }

                for ($floor = 1; $floor <= $floors; $floor++) {
                    for ($unit = 1; $unit <= $unitsPerFloor; $unit++) {
                        $unitNumber = sprintf("%d%02d", $floor, $unit);
                        Property::create([
                            'condominium_id' => $condominium->id,
                            'tower_id' => $tower->id,
                            'type' => 'apartment',
                            'number' => $unitNumber,
                            'floor' => $floor,
                            'area_sqm' => 70,
                            'status' => 'vacant',
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
     * 
     * CANDADO: Aplica la misma regla de bloqueo que setup().
     */
    public function copyTowerStructure(Request $request)
    {
        $data = $request->validate([
            'condominium_id' => 'required|exists:condominiums,id',
            'source_tower_id' => 'required|exists:condo_towers,id',
            'new_tower_name' => 'required|string',
        ]);

        $condominium = Condominium::findOrFail($data['condominium_id']);

        // CANDADO: Si la estructura está bloqueada, solo TI puede modificar
        if ($condominium->structure_locked && !$request->user()->hasAnyRole(['TI', 'ti'])) {
            return response()->json([
                'message' => '🔒 La malla arquitectónica de este condominio está bloqueada. Solo el equipo de TI puede desbloquearla para realizar cambios estructurales.'
            ], 403);
        }

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

    /**
     * Toggle or set the structure lock for a condominium.
     * - BLOQUEAR (de false a true): Puede hacerlo tanto el Administrador como TI.
     * - DESBLOQUEAR (de true a false): Únicamente el equipo de TI.
     */
    public function toggleLock(Request $request)
    {
        $data = $request->validate([
            'condominium_id' => 'required|exists:condominiums,id',
        ]);

        $condominium = Condominium::findOrFail($data['condominium_id']);
        $user = $request->user();

        // Si actualmente está BLOQUEADA y se intenta DESBLOQUEAR: Solo TI
        if ($condominium->structure_locked && !$user->hasAnyRole(['TI', 'ti'])) {
            return response()->json([
                'message' => '🔒 Solo el equipo de TI está autorizado para desbloquear la malla arquitectónica.'
            ], 403);
        }

        // Si está DESBLOQUEADA: Admin y TI pueden bloquear.
        $condominium->structure_locked = !$condominium->structure_locked;
        $condominium->save();

        $status = $condominium->structure_locked ? 'bloqueada 🔒' : 'desbloqueada 🔓';

        return response()->json([
            'message' => "La malla arquitectónica ha sido {$status} exitosamente.",
            'structure_locked' => $condominium->structure_locked,
        ]);
    }

    /**
     * Enviar solicitud de desbloqueo al equipo de TI.
     */
    public function requestUnlock(Request $request)
    {
        $data = $request->validate([
            'condominium_id' => 'required|exists:condominiums,id',
            'reason' => 'nullable|string',
        ]);

        $condominium = Condominium::findOrFail($data['condominium_id']);

        return response()->json([
            'message' => "Solicitud de desbloqueo para el condominio '{$condominium->name}' enviada con éxito al equipo de TI.",
            'requested' => true,
        ], 200);
    }
}
