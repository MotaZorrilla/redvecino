<?php

namespace Database\Seeders;

use App\Models\Message;
use App\Models\Property;
use App\Models\User;
use Illuminate\Database\Seeder;

class MessagesSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::where('email', 'admin@redvecino.cl')->first() ?? User::first();
        $propietario = User::where('email', 'propietario@redvecino.cl')->first() ?? User::where('id', '!=', $admin->id)->first();
        $colaborador = User::whereHas('roles', fn ($q) => $q->where('name', 'Colaborador'))->first() ?? $admin;
        $property = Property::first();

        $messages = [
            [
                'condominium_id' => 1,
                'property_id' => null,
                'channel_type' => 'administracion_oficial',
                'sender_id' => $admin->id,
                'receiver_id' => $propietario?->id ?? $admin->id,
                'subject' => 'Mantenimiento Preventivo de Bombas de Agua',
                'content' => "Estimada comunidad:\nLes informamos que este jueves se realizará la mantención trimestral de las bombas de agua de 09:00 a 12:00 hrs. El suministro funcionará con presión reducida durante ese lapso.",
                'is_read' => true,
                'read_at' => now()->subDays(2),
            ],
            [
                'condominium_id' => 1,
                'property_id' => $property?->id,
                'channel_type' => 'conserjeria_unidad',
                'sender_id' => $colaborador->id,
                'receiver_id' => $propietario?->id ?? $admin->id,
                'subject' => 'Aviso de Encomienda en Conserjería',
                'content' => "Hola vecino, le informamos que ha llegado una caja a su nombre remitida por Chilexpress. Puede retirarla en recepción con su firma.",
                'is_read' => false,
                'read_at' => null,
            ],
            [
                'condominium_id' => 1,
                'property_id' => null,
                'channel_type' => 'comite_privado',
                'sender_id' => $admin->id,
                'receiver_id' => $colaborador->id,
                'subject' => 'Revisión de Presupuesto para Pintura de Fachada',
                'content' => "Estimados miembros del comité:\nAdjunto la comparativa de las 3 cotizaciones recibidas para los trabajos de impermeabilización y pintura de la torre 1 para su análisis antes de la asamblea.",
                'is_read' => true,
                'read_at' => now()->subDays(1),
            ],
            [
                'condominium_id' => 1,
                'property_id' => null,
                'channel_type' => 'directo',
                'sender_id' => $admin->id,
                'receiver_id' => $propietario?->id ?? $admin->id,
                'subject' => 'Notificación de Regularización de Gasto Común',
                'content' => "Estimado propietario:\nLe saludamos cordialmente para recordarle que mantiene saldo pendiente del período anterior. Le invitamos a regularizar su estado en el portal de pagos.",
                'is_read' => false,
                'read_at' => null,
            ],
        ];

        foreach ($messages as $msg) {
            Message::updateOrCreate(
                [
                    'condominium_id' => $msg['condominium_id'],
                    'subject' => $msg['subject'],
                ],
                $msg
            );
        }

        $this->command?->info('Internal communication messages seeded with channels.');
    }
}