<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TiCommandsTest extends TestCase
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

    public function test_unauthorized_user_cannot_execute_commands(): void
    {
        $blockedRoles = ['Administrador', 'Propietario', 'Residente', 'Colaborador', 'Comité'];

        foreach ($blockedRoles as $roleName) {
            $user = $this->getUserByRole($roleName);

            $this->actingAs($user)->postJson('/api/ti/command', [
                'command' => 'db:status',
            ])->assertStatus(403);
        }
    }

    public function test_unauthenticated_user_cannot_execute_commands(): void
    {
        $this->postJson('/api/ti/command', [
            'command' => 'db:status',
        ])->assertStatus(401);
    }
}
