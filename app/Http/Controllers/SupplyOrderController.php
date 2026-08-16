<?php

namespace App\Http\Controllers;

use App\Http\Requests\SupplyOrderRequest;
use App\Models\CondoExpense;
use App\Models\SupplyOrder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupplyOrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $orders = SupplyOrder::with(['employeeProfile.user', 'condoExpense'])
            ->when($request->query('condominium_id'), fn ($q, $cid) => $q->where('condominium_id', $cid))
            ->when($request->query('status'), fn ($q, $s) => $q->where('status', $s))
            ->latest()
            ->get();

        return response()->json($orders);
    }

    public function store(SupplyOrderRequest $request): JsonResponse
    {
        $data = $request->validated();

        $order = SupplyOrder::create([
            'condominium_id' => $data['condominium_id'],
            'employee_profile_id' => $data['employee_profile_id'] ?? null,
            'description' => $data['description'],
            'quantity' => $data['quantity'],
            'unit' => $data['unit'] ?? 'unidad',
            'category' => $data['category'] ?? 'repuesto',
            'notes' => $data['notes'] ?? null,
            'status' => 'pendiente',
        ]);

        return response()->json($order->load('employeeProfile.user'), 201);
    }

    public function approve(int $id): JsonResponse
    {
        $order = SupplyOrder::findOrFail($id);
        $order->update(['status' => 'en_compra']);

        return response()->json($order);
    }

    public function bulkApprove(Request $request): JsonResponse
    {
        $data = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'exists:supply_orders,id',
        ]);

        SupplyOrder::whereIn('id', $data['ids'])->update(['status' => 'en_compra']);

        return response()->json(['message' => 'Pedidos aprobados correctamente para compra.']);
    }

    public function markPurchased(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'purchase_document' => 'required|string|max:255',
            'amount' => 'nullable|numeric|min:0',
        ]);

        $order = SupplyOrder::findOrFail($id);
        $expenseId = null;

        if (!empty($data['amount']) && $data['amount'] > 0) {
            $expense = CondoExpense::create([
                'condominium_id' => $order->condominium_id,
                'description' => "Compra de Insumo: {$order->description} (Doc: {$data['purchase_document']})",
                'amount' => $data['amount'],
                'date' => now()->toDateString(),
                'category' => 'mantencion',
                'subcategory' => 'insumos_varios',
            ]);
            $expenseId = $expense->id;
        }

        $order->update([
            'status' => 'comprado',
            'purchase_document' => $data['purchase_document'],
            'condo_expense_id' => $expenseId,
        ]);

        return response()->json($order);
    }

    public function markReceived(int $id): JsonResponse
    {
        $order = SupplyOrder::findOrFail($id);
        $order->update(['status' => 'recibido']);

        return response()->json($order);
    }
}