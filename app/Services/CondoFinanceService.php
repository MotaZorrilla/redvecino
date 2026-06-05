<?php

namespace App\Services;

use App\Models\CondoIncome;
use App\Models\CondoExpense;
use App\Models\CommonExpense;
use App\Models\ExpenseItem;
use Illuminate\Support\Facades\DB;

class CondoFinanceService
{
    private const FINANCIAL_CATALOG = [
        'incomes' => [
            'gastos_comunes' => [
                'label' => 'Gastos Comunes',
                'subcategories' => []
            ],
            'multas' => [
                'label' => 'Multas',
                'subcategories' => [
                    'Ruidos molestos',
                    'Mal uso de áreas comunes',
                    'Estacionamientos indebidos',
                    'Malos olores',
                    'Problemas con mascotas',
                    'Actividades fuera de horario',
                    'Incumplimiento de normas del reglamento'
                ]
            ],
            'arriendo_espacios' => [
                'label' => 'Arriendos de Espacios Comunes',
                'subcategories' => [
                    'Quinchos',
                    'Salón de eventos',
                    'Canchas',
                    'Estacionamientos de visita'
                ]
            ],
            'intereses_mora' => [
                'label' => 'Intereses por Mora',
                'subcategories' => [
                    'Gastos Comunes',
                    'Multas',
                    'Otros'
                ]
            ],
            'cuotas_extraordinarias' => [
                'label' => 'Cuotas Extraordinarias',
                'subcategories' => [
                    'Reparaciones mayores',
                    'Mejoras',
                    'Emergencias'
                ]
            ],
            'publicidad_convenio' => [
                'label' => 'Publicidad o Convenios',
                'subcategories' => [
                    'Máquinas expendedoras',
                    'Antenas',
                    'Publicidad interna',
                    'Convenios con empresas'
                ]
            ],
            'otro' => [
                'label' => 'Otros Ingresos',
                'subcategories' => []
            ]
        ],
        'expenses' => [
            'personal' => [
                'label' => 'Sueldos y Honorarios',
                'subcategories' => [
                    'Conserjes',
                    'Personal de aseo',
                    'Jardineros',
                    'Administrador',
                    'Técnicos externos'
                ]
            ],
            'servicios_basicos' => [
                'label' => 'Servicios Básicos',
                'subcategories' => [
                    'Agua',
                    'Electricidad',
                    'Gas',
                    'Internet',
                    'Telefonía'
                ]
            ],
            'mantencion' => [
                'label' => 'Mantención',
                'subcategories' => [
                    'Ascensores',
                    'Bombas de agua',
                    'Portones eléctricos',
                    'Cámaras de seguridad',
                    'Jardines'
                ]
            ],
            'seguridad' => [
                'label' => 'Seguridad',
                'subcategories' => [
                    'Guardias',
                    'CCTV',
                    'Alarmas',
                    'Control de acceso'
                ]
            ],
            'limpieza' => [
                'label' => 'Limpieza y Aseo',
                'subcategories' => [
                    'Productos de limpieza',
                    'Bolsas de basura',
                    'Implementos de aseo'
                ]
            ],
            'reparacion' => [
                'label' => 'Reparaciones',
                'subcategories' => [
                    'Cañerías',
                    'Techos',
                    'Iluminación',
                    'Infraestructura común'
                ]
            ],
            'seguros' => [
                'label' => 'Seguros',
                'subcategories' => [
                    'Incendio',
                    'Responsabilidad civil',
                    'Equipos'
                ]
            ],
            'administracion' => [
                'label' => 'Gastos Administrativos',
                'subcategories' => [
                    'Papelería',
                    'Software',
                    'Bancos',
                    'Contabilidad',
                    'Impresiones'
                ]
            ],
            'fondo_reserva' => [
                'label' => 'Fondo de Reserva',
                'subcategories' => [
                    'Emergencias',
                    'Proyectos futuros'
                ]
            ],
            'otro' => [
                'label' => 'Otros Egresos',
                'subcategories' => []
            ]
        ]
    ];

    public function getCatalog(): array
    {
        return self::FINANCIAL_CATALOG;
    }

    public function getSummary(int $condominiumId): array
    {
        $totalIncomes = CondoIncome::where('condominium_id', $condominiumId)->sum('amount');
        $totalExpenses = CondoExpense::where('condominium_id', $condominiumId)->sum('amount');

        $incomesByCategory = CondoIncome::where('condominium_id', $condominiumId)
            ->selectRaw('category, SUM(amount) as total')
            ->groupBy('category')
            ->pluck('total', 'category');

        $expensesByCategory = CondoExpense::where('condominium_id', $condominiumId)
            ->selectRaw('category, SUM(amount) as total')
            ->groupBy('category')
            ->pluck('total', 'category');

        return [
            'total_incomes' => (float) $totalIncomes,
            'total_expenses' => (float) $totalExpenses,
            'balance' => (float) $totalIncomes - (float) $totalExpenses,
            'incomes_by_category' => $incomesByCategory,
            'expenses_by_category' => $expensesByCategory,
        ];
    }

    public function getIncomes(array $filters)
    {
        return CondoIncome::with(['property', 'user'])
            ->where('condominium_id', $filters['condominium_id'])
            ->orderBy('date', 'desc')
            ->paginate(20);
    }

    public function getExpenses(array $filters)
    {
        return CondoExpense::with(['property', 'user', 'commonExpense'])
            ->where('condominium_id', $filters['condominium_id'])
            ->orderBy('date', 'desc')
            ->paginate(20);
    }

    public function createIncome(array $data): CondoIncome
    {
        return CondoIncome::create($data);
    }

    public function updateIncome(CondoIncome $income, array $data): CondoIncome
    {
        $income->update($data);

        return $income;
    }

    public function deleteIncome(CondoIncome $income): void
    {
        $income->delete();
    }

    public function createExpense(array $data): CondoExpense
    {
        return DB::transaction(function () use ($data) {
            $period = $this->dateToPeriod($data['date']);
            $condoId = $data['condominium_id'];

            $commonExpense = CommonExpense::firstOrCreate(
                ['condominium_id' => $condoId, 'period' => $period],
                [
                    'amount' => 0,
                    'due_date' => $data['date'],
                    'status' => 'pending',
                ]
            );

            $expenseItem = ExpenseItem::create([
                'common_expense_id' => $commonExpense->id,
                'category' => $data['category'],
                'description' => $data['description'] ?? $data['subcategory'] ?? $data['category'],
                'amount' => $data['amount'],
            ]);

            $total = ExpenseItem::where('common_expense_id', $commonExpense->id)->sum('amount');
            $commonExpense->update(['amount' => $total]);

            $data['common_expense_id'] = $commonExpense->id;
            $data['expense_item_id'] = $expenseItem->id;

            return CondoExpense::create($data);
        });
    }

    public function updateExpense(CondoExpense $expense, array $data): CondoExpense
    {
        return DB::transaction(function () use ($expense, $data) {
            $expense->update($data);

            if ($expense->expense_item_id) {
                $expenseItem = ExpenseItem::find($expense->expense_item_id);
                if ($expenseItem) {
                    $expenseItem->update([
                        'category' => $data['category'],
                        'description' => $data['description'] ?? $data['subcategory'] ?? $data['category'],
                        'amount' => $data['amount'],
                    ]);

                    if ($expense->common_expense_id) {
                        $total = ExpenseItem::where('common_expense_id', $expense->common_expense_id)->sum('amount');
                        CommonExpense::where('id', $expense->common_expense_id)->update(['amount' => $total]);
                    }
                }
            }

            return $expense->fresh();
        });
    }

    public function deleteExpense(CondoExpense $expense): void
    {
        DB::transaction(function () use ($expense) {
            $commonExpenseId = $expense->common_expense_id;

            if ($expense->expense_item_id) {
                ExpenseItem::where('id', $expense->expense_item_id)->delete();
            }

            $expense->delete();

            if ($commonExpenseId) {
                $total = ExpenseItem::where('common_expense_id', $commonExpenseId)->sum('amount');
                CommonExpense::where('id', $commonExpenseId)->update(['amount' => $total]);
            }
        });
    }

    private function dateToPeriod(string $date): string
    {
        $months = [
            '01' => 'Enero', '02' => 'Febrero', '03' => 'Marzo',
            '04' => 'Abril', '05' => 'Mayo', '06' => 'Junio',
            '07' => 'Julio', '08' => 'Agosto', '09' => 'Septiembre',
            '10' => 'Octubre', '11' => 'Noviembre', '12' => 'Diciembre',
        ];
        $month = date('m', strtotime($date));
        $year = date('Y', strtotime($date));

        return $months[$month] . ' ' . $year;
    }
}
