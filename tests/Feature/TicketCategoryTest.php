<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\TicketCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TicketCategoryTest extends TestCase
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

    public function test_any_authenticated_user_can_list_categories(): void
    {
        $roles = ['Administrador', 'Comité', 'Propietario', 'Residente', 'Colaborador', 'TI'];

        foreach ($roles as $roleName) {
            $user = $this->getUserByRole($roleName);

            $response = $this->actingAs($user)->getJson('/api/ticket-categories');

            $response->assertStatus(200);
            $response->assertJsonCount(7);
            $response->assertJsonStructure([['id', 'name', 'description']]);
        }
    }

    public function test_unauthenticated_cannot_list_categories(): void
    {
        $this->getJson('/api/ticket-categories')->assertStatus(401);
    }

    public function test_authorized_roles_can_create_category(): void
    {
        $authorizedRoles = ['Administrador', 'Comité', 'Propietario', 'Residente', 'Colaborador', 'TI'];

        foreach ($authorizedRoles as $roleName) {
            $user = $this->getUserByRole($roleName);

            $response = $this->actingAs($user)->postJson('/api/ticket-categories', [
                'name' => "Nueva categoria {$roleName}",
                'description' => "Creada por {$roleName}",
            ]);

            $response->assertStatus(201);
            $this->assertDatabaseHas('ticket_categories', [
                'name' => "Nueva categoria {$roleName}",
            ]);
        }
    }

    public function test_unauthenticated_cannot_create_category(): void
    {
        $this->postJson('/api/ticket-categories', [
            'name' => 'Sin auth',
        ])->assertStatus(401);
    }

    public function test_creating_category_fails_with_duplicate_name(): void
    {
        $admin = $this->getUserByRole('Administrador');

        $first = TicketCategory::first();

        $response = $this->actingAs($admin)->postJson('/api/ticket-categories', [
            'name' => $first->name,
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors('name');
    }

    public function test_creating_category_fails_without_name(): void
    {
        $admin = $this->getUserByRole('Administrador');

        $response = $this->actingAs($admin)->postJson('/api/ticket-categories', []);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors('name');
    }
}
