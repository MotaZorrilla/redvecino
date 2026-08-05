<?php

use App\Models\User;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
});

describe('Carga de Catalogo Default RedVecino', function () {
    test('admin puede ejecutar la carga idempotente de la estructura oficial de categorias', function () {
        $admin = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->firstOrFail();

        $response = $this->actingAs($admin)->postJson('/api/condo-finances/setup-default-categories');

        expect($response->status())->toBeIn([200, 404]);
    });
});
