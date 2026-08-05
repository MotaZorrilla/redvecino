<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Condominium;
use App\Models\Facility;
use Illuminate\Support\Facades\DB;

class ChecklistSeeder extends Seeder
{
    public function run(): void
    {
        $condo = Condominium::first();
        $facility = Facility::first();
        if (!$condo || !$facility) return;

        if (!DB::getSchemaBuilder()->hasTable('checklist_records')) {
            return;
        }

        $recordId = DB::table('checklist_records')->insertGetId([
            'condominium_id' => $condo->id,
            'facility_id' => $facility->id,
            'type' => 'entrega',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        if (DB::getSchemaBuilder()->hasTable('checklist_record_details')) {
            DB::table('checklist_record_details')->insert([
                [
                    'checklist_record_id' => $recordId,
                    'item_name' => 'Parrilla',
                    'status' => 'ok',
                    'comment' => 'Limpia y lista para usar',
                    'photo_path' => null,
                ],
                [
                    'checklist_record_id' => $recordId,
                    'item_name' => 'Mobiliario',
                    'status' => 'ok',
                    'comment' => '10 sillas y 2 mesas completas',
                    'photo_path' => null,
                ],
            ]);
        }
    }
}
