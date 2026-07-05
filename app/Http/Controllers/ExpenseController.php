<?php

namespace App\Http\Controllers;

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

    public function update(Request $request, $id)
    {
        $data = $request->validate([
            'condominium_id' => 'required|exists:condominiums,id',
            'period' => 'sometimes|string',
            'amount' => 'sometimes|numeric',
            'description' => 'nullable|string',
            'due_date' => 'sometimes|date',
            'status' => 'sometimes|string',
            'items' => 'nullable|array',
            'items.*.category' => 'required_with:items|string',
            'items.*.description' => 'nullable|string',
            'items.*.amount' => 'required_with:items|numeric',
        ]);

        $expense = CommonExpense::where('condominium_id', $data['condominium_id'])->findOrFail($id);
        $expense->update($data);

        if ($request->items) {
            $expense->items()->delete();
            foreach ($request->items as $item) {
                $expense->items()->create($item);
            }
        }

        return $expense->load('items');
    }

    public function destroy(Request $request, $id)
    {
        $request->validate(['condominium_id' => 'required|exists:condominiums,id']);
        $expense = CommonExpense::where('condominium_id', $request->condominium_id)->findOrFail($id);
        $expense->delete();

        return response()->json(['message' => 'Gasto común eliminado correctamente.']);
    }
}
