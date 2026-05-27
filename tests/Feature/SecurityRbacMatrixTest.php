<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Property;
use App\Models\CommonExpense;
use App\Models\Payment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SecurityRbacMatrixTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Sembrar roles, permisos y cuentas demo
        $this->seed();
    }

    /**
     * Helper to get user by role name
     */
    private function getUserByRole(string $roleName): User
    {
        $user = User::whereHas('roles', function($q) use ($roleName) {
            $q->where('name', $roleName);
        })->first();

        if (!$user) {
            $this->fail("No user found with role: {$roleName}");
        }

        return $user;
    }

    public function test_administrador_rbac_rules(): void
    {
        $admin = $this->getUserByRole('Administrador');

        // CAN: Manage users (200 OK)
        $responseUsers = $this->actingAs($admin)->getJson('/api/users');
        $responseUsers->assertStatus(200);

        // CAN: View financial reports (200 OK)
        $responseExpenses = $this->actingAs($admin)->getJson('/api/expenses');
        $responseExpenses->assertStatus(200);

        // CAN: Create announcements (201 or 422 depending on validation, but NOT 403)
        $responseAnnounce = $this->actingAs($admin)->postJson('/api/announcements', []);
        $this->assertNotEquals(403, $responseAnnounce->getStatusCode());

        // CANNOT: Configure system (Create properties should yield 403 for Admin since only TI has configure system)
        $responseProperty = $this->actingAs($admin)->postJson('/api/properties', [
            'condominium_id' => 1,
            'type' => 'departamento',
            'number' => '101B',
            'block' => 'Torre B',
            'status' => 'vacant'
        ]);
        $responseProperty->assertStatus(403);
    }

    public function test_ti_rbac_rules(): void
    {
        $ti = $this->getUserByRole('TI');

        // CAN: Manage users (200 OK)
        $responseUsers = $this->actingAs($ti)->getJson('/api/users');
        $responseUsers->assertStatus(200);

        // CAN: Configure system (Create property - should yield validation error 422, but NOT 403)
        $responseProperty = $this->actingAs($ti)->postJson('/api/properties', []);
        $this->assertNotEquals(403, $responseProperty->getStatusCode());

        // CANNOT: View financial reports (403 Forbidden)
        $responseExpenses = $this->actingAs($ti)->getJson('/api/expenses');
        $responseExpenses->assertStatus(403);

        // CANNOT: Approve expenses/Reconcile (403 Forbidden)
        $responseReconcile = $this->actingAs($ti)->putJson('/api/payments/1/reconcile');
        $responseReconcile->assertStatus(403);
    }

    public function test_comite_rbac_rules(): void
    {
        $comite = $this->getUserByRole('Comité');

        // CAN: View financial reports (200 OK)
        $responseExpenses = $this->actingAs($comite)->getJson('/api/expenses');
        $responseExpenses->assertStatus(200);

        // CAN: Publish announcements (validation 422/success, NOT 403)
        $responseAnnounce = $this->actingAs($comite)->postJson('/api/announcements', []);
        $this->assertNotEquals(403, $responseAnnounce->getStatusCode());

        // CANNOT: Manage users (403 Forbidden)
        $responseUsers = $this->actingAs($comite)->getJson('/api/users');
        $responseUsers->assertStatus(403);

        // CANNOT: Configure system (403 Forbidden)
        $responseProperty = $this->actingAs($comite)->postJson('/api/properties', []);
        $responseProperty->assertStatus(403);
    }

    public function test_colaborador_rbac_rules(): void
    {
        $colaborador = $this->getUserByRole('Colaborador');

        // CAN: Resolve tickets (validation/not found, NOT 403)
        $responseResolve = $this->actingAs($colaborador)->putJson('/api/tickets/999/resolve', []);
        $this->assertNotEquals(403, $responseResolve->getStatusCode());

        // CANNOT: Manage users (403 Forbidden)
        $responseUsers = $this->actingAs($colaborador)->getJson('/api/users');
        $responseUsers->assertStatus(403);

        // CANNOT: View financial reports (403 Forbidden)
        $responseExpenses = $this->actingAs($colaborador)->getJson('/api/expenses');
        $responseExpenses->assertStatus(403);

        // CANNOT: Configure system (403 Forbidden)
        $responseProperty = $this->actingAs($colaborador)->postJson('/api/properties', []);
        $responseProperty->assertStatus(403);
    }

    public function test_propietario_rbac_rules(): void
    {
        $propietario = $this->getUserByRole('Propietario');

        // CAN: Create tickets (validation 422, NOT 403)
        $responseTicket = $this->actingAs($propietario)->postJson('/api/tickets', []);
        $this->assertNotEquals(403, $responseTicket->getStatusCode());

        // CAN: Pay common expenses (validation 422, NOT 403)
        $responsePayment = $this->actingAs($propietario)->postJson('/api/payments', []);
        $this->assertNotEquals(403, $responsePayment->getStatusCode());

        // CANNOT: Manage users (403 Forbidden)
        $responseUsers = $this->actingAs($propietario)->getJson('/api/users');
        $responseUsers->assertStatus(403);

        // CANNOT: View financial reports (403 Forbidden)
        $responseExpenses = $this->actingAs($propietario)->getJson('/api/expenses');
        $responseExpenses->assertStatus(403);

        // CANNOT: Publish announcements (403 Forbidden)
        $responseAnnounce = $this->actingAs($propietario)->postJson('/api/announcements', []);
        $responseAnnounce->assertStatus(403);
    }

    public function test_residente_rbac_rules(): void
    {
        $residente = $this->getUserByRole('Residente');

        // CAN: Create tickets (validation 422, NOT 403)
        $responseTicket = $this->actingAs($residente)->postJson('/api/tickets', []);
        $this->assertNotEquals(403, $responseTicket->getStatusCode());

        // CAN: Pay common expenses (validation 422, NOT 403)
        $responsePayment = $this->actingAs($residente)->postJson('/api/payments', []);
        $this->assertNotEquals(403, $responsePayment->getStatusCode());

        // CANNOT: Manage users (403 Forbidden)
        $responseUsers = $this->actingAs($residente)->getJson('/api/users');
        $responseUsers->assertStatus(403);

        // CANNOT: View financial reports (403 Forbidden)
        $responseExpenses = $this->actingAs($residente)->getJson('/api/expenses');
        $responseExpenses->assertStatus(403);

        // CANNOT: Publish announcements (403 Forbidden)
        $responseAnnounce = $this->actingAs($residente)->postJson('/api/announcements', []);
        $responseAnnounce->assertStatus(403);
    }
}
