<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class UserManagementTest extends TestCase
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
     * Unauthenticated requests must be rejected.
     */
    public function test_unauthenticated_user_cannot_manage_users(): void
    {
        $this->getJson('/api/users')->assertStatus(401);
        $this->postJson('/api/users', [])->assertStatus(401);
    }

    /**
     * Roles without 'manage users' permission must be blocked (403).
     */
    public function test_non_authorized_roles_cannot_list_users(): void
    {
        $blockedRoles = ['Propietario', 'Residente', 'Comité', 'Colaborador'];

        foreach ($blockedRoles as $roleName) {
            $user = $this->getUserByRole($roleName);

            $this->actingAs($user)->getJson('/api/users')->assertStatus(403);
            $this->actingAs($user)->postJson('/api/users', [
                'name' => 'Test User',
                'email' => 'test@example.com',
                'password' => 'password123',
            ])->assertStatus(403);
        }
    }

    /**
     * Creating a user with missing required fields fails validation (422).
     */
    public function test_creating_user_with_missing_fields_fails(): void
    {
        $admin = $this->getUserByRole('Administrador');

        $response = $this->actingAs($admin)->postJson('/api/users', []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    /**
     * Creating a user with duplicate email fails validation (422).
     */
    public function test_creating_user_with_duplicate_email_fails(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $existingUser = User::first();

        $response = $this->actingAs($admin)->postJson('/api/users', [
            'name' => 'New User',
            'email' => $existingUser->email,
            'password' => 'password123',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email']);
    }

    /**
     * Creating a user with a weak password (< 8 chars) fails validation (422).
     */
    public function test_creating_user_with_short_password_fails(): void
    {
        $admin = $this->getUserByRole('Administrador');

        $response = $this->actingAs($admin)->postJson('/api/users', [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => '12345',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['password']);
    }

    /**
     * Creating a user with duplicate rut fails validation (422).
     */
    public function test_creating_user_with_duplicate_rut_fails(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $existingUser = User::whereNotNull('rut')->first();

        if ($existingUser) {
            $response = $this->actingAs($admin)->postJson('/api/users', [
                'name' => 'New User',
                'email' => 'newuser@example.com',
                'rut' => $existingUser->rut,
                'password' => 'password123',
            ]);

            $response->assertStatus(422);
            $response->assertJsonValidationErrors(['rut']);
        }
    }

    /**
     * Updating a user with duplicate email/rut of another user fails validation (422).
     */
    public function test_updating_user_with_duplicate_email_or_rut_fails(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $users = User::take(2)->get();
        $user1 = $users[0];
        $user2 = $users[1];

        $response = $this->actingAs($admin)->putJson("/api/users/{$user1->id}", [
            'email' => $user2->email,
            'rut' => $user2->rut,
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['email', 'rut']);
    }

    // ──────────────────────────────────────────────────────────
    //  HAPPY PATHS — CRUD operations & role assignment
    // ──────────────────────────────────────────────────────────

    /**
     * Authorized users (Admin and TI) can list users.
     */
    public function test_authorized_users_can_list_users(): void
    {
        $authorizedRoles = ['Administrador', 'TI'];

        foreach ($authorizedRoles as $roleName) {
            $user = $this->getUserByRole($roleName);

            $response = $this->actingAs($user)->getJson('/api/users');
            $response->assertStatus(200);
            $response->assertJsonStructure(['data', 'links']);
        }
    }

    /**
     * Authorized users can view a single user.
     */
    public function test_authorized_users_can_view_single_user(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $targetUser = User::first();

        $response = $this->actingAs($admin)->getJson("/api/users/{$targetUser->id}");

        $response->assertStatus(200);
        $response->assertJsonFragment(['id' => $targetUser->id, 'email' => $targetUser->email]);
    }

    /**
     * Admin can create a new user and assign roles.
     */
    public function test_admin_can_create_user_with_roles(): void
    {
        $admin = $this->getUserByRole('Administrador');

        $uniqueRut = '19.' . rand(100, 999) . '.' . rand(100, 999) . '-K';
        $payload = [
            'name' => 'John Doe',
            'email' => 'johndoe@example.com',
            'rut' => $uniqueRut,
            'phone' => '+56912345678',
            'password' => 'securePassword123',
            'status' => 'active',
            'roles' => ['Residente'],
        ];

        $response = $this->actingAs($admin)->postJson('/api/users', $payload);

        $response->assertStatus(201);
        $response->assertJsonFragment(['email' => 'johndoe@example.com']);
        
        $this->assertDatabaseHas('users', [
            'email' => 'johndoe@example.com',
            'rut' => $uniqueRut,
            'status' => 'active',
        ]);

        $createdUser = User::where('email', 'johndoe@example.com')->first();
        $this->assertTrue($createdUser->hasRole('Residente'));
    }

    /**
     * Admin can update a user's details.
     */
    public function test_admin_can_update_user(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $targetUser = User::factory()->create([
            'name' => 'Original Name',
            'email' => 'original@example.com',
        ]);

        $response = $this->actingAs($admin)->putJson("/api/users/{$targetUser->id}", [
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('users', [
            'id' => $targetUser->id,
            'name' => 'Updated Name',
            'email' => 'updated@example.com',
        ]);
    }

    /**
     * Admin can delete a user.
     */
    public function test_admin_can_delete_user(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $targetUser = User::factory()->create();

        $response = $this->actingAs($admin)->deleteJson("/api/users/{$targetUser->id}");

        $response->assertStatus(204);
        $this->assertSoftDeleted('users', ['id' => $targetUser->id]);
    }

    /**
     * Admin can sync roles for a user.
     */
    public function test_admin_can_sync_roles_for_user(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $targetUser = User::factory()->create();
        
        // Initial setup
        $targetUser->assignRole('Residente');
        $this->assertTrue($targetUser->hasRole('Residente'));
        $this->assertFalse($targetUser->hasRole('Propietario'));

        $response = $this->actingAs($admin)->postJson("/api/users/{$targetUser->id}/assign-role", [
            'roles' => ['Propietario', 'Comité'],
        ]);

        $response->assertStatus(200);
        
        $targetUser->refresh();
        $this->assertFalse($targetUser->hasRole('Residente'));
        $this->assertTrue($targetUser->hasRole('Propietario'));
        $this->assertTrue($targetUser->hasRole('Comité'));
    }
}
