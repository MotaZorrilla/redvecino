<?php

use App\Models\User;
use App\Models\Condominium;
use App\Models\Property;
use App\Models\OwnerProfile;
use App\Models\ResidentProfile;
use App\Models\EmployeeProfile;
use App\Models\CommitteeProfile;
use App\Models\AdminProfile;
use App\Http\Controllers\PersonWizardController;

covers(PersonWizardController::class);

uses(
    Illuminate\Foundation\Testing\RefreshDatabase::class
);

describe('PersonWizard API', function () {

    beforeEach(function () {
        $this->seed();
        $this->admin = User::factory()->create();
        $this->admin->assignRole('admin');
        $this->condo = Condominium::factory()->create();
        $this->property = Property::factory()->create(['condominium_id' => $this->condo->id]);
    });

    it('admin puede crear un propietario residente basico', function () {
        $response = $this->actingAs($this->admin)->postJson('/api/person-wizard', [
            'nombres' => 'Carlos',
            'apellidos' => 'Vergara Soto',
            'rut' => '12.345.678-9',
            'email' => 'carlos.vergara@mail.cl',
            'telefono' => '912345678',
            'hasAccess' => true,
            'sendEmail' => true,
            'roles' => ['resident'],
            'asociada' => true,
            'property_id' => $this->property->id,
            'relations' => ['propietario', 'residente'],
            'condominium_id' => $this->condo->id,
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure(['message', 'user' => ['id', 'name', 'rut', 'email', 'phone', 'status', 'roles']]);
        expect($response->json('user.name'))->toBe('Carlos Vergara Soto');
        expect($response->json('user.email'))->toBe('carlos.vergara@mail.cl');
        expect($response->json('user.roles'))->toBe(['resident']);

        $user = User::where('rut', '12.345.678-9')->first();
        expect($user)->not->toBeNull();
        expect($user->hasRole('resident'))->toBeTrue();

        expect(OwnerProfile::where('user_id', $user->id)->exists())->toBeTrue();
        expect(ResidentProfile::where('user_id', $user->id)->exists())->toBeTrue();
    });

    it('admin puede crear un colaborador', function () {
        $response = $this->actingAs($this->admin)->postJson('/api/person-wizard', [
            'nombres' => 'Pedro',
            'apellidos' => 'Muñoz Rojas',
            'rut' => '18.234.567-8',
            'email' => 'pedro.munoz@mail.cl',
            'telefono' => '911223344',
            'hasAccess' => true,
            'sendEmail' => false,
            'roles' => ['colaborador'],
            'asociada' => false,
            'cargo' => 'Conserje / Recepcionista',
            'area' => 'Seguridad',
            'fechaIngreso' => '2026-01-15',
            'tipoContrato' => 'Indefinido',
            'externo' => true,
            'condominium_id' => $this->condo->id,
        ]);

        $response->assertStatus(201);
        $user = User::where('rut', '18.234.567-8')->first();
        expect($user)->not->toBeNull();
        expect($user->hasRole('colaborador'))->toBeTrue();

        $emp = EmployeeProfile::where('user_id', $user->id)->first();
        expect($emp)->not->toBeNull();
        expect($emp->position)->toBe('Conserje / Recepcionista');
        expect($emp->contract_type)->toBe('Indefinido');
        expect($emp->hire_date->format('Y-m-d'))->toBe('2026-01-15');
    });

    it('admin puede crear un miembro del comite', function () {
        $response = $this->actingAs($this->admin)->postJson('/api/person-wizard', [
            'nombres' => 'Laura',
            'apellidos' => 'Martínez',
            'rut' => '15.111.222-3',
            'email' => 'laura.martinez@mail.cl',
            'roles' => ['comité'],
            'asociada' => false,
            'comiteCargo' => 'presidente',
            'comitePeriodo' => '2026-2027',
            'comiteFechaInicio' => '2026-03-01',
            'condominium_id' => $this->condo->id,
        ]);

        $response->assertStatus(201);
        $user = User::where('rut', '15.111.222-3')->first();
        expect($user->hasRole('comité'))->toBeTrue();

        $com = CommitteeProfile::where('user_id', $user->id)->first();
        expect($com)->not->toBeNull();
        expect($com->position)->toBe('presidente');
    });

    it('admin puede crear un administrador externo', function () {
        $response = $this->actingAs($this->admin)->postJson('/api/person-wizard', [
            'nombres' => 'Andrea',
            'apellidos' => 'Fuentes Gil',
            'rut' => '10.111.222-3',
            'email' => 'andrea.fuentes@admin.cl',
            'roles' => ['admin'],
            'asociada' => false,
            'adminTipo' => 'full',
            'adminRpa' => 'RPA-2026-001',
            'adminFechaContrato' => '2026-01-01',
            'condominium_id' => $this->condo->id,
        ]);

        $response->assertStatus(201);
        $user = User::where('rut', '10.111.222-3')->first();
        expect($user->hasRole('admin'))->toBeTrue();

        expect(AdminProfile::where('user_id', $user->id)->exists())->toBeTrue();
    });

    it('usuario sin permiso manage users recibe 403', function () {
        $user = User::factory()->create();
        $user->assignRole('resident');

        $response = $this->actingAs($user)->postJson('/api/person-wizard', [
            'nombres' => 'Test',
            'apellidos' => 'User',
            'rut' => '20.000.001-1',
            'email' => 'test@mail.cl',
            'roles' => ['resident'],
            'asociada' => false,
            'condominium_id' => $this->condo->id,
        ]);

        $response->assertStatus(403);
    });

    it('valida datos requeridos', function () {
        $response = $this->actingAs($this->admin)->postJson('/api/person-wizard', [
            'nombres' => '',
            'apellidos' => '',
            'rut' => '',
            'email' => 'not-an-email',
            'roles' => 'not-array',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['nombres', 'apellidos', 'rut', 'email', 'roles']);
    });

    it('rechaza rut duplicado', function () {
        // Use a RUT that doesn't collide with the seeder
        $existingRut = '99.999.999-9';
        User::factory()->create(['rut' => $existingRut]);

        $response = $this->actingAs($this->admin)->postJson('/api/person-wizard', [
            'nombres' => 'Dupe',
            'apellidos' => 'User',
            'rut' => $existingRut,
            'email' => 'dupe@mail.cl',
            'roles' => ['resident'],
            'asociada' => false,
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['rut']);
    });

    it('rechaza email duplicado', function () {
        $existingEmail = 'existing@mail.cl';
        User::factory()->create(['email' => $existingEmail]);

        $response = $this->actingAs($this->admin)->postJson('/api/person-wizard', [
            'nombres' => 'Dupe',
            'apellidos' => 'Email',
            'rut' => '22.222.222-2',
            'email' => $existingEmail,
            'roles' => ['resident'],
            'asociada' => false,
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    });
});
