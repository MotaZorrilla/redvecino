<?php

namespace Database\Seeders;

use App\Models\AdminProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class CommercialDemoSeeder extends Seeder
{
    /**
     * Cuenta Demo Comercial para presentaciones y venta de René.
     * Acceso rápido con condominios de alta fidelidad, finanzas activas y reportes al día.
     */
    public function run(): void
    {
        $demoUser = User::firstOrCreate(
            ['email' => 'demo@redvecino.cl'],
            [
                'name' => 'René Ambiado (Demo Comercial)',
                'rut' => '10.100.100-1',
                'phone' => '+56 9 8888 7777',
                'password' => Hash::make('password'),
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        if (!$demoUser->hasRole('Administrador')) {
            $demoUser->assignRole('Administrador');
        }

        AdminProfile::firstOrCreate(
            ['user_id' => $demoUser->id],
            ['access_level' => 'full']
        );
    }
}
