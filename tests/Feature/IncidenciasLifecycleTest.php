<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Property;
use App\Models\TicketCategory;
use App\Models\Ticket;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class IncidenciasLifecycleTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Sembrar base de datos
        $this->seed();
    }

    private function getUserByRole(string $roleName): User
    {
        return User::whereHas('roles', function($q) use ($roleName) {
            $q->where('name', $roleName);
        })->first();
    }

    public function test_ticket_creation_validation_fails_with_invalid_data(): void
    {
        $resident = $this->getUserByRole('Residente');

        // Enviar datos vacíos
        $response = $this->actingAs($resident)->postJson('/api/tickets', [
            'title' => '',
            'description' => ''
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['property_id', 'created_by', 'category_id', 'title', 'description']);
    }

    public function test_ticket_creation_validation_fails_with_invalid_priority(): void
    {
        $resident = $this->getUserByRole('Residente');
        $property = Property::first();
        $category = TicketCategory::first();

        // Enviar prioridad fuera del enum
        $response = $this->actingAs($resident)->postJson('/api/tickets', [
            'property_id' => $property->id,
            'created_by' => $resident->id,
            'category_id' => $category->id,
            'title' => 'Fuga de agua',
            'description' => 'Fuga de agua en el baño',
            'priority' => 'extremely-urgent' // Invalid priority
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['priority']);
    }

    public function test_resident_can_create_ticket_successfully(): void
    {
        $resident = $this->getUserByRole('Residente');
        $property = Property::first();
        $category = TicketCategory::first();

        $response = $this->actingAs($resident)->postJson('/api/tickets', [
            'property_id' => $property->id,
            'created_by' => $resident->id,
            'category_id' => $category->id,
            'title' => 'Filtración en el baño',
            'description' => 'Hay una filtración constante en la tubería del lavamanos.',
            'priority' => 'high'
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('tickets', [
            'title' => 'Filtración en el baño',
            'created_by' => $resident->id,
            'status' => 'open'
        ]);
    }
    public function test_ticket_isolation_residents_cannot_see_each_others_tickets(): void
    {
        $residentA = $this->getUserByRole('Residente');
        
        // Crear otro residente manualmente
        $residentB = User::factory()->create();
        $residentB->assignRole('Residente');

        // Usamos una propiedad diferente (la segunda en la BD)
        $propertyB = Property::skip(1)->first();
        $category = TicketCategory::first();

        // Residente B crea un ticket en su propia propiedad aislada
        $ticketB = Ticket::factory()->create([
            'property_id' => $propertyB->id,
            'created_by' => $residentB->id,
            'category_id' => $category->id,
            'title' => 'Problema de Residente B',
            'description' => 'Este ticket pertenece a B',
        ]);

        // Residente A intenta ver el ticket de Residente B
        $response = $this->actingAs($residentA)->getJson("/api/tickets/{$ticketB->id}");
        $response->assertStatus(403);
    }

    public function test_admin_can_assign_ticket_to_employee(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $employee = $this->getUserByRole('Colaborador');

        $ticket = Ticket::factory()->create([
            'status' => 'open',
            'assigned_to' => null
        ]);

        $response = $this->actingAs($admin)->putJson("/api/tickets/{$ticket->id}/assign", [
            'assigned_to' => $employee->id
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('tickets', [
            'id' => $ticket->id,
            'assigned_to' => $employee->id
        ]);
    }

    public function test_employee_can_resolve_assigned_ticket(): void
    {
        $employee = $this->getUserByRole('Colaborador');

        $ticket = Ticket::factory()->create([
            'assigned_to' => $employee->id,
            'status' => 'open'
        ]);

        $response = $this->actingAs($employee)->putJson("/api/tickets/{$ticket->id}/resolve", [
            'resolution_notes' => 'Tubería ajustada y sellada con silicona.'
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('tickets', [
            'id' => $ticket->id,
            'status' => 'resolved',
            'resolution_notes' => 'Tubería ajustada y sellada con silicona.'
        ]);
    }

    public function test_unauthorized_user_cannot_resolve_ticket(): void
    {
        $resident = $this->getUserByRole('Residente');
        $employee = $this->getUserByRole('Colaborador');

        $ticket = Ticket::factory()->create([
            'assigned_to' => $employee->id,
            'status' => 'open'
        ]);

        // Residente sin permisos de resolución intenta resolver el ticket
        $response = $this->actingAs($resident)->putJson("/api/tickets/{$ticket->id}/resolve", [
            'resolution_notes' => 'Intento malicioso de resolución'
        ]);

        $response->assertStatus(403);
    }
}
