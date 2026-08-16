<?php

namespace App\Http\Controllers;

use App\Http\Requests\PackageCustodyRequest;
use App\Models\PackageCustody;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PackageCustodyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $packages = PackageCustody::with(['property', 'condominium'])
            ->when($request->query('condominium_id'), fn ($q, $cid) => $q->where('condominium_id', $cid))
            ->when($request->query('property_id'), fn ($q, $pid) => $q->where('property_id', $pid))
            ->when($request->query('status'), fn ($q, $status) => $q->where('status', $status))
            ->latest()
            ->get();

        return response()->json($packages);
    }

    public function show(int $id): JsonResponse
    {
        $package = PackageCustody::with(['property', 'condominium'])->findOrFail($id);
        return response()->json($package);
    }

    public function store(PackageCustodyRequest $request): JsonResponse
    {
        $data = $request->validated();
        $photoPath = null;

        $allFiles = $request->allFiles();
        if (isset($allFiles['photo']) && $allFiles['photo'] instanceof \Illuminate\Http\UploadedFile) {
            $photoPath = $allFiles['photo']->store('packages', 'public');
        } elseif ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('packages', 'public');
        } elseif (isset($data['photo']) && $data['photo'] instanceof \Illuminate\Http\UploadedFile) {
            $photoPath = $data['photo']->store('packages', 'public');
        }

        $package = PackageCustody::create([
            'condominium_id' => $data['condominium_id'],
            'property_id' => $data['property_id'],
            'recipient_name' => $data['recipient_name'],
            'carrier' => $data['carrier'] ?? 'Repartidor Particular',
            'tracking_number' => $data['tracking_number'] ?? null,
            'photo_path' => $photoPath,
            'notes' => $data['notes'] ?? null,
            'status' => 'custody',
        ]);

        return response()->json($package->load(['property', 'condominium']), 201);
    }

    public function deliver(Request $request, int $id): JsonResponse
    {
        $package = PackageCustody::findOrFail($id);

        $data = $request->validate([
            'signature' => 'nullable|string',
        ]);

        $package->update([
            'status' => 'delivered',
            'signature' => $data['signature'] ?? null,
            'delivered_at' => now(),
        ]);

        return response()->json($package);
    }

    public function destroy(int $id): JsonResponse
    {
        $package = PackageCustody::findOrFail($id);

        if ($package->photo_path && Storage::disk('public')->exists($package->photo_path)) {
            Storage::disk('public')->delete($package->photo_path);
        }

        $package->delete();

        return response()->json(['message' => 'Registro de encomienda eliminado correctamente.']);
    }
}
