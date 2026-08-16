<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class FacilityChecklistRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'condominium_id' => 'required|exists:condominiums,id',
            'booking_id' => 'nullable|exists:bookings,id',
            'facility_name' => 'required|string|max:100',
            'type' => 'required|string|in:check_in,check_out',
            'received_by' => 'nullable|exists:users,id',
            'status' => 'sometimes|string|in:conforme,con_observaciones,con_danos',
            'items_status' => 'nullable|array',
            'deposit_action' => 'sometimes|string|in:liberar,retener,cobrar_reparacion',
            'deposit_deduction_amount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
            'photos' => 'nullable|array|max:4',
            'photos.*' => 'file|mimes:jpg,jpeg,png,webp|max:5120',
        ];
    }
}
