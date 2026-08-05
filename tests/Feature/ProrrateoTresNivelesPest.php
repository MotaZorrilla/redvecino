<?php

use App\Models\User;
use App\Models\Condominium;
use App\Models\CondoTower;
use App\Models\Property;
use App\Models\CondoExpense;
use App\Models\CondoIncome;
use App\Services\CommonExpenseCalculator;

covers(CommonExpenseCalculator::class);

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    $this->seed();
});

describe('Prorrateo Global (prorated)', function () {
    test('un egreso global se distribuye a todas las unidades por coeficiente', function () {
        $condo = Condominium::firstOrFail();
        
        $p1 = Property::where('condominium_id', $condo->id)->firstOrFail();
        $p2 = Property::where('condominium_id', $condo->id)->where('id', '!=', $p1->id)->firstOrFail();
        
        $p1->update(['coefficient' => 0.5]);
        $p2->update(['coefficient' => 0.5]);

        CondoExpense::create([
            'condominium_id' => $condo->id,
            'category' => 'mantencion',
            'subcategory' => 'general',
            'description' => 'Mantenimiento General',
            'amount' => 100000,
            'date' => '2026-09-01',
            'distributable_method' => 'prorated',
        ]);

        $calculator = new CommonExpenseCalculator();
        $res1 = $calculator->calculateForUnit($p1, '2026-09');
        $res2 = $calculator->calculateForUnit($p2, '2026-09');

        expect($res1['prorrateado'])->toEqual(50000);
        expect($res2['prorrateado'])->toEqual(50000);
    });

    test('egreso global con coeficientes desiguales distribuye correctamente', function () {
        $condo = Condominium::firstOrFail();
        $props = Property::where('condominium_id', $condo->id)->take(2)->get();
        $p1 = $props[0];
        $p2 = $props[1];

        $p1->update(['coefficient' => 0.7]);
        $p2->update(['coefficient' => 0.3]);

        CondoExpense::create([
            'condominium_id' => $condo->id,
            'category' => 'servicios_basicos',
            'subcategory' => 'agua',
            'description' => 'Servicios Basicos',
            'amount' => 100000,
            'date' => '2026-09-01',
            'distributable_method' => 'prorated',
        ]);

        $calculator = new CommonExpenseCalculator();
        $res1 = $calculator->calculateForUnit($p1, '2026-09');
        $res2 = $calculator->calculateForUnit($p2, '2026-09');

        expect($res1['prorrateado'])->toEqual(70000);
        expect($res2['prorrateado'])->toEqual(30000);
    });

    test('si no hay egresos prorrateados el monto es 0', function () {
        $condo = Condominium::firstOrFail();
        $p1 = Property::where('condominium_id', $condo->id)->firstOrFail();

        $calculator = new CommonExpenseCalculator();
        $res = $calculator->calculateForUnit($p1, '2026-12');

        expect($res['prorrateado'])->toEqual(0);
    });
});

describe('Prorrateo por Torre (tower_specific)', function () {
    test('egreso tower_specific solo se cobra a unidades de esa torre', function () {
        $condo = Condominium::firstOrFail();
        $towers = CondoTower::where('condominium_id', $condo->id)->take(2)->get();
        $towerA = $towers[0];
        $towerB = $towers[1];

        $pA = Property::where('tower_id', $towerA->id)->firstOrFail();
        $pB = Property::where('tower_id', $towerB->id)->firstOrFail();

        CondoExpense::create([
            'condominium_id' => $condo->id,
            'tower_id' => $towerA->id,
            'category' => 'mantencion',
            'subcategory' => 'ascensor',
            'description' => 'Mantencion Ascensor Torre A',
            'amount' => 40000,
            'date' => '2026-09-01',
            'distributable_method' => 'tower_specific',
        ]);

        $calculator = new CommonExpenseCalculator();
        $resA = $calculator->calculateForUnit($pA, '2026-09');
        $resB = $calculator->calculateForUnit($pB, '2026-09');

        expect($resA['gastos_torre'])->toBeGreaterThan(0);
        expect($resB['gastos_torre'])->toEqual(0);
    });
});

describe('Prorrateo Individual (unit_specific)', function () {
    test('egreso unit_specific solo lo paga la unidad designada', function () {
        $condo = Condominium::firstOrFail();
        $props = Property::where('condominium_id', $condo->id)->take(2)->get();
        $p1 = $props[0];
        $p2 = $props[1];

        CondoExpense::create([
            'condominium_id' => $condo->id,
            'property_id' => $p1->id,
            'category' => 'mantencion',
            'subcategory' => 'reparacion',
            'description' => 'Reparacion Balcon Depto',
            'amount' => 15000,
            'date' => '2026-09-01',
            'distributable_method' => 'unit_specific',
        ]);

        $calculator = new CommonExpenseCalculator();
        $res1 = $calculator->calculateForUnit($p1, '2026-09');
        $res2 = $calculator->calculateForUnit($p2, '2026-09');

        expect($res1['multas_individuales'])->toEqual(15000);
        expect($res2['multas_individuales'])->toEqual(0);
    });
});

describe('Fondo de Reserva y Mora', function () {
    test('el fondo de reserva es exactamente el 5% del subtotal', function () {
        $condo = Condominium::firstOrFail();
        // Clear out any seeded expenses for 2026-09
        CondoExpense::where('condominium_id', $condo->id)->where('date', 'like', '2026-09%')->delete();
        
        $p1 = Property::where('condominium_id', $condo->id)->firstOrFail();
        $p1->update(['coefficient' => 0.05]);

        CondoExpense::create([
            'condominium_id' => $condo->id,
            'category' => 'mantencion',
            'subcategory' => 'varios',
            'description' => 'Gasto Unico',
            'amount' => 100000,
            'date' => '2026-09-01',
            'distributable_method' => 'prorated',
        ]);

        $calculator = new CommonExpenseCalculator();
        $res = $calculator->calculateForUnit($p1, '2026-09');

        // Subtotal = prorrateado (100000 * 0.05 = 5000) + igualitario (0) = 5000
        // Fondo reserva = 5000 * 0.05 = 250
        expect($res['subtotal_gastos_comunes'])->toEqual(5000);
        expect($res['fondo_reserva'])->toEqual(250);
    });

    test('mora se aplica cuando hay deuda anterior y mas de 10 dias de atraso', function () {
        $condo = Condominium::firstOrFail();
        $p1 = Property::where('condominium_id', $condo->id)->firstOrFail();

        $calculator = new CommonExpenseCalculator();
        $res = $calculator->calculateForUnit($p1, '2026-09', 100000, 15);

        expect($res['interes_mora'])->toEqual(1500);
    });
});
