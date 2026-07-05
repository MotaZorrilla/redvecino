<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    public function index(Request $request)
    {
        $query = Property::with('condominium');

        if ($request->has('condominium_id')) {
            $query->where('condominium_id', $request->condominium_id);
        }

        return $query->paginate(20);
    }

    public function show(Request $request, $id)
    {
        $query = Property::with(['condominium', 'owners.user', 'residents.user']);

        if ($request->has('condominium_id')) {
            $query->where('condominium_id', $request->condominium_id);
        }

        return $query->findOrFail($id);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'condominium_id' => 'required|exists:condominiums,id',
            'type' => 'required|string|in:house,apartment,parking,storage,commercial',
            'number' => 'required|string',
            'block' => 'nullable|string',
            'floor' => 'nullable|integer',
            'area_sqm' => 'nullable|numeric',
            'status' => 'nullable|string|in:occupied,vacant,maintenance',
        ]);

        return Property::create($data);
    }

    public function update(Request $request, $id)
    {
        $property = Property::findOrFail($id);
        $data = $request->validate([
            'type' => 'sometimes|string|in:house,apartment,parking,storage,commercial',
            'number' => 'sometimes|string',
            'block' => 'nullable|string',
            'floor' => 'nullable|integer',
            'area_sqm' => 'nullable|numeric',
            'status' => 'nullable|string|in:occupied,vacant,maintenance',
        ]);

        $property->update($data);
        return $property;
    }

    public function destroy($id)
    {
        Property::findOrFail($id)->delete();
        return response()->noContent();
    }
}
