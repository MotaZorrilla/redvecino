<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Condominium;
use App\Models\CondoIncome;
use App\Models\CondoExpense;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Cross-condominium data isolation tests for the financial module.
 *
 * Validates that:
 * - Financial queries are strictly scoped by condominium_id
 * - Incomes/expenses created in one condo never leak into another
 * - Roles without financial permissions are rejected (403)
 * - Unauthenticated requests are redirected
 * - Nonexistent condo IDs are handled gracefully
 */
class CondoFinancesIsolationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    private function getUserByRole(string $roleName): User
    {
        $user = User::whereHas('roles', function ($q) use ($roleName) {
            $q->where('name', $roleName);
        })->first();

        if (!$user) {
            $this->fail("No user found with role: {$roleName}");
        }

        return $user;
    }

    // ─── UNHAPPY PATHS FIRST ────────────────────────────────────────────

    /**
     * TI role does NOT have 'view financial reports'.
     */
    public function test_ti_user_cannot_access_finance_summary(): void
    {
        $ti = $this->getUserByRole('TI');
        $condo = Condominium::first();

        $response = $this->actingAs($ti)->getJson('/api/condo-finances/summary?condominium_id=' . $condo->id);

        $response->assertStatus(403);
    }

    /**
     * TI role does NOT have 'approve expenses'.
     */
    public function test_ti_user_cannot_create_income(): void
    {
        $ti = $this->getUserByRole('TI');
        $condo = Condominium::first();

        $response = $this->actingAs($ti)->postJson('/api/condo-finances/incomes', [
            'condominium_id' => $condo->id,
            'category' => 'multas',
            'amount' => 50000,
            'date' => '2026-06-01',
        ]);

        $response->assertStatus(403);
    }

    /**
     * Colaborador role lacks both 'view financial reports' and 'approve expenses'.
     */
    public function test_colaborador_cannot_access_finance_summary(): void
    {
        $colaborador = $this->getUserByRole('Colaborador');
        $condo = Condominium::first();

        $response = $this->actingAs($colaborador)->getJson('/api/condo-finances/summary?condominium_id=' . $condo->id);

        $response->assertStatus(403);
    }

    /**
     * Unauthenticated users must be rejected on all finance endpoints.
     */
    public function test_unauthenticated_user_gets_redirected(): void
    {
        $condo = Condominium::first();

        // GET summary without auth
        $responseSummary = $this->getJson('/api/condo-finances/summary?condominium_id=' . $condo->id);
        $responseSummary->assertStatus(401);

        // GET incomes without auth
        $responseIncomes = $this->getJson('/api/condo-finances/incomes?condominium_id=' . $condo->id);
        $responseIncomes->assertStatus(401);

        // POST income without auth
        $responsePost = $this->postJson('/api/condo-finances/incomes', [
            'condominium_id' => $condo->id,
            'category' => 'multas',
            'amount' => 10000,
            'date' => '2026-06-01',
        ]);
        $responsePost->assertStatus(401);
    }

    /**
     * Querying summary for a condo_id that does not exist should return a validation error.
     * The controller validates condominium_id with 'exists:condominiums,id'.
     */
    public function test_summary_for_nonexistent_condo_returns_zeros(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $nonexistentId = 99999;

        $response = $this->actingAs($admin)->getJson('/api/condo-finances/summary?condominium_id=' . $nonexistentId);

        // The controller has 'required|exists:condominiums,id' validation,
        // so a nonexistent condo should yield 422 with a validation error.
        $response->assertStatus(422);
        $response->assertJsonValidationErrors('condominium_id');
    }

    // ─── DATA ISOLATION (CROSS-CONDO) ───────────────────────────────────

    /**
     * Verify that querying summary with condo_id=1 returns only condo 1 data.
     */
    public function test_finance_summary_returns_data_only_for_requested_condo(): void
    {
        $admin = $this->getUserByRole('Administrador');

        $condo1 = Condominium::find(1);
        $condo2 = Condominium::find(2);

        $this->assertNotNull($condo1, 'Condo 1 must exist from seeder');
        $this->assertNotNull($condo2, 'Condo 2 must exist from seeder');

        // Get summaries for both condos
        $response1 = $this->actingAs($admin)->getJson('/api/condo-finances/summary?condominium_id=' . $condo1->id);
        $response1->assertStatus(200);

        $response2 = $this->actingAs($admin)->getJson('/api/condo-finances/summary?condominium_id=' . $condo2->id);
        $response2->assertStatus(200);

        // Verify structure
        $response1->assertJsonStructure(['total_incomes', 'total_expenses', 'balance']);
        $response2->assertJsonStructure(['total_incomes', 'total_expenses', 'balance']);

        // Each condo has independent totals computed from its own records.
        // Verify the totals match what the database actually holds per condo.
        $expectedIncome1 = (float) CondoIncome::where('condominium_id', $condo1->id)->sum('amount');
        $expectedIncome2 = (float) CondoIncome::where('condominium_id', $condo2->id)->sum('amount');

        $this->assertEquals($expectedIncome1, $response1->json('total_incomes'));
        $this->assertEquals($expectedIncome2, $response2->json('total_incomes'));

        // Summaries for different condos should NOT be identical
        // (seeders generate different base amounts per condo name)
        $this->assertNotEquals(
            $response1->json('total_incomes'),
            $response2->json('total_incomes'),
            'Condo 1 and Condo 2 should have different income totals, proving isolation.'
        );
    }

    /**
     * Create an income for condo 1; verify it does NOT appear when querying condo 2.
     */
    public function test_creating_income_for_condo1_does_not_appear_in_condo2(): void
    {
        $admin = $this->getUserByRole('Administrador');

        $condo1 = Condominium::find(1);
        $condo2 = Condominium::find(2);

        // Create a unique income in condo 1
        $createResponse = $this->actingAs($admin)->postJson('/api/condo-finances/incomes', [
            'condominium_id' => $condo1->id,
            'category' => 'arriendo_espacios',
            'subcategory' => 'Quinchos',
            'amount' => 77777,
            'date' => '2026-06-02',
            'description' => 'Isolation test income - should only be in condo 1',
        ]);
        $createResponse->assertStatus(201);

        // Verify it's in the DB for condo 1
        $this->assertDatabaseHas('condo_incomes', [
            'condominium_id' => $condo1->id,
            'amount' => 77777,
            'description' => 'Isolation test income - should only be in condo 1',
        ]);

        // Verify it does NOT exist for condo 2
        $this->assertDatabaseMissing('condo_incomes', [
            'condominium_id' => $condo2->id,
            'amount' => 77777,
        ]);

        // Query incomes list for condo 2 and ensure our record is not returned
        $listCondo2 = $this->actingAs($admin)->getJson('/api/condo-finances/incomes?condominium_id=' . $condo2->id);
        $listCondo2->assertStatus(200);

        $condo2Amounts = collect($listCondo2->json('data'))->pluck('amount')->map(fn ($a) => (float) $a);
        $this->assertFalse(
            $condo2Amounts->contains(77777.0),
            'Income of 77777 created in condo 1 must NOT appear in condo 2 income list.'
        );
    }

    /**
     * Create an expense for condo 2; verify it does NOT appear when querying condo 1.
     */
    public function test_creating_expense_for_condo2_does_not_appear_in_condo1(): void
    {
        $admin = $this->getUserByRole('Administrador');

        $condo1 = Condominium::find(1);
        $condo2 = Condominium::find(2);

        // Create a unique expense in condo 2
        $createResponse = $this->actingAs($admin)->postJson('/api/condo-finances/expenses', [
            'condominium_id' => $condo2->id,
            'category' => 'seguridad',
            'subcategory' => 'CCTV',
            'amount' => 88888,
            'date' => '2026-06-02',
            'description' => 'Isolation test expense - should only be in condo 2',
        ]);
        $createResponse->assertStatus(201);

        // Verify it's in the DB for condo 2
        $this->assertDatabaseHas('condo_expenses', [
            'condominium_id' => $condo2->id,
            'amount' => 88888,
        ]);

        // Verify it does NOT exist for condo 1
        $this->assertDatabaseMissing('condo_expenses', [
            'condominium_id' => $condo1->id,
            'amount' => 88888,
        ]);

        // Query expenses list for condo 1 and ensure our record is not returned
        $listCondo1 = $this->actingAs($admin)->getJson('/api/condo-finances/expenses?condominium_id=' . $condo1->id);
        $listCondo1->assertStatus(200);

        $condo1Amounts = collect($listCondo1->json('data'))->pluck('amount')->map(fn ($a) => (float) $a);
        $this->assertFalse(
            $condo1Amounts->contains(88888.0),
            'Expense of 88888 created in condo 2 must NOT appear in condo 1 expense list.'
        );
    }

    /**
     * Verify the income list respects condominium_id filter.
     */
    public function test_incomes_list_filtered_by_condo_id(): void
    {
        $admin = $this->getUserByRole('Administrador');

        $condo1 = Condominium::find(1);

        $response = $this->actingAs($admin)->getJson('/api/condo-finances/incomes?condominium_id=' . $condo1->id);
        $response->assertStatus(200);
        $response->assertJsonStructure(['data', 'current_page', 'last_page', 'total']);

        // Every income returned must belong to condo 1
        $data = $response->json('data');
        foreach ($data as $income) {
            $this->assertEquals(
                $condo1->id,
                $income['condominium_id'],
                "Income ID {$income['id']} belongs to condo {$income['condominium_id']}, expected condo {$condo1->id}."
            );
        }

        // Cross-check: total from API must match direct DB count for this condo
        $dbCount = CondoIncome::where('condominium_id', $condo1->id)->count();
        $this->assertEquals($dbCount, $response->json('total'));
    }

    // ─── HAPPY PATHS ────────────────────────────────────────────────────

    /**
     * Comité has both 'view financial reports' and 'approve expenses'.
     */
    public function test_comite_can_view_but_also_create_income(): void
    {
        $comite = $this->getUserByRole('Comité');
        $condo = Condominium::first();

        // CAN view summary (has 'view financial reports')
        $viewResponse = $this->actingAs($comite)->getJson('/api/condo-finances/summary?condominium_id=' . $condo->id);
        $viewResponse->assertStatus(200);
        $viewResponse->assertJsonStructure(['total_incomes', 'total_expenses', 'balance']);

        // CAN create income (has 'approve expenses')
        $createResponse = $this->actingAs($comite)->postJson('/api/condo-finances/incomes', [
            'condominium_id' => $condo->id,
            'category' => 'arriendo_espacios',
            'subcategory' => 'Canchas',
            'amount' => 30000,
            'date' => '2026-06-02',
            'description' => 'Comité created income - isolation test',
        ]);
        $createResponse->assertStatus(201);

        $this->assertDatabaseHas('condo_incomes', [
            'condominium_id' => $condo->id,
            'category' => 'arriendo_espacios',
            'subcategory' => 'Canchas',
            'amount' => 30000,
        ]);
    }
}
