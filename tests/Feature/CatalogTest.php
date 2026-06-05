<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CatalogTest extends TestCase
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

    public function test_authorized_user_can_get_catalog(): void
    {
        $authorizedRoles = ['Administrador', 'Comité'];

        foreach ($authorizedRoles as $roleName) {
            $user = $this->getUserByRole($roleName);

            $response = $this->actingAs($user)->getJson('/api/condo-finances/catalog');

            $response->assertStatus(200);
            $response->assertJsonStructure([
                'incomes',
                'expenses',
            ]);
        }
    }

    public function test_unauthorized_user_cannot_get_catalog(): void
    {
        $blockedRoles = ['Propietario', 'Residente', 'Colaborador', 'TI'];

        foreach ($blockedRoles as $roleName) {
            $user = $this->getUserByRole($roleName);

            $this->actingAs($user)->getJson('/api/condo-finances/catalog')->assertStatus(403);
        }
    }

    public function test_unauthenticated_user_cannot_get_catalog(): void
    {
        $this->getJson('/api/condo-finances/catalog')->assertStatus(401);
    }
}
