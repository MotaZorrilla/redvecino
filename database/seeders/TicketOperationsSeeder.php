<?php

namespace Database\Seeders;

use App\Models\Condominium;
use App\Models\Property;
use App\Models\ResidentProfile;
use App\Models\Ticket;
use App\Models\TicketCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class TicketOperationsSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Ensure Ticket Categories exist
        $categoriesData = [
            ['name' => 'Fontanería e Instalaciones Sanitarias', 'description' => 'Filtraciones, llaves de paso, desagües, grifería y problemas de agua potable.'],
            ['name' => 'Electricidad e Iluminación', 'description' => 'Ampolletas quemadas, cortocircuitos, enchufes y tableros eléctricos comunes.'],
            ['name' => 'Ascensores y Portones Automáticos', 'description' => 'Fallas mecánicas de ascensores, brazos hidráulicos y portones vehiculares.'],
            ['name' => 'Climatización y Ventilación', 'description' => 'Extractores de aire, calderas, calefacción central y aire acondicionado.'],
            ['name' => 'Áreas Verdes y Piscinas', 'description' => 'Riego, piscinas comunes, mantenimiento de jardines y quinchos.'],
            ['name' => 'Seguridad y Conserjería', 'description' => 'Cámaras de vigilancia CCTV, citófonos, alarmas y llaves de acceso.'],
            ['name' => 'Administración y Convivencia', 'description' => 'Consultas de cobros, multas, reservas de espacios y reclamos entre vecinos.'],
        ];

        foreach ($categoriesData as $catData) {
            TicketCategory::firstOrCreate(['name' => $catData['name']], $catData);
        }

        $categories = TicketCategory::all();

        $ticketTemplates = [
            [
                'title' => 'Filtración de agua en ducto principal de baño',
                'description' => 'Se observa humedad severa en el cielo falso del baño. Gotea constantemente y la mancha se expande. Solicitamos inspección urgente de plomería.',
                'cat' => 'Fontanería e Instalaciones Sanitarias',
                'priority' => 'high',
            ],
            [
                'title' => 'Citófono no timbra al recibir llamadas desde conserjería',
                'description' => 'El citófono ubicado en el acceso del dpto no suena cuando llaman de entrada. Los conserjes indican que da tono pero no emite audio interno.',
                'cat' => 'Seguridad y Conserjería',
                'priority' => 'medium',
            ],
            [
                'title' => 'Ampolleta quemada en pasillo del piso 4',
                'description' => 'La luz de emergencia y el foco principal del pasillo del piso 4 están apagados. El pasillo queda muy oscuro por las noches.',
                'cat' => 'Electricidad e Iluminación',
                'priority' => 'low',
            ],
            [
                'title' => 'Portón vehicular de acceso norte frena a mitad de recorrido',
                'description' => 'El portón automático tarda el doble de tiempo en abrir y la fotocélula de seguridad está desalineada. Provoca atascamientos vehiculares.',
                'cat' => 'Ascensores y Portones Automáticos',
                'priority' => 'high',
            ],
            [
                'title' => 'Extractor de aire de cocina en quincho 2 no responde',
                'description' => 'Al utilizar el quincho 2 detectamos que la campana extractora no enciende el motor. Se acumula humo en el área social.',
                'cat' => 'Climatización y Ventilación',
                'priority' => 'low',
            ],
            [
                'title' => 'Solicitud de emisión de nuevo tag / chip RFID de acceso',
                'description' => 'Solicito la compra e inscripción de 2 tags adicionales para mi vehículo y grupo familiar. Quedo atento a la confirmación de pago.',
                'cat' => 'Administración y Convivencia',
                'priority' => 'medium',
            ],
            [
                'title' => 'Ruido molesto y música alta pasadas las 01:00 AM',
                'description' => 'Fiesta no autorizada en departamento colindante superando los límites de decibeles de convivencia. Se requiere intervención de conserjería.',
                'cat' => 'Administración y Convivencia',
                'priority' => 'high',
            ],
            [
                'title' => 'Falla en botón de llamado del ascensor A2',
                'description' => 'El pulsador del piso 2 para llamar al ascensor bajando se encuentra hundido y descompuesto.',
                'cat' => 'Ascensores y Portones Automáticos',
                'priority' => 'medium',
            ]
        ];

        $condos = Condominium::all();
        $employees = User::role('Colaborador')->get();

        $ticketCount = 0;
        foreach ($condos as $condo) {
            $apartments = Property::where('condominium_id', $condo->id)->where('type', 'apartment')->get();
            if ($apartments->isEmpty()) continue;

            for ($t = 1; $t <= 18; $t++) {
                $property = $apartments->random();
                $residentProfile = ResidentProfile::where('property_id', $property->id)->first();
                $creatorUser = $residentProfile ? User::find($residentProfile->user_id) : User::role('Propietario')->inRandomOrder()->first();
                if (!$creatorUser) continue;

                $tpl = $ticketTemplates[($t + $condo->id) % count($ticketTemplates)];
                $status = match ($t % 4) {
                    0 => 'open',
                    1 => 'in_progress',
                    2 => 'resolved',
                    3 => 'closed',
                };

                $assignedEmployee = ($status !== 'open' && $employees->isNotEmpty()) ? $employees->random() : null;
                $catModel = TicketCategory::where('name', 'like', "%{$tpl['cat']}%")->first() ?? $categories->first();

                Ticket::firstOrCreate(
                    [
                        'property_id' => $property->id,
                        'title' => $tpl['title'] . " ({$condo->name} #{$t})",
                    ],
                    [
                        'created_by' => $creatorUser->id,
                        'assigned_to' => $assignedEmployee?->id,
                        'category_id' => $catModel->id,
                        'description' => $tpl['description'],
                        'priority' => $tpl['priority'],
                        'status' => $status,
                        'resolved_at' => in_array($status, ['resolved', 'closed']) ? now()->subDays(rand(1, 10)) : null,
                    ]
                );
                $ticketCount++;
            }
        }

        $this->command?->info("TicketOperationsSeeder: {$ticketCount} support tickets generated and linked across all 6 condominiums.");
    }
}
