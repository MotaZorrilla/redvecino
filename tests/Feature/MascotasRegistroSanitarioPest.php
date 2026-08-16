<?php

use App\Models\User;
use App\Models\Condominium;
use App\Models\Property;
use App\Models\UnitPet;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
    Storage::fake('public');
});

describe('Registro Sanitario de Mascotas y Tenencia Responsable API', function () {

    it('rejects unauthenticated requests', function () {
        $response = $this->getJson('/api/unit-pets');
        $response->assertStatus(401);
    });

    it('fails validation when mandatory fields are missing', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/unit-pets', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['property_id', 'name', 'species']);
    });

    it('creates a pet with chip number and medical record file successfully', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        $property = Property::first();
        Sanctum::actingAs($admin);

        $recordFile = UploadedFile::fake()->create('carnet_vacunas_toby.pdf', 1024, 'application/pdf');

        $response = $this->postJson('/api/unit-pets', [
            'property_id' => $property->id,
            'name' => 'Toby',
            'species' => 'perro',
            'breed' => 'Golden Retriever',
            'chip_number' => '941000025874123',
            'is_vaccinated' => true,
            'last_vaccine_date' => '2026-06-15',
            'medical_record' => $recordFile,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('name', 'Toby')
            ->assertJsonPath('chip_number', '941000025874123')
            ->assertJsonPath('is_vaccinated', true);

        $pet = UnitPet::where('name', 'Toby')->first();
        expect($pet)->not->toBeNull()
            ->and($pet->medical_record_path)->not->toBeNull();

        Storage::disk('public')->assertExists($pet->medical_record_path);
    });

    it('lists pets by property and deletes a pet with its file', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        $property = Property::first();
        Sanctum::actingAs($admin);

        $fakeFile = UploadedFile::fake()->image('gato_michi.png');
        $storedPath = $fakeFile->store('pets', 'public');

        $pet = UnitPet::create([
            'property_id' => $property->id,
            'name' => 'Michi',
            'species' => 'gato',
            'breed' => 'Siamés',
            'chip_number' => '941000099887766',
            'medical_record_path' => $storedPath,
        ]);

        $responseList = $this->getJson("/api/unit-pets?property_id={$property->id}");
        $responseList->assertStatus(200)
            ->assertJsonCount(1);

        $responseDelete = $this->deleteJson("/api/unit-pets/{$pet->id}");
        $responseDelete->assertStatus(200);

        expect(UnitPet::find($pet->id))->toBeNull();
        Storage::disk('public')->assertMissing($storedPath);
    });
});
