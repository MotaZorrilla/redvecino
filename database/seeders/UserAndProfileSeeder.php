<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\AdminProfile;
use App\Models\CommitteeProfile;
use App\Models\EmployeeProfile;
use App\Models\TiProfile;
use App\Models\Afp;
use App\Models\Condominium;
use Illuminate\Database\Seeder;

class UserAndProfileSeeder extends Seeder
{
    public function run(): void
    {
        $afpHabitat = Afp::where('name', 'Habitat')->first() ?? Afp::first();
        $afpCapital = Afp::where('name', 'Capital')->first() ?? Afp::first();

        // 1. Standard Demo Accounts
        $demoUsersData = [
            [
                'name' => 'Administrador General',
                'rut' => '11.111.111-1',
                'email' => 'admin@redvecino.cl',
                'phone' => '+56911111111',
                'role' => 'Administrador',
            ],
            [
                'name' => 'Propietario Demo',
                'rut' => '22.222.222-2',
                'email' => 'propietario@redvecino.cl',
                'phone' => '+56922222222',
                'role' => 'Propietario',
            ],
            [
                'name' => 'Residente Demo',
                'rut' => '33.333.333-3',
                'email' => 'residente@redvecino.cl',
                'phone' => '+56933333333',
                'role' => 'Residente',
            ],
            [
                'name' => 'Miembro del Comité',
                'rut' => '44.444.444-4',
                'email' => 'comite@redvecino.cl',
                'phone' => '+56944444444',
                'role' => 'Comité',
            ],
            [
                'name' => 'Conserje Principal',
                'rut' => '55.555.555-5',
                'email' => 'colaborador@redvecino.cl',
                'phone' => '+56955555555',
                'role' => 'Colaborador',
            ],
            [
                'name' => 'Soporte TI',
                'rut' => '66.666.666-6',
                'email' => 'ti@redvecino.cl',
                'phone' => '+56966666666',
                'role' => 'TI',
            ],
        ];

        $demoUsers = [];
        foreach ($demoUsersData as $data) {
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'rut' => $data['rut'],
                    'phone' => $data['phone'],
                    'password' => bcrypt('password'),
                    'status' => 'active',
                    'email_verified_at' => now(),
                ]
            );

            if (!$user->hasRole($data['role'])) {
                $user->assignRole($data['role']);
            }
            $demoUsers[$data['role']] = $user;
        }

        // Attach profiles to Demo Users
        AdminProfile::firstOrCreate(['user_id' => $demoUsers['Administrador']->id], ['access_level' => 'full']);

        CommitteeProfile::firstOrCreate(
            ['user_id' => $demoUsers['Comité']->id],
            [
                'position' => 'Presidente del Comité',
                'period_start' => '2026-01-01',
                'period_end' => '2026-12-31',
                'permission_level' => 'full',
            ]
        );

        // Supervisor
        $employeeSupervisor = User::firstOrCreate(
            ['email' => 'supervisor@redvecino.cl'],
            [
                'name' => 'Supervisor de Operaciones',
                'rut' => '77.777.777-7',
                'phone' => '+56977777777',
                'password' => bcrypt('password'),
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
        if (!$employeeSupervisor->hasRole('Colaborador')) {
            $employeeSupervisor->assignRole('Colaborador');
        }

        EmployeeProfile::firstOrCreate(
            ['user_id' => $demoUsers['Colaborador']->id],
            [
                'position' => 'Conserje Turno Día',
                'supervisor_id' => $employeeSupervisor->id,
                'contract_type' => 'indefinido',
                'shift' => 'mañana-tarde',
                'salary' => 650000.00,
                'hire_date' => '2025-03-15',
                'afp_id' => $afpHabitat->id,
                'bank_name' => 'Banco Estado',
                'account_type' => 'Cuenta Rut',
                'account_number' => '12345678',
                'payment_method' => 'Transferencia Electrónica',
            ]
        );

        EmployeeProfile::firstOrCreate(
            ['user_id' => $employeeSupervisor->id],
            [
                'position' => 'Jefe de Conserjería',
                'supervisor_id' => null,
                'contract_type' => 'indefinido',
                'shift' => 'rotativo',
                'salary' => 950000.00,
                'hire_date' => '2024-06-01',
                'afp_id' => $afpCapital->id,
                'bank_name' => 'Banco de Chile',
                'account_type' => 'Cuenta Corriente',
                'account_number' => '987654321',
                'payment_method' => 'Transferencia Electrónica',
            ]
        );

        // Additional Employees (Conserjes and Maintenance Staff) per Condominium
        $additionalStaff = [
            ['name' => 'Carlos Mendoza', 'rut' => '12.345.678-9', 'email' => 'carlos.mendoza@redvecino.cl', 'position' => 'Técnico de Mantención'],
            ['name' => 'Roberto Gómez', 'rut' => '13.456.789-0', 'email' => 'roberto.gomez@redvecino.cl', 'position' => 'Conserje Turno Noche'],
            ['name' => 'Marcelo Ríos', 'rut' => '14.567.890-1', 'email' => 'marcelo.rios@redvecino.cl', 'position' => 'Jardinero & Áreas Verdes'],
            ['name' => 'Ana María Polo', 'rut' => '15.678.901-2', 'email' => 'ana.polo@redvecino.cl', 'position' => 'Inspectora de Seguridad'],
            ['name' => 'Jorge Valdivia', 'rut' => '16.789.012-3', 'email' => 'jorge.valdivia@redvecino.cl', 'position' => 'Técnico Eléctrico'],
        ];

        foreach ($additionalStaff as $staff) {
            $u = User::firstOrCreate(
                ['email' => $staff['email']],
                [
                    'name' => $staff['name'],
                    'rut' => $staff['rut'],
                    'phone' => '+569' . rand(60000000, 99999999),
                    'password' => bcrypt('password'),
                    'status' => 'active',
                    'email_verified_at' => now(),
                ]
            );
            if (!$u->hasRole('Colaborador')) {
                $u->assignRole('Colaborador');
            }

            EmployeeProfile::firstOrCreate(
                ['user_id' => $u->id],
                [
                    'position' => $staff['position'],
                    'supervisor_id' => $employeeSupervisor->id,
                    'contract_type' => 'indefinido',
                    'shift' => 'rotativo',
                    'salary' => 720000.00,
                    'hire_date' => '2025-01-10',
                    'afp_id' => $afpHabitat->id,
                    'bank_name' => 'Banco Santander',
                    'account_type' => 'Cuenta Vista',
                    'account_number' => rand(1000000, 9999999),
                    'payment_method' => 'Transferencia Electrónica',
                ]
            );
        }

        TiProfile::firstOrCreate(
            ['user_id' => $demoUsers['TI']->id],
            [
                'access_level' => 'root',
                'system_logs_permission' => true,
            ]
        );

        $this->command?->info('UserAndProfileSeeder: Demo users and profiles seeded.');
    }
}
