<?php

use App\Models\User;
use App\Models\Condominium;
use App\Models\EmployeeProfile;
use App\Models\EmployeeSanction;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
    Storage::fake('public');
});

describe('Employee Sanctions (Amonestaciones Laborales) API', function () {

    it('rejects unauthenticated requests', function () {
        $response = $this->getJson('/api/employee-sanctions');
        $response->assertStatus(401);
    });

    it('rejects users without permission to manage employees', function () {
        $resident = User::whereHas('roles', fn ($q) => $q->where('name', 'Residente'))->first();
        Sanctum::actingAs($resident);

        $response = $this->postJson('/api/employee-sanctions', [
            'condominium_id' => 1,
            'employee_profile_id' => 1,
            'date' => '2026-08-15',
            'reason' => 'Atraso',
            'description' => 'Llegó 30 minutos tarde.',
        ]);

        $response->assertStatus(403);
    });

    it('fails validation when required fields are missing', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/employee-sanctions', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['condominium_id', 'employee_profile_id', 'date', 'reason', 'description']);
    });

    it('fails validation when document is not a valid pdf or image', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        $employee = EmployeeProfile::first();
        Sanctum::actingAs($admin);

        $invalidFile = UploadedFile::fake()->create('script.exe', 500, 'application/x-msdownload');

        $response = $this->postJson('/api/employee-sanctions', [
            'condominium_id' => 1,
            'employee_profile_id' => $employee->id,
            'date' => '2026-08-15',
            'reason' => 'Atraso reiterado',
            'description' => 'Firma de amonestación adjunta.',
            'document' => $invalidFile,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['document']);
    });

    it('creates an employee sanction successfully with pdf document upload', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        $employee = EmployeeProfile::first();
        Sanctum::actingAs($admin);

        $pdfFile = UploadedFile::fake()->create('amonestacion_firmada.pdf', 1024, 'application/pdf');

        $response = $this->post('/api/employee-sanctions', [
            'condominium_id' => 1,
            'employee_profile_id' => $employee->id,
            'date' => '2026-08-15',
            'time' => '08:45',
            'reason' => 'Atraso reiterado injustificado',
            'description' => 'Tercer atraso del mes sin justificativo médico.',
            'document' => $pdfFile,
        ], ['Accept' => 'application/json']);

        $response->assertStatus(201)
            ->assertJsonPath('reason', 'Atraso reiterado injustificado')
            ->assertJsonPath('employee_profile_id', $employee->id);

        $sanction = EmployeeSanction::where('description', 'Tercer atraso del mes sin justificativo médico.')->first();
        expect($sanction)->not->toBeNull()
            ->and($sanction->reason)->toBe('Atraso reiterado injustificado')
            ->and($sanction->document_path)->not->toBeNull();

        Storage::disk('public')->assertExists($sanction->document_path);
    });

    it('lists employee sanctions filtered by condominium and employee', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        $employee = EmployeeProfile::first();
        Sanctum::actingAs($admin);

        EmployeeSanction::create([
            'condominium_id' => 1,
            'employee_profile_id' => $employee->id,
            'date' => '2026-08-10',
            'reason' => 'Incumplimiento de funciones',
            'description' => 'No realizó la ronda nocturna asignada.',
            'created_by' => $admin->id,
        ]);

        $response = $this->getJson("/api/employee-sanctions?condominium_id=1&employee_profile_id={$employee->id}");

        $response->assertStatus(200);
        expect(count($response->json()))->toBeGreaterThanOrEqual(1);
    });

    it('deletes an employee sanction and its uploaded document file', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        $employee = EmployeeProfile::first();
        Sanctum::actingAs($admin);

        $fakeFile = UploadedFile::fake()->image('evidencia.png');
        $storedPath = $fakeFile->store('sanctions', 'public');

        $sanction = EmployeeSanction::create([
            'condominium_id' => 1,
            'employee_profile_id' => $employee->id,
            'date' => '2026-08-12',
            'reason' => 'Uso indebido de uniforme',
            'description' => 'Presentación personal inadecuada.',
            'document_path' => $storedPath,
            'created_by' => $admin->id,
        ]);

        Storage::disk('public')->assertExists($storedPath);

        $response = $this->deleteJson("/api/employee-sanctions/{$sanction->id}");

        $response->assertStatus(200);
        expect(EmployeeSanction::find($sanction->id))->toBeNull();
        Storage::disk('public')->assertMissing($storedPath);
    });

    it('isolates employee sanctions strictly between different condominiums', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        $employee = EmployeeProfile::first();
        Sanctum::actingAs($admin);

        // Sanction in Condo 1
        EmployeeSanction::create([
            'condominium_id' => 1,
            'employee_profile_id' => $employee->id,
            'date' => '2026-08-10',
            'reason' => 'Sanción Condo 1',
            'description' => 'Descripción 1',
            'created_by' => $admin->id,
        ]);

        // Second Condo
        $condo2 = Condominium::factory()->create(['name' => 'Condominio Norte']);

        $response = $this->getJson("/api/employee-sanctions?condominium_id={$condo2->id}");
        $response->assertStatus(200)
            ->assertJsonCount(0);
    });
});
