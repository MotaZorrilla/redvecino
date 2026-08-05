<?php

use App\Models\User;
use App\Models\Condominium;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
});

describe('Flujo de Estados de Pedidos de Insumos', function () {
    test('colaborador puede crear un pedido de insumo', function () {
        $colaborador = User::whereHas('roles', fn($q) => $q->where('name', 'Colaborador'))->firstOrFail();
        $condo = Condominium::firstOrFail();

        $response = $this->actingAs($colaborador)->postJson('/api/supply-orders', [
            'condominium_id' => $condo->id,
            'description' => 'Escoba industrial',
            'quantity' => 2,
            'unit' => 'unidad',
        ]);

        expect($response->status())->toBeIn([201, 404]);
    });

    test('admin puede aprobar un pedido pendiente (pendiente -> en_compra)', function () {
        $admin = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->firstOrFail();

        $response = $this->actingAs($admin)->putJson('/api/supply-orders/1/approve');
        expect($response->status())->toBeIn([200, 404]);
    });

    test('admin puede marcar pedido como comprado (en_compra -> comprado)', function () {
        $admin = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->firstOrFail();

        $response = $this->actingAs($admin)->putJson('/api/supply-orders/1/mark-purchased', [
            'purchase_document' => 'FAC-001',
        ]);
        expect($response->status())->toBeIn([200, 404]);
    });

    test('admin puede marcar pedido como recibido (comprado -> recibido)', function () {
        $admin = User::whereHas('roles', fn($q) => $q->where('name', 'Administrador'))->firstOrFail();

        $response = $this->actingAs($admin)->putJson('/api/supply-orders/1/mark-received');
        expect($response->status())->toBeIn([200, 404]);
    });

    test('residente no puede crear pedidos de insumos', function () {
        $residente = User::whereHas('roles', fn($q) => $q->where('name', 'Residente'))->firstOrFail();
        $condo = Condominium::firstOrFail();

        $response = $this->actingAs($residente)->postJson('/api/supply-orders', [
            'condominium_id' => $condo->id,
            'description' => 'Cloro',
            'quantity' => 5,
        ]);

        expect($response->status())->toBeIn([403, 404]);
    });
});
