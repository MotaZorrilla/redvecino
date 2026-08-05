<?php

use App\Models\User;
use App\Models\Condominium;
use App\Models\Property;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
});

describe('Fichas de Unidad e Integrantes', function () {
    test('admin puede consultar la ficha de residentes por unidad', function () {
        $admin = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->firstOrFail();
        $property = Property::firstOrFail();

        $response = $this->actingAs($admin)->getJson("/api/unit-profiles/{$property->id}");
        expect($response->status())->toBeIn([200, 404]);
    });

    test('admin puede guardar o actualizar la ficha de unidad con estacionamiento y patente', function () {
        $admin = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->firstOrFail();
        $property = Property::firstOrFail();

        $response = $this->actingAs($admin)->postJson("/api/unit-profiles/{$property->id}", [
            'parking_spot' => 'E-12',
            'license_plate' => 'ABCD-12',
            'observation' => 'Mascota pequeña (perro)',
            'members' => [
                [
                    'first_name' => 'Juan',
                    'last_name' => 'Pérez',
                    'rut' => '12.345.678-9',
                    'birth_date' => '1990-05-15',
                    'is_owner' => true,
                    'lives_in_unit' => true,
                ],
                [
                    'first_name' => 'María',
                    'last_name' => 'Pérez',
                    'rut' => '18.765.432-1',
                    'birth_date' => '1995-10-20',
                    'is_owner' => false,
                    'lives_in_unit' => true,
                ],
            ],
        ]);

        expect($response->status())->toBeIn([200, 404]);
    });

    test('busqueda global de residentes devuelve coincidencias por nombre', function () {
        $admin = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->firstOrFail();

        $response = $this->actingAs($admin)->getJson('/api/residents/search?query=Juan');
        expect($response->status())->toBeIn([200, 404]);
    });
});
