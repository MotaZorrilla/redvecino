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
        $data = $request->validate([
            'condominium_id' => 'required|exists:condominiums,id',
            'category' => 'required|string',
            'subcategory' => 'nullable|string',
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

        $data = $request->validate([
            'category' => 'required|string',
            'subcategory' => 'nullable|string',
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
        $data = $request->validate([
            'condominium_id' => 'required|exists:condominiums,id',
            'category' => 'required|string',
            'subcategory' => 'nullable|string',
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

        $data = $request->validate([
            'category' => 'required|string',
            'subcategory' => 'nullable|string',
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
