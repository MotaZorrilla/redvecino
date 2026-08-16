<?php

namespace App\Http\Controllers;

use App\Models\Fine;
use Illuminate\Http\Request;

class FineController extends Controller
{
    public function index()
    {
        return Fine::with(['user', 'property'])->paginate(20);
    }

    public function show($id)
    {
        return Fine::with(['user', 'property'])->findOrFail($id);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'property_id' => 'required|exists:properties,id',
            'reason' => 'required|string',
            'amount' => 'required|numeric',
            'issued_date' => 'required|date',
            'due_date' => 'required|date',
            'evidences' => 'nullable|array|max:3',
            'evidences.*' => 'file|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $evidencePaths = [];
        if ($request->hasFile('evidences')) {
            foreach ($request->file('evidences') as $file) {
                $evidencePaths[] = $file->store('fines', 'public');
            }
        }

        $fine = Fine::create([
            'user_id' => $data['user_id'],
            'property_id' => $data['property_id'],
            'reason' => $data['reason'],
            'amount' => $data['amount'],
            'issued_date' => $data['issued_date'],
            'due_date' => $data['due_date'],
            'status' => 'pending',
            'evidence_paths' => !empty($evidencePaths) ? $evidencePaths : null,
        ]);

        return response()->json($fine->load(['user', 'property']), 201);
    }

    public function update(Request $request, $id)
    {
        $fine = Fine::findOrFail($id);

        $data = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'property_id' => 'sometimes|exists:properties,id',
            'reason' => 'sometimes|string',
            'amount' => 'sometimes|numeric',
            'status' => 'sometimes|string',
            'issued_date' => 'sometimes|date',
            'due_date' => 'sometimes|date',
        ]);

        $fine->update($data);

        return $fine;
    }

    public function destroy($id)
    {
        $fine = Fine::findOrFail($id);
        $fine->delete();

        return response()->json(['message' => 'Multa eliminada correctamente.']);
    }
}
