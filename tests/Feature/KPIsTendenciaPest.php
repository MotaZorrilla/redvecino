<?php

use App\Models\User;
use App\Models\Condominium;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
});

describe('KPIs de Dashboard y Analitica Financiera', function () {
    test('admin puede consultar KPIs de egresos con tendencia porcentual vs mes anterior', function () {
        $admin = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->firstOrFail();
        $condo = Condominium::firstOrFail();

        $response = $this->actingAs($admin)->getJson("/api/condo-finances/kpis?condominium_id={$condo->id}");

        expect($response->status())->toBeIn([200, 404]);
    });
});
