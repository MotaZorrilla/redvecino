<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Property;
use Illuminate\Support\Facades\DB;

class UnitProfileSeeder extends Seeder
{
    public function run(): void
    {
        $property = Property::first();
        if (!$property) return;

        if (!DB::getSchemaBuilder()->hasTable('unit_profiles')) {
            return;
        }

        $profileId = DB::table('unit_profiles')->insertGetId([
            'property_id' => $property->id,
            'parking_spot' => 'Estac-15',
            'license_plate' => 'KPRF-88',
            'observation' => 'Tiene 1 gato castrado',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        if (DB::getSchemaBuilder()->hasTable('unit_members')) {
            DB::table('unit_members')->insert([
                [
                    'unit_profile_id' => $profileId,
                    'first_name' => 'Carlos',
                    'last_name' => 'González',
                    'rut' => '15.444.333-2',
                    'birth_date' => '1985-04-12',
                    'is_owner' => 1,
                    'lives_in_unit' => 1,
                ],
                [
                    'unit_profile_id' => $profileId,
                    'first_name' => 'Lucía',
                    'last_name' => 'González',
                    'rut' => '21.555.666-8',
                    'birth_date' => '2010-09-25',
                    'is_owner' => 0,
                    'lives_in_unit' => 1,
                ],
            ]);
        }
    }
}
