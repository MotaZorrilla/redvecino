<?php

namespace Database\Seeders;

use App\Models\Condominium;
use App\Models\EmployeeProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EmployeeSanctionsSeeder extends Seeder
{
    public function run(): void
    {
        $condo = Condominium::first();
        $employee = EmployeeProfile::first();
        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();

        if (!$condo || !$employee || !DB::getSchemaBuilder()->hasTable('employee_sanctions')) {
            return;
        }

        DB::table('employee_sanctions')->insertOrIgnore([
            [
                'condominium_id' => $condo->id,
                'employee_profile_id' => $employee->id,
                'date' => now()->subDays(5)->toDateString(),
                'time' => '08:45:00',
                'reason' => 'Atraso reiterado',
                'description' => 'Tercer atraso del mes sin previo aviso a la administración.',
                'document_path' => null,
                'created_by' => $admin?->id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'condominium_id' => $condo->id,
                'employee_profile_id' => $employee->id,
                'date' => now()->subDays(12)->toDateString(),
                'time' => '14:20:00',
                'reason' => 'Abandono de puesto',
                'description' => 'Ausencia del puesto de vigilancia en portería principal durante 40 minutos.',
                'document_path' => null,
                'created_by' => $admin?->id,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
