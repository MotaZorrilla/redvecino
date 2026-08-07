<?php

namespace App\Http\Controllers;

use App\Models\Condominium;
use Illuminate\Http\Request;

class CondominiumController extends Controller
{
    public function show($id)
    {
        return Condominium::with(['towers', 'properties'])->findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $condo = Condominium::findOrFail($id);

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'address' => 'sometimes|string|max:255',
            'city' => 'sometimes|string|max:255',
            'region' => 'sometimes|string|max:255',
            'postal_code' => 'sometimes|string|max:20',
            'status' => 'sometimes|string|max:50',
            'logo' => 'nullable|image|max:2048', // for file upload
            'due_day' => 'sometimes|integer|min:1|max:31',
            'late_interest_rate' => 'sometimes|numeric|min:0|max:100',
        ]);

        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('condominiums/logos', 'public');
            // Assuming there's a logo column in future, or we just save it somewhere. 
            // The DB might not have 'logo' column yet.
            // $condo->logo_path = $path;
        }

        // exclude logo from direct fill if it doesn't exist in DB
        unset($data['logo']);

        $condo->update($data);

        return response()->json(['message' => 'Condominium updated successfully.', 'condominium' => $condo]);
    }

    public function financeConfig(Request $request, $id)
    {
        $condo = Condominium::findOrFail($id);

        $data = $request->validate([
            'due_day' => 'required|integer|min:1|max:31',
            'late_interest_rate' => 'required|numeric|min:0|max:100',
        ]);

        $condo->update([
            'due_day' => (int) $data['due_day'],
            'late_interest_rate' => (float) $data['late_interest_rate'],
        ]);

        return response()->json([
            'message' => 'Configuración de mora y vencimiento actualizada.',
            'condominium' => $condo->only(['id', 'name', 'due_day', 'late_interest_rate']),
        ]);
    }
}
