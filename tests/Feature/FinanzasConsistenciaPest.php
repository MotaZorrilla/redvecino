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

dataset('boundary_amounts', [
    'cero' => ['amount' => 0, 'shouldPass' => false],
    'negativo' => ['amount' => -150000, 'shouldPass' => false],
    'decimal_valido' => ['amount' => 0.01, 'shouldPass' => true],
    'muy_grande' => ['amount' => 999999999.99, 'shouldPass' => true],
    'string' => ['amount' => 'no_un_numero', 'shouldPass' => false],
    'null' => ['amount' => null, 'shouldPass' => false],
    'negativo_pequeno' => ['amount' => -1, 'shouldPass' => false],
]);

test('crear income rechaza montos inválidos', function (mixed $amount, bool $shouldPass) {
    $response = $this->actingAs($this->admin)->postJson('/api/condo-finances/incomes', [
        'condominium_id' => $this->condo->id,
        'category' => 'arriendo_espacios',
        'subcategory' => 'Quinchos',
        'amount' => $amount,
        'date' => '2026-07-01',
    ]);

    if ($shouldPass) {
        $response->assertStatus(201);
    } else {
        $response->assertStatus(422);
        $response->assertJsonValidationErrors('amount');
    }
})->with('boundary_amounts');

test('crear expense rechaza montos inválidos', function (mixed $amount, bool $shouldPass) {
    $response = $this->actingAs($this->admin)->postJson('/api/condo-finances/expenses', [
        'condominium_id' => $this->condo->id,
        'category' => 'personal',
        'subcategory' => 'Conserjes',
        'amount' => $amount,
        'date' => '2026-07-01',
    ]);

    if ($shouldPass) {
        $response->assertStatus(201);
    } else {
        $response->assertStatus(422);
        $response->assertJsonValidationErrors('amount');
    }
})->with('boundary_amounts');

dataset('invalid_categories', [
    'categoria_inexistente' => ['category' => 'zz_categoria_falsa'],
    'subcategoria_valida_categoria_invalida' => ['category' => 'otra_inventada'],
    'vacio' => ['category' => ''],
    'numerico' => ['category' => 12345],
]);

test('rechaza incomes con categoría inválida', function (mixed $category) {
    $this->actingAs($this->admin)->postJson('/api/condo-finances/incomes', [
        'condominium_id' => $this->condo->id,
        'category' => $category,
        'subcategory' => 'Quinchos',
        'amount' => 50000,
        'date' => '2026-07-01',
    ])->assertStatus(422)->assertJsonValidationErrors('category');
})->with('invalid_categories');

test('rechaza incomes con subcategoría inválida para cada categoría', function () {
    // Get categories dynamically inside the test, not in a dataset (prevents app() call at class load)
    $catalog = app(CondoFinanceService::class)->getCatalog()['incomes'];
    foreach ($catalog as $key => $entry) {
        if (!empty($entry['subcategories'])) {
            $this->actingAs($this->admin)->postJson('/api/condo-finances/incomes', [
                'condominium_id' => $this->condo->id,
                'category' => $key,
                'subcategory' => '__no_existe__',
                'amount' => 50000,
                'date' => '2026-07-01',
            ])->assertStatus(422)->assertJsonValidationErrors('subcategory');
        }
    }
});

test('income sin subcategoría opcional funciona', function () {
    $this->actingAs($this->admin)->postJson('/api/condo-finances/incomes', [
        'condominium_id' => $this->condo->id,
        'category' => 'gastos_comunes',
        'amount' => 100000,
        'date' => '2026-07-01',
    ])->assertStatus(201);
});

test('crear income y luego leerlo devuelve los mismos datos', function () {
    $createResponse = $this->actingAs($this->admin)->postJson('/api/condo-finances/incomes', [
        'condominium_id' => $this->condo->id,
        'category' => 'arriendo_espacios',
        'subcategory' => 'Quinchos',
        'amount' => 75000,
        'date' => '2026-07-15',
        'description' => 'Test consistencia',
    ])->assertStatus(201);

    $createdId = $createResponse->json('id');
    $this->assertNotNull($createdId);

    $incomes = $this->actingAs($this->admin)->json('GET', '/api/condo-finances/incomes', [
        'condominium_id' => $this->condo->id,
    ])->assertStatus(200);

    $found = collect($incomes->json('data'))->firstWhere('id', $createdId);
    $this->assertNotNull($found);
    $this->assertEquals(75000, $found['amount']);
    $this->assertEquals('arriendo_espacios', $found['category']);
});

test('crear expense genera common_expense automáticamente', function () {
    $response = $this->actingAs($this->admin)->postJson('/api/condo-finances/expenses', [
        'condominium_id' => $this->condo->id,
        'category' => 'personal',
        'subcategory' => 'Conserjes',
        'amount' => 500000,
        'date' => '2026-07-01',
    ])->assertStatus(201);

    $this->assertNotNull($response->json('common_expense_id'));
    $this->assertDatabaseHas('common_expenses', [
        'id' => $response->json('common_expense_id'),
        'condominium_id' => $this->condo->id,
    ]);
});

test('resumen financiero tiene estructura correcta incluso sin datos', function () {
    // Crear un condominio nuevo sin transacciones
    $emptyCondo = Condominium::factory()->create();

    $summary = $this->actingAs($this->admin)->json('GET', '/api/condo-finances/summary', [
        'condominium_id' => $emptyCondo->id,
    ])->assertStatus(200)->json();

    expect($summary)->toHaveKeys(['total_incomes', 'total_expenses', 'balance', 'incomes_by_category', 'expenses_by_category']);
    expect($summary['total_incomes'])->toBe(0);
    expect($summary['total_expenses'])->toBe(0);
    expect($summary['balance'])->toBe(0);
    expect($summary['incomes_by_category'])->toBe([]);
    expect($summary['expenses_by_category'])->toBe([]);
});

test('eliminar income no afecta otros incomes', function () {
    $r1 = $this->actingAs($this->admin)->postJson('/api/condo-finances/incomes', [
        'condominium_id' => $this->condo->id,
        'category' => 'arriendo_espacios',
        'subcategory' => 'Quinchos',
        'amount' => 10000,
        'date' => '2026-07-01',
    ])->assertStatus(201);

    $r2 = $this->actingAs($this->admin)->postJson('/api/condo-finances/incomes', [
        'condominium_id' => $this->condo->id,
        'category' => 'multas',
        'subcategory' => 'Ruidos molestos',
        'amount' => 20000,
        'date' => '2026-07-02',
    ])->assertStatus(201);

    $id1 = $r1->json('id');
    $id2 = $r2->json('id');

    $this->actingAs($this->admin)->deleteJson("/api/condo-finances/incomes/{$id1}")->assertStatus(200);

    $this->assertDatabaseMissing('condo_incomes', ['id' => $id1]);
    $this->assertDatabaseHas('condo_incomes', ['id' => $id2, 'amount' => 20000]);
});

test('actualizar expense recalcula common_expense correctamente', function () {
    $expense = $this->actingAs($this->admin)->postJson('/api/condo-finances/expenses', [
        'condominium_id' => $this->condo->id,
        'category' => 'servicios_basicos',
        'subcategory' => 'Agua',
        'amount' => 100000,
        'date' => '2026-07-01',
    ])->assertStatus(201)->json();

    $commonExpenseId = $expense['common_expense_id'];

    $this->actingAs($this->admin)->putJson("/api/condo-finances/expenses/{$expense['id']}", [
        'category' => 'servicios_basicos',
        'subcategory' => 'Agua',
        'amount' => 200000,
        'date' => '2026-07-01',
    ])->assertStatus(200);

    $this->assertDatabaseHas('common_expenses', [
        'id' => $commonExpenseId,
        'amount' => 200000,
    ]);
});

test('no se puede crear income sin condominium_id', function () {
    $this->actingAs($this->admin)->postJson('/api/condo-finances/incomes', [
        'category' => 'arriendo_espacios',
        'amount' => 50000,
        'date' => '2026-07-01',
    ])->assertStatus(422)->assertJsonValidationErrors('condominium_id');
});

test('no se puede crear expense con condominium_id inexistente', function () {
    $this->actingAs($this->admin)->postJson('/api/condo-finances/expenses', [
        'condominium_id' => 999999,
        'category' => 'personal',
        'amount' => 50000,
        'date' => '2026-07-01',
    ])->assertStatus(422)->assertJsonValidationErrors('condominium_id');
});

test('actualizar income a monto cero es rechazado', function () {
    $income = $this->actingAs($this->admin)->postJson('/api/condo-finances/incomes', [
        'condominium_id' => $this->condo->id,
        'category' => 'arriendo_espacios',
        'subcategory' => 'Quinchos',
        'amount' => 50000,
        'date' => '2026-07-01',
    ])->assertStatus(201)->json();

    $this->actingAs($this->admin)->putJson("/api/condo-finances/incomes/{$income['id']}", [
        'category' => 'arriendo_espacios',
        'amount' => 0,
        'date' => '2026-07-01',
    ])->assertStatus(422)->assertJsonValidationErrors('amount');
});
