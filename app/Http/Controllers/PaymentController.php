<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaymentRequest;
use App\Models\Payment;
use App\Models\User;
use App\Models\ResidentProfile;
use App\Models\OwnerProfile;

class PaymentController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        if ($user && ($user->can('view financial reports') || $user->can('approve expenses') || $user->can('view logs'))) {
            return Payment::with(['user', 'property', 'commonExpense'])->paginate(20);
        }

        return Payment::where('user_id', $user->id)
            ->with(['user', 'property', 'commonExpense'])
            ->paginate(20);
    }

    public function store(PaymentRequest $request)
    {
        $data = $request->validated();

        $user = auth()->user();
        if ($user && !($user->can('approve expenses') || $user->can('view logs'))) {
            if ($data['user_id'] != $user->id) {
                abort(403, 'No puedes registrar pagos en nombre de otro usuario.');
            }

            $isResident = ResidentProfile::where('user_id', $user->id)->where('property_id', $data['property_id'])->exists();
            $isOwner = OwnerProfile::where('user_id', $user->id)->where('property_id', $data['property_id'])->exists();

            if (!$isResident && !$isOwner) {
                abort(403, 'No tienes asociacion con esta propiedad para realizar pagos.');
            }
        }

        return Payment::create($data);
    }

    public function accountStatement($userId)
    {
        $currentUser = auth()->user();
        if ($currentUser && $currentUser->id != $userId && !($currentUser->can('view financial reports') || $currentUser->can('manage users') || $currentUser->can('approve expenses'))) {
            abort(403, 'No tienes permiso para ver el estado de cuenta de otro usuario.');
        }

        $user = User::with(['roles', 'ownerProfile.property', 'residentProfile.property'])->findOrFail($userId);

        $propertyId = $user->ownerProfile?->property_id ?? $user->residentProfile?->property_id;

        $payments = Payment::where('user_id', $userId)
            ->with('commonExpense')
            ->orderBy('payment_date', 'desc')
            ->get();

        $fines = \App\Models\Fine::where('user_id', $userId)
            ->orderBy('issued_date', 'desc')
            ->get();

        $expenses = $propertyId ? \App\Models\CommonExpense::where('condominium_id', $user->ownerProfile?->property?->condominium_id ?? $user->residentProfile?->property?->condominium_id)->get() : [];

        return response()->json([
            'user' => $user,
            'property_id' => $propertyId,
            'payments' => $payments,
            'fines' => $fines,
            'expenses' => $expenses
        ]);
    }
}
