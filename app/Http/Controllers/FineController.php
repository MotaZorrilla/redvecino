<?php

namespace App\Http\Controllers;

use App\Http\Requests\FineRequest;
use App\Models\Fine;

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

    public function store(FineRequest $request)
    {
        $data = $request->validated();

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

    public function update(FineRequest $request, $id)
    {
        $fine = Fine::findOrFail($id);
        $data = $request->validated();

        if ($request->hasFile('evidences')) {
            $evidencePaths = $fine->evidence_paths ?? [];
            foreach ($request->file('evidences') as $file) {
                $evidencePaths[] = $file->store('fines', 'public');
            }
            $data['evidence_paths'] = array_slice($evidencePaths, 0, 3);
        }

        $fine->update($data);

        return response()->json($fine->load(['user', 'property']));
    }

    public function destroy($id)
    {
        $fine = Fine::findOrFail($id);
        $fine->delete();

        return response()->json(null, 204);
    }
}
