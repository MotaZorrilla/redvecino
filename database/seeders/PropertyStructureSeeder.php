<?php

namespace Database\Seeders;

use App\Models\Condominium;
use App\Models\CondoTower;
use App\Models\Property;
use App\Models\OwnerProfile;
use App\Models\ResidentProfile;
use App\Models\User;
use App\Support\Rut;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PropertyStructureSeeder extends Seeder
{
    private int $rutCounter = 100;

    private function uniqueRut(): string
    {
        $this->rutCounter++;
        $base = 15000000 + $this->rutCounter;
        return Rut::generate($base);
    }

    public function run(): void
    {
        $condos = Condominium::with('towers')->get();
        if ($condos->isEmpty()) return;

        $demoOwner = User::where('email', 'propietario@redvecino.cl')->first();
        $demoResident = User::where('email', 'residente@redvecino.cl')->first();

        $ownerNames = [
            'Camila Vergara', 'Sebastián Muñoz', 'Francisca Silva', 'Matías Contreras',
            'Constanza Flores', 'Nicolás Morales', 'Valentina Reyes', 'Javier Gutiérrez',
            'Ignacio Fuentes', 'Fernanda Soto', 'Diego Alarcón', 'Catalina Herrera',
            'Felipe Carrasco', 'Sofía Valenzuela', 'Andrés Martínez', 'Alejandra Pérez',
            'Gonzalo Tapia', 'Daniela Orellana', 'Cristóbal Vera', 'Beatriz Sepúlveda'
        ];

        $residentNames = [
            'Gabriel Castillo', 'Carolina Orellana', 'Gonzalo Espinoza', 'Javiera Núñez',
            'Rodrigo Tapia', 'Patricia Vera', 'Joaquín Gómez', 'María José Arriagada',
            'Álvaro Venegas', 'Paulina Sandoval', 'Esteban Paredes', 'Loreto Valdés'
        ];

        foreach ($condos as $condoIdx => $condo) {
            $towers = $condo->towers;
            $unitTarget = $condo->units_count; // e.g. 60 or 45 or 30
            $aptCount = intval($unitTarget * 0.66); // ~40 apts for 60 units
            $parkCount = intval($unitTarget * 0.17); // ~10 parkings
            $storageCount = $unitTarget - $aptCount - $parkCount; // ~10 storages

            // Generate Apartments
            for ($i = 1; $i <= $aptCount; $i++) {
                $aptNumber = 'Dpto ' . ($i + 100);
                $tower = $towers->isNotEmpty() ? $towers[($i - 1) % $towers->count()] : null;

                $property = Property::firstOrCreate(
                    [
                        'condominium_id' => $condo->id,
                        'number' => $aptNumber,
                    ],
                    [
                        'tower_id' => $tower?->id,
                        'type' => 'apartment',
                        'block' => $tower ? $tower->name : 'Torre Principal',
                        'floor' => intval(ceil($i / 4)),
                        'area_sqm' => 60.00 + ($i % 15) * 3,
                        'coefficient' => round(1.0 / $unitTarget, 4),
                        'status' => 'occupied',
                    ]
                );

                // For first apartment in Condominium 1, assign Demo Propietario & Residente
                if ($condoIdx === 0 && $i === 1) {
                    if ($demoOwner) {
                        OwnerProfile::firstOrCreate(
                            ['property_id' => $property->id],
                            [
                                'user_id' => $demoOwner->id,
                                'ownership_percentage' => 100.0,
                                'financial_status' => 'al_dia',
                            ]
                        );
                    }
                    if ($demoResident) {
                        ResidentProfile::firstOrCreate(
                            ['property_id' => $property->id],
                            [
                                'user_id' => $demoResident->id,
                                'resident_type' => 'inquilino',
                                'relationship' => 'arrendatario',
                                'lease_start' => '2025-01-01',
                                'lease_end' => '2026-12-31',
                            ]
                        );
                    }
                    continue;
                }

                // Create realistic owner
                $ownerName = $ownerNames[($i + $condoIdx) % count($ownerNames)];
                $ownerEmail = Str::slug($ownerName) . '.' . $condoIdx . '.' . $i . '@redvecinodemo.test';
                $ownerRut = $this->uniqueRut();

                $ownerUser = User::firstOrCreate(
                    ['email' => $ownerEmail],
                    [
                        'name' => $ownerName,
                        'rut' => $ownerRut,
                        'phone' => '+569' . rand(60000000, 99999999),
                        'password' => bcrypt('password'),
                        'status' => 'active',
                        'email_verified_at' => now(),
                    ]
                );
                if (!$ownerUser->hasRole('Propietario')) {
                    $ownerUser->assignRole('Propietario');
                }

                OwnerProfile::firstOrCreate(
                    ['property_id' => $property->id],
                    [
                        'user_id' => $ownerUser->id,
                        'ownership_percentage' => 100.0,
                        'financial_status' => ($i % 5 === 0) ? 'atrasado' : 'al_dia',
                    ]
                );

                // 40% chance of a distinct tenant
                if ($i % 3 === 0) {
                    $resName = $residentNames[($i + $condoIdx) % count($residentNames)];
                    $resEmail = Str::slug($resName) . '.' . $condoIdx . '.' . $i . '@redvecinodemo.test';
                    $resRut = $this->uniqueRut();

                    $residentUser = User::firstOrCreate(
                        ['email' => $resEmail],
                        [
                            'name' => $resName,
                            'rut' => $resRut,
                            'phone' => '+569' . rand(60000000, 99999999),
                            'password' => bcrypt('password'),
                            'status' => 'active',
                            'email_verified_at' => now(),
                        ]
                    );
                    if (!$residentUser->hasRole('Residente')) {
                        $residentUser->assignRole('Residente');
                    }

                    ResidentProfile::firstOrCreate(
                        ['property_id' => $property->id],
                        [
                            'user_id' => $residentUser->id,
                            'resident_type' => 'inquilino',
                            'relationship' => 'arrendatario',
                            'lease_start' => '2025-03-01',
                            'lease_end' => '2027-02-28',
                        ]
                    );
                } else {
                    ResidentProfile::firstOrCreate(
                        ['property_id' => $property->id],
                        [
                            'user_id' => $ownerUser->id,
                            'resident_type' => 'propietario',
                            'relationship' => 'propietario',
                            'lease_start' => null,
                            'lease_end' => null,
                        ]
                    );
                }
            }

            // Generate Parkings
            for ($p = 1; $p <= $parkCount; $p++) {
                Property::firstOrCreate(
                    [
                        'condominium_id' => $condo->id,
                        'number' => 'E-' . $p,
                    ],
                    [
                        'type' => 'parking',
                        'block' => 'Subterráneo -1',
                        'area_sqm' => 12.50,
                        'coefficient' => 0.005,
                        'status' => 'occupied',
                    ]
                );
            }

            // Generate Storages
            for ($s = 1; $s <= $storageCount; $s++) {
                Property::firstOrCreate(
                    [
                        'condominium_id' => $condo->id,
                        'number' => 'B-' . $s,
                    ],
                    [
                        'type' => 'storage',
                        'block' => 'Subterráneo -1',
                        'area_sqm' => 6.00,
                        'coefficient' => 0.003,
                        'status' => 'occupied',
                    ]
                );
            }
        }

        $this->command?->info('PropertyStructureSeeder: Hundreds of Properties, Owners and Residents seeded across 6 condos.');
    }
}
