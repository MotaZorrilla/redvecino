<?php

use App\Models\User;
use App\Models\Condominium;
use App\Models\Property;
use App\Models\UnitProfile;
use App\Models\UnitMember;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
});

describe('Estacionamientos Múltiples y Límite de Residentes por Unidad API', function () {

    it('rejects adding more than 3 authorized residents to a single unit', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        $property = Property::first();
        Sanctum::actingAs($admin);

        $fourMembers = [
            ['first_name' => 'Juan', 'last_name' => 'Pérez', 'rut' => '12.345.678-9', 'birth_date' => '1990-01-01', 'is_owner' => true, 'lives_in_unit' => true],
            ['first_name' => 'María', 'last_name' => 'Gómez', 'rut' => '13.456.789-0', 'birth_date' => '1992-05-10', 'is_owner' => false, 'lives_in_unit' => true],
            ['first_name' => 'Pedro', 'last_name' => 'Pérez', 'rut' => '20.123.456-7', 'birth_date' => '2015-08-20', 'is_owner' => false, 'lives_in_unit' => true],
            ['first_name' => 'Lucas', 'last_name' => 'Pérez', 'rut' => '22.345.678-1', 'birth_date' => '2018-12-15', 'is_owner' => false, 'lives_in_unit' => true],
        ];

        $response = $this->postJson("/api/unit-profiles/{$property->id}", [
            'members' => $fourMembers,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['members']);
    });

    it('successfully registers up to 3 authorized residents for a unit', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        $property = Property::first();
        Sanctum::actingAs($admin);

        $threeMembers = [
            ['first_name' => 'Carlos', 'last_name' => 'Silva', 'rut' => '11.222.333-4', 'birth_date' => '1985-03-15', 'is_owner' => true, 'lives_in_unit' => true],
            ['first_name' => 'Ana', 'last_name' => 'Torres', 'rut' => '12.333.444-5', 'birth_date' => '1988-07-22', 'is_owner' => false, 'lives_in_unit' => true],
            ['first_name' => 'Diego', 'last_name' => 'Silva', 'rut' => '24.555.666-7', 'birth_date' => '2020-11-05', 'is_owner' => false, 'lives_in_unit' => true],
        ];

        $response = $this->postJson("/api/unit-profiles/{$property->id}", [
            'members' => $threeMembers,
        ]);

        $response->assertStatus(201)
            ->assertJsonCount(3, 'members');

        expect(UnitMember::where('first_name', 'Carlos')->exists())->toBeTrue();
    });

    it('supports multiple dynamic parking spots and storage units per apartment', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        $property = Property::first();
        Sanctum::actingAs($admin);

        $parkingSpots = [
            ['spot' => 'E-101', 'plate' => 'BB-CL-45'],
            ['spot' => 'E-102', 'plate' => 'KJ-98-11'],
        ];
        $storageUnits = ['Bodega B-04', 'Bodega B-05'];

        $response = $this->postJson("/api/unit-profiles/{$property->id}", [
            'parking_spots' => $parkingSpots,
            'storage_units' => $storageUnits,
            'observation' => '2 estacionamientos subterráneos nivel -1',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('parking_spots.0.spot', 'E-101')
            ->assertJsonPath('parking_spots.1.plate', 'KJ-98-11')
            ->assertJsonPath('storage_units.0', 'Bodega B-04');

        $profile = UnitProfile::where('property_id', $property->id)->first();
        expect($profile)->not->toBeNull()
            ->and($profile->parking_spots)->toBeArray()
            ->and(count($profile->parking_spots))->toBe(2)
            ->and($profile->storage_units)->toBeArray();
    });
});
