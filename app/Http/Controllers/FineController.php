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
}
