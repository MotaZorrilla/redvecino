<?php

namespace Tests\Feature;

use App\Models\Condominium;
use App\Models\Property;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PropertyManagementTest extends TestCase
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
    //  UNHAPPY PATHS — Authorization & Validation Failures
    // ──────────────────────────────────────────────────────────

    /**
     * Unauthenticated requests must be rejected.
     */
    public function test_unauthenticated_user_cannot_list_properties(): void
    {
        $response = $this->getJson('/api/properties');

        // Sanctum returns 401 for unauthenticated JSON requests
        $response->assertStatus(401);
    }

    /**
     * Administrador does NOT have 'configure system' → cannot create properties.
     */
    public function test_admin_cannot_create_property(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $condo = Condominium::first();

        $response = $this->actingAs($admin)->postJson('/api/properties', [
            'condominium_id' => $condo->id,
            'type'           => 'apartment',
            'number'         => 'TEST-001',
            'block'          => 'Torre Z',
            'status'         => 'vacant',
        ]);

        $response->assertStatus(403);
    }

    /**
     * Propietario does NOT have 'configure system' → cannot create properties.
     */
    public function test_propietario_cannot_create_property(): void
    {
        $propietario = $this->getUserByRole('Propietario');
        $condo = Condominium::first();

        $response = $this->actingAs($propietario)->postJson('/api/properties', [
            'condominium_id' => $condo->id,
            'type'           => 'apartment',
            'number'         => 'TEST-002',
        ]);

        $response->assertStatus(403);
    }

    /**
     * Administrador cannot DELETE properties (lacks 'configure system').
     */
    public function test_admin_cannot_delete_property(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $property = Property::first();

        $response = $this->actingAs($admin)->deleteJson("/api/properties/{$property->id}");

        $response->assertStatus(403);
    }

    /**
     * Creating a property with an invalid type must fail validation (422).
     */
    public function test_creating_property_with_invalid_type_fails(): void
    {
        $ti = $this->getUserByRole('TI');
        $condo = Condominium::first();

        $response = $this->actingAs($ti)->postJson('/api/properties', [
            'condominium_id' => $condo->id,
            'type'           => 'mansion',   // not in: house,apartment,parking,storage,commercial
            'number'         => 'INV-001',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['type']);
    }

    /**
     * Creating a property without condominium_id must fail validation (422).
     */
    public function test_creating_property_without_condo_id_fails(): void
    {
        $ti = $this->getUserByRole('TI');

        $response = $this->actingAs($ti)->postJson('/api/properties', [
            'type'   => 'apartment',
            'number' => 'NO-CONDO-001',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['condominium_id']);
    }

    // ──────────────────────────────────────────────────────────
    //  HAPPY PATHS — Authenticated Reads & TI Writes
    // ──────────────────────────────────────────────────────────

    /**
     * Any authenticated user (all 6 roles) can list properties.
     */
    public function test_any_authenticated_user_can_list_properties(): void
    {
        $roles = ['Administrador', 'Propietario', 'Residente', 'Comité', 'Colaborador', 'TI'];

        foreach ($roles as $roleName) {
            $user = $this->getUserByRole($roleName);

            $response = $this->actingAs($user)->getJson('/api/properties');

            $response->assertStatus(200);
            // Paginated endpoint → must contain a 'data' key
            $response->assertJsonStructure(['data']);
        }
    }

    /**
     * Any authenticated user can view a single property with its relationships.
     */
    public function test_any_authenticated_user_can_view_single_property(): void
    {
        $property = Property::first();
        $user = $this->getUserByRole('Propietario');

        $response = $this->actingAs($user)->getJson("/api/properties/{$property->id}");

        $response->assertStatus(200);
        $response->assertJsonFragment(['id' => $property->id]);
    }

    /**
     * TI (with 'configure system') can create a new property.
     */
    public function test_ti_can_create_property(): void
    {
        $ti = $this->getUserByRole('TI');
        $condo = Condominium::first();

        $payload = [
            'condominium_id' => $condo->id,
            'type'           => 'apartment',
            'number'         => 'NEW-101',
            'block'          => 'Torre Nueva',
            'floor'          => 3,
            'area_sqm'       => 75.5,
            'status'         => 'vacant',
        ];

        $response = $this->actingAs($ti)->postJson('/api/properties', $payload);

        $response->assertStatus(201);
        $this->assertDatabaseHas('properties', [
            'condominium_id' => $condo->id,
            'type'           => 'apartment',
            'number'         => 'NEW-101',
            'block'          => 'Torre Nueva',
            'floor'          => 3,
        ]);
    }

    /**
     * TI can update an existing property.
     */
    public function test_ti_can_update_property(): void
    {
        $ti = $this->getUserByRole('TI');
        $property = Property::first();

        $response = $this->actingAs($ti)->putJson("/api/properties/{$property->id}", [
            'number' => 'UPDATED-999',
            'status' => 'maintenance',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('properties', [
            'id'     => $property->id,
            'number' => 'UPDATED-999',
            'status' => 'maintenance',
        ]);
    }

    /**
     * TI can delete a property.
     */
    public function test_ti_can_delete_property(): void
    {
        $ti = $this->getUserByRole('TI');
        // Use the last property to avoid cascade issues with seeded relations
        $property = Property::latest('id')->first();

        $response = $this->actingAs($ti)->deleteJson("/api/properties/{$property->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('properties', ['id' => $property->id]);
    }
}
