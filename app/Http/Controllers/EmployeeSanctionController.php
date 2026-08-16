<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeSanctionRequest;
use App\Models\EmployeeSanction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EmployeeSanctionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $sanctions = EmployeeSanction::with(['employeeProfile.user', 'creator'])
            ->when($request->query('condominium_id'), fn ($q, $cid) => $q->where('condominium_id', $cid))
            ->when($request->query('employee_profile_id'), fn ($q, $eid) => $q->where('employee_profile_id', $eid))
            ->latest('date')
            ->latest('time')
            ->get();

        return response()->json($sanctions);
    }

    public function show(int $id): JsonResponse
    {
        $sanction = EmployeeSanction::with(['employeeProfile.user', 'creator'])->findOrFail($id);
        return response()->json($sanction);
    }

    public function store(EmployeeSanctionRequest $request): JsonResponse
    {
        $data = $request->validated();
        $documentPath = null;

        $allFiles = $request->allFiles();
        if (isset($allFiles['document']) && $allFiles['document'] instanceof \Illuminate\Http\UploadedFile) {
            $documentPath = $allFiles['document']->store('sanctions', 'public');
        } elseif ($request->hasFile('document')) {
            $documentPath = $request->file('document')->store('sanctions', 'public');
        } elseif (isset($data['document']) && $data['document'] instanceof \Illuminate\Http\UploadedFile) {
            $documentPath = $data['document']->store('sanctions', 'public');
        }

        $sanction = EmployeeSanction::create([
            'condominium_id' => $data['condominium_id'],
            'employee_profile_id' => $data['employee_profile_id'],
            'date' => $data['date'],
            'time' => $data['time'] ?? null,
            'reason' => $data['reason'],
            'description' => $data['description'],
            'document_path' => $documentPath,
            'created_by' => $request->user()?->id,
        ]);

        return response()->json($sanction->load(['employeeProfile.user', 'creator']), 201);
    }

    public function destroy(int $id): JsonResponse
    {
        $sanction = EmployeeSanction::findOrFail($id);

        if ($sanction->document_path && Storage::disk('public')->exists($sanction->document_path)) {
            Storage::disk('public')->delete($sanction->document_path);
        }

        $sanction->delete();

        return response()->json(['message' => 'Amonestación eliminada correctamente.']);
    }
}
