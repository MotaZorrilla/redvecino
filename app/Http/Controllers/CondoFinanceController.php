<?php

namespace App\Http\Controllers;

use App\Models\CondoIncome;
use App\Models\CondoExpense;
use App\Models\CommonExpense;
use App\Models\ExpenseItem;
use App\Models\Condominium;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CondoFinanceController extends Controller
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

    public function catalog(Request $request)
    {
        return response()->json(self::FINANCIAL_CATALOG);
    }

    public function summary(Request $request)
    {
        $request->validate(['condominium_id' => 'required|exists:condominiums,id']);

        $condoId = $request->condominium_id;

        $totalIncomes = CondoIncome::where('condominium_id', $condoId)->sum('amount');
        $totalExpenses = CondoExpense::where('condominium_id', $condoId)->sum('amount');

        $incomesByCategory = CondoIncome::where('condominium_id', $condoId)
            ->selectRaw('category, SUM(amount) as total')
            ->groupBy('category')
            ->pluck('total', 'category');

        $expensesByCategory = CondoExpense::where('condominium_id', $condoId)
            ->selectRaw('category, SUM(amount) as total')
            ->groupBy('category')
            ->pluck('total', 'category');

        return response()->json([
            'total_incomes' => (float) $totalIncomes,
            'total_expenses' => (float) $totalExpenses,
            'balance' => (float) $totalIncomes - (float) $totalExpenses,
            'incomes_by_category' => $incomesByCategory,
            'expenses_by_category' => $expensesByCategory,
        ]);
    }

    // ─── INCOMES CRUD ────────────────────────────────────────

    public function indexIncomes(Request $request)
    {
        $request->validate(['condominium_id' => 'required|exists:condominiums,id']);

        return CondoIncome::with(['property', 'user'])
            ->where('condominium_id', $request->condominium_id)
            ->orderBy('date', 'desc')
            ->paginate(20);
    }

    public function storeIncome(Request $request)
    {
        $catalog = self::FINANCIAL_CATALOG['incomes'];
        $categoriesKeys = implode(',', array_keys($catalog));

        $data = $request->validate([
            'condominium_id' => 'required|exists:condominiums,id',
            'category' => 'required|string|in:' . $categoriesKeys,
            'subcategory' => [
                'nullable',
                'string',
                function ($attribute, $value, $fail) use ($request, $catalog) {
                    $cat = $request->category;
                    if (isset($catalog[$cat]) && !empty($catalog[$cat]['subcategories'])) {
                        if (!in_array($value, $catalog[$cat]['subcategories'])) {
                            $fail("La subcategoría seleccionada no es válida para la categoría {$catalog[$cat]['label']}.");
                        }
                    }
                }
            ],
            'amount' => 'required|numeric|min:0.01',
            'date' => 'required|date',
            'description' => 'nullable|string',
            'property_id' => 'nullable|exists:properties,id',
            'user_id' => 'nullable|exists:users,id',
        ]);

        return CondoIncome::create($data);
    }

    public function updateIncome(Request $request, $id)
    {
        $income = CondoIncome::findOrFail($id);

        $catalog = self::FINANCIAL_CATALOG['incomes'];
        $categoriesKeys = implode(',', array_keys($catalog));

        $data = $request->validate([
            'category' => 'required|string|in:' . $categoriesKeys,
            'subcategory' => [
                'nullable',
                'string',
                function ($attribute, $value, $fail) use ($request, $catalog) {
                    $cat = $request->category;
                    if (isset($catalog[$cat]) && !empty($catalog[$cat]['subcategories'])) {
                        if (!in_array($value, $catalog[$cat]['subcategories'])) {
                            $fail("La subcategoría seleccionada no es válida para la categoría {$catalog[$cat]['label']}.");
                        }
                    }
                }
            ],
            'amount' => 'required|numeric|min:0.01',
            'date' => 'required|date',
            'description' => 'nullable|string',
            'property_id' => 'nullable|exists:properties,id',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $income->update($data);
        return $income;
    }

    public function destroyIncome($id)
    {
        $income = CondoIncome::findOrFail($id);
        $income->delete();
        return response()->json(['message' => 'Ingreso eliminado correctamente.']);
    }

    // ─── EXPENSES CRUD ───────────────────────────────────────

    public function indexExpenses(Request $request)
    {
        $request->validate(['condominium_id' => 'required|exists:condominiums,id']);

        return CondoExpense::with(['property', 'user', 'commonExpense'])
            ->where('condominium_id', $request->condominium_id)
            ->orderBy('date', 'desc')
            ->paginate(20);
    }

    public function storeExpense(Request $request)
    {
        $catalog = self::FINANCIAL_CATALOG['expenses'];
        $categoriesKeys = implode(',', array_keys($catalog));

        $data = $request->validate([
            'condominium_id' => 'required|exists:condominiums,id',
            'category' => 'required|string|in:' . $categoriesKeys,
            'subcategory' => [
                'nullable',
                'string',
                function ($attribute, $value, $fail) use ($request, $catalog) {
                    $cat = $request->category;
                    if (isset($catalog[$cat]) && !empty($catalog[$cat]['subcategories'])) {
                        if (!in_array($value, $catalog[$cat]['subcategories'])) {
                            $fail("La subcategoría seleccionada no es válida para la categoría {$catalog[$cat]['label']}.");
                        }
                    }
                }
            ],
            'amount' => 'required|numeric|min:0.01',
            'date' => 'required|date',
            'description' => 'nullable|string',
            'property_id' => 'nullable|exists:properties,id',
            'user_id' => 'nullable|exists:users,id',
        ]);

        return DB::transaction(function () use ($data, $request) {
            // Sync with CommonExpense / ExpenseItem
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

            // Recalculate CommonExpense total
            $total = ExpenseItem::where('common_expense_id', $commonExpense->id)->sum('amount');
            $commonExpense->update(['amount' => $total]);

            $data['common_expense_id'] = $commonExpense->id;
            $data['expense_item_id'] = $expenseItem->id;

            return CondoExpense::create($data);
        });
    }

    public function updateExpense(Request $request, $id)
    {
        $condoExpense = CondoExpense::findOrFail($id);

        $catalog = self::FINANCIAL_CATALOG['expenses'];
        $categoriesKeys = implode(',', array_keys($catalog));

        $data = $request->validate([
            'category' => 'required|string|in:' . $categoriesKeys,
            'subcategory' => [
                'nullable',
                'string',
                function ($attribute, $value, $fail) use ($request, $catalog) {
                    $cat = $request->category;
                    if (isset($catalog[$cat]) && !empty($catalog[$cat]['subcategories'])) {
                        if (!in_array($value, $catalog[$cat]['subcategories'])) {
                            $fail("La subcategoría seleccionada no es válida para la categoría {$catalog[$cat]['label']}.");
                        }
                    }
                }
            ],
            'amount' => 'required|numeric|min:0.01',
            'date' => 'required|date',
            'description' => 'nullable|string',
            'property_id' => 'nullable|exists:properties,id',
            'user_id' => 'nullable|exists:users,id',
        ]);

        return DB::transaction(function () use ($condoExpense, $data) {
            $condoExpense->update($data);

            // Sync ExpenseItem if linked
            if ($condoExpense->expense_item_id) {
                $expenseItem = ExpenseItem::find($condoExpense->expense_item_id);
                if ($expenseItem) {
                    $expenseItem->update([
                        'category' => $data['category'],
                        'description' => $data['description'] ?? $data['subcategory'] ?? $data['category'],
                        'amount' => $data['amount'],
                    ]);

                    // Recalculate parent CommonExpense total
                    if ($condoExpense->common_expense_id) {
                        $total = ExpenseItem::where('common_expense_id', $condoExpense->common_expense_id)->sum('amount');
                        CommonExpense::where('id', $condoExpense->common_expense_id)->update(['amount' => $total]);
                    }
                }
            }

            return $condoExpense->fresh();
        });
    }

    public function destroyExpense($id)
    {
        $condoExpense = CondoExpense::findOrFail($id);

        DB::transaction(function () use ($condoExpense) {
            $commonExpenseId = $condoExpense->common_expense_id;

            // Delete linked ExpenseItem
            if ($condoExpense->expense_item_id) {
                ExpenseItem::where('id', $condoExpense->expense_item_id)->delete();
            }

            $condoExpense->delete();

            // Recalculate CommonExpense total
            if ($commonExpenseId) {
                $total = ExpenseItem::where('common_expense_id', $commonExpenseId)->sum('amount');
                CommonExpense::where('id', $commonExpenseId)->update(['amount' => $total]);
            }
        });

        return response()->json(['message' => 'Egreso eliminado correctamente.']);
    }

    // ─── HELPERS ─────────────────────────────────────────────

    private function dateToPeriod($date)
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
