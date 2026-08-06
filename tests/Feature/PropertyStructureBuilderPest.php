<?php

use App\Models\User;
use App\Models\Condominium;
use App\Models\CondoTower;
use App\Models\Property;
use App\Http\Controllers\CondominiumSetupController;

covers(CondominiumSetupController::class);

uses(
    Illuminate\Foundation\Testing\RefreshDatabase::class
);

beforeEach(function () {
    $this->seed();
});

describe('Property Structure Builder (Malla Arquitectónica & Alícuotas)', function () {

    test('TI o usuario con permisos puede generar la malla completa de torres con alícuotas', function () {
        $ti = User::whereHas('roles', fn($q) => $q->where('name', 'TI'))->firstOrFail();
        $this->actingAs($ti);

        $condo = Condominium::create([
            'name'        => 'Condominio Malla Visual',
            'address'     => 'Av. Arquitectura 500',
            'city'        => 'Concepción',
            'region'      => 'Biobío',
            'units_count' => 80,
            'status'      => 'active',
        ]);

        $response = $this->postJson('/api/setup-condominium', [
            'condominium_id' => $condo->id,
            'type'           => 'tower',
            'towers'         => [
                ['name' => 'Torre A', 'floors' => 10, 'units_per_floor' => 4, 'has_water_meter' => true, 'has_electricity_meter' => true],
                ['name' => 'Torre B', 'floors' => 10, 'units_per_floor' => 4, 'has_water_meter' => true, 'has_electricity_meter' => false],
            ],
        ]);

        $response->assertStatus(201);
        expect(CondoTower::where('condominium_id', $condo->id)->count())->toBe(2);
        expect(Property::where('condominium_id', $condo->id)->count())->toBe(80);
    });

    test('Malla arquitectónica valida limites de entrada nula o desbordada', function () {
        $ti = User::whereHas('roles', fn($q) => $q->where('name', 'TI'))->firstOrFail();
        $this->actingAs($ti);

        $response = $this->postJson('/api/setup-condominium', [
            'condominium_id' => 1,
            'type'           => 'tower',
            'towers'         => [
                ['name' => 'Torre Invalida', 'floors' => -5, 'units_per_floor' => 0],
            ],
        ]);

        $response->assertStatus(422);
    });

    test('Clonacion de torre preserva la distribucion de m2 y estructura de pisos', function () {
        $ti = User::whereHas('roles', fn($q) => $q->where('name', 'TI'))->firstOrFail();
        $this->actingAs($ti);

        $condo = Condominium::create([
            'name' => 'Condo Clonacion Alícuotas',
            'address' => 'Calle Central 123',
            'city' => 'Santiago',
            'region' => 'Metropolitana',
            'units_count' => 40,
            'status' => 'active'
        ]);

        $source = CondoTower::create([
            'condominium_id' => $condo->id,
            'name' => 'Torre Origen',
            'has_water_meter' => true,
            'has_electricity_meter' => true,
        ]);

        // Crear 4 unidades con distintos m² (ej. PH de 120m² y deptos de 70m²)
        Property::create(['condominium_id' => $condo->id, 'tower_id' => $source->id, 'type' => 'apartment', 'number' => '101', 'floor' => 1, 'area_sqm' => 70]);
        Property::create(['condominium_id' => $condo->id, 'tower_id' => $source->id, 'type' => 'apartment', 'number' => '102', 'floor' => 1, 'area_sqm' => 70]);
        Property::create(['condominium_id' => $condo->id, 'tower_id' => $source->id, 'type' => 'apartment', 'number' => '201', 'floor' => 2, 'area_sqm' => 70]);
        Property::create(['condominium_id' => $condo->id, 'tower_id' => $source->id, 'type' => 'penthouse', 'number' => '202', 'floor' => 2, 'area_sqm' => 120]);

        $res = $this->postJson('/api/setup-condominium/copy-tower', [
            'condominium_id' => $condo->id,
            'source_tower_id' => $source->id,
            'new_tower_name' => 'Torre Espejo',
        ]);

        $res->assertStatus(201);
        $clonedTower = CondoTower::where('name', 'Torre Espejo')->first();
        expect($clonedTower)->not->toBeNull();
        expect(Property::where('tower_id', $clonedTower->id)->count())->toBe(4);

        $ph = Property::where('tower_id', $clonedTower->id)->where('number', '202')->first();
        expect((float) $ph->area_sqm)->toEqual(120.0);
    });

});
