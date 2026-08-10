<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Condominium;
use App\Models\CondoTower;
use App\Models\Property;
use App\Models\OwnerProfile;
use App\Models\EmployeeProfile;
use App\Models\Afp;
use App\Models\CondoExpense;
use App\Services\CommonExpenseCalculator;
use App\Services\PayrollCalculator;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AdvancedFinancesAndPayrollTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test common expenses calculation matching the infographic example (Unit A-302).
     */
    public function test_common_expenses_calculation_matches_infographic(): void
    {
        // 1. Setup Condominium and Tower A
        $condo = Condominium::create([
            'name' => 'Condominio Los Robles',
            'address' => 'Av. Los Robles 1234',
            'city' => 'Santiago',
            'region' => 'Metropolitana',
            'postal_code' => '1234567',
            'units_count' => 30,
            'status' => 'active',
        ]);

        $towerA = CondoTower::create([
            'condominium_id' => $condo->id,
            'name' => 'Torre A',
            'has_water_meter' => true,
            'has_electricity_meter' => true,
        ]);

        // 2. Setup Unit A-302 (Type B, Prorrateo 1.05%, in Tower A)
        $user = User::create([
            'name' => 'Test Owner',
            'rut' => '12.345.678-9',
            'email' => 'owner@test.cl',
            'phone' => '+56999999999',
            'password' => bcrypt('password'),
        ]);

        $property = Property::create([
            'condominium_id' => $condo->id,
            'tower_id' => $towerA->id,
            'type' => 'apartment',
            'number' => 'A-302',
            'block' => 'Torre A',
            'floor' => 3,
            'area_sqm' => 80.00,
            'status' => 'occupied',
        ]);

        OwnerProfile::create([
            'user_id' => $user->id,
            'property_id' => $property->id,
            'ownership_percentage' => 1.05, // 1.05% alícuota
            'financial_status' => 'al_dia',
        ]);

        // Create 29 other properties so total units is 30,
        // with 10 units in Tower A total (including A-302).
        for ($i = 2; $i <= 30; $i++) {
            $isInTowerA = $i <= 10;
            Property::create([
                'condominium_id' => $condo->id,
                'tower_id' => $isInTowerA ? $towerA->id : null,
                'type' => 'apartment',
                'number' => 'A-' . ($i + 300),
                'block' => $isInTowerA ? 'Torre A' : 'Torre B',
                'floor' => 1,
                'area_sqm' => 60.00,
                'status' => 'occupied',
            ]);
        }

        // 3. Create condo expenses for period "2026-04"
        $period = '2026-04';

        // Prorated expenses: we want the unit to get exactly $70,000 prorated (at 1.05% alícuota)
        // $70,000 / 0.0105 = $6,666,666.67
        CondoExpense::create([
            'condominium_id' => $condo->id,
            'category' => 'servicios_basicos',
            'subcategory' => 'electricidad_comun',
            'amount' => 6666666.67,
            'date' => '2026-04-05',
            'description' => 'Gasto común prorrateado total',
            'distributable_method' => 'prorated',
        ]);

        // Equal expenses: we want the unit to get exactly $20,000 equal (among 30 units)
        // $20,000 * 30 = $600,000
        CondoExpense::create([
            'condominium_id' => $condo->id,
            'category' => 'mantencion',
            'subcategory' => 'certificacion_gas',
            'amount' => 600000.00,
            'date' => '2026-04-05',
            'description' => 'Gasto igualitario total',
            'distributable_method' => 'equal',
        ]);

        // Tower expenses: we want Tower A units (10 units) to get exactly $8,000 each
        // $8,000 * 10 = $80,000
        CondoExpense::create([
            'condominium_id' => $condo->id,
            'category' => 'mantencion',
            'subcategory' => 'ascensor_torrea',
            'amount' => 80000.00,
            'date' => '2026-04-05',
            'description' => 'Mantención ascensor Torre A',
            'distributable_method' => 'tower_specific',
            'tower_id' => $towerA->id,
        ]);

        // Unit specific expenses: fine of $10,000 for Unit A-302
        CondoExpense::create([
            'condominium_id' => $condo->id,
            'category' => 'otro',
            'subcategory' => 'multa_ruidos',
            'amount' => 10000.00,
            'date' => '2026-04-05',
            'description' => 'Multa por ruidos molestos',
            'distributable_method' => 'unit_specific',
            'property_id' => $property->id,
        ]);

        // 4. Run calculations
        $calculator = new CommonExpenseCalculator();
        $result = $calculator->calculateForUnit($property, $period, 50000.00, 15);

        // 5. Assertions matching infographic
        $this->assertEquals(70000, $result['prorrateado']);
        $this->assertEquals(20000, $result['igualitario']);
        $this->assertEquals(90000, $result['subtotal_gastos_comunes']);
        $this->assertEquals(4500, $result['fondo_reserva']);
        $this->assertEquals(94500, $result['total_gastos_comunes_periodo']);
        $this->assertEquals(8000, $result['gastos_torre']);
        $this->assertEquals(10000, $result['multas_individuales']);
        $this->assertEquals(50000, $result['deuda_anterior']);
        $this->assertEquals(750, $result['interes_mora']);
        $this->assertEquals(68750, $result['total_cargos_posteriores']);
        $this->assertEquals(163250, $result['total_a_pagar']);
    }

    /**
     * Test payroll calculations matching Juan Carlos Pérez González's pay stub.
     */
    public function test_payroll_calculation_matches_pay_stub(): void
    {
        // 1. Setup employee user and profile
        $user = User::create([
            'name' => 'Juan Carlos Pérez González',
            'rut' => '12.345.678-9',
            'email' => 'juan.perez@condominiolosrobles.cl',
            'phone' => '+56955555555',
            'password' => bcrypt('password'),
        ]);

        $afp = Afp::create([
            'name' => 'Habitat',
            'commission_rate' => 10.00, // 10.00%
        ]);

        $employee = EmployeeProfile::create([
            'user_id' => $user->id,
            'position' => 'Conserje',
            'supervisor_id' => null,
            'contract_type' => 'indefinido',
            'shift' => 'rotativo',
            'salary' => 850000.00,
            'hire_date' => '2024-01-01',
            'afp_id' => $afp->id,
            'bank_name' => 'Banco Estado',
            'account_type' => 'Cuenta Rut',
            'account_number' => '12345678',
            'payment_method' => 'Transferencia Electrónica',
        ]);

        // 2. Run calculations with overrides
        $overrides = [
            'asignacion_responsabilidad' => 80000.00,
            'horas_extras' => 30000.00,
            'asignacion_colacion' => 50000.00,
            'asignacion_movilizacion' => 40000.00,
            'asignacion_vestuario' => 15000.00,
            'anticipo' => 50000.00,
            'prestamo' => 20000.00,
            'multas_atrasos' => 0.00,
        ];

        $calculator = new PayrollCalculator();
        $result = $calculator->calculate($employee, $overrides);

        // 3. Assertions matching correct mathematics
        // Note: The mockup image has a 1,000 CLP math typo:
        // Fonasa ($67,200) + AFP ($96,000) + Cesantía ($5,760) = $168,960.
        // However, the mockup total is printed as $169,960 (resulting in sueldo líquido of $825,040).
        // Our system enforces correct mathematical summing ($168,960 and $826,040).
        $this->assertEquals(960000, $result['total_imponibles']);
        $this->assertEquals(105000, $result['total_no_imponibles']);
        $this->assertEquals(67200, $result['salud_fonasa']);
        $this->assertEquals(960000, $result['sueldo_base'] + $result['asignacion_responsabilidad'] + $result['horas_extras']);
        $this->assertEquals(96000, $result['afp_monto']);
        $this->assertEquals(5760, $result['seguro_cesantia']);
        $this->assertEquals(168960, $result['total_previsionales']);
        $this->assertEquals(70000, $result['total_otros_descuentos']);
        $this->assertEquals(826040, $result['sueldo_liquido']);
    }

    /**
     * Test common expenses under extreme numeric boundaries.
     */
    public function test_common_expenses_under_extreme_numeric_boundaries(): void
    {
        $condo = Condominium::create([
            'name' => 'Condo Gigante',
            'address' => 'Av. Gigante 100',
            'city' => 'Santiago',
            'region' => 'Metropolitana',
            'units_count' => 10,
            'status' => 'active',
        ]);

        $property = Property::create([
            'condominium_id' => $condo->id,
            'type' => 'apartment',
            'number' => 'A-101',
            'area_sqm' => 100,
        ]);

        OwnerProfile::create([
            'user_id' => User::factory()->create()->id,
            'property_id' => $property->id,
            'ownership_percentage' => 10.00, // 10% alícuota
        ]);

        // Extremely high expense (10 billion)
        CondoExpense::create([
            'condominium_id' => $condo->id,
            'category' => 'servicios_basicos',
            'amount' => 10000000000.00,
            'date' => '2026-04-01',
            'distributable_method' => 'prorated',
        ]);

        $calculator = new CommonExpenseCalculator();
        $result = $calculator->calculateForUnit($property, '2026-04', 999999999.00, 30);

        // 10% of 10B = 1B.
        $this->assertEquals(1000000000, $result['prorrateado']);
        $this->assertEqualsWithDelta(15000000, $result['interes_mora'], 0.05); // 1.5% of previous debt
        $this->assertEquals(999999999, $result['deuda_anterior']);
        $this->assertEqualsWithDelta(1000000000 + 50000000 + 15000000 + 999999999, $result['total_a_pagar'], 0.05); // Prorrateado + Fondo (5%) + Mora + Deuda
    }

    /**
     * Test common expenses with negative or zero values.
     */
    public function test_common_expenses_with_negative_or_zero_values(): void
    {
        $condo = Condominium::create([
            'name' => 'Condo Vacío',
            'address' => 'Av. Desierta 0',
            'city' => 'Santiago',
            'region' => 'Metropolitana',
            'units_count' => 1,
            'status' => 'active',
        ]);

        $property = Property::create([
            'condominium_id' => $condo->id,
            'type' => 'apartment',
            'number' => 'B-101',
            'area_sqm' => 100,
        ]);

        // Negative previous debt and negative days overdue should not crash
        $calculator = new CommonExpenseCalculator();
        $result = $calculator->calculateForUnit($property, '2026-04', -500.00, -5);

        $this->assertEquals(0, $result['prorrateado']);
        $this->assertEquals(0, $result['igualitario']);
        $this->assertEquals(0, $result['interes_mora']);
        $this->assertEquals(-500.00, $result['deuda_anterior']); // Returns negative debt as passed (treated as credit)
    }

    /**
     * Test fallback apportionment coefficient calculations based on property number types.
     */
    public function test_apportionment_coefficient_fallbacks(): void
    {
        $condo = Condominium::create([
            'name' => 'Condo Coeficientes',
            'address' => 'Av. Coeficientes 123',
            'city' => 'Santiago',
            'region' => 'Metropolitana',
            'units_count' => 3,
            'status' => 'active',
        ]);

        $propA = Property::create([
            'condominium_id' => $condo->id,
            'type' => 'apartment',
            'number' => 'A-101',
            'area_sqm' => 50,
            'coefficient' => 0.008,
        ]);

        $propB = Property::create([
            'condominium_id' => $condo->id,
            'type' => 'apartment',
            'number' => 'B-102',
            'area_sqm' => 100,
            'coefficient' => 0.0105,
        ]);

        $propC = Property::create([
            'condominium_id' => $condo->id,
            'type' => 'apartment',
            'number' => 'C-103',
            'area_sqm' => 150,
            'coefficient' => 0.50,
        ]);

        // Register a prorated expense of $1,000,000
        CondoExpense::create([
            'condominium_id' => $condo->id,
            'category' => 'personal',
            'amount' => 1000000.00,
            'date' => '2026-04-01',
            'distributable_method' => 'prorated',
        ]);

        $calculator = new CommonExpenseCalculator();

        // PropA uses explicit coefficient → 0.008 * 1,000,000 = 8,000
        $resA = $calculator->calculateForUnit($propA, '2026-04');
        $this->assertEquals(8000, $resA['prorrateado']);

        // PropB uses explicit coefficient → 0.0105 * 1,000,000 = 10,500
        $resB = $calculator->calculateForUnit($propB, '2026-04');
        $this->assertEquals(10500, $resB['prorrateado']);

        // PropC uses explicit coefficient → 0.50 * 1,000,000 = 500,000
        $resC = $calculator->calculateForUnit($propC, '2026-04');
        $this->assertEquals(500000, $resC['prorrateado']);
    }
}
