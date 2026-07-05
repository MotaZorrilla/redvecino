<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Condominium;
use App\Models\CondoTower;
use App\Models\Property;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CondominiumSetupTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    private function getTiUser(): User
    {
        return User::role('TI')->first();
    }

    public function test_ti_can_setup_condominium_towers_and_units()
    {
        $ti = $this->getTiUser();
        
        $condo = Condominium::create([
            'name' => 'New Setup Condo',
            'address' => '123 Test St',
            'city' => 'Test City',
            'region' => 'Metropolitana',
            'postal_code' => '1234567',
            'units_count' => 50,
            'status' => 'active'
        ]);

        $payload = [
            'condominium_id' => $condo->id,
            'type' => 'tower',
            'towers' => [
                [
                    'name' => 'Torre A',
                    'floors' => 10,
                    'units_per_floor' => 4,
                    'has_water_meter' => true,
                    'has_electricity_meter' => false
                ],
                [
                    'name' => 'Torre B',
                    'floors' => 5,
                    'units_per_floor' => 2,
                    'has_water_meter' => false,
                    'has_electricity_meter' => false
                ]
            ]
        ];

        $response = $this->actingAs($ti)->postJson('/api/setup-condominium', $payload);
        $response->assertStatus(201);

        $this->assertDatabaseHas('condo_towers', [
            'condominium_id' => $condo->id,
            'name' => 'Torre A'
        ]);

        $this->assertDatabaseHas('condo_towers', [
            'condominium_id' => $condo->id,
            'name' => 'Torre B'
        ]);

        $towerA = CondoTower::where('name', 'Torre A')->where('condominium_id', $condo->id)->first();
        $towerB = CondoTower::where('name', 'Torre B')->where('condominium_id', $condo->id)->first();

        // 10 floors * 4 units = 40 units for Tower A
        $this->assertCount(40, Property::where('tower_id', $towerA->id)->get());
        
        // 5 floors * 2 units = 10 units for Tower B
        $this->assertCount(10, Property::where('tower_id', $towerB->id)->get());
    }

    public function test_copy_tower_structure()
    {
        $ti = $this->getTiUser();
        $condo = Condominium::create([
            'name' => 'Copy Tower Condo',
            'address' => '123 Test St',
            'city' => 'Test City',
            'region' => 'Metropolitana',
            'postal_code' => '1234567',
            'units_count' => 10,
            'status' => 'active'
        ]);

        $tower = CondoTower::create([
            'condominium_id' => $condo->id,
            'name' => 'Torre Original',
            'has_water_meter' => true,
        ]);

        Property::create(['condominium_id' => $condo->id, 'tower_id' => $tower->id, 'type' => 'apartment', 'number' => '101', 'floor' => 1]);
        Property::create(['condominium_id' => $condo->id, 'tower_id' => $tower->id, 'type' => 'apartment', 'number' => '102', 'floor' => 1]);

        $payload = [
            'condominium_id' => $condo->id,
            'source_tower_id' => $tower->id,
            'new_tower_name' => 'Torre Copiada'
        ];

        $response = $this->actingAs($ti)->postJson('/api/setup-condominium/copy-tower', $payload);
        $response->assertStatus(201);

        $this->assertDatabaseHas('condo_towers', [
            'condominium_id' => $condo->id,
            'name' => 'Torre Copiada'
        ]);

        $newTower = CondoTower::where('name', 'Torre Copiada')->first();
        $this->assertCount(2, Property::where('tower_id', $newTower->id)->get());
    }
}
