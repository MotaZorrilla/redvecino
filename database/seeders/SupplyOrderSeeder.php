<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Condominium;
use App\Models\EmployeeProfile;
use Illuminate\Support\Facades\DB;

class SupplyOrderSeeder extends Seeder
{
    public function run(): void
    {
        $condo = Condominium::first();
        $employee = EmployeeProfile::first();
        if (!$condo || !$employee) return;

        if (!DB::getSchemaBuilder()->hasTable('supply_orders')) {
            return;
        }

        DB::table('supply_orders')->insertOrIgnore([
            [
                'condominium_id' => $condo->id,
                'employee_profile_id' => $employee->id,
                'description' => 'Detergente Industrial 5L',
                'quantity' => 4,
                'unit' => 'bidon',
                'status' => 'pendiente',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'condominium_id' => $condo->id,
                'employee_profile_id' => $employee->id,
                'description' => 'Bolsas de Basura 120L',
                'quantity' => 10,
                'unit' => 'paquete',
                'status' => 'en_compra',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'condominium_id' => $condo->id,
                'employee_profile_id' => $employee->id,
                'description' => 'Ampolletas LED 15W',
                'quantity' => 20,
                'unit' => 'caja',
                'status' => 'comprado',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'condominium_id' => $condo->id,
                'employee_profile_id' => $employee->id,
                'description' => 'Guantes de Nitrilo M',
                'quantity' => 5,
                'unit' => 'caja',
                'status' => 'recibido',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
