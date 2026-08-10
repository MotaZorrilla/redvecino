<?php

use App\Models\Condominium;
use App\Models\Property;
use App\Models\OwnerProfile;
use App\Models\User;
use App\Services\CommonExpenseCalculator;
use App\Models\CondoExpense;
use App\Models\CondoIncome;

covers(CommonExpenseCalculator::class);

uses(
    Illuminate\Foundation\Testing\RefreshDatabase::class
);

beforeEach(function () {
    $this->seed();
    $this->condo = Condominium::firstOrFail();
    $this->calculator = new CommonExpenseCalculator();

    // Remove all properties from database so test properties are isolated
    Property::query()->delete();
    // Remove seeded expenses/incomes from this period to avoid interference
    CondoExpense::where('condominium_id', $this->condo->id)->where('date', 'like', '2026-07%')->delete();
    CondoIncome::where('condominium_id', $this->condo->id)->where('date', 'like', '2026-07%')->delete();

    // Create a base expense to distribute
    CondoExpense::create([
        'condominium_id' => $this->condo->id,
        'category' => 'personal',
        'amount' => 1000000,
        'date' => '2026-07-01',
        'distributable_method' => 'prorated',
    ]);
});

test('fallback 1: usa coefficient explicito cuando existe', function () {
    $prop = Property::create([
        'condominium_id' => $this->condo->id,
        'type' => 'apartment',
        'number' => 'COEFF-001',
        'area_sqm' => 200,
        'coefficient' => 0.080,
    ]);

    $result = $this->calculator->calculateForUnit($prop, '2026-07');
    expect($result['prorrateado'])->toEqual(80000); // 0.080 * 1,000,000
    expect($result['detalles']['coeficiente_prorrateo'])->toEqual(0.080);
});

test('fallback 2: usa ownership_percentage cuando no hay coefficient', function () {
    $prop = Property::create([
        'condominium_id' => $this->condo->id,
        'type' => 'apartment',
        'number' => 'OWN-001',
        'area_sqm' => 200,
    ]);

    OwnerProfile::create([
        'user_id' => User::factory()->create()->id,
        'property_id' => $prop->id,
        'ownership_percentage' => 12.50,
    ]);

    $result = $this->calculator->calculateForUnit($prop, '2026-07');
    expect($result['prorrateado'])->toEqual(125000); // 12.5% of 1,000,000 = 0.125 * 1,000,000
    expect($result['detalles']['coeficiente_prorrateo'])->toEqual(0.125);
});

test('fallback 3: usa area_sqm / total_area cuando no hay coefficient ni owner', function () {
    // Create a set of properties where this one is 1/4 of total area
    Property::create(['condominium_id' => $this->condo->id, 'type' => 'apartment', 'number' => 'AREA-A', 'area_sqm' => 100]);
    Property::create(['condominium_id' => $this->condo->id, 'type' => 'apartment', 'number' => 'AREA-B', 'area_sqm' => 100]);
    Property::create(['condominium_id' => $this->condo->id, 'type' => 'apartment', 'number' => 'AREA-C', 'area_sqm' => 100]);

    $prop = Property::create([
        'condominium_id' => $this->condo->id,
        'type' => 'apartment',
        'number' => 'AREA-D',
        'area_sqm' => 100, // 100/400 = 0.25
    ]);

    $result = $this->calculator->calculateForUnit($prop, '2026-07');
    expect($result['prorrateado'])->toEqual(250000); // 0.25 * 1,000,000
    expect($result['detalles']['coeficiente_prorrateo'])->toEqual(0.25);
});

test('fallback 4: default 0.01 cuando no hay coefficient, owner ni area', function () {
    $prop = Property::create([
        'condominium_id' => $this->condo->id,
        'type' => 'apartment',
        'number' => 'DEFAULT-001',
        'area_sqm' => null,
    ]);

    $result = $this->calculator->calculateForUnit($prop, '2026-07');
    expect($result['prorrateado'])->toEqual(10000); // 0.01 * 1,000,000
    expect($result['detalles']['coeficiente_prorrateo'])->toEqual(0.01);
});

test('ownership_percentage de 0 cae a area fallback', function () {
    Property::create(['condominium_id' => $this->condo->id, 'type' => 'apartment', 'number' => 'ZERO-A', 'area_sqm' => 100]);

    $prop = Property::create([
        'condominium_id' => $this->condo->id,
        'type' => 'apartment',
        'number' => 'ZERO-C',
        'area_sqm' => 100,
    ]);

    OwnerProfile::create([
        'user_id' => User::factory()->create()->id,
        'property_id' => $prop->id,
        'ownership_percentage' => 0,
    ]);

    $result = $this->calculator->calculateForUnit($prop, '2026-07');
    expect($result['detalles']['coeficiente_prorrateo'])->toEqual(0.50); // 100/200 = 0.50
});

test('coefficient 0 es válido y se usa', function () {
    $prop = Property::create([
        'condominium_id' => $this->condo->id,
        'type' => 'apartment',
        'number' => 'ZEROCOEFF-001',
        'area_sqm' => 500,
        'coefficient' => 0.0,
    ]);

    $result = $this->calculator->calculateForUnit($prop, '2026-07');
    expect($result['detalles']['coeficiente_prorrateo'])->toEqual(0.0);
    expect($result['prorrateado'])->toEqual(0);
});

test('multiples propiedades con coefficient mixto calculan correctamente', function () {
    $p1 = Property::create(['condominium_id' => $this->condo->id, 'type' => 'apartment', 'number' => 'MIX-A', 'area_sqm' => 100, 'coefficient' => 0.10]);
    $p2 = Property::create(['condominium_id' => $this->condo->id, 'type' => 'apartment', 'number' => 'MIX-B', 'area_sqm' => 200, 'coefficient' => 0.20]);
    $p3 = Property::create(['condominium_id' => $this->condo->id, 'type' => 'apartment', 'number' => 'MIX-C', 'area_sqm' => 300]);

    $r1 = $this->calculator->calculateForUnit($p1, '2026-07');
    $r2 = $this->calculator->calculateForUnit($p2, '2026-07');
    $r3 = $this->calculator->calculateForUnit($p3, '2026-07');

    expect($r1['prorrateado'])->toEqual(100000); // 0.10%
    expect($r2['prorrateado'])->toEqual(200000); // 0.20%
    // p3 has no coefficient: area fallback: 300/(100+200+300) = 0.50
    expect($r3['prorrateado'])->toEqual(500000); // 0.50%
});
