<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

/**
 * @deprecated Duplicado con DatabaseSeeder (Torres Alpha/Beta + 12 propiedades con
 * coefficient 0.0833 rompían la suma de alícuotas = 100%). La estructura única y el
 * coefficient por alícuota de modelo se generan en DatabaseSeeder (apt 0.045, park/bodega 0.010).
 * Este seeder quedó como no-op para no alterar la fecha/historial de seed.
 */
class TowerStructureSeeder extends Seeder
{
    public function run(): void
    {
        // Intencionalmente vacío: la estructura se genera en DatabaseSeeder.
    }
}