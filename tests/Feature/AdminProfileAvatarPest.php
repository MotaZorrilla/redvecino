<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
    Storage::fake('public');
});

describe('Perfil de Administrador y Subida de Avatar API', function () {

    it('rejects unauthenticated profile update requests', function () {
        $response = $this->postJson('/api/profile', [
            'name' => 'Intento No Autorizado',
        ]);
        $response->assertStatus(401);
    });

    it('updates administrator profile contact information successfully', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/profile', [
            'name' => 'Héctor Mota Zorrilla',
            'email' => 'hector.mota@redvecino.cl',
            'phone' => '+56 9 9988 7766',
            'rut' => '16.789.123-4',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('message', 'Perfil actualizado con éxito.')
            ->assertJsonPath('user.name', 'Héctor Mota Zorrilla')
            ->assertJsonPath('user.email', 'hector.mota@redvecino.cl');

        $admin->refresh();
        expect($admin->name)->toBe('Héctor Mota Zorrilla')
            ->and($admin->phone)->toBe('+56 9 9988 7766')
            ->and($admin->rut)->toBe('16.789.123-4');
    });

    it('uploads and updates administrator profile avatar image successfully', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        Sanctum::actingAs($admin);

        $avatarFile = UploadedFile::fake()->image('avatar_admin.jpg', 400, 400);

        $response = $this->post('/api/profile', [
            'name' => $admin->name,
            'email' => $admin->email,
            'avatar' => $avatarFile,
        ], ['Accept' => 'application/json']);

        $response->assertStatus(200);

        $admin->refresh();
        expect($admin->avatar_path)->not->toBeNull();

        Storage::disk('public')->assertExists($admin->avatar_path);
    });

    it('validates email uniqueness on profile update', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        $otherUser = User::where('id', '!=', $admin->id)->first();
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/profile', [
            'name' => $admin->name,
            'email' => $otherUser->email,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    });
});
