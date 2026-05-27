<?php

namespace Database\Factories;

use App\Models\Announcement;
use App\Models\Condominium;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AnnouncementFactory extends Factory
{
    protected $model = Announcement::class;

    public function definition(): array
    {
        $announcements = [
            [
                'title' => 'Corte programado de agua por mantención de bombas',
                'content' => 'Estimados copropietarios, les informamos que el próximo jueves se realizará una mantención preventiva a las bombas de agua del edificio, por lo cual se suspenderá el servicio temporalmente entre las 14:00 y las 17:00 horas. Agradecemos tomar las precauciones necesarias.',
                'priority' => 'high',
            ],
            [
                'title' => 'Asamblea General Ordinaria de Copropietarios',
                'content' => 'Se cita a todos los residentes a la primera asamblea ordinaria del año, que se llevará a cabo en la sala multiuso el día sábado 10 de junio a las 18:30 horas. Trataremos el balance financiero del último periodo y la elección del nuevo comité de administración.',
                'priority' => 'high',
            ],
            [
                'title' => 'Recordatorio sobre el uso de estacionamientos de visitas',
                'content' => 'Les recordamos a todos los residentes que los estacionamientos de visitas son de uso exclusivo para visitas por un periodo máximo de 4 horas continuas. Los vehículos que excedan este tiempo o correspondan a residentes serán sancionados según el reglamento.',
                'priority' => 'normal',
            ],
            [
                'title' => 'Mantención mensual de ascensores e infraestructura',
                'content' => 'Durante el día de mañana, la empresa Schindler realizará la mantención mensual preventiva a los ascensores de la torre A. El servicio funcionará con un solo ascensor de manera alternada entre las 09:00 y las 13:00 horas. Agradecemos su paciencia.',
                'priority' => 'low',
            ],
            [
                'title' => 'Fumigación general de áreas comunes',
                'content' => 'Les informamos que se realizará un proceso de sanitización y fumigación preventiva en estacionamientos, pasillos, bodegas y salas comunes el próximo viernes a contar de las 10:00 AM. Recomendamos mantener las ventanas cerradas durante el proceso.',
                'priority' => 'normal',
            ],
        ];

        $selected = fake()->randomElement($announcements);
        $published = fake()->dateTimeBetween('-1 month', 'now');
        $expires = clone $published;
        $expires->modify('+7 days');

        return [
            'condominium_id' => Condominium::factory(),
            'created_by' => User::factory(),
            'title' => $selected['title'],
            'content' => $selected['content'],
            'priority' => $selected['priority'],
            'published_at' => $published->format('Y-m-d H:i:s'),
            'expires_at' => $expires->format('Y-m-d H:i:s'),
        ];
    }
}
