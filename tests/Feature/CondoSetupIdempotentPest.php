<?php

use App\Models\Condominium;
use App\Models\CondoTower;
use App\Models\Property;
use App\Models\User;
use Spatie\Permission\Models\Role;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    $this->seed();

    Role::findOrCreate('admin', 'web');
    Role::findOrCreate('ti', 'web');

    $this->condo = Condominium::create([
        'name' => 'Condominio Idempotencia',
        'address' => 'Av. Idempotente 1',
        'city' => 'Concepción',
        'region' => 'Biobío',
        'units_count' => 0,
        'status' => 'active',
    ]);

    $this->admin = User::factory()->create(['name' => 'Admin', 'email' => 'idem_admin@test.cl']);
    $this->admin->assignRole('admin');
});

describe('Idempotencia del setup de estructura', function () {

    it('dos llamadas setup() no duplican torres ni propiedades', function () {
        $payload = [
            'condominium_id' => $this->condo->id,
            'type' => 'tower',
            'towers' => [
                ['name' => 'Torre A', 'floors' => 3, 'units_per_floor' => 2, 'has_water_meter' => true],
            ],
        ];

        $this->actingAs($this->admin)->postJson('/api/setup-condominium', $payload)->assertStatus(201);
        $this->actingAs($this->admin)->postJson('/api/setup-condominium', $payload)->assertStatus(201);

        // Solo 1 torre y solo 3*2 = 6 propiedades
        $towers = CondoTower::where('condominium_id', $this->condo->id)->get();
        expect($towers->count())->toBe(1);

        $properties = Property::where('condominium_id', $this->condo->id)->get();
        expect($properties->count())->toBe(6);
    });

    test('setup() con torres distintas añade nuevas sin duplicar las previas', function () {
        $this->actingAs($this->admin)->postJson('/api/setup-condominium', [
            'condominium_id' => $this->condo->id,
            'type' => 'tower',
            'towers' => [['name' => 'Torre A', 'floors' => 2, 'units_per_floor' => 2]],
        ])->assertStatus(201);

        $this->actingAs($this->admin)->postJson('/api/setup-condominium', [
            'condominium_id' => $this->condo->id,
            'type' => 'tower',
            'towers' => [
                ['name' => 'Torre A', 'floors' => 2, 'units_per_floor' => 2],
                ['name' => 'Torre B', 'floors' => 1, 'units_per_floor' => 2],
            ],
        ])->assertStatus(201);

        expect(CondoTower::where('condominium_id', $this->condo->id)->count())->toBe(2);
        expect(Property::where('condominium_id', $this->condo->id)->count())->toBe(4 + 2);
    });
});