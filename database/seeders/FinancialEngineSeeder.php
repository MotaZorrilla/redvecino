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
        $expenseCategories = [
            ['category' => 'Seguridad', 'description' => 'Servicios de conserjería y vigilancia 24/7.', 'weight' => 0.40],
            ['category' => 'Aseo y Áreas Comunes', 'description' => 'Insumos de limpieza y aseo diario.', 'weight' => 0.25],
            ['category' => 'Administración', 'description' => 'Honorarios de administración externa.', 'weight' => 0.15],
            ['category' => 'Mantención Ascensores', 'description' => 'Contrato mensual Schindler y mantención.', 'weight' => 0.12],
            ['category' => 'Consumo Eléctrico', 'description' => 'Iluminación común y fuerza de bombas.', 'weight' => 0.08],
        ];

        foreach ($condos as $condo) {
            // Seed 3 active billing periods
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

                // Create Expense Items detailing allocation
                foreach ($expenseCategories as $cat) {
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
                $properties = Property::where('condominium_id', $condo->id)->get();
                foreach ($properties as $idx => $property) {
                    $ownerProfile = OwnerProfile::where('property_id', $property->id)->first();
                    $user = $ownerProfile ? User::find($ownerProfile->user_id) : User::role('Propietario')->inRandomOrder()->first();
                    if (!$user) continue;

                    $aliquot = round($pData['amount'] * ($property->coefficient ?? (1 / count($properties))), 2);
                    $isApproved = ($idx % 6 !== 0); // 85% approved, 15% pending
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

                    // If approved, seed directly into CondoIncome for real financial dashboard alignment
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
                    }
                }
            }

            // Additional Rich Financial Expenses & Incomes
            CondoExpense::firstOrCreate(
                [
                    'condominium_id' => $condo->id,
                    'description' => 'Honorarios Mensuales Empresa de Seguridad ' . $condo->name,
                ],
                [
                    'category' => 'seguridad',
                    'subcategory' => 'Guardias y Conserjería',
                    'amount' => 1800000.00,
                    'date' => $anchorYear . '-02-15',
                ]
            );

            CondoIncome::firstOrCreate(
                [
                    'condominium_id' => $condo->id,
                    'description' => 'Comisión Vending Machine Conserjería',
                ],
                [
                    'category' => 'publicidad_convenio',
                    'subcategory' => 'Máquinas expendedoras',
                    'amount' => 45000.00,
                    'date' => $anchorYear . '-02-20',
                ]
            );
        }

        $this->command?->info('FinancialEngineSeeder: Full financial ledgers, receipts, incomes and expenses seeded.');
    }
}
