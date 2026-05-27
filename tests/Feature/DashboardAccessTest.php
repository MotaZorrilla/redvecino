<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DashboardAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Sembrar roles, permisos y cuentas demo
        $this->seed();
    }

    public function test_administrador_can_access_dashboard_with_finances_data(): void
    {
        $user = User::whereHas('roles', function($q) {
            $q->where('name', 'Administrador');
        })->first();

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertStatus(200);
    }

    public function test_ti_can_access_dashboard_with_ti_roles(): void
    {
        $user = User::whereHas('roles', function($q) {
            $q->where('name', 'TI');
        })->first();

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertStatus(200);
    }

    public function test_residente_can_access_dashboard_with_resident_roles(): void
    {
        $user = User::whereHas('roles', function($q) {
            $q->where('name', 'Residente');
        })->first();

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertStatus(200);
    }

    public function test_propietario_can_access_dashboard_with_owner_roles(): void
    {
        $user = User::whereHas('roles', function($q) {
            $q->where('name', 'Propietario');
        })->first();

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertStatus(200);
    }

    public function test_comite_can_access_dashboard_with_committee_roles(): void
    {
        $user = User::whereHas('roles', function($q) {
            $q->where('name', 'Comité');
        })->first();

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertStatus(200);
    }

    public function test_colaborador_can_access_dashboard_with_employee_roles(): void
    {
        $user = User::whereHas('roles', function($q) {
            $q->where('name', 'Colaborador');
        })->first();

        $response = $this->actingAs($user)->get('/dashboard');

        $response->assertStatus(200);
    }
}
