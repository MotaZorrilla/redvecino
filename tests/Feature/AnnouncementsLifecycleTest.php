<?php

namespace Tests\Feature;

use App\Models\Announcement;
use App\Models\Condominium;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AnnouncementsLifecycleTest extends TestCase
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

    public function test_authorized_user_can_create_announcement(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $condo = Condominium::first();

        $response = $this->actingAs($admin)->postJson('/api/announcements', [
            'condominium_id' => $condo->id,
            'created_by' => $admin->id,
            'title' => 'Corte de agua programado',
            'content' => 'Se informa que el día sábado 10 de junio no habrá suministro de agua.',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('announcements', [
            'title' => 'Corte de agua programado',
            'created_by' => $admin->id,
        ]);
    }

    public function test_unauthorized_user_cannot_create_announcement(): void
    {
        $blockedRoles = ['Propietario', 'Residente', 'Colaborador', 'TI'];

        $condo = Condominium::first();
        $admin = $this->getUserByRole('Administrador');

        foreach ($blockedRoles as $roleName) {
            $user = $this->getUserByRole($roleName);

            $this->actingAs($user)->postJson('/api/announcements', [
                'condominium_id' => $condo->id,
                'created_by' => $admin->id,
                'title' => 'Intento no autorizado',
                'content' => 'Esto no debería crearse.',
            ])->assertStatus(403);
        }
    }

    public function test_unauthenticated_user_cannot_create_announcement(): void
    {
        $this->postJson('/api/announcements', [
            'title' => 'Sin autenticación',
            'content' => 'Esto no debería crearse.',
        ])->assertStatus(401);
    }

    public function test_unauthenticated_user_cannot_list_announcements(): void
    {
        $this->getJson('/api/announcements')->assertStatus(401);
    }

    public function test_any_authenticated_user_can_list_announcements(): void
    {
        $roles = ['Administrador', 'Comité', 'Propietario', 'Residente', 'Colaborador', 'TI'];

        foreach ($roles as $roleName) {
            $user = $this->getUserByRole($roleName);

            $response = $this->actingAs($user)->getJson('/api/announcements');

            $response->assertStatus(200);
            $response->assertJsonStructure(['data' => [['id', 'title', 'content']]]);
        }
    }
}
