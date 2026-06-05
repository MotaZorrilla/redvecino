<?php

namespace App\Http\Controllers;

use App\Models\CondoIncome;
use App\Models\CondoExpense;
use App\Services\CondoFinanceService;
use Illuminate\Http\Request;

class CondoFinanceController extends Controller
{
    public function __construct(
        protected CondoFinanceService $service
    ) {}

    public function catalog()
    {
        return response()->json($this->service->getCatalog());
    }

    public function summary(Request $request)
    {
        $request->validate(['condominium_id' => 'required|exists:condominiums,id']);

        return response()->json($this->service->getSummary($request->condominium_id));
    }

    public function indexIncomes(Request $request)
    {
        $request->validate(['condominium_id' => 'required|exists:condominiums,id']);

        return $this->service->getIncomes($request->only('condominium_id'));
    }

    public function storeIncome(Request $request)
    {
        $catalog = $this->service->getCatalog()['incomes'];
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

        return $this->service->createIncome($data);
    }

    public function updateIncome(Request $request, $id)
    {
        $income = CondoIncome::findOrFail($id);

        $catalog = $this->service->getCatalog()['incomes'];
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

        return $this->service->updateIncome($income, $data);
    }

    public function destroyIncome($id)
    {
        $income = CondoIncome::findOrFail($id);
        $this->service->deleteIncome($income);

        return response()->json(['message' => 'Ingreso eliminado correctamente.']);
    }

    public function indexExpenses(Request $request)
    {
        $request->validate(['condominium_id' => 'required|exists:condominiums,id']);

        return $this->service->getExpenses($request->only('condominium_id'));
    }

    public function storeExpense(Request $request)
    {
        $catalog = $this->service->getCatalog()['expenses'];
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

        return $this->service->createExpense($data);
    }

    public function updateExpense(Request $request, $id)
    {
        $expense = CondoExpense::findOrFail($id);

        $catalog = $this->service->getCatalog()['expenses'];
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

        return $this->service->updateExpense($expense, $data);
    }

    public function destroyExpense($id)
    {
        $expense = CondoExpense::findOrFail($id);
        $this->service->deleteExpense($expense);

        return response()->json(['message' => 'Egreso eliminado correctamente.']);
    }
}
