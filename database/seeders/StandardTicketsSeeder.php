<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\ResidentProfile;
use App\Models\Ticket;
use App\Models\TicketCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

class StandardTicketsSeeder extends Seeder
{
    public function run(): void
    {
        $categories = TicketCategory::all();
        if ($categories->isEmpty()) {
            return;
        }

        $ticketTemplates = [
            [
                'title' => 'Filtración de agua en ducto de baño',
                'description' => 'Se observa humedad en el cielo falso del baño principal. Gotea constantemente y la mancha de humedad ha crecido en las últimas 24 horas. Solicitamos el envío de un técnico de mantención a la brevedad.',
                'cat' => 'Fontanería e Instalaciones Sanitarias',
                'priority' => 'high',
            ],
            [
                'title' => 'Citófono no suena al recibir llamadas de conserjería',
                'description' => 'El citófono ubicado en el comedor no timbra cuando llaman desde conserjería. Los conserjes indican que da tono pero adentro no suena nada. Por favor revisar cableado del departamento.',
                'cat' => 'Security and Conserjería',
                'priority' => 'medium',
            ],
            [
                'title' => 'Ampolleta quemada en pasillo del piso 3',
                'description' => 'La luz común fuera de la puerta de mi departamento se encuentra totalmente quemada desde el fin de semana pasado. Agradecemos su cambio rápido ya que queda muy oscuro.',
                'cat' => 'Electricidad e Iluminación',
                'priority' => 'low',
            ],
            [
                'title' => 'Portón vehicular de acceso norte abre con extrema lentitud',
                'description' => 'El portón automático de salida de vehículos tarda el doble de tiempo de lo normal en abrir. A veces se frena a mitad de recorrido y los sensores de seguridad fallan. Requiere revisión técnica.',
                'cat' => 'Ascensores y Portones Automáticos',
                'priority' => 'high',
            ],
            [
                'title' => 'Extractor de aire de cocina común del quincho no enciende',
                'description' => 'Hicimos uso del quincho 1 el día de ayer y nos percatamos de que el extractor de humos principal está apagado y el interruptor no responde. Se llena de humo el área común.',
                'cat' => 'Climatización y Ventilación',
                'priority' => 'low',
            ],
            [
                'title' => 'Solicitud de copia de llave inteligente / tag de acceso',
                'description' => 'Necesitamos adquirir dos tags de acceso adicionales para miembros de la familia que se mudaron recientemente. Solicitamos indicaciones para el pago y la entrega del chip encriptado.',
                'cat' => 'Administración y Convivencia',
                'priority' => 'medium',
            ],
        ];

        $apartments = Property::where('type', 'apartment')->get();
        if ($apartments->isEmpty()) {
            return;
        }

        $colaboradores = User::role('Colaborador')->get();

        for ($i = 1; $i <= 12; $i++) {
            $property = $apartments->random();
            $residentProfile = ResidentProfile::where('property_id', $property->id)->first();
            $creatorUser = $residentProfile ? $residentProfile->user : User::role('Propietario')->inRandomOrder()->first();
            if (!$creatorUser) continue;

            $tpl = $ticketTemplates[$i % count($ticketTemplates)];
            $status = fake()->randomElement(['open', 'in_progress', 'resolved', 'closed']);

            $assignedTo = null;
            if ($status !== 'open' && $colaboradores->isNotEmpty()) {
                $assignedTo = $colaboradores->random()->id;
            }

            $resolvedAt = null;
            $notes = null;
            if (in_array($status, ['resolved', 'closed'])) {
                $resolvedAt = fake()->dateTimeBetween('-20 days', 'now');
                $notes = 'Incidencia atendida y resuelta por conserjería/técnico contratado. Se aplicó solución correctiva y se validó conformidad de los residentes.';
            }

            $catModel = TicketCategory::where('name', 'like', "%{$tpl['cat']}%")->first() ?? $categories[0];

            Ticket::updateOrCreate(
                [
                    'property_id' => $property->id,
                    'title' => $tpl['title'],
                ],
                [
                    'created_by' => $creatorUser->id,
                    'assigned_to' => $assignedTo,
                    'category_id' => $catModel->id,
                    'description' => $tpl['description'],
                    'priority' => $tpl['priority'],
                    'status' => $status,
                    'resolved_at' => $resolvedAt,
                    'resolution_notes' => $notes,
                ]
            );
        }

        $demoProperty = Property::where('type', 'apartment')->orderBy('id')->first();
        $rene = User::whereEmail('residente@redvecino.cl')->first();
        $colaborador = User::whereEmail('colaborador@redvecino.cl')->first();

        if ($demoProperty && $rene && $colaborador) {
            $catPlumbing = TicketCategory::where('name', 'like', '%Fontanería%')->first() ?? $categories[0];

            Ticket::updateOrCreate(
                [
                    'property_id' => $demoProperty->id,
                    'title' => 'Filtración de agua activa en cañería del calefont',
                ],
                [
                    'created_by' => $rene->id,
                    'assigned_to' => $colaborador->id,
                    'category_id' => $catPlumbing->id,
                    'description' => 'Hay una filtración constante en la manguera flexible de entrada de agua fría del calefont en la logia. Está escurriendo agua hacia la pared. Solicitamos un gasfiter autorizado de urgencia.',
                    'priority' => 'high',
                    'status' => 'in_progress',
                    'resolved_at' => null,
                    'resolution_notes' => null,
                ]
            );
        }
    }
}
