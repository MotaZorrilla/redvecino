<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\Condominium;
use App\Models\User;
use Illuminate\Database\Seeder;

class AnnouncementsSeeder extends Seeder
{
    public function run(): void
    {
        $announcementsData = [
            [
                'title' => 'Mantención Semestral de Calderas y Corte de Agua Caliente',
                'content' => 'Estimados vecinos, les informamos que el día miércoles 27 de mayo se realizará la mantención semestral reglamentaria a la caldera central del edificio. Debido a esto, el servicio de agua caliente se suspenderá entre las 08:30 y las 14:00 horas. Agradecemos su comprensión.',
                'priority' => 'high',
            ],
            [
                'title' => 'Campaña de Vacunación contra la Influenza en Sala Multiuso',
                'content' => 'Nos complace informar que, gracias a gestiones con el CESFAM comunal, se realizará un operativo de vacunación escolar y de adultos mayores contra la influenza el próximo sábado 30 de mayo de 09:00 a 13:00 en la sala multiuso. Vacunas gratuitas e ilimitadas para copropietarios.',
                'priority' => 'normal',
            ],
            [
                'title' => 'Modificación del Reglamento Interno sobre Mudanzas y Ruidos',
                'content' => 'El Comité de Administración recuerda a todos los residentes que las mudanzas solo están permitidas de lunes a viernes de 09:00 a 18:00 y sábados de 09:00 a 14:00. Cualquier mudanza fuera de este horario o que no cuente con las lonas de protección de ascensor instaladas será sancionada.',
                'priority' => 'normal',
            ],
            [
                'title' => 'Pintura y Reparación de Fachada del Acceso Peatonal',
                'content' => 'Durante toda esta semana se realizarán trabajos de hidrolavado y pintura en el portal de acceso principal del condominio. Rogamos transitar con precaución y respetar las señales de advertencia de pintura fresca colocadas por el personal de obras.',
                'priority' => 'low',
            ],
        ];

        $adminId = User::where('email', 'admin@redvecino.cl')->value('id');

        foreach (Condominium::all() as $condo) {
            foreach ($announcementsData as $ann) {
                Announcement::create([
                    'condominium_id' => $condo->id,
                    'created_by' => $adminId,
                    'title' => $ann['title'],
                    'content' => $ann['content'],
                    'priority' => $ann['priority'],
                    'published_at' => now()->subDays(fake()->numberBetween(1, 10)),
                    'expires_at' => now()->addDays(15),
                ]);
            }
        }

        $this->command?->info('Community announcements seeded.');
    }
}