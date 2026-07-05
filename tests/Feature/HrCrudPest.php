<?php

use App\Models\User;
use App\Models\EmployeeProfile;
use App\Models\Liquidation;
use App\Http\Controllers\HRController;

covers(HRController::class);

uses(
    Illuminate\Foundation\Testing\RefreshDatabase::class
);

beforeEach(function () {
    $this->seed();
});

// ─── HELPERS ─────────────────────────────────────────────────

function hrAdmin(): User
{
    $admin = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->firstOrFail();
    test()->actingAs($admin);
    return $admin;
}

function hrEmployee(): EmployeeProfile
{
    $employee = EmployeeProfile::with('user')->firstOrFail();
    return $employee;
}

// ─── EMPLOYEE SHOW ───────────────────────────────────────────

test('admin puede ver detalle de un empleado', function () {
    hrAdmin();
    $emp = hrEmployee();

    $response = $this->getJson("/api/hr/employees/{$emp->id}");
    $response->assertStatus(200);
    expect($response->json('id'))->toBe($emp->id);
});

test('empleado inexistente devuelve 404', function () {
    hrAdmin();
    $this->getJson('/api/hr/employees/99999')->assertStatus(404);
});

// ─── EMPLOYEE UPDATE ─────────────────────────────────────────

test('admin puede actualizar un empleado', function () {
    hrAdmin();
    $emp = hrEmployee();

    $response = $this->putJson("/api/hr/employees/{$emp->id}", [
        'position' => 'Supervisor General',
    ]);

    $response->assertStatus(200);
    expect($response->json('employee.position'))->toBe('Supervisor General');
});

// ─── LIST LIQUIDATIONS ───────────────────────────────────────

test('admin puede listar liquidaciones', function () {
    hrAdmin();
    $emp = hrEmployee();
    Liquidation::factory()->count(2)->create(['employee_profile_id' => $emp->id]);

    $response = $this->getJson('/api/hr/liquidations');
    $response->assertStatus(200);
    expect($response->json())->toHaveCount(2);
});

test('listar liquidaciones filtra por empleado', function () {
    hrAdmin();
    $emp1 = hrEmployee();
    $emp2 = EmployeeProfile::factory()->create();
    Liquidation::factory()->create(['employee_profile_id' => $emp1->id]);
    Liquidation::factory()->create(['employee_profile_id' => $emp2->id]);

    $response = $this->json('GET', '/api/hr/liquidations', ['employee_profile_id' => $emp1->id]);
    $response->assertStatus(200);
    expect($response->json())->toHaveCount(1);
});

// ─── SHOW LIQUIDATION ────────────────────────────────────────

test('admin puede ver una liquidacion', function () {
    hrAdmin();
    $emp = hrEmployee();
    $liq = Liquidation::factory()->create(['employee_profile_id' => $emp->id]);

    $response = $this->getJson("/api/hr/liquidations/{$liq->id}");
    $response->assertStatus(200);
    expect($response->json('id'))->toBe($liq->id);
});

// ─── CREATE LIQUIDATION ─────────────────────────────────────

test('admin puede crear una liquidacion', function () {
    hrAdmin();
    $emp = hrEmployee();

    $response = $this->postJson('/api/hr/liquidations', [
        'employee_profile_id' => $emp->id,
        'period' => 'Julio 2026',
        'sueldo_base' => 500000,
        'total_imponibles' => 500000,
        'total_no_imponibles' => 0,
        'salud_fonasa' => 35000,
        'afp_monto' => 57200,
        'afp_rate' => 11.44,
        'seguro_cesantia' => 3000,
        'total_previsionales' => 95200,
        'total_otros_descuentos' => 0,
        'sueldo_liquido' => 380000,
    ]);

    $response->assertStatus(201);
    expect($response->json('liquidation.period'))->toBe('Julio 2026');
});

// ─── UPDATE LIQUIDATION ─────────────────────────────────────

test('admin puede actualizar una liquidacion', function () {
    hrAdmin();
    $emp = hrEmployee();
    $liq = Liquidation::factory()->create(['employee_profile_id' => $emp->id]);

    $response = $this->putJson("/api/hr/liquidations/{$liq->id}", [
        'sueldo_base' => 600000,
        'sueldo_liquido' => 450000,
    ]);

    $response->assertStatus(200);
    expect($response->json('liquidation.sueldo_base'))->toEqual(600000);
    expect($response->json('liquidation.sueldo_liquido'))->toEqual(450000);
});

// ─── DELETE LIQUIDATION ─────────────────────────────────────

test('admin puede eliminar una liquidacion', function () {
    hrAdmin();
    $emp = hrEmployee();
    $liq = Liquidation::factory()->create(['employee_profile_id' => $emp->id]);

    $this->deleteJson("/api/hr/liquidations/{$liq->id}")->assertStatus(204);
    expect(Liquidation::find($liq->id))->toBeNull();
});

// ─── PERMISSIONS ─────────────────────────────────────────────

test('residente no puede crear liquidaciones', function () {
    $residente = User::whereHas('roles', fn($q) => $q->where('name', 'Residente'))->firstOrFail();
    $this->actingAs($residente);

    $this->postJson('/api/hr/liquidations', [
        'employee_profile_id' => 1,
        'period' => 'Test',
        'sueldo_base' => 1000,
        'total_imponibles' => 1000,
        'total_no_imponibles' => 0,
        'salud_fonasa' => 70,
        'afp_monto' => 114.4,
        'afp_rate' => 11.44,
        'seguro_cesantia' => 6,
        'total_previsionales' => 190.4,
        'total_otros_descuentos' => 0,
        'sueldo_liquido' => 800,
    ])->assertStatus(403);
});
