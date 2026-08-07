<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Budget;
use App\Models\Condominium;
use Illuminate\Http\Request;

class BudgetController extends Controller
{
    /**
     * Create a budget draft for a condominium period (admin/TI).
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'condominium_id' => 'required|exists:condominiums,id',
            'period' => 'required|string|regex:/^\d{4}-\d{2}$/',
            'amount' => 'required|numeric|min:0.01',
        ]);

        $budget = Budget::updateOrCreate(
            [
                'condominium_id' => $data['condominium_id'],
                'period' => $data['period'],
            ],
            [
                'amount' => $data['amount'],
                'status' => 'draft',
                'approved_at' => null,
                'approved_by' => null,
            ]
        );

        return response()->json([
            'message' => "Presupuesto del período {$data['period']} creado como borrador.",
            'budget' => $budget,
        ], 201);
    }

    /**
     * Approve a budget (assembly / committee).
     */
    public function approve(Request $request, $id)
    {
        $budget = Budget::findOrFail($id);
        $budget->approve_by($request->user()?->id);

        return response()->json([
            'message' => "Presupuesto del período {$budget->period} aprobado.",
            'budget' => $budget->fresh(),
        ]);
    }
}