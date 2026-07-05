<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Property;
use App\Models\Ticket;
use App\Models\TicketCategory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TicketLifecycleTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    private function getUserByRole(string $roleName): User
    {
        return User::whereHas('roles', function($q) use ($roleName) {
            $q->where('name', $roleName);
        })->first();
    }

    // ─── UNHAPPY PATHS (VALIDATION) ────────────────────────────────────

    public function test_ticket_requires_title_and_description(): void
    {
        $propietario = $this->getUserByRole('Propietario');

        $response = $this->actingAs($propietario)->postJson('/api/tickets', [
            'property_id' => Property::first()->id,
            'created_by' => $propietario->id,
            'category_id' => TicketCategory::first()->id,
            // Missing title and description
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['title', 'description']);
    }

    public function test_ticket_requires_valid_category(): void
    {
        $propietario = $this->getUserByRole('Propietario');

        $response = $this->actingAs($propietario)->postJson('/api/tickets', [
            'property_id' => Property::first()->id,
            'created_by' => $propietario->id,
            'category_id' => 99999, // non-existent
            'title' => 'Test Ticket',
            'description' => 'Test description',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['category_id']);
    }

    public function test_ticket_requires_valid_property(): void
    {
        $propietario = $this->getUserByRole('Propietario');

        $response = $this->actingAs($propietario)->postJson('/api/tickets', [
            'property_id' => 99999, // non-existent
            'created_by' => $propietario->id,
            'category_id' => TicketCategory::first()->id,
            'title' => 'Propiedad inexistente',
            'description' => 'Esta propiedad no existe',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['property_id']);
    }

    public function test_ticket_rejects_invalid_priority(): void
    {
        $propietario = $this->getUserByRole('Propietario');

        $response = $this->actingAs($propietario)->postJson('/api/tickets', [
            'property_id' => Property::first()->id,
            'created_by' => $propietario->id,
            'category_id' => TicketCategory::first()->id,
            'title' => 'Prioridad inválida',
            'description' => 'Usando una prioridad que no existe',
            'priority' => 'super_critica', // invalid enum
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['priority']);
    }

    // ─── PERMISSION ENFORCEMENT (RBAC) ─────────────────────────────────

    public function test_propietario_cannot_assign_ticket(): void
    {
        $propietario = $this->getUserByRole('Propietario');
        $colaborador = $this->getUserByRole('Colaborador');
        $ticket = Ticket::first();

        $response = $this->actingAs($propietario)->putJson("/api/tickets/{$ticket->id}/assign", [
            'assigned_to' => $colaborador->id,
        ]);

        $response->assertStatus(403);
    }

    public function test_residente_cannot_assign_ticket(): void
    {
        $residente = $this->getUserByRole('Residente');
        $colaborador = $this->getUserByRole('Colaborador');
        $ticket = Ticket::first();

        $response = $this->actingAs($residente)->putJson("/api/tickets/{$ticket->id}/assign", [
            'assigned_to' => $colaborador->id,
        ]);

        $response->assertStatus(403);
    }

    public function test_residente_cannot_resolve_ticket(): void
    {
        $residente = $this->getUserByRole('Residente');
        $ticket = Ticket::first();

        $response = $this->actingAs($residente)->putJson("/api/tickets/{$ticket->id}/resolve", [
            'resolution_notes' => 'Intentando resolver sin permiso',
        ]);

        $response->assertStatus(403);
    }

    public function test_propietario_cannot_resolve_ticket(): void
    {
        $propietario = $this->getUserByRole('Propietario');
        $ticket = Ticket::first();

        $response = $this->actingAs($propietario)->putJson("/api/tickets/{$ticket->id}/resolve", [
            'resolution_notes' => 'Intentando resolver sin permiso',
        ]);

        $response->assertStatus(403);
    }

    public function test_residente_cannot_update_ticket(): void
    {
        $residente = $this->getUserByRole('Residente');
        $ticket = Ticket::first();

        $response = $this->actingAs($residente)->putJson("/api/tickets/{$ticket->id}", [
            'status' => 'closed',
        ]);

        $response->assertStatus(403);
    }

    // ─── HAPPY PATHS ───────────────────────────────────────────────────

    public function test_propietario_can_create_ticket(): void
    {
        $propietario = $this->getUserByRole('Propietario');
        $property = Property::first();
        $category = TicketCategory::first();

        $response = $this->actingAs($propietario)->postJson('/api/tickets', [
            'property_id' => $property->id,
            'created_by' => $propietario->id,
            'category_id' => $category->id,
            'title' => 'Filtración de agua en el baño',
            'description' => 'Hay una filtración en la cañería del segundo piso.',
            'priority' => 'high',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('tickets', [
            'title' => 'Filtración de agua en el baño',
            'created_by' => $propietario->id,
            'property_id' => $property->id,
            'category_id' => $category->id,
            'priority' => 'high',
        ]);
    }

    public function test_residente_can_create_ticket(): void
    {
        $residente = $this->getUserByRole('Residente');
        $property = Property::first();
        $category = TicketCategory::first();

        $response = $this->actingAs($residente)->postJson('/api/tickets', [
            'property_id' => $property->id,
            'created_by' => $residente->id,
            'category_id' => $category->id,
            'title' => 'Ruido excesivo en horario nocturno',
            'description' => 'Vecino del piso superior con música alta después de medianoche.',
            'priority' => 'medium',
        ]);

        $response->assertStatus(201);
        $response->assertJsonFragment(['title' => 'Ruido excesivo en horario nocturno']);
    }

    public function test_admin_can_assign_ticket_to_colaborador(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $colaborador = $this->getUserByRole('Colaborador');
        $ticket = Ticket::first();

        $response = $this->actingAs($admin)->putJson("/api/tickets/{$ticket->id}/assign", [
            'assigned_to' => $colaborador->id,
        ]);

        $response->assertStatus(200);
        $this->assertEquals($colaborador->id, $ticket->fresh()->assigned_to);
    }

    public function test_colaborador_can_resolve_ticket(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $colaborador = $this->getUserByRole('Colaborador');
        $ticket = Ticket::first();

        // First assign
        $this->actingAs($admin)->putJson("/api/tickets/{$ticket->id}/assign", [
            'assigned_to' => $colaborador->id,
        ]);

        // Then resolve
        $response = $this->actingAs($colaborador)->putJson("/api/tickets/{$ticket->id}/resolve", [
            'resolution_notes' => 'Problema solucionado, se reemplazó la cañería defectuosa.',
            'attachment_path' => 'evidencia.png'
        ]);

        $response->assertStatus(200);
        $this->assertEquals('resolved', $ticket->fresh()->status);
        $this->assertNotNull($ticket->fresh()->resolved_at);
    }

    public function test_resolving_ticket_requires_photo_evidence(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $colaborador = $this->getUserByRole('Colaborador');
        $ticket = Ticket::first();

        // First assign
        $this->actingAs($admin)->putJson("/api/tickets/{$ticket->id}/assign", [
            'assigned_to' => $colaborador->id,
        ]);

        // Attempt resolving without attachments or attachment_path or photo
        $response = $this->actingAs($colaborador)->putJson("/api/tickets/{$ticket->id}/resolve", [
            'resolution_notes' => 'Problema solucionado sin foto.',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['evidence']);
    }

    public function test_admin_can_update_ticket_status(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $ticket = Ticket::first();

        $response = $this->actingAs($admin)->putJson("/api/tickets/{$ticket->id}", [
            'status' => 'in_progress',
        ]);

        $response->assertStatus(200);
        $this->assertEquals('in_progress', $ticket->fresh()->status);
    }

    public function test_can_list_ticket_categories(): void
    {
        $admin = $this->getUserByRole('Administrador');

        $response = $this->actingAs($admin)->getJson('/api/ticket-categories');

        $response->assertStatus(200);
        $this->assertGreaterThanOrEqual(7, count($response->json()));
    }

    public function test_resolve_requires_resolution_notes(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $ticket = Ticket::first();

        $response = $this->actingAs($admin)->putJson("/api/tickets/{$ticket->id}/resolve", [
            'attachment_path' => 'evidencia.png'
            // Missing resolution_notes
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['resolution_notes']);
    }

    public function test_assign_requires_valid_user(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $ticket = Ticket::first();

        $response = $this->actingAs($admin)->putJson("/api/tickets/{$ticket->id}/assign", [
            'assigned_to' => 99999, // non-existent
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['assigned_to']);
    }
}
