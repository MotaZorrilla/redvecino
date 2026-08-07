<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Condominium;
use App\Models\CommonExpense;
use App\Models\Property;
use App\Models\OwnerProfile;
use App\Models\Payment;
use App\Models\CondoIncome;
use App\Models\CondoExpense;
use App\Models\User;

class CommonExpensePeriodSeeder extends Seeder
{
    public function run(): void
    {
        $anchorYear = config('demo.anchor_year');
        $condos = Condominium::all();
        if ($condos->isEmpty()) return;

        $methods = ['transferencia', 'tarjeta_debito', 'webpay', 'tarjeta_credito', 'efectivo'];

        foreach ($condos as $condo) {
            $anchorYear = config('demo.anchor_year');
            // 1. Create or get Period (anchorYear - 1) - 06
            $periodJun = CommonExpense::firstOrCreate([
                'condominium_id' => $condo->id,
                'period' => ($anchorYear - 1) . '-06',
            ], [
                'amount' => 4500000,
                'due_date' => ($anchorYear - 1) . '-06-10',
                'description' => "Gasto común mes de Junio " . ($anchorYear - 1),
                'status' => 'published',
            ]);

            // 2. Create or get Period (anchorYear - 1) - 07
            $periodJul = CommonExpense::firstOrCreate([
                'condominium_id' => $condo->id,
                'period' => ($anchorYear - 1) . '-07',
            ], [
                'amount' => 4800000,
                'due_date' => ($anchorYear - 1) . '-07-10',
                'description' => "Gasto común mes de Julio " . ($anchorYear - 1),
                'status' => 'published',
            ]);

            // 3. Create or get Period anchorYear - 08 (Current)
            $periodAug = CommonExpense::firstOrCreate([
                'condominium_id' => $condo->id,
                'period' => $anchorYear . '-08',
            ], [
                'amount' => 5200000,
                'due_date' => $anchorYear . '-08-10',
                'description' => "Gasto común mes de Agosto $anchorYear",
                'status' => 'published',
            ]);

            // Get properties for this condo
            $properties = Property::where('condominium_id', $condo->id)->get();

            // Seed payments with DIVERSE STATUSES for Period (anchorYear - 1)-07 and anchorYear-08
            foreach ($properties->take(12) as $index => $property) {
                $ownerProfile = OwnerProfile::where('property_id', $property->id)->first();
                $userId = $ownerProfile ? $ownerProfile->user_id : User::role('Propietario')->inRandomOrder()->first()?->id;
                if (!$userId) continue;

                $aliquotJul = round(4800000 * (($ownerProfile->ownership_percentage ?? 4.5) / 100.0), 0);
                $aliquotAug = round(5200000 * (($ownerProfile->ownership_percentage ?? 4.5) / 100.0), 0);

                // Payment for July (anchorYear - 1) (Mostly approved)
                $payJulDate = ($anchorYear - 1) . '-07-' . sprintf("%02d", 5 + ($index % 20));
                $statusJul = ($index === 11) ? 'pending' : 'approved';
                
                $payJul = Payment::firstOrCreate([
                    'property_id' => $property->id,
                    'common_expense_id' => $periodJul->id,
                ], [
                    'user_id' => $userId,
                    'amount' => $aliquotJul,
                    'payment_date' => $payJulDate,
                    'payment_method' => $methods[$index % count($methods)],
                    'reference' => 'TXN-' . ($anchorYear - 1) . '07-' . str_pad($property->id * 17 + $index, 5, '0', STR_PAD_LEFT),
                    'status' => $statusJul,
                    'created_at' => \Illuminate\Support\Carbon::parse($payJulDate),
                    'updated_at' => \Illuminate\Support\Carbon::parse($payJulDate),
                ]);

                // Create corresponding CondoIncome for July ONLY if approved
                if ($statusJul === 'approved') {
                    CondoIncome::firstOrCreate([
                        'property_id' => $property->id,
                        'date' => $payJulDate,
                        'category' => 'gastos_comunes',
                    ], [
                        'condominium_id' => $condo->id,
                        'subcategory' => 'Pago Gasto Común - ' . ($anchorYear - 1) . '-07',
                        'amount' => $aliquotJul,
                        'description' => 'Recaudación Gasto Común Depto ' . $property->number . ' (Ref: ' . $payJul->reference . ')',
                        'user_id' => $userId,
                    ]);
                }

                // Payments for August anchorYear (DIVERSE STATUSES: Approved, Pending, Failed)
                $payAugDate = $anchorYear . '-08-' . sprintf("%02d", 1 + ($index % 5));
                
                // Status distribution:
                // 0..4: approved
                // 5..7: pending
                // 8..9: failed (rechazado / comprobante ilegible)
                // 10..11: approved
                $statusAug = 'approved';
                if ($index >= 5 && $index <= 7) {
                    $statusAug = 'pending';
                } elseif ($index >= 8 && $index <= 9) {
                    $statusAug = 'failed';
                }

                $payAug = Payment::firstOrCreate([
                    'property_id' => $property->id,
                    'common_expense_id' => $periodAug->id,
                ], [
                    'user_id' => $userId,
                    'amount' => $aliquotAug,
                    'payment_date' => $payAugDate,
                    'payment_method' => $methods[($index + 1) % count($methods)],
                    'reference' => 'TXN-' . $anchorYear . '08-' . str_pad($property->id * 23 + $index, 5, '0', STR_PAD_LEFT),
                    'status' => $statusAug,
                    'created_at' => \Illuminate\Support\Carbon::parse($payAugDate),
                    'updated_at' => \Illuminate\Support\Carbon::parse($payAugDate),
                ]);

                // Sync approved payments with CondoIncome for August anchorYear
                if ($statusAug === 'approved') {
                    CondoIncome::firstOrCreate([
                        'property_id' => $property->id,
                        'date' => $payAugDate,
                        'category' => 'gastos_comunes',
                    ], [
                        'condominium_id' => $condo->id,
                        'subcategory' => 'Pago Gasto Común - ' . $anchorYear . '-08',
                        'amount' => $aliquotAug,
                        'description' => 'Recaudación Gasto Común Depto ' . $property->number . ' (Ref: ' . $payAug->reference . ')',
                        'user_id' => $userId,
                    ]);
                }
            }

            // 4. Seed CondoExpense records FOR ALL 10 CATEGORIES (No zeros!)
            if ($properties->count() >= 2) {
                $prop1 = $properties[0];
                $prop2 = $properties[1];
                $owner1 = OwnerProfile::where('property_id', $prop1->id)->first()?->user_id;
                $owner2 = OwnerProfile::where('property_id', $prop2->id)->first()?->user_id;

                $expensesData = [
                    [
                        'category' => 'personal',
                        'subcategory' => 'Conserjes',
                        'amount' => 1850000,
                        'date' => $anchorYear . '-08-01',
                        'description' => 'Pago de remuneraciones y cotizaciones previsionales turnos de conserjería',
                        'distributable_method' => 'prorated',
                        'property_id' => null,
                        'user_id' => null,
                    ],
                    [
                        'category' => 'servicios_basicos',
                        'subcategory' => 'Electricidad',
                        'amount' => 620000,
                        'date' => $anchorYear . '-08-02',
                        'description' => 'Factura Enel N° 849204 - Consumo espacios comunes y salas de bombas',
                        'distributable_method' => 'prorated',
                        'property_id' => null,
                        'user_id' => null,
                    ],
                    [
                        'category' => 'mantencion',
                        'subcategory' => 'Ascensores',
                        'amount' => 410000,
                        'date' => $anchorYear . '-08-03',
                        'description' => 'Contrato mensual mantención preventiva ascensores Schindler',
                        'distributable_method' => 'prorated',
                        'property_id' => null,
                        'user_id' => null,
                    ],
                    [
                        'category' => 'seguridad',
                        'subcategory' => 'CCTV',
                        'amount' => 280000,
                        'date' => $anchorYear . '-08-03',
                        'description' => 'Monitoreo de cámaras de seguridad 24/7 y servicio de alarma perimetral',
                        'distributable_method' => 'prorated',
                        'property_id' => null,
                        'user_id' => null,
                    ],
                    [
                        'category' => 'limpieza',
                        'subcategory' => 'Productos de limpieza',
                        'amount' => 95000,
                        'date' => $anchorYear . '-08-04',
                        'description' => 'Compra de insumos químicos de aseo, desinfectantes y sanitización de pasillos',
                        'distributable_method' => 'prorated',
                        'property_id' => null,
                        'user_id' => null,
                    ],
                    [
                        'category' => 'reparacion',
                        'subcategory' => 'Iluminación',
                        'amount' => 140000,
                        'date' => $anchorYear . '-08-04',
                        'description' => 'Reemplazo de focos LED en estacionamientos subterráneos y reparación cañería Depto ' . $prop1->number,
                        'distributable_method' => 'unit_specific',
                        'property_id' => $prop1->id,
                        'user_id' => $owner1,
                    ],
                    [
                        'category' => 'seguros',
                        'subcategory' => 'Incendio',
                        'amount' => 320000,
                        'date' => $anchorYear . '-08-05',
                        'description' => 'Prima mensual póliza colectiva de seguro contra incendio y sismos edificio',
                        'distributable_method' => 'prorated',
                        'property_id' => null,
                        'user_id' => null,
                    ],
                    [
                        'category' => 'administracion',
                        'subcategory' => 'Software',
                        'amount' => 450000,
                        'date' => $anchorYear . '-08-05',
                        'description' => 'Honorarios de administración externa y licencia plataforma RedVecino & MiVecino',
                        'distributable_method' => 'prorated',
                        'property_id' => null,
                        'user_id' => null,
                    ],
                    [
                        'category' => 'fondo_reserva',
                        'subcategory' => 'Emergencias',
                        'amount' => 245000,
                        'date' => $anchorYear . '-08-06',
                        'description' => 'Aporte legal al Fondo de Reserva (5% sobre la recaudación base del período)',
                        'distributable_method' => 'prorated',
                        'property_id' => null,
                        'user_id' => null,
                    ],
                    [
                        'category' => 'otro',
                        'subcategory' => 'Gastos Bancarios',
                        'amount' => 35000,
                        'date' => $anchorYear . '-08-06',
                        'description' => 'Comisiones por transferencias interbancarias y manutención cuenta corriente',
                        'distributable_method' => 'prorated',
                        'property_id' => null,
                        'user_id' => null,
                    ],
                ];

                foreach ($expensesData as $exp) {
                    CondoExpense::firstOrCreate([
                        'condominium_id' => $condo->id,
                        'description' => $exp['description'],
                    ], [
                        'category' => $exp['category'],
                        'subcategory' => $exp['subcategory'],
                        'amount' => $exp['amount'],
                        'date' => $exp['date'],
                        'distributable_method' => $exp['distributable_method'],
                        'property_id' => $exp['property_id'],
                        'user_id' => $exp['user_id'],
                    ]);
                }

                // 5. Seed diverse CondoIncome categories (Multas, Arriendos, Intereses, Cuotas Extra, Publicidad)
                $additionalIncomes = [
                    [
                        'category' => 'arriendo_espacios',
                        'subcategory' => 'Quinchos',
                        'amount' => 25000,
                        'date' => $anchorYear . '-08-04',
                        'description' => 'Reserva y uso de Quincho N°1 por evento familiar Depto ' . $prop1->number,
                        'distributable_method' => 'unit_specific',
                        'property_id' => $prop1->id,
                        'user_id' => $owner1,
                    ],
                    [
                        'category' => 'arriendo_espacios',
                        'subcategory' => 'Salón de eventos',
                        'amount' => 45000,
                        'date' => $anchorYear . '-08-03',
                        'description' => 'Arriendo Sala Multiuso para cumpleaños de residente Depto ' . $prop2->number,
                        'distributable_method' => 'unit_specific',
                        'property_id' => $prop2->id,
                        'user_id' => $owner2,
                    ],
                    [
                        'category' => 'multas',
                        'subcategory' => 'Ruidos molestos',
                        'amount' => 35000,
                        'date' => $anchorYear . '-08-02',
                        'description' => 'Cobro de sanción por música alta fuera de horario permitido en Depto ' . $prop1->number,
                        'distributable_method' => 'unit_specific',
                        'property_id' => $prop1->id,
                        'user_id' => $owner1,
                    ],
                    [
                        'category' => 'multas',
                        'subcategory' => 'Estacionamientos indebidos',
                        'amount' => 45000,
                        'date' => $anchorYear . '-08-01',
                        'description' => 'Sanción por ocupar estacionamiento de visitas sin pase en Depto ' . $prop2->number,
                        'distributable_method' => 'unit_specific',
                        'property_id' => $prop2->id,
                        'user_id' => $owner2,
                    ],
                    [
                        'category' => 'multas',
                        'subcategory' => 'Problemas con mascotas',
                        'amount' => 25000,
                        'date' => $anchorYear . '-08-05',
                        'description' => 'Multa por tránsito de mascota sin arnés en espacios comunes Depto ' . $prop1->number,
                        'distributable_method' => 'unit_specific',
                        'property_id' => $prop1->id,
                        'user_id' => $owner1,
                    ],
                    [
                        'category' => 'intereses_mora',
                        'subcategory' => 'Gastos Comunes',
                        'amount' => 12500,
                        'date' => $anchorYear . '-08-04',
                        'description' => 'Interés acumulado por mora de 15 días en aviso de cobro',
                        'distributable_method' => 'unit_specific',
                        'property_id' => $prop1->id,
                        'user_id' => $owner1,
                    ],
                    [
                        'category' => 'cuotas_extraordinarias',
                        'subcategory' => 'Emergencias',
                        'amount' => 190000,
                        'date' => $anchorYear . '-08-03',
                        'description' => 'Cuota extraordinaria para reparación urgente de bomba de agua subterránea',
                        'distributable_method' => 'prorated',
                        'property_id' => null,
                        'user_id' => null,
                    ],
                    [
                        'category' => 'publicidad_convenio',
                        'subcategory' => 'Convenios con empresas',
                        'amount' => 85000,
                        'date' => $anchorYear . '-08-02',
                        'description' => 'Convenio mensual con empresa de máquinas expendedoras de café',
                        'distributable_method' => 'prorated',
                        'property_id' => null,
                        'user_id' => null,
                    ],
                ];

                foreach ($additionalIncomes as $inc) {
                    CondoIncome::firstOrCreate([
                        'condominium_id' => $condo->id,
                        'description' => $inc['description'],
                    ], [
                        'category' => $inc['category'],
                        'subcategory' => $inc['subcategory'],
                        'amount' => $inc['amount'],
                        'date' => $inc['date'],
                        'distributable_method' => $inc['distributable_method'],
                        'property_id' => $inc['property_id'],
                        'user_id' => $inc['user_id'],
                    ]);
                }
            }
        }
    }
}
