<?php

use App\Models\User;
use App\Models\Condominium;
use App\Models\EmployeeProfile;
use App\Models\SupplyOrder;
use App\Models\CondoExpense;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
});

describe('Pedidos de Insumos y Aprobación Masiva API', function () {

    it('rejects unauthenticated requests', function () {
        $response = $this->getJson('/api/supply-orders');
        $response->assertStatus(401);
    });

    it('fails validation when mandatory fields are missing', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/supply-orders', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['condominium_id', 'description', 'quantity']);
    });

    it('fails when employee does not have allow_supplies permission', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        $employee = EmployeeProfile::first();
        $employee->update(['allow_supplies' => false]);
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/supply-orders', [
            'condominium_id' => 1,
            'employee_profile_id' => $employee->id,
            'description' => 'Escobillones industriales',
            'quantity' => 3,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['employee_profile_id']);
    });

    it('creates a supply order with category and notes successfully', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        $employee = EmployeeProfile::first();
        $employee->update(['allow_supplies' => true]);
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/supply-orders', [
            'condominium_id' => 1,
            'employee_profile_id' => $employee->id,
            'description' => 'Bomba pulverizadora de matamaleza',
            'quantity' => 2,
            'unit' => 'unidad',
            'category' => 'jardineria',
            'notes' => 'Urgente para mantención de áreas verdes.',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('description', 'Bomba pulverizadora de matamaleza')
            ->assertJsonPath('category', 'jardineria')
            ->assertJsonPath('status', 'pendiente');

        expect(SupplyOrder::where('description', 'Bomba pulverizadora de matamaleza')->exists())->toBeTrue();
    });

    it('bulk approves multiple supply orders in a single request', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        Sanctum::actingAs($admin);

        $order1 = SupplyOrder::create([
            'condominium_id' => 1,
            'description' => 'Cloro 5L',
            'quantity' => 10,
            'status' => 'pendiente',
        ]);
        $order2 = SupplyOrder::create([
            'condominium_id' => 1,
            'description' => 'Bolsas de basura 120L',
            'quantity' => 50,
            'status' => 'pendiente',
        ]);

        $response = $this->postJson('/api/supply-orders/bulk-approve', [
            'ids' => [$order1->id, $order2->id],
        ]);

        $response->assertStatus(200);
        expect($order1->fresh()->status)->toBe('en_compra')
            ->and($order2->fresh()->status)->toBe('en_compra');
    });

    it('marks supply order as purchased and records a condo expense in accounting', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        Sanctum::actingAs($admin);

        $order = SupplyOrder::create([
            'condominium_id' => 1,
            'description' => 'Luces LED pasillo',
            'quantity' => 15,
            'status' => 'en_compra',
        ]);

        $response = $this->putJson("/api/supply-orders/{$order->id}/mark-purchased", [
            'purchase_document' => 'FACT-984321',
            'amount' => 45000,
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('status', 'comprado')
            ->assertJsonPath('purchase_document', 'FACT-984321');

        $orderFresh = $order->fresh();
        expect($orderFresh->condo_expense_id)->not->toBeNull();

        $expense = CondoExpense::find($orderFresh->condo_expense_id);
        expect($expense)->not->toBeNull()
            ->and($expense->amount)->toEqual(45000)
            ->and($expense->description)->toContain('FACT-984321');
    });

    it('marks supply order as received by staff', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        Sanctum::actingAs($admin);

        $order = SupplyOrder::create([
            'condominium_id' => 1,
            'description' => 'Pintura tráfico amarillo',
            'quantity' => 2,
            'status' => 'comprado',
            'purchase_document' => 'BOL-1122',
        ]);

        $response = $this->putJson("/api/supply-orders/{$order->id}/mark-received");

        $response->assertStatus(200)
            ->assertJsonPath('status', 'recibido');

        expect($order->fresh()->status)->toBe('recibido');
    });
});
