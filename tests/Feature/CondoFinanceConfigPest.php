<?php

use App\Models\Condominium;
use App\Models\User;
use Spatie\Permission\Models\Role;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    $this->seed();

    Role::findOrCreate('admin', 'web');
    Role::findOrCreate('Comité', 'web');

    $this->condo = Condominium::create([
        'name' => 'Condominio Config Mora',
        'address' => 'Av. Las Torres 550',
        'city' => 'Concepción',
        'region' => 'Biobío',
        'units_count' => 5,
        'status' => 'active',
    ]);

    $this->admin = User::factory()->create(['name' => 'Admin', 'email' => 'finadmin@test.cl']);
    $this->admin->assignRole('admin');
});

describe('Configuración de mora del condominio (financeConfig)', function () {

    it('persiste due_day y late_interest_rate en la BD', function () {
        $response = $this->actingAs($this->admin)
            ->postJson("/api/condominiums/{$this->condo->id}/finance-config", [
                'due_day' => 20,
                'late_interest_rate' => 2.5,
            ]);

        $response->assertStatus(200);
        $response->assertJsonPath('condominium.due_day', 20);
        $response->assertJsonPath('condominium.late_interest_rate', 2.5);

        $fresh = $this->condo->fresh();
        expect($fresh->due_day)->toBe(20);
        expect(floatval($fresh->late_interest_rate))->toEqual(2.5);
    });

    it('valida límites: due_day fuera de 1-31 y tasa fuera de 0-100 retornan 422', function () {
        $badPayloads = [
            ['due_day' => 0, 'late_interest_rate' => 2.5],
            ['due_day' => 32, 'late_interest_rate' => 2.5],
            ['due_day' => 15, 'late_interest_rate' => -1],
            ['due_day' => 15, 'late_interest_rate' => 101],
            ['due_day' => 15, 'late_interest_rate' => 'abc'],
        ];

        foreach ($badPayloads as $payload) {
            $response = $this->actingAs($this->admin)
                ->postJson("/api/condominiums/{$this->condo->id}/finance-config", $payload);
            $response->assertStatus(422);
        }
    });

    it('update() también acepta y persiste due_day y late_interest_rate (compat con perfil condominio)', function () {
        $response = $this->actingAs($this->admin)
            ->putJson("/api/condominiums/{$this->condo->id}", [
                'name' => 'Condominio Renombrado',
                'due_day' => 10,
                'late_interest_rate' => 1.8,
            ]);

        $response->assertStatus(200);

        $fresh = $this->condo->fresh();
        expect($fresh->name)->toBe('Condominio Renombrado');
        expect($fresh->due_day)->toBe(10);
        expect(floatval($fresh->late_interest_rate))->toEqual(1.8);
    });
});