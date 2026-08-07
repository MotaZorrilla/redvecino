<?php

use App\Models\CommonExpensePeriod;
use App\Models\CommonExpenseReceipt;
use App\Models\Budget;
use App\Models\Condominium;
use App\Models\CondoExpense;
use App\Models\Property;
use App\Models\User;
use Spatie\Permission\Models\Role;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

describe('Fase 2: Motor Contable de Gastos Comunes y Emisión Masiva por Período (Pest v3)', function () {

    beforeEach(function () {
        $this->seed();
        // Crear Condominio Principal de Pruebas
        $this->condo = Condominium::create([
            'name' => 'Condominio Aires de Chiguayante II',
            'address' => 'Av. Manuel Rodríguez 1234',
            'city' => 'Chiguayante',
            'region' => 'Biobío',
            'postal_code' => '4100000',
            'units_count' => 5,
            'status' => 'active',
        ]);

        // Crear 5 Propiedades con m² y alícuotas
        $this->p1 = Property::create([
            'condominium_id' => $this->condo->id,
            'number' => '101',
            'type' => 'apartment',
            'block' => 'Torre A',
            'floor' => 1,
            'area_sqm' => 70.00,
            'status' => 'occupied',
        ]);

        $this->p2 = Property::create([
            'condominium_id' => $this->condo->id,
            'number' => '102',
            'type' => 'apartment',
            'block' => 'Torre A',
            'floor' => 1,
            'area_sqm' => 70.00,
            'status' => 'occupied',
        ]);

        $this->p3 = Property::create([
            'condominium_id' => $this->condo->id,
            'number' => '201',
            'type' => 'apartment',
            'block' => 'Torre A',
            'floor' => 2,
            'area_sqm' => 100.00,
            'status' => 'occupied',
        ]);

        $this->p4 = Property::create([
            'condominium_id' => $this->condo->id,
            'number' => '202',
            'type' => 'apartment',
            'block' => 'Torre A',
            'floor' => 2,
            'area_sqm' => 100.00,
            'status' => 'vacant',
        ]);

        $this->p5 = Property::create([
            'condominium_id' => $this->condo->id,
            'number' => 'PH-01',
            'type' => 'apartment',
            'block' => 'Torre A',
            'floor' => 3,
            'area_sqm' => 160.00,
            'status' => 'occupied',
        ]);

        // Roles RBAC
        Role::findOrCreate('Administrador', 'web');
        Role::findOrCreate('TI', 'web');
        Role::findOrCreate('Residente', 'web');

        $this->admin = User::factory()->create(['name' => 'Admin Test', 'email' => 'admin_ggcc@test.com']);
        $this->admin->assignRole('Administrador');

        $this->tiUser = User::factory()->create(['name' => 'TI Test', 'email' => 'ti_ggcc@test.com']);
        $this->tiUser->assignRole('TI');

        $this->residente = User::factory()->create(['name' => 'Residente Test', 'email' => 'resi_ggcc@test.com']);
        $this->residente->assignRole('Residente');
    });

    it('calcula y emite masivamente los cobros de gastos comunes aplicando las fórmulas de prorrateo chilenas (G + FR + C_ind)', function () {
        // Registrar Egresos del período por un total de $5.000.000
        CondoExpense::create([
            'condominium_id' => $this->condo->id,
            'date' => '2026-08-10',
            'category' => 'remuneraciones',
            'subcategory' => 'Sueldos Personal Conserjería',
            'amount' => 5000000.00,
            'description' => 'Personal de Conserjería',
        ]);

        // Presupuesto aprobado por asamblea requerido para emitir boletas
        Budget::create([
            'condominium_id' => $this->condo->id,
            'period' => '2026-08',
            'amount' => 5000000,
            'status' => 'approved',
            'approved_by' => $this->admin->id,
            'approved_at' => now(),
        ]);

        $response = $this->actingAs($this->admin)->postJson('/api/common-expense-periods/generate', [
            'condominium_id' => $this->condo->id,
            'period' => '2026-08',
            'due_date' => '2026-08-25',
            'reserve_fund_pct' => 5.00,
        ]);

        $response->assertStatus(201);
        $response->assertJsonPath('total_properties_billed', 5);

        // Verificar registro del período en la BD
        $periodRecord = CommonExpensePeriod::where('condominium_id', $this->condo->id)
            ->where('period', '2026-08')
            ->first();

        expect($periodRecord)->not->toBeNull();
        expect($periodRecord->status)->toBe('issued');
        expect(floatval($periodRecord->total_expenses))->toEqual(5000000.00);

        // Verificar desglose por unidad (Superficie total = 70 + 70 + 100 + 100 + 160 = 500 m²)
        // Para p3 (100 m² -> alícuota = 100/500 = 20.0000%)
        // G = $5.000.000 * 0.20 = $1.000.000
        // FR = ($5.000.000 * 0.05) * 0.20 = $250.000 * 0.20 = $50.000
        // Total = $1.050.000
        $receiptP3 = CommonExpenseReceipt::where('period_id', $periodRecord->id)
            ->where('property_id', $this->p3->id)
            ->first();

        expect($receiptP3)->not->toBeNull();
        expect(floatval($receiptP3->alicuota_pct))->toEqual(0.200000);
        expect(floatval($receiptP3->base_amount))->toEqual(1000000.00);
        expect(floatval($receiptP3->reserve_fund_amount))->toEqual(500000.00 * 0.10); // 50.000
        expect(floatval($receiptP3->total_amount))->toEqual(1050000.00);
    });

    it('exige un presupuesto aprobado y usa su monto cuando no hay egresos cargados', function () {
        // Presupuesto aprobado como fuente única del período
        Budget::create([
            'condominium_id' => $this->condo->id,
            'period' => '2026-09',
            'amount' => 3200000,
            'status' => 'approved',
            'approved_by' => $this->admin->id,
            'approved_at' => now(),
        ]);

        $response = $this->actingAs($this->admin)->postJson('/api/common-expense-periods/generate', [
            'condominium_id' => $this->condo->id,
            'period' => '2026-09',
        ]);

        $response->assertStatus(201);
        $periodRecord = CommonExpensePeriod::where('condominium_id', $this->condo->id)
            ->where('period', '2026-09')
            ->first();

        expect($periodRecord)->not->toBeNull();
        expect(floatval($periodRecord->total_expenses))->toEqual(3200000.00);
    });

    it('permite cerrar y auditar definitivamente un período contable mensual', function () {
        $periodRecord = CommonExpensePeriod::create([
            'condominium_id' => $this->condo->id,
            'period' => '2026-07',
            'status' => 'issued',
            'total_expenses' => 4500000.00,
            'reserve_fund_pct' => 5.00,
        ]);

        $response = $this->actingAs($this->admin)->postJson("/api/common-expense-periods/{$periodRecord->id}/close");

        $response->assertStatus(200);
        expect($periodRecord->fresh()->status)->toBe('closed');
    });

    it('restringe el acceso a la emisión de gastos comunes a usuarios no autenticados', function () {
        $response = $this->postJson('/api/common-expense-periods/generate', [
            'condominium_id' => $this->condo->id,
            'period' => '2026-08',
        ]);

        $response->assertStatus(401);
    });

});
