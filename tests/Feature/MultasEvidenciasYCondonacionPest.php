<?php

use App\Models\User;
use App\Models\Condominium;
use App\Models\Property;
use App\Models\Fine;
use App\Models\Payment;
use App\Models\CommonExpense;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
    Storage::fake('public');
});

describe('Multas con Evidencia Fotográfica y Condonación de Mora API', function () {

    it('creates a fine with up to 3 evidence photos successfully', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        $resident = User::whereHas('roles', fn ($q) => $q->where('name', 'Residente'))->first();
        $property = Property::first();
        Sanctum::actingAs($admin);

        $photo1 = UploadedFile::fake()->image('estacionamiento_indebido_1.jpg');
        $photo2 = UploadedFile::fake()->image('estacionamiento_indebido_2.png');

        $response = $this->postJson('/api/fines', [
            'user_id' => $resident->id,
            'property_id' => $property->id,
            'reason' => 'Estacionamiento en lugar de visitas reiterado',
            'amount' => 50000,
            'issued_date' => '2026-08-15',
            'due_date' => '2026-08-30',
            'evidences' => [$photo1, $photo2],
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('reason', 'Estacionamiento en lugar de visitas reiterado');

        $fine = Fine::where('reason', 'Estacionamiento en lugar de visitas reiterado')->first();
        expect($fine)->not->toBeNull()
            ->and($fine->evidence_paths)->toBeArray()
            ->and(count($fine->evidence_paths))->toBe(2);

        foreach ($fine->evidence_paths as $path) {
            Storage::disk('public')->assertExists($path);
        }
    });

    it('rejects fine creation when more than 3 evidence photos are submitted', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        $resident = User::whereHas('roles', fn ($q) => $q->where('name', 'Residente'))->first();
        $property = Property::first();
        Sanctum::actingAs($admin);

        $photos = [
            UploadedFile::fake()->image('p1.jpg'),
            UploadedFile::fake()->image('p2.jpg'),
            UploadedFile::fake()->image('p3.jpg'),
            UploadedFile::fake()->image('p4.jpg'),
        ];

        $response = $this->postJson('/api/fines', [
            'user_id' => $resident->id,
            'property_id' => $property->id,
            'reason' => 'Ruidos molestos',
            'amount' => 30000,
            'issued_date' => '2026-08-15',
            'due_date' => '2026-08-30',
            'evidences' => $photos,
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['evidences']);
    });

    it('records a payment with waived late fee and justified reason', function () {
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        $resident = User::whereHas('roles', fn ($q) => $q->where('name', 'Residente'))->first();
        $property = Property::first();
        $expense = CommonExpense::first();
        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/payments', [
            'user_id' => $resident->id,
            'property_id' => $property->id,
            'common_expense_id' => $expense->id,
            'amount' => 85000,
            'payment_date' => '2026-08-16',
            'payment_method' => 'transfer',
            'reference' => 'TRF-774411',
            'waive_late_fee' => true,
            'waive_reason' => 'Comprobante pagado a tiempo el día 10, informado con desfase',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('waive_late_fee', true)
            ->assertJsonPath('waive_reason', 'Comprobante pagado a tiempo el día 10, informado con desfase');

        $payment = Payment::where('reference', 'TRF-774411')->first();
        expect($payment)->not->toBeNull()
            ->and($payment->waive_late_fee)->toBeTrue();
    });
});
