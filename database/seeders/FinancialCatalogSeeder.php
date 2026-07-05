<?php

namespace Database\Seeders;

use App\Models\FinancialCatalog;
use Illuminate\Database\Seeder;

class FinancialCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $catalog = [
            ['type' => 'income', 'category_key' => 'gastos_comunes', 'label' => 'Gastos Comunes', 'subcategories' => []],
            ['type' => 'income', 'category_key' => 'multas', 'label' => 'Multas', 'subcategories' => ['Ruidos molestos', 'Mal uso de áreas comunes', 'Estacionamientos indebidos', 'Malos olores', 'Problemas con mascotas', 'Actividades fuera de horario', 'Incumplimiento de normas del reglamento']],
            ['type' => 'income', 'category_key' => 'arriendo_espacios', 'label' => 'Arriendos de Espacios Comunes', 'subcategories' => ['Quinchos', 'Salón de eventos', 'Canchas', 'Estacionamientos de visita']],
            ['type' => 'income', 'category_key' => 'intereses_mora', 'label' => 'Intereses por Mora', 'subcategories' => ['Gastos Comunes', 'Multas', 'Otros']],
            ['type' => 'income', 'category_key' => 'cuotas_extraordinarias', 'label' => 'Cuotas Extraordinarias', 'subcategories' => ['Reparaciones mayores', 'Mejoras', 'Emergencias']],
            ['type' => 'income', 'category_key' => 'publicidad_convenio', 'label' => 'Publicidad o Convenios', 'subcategories' => ['Máquinas expendedoras', 'Antenas', 'Publicidad interna', 'Convenios con empresas']],
            ['type' => 'income', 'category_key' => 'otro', 'label' => 'Otros Ingresos', 'subcategories' => []],
            ['type' => 'expense', 'category_key' => 'personal', 'label' => 'Sueldos y Honorarios', 'subcategories' => ['Conserjes', 'Personal de aseo', 'Jardineros', 'Administrador', 'Técnicos externos']],
            ['type' => 'expense', 'category_key' => 'servicios_basicos', 'label' => 'Servicios Básicos', 'subcategories' => ['Agua', 'Electricidad', 'Gas', 'Internet', 'Telefonía']],
            ['type' => 'expense', 'category_key' => 'mantencion', 'label' => 'Mantención', 'subcategories' => ['Ascensores', 'Bombas de agua', 'Portones eléctricos', 'Cámaras de seguridad', 'Jardines']],
            ['type' => 'expense', 'category_key' => 'seguridad', 'label' => 'Seguridad', 'subcategories' => ['Guardias', 'CCTV', 'Alarmas', 'Control de acceso']],
            ['type' => 'expense', 'category_key' => 'limpieza', 'label' => 'Limpieza y Aseo', 'subcategories' => ['Productos de limpieza', 'Bolsas de basura', 'Implementos de aseo']],
            ['type' => 'expense', 'category_key' => 'reparacion', 'label' => 'Reparaciones', 'subcategories' => ['Cañerías', 'Techos', 'Iluminación', 'Infraestructura común']],
            ['type' => 'expense', 'category_key' => 'seguros', 'label' => 'Seguros', 'subcategories' => ['Incendio', 'Responsabilidad civil', 'Equipos']],
            ['type' => 'expense', 'category_key' => 'administracion', 'label' => 'Gastos Administrativos', 'subcategories' => ['Papelería', 'Software', 'Bancos', 'Contabilidad', 'Impresiones']],
            ['type' => 'expense', 'category_key' => 'fondo_reserva', 'label' => 'Fondo de Reserva', 'subcategories' => ['Emergencias', 'Proyectos futuros']],
            ['type' => 'expense', 'category_key' => 'otro', 'label' => 'Otros Egresos', 'subcategories' => []],
        ];

        foreach ($catalog as $item) {
            FinancialCatalog::create($item);
        }

        $this->command->info('Financial catalog seeded with ' . count($catalog) . ' entries.');
    }
}
