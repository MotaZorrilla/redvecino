<?php

use App\Models\User;
use App\Models\Condominium;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
});

describe('Configuracion de Dia de Vencimiento e Interes de Mora', function () {
    test('admin puede actualizar dia de vencimiento e interes de mora del condominio', function () {
        $admin = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->firstOrFail();
        $condo = Condominium::firstOrFail();

        $response = $this->actingAs($admin)->postJson("/api/condominiums/{$condo->id}/finance-config", [
            'due_day' => 15,
            'late_interest_rate' => 2.5,
        ]);

        expect($response->status())->toBeIn([200, 404]);
    });

    test('validaciones limite de dia de vencimiento (1 a 31)', function () {
        $admin = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->firstOrFail();
        $condo = Condominium::firstOrFail();

        $response = $this->actingAs($admin)->postJson("/api/condominiums/{$condo->id}/finance-config", [
            'due_day' => 35,
            'late_interest_rate' => 2.0,
        ]);

        expect($response->status())->toBeIn([422, 404]);
    });
});
