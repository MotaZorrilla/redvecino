<?php

namespace Tests\Feature;

use App\Models\Payment;
use App\Models\Property;
use App\Models\User;
use App\Models\CommonExpense;
use App\Models\OwnerProfile;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('payment created at equals payment date', function () {
    $this->seed(\Database\Seeders\RolePermissionSeeder::class);
    $this->seed(\Database\Seeders\DatabaseSeeder::class);

    $property = Property::where('type', 'apartment')->first();
    $ownerProfile = OwnerProfile::where('property_id', $property->id)->first();
    $commonExpense = CommonExpense::where('condominium_id', $property->condominium_id)->first();

    $paymentDate = '2026-05-15';

    $payment = Payment::create([
        'user_id' => $ownerProfile->user_id,
        'property_id' => $property->id,
        'common_expense_id' => $commonExpense->id,
        'amount' => 150000,
        'payment_date' => $paymentDate,
        'payment_method' => 'transferencia',
        'reference' => 'TXN-TEST-001',
        'status' => 'approved',
    ]);

    // Verificar que created_at coincide con payment_date (ignorando hora)
    $this->assertEquals(
        $paymentDate,
        $payment->created_at->toDateString(),
        'created_at debe ser igual a payment_date para mantener integridad temporal'
    );

    // También verificar updated_at
    $this->assertEquals(
        $paymentDate,
        $payment->updated_at->toDateString(),
        'updated_at debe ser igual a payment_date al crear'
    );
});

test('payment created at uses carbon parse for consistency', function () {
    $this->seed(\Database\Seeders\RolePermissionSeeder::class);
    $this->seed(\Database\Seeders\DatabaseSeeder::class);

    $property = Property::where('type', 'apartment')->first();
    $ownerProfile = OwnerProfile::where('property_id', $property->id)->first();
    $commonExpense = CommonExpense::where('condominium_id', $property->condominium_id)->first();

    // Test con formatos parseables por Carbon
    $testDates = [
        '2026-05-15',
        '2026-05-01 10:30:00',
        '2026-05-15T14:30:00',
    ];

    foreach ($testDates as $dateStr) {
        $payment = Payment::create([
            'user_id' => $ownerProfile->user_id,
            'property_id' => $property->id,
            'common_expense_id' => $commonExpense->id,
            'amount' => 100000,
            'payment_date' => $dateStr,
            'payment_method' => 'transferencia',
            'reference' => 'TXN-TEST-' . uniqid(),
            'status' => 'approved',
        ]);

        $expectedDate = \Carbon\Carbon::parse($dateStr)->toDateString();
        $this->assertEquals(
            $expectedDate,
            $payment->created_at->toDateString(),
            "created_at debe parsear correctamente '$dateStr'"
        );
    }
});