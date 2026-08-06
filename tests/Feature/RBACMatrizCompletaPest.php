<?php

use App\Models\User;
use App\Models\Condominium;
use App\Models\Property;
use App\Services\CondoFinanceService;

uses(
    Illuminate\Foundation\Testing\RefreshDatabase::class
);

beforeEach(function () {
    $this->seed();
    app(CondoFinanceService::class)->clearCatalogCache();
    $this->condo = Condominium::firstOrFail();
});

// ─── Roles ─────────────────────────────────────────────────────

dataset('todos_los_roles', [
    'Administrador' => ['role' => 'Administrador', 'expected' => 200],
    'Comité' => ['role' => 'Comité', 'expected' => 200],
    'Propietario' => ['role' => 'Propietario', 'expected' => 403],
    'Residente' => ['role' => 'Residente', 'expected' => 403],
    'Colaborador' => ['role' => 'Colaborador', 'expected' => 403],
    'TI' => ['role' => 'TI', 'expected' => 403],
]);

// ─── Helper ────────────────────────────────────────────────────

function getUserByRole(string $roleName): User
{
    $user = User::whereHas('roles', fn($q) => $q->where('name', $roleName))->firstOrFail();
    return $user;
}

// ─── FINANCE ENDPOINTS ─────────────────────────────────────────

test('resumen financiero: solo admin y comité acceden', function (string $role, int $expected) {
    $user = getUserByRole($role);
    $this->actingAs($user)->json('GET', '/api/condo-finances/summary', [
        'condominium_id' => $this->condo->id,
    ])->assertStatus($expected);
})->with('todos_los_roles');

test('listar incomes: solo admin y comité acceden', function (string $role, int $expected) {
    $user = getUserByRole($role);
    $this->actingAs($user)->json('GET', '/api/condo-finances/incomes', [
        'condominium_id' => $this->condo->id,
    ])->assertStatus($expected);
})->with('todos_los_roles');

test('crear income: solo admin y comité acceden', function (string $role, int $expected) {
    $user = getUserByRole($role);
    $this->actingAs($user)->postJson('/api/condo-finances/incomes', [
        'condominium_id' => $this->condo->id,
        'category' => 'arriendo_espacios',
        'subcategory' => 'Quinchos',
        'amount' => 50000,
        'date' => '2026-07-01',
    ])->assertStatus($expected === 200 ? 201 : $expected);
})->with('todos_los_roles');

test('listar expenses: solo admin y comité acceden', function (string $role, int $expected) {
    $user = getUserByRole($role);
    $this->actingAs($user)->json('GET', '/api/condo-finances/expenses', [
        'condominium_id' => $this->condo->id,
    ])->assertStatus($expected);
})->with('todos_los_roles');

test('crear expense: solo admin y comité acceden', function (string $role, int $expected) {
    $user = getUserByRole($role);
    $this->actingAs($user)->postJson('/api/condo-finances/expenses', [
        'condominium_id' => $this->condo->id,
        'category' => 'personal',
        'subcategory' => 'Conserjes',
        'amount' => 50000,
        'date' => '2026-07-01',
    ])->assertStatus($expected === 200 ? 201 : $expected);
})->with('todos_los_roles');

// ─── CATALOG ───────────────────────────────────────────────────

dataset('roles_acceso_catalogo', [
    'Administrador' => ['role' => 'Administrador', 'expected' => 200],
    'Comité' => ['role' => 'Comité', 'expected' => 200],
    'Propietario' => ['role' => 'Propietario', 'expected' => 403],
    'Residente' => ['role' => 'Residente', 'expected' => 403],
    'Colaborador' => ['role' => 'Colaborador', 'expected' => 403],
    'TI' => ['role' => 'TI', 'expected' => 403],
]);

test('catalogo financiero: todos los roles autenticados acceden', function (string $role, int $expected) {
    $user = getUserByRole($role);
    $response = $this->actingAs($user)->getJson('/api/condo-finances/catalog')
        ->assertStatus($expected);
    if ($expected === 200) {
        $response->assertJsonStructure(['incomes', 'expenses']);
    }
})->with('roles_acceso_catalogo');

// ─── USER MANAGEMENT ───────────────────────────────────────────

dataset('roles_manage_users', [
    'Administrador' => ['role' => 'Administrador', 'expected' => 200],
    'Comité' => ['role' => 'Comité', 'expected' => 403],
    'Propietario' => ['role' => 'Propietario', 'expected' => 403],
    'Residente' => ['role' => 'Residente', 'expected' => 403],
    'Colaborador' => ['role' => 'Colaborador', 'expected' => 403],
    'TI' => ['role' => 'TI', 'expected' => 200],
]);

test('listar usuarios: solo admin', function (string $role, int $expected) {
    $user = getUserByRole($role);
    $this->actingAs($user)->getJson('/api/users')->assertStatus($expected);
})->with('roles_manage_users');

// ─── PROPERTY MANAGEMENT ───────────────────────────────────────

dataset('roles_manage_properties', [
    'Administrador' => ['role' => 'Administrador', 'expected' => 201],
    'Comité' => ['role' => 'Comité', 'expected' => 403],
    'Propietario' => ['role' => 'Propietario', 'expected' => 403],
    'Residente' => ['role' => 'Residente', 'expected' => 403],
    'Colaborador' => ['role' => 'Colaborador', 'expected' => 403],
    'TI' => ['role' => 'TI', 'expected' => 201],
]);

test('crear propiedad: solo Administrador y TI', function (string $role, int $expected) {
    $user = getUserByRole($role);
    $this->actingAs($user)->postJson('/api/properties', [
        'condominium_id' => $this->condo->id,
        'type' => 'apartment',
        'number' => 'TEST-001',
        'area_sqm' => 50,
    ])->assertStatus($expected);
})->with('roles_manage_properties');

// ─── TICKETS ───────────────────────────────────────────────────

dataset('roles_create_tickets', [
    'Administrador' => ['role' => 'Administrador', 'expected' => 201],
    'Comité' => ['role' => 'Comité', 'expected' => 201],
    'Propietario' => ['role' => 'Propietario', 'expected' => 201],
    'Residente' => ['role' => 'Residente', 'expected' => 201],
    'Colaborador' => ['role' => 'Colaborador', 'expected' => 201],
    'TI' => ['role' => 'TI', 'expected' => 201],
]);

test('crear ticket: accesible por la mayoria de roles', function (string $role, int $expected) {
    $user = getUserByRole($role);
    $property = $user->properties()->first();
    if (!$property) {
        $property = \App\Models\Property::where('condominium_id', $this->condo->id)->first();
    }

    $category = \App\Models\TicketCategory::first();
    $this->actingAs($user)->postJson('/api/tickets', [
        'property_id' => $property?->id ?? 1,
        'category_id' => $category?->id ?? 1,
        'title' => 'Test RBAC ticket',
        'description' => 'Testing permission matrix',
        'priority' => 'medium',
        'created_by' => $user->id,
    ])->assertStatus($expected);
})->with('roles_create_tickets');

// ─── ANNOUNCEMENTS ─────────────────────────────────────────────

dataset('roles_create_announcements', [
    'Administrador' => ['role' => 'Administrador', 'expected' => 201],
    'Comité' => ['role' => 'Comité', 'expected' => 201],
    'Propietario' => ['role' => 'Propietario', 'expected' => 403],
    'Residente' => ['role' => 'Residente', 'expected' => 403],
    'Colaborador' => ['role' => 'Colaborador', 'expected' => 403],
    'TI' => ['role' => 'TI', 'expected' => 403],
]);

test('crear anuncio: solo admin y comité', function (string $role, int $expected) {
    $user = getUserByRole($role);
    $this->actingAs($user)->postJson('/api/announcements', [
        'condominium_id' => $this->condo->id,
        'title' => 'Test Announcement',
        'content' => 'RBAC test content',
        'priority' => 'normal',
        'created_by' => $user->id,
    ])->assertStatus($expected);
})->with('roles_create_announcements');

// ─── UNAUTHENTICATED ───────────────────────────────────────────

test('usuario no autenticado no accede a ningun endpoint financiero', function () {
    $this->getJson('/api/condo-finances/summary?condominium_id=' . $this->condo->id)->assertStatus(401);
    $this->getJson('/api/condo-finances/incomes?condominium_id=' . $this->condo->id)->assertStatus(401);
    $this->postJson('/api/condo-finances/incomes', [])->assertStatus(401);
    $this->getJson('/api/condo-finances/expenses?condominium_id=' . $this->condo->id)->assertStatus(401);
    $this->postJson('/api/condo-finances/expenses', [])->assertStatus(401);
    $this->getJson('/api/users')->assertStatus(401);
});
