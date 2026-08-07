<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Property;
use App\Models\Payment;
use App\Models\Condominium;

class VolumeSeeder extends Seeder
{
    /**
     * Genera datos volumétricos para stress testing (load test).
     * Solo se ejecuta en local/testing, nunca en producción.
     * Conteos configurables vía env para acelerar los tests.
     */
    public function run(): void
    {
        if (!app()->environment('local', 'testing')) {
            $this->command?->warn('VolumeSeeder solo puede ejecutarse en local/testing.');
            return;
        }

        $propertyCount = (int) env('VOLUME_PROPERTIES', 10000);
        $paymentCount = (int) env('VOLUME_PAYMENTS', 100000);

        $condo = Condominium::first();
        if (!$condo) {
            $this->command?->error('Debe existir al menos un condominio antes de ejecutar VolumeSeeder.');
            return;
        }

        $properties = Property::factory()->count($propertyCount)->create([
            'condominium_id' => $condo->id,
        ]);

        Payment::factory()->count($paymentCount)->create([
            'property_id' => $properties->random()->id,
        ]);

        $this->command?->info("VolumeSeeder: {$propertyCount} propiedades y {$paymentCount} pagos creados.");
    }
}