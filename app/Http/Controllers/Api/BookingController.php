<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\CommonExpense;
use App\Models\Payment;
use App\Models\Property;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    /**
     * Listar reservas del usuario autenticado o del condominio.
     */
    public function index(Request $request)
    {
        $user = auth()->user();

        if ($request->has('condominium_id')) {
            return response()->json(
                Booking::whereHas('property', fn($q) => $q->where('condominium_id', $request->condominium_id))
                    ->with('property')
                    ->latest()
                    ->get()
            );
        }

        return response()->json(
            Booking::where('user_id', $user->id)->with('property')->latest()->get()
        );
    }

    /**
     * Crear una nueva reserva de área común (Quincho, Piscina, Sala de Eventos, etc.)
     */
    public function store(Request $request)
    {
        $user = auth()->user();
        
        $validated = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'area_name' => 'required|string|max:255',
            'booking_date' => 'required|date|after_or_equal:today',
            'time_slot' => 'required|string|max:255',
            'amount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
        ]);

        $property = Property::findOrFail($validated['property_id']);
        
        // Regla de morosidad: Bloquear reserva si tiene 3 o más gastos no pagados
        $allExpenses = CommonExpense::where('condominium_id', $property->condominium_id)->get();
        $unpaidCount = 0;
        foreach ($allExpenses as $expense) {
            $hasPaid = Payment::where('property_id', $property->id)
                ->where('common_expense_id', $expense->id)
                ->where('status', 'completed')
                ->exists();
            if (!$hasPaid) {
                $unpaidCount++;
            }
        }

        if ($unpaidCount >= 3) {
            return response()->json([
                'message' => 'El uso de áreas comunes está bloqueado para esta propiedad debido a morosidad (3 o más meses de gastos comunes pendientes).'
            ], 403);
        }

        $booking = Booking::create([
            'user_id' => $user->id,
            'condominium_id' => $property->condominium_id,
            'property_id' => $validated['property_id'],
            'area_name' => $validated['area_name'],
            'booking_date' => $validated['booking_date'],
            'time_slot' => $validated['time_slot'],
            'amount' => $validated['amount'] ?? 0,
            'notes' => $validated['notes'] ?? null,
            'status' => 'approved',
        ]);

        return response()->json([
            'message' => 'Reserva creada exitosamente.',
            'booking' => $booking
        ], 201);
    }

    /**
     * Actualizar estado de una reserva (ej: Marcar como Realizado o Cancelar)
     */
    public function update(Request $request, Booking $booking)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:confirmed,Realizado,cancelled,pending',
            'amount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
        ]);

        $booking->update($validated);

        return response()->json([
            'message' => 'Reserva actualizada exitosamente.',
            'booking' => $booking
        ]);
    }
}
