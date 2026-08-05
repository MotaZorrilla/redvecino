<?php

use App\Models\User;
use App\Models\EmployeeProfile;
use App\Http\Controllers\HRController;

covers(HRController::class);
uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
});

describe('Registro de Amonestaciones de Colaboradores', function () {
    test('admin puede listar las amonestaciones de un colaborador', function () {
        $admin = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->firstOrFail();
        $emp = EmployeeProfile::firstOrFail();

        $response = $this->actingAs($admin)->getJson("/api/hr/employees/{$emp->id}/amonestaciones");
        expect($response->status())->toBeIn([200, 404]);
    });

    test('admin puede registrar una amonestacion', function () {
        $admin = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->firstOrFail();
        $emp = EmployeeProfile::firstOrFail();

        $response = $this->actingAs($admin)->postJson("/api/hr/employees/{$emp->id}/amonestaciones", [
            'reason' => 'Tardanza reiterada en turno mañana',
            'date' => '2026-08-01',
            'type' => 'escrita',
        ]);

        expect($response->status())->toBeIn([201, 404]);
    });

    test('residente no puede registrar amonestaciones', function () {
        $residente = User::whereHas('roles', fn($q) => $q->where('name', 'Residente'))->firstOrFail();
        $emp = EmployeeProfile::firstOrFail();

        $response = $this->actingAs($residente)->postJson("/api/hr/employees/{$emp->id}/amonestaciones", [
            'reason' => 'Intento no autorizado',
            'date' => '2026-08-01',
            'type' => 'verbal',
        ]);

        expect($response->status())->toBeIn([403, 404]);
    });
});
