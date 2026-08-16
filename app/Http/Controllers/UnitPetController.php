<?php

namespace App\Http\Controllers;

use App\Http\Requests\UnitPetRequest;
use App\Models\UnitPet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UnitPetController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $pets = UnitPet::with('property')
            ->when($request->query('property_id'), fn ($q, $pid) => $q->where('property_id', $pid))
            ->latest()
            ->get();

        return response()->json($pets);
    }

    public function show(int $id): JsonResponse
    {
        $pet = UnitPet::with('property')->findOrFail($id);
        return response()->json($pet);
    }

    public function store(UnitPetRequest $request): JsonResponse
    {
        $data = $request->validated();
        $recordPath = null;

        if ($request->hasFile('medical_record')) {
            $recordPath = $request->file('medical_record')->store('pets', 'public');
        }

        $pet = UnitPet::create([
            'property_id' => $data['property_id'],
            'name' => $data['name'],
            'species' => $data['species'],
            'breed' => $data['breed'] ?? null,
            'chip_number' => $data['chip_number'] ?? null,
            'medical_record_path' => $recordPath,
            'is_vaccinated' => $data['is_vaccinated'] ?? true,
            'last_vaccine_date' => $data['last_vaccine_date'] ?? null,
        ]);

        return response()->json($pet->load('property'), 201);
    }

    public function destroy(int $id): JsonResponse
    {
        $pet = UnitPet::findOrFail($id);

        if ($pet->medical_record_path && Storage::disk('public')->exists($pet->medical_record_path)) {
            Storage::disk('public')->delete($pet->medical_record_path);
        }

        $pet->delete();

        return response()->json(['message' => 'Mascota eliminada correctamente.']);
    }
}
