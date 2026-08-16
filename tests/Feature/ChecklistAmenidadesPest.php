<?php

use App\Models\User;
use App\Models\Condominium;
use App\Models\Property;
use App\Models\Booking;
use App\Models\FacilityChecklist;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
    Storage::fake('public');
});

describe('Checklist de Amenidades y Entrega de Áreas Comunes API', function () {

    it('rejects unauthenticated requests', function () {
        $response = $this->getJson('/api/facility-checklists');
        $response->assertStatus(401);
    });

    it('fails validation when required fields are missing', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/facility-checklists', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['condominium_id', 'facility_name', 'type']);
    });

    it('creates a check-in inspection with item status and evidence photos successfully', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        $resident = User::whereHas('roles', fn ($q) => $q->where('name', 'Residente'))->first();
        Sanctum::actingAs($admin);

        $photo1 = UploadedFile::fake()->image('quincho_entrega_1.jpg');
        $photo2 = UploadedFile::fake()->image('parrilla_limpia_2.jpg');

        $itemsStatus = [
            ['item' => 'Mobiliario (12 sillas, 2 mesas)', 'status' => 'ok', 'comment' => 'Completo'],
            ['item' => 'Parrilla y campana', 'status' => 'ok', 'comment' => 'Limpia'],
            ['item' => 'Iluminación y enchufes', 'status' => 'ok', 'comment' => 'Operativo'],
        ];

        $response = $this->postJson('/api/facility-checklists', [
            'condominium_id' => 1,
            'facility_name' => 'Quincho Panorámico Torre A',
            'type' => 'check_in',
            'received_by' => $resident->id,
            'status' => 'conforme',
            'items_status' => $itemsStatus,
            'photos' => [$photo1, $photo2],
            'notes' => 'Espacio entregado limpio al residente.',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('facility_name', 'Quincho Panorámico Torre A')
            ->assertJsonPath('type', 'check_in')
            ->assertJsonPath('status', 'conforme');

        $checklist = FacilityChecklist::where('notes', 'Espacio entregado limpio al residente.')->first();
        expect($checklist)->not->toBeNull()
            ->and($checklist->evidence_photos)->toBeArray()
            ->and(count($checklist->evidence_photos))->toBe(2);

        foreach ($checklist->evidence_photos as $photo) {
            Storage::disk('public')->assertExists($photo);
        }
    });

    it('creates a check-out inspection recording damages and deposit deduction', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        $resident = User::whereHas('roles', fn ($q) => $q->where('name', 'Residente'))->first();
        Sanctum::actingAs($admin);

        $damagePhoto = UploadedFile::fake()->image('silla_quebrada.jpg');

        $itemsStatus = [
            ['item' => 'Mobiliario', 'status' => 'danado', 'comment' => '1 silla plástica quebrada'],
            ['item' => 'Parrilla', 'status' => 'ok', 'comment' => 'Limpia'],
        ];

        $response = $this->postJson('/api/facility-checklists', [
            'condominium_id' => 1,
            'facility_name' => 'Quincho Panorámico Torre A',
            'type' => 'check_out',
            'received_by' => $resident->id,
            'status' => 'con_danos',
            'items_status' => $itemsStatus,
            'photos' => [$damagePhoto],
            'deposit_action' => 'cobrar_reparacion',
            'deposit_deduction_amount' => 15000,
            'notes' => 'Se descuenta valor de reposición de silla desde la garantía.',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('status', 'con_danos')
            ->assertJsonPath('deposit_action', 'cobrar_reparacion')
            ->assertJsonPath('deposit_deduction_amount', '15000.00');

        $checklist = FacilityChecklist::where('status', 'con_danos')->first();
        expect($checklist)->not->toBeNull()
            ->and($checklist->deposit_deduction_amount)->toEqual(15000);
    });

    it('lists checklists filtered by condominium and deletes record with photos', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        Sanctum::actingAs($admin);

        $fakePhoto = UploadedFile::fake()->image('evidencia_sala.jpg');
        $storedPath = $fakePhoto->store('checklists', 'public');

        $checklist = FacilityChecklist::create([
            'condominium_id' => 1,
            'facility_name' => 'Sala de Eventos',
            'type' => 'check_in',
            'status' => 'conforme',
            'evidence_photos' => [$storedPath],
        ]);

        $responseList = $this->getJson('/api/facility-checklists?condominium_id=1');
        $responseList->assertStatus(200);
        expect(count($responseList->json()))->toBeGreaterThanOrEqual(1);

        $responseDelete = $this->deleteJson("/api/facility-checklists/{$checklist->id}");
        $responseDelete->assertStatus(200);

        expect(FacilityChecklist::find($checklist->id))->toBeNull();
        Storage::disk('public')->assertMissing($storedPath);
    });
});
