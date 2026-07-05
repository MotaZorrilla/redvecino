<?php

use App\Models\User;
use App\Models\Condominium;
use App\Models\Facility;
use App\Http\Controllers\FacilityController;

covers(FacilityController::class);

uses(
    Illuminate\Foundation\Testing\RefreshDatabase::class
);

beforeEach(function () {
    $this->seed();
});

// ─── HELPERS ─────────────────────────────────────────────────

function actingAsAdmin(): User
{
    $admin = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->firstOrFail();
    test()->actingAs($admin);
    return $admin;
}

function actingAsResidente(): User
{
    $user = User::whereHas('roles', fn($q) => $q->where('name', 'Residente'))->firstOrFail();
    test()->actingAs($user);
    return $user;
}

// ─── INDEX ────────────────────────────────────────────────────

test('cualquier usuario autenticado puede listar facilities', function () {
    $condo = Condominium::firstOrFail();
    Facility::factory()->create(['condominium_id' => $condo->id, 'name' => 'Mi Nueva Facility']);

    actingAsResidente();

    $response = $this->json('GET', '/api/facilities', ['condominium_id' => $condo->id]);
    $response->assertStatus(200);
    $names = array_map(fn($f) => $f['name'], $response->json());
    expect($names)->toContain('Mi Nueva Facility');
});

test('listar facilities filtra por condominium_id', function () {
    $condo1 = Condominium::firstOrFail();
    $condo2 = Condominium::factory()->create();
    $f1 = Facility::factory()->create(['condominium_id' => $condo1->id, 'name' => 'Solo Condo1']);
    $f2 = Facility::factory()->create(['condominium_id' => $condo2->id, 'name' => 'Solo Condo2']);

    actingAsAdmin();

    $response = $this->json('GET', '/api/facilities', ['condominium_id' => $condo1->id]);
    $response->assertStatus(200);
    $ids = array_map(fn($f) => $f['id'], $response->json());
    expect($ids)->toContain($f1->id);
    expect($ids)->not->toContain($f2->id);
});

// ─── SHOW ─────────────────────────────────────────────────────

test('usuario autenticado puede ver una facility', function () {
    $condo = Condominium::firstOrFail();
    $facility = Facility::factory()->create(['condominium_id' => $condo->id]);

    actingAsResidente();

    $response = $this->getJson("/api/facilities/{$facility->id}");
    $response->assertStatus(200);
    expect($response->json('id'))->toBe($facility->id);
});

test('facility inexistente devuelve 404', function () {
    actingAsAdmin();
    $this->getJson('/api/facilities/99999')->assertStatus(404);
});

// ─── STORE ────────────────────────────────────────────────────

test('admin puede crear una facility', function () {
    actingAsAdmin();
    $condo = Condominium::firstOrFail();

    $response = $this->postJson('/api/facilities', [
        'condominium_id' => $condo->id,
        'name' => 'Quincho Principal',
        'type' => 'quincho',
        'capacity' => 30,
        'fee' => 10000,
    ]);

    $response->assertStatus(201);
    expect($response->json('name'))->toBe('Quincho Principal');
    expect($response->json('condominium_id'))->toBe($condo->id);
});

test('residente no puede crear una facility', function () {
    $condo = Condominium::firstOrFail();
    actingAsResidente();

    $this->postJson('/api/facilities', [
        'condominium_id' => $condo->id,
        'name' => 'Quincho',
        'type' => 'quincho',
    ])->assertStatus(403);
});

test('crear facility con datos inválidos falla', function () {
    actingAsAdmin();

    $this->postJson('/api/facilities', [
        'condominium_id' => null,
        'name' => '',
        'type' => 'tipo_invalido',
    ])->assertStatus(422);
});

// ─── UPDATE ───────────────────────────────────────────────────

test('admin puede actualizar una facility', function () {
    actingAsAdmin();
    $condo = Condominium::firstOrFail();
    $facility = Facility::factory()->create(['condominium_id' => $condo->id]);

    $response = $this->putJson("/api/facilities/{$facility->id}", [
        'name' => 'Quincho Renovado',
        'capacity' => 50,
    ]);

    $response->assertStatus(200);
    expect($response->json('name'))->toBe('Quincho Renovado');
});

test('residente no puede actualizar una facility', function () {
    $condo = Condominium::firstOrFail();
    $facility = Facility::factory()->create(['condominium_id' => $condo->id]);
    actingAsResidente();

    $this->putJson("/api/facilities/{$facility->id}", [
        'name' => 'Hackeado',
    ])->assertStatus(403);
});

// ─── DESTROY ──────────────────────────────────────────────────

test('admin puede eliminar una facility', function () {
    actingAsAdmin();
    $condo = Condominium::firstOrFail();
    $facility = Facility::factory()->create(['condominium_id' => $condo->id]);

    $this->deleteJson("/api/facilities/{$facility->id}")->assertStatus(204);
    expect(Facility::find($facility->id))->toBeNull();
});

test('residente no puede eliminar una facility', function () {
    $condo = Condominium::firstOrFail();
    $facility = Facility::factory()->create(['condominium_id' => $condo->id]);
    actingAsResidente();

    $this->deleteJson("/api/facilities/{$facility->id}")->assertStatus(403);
});

test('usuario no autenticado no puede crear facilities', function () {
    $this->postJson('/api/facilities', ['name' => 'Test'])->assertStatus(401);
});
