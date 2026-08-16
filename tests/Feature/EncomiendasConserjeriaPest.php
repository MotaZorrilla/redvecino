<?php

use App\Models\User;
use App\Models\Condominium;
use App\Models\Property;
use App\Models\PackageCustody;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
    Storage::fake('public');
});

describe('Módulo de Encomiendas de Conserjería (Front Desk) API', function () {

    it('rejects unauthenticated requests', function () {
        $response = $this->getJson('/api/package-custodies');
        $response->assertStatus(401);
    });

    it('fails validation when mandatory fields are missing', function () {
        $colaborador = User::whereHas('roles', fn ($q) => $q->where('name', 'Colaborador'))->first();
        Sanctum::actingAs($colaborador);

        $response = $this->postJson('/api/package-custodies', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['condominium_id', 'property_id', 'recipient_name']);
    });

    it('creates a package custody record with carrier, tracking and photo successfully', function () {
        $colaborador = User::whereHas('roles', fn ($q) => $q->where('name', 'Colaborador'))->first();
        $property = Property::first();
        Sanctum::actingAs($colaborador);

        $packagePhoto = UploadedFile::fake()->image('caja_amazon.jpg');

        $response = $this->post('/api/package-custodies', [
            'condominium_id' => 1,
            'property_id' => $property->id,
            'recipient_name' => 'Diego Alarcón Test',
            'carrier' => 'Chilexpress',
            'tracking_number' => 'CHX-UNIQUE-998877',
            'notes' => 'Caja mediana sellada en conserjería.',
            'photo' => $packagePhoto,
        ], ['Accept' => 'application/json']);

        $response->assertStatus(201)
            ->assertJsonPath('recipient_name', 'Diego Alarcón Test')
            ->assertJsonPath('carrier', 'Chilexpress')
            ->assertJsonPath('status', 'custody');

        $package = PackageCustody::where('tracking_number', 'CHX-UNIQUE-998877')->first();
        expect($package)->not->toBeNull()
            ->and($package->photo_path)->not->toBeNull();

        Storage::disk('public')->assertExists($package->photo_path);
    });

    it('marks a package as delivered with signature', function () {
        $colaborador = User::whereHas('roles', fn ($q) => $q->where('name', 'Colaborador'))->first();
        $property = Property::first();
        Sanctum::actingAs($colaborador);

        $package = PackageCustody::create([
            'condominium_id' => 1,
            'property_id' => $property->id,
            'recipient_name' => 'Lucelys García',
            'carrier' => 'MercadoLibre',
            'status' => 'custody',
        ]);

        $response = $this->putJson("/api/package-custodies/{$package->id}/deliver", [
            'signature' => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('status', 'delivered');

        $package->refresh();
        expect($package->status)->toBe('delivered')
            ->and($package->delivered_at)->not->toBeNull();
    });

    it('lists packages filtered by property and deletes record with photo', function () {
        $colaborador = User::whereHas('roles', fn ($q) => $q->where('name', 'Colaborador'))->first();
        $isolatedProperty = Property::factory()->create(['condominium_id' => 1]);
        Sanctum::actingAs($colaborador);

        $fakePhoto = UploadedFile::fake()->image('encomienda_starken.jpg');
        $storedPath = $fakePhoto->store('packages', 'public');

        $package = PackageCustody::create([
            'condominium_id' => 1,
            'property_id' => $isolatedProperty->id,
            'recipient_name' => 'Juan Pérez',
            'carrier' => 'Starken',
            'status' => 'custody',
            'photo_path' => $storedPath,
        ]);

        $responseList = $this->getJson("/api/package-custodies?condominium_id=1&property_id={$isolatedProperty->id}");
        $responseList->assertStatus(200)
            ->assertJsonCount(1);

        $responseDelete = $this->deleteJson("/api/package-custodies/{$package->id}");
        $responseDelete->assertStatus(200);

        expect(PackageCustody::find($package->id))->toBeNull();
        Storage::disk('public')->assertMissing($storedPath);
    });
});
