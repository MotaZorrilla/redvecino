<?php

namespace App\Http\Controllers;

use App\Http\Requests\ExpenseRequest;
use App\Models\CommonExpense;
use Illuminate\Http\Request;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $query = CommonExpense::with('condominium', 'items');

        if ($request->has('condominium_id')) {
            $query->where('condominium_id', $request->condominium_id);
        }

        return $query->paginate(20);
    }

    public function show(Request $request, $id)
    {
        $query = CommonExpense::with(['condominium', 'items']);

        if ($request->has('condominium_id')) {
            $query->where('condominium_id', $request->condominium_id);
        }

        return $query->findOrFail($id);
    }

    public function store(ExpenseRequest $request)
    {
        $data = $request->validated();

        $expense = CommonExpense::create($data);

        if ($request->items) {
            foreach ($request->items as $item) {
                $expense->items()->create($item);
            }
        }

        return $expense->load('items');
    }

    public function update(ExpenseRequest $request, $id)
    {
        $data = $request->validated();

        $expense = CommonExpense::findOrFail($id);
        $expense->update($data);

        if ($request->items) {
            $expense->items()->delete();
            foreach ($request->items as $item) {
                $expense->items()->create($item);
            }
        }

        return $expense->load('items');
    }

    public function destroy($id)
    {
        $expense = CommonExpense::findOrFail($id);
        $expense->items()->delete();
        $expense->delete();

        return response()->json(null, 204);
    }
}
