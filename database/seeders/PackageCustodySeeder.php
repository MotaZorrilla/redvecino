<?php

namespace Database\Seeders;

use App\Models\Condominium;
use App\Models\PackageCustody;
use App\Models\Property;
use Illuminate\Database\Seeder;

class PackageCustodySeeder extends Seeder
{
    public function run(): void
    {
        $condo = Condominium::first();
        if (!$condo) {
            return;
        }

        $properties = Property::where('condominium_id', $condo->id)->take(6)->get();
        if ($properties->isEmpty()) {
            return;
        }

        $packages = [
            [
                'property_id' => $properties[0]->id,
                'recipient_name' => 'Diego Alarcón',
                'carrier' => 'Chilexpress',
                'tracking_number' => 'CHX-99887766',
                'notes' => 'Caja mediana de MercadoLibre sellada en conserjería.',
                'status' => 'custody',
                'photo_path' => null,
                'delivered_at' => null,
                'signature' => null,
            ],
            [
                'property_id' => $properties[1]->id,
                'recipient_name' => 'Camila Soto',
                'carrier' => 'Blue Express',
                'tracking_number' => 'BX-45678912',
                'notes' => 'Sobre acolchado Falabella.',
                'status' => 'custody',
                'photo_path' => null,
                'delivered_at' => null,
                'signature' => null,
            ],
            [
                'property_id' => $properties[2]->id,
                'recipient_name' => 'Matías Valenzuela',
                'carrier' => 'Starken',
                'tracking_number' => 'STK-77123490',
                'notes' => 'Paquete grande con aviso frágil.',
                'status' => 'delivered',
                'photo_path' => null,
                'delivered_at' => now()->subHours(4),
                'signature' => 'Firma digital confirmada por residente',
            ],
            [
                'property_id' => $properties[3]->id,
                'recipient_name' => 'Valentina Rojas',
                'carrier' => 'Mercado Envíos',
                'tracking_number' => 'ML-55223344',
                'notes' => 'Caja pequeña de tecnología.',
                'status' => 'delivered',
                'photo_path' => null,
                'delivered_at' => now()->subDays(1),
                'signature' => 'Firma digital confirmada por residente',
            ],
        ];

        foreach ($packages as $pkg) {
            PackageCustody::updateOrCreate(
                [
                    'condominium_id' => $condo->id,
                    'tracking_number' => $pkg['tracking_number'],
                ],
                $pkg
            );
        }
    }
}
