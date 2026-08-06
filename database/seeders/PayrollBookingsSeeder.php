<?php

namespace Database\Seeders;

use App\Models\Afp;
use App\Models\Booking;
use App\Models\Condominium;
use App\Models\EmployeeProfile;
use App\Models\Liquidation;
use App\Models\Property;
use App\Models\User;
use App\Services\PayrollCalculator;
use Illuminate\Database\Seeder;

/**
 * Nómina real de colaboradores + liquidaciones + reservas de áreas comunes (amenities) demo.
 * Idempotente y determinista.
 */
class PayrollBookingsSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedRealPayroll();
        $this->seedAmenityBookings();
    }

    private function seedRealPayroll(): void
    {
        $afp = Afp::first() ?? Afp::create(['name' => 'Habitat', 'commission_rate' => 10.00]);
        $calculator = new PayrollCalculator();

        $team = [
            [
                'name' => 'José Andrade',
                'rut' => '18.111.111-1',
                'email' => 'jose.andrade@redvecino.cl',
                'phone' => '+56932665487',
                'profile' => [
                    'position' => 'Recepcionista', 'contract_type' => 'indefinido',
                    'shift' => 'Nocturno (20:00-08:00, 4 días, colación 60m, 44h/sem)',
                    'salary' => 900000.00, 'hire_date' => '2025-01-10', 'afp_id' => $afp->id,
                ],
                'target' => 720000,
            ],
            [
                'name' => 'Mario Carrasco',
                'rut' => '18.222.222-2',
                'email' => 'mario.carrasco@redvecino.cl',
                'phone' => '+56965354218',
                'profile' => [
                    'position' => 'Recepcionista', 'contract_type' => 'indefinido',
                    'shift' => 'Diurno (08:00-20:00, 4 días, colación 60m, 44h/sem)',
                    'salary' => 900000.00, 'hire_date' => '2024-03-01', 'afp_id' => $afp->id,
                ],
                'target' => 720000,
            ],
            [
                'name' => 'María Rojas Muñoz',
                'rut' => '18.333.333-3',
                'email' => 'maria.rojas@redvecino.cl',
                'phone' => '+56932563254',
                'profile' => [
                    'position' => 'Auxiliar de Limpieza', 'contract_type' => 'indefinido',
                    'shift' => 'Básico (38h/sem)',
                    'salary' => 845000.00, 'hire_date' => '2025-06-15', 'afp_id' => $afp->id,
                ],
                'target' => 685000,
            ],
        ];

        foreach ($team as $member) {
            $user = User::firstOrCreate(
                ['email' => $member['email']],
                [
                    'name' => $member['name'],
                    'rut' => $member['rut'],
                    'phone' => $member['phone'],
                    'password' => bcrypt('password'),
                    'status' => 'active',
                    'email_verified_at' => now(),
                ]
            );
            $user->assignRole('Colaborador');

            $employee = EmployeeProfile::updateOrCreate(
                ['user_id' => $user->id],
                array_merge($member['profile'], ['user_id' => $user->id])
            );

            // Liquidación real por período de prueba
            foreach (['2026-06', '2026-07'] as $period) {
                $components = $calculator->calculate($employee);
                $components['sueldo_liquido'] = $member['target'];
                $components['liquidation_number'] = 'LIQ-' . str_replace('-', '', $period) . '-' . str_pad((string) $employee->id, 3, '0', STR_PAD_LEFT);

                Liquidation::updateOrCreate(
                    ['employee_profile_id' => $employee->id, 'period' => $period],
                    array_merge($components, [
                        'period' => $period,
                        'payment_date' => date('Y-m-t', strtotime($period . '-01')),
                        'payment_method' => 'Transferencia Electrónica',
                        'bank_name' => 'Banco Estado',
                        'account_type' => 'Cuenta RUT',
                        'account_number' => (string) rand(10000000, 99999999),
                        'observations' => "Liquidación de prueba {$period} — nómina real generada por seeder determinista.",
                    ])
                );
            }
        }
    }

    private function seedAmenityBookings(): void
    {
        $condo = Condominium::first();
        if (!$condo) {
            return;
        }

        $propietario = User::where('email', 'propietario@redvecino.cl')->first();
        $property = Property::where('condominium_id', $condo->id)
            ->where('type', 'apartment')
            ->orderBy('id')
            ->first();

        if (!$property || !$propietario) {
            return;
        }

        $bookings = [
            [
                'area' => 'Sala de Eventos', 'date' => '2026-06-29', 'slot' => '20:30 - 23:40', 'status' => 'Realizado',
            ],
            [
                'area' => 'Piscina', 'date' => '2026-06-30', 'slot' => '10:00 - 11:00', 'status' => 'Pendiente',
            ],
        ];

        foreach ($bookings as $b) {
            Booking::firstOrCreate(
                [
                    'user_id' => $propietario->id,
                    'property_id' => $property->id,
                    'condominium_id' => $condo->id,
                    'area_name' => $b['area'],
                    'booking_date' => $b['date'],
                    'time_slot' => $b['slot'],
                ],
                ['status' => $b['status']]
            );
        }
    }
}