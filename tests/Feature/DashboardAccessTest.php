<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class DashboardAccessTest extends TestCase
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

    public function test_administrador_can_access_dashboard(): void
    {
        $user = $this->getUserByRole('Administrador');

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Dashboard')
            ->has('stats.finances')
            ->has('allCondominiums')
            ->has('allUsers')
            ->has('allProperties')
            ->has('allPayments')
            ->has('recentTickets')
            ->has('allMessages')
        );
    }

    public function test_ti_can_access_dashboard(): void
    {
        $user = $this->getUserByRole('TI');

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Dashboard')
            ->has('allUsers')
            ->has('allProperties')
            ->has('allMessages')
        );
    }

    public function test_residente_can_access_dashboard(): void
    {
        $user = $this->getUserByRole('Residente');

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Dashboard')
        );
    }

    public function test_propietario_can_access_dashboard(): void
    {
        $user = $this->getUserByRole('Propietario');

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Dashboard')
        );
    }

    public function test_comite_can_access_dashboard(): void
    {
        $user = $this->getUserByRole('Comité');

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Dashboard')
            ->has('stats.finances')
        );
    }

    public function test_colaborador_can_access_dashboard(): void
    {
        $user = $this->getUserByRole('Colaborador');

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertStatus(200);
        $response->assertInertia(fn (AssertableInertia $page) => $page
            ->component('Dashboard')
        );
    }
}
