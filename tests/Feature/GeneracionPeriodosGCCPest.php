<?php

use App\Models\User;
use App\Models\Condominium;
use App\Models\Property;
use App\Models\CommonExpense;
use App\Models\Payment;
use App\Models\CondoExpense;
use App\Http\Controllers\CommonExpenseController;

covers(CommonExpenseController::class);

uses(
    Illuminate\Foundation\Testing\RefreshDatabase::class
);

beforeEach(function () {
    $this->seed();
});

// ─── HELPERS ──────────────────────────────────────────────────

function gcAdmin(): User
{
    $admin = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->firstOrFail();
    test()->actingAs($admin);
    return $admin;
}

function gcResidente(): User
{
    $user = User::whereHas('roles', fn($q) => $q->where('name', 'Residente'))->firstOrFail();
    test()->actingAs($user);
    return $user;
}

// ─── GENERACIÓN DE PERÍODO ────────────────────────────────────

describe('Generación de Período de Gastos Comunes', function () {

    test('admin puede generar el período de GGCC vía API', function () {
        gcAdmin();
        $condo = Condominium::firstOrFail();

        $response = $this->postJson('/api/common-expenses/generate', [
            'condominium_id' => $condo->id,
            'period'         => '2026-08',
        ]);

        $response->assertStatus(200);
        $data = $response->json();
        expect($data)->toHaveKey('bills');
        expect($data)->toHaveKey('condominium_id');
        expect($data)->toHaveKey('period');
        expect($data['period'])->toBe('2026-08');
    });

    test('la respuesta incluye una boleta por cada propiedad del condominio', function () {
        gcAdmin();
        $condo = Condominium::firstOrFail();
        $propertyCount = Property::where('condominium_id', $condo->id)->count();

        $response = $this->postJson('/api/common-expenses/generate', [
            'condominium_id' => $condo->id,
            'period'         => '2026-08',
        ]);

        $response->assertStatus(200);
        expect(count($response->json('bills')))->toBe($propertyCount);
    });

    test('cada boleta contiene property_id, property_number y total_to_pay', function () {
        gcAdmin();
        $condo = Condominium::firstOrFail();

        $response = $this->postJson('/api/common-expenses/generate', [
            'condominium_id' => $condo->id,
            'period'         => '2026-08',
        ]);

        $response->assertStatus(200);
        $firstBill = $response->json('bills.0');
        expect($firstBill)->toHaveKey('property_id');
        expect($firstBill)->toHaveKey('property_number');
        expect($firstBill)->toHaveKey('total_to_pay');
        expect($firstBill)->toHaveKey('details');
    });

    test('la generación falla con condominium_id inexistente', function () {
        gcAdmin();

        $this->postJson('/api/common-expenses/generate', [
            'condominium_id' => 99999,
            'period'         => '2026-08',
        ])->assertStatus(422);
    });

    test('la generación falla sin period', function () {
        gcAdmin();
        $condo = Condominium::firstOrFail();

        $this->postJson('/api/common-expenses/generate', [
            'condominium_id' => $condo->id,
        ])->assertStatus(422);
    });

    test('residente no puede generar períodos de GGCC', function () {
        gcResidente();
        $condo = Condominium::firstOrFail();

        $this->postJson('/api/common-expenses/generate', [
            'condominium_id' => $condo->id,
            'period'         => '2026-08',
        ])->assertStatus(403);
    });

    test('usuario no autenticado no puede generar períodos', function () {
        $condo = Condominium::firstOrFail();

        $this->postJson('/api/common-expenses/generate', [
            'condominium_id' => $condo->id,
            'period'         => '2026-08',
        ])->assertStatus(401);
    });

});

// ─── PUBLICACIÓN DE PERÍODO ───────────────────────────────────

describe('Publicación de Período de Gastos Comunes', function () {

    test('admin puede publicar un período vía API', function () {
        gcAdmin();
        $condo = Condominium::firstOrFail();

        $response = $this->postJson('/api/common-expenses/publish', [
            'condominium_id' => $condo->id,
            'period'         => '2026-09',
            'due_date'       => '2026-09-10',
            'total_amount'   => 5000000,
        ]);

        $response->assertStatus(200);
        expect($response->json('common_expense.status'))->toBe('published');
    });

    test('el período publicado queda guardado en base de datos', function () {
        gcAdmin();
        $condo = Condominium::firstOrFail();

        $this->postJson('/api/common-expenses/publish', [
            'condominium_id' => $condo->id,
            'period'         => '2026-10',
            'due_date'       => '2026-10-10',
            'total_amount'   => 3500000,
        ])->assertStatus(200);

        $this->assertDatabaseHas('common_expenses', [
            'condominium_id' => $condo->id,
            'period'         => '2026-10',
            'status'         => 'published',
        ]);
    });

    test('publicar el mismo período dos veces actualiza el registro (updateOrCreate)', function () {
        gcAdmin();
        $condo = Condominium::firstOrFail();

        $this->postJson('/api/common-expenses/publish', [
            'condominium_id' => $condo->id,
            'period'         => '2026-11',
            'due_date'       => '2026-11-10',
            'total_amount'   => 1000000,
        ])->assertStatus(200);

        $this->postJson('/api/common-expenses/publish', [
            'condominium_id' => $condo->id,
            'period'         => '2026-11',
            'due_date'       => '2026-11-15',
            'total_amount'   => 2000000,
        ])->assertStatus(200);

        // Solo debe existir 1 registro para ese período
        expect(CommonExpense::where('condominium_id', $condo->id)->where('period', '2026-11')->count())->toBe(1);
    });

    test('publicar sin due_date falla con 422', function () {
        gcAdmin();
        $condo = Condominium::firstOrFail();

        $this->postJson('/api/common-expenses/publish', [
            'condominium_id' => $condo->id,
            'period'         => '2026-12',
            'total_amount'   => 1000000,
        ])->assertStatus(422);
    });

    test('publicar con monto negativo falla con 422', function () {
        gcAdmin();
        $condo = Condominium::firstOrFail();

        $this->postJson('/api/common-expenses/publish', [
            'condominium_id' => $condo->id,
            'period'         => '2026-12',
            'due_date'       => '2026-12-10',
            'total_amount'   => -100,
        ])->assertStatus(422);
    });

    test('residente no puede publicar períodos de GGCC', function () {
        gcResidente();
        $condo = Condominium::firstOrFail();

        $this->postJson('/api/common-expenses/publish', [
            'condominium_id' => $condo->id,
            'period'         => '2026-08',
            'due_date'       => '2026-08-10',
            'total_amount'   => 1000000,
        ])->assertStatus(403);
    });

    test('el total_condo_expense de la respuesta de generación es la suma de todas las boletas', function () {
        gcAdmin();
        $condo = Condominium::firstOrFail();

        $response = $this->postJson('/api/common-expenses/generate', [
            'condominium_id' => $condo->id,
            'period'         => '2026-08',
        ])->assertStatus(200);

        $bills = $response->json('bills');
        $sumBills = array_sum(array_column($bills, 'total_to_pay'));
        expect($response->json('total_condo_expense'))->toEqual($sumBills);
    });

});
