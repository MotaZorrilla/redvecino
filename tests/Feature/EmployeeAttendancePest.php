<?php

use App\Models\User;
use App\Models\Condominium;
use App\Models\EmployeeProfile;
use App\Models\EmployeeAttendance;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
});

describe('Reloj Control y Asistencia de Colaboradores API', function () {

    it('rejects unauthenticated requests', function () {
        $response = $this->getJson('/api/employee-attendances');
        $response->assertStatus(401);
    });

    it('fails validation when required fields are missing on check-in', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/employee-attendances/check-in', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['condominium_id', 'employee_profile_id']);
    });

    it('records check-in successfully for today', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        $employee = EmployeeProfile::first();
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/employee-attendances/check-in', [
            'condominium_id' => 1,
            'employee_profile_id' => $employee->id,
            'notes' => 'Ingreso en turno matutino puntual',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('attendance.status', 'presente')
            ->assertJsonPath('attendance.employee_profile_id', $employee->id);

        expect(EmployeeAttendance::where('employee_profile_id', $employee->id)->whereDate('date', now()->toDateString())->exists())->toBeTrue();
    });

    it('prevents duplicate check-in on the same date', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        $employee = EmployeeProfile::first();
        Sanctum::actingAs($admin);

        EmployeeAttendance::create([
            'condominium_id' => 1,
            'employee_profile_id' => $employee->id,
            'date' => now()->toDateString(),
            'check_in_at' => now(),
            'status' => 'presente',
        ]);

        $response = $this->postJson('/api/employee-attendances/check-in', [
            'condominium_id' => 1,
            'employee_profile_id' => $employee->id,
        ]);

        $response->assertStatus(422)
            ->assertJsonPath('message', 'El colaborador ya registró su entrada para la jornada de hoy.');
    });

    it('records check-out successfully for an attendance record', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        $employee = EmployeeProfile::first();
        Sanctum::actingAs($admin);

        $attendance = EmployeeAttendance::create([
            'condominium_id' => 1,
            'employee_profile_id' => $employee->id,
            'date' => now()->toDateString(),
            'check_in_at' => now()->subHours(8),
            'status' => 'presente',
        ]);

        $response = $this->postJson("/api/employee-attendances/{$attendance->id}/check-out");

        $response->assertStatus(200)
            ->assertJsonPath('message', 'Salida registrada con éxito.');

        expect($attendance->fresh()->check_out_at)->not->toBeNull();
    });

    it('prevents double check-out on the same attendance record', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        $employee = EmployeeProfile::first();
        Sanctum::actingAs($admin);

        $attendance = EmployeeAttendance::create([
            'condominium_id' => 1,
            'employee_profile_id' => $employee->id,
            'date' => now()->toDateString(),
            'check_in_at' => now()->subHours(8),
            'check_out_at' => now(),
            'status' => 'presente',
        ]);

        $response = $this->postJson("/api/employee-attendances/{$attendance->id}/check-out");

        $response->assertStatus(422)
            ->assertJsonPath('message', 'La salida ya había sido registrada anteriormente.');
    });

    it('retrieves current day attendance status for employee', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        $employee = EmployeeProfile::first();
        Sanctum::actingAs($admin);

        EmployeeAttendance::create([
            'condominium_id' => 1,
            'employee_profile_id' => $employee->id,
            'date' => now()->toDateString(),
            'check_in_at' => now(),
            'status' => 'presente',
        ]);

        $response = $this->getJson("/api/employee-attendances/today-status?employee_profile_id={$employee->id}");

        $response->assertStatus(200)
            ->assertJsonPath('has_checked_in', true)
            ->assertJsonPath('has_checked_out', false);
    });
});
