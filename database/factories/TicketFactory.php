<?php

namespace Database\Factories;

use App\Models\Ticket;
use App\Models\Property;
use App\Models\User;
use App\Models\TicketCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

class TicketFactory extends Factory
{
    protected $model = Ticket::class;

    public function definition(): array
    {
        $tickets = [
            [
                'title' => 'Filtración activa en baño principal de departamento',
                'description' => 'Desde hace dos días se observa humedad constante y gotas en el techo del baño principal, justo abajo del desagüe del piso superior. Solicitamos revisión urgente para evitar daños mayores en el cielo falso de yeso-cartón.',
                'priority' => 'high',
            ],
            [
                'title' => 'Citófono no emite sonido ni abre portón de acceso',
                'description' => 'Al llamar desde la conserjería al departamento, el citófono interno suena extremadamente bajo y el botón de apertura remota del portón peatonal no responde. Se solicita mantención eléctrica.',
                'priority' => 'medium',
            ],
            [
                'title' => 'Ampolleta quemada en pasillo del piso 4, Torre B',
                'description' => 'La luminaria LED del pasillo común del cuarto piso, justo frente a la salida del ascensor izquierdo, se encuentra totalmente quemada. El área queda muy oscura en horario nocturno.',
                'priority' => 'low',
            ],
            [
                'title' => 'Falla en el resorte de cierre de la puerta peatonal de acceso',
                'description' => 'La puerta peatonal de acceso principal al condominio no está cerrando de forma autónoma. El brazo hidráulico parece haber perdido presión, permitiendo que la puerta quede abierta de par en par.',
                'priority' => 'high',
            ],
            [
                'title' => 'Portón vehicular del estacionamiento subterráneo atascado',
                'description' => 'El portón automático del subterráneo -1 hace un ruido extraño y se detiene a mitad de camino al abrirse con el control remoto. Se requiere soporte técnico urgente de la empresa contratista.',
                'priority' => 'critical',
            ],
            [
                'title' => 'Filtración en llave de paso de la cocina comercial / conserjería',
                'description' => 'La llave de paso principal debajo del lavaplatos de conserjería gotea continuamente. Ya se colocó un balde pero se llena cada pocas horas.',
                'priority' => 'medium',
            ],
        ];

        $selected = fake()->randomElement($tickets);
        $status = fake()->randomElement(['open', 'in_progress', 'resolved', 'closed']);
        
        $resolvedAt = null;
        $resolutionNotes = null;
        if (in_array($status, ['resolved', 'closed'])) {
            $resolvedAt = fake()->dateTimeBetween('-15 days', 'now');
            $resolutionNotes = 'Revisión y solución aplicada por el personal técnico. Se realizaron pruebas de funcionamiento satisfactorias en presencia del residente.';
        }

        return [
            'property_id' => Property::factory(),
            'created_by' => User::factory(),
            'assigned_to' => null, // Will be set in Seeder to link to realistic Colaboradores
            'category_id' => function () {
                return TicketCategory::inRandomOrder()->first()?->id ?? TicketCategory::create([
                    'name' => 'General',
                    'description' => 'Categoría por defecto para incidencias comunes.',
                ])->id;
            },
            'title' => $selected['title'],
            'description' => $selected['description'],
            'priority' => $selected['priority'],
            'status' => $status,
            'resolved_at' => $resolvedAt,
            'resolution_notes' => $resolutionNotes,
        ];
    }
}
