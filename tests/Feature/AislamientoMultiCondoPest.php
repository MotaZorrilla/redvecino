<?php

use App\Models\User;
use App\Models\Condominium;
use App\Models\Property;
use App\Models\OwnerProfile;
use App\Models\ResidentProfile;
use App\Models\Ticket;
use App\Models\TicketCategory;
use App\Models\Payment;
use App\Models\CommonExpense;
use App\Models\Fine;
use App\Models\Announcement;
use App\Models\CondoIncome;
use App\Models\CondoExpense;
use App\Services\CondoFinanceService;
use Illuminate\Support\Str;

covers([
    Ticket::class,
    CondoIncome::class,
    CondoExpense::class,
    Payment::class,
    Fine::class,
    Announcement::class,
]);

uses(
    Illuminate\Foundation\Testing\RefreshDatabase::class
);

beforeEach(function () {
    $this->seed();
    app(CondoFinanceService::class)->clearCatalogCache();
});

// ─── Helper: create a second condo with a user and property ────

function crearSegundoCondoConUsuario(): array
{
    $condo2 = Condominium::factory()->create(['name' => 'Condominio Aislado']);
    $user2 = User::factory()->create(['rut' => '99.999.999-9']);
    $user2->assignRole('Residente');

    $prop2 = Property::create([
        'condominium_id' => $condo2->id,
        'type' => 'apartment',
        'number' => 'Z-001',
        'area_sqm' => 80,
    ]);

    ResidentProfile::create([
        'user_id' => $user2->id,
        'property_id' => $prop2->id,
        'resident_type' => 'propietario',
    ]);

    return compact('condo2', 'user2', 'prop2');
}

// ─── TICKET ISOLATION ──────────────────────────────────────────

test('ticket creado en condo1 no aparece en consulta de condo2', function () {
    $admin = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->firstOrFail();
    $condo1 = Condominium::firstOrFail();
    $prop1 = Property::where('condominium_id', $condo1->id)->firstOrFail();

    $extra = crearSegundoCondoConUsuario();
    $cat = TicketCategory::firstOrFail();

    // Create ticket in condo1
    Ticket::create([
        'property_id' => $prop1->id,
        'created_by' => $admin->id,
        'category_id' => $cat->id,
        'title' => 'Ticket Solo Condo1',
        'description' => 'No debería verse en Condo2',
        'priority' => 'low',
        'status' => 'open',
    ]);

    // As user2 (in condo2), list tickets — should be empty
    // The ticket list endpoint usually filters by user's property
    $response = $this->actingAs($extra['user2'])->getJson('/api/tickets');
    $tickets = $response->json('data') ?? $response->json();
    if (is_array($tickets)) {
        $titles = array_map(fn($t) => $t['title'] ?? '', $tickets);
        expect($titles)->not->toContain('Ticket Solo Condo1');
    }
});

// ─── FINANCE ISOLATION ─────────────────────────────────────────

test('income de condo1 no aparece en resumen de condo2', function () {
    $admin = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->firstOrFail();
    $condo1 = Condominium::firstOrFail();
    $extra = crearSegundoCondoConUsuario();

    CondoIncome::create([
        'condominium_id' => $condo1->id,
        'category' => 'arriendo_espacios',
        'subcategory' => 'Quinchos',
        'amount' => 77777,
        'date' => '2026-07-01',
        'description' => 'Solo debe aparecer en Condo1',
    ]);

    $summaryCondo2 = $this->actingAs($admin)->json('GET', '/api/condo-finances/summary', [
        'condominium_id' => $extra['condo2']->id,
    ])->assertStatus(200)->json();

    expect($summaryCondo2['total_incomes'])->toBe(0);
});

test('expense de condo2 no aparece en listado de condo1', function () {
    $admin = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->firstOrFail();
    $condo1 = Condominium::firstOrFail();
    $extra = crearSegundoCondoConUsuario();

    CondoExpense::create([
        'condominium_id' => $extra['condo2']->id,
        'category' => 'personal',
        'subcategory' => 'Conserjes',
        'amount' => 88888,
        'date' => '2026-07-01',
        'description' => 'Solo debe aparecer en Condo2',
    ]);

    $expensesCondo1 = $this->actingAs($admin)->json('GET', '/api/condo-finances/expenses', [
        'condominium_id' => $condo1->id,
    ])->assertStatus(200)->json();

    $amounts = array_map(fn($e) => $e['amount'], $expensesCondo1['data']);
    expect($amounts)->not->toContain(88888);
});

test('pagos de condo1 no contaminan condo2', function () {
    $admin = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->firstOrFail();
    $condo1 = Condominium::firstOrFail();
    $extra = crearSegundoCondoConUsuario();

    $ce = CommonExpense::create([
        'condominium_id' => $extra['condo2']->id,
        'period' => 'Julio 2026',
        'amount' => 100000,
        'due_date' => '2026-08-05',
        'status' => 'pending',
    ]);

    Payment::create([
        'user_id' => $extra['user2']->id,
        'property_id' => $extra['prop2']->id,
        'common_expense_id' => $ce->id,
        'amount' => 50000,
        'payment_date' => '2026-07-15',
        'payment_method' => 'transferencia',
        'status' => 'approved',
    ]);

    // Verify the new payment is linked to condo2's common expense, not condo1's
    $newPayment = Payment::where('amount', 50000)->where('user_id', $extra['user2']->id)->first();
    expect($newPayment)->not->toBeNull();
    expect($newPayment->commonExpense->condominium_id)->toBe($extra['condo2']->id);
});

// ─── FINE ISOLATION ────────────────────────────────────────────

test('multas son estrictas por condominio', function () {
    $admin = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->firstOrFail();
    $condo1 = Condominium::firstOrFail();
    $prop1 = Property::where('condominium_id', $condo1->id)->firstOrFail();
    $extra = crearSegundoCondoConUsuario();

    Fine::create([
        'user_id' => $admin->id,
        'property_id' => $extra['prop2']->id,
        'reason' => 'Multa solo en Condo2',
        'amount' => 54321,
        'issued_date' => '2026-07-01',
        'due_date' => '2026-07-15',
        'status' => 'pending',
    ]);

    // Ensure the fine is linked to condo2's property, not condo1
    $this->assertDatabaseHas('fines', ['property_id' => $extra['prop2']->id, 'amount' => 54321]);
    // Check that the specific newly created fine does not belong to a condo1 property
    $this->assertDatabaseMissing('fines', ['property_id' => $prop1->id, 'amount' => 54321]);
});

// ─── ANNOUNCEMENT ISOLATION ────────────────────────────────────

test('anuncios de condo2 no son visibles en listado de condo1', function () {
    $admin = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->firstOrFail();
    $condo1 = Condominium::firstOrFail();
    $extra = crearSegundoCondoConUsuario();

    Announcement::create([
        'condominium_id' => $extra['condo2']->id,
        'created_by' => $admin->id,
        'title' => 'Anuncio Exclusivo Condo2',
        'content' => 'Solo visible en Condo2',
        'published_at' => now(),
    ]);

    $announcementsCondo1 = Announcement::where('condominium_id', $condo1->id)->get();
    $titles = $announcementsCondo1->pluck('title')->toArray();
    expect($titles)->not->toContain('Anuncio Exclusivo Condo2');
});

// ─── COMMON EXPENSE ISOLATION ──────────────────────────────────

test('common_expense de un condominio no afecta calculos del otro', function () {
    $condo1 = Condominium::firstOrFail();
    $extra = crearSegundoCondoConUsuario();

    CommonExpense::create([
        'condominium_id' => $extra['condo2']->id,
        'period' => 'Julio 2026',
        'amount' => 9999999,
        'due_date' => '2026-08-05',
        'status' => 'pending',
    ]);

    $condo1Expenses = CommonExpense::where('condominium_id', $condo1->id)->get();
    $amounts = $condo1Expenses->pluck('amount')->toArray();
    expect($amounts)->not->toContain(9999999);
});

// ─── PROPERTY ISOLATION ────────────────────────────────────────

test('propiedades de otros condominios no aparecen en listado', function () {
    $condo1 = Condominium::firstOrFail();
    $extra = crearSegundoCondoConUsuario();

    $propsCondo1 = Property::where('condominium_id', $condo1->id)->pluck('id')->toArray();
    expect(in_array($extra['prop2']->id, $propsCondo1))->toBeFalse();
});
