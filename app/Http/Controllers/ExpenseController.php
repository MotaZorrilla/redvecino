<?php

namespace App\Http\Controllers;

use App\Models\CommonExpense;
use App\Models\ExpenseItem;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index()
    {
        return CommonExpense::with('condominium', 'items')->paginate(20);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'condominium_id' => 'required|exists:condominiums,id',
            'period' => 'required|string',
            'amount' => 'required|numeric',
            'description' => 'nullable|string',
            'due_date' => 'required|date',
            'items' => 'nullable|array',
            'items.*.category' => 'required_with:items|string',
            'items.*.description' => 'nullable|string',
            'items.*.amount' => 'required_with:items|numeric',
        ]);

        $expense = CommonExpense::create($data);

        if ($request->items) {
            foreach ($request->items as $item) {
                $expense->items()->create($item);
            }
        }

        return $expense->load('items');
    }
}
