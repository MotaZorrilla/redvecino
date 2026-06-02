<?php

namespace Tests\Feature;

use App\Models\CommonExpense;
use App\Models\Condominium;
use App\Models\Payment;
use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AccountStatementSecurityTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    /**
     * Helper: retrieve a seeded user by role name.
     */
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

    // ──────────────────────────────────────────────────────────
    //  UNHAPPY PATHS — Unauthorized cross-user snooping
    // ──────────────────────────────────────────────────────────

    /**
     * Unauthenticated request to account statement must be rejected (401).
     */
    public function test_unauthenticated_cannot_access_account_statement(): void
    {
        $targetUser = User::first();
        $response = $this->getJson("/api/account-statement/{$targetUser->id}");
        $response->assertStatus(401);
    }

    /**
     * A Residente cannot access another user's account statement (403).
     */
    public function test_resident_cannot_access_other_users_account_statement(): void
    {
        $resident = $this->getUserByRole('Residente');
        $otherUser = User::where('id', '!=', $resident->id)->first();

        $response = $this->actingAs($resident)->getJson("/api/account-statement/{$otherUser->id}");
        $response->assertStatus(403);
    }

    /**
     * A Propietario cannot access another user's account statement (403).
     */
    public function test_propietario_cannot_access_other_users_account_statement(): void
    {
        $propietario = $this->getUserByRole('Propietario');
        $otherUser = User::where('id', '!=', $propietario->id)->first();

        $response = $this->actingAs($propietario)->getJson("/api/account-statement/{$otherUser->id}");
        $response->assertStatus(403);
    }

    /**
     * A Colaborador cannot access another user's account statement (403).
     */
    public function test_colaborador_cannot_access_other_users_account_statement(): void
    {
        $colaborador = $this->getUserByRole('Colaborador');
        $otherUser = User::where('id', '!=', $colaborador->id)->first();

        $response = $this->actingAs($colaborador)->getJson("/api/account-statement/{$otherUser->id}");
        $response->assertStatus(403);
    }

    // ──────────────────────────────────────────────────────────
    //  HAPPY PATHS — Authorized self/admin access
    // ──────────────────────────────────────────────────────────

    /**
     * A user can access their own account statement.
     */
    public function test_user_can_access_own_account_statement(): void
    {
        $resident = $this->getUserByRole('Residente');

        $response = $this->actingAs($resident)->getJson("/api/account-statement/{$resident->id}");
        
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'user',
            'payments',
            'total_paid',
        ]);
        $response->assertJsonPath('user.id', $resident->id);
    }

    /**
     * An Administrador can access any user's account statement.
     */
    public function test_admin_can_access_any_account_statement(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $targetUser = $this->getUserByRole('Residente');

        $response = $this->actingAs($admin)->getJson("/api/account-statement/{$targetUser->id}");
        
        $response->assertStatus(200);
        $response->assertJsonPath('user.id', $targetUser->id);
    }

    /**
     * A Comité member can access any user's account statement (due to 'view financial reports' / 'approve expenses').
     */
    public function test_committee_can_access_any_account_statement(): void
    {
        $committee = $this->getUserByRole('Comité');
        $targetUser = $this->getUserByRole('Residente');

        $response = $this->actingAs($committee)->getJson("/api/account-statement/{$targetUser->id}");
        
        $response->assertStatus(200);
        $response->assertJsonPath('user.id', $targetUser->id);
    }

    /**
     * Non-administrative users listing payments only see their own payments.
     */
    public function test_ordinary_user_lists_only_own_payments(): void
    {
        $resident = $this->getUserByRole('Residente');
        $otherUser = $this->getUserByRole('Propietario');
        $condo = Condominium::first();
        $property = Property::first();
        $expense = CommonExpense::first();

        // Create a payment for resident
        $payment1 = Payment::create([
            'user_id' => $resident->id,
            'property_id' => $property->id,
            'common_expense_id' => $expense->id,
            'amount' => 50000,
            'payment_date' => '2026-06-01',
            'payment_method' => 'transfer',
            'status' => 'pending',
        ]);

        // Create a payment for other user
        $payment2 = Payment::create([
            'user_id' => $otherUser->id,
            'property_id' => $property->id,
            'common_expense_id' => $expense->id,
            'amount' => 60000,
            'payment_date' => '2026-06-01',
            'payment_method' => 'transfer',
            'status' => 'pending',
        ]);

        // When resident queries payments list
        $response = $this->actingAs($resident)->getJson('/api/payments');
        
        $response->assertStatus(200);
        // Should contain payment1 but NOT payment2
        $response->assertJsonFragment(['id' => $payment1->id, 'user_id' => $resident->id]);
        $response->assertJsonMissing(['id' => $payment2->id, 'user_id' => $otherUser->id]);
    }

    /**
     * Admin/Comité users listing payments see all payments.
     */
    public function test_admin_lists_all_payments(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $resident = $this->getUserByRole('Residente');
        $property = Property::first();
        $expense = CommonExpense::first();

        // Create a payment for resident
        $payment = Payment::create([
            'user_id' => $resident->id,
            'property_id' => $property->id,
            'common_expense_id' => $expense->id,
            'amount' => 70000,
            'payment_date' => '2026-06-01',
            'payment_method' => 'transfer',
            'status' => 'pending',
        ]);

        $response = $this->actingAs($admin)->getJson('/api/payments');
        
        $response->assertStatus(200);
        $response->assertJsonStructure(['data', 'links']);
        $this->assertEquals(Payment::count(), $response->json('total'));
    }
}
