<?php

namespace Tests\Feature;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TiPermissionsTest extends TestCase
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

    public function test_ti_can_view_roles_permissions_matrix(): void
    {
        $ti = $this->getUserByRole('TI');

        $response = $this->actingAs($ti)->getJson('/api/ti/roles-permissions');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'roles',
            'permissions',
            'matrix',
        ]);
        $response->assertJsonCount(11, 'roles');
    }

    public function test_non_ti_cannot_view_roles_permissions(): void
    {
        $blockedRoles = ['Administrador', 'Comité', 'Propietario', 'Residente', 'Colaborador'];

        foreach ($blockedRoles as $roleName) {
            $user = $this->getUserByRole($roleName);
            $this->actingAs($user)->getJson('/api/ti/roles-permissions')->assertStatus(403);
        }
    }

    public function test_unauthenticated_cannot_view_roles_permissions(): void
    {
        $this->getJson('/api/ti/roles-permissions')->assertStatus(401);
    }

    public function test_ti_can_toggle_permission(): void
    {
        $ti = $this->getUserByRole('TI');

        $role = Role::findByName('Colaborador', 'web');
        $permission = Permission::findOrCreate('test-permission', 'web');

        $this->assertFalse($role->hasPermissionTo($permission));

        $response = $this->actingAs($ti)->postJson('/api/ti/roles-permissions/toggle', [
            'role' => 'Colaborador',
            'permission' => 'test-permission',
        ]);

        $response->assertStatus(200);
        $response->assertJson(['action' => 'granted']);

        $role->refresh();
        $this->assertTrue($role->hasPermissionTo($permission));

        $response = $this->actingAs($ti)->postJson('/api/ti/roles-permissions/toggle', [
            'role' => 'Colaborador',
            'permission' => 'test-permission',
        ]);

        $response->assertStatus(200);
        $response->assertJson(['action' => 'revoked']);

        $role->refresh();
        $this->assertFalse($role->hasPermissionTo($permission));
    }

    public function test_non_ti_cannot_toggle_permission(): void
    {
        $blockedRoles = ['Administrador', 'Comité', 'Propietario', 'Residente', 'Colaborador'];

        foreach ($blockedRoles as $roleName) {
            $user = $this->getUserByRole($roleName);
            $this->actingAs($user)->postJson('/api/ti/roles-permissions/toggle', [
                'role' => 'Residente',
                'permission' => 'view financial reports',
            ])->assertStatus(403);
        }
    }

    public function test_toggle_validation(): void
    {
        $ti = $this->getUserByRole('TI');

        $response = $this->actingAs($ti)->postJson('/api/ti/roles-permissions/toggle', []);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['role', 'permission']);

        $response = $this->actingAs($ti)->postJson('/api/ti/roles-permissions/toggle', [
            'role' => 'NonExistentRole',
            'permission' => 'view logs',
        ]);
        $response->assertStatus(404);
    }
}
