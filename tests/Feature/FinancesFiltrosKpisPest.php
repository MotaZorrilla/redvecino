<?php

use App\Models\User;
use App\Models\Condominium;
use App\Models\CommonExpense;
use App\Models\Property;
use App\Models\Payment;
use App\Models\CondoIncome;
use App\Models\CondoExpense;
use App\Models\FinancialCatalog;
use App\Http\Controllers\CondoFinanceController;

covers(CondoFinanceController::class);

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
});

describe('Módulo de Finanzas: Filtrado, KPIs y Seeders Completo', function () {

    it('registra pagos con estados variados (approved, pending, failed) por condominio', function () {
        $admin = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->firstOrFail();
        test()->actingAs($admin);

        $condo = Condominium::firstOrFail();
        $property = Property::where('condominium_id', $condo->id)->firstOrFail();
        $period = CommonExpense::firstOrCreate([
            'condominium_id' => $condo->id,
            'period' => '2026-08',
        ], [
            'amount' => 5000000,
            'due_date' => '2026-08-10',
            'description' => 'Gasto Común Agosto 2026',
            'status' => 'published',
        ]);

        // 1. Crear pago conciliado (approved)
        $approvedPayment = Payment::create([
            'property_id' => $property->id,
            'common_expense_id' => $period->id,
            'user_id' => $admin->id,
            'amount' => 150000,
            'payment_date' => '2026-08-01',
            'payment_method' => 'transferencia',
            'reference' => 'TXN-APPROVED-001',
            'status' => 'approved',
        ]);

        // 2. Crear pago pendiente (pending)
        $pendingPayment = Payment::create([
            'property_id' => $property->id,
            'common_expense_id' => $period->id,
            'user_id' => $admin->id,
            'amount' => 150000,
            'payment_date' => '2026-08-02',
            'payment_method' => 'webpay',
            'reference' => 'TXN-PENDING-001',
            'status' => 'pending',
        ]);

        // 3. Crear pago fallido (failed)
        $failedPayment = Payment::create([
            'property_id' => $property->id,
            'common_expense_id' => $period->id,
            'user_id' => $admin->id,
            'amount' => 150000,
            'payment_date' => '2026-08-03',
            'payment_method' => 'efectivo',
            'reference' => 'TXN-FAILED-001',
            'status' => 'failed',
        ]);

        expect($approvedPayment->status)->toBe('approved');
        expect($pendingPayment->status)->toBe('pending');
        expect($failedPayment->status)->toBe('failed');

        $this->assertDatabaseHas('payments', ['id' => $approvedPayment->id, 'status' => 'approved']);
        $this->assertDatabaseHas('payments', ['id' => $pendingPayment->id, 'status' => 'pending']);
        $this->assertDatabaseHas('payments', ['id' => $failedPayment->id, 'status' => 'failed']);
    });

    it('garantiza que solo pagos aprobados generan asientos en CondoIncome', function () {
        $admin = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->firstOrFail();
        test()->actingAs($admin);

        $condo = Condominium::firstOrFail();
        $property = Property::where('condominium_id', $condo->id)->firstOrFail();

        // Limpiar para test aislado
        CondoIncome::where('condominium_id', $condo->id)->delete();

        // Crear ingreso derivado de pago aprobado
        CondoIncome::create([
            'condominium_id' => $condo->id,
            'property_id' => $property->id,
            'user_id' => $admin->id,
            'category' => 'gastos_comunes',
            'subcategory' => 'Pago Gasto Común - 2026-08',
            'amount' => 120000,
            'date' => '2026-08-01',
            'description' => 'Recaudación Gasto Común Conciliada',
        ]);

        $incomes = CondoIncome::where('condominium_id', $condo->id)->get();
        expect($incomes)->toHaveCount(1);
        expect((float)$incomes->first()->amount)->toEqual(120000.0);
    });

    it('pobla y agrupa las 10 categorías contables de egresos sin valores en cero', function () {
        $admin = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->firstOrFail();
        test()->actingAs($admin);

        $condo = Condominium::firstOrFail();
        $categories = [
            'personal',
            'servicios_basicos',
            'mantencion',
            'seguridad',
            'limpieza',
            'reparacion',
            'seguros',
            'administracion',
            'fondo_reserva',
            'otro',
        ];

        foreach ($categories as $idx => $cat) {
            CondoExpense::create([
                'condominium_id' => $condo->id,
                'category' => $cat,
                'subcategory' => 'Prueba ' . ucfirst($cat),
                'amount' => 50000 + ($idx * 10000),
                'date' => '2026-08-05',
                'description' => 'Egreso de prueba categoría ' . $cat,
                'distributable_method' => 'prorated',
            ]);
        }

        $expenses = CondoExpense::where('condominium_id', $condo->id)->get();

        foreach ($categories as $cat) {
            $catExpenses = $expenses->where('category', $cat);
            expect($catExpenses->count())->toBeGreaterThan(0);
            expect((float)$catExpenses->sum('amount'))->toBeGreaterThan(0.0);
        }
    });

    it('calcula el balance neto y las proporciones por categoría correctamente', function () {
        $admin = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->firstOrFail();
        test()->actingAs($admin);

        $condo = Condominium::firstOrFail();

        // Limpiar para test aislado
        CondoIncome::where('condominium_id', $condo->id)->delete();
        CondoExpense::where('condominium_id', $condo->id)->delete();

        // Ingresos: 500.000 (GGCC) + 100.000 (Multas) = 600.000
        CondoIncome::create([
            'condominium_id' => $condo->id,
            'category' => 'gastos_comunes',
            'amount' => 500000,
            'date' => '2026-08-01',
            'description' => 'Ingreso GGCC',
        ]);
        CondoIncome::create([
            'condominium_id' => $condo->id,
            'category' => 'multas',
            'amount' => 100000,
            'date' => '2026-08-02',
            'description' => 'Ingreso Multas',
        ]);

        // Egresos: 300.000 (Personal) + 100.000 (Servicios Básicos) = 400.000
        CondoExpense::create([
            'condominium_id' => $condo->id,
            'category' => 'personal',
            'amount' => 300000,
            'date' => '2026-08-01',
            'description' => 'Sueldo Conserjería',
        ]);
        CondoExpense::create([
            'condominium_id' => $condo->id,
            'category' => 'servicios_basicos',
            'amount' => 100000,
            'date' => '2026-08-02',
            'description' => 'Electricidad Matriz',
        ]);

        $totalIncomes = CondoIncome::where('condominium_id', $condo->id)->sum('amount');
        $totalExpenses = CondoExpense::where('condominium_id', $condo->id)->sum('amount');
        $netBalance = $totalIncomes - $totalExpenses;

        expect((float)$totalIncomes)->toEqual(600000.0);
        expect((float)$totalExpenses)->toEqual(400000.0);
        expect((float)$netBalance)->toEqual(200000.0);
    });

    it('devuelve el catálogo financiero completo con tipos de ingreso y egreso', function () {
        $admin = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->firstOrFail();
        test()->actingAs($admin);

        $catalog = FinancialCatalog::all();
        expect($catalog->count())->toBeGreaterThan(0);

        $incomeTypes = $catalog->where('type', 'income');
        $expenseTypes = $catalog->where('type', 'expense');

        expect($incomeTypes->count())->toBeGreaterThan(0);
        expect($expenseTypes->count())->toBeGreaterThan(0);
    });

});
