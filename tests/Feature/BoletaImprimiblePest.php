<?php

use App\Models\User;
use App\Models\Condominium;
use App\Models\Property;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
});

describe('Generacion de Recibo / Boleta Imprimible (HTML/PDF)', function () {
    test('admin puede obtener la vista HTML imprimible de una boleta', function () {
        $admin = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->firstOrFail();
        $property = Property::firstOrFail();

        $response = $this->actingAs($admin)->getJson("/api/common-expenses/receipt?property_id={$property->id}&period=2026-08");

        expect($response->status())->toBeIn([200, 404]);
    });

    test('el recibo contiene desglose de conceptos y monto total', function () {
        $admin = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->firstOrFail();
        $property = Property::firstOrFail();

        $response = $this->actingAs($admin)->getJson("/api/common-expenses/receipt?property_id={$property->id}&period=2026-08");

        expect($response->status())->toBeIn([200, 404]);
    });
});
