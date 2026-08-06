<?php

use App\Models\Condominium;
use App\Models\User;
use Spatie\Permission\Models\Role;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

describe('Perfil del Condominio & Actualización de Datos de Comunidad (Pest v3)', function () {

    beforeEach(function () {
        $this->seed();
        $this->condo = Condominium::firstOrFail();

        Role::findOrCreate('Administrador', 'web');
        Role::findOrCreate('Residente', 'web');

        $this->admin = User::factory()->create(['name' => 'Admin Profile Test']);
        $this->admin->assignRole('Administrador');

        $this->residente = User::factory()->create(['name' => 'Residente Profile Test']);
        $this->residente->assignRole('Residente');
    });

    it('permite al Administrador actualizar los datos del Perfil del Condominio', function () {
        $response = $this->actingAs($this->admin)->putJson("/api/condominiums/{$this->condo->id}", [
            'name' => 'Condominio Torre ENTEL Actualizado',
            'address' => 'Av. Manuel Rodriguez 5364, Chiguayante',
            'city' => 'Chiguayante',
        ]);

        $response->assertStatus(200);
        $response->assertJsonPath('condominium.name', 'Condominio Torre ENTEL Actualizado');

        expect($this->condo->fresh()->name)->toBe('Condominio Torre ENTEL Actualizado');
    });

    it('rechaza que un residente sin permisos actualice el perfil del condominio', function () {
        $response = $this->actingAs($this->residente)->putJson("/api/condominiums/{$this->condo->id}", [
            'name' => 'Intento Hacker',
        ]);

        $response->assertStatus(403);
    });

});
