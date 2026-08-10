<?php

namespace Database\Seeders;

use App\Models\Condominium;
use App\Models\Facility;
use App\Models\Booking;
use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class FacilityAndPayrollSeeder extends Seeder
{
    public function run(): void
    {
        $condos = Condominium::all();
        if ($condos->isEmpty()) return;

        $facilityTypes = [
            ['name' => 'Quincho Panorámico N°1', 'type' => 'BBQ', 'capacity' => 20, 'fee' => 35000.00],
            ['name' => 'Salón de Eventos Multiuso', 'type' => 'Hall', 'capacity' => 50, 'fee' => 60000.00],
            ['name' => 'Cancha de Pádel', 'type' => 'Court', 'capacity' => 4, 'fee' => 15000.00],
            ['name' => 'Piscina Exterior', 'type' => 'Pool', 'capacity' => 30, 'fee' => 0.00],
        ];

        foreach ($condos as $condo) {
            foreach ($facilityTypes as $fData) {
                Facility::firstOrCreate(
                    [
                        'condominium_id' => $condo->id,
                        'name' => $fData['name'],
                    ],
                    [
                        'type' => $fData['type'],
                        'capacity' => $fData['capacity'],
                        'fee' => $fData['fee'],
                    ]
                );

                // Create bookings for properties in this condo using the actual Booking schema
                $properties = Property::where('condominium_id', $condo->id)->where('type', 'apartment')->get();
                if ($properties->isNotEmpty()) {
                    for ($b = 1; $b <= 3; $b++) {
                        $prop = $properties->random();
                        $user = User::role('Propietario')->inRandomOrder()->first();
                        if (!$user) continue;

                        $bookingDate = Carbon::now()->addDays(rand(1, 20))->format('Y-m-d');
                        Booking::firstOrCreate(
                            [
                                'user_id' => $user->id,
                                'property_id' => $prop->id,
                                'condominium_id' => $condo->id,
                                'booking_date' => $bookingDate,
                                'time_slot' => '14:00 - 18:00',
                            ],
                            [
                                'area_name' => $fData['name'],
                                'status' => rand(0, 1) ? 'Realizado' : 'Pendiente',
                            ]
                        );
                    }
                }
            }
        }

        $this->command?->info('FacilityAndPayrollSeeder: Facilities and Bookings seeded for all 6 Condominiums.');
    }
}
