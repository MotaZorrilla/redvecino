<?php

namespace App\Services;

use App\Models\CondoIncome;
use App\Models\CondoExpense;
use App\Models\CommonExpense;
use App\Models\ExpenseItem;
use App\Models\FinancialCatalog;
use Illuminate\Support\Facades\DB;

final class CondoFinanceService
{
    public function getCatalog(): array
    {
        $cached = cache()->remember('financial_catalog', 3600, function () {
            return $this->buildCatalogFromDb();
        });

        return $cached;
    }

    public function clearCatalogCache(): void
    {
        cache()->forget('financial_catalog');
    }

    private function buildCatalogFromDb(): array
    {
        $records = FinancialCatalog::all();

        $catalog = ['incomes' => [], 'expenses' => []];

        foreach ($records as $record) {
            $typeKey = $record->type === 'income' ? 'incomes' : 'expenses';
            $catalog[$typeKey][$record->category_key] = [
                'label' => $record->label,
                'subcategories' => $record->subcategories ?? [],
            ];
        }

        return $catalog;
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
        return CondoIncome::with(['property', 'user', 'tower'])
            ->where('condominium_id', $filters['condominium_id'])
            ->orderBy('date', 'desc')
            ->paginate(20);
    }

    public function getExpenses(array $filters)
    {
        return CondoExpense::with(['property', 'user', 'commonExpense', 'tower'])
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
