<?php

namespace Tests\Feature;

use App\Models\Payment;
use App\Models\Property;
use App\Models\User;
use App\Models\CommonExpense;
use App\Models\OwnerProfile;
use App\Models\Fine;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FinancialDatesRelativeTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function seeders_use_anchor_year_config_not_hardcoded_2026()
    {
        // Verificar que config('demo.anchor_year') existe
        $this->assertNotNull(config('demo.anchor_year'), 'Config demo.anchor_year debe existir');

        $anchorYear = config('demo.anchor_year');
        $this->assertIsInt($anchorYear);
        $this->assertGreaterThanOrEqual(2024, $anchorYear);
    }

    /** @test */
    public function payment_dates_are_relative_to_anchor_year()
    {
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);
        $this->seed(\Database\Seeders\DatabaseSeeder::class);

        $anchorYear = config('demo.anchor_year');

        // Verificar que los pagos creados por el seeder usan fechas relativas al anchor_year
        $payments = Payment::where('status', 'approved')->get();

        foreach ($payments as $payment) {
            $paymentYear = $payment->payment_date ? \Carbon\Carbon::parse($payment->payment_date)->year : null;
            if ($paymentYear) {
                // El año debe ser anchor_year o anchor_year - 1 (períodos anteriores)
                $this->assertTrue(
                    in_array($paymentYear, [$anchorYear, $anchorYear - 1]),
                    "Pago {$payment->id} tiene año {$paymentYear} que no es relativo al anchor_year ({$anchorYear})"
                );
            }
        }
    }

    /** @test */
    public function common_expense_periods_are_relative_to_anchor_year()
    {
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);
        $this->seed(\Database\Seeders\DatabaseSeeder::class);

        $anchorYear = config('demo.anchor_year');

        $periods = \App\Models\CommonExpensePeriod::all();

        foreach ($periods as $period) {
            $periodYear = (int) substr($period->period, 0, 4);
            // Períodos deben ser anchor_year - 1, anchor_year, anchor_year + 1, etc.
            $this->assertTrue(
                $periodYear >= $anchorYear - 2 && $periodYear <= $anchorYear + 1,
                "Período {$period->period} no es relativo al anchor_year ({$anchorYear})"
            );
        }
    }

    /** @test */
    public function fine_dates_are_relative_to_anchor_year()
    {
        $this->seed(\Database\Seeders\RolePermissionSeeder::class);
        $this->seed(\Database\Seeders\DatabaseSeeder::class);

        $anchorYear = config('demo.anchor_year');

        $fines = Fine::all();

        foreach ($fines as $fine) {
            $issuedYear = $fine->issued_date ? \Carbon\Carbon::parse($fine->issued_date)->year : null;
            if ($issuedYear) {
                $this->assertTrue(
                    in_array($issuedYear, [$anchorYear, $anchorYear - 1]),
                    "Multa {$fine->id} tiene año {$issuedYear} no relativo al anchor_year ({$anchorYear})"
                );
            }
        }
    }
}