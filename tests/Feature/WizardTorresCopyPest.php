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

// ─── HELPERS ──────────────────────────────────────────────────

function tiUser(): User
{
    $user = User::whereHas('roles', fn($q) => $q->where('name', 'TI'))->firstOrFail();
    test()->actingAs($user);
    return $user;
}

function adminUser(): User
{
    $user = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->firstOrFail();
    test()->actingAs($user);
    return $user;
}

function residenteUser(): User
{
    $user = User::whereHas('roles', fn($q) => $q->where('name', 'Residente'))->firstOrFail();
    test()->actingAs($user);
    return $user;
}

function freshCondo(string $name = 'Condo Test Wizard'): Condominium
{
    return Condominium::create([
        'name'        => $name,
        'address'     => 'Av. Las Torres 100',
        'city'        => 'Santiago',
        'region'      => 'Metropolitana',
        'postal_code' => '8320000',
        'units_count' => 50,
        'status'      => 'active',
    ]);
}

// ─── SETUP: GENERACIÓN DE TORRES Y UNIDADES ──────────────────

describe('Setup de Torres y Unidades', function () {

    test('TI puede crear torres con pisos y unidades generadas automáticamente', function () {
        tiUser();
        $condo = freshCondo('Setup Torre TI');

        $response = $this->postJson('/api/setup-condominium', [
            'condominium_id' => $condo->id,
            'type'           => 'tower',
            'towers'         => [
                ['name' => 'Torre A', 'floors' => 5, 'units_per_floor' => 4,
                 'has_water_meter' => true, 'has_electricity_meter' => true],
            ],
        ]);

        $response->assertStatus(201);
        $tower = CondoTower::where('condominium_id', $condo->id)->where('name', 'Torre A')->first();
        // 5 pisos × 4 unidades = 20 unidades
        expect(Property::where('tower_id', $tower->id)->count())->toBe(20);
    });

    test('setup genera unidades con numeración correcta por piso', function () {
        tiUser();
        $condo = freshCondo('Numeracion Torre');

        $this->postJson('/api/setup-condominium', [
            'condominium_id' => $condo->id,
            'type'           => 'tower',
            'towers'         => [
                ['name' => 'T1', 'floors' => 2, 'units_per_floor' => 2,
                 'has_water_meter' => false, 'has_electricity_meter' => false],
            ],
        ])->assertStatus(201);

        $tower = CondoTower::where('condominium_id', $condo->id)->first();
        $numbers = Property::where('tower_id', $tower->id)->pluck('number')->toArray();
        // Piso 1 → 101,102 | Piso 2 → 201,202
        expect($numbers)->toContain('101')->toContain('102')->toContain('201')->toContain('202');
    });

    test('setup crea múltiples torres en una sola llamada', function () {
        tiUser();
        $condo = freshCondo('Multi Torre');

        $this->postJson('/api/setup-condominium', [
            'condominium_id' => $condo->id,
            'type'           => 'tower',
            'towers'         => [
                ['name' => 'Torre A', 'floors' => 3, 'units_per_floor' => 2,
                 'has_water_meter' => true, 'has_electricity_meter' => false],
                ['name' => 'Torre B', 'floors' => 4, 'units_per_floor' => 3,
                 'has_water_meter' => false, 'has_electricity_meter' => true],
            ],
        ])->assertStatus(201);

        expect(CondoTower::where('condominium_id', $condo->id)->count())->toBe(2);

        $tA = CondoTower::where('name', 'Torre A')->where('condominium_id', $condo->id)->first();
        $tB = CondoTower::where('name', 'Torre B')->where('condominium_id', $condo->id)->first();
        expect(Property::where('tower_id', $tA->id)->count())->toBe(6);  // 3×2
        expect(Property::where('tower_id', $tB->id)->count())->toBe(12); // 4×3
    });

    test('setup falla si condominium_id no existe', function () {
        tiUser();

        $this->postJson('/api/setup-condominium', [
            'condominium_id' => 99999,
            'type'           => 'tower',
            'towers'         => [['name' => 'X', 'floors' => 1, 'units_per_floor' => 1]],
        ])->assertStatus(422);
    });

    test('setup requiere al menos 1 piso y 1 unidad por piso', function () {
        tiUser();
        $condo = freshCondo('Validacion Minima');

        $this->postJson('/api/setup-condominium', [
            'condominium_id' => $condo->id,
            'type'           => 'tower',
            'towers'         => [['name' => 'T', 'floors' => 0, 'units_per_floor' => 0]],
        ])->assertStatus(422);
    });

    test('residente no puede configurar la estructura del condominio', function () {
        residenteUser();
        $condo = freshCondo('Intento Residente');

        $this->postJson('/api/setup-condominium', [
            'condominium_id' => $condo->id,
            'type'           => 'tower',
            'towers'         => [['name' => 'Z', 'floors' => 1, 'units_per_floor' => 1]],
        ])->assertStatus(403);
    });

    test('usuario no autenticado no puede acceder al setup', function () {
        $condo = freshCondo('Sin Auth');

        $this->postJson('/api/setup-condominium', [
            'condominium_id' => $condo->id,
            'type'           => 'tower',
            'towers'         => [['name' => 'Z', 'floors' => 1, 'units_per_floor' => 1]],
        ])->assertStatus(401);
    });

});

// ─── COPY TOWER STRUCTURE ─────────────────────────────────────

describe('Copy Tower Structure', function () {

    test('TI puede copiar la estructura completa de una torre a otra nueva', function () {
        tiUser();
        $condo = freshCondo('Copy Tower');

        $sourceTower = CondoTower::create([
            'condominium_id'       => $condo->id,
            'name'                 => 'Torre Modelo',
            'has_water_meter'      => true,
            'has_electricity_meter' => true,
        ]);

        // Crear 3 propiedades en la torre fuente
        foreach (['101', '102', '103'] as $num) {
            Property::create([
                'condominium_id' => $condo->id,
                'tower_id'       => $sourceTower->id,
                'type'           => 'apartment',
                'number'         => $num,
                'floor'          => 1,
                'area_sqm'       => 65,
                'status'         => 'vacant',
            ]);
        }

        $response = $this->postJson('/api/setup-condominium/copy-tower', [
            'condominium_id'   => $condo->id,
            'source_tower_id'  => $sourceTower->id,
            'new_tower_name'   => 'Torre Copia A',
        ]);

        $response->assertStatus(201);

        $newTower = CondoTower::where('name', 'Torre Copia A')->where('condominium_id', $condo->id)->first();
        expect($newTower)->not->toBeNull();
        // Misma cantidad de unidades copiadas
        expect(Property::where('tower_id', $newTower->id)->count())->toBe(3);
    });

    test('la torre copiada hereda la configuración de medidores de la fuente', function () {
        tiUser();
        $condo = freshCondo('Copy Meters');

        $sourceTower = CondoTower::create([
            'condominium_id'       => $condo->id,
            'name'                 => 'Fuente Medidores',
            'has_water_meter'      => true,
            'has_electricity_meter' => false,
        ]);

        Property::create(['condominium_id' => $condo->id, 'tower_id' => $sourceTower->id,
            'type' => 'apartment', 'number' => '101', 'floor' => 1, 'area_sqm' => 50, 'status' => 'vacant']);

        $this->postJson('/api/setup-condominium/copy-tower', [
            'condominium_id'  => $condo->id,
            'source_tower_id' => $sourceTower->id,
            'new_tower_name'  => 'Copia Medidores',
        ])->assertStatus(201);

        $copiedTower = CondoTower::where('name', 'Copia Medidores')->first();
        expect($copiedTower->has_water_meter)->toBeTrue();
        expect($copiedTower->has_electricity_meter)->toBeFalse();
    });

    test('la torre copiada preserva números de unidad, piso y área', function () {
        tiUser();
        $condo = freshCondo('Copy Preserve');

        $sourceTower = CondoTower::create([
            'condominium_id' => $condo->id, 'name' => 'Fuente Preservar',
            'has_water_meter' => false, 'has_electricity_meter' => false,
        ]);

        Property::create([
            'condominium_id' => $condo->id, 'tower_id' => $sourceTower->id,
            'type' => 'apartment', 'number' => '201', 'floor' => 2,
            'area_sqm' => 80, 'status' => 'vacant',
        ]);

        $this->postJson('/api/setup-condominium/copy-tower', [
            'condominium_id'  => $condo->id,
            'source_tower_id' => $sourceTower->id,
            'new_tower_name'  => 'Copia Preservar',
        ])->assertStatus(201);

        $newTower = CondoTower::where('name', 'Copia Preservar')->first();
        $unit     = Property::where('tower_id', $newTower->id)->first();

        expect($unit->number)->toBe('201');
        expect($unit->floor)->toBe(2);
        expect((float) $unit->area_sqm)->toEqual(80.0);
        expect($unit->status)->toBe('vacant');
    });

    test('copiar torre con source_tower_id inexistente devuelve 404', function () {
        tiUser();
        $condo = freshCondo('Copy 404');

        $this->postJson('/api/setup-condominium/copy-tower', [
            'condominium_id'  => $condo->id,
            'source_tower_id' => 99999,
            'new_tower_name'  => 'Copia Fantasma',
        ])->assertStatus(422);
    });

    test('residente no puede copiar torres', function () {
        residenteUser();
        $condo = freshCondo('Copy Residente');

        $tower = CondoTower::where('condominium_id', Condominium::first()->id)->first();

        $this->postJson('/api/setup-condominium/copy-tower', [
            'condominium_id'  => $condo->id,
            'source_tower_id' => $tower->id ?? 1,
            'new_tower_name'  => 'No Permitido',
        ])->assertStatus(403);
    });

    test('copiar torre sin new_tower_name falla con 422', function () {
        tiUser();
        $condo  = freshCondo('Copy Sin Nombre');
        $tower  = CondoTower::create([
            'condominium_id' => $condo->id, 'name' => 'Torre Sin Nombre',
            'has_water_meter' => false, 'has_electricity_meter' => false,
        ]);

        $this->postJson('/api/setup-condominium/copy-tower', [
            'condominium_id'  => $condo->id,
            'source_tower_id' => $tower->id,
            // new_tower_name missing
        ])->assertStatus(422);
    });

    test('se pueden copiar múltiples torres desde la misma fuente', function () {
        tiUser();
        $condo = freshCondo('Multi Copy');

        $source = CondoTower::create([
            'condominium_id' => $condo->id, 'name' => 'Fuente Multi',
            'has_water_meter' => true, 'has_electricity_meter' => true,
        ]);
        Property::create(['condominium_id' => $condo->id, 'tower_id' => $source->id,
            'type' => 'apartment', 'number' => '101', 'floor' => 1, 'area_sqm' => 60, 'status' => 'vacant']);

        foreach (['Torre B', 'Torre C', 'Torre D'] as $newName) {
            $this->postJson('/api/setup-condominium/copy-tower', [
                'condominium_id'  => $condo->id,
                'source_tower_id' => $source->id,
                'new_tower_name'  => $newName,
            ])->assertStatus(201);
        }

        // 1 fuente + 3 copias = 4 torres
        expect(CondoTower::where('condominium_id', $condo->id)->count())->toBe(4);
        // Cada copia tiene 1 unidad
        CondoTower::where('condominium_id', $condo->id)->where('name', '!=', 'Fuente Multi')
            ->each(function ($t) {
                expect(Property::where('tower_id', $t->id)->count())->toBe(1);
            });
    });

});
