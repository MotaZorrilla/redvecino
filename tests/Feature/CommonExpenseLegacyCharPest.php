<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Condominium;
use App\Models\Property;
use App\Models\CondoExpense;
use App\Models\CommonExpense;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

/**
 * Tests de caracterización del contrato LEGACY de CommonExpense.
 * Fijan el comportamiento actual (generate/publish) para habilitar un refactor
 * seguro hacia CommonExpensePeriod sin romper consumidores existentes.
 */

beforeEach(function () {
    $this->seed();
    $this->admin = User::role('Administrador')->first();
    $this->condo = Condominium::first();

    Property::create([
        'condominium_id' => $this->condo->id,
        'type' => 'apartment',
        'number' => '101',
        'floor' => 1,
        'area_sqm' => 70,
        'status' => 'occupied',
    ]);

    CondoExpense::create([
        'condominium_id' => $this->condo->id,
        'amount' => 500000,
        'date' => '2026-09-15',
        'category' => 'Mantenimiento',
        'distributable_method' => 'prorated',
        'description' => 'Test Expense',
    ]);
});

it('rechaza publicar un periodo con total_amount negativo (422)', function () {
    $payload = [
        'condominium_id' => $this->condo->id,
        'period' => '2026-09',
        'due_date' => '2026-10-05',
        'total_amount' => -5,
    ];

    $this->actingAs($this->admin)
        ->postJson('/api/common-expenses/publish', $payload)
        ->assertStatus(422);
});

it('publicar dos veces el mismo periodo es idempotente (una sola fila)', function () {
    $payload = [
        'condominium_id' => $this->condo->id,
        'period' => '2026-09',
        'due_date' => '2026-10-05',
        'total_amount' => 123456,
    ];

    $this->actingAs($this->admin)->postJson('/api/common-expenses/publish', $payload)->assertStatus(200);
    $this->actingAs($this->admin)->postJson('/api/common-expenses/publish', $payload)->assertStatus(200);

    expect(CommonExpense::where('condominium_id', $this->condo->id)->where('period', '2026-09')->count())
        ->toBe(1);
});

it('generate devuelve el contrato: period, total>0 y bills poblados', function () {
    $response = $this->actingAs($this->admin)->postJson('/api/common-expenses/generate', [
        'condominium_id' => $this->condo->id,
        'period' => '2026-09',
    ]);

    $response->assertStatus(200);
    $data = $response->json();

    expect($data['period'])->toBe('2026-09')
        ->and($data['total_condo_expense'])->toBeGreaterThan(0)
        ->and($data['bills'])->not->toBeEmpty();
});

it('publish también materializa el periodo en el modelo unificado CommonExpensePeriod', function () {
    $payload = [
        'condominium_id' => $this->condo->id,
        'period' => '2026-09',
        'due_date' => '2026-10-05',
        'total_amount' => 123456,
    ];

    $this->actingAs($this->admin)->postJson('/api/common-expenses/publish', $payload)->assertStatus(200);

    $this->assertDatabaseHas('common_expense_periods', [
        'condominium_id' => $this->condo->id,
        'period' => '2026-09',
        'status' => 'issued',
    ]);

    $period = \App\Models\CommonExpensePeriod::where('condominium_id', $this->condo->id)
        ->where('period', '2026-09')->first();

    expect($period)->not->toBeNull()
        ->and((float) $period->total_expenses)->toBe(123456.0);
});