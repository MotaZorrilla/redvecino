<?php

namespace Tests\Feature;

use App\Models\CommonExpensePeriod;
use App\Models\CommonExpenseReceipt;
use App\Models\Budget;
use App\Models\Condominium;
use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommonExpensePeriodPerformanceTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function generate_mass_billing_no_n_plus_one_queries()
    {
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);
        $this->seed(\Database\Seeders\DatabaseSeeder::class);

        $admin = User::where('email', 'admin@redvecino.cl')->first();
        $condo = Condominium::first();

        // Limpiar receipts previos de 2026-07 para test limpio
        $prevPeriodExisting = CommonExpensePeriod::where('condominium_id', $condo->id)
            ->where('period', '2026-07')
            ->first();
        if ($prevPeriodExisting) {
            CommonExpenseReceipt::where('period_id', $prevPeriodExisting->id)->delete();
        }

        // Asegurar que hay propiedades
        $properties = Property::where('condominium_id', $condo->id)->get();
        $this->assertGreaterThan(0, $properties->count(), 'Debe haber propiedades para testear');

        // Presupuesto aprobado requerido para emitir (motor exige Budget)
        Budget::updateOrCreate(
            ['condominium_id' => $condo->id, 'period' => '2026-08'],
            ['amount' => 5000000, 'status' => 'approved', 'approved_by' => $admin->id, 'approved_at' => now()],
        );

        // Crear un período previo con receipts pending para probar previous_balance
        $prevPeriod = CommonExpensePeriod::updateOrCreate(
            ['condominium_id' => $condo->id, 'period' => '2026-07'],
            [
                'status' => 'issued',
                'total_expenses' => 5000000,
                'reserve_fund_pct' => 5.00,
                'due_date' => '2026-07-25',
                'created_by' => $admin->id,
            ]
        );

        // Crear 2 receipts pending en el período anterior (para probar previous_balance)
        $props = $properties->take(2);
        foreach ($props as $prop) {
            CommonExpenseReceipt::create([
                'period_id' => $prevPeriod->id,
                'property_id' => $prop->id,
                'condominium_id' => $condo->id,
                'alicuota_pct' => 0.045,
                'base_amount' => 225000,
                'reserve_fund_amount' => 11250,
                'individual_consumption' => 0,
                'previous_balance' => 0,
                'interest_amount' => 0,
                'total_amount' => 236250,
                'due_date' => '2026-07-25',
                'status' => 'pending',
            ]);
        }

        // Contar queries ejecutadas
        $queryCount = 0;
        \DB::listen(function ($query) use (&$queryCount) {
            // Solo contar queries SELECT relevantes (no transacciones, no BEGIN/COMMIT)
            if (stripos($query->sql, 'select') === 0) {
                $queryCount++;
            }
        });

        // Ejecutar generateMassBilling
        $response = $this->actingAs($admin)
            ->postJson('/api/common-expense-periods/generate', [
                'condominium_id' => $condo->id,
                'period' => '2026-08',
                'due_date' => '2026-08-25',
                'reserve_fund_pct' => 5.00,
            ]);

        $response->assertStatus(201);

        // Verificar: máximo 3-4 queries SELECT esperadas para lógica de negocio + N para updateOrCreate:
        // 1. Condominium::findOrFail
        // 2. CondoExpense::where...->sum (totalExpenses)
        // 3. Property::where...->get (properties)
        // 4. CommonExpenseReceipt bulk load para previous_balance (1 query)
        // 5. N queries de updateOrCreate (1 SELECT por propiedad para upsert)
        // El N+1 del previous_balance DEBE estar eliminado (antes era 30+ queries extra)

        $propertyCount = $properties->count();
        // 8 base (auth/middleware/presupuesto/with) + 1 por propiedad (updateOrCreate) + margen
        $expectedMaxQueries = 8 + $propertyCount + 6;
        $this->assertLessThanOrEqual($expectedMaxQueries, $queryCount,
            "Se ejecutaron {$queryCount} queries SELECT. Esperado ≤ {$expectedMaxQueries} (8 base + {$propertyCount} updateOrCreate + margen). El bucle foreach NO debería hacer query extra por propiedad para previous_balance.");
    }

    /** @test */
    public function generate_mass_billing_previous_balance_correct()
    {
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);
        $this->seed(\Database\Seeders\DatabaseSeeder::class);

        $admin = User::where('email', 'admin@redvecino.cl')->first();
        $condo = Condominium::first();

        // Limpiar receipts previos de 2026-07 para test limpio
        $prevPeriodExisting = CommonExpensePeriod::where('condominium_id', $condo->id)
            ->where('period', '2026-07')
            ->first();
        if ($prevPeriodExisting) {
            CommonExpenseReceipt::where('period_id', $prevPeriodExisting->id)->delete();
        }

        // Período previo (2026-07) con 2 morosos
        $prevPeriod = CommonExpensePeriod::updateOrCreate(
            ['condominium_id' => $condo->id, 'period' => '2026-07'],
            [
                'status' => 'issued',
                'total_expenses' => 5000000,
                'reserve_fund_pct' => 5.00,
                'due_date' => '2026-07-25',
                'created_by' => $admin->id,
            ]
        );

        $properties = Property::where('condominium_id', $condo->id)->orderBy('id')->get();
        $morosos = $properties->take(2);

        // Presupuesto aprobado requerido para emitir (motor exige Budget)
        Budget::updateOrCreate(
            ['condominium_id' => $condo->id, 'period' => '2026-08'],
            ['amount' => 5000000, 'status' => 'approved', 'approved_by' => $admin->id, 'approved_at' => now()],
        );

        foreach ($morosos as $prop) {
            CommonExpenseReceipt::create([
                'period_id' => $prevPeriod->id,
                'property_id' => $prop->id,
                'condominium_id' => $condo->id,
                'alicuota_pct' => 0.045,
                'base_amount' => 225000,
                'reserve_fund_amount' => 11250,
                'individual_consumption' => 0,
                'previous_balance' => 0,
                'interest_amount' => 0,
                'total_amount' => 236250,
                'due_date' => '2026-07-25',
                'status' => 'pending', // Pendiente = moroso
            ]);
        }

        // Los demás pagados
        foreach ($properties->skip(2) as $prop) {
            CommonExpenseReceipt::create([
                'period_id' => $prevPeriod->id,
                'property_id' => $prop->id,
                'condominium_id' => $condo->id,
                'alicuota_pct' => 0.045,
                'base_amount' => 225000,
                'reserve_fund_amount' => 11250,
                'individual_consumption' => 0,
                'previous_balance' => 0,
                'interest_amount' => 0,
                'total_amount' => 236250,
                'due_date' => '2026-07-25',
                'status' => 'paid',
            ]);
        }

        // Generar período 2026-08
        $response = $this->actingAs($admin)
            ->postJson('/api/common-expense-periods/generate', [
                'condominium_id' => $condo->id,
                'period' => '2026-08',
                'due_date' => '2026-08-25',
                'reserve_fund_pct' => 5.00,
            ]);

        $response->assertStatus(201);

        $newPeriod = CommonExpensePeriod::where('condominium_id', $condo->id)
            ->where('period', '2026-08')
            ->first();

        $receipts = CommonExpenseReceipt::where('period_id', $newPeriod->id)
            ->with('property')
            ->get();

        // Verificar: 2 morosos deben tener previous_balance > 0
        $morososNuevos = $receipts->filter(fn($r) => $r->previous_balance > 0);
        $this->assertCount(2, $morososNuevos, 'Debe haber 2 propiedades con saldo anterior');

        foreach ($morososNuevos as $receipt) {
            $this->assertEquals(236250, $receipt->previous_balance, 'Saldo anterior debe ser el total del receipt pendiente anterior');
            // Interés = 236250 * 0.015 = 3543.75
            $this->assertEquals(3543.75, $receipt->interest_amount, 'Interés mora 1.5%');
            $this->assertEquals(236250 + 3543.75, $receipt->previous_balance + $receipt->interest_amount, 'Suma correcta');
        }

        // Verificar: propiedades al día deben tener previous_balance = 0
        $alDia = $receipts->filter(fn($r) => $r->previous_balance == 0);
        $this->assertCount($properties->count() - 2, $alDia);
    }
}