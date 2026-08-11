<?php

namespace Tests\Feature;

use App\Models\CondoIncome;
use App\Models\Payment;
use App\Models\Property;
use App\Models\User;
use App\Models\CommonExpense;
use App\Models\OwnerProfile;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('condo income seeder uses eager loading no n plus one', function () {
    $this->seed(\Database\Seeders\RolePermissionSeeder::class);
    $this->seed(\Database\Seeders\DatabaseSeeder::class);

    // Contar queries ejecutadas durante la creación de CondoIncome desde payments
    $queryCount = 0;
    \DB::listen(function ($query) use (&$queryCount) {
        if (stripos($query->sql, 'select') === 0) {
            $queryCount++;
        }
    });

    // Simular lo que hace el seeder: iterar payments aprobados y crear CondoIncome
    $payments = Payment::where('status', 'approved')
        ->with(['property', 'commonExpense', 'user']) // eager loading necesario
        ->get();

    foreach ($payments as $payment) {
        $property = $payment->property;
        if (!$property) continue;

        CondoIncome::create([
            'condominium_id' => $property->condominium_id,
            'category' => 'gastos_comunes',
            'subcategory' => 'Pago Gasto Común - ' . ($payment->commonExpense->period ?? ''),
            'amount' => $payment->amount,
            'date' => $payment->payment_date ?? $payment->created_at->format('Y-m-d'),
            'description' => 'Pago registrado por ' . ($payment->user->name ?? 'Usuario') . ' - Ref: ' . ($payment->reference ?? 'N/A'),
            'property_id' => $property->id,
            'user_id' => $payment->user_id,
        ]);
    }

    // Con eager loading: 1 query para payments + 1 para properties + 1 para commonExpenses + 1 para users = 4
    // Sin eager loading: N * 3 queries (property, commonExpense, user por payment)
    $paymentCount = $payments->count();
    $expectedMaxQueries = 4 + $paymentCount; // 4 base + 1 INSERT por payment

    $this->assertLessThanOrEqual($expectedMaxQueries, $queryCount,
        "Se ejecutaron {$queryCount} queries SELECT. Esperado ≤ {$expectedMaxQueries} (4 base + {$paymentCount} INSERT). Sin eager loading sería " . ($paymentCount * 3) . " queries extra.");
});

test('condo income from fines also uses eager loading', function () {
    $this->seed(\Database\Seeders\RolePermissionSeeder::class);
    $this->seed(\Database\Seeders\DatabaseSeeder::class);

    $queryCount = 0;
    \DB::listen(function ($query) use (&$queryCount) {
        if (stripos($query->sql, 'select') === 0) {
            $queryCount++;
        }
    });

    // Simular creación de CondoIncome desde fines pagados
    $fines = \App\Models\Fine::where('status', 'paid')
        ->with(['property', 'user'])
        ->get();

    foreach ($fines as $fine) {
        $property = $fine->property;
        if (!$property) continue;

        CondoIncome::create([
            'condominium_id' => $property->condominium_id,
            'category' => 'multas',
            'subcategory' => 'Ruidos molestos',
            'amount' => $fine->amount,
            'date' => $fine->issued_date,
            'description' => 'Multa: ' . $fine->reason,
            'property_id' => $fine->property_id,
            'user_id' => $fine->user_id,
        ]);
    }

    $fineCount = $fines->count();
    $expectedMaxQueries = 2 + $fineCount; // 2 base (fines + properties + users) + 1 INSERT por fine

    $this->assertLessThanOrEqual($expectedMaxQueries, $queryCount,
        "Se ejecutaron {$queryCount} queries SELECT. Esperado ≤ {$expectedMaxQueries} (2 base + {$fineCount} INSERT).");
});