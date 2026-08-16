<?php

namespace App\Http\Controllers;

use App\Http\Requests\FacilityChecklistRequest;
use App\Models\FacilityChecklist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FacilityChecklistController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $checklists = FacilityChecklist::with(['booking', 'inspector', 'receiver'])
            ->when($request->query('condominium_id'), fn ($q, $cid) => $q->where('condominium_id', $cid))
            ->when($request->query('booking_id'), fn ($q, $bid) => $q->where('booking_id', $bid))
            ->when($request->query('type'), fn ($q, $t) => $q->where('type', $t))
            ->latest()
            ->get();

        return response()->json($checklists);
    }

    public function show(int $id): JsonResponse
    {
        $checklist = FacilityChecklist::with(['booking', 'inspector', 'receiver'])->findOrFail($id);
        return response()->json($checklist);
    }

    public function store(FacilityChecklistRequest $request): JsonResponse
    {
        $data = $request->validated();
        $photoPaths = [];

        $photos = $request->file('photos') ?? $request->photos ?? ($data['photos'] ?? []);
        if (is_array($photos)) {
            foreach ($photos as $photo) {
                if ($photo instanceof \Illuminate\Http\UploadedFile) {
                    $photoPaths[] = $photo->store('checklists', 'public');
                }
            }
        }

        $checklist = FacilityChecklist::create([
            'condominium_id' => $data['condominium_id'],
            'booking_id' => $data['booking_id'] ?? null,
            'facility_name' => $data['facility_name'],
            'type' => $data['type'],
            'inspected_by' => $request->user()?->id,
            'received_by' => $data['received_by'] ?? null,
            'status' => $data['status'] ?? 'conforme',
            'items_status' => $data['items_status'] ?? null,
            'evidence_photos' => !empty($photoPaths) ? $photoPaths : null,
            'deposit_action' => $data['deposit_action'] ?? 'liberar',
            'deposit_deduction_amount' => $data['deposit_deduction_amount'] ?? 0,
            'notes' => $data['notes'] ?? null,
        ]);

        return response()->json($checklist->load(['booking', 'inspector', 'receiver']), 201);
    }

    public function destroy(int $id): JsonResponse
    {
        $checklist = FacilityChecklist::findOrFail($id);

        if ($checklist->evidence_photos) {
            foreach ($checklist->evidence_photos as $photo) {
                if (Storage::disk('public')->exists($photo)) {
                    Storage::disk('public')->delete($photo);
                }
            }
        }

        $checklist->delete();

        return response()->json(['message' => 'Checklist eliminado correctamente.']);
    }
}
