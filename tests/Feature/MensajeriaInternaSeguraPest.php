<?php

use App\Models\User;
use App\Models\Condominium;
use App\Models\Property;
use App\Models\Message;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
    Storage::fake('public');
});

describe('Mensajería Interna Segura (Alternativa a WhatsApp) API', function () {

    it('rejects unauthenticated requests', function () {
        $response = $this->getJson('/api/messages');
        $response->assertStatus(401);
    });

    it('fails validation when required fields are missing', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/messages', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['condominium_id', 'channel_type', 'content']);
    });

    it('creates a concierge-to-unit message associating property without exposing phone numbers', function () {
        $colaborador = User::whereHas('roles', fn ($q) => $q->where('name', 'Colaborador'))->first();
        $resident = User::whereHas('roles', fn ($q) => $q->where('name', 'Residente'))->first();
        $property = Property::first();
        Sanctum::actingAs($colaborador);

        $response = $this->postJson('/api/messages', [
            'condominium_id' => 1,
            'property_id' => $property->id,
            'channel_type' => 'conserjeria_unidad',
            'receiver_id' => $resident->id,
            'subject' => 'Aviso de Visita',
            'content' => 'Estimado vecino, tiene una visita en portería: Don Carlos Pérez.',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('channel_type', 'conserjeria_unidad')
            ->assertJsonPath('property_id', $property->id)
            ->assertJsonPath('content', 'Estimado vecino, tiene una visita en portería: Don Carlos Pérez.');

        $msg = Message::where('content', 'Estimado vecino, tiene una visita en portería: Don Carlos Pérez.')->first();
        expect($msg)->not->toBeNull()
            ->and($msg->property_id)->toBe($property->id)
            ->and($msg->channel_type)->toBe('conserjeria_unidad');
    });

    it('creates a private committee channel message', function () {
        $comite = User::whereHas('roles', fn ($q) => $q->where('name', 'Comité'))->first();
        Sanctum::actingAs($comite);

        $response = $this->postJson('/api/messages', [
            'condominium_id' => 1,
            'channel_type' => 'comite_privado',
            'subject' => 'Revisión de Presupuesto 2027',
            'content' => 'Se adjuntan cotizaciones de pintura exterior para votación en la próxima asamblea.',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('channel_type', 'comite_privado');

        $msg = Message::where('subject', 'Revisión de Presupuesto 2027')->first();
        expect($msg)->not->toBeNull()
            ->and($msg->channel_type)->toBe('comite_privado');
    });

    it('marks a message as read with timestamp', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        $resident = User::whereHas('roles', fn ($q) => $q->where('name', 'Residente'))->first();
        Sanctum::actingAs($resident);

        $message = Message::create([
            'condominium_id' => 1,
            'sender_id' => $admin->id,
            'receiver_id' => $resident->id,
            'channel_type' => 'directo',
            'subject' => 'Recordatorio de Pago',
            'content' => 'Su boleta del mes está disponible.',
            'is_read' => false,
        ]);

        $response = $this->putJson("/api/messages/{$message->id}/read");
        $response->assertStatus(200)
            ->assertJsonPath('is_read', true);

        $message->refresh();
        expect($message->is_read)->toBeTrue()
            ->and($message->read_at)->not->toBeNull();
    });
});
