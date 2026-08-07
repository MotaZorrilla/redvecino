<?php

namespace Database\Seeders;

use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Seeder;

class MessagesSeeder extends Seeder
{
    public function run(): void
    {
        $messageSubjectContent = [
            ['subject' => 'Consulta sobre cobro de Gasto Común de Mayo', 'content' => 'Estimado Administrador, le escribo para consultar sobre un recargo por concepto de mantención extraordinaria reflejado en mi última liquidación. ¿Podría facilitarme el detalle de dicha factura? Atentamente.'],
            ['subject' => 'Reserva de Quincho aprobada', 'content' => 'Hola, le informamos que su solicitud para la reserva del Quincho N°2 para el próximo viernes en la tarde ha sido aprobada con éxito. Recuerde respetar el aforo máximo de 15 personas y entregar limpio el sector a medianoche.'],
            ['subject' => 'Aviso de reparación de ascensor', 'content' => 'Estimado Presidente del Comité, le escribo para avisar que el técnico de Otis ya resolvió el problema del sensor de puerta en el ascensor 1 y quedó funcionando al 100% en fase de pruebas.'],
            ['subject' => 'Reporte de ruido molesto / Vecino Depto 402', 'content' => 'Hola conserjería, quería reportar que en el departamento 402 tienen música en volumen muy alto y ruidos de taconeo molestos. Es día de semana y ya son pasadas las 12:30 AM. ¿Podrían llamarlos? Gracias.'],
        ];

        // Seed some random messages
        $allUsers = User::all();
        for ($i = 0; $i < 8; $i++) {
            $sender = $allUsers->random();
            $receiver = $allUsers->where('id', '!=', $sender->id)->random();
            if (!$sender || !$receiver) continue;

            $template = $messageSubjectContent[$i % count($messageSubjectContent)];

            Message::create([
                'sender_id' => $sender->id,
                'receiver_id' => $receiver->id,
                'subject' => $template['subject'],
                'content' => $template['content'],
                'is_read' => fake()->boolean(60),
                'read_at' => fake()->dateTimeBetween('-10 days', 'now'),
            ]);
        }

        // Add 1 unread message specifically for our Demo Propietario from the Admin
        $admin = User::where('email', 'admin@redvecino.cl')->first();
        $propietario = User::where('email', 'propietario@redvecino.cl')->first();
        if ($admin && $propietario) {
            Message::create([
                'sender_id' => $admin->id,
                'receiver_id' => $propietario->id,
                'subject' => 'Notificación de Regularización de Pago Pendiente',
                'content' => 'Estimado propietario, le saludamos cordialmente. Le escribimos para recordarle amablemente que mantiene un saldo pendiente por concepto de multas de convivencia del mes anterior. Le solicitamos regularizar su situación en el portal de pagos en línea.',
                'is_read' => false,
                'read_at' => null,
            ]);
        }

        $this->command?->info('Internal communication messages seeded.');
    }
}