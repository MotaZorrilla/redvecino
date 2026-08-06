<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\Ticket;
use App\Models\TicketCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Tickets "transaccionales" deterministas para el demo (Fase 6):
 *  - Miguel (Comité): 2 sugerencias de mejoras a amenities / convivencia.
 *  - René (Residente) en el departamento demo (Torre 1): 1 reclamo activo de convivencia.
 * Los títulos actúan como llave natural (updateOrCreate) para la idempotencia.
 */
class DemoTicketsSeeder extends Seeder
{
    public function run(): void
    {
        $miguel = User::whereEmail('comite@redvecino.cl')->first();
        $rene = User::whereEmail('residente@redvecino.cl')->first();
        $colaborador = User::whereEmail('colaborador@redvecino.cl')->first();

        // Departamento demo (Torre 1 - primer depto del Condominio 1)
        $demoProperty = Property::where('type', 'apartment')
            ->orderBy('id')
            ->first();

        if (!$demoProperty || !$miguel || !$rene) {
            return;
        }

        $convivencia = TicketCategory::where('name', 'like', '%Administración y Convivencia%')->first();
        $areasVerdes = TicketCategory::where('name', 'like', '%Áreas Verdes%')->first() ?? $convivencia;

        $sugerenciasMiguel = [
            [
                'title' => 'Sugerencia: ampliar horario de piscina en temporada estival',
                'description' => 'Como comité, proponemos extender el horario de la piscina común hasta las 22:00 hrs. durante diciembre y enero, con turno de conserje adicional. Aumentaría el valor percibido del edificio y el uso de amenities sin generar reclamos por ruido en horario no habitable.',
                'category_id' => $areasVerdes->id,
                'priority' => 'low',
                'status' => 'open',
                'assigned_to' => null,
            ],
            [
                'title' => 'Sugerencia: habilitar sala multiuso como cowork en horario diurno',
                'description' => 'Sugerimos que la sala multiuso de la Torre 1 pueda reservarse como espacio de teletrabajo entre 09:00 y 18:00 hrs. de lunes a viernes. El comité puede elaborar un reglamento de uso rápido para formalizarlo en la próxima asamblea.',
                'category_id' => $convivencia->id,
                'priority' => 'medium',
                'status' => 'open',
                'assigned_to' => null,
            ],
        ];

        $reclamoRene = [
            'title' => 'Reclamo: ruido molesto por fiesta en departamento vecino',
            'description' => 'Los fines de semana del departamento contiguo se escuchan conversaciones y música a alto volumen pasadas las 00:30 hrs., superando lo permitido en el reglamento de convivencia. Pido que conserjería contacte al propietario y deje registro formal del aviso.',
            'category_id' => $convivencia->id,
            'priority' => 'medium',
            'status' => 'in_progress',
            'assigned_to' => $colaborador ? $colaborador->id : null,
        ];

        foreach ($sugerenciasMiguel as $sugerencia) {
            Ticket::updateOrCreate(
                ['created_by' => $miguel->id, 'title' => $sugerencia['title']],
                [
                    'property_id' => $demoProperty->id,
                    'assigned_to' => $sugerencia['assigned_to'],
                    'category_id' => $sugerencia['category_id'],
                    'description' => $sugerencia['description'],
                    'priority' => $sugerencia['priority'],
                    'status' => $sugerencia['status'],
                ]
            );
        }

        Ticket::updateOrCreate(
            ['created_by' => $rene->id, 'title' => $reclamoRene['title']],
            [
                'property_id' => $demoProperty->id,
                'assigned_to' => $reclamoRene['assigned_to'],
                'category_id' => $reclamoRene['category_id'],
                'description' => $reclamoRene['description'],
                'priority' => $reclamoRene['priority'],
                'status' => $reclamoRene['status'],
            ]
        );

        $this->command->info('Demo tickets seeded (Miguel: 2 sugerencias, René: 1 reclamo).');
    }
}
