<?php

namespace App\Http\Controllers;

use App\Models\Condominium;
use App\Models\CommonExpense;
use App\Models\Property;
use App\Services\CommonExpenseCalculator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommonExpenseController extends Controller
{
    protected $calculator;

    public function __construct(CommonExpenseCalculator $calculator)
    {
        $this->calculator = $calculator;
    }

    /**
     * Generate the common expense distribution for a given period.
     * This acts as a preview or orchestrator for the monthly bill generation.
     */
    public function generatePeriod(Request $request)
    {
        $data = $request->validate([
            'condominium_id' => 'required|exists:condominiums,id',
            'period' => 'required|string', // e.g. "2026-06"
        ]);

        $condominium = Condominium::findOrFail($data['condominium_id']);
        $properties = Property::where('condominium_id', $condominium->id)->get();

        $generatedBills = [];
        $totalCondoExpense = 0;

        foreach ($properties as $property) {
            $bill = $this->calculator->calculateForUnit($property, $data['period']);
            $generatedBills[] = [
                'property_id' => $property->id,
                'property_number' => $property->number,
                'details' => $bill,
                'total_to_pay' => $bill['total_a_pagar'] ?? 0
            ];
            $totalCondoExpense += ($bill['total_a_pagar'] ?? 0);
        }

        return response()->json([
            'condominium_id' => $condominium->id,
            'period' => $data['period'],
            'total_condo_expense' => $totalCondoExpense,
            'bills' => $generatedBills
        ]);
    }

    /**
     * Publish the period, officially saving the CommonExpense record if not already created.
     */
    public function publishPeriod(Request $request)
    {
        $data = $request->validate([
            'condominium_id' => 'required|exists:condominiums,id',
            'period' => 'required|string',
            'due_date' => 'required|date',
            'total_amount' => 'required|numeric'
        ]);

        $expense = CommonExpense::updateOrCreate(
            [
                'condominium_id' => $data['condominium_id'],
                'period' => $data['period']
            ],
            [
                'amount' => $data['total_amount'],
                'due_date' => $data['due_date'],
                'description' => 'Gasto Comun del periodo ' . $data['period'],
                'status' => 'published'
            ]
        );

        return response()->json(['message' => 'Period published successfully.', 'common_expense' => $expense]);
    }
}
