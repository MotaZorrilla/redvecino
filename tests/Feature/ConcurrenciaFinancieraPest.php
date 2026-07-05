<?php

use App\Models\User;
use App\Models\Condominium;
use App\Services\CondoFinanceService;

covers(CondoFinanceService::class);

uses(
    Illuminate\Foundation\Testing\RefreshDatabase::class
);

beforeEach(function () {
    $this->seed();
    app(CondoFinanceService::class)->clearCatalogCache();
    $this->admin = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->firstOrFail();
    $this->condo = Condominium::firstOrFail();
});

test('crear income repetidamente no falla', function () {
    $response = $this->actingAs($this->admin)->postJson('/api/condo-finances/incomes', [
        'condominium_id' => $this->condo->id,
        'category' => 'arriendo_espacios',
        'subcategory' => 'Quinchos',
        'amount' => 50000,
        'date' => '2026-07-01',
    ]);

    $response->assertStatus(201);
})->repeat(5);

test('crear expense repetidamente no falla', function () {
    $response = $this->actingAs($this->admin)->postJson('/api/condo-finances/expenses', [
        'condominium_id' => $this->condo->id,
        'category' => 'personal',
        'subcategory' => 'Conserjes',
        'amount' => 300000,
        'date' => '2026-07-01',
    ]);

    $response->assertStatus(201);
    expect($response->json('common_expense_id'))->not->toBeNull();
})->repeat(5);

test('crear y eliminar income repetidamente mantiene consistencia', function () {
    // Create
    $createResponse = $this->actingAs($this->admin)->postJson('/api/condo-finances/incomes', [
        'condominium_id' => $this->condo->id,
        'category' => 'multas',
        'subcategory' => 'Ruidos molestos',
        'amount' => 25000,
        'date' => '2026-07-01',
    ])->assertStatus(201);

    $id = $createResponse->json('id');

    // Read
    $this->actingAs($this->admin)->json('GET', '/api/condo-finances/incomes', [
        'condominium_id' => $this->condo->id,
    ])->assertStatus(200);

    // Delete
    $this->actingAs($this->admin)->deleteJson("/api/condo-finances/incomes/{$id}")->assertStatus(200);

    // Verify gone
    $this->assertDatabaseMissing('condo_incomes', ['id' => $id]);
})->repeat(3);

test('crear expense mismo periodo agrupa en mismo common_expense', function () {
    $r1 = $this->actingAs($this->admin)->postJson('/api/condo-finances/expenses', [
        'condominium_id' => $this->condo->id,
        'category' => 'servicios_basicos',
        'subcategory' => 'Agua',
        'amount' => 100000,
        'date' => '2026-07-15',
    ])->assertStatus(201);

    $r2 = $this->actingAs($this->admin)->postJson('/api/condo-finances/expenses', [
        'condominium_id' => $this->condo->id,
        'category' => 'servicios_basicos',
        'subcategory' => 'Electricidad',
        'amount' => 200000,
        'date' => '2026-07-20',
    ])->assertStatus(201);

    // Both expenses in "Julio 2026" should share the same CommonExpense
    expect($r1->json('common_expense_id'))->toEqual($r2->json('common_expense_id'));

    // Common expense amount should be sum of both items
    $commonExpense = \App\Models\CommonExpense::find($r1->json('common_expense_id'));
    expect($commonExpense->amount)->toBe(300000);
})->repeat(3);

test('actualizar income concurrentemente preserva ultimo valor', function () {
    $income = $this->actingAs($this->admin)->postJson('/api/condo-finances/incomes', [
        'condominium_id' => $this->condo->id,
        'category' => 'arriendo_espacios',
        'subcategory' => 'Quinchos',
        'amount' => 50000,
        'date' => '2026-07-01',
    ])->assertStatus(201)->json();

    $id = $income['id'];
    $newAmount = fake()->numberBetween(1000, 999999);

    $this->actingAs($this->admin)->putJson("/api/condo-finances/incomes/{$id}", [
        'category' => 'arriendo_espacios',
        'subcategory' => 'Quinchos',
        'amount' => $newAmount,
        'date' => '2026-07-01',
    ])->assertStatus(200);

    $this->assertDatabaseHas('condo_incomes', ['id' => $id, 'amount' => $newAmount]);
})->repeat(3);

test('quorum con crecimiento de propiedades: nuevas propiedades no rompen calculo', function () {
    // Create more properties to increase total count
    for ($i = 0; $i < 5; $i++) {
        \App\Models\Property::create([
            'condominium_id' => $this->condo->id,
            'type' => 'apartment',
            'number' => "GROWTH-{$i}",
            'area_sqm' => 100,
            'coefficient' => 0.05,
        ]);
    }

    $prop = \App\Models\Property::where('condominium_id', $this->condo->id)->firstOrFail();

    $response = $this->actingAs($this->admin)->postJson('/api/quorum-calculation', [
        'condominium_id' => $this->condo->id,
        'attendees' => [$prop->id],
    ]);

    $response->assertStatus(200);
    expect($response->json('has_quorum'))->toBeBool();
    expect($response->json('total_units'))->toBeGreaterThanOrEqual(6);
})->repeat(3);

test('operaciones CRUD completas en incomes no dejan estado inconsistente', function () {
    $income = $this->actingAs($this->admin)->postJson('/api/condo-finances/incomes', [
        'condominium_id' => $this->condo->id,
        'category' => 'arriendo_espacios',
        'subcategory' => 'Quinchos',
        'amount' => 30000,
        'date' => '2026-07-01',
    ])->assertStatus(201)->json();

    $this->actingAs($this->admin)->putJson("/api/condo-finances/incomes/{$income['id']}", [
        'category' => 'multas',
        'subcategory' => 'Ruidos molestos',
        'amount' => 45000,
        'date' => '2026-07-02',
    ])->assertStatus(200);

    $this->actingAs($this->admin)->deleteJson("/api/condo-finances/incomes/{$income['id']}")->assertStatus(200);

    $this->assertDatabaseMissing('condo_incomes', ['id' => $income['id']]);
})->repeat(3);

test('catalogo financiaro siempre disponible tras operaciones', function () {
    // Perform some operations
    $this->actingAs($this->admin)->postJson('/api/condo-finances/incomes', [
        'condominium_id' => $this->condo->id,
        'category' => 'arriendo_espacios',
        'subcategory' => 'Quinchos',
        'amount' => 50000,
        'date' => '2026-07-01',
    ])->assertStatus(201);

    // Catalog should still work
    $catalog = $this->actingAs($this->admin)->getJson('/api/condo-finances/catalog')->assertStatus(200)->json();
    expect($catalog)->toHaveKeys(['incomes', 'expenses']);
    expect($catalog['incomes'])->not->toBeEmpty();
    expect($catalog['expenses'])->not->toBeEmpty();
})->repeat(3);
