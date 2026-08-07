<?php

namespace App\Http\Controllers;

use App\Models\Condominium;
use App\Models\CommonExpense;
use App\Models\CommonExpensePeriod;
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
            'total_amount' => 'required|numeric|min:0'
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

        // Unificación: materializar el mismo periodo en el modelo unificado y generar boletas.
        $periodRecord = CommonExpensePeriod::updateOrCreate(
            [
                'condominium_id' => $data['condominium_id'],
                'period' => $data['period']
            ],
            [
                'status' => 'issued',
                'total_expenses' => $data['total_amount'],
                'due_date' => $data['due_date'],
                'created_by' => auth()->id(),
            ]
        );

        $properties = Property::where('condominium_id', $data['condominium_id'])->get();
        $totalAreaSqm = floatval($properties->sum('area_sqm')) ?: 1.0;

        foreach ($properties as $property) {
            $areaSqm = floatval($property->area_sqm) ?: 70.0;
            $alicuotaPct = $property->coefficient !== null
                ? floatval($property->coefficient)
                : $areaSqm / $totalAreaSqm;

            $baseAmount = round($data['total_amount'] * $alicuotaPct, 2);

            \App\Models\CommonExpenseReceipt::updateOrCreate(
                [
                    'condominium_id' => $data['condominium_id'],
                    'period_id' => $periodRecord->id,
                    'property_id' => $property->id,
                ],
                [
                    'alicuota_pct' => $alicuotaPct,
                    'base_amount' => $baseAmount,
                    'reserve_fund_amount' => 0,
                    'individual_consumption' => 0,
                    'previous_balance' => 0,
                    'interest_amount' => 0,
                    'total_amount' => $baseAmount,
                    'status' => 'pending',
                    'issue_date' => now()->toDateString(),
                    'due_date' => $data['due_date'],
                ]
            );
        }

        return response()->json(['message' => 'Period published successfully.', 'common_expense' => $expense]);
    }
}
