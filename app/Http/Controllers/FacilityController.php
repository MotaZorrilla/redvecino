<?php

namespace App\Http\Controllers;

use App\Http\Requests\FacilityRequest;
use App\Models\Facility;
use Illuminate\Http\Request;

class FacilityController extends Controller
{
    public function index(Request $request)
    {
        $request->validate(['condominium_id' => 'required|exists:condominiums,id']);

        return response()->json(Facility::where('condominium_id', $request->condominium_id)->get());
    }

    public function store(FacilityRequest $request)
    {
        $validated = $request->validated();
        $facility = Facility::create($validated);

        return response()->json($facility, 201);
    }

    public function show(Facility $facility)
    {
        return response()->json($facility);
    }

    public function update(FacilityRequest $request, Facility $facility)
    {
        $validated = $request->validated();
        $facility->update($validated);

        return response()->json($facility);
    }

    public function destroy(Facility $facility)
    {
        $facility->delete();

        return response()->json(null, 204);
    }
}
