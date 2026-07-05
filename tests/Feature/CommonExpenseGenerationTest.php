<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Condominium;
use App\Models\Property;
use App\Models\CondoExpense;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CommonExpenseGenerationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    private function getAdminUser(): User
    {
        return User::role('Administrador')->first();
    }

    public function test_admin_can_generate_and_publish_common_expense_period()
    {
        $admin = $this->getAdminUser();
        $condo = Condominium::first();
        
        Property::create([
            'condominium_id' => $condo->id,
            'type' => 'apartment',
            'number' => '101',
            'floor' => 1,
            'area_sqm' => 70,
            'status' => 'occupied'
        ]);
        
        // Ensure there is some expense
        CondoExpense::create([
            'condominium_id' => $condo->id,
            'amount' => 500000,
            'date' => now(),
            'category' => 'Mantenimiento',
            'distributable_method' => 'prorated',
            'description' => 'Test Expense'
        ]);

        $payload = [
            'condominium_id' => $condo->id,
            'period' => '2026-07'
        ];

        // Test generation
        $response = $this->actingAs($admin)->postJson('/api/common-expenses/generate', $payload);
        $response->assertStatus(200);
        
        $data = $response->json();
        $this->assertEquals('2026-07', $data['period']);
        $this->assertGreaterThan(0, $data['total_condo_expense']);
        $this->assertNotEmpty($data['bills']);

        // Test publish
        $publishPayload = [
            'condominium_id' => $condo->id,
            'period' => '2026-07',
            'due_date' => '2026-08-05',
            'total_amount' => $data['total_condo_expense']
        ];

        $publishResponse = $this->actingAs($admin)->postJson('/api/common-expenses/publish', $publishPayload);
        $publishResponse->assertStatus(200);

        $this->assertDatabaseHas('common_expenses', [
            'condominium_id' => $condo->id,
            'period' => '2026-07',
            'status' => 'published'
        ]);
    }
}
