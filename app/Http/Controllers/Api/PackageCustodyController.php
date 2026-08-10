<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PackageCustody;
use Illuminate\Http\Request;

final class PackageCustodyController extends Controller
{
    /**
     * Registrar encomienda en custodia.
     */
    public function store(Request $request)
    {
        $request->validate([
            'condominium_id' => 'required|exists:condominiums,id',
            'property_id' => 'required|exists:properties,id',
            'recipient_name' => 'required|string',
            'carrier' => 'nullable|string',
            'tracking_number' => 'nullable|string',
        ]);

        $custody = PackageCustody::create([
            'condominium_id' => $request->condominium_id,
            'property_id' => $request->property_id,
            'recipient_name' => $request->recipient_name,
            'carrier' => $request->carrier,
            'tracking_number' => $request->tracking_number,
            'status' => 'custody',
        ]);

        return response()->json($custody, 201);
    }

    /**
     * Entregar encomienda.
     */
    public function deliver(Request $request, $id)
    {
        $custody = PackageCustody::findOrFail($id);

        $request->validate([
            'signature' => 'required|string',
        ]);

        $custody->update([
            'status' => 'delivered',
            'signature' => $request->signature,
            'delivered_at' => now(),
        ]);

        return response()->json($custody, 200);
    }
}
