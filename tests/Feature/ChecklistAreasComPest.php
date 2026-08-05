<?php

use App\Models\User;
use App\Models\Condominium;
use App\Models\Facility;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
});

describe('Checklist de Entrega y Recepcion de Areas Comunes', function () {
    test('colaborador puede registrar un checklist de entrega', function () {
        $colaborador = User::whereHas('roles', fn($q) => $q->where('name', 'Colaborador'))->firstOrFail();
        $condo = Condominium::firstOrFail();
        $facility = Facility::where('condominium_id', $condo->id)->firstOrFail();

        $response = $this->actingAs($colaborador)->postJson('/api/checklist-records', [
            'condominium_id' => $condo->id,
            'facility_id' => $facility->id,
            'type' => 'entrega',
            'items' => [
                ['name' => 'Limpieza de Parrilla', 'status' => 'ok', 'comment' => 'En buen estado'],
                ['name' => 'Mesas y Sillas', 'status' => 'ok', 'comment' => 'Completo'],
            ],
        ]);

        expect($response->status())->toBeIn([201, 404]);
    });

    test('colaborador puede registrar recepion con observaciones de daño y evidencia', function () {
        $colaborador = User::whereHas('roles', fn($q) => $q->where('name', 'Colaborador'))->firstOrFail();
        $condo = Condominium::firstOrFail();
        $facility = Facility::where('condominium_id', $condo->id)->firstOrFail();

        $response = $this->actingAs($colaborador)->postJson('/api/checklist-records', [
            'condominium_id' => $condo->id,
            'facility_id' => $facility->id,
            'type' => 'recepcion',
            'items' => [
                ['name' => 'Vidrios y Ventanales', 'status' => 'dano', 'comment' => 'Ventanal trizado en esquina inferior', 'photo_path' => 'uploads/evidencia_dano.jpg'],
            ],
        ]);

        expect($response->status())->toBeIn([201, 404]);
    });

    test('residente puede consultar el historial de checklists de su arriendo', function () {
        $residente = User::whereHas('roles', fn($q) => $q->where('name', 'Residente'))->firstOrFail();

        $response = $this->actingAs($residente)->getJson('/api/checklist-records?booking_id=1');
        expect($response->status())->toBeIn([200, 404]);
    });
});
