<?php

use App\Models\Condominium;
use App\Models\CondoExpense;
use App\Models\Property;
use App\Services\CommonExpenseCalculator;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
});

describe('Configuracion parametrica de mora conectada al motor', function () {
    test('usa la tasa configurada en el condominio (2.0%) en vez del 1.5% heredado', function () {
        $condo = Condominium::firstOrFail();
        $condo->update(['late_interest_rate' => 2.0, 'due_day' => 10]);

        $property = Property::where('condominium_id', $condo->id)->firstOrFail();

        $calculator = new CommonExpenseCalculator();
        $res = $calculator->calculateForUnit($property, '2099-01', 100000, 15);

        // 100000 * 2% = 2000 (no 1500 del 1.5% heredado)
        expect($res['interes_mora'])->toEqual(2000);
    });

    test('si la tasa es null, se conserva el 1.5% heredado', function () {
        $condo = Condominium::firstOrFail();
        $condo->update(['late_interest_rate' => null]);

        $property = Property::where('condominium_id', $condo->id)->firstOrFail();

        $calculator = new CommonExpenseCalculator();
        $res = $calculator->calculateForUnit($property, '2099-01', 100000, 15);

        expect($res['interes_mora'])->toEqual(1500);
    });

    test('la mora usa el umbral de dias de vencimiento configurado', function () {
        $condo = Condominium::firstOrFail();
        $condo->update(['late_interest_rate' => 2.0, 'due_day' => 20]);

        $property = Property::where('condominium_id', $condo->id)->firstOrFail();
        $calculator = new CommonExpenseCalculator();

        // 15 días anterior NO supera el vencimiento en el día 20 -> sin interés
        $sinMora = $calculator->calculateForUnit($property, '2099-01', 100000, 15);
        expect($sinMora['interes_mora'])->toEqual(0);

        // 25 días supera -> mora al 2%
        $conMora = $calculator->calculateForUnit($property, '2099-01', 100000, 25);
        expect($conMora['interes_mora'])->toEqual(2000);
    });
});
