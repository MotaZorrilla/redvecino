<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Condominium;
use App\Models\Property;
use App\Models\CommonExpense;
use App\Models\ExpenseItem;
use App\Models\CondoIncome;
use App\Models\CondoExpense;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CondoFinancesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    private function getUserByRole(string $roleName): User
    {
        return User::whereHas('roles', function($q) use ($roleName) {
            $q->where('name', $roleName);
        })->first();
    }

    public function test_admin_can_view_finance_summary(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $condo = Condominium::first();

        $response = $this->actingAs($admin)->json('GET', '/api/condo-finances/summary', [
            'condominium_id' => $condo->id,
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'total_incomes', 'total_expenses', 'balance',
            'incomes_by_category', 'expenses_by_category',
        ]);
    }

    public function test_non_admin_cannot_access_finance(): void
    {
        $resident = $this->getUserByRole('Residente');
        $condo = Condominium::first();

        $response = $this->actingAs($resident)->getJson('/api/condo-finances/summary', [
            'condominium_id' => $condo->id,
        ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_create_income(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $condo = Condominium::first();

        $response = $this->actingAs($admin)->postJson('/api/condo-finances/incomes', [
            'condominium_id' => $condo->id,
            'category' => 'arriendo_espacios',
            'subcategory' => 'Arriendo Quincho',
            'amount' => 50000,
            'date' => '2026-06-01',
            'description' => 'Arriendo del quincho principal',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('condo_incomes', [
            'condominium_id' => $condo->id,
            'category' => 'arriendo_espacios',
            'amount' => 50000,
        ]);
    }

    public function test_admin_can_update_income(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $condo = Condominium::first();

        $income = CondoIncome::create([
            'condominium_id' => $condo->id,
            'category' => 'multas',
            'amount' => 35000,
            'date' => '2026-06-01',
        ]);

        $response = $this->actingAs($admin)->putJson("/api/condo-finances/incomes/{$income->id}", [
            'category' => 'multas',
            'amount' => 40000,
            'date' => '2026-06-01',
        ]);

        $response->assertStatus(200);
        $this->assertEquals(40000, $response->json('amount'));
    }

    public function test_admin_can_delete_income(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $condo = Condominium::first();

        $income = CondoIncome::create([
            'condominium_id' => $condo->id,
            'category' => 'otro',
            'amount' => 10000,
            'date' => '2026-06-01',
        ]);

        $response = $this->actingAs($admin)->deleteJson("/api/condo-finances/incomes/{$income->id}");
        $response->assertStatus(200);
        $this->assertDatabaseMissing('condo_incomes', ['id' => $income->id]);
    }

    public function test_creating_expense_syncs_with_common_expense(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $condo = Condominium::first();

        $response = $this->actingAs($admin)->postJson('/api/condo-finances/expenses', [
            'condominium_id' => $condo->id,
            'category' => 'seguridad',
            'subcategory' => 'Conserje Turno Noche',
            'amount' => 450000,
            'date' => '2026-06-15',
            'description' => 'Sueldo conserje turno noche - Junio',
        ]);

        $response->assertStatus(201);

        // Verify CommonExpense was auto-created for "Junio 2026"
        $this->assertDatabaseHas('common_expenses', [
            'condominium_id' => $condo->id,
            'period' => 'Junio 2026',
        ]);

        // Verify ExpenseItem was created
        $this->assertDatabaseHas('expense_items', [
            'category' => 'seguridad',
            'amount' => 450000,
        ]);

        // Verify CondoExpense is linked
        $this->assertNotNull($response->json('common_expense_id'));
        $this->assertNotNull($response->json('expense_item_id'));

        // Verify CommonExpense amount is updated
        $commonExpense = CommonExpense::where('condominium_id', $condo->id)
            ->where('period', 'Junio 2026')
            ->first();
        $this->assertEquals(450000, $commonExpense->amount);
    }

    public function test_updating_expense_recalculates_common_expense(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $condo = Condominium::first();

        // Create expense
        $expense = $this->actingAs($admin)->postJson('/api/condo-finances/expenses', [
            'condominium_id' => $condo->id,
            'category' => 'personal',
            'amount' => 300000,
            'date' => '2026-06-10',
        ])->json();

        // Update expense amount
        $response = $this->actingAs($admin)->putJson("/api/condo-finances/expenses/{$expense['id']}", [
            'category' => 'personal',
            'amount' => 350000,
            'date' => '2026-06-10',
        ]);

        $response->assertStatus(200);

        // Verify ExpenseItem was updated
        $expenseItem = ExpenseItem::find($expense['expense_item_id']);
        $this->assertEquals(350000, $expenseItem->amount);

        // Verify CommonExpense was recalculated
        $commonExpense = CommonExpense::find($expense['common_expense_id']);
        $this->assertEquals(350000, $commonExpense->amount);
    }

    public function test_deleting_expense_recalculates_common_expense(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $condo = Condominium::first();

        $expense = $this->actingAs($admin)->postJson('/api/condo-finances/expenses', [
            'condominium_id' => $condo->id,
            'category' => 'mantencion',
            'amount' => 200000,
            'date' => '2026-06-20',
        ])->json();

        $commonExpenseId = $expense['common_expense_id'];

        // Delete expense
        $this->actingAs($admin)->deleteJson("/api/condo-finances/expenses/{$expense['id']}");

        // Verify ExpenseItem was deleted
        $this->assertDatabaseMissing('expense_items', ['id' => $expense['expense_item_id']]);

        // Verify CommonExpense was recalculated to 0
        $commonExpense = CommonExpense::find($commonExpenseId);
        $this->assertEquals(0, $commonExpense->amount);
    }

    public function test_expenses_list_is_paginated(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $condo = Condominium::first();

        $response = $this->actingAs($admin)->json('GET', '/api/condo-finances/expenses', [
            'condominium_id' => $condo->id,
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['data', 'current_page', 'last_page', 'total']);
    }
}
