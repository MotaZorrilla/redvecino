<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Condominium;
use App\Models\Property;
use App\Models\OwnerProfile;
use App\Models\CommonExpense;
use App\Models\Payment;
use App\Models\Booking;
use App\Models\QrInvitation;
use App\Models\PackageCustody;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use Carbon\Carbon;

class RoadmapFeaturesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    private function getUserByRole(string $roleName): User
    {
        $user = User::whereHas('roles', function($q) use ($roleName) {
            $q->where('name', $roleName);
        })->first();

        if (!$user) {
            $this->fail("No user found with role: {$roleName}");
        }

        return $user;
    }

    /**
     * 1. Test PIN Authentication (Acceso Preferencial)
     */
    public function test_user_can_login_with_rut_and_pin(): void
    {
        $resident = $this->getUserByRole('Residente');
        
        // Update user to have a PIN
        $resident->update(['pin' => '1234']);

        $response = $this->postJson('/api/login-pin', [
            'rut' => $resident->rut,
            'pin' => '1234'
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['token', 'message', 'user']);
    }

    public function test_pin_login_validation_rules(): void
    {
        $resident = $this->getUserByRole('Residente');

        // Invalid format: Letters
        $this->postJson('/api/login-pin', [
            'rut' => $resident->rut,
            'pin' => 'abcd'
        ])->assertStatus(422);

        // Invalid format: Too short
        $this->postJson('/api/login-pin', [
            'rut' => $resident->rut,
            'pin' => '12'
        ])->assertStatus(422);

        // Invalid credentials
        $this->postJson('/api/login-pin', [
            'rut' => $resident->rut,
            'pin' => '9999'
        ])->assertStatus(401);
    }

    /**
     * 2. Test Alertas de Morosidad & Areas Comunes
     */
    public function test_moroso_cannot_book_common_areas_and_restores_on_pay(): void
    {
        $resident = $this->getUserByRole('Residente');
        $condo = Condominium::first();
        $property = Property::where('condominium_id', $condo->id)->first();

        // Clean up seeded expenses and payments for isolation
        CommonExpense::query()->delete();
        Payment::query()->delete();

        // Bind property to resident
        $resident->residentProfile()->create([
            'property_id' => $property->id,
            'resident_type' => 'tenant'
        ]);

        // Create 3 unpaid common expenses
        $expenses = [];
        for ($i = 1; $i <= 3; $i++) {
            $expenses[] = CommonExpense::create([
                'condominium_id' => $condo->id,
                'period' => "2026-0{$i}",
                'amount' => 50000.00,
                'due_date' => "2026-0{$i}-10",
                'status' => 'pending'
            ]);
        }

        // 1. Attempt to book - should be blocked (HTTP 403)
        $response = $this->actingAs($resident)->postJson('/api/bookings', [
            'property_id' => $property->id,
            'area_name' => 'Quincho Principal',
            'booking_date' => Carbon::tomorrow()->toDateString(),
            'time_slot' => '18:00-22:00'
        ]);

        $response->assertStatus(403);
        $response->assertJsonFragment([
            'message' => 'El uso de áreas comunes está bloqueado para esta propiedad debido a morosidad (3 o más meses de gastos comunes pendientes).'
        ]);

        // 2. Pay 1 common expense to bring unpaid count to 2 months
        Payment::create([
            'user_id' => $resident->id,
            'property_id' => $property->id,
            'common_expense_id' => $expenses[0]->id,
            'amount' => 50000.00,
            'payment_date' => Carbon::now()->toDateString(),
            'payment_method' => 'transfer',
            'status' => 'completed' // Reconciled/Paid
        ]);

        // 3. Attempt to book again - should be allowed (HTTP 201)
        $responseAllow = $this->actingAs($resident)->postJson('/api/bookings', [
            'property_id' => $property->id,
            'area_name' => 'Quincho Principal',
            'booking_date' => Carbon::tomorrow()->toDateString(),
            'time_slot' => '18:00-22:00'
        ]);

        $responseAllow->assertStatus(201);
        $this->assertDatabaseHas('bookings', [
            'user_id' => $resident->id,
            'area_name' => 'Quincho Principal',
            'status' => 'approved'
        ]);
    }

    /**
     * 3. Test QR Invitations (Control de Accesos Físicos)
     */
    public function test_qr_invitation_generation_and_single_use_scanning(): void
    {
        $resident = $this->getUserByRole('Residente');
        $condo = Condominium::first();

        // 1. Generate invitation
        $responseGen = $this->actingAs($resident)->postJson('/api/qr-invitations', [
            'condominium_id' => $condo->id,
            'visitor_name' => 'Marta Sánchez',
            'visitor_rut' => '19.876.543-2',
            'expires_in_hours' => 2
        ]);

        $responseGen->assertStatus(201);
        $code = $responseGen->json('code');
        $this->assertNotNull($code);

        // 2. First scan - allowed (HTTP 200)
        $responseScan1 = $this->actingAs($resident)->postJson('/api/qr-invitations/verify', [
            'code' => $code
        ]);
        $responseScan1->assertStatus(200);
        $responseScan1->assertJsonFragment([
            'message' => 'Invitación válida. Acceso permitido.'
        ]);

        // 3. Second scan - blocked (HTTP 410 Gone)
        $responseScan2 = $this->actingAs($resident)->postJson('/api/qr-invitations/verify', [
            'code' => $code
        ]);
        $responseScan2->assertStatus(410);
        $responseScan2->assertJsonFragment([
            'message' => 'Este código QR ya ha sido utilizado.'
        ]);
    }

    public function test_expired_qr_invitation_is_rejected(): void
    {
        $resident = $this->getUserByRole('Residente');
        $condo = Condominium::first();

        // Create an already expired invitation
        $invitation = QrInvitation::create([
            'user_id' => $resident->id,
            'condominium_id' => $condo->id,
            'visitor_name' => 'Jorge Ramos',
            'code' => 'expired_test_code',
            'scanned_count' => 0,
            'expires_at' => now()->subMinutes(1)
        ]);

        $response = $this->actingAs($resident)->postJson('/api/qr-invitations/verify', [
            'code' => 'expired_test_code'
        ]);

        $response->assertStatus(410);
        $response->assertJsonFragment([
            'message' => 'El código QR ha expirado.'
        ]);
    }

    /**
     * 4. Test Front Desk - Conserjería OCR & Custodia
     */
    public function test_package_custody_lifecycle(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $resident = $this->getUserByRole('Residente');
        $condo = Condominium::first();
        $property = Property::where('condominium_id', $condo->id)->first();

        // 1. Register package
        $responseReg = $this->actingAs($admin)->postJson('/api/package-custodies', [
            'condominium_id' => $condo->id,
            'property_id' => $property->id,
            'recipient_name' => $resident->name,
            'carrier' => 'Chilexpress',
            'tracking_number' => '1234567890'
        ]);

        $responseReg->assertStatus(201);
        $packageId = $responseReg->json('id');
        $this->assertNotNull($packageId);

        // 2. Deliver package (fails without signature)
        $this->actingAs($admin)->putJson("/api/package-custodies/{$packageId}/deliver", [])
            ->assertStatus(422);

        // 3. Deliver package successfully with signature
        $responseDeliv = $this->actingAs($admin)->putJson("/api/package-custodies/{$packageId}/deliver", [
            'signature' => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
        ]);

        $responseDeliv->assertStatus(200);
        $this->assertEquals('delivered', $responseDeliv->json('status'));
        $this->assertNotNull($responseDeliv->json('delivered_at'));
    }

    /**
     * 5. Test Gobernanza y Votaciones: Quórum de asambleas
     */
    public function test_assembly_quorum_calculation(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $condo = Condominium::first();

        // Setup 4 properties
        Property::query()->delete();
        $p1 = Property::create([
            'condominium_id' => $condo->id,
            'type' => 'apartment',
            'number' => 'A-101',
            'area_sqm' => 100,
        ]);
        $p2 = Property::create([
            'condominium_id' => $condo->id,
            'type' => 'apartment',
            'number' => 'B-102',
            'area_sqm' => 100,
        ]);
        $p3 = Property::create([
            'condominium_id' => $condo->id,
            'type' => 'apartment',
            'number' => 'C-103',
            'area_sqm' => 100,
        ]);
        $p4 = Property::create([
            'condominium_id' => $condo->id,
            'type' => 'apartment',
            'number' => 'D-104',
            'area_sqm' => 100,
        ]);

        // Bind owner profiles with coefficient percentages
        OwnerProfile::create([
            'user_id' => User::factory()->create()->id,
            'property_id' => $p1->id,
            'ownership_percentage' => 30.00, // 30%
        ]);
        OwnerProfile::create([
            'user_id' => User::factory()->create()->id,
            'property_id' => $p2->id,
            'ownership_percentage' => 25.00, // 25%
        ]);
        OwnerProfile::create([
            'user_id' => User::factory()->create()->id,
            'property_id' => $p3->id,
            'ownership_percentage' => 25.00, // 25%
        ]);
        OwnerProfile::create([
            'user_id' => User::factory()->create()->id,
            'property_id' => $p4->id,
            'ownership_percentage' => 20.00, // 20%
        ]);

        // Scenario 1: Only p1 and p4 attend (total coefficient: 30 + 20 = 50%, headcount: 2/4 = 50%) -> Quorum OK
        $responseQuorumOk = $this->actingAs($admin)->postJson('/api/quorum-calculation', [
            'condominium_id' => $condo->id,
            'attendees' => [$p1->id, $p4->id]
        ]);

        $responseQuorumOk->assertStatus(200);
        $this->assertTrue($responseQuorumOk->json('has_quorum'));
        $this->assertEquals(50.0, $responseQuorumOk->json('coefficient_quorum_percentage'));
        $this->assertEquals(50.0, $responseQuorumOk->json('headcount_quorum_percentage'));

        // Scenario 2: Only p4 attends (total coefficient: 20%, headcount: 1/4 = 25%) -> No Quorum
        $responseNoQuorum = $this->actingAs($admin)->postJson('/api/quorum-calculation', [
            'condominium_id' => $condo->id,
            'attendees' => [$p4->id]
        ]);

        $responseNoQuorum->assertStatus(200);
        $this->assertFalse($responseNoQuorum->json('has_quorum'));
    }

    /**
     * 6. Test Contabilidad por Partida Doble: Inmunidad de fondos
     */
    public function test_reserve_fund_requires_committee_approval(): void
    {
        $admin = $this->getUserByRole('Administrador');
        $condo = Condominium::first();

        // Transfer from Operational to Reserve is always allowed
        $this->actingAs($admin)->postJson('/api/funds/transfer', [
            'condominium_id' => $condo->id,
            'amount' => 150000,
            'source_fund' => 'operational',
            'destination_fund' => 'reserve',
            'committee_approved' => false
        ])->assertStatus(200);

        // Transfer from Reserve to Operational without committee approval is BLOCKED (403)
        $this->actingAs($admin)->postJson('/api/funds/transfer', [
            'condominium_id' => $condo->id,
            'amount' => 50000,
            'source_fund' => 'reserve',
            'destination_fund' => 'operational',
            'committee_approved' => false
        ])->assertStatus(403);

        // Transfer from Reserve to Operational WITH committee approval is ALLOWED (200)
        $this->actingAs($admin)->postJson('/api/funds/transfer', [
            'condominium_id' => $condo->id,
            'amount' => 50000,
            'source_fund' => 'reserve',
            'destination_fund' => 'operational',
            'committee_approved' => true
        ])->assertStatus(200);
    }
}
