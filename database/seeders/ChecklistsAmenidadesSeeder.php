<?php

namespace Database\Seeders;

use App\Models\Condominium;
use App\Models\FacilityChecklist;
use App\Models\User;
use Illuminate\Database\Seeder;

class ChecklistsAmenidadesSeeder extends Seeder
{
    /**
     * Seed de inspecciones y checklists de entrega de áreas comunes.
     */
    public function run(): void
    {
        $condo = Condominium::first();
        if (!$condo) return;

        $admin = User::whereHas('roles', fn ($q) => $q->where('name', 'Administrador'))->first();
        $resident = User::whereHas('roles', fn ($q) => $q->where('name', 'Residente'))->first();

        // 1. Check-in Quincho Conforme
        FacilityChecklist::firstOrCreate(
            [
                'condominium_id' => $condo->id,
                'facility_name' => 'Quincho Panorámico Torre A',
                'type' => 'check_in',
            ],
            [
                'inspected_by' => $admin?->id,
                'received_by' => $resident?->id,
                'status' => 'conforme',
                'items_status' => [
                    ['id' => 1, 'name' => 'Mobiliario (Mesas y Sillas)', 'status' => 'ok', 'comment' => '12 sillas completas'],
                    ['id' => 2, 'name' => 'Parrilla / Cocina', 'status' => 'ok', 'comment' => 'Parrilla limpia'],
                    ['id' => 3, 'name' => 'Iluminación y Enchufes', 'status' => 'ok', 'comment' => 'Operativo'],
                    ['id' => 4, 'name' => 'Aseo e Higiene General', 'status' => 'ok', 'comment' => 'Limpio'],
                ],
                'deposit_action' => 'liberar',
                'deposit_deduction_amount' => 0,
                'notes' => 'Entrega inicial sin novedades.',
            ]
        );

        // 2. Check-out Sala Multiuso con Observaciones
        FacilityChecklist::firstOrCreate(
            [
                'condominium_id' => $condo->id,
                'facility_name' => 'Sala de Eventos y Multiuso',
                'type' => 'check_out',
            ],
            [
                'inspected_by' => $admin?->id,
                'received_by' => $resident?->id,
                'status' => 'con_observaciones',
                'items_status' => [
                    ['id' => 1, 'name' => 'Mobiliario (Mesas y Sillas)', 'status' => 'ok', 'comment' => 'Completo'],
                    ['id' => 2, 'name' => 'Aseo e Higiene General', 'status' => 'observado', 'comment' => 'Requiere refuerzo de barrido en terraza exterior'],
                ],
                'deposit_action' => 'liberar',
                'deposit_deduction_amount' => 0,
                'notes' => 'Residente colaboró con la entrega en el horario acordado.',
            ]
        );
    }
}
