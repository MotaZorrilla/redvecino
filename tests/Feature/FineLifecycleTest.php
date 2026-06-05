<?php

namespace Tests\Feature;

use App\Models\Fine;
use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FineLifecycleTest extends TestCase
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
    //  UNHAPPY PATHS — Authentication, Authorization & Validation
    // ──────────────────────────────────────────────────────────

    /**
     * Unauthenticated users must be rejected.
     */
    public function test_unauthenticated_user_cannot_interact_with_fines(): void
    {
        $this->getJson('/api/fines')->assertStatus(401);
        $this->postJson('/api/fines', [])->assertStatus(401);
    }

    /**
     * Roles without 'view financial reports' permission cannot list fines.
     */
    public function test_unauthorized_roles_cannot_list_fines(): void
    {
        $blockedRoles = ['Propietario', 'Residente', 'Colaborador', 'TI'];

        foreach ($blockedRoles as $roleName) {
            $user = $this->getUserByRole($roleName);

            $this->actingAs($user)->getJson('/api/fines')->assertStatus(403);
        }
    }

    /**
     * Roles without 'approve expenses' permission cannot create fines.
     */
    public function test_unauthorized_roles_cannot_create_fines(): void
    {
        $blockedRoles = ['Propietario', 'Residente', 'Colaborador', 'TI'];
        $targetUser = User::first();
        $property = Property::first();

        foreach ($blockedRoles as $roleName) {
            $user = $this->getUserByRole($roleName);

            $response = $this->actingAs($user)->postJson('/api/fines', [
                'user_id' => $targetUser->id,
                'property_id' => $property->id,
                'reason' => 'Noise violation',
                'amount' => 50000,
                'issued_date' => '2026-06-01',
                'due_date' => '2026-06-15',
            ]);

            $response->assertStatus(403);
        }
    }

    /**
     * Creating a fine with missing required fields fails validation (422).
     */
    public function test_creating_fine_with_missing_fields_fails(): void
    {
        $admin = $this->getUserByRole('Administrador');

        $response = $this->actingAs($admin)->postJson('/api/fines', []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['user_id', 'property_id', 'reason', 'amount', 'issued_date', 'due_date']);
    }

    /**
     * Creating a fine with non-existent user_id or property_id fails validation (422).
     */
    public function test_creating_fine_with_invalid_ids_fails(): void
    {
        $admin = $this->getUserByRole('Administrador');

        $response = $this->actingAs($admin)->postJson('/api/fines', [
            'user_id' => 999999,
            'property_id' => 999999,
            'reason' => 'Invalid relations test',
            'amount' => 30000,
            'issued_date' => '2026-06-01',
            'due_date' => '2026-06-15',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['user_id', 'property_id']);
    }

    /**
     * Creating a fine with a non-numeric amount fails validation (422).
     */
    public function test_creating_fine_with_non_numeric_amount_fails(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $targetUser = User::first();
        $property = Property::first();

        $response = $this->actingAs($admin)->postJson('/api/fines', [
            'user_id' => $targetUser->id,
            'property_id' => $property->id,
            'reason' => 'Non-numeric amount test',
            'amount' => 'fifty-thousand',
            'issued_date' => '2026-06-01',
            'due_date' => '2026-06-15',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['amount']);
    }

    /**
     * Creating a fine with invalid dates fails validation (422).
     */
    public function test_creating_fine_with_invalid_dates_fails(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $targetUser = User::first();
        $property = Property::first();

        $response = $this->actingAs($admin)->postJson('/api/fines', [
            'user_id' => $targetUser->id,
            'property_id' => $property->id,
            'reason' => 'Invalid dates test',
            'amount' => 45000,
            'issued_date' => 'not-a-date',
            'due_date' => '2026-13-45', // Completely invalid date string
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['issued_date', 'due_date']);
    }

    // ──────────────────────────────────────────────────────────
    //  HAPPY PATHS — CRUD index listing and fine creation
    // ──────────────────────────────────────────────────────────

    /**
     * Committee and Admin can list fines.
     */
    public function test_authorized_roles_can_list_fines(): void
    {
        $authorizedRoles = ['Comité', 'Administrador'];

        foreach ($authorizedRoles as $roleName) {
            $user = $this->getUserByRole($roleName);

            $response = $this->actingAs($user)->getJson('/api/fines');
            
            $response->assertStatus(200);
            $response->assertJsonStructure(['data', 'links']);
        }
    }

    /**
     * Admin and Committee can successfully create fines.
     */
    public function test_authorized_roles_can_create_fines(): void
    {
        $authorizedRoles = ['Comité', 'Administrador'];
        $targetUser = User::first();
        $property = Property::first();

        foreach ($authorizedRoles as $roleName) {
            $user = $this->getUserByRole($roleName);

            $payload = [
                'user_id' => $targetUser->id,
                'property_id' => $property->id,
                'reason' => "Noise complaint created by {$roleName}",
                'amount' => 55000,
                'issued_date' => '2026-06-02',
                'due_date' => '2026-06-17',
            ];

            $response = $this->actingAs($user)->postJson('/api/fines', $payload);

            $response->assertStatus(201);
            $this->assertDatabaseHas('fines', [
                'user_id' => $targetUser->id,
                'property_id' => $property->id,
                'reason' => "Noise complaint created by {$roleName}",
                'amount' => 55000,
            ]);
        }
    }

    public function test_authorized_roles_can_update_fines(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $targetUser = User::first();
        $property = Property::first();

        $fine = Fine::create([
            'user_id' => $targetUser->id,
            'property_id' => $property->id,
            'reason' => 'Original reason',
            'amount' => 50000,
            'issued_date' => '2026-06-01',
            'due_date' => '2026-06-15',
        ]);

        $response = $this->actingAs($admin)->putJson("/api/fines/{$fine->id}", [
            'reason' => 'Updated reason',
            'amount' => 75000,
            'issued_date' => '2026-06-02',
            'due_date' => '2026-06-20',
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('amount', 75000);
        $this->assertDatabaseHas('fines', [
            'id' => $fine->id,
            'reason' => 'Updated reason',
            'amount' => 75000,
        ]);
    }

    public function test_unauthorized_roles_cannot_update_fines(): void
    {
        $blockedRoles = ['Propietario', 'Residente', 'Colaborador', 'TI'];
        $targetUser = User::first();
        $property = Property::first();

        $fine = Fine::create([
            'user_id' => $targetUser->id,
            'property_id' => $property->id,
            'reason' => 'Blocked update test',
            'amount' => 30000,
            'issued_date' => '2026-06-01',
            'due_date' => '2026-06-15',
        ]);

        foreach ($blockedRoles as $roleName) {
            $user = $this->getUserByRole($roleName);
            $this->actingAs($user)->putJson("/api/fines/{$fine->id}", [
                'reason' => 'Hacked',
                'amount' => 100,
            ])->assertStatus(403);
        }
    }

    public function test_authorized_roles_can_delete_fines(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $targetUser = User::first();
        $property = Property::first();

        $fine = Fine::create([
            'user_id' => $targetUser->id,
            'property_id' => $property->id,
            'reason' => 'To be deleted',
            'amount' => 20000,
            'issued_date' => '2026-06-01',
            'due_date' => '2026-06-15',
        ]);

        $response = $this->actingAs($admin)->deleteJson("/api/fines/{$fine->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('fines', ['id' => $fine->id]);
    }

    public function test_unauthorized_roles_cannot_delete_fines(): void
    {
        $blockedRoles = ['Propietario', 'Residente', 'Colaborador', 'TI'];
        $targetUser = User::first();
        $property = Property::first();

        $fine = Fine::create([
            'user_id' => $targetUser->id,
            'property_id' => $property->id,
            'reason' => 'Blocked delete test',
            'amount' => 25000,
            'issued_date' => '2026-06-01',
            'due_date' => '2026-06-15',
        ]);

        foreach ($blockedRoles as $roleName) {
            $user = $this->getUserByRole($roleName);
            $this->actingAs($user)->deleteJson("/api/fines/{$fine->id}")->assertStatus(403);
        }
    }
}
