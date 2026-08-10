<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Condominium;
use App\Models\Property;
use App\Services\UnitCoefficientResolver;
use Illuminate\Http\Request;

final class AssemblyQuorumController extends Controller
{
    /**
     * Calcular quórum de asamblea.
     */
    public function calculate(Request $request)
    {
        $request->validate([
            'condominium_id' => 'required|exists:condominiums,id',
            'attendees' => 'required|array',
        ]);

        $condo = Condominium::findOrFail($request->condominium_id);
        $totalUnits = Property::where('condominium_id', $condo->id)->count();

        $attendingUnitsCount = count($request->attendees);
        $headcountQuorum = $totalUnits > 0 ? ($attendingUnitsCount / $totalUnits) * 100.0 : 0.0;

        $totalCoefficient = 0.0;
        foreach ($request->attendees as $propertyId) {
            $property = Property::find($propertyId);
            if ($property) {
                $coefficient = UnitCoefficientResolver::resolve($property);
                $totalCoefficient += $coefficient;
            }
        }

        return response()->json([
            'total_units' => $totalUnits,
            'attending_units' => $attendingUnitsCount,
            'headcount_quorum_percentage' => round($headcountQuorum, 2),
            'coefficient_quorum_percentage' => round($totalCoefficient * 100, 2),
            'has_quorum' => ($headcountQuorum >= 50.0 && ($totalCoefficient * 100) >= 50.0),
        ]);
    }
}
