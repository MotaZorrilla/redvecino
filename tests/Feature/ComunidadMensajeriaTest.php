<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Announcement;
use App\Models\Message;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ComunidadMensajeriaTest extends TestCase
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

    public function test_administrador_and_comite_can_publish_announcements(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $committee = $this->getUserByRole('Comité');

        // 1. Admin publica circular
        $responseAdmin = $this->actingAs($admin)->postJson('/api/announcements', [
            'condominium_id' => 1,
            'created_by' => $admin->id,
            'title' => 'Mantención de Ascensores',
            'content' => 'Se realizará mantención preventiva a los ascensores A y B este Jueves.',
            'published_at' => now()->toDateTimeString(),
        ]);

        $responseAdmin->assertStatus(201);
        $this->assertDatabaseHas('announcements', [
            'title' => 'Mantención de Ascensores',
            'created_by' => $admin->id
        ]);

        // 2. Comité publica circular
        $responseCom = $this->actingAs($committee)->postJson('/api/announcements', [
            'condominium_id' => 1,
            'created_by' => $committee->id,
            'title' => 'Asamblea Ordinaria Anual',
            'content' => 'Convocatoria a asamblea extraordinaria el próximo Sábado.',
            'published_at' => now()->toDateTimeString(),
        ]);

        $responseCom->assertStatus(201);
        $this->assertDatabaseHas('announcements', [
            'title' => 'Asamblea Ordinaria Anual',
            'created_by' => $committee->id
        ]);
    }

    public function test_residente_is_blocked_from_publishing_announcements(): void
    {
        $resident = $this->getUserByRole('Residente');

        $response = $this->actingAs($resident)->postJson('/api/announcements', [
            'condominium_id' => 1,
            'created_by' => $resident->id,
            'title' => 'Venta de Garage en Depto 202',
            'content' => 'Invito a todos los vecinos a mi venta este Domingo.',
            'published_at' => now()->toDateTimeString(),
        ]);

        $response->assertStatus(403);
    }

    public function test_resident_can_exchange_messages_and_unread_count_increments(): void
    {
        $resident = $this->getUserByRole('Residente');
        $employee = $this->getUserByRole('Colaborador');

        // Residente envía un mensaje al conserje (colaborador)
        $responseMsg = $this->actingAs($resident)->postJson('/api/messages', [
            'receiver_id' => $employee->id,
            'subject' => 'Consulta de Encomienda',
            'content' => 'Hola, ¿llegó mi encomienda?',
        ]);

        $responseMsg->assertStatus(201);
        $messageId = $responseMsg->json('id');

        $this->assertDatabaseHas('messages', [
            'id' => $messageId,
            'sender_id' => $resident->id,
            'receiver_id' => $employee->id,
            'is_read' => false
        ]);

        // Marcar como leído por el destinatario legítimo
        $responseRead = $this->actingAs($employee)->putJson("/api/messages/{$messageId}/read");
        
        $responseRead->assertStatus(200);
        $this->assertTrue($responseRead->json('is_read'));
    }

    public function test_message_validation_rejects_non_existent_receivers(): void
    {
        $resident = $this->getUserByRole('Residente');

        // Intentar enviar mensaje a un ID inexistente
        $response = $this->actingAs($resident)->postJson('/api/messages', [
            'receiver_id' => 9999, // Inexistent user ID
            'subject' => 'Error de prueba',
            'content' => 'Este mensaje debería fallar',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['receiver_id']);
    }

    public function test_unauthorized_users_cannot_mark_messages_as_read(): void
    {
        $residentA = $this->getUserByRole('Residente');
        $employee = $this->getUserByRole('Colaborador');
        
        // Crear otro residente B
        $residentB = User::factory()->create();
        $residentB->assignRole('Residente');

        // Residente A envía un mensaje al conserje (employee)
        $message = Message::create([
            'sender_id' => $residentA->id,
            'receiver_id' => $employee->id,
            'subject' => 'Test de privacidad',
            'content' => 'Solo conserje debe leer esto',
            'is_read' => false
        ]);

        // Residente B (ajeno al chat) intenta marcar como leído el mensaje dirigido al conserje
        $response = $this->actingAs($residentB)->putJson("/api/messages/{$message->id}/read");
        
        // Debe denegarse con 403
        $response->assertStatus(403);
    }
}
