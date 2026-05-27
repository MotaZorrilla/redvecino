<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index()
    {
        return Payment::with(['user', 'property', 'commonExpense'])->paginate(20);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'property_id' => 'required|exists:properties,id',
            'common_expense_id' => 'required|exists:common_expenses,id',
            'amount' => 'required|numeric|min:1',
            'payment_date' => 'required|date',
            'payment_method' => 'required|string|in:cash,transfer,card,check',
            'reference' => 'nullable|string',
        ]);

        $user = auth()->user();
        if ($user && !$user->hasAnyPermission(['approve expenses', 'view logs'])) {
            if ($data['user_id'] != $user->id) {
                abort(403, 'No puedes registrar pagos en nombre de otro usuario.');
            }

            $isResident = \App\Models\ResidentProfile::where('user_id', $user->id)->where('property_id', $data['property_id'])->exists();
            $isOwner = \App\Models\OwnerProfile::where('user_id', $user->id)->where('property_id', $data['property_id'])->exists();

            if (!$isResident && !$isOwner) {
                abort(403, 'No tienes asociacion con esta propiedad para realizar pagos.');
            }
        }

        return Payment::create($data);
    }

    public function accountStatement($userId)
    {
        $user = User::findOrFail($userId);
        $payments = Payment::where('user_id', $userId)->get();
        $totalPaid = $payments->where('status', 'completed')->sum('amount');

        return [
            'user' => $user,
            'payments' => $payments,
            'total_paid' => $totalPaid,
        ];
    }

    public function reconcile($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->update(['status' => 'completed']);

        if ($payment->commonExpense) {
            $payment->commonExpense->update(['status' => 'paid']);
        }

        return $payment;
    }
}
