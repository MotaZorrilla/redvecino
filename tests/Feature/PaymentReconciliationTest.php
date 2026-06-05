<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Payment;
use App\Models\Property;
use App\Models\CommonExpense;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PaymentReconciliationTest extends TestCase
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

    private function createPayment(User $user, string $status = 'pending'): Payment
    {
        $property = Property::first();
        $expense = CommonExpense::factory()->create([
            'condominium_id' => $property->condominium_id,
            'status' => 'pending',
        ]);

        return Payment::create([
            'user_id' => $user->id,
            'property_id' => $property->id,
            'common_expense_id' => $expense->id,
            'amount' => 100000,
            'payment_date' => '2026-06-01',
            'payment_method' => 'transfer',
            'status' => $status,
        ]);
    }

    public function test_admin_can_reconcile_payment(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $payment = $this->createPayment($admin, 'pending');

        $response = $this->actingAs($admin)->putJson("/api/payments/{$payment->id}/reconcile");

        $response->assertStatus(200);
        $this->assertDatabaseHas('payments', [
            'id' => $payment->id,
            'status' => 'completed',
        ]);
        $this->assertDatabaseHas('common_expenses', [
            'id' => $payment->common_expense_id,
            'status' => 'paid',
        ]);
    }

    public function test_comite_can_reconcile_payment(): void
    {
        $comite = $this->getUserByRole('Comité');
        $admin = $this->getUserByRole('Administrador');
        $payment = $this->createPayment($admin, 'pending');

        $response = $this->actingAs($comite)->putJson("/api/payments/{$payment->id}/reconcile");

        $response->assertStatus(200);
        $response->assertJsonPath('status', 'completed');
    }

    public function test_unauthorized_roles_cannot_reconcile_payment(): void
    {
        $blockedRoles = ['Propietario', 'Residente', 'Colaborador', 'TI'];
        $admin = $this->getUserByRole('Administrador');
        $payment = $this->createPayment($admin, 'pending');

        foreach ($blockedRoles as $roleName) {
            $user = $this->getUserByRole($roleName);
            $this->actingAs($user)->putJson("/api/payments/{$payment->id}/reconcile")->assertStatus(403);
        }
    }

    public function test_unauthenticated_cannot_reconcile_payment(): void
    {
        $payment = Payment::first();
        if (!$payment) {
            $admin = $this->getUserByRole('Administrador');
            $payment = $this->createPayment($admin, 'pending');
        }
        $this->putJson("/api/payments/{$payment->id}/reconcile")->assertStatus(401);
    }

    public function test_reconciling_nonexistent_payment_returns_404(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $this->actingAs($admin)->putJson('/api/payments/99999/reconcile')->assertStatus(404);
    }
}
