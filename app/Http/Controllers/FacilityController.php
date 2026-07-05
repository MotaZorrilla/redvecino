<?php

namespace App\Http\Controllers;

use App\Models\Facility;
use Illuminate\Http\Request;

class FacilityController extends Controller
{
    public function index(Request $request)
    {
        $request->validate(['condominium_id' => 'required|exists:condominiums,id']);

        return response()->json(Facility::where('condominium_id', $request->condominium_id)->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'condominium_id' => 'required|exists:condominiums,id',
            'name' => 'required|string|max:255',
            'type' => 'required|string|in:quincho,salon_eventos,cancha,piscina,gimnasio,otro',
            'capacity' => 'nullable|integer|min:0',
            'fee' => 'nullable|numeric|min:0',
        ]);

        $facility = Facility::create($validated);

        return response()->json($facility, 201);
    }

    public function show(Facility $facility)
    {
        return response()->json($facility);
    }

    public function update(Request $request, Facility $facility)
    {
        $validated = $request->validate([
            'condominium_id' => 'sometimes|exists:condominiums,id',
            'name' => 'sometimes|string|max:255',
            'type' => 'sometimes|string|in:quincho,salon_eventos,cancha,piscina,gimnasio,otro',
            'capacity' => 'nullable|integer|min:0',
            'fee' => 'nullable|numeric|min:0',
        ]);

        $facility->update($validated);

        return response()->json($facility);
    }

    public function destroy(Facility $facility)
    {
        $facility->delete();

        return response()->json(null, 204);
    }
}
