<?php

use App\Models\Condominium;
use App\Models\Payment;
use App\Models\Property;

uses(Illuminate\Foundation\Testing\RefreshDatabase::class);

describe('VolumeSeeder — datos volumétricos para stress', function () {

    it('crea propiedades y pagos voluminosos configurables por env', function () {
        $condo = Condominium::factory()->create(['name' => 'Condo Volumen', 'units_count' => 0]);

        putenv('VOLUME_PROPERTIES=15');
        putenv('VOLUME_PAYMENTS=30');

        (new \Database\Seeders\VolumeSeeder())->run();

        expect(Property::where('condominium_id', $condo->id)->count())->toBe(15);
        expect(Payment::count())->toBe(30);
    });

    test('no se ejecuta fuera de local/testing (protección producción)', function () {
        $this->app->detectEnvironment(fn () => 'production');

        putenv('VOLUME_PROPERTIES=5');
        putenv('VOLUME_PAYMENTS=5');

        (new \Database\Seeders\VolumeSeeder())->run();

        expect(Property::count())->toBe(0);
        expect(Payment::count())->toBe(0);
    });
});