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
        ]);

        return Fine::create($data);
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
