<?php

namespace App\Http\Controllers;

use App\Models\SupplyOrder;
use Illuminate\Http\Request;

class SupplyOrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = SupplyOrder::with('employeeProfile')
            ->when($request->query('status'), fn ($q, $s) => $q->where('status', $s))
            ->latest()
            ->get();

        return response()->json($orders);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user || !$user->hasAnyRole(['Administrador', 'Colaborador'])) {
            abort(403, 'No autorizado para crear pedidos de insumos.');
        }

        $data = $request->validate([
            'condominium_id' => 'required|exists:condominiums,id',
            'employee_profile_id' => 'nullable|exists:employee_profiles,id',
            'description' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
            'unit' => 'sometimes|string|max:50',
        ]);

        $order = SupplyOrder::create([
            'condominium_id' => $data['condominium_id'],
            'employee_profile_id' => $data['employee_profile_id'] ?? null,
            'description' => $data['description'],
            'quantity' => $data['quantity'],
            'unit' => $data['unit'] ?? 'unidad',
            'status' => 'pendiente',
        ]);

        return response()->json($order, 201);
    }

    public function approve($id)
    {
        $order = SupplyOrder::findOrFail($id);
        $order->update(['status' => 'en_compra']);

        return response()->json($order);
    }

    public function markPurchased(Request $request, $id)
    {
        $data = $request->validate([
            'purchase_document' => 'required|string|max:255',
        ]);

        $order = SupplyOrder::findOrFail($id);
        $order->update([
            'status' => 'comprado',
            'purchase_document' => $data['purchase_document'],
        ]);

        return response()->json($order);
    }

    public function markReceived($id)
    {
        $order = SupplyOrder::findOrFail($id);
        $order->update(['status' => 'recibido']);

        return response()->json($order);
    }
}