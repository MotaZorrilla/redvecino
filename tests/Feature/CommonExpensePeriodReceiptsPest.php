<?php

namespace Tests\Feature;

use App\Models\CommonExpensePeriod;
use App\Models\Condominium;
use App\Models\Property;
use App\Models\User;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('get receipts paginated returns length aware paginator', function () {
    $this->seed(\Database\Seeders\RolePermissionSeeder::class);
    $this->seed(\Database\Seeders\DatabaseSeeder::class);

    $admin = User::where('email', 'admin@redvecino.cl')->first();
    $condo = Condominium::first();

    $period = CommonExpensePeriod::where('condominium_id', $condo->id)->first();
    $this->assertNotNull($period, 'Debe existir un período');

    // Verificar que hay receipts (el seeder crea 180 total, 30 por período)
    $this->assertGreaterThan(15, $period->receipts()->count(), 'Debe haber suficientes receipts para testear paginación');

    // Request con per_page=10
    $response = $this->actingAs($admin)
        ->getJson("/api/common-expense-periods/{$period->id}/receipts?per_page=10");

    $response->assertStatus(200);
    $data = $response->json();

    // La respuesta es {period, receipts: {data, current_page, ...}}
    $receipts = $data['receipts'];

    // Verificar estructura de LengthAwarePaginator dentro de receipts
    $this->assertArrayHasKey('current_page', $receipts);
    $this->assertArrayHasKey('last_page', $receipts);
    $this->assertArrayHasKey('per_page', $receipts);
    $this->assertArrayHasKey('total', $receipts);
    $this->assertArrayHasKey('data', $receipts);

    $this->assertEquals(10, $receipts['per_page']);
    $this->assertEquals(1, $receipts['current_page']);
    $this->assertGreaterThanOrEqual(2, $receipts['last_page']);
    $this->assertCount(10, $receipts['data']);
});

test('get receipts paginated respects page parameter', function () {
    $this->seed(\Database\Seeders\RolePermissionSeeder::class);
    $this->seed(\Database\Seeders\DatabaseSeeder::class);

    $admin = User::where('email', 'admin@redvecino.cl')->first();
    $condo = Condominium::first();

    $period = CommonExpensePeriod::where('condominium_id', $condo->id)->first();

    // Page 2
    $response = $this->actingAs($admin)
        ->getJson("/api/common-expense-periods/{$period->id}/receipts?per_page=10&page=2");

    $response->assertStatus(200);
    $data = $response->json();
    $receipts = $data['receipts'];

    $this->assertEquals(2, $receipts['current_page']);
    $this->assertCount(10, $receipts['data']);
});

test('get receipts filters by property id', function () {
    $this->seed(\Database\Seeders\RolePermissionSeeder::class);
    $this->seed(\Database\Seeders\DatabaseSeeder::class);

    $admin = User::where('email', 'admin@redvecino.cl')->first();
    $condo = Condominium::first();

    $period = CommonExpensePeriod::where('condominium_id', $condo->id)->first();
    $property = Property::where('condominium_id', $condo->id)->first();

    $response = $this->actingAs($admin)
        ->getJson("/api/common-expense-periods/{$period->id}/receipts?property_id={$property->id}");

    $response->assertStatus(200);
    $data = $response->json();
    $receipts = $data['receipts'];

    // Debe retornar solo el receipt de esa propiedad (paginado, 1 item en data)
    $this->assertCount(1, $receipts['data']);
    $receipt = $receipts['data'][0];
    $this->assertNotNull($receipt);
    $this->assertEquals($property->id, $receipt['property_id']);
});

test('get receipts default per page when not provided', function () {
    $this->seed(\Database\Seeders\RolePermissionSeeder::class);
    $this->seed(\Database\Seeders\DatabaseSeeder::class);

    $admin = User::where('email', 'admin@redvecino.cl')->first();
    $condo = Condominium::first();

    $period = CommonExpensePeriod::where('condominium_id', $condo->id)->first();

    // Sin per_page
    $response = $this->actingAs($admin)
        ->getJson("/api/common-expense-periods/{$period->id}/receipts");

    $response->assertStatus(200);
    $data = $response->json();
    $receipts = $data['receipts'];

    // Default 15 (Laravel default)
    $this->assertEquals(15, $receipts['per_page']);
});