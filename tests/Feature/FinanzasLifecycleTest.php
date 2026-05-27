<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Property;
use App\Models\CommonExpense;
use App\Models\Payment;
use App\Models\OwnerProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FinanzasLifecycleTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Sembrar base de datos
        $this->seed();
    }

    private function getUserByRole(string $roleName): User
    {
        return User::whereHas('roles', function($q) use ($roleName) {
            $q->where('name', $roleName);
        })->first();
    }

    public function test_admin_can_generate_common_expense(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $property = Property::first();

        $response = $this->actingAs($admin)->postJson('/api/expenses', [
            'condominium_id' => $property->condominium_id,
            'period' => 'Junio 2026',
            'amount' => 125000,
            'description' => 'Gasto común mensual ordinario.',
            'due_date' => '2026-07-05',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('common_expenses', [
            'period' => 'Junio 2026',
            'amount' => 125000,
            'status' => 'pending'
        ]);
    }

    public function test_payment_amount_must_be_positive_minimum_one(): void
    {
        $propietario = $this->getUserByRole('Propietario');
        $property = Property::first();
        $expense = CommonExpense::create([
            'condominium_id' => $property->condominium_id,
            'period' => 'Mayo 2026',
            'amount' => 165000,
            'description' => 'Gasto común ordinario',
            'due_date' => '2026-06-05',
            'status' => 'pending'
        ]);

        // Intentar registrar pago con monto cero o negativo
        $response = $this->actingAs($propietario)->postJson('/api/payments', [
            'user_id' => $propietario->id,
            'property_id' => $property->id,
            'common_expense_id' => $expense->id,
            'amount' => 0, // Invalid: must be at least 1
            'payment_date' => '2026-05-26',
            'payment_method' => 'transfer',
            'reference' => 'REF-FAIL'
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['amount']);
    }

    public function test_propietario_cannot_pay_for_unassociated_property(): void
    {
        // El propietario demo está asociado a la propiedad 1
        $propietario = $this->getUserByRole('Propietario');
        
        // Crear otra propiedad a la que el propietario NO está asociado
        $anotherProperty = Property::skip(1)->first();

        $expense = CommonExpense::create([
            'condominium_id' => $anotherProperty->condominium_id,
            'period' => 'Mayo 2026',
            'amount' => 165000,
            'description' => 'Gasto común ordinario',
            'due_date' => '2026-06-05',
            'status' => 'pending'
        ]);

        // Registrar un pago para la propiedad ajena
        $response = $this->actingAs($propietario)->postJson('/api/payments', [
            'user_id' => $propietario->id,
            'property_id' => $anotherProperty->id,
            'common_expense_id' => $expense->id,
            'amount' => 165000,
            'payment_date' => '2026-05-26',
            'payment_method' => 'transfer',
            'reference' => 'REF-UNASSOCIATED'
        ]);

        $response->assertStatus(403);
    }

    public function test_propietario_can_record_payment_and_admin_reconciles_it(): void
    {
        $propietario = $this->getUserByRole('Propietario');
        $admin = $this->getUserByRole('Administrador');
        
        // La primera propiedad está asociada a Propietario Demo por medio del Seeder
        $property = Property::first();
        
        $expense = CommonExpense::create([
            'condominium_id' => $property->condominium_id,
            'period' => 'Mayo 2026',
            'amount' => 165000,
            'description' => 'Gasto común ordinario',
            'due_date' => '2026-06-05',
            'status' => 'pending'
        ]);

        // Registrar un pago válido
        $responsePayment = $this->actingAs($propietario)->postJson('/api/payments', [
            'user_id' => $propietario->id,
            'property_id' => $property->id,
            'common_expense_id' => $expense->id,
            'amount' => 165000,
            'payment_date' => '2026-05-26',
            'payment_method' => 'transfer',
            'reference' => 'TXN-987654321'
        ]);

        $responsePayment->assertStatus(201);
        $paymentId = $responsePayment->json('id');

        $this->assertDatabaseHas('payments', [
            'id' => $paymentId,
            'status' => 'pending'
        ]);

        // Administrador concilia el pago exitosamente
        $responseReconcile = $this->actingAs($admin)->putJson("/api/payments/{$paymentId}/reconcile");
        
        $responseReconcile->assertStatus(200);
        $this->assertEquals('completed', $responseReconcile->json('status'));

        // El gasto común relacionado se actualizó automáticamente a pagado (paid)
        $this->assertEquals('paid', $expense->fresh()->status);
    }

    public function test_non_admin_cannot_reconcile_payments(): void
    {
        $resident = $this->getUserByRole('Residente');
        $property = Property::first();

        $expense = CommonExpense::create([
            'condominium_id' => $property->condominium_id,
            'period' => 'Mayo 2026',
            'amount' => 100000,
            'due_date' => '2026-06-05',
            'status' => 'pending'
        ]);

        $payment = Payment::create([
            'user_id' => $resident->id,
            'property_id' => $property->id,
            'common_expense_id' => $expense->id,
            'amount' => 100000,
            'payment_date' => '2026-05-26',
            'payment_method' => 'cash',
            'status' => 'pending'
        ]);

        // Residente intenta conciliar el pago
        $response = $this->actingAs($resident)->putJson("/api/payments/{$payment->id}/reconcile");
        $response->assertStatus(403);
    }
}
