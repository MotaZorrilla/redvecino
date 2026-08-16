<?php

use App\Models\User;
use App\Models\Condominium;
use App\Models\Property;
use App\Models\AssemblyVoting;
use App\Models\AssemblyVotingOption;
use App\Models\AssemblyUnitVote;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
});

describe('Asambleas y Votaciones por Unidad (Ley 21.442) API', function () {

    it('rejects unauthenticated requests', function () {
        $response = $this->getJson('/api/assembly-votings');
        $response->assertStatus(401);
    });

    it('fails validation when required fields are missing on voting creation', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/assembly-votings', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['condominium_id', 'title', 'options']);
    });

    it('creates a formal assembly voting with multiple options successfully', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/assembly-votings', [
            'condominium_id' => 1,
            'title' => 'Aprobación Presupuesto Mantenimiento Ascensores 2027',
            'description' => 'Votación extraordinaria para contratar servicio Otis o Schindler.',
            'quorum_required_percent' => 50.0,
            'options' => [
                ['title' => 'Opción A - Contrato Otis ($4.500.000 anual)', 'description' => 'Incluye repuestos originales'],
                ['title' => 'Opción B - Contrato Schindler ($4.100.000 anual)', 'description' => 'Servicio preventivo 24/7'],
                ['title' => 'Rechazar ambas y buscar nuevas propuestas', 'description' => 'Mantener proveedor actual'],
            ],
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('title', 'Aprobación Presupuesto Mantenimiento Ascensores 2027')
            ->assertJsonPath('status', 'open');

        $voting = AssemblyVoting::where('title', 'Aprobación Presupuesto Mantenimiento Ascensores 2027')->first();
        expect($voting)->not->toBeNull()
            ->and($voting->options)->toHaveCount(3);
    });

    it('allows a unit to cast a vote with resolved alícuota weight', function () {
        $resident = User::whereHas('roles', fn ($q) => $q->where('name', 'Residente'))->first();
        $property = Property::first();
        Sanctum::actingAs($resident);

        $voting = AssemblyVoting::create([
            'condominium_id' => 1,
            'title' => 'Cambio de Luminarias LED',
            'quorum_required_percent' => 50.0,
            'status' => 'open',
        ]);

        $opt1 = AssemblyVotingOption::create(['assembly_voting_id' => $voting->id, 'title' => 'A favor']);
        $opt2 = AssemblyVotingOption::create(['assembly_voting_id' => $voting->id, 'title' => 'En contra']);

        $response = $this->postJson("/api/assembly-votings/{$voting->id}/vote", [
            'property_id' => $property->id,
            'assembly_voting_option_id' => $opt1->id,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('property_id', $property->id)
            ->assertJsonPath('assembly_voting_option_id', $opt1->id);

        $vote = AssemblyUnitVote::where('assembly_voting_id', $voting->id)->where('property_id', $property->id)->first();
        expect($vote)->not->toBeNull()
            ->and($vote->coefficient_weight)->toBeGreaterThan(0);
    });

    it('strictly prevents duplicate voting for the same unit (1 vote per property law)', function () {
        $resident = User::whereHas('roles', fn ($q) => $q->where('name', 'Residente'))->first();
        $property = Property::first();
        Sanctum::actingAs($resident);

        $voting = AssemblyVoting::create([
            'condominium_id' => 1,
            'title' => 'Pintura Fachada Torre Central',
            'quorum_required_percent' => 50.0,
            'status' => 'open',
        ]);

        $opt1 = AssemblyVotingOption::create(['assembly_voting_id' => $voting->id, 'title' => 'Aprobar']);

        // Primer voto: exitoso
        $response1 = $this->postJson("/api/assembly-votings/{$voting->id}/vote", [
            'property_id' => $property->id,
            'assembly_voting_option_id' => $opt1->id,
        ]);
        $response1->assertStatus(201);

        // Segundo intento de voto por la misma unidad: rechazado con 422
        $response2 = $this->postJson("/api/assembly-votings/{$voting->id}/vote", [
            'property_id' => $property->id,
            'assembly_voting_option_id' => $opt1->id,
        ]);
        $response2->assertStatus(422)
            ->assertJsonPath('message', 'Esta unidad ya emitió su voto en esta asamblea conforme al Art. 15 de la Ley 21.442.');
    });

    it('calculates legal quorum and weighted percentages tally correctly', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        Sanctum::actingAs($admin);

        $voting = AssemblyVoting::create([
            'condominium_id' => 1,
            'title' => 'Renovación Cámaras de Seguridad',
            'quorum_required_percent' => 30.0,
            'status' => 'open',
        ]);

        $opt1 = AssemblyVotingOption::create(['assembly_voting_id' => $voting->id, 'title' => 'Aprobado']);
        $opt2 = AssemblyVotingOption::create(['assembly_voting_id' => $voting->id, 'title' => 'Rechazado']);

        $properties = Property::where('condominium_id', 1)->take(3)->get();
        foreach ($properties as $idx => $prop) {
            AssemblyUnitVote::create([
                'assembly_voting_id' => $voting->id,
                'property_id' => $prop->id,
                'user_id' => $admin->id,
                'assembly_voting_option_id' => ($idx === 0) ? $opt1->id : $opt2->id,
                'coefficient_weight' => 0.05,
            ]);
        }

        $response = $this->getJson("/api/assembly-votings/{$voting->id}");
        $response->assertStatus(200)
            ->assertJsonPath('summary.voted_units_count', 3)
            ->assertJsonPath('summary.total_voted_coefficient', 0.15);
    });

    it('closes voting and locks further vote submissions', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        $resident = User::whereHas('roles', fn ($q) => $q->where('name', 'Residente'))->first();
        $property = Property::first();
        Sanctum::actingAs($admin);

        $voting = AssemblyVoting::create([
            'condominium_id' => 1,
            'title' => 'Reglamento de Mascotas y Ruidos Molestos',
            'status' => 'open',
        ]);
        $opt = AssemblyVotingOption::create(['assembly_voting_id' => $voting->id, 'title' => 'Aprobar']);

        $responseClose = $this->putJson("/api/assembly-votings/{$voting->id}/close");
        $responseClose->assertStatus(200)
            ->assertJsonPath('voting.status', 'closed');

        Sanctum::actingAs($resident);
        $responseVote = $this->postJson("/api/assembly-votings/{$voting->id}/vote", [
            'property_id' => $property->id,
            'assembly_voting_option_id' => $opt->id,
        ]);
        $responseVote->assertStatus(422)
            ->assertJsonPath('message', 'Esta votación se encuentra cerrada.');
    });
});
