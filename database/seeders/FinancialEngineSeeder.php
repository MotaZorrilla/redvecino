<?php

namespace Database\Seeders;

use App\Models\Condominium;
use App\Models\CommonExpense;
use App\Models\ExpenseItem;
use App\Models\Payment;
use App\Models\CondoIncome;
use App\Models\CondoExpense;
use App\Models\Property;
use App\Models\OwnerProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class FinancialEngineSeeder extends Seeder
{
    public function run(): void
    {
        $anchorYear = config('demo.anchor_year', date('Y'));
        $condos = Condominium::all();
        if ($condos->isEmpty()) return;

        $methods = ['transferencia', 'tarjeta_debito', 'webpay', 'tarjeta_credito', 'efectivo'];

        // Exhaustive catalog of Income Categories & Subcategories matching FinancialCatalogSeeder
        $incomeCatalog = [
            'gastos_comunes' => [
                'Pago Gasto Común Ordinario',
                'Recaudación Fondo Reserva (5%)',
                'Fondo de Pintura y Mantenimiento Fachada'
            ],
            'multas' => [
                'Multa por Ruidos Molestos > 02:00 AM',
                'Multa por Uso Indebido Estacionamiento Visitas',
                'Multa por Mascota en Áreas Comunes sin Correa',
                'Multa por Depósito de Escombros en Pasillo'
            ],
            'arriendo_espacios' => [
                'Reserva Quincho 1 con Terraza',
                'Reserva Salón de Eventos Principal',
                'Arriendo Cancha de Pádel Nocturna',
                'Reserva Quincho Panorámico Azotea'
            ],
            'intereses_mora' => [
                'Interés por Mora (1.5%) Deuda Vencida',
                'Recargo por Cobranza Extrajudicial',
                'Interés de Mora Período Anterior'
            ],
            'cuotas_extraordinarias' => [
                'Cuota Extraordinaria Pintura de Fachada',
                'Cuota Extraordinaria Recambio Ascensores',
                'Fondo de Emergencia Seguridad CCTV'
            ],
            'publicidad_convenio' => [
                'Convenio Antenas Teleco y Fibra Óptica',
                'Derecho de Publicidad Máquina Vending Conserjería',
                'Arriendo Espacio Totem Informativo Digital'
            ],
            'otro' => [
                'Venta de Control Remoto de Portón Extra',
                'Reembolso Seguro Espacios Comunes',
                'Ingreso Eventual Varios'
            ]
        ];

        // Exhaustive catalog of Expense Categories & Subcategories matching FinancialCatalogSeeder keys
        $expenseCatalog = [
            'personal' => [
                'Sueldos Personal de Conserjería y Turnos',
                'Honorarios Administración Externa',
                'Leyes Sociales (Fonasa, AFP, Seguro Cesantía)',
                'Bono Nocturno y Horas Extras Operarios'
            ],
            'servicios_basicos' => [
                'Consumo Eléctrico Iluminación Común y Escaleras',
                'Agua Potable Riego Jardines y Áreas Comunes',
                'Gas Centralizado para Agua Caliente / Caldera',
                'Enlace de Fibra Óptica Conserjería y CCTV'
            ],
            'mantencion' => [
                'Mantención Mensual Preventiva Ascensores',
                'Mantenimiento Portones Vehiculares Automáticos',
                'Mantención Sala de Bombas e Hidropack',
                'Limpieza e Inspección Periódica de Piscinas',
                'Servicio Técnico Grupo Electrógeno y Generadores'
            ],
            'seguridad' => [
                'Servicio Guardia de Seguridad Nocturna Privada',
                'Mantenimiento Circuito Cerrado CCTV y Cámaras',
                'Mantención Alarma Incendio y Extintores'
            ],
            'limpieza' => [
                'Insumos y Productos de Limpieza Químicos',
                'Bolsas de Basura Relleno Sanitario',
                'Implementos de Aseo Mops y Maquinaria'
            ],
            'reparacion' => [
                'Reparación Filtración Ducto Baño Común',
                'Cambio de Luminarias LED Pasillos y Subterráneo',
                'Reparación Brazo Hidráulico Acceso Peatonal',
                'Pintura y Reparación de Muros en Hall Acceso'
            ],
            'seguros' => [
                'Póliza Anual de Seguro Incendio Espacios Comunes',
                'Seguro de Responsabilidad Civil Copropiedad'
            ],
            'administracion' => [
                'Artículos de Oficina y Papelería Conserjería',
                'Servicios de Contabilidad y Auditoría Externos',
                'Comisiones Bancarias y Cartelas'
            ],
            'fondo_reserva' => [
                'Aporte Mensual Ahorro Fondo de Reserva (5%)',
                'Reserva Especial Contingencias Operativas'
            ],
            'otro' => [
                'Gasto Operativo Menor Varios',
                'Imprevisto Limpieza Canaletas Lluvia'
            ]
        ];

        $expenseCategoriesWeights = [
            ['category' => 'Seguridad', 'description' => 'Servicios de conserjería y vigilancia 24/7.', 'weight' => 0.35],
            ['category' => 'Aseo y Áreas Comunes', 'description' => 'Insumos de limpieza y aseo diario.', 'weight' => 0.20],
            ['category' => 'Administración', 'description' => 'Honorarios de administración externa.', 'weight' => 0.15],
            ['category' => 'Mantención Ascensores', 'description' => 'Contrato mensual y mantención preventiva.', 'weight' => 0.15],
            ['category' => 'Consumo Eléctrico', 'description' => 'Iluminación común y fuerza de bombas.', 'weight' => 0.15],
        ];

        $totalIncomesSeeded = 0;
        $totalExpensesSeeded = 0;

        foreach ($condos as $condo) {
            $properties = Property::where('condominium_id', $condo->id)->get();
            if ($properties->isEmpty()) continue;

            // 1. Seed 3 active billing periods per condo
            $periodsData = [
                ['period' => ($anchorYear - 1) . '-12', 'amount' => 4200000.00, 'status' => 'published'],
                ['period' => $anchorYear . '-01', 'amount' => 4500000.00, 'status' => 'published'],
                ['period' => $anchorYear . '-02', 'amount' => 4800000.00, 'status' => 'published'],
            ];

            foreach ($periodsData as $pData) {
                $dueDate = Carbon::parse($pData['period'] . '-10')->format('Y-m-d');
                $commonExpense = CommonExpense::firstOrCreate(
                    [
                        'condominium_id' => $condo->id,
                        'period' => $pData['period'],
                    ],
                    [
                        'amount' => $pData['amount'],
                        'due_date' => $dueDate,
                        'description' => "Gasto Común General mes de {$pData['period']}.",
                        'status' => $pData['status'],
                    ]
                );

                foreach ($expenseCategoriesWeights as $cat) {
                    ExpenseItem::firstOrCreate(
                        [
                            'common_expense_id' => $commonExpense->id,
                            'category' => $cat['category'],
                        ],
                        [
                            'description' => $cat['description'],
                            'amount' => round($pData['amount'] * $cat['weight'], 2),
                        ]
                    );
                }

                // Generate payments and receipts for all properties in condo
                foreach ($properties as $idx => $property) {
                    $ownerProfile = OwnerProfile::where('property_id', $property->id)->first();
                    $user = $ownerProfile ? User::find($ownerProfile->user_id) : User::role('Propietario')->inRandomOrder()->first();
                    if (!$user) continue;

                    $aliquot = round($pData['amount'] * ($property->coefficient ?? (1 / count($properties))), 2);
                    $isApproved = ($idx % 5 !== 0); // 80% approved, 20% pending
                    $paymentDate = $isApproved ? Carbon::parse($dueDate)->subDays(rand(1, 8))->format('Y-m-d') : null;

                    $payment = Payment::firstOrCreate(
                        [
                            'property_id' => $property->id,
                            'common_expense_id' => $commonExpense->id,
                        ],
                        [
                            'user_id' => $user->id,
                            'amount' => $aliquot,
                            'payment_date' => $paymentDate ?? now()->format('Y-m-d'),
                            'payment_method' => $methods[$idx % count($methods)],
                            'reference' => 'TXN-' . $pData['period'] . '-' . str_pad($property->id * 13 + $idx, 5, '0', STR_PAD_LEFT),
                            'status' => $isApproved ? 'approved' : 'pending',
                        ]
                    );

                    if ($isApproved) {
                        CondoIncome::firstOrCreate(
                            [
                                'property_id' => $property->id,
                                'date' => $paymentDate,
                                'subcategory' => 'Pago Gasto Común - ' . $pData['period'],
                            ],
                            [
                                'condominium_id' => $condo->id,
                                'category' => 'gastos_comunes',
                                'amount' => $aliquot,
                                'description' => 'Recaudación Gasto Común ' . $property->number . ' (Ref: ' . $payment->reference . ')',
                                'user_id' => $user->id,
                            ]
                        );
                        $totalIncomesSeeded++;
                    }
                }
            }

            // 2. Rich & Diverse Incomes Across ALL Categories (including cuotas_extraordinarias & otro)
            $months = ['01', '02', '03', '04', '05'];
            foreach ($incomeCatalog as $catKey => $subcats) {
                if ($catKey === 'gastos_comunes') continue; // Already generated via payments above

                foreach ($subcats as $subIndex => $subcatName) {
                    for ($m = 0; $m < count($months); $m++) {
                        $prop = $properties[($subIndex + $m + $condo->id) % count($properties)];
                        $owner = OwnerProfile::where('property_id', $prop->id)->first();
                        $user = $owner ? User::find($owner->user_id) : User::role('Propietario')->inRandomOrder()->first();

                        $amount = match ($catKey) {
                            'multas' => rand(35, 120) * 1000,
                            'arriendo_espacios' => rand(15, 60) * 1000,
                            'intereses_mora' => rand(5, 25) * 1000,
                            'cuotas_extraordinarias' => rand(50, 200) * 1000,
                            'publicidad_convenio' => rand(40, 150) * 1000,
                            'otro' => rand(10, 50) * 1000,
                            default => rand(20, 80) * 1000,
                        };

                        $dateStr = "{$anchorYear}-{$months[$m]}-" . str_pad(rand(1, 28), 2, '0', STR_PAD_LEFT);

                        CondoIncome::firstOrCreate(
                            [
                                'condominium_id' => $condo->id,
                                'category' => $catKey,
                                'subcategory' => $subcatName,
                                'date' => $dateStr,
                                'property_id' => $prop->id,
                            ],
                            [
                                'amount' => $amount,
                                'description' => "{$subcatName} - {$prop->number} ({$condo->name})",
                                'user_id' => $user?->id,
                            ]
                        );
                        $totalIncomesSeeded++;
                    }
                }
            }

            // 3. Rich & Diverse Expenses Across ALL Categories (matching DB keys: personal, servicios_basicos, mantencion, seguridad, limpieza, reparacion, seguros, administracion, fondo_reserva, otro)
            foreach ($expenseCatalog as $catKey => $subcats) {
                foreach ($subcats as $subIndex => $subcatName) {
                    for ($m = 0; $m < count($months); $m++) {
                        $amount = match ($catKey) {
                            'personal' => rand(450, 1800) * 1000,
                            'servicios_basicos' => rand(250, 950) * 1000,
                            'mantencion' => rand(120, 480) * 1000,
                            'seguridad' => rand(600, 2200) * 1000,
                            'limpieza' => rand(60, 250) * 1000,
                            'reparacion' => rand(80, 350) * 1000,
                            'seguros' => rand(150, 600) * 1000,
                            'administracion' => rand(45, 180) * 1000,
                            'fondo_reserva' => rand(200, 500) * 1000,
                            'otro' => rand(30, 120) * 1000,
                            default => rand(50, 200) * 1000,
                        };

                        $dateStr = "{$anchorYear}-{$months[$m]}-" . str_pad(rand(1, 28), 2, '0', STR_PAD_LEFT);

                        CondoExpense::firstOrCreate(
                            [
                                'condominium_id' => $condo->id,
                                'category' => $catKey,
                                'subcategory' => $subcatName,
                                'date' => $dateStr,
                            ],
                            [
                                'amount' => $amount,
                                'description' => "Factura / Pago: {$subcatName} - {$condo->name}",
                            ]
                        );
                        $totalExpensesSeeded++;
                    }
                }
            }
        }

        $this->command?->info("FinancialEngineSeeder: Fully seeded {$totalIncomesSeeded} incomes and {$totalExpensesSeeded} expenses across ALL 6 condominiums and ALL catalog categories.");
    }
}
