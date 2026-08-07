<?php

use App\Models\Budget;
use App\Models\CommonExpensePeriod;
use App\Models\Condominium;
use App\Models\CondoExpense;
use App\Models\Property;
use App\Models\User;
use Spatie\Permission\Models\Role;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    $this->seed();

    Role::findOrCreate('admin', 'web');
    Role::findOrCreate('comité', 'web');
    Role::findOrCreate('resident', 'web');
    Role::findOrCreate('TI', 'web');

    $this->condo = Condominium::create([
        'name' => 'Condominio Presupuesto Test',
        'address' => 'Av. Los Andes 100',
        'city' => 'Concepción',
        'region' => 'Biobío',
        'units_count' => 1,
        'status' => 'active',
    ]);

    $this->p1 = Property::create([
        'condominium_id' => $this->condo->id,
        'number' => '101',
        'type' => 'apartment',
        'block' => 'Torre A',
        'floor' => 1,
        'area_sqm' => 100.00,
        'status' => 'occupied',
        'coefficient' => 1.00,
    ]);

    $this->adminUser = User::factory()->create(['name' => 'Admin', 'email' => 'budget_admin@test.cl']);
    $this->adminUser->assignRole('admin');

    $this->comiteUser = User::factory()->create(['name' => 'Comité', 'email' => 'budget_comite@test.cl']);
    $this->comiteUser->assignRole('comité');

    $this->residentUser = User::factory()->create(['name' => 'Residente', 'email' => 'budget_resi@test.cl']);
    $this->residentUser->assignRole('resident');
});

describe('Entidad Budget — Presupuesto aprobado por asamblea', function () {

    it('el admin puede crear un presupuesto como borrador', function () {
        $response = $this->actingAs($this->adminUser)->postJson('/api/budgets', [
            'condominium_id' => $this->condo->id,
            'period' => '2026-08',
            'amount' => 6000000,
        ]);

        $response->assertStatus(201);
        $budget = Budget::where('condominium_id', $this->condo->id)->where('period', '2026-08')->first();
        expect($budget)->not->toBeNull();
        expect($budget->status)->toBe('draft');
        expect(floatval($budget->amount))->toEqual(6000000.0);
        expect($budget->approved_at)->toBeNull();
    });

    it('el residente NO puede crear presupuestos', function () {
        $response = $this->actingAs($this->residentUser)->postJson('/api/budgets', [
            'condominium_id' => $this->condo->id,
            'period' => '2026-08',
            'amount' => 6000000,
        ]);

        $response->assertStatus(403);
    });

    it('el comité aprueba el presupuesto registrando approved_by y approved_at', function () {
        $budget = Budget::create([
            'condominium_id' => $this->condo->id,
            'period' => '2026-08',
            'amount' => 6000000,
            'status' => 'draft',
        ]);

        $response = $this->actingAs($this->comiteUser)->patchJson("/api/budgets/{$budget->id}/approve");

        $response->assertStatus(200);
        $budget->refresh();
        expect($budget->status)->toBe('approved');
        expect($budget->approved_by)->toBe($this->comiteUser->id);
        expect($budget->approved_at)->not->toBeNull();
    });

    it('el residente NO puede aprobar presupuestos', function () {
        $budget = Budget::create([
            'condominium_id' => $this->condo->id,
            'period' => '2026-08',
            'amount' => 6000000,
            'status' => 'draft',
        ]);

        $response = $this->actingAs($this->residentUser)->patchJson("/api/budgets/{$budget->id}/approve");

        $response->assertStatus(403);
    });

    it('generateMassBilling falla 422 si no existe presupuesto aprobado para el período', function () {
        $response = $this->actingAs($this->adminUser)
            ->postJson('/api/common-expense-periods/generate', [
                'condominium_id' => $this->condo->id,
                'period' => '2026-08',
                'due_date' => '2026-08-25',
                'reserve_fund_pct' => 5.00,
            ]);

        $response->assertStatus(422);
        $response->assertJsonPath('message', 'Presupuesto no aprobado para el período 2026-08. Apruebe un presupuesto en asamblea antes de emitir.');
    });

    it('generateMassBilling usa Budget.amount como total de egresos cuando hay presupuesto aprobado', function () {
        // Aunque existan egresos por otro monto, el motor debe priorizar el presupuesto aprobado
        CondoExpense::create([
            'condominium_id' => $this->condo->id,
            'date' => '2026-08-10',
            'category' => 'remuneraciones',
            'subcategory' => 'Sueldos Personal',
            'amount' => 5000000.00,
        ]);

        $budget = Budget::create([
            'condominium_id' => $this->condo->id,
            'period' => '2026-08',
            'amount' => 6000000,
            'status' => 'draft',
        ]);
        $budget->approve_by($this->comiteUser->id);

        $response = $this->actingAs($this->adminUser)
            ->postJson('/api/common-expense-periods/generate', [
                'condominium_id' => $this->condo->id,
                'period' => '2026-08',
                'due_date' => '2026-08-25',
                'reserve_fund_pct' => 5.00,
            ]);

        $response->assertStatus(201);
        $period = CommonExpensePeriod::where('condominium_id', $this->condo->id)->where('period', '2026-08')->first();
        expect($period)->not->toBeNull();
        expect(floatval($period->total_expenses))->toEqual(6000000.00);

        // Alícuota 100% -> base = 6.000.000, FR = 6.000.000*0.05*1 = 300.000, total = 6.300.000
        $receipt = $period->receipts()->first();
        expect(floatval($receipt->base_amount))->toEqual(6000000.00);
        expect(floatval($receipt->reserve_fund_amount))->toEqual(300000.00);
        expect(floatval($receipt->total_amount))->toEqual(6300000.00);
    });

    it('el presupuesto de un condominio no es válido para otro (aislamiento multi-condominio)', function () {
        $condo2 = Condominium::create([
            'name' => 'Condominio Sin Presupuesto',
            'address' => 'Av. Los Andes 900',
            'city' => 'Concepción',
            'region' => 'Biobío',
            'units_count' => 1,
            'status' => 'active',
        ]);
        Property::create([
            'condominium_id' => $condo2->id,
            'number' => '1',
            'type' => 'apartment',
            'block' => 'Torre A',
            'floor' => 1,
            'area_sqm' => 100.00,
            'status' => 'occupied',
            'coefficient' => 1.00,
        ]);

        Budget::create([
            'condominium_id' => $this->condo->id,
            'period' => '2026-08',
            'amount' => 6000000,
            'status' => 'approved',
            'approved_at' => now(),
        ]);

        $response = $this->actingAs($this->adminUser)
            ->postJson('/api/common-expense-periods/generate', [
                'condominium_id' => $condo2->id,
                'period' => '2026-08',
                'due_date' => '2026-08-25',
            ]);

        $response->assertStatus(422);
    });
});